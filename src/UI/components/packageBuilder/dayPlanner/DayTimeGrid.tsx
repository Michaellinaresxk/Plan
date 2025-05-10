// src/components/dayplanner/DayTimeGrid.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Clock } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { DayPlan, ServiceTimeSlot, TIME_SLOTS } from '@/types/dayPlanner';

interface DayTimeGridProps {
  selectedIds: Set<string>;
  currentDay: DayPlan;
  onSlotToggle: (timeSlot: string) => void;
  onServiceRemove: (serviceId: string) => void;
}

const DayTimeGrid: React.FC<DayTimeGridProps> = ({
  currentDay,
  onSlotToggle,
  onServiceRemove,
}) => {
  const { t } = useTranslation();

  // Get the service that starts at this time slot
  const getServiceAtTimeSlot = (
    timeSlot: string
  ): ServiceTimeSlot | undefined => {
    return currentDay.services.find((s) => s.timeSlot === timeSlot);
  };

  // Check if a time slot is occupied by any service
  const isTimeSlotOccupied = (timeSlot: string): boolean => {
    const slotIndex = TIME_SLOTS.indexOf(timeSlot);

    return currentDay.services.some((service) => {
      const serviceStart = TIME_SLOTS.indexOf(service.timeSlot);
      const serviceEnd = serviceStart + service.duration;
      return slotIndex >= serviceStart && slotIndex < serviceEnd;
    });
  };

  // Get the service that occupies this time slot (might not start at this slot)
  const getOccupyingService = (
    timeSlot: string
  ): ServiceTimeSlot | undefined => {
    const slotIndex = TIME_SLOTS.indexOf(timeSlot);

    return currentDay.services.find((service) => {
      const serviceStart = TIME_SLOTS.indexOf(service.timeSlot);
      const serviceEnd = serviceStart + service.duration;
      return slotIndex >= serviceStart && slotIndex < serviceEnd;
    });
  };

  const renderTimeSlot = (timeSlot: string, index: number) => {
    const isOccupied = isTimeSlotOccupied(timeSlot);
    const startingService = getServiceAtTimeSlot(timeSlot);
    const occupyingService = getOccupyingService(timeSlot);

    // Skip rendering if this slot is occupied by a service that starts earlier
    if (isOccupied && !startingService) {
      return null;
    }

    return (
      <motion.div
        key={timeSlot}
        className={`relative rounded-lg p-4 transition-all ${
          isOccupied
            ? 'bg-blue-50 border border-blue-200'
            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer'
        }`}
        style={
          startingService ? { gridRow: `span ${startingService.duration}` } : {}
        }
        whileHover={{ scale: isOccupied ? 1 : 1.02 }}
        whileTap={{ scale: isOccupied ? 1 : 0.98 }}
        onClick={() => !isOccupied && onSlotToggle(timeSlot)}
      >
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center'>
            <Clock size={16} className='text-gray-500 mr-2' />
            <span className='text-sm font-medium text-gray-700'>
              {timeSlot}
            </span>
          </div>

          {!isOccupied && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSlotToggle(timeSlot);
              }}
              className='p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
            >
              <Plus size={16} />
            </button>
          )}
        </div>

        {startingService && (
          <div className='mt-2'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <h4 className='font-medium text-gray-900'>
                  {startingService.serviceName}
                </h4>
                <p className='text-sm text-gray-600'>
                  {startingService.duration}{' '}
                  {startingService.duration === 1 ? 'hora' : 'horas'}
                </p>
                {startingService.options?.mealType && (
                  <p className='text-xs text-gray-500 mt-1'>
                    {t(`services.chef.${startingService.options.mealType}`, {
                      fallback: startingService.options.mealType,
                    })}
                  </p>
                )}
                <p className='text-sm font-medium text-blue-600 mt-1'>
                  ${startingService.price}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onServiceRemove(startingService.serviceId);
                }}
                className='p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors ml-2'
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}

        {!isOccupied && (
          <div className='text-center text-gray-400 mt-2'>
            <span className='text-xs'>{t('dayplanner.clickToAdd')}</span>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className='bg-white rounded-lg shadow-sm p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold'>{t('dayplanner.daySchedule')}</h3>
        {currentDay.services.length > 0 && (
          <span className='text-sm text-gray-500'>
            {currentDay.services.length}{' '}
            {currentDay.services.length === 1
              ? t('dayplanner.service')
              : t('dayplanner.services')}
          </span>
        )}
      </div>

      {currentDay.services.length === 0 ? (
        <div className='text-center py-12 text-gray-500'>
          <Clock size={48} className='mx-auto mb-4 text-gray-300' />
          <p className='text-lg font-medium mb-2'>
            {t('dayplanner.noServicesScheduled')}
          </p>
          <p className='text-sm'>{t('dayplanner.clickToAddDescription')}</p>
        </div>
      ) : (
        <div className='grid gap-2'>
          {TIME_SLOTS.map((timeSlot, index) => renderTimeSlot(timeSlot, index))}
        </div>
      )}
    </div>
  );
};

export default DayTimeGrid;
