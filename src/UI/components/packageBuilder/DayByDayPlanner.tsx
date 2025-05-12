// UI/components/packageBuilder/dayPlanner/LuxuryDayByDayPlanner.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { useDayPlanner } from '@/hooks/useDayPlanner';
import { PlannerStep } from '@/constants/dayplanner';
import { useServiceConfig } from '@/hooks/useServiceConfig';
import { DateSelectionStep } from './dayPlanner/steps/DateSelectionStep';
import { PurposeStep } from './dayPlanner/steps/PurposeStep';
import { DayPlanningStep } from './dayPlanner/steps/DayPlanningStep';
import { ReviewStep } from './dayPlanner/steps/ReviewStep';
import { ServiceConfigModal } from './dayPlanner/ServiceConfigModal';

interface LuxuryDayByDayPlannerProps {
  services: Service[];
  onComplete: () => void;
}

// Custom ProgressIndicator component with luxury style
const LuxuryProgressIndicator = ({
  currentStep,
}: {
  currentStep: PlannerStep;
}) => {
  const steps = [
    {
      key: 'select-dates',
      label: 'Fechas',
      completed: currentStep !== 'select-dates',
    },
    {
      key: 'purpose',
      label: 'Propósito',
      completed: currentStep !== 'select-dates' && currentStep !== 'purpose',
    },
    {
      key: 'day-planning',
      label: 'Experiencias',
      completed: currentStep === 'review',
    },
    { key: 'review', label: 'Revisar', completed: false },
  ];

  const getProgressWidth = () => {
    switch (currentStep) {
      case 'select-dates':
        return '25%';
      case 'purpose':
        return '50%';
      case 'day-planning':
        return '75%';
      case 'review':
        return '100%';
      default:
        return '0%';
    }
  };

  return (
    <div className='mb-12 pt-4'>
      {/* Progress bar */}
      <div className='relative h-1 bg-gray-200 rounded-full max-w-3xl mx-auto mb-8'>
        <motion.div
          className='absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full'
          initial={{ width: '0%' }}
          animate={{ width: getProgressWidth() }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Step indicators */}
      <div className='flex justify-between max-w-3xl mx-auto px-4'>
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;

          return (
            <div key={step.key} className='flex flex-col items-center'>
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2 
                  ${
                    step.completed
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                      : isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }
                `}
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                  boxShadow: isActive
                    ? '0 4px 12px rgba(79, 70, 229, 0.3)'
                    : 'none',
                }}
                transition={{
                  duration: 0.5,
                  repeat: isActive ? Infinity : 0,
                  repeatType: 'reverse',
                }}
              >
                {index + 1}
              </motion.div>
              <span
                className={`text-sm font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DayByDayPlanner: React.FC<LuxuryDayByDayPlannerProps> = ({
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

  // Step management
  const [currentStep, setCurrentStep] = useState<PlannerStep>('select-dates');

  // Custom hooks for state management
  const {
    dateRange,
    setDateRange,
    travelPurpose,
    setTravelPurpose,
    dailyActivities,
    setDailyActivities,
    currentDayIndex,
    setCurrentDayIndex,
    daysArray,
    currentDay,
    currentDayStr,
    numDays,
    getTotalActivitiesCount,
    calculateTotalPrice,
  } = useDayPlanner(dates);

  const {
    configuringService,
    setConfiguringService,
    handleStartServiceConfig,
    handleCancelServiceConfig,
    handleConfirmServiceConfig,
    handleIncrementGuests,
    handleDecrementGuests,
  } = useServiceConfig(dailyActivities, setDailyActivities, currentDayStr);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className='w-full py-8 px-4 bg-gradient-to-br from-white to-blue-50 min-h-screen'>
      <LuxuryProgressIndicator currentStep={currentStep} />

      <AnimatePresence mode='wait'>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className='max-w-5xl mx-auto'
        >
          {currentStep === 'select-dates' && (
            <DateSelectionStep
              dateRange={dateRange}
              setDateRange={setDateRange}
              guests={guests}
              setGuests={setGuests}
              numDays={numDays}
              onNext={() => setCurrentStep('purpose')}
            />
          )}

          {currentStep === 'purpose' && (
            <PurposeStep
              travelPurpose={travelPurpose}
              setTravelPurpose={setTravelPurpose}
              daysArray={daysArray}
              setDailyActivities={setDailyActivities}
              onNext={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  setCurrentStep('day-planning');
                }, 800);
              }}
              onBack={() => setCurrentStep('select-dates')}
              isLoading={isLoading}
            />
          )}

          {currentStep === 'day-planning' && (
            <DayPlanningStep
              currentDay={currentDay}
              currentDayIndex={currentDayIndex}
              daysArray={daysArray}
              dailyActivities={dailyActivities}
              currentDayStr={currentDayStr}
              services={services}
              packageType={packageType}
              travelPurpose={travelPurpose}
              onServiceConfig={handleStartServiceConfig}
              onRemoveActivity={(serviceId) => {
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
              }}
              onNextDay={() => {
                if (currentDayIndex < daysArray.length - 1) {
                  setCurrentDayIndex(currentDayIndex + 1);
                } else {
                  setCurrentStep('review');
                }
              }}
              onPrevDay={() => {
                if (currentDayIndex > 0) {
                  setCurrentDayIndex(currentDayIndex - 1);
                }
              }}
              getServiceById={getServiceById}
            />
          )}

          {currentStep === 'review' && (
            <ReviewStep
              dateRange={dateRange}
              dailyActivities={dailyActivities}
              daysArray={daysArray}
              guests={guests}
              numDays={numDays}
              getTotalActivitiesCount={getTotalActivitiesCount}
              calculateTotalPrice={() => calculateTotalPrice(services)}
              getServiceById={getServiceById}
              onEdit={() => {
                setCurrentStep('day-planning');
                setCurrentDayIndex(0);
              }}
              onComplete={handleFinishPlanning}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {configuringService && (
          <ServiceConfigModal
            service={getServiceById(configuringService.serviceId)}
            configuration={configuringService}
            onConfirm={handleConfirmServiceConfig}
            onCancel={handleCancelServiceConfig}
            onIncrementGuests={handleIncrementGuests}
            onDecrementGuests={handleDecrementGuests}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DayByDayPlanner;
