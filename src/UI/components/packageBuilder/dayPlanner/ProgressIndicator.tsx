import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
}) => {
  const { t } = useTranslation();

  const steps = [
    { id: 1, label: t('dayplanner.steps.welcome') },
    { id: 2, label: t('dayplanner.steps.selectServices') },
    { id: 3, label: t('dayplanner.steps.selectTime') },
    { id: 4, label: t('dayplanner.steps.planDays') },
    { id: 5, label: t('dayplanner.steps.review') },
  ];

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-center'>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className='flex flex-col items-center'>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {currentStep > step.id ? (
                  <Check size={20} />
                ) : (
                  <span>{step.id}</span>
                )}
              </motion.div>
              <span className='text-xs text-gray-600 mt-2 text-center max-w-[80px]'>
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 mx-2 mb-8 ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
