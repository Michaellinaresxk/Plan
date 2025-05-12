// UI/components/packageBuilder/dayPlanner/steps/LuxuryReviewStep.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Users,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Service } from '@/types/type';
import { DailyActivity } from '@/constants/dayplanner';
import Image from 'next/image';

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
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const handleToggleDay = (index: number) => {
    if (expandedDay === index) {
      setExpandedDay(null);
    } else {
      setExpandedDay(index);
    }
  };

  // Animation variants
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

  const expandVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3, delay: 0.1 },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.2 },
        opacity: { duration: 0.1 },
      },
    },
  };

  const getActivityCountByDay = (dateStr: string) => {
    return dailyActivities[dateStr]?.length || 0;
  };

  const getPriceByDay = (dateStr: string) => {
    return (dailyActivities[dateStr] || []).reduce((total, activity) => {
      const service = getServiceById(activity.serviceId);
      return total + (service ? service.price * activity.guestCount : 0);
    }, 0);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/img/placeholder-service.jpg';
  };

  return (
    <motion.div
      className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'
      initial='hidden'
      animate='visible'
      variants={fadeIn}
    >
      {/* Header Section */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 -m-8 p-8 mb-8 text-white rounded-t-2xl'>
        <motion.h2
          className='text-3xl font-bold mb-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Tu plan está listo
        </motion.h2>

        <motion.p
          className='text-lg mb-6 opacity-90'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Has planificado {getTotalActivitiesCount()} actividades para tu
          estancia del{' '}
          {dateRange?.from && format(dateRange.from, 'PPP', { locale: es })} al{' '}
          {dateRange?.to && format(dateRange.to, 'PPP', { locale: es })}.
        </motion.p>
      </div>

      {/* Summary Card */}
      <motion.div
        className='mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
          <div className='flex-1'>
            <h3 className='font-semibold text-xl text-indigo-900 mb-4'>
              Resumen de tu plan
            </h3>

            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              <div className='bg-white p-4 rounded-lg shadow-sm'>
                <div className='flex items-center text-indigo-800 mb-2'>
                  <Calendar className='mr-2 h-5 w-5' />
                  <span className='font-medium'>Duración</span>
                </div>
                <p className='text-2xl font-bold text-indigo-900'>
                  {numDays} {numDays === 1 ? 'día' : 'días'}
                </p>
              </div>

              <div className='bg-white p-4 rounded-lg shadow-sm'>
                <div className='flex items-center text-indigo-800 mb-2'>
                  <Users className='mr-2 h-5 w-5' />
                  <span className='font-medium'>Viajeros</span>
                </div>
                <p className='text-2xl font-bold text-indigo-900'>{guests}</p>
              </div>

              <div className='bg-white p-4 rounded-lg shadow-sm'>
                <div className='flex items-center text-indigo-800 mb-2'>
                  <Check className='mr-2 h-5 w-5' />
                  <span className='font-medium'>Actividades</span>
                </div>
                <p className='text-2xl font-bold text-indigo-900'>
                  {getTotalActivitiesCount()}
                </p>
              </div>
            </div>
          </div>

          <div className='flex-shrink-0 flex flex-col items-center justify-center p-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg'>
            <p className='text-lg font-medium'>Precio total</p>
            <p className='text-4xl font-bold mt-1'>
              ${calculateTotalPrice().toFixed(2)}
            </p>
            <p className='text-sm opacity-90 mt-2'>
              Todos los impuestos incluidos
            </p>
          </div>
        </div>
      </motion.div>

      {/* Day by Day Details */}
      <motion.div
        className='mb-8 space-y-6'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <h3 className='font-semibold text-xl text-gray-900 mb-4 flex items-center'>
          <Calendar className='mr-2 h-5 w-5 text-blue-500' />
          Detalles día por día
        </h3>

        {daysArray.map((day, index) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayActivities = dailyActivities[dateStr] || [];
          const activityCount = getActivityCountByDay(dateStr);
          const dayPrice = getPriceByDay(dateStr);
          const isExpanded = expandedDay === index;

          return (
            <motion.div
              key={dateStr}
              className={`border rounded-xl overflow-hidden transition-shadow ${
                isExpanded
                  ? 'shadow-lg border-blue-200'
                  : 'shadow-sm border-gray-200 hover:shadow-md'
              }`}
              variants={cardVariants}
            >
              {/* Day Header */}
              <div
                className={`p-5 cursor-pointer ${
                  isExpanded
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200'
                    : 'bg-white'
                }`}
                onClick={() => handleToggleDay(index)}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isExpanded
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-600'
                      } font-bold mr-3`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h4 className='font-bold text-lg text-gray-900 capitalize'>
                        {format(day, 'EEEE', { locale: es })}
                      </h4>
                      <p className='text-sm text-gray-600'>
                        {format(day, 'd MMMM, yyyy', { locale: es })}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    {activityCount > 0 && (
                      <div className='hidden md:block'>
                        <div className='flex items-center text-gray-700'>
                          <Check className='mr-1 h-4 w-4 text-green-500' />
                          <span className='font-medium'>{activityCount}</span>
                          <span className='ml-1 text-gray-500'>
                            {activityCount === 1 ? 'actividad' : 'actividades'}
                          </span>
                        </div>
                        <div className='text-blue-600 font-semibold text-right'>
                          ${dayPrice}
                        </div>
                      </div>
                    )}

                    <button
                      className={`p-2 rounded-full ${
                        isExpanded
                          ? 'bg-white text-blue-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isExpanded ? (
                        <ChevronUp className='h-5 w-5' />
                      ) : (
                        <ChevronDown className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Activities */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    key={`day-details-${index}`}
                    variants={expandVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    className='overflow-hidden'
                  >
                    {dayActivities.length > 0 ? (
                      <div className='p-5'>
                        <div className='space-y-4'>
                          {dayActivities
                            .sort((a, b) =>
                              a.timeSlot.localeCompare(b.timeSlot)
                            )
                            .map((activity, i) => {
                              const service = getServiceById(
                                activity.serviceId
                              );
                              if (!service) return null;

                              const activityPrice =
                                service.price * activity.guestCount;

                              return (
                                <div
                                  key={i}
                                  className='flex flex-col md:flex-row md:items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow'
                                >
                                  <div className='flex-shrink-0 h-16 w-16 md:h-20 md:w-20 relative rounded-lg overflow-hidden mb-3 md:mb-0 md:mr-4'>
                                    <Image
                                      src={
                                        service.img ||
                                        `/images/services/${service.id}.jpg`
                                      }
                                      alt={service.name}
                                      fill
                                      className='object-cover'
                                      onError={handleImageError}
                                      unoptimized={service.img?.startsWith(
                                        'http'
                                      )}
                                    />
                                  </div>

                                  <div className='flex-grow'>
                                    <div className='flex items-start justify-between'>
                                      <div>
                                        <h5 className='font-semibold text-gray-900'>
                                          {service.name}
                                        </h5>
                                        <div className='flex items-center text-gray-500 mt-1 text-sm'>
                                          <Clock className='mr-1 h-4 w-4 text-blue-400' />
                                          {activity.timeSlot}
                                          <span className='mx-2'>•</span>
                                          <span className='text-blue-500 font-medium'>
                                            {service.duration}{' '}
                                            {service.duration === 1
                                              ? 'hora'
                                              : 'horas'}
                                          </span>
                                        </div>
                                      </div>

                                      <div className='md:flex items-center space-x-4'>
                                        <div className='flex items-center bg-blue-50 px-3 py-1 rounded-full'>
                                          <Users className='h-4 w-4 text-blue-500 mr-1' />
                                          <span className='text-sm font-medium text-blue-700'>
                                            {activity.guestCount}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <p className='text-gray-600 text-sm mt-2 line-clamp-2 md:pr-16'>
                                      {service.description}
                                    </p>
                                  </div>

                                  <div className='flex-shrink-0 mt-3 md:mt-0 md:ml-4 text-right'>
                                    <p className='font-bold text-xl text-blue-600'>
                                      ${activityPrice}
                                    </p>
                                    <p className='text-xs text-gray-500'>
                                      ${service.price} por persona
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                        </div>

                        <div className='mt-6 pt-4 border-t border-gray-200 flex justify-between items-center'>
                          <span className='text-gray-600 font-medium'>
                            Total del día
                          </span>
                          <span className='font-bold text-xl text-blue-700'>
                            ${dayPrice}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className='p-6 text-center bg-gray-50'>
                        <p className='text-gray-500'>
                          No hay actividades planificadas para este día.
                        </p>
                        <button
                          className='mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium'
                          onClick={onEdit}
                        >
                          Agregar actividades
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Action buttons */}
      <div className='flex flex-col md:flex-row md:justify-between gap-4'>
        <div className='flex gap-2'>
          <motion.button
            onClick={onEdit}
            className='px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center text-lg flex-1 md:flex-none justify-center'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft className='mr-2 h-5 w-5' />
            Editar plan
          </motion.button>

          <motion.button
            className='px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center text-lg justify-center'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download className='mr-2 h-5 w-5' />
            <span className='hidden md:inline'>Descargar</span>
          </motion.button>

          <motion.button
            className='px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center text-lg justify-center'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Share2 className='mr-2 h-5 w-5' />
            <span className='hidden md:inline'>Compartir</span>
          </motion.button>
        </div>

        <motion.button
          onClick={onComplete}
          className='px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all flex items-center text-lg font-medium justify-center'
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
