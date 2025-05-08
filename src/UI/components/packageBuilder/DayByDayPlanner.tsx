'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Check,
  Loader,
  ChevronLeft,
  ChevronRight,
  Users,
  Plus,
  Minus,
  DollarSign,
  X,
  Heart,
  Sun,
  Star,
} from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, differenceInDays, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  cardVariants,
  containerVariants,
  TIME_SLOTS,
  travelPurposes,
} from '@/constants/dayplanner';

// Define a daily activity structure that includes guest count
interface DailyActivity {
  serviceId: string;
  timeSlot: string;
  guestCount: number;
}

interface DayByDayPlannerProps {
  services: Service[];
  onComplete: () => void;
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const DayByDayPlanner: React.FC<DayByDayPlannerProps> = ({
  services,
  onComplete,
}) => {
  const {
    packageType,
    selectedServices,
    dates,
    setDates,
    addService,
    guests,
    setGuests,
  } = useBooking();
  const { t } = useTranslation();

  // Flow steps
  type PlannerStep = 'select-dates' | 'purpose' | 'day-planning' | 'review';
  const [currentStep, setCurrentStep] = useState<PlannerStep>('select-dates');

  // State for selected date range
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    dates
      ? { from: new Date(dates.startDate), to: new Date(dates.endDate) }
      : undefined
  );

  // State for travel purpose
  const [travelPurpose, setTravelPurpose] = useState<string>('');

  // State for daily activities - now with guest count
  const [dailyActivities, setDailyActivities] = useState<
    Record<string, DailyActivity[]>
  >({});

