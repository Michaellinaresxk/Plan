// components/confirmation/StepIndicator.tsx
import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { CheckCircle, Circle, User, CreditCard } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      name: t('reservation.steps.review', { fallback: 'Review Details' }),
      icon: CheckCircle,
      description: t('reservation.steps.reviewDesc', {
        fallback: 'Confirm your booking details',
      }),
    },
    {
      id: 2,
      name: t('reservation.steps.contact', { fallback: 'Contact Info' }),
      icon: User,
      description: t('reservation.steps.contactDesc', {
        fallback: 'Provide your contact information',
      }),
    },
    {
      id: 3,
      name: t('reservation.steps.payment', { fallback: 'Complete Booking' }),
      icon: CreditCard,
      description: t('reservation.steps.paymentDesc', {
        fallback: 'Finalize your reservation',
      }),
    },
  ];

  return (
    <div className='flex items-center justify-between max-w-2xl mx-auto'>
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isUpcoming = step.id > currentStep;

        return (
          <React.Fragment key={step.id}>
            {/* Step Circle and Content */}
            <div className='flex flex-col items-center relative'>
              <div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle className='w-6 h-6' />
                ) : (
                  <step.icon className='w-6 h-6' />
                )}
              </div>

              <div className='mt-3 text-center'>
                <p
                  className={`
                    text-sm font-medium transition-colors duration-300
                    ${
                      isCompleted || isCurrent
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }
                  `}
                >
                  {step.name}
                </p>
                <p
                  className={`
                    text-xs mt-1 transition-colors duration-300
                    ${
                      isCurrent
                        ? 'text-blue-600'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-4 transition-colors duration-300
                  ${step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
