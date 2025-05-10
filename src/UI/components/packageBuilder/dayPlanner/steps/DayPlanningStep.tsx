// UI/components/packageBuilder/dayPlanner/steps/DayPlanningStep.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Service } from '@/types/type';
import { DailyActivity, TIME_SLOTS } from '@/constants/dayplanner';
import { DayActivityList } from './DayActivityList';
import { RecommendedServices } from './RecommendedServices';

interface DayPlanningStepProps {
  currentDay: Date | null;
  currentDayIndex: number;
  daysArray: Date[];
  dailyActivities: Record<string, DailyActivity[]>;
  currentDayStr: string;
  services: Service[];
  packageType: string | null;
  travelPurpose: string;
  onServiceConfig: (serviceId: string, timeSlot: string) => void;
  onRemoveActivity: (serviceId: string) => void;
  onNextDay: () => void;
  onPrevDay: () => void;
  getServiceById: (serviceId: string) => Service | undefined;
}

export const DayPlanningStep: React.FC<DayPlanningStepProps> = ({
  currentDay,
  currentDayIndex,
  daysArray,
  dailyActivities,
  currentDayStr,
  services,
  packageType,
  travelPurpose,
  onServiceConfig,
  onRemoveActivity,
  onNextDay,
  onPrevDay,
  getServiceById,
}) => {
  if (!currentDay) return null;

  const currentDayActivities = currentDayStr
    ? dailyActivities[currentDayStr] || []
    : [];

  // Format date for display
  const dayFormatted = format(currentDay, 'EEEE, d MMMM', { locale: es });
  const dayNumber = currentDayIndex + 1;

  // Check if a time slot is available
  const isTimeSlotAvailable = (timeSlot: string) => {
    if (!currentDayStr) return true;
    const dayActivities = dailyActivities[currentDayStr] || [];
    return !dayActivities.some((a) => a.timeSlot === timeSlot);
  };

  // Get recommended services based on purpose
  const getRecommendedServices = () => {
    if (!travelPurpose || !packageType) return [];

    return services.filter((service) => {
      if (!service.packageType.includes(packageType)) {
        return false;
      }

      switch (travelPurpose) {
        case 'family':
          return [
            'catamaran-trips',
            'golf-cart-rentals',
            'bike-rentals',
            'babysitter',
            'adventure-excursions',
          ].includes(service.id);
        case 'couple':
          return [
            'private-chef',
            'luxe-masseuse',
            'private-yacht-experience',
            'luxe-culinary',
            'horseback-riding',
          ].includes(service.id);
        case 'friends':
          return [
            'catamaran-trips',
            'adventure-excursions',
            'karaoke',
            'live-music',
            'private-catamaran',
          ].includes(service.id);
        case 'relax':
          return [
            'yoga-standard',
            'luxe-masseuse',
            'luxe-yoga',
            'personal-training',
            'private-chef',
          ].includes(service.id);
        default:
          return true;
      }
    });
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'
      initial='hidden'
      animate='visible'
      variants={fadeIn}
    >
      {/* Day header and navigation */}
      <div className='flex justify-between items-center mb-8'>
        <motion.button
          onClick={onPrevDay}
          disabled={currentDayIndex === 0}
          className={`p-3 rounded-full ${
            currentDayIndex === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          } transition-colors`}
          whileHover={{ scale: currentDayIndex === 0 ? 1 : 1.1 }}
          whileTap={{ scale: currentDayIndex === 0 ? 1 : 0.9 }}
        >
          <ChevronLeft className='h-6 w-6' />
        </motion.button>

        <div className='text-center'>
          <h2 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-1'>
            Día {dayNumber}
          </h2>
          <p className='text-gray-600 capitalize text-lg'>{dayFormatted}</p>
        </div>

        <motion.button
          onClick={onNextDay}
          className='p-3 rounded-full text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className='h-6 w-6' />
        </motion.button>
      </div>

      {/* Day progress indicator */}
      <div className='w-full h-2 bg-gray-100 rounded-full mb-8'>
        <motion.div
          className='h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full'
          style={{
            width: `${((currentDayIndex + 1) / daysArray.length) * 100}%`,
          }}
          initial={{ width: 0 }}
          animate={{
            width: `${((currentDayIndex + 1) / daysArray.length) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Current day's planned activities */}
      <DayActivityList
        activities={currentDayActivities}
        getServiceById={getServiceById}
        onRemoveActivity={onRemoveActivity}
      />

      {/* Activity recommendations */}
      <RecommendedServices
        services={getRecommendedServices()}
        currentDayActivities={currentDayActivities}
        timeSlots={TIME_SLOTS}
        isTimeSlotAvailable={isTimeSlotAvailable}
        onServiceConfig={onServiceConfig}
      />

      {/* Navigation buttons */}
      <div className='flex justify-between'>
        <motion.button
          onClick={onPrevDay}
          disabled={currentDayIndex === 0}
          className={`
            px-6 py-3 rounded-xl flex items-center text-lg
            ${
              currentDayIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }
            transition-colors
          `}
          whileHover={{ scale: currentDayIndex === 0 ? 1 : 1.03 }}
          whileTap={{ scale: currentDayIndex === 0 ? 1 : 0.97 }}
        >
          <ArrowLeft className='mr-2 h-5 w-5' />
          Día anterior
        </motion.button>

        <motion.button
          onClick={onNextDay}
          className='px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-colors flex items-center text-lg'
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {currentDayIndex < daysArray.length - 1
            ? 'Siguiente día'
            : 'Revisar plan'}
          <ArrowRight className='ml-2 h-5 w-5' />
        </motion.button>
      </div>
    </motion.div>
  );
};