  // State for current day being planned
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);

  // State for loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State for service being configured
  const [configuringService, setConfiguringService] = useState<{
    serviceId: string;
    timeSlot: string;
    guestCount: number;
  } | null>(null);

  // Calculate number of days in selection
  const numDays =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;

  // Generate array of days between the selected range
  const daysArray = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];

    const days: Date[] = [];
    let currentDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);

    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [dateRange]);

  // Get the current day being planned
  const currentDay = daysArray[currentDayIndex] || null;

  // Format the current day as string for lookup
  const currentDayStr = currentDay ? format(currentDay, 'yyyy-MM-dd') : '';

  // Current day's activities
  const currentDayActivities = currentDayStr
    ? dailyActivities[currentDayStr] || []
    : [];

  // Initialize total number of guests from booking context
  useEffect(() => {
    if (guests === 0 && dateRange?.from && dateRange?.to) {
      // Default to 2 guests if not set
      setGuests(2);
    }
  }, [guests, dateRange, setGuests]);

  // Handle date range selection
  const handleRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      if (range?.from) {
        // If only from date is selected, auto-select to date as from + 3 days
        if (!range.to) {
          const defaultEndDate = addDays(range.from, 3);
          range.to = defaultEndDate;
        }

        setDateRange(range);

        if (range.from && range.to) {
          setDates({
            startDate: range.from,
            endDate: range.to,
          });
        }
      }
    },
    [setDates]
  );

  // Handle purpose selection and move to day planning
  const handleSelectPurpose = useCallback(
    (purpose: string) => {
      setTravelPurpose(purpose);
      setIsLoading(true);

      // Initialize daily activities structure
      const activities: Record<string, DailyActivity[]> = {};

      daysArray.forEach((day) => {
        activities[format(day, 'yyyy-MM-dd')] = [];
      });

      // Clear previous plan
      setDailyActivities(activities);

      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep('day-planning');
      }, 800);
    },
    [daysArray]
  );

  // Start configuring a service (select time + guests)
  const handleStartServiceConfig = useCallback(
    (serviceId: string, timeSlot: string) => {
      const defaultGuests = Math.min(guests || 2, 4); // Default to booking context guests, max 4

      setConfiguringService({
        serviceId,
        timeSlot,
        guestCount: defaultGuests,
      });
    },
    [guests]
  );

  // Cancel service configuration
  const handleCancelServiceConfig = useCallback(() => {
    setConfiguringService(null);
  }, []);

  // Confirm service configuration and add to daily plan
  const handleConfirmServiceConfig = useCallback(() => {
    if (!configuringService || !currentDayStr) return;

    setDailyActivities((prev) => {
      const dayActivities = prev[currentDayStr] || [];

      // Check if this service is already scheduled for this day
      const existingIndex = dayActivities.findIndex(
        (a) => a.serviceId === configuringService.serviceId
      );

      if (existingIndex >= 0) {
        // Update existing activity
        const updated = [...dayActivities];
        updated[existingIndex] = {
          ...configuringService,
        };
        return {
          ...prev,
          [currentDayStr]: updated,
        };
      } else {
        // Add new activity
        return {
          ...prev,
          [currentDayStr]: [...dayActivities, { ...configuringService }],
        };
      }
    });

    // Close configuration panel
    setConfiguringService(null);
  }, [configuringService, currentDayStr]);

  // Increment guest count
  const handleIncrementGuests = useCallback(() => {
    if (!configuringService) return;

    setConfiguringService((prev) => {
      if (!prev) return prev;

      // Max 10 guests
      const newCount = Math.min(prev.guestCount + 1, 10);
      return { ...prev, guestCount: newCount };
    });
  }, [configuringService]);

  // Decrement guest count
  const handleDecrementGuests = useCallback(() => {
    if (!configuringService) return;

    setConfiguringService((prev) => {
      if (!prev) return prev;

      // Min 1 guest
      const newCount = Math.max(prev.guestCount - 1, 1);
      return { ...prev, guestCount: newCount };
    });
  }, [configuringService]);

  // Remove activity from current day
  const handleRemoveActivity = useCallback(
    (serviceId: string) => {
      if (!currentDayStr) return;

      setDailyActivities((prev) => {
        const dayActivities = prev[currentDayStr] || [];

        return {
          ...prev,
          [currentDayStr]: dayActivities.filter(
            (a) => a.serviceId !== serviceId
          ),
        };
      });
    },
    [currentDayStr]
  );

  // Navigate to next day
  const handleNextDay = useCallback(() => {
    if (currentDayIndex < daysArray.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    } else {
      // If we're on the last day, go to review
      setCurrentStep('review');
    }
  }, [currentDayIndex, daysArray.length]);

  // Navigate to previous day
  const handlePrevDay = useCallback(() => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  }, [currentDayIndex]);

  // Handle completing the planning process
  const handleFinishPlanning = useCallback(() => {
    // Add the planned services to the booking context
    Object.values(dailyActivities).forEach((activities) => {
      activities.forEach((activity) => {
        const service = services.find((s) => s.id === activity.serviceId);
        if (service && !selectedServices.some((s) => s.id === service.id)) {
          addService(service);
        }
      });
    });

    // Save the daily plan to localStorage
    try {
      localStorage.setItem('dailyPlan', JSON.stringify(dailyActivities));
    } catch (error) {
      console.error('Error saving daily plan:', error);
    }

    // Complete the planning
    onComplete();
  }, [dailyActivities, services, selectedServices, addService, onComplete]);

  // Get service by ID
  const getServiceById = useCallback(
    (serviceId: string) => {
      return services.find((s) => s.id === serviceId);
    },
    [services]
  );

  // Check if a time slot is available (not already booked)
  const isTimeSlotAvailable = useCallback(
    (timeSlot: string) => {
      if (!currentDayStr) return true;

      const dayActivities = dailyActivities[currentDayStr] || [];
      return !dayActivities.some((a) => a.timeSlot === timeSlot);
    },
    [currentDayStr, dailyActivities]
  );

  // Get recommended services based on purpose
  const getRecommendedServices = useCallback(() => {
    if (!travelPurpose) return [];

    // Filter services based on purpose and package type
    const recommended = services.filter((service) => {
      if (!service.packageType.includes(packageType || 'standard')) {
        return false;
      }

      // Simple recommendation logic
      switch (travelPurpose) {
        case 'family':
          return [
            'catamaran-trips',
            'golf-cart-rentals',
            'bike-rentals',
            'babysitter',
            'adventure-excursions',
          ].includes(service.id);
        case 'couple':
          return [
            'private-chef',
            'luxe-masseuse',
            'private-yacht-experience',
            'luxe-culinary',
            'horseback-riding',
          ].includes(service.id);
        case 'friends':
          return [
            'catamaran-trips',
            'adventure-excursions',
            'karaoke',
            'live-music',
            'private-catamaran',
          ].includes(service.id);
        case 'relax':
          return [
            'yoga-standard',
            'luxe-masseuse',
            'luxe-yoga',
            'personal-training',
            'private-chef',
          ].includes(service.id);
        default:
          return true;
      }
    });

    return recommended;
  }, [travelPurpose, services, packageType]);

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/img/bike.jpg';
  };

  // Get count of planned activities
  const getTotalActivitiesCount = useCallback(() => {
    return Object.values(dailyActivities).reduce((total, activities) => {
      return total + activities.length;
    }, 0);
  }, [dailyActivities]);

  // Calculate total price of all activities
  const calculateTotalPrice = useCallback(() => {
    let total = 0;

    Object.values(dailyActivities).forEach((activities) => {
      activities.forEach((activity) => {
        const service = getServiceById(activity.serviceId);
        if (service) {
          total += service.price * activity.guestCount;
        }
      });
    });

    return total;
  }, [dailyActivities, getServiceById]);

  // Render date selection step
  const renderDateSelectionStep = () => (
    <motion.div
      className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'
      initial='hidden'
      animate='visible'
      variants={fadeIn}
    >
      <h2 className='text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
        {t('customPackagePage.cardGuideBtn2')}
      </h2>

      <div className='mb-8'>
        <p className='text-gray-600 mb-6 text-lg'>
          {t('dayByDayPlanner.title')}
        </p>

        <motion.div
          className='max-w-sm mx-auto border border-gray-200 rounded-2xl p-4 bg-white shadow-md'
          whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
          transition={{ duration: 0.3 }}
        >
          <DayPicker
            mode='range'
            selected={dateRange}
            onSelect={handleRangeSelect}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
            locale={es}
            className='m-auto'
            styles={{
              caption: { color: '#3B82F6' },
              day_selected: { backgroundColor: '#3B82F6' },
              day_today: { color: '#3B82F6' },
            }}
          />
        </motion.div>

        {dateRange?.from && dateRange?.to && (
          <motion.div
            className='mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-center shadow-sm border border-blue-100'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className='text-blue-800 font-semibold text-lg'>
              Tu estancia: {format(dateRange.from, 'PPP', { locale: es })} -{' '}
              {format(dateRange.to, 'PPP', { locale: es })}
            </p>
            <p className='text-blue-600 mt-2 text-lg font-medium'>
              ({numDays} {numDays === 1 ? 'día' : 'días'})
            </p>
          </motion.div>
        )}
      </div>

      <div className='flex justify-end'>
        <motion.button
          onClick={() => setCurrentStep('purpose')}
          disabled={!dateRange?.from || !dateRange?.to || !guests}
          className={`
            px-8 py-4 rounded-xl font-medium flex items-center text-lg
            ${
              !dateRange?.from || !dateRange?.to || !guests
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
            }
            transition-all duration-300
          `}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Continuar
          <ArrowRight className='ml-2 h-5 w-5' />
        </motion.button>
      </div>
    </motion.div>
  );

  // Render purpose selection step
  const renderPurposeStep = () => {
    const fadeIn = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      hover: { y: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.15)' },
      tap: { y: 0, scale: 0.98 },
    };

    const handleSelectPurpose = (purposeId) => {
      setTravelPurpose(purposeId);
    };

    return (
      <motion.div
        className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <h2 className='text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          ¿Cuál es el motivo principal de tu viaje?
        </h2>

        <p className='text-gray-600 mb-8 text-lg'>
          Selecciona una opción para ayudarnos a recomendarte las mejores
          actividades.
        </p>

        <motion.div
          className='grid grid-cols-2 gap-6 mb-10'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          {travelPurposes.map((purpose) => (
            <motion.div
              key={purpose.id}
              onClick={() => handleSelectPurpose(purpose.id)}
              className={`
                overflow-hidden rounded-xl cursor-pointer relative h-64
                ${
                  travelPurpose === purpose.id
                    ? 'ring-3 ring-blue-500 shadow-xl'
                    : 'shadow-md hover:shadow-xl'
                }
                transition-all duration-300
              `}
              variants={cardVariants}
              whileHover='hover'
              whileTap='tap'
            >
              {/* Card Image with Overlay */}
              <div className='absolute inset-0 w-full h-full'>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${purpose.color} opacity-70 z-10`}
                ></div>
                <img
                  src={purpose.image}
                  alt={purpose.name}
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Selection Indicator */}
              {travelPurpose === purpose.id && (
                <div className='absolute top-4 right-4 bg-white rounded-full w-6 h-6 flex items-center justify-center z-20'>
                  <div className='bg-blue-500 rounded-full w-4 h-4'></div>
                </div>
              )}

              {/* Content */}
              <div className='absolute bottom-0 left-0 right-0 p-6 z-20'>
                <h3 className='font-bold text-2xl text-white mb-1'>
                  {purpose.name}
                </h3>
                <p className='text-white text-opacity-90 text-lg'>
                  {purpose.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className='flex justify-between'>
          <motion.button
            onClick={() => setCurrentStep('select-dates')}
            className='px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center'
            whileHover={{ scale: 1.03, backgroundColor: '#F9FAFB' }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className='mr-2 h-5 w-5' />
            Atrás
          </motion.button>

          {isLoading ? (
            <div className='flex items-center text-blue-500 px-6 py-3'>
              <Loader className='animate-spin mr-3 h-5 w-5' />
              <span className='text-lg'>Preparando tu plan...</span>
            </div>
          ) : (
            <motion.button
              onClick={() => setCurrentStep('day-planning')}
              disabled={!travelPurpose}
              className={`
                px-8 py-4 rounded-xl font-medium flex items-center text-lg
                ${
                  !travelPurpose
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                }
                transition-all duration-300
              `}
              whileHover={{ scale: !travelPurpose ? 1 : 1.03 }}
              whileTap={{ scale: !travelPurpose ? 1 : 0.98 }}
            >
              Planificar días
              <ArrowRight className='ml-2 h-5 w-5' />
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };

  // Render service configuration modal
  const renderServiceConfig = () => {
    if (!configuringService) return null;

    const service = getServiceById(configuringService.serviceId);
    if (!service) return null;

    const totalPrice = service.price * configuringService.guestCount;

    return (
      <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-8'
        >
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Configurar actividad
            </h3>
            <motion.button
              onClick={handleCancelServiceConfig}
              className='p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              whileHover={{ scale: 1.1, backgroundColor: '#F3F4F6' }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          <div className='flex items-center mb-6'>
            <div className='h-16 w-16 relative overflow-hidden rounded-xl mr-4 shadow-md'>
              <Image
                src={service.img || `/images/services/${service.id}.jpg`}
                alt={service.name}
                fill
                className='object-cover'
                onError={handleImageError}
                unoptimized={service.img?.startsWith('http')}
              />
            </div>
            <div>
              <p className='font-semibold text-xl text-gray-900'>
                {service.name}
              </p>
              <div className='flex items-center text-gray-500 mt-1'>
                <Clock className='mr-2 h-4 w-4 text-blue-500' />
                <span>{configuringService.timeSlot}</span>
              </div>
            </div>
          </div>

          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-100'>
            <p className='font-semibold text-lg text-gray-800 mb-4'>
              ¿Cuántas personas participarán?
            </p>

            <div className='flex items-center'>
              <motion.button
                onClick={handleDecrementGuests}
                disabled={configuringService.guestCount <= 1}
                className={`
                  p-3 rounded-xl border ${
                    configuringService.guestCount <= 1
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-600 hover:bg-white hover:border-blue-300'
                  }
                  transition-colors
                `}
                whileHover={{
                  scale: configuringService.guestCount <= 1 ? 1 : 1.05,
                }}
                whileTap={{
                  scale: configuringService.guestCount <= 1 ? 1 : 0.95,
                }}
              >
                <Minus size={20} />
              </motion.button>

              <div className='flex-1 mx-6 text-center'>
                <span className='text-3xl font-bold text-blue-600'>
                  {configuringService.guestCount}
                </span>
                <p className='text-sm text-gray-500 mt-1'>
                  {configuringService.guestCount === 1 ? 'persona' : 'personas'}
                </p>
              </div>

              <motion.button
                onClick={handleIncrementGuests}
                disabled={configuringService.guestCount >= 10}
                className={`
                  p-3 rounded-xl border ${
                    configuringService.guestCount >= 10
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-600 hover:bg-white hover:border-blue-300'
                  }
                  transition-colors
                `}
                whileHover={{
                  scale: configuringService.guestCount >= 10 ? 1 : 1.05,
                }}
                whileTap={{
                  scale: configuringService.guestCount >= 10 ? 1 : 0.95,
                }}
              >
                <Plus size={20} />
              </motion.button>
            </div>

            <div className='mt-6 pt-4 border-t border-blue-200 flex justify-between items-center'>
              <p className='font-medium text-gray-700'>Precio total:</p>
              <p className='text-2xl font-bold text-blue-600'>${totalPrice}</p>
            </div>

            <div className='mt-2 text-sm text-gray-500 flex items-center justify-end'>
              <DollarSign className='h-4 w-4 mr-1 text-gray-400' />$
              {service.price} x {configuringService.guestCount} personas
            </div>
          </div>

          <div className='flex gap-4'>
            <motion.button
              onClick={handleCancelServiceConfig}
              className='flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium'
              whileHover={{ scale: 1.02, backgroundColor: '#F9FAFB' }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>

            <motion.button
              onClick={handleConfirmServiceConfig}
              className='flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Confirmar
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  };

  // Render day planning step
  const renderDayPlanningStep = () => {
    if (!currentDay) return null;

    const recommendedServices = getRecommendedServices();

    // Format date for display
    const dayFormatted = format(currentDay, 'EEEE, d MMMM', { locale: es });
    const dayNumber = currentDayIndex + 1;

    return (
      <motion.div
        className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        {/* Day header and navigation */}
        <div className='flex justify-between items-center mb-8'>
          <motion.button
            onClick={handlePrevDay}
            disabled={currentDayIndex === 0}
            className={`p-3 rounded-full ${
              currentDayIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            } transition-colors`}
            whileHover={{ scale: currentDayIndex === 0 ? 1 : 1.1 }}
            whileTap={{ scale: currentDayIndex === 0 ? 1 : 0.9 }}
          >
            <ChevronLeft className='h-6 w-6' />
          </motion.button>

          <div className='text-center'>
            <h2 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-1'>
              Día {dayNumber}
            </h2>
            <p className='text-gray-600 capitalize text-lg'>{dayFormatted}</p>
          </div>

          <motion.button
            onClick={handleNextDay}
            className='p-3 rounded-full text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className='h-6 w-6' />
          </motion.button>
        </div>

        {/* Day progress indicator */}
        <div className='w-full h-2 bg-gray-100 rounded-full mb-8'>
          <motion.div
            className='h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full'
            style={{
              width: `${((currentDayIndex + 1) / daysArray.length) * 100}%`,
            }}
            initial={{ width: 0 }}
            animate={{
              width: `${((currentDayIndex + 1) / daysArray.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Current day's planned activities */}
        <div className='mb-8'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
            <Calendar className='mr-2 h-5 w-5 text-blue-500' />
            Actividades planificadas
          </h3>

          <motion.div
            className='space-y-3'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {currentDayActivities.length > 0 ? (
              currentDayActivities.map((activity, index) => {
                const service = getServiceById(activity.serviceId);
                if (!service) return null;

                const activityPrice = service.price * activity.guestCount;

                return (
                  <motion.div
                    key={`${activity.serviceId}-${index}`}
                    className='flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow'
                    variants={cardVariants}
                  >
                    <div className='flex-shrink-0 h-14 w-14 relative overflow-hidden rounded-xl mr-4 shadow-md'>
                      <Image
                        src={
                          service.img || `/images/services/${service.id}.jpg`
                        }
                        alt={service.name}
                        fill
                        className='object-cover'
                        onError={handleImageError}
                        unoptimized={service.img?.startsWith('http')}
                      />
                    </div>
                    <div className='flex-grow'>
                      <p className='font-semibold text-lg text-gray-900'>
                        {service.name}
                      </p>
                      <div className='flex items-center text-gray-500 mt-1'>
                        <Clock className='mr-1 h-4 w-4 text-blue-400' />
                        {activity.timeSlot}
                        <span className='mx-2 text-blue-300'>•</span>
                        <Users className='mr-1 h-4 w-4 text-blue-400' />
                        {activity.guestCount}{' '}
                        {activity.guestCount === 1 ? 'persona' : 'personas'}
                      </div>
                    </div>
                    <div className='text-right mr-3'>
                      <p className='font-bold text-xl text-blue-600'>
                        ${activityPrice}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => handleRemoveActivity(activity.serviceId)}
                      className='ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors'
                      aria-label='Remove activity'
                      whileHover={{ scale: 1.1, backgroundColor: '#FEF2F2' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className='h-5 w-5' />
                    </motion.button>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                className='text-center py-12 bg-gray-50 rounded-xl border border-gray-200'
                variants={fadeIn}
              >
                <p className='text-gray-500 text-lg mb-2'>
                  No hay actividades planificadas para este día.
                </p>
                <p className='text-gray-400'>
                  Selecciona actividades de la lista de recomendaciones.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Activity recommendations */}
        <div className='mb-8'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
            <Star className='mr-2 h-5 w-5 text-amber-500' />
            Actividades recomendadas
          </h3>

          <motion.div
            className='grid grid-cols-1 gap-5 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {recommendedServices.map((service) => {
              // Check if this service is already added to this day
              const isAdded = currentDayActivities.some(
                (a) => a.serviceId === service.id
              );

              return (
                <motion.div
                  key={service.id}
                  className={`
                  p-5 border rounded-xl transition-all
                  ${
                    isAdded
                      ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-lg'
                  }
                `}
                  variants={cardVariants}
                  whileHover='hover'
                >
                  <div className='flex items-start'>
                    <div className='flex-shrink-0 h-20 w-20 relative overflow-hidden rounded-xl mr-4 shadow-md'>
                      <Image
                        src={
                          service.img || `/images/services/${service.id}.jpg`
                        }
                        alt={service.name}
                        fill
                        className='object-cover'
                        onError={handleImageError}
                        unoptimized={service.img?.startsWith('http')}
                      />
                    </div>

                    <div className='flex-grow'>
                      <h4 className='font-semibold text-xl text-gray-900 mb-1'>
                        {service.name}
                      </h4>
                      <p className='text-gray-600 mb-3 line-clamp-2'>
                        {service.description}
                      </p>

                      <div className='flex flex-wrap gap-3 text-sm text-gray-500'>
                        <span className='flex items-center bg-gray-100 px-3 py-1 rounded-lg'>
                          <Clock className='mr-1 h-4 w-4 text-blue-500' />
                          {service.duration}{' '}
                          {service.duration === 1 ? 'hora' : 'horas'}
                        </span>
                        <span className='flex items-center bg-gray-100 px-3 py-1 rounded-lg'>
                          <DollarSign className='mr-1 h-4 w-4 text-green-500' />
                          ${service.price} por persona
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isAdded && (
                    <div className='mt-4 pt-3 border-t border-gray-200'>
                      <p className='text-sm font-medium text-gray-700 mb-3 flex items-center'>
                        <Sun className='mr-2 h-4 w-4 text-amber-500' />
                        Horarios disponibles:
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {TIME_SLOTS.filter(isTimeSlotAvailable).map(
                          (timeSlot) => (
                            <motion.button
                              key={timeSlot}
                              onClick={() =>
                                handleStartServiceConfig(service.id, timeSlot)
                              }
                              className='px-4 py-2 text-sm rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-colors'
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: '#EFF6FF',
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {timeSlot}
                            </motion.button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Navigation buttons */}
        <div className='flex justify-between'>
          <motion.button
            onClick={handlePrevDay}
            disabled={currentDayIndex === 0}
            className={`
              px-6 py-3 rounded-xl flex items-center text-lg
              ${
                currentDayIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }
              transition-colors
            `}
            whileHover={{ scale: currentDayIndex === 0 ? 1 : 1.03 }}
            whileTap={{ scale: currentDayIndex === 0 ? 1 : 0.97 }}
          >
            <ArrowLeft className='mr-2 h-5 w-5' />
            Día anterior
          </motion.button>

          <motion.button
            onClick={handleNextDay}
            className='px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-colors flex items-center text-lg'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {currentDayIndex < daysArray.length - 1
              ? 'Siguiente día'
              : 'Revisar plan'}
            <ArrowRight className='ml-2 h-5 w-5' />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Render final review step
  const renderReviewStep = () => (
    <motion.div
      className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'
      initial='hidden'
      animate='visible'
      variants={fadeIn}
    >
      <h2 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4'>
        Tu plan está listo
      </h2>

      <p className='text-gray-600 mb-8 text-lg'>
        Has planificado {getTotalActivitiesCount()} actividades para tu estancia
        del {dateRange?.from && format(dateRange.from, 'PPP', { locale: es })}
        al {dateRange?.to && format(dateRange.to, 'PPP', { locale: es })}.
      </p>

      {/* Summary card with total */}
      <motion.div
        className='mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-semibold text-xl text-blue-900'>
            Resumen de tu plan
          </h3>
          <div className='flex items-center text-blue-900 bg-white px-4 py-2 rounded-lg shadow-sm'>
            <Users className='h-5 w-5 mr-2 text-blue-500' />
            <span className='font-medium'>
              {guests} {guests === 1 ? 'persona' : 'personas'}
            </span>
          </div>
        </div>

        <div className='flex justify-between items-center py-3 border-b border-blue-200'>
          <span className='text-gray-700 text-lg'>Total de actividades</span>
          <span className='font-semibold text-lg'>
            {getTotalActivitiesCount()}
          </span>
        </div>

        <div className='flex justify-between items-center py-3 border-b border-blue-200'>
          <span className='text-gray-700 text-lg'>Días planificados</span>
          <span className='font-semibold text-lg'>{numDays}</span>
        </div>

        <div className='flex justify-between items-center pt-4 mt-2'>
          <span className='text-gray-900 text-xl font-semibold'>
            Precio total
          </span>
          <span className='text-blue-700 text-3xl font-bold'>
            ${calculateTotalPrice()}
          </span>
        </div>
      </motion.div>

      {/* Detailed day-by-day plan */}
      <motion.div
        className='mb-8 space-y-6'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {daysArray.map((day, index) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayActivities = dailyActivities[dateStr] || [];

          return (
            <motion.div
              key={dateStr}
              className='border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white'
              variants={cardVariants}
            >
              <h3 className='font-semibold text-xl text-gray-900 mb-4 flex items-center'>
                <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3'>
                  {index + 1}
                </div>
                {format(day, 'EEEE, d MMMM', { locale: es })}
              </h3>

              {dayActivities.length > 0 ? (
                <div className='space-y-3'>
                  {dayActivities
                    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                    .map((activity, i) => {
                      const service = getServiceById(activity.serviceId);
                      if (!service) return null;

                      // Calculate activity price
                      const activityPrice = service.price * activity.guestCount;

                      return (
                        <div
                          key={i}
                          className='flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors'
                        >
                          <div className='flex items-center'>
                            <div className='text-sm font-medium text-blue-500 bg-blue-50 rounded-lg py-1 px-3 w-24 text-center mr-3 shadow-sm'>
                              {activity.timeSlot}
                            </div>
                            <div>
                              <div className='font-medium text-gray-900'>
                                {service.name}
                              </div>
                              <div className='text-sm text-gray-500 flex items-center'>
                                <Users className='h-3 w-3 mr-1 text-gray-400' />
                                {activity.guestCount}{' '}
                                {activity.guestCount === 1
                                  ? 'persona'
                                  : 'personas'}
                              </div>
                            </div>
                          </div>
                          <div className='font-semibold text-lg text-blue-600'>
                            ${activityPrice}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className='text-gray-500 text-center py-4 bg-gray-50 rounded-lg italic'>
                  No hay actividades planificadas para este día.
                </p>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div className='flex justify-between'>
        <motion.button
          onClick={() => {
            setCurrentStep('day-planning');
            setCurrentDayIndex(0);
          }}
          className='px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center text-lg'
          whileHover={{ scale: 1.03, backgroundColor: '#F9FAFB' }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft className='mr-2 h-5 w-5' />
          Editar plan
        </motion.button>

        <motion.button
          onClick={handleFinishPlanning}
          className='px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all flex items-center text-lg font-medium'
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Completar planificación
          <Check className='ml-2 h-6 w-6' />
        </motion.button>
      </div>
    </motion.div>
  );

  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'select-dates':
        return renderDateSelectionStep();
      case 'purpose':
        return renderPurposeStep();
      case 'day-planning':
        return renderDayPlanningStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <div className='w-full py-8 px-4'>
      {/* Progress indicator */}
      <motion.div
        className='mb-10 max-w-3xl mx-auto'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='flex justify-between max-w-md mx-auto'>
          {[
            { key: 'select-dates', label: 'Fechas', icon: Calendar },
            { key: 'purpose', label: 'Propósito', icon: Heart },
            { key: 'day-planning', label: 'Plan Diario', icon: Sun },
            { key: 'review', label: 'Revisar', icon: Check },
          ].map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === step.key;
            const isCompleted =
              (step.key === 'select-dates' && currentStep !== 'select-dates') ||
              (step.key === 'purpose' &&
                ['day-planning', 'review'].includes(currentStep)) ||
              (step.key === 'day-planning' && currentStep === 'review');

            const StepIcon = step.icon;

            return (
              <div key={step.key} className='flex flex-col items-center'>
                <motion.div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md
                    ${
                      isCompleted
                        ? 'bg-gradient-to-r from-green-400 to-green-500'
                        : isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        : 'bg-gray-300'
                    }
                  `}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                  animate={{
                    scale: isActive ? [1, 1.1, 1] : 1,
                    transition: {
                      duration: 0.5,
                      repeat: isActive ? Infinity : 0,
                      repeatType: 'reverse',
                    },
                  }}
                >
                  {isCompleted ? <Check size={20} /> : <StepIcon size={20} />}
                </motion.div>
                <span
                  className={`text-sm mt-2 font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className='relative h-2 bg-gray-200 rounded-full max-w-md mx-auto mt-3'>
          <motion.div
            className='absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full'
            initial={{ width: '0%' }}
            animate={{
              width:
                currentStep === 'select-dates'
                  ? '25%'
                  : currentStep === 'purpose'
                  ? '50%'
                  : currentStep === 'day-planning'
                  ? '75%'
                  : '100%',
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className='max-w-3xl mx-auto'
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>

      {/* Service configuration modal */}
      <AnimatePresence>
        {configuringService && renderServiceConfig()}
      </AnimatePresence>
    </div>
  );
};

export default DayByDayPlanner;
