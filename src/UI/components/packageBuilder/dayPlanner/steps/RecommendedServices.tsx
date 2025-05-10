// UI/components/packageBuilder/dayPlanner/components/RecommendedServices.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Clock, DollarSign, Sun } from 'lucide-react';
import { Service } from '@/types/type';
import { DailyActivity } from '@/constants/dayplanner';

interface RecommendedServicesProps {
  services: Service[];
  currentDayActivities: DailyActivity[];
  timeSlots: string[];
  isTimeSlotAvailable: (timeSlot: string) => boolean;
  onServiceConfig: (serviceId: string, timeSlot: string) => void;
}

export const RecommendedServices: React.FC<RecommendedServicesProps> = ({
  services,
  currentDayActivities,
  timeSlots,
  isTimeSlotAvailable,
  onServiceConfig,
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
    hover: {
      scale: 1.03,
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/img/bike.jpg';
  };

  return (
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
        {services.map((service) => {
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
                    src={service.img || `/images/services/${service.id}.jpg`}
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
                      <DollarSign className='mr-1 h-4 w-4 text-green-500' />$
                      {service.price} por persona
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
                    {timeSlots.filter(isTimeSlotAvailable).map((timeSlot) => (
                      <motion.button
                        key={timeSlot}
                        onClick={() => onServiceConfig(service.id, timeSlot)}
                        className='px-4 py-2 text-sm rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-colors'
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: '#EFF6FF',
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {timeSlot}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {isAdded && (
                <div className='mt-4 pt-3 border-t border-blue-200'>
                  <p className='text-sm font-medium text-blue-600 flex items-center justify-center'>
                    ✓ Actividad agregada para este día
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
