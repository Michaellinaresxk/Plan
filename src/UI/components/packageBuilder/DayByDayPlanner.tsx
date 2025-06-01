// UI/components/packageBuilder/dayPlanner/DayByDayPlanner.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { useDayPlanner } from '@/hooks/useDayPlanner';
import { useServiceConfig } from '@/hooks/useServiceConfig';
import { DateSelectionStep } from './dayPlanner/steps/DateSelectionStep';
import { DayPlanningStep } from './dayPlanner/steps/DayPlanningStep';
import { ReviewStep } from './dayPlanner/steps/ReviewStep';
import { ServiceConfigModal } from './dayPlanner/ServiceConfigModal';

// Tipos simplificados
type SimplifiedPlannerStep = 'select-dates' | 'day-planning' | 'review';

interface SimplifiedDayByDayPlannerProps {
  services: Service[];
  onComplete: () => void;
}

// Indicador de progreso mejorado - SIN paso de propósito
const SimplifiedProgressIndicator = ({
  currentStep,
  currentDayIndex,
  totalDays,
}: {
  currentStep: SimplifiedPlannerStep;
  currentDayIndex: number;
  totalDays: number;
}) => {
  const steps = [
    { key: 'select-dates', label: 'Seleccionar Fechas' },
    {
      key: 'day-planning',
      label: `Planificar Días (${currentDayIndex + 1}/${totalDays})`,
    },
    { key: 'review', label: 'Revisar Plan' },
  ];

  const getProgressWidth = () => {
    switch (currentStep) {
      case 'select-dates':
        return '33%';
      case 'day-planning':
        // Progress dentro del día planning basado en el día actual
        const dayProgress =
          totalDays > 0 ? ((currentDayIndex + 1) / totalDays) * 34 : 0;
        return `${33 + dayProgress}%`;
      case 'review':
        return '100%';
      default:
        return '0%';
    }
  };

  return (
    <div className='mb-12 pt-4'>
      {/* Progress bar principal */}
      <div className='relative h-2 bg-gray-200 rounded-full max-w-4xl mx-auto mb-8'>
        <motion.div
          className='absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full'
          initial={{ width: '0%' }}
          animate={{ width: getProgressWidth() }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Step indicators */}
      <div className='flex justify-between max-w-4xl mx-auto px-4'>
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted =
            (currentStep === 'day-planning' && step.key === 'select-dates') ||
            (currentStep === 'review' &&
              (step.key === 'select-dates' || step.key === 'day-planning'));

          return (
            <div key={step.key} className='flex flex-col items-center'>
              <motion.div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2 font-semibold
                  ${
                    isCompleted
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
                className={`text-sm font-medium text-center ${
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

const DayByDayPlanner: React.FC<SimplifiedDayByDayPlannerProps> = ({
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

  // Step management simplificado
  const [currentStep, setCurrentStep] =
    useState<SimplifiedPlannerStep>('select-dates');

  // Custom hooks para manejo de estado
  const {
    dateRange,
    setDateRange,
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

  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Manejar la finalización del proceso de planificación
  const handleFinishPlanning = useCallback(() => {
    // Agregar los servicios planificados al contexto de reserva
    Object.values(dailyActivities).forEach((activities) => {
      activities.forEach((activity) => {
        const service = services.find((s) => s.id === activity.serviceId);
        if (service && !selectedServices.some((s) => s.id === service.id)) {
          addService(service);
        }
      });
    });

    // Guardar el plan diario en localStorage
    try {
      localStorage.setItem('dailyPlan', JSON.stringify(dailyActivities));
    } catch (error) {
      console.error('Error guardando plan diario:', error);
    }

    onComplete();
  }, [dailyActivities, services, selectedServices, addService, onComplete]);

  // Obtener servicio por ID
  const getServiceById = useCallback(
    (serviceId: string) => {
      return services.find((s) => s.id === serviceId);
    },
    [services]
  );

  // Manejar transición de fechas directamente a planificación
  const handleDateSelectionNext = () => {
    // Inicializar actividades diarias directamente
    const activities: Record<string, any[]> = {};
    daysArray.forEach((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      activities[dateStr] = [];
    });
    setDailyActivities(activities);

    // Ir directamente a planificación de días
    setCurrentStep('day-planning');
  };

  return (
    <div className='w-full py-8 px-4 bg-gradient-to-br from-white to-blue-50 min-h-screen'>
      <SimplifiedProgressIndicator
        currentStep={currentStep}
        currentDayIndex={currentDayIndex}
        totalDays={numDays}
      />

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
              onNext={handleDateSelectionNext}
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
              travelPurpose='general' // Valor por defecto ya que eliminamos el paso
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
