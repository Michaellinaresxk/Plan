import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { Calendar, ChefHat, Utensils, Info } from 'lucide-react';
import ServiceManager from '@/constants/services/ServiceManager';

interface ChefServiceFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

/**
 * Specialized form for Chef Service booking
 * Handles the specific requirements for chef services including
 * chef type, meal preferences, and guest count
 */
const ChefServiceForm: React.FC<ChefServiceFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guestCount: 4,
    chefType: 'regular', // Default to regular chef
    mealType: 'dinner', // Default to dinner
    dietaryRestrictions: '',
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalPrice, setTotalPrice] = useState(service.price);

  // Get full service data
  const serviceData = ServiceManager.getData(service.id);

  // Update price when form data changes
  useEffect(() => {
    if (!serviceData) return;

    // Start with base price
    let price = service.price;

    // Add chef type price adjustment
    // Professional chef = $175 (base $120 + $55), Regular chef = $120
    if (formData.chefType === 'professional') {
      price += 55; // Additional fee for professional chef
    }

    // Add guest count price adjustment
    const guestCount = formData.guestCount;
    if (guestCount > 10 && guestCount <= 15) {
      price += 30; // Medium group surcharge
    } else if (guestCount > 15 && guestCount <= 20) {
      price += 60; // Large group surcharge
    }

    setTotalPrice(price);
  }, [formData, service.price, serviceData]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle number inputs
    if (type === 'number') {
      const numberValue = parseInt(value);
      setFormData((prev) => ({ ...prev, [name]: numberValue }));
      return;
    }

    // Handle all other inputs
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = t('form.errors.required');
    }

    if (!formData.time) {
      newErrors.time = t('form.errors.required');
    }

    if (!formData.guestCount || formData.guestCount < 1) {
      newErrors.guestCount = t('form.errors.invalidGuestCount');
    } else if (formData.guestCount > 20) {
      newErrors.guestCount = t('form.errors.maxGuestCount', { max: 20 });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Add calculated total price to form data
    const submissionData = {
      ...formData,
      calculatedPrice: totalPrice,
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4'>
        <h3 className='text-lg font-bold text-gray-900'>
          {t('services.chef.form.title')}
        </h3>

        <p className='text-sm text-gray-600'>
          {t('services.chef.form.description')}
        </p>

        {/* Chef Type Selection */}
        <div className='border rounded-md p-4 bg-gray-50'>
          <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
            <ChefHat className='h-5 w-5 text-blue-500 mr-2' />
            {t('services.chef.form.chefType')}
          </h4>

          <div className='grid grid-cols-1 gap-4'>
            {/* Regular Chef Option */}
            <div
              className={`border p-4 rounded-lg cursor-pointer ${
                formData.chefType === 'regular'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, chefType: 'regular' }))
              }
            >
              <div className='flex justify-between items-start'>
                <div>
                  <div className='flex items-center'>
                    <input
                      type='radio'
                      id='regular-chef'
                      name='chefType'
                      value='regular'
                      checked={formData.chefType === 'regular'}
                      onChange={handleChange}
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500 mr-2'
                    />
                    <label
                      htmlFor='regular-chef'
                      className='font-medium text-gray-900'
                    >
                      {t('services.chef.options.chefType.options.regular')}
                    </label>
                  </div>

                  <p className='text-sm text-gray-600 mt-2 ml-6'>
                    {t(
                      'services.chef.options.chefType.options.regularDescription'
                    )}
                  </p>

                  <div className='ml-6 mt-2 text-xs text-gray-500'>
                    <ul className='list-disc pl-5'>
                      <li>{t('services.chef.options.regularFeatures.1')}</li>
                      <li>{t('services.chef.options.regularFeatures.2')}</li>
                      <li>{t('services.chef.options.regularFeatures.3')}</li>
                    </ul>
                  </div>
                </div>

                <div className='text-blue-600 font-medium'>$120</div>
              </div>
            </div>

            {/* Professional Chef Option */}
            <div
              className={`border p-4 rounded-lg cursor-pointer ${
                formData.chefType === 'professional'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, chefType: 'professional' }))
              }
            >
              <div className='flex justify-between items-start'>
                <div>
                  <div className='flex items-center'>
                    <input
                      type='radio'
                      id='professional-chef'
                      name='chefType'
                      value='professional'
                      checked={formData.chefType === 'professional'}
                      onChange={handleChange}
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500 mr-2'
                    />
                    <label
                      htmlFor='professional-chef'
                      className='font-medium text-gray-900'
                    >
                      {t('services.chef.options.chefType.options.professional')}
                    </label>
                  </div>

                  <p className='text-sm text-gray-600 mt-2 ml-6'>
                    {t(
                      'services.chef.options.chefType.options.professionalDescription'
                    )}
                  </p>

                  <div className='ml-6 mt-2 text-xs text-gray-500'>
                    <ul className='list-disc pl-5'>
                      <li>
                        {t('services.chef.options.professionalFeatures.1')}
                      </li>
                      <li>
                        {t('services.chef.options.professionalFeatures.2')}
                      </li>
                      <li>
                        {t('services.chef.options.professionalFeatures.3')}
                      </li>
                      <li>
                        {t('services.chef.options.professionalFeatures.4')}
                      </li>
                    </ul>
                  </div>
                </div>

                <div className='text-blue-600 font-medium'>$175</div>
              </div>
            </div>
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className='border rounded-md p-4'>
          <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
            <Calendar className='h-5 w-5 text-blue-500 mr-2' />
            {t('services.chef.form.schedulingDetails')}
          </h4>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.chef.form.date')} *
              </label>
              <input
                type='date'
                name='date'
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.chef.form.time')} *
              </label>
              <input
                type='time'
                name='time'
                value={formData.time}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.time && (
                <p className='text-red-500 text-xs mt-1'>{errors.time}</p>
              )}
            </div>
          </div>
        </div>

        {/* Meal Type Selection */}
        <div className='border rounded-md p-4'>
          <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
            <Utensils className='h-5 w-5 text-blue-500 mr-2' />
            {t('services.chef.form.mealDetails')}
          </h4>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.chef.form.mealType')}
              </label>
              <select
                name='mealType'
                value={formData.mealType}
                onChange={handleChange}
                className='w-full p-2 border border-gray-300 rounded-md'
              >
                <option value='breakfast'>
                  {t('services.chef.options.mealType.options.breakfast')}
                </option>
                <option value='lunch'>
                  {t('services.chef.options.mealType.options.lunch')}
                </option>
                <option value='dinner'>
                  {t('services.chef.options.mealType.options.dinner')}
                </option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.chef.form.guestCount')} *
              </label>
              <input
                type='number'
                name='guestCount'
                value={formData.guestCount}
                onChange={handleChange}
                min='1'
                max='20'
                className={`w-full p-2 border rounded-md ${
                  errors.guestCount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.guestCount && (
                <p className='text-red-500 text-xs mt-1'>{errors.guestCount}</p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                {t('services.chef.form.guestCountNote')}
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('services.chef.form.dietaryRestrictions')}
              </label>
              <textarea
                name='dietaryRestrictions'
                value={formData.dietaryRestrictions}
                onChange={handleChange}
                rows={3}
                className='w-full p-2 border border-gray-300 rounded-md'
                placeholder={t(
                  'services.chef.form.dietaryRestrictionsPlaceholder'
                )}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div className='form-group'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {t('services.chef.form.specialRequests')}
          </label>
          <textarea
            name='specialRequests'
            value={formData.specialRequests}
            onChange={handleChange}
            rows={3}
            className='w-full p-2 border border-gray-300 rounded-md'
            placeholder={t('services.chef.form.specialRequestsPlaceholder')}
          ></textarea>
        </div>

        {/* Info about groceries */}
        <div className='bg-blue-50 border border-blue-100 rounded-md p-4'>
          <div className='flex'>
            <Info className='h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5' />
            <div>
              <h5 className='font-medium text-gray-800 mb-1'>
                {t('services.chef.form.groceriesInfo.title')}
              </h5>
              <p className='text-sm text-gray-600'>
                {t('services.chef.form.groceriesInfo.description')}
              </p>
              <p className='text-sm text-blue-600 mt-2'>
                {t('services.chef.form.groceriesInfo.groceryServiceAvailable')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price summary */}
      <div className='bg-gray-50 p-4 rounded-md'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-gray-700'>
            {t('services.chef.form.basePrice')}
          </span>
          <span>${formData.chefType === 'regular' ? 120 : 175}</span>
        </div>

        {formData.guestCount > 10 && (
          <div className='flex justify-between items-center mb-2'>
            <span className='text-gray-700'>
              {formData.guestCount <= 15
                ? t('services.chef.form.mediumGroupSurcharge')
                : t('services.chef.form.largeGroupSurcharge')}
            </span>
            <span>+${formData.guestCount <= 15 ? 30 : 60}</span>
          </div>
        )}

        <div className='flex justify-between items-center pt-2 border-t border-gray-200 mt-2'>
          <span className='font-bold text-gray-900'>
            {t('services.chef.form.totalPrice')}
          </span>
          <span className='font-bold text-blue-600'>${totalPrice}</span>
        </div>
      </div>

      {/* Form actions */}
      <div className='flex justify-end space-x-3'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
        >
          {t('common.cancel')}
        </button>

        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          {t('common.confirm')}
        </button>
      </div>
    </form>
  );
};

export default ChefServiceForm;
