// src/components/dayplanner/TimeSlotSelection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft } from 'lucide-react';
import { Service } from '@/types/type';
import { TIME_SLOTS } from '@/types/dayPlanner';
import { useTranslation } from '@/lib/i18n/client';

interface TimeSlotSelectionProps {
  selectedService: Service | null;
  selectedTimeSlots: string[];
  onTimeSlotSelect: (timeSlot: string) => void;
  onBack: () => void;
}

const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({
  selectedService,
  selectedTimeSlots,
  onTimeSlotSelect,
  onBack,
}) => {
  const { t } = useTranslation();

  if (!selectedService) return null;

  const isTimeSlotAvailable = (timeSlot: string) => {
    const slotIndex = TIME_SLOTS.indexOf(timeSlot);
    const duration = selectedService.duration;

    // Check if slot is already taken
    if (selectedTimeSlots.includes(timeSlot)) {
      return false;
    }

    // Check if service would overflow past available time slots
    if (slotIndex + duration > TIME_SLOTS.length) {
      return false;
    }

    // Check if any required slots are already occupied
    for (let i = 0; i < duration; i++) {
      if (selectedTimeSlots.includes(TIME_SLOTS[slotIndex + i])) {
        return false;
      }
    }

    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6'
    >
      <button
        onClick={onBack}
        className='flex items-center mb-6 text-gray-600 hover:text-gray-900'
      >
        <ArrowLeft size={20} className='mr-2' />
        {t('common.back')}
      </button>

      <h2 className='text-2xl font-bold mb-6'>
        {t('dayplanner.selectTimeForService', {
          service: selectedService.name,
        })}
      </h2>

      <div className='mb-6'>
        <p className='text-gray-600'>
          {t('dayplanner.serviceDuration', {
            duration: selectedService.duration,
          })}
        </p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {TIME_SLOTS.map((timeSlot) => {
          const available = isTimeSlotAvailable(timeSlot);

          return (
            <button
              key={timeSlot}
              onClick={() => available && onTimeSlotSelect(timeSlot)}
              disabled={!available}
              className={`
                p-4 rounded-lg border flex items-center justify-center
                ${
                  available
                    ? 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <Clock size={16} className='mr-2' />
              {timeSlot}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TimeSlotSelection;
