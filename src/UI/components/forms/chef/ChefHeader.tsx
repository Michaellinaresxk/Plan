import React from 'react';
import { ChefHat } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
}

const ChefHeader: React.FC<FormHeaderProps> = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
  progressPercentage,
}) => {
  return (
    <div className='bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white relative overflow-hidden'>
      {/* Background Pattern */}
      <div
        className='absolute inset-0 opacity-10'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Header Content */}
      <div className='relative z-10 p-4 md:p-6'>
        {/* Title Section */}
        <div className='flex items-center space-x-3 md:space-x-4 mb-2 md:mb-3'>
          <div className='w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30'>
            <ChefHat className='w-5 h-5 md:w-6 md:h-6 text-white' />
          </div>
          <div>
            <h2 className='text-xl md:text-2xl font-light tracking-wide leading-tight'>
              {title}
            </h2>
            <p className='text-amber-100 text-sm md:text-base font-light opacity-90 leading-tight'>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className='mt-4 md:mt-6'>
          {/* Progress Info */}
          <div className='flex justify-between items-center text-xs md:text-sm text-amber-200 mb-2'>
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>
                Paso {currentStep} de {totalSteps}
              </span>
              {/* Mobile: Show step name */}
              <span className='hidden sm:inline text-amber-300'>•</span>
              <span className='hidden sm:inline text-amber-300 text-xs'>
                {getStepName(currentStep)}
              </span>
            </div>
            <span className='font-medium'>
              {Math.round(progressPercentage)}% Completado
            </span>
          </div>

          {/* Progress Bar */}
          <div className='relative'>
            {/* Background Bar */}
            <div className='w-full bg-amber-950/50 rounded-full h-2 md:h-2.5 shadow-inner'>
              <div
                className='bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 h-2 md:h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Progress Dots for Desktop */}
            <div className='hidden md:flex justify-between absolute -top-1 w-full'>
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${
                    i + 1 <= currentStep
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-400 shadow-lg'
                      : 'bg-amber-950/50'
                  }`}
                  title={getStepName(i + 1)}
                />
              ))}
            </div>
          </div>

          {/* Mobile Step Indicators */}
          <div className='flex md:hidden justify-center mt-3 space-x-2'>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i + 1 <= currentStep
                    ? 'bg-amber-400 shadow-sm'
                    : 'bg-amber-950/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get step names
const getStepName = (step: number): string => {
  const stepNames = {
    1: 'Tipo de Chef',
    2: 'Servicio',
    3: 'Fecha y Lugar',
    4: 'Comensales',
    5: 'Cocina',
    6: 'Restricciones',
    7: 'Descripción',
  };
  return stepNames[step as keyof typeof stepNames] || '';
};

export default ChefHeader;
