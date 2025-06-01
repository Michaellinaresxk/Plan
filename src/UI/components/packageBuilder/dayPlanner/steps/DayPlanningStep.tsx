// UI/components/packageBuilder/dayPlanner/steps/DayPlanningStep.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Star,
  MapPin,
  Clock,
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

  // Formato de fecha para mostrar
  const dayFormatted = format(currentDay, 'EEEE, d MMMM', { locale: es });
  const dayNumber = currentDayIndex + 1;
  const totalDays = daysArray.length;

  // Verificar si un horario está disponible
  const isTimeSlotAvailable = (timeSlot: string) => {
    if (!currentDayStr) return true;
    const dayActivities = dailyActivities[currentDayStr] || [];
    return !dayActivities.some((a) => a.timeSlot === timeSlot);
  };

  // Obtener servicios recomendados (lógica simplificada sin propósito específico)
  const getRecommendedServices = () => {
    if (!packageType) return [];

    // Filtrar por tipo de paquete
    let recommendedServices = services.filter((service) => {
      return service.packageType.includes(packageType);
    });

    // Obtener servicios ya seleccionados
    const allSelectedServiceIds = new Set();
    Object.values(dailyActivities).forEach((activities) => {
      activities.forEach((activity) => {
        allSelectedServiceIds.add(activity.serviceId);
      });
    });

    const currentDaySelectedIds = new Set(
      currentDayActivities.map((activity) => activity.serviceId)
    );

    // Lógica de priorización general (sin propósito específico)
    recommendedServices = recommendedServices.sort((a, b) => {
      // Priorizar servicios premium
      const aPremium = a.packageType.includes('premium') ? 0 : 1;
      const bPremium = b.packageType.includes('premium') ? 0 : 1;

      if (aPremium !== bPremium) {
        return aPremium - bPremium;
      }

      // Luego por popularidad (puedes ajustar esta lógica)
      // Por ahora ordenamos por precio para tener variedad
      return a.price - b.price;
    });

    // Si todos los servicios ya fueron seleccionados, mostrarlos todos
    if (recommendedServices.every((s) => allSelectedServiceIds.has(s.id))) {
      return recommendedServices;
    }

    // Servicios disponibles vs ya seleccionados
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

    // Mostrar mínimo 5 recomendaciones
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

  // Variantes de animación
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
      className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'
      initial='hidden'
      animate='visible'
      variants={fadeIn}
    >
      {/* HEADER MEJORADO - Más prominente y visible */}
      <motion.div
        className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white relative overflow-hidden'
        variants={childVariants}
      >
        {/* Fondo decorativo */}
        <div className='absolute inset-0 bg-black/10 backdrop-blur-sm'></div>
        <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

        <div className='relative z-10'>
          {/* Navegación de días */}
          <div className='flex justify-between items-center mb-6'>
            <motion.button
              onClick={onPrevDay}
              disabled={currentDayIndex === 0}
              className={`p-4 rounded-full backdrop-blur-sm ${
                currentDayIndex === 0
                  ? 'bg-white/10 cursor-not-allowed text-white/50'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              } transition-colors`}
              whileHover={{ scale: currentDayIndex === 0 ? 1 : 1.1 }}
              whileTap={{ scale: currentDayIndex === 0 ? 1 : 0.9 }}
            >
              <ChevronLeft className='h-6 w-6' />
            </motion.button>

            <div className='text-center'>
              <motion.div
                className='flex items-center justify-center mb-2'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Calendar className='h-8 w-8 mr-3' />
                <h1 className='text-4xl font-bold'>Día {dayNumber}</h1>
              </motion.div>
              <p className='text-xl opacity-90 capitalize font-medium'>
                {dayFormatted}
              </p>
              <motion.div
                className='mt-3 flex items-center justify-center text-white/80'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <MapPin className='h-4 w-4 mr-2' />
                <span className='text-sm'>
                  {currentDayActivities.length}{' '}
                  {currentDayActivities.length === 1
                    ? 'actividad'
                    : 'actividades'}{' '}
                  planificadas
                </span>
              </motion.div>
            </div>

            <motion.button
              onClick={onNextDay}
              className='p-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className='h-6 w-6' />
            </motion.button>
          </div>

          {/* Progreso visual mejorado */}
          <div className='space-y-4'>
            {/* Barra de progreso principal */}
            <div className='w-full h-3 bg-white/20 rounded-full overflow-hidden'>
              <motion.div
                className='h-full bg-white rounded-full shadow-lg'
                style={{
                  width: `${((currentDayIndex + 1) / daysArray.length) * 100}%`,
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentDayIndex + 1) / daysArray.length) * 100}%`,
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Indicadores de días con más detalle */}
            <div className='flex justify-between items-center'>
              <span className='text-sm text-white/80'>
                Día {dayNumber} de {totalDays}
              </span>
              <div className='flex space-x-2'>
                {daysArray.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index < currentDayIndex
                        ? 'bg-green-400 shadow-lg'
                        : index === currentDayIndex
                        ? 'bg-white ring-2 ring-white/50 shadow-lg'
                        : 'bg-white/30'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                ))}
              </div>
              <div className='text-sm text-white/80 flex items-center'>
                <Clock className='h-4 w-4 mr-1' />
                {currentDayIndex < daysArray.length - 1
                  ? 'Planificando...'
                  : 'Último día'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CONTENIDO PRINCIPAL */}
      <div className='p-8'>
        <motion.div variants={staggerChildren}>
          {/* Lista de actividades del día actual */}
          <motion.div variants={childVariants}>
            <DayActivityList
              activities={currentDayActivities}
              getServiceById={getServiceById}
              onRemoveActivity={onRemoveActivity}
            />
          </motion.div>

          {/* Servicios recomendados */}
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

        {/* Botones de navegación */}
        <div className='flex justify-between mt-10'>
          <motion.button
            onClick={onPrevDay}
            disabled={currentDayIndex === 0}
            className={`
              px-6 py-3 rounded-xl flex items-center text-lg font-medium
              ${
                currentDayIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }
              transition-all duration-200
            `}
            whileHover={{ scale: currentDayIndex === 0 ? 1 : 1.03 }}
            whileTap={{ scale: currentDayIndex === 0 ? 1 : 0.97 }}
          >
            <ArrowLeft className='mr-2 h-5 w-5' />
            {currentDayIndex === 0 ? 'Primer día' : `Día ${currentDayIndex}`}
          </motion.button>

          <motion.button
            onClick={onNextDay}
            className='px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center text-lg font-medium'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {currentDayIndex < daysArray.length - 1
              ? `Continuar a Día ${currentDayIndex + 2}`
              : 'Revisar Plan Completo'}
            <ArrowRight className='ml-2 h-5 w-5' />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
