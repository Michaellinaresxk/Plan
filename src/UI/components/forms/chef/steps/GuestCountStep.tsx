import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Users, AlertCircle, Baby } from 'lucide-react';

interface GuestCountStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  updateGuestCount: (increment: boolean) => void;
  updateChildrenCount: (increment: boolean) => void;
  errors: Record<string, string>;
}

const GuestCountStep: React.FC<GuestCountStepProps> = ({
  formData,
  onChange,
  updateGuestCount,
  updateChildrenCount,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
        <Users className='w-5 h-5 mr-2 text-amber-600' />
        {t('chef.form.step2.title', { fallback: 'Number of Guests' })}
      </h3>

      <div className='bg-amber-50 rounded-lg p-6 border border-amber-100'>
        {/* Total Guest Count */}
        <div className='mb-8'>
          <label className='flex items-center text-lg font-medium text-gray-800 mb-4'>
            <Users className='w-5 h-5 mr-2 text-amber-700' />
            {t('chef.form.guestCount', {
              fallback: 'How many guests will be dining?',
            })}{' '}
            *
          </label>

          <div className='flex items-center justify-center'>
            <button
              type='button'
              onClick={() => updateGuestCount(false)}
              className='w-12 h-12 rounded-full bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center justify-center text-xl font-bold'
            >
              -
            </button>

            <div className='mx-8 text-center'>
              <div className='text-4xl font-light text-amber-800'>
                {formData.guestCount}
              </div>
              <div className='text-sm text-amber-700 mt-1'>
                {formData.guestCount === 1 ? 'Guest' : 'Guests'}
              </div>
            </div>

            <button
              type='button'
              onClick={() => updateGuestCount(true)}
              className='w-12 h-12 rounded-full bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center justify-center text-xl font-bold'
            >
              +
            </button>
          </div>

          {errors.guestCount && (
            <p className='text-red-500 text-sm mt-4 text-center'>
              {errors.guestCount}
            </p>
          )}
        </div>

        {/* Children Count */}
        <div className='mt-10 pt-6 border-t border-amber-200'>
          <label className='flex items-center text-lg font-medium text-gray-800 mb-4'>
            <Baby className='w-5 h-5 mr-2 text-amber-700' />
            {t('chef.form.childrenCount', {
              fallback: 'How many children are included?',
            })}
          </label>

          <div className='flex items-center justify-center'>
            <button
              type='button'
              onClick={() => updateChildrenCount(false)}
              className='w-12 h-12 rounded-full bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center justify-center text-xl font-bold'
            >
              -
            </button>

            <div className='mx-8 text-center'>
              <div className='text-4xl font-light text-amber-800'>
                {formData.childrenCount}
              </div>
              <div className='text-sm text-amber-700 mt-1'>
                {formData.childrenCount === 1 ? 'Child' : 'Children'}
              </div>
            </div>

            <button
              type='button'
              onClick={() => updateChildrenCount(true)}
              className='w-12 h-12 rounded-full bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center justify-center text-xl font-bold'
            >
              +
            </button>
          </div>

          {errors.childrenCount && (
            <p className='text-red-500 text-sm mt-4 text-center'>
              {errors.childrenCount}
            </p>
          )}

          {/* Children Ages Input - show only if children count > 0 */}
          {formData.childrenCount > 0 && (
            <div className='mt-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Please specify the age(s) of children *
              </label>
              <input
                type='text'
                name='childrenAges'
                value={formData.childrenAges}
                onChange={onChange}
                placeholder='e.g., 5, 7, 12 years old'
                className={`w-full p-3 border ${
                  errors.childrenAges ? 'border-red-500' : 'border-amber-300'
                } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white`}
              />
              {errors.childrenAges && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.childrenAges}
                </p>
              )}
              <p className='text-xs text-amber-700 mt-1'>
                This helps our chef prepare age-appropriate menu options
              </p>
            </div>
          )}
        </div>

        <p className='mt-6 text-sm text-amber-700 text-center'>
          <AlertCircle className='inline-block w-4 h-4 mr-1' />
          Base price is for 2 guests. Additional guests: $50 per person.
        </p>
      </div>
    </div>
  );
};

export default GuestCountStep;
