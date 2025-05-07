import React from 'react';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ServiceExtendedDetails } from '@/constants/services/serviceDetails';
import { BlockConfig } from '../ServiceContentOrchestrator';
import { Clock, Calendar } from 'lucide-react';

interface ScheduleBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
}

/**
 * Schedule Block Component
 *
 * Renders time slots, schedules, and availability for a service
 */
const ScheduleBlock: React.FC<ScheduleBlockProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  blockConfig,
  t,
}) => {
  // Get schedule from extended details
  const schedule = extendedDetails?.schedule || '';

  // Get time slots from extended details
  let timeSlots: string[] = [];
  if (extendedDetails?.timeSlots) {
    timeSlots = Array.isArray(extendedDetails.timeSlots)
      ? extendedDetails.timeSlots
      : extendedDetails.timeSlots.toString().split(',');
  }

  // Get availability from service data
  const availability = serviceData?.availability;

  // Get availability string from extended details
  const availabilityString = extendedDetails?.availability || '';

  // If no schedule information to display, don't render the block
  if (
    !schedule &&
    timeSlots.length === 0 &&
    !availability &&
    !availabilityString
  ) {
    return null;
  }

  // Weekdays for rendering availability
  const weekdays = [
    'services.days.sunday',
    'services.days.monday',
    'services.days.tuesday',
    'services.days.wednesday',
    'services.days.thursday',
    'services.days.friday',
    'services.days.saturday',
  ];

  return (
    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>
          {blockConfig.title || t('serviceDetails.schedule')}
        </h3>

        <div className='space-y-6'>
          {/* Schedule if available */}
          {schedule && (
            <div className='mb-6'>
              <h4 className='text-lg font-medium text-gray-800 mb-3 flex items-center'>
                <Clock className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                {t('serviceDetails.serviceSchedule')}
              </h4>
              <p className='text-gray-700'>{schedule}</p>
            </div>
          )}

          {/* Time slots if available */}
          {timeSlots.length > 0 && (
            <div className='mb-6'>
              <h4 className='text-lg font-medium text-gray-800 mb-3 flex items-center'>
                <Clock className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                {t('serviceDetails.availableTimes')}
              </h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`flex items-center bg-${primaryColor}-50 p-3 rounded-lg`}
                  >
                    <Clock
                      className={`h-5 w-5 text-${primaryColor}-500 mr-2`}
                    />
                    <span className='text-gray-800'>{slot}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability string if available */}
          {availabilityString && (
            <div className='mb-6'>
              <h4 className='text-lg font-medium text-gray-800 mb-3 flex items-center'>
                <Calendar className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                {t('serviceDetails.availability')}
              </h4>
              <p className='text-gray-700'>{availabilityString}</p>
            </div>
          )}

          {/* Availability days if available */}
          {availability?.daysOfWeek && availability.daysOfWeek.length > 0 && (
            <div className='mb-6'>
              <h4 className='text-lg font-medium text-gray-800 mb-3 flex items-center'>
                <Calendar className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                {t('serviceDetails.availableDays')}
              </h4>
              <div className='flex flex-wrap gap-2'>
                {weekdays.map((day, index) => {
                  const isAvailable = availability.daysOfWeek.includes(index);
                  return (
                    <div
                      key={index}
                      className={`py-1 px-3 rounded-lg text-sm font-medium ${
                        isAvailable
                          ? `bg-${primaryColor}-100 text-${primaryColor}-800`
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {t(day)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Availability hours if available */}
          {availability?.hoursOfDay && availability.hoursOfDay.length > 0 && (
            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-3 flex items-center'>
                <Clock className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                {t('serviceDetails.availableHours')}
              </h4>
              <div className='flex flex-wrap gap-2'>
                {availability.hoursOfDay.map((hour) => (
                  <div
                    key={hour}
                    className={`py-1 px-3 rounded-lg text-sm font-medium bg-${primaryColor}-100 text-${primaryColor}-800`}
                  >
                    {`${hour}:00`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleBlock;
