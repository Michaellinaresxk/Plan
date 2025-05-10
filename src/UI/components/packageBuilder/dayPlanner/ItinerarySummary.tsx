// src/components/dayplanner/ItinerarySummary.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, DollarSign, Edit2, Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DayPlan } from '@/types/dayPlanner';

interface ItinerarySummaryProps {
  days: DayPlan[];
  services: Service[];
  onEdit: () => void;
  onContinue: () => void;
}

const ItinerarySummary: React.FC<ItinerarySummaryProps> = ({
  days,
  onEdit,
  onContinue,
}) => {
  const { t } = useTranslation();

  const calculateTotalPrice = () => {
    return days.reduce((total, day) => {
      return (
        total +
        day.services.reduce((dayTotal, service) => {
          return dayTotal + service.price;
        }, 0)
      );
    }, 0);
  };

  const totalServices = days.reduce(
    (total, day) => total + day.services.length,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-4xl mx-auto'
    >
      <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold'>
            {t('dayplanner.itinerarySummary')}
          </h2>
          <button
            onClick={onEdit}
            className='flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200'
          >
            <Edit2 size={16} className='mr-2' />
            {t('common.edit')}
          </button>
        </div>

        {/* Overview Stats */}
        <div className='grid grid-cols-3 gap-4 mb-8'>
          <div className='bg-blue-50 p-4 rounded-lg'>
            <div className='flex items-center mb-2'>
              <Calendar size={20} className='text-blue-500 mr-2' />
              <span className='text-sm text-gray-600'>
                {t('dayplanner.totalDays')}
              </span>
            </div>
            <p className='text-2xl font-bold text-blue-700'>{days.length}</p>
          </div>

          <div className='bg-green-50 p-4 rounded-lg'>
            <div className='flex items-center mb-2'>
              <Check size={20} className='text-green-500 mr-2' />
              <span className='text-sm text-gray-600'>
                {t('dayplanner.totalServices')}
              </span>
            </div>
            <p className='text-2xl font-bold text-green-700'>{totalServices}</p>
          </div>

          <div className='bg-purple-50 p-4 rounded-lg'>
            <div className='flex items-center mb-2'>
              <DollarSign size={20} className='text-purple-500 mr-2' />
              <span className='text-sm text-gray-600'>
                {t('dayplanner.totalCost')}
              </span>
            </div>
            <p className='text-2xl font-bold text-purple-700'>
              ${calculateTotalPrice()}
            </p>
          </div>
        </div>

        {/* Day by Day Breakdown */}
        <div className='space-y-6'>
          {days.map((day, index) => (
            <div key={day.id} className='border rounded-lg p-4'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>
                  {t('dayplanner.dayTitle', { day: index + 1 })} -{' '}
                  {format(day.date, 'EEEE, d MMMM', { locale: es })}
                </h3>
                <span className='text-sm text-gray-500'>
                  {day.services.length}{' '}
                  {day.services.length === 1 ? 'servicio' : 'servicios'}
                </span>
              </div>

              {day.services.length === 0 ? (
                <p className='text-gray-500 italic'>
                  {t('dayplanner.noServicesThisDay')}
                </p>
              ) : (
                <div className='space-y-3'>
                  {day.services
                    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                    .map((service) => (
                      <div
                        key={service.serviceId}
                        className='flex items-center justify-between bg-gray-50 p-3 rounded'
                      >
                        <div className='flex items-center'>
                          <Clock size={16} className='text-gray-400 mr-2' />
                          <div>
                            <span className='font-medium'>
                              {service.timeSlot}
                            </span>
                            <span className='mx-2'>-</span>
                            <span className='font-medium'>
                              {service.serviceName}
                            </span>
                            {service.options?.mealType && (
                              <span className='text-sm text-gray-500 ml-2'>
                                ({service.options.mealType})
                              </span>
                            )}
                          </div>
                        </div>
                        <span className='text-blue-600 font-medium'>
                          ${service.price}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className='flex justify-between mt-8'>
          <button
            onClick={onEdit}
            className='px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200'
          >
            {t('dayplanner.modifyItinerary')}
          </button>

          <button
            onClick={onContinue}
            className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            {t('dayplanner.confirmAndContinue')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ItinerarySummary;
