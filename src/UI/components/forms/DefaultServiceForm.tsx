import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { Calendar, AlertCircle } from 'lucide-react';
import ServiceManager from '@/constants/services/ServiceManager';

interface DefaultServiceFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

/**
 * Default Service Form
 *
 * A generic form for services that don't have specialized forms.
 * This provides basic date, time, guest count inputs and handles options
 * from the service data.
 */
const DefaultServiceForm: React.FC<DefaultServiceFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guestCount: 1,
    selectedOptions: {} as Record<string, string>,
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalPrice, setTotalPrice] = useState(service.price);

  // Get full service data
  const serviceData = ServiceManager.getData(service.id);

  // Get service options
  const serviceOptions = serviceData?.options || {};

  // Calculate price when form data changes
  useEffect(() => {
    calculateTotalPrice(formData.selectedOptions);
  }, [formData.selectedOptions]);

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

  // Handle option changes
  const handleOptionChange = (category: string, optionValue: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedOptions: {
        ...prev.selectedOptions,
        [category]: optionValue,
      },
    }));
  };

  // Calculate total price based on selected options
  const calculateTotalPrice = (selectedOptions: Record<string, string>) => {
    if (!serviceData) return;

    let price = service.price;

    // Add option prices
    Object.entries(selectedOptions).forEach(([category, selectedOption]) => {
      const options = serviceOptions[category]?.subOptions || {};
      const option = options[selectedOption];

      if (option && typeof option === 'object' && 'price' in option) {
        // Handle special case for round trip (doubles the price)
        if (option.price === 'double') {
          price = price * 2;
        } else {
          price += Number(option.price);
        }
      }
    });

    setTotalPrice(price);
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = t('form.errors.required');
    }

    // Check if service requires date/time
    if (service.duration > 0) {
      if (!formData.date) {
        newErrors.date = t('form.errors.required');
      }

      if (!formData.time) {
        newErrors.time = t('form.errors.required');
      }
    }

    if (!formData.guestCount || formData.guestCount < 1) {
      newErrors.guestCount = t('form.errors.invalidGuestCount');
    }

    // Validate that all required options are selected
    Object.entries(serviceOptions).forEach(([category, option]) => {
      if (option && !formData.selectedOptions[category]) {
        newErrors[category] = t('form.errors.required');
      }
    });

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
      serviceId: service.id,
      serviceName: service.name,
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4'>
        <h3 className='text-lg font-bold text-gray-900'>
          {t('serviceForm.title', { service: service.name })}
        </h3>

        <p className='text-sm text-gray-600'>{t('serviceForm.description')}</p>

        {/* Date and Time Selection (only if service has duration) */}
        {service.duration > 0 && (
          <div className='border rounded-md p-4'>
            <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
              <Calendar className='h-5 w-5 text-blue-500 mr-2' />
              {t('serviceForm.schedulingDetails')}
            </h4>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {t('serviceForm.date')} *
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
                  {t('serviceForm.time')} *
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
        )}

        {/* Special Requests */}
        <div className='form-group'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {t('serviceForm.specialRequests')}
          </label>
          <textarea
            name='specialRequests'
            value={formData.specialRequests}
            onChange={handleChange}
            rows={3}
            className='w-full p-2 border border-gray-300 rounded-md'
            placeholder={t('serviceForm.specialRequestsPlaceholder')}
          ></textarea>
        </div>
      </div>

      {/* Price summary */}
      <div className='bg-gray-50 p-4 rounded-md'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-gray-700'>{t('serviceForm.basePrice')}</span>
          <span>${service.price}</span>
        </div>

        {Object.entries(formData.selectedOptions).map(
          ([category, selectedOption]) => {
            const options = serviceOptions[category]?.subOptions || {};
            const option = options[selectedOption];

            if (
              option &&
              typeof option === 'object' &&
              'price' in option &&
              option.price !== 0
            ) {
              // Handle round trip
              if (option.price === 'double') {
                return (
                  <div
                    key={category}
                    className='flex justify-between items-center mb-2'
                  >
                    <span className='text-gray-700'>
                      {option.nameKey ? t(option.nameKey) : selectedOption}
                    </span>
                    <span>x2</span>
                  </div>
                );
              }

              // Handle regular price adjustment
              return (
                <div
                  key={category}
                  className='flex justify-between items-center mb-2'
                >
                  <span className='text-gray-700'>
                    {option.nameKey ? t(option.nameKey) : selectedOption}
                  </span>
                  <span>
                    {option.price > 0
                      ? `+$${option.price}`
                      : `-$${Math.abs(option.price)}`}
                  </span>
                </div>
              );
            }

            return null;
          }
        )}

        <div className='flex justify-between items-center pt-2 border-t border-gray-200 mt-2'>
          <span className='font-bold text-gray-900'>
            {t('serviceForm.totalPrice')}
          </span>
          <span className='font-bold text-blue-600'>${totalPrice}</span>
        </div>
      </div>

      {/* Warning/Info messages if needed */}
      {serviceData?.disclaimer && (
        <div className='bg-amber-50 border border-amber-100 rounded-md p-4'>
          <div className='flex'>
            <AlertCircle className='h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5' />
            <p className='text-sm text-amber-700'>
              {t(serviceData.disclaimer)}
            </p>
          </div>
        </div>
      )}

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

export default DefaultServiceForm;
