// steps/DietaryRestrictionsStep.jsx
import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { AlertCircle, Info } from 'lucide-react';

interface DietaryRestrictionsStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors: Record<string, string>;
}

const DietaryRestrictionsStep: React.FC<DietaryRestrictionsStepProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
        <AlertCircle className='w-5 h-5 mr-2 text-amber-600' />
        {t('chef.form.step4.title', {
          fallback: 'Dietary Restrictions',
        })}
      </h3>

      <div>
        <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
          <AlertCircle className='w-4 h-4 mr-2 text-amber-700' />
          {t('chef.form.dietaryRestrictions', {
            fallback: 'Any dietary restrictions or allergies?',
          })}
        </label>
        <textarea
          name='dietaryRestrictions'
          value={formData.dietaryRestrictions}
          onChange={onChange}
          placeholder='Please list any allergies, intolerances, or dietary preferences (e.g., vegetarian, vegan, gluten-free, nut allergies, etc.)'
          className={`w-full p-3 border ${
            errors.dietaryRestrictions ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50 min-h-[150px]`}
        ></textarea>
        {errors.dietaryRestrictions && (
          <p className='text-red-500 text-xs mt-1'>
            {errors.dietaryRestrictions}
          </p>
        )}
        <p className='text-xs text-gray-500 mt-1'>
          {formData.dietaryRestrictions
            ? `${formData.dietaryRestrictions.length}/500 characters`
            : 'Optional, but highly recommended if applicable'}
        </p>
      </div>

      {/* Severe Allergies Checkbox */}
      <div className='flex items-center bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4'>
        <input
          type='checkbox'
          id='hasAllergies'
          name='hasAllergies'
          checked={formData.hasAllergies}
          onChange={onChange}
          className='h-4 w-4 text-amber-700 focus:ring-amber-500 border-amber-300 rounded'
        />
        <label htmlFor='hasAllergies' className='ml-2 text-amber-800'>
          {t('chef.form.severeAllergies', {
            fallback:
              'I or my guests have severe allergies that require special attention',
          })}
        </label>
      </div>

      <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4'>
        <div className='flex items-start'>
          <Info className='w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5' />
          <p className='text-sm text-gray-600'>
            Our chefs take dietary requirements very seriously. Please be
            specific about any allergies or restrictions to ensure we can
            prepare a safe and enjoyable meal for all guests.
          </p>
        </div>
      </div>

      {/* Special Instructions for Children */}
      {formData.childrenCount > 0 && (
        <div className='bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4'>
          <h4 className='font-medium text-amber-800 mb-2'>
            Childrens Dietary Preferences`
          </h4>
          <p className='text-sm text-amber-700'>
            If your children have specific food preferences or dislikes, please
            mention them in the dietary restrictions above. Our chefs can
            prepare child-friendly options.
          </p>
        </div>
      )}
    </div>
  );
};

export default DietaryRestrictionsStep;
