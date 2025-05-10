// UI/components/packageBuilder/dayPlanner/steps/PurposeStep.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { DailyActivity, travelPurposes } from '@/constants/dayplanner';

interface PurposeStepProps {
  travelPurpose: string;
  setTravelPurpose: (purpose: string) => void;
  daysArray: Date[];
  setDailyActivities: (activities: Record<string, DailyActivity[]>) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const PurposeStep: React.FC<PurposeStepProps> = ({
  travelPurpose,
  setTravelPurpose,
  daysArray,
  setDailyActivities,
  onNext,
  onBack,
  isLoading,
}) => {
  const handleSelectPurpose = (purposeId: string) => {
    setTravelPurpose(purposeId);
  };

  const handleNext = () => {
    // Initialize daily activities structure
    const activities: Record<string, DailyActivity[]> = {};
    daysArray.forEach((day) => {
      activities[format(day, 'yyyy-MM-dd')] = [];
    });
    setDailyActivities(activities);
    onNext();
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.15)' },
    tap: { y: 0, scale: 0.98 },
  };

  return (
    <motion.div
      className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'
      initial='hidden'
      animate='visible'
      variants={fadeIn}
    >
      <h2 className='text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
        ¿Cuál es el motivo principal de tu viaje?
      </h2>

      <p className='text-gray-600 mb-8 text-lg'>
        Selecciona una opción para ayudarnos a recomendarte las mejores
        actividades.
      </p>

      <motion.div
        className='grid grid-cols-2 gap-6 mb-10'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {travelPurposes.map((purpose) => (
          <motion.div
            key={purpose.id}
            onClick={() => handleSelectPurpose(purpose.id)}
            className={`
              overflow-hidden rounded-xl cursor-pointer relative h-64
              ${
                travelPurpose === purpose.id
                  ? 'ring-3 ring-blue-500 shadow-xl'
                  : 'shadow-md hover:shadow-xl'
              }
              transition-all duration-300
            `}
            variants={cardVariants}
            whileHover='hover'
            whileTap='tap'
          >
            {/* Card Image with Overlay */}
            <div className='absolute inset-0 w-full h-full'>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${purpose.color} opacity-70 z-10`}
              ></div>
              <img
                src={purpose.image}
                alt={purpose.name}
                className='w-full h-full object-cover'
              />
            </div>

            {/* Selection Indicator */}
            {travelPurpose === purpose.id && (
              <div className='absolute top-4 right-4 bg-white rounded-full w-6 h-6 flex items-center justify-center z-20'>
                <div className='bg-blue-500 rounded-full w-4 h-4'></div>
              </div>
            )}

            {/* Content */}
            <div className='absolute bottom-0 left-0 right-0 p-6 z-20'>
              <h3 className='font-bold text-2xl text-white mb-1'>
                {purpose.name}
              </h3>
              <p className='text-white text-opacity-90 text-lg'>
                {purpose.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className='flex justify-between'>
        <motion.button
          onClick={onBack}
          className='px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center'
          whileHover={{ scale: 1.03, backgroundColor: '#F9FAFB' }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className='mr-2 h-5 w-5' />
          Atrás
        </motion.button>

        {isLoading ? (
          <div className='flex items-center text-blue-500 px-6 py-3'>
            <Loader className='animate-spin mr-3 h-5 w-5' />
            <span className='text-lg'>Preparando tu plan...</span>
          </div>
        ) : (
          <motion.button
            onClick={handleNext}
            disabled={!travelPurpose}
            className={`
              px-8 py-4 rounded-xl font-medium flex items-center text-lg
              ${
                !travelPurpose
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
              }
              transition-all duration-300
            `}
            whileHover={{ scale: !travelPurpose ? 1 : 1.03 }}
            whileTap={{ scale: !travelPurpose ? 1 : 0.98 }}
          >
            Planificar días
            <ArrowRight className='ml-2 h-5 w-5' />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
