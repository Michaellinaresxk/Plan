// dayPlanner/components/ProgressIndicator.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, Heart, Sun } from 'lucide-react';
import { PlannerStep } from '@/constants/dayplanner';

interface ProgressIndicatorProps {
  currentStep: PlannerStep;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
}) => {
  const steps = [
    { key: 'select-dates', label: 'Fechas', icon: Calendar },
    { key: 'purpose', label: 'Propósito', icon: Heart },
    { key: 'day-planning', label: 'Plan Diario', icon: Sun },
    { key: 'review', label: 'Revisar', icon: Check },
  ];

  const getProgressWidth = () => {
    switch (currentStep) {
      case 'select-dates':
        return '25%';
      case 'purpose':
        return '50%';
      case 'day-planning':
        return '75%';
      case 'review':
        return '100%';
      default:
        return '0%';
    }
  };

  return (
    <motion.div
      className='mb-10 max-w-3xl mx-auto'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex justify-between max-w-md mx-auto'>
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted =
            index < steps.findIndex((s) => s.key === currentStep);
          const StepIcon = step.icon;

          return (
            <div key={step.key} className='flex flex-col items-center'>
              <motion.div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md
                  ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-400 to-green-500'
                      : isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      : 'bg-gray-300'
                  }
                `}
                whileHover={{
                  scale: 1.1,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                  transition: {
                    duration: 0.5,
                    repeat: isActive ? Infinity : 0,
                    repeatType: 'reverse',
                  },
                }}
              >
                {isCompleted ? <Check size={20} /> : <StepIcon size={20} />}
              </motion.div>
              <span
                className={`text-sm mt-2 font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className='relative h-2 bg-gray-200 rounded-full max-w-md mx-auto mt-3'>
        <motion.div
          className='absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full'
          initial={{ width: '0%' }}
          animate={{ width: getProgressWidth() }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};
