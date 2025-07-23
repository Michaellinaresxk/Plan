import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Users,
  Calendar,
  Star,
} from 'lucide-react';
import { formatDateRange } from '@/utils/formatDateRange';

interface FormFooterProps {
  currentPrice: number;
  formData: any;
  currentStep: number;
  totalSteps: number;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}

const ChefFormFooter: React.FC<FormFooterProps> = ({
  currentPrice,
  formData,
  currentStep,
  totalSteps,
  onCancel,
  onBack,
  onNext,
}) => {
  const { t } = useTranslation();

  // Calculate days of service for display
  const daysOfService =
    formData.serviceType === 'multiple' ? formData.dates.length : 1;

  return (
    <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
      {/* Price calculation - aquí va tu contenido de precio */}
      <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
        {/* Contenido del precio aquí */}
      </div>

      {/* Botones al final */}
      <div className='hidden md:flex space-x-4'>
        {/* Cancel/Back button */}
        {currentStep === 1 ? (
          <button
            type='button'
            onClick={onCancel}
            className='px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all duration-200 flex items-center space-x-2'
          >
            <span>{t('common.cancel', { fallback: 'Cancel' })}</span>
          </button>
        ) : (
          <button
            type='button'
            onClick={onBack}
            className='px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all duration-200 flex items-center space-x-2'
          >
            <ChevronLeft className='h-4 w-4' />
            <span>{t('common.back', { fallback: 'Back' })}</span>
          </button>
        )}

        {/* Next/Submit button */}
        <button
          type='button'
          onClick={onNext}
          className='px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105'
        >
          {currentStep === totalSteps ? (
            <>
              <CreditCard className='h-4 w-4' />
              <span className='font-semibold'>
                {t('chef.form.bookNow', { fallback: 'Book Now' })}
              </span>
            </>
          ) : (
            <>
              <span className='font-semibold'>
                {t('common.next', { fallback: 'Next' })}
              </span>
              <ChevronRight className='h-4 w-4' />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChefFormFooter;
