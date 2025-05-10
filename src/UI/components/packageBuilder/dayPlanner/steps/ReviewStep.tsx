// UI/components/packageBuilder/dayPlanner/steps/ReviewStep.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Users } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Service } from '@/types/type';
import { DailyActivity } from '@/constants/dayplanner';

interface ReviewStepProps {
  dateRange: DateRange | undefined;
  dailyActivities: Record<string, DailyActivity[]>;
  daysArray: Date[];
  guests: number;
  numDays: number;
  getTotalActivitiesCount: () => number;
  calculateTotalPrice: () => number;
  getServiceById: (serviceId: string) => Service | undefined;
  onEdit: () => void;
  onComplete: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  dateRange,
  dailyActivities,
  daysArray,
  guests,
  numDays,
  getTotalActivitiesCount,
  calculateTotalPrice,
  getServiceById,
  onEdit,
  onComplete,
}) => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
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
        del {dateRange?.from && format(dateRange.from, 'PPP', { locale: es })}{' '}
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
          onClick={onEdit}
          className='px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center text-lg'
          whileHover={{ scale: 1.03, backgroundColor: '#F9FAFB' }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft className='mr-2 h-5 w-5' />
          Editar plan
        </motion.button>

        <motion.button
          onClick={onComplete}
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
};
