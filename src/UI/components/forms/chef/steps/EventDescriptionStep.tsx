// steps/EventDescriptionStep.jsx
import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { MessageCircle, ChefHat, Check } from 'lucide-react';
import {
  budgetOptions,
  chefsSpecialMenus,
  cuisineTypes,
  occasionTypes,
} from '@/constants/chefFormConsts';

interface EventDescriptionStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors: Record<string, string>;
}

const EventDescriptionStep: React.FC<EventDescriptionStepProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const { t } = useTranslation();

  // Get display values
  const selectedCuisine = cuisineTypes.find(
    (c) => c.id === formData.cuisineType
  );
  const selectedBudget = budgetOptions.find(
    (b) => b.id === formData.budgetOption
  );
  const selectedMenu = chefsSpecialMenus.find(
    (m) => m.id === formData.selectedSpecialMenu
  );
  const selectedOccasion = occasionTypes.find(
    (o) => o.id === formData.occasion
  );

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
        <MessageCircle className='w-5 h-5 mr-2 text-amber-600' />
        {t('chef.form.step5.title', {
          fallback: 'Describe Your Event',
        })}
      </h3>

      <div>
        <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
          <MessageCircle className='w-4 h-4 mr-2 text-amber-700' />
          {t('chef.form.eventDescription', {
            fallback: 'Tell us about your event and any special requests',
          })}{' '}
          *
        </label>
        <textarea
          name='eventDescription'
          value={formData.eventDescription}
          onChange={onChange}
          placeholder='Share details that will help our chef prepare the perfect meal. Mention preferred dishes, cooking styles, or specific requests for your occasion.'
          className={`w-full p-3 border ${
            errors.eventDescription ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50 min-h-[200px]`}
        ></textarea>
        {errors.eventDescription && (
          <p className='text-red-500 text-xs mt-1'>{errors.eventDescription}</p>
        )}
        <p className='text-xs text-gray-500 mt-1'>
          {formData.eventDescription
            ? `${formData.eventDescription.length}/1000 characters`
            : ''}
        </p>
      </div>

      <div className='bg-amber-50 p-6 rounded-lg border border-amber-100 mt-6'>
        <h4 className='font-medium text-amber-800 flex items-center mb-3'>
          <ChefHat className='w-5 h-5 mr-2' />
          Your Chef Will Prepare:
        </h4>

        <ul className='space-y-2'>
          <li className='flex items-start'>
            <Check className='w-4 h-4 text-amber-600 mr-2 mt-1' />
            <span className='text-amber-800'>
              {selectedMenu
                ? `${selectedMenu.title} (Chef's Special Menu)`
                : `${selectedCuisine?.name || 'Selected'} cuisine`}
            </span>
          </li>
          <li className='flex items-start'>
            <Check className='w-4 h-4 text-amber-600 mr-2 mt-1' />
            <span className='text-amber-800'>
              A{' '}
              {selectedBudget
                ? selectedBudget.name.toLowerCase()
                : 'customized'}{' '}
              dining experience
            </span>
          </li>
          <li className='flex items-start'>
            <Check className='w-4 h-4 text-amber-600 mr-2 mt-1' />
            <span className='text-amber-800'>
              {formData.serviceType === 'multiple'
                ? `Service on ${formData.dates.length} selected dates`
                : `Service on ${formData.date}`}
            </span>
          </li>
          <li className='flex items-start'>
            <Check className='w-4 h-4 text-amber-600 mr-2 mt-1' />
            <span className='text-amber-800'>
              For {formData.guestCount}{' '}
              {formData.guestCount === 1 ? 'guest' : 'guests'}
              {formData.childrenCount > 0 &&
                ` (including ${formData.childrenCount} ${
                  formData.childrenCount === 1 ? 'child' : 'children'
                })`}
            </span>
          </li>
          <li className='flex items-start'>
            <Check className='w-4 h-4 text-amber-600 mr-2 mt-1' />
            <span className='text-amber-800'>
              {formData.occasion === 'other'
                ? `For your ${formData.otherOccasion}`
                : `For your ${selectedOccasion?.name || 'event'}`}
            </span>
          </li>
          <li className='flex items-start'>
            <Check className='w-4 h-4 text-amber-600 mr-2 mt-1' />
            <span className='text-amber-800'>
              At {formData.locationAddress || 'your specified location'}
            </span>
          </li>
          {formData.dietaryRestrictions && (
            <li className='flex items-start'>
              <Check className='w-4 h-4 text-amber-600 mr-2 mt-1' />
              <span className='text-amber-800'>
                Accommodating your specified dietary requirements
              </span>
            </li>
          )}
        </ul>

        <div className='mt-6 text-center'>
          <div className='text-2xl font-light text-amber-800'>
            Total: $
            {formData.serviceType === 'multiple'
              ? formData.dates.length * selectedBudget?.price || 0
              : selectedBudget?.price || 0}
          </div>
          <div className='text-sm text-amber-700 mt-1'>
            {formData.serviceType === 'multiple'
              ? `${formData.dates.length} days × $${
                  selectedBudget?.price || 0
                }/day`
              : ''}
            {formData.guestCount > 2
              ? ` + $${50 * (formData.guestCount - 2)} for additional guests`
              : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDescriptionStep;
