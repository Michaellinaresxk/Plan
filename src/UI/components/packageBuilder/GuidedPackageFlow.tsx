'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  Check,
  Loader,
} from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, differenceInDays, addDays } from 'date-fns';
import Image from 'next/image';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';

// Travel purposes with associated services
const TRAVEL_PURPOSES = [
  {
    id: 'family',
    name: 'Family Vacation',
    icon: '👨‍👩‍👧‍👦',
    description: 'Activities for the whole family',
    recommendedServiceIds: [
      'golf-cart-rentals',
      'catamaran-trips',
      'bike-rentals',
      'babysitter',
    ],
  },
  {
    id: 'couple',
    name: 'Romantic Getaway',
    icon: '💑',
    description: 'Experiences for couples',
    recommendedServiceIds: [
      'private-chef',
      'luxe-masseuse',
      'private-yacht-experience',
      'luxe-culinary',
    ],
  },
  {
    id: 'friends',
    name: 'Friends Trip',
    icon: '👫',
    description: 'Fun with friends',
    recommendedServiceIds: [
      'catamaran-trips',
      'adventure-excursions',
      'karaoke',
      'live-music',
    ],
  },
  {
    id: 'relaxation',
    name: 'Relaxation',
    icon: '🧘',
    description: 'Wellness and tranquility',
    recommendedServiceIds: [
      'yoga-standard',
      'luxe-masseuse',
      'luxe-yoga',
      'personal-training',
    ],
  },
  {
    id: 'adventure',
    name: 'Adventure',
    icon: '🏄‍♂️',
    description: 'Exciting activities',
    recommendedServiceIds: [
      'adventure-excursions',
      'horseback-riding',
      'deep-sea-fishing',
      'catamaran-trips',
    ],
  },
];

interface SimplifiedGuidedFlowProps {
  services: Service[];
  onComplete: (selectedDays: any) => void;
}

