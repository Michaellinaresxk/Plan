import React from 'react';

interface FormHeaderProps {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
  progressPercentage,
}) => {
  return (
    <div className='bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 p-6 text-white'>
      <h2 className='text-2xl font-light tracking-wide'>{title}</h2>
      <p className='text-amber-100 mt-1 font-light'>{subtitle}</p>

      {/* Progress bar */}
      <div className='mt-6'>
        <div className='flex justify-between text-xs text-amber-200 mb-1'>
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className='w-full bg-amber-950/50 rounded-full h-2.5'>
          <div
            className='bg-amber-400 h-2.5 rounded-full transition-all duration-300'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
