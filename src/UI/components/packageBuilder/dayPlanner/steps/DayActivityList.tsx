// UI/components/packageBuilder/dayPlanner/components/DayActivityList.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, Clock, Users, X } from 'lucide-react';
import { Service } from '@/types/type';
import { DailyActivity } from '@/constants/dayplanner';

interface DayActivityListProps {
  activities: DailyActivity[];
  getServiceById: (serviceId: string) => Service | undefined;
  onRemoveActivity: (serviceId: string) => void;
}

export const DayActivityList: React.FC<DayActivityListProps> = ({
  activities,
  getServiceById,
  onRemoveActivity,
}) => {
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/img/bike.jpg';
  };

  return (
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
        {activities.length > 0 ? (
          activities.map((activity, index) => {
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
                    src={service.img || `/images/services/${service.id}.jpg`}
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
                  onClick={() => onRemoveActivity(activity.serviceId)}
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
            variants={cardVariants}
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
  );
};
