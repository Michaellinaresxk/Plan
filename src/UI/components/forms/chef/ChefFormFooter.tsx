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
    <div className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden'>
      {/* Background Pattern */}
      <div
        className='absolute inset-0 opacity-5'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className='relative z-10 p-4 md:p-6'>
        {/* Mobile Layout */}
        <div className='flex flex-col space-y-4 md:hidden'>
          {/* Price Section for Mobile */}
          <div className='flex items-center justify-between'>
            <div>
              <span className='text-gray-400 text-sm uppercase tracking-wide'>
                {t('chef.form.totalPrice', { fallback: 'Total Price' })}
              </span>
              <div className='flex items-center space-x-2 mt-1'>
                <span className='text-2xl font-light'>
                  ${currentPrice.toFixed(2)}
                </span>
                <div className='flex space-x-1'>
                  {formData.guestCount > 2 && (
                    <span className='text-xs bg-amber-800 px-2 py-1 rounded-full flex items-center space-x-1'>
                      <Users className='w-3 h-3' />
                      <span>{formData.guestCount}</span>
                    </span>
                  )}
                  {daysOfService > 1 && (
                    <span className='text-xs bg-amber-700 px-2 py-1 rounded-full flex items-center space-x-1'>
                      <Calendar className='w-3 h-3' />
                      <span>{daysOfService}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className='text-right'>
              <div className='flex items-center space-x-1 text-amber-400'>
                <Star className='w-4 h-4' />
                <span className='text-sm font-medium'>
                  {formData.chefType === 'professional' ? 'Premium' : 'Regular'}
                </span>
              </div>
            </div>
          </div>

          {/* Multiple Days Info for Mobile */}
          {formData.serviceType === 'multiple' && formData.dates.length > 0 && (
            <div className='text-center'>
              <span className='text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full'>
                {formatDateRange(formData.dates)}
              </span>
            </div>
          )}

          {/* Navigation Buttons for Mobile */}
          <div className='flex space-x-3'>
            {currentStep === 1 ? (
              <button
                type='button'
                onClick={onCancel}
                className='flex-1 px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-gray-500 transition-all duration-200'
              >
                {t('common.cancel', { fallback: 'Cancel' })}
              </button>
            ) : (
              <button
                type='button'
                onClick={onBack}
                className='flex-1 px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-gray-500 transition-all duration-200 flex items-center justify-center space-x-2'
              >
                <ChevronLeft className='w-4 h-4' />
                <span>{t('common.back', { fallback: 'Back' })}</span>
              </button>
            )}

            <button
              type='button'
              onClick={onNext}
              className='flex-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg'
            >
              {currentStep === totalSteps ? (
                <>
                  <CreditCard className='w-4 h-4' />
                  <span className='font-semibold'>
                    {t('chef.form.bookNow', { fallback: 'Book Now' })}
                  </span>
                </>
              ) : (
                <>
                  <span className='font-semibold'>
                    {t('common.next', { fallback: 'Next' })}
                  </span>
                  <ChevronRight className='w-4 h-4' />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className='hidden md:flex items-center justify-between'>
          {/* Price Section for Desktop */}
          <div className='flex flex-col items-start'>
            <span className='text-gray-400 text-sm uppercase tracking-wide'>
              {t('chef.form.totalPrice', { fallback: 'Total Price' })}
            </span>
            <div className='flex items-center mt-1'>
              <span className='text-3xl font-light'>
                ${currentPrice.toFixed(2)}
              </span>
              <div className='ml-4 flex space-x-2'>
                {formData.guestCount > 2 && (
                  <span className='text-sm bg-amber-800 px-3 py-1 rounded-full flex items-center space-x-1'>
                    <Users className='w-4 h-4' />
                    <span>{formData.guestCount} guests</span>
                  </span>
                )}
                {daysOfService > 1 && (
                  <span className='text-sm bg-amber-700 px-3 py-1 rounded-full flex items-center space-x-1'>
                    <Calendar className='w-4 h-4' />
                    <span>{daysOfService} days</span>
                  </span>
                )}
                <span className='text-sm bg-gray-700 px-3 py-1 rounded-full flex items-center space-x-1'>
                  <Star className='w-4 h-4 text-amber-400' />
                  <span>
                    {formData.chefType === 'professional'
                      ? 'Premium'
                      : 'Regular'}
                  </span>
                </span>
              </div>
            </div>

            {/* Multiple Days Info for Desktop */}
            {formData.serviceType === 'multiple' &&
              formData.dates.length > 0 && (
                <span className='text-xs text-gray-400 mt-2 bg-gray-800 px-3 py-1 rounded-full'>
                  {formatDateRange(formData.dates)}
                </span>
              )}
          </div>

          {/* Navigation Buttons for Desktop */}
          <div className='flex space-x-4'>
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
      </div>
    </div>
  );
};

export default ChefFormFooter;
