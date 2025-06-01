import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { motion } from 'framer-motion';
import { Calendar, Users, CreditCard, MapPin } from 'lucide-react';

interface DefaultServiceFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

/**
 * Simplified Service Form - WITH DEBUG LOGGING
 *
 * A streamlined form for services with only essential fields:
 * - Date selection
 * - Guest count
 * - Location
 */
const DefaultServiceForm: React.FC<DefaultServiceFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: '',
    guestCount: 1,
    location: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalPrice, setTotalPrice] = useState(service.price);

  // Debug initialization
  React.useEffect(() => {
    console.log('📝 DefaultServiceForm initialized for:', service.id);
    console.log('📝 DefaultServiceForm onSubmit type:', typeof onSubmit);
    console.log('📝 DefaultServiceForm onCancel type:', typeof onCancel);
    console.log('📝 DefaultServiceForm service object:', service);
  }, [service.id, onSubmit, onCancel, service]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    console.log(`📝 DefaultServiceForm - Field changed: ${name} = ${value}`);

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is filled
    if (errors[name] && value) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle guest count updates
  const updateGuestCount = (increment: boolean) => {
    const newCount = increment
      ? formData.guestCount + 1
      : Math.max(1, formData.guestCount - 1);

    console.log(`📝 DefaultServiceForm - Guest count updated: ${newCount}`);

    setFormData((prev) => ({
      ...prev,
      guestCount: newCount,
    }));
  };

  // Calculate price based on guest count
  useEffect(() => {
    const basePrice = service.price;
    const guestPrice = basePrice * formData.guestCount;
    console.log(
      `📝 DefaultServiceForm - Price calculated: ${guestPrice} (${basePrice} x ${formData.guestCount})`
    );
    setTotalPrice(guestPrice);
  }, [formData.guestCount, service.price]);

  // Validate form before submission
  const validateForm = (): boolean => {
    console.log('📝 DefaultServiceForm - Starting validation');
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = t('form.errors.required', {
        fallback: 'Date is required',
      });
    }

    if (!formData.guestCount || formData.guestCount < 1) {
      newErrors.guestCount = t('form.errors.invalidGuestCount', {
        fallback: 'Please select at least 1 guest',
      });
    }

    if (!formData.location) {
      newErrors.location = t('form.errors.required', {
        fallback: 'Location is required',
      });
    }

    console.log('📝 DefaultServiceForm - Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('📝 DefaultServiceForm - handleSubmit called');
    console.log('📝 DefaultServiceForm - Current formData:', formData);

    if (!validateForm()) {
      console.log('❌ DefaultServiceForm - Validation failed');
      return;
    }

    console.log('✅ DefaultServiceForm - Validation passed');

    // Add calculated total price to form data
    const submissionData = {
      ...formData,
      calculatedPrice: totalPrice,
      serviceId: service.id,
      serviceName: service.name,
    };

    console.log(
      '🚀 DefaultServiceForm - Calling onSubmit with:',
      submissionData
    );

    try {
      onSubmit(submissionData);
      console.log('✅ DefaultServiceForm - onSubmit called successfully');
    } catch (error) {
      console.error('💥 DefaultServiceForm - Error calling onSubmit:', error);
    }
  };

  // Y TAMBIÉN AGREGA este useEffect al principio del componente:
  React.useEffect(() => {
    console.log('📝 DefaultServiceForm initialized for:', service.id);
    console.log('📝 DefaultServiceForm onSubmit type:', typeof onSubmit);
    console.log('📝 DefaultServiceForm onCancel type:', typeof onCancel);
  }, [service.id, onSubmit, onCancel]);

  // Get isPremium status based on package type
  const isPremium = service.packageType.includes('premium');
  const colorScheme = isPremium ? 'amber' : 'blue';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
        <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
          {/* Form Header */}
          <div
            className={`bg-gradient-to-r from-${colorScheme}-900 via-${colorScheme}-800 to-${colorScheme}-900 p-6 text-white`}
          >
            <h2 className='text-2xl font-light tracking-wide'>
              {t('serviceForm.title', {
                service: service.name,
                fallback: `Book ${service.name}`,
              })}
            </h2>
            <p className='text-${colorScheme}-100 mt-1 font-light'>
              {t('serviceForm.description', {
                fallback: 'Fill in the details below to book your experience',
              })}
            </p>
          </div>

          {/* Form Body */}
          <div className='p-8 space-y-8'>
            {/* Date Selection */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Calendar className='h-5 w-5 mr-2 text-${colorScheme}-600' />
                {t('serviceForm.dateDetails', { fallback: 'Date' })}
              </h3>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('serviceForm.date', { fallback: 'Select Date' })}{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-3 text-gray-400'>
                    <Calendar size={18} />
                  </span>
                  <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-10 py-2 border rounded-lg appearance-none ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className='mt-1 text-red-500 text-sm'>{errors.date}</p>
                )}
              </div>
            </div>

            {/* Guest Count Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Users className='h-5 w-5 mr-2 text-${colorScheme}-600' />
                {t('serviceForm.guestDetails', { fallback: 'Guests' })}
              </h3>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('serviceForm.guestCount', {
                    fallback: 'Number of Guests',
                  })}{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <div className='flex border border-gray-300 rounded-lg overflow-hidden max-w-xs'>
                  <button
                    type='button'
                    onClick={() => updateGuestCount(false)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors'
                  >
                    -
                  </button>
                  <div className='flex-1 py-2 text-center'>
                    {formData.guestCount}
                  </div>
                  <button
                    type='button'
                    onClick={() => updateGuestCount(true)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors'
                  >
                    +
                  </button>
                </div>
                {errors.guestCount && (
                  <p className='mt-1 text-red-500 text-sm'>
                    {errors.guestCount}
                  </p>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <MapPin className='h-5 w-5 mr-2 text-${colorScheme}-600' />
                {t('serviceForm.locationDetails', { fallback: 'Location' })}
              </h3>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('serviceForm.location', { fallback: 'Service Location' })}{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-3 text-gray-400'>
                    <MapPin size={18} />
                  </span>
                  <textarea
                    name='location'
                    value={formData.location}
                    onChange={handleChange}
                    placeholder={t('serviceForm.locationPlaceholder', {
                      fallback:
                        'Enter the full address where the service should take place...',
                    })}
                    className={`w-full pl-10 py-2 border rounded-lg resize-none ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={3}
                  ></textarea>
                </div>
                {errors.location && (
                  <p className='mt-1 text-red-500 text-sm'>{errors.location}</p>
                )}
              </div>
            </div>

            
          </div>

          {/* Form Footer with Price and Actions */}
          <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
            <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
              <span className='text-gray-400 text-sm uppercase tracking-wide'>
                {t('serviceForm.totalPrice', { fallback: 'Total Price' })}
              </span>
              <span className='text-3xl font-light'>
                ${totalPrice.toFixed(2)}
              </span>
              {formData.guestCount > 1 && (
                <span className='text-sm text-gray-400 mt-1'>
                  ${service.price.toFixed(2)} x {formData.guestCount}{' '}
                  {t('serviceForm.guests', { fallback: 'guests' })}
                </span>
              )}
            </div>

            <div className='flex space-x-4'>
              <button
                type='button'
                onClick={() => {
                  console.log('❌ DefaultServiceForm - Cancel button clicked');
                  onCancel();
                }}
                className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors'
              >
                {t('common.cancel', { fallback: 'Cancel' })}
              </button>

              <button
                type='submit'
                className={`px-8 py-3 bg-${colorScheme}-600 hover:bg-${colorScheme}-500 text-white rounded-lg transition-colors flex items-center`}
                onClick={() =>
                  console.log('🖱️ DefaultServiceForm - Submit button clicked')
                }
              >
                <CreditCard className='h-4 w-4 mr-2' />
                {t('serviceForm.book', { fallback: 'Book Now' })}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default DefaultServiceForm;