export const GuideGuidedFlow: React.FC<SimplifiedGuidedFlowProps> = ({
  services,
  onComplete,
}) => {
  const {
    packageType,
    selectedServices,
    dates,
    setDates,
    addService,
    removeService,
  } = useBooking();
  const { t } = useTranslation();

  // Steps for the simplified flow
  type FlowStep = 'select-dates' | 'select-purpose' | 'daily-plan';
  const [currentStep, setCurrentStep] = useState<FlowStep>('select-dates');

  // State for selected date range
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    dates
      ? { from: new Date(dates.startDate), to: new Date(dates.endDate) }
      : undefined
  );

  // State for selected purpose
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);

  // State for recommended services
  const [recommendedServices, setRecommendedServices] = useState<Service[]>([]);

  // State for loading
  const [loading, setLoading] = useState<boolean>(false);

  // State for daily plan
  const [dailyPlan, setDailyPlan] = useState<Record<string, string[]>>({});

  // Calculate number of days in selection
  const numDays =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;

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

  // Continue to purpose selection
  const handleContinueToPurpose = useCallback(() => {
    if (dateRange?.from && dateRange?.to) {
      setCurrentStep('select-purpose');
    }
  }, [dateRange]);

  // Handle purpose selection
  const handleSelectPurpose = useCallback(
    (purposeId: string) => {
      setSelectedPurpose(purposeId);
      setLoading(true);

      // Find the purpose
      const purpose = TRAVEL_PURPOSES.find((p) => p.id === purposeId);

      // Find recommended services
      const recommended = services.filter(
        (service) =>
          purpose?.recommendedServiceIds.includes(service.id) &&
          service.packageType.includes(packageType || 'standard')
      );

      // Clear existing selections and add new recommendations
      selectedServices.forEach((service) => {
        removeService(service.id);
      });

      setTimeout(() => {
        // Add recommended services
        recommended.forEach((service) => {
          addService(service);
        });

        setRecommendedServices(recommended);

        // Initialize the daily plan for each day
        const newDailyPlan: Record<string, string[]> = {};

        if (dateRange?.from && dateRange?.to) {
          const days = differenceInDays(dateRange.to, dateRange.from) + 1;

          // Distribute services over the days
          for (let i = 0; i < days; i++) {
            const date = addDays(dateRange.from, i);
            const dateStr = format(date, 'yyyy-MM-dd');

            // Assign 1-2 services per day
            const dayServices = recommended
              .slice(
                i % recommended.length,
                (i % recommended.length) + Math.min(2, recommended.length)
              )
              .map((s) => s.id);

            newDailyPlan[dateStr] = dayServices;
          }
        }

        setDailyPlan(newDailyPlan);
        setLoading(false);
        setCurrentStep('daily-plan');
      }, 1000);
    },
    [
      packageType,
      services,
      selectedServices,
      removeService,
      addService,
      dateRange,
    ]
  );

  // Handle service toggle for a specific day
  const handleToggleServiceForDay = useCallback(
    (day: string, serviceId: string) => {
      setDailyPlan((prevPlan) => {
        const currentServices = prevPlan[day] || [];

        if (currentServices.includes(serviceId)) {
          return {
            ...prevPlan,
            [day]: currentServices.filter((id) => id !== serviceId),
          };
        } else {
          return {
            ...prevPlan,
            [day]: [...currentServices, serviceId],
          };
        }
      });
    },
    []
  );

  // Find service by ID
  const getServiceById = useCallback(
    (serviceId: string) => {
      return services.find((s) => s.id === serviceId);
    },
    [services]
  );

  // Complete the guided flow
  const handleFinish = useCallback(() => {
    onComplete(dailyPlan);
  }, [dailyPlan, onComplete]);

  // Go back to previous step
  const handleBack = useCallback(() => {
    if (currentStep === 'select-purpose') {
      setCurrentStep('select-dates');
    } else if (currentStep === 'daily-plan') {
      setCurrentStep('select-purpose');
    }
  }, [currentStep]);

  // Handle image errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/placeholder-service.jpg';
  };

  // Render select dates step
  const renderSelectDatesStep = () => (
    <div className='bg-white rounded-xl shadow-lg p-6 md:p-8'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>
        ¿Cuándo estarás en Punta Cana?
      </h2>

      <div className='mb-6'>
        <p className='text-gray-600 mb-4'>
          Selecciona las fechas de tu estancia para que podamos recomendarte
          actividades para cada día.
        </p>

        <div className='max-w-sm mx-auto border border-gray-200 rounded-lg overflow-hidden p-2'>
          <DayPicker
            mode='range'
            selected={dateRange}
            onSelect={handleRangeSelect}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
            className='rdp-custom'
            styles={{
              day_selected: { backgroundColor: '#3b82f6' },
            }}
          />
        </div>

        {dateRange?.from && dateRange?.to && (
          <div className='mt-6 p-4 bg-blue-50 rounded-lg text-center'>
            <p className='text-blue-800 font-medium'>
              Tu estancia: {format(dateRange.from, 'PPP')} -{' '}
              {format(dateRange.to, 'PPP')}
            </p>
            <p className='text-blue-600 mt-1'>
              ({numDays} {numDays === 1 ? 'día' : 'días'})
            </p>
          </div>
        )}
      </div>

      <div className='flex justify-end'>
        <button
          onClick={handleContinueToPurpose}
          disabled={!dateRange?.from || !dateRange?.to}
          className={`
            px-6 py-3 rounded-lg font-medium flex items-center
            ${
              !dateRange?.from || !dateRange?.to
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }
            transition-colors
          `}
        >
          Continuar
          <ArrowRight className='ml-2 h-5 w-5' />
        </button>
      </div>
    </div>
  );

  // Render select purpose step
  const renderSelectPurposeStep = () => (
    <div className='bg-white rounded-xl shadow-lg p-6 md:p-8'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>
        ¿Cuál es el motivo de tu viaje?
      </h2>

      <p className='text-gray-600 mb-6'>
        Selecciona el propósito principal de tu viaje y te recomendaremos las
        mejores actividades para cada día.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        {TRAVEL_PURPOSES.map((purpose) => (
          <button
            key={purpose.id}
            onClick={() => handleSelectPurpose(purpose.id)}
            className={`
              p-6 border rounded-lg flex flex-col items-center text-center transition-all
              ${
                selectedPurpose === purpose.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            <span className='text-4xl mb-3'>{purpose.icon}</span>
            <h3 className='text-lg font-semibold text-gray-900 mb-1'>
              {purpose.name}
            </h3>
            <p className='text-sm text-gray-500'>{purpose.description}</p>
          </button>
        ))}
      </div>

      <div className='flex justify-between'>
        <button
          onClick={handleBack}
          className='px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center'
        >
          <ArrowLeft className='mr-2 h-5 w-5' />
          Atrás
        </button>

        {loading && (
          <div className='flex items-center text-blue-600'>
            <Loader className='animate-spin mr-2 h-5 w-5' />
            Generando recomendaciones...
          </div>
        )}
      </div>
    </div>
  );

  // Render daily plan step
  const renderDailyPlanStep = () => {
    if (!dateRange?.from || !dateRange?.to) return null;

    // Generate array of days
    const daysArray: Date[] = [];
    let currentDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);

    while (currentDate <= endDate) {
      daysArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return (
      <div className='bg-white rounded-xl shadow-lg p-6 md:p-8'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          Tu plan diario personalizado
        </h2>

        <p className='text-gray-600 mb-6'>
          Hemos creado un plan personalizado basado en tus preferencias. Puedes
          ajustar las actividades para cada día si lo deseas.
        </p>

        <div className='space-y-8 mb-8'>
          {daysArray.map((day, index) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayServices = dailyPlan[dateStr] || [];
            const availableServices = recommendedServices.filter(
              (service) => !dayServices.includes(service.id)
            );

            return (
              <div
                key={dateStr}
                className='border border-gray-200 rounded-lg p-4'
              >
                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                  <Calendar className='mr-2 h-5 w-5 text-blue-500' />
                  Día {index + 1}:{' '}
                  {format(day, 'EEEE d MMMM', {
                    locale: require('date-fns/locale/es'),
                  })}
                </h3>

                {/* Selected services for this day */}
                {dayServices.length > 0 ? (
                  <div className='mb-4'>
                    <h4 className='text-sm font-medium text-gray-700 mb-2'>
                      Actividades seleccionadas:
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {dayServices.map((serviceId) => {
                        const service = getServiceById(serviceId);
                        if (!service) return null;

                        return (
                          <div
                            key={serviceId}
                            className='flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200'
                          >
                            <div className='h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0'>
                              <Image
                                src={
                                  service.img ||
                                  `/images/services/${service.id}.jpg`
                                }
                                alt={service.name}
                                width={40}
                                height={40}
                                className='object-cover'
                                onError={handleImageError}
                                unoptimized={service.img?.startsWith('http')}
                              />
                            </div>
                            <div className='flex-grow'>
                              <p className='font-medium text-gray-900'>
                                {service.name}
                              </p>
                              <p className='text-xs text-gray-500'>
                                {service.duration} hora(s) - ${service.price}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleToggleServiceForDay(dateStr, serviceId)
                              }
                              className='ml-2 p-1.5 text-blue-600 hover:bg-blue-100 rounded-full'
                            >
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-5 w-5'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className='text-gray-500 italic mb-4'>
                    No hay actividades seleccionadas para este día.
                  </p>
                )}

                {/* Add more services */}
                <div>
                  <h4 className='text-sm font-medium text-gray-700 mb-2'>
                    Añadir actividades:
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {availableServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() =>
                          handleToggleServiceForDay(dateStr, service.id)
                        }
                        className='flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-left'
                      >
                        <div className='h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0'>
                          <Image
                            src={
                              service.img ||
                              `/images/services/${service.id}.jpg`
                            }
                            alt={service.name}
                            width={40}
                            height={40}
                            className='object-cover'
                            onError={handleImageError}
                            unoptimized={service.img?.startsWith('http')}
                          />
                        </div>
                        <div>
                          <p className='font-medium text-gray-900'>
                            {service.name}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {service.duration} hora(s) - ${service.price}
                          </p>
                        </div>
                        <Sparkles className='ml-auto h-4 w-4 text-blue-500' />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className='flex justify-between'>
          <button
            onClick={handleBack}
            className='px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center'
          >
            <ArrowLeft className='mr-2 h-5 w-5' />
            Atrás
          </button>

          <button
            onClick={handleFinish}
            className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center'
          >
            Finalizar
            <Check className='ml-2 h-5 w-5' />
          </button>
        </div>
      </div>
    );
  };

  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'select-dates':
        return renderSelectDatesStep();
      case 'select-purpose':
        return renderSelectPurposeStep();
      case 'daily-plan':
        return renderDailyPlanStep();
      default:
        return null;
    }
  };

  // Main render
  return (
    <div className='w-full py-8'>
      {/* Progress indicator */}
      <div className='mb-8'>
        <div className='flex justify-between max-w-md mx-auto'>
          {['Fechas', 'Propósito', 'Plan Diario'].map((step, index) => {
            const stepNumber = index + 1;
            const isActive =
              (stepNumber === 1 && currentStep === 'select-dates') ||
              (stepNumber === 2 && currentStep === 'select-purpose') ||
              (stepNumber === 3 && currentStep === 'daily-plan');

            const isCompleted =
              (stepNumber === 1 && currentStep !== 'select-dates') ||
              (stepNumber === 2 && currentStep === 'daily-plan');

            return (
              <div key={step} className='flex flex-col items-center'>
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-white
                  ${
                    isCompleted
                      ? 'bg-green-500'
                      : isActive
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }
                `}
                >
                  {isCompleted ? <Check size={18} /> : stepNumber}
                </div>
                <span className='text-sm mt-2'>{step}</span>
              </div>
            );
          })}
        </div>
        <div className='relative h-1 bg-gray-200 max-w-md mx-auto mt-2'>
          <div
            className='absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500'
            style={{
              width:
                currentStep === 'select-dates'
                  ? '33%'
                  : currentStep === 'select-purpose'
                  ? '66%'
                  : '100%',
            }}
          />
        </div>
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GuideGuidedFlow;
