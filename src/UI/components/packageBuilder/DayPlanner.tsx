// DayPlanner.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/client';
import {
  MapPin,
  Users,
  Heart,
  ChevronRight,
  CalendarIcon,
  ChefHat,
  Home,
  Anchor,
  Fish,
  Music,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { Service, PackageType, BookingDate, TravelPurpose } from '@/types/type';
import { DayPlan, ServiceTimeSlot } from '@/types/dayPlanner';
import { getRecommendedServices } from '@/utils/recommendationEngine';
import ServiceManager from '@/constants/services/ServiceManager';

// Step components
const DayPlanner: React.FC = () => {
  const { t } = useTranslation();
  const { packageType, selectedServices } = useBooking();

  // Core state
  const [currentStep, setCurrentStep] = useState(1);
  const [currentDay, setCurrentDay] = useState(1);
  const [daysCount, setDaysCount] = useState(1);
  const [travelPurpose, setTravelPurpose] = useState<TravelPurpose>('couple');
  const [days, setDays] = useState<DayPlan[]>([
    {
      id: '1',
      date: new Date(),
      services: [],
    },
  ]);

  // UI state
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [recommendedServices, setRecommendedServices] = useState<Service[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Initialize recommended services when travel purpose changes
  useEffect(() => {
    if (travelPurpose) {
      const availableServices = ServiceManager.getByPackageType(
        packageType || 'standard'
      );
      const recommendations = getRecommendedServices(
        travelPurpose,
        availableServices
      );
      setRecommendedServices(recommendations);
    }
  }, [travelPurpose, packageType]);

  // Handlers
  const handleTimeSlotToggle = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setShowServiceModal(true);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setShowServiceModal(false);
    setShowOptionsModal(true);
  };

  const handleServiceOptionsConfirm = (options: any) => {
    if (!selectedService || !selectedTimeSlot) return;

    const newServiceSlot: ServiceTimeSlot = {
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      timeSlot: selectedTimeSlot,
      duration: selectedService.duration || 1,
      price: options.calculatedPrice || selectedService.price,
      options: options,
    };

    const updatedDays = [...days];
    updatedDays[currentDay - 1].services.push(newServiceSlot);
    setDays(updatedDays);

    // Reset states
    setShowOptionsModal(false);
    setSelectedService(null);
    setSelectedTimeSlot(null);
  };

  const handleServiceRemove = (serviceId: string) => {
    const updatedDays = [...days];
    updatedDays[currentDay - 1].services = updatedDays[
      currentDay - 1
    ].services.filter((s) => s.serviceId !== serviceId);
    setDays(updatedDays);
  };

  const handleAddDay = () => {
    setDaysCount((prev) => prev + 1);
    setDays((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,
        date: new Date(new Date().setDate(new Date().getDate() + prev.length)),
        services: [],
      },
    ]);
  };

  const handleRemoveDay = () => {
    if (daysCount > 1) {
      setDaysCount((prev) => prev - 1);
      setDays((prev) => prev.slice(0, -1));
      if (currentDay > daysCount - 1) {
        setCurrentDay(currentDay - 1);
      }
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-4xl mx-auto text-center'
          >
            <h1 className='text-4xl font-bold mb-4'>
              {t('dayplanner.welcome.title')}
            </h1>
            <p className='text-lg text-gray-600 mb-8'>
              {t('dayplanner.welcome.subtitle')}
            </p>
            <button
              onClick={() => setCurrentStep(2)}
              className='px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
            >
              {t('dayplanner.welcome.start')}
            </button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-4xl mx-auto'
          >
            <h2 className='text-3xl font-bold mb-8'>
              {t('dayplanner.purpose.selectPurpose')}
            </h2>
            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='grid md:grid-cols-2 gap-6'
            >
              {travelPurposes.map((purpose) => (
                <motion.div
                  key={purpose.id}
                  variants={cardVariants}
                  whileHover='hover'
                  whileTap='tap'
                  onClick={() => {
                    setTravelPurpose(purpose.id);
                    setCurrentStep(3);
                  }}
                  className={`cursor-pointer rounded-xl overflow-hidden shadow-lg ${
                    travelPurpose === purpose.id ? 'ring-4 ring-blue-500' : ''
                  }`}
                >
                  <div
                    className='h-48 bg-gradient-to-r p-6 flex items-center justify-center text-white'
                    style={{
                      background: `linear-gradient(135deg, ${
                        purpose.color.split(' ')[1]
                      } 0%, ${purpose.color.split(' ')[3]} 100%)`,
                    }}
                  >
                    <div className='text-center'>
                      <h3 className='text-2xl font-bold mb-2'>
                        {purpose.name}
                      </h3>
                      <p className='text-sm opacity-90'>{purpose.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-5xl mx-auto'
          >
            <h2 className='text-3xl font-bold mb-8'>
              {t('dayplanner.recommendations.title')}
            </h2>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
              {recommendedServices.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white rounded-lg p-4 cursor-pointer ${
                    selectedIds.has(service.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    const newSelectedIds = new Set(selectedIds);
                    if (newSelectedIds.has(service.id)) {
                      newSelectedIds.delete(service.id);
                    } else {
                      newSelectedIds.add(service.id);
                    }
                    setSelectedIds(newSelectedIds);
                  }}
                >
                  <img
                    src={service.img}
                    alt={service.name}
                    className='w-full h-32 object-cover rounded-lg mb-4'
                  />
                  <h3 className='font-semibold'>{service.name}</h3>
                  <p className='text-sm text-gray-600 mt-2'>
                    {service.description}
                  </p>
                  <div className='mt-4 text-blue-600 font-semibold'>
                    ${service.price}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className='flex justify-between'>
              <button
                onClick={() => setCurrentStep(2)}
                className='px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200'
              >
                {t('common.back')}
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
              >
                {t('common.continue')}
              </button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-6xl mx-auto'
          >
            <DayPlanHeader
              currentDay={currentDay}
              daysCount={daysCount}
              onPrevious={() => setCurrentDay((prev) => Math.max(1, prev - 1))}
              onNext={() =>
                setCurrentDay((prev) => Math.min(daysCount, prev + 1))
              }
              onAddDay={handleAddDay}
              onRemoveDay={handleRemoveDay}
            />

            <div className='grid lg:grid-cols-2 gap-6'>
              <DayTimeGrid
                selectedIds={selectedIds}
                currentDay={days[currentDay - 1]}
                onSlotToggle={handleTimeSlotToggle}
                onServiceRemove={handleServiceRemove}
              />

              <div className='bg-white rounded-lg shadow-sm p-6'>
                <h3 className='text-lg font-semibold mb-4'>
                  {t('dayplanner.recommendedServices')}
                </h3>
                <div className='space-y-4'>
                  {recommendedServices.map((service) => (
                    <div
                      key={service.id}
                      className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
                    >
                      <div className='flex items-center space-x-4'>
                        <img
                          src={service.img}
                          alt={service.name}
                          className='w-16 h-16 rounded-lg object-cover'
                        />
                        <div>
                          <h4 className='font-medium'>{service.name}</h4>
                          <p className='text-sm text-gray-600'>
                            {service.duration}h - ${service.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex justify-between mt-8'>
              <button
                onClick={() => setCurrentStep(3)}
                className='px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200'
              >
                {t('common.back')}
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
              >
                {t('dayplanner.reviewItinerary')}
              </button>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <ItinerarySummary
            days={days}
            services={selectedServices}
            onEdit={() => setCurrentStep(4)}
            onContinue={() => {
              console.log('Continue to payment');
              // Here you would navigate to payment or next step
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='container mx-auto px-4'>
        <ProgressIndicator currentStep={currentStep} totalSteps={5} />
        {renderStepContent()}
      </div>

      <ServiceSearchModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        availableServices={recommendedServices}
        onServiceSelect={handleServiceSelect}
      />

      <ServiceOptionsModal
        service={selectedService}
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onConfirm={handleServiceOptionsConfirm}
      />
    </div>
  );
};

export default DayPlanner;
