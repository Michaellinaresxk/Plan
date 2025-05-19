import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { ChevronRight, ChevronLeft, CreditCard } from 'lucide-react';
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
      {/* Price calculation */}
      <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
        <span className='text-gray-400 text-sm uppercase tracking-wide'>
          {t('chef.form.totalPrice', { fallback: 'Total Price' })}
        </span>
        <div className='flex items-center mt-1'>
          <span className='text-3xl font-light'>
            ${currentPrice.toFixed(2)}
          </span>
          <div className='ml-3 flex flex-col'>
            {formData.guestCount > 2 && (
              <span className='text-sm bg-amber-800 px-2 py-0.5 rounded mb-1'>
                {formData.guestCount} guests
              </span>
            )}
            {daysOfService > 1 && (
              <span className='text-sm bg-amber-700 px-2 py-0.5 rounded'>
                {daysOfService} days
              </span>
            )}
          </div>
        </div>

        {formData.serviceType === 'multiple' && formData.dates.length > 0 && (
          <span className='text-xs text-gray-400 mt-1'>
            {formatDateRange(formData.dates)}
          </span>
        )}
      </div>

      {/* Navigation buttons */}
      <div className='flex space-x-4'>
        {/* Cancel/Back button */}
        {currentStep === 1 ? (
          <button
            type='button'
            onClick={onCancel}
            className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition'
          >
            {t('common.cancel', { fallback: 'Cancel' })}
          </button>
        ) : (
          <button
            type='button'
            onClick={onBack}
            className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition flex items-center'
          >
            <ChevronLeft className='h-4 w-4 mr-1' />
            {t('common.back', { fallback: 'Back' })}
          </button>
        )}

        {/* Next/Submit button */}
        <button
          type={currentStep === totalSteps ? 'submit' : 'button'}
          onClick={currentStep !== totalSteps ? onNext : undefined}
          className='px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition flex items-center'
        >
          {currentStep === totalSteps ? (
            <>
              <CreditCard className='h-4 w-4 mr-2' />
              {t('chef.form.bookNow', { fallback: 'Book Now' })}
            </>
          ) : (
            <>
              {t('common.next', { fallback: 'Next' })}
              <ChevronRight className='h-4 w-4 ml-1' />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChefFormFooter;
