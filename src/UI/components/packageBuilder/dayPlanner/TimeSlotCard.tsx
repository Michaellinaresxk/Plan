import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2 } from 'lucide-react';
import { ServiceTimeSlot } from '@/types/dayPlanner';

interface TimeSlotCardProps {
  time: string;
  isOccupied: boolean;
  service?: ServiceTimeSlot;
  onRemove?: () => void;
  onAdd?: () => void;
}

const TimeSlotCard: React.FC<TimeSlotCardProps> = ({
  time,
  isOccupied,
  service,
  onRemove,
  onAdd,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative rounded-lg p-4 transition-all cursor-pointer
        ${
          isOccupied
            ? 'bg-blue-50 border border-blue-200'
            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
        }
      `}
      onClick={!isOccupied ? onAdd : undefined}
    >
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center'>
          <Clock size={16} className='text-gray-500 mr-2' />
          <span className='text-sm font-medium text-gray-700'>{time}</span>
        </div>
      </div>

      {service && (
        <div className='mt-2'>
          <div className='flex items-start justify-between'>
            <div>
              <h4 className='font-medium text-gray-900'>
                {service.serviceName}
              </h4>
              <p className='text-sm text-gray-600'>
                {service.duration} {service.duration === 1 ? 'hora' : 'horas'}
              </p>
              {service.options?.mealType && (
                <p className='text-xs text-gray-500 mt-1'>
                  {service.options.mealType}
                </p>
              )}
              <p className='text-sm font-medium text-blue-600 mt-1'>
                ${service.price}
              </p>
            </div>

            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className='p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200'
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {!isOccupied && (
        <div className='text-center text-gray-400'>
          <span className='text-sm'>Disponible</span>
        </div>
      )}
    </motion.div>
  );
};

export default TimeSlotCard;
