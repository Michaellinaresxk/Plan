// UI/components/packageBuilder/dayPlanner/components/LuxuryDayActivityList.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  Users,
  X,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
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
  const [expanded, setExpanded] = useState(true);
  const [detailView, setDetailView] = useState<string | null>(null);

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

  const detailVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/img/bike.jpg';
  };

  const toggleDetail = (serviceId: string) => {
    if (detailView === serviceId) {
      setDetailView(null);
    } else {
      setDetailView(serviceId);
    }
  };

  const totalActivities = activities.length;
  const totalPrice = activities.reduce((total, activity) => {
    const service = getServiceById(activity.serviceId);
    return total + (service ? service.price * activity.guestCount : 0);
  }, 0);

  return (
    <div className='mb-8'>
      <motion.div
        className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-hidden'
        initial={{ height: 'auto' }}
        animate={{ height: expanded ? 'auto' : '100px' }}
        transition={{ duration: 0.3 }}
      >
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center'>
            <Calendar className='mr-3 h-6 w-6 text-blue-500' />
            <h3 className='text-xl font-bold text-gray-800'>Tu Itinerario</h3>
          </div>

          <div className='flex items-center space-x-2'>
            {totalActivities > 0 && (
              <div className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center'>
                <span>{totalActivities}</span>
                <span className='ml-1'>
                  {totalActivities === 1 ? 'actividad' : 'actividades'}
                </span>
              </div>
            )}

            <motion.button
              onClick={() => setExpanded(!expanded)}
              className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {expanded ? (
                <ChevronUp className='h-5 w-5' />
              ) : (
                <ChevronDown className='h-5 w-5' />
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
              className='space-y-4'
            >
              {activities.length > 0 ? (
                <>
                  {activities.map((activity, index) => {
                    const service = getServiceById(activity.serviceId);
                    if (!service) return null;

                    const activityPrice = service.price * activity.guestCount;
                    const isExpanded = detailView === activity.serviceId;

                    return (
                      <motion.div
                        key={`${activity.serviceId}-${index}`}
                        className='rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow'
                        variants={cardVariants}
                      >
                        {/* Main activity card */}
                        <div
                          className='p-4 bg-white cursor-pointer'
                          onClick={() => toggleDetail(activity.serviceId)}
                        >
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 h-16 w-16 relative overflow-hidden rounded-xl mr-4 shadow-md'>
                              <Image
                                src={
                                  service.img ||
                                  `/images/services/${service.id}.jpg`
                                }
                                alt={service.name}
                                fill
                                className='object-cover'
                                onError={handleImageError}
                                unoptimized={service.img?.startsWith('http')}
                              />
                            </div>

                            <div className='flex-grow'>
                              <p className='font-bold text-lg text-gray-900'>
                                {service.name}
                              </p>
                              <div className='flex items-center text-gray-500 mt-1'>
                                <Clock className='mr-1 h-4 w-4 text-blue-400' />
                                {activity.timeSlot}
                                <span className='mx-2 text-blue-300'>•</span>
                                <Users className='mr-1 h-4 w-4 text-blue-400' />
                                {activity.guestCount}{' '}
                                {activity.guestCount === 1
                                  ? 'persona'
                                  : 'personas'}
                              </div>
                            </div>

                            <div className='text-right flex items-center'>
                              <p className='font-bold text-xl text-blue-600 mr-3'>
                                ${activityPrice}
                              </p>

                              <div className='flex space-x-1'>
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDetail(activity.serviceId);
                                  }}
                                  className='p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors'
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {isExpanded ? (
                                    <ChevronUp className='h-5 w-5' />
                                  ) : (
                                    <ChevronDown className='h-5 w-5' />
                                  )}
                                </motion.button>

                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveActivity(activity.serviceId);
                                  }}
                                  className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors'
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X className='h-5 w-5' />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expandable detail section */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              variants={detailVariants}
                              initial='hidden'
                              animate='visible'
                              exit='hidden'
                              className='bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-t border-blue-100'
                            >
                              <p className='text-gray-700 mb-4'>
                                {service.description}
                              </p>

                              <div className='grid grid-cols-2 gap-4 text-sm'>
                                <div className='flex items-start'>
                                  <Clock className='h-5 w-5 text-blue-500 mr-2 mt-0.5' />
                                  <div>
                                    <p className='font-medium text-gray-800'>
                                      Duración
                                    </p>
                                    <p className='text-gray-600'>
                                      {service.duration}{' '}
                                      {service.duration === 1
                                        ? 'hora'
                                        : 'horas'}
                                    </p>
                                  </div>
                                </div>

                                <div className='flex items-start'>
                                  <Users className='h-5 w-5 text-blue-500 mr-2 mt-0.5' />
                                  <div>
                                    <p className='font-medium text-gray-800'>
                                      Participantes
                                    </p>
                                    <p className='text-gray-600'>
                                      {activity.guestCount}{' '}
                                      {activity.guestCount === 1
                                        ? 'persona'
                                        : 'personas'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className='mt-4 pt-4 border-t border-blue-200 flex justify-between items-center'>
                                <div className='flex items-center text-blue-600'>
                                  <Info className='h-4 w-4 mr-1' />
                                  <span className='text-sm'>
                                    Esta actividad está agendada para las{' '}
                                    {activity.timeSlot}
                                  </span>
                                </div>

                                <button
                                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Aquí podrías implementar una funcionalidad para editar la actividad
                                    // Por ejemplo, mostrar el modal de configuración de servicio
                                  }}
                                >
                                  Editar reserva
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}

                  {/* Summary section */}
                  <motion.div
                    className='mt-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white'
                    variants={cardVariants}
                  >
                    <div className='flex justify-between items-center'>
                      <div>
                        <p className='font-medium'>Total de actividades</p>
                        <p className='text-2xl font-bold mt-1'>
                          {totalActivities}
                        </p>
                      </div>

                      <div>
                        <p className='font-medium text-right'>Costo total</p>
                        <p className='text-2xl font-bold mt-1'>${totalPrice}</p>
                      </div>
                    </div>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  className='text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100'
                  variants={cardVariants}
                >
                  <Image
                    src='/img/empty-calendar.svg'
                    alt='Calendario vacío'
                    width={100}
                    height={100}
                    className='mx-auto mb-4'
                  />
                  <p className='text-gray-700 text-lg font-medium mb-2'>
                    No hay actividades planificadas para este día
                  </p>
                  <p className='text-gray-500 max-w-md mx-auto'>
                    Selecciona experiencias de la lista de recomendaciones para
                    crear tu itinerario perfecto.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
