// UI/components/packageBuilder/dayPlanner/steps/LuxuryDayPlanningStep.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Star,
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
  // Reemplaza la función getRecommendedServices en LuxuryDayPlanningStep.tsx
  const getRecommendedServices = () => {
    if (!travelPurpose || !packageType) return [];

    // Primero, filtrar por tipo de paquete
    let recommendedServices = services.filter((service) => {
      return service.packageType.includes(packageType);
    });

    // Obtener todos los IDs de servicios ya seleccionados en cualquier día
    const allSelectedServiceIds = new Set();
    Object.values(dailyActivities).forEach((activities) => {
      activities.forEach((activity) => {
        allSelectedServiceIds.add(activity.serviceId);
      });
    });

    // Filtrar por servicios que NO están seleccionados en el día actual
    const currentDaySelectedIds = new Set(
      currentDayActivities.map((activity) => activity.serviceId)
    );

    // Obtener servicios prioritarios según el propósito del viaje
    const getPriorityByPurpose = (serviceId) => {
      const priorityMap = {
        family: [
          'catamaran-trips',
          'golf-cart-rentals',
          'bike-rentals',
          'babysitter',
          'adventure-excursions',
          'family-tour',
          'snorkeling',
          'beach-day',
          'zoo-visit',
          'aquarium-tour',
        ],
        couple: [
          'private-chef',
          'luxe-masseuse',
          'private-yacht-experience',
          'luxe-culinary',
          'horseback-riding',
          'couples-massage',
          'sunset-dinner',
          'wine-tasting',
          'spa-day',
          'romantic-picnic',
        ],
        friends: [
          'catamaran-trips',
          'adventure-excursions',
          'karaoke',
          'live-music',
          'private-catamaran',
          'beach-party',
          'nightlife-tour',
          'food-crawl',
          'boat-party',
          'jet-ski-tour',
        ],
        relax: [
          'yoga-standard',
          'luxe-masseuse',
          'luxe-yoga',
          'personal-training',
          'private-chef',
          'meditation-class',
          'spa-treatment',
          'beach-day',
          'massage-therapy',
          'sound-healing',
        ],
      };

      const relevantPriorities = priorityMap[travelPurpose] || [];
      return relevantPriorities.indexOf(serviceId);
    };

    // Aplicar orden de relevancia basado en el propósito
    recommendedServices = recommendedServices.sort((a, b) => {
      const aPriority = getPriorityByPurpose(a.id);
      const bPriority = getPriorityByPurpose(b.id);

      // Si ambos están en la lista de prioridades
      if (aPriority >= 0 && bPriority >= 0) {
        return aPriority - bPriority;
      }

      // Si solo uno está en la lista, ese tiene prioridad
      if (aPriority >= 0) return -1;
      if (bPriority >= 0) return 1;

      // Si ninguno está en la lista, ordenar por precio
      return a.price - b.price;
    });

    // Asegurarse que se muestran servicios disponibles
    // Si todos los servicios ya han sido seleccionados, mostrarlos todos de nuevo
    if (recommendedServices.every((s) => allSelectedServiceIds.has(s.id))) {
      console.log('Todos los servicios ya seleccionados, mostrando todos');
      return recommendedServices;
    }

    // Dividir los servicios en dos grupos: los ya seleccionados en otros días y los disponibles
    const availableServices = recommendedServices.filter(
      (service) =>
        !allSelectedServiceIds.has(service.id) ||
        currentDaySelectedIds.has(service.id)
    );

    const otherSelectedServices = recommendedServices.filter(
      (service) =>
        allSelectedServiceIds.has(service.id) &&
        !currentDaySelectedIds.has(service.id)
    );

    // Primero mostrar los servicios disponibles, y si hay menos de 5, añadir algunos ya seleccionados
    const minRecommendationsCount = 5;
    if (availableServices.length < minRecommendationsCount) {
      return [
        ...availableServices,
        ...otherSelectedServices.slice(
          0,
          minRecommendationsCount - availableServices.length
        ),
      ];
    }

    return availableServices;
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'
      initial='hidden'
      animate='visible'
      variants={fadeIn}
    >
      {/* Top section with date navigation */}
      <motion.div
        className='rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 mb-8 text-white'
        variants={childVariants}
      >
        <div className='flex justify-between items-center'>
          <motion.button
            onClick={onPrevDay}
            disabled={currentDayIndex === 0}
            className={`p-3 rounded-full ${
              currentDayIndex === 0
                ? 'bg-white/20 cursor-not-allowed'
                : 'bg-white/30 hover:bg-white/40'
            } transition-colors`}
            whileHover={{ scale: currentDayIndex === 0 ? 1 : 1.1 }}
            whileTap={{ scale: currentDayIndex === 0 ? 1 : 0.9 }}
          >
            <ChevronLeft className='h-6 w-6' />
          </motion.button>

          <div className='text-center'>
            <h2 className='text-3xl font-bold mb-1'>Día {dayNumber}</h2>
            <p className='text-lg opacity-90 capitalize'>{dayFormatted}</p>
          </div>

          <motion.button
            onClick={onNextDay}
            className='p-3 rounded-full bg-white/30 hover:bg-white/40 transition-colors'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className='h-6 w-6' />
          </motion.button>
        </div>

        {/* Day progress indicator */}
        <div className='w-full h-2 bg-white/20 rounded-full mt-6'>
          <motion.div
            className='h-full bg-white rounded-full'
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
      </motion.div>

      <motion.div variants={staggerChildren}>
        {/* Current day's planned activities */}
        <motion.div variants={childVariants}>
          <DayActivityList
            activities={currentDayActivities}
            getServiceById={getServiceById}
            onRemoveActivity={onRemoveActivity}
          />
        </motion.div>

        {/* Activity recommendations */}
        <motion.div variants={childVariants}>
          <RecommendedServices
            services={getRecommendedServices()}
            currentDayActivities={currentDayActivities}
            timeSlots={TIME_SLOTS}
            isTimeSlotAvailable={isTimeSlotAvailable}
            onServiceConfig={onServiceConfig}
          />
        </motion.div>
      </motion.div>

      {/* Navigation buttons */}
      <div className='flex justify-between mt-10'>
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
