import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Calendar,
  Clock,
  AlertCircle,
  ShoppingCart,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';

interface GroceryFormProps {
  service: Service;
  selectedItems: any[]; // Array of selected grocery items
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const GroceryForm: React.FC<GroceryFormProps> = ({
  service,
  selectedItems,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    hour: '',
    foodRestrictions: '',
    hasAllergies: false,
    specialRequests: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Current price calculation
  const [currentPrice, setCurrentPrice] = useState(service.price);

  // Available delivery time slots
  const timeSlots = [
    '8:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
    '18:00 - 20:00',
  ];

  // Calculate total price based on selected items and delivery options
  useEffect(() => {
    let totalPrice = service.price; // Base service price

    // Add selected items prices
    if (selectedItems && selectedItems.length > 0) {
      const itemsTotal = selectedItems.reduce((sum, item) => {
        return sum + item.price * (item.quantity || 1);
      }, 0);

      totalPrice += itemsTotal;
    }

    // Update the calculated price
    setCurrentPrice(totalPrice);
  }, [service.price, selectedItems]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.date) {
      newErrors.date = t('form.errors.required', {
        fallback: 'Delivery date is required',
      });
    }

    if (!formData.hour) {
      newErrors.hour = t('form.errors.required', {
        fallback: 'Delivery time is required',
      });
    }

    // Validate future date
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = t('form.errors.futureDate', {
          fallback: 'Please select a future date',
        });
      }
    }

    // Length validation
    if (formData.foodRestrictions && formData.foodRestrictions.length > 500) {
      newErrors.foodRestrictions = t('form.errors.maxLength', {
        max: 500,
        fallback: 'Maximum 500 characters allowed',
      });
    }

    if (formData.specialRequests && formData.specialRequests.length > 500) {
      newErrors.specialRequests = t('form.errors.maxLength', {
        max: 500,
        fallback: 'Maximum 500 characters allowed',
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Submit the form data along with selected items
    onSubmit({
      ...formData,
      items: selectedItems,
      totalPrice: currentPrice,
    });
  };

  // Get minimum date (today) for the date picker
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Form Header */}
        <div className='bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-6 text-white'>
          <h2 className='text-2xl font-light tracking-wide'>
            {t('grocery.form.title', { fallback: 'Grocery Delivery Details' })}
          </h2>
          <p className='text-blue-100 mt-1 font-light'>
            {t('grocery.form.subtitle', {
              fallback:
                'Fill in your delivery preferences to complete your grocery order',
            })}
          </p>

          {/* Order summary - shows number of items */}
          {selectedItems && selectedItems.length > 0 && (
            <div className='mt-4 flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg'>
              <ShoppingBag className='h-5 w-5 mr-2 text-white' />
              <span className='text-white font-medium'>
                {t('grocery.form.itemCount', {
                  count: selectedItems.length,
                  fallback: `${selectedItems.length} items in your basket`,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Delivery Details Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('grocery.form.deliveryDetails', {
                fallback: 'Delivery Details',
              })}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Delivery Date */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-blue-700' />
                  {t('grocery.form.deliveryDate', {
                    fallback: 'Delivery Date',
                  })}{' '}
                  *
                </label>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleChange}
                  min={getMinDate()}
                  className={`w-full p-3 border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                />
                {errors.date && (
                  <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
                )}
              </div>

              {/* Delivery Time Slot */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 mr-2 text-blue-700' />
                  {t('grocery.form.deliveryTime', {
                    fallback: 'Delivery Time',
                  })}{' '}
                  *
                </label>
                <select
                  name='hour'
                  value={formData.hour}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.hour ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                >
                  <option value=''>
                    {t('grocery.form.selectTime', {
                      fallback: 'Select a time slot',
                    })}
                  </option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.hour && (
                  <p className='text-red-500 text-xs mt-1'>{errors.hour}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dietary and Special Requirements */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              {t('grocery.form.dietaryRequirements', {
                fallback: 'Dietary & Special Requirements',
              })}
            </h3>

            {/* Food Restrictions */}
            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <AlertCircle className='w-4 h-4 mr-2 text-blue-700' />
                {t('grocery.form.dietaryRestrictions', {
                  fallback: 'Dietary Restrictions',
                })}
              </label>
              <textarea
                name='foodRestrictions'
                value={formData.foodRestrictions}
                onChange={handleChange}
                placeholder={t('grocery.form.dietaryRestrictionsPlaceholder', {
                  fallback:
                    'List any dietary restrictions (e.g., vegetarian, gluten-free)',
                })}
                className={`w-full p-3 border ${
                  errors.foodRestrictions ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 min-h-[100px]`}
              ></textarea>
              {errors.foodRestrictions && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.foodRestrictions}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                {formData.foodRestrictions
                  ? `${formData.foodRestrictions.length}/500 ${t(
                      'form.characters',
                      { fallback: 'characters' }
                    )}`
                  : t('form.optional', { fallback: 'Optional' })}
              </p>
            </div>

            {/* Allergies Checkbox */}
            <div className='flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200'>
              <input
                type='checkbox'
                id='hasAllergies'
                name='hasAllergies'
                checked={formData.hasAllergies}
                onChange={handleChange}
                className='h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label htmlFor='hasAllergies' className='ml-2 text-gray-700'>
                {t('grocery.form.allergiesWarning', {
                  fallback:
                    'I have severe allergies that require special handling',
                })}
              </label>
            </div>

            {/* Special Requests */}
            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <ShoppingCart className='w-4 h-4 mr-2 text-blue-700' />
                {t('grocery.form.specialRequests', {
                  fallback: 'Special Requests',
                })}
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder={t('grocery.form.specialRequestsPlaceholder', {
                  fallback:
                    'Any additional instructions for shoppers (e.g., ripe avocados, green bananas)',
                })}
                className={`w-full p-3 border ${
                  errors.specialRequests ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 min-h-[100px]`}
              ></textarea>
              {errors.specialRequests && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.specialRequests}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                {formData.specialRequests
                  ? `${formData.specialRequests.length}/500 ${t(
                      'form.characters',
                      { fallback: 'characters' }
                    )}`
                  : t('form.optional', { fallback: 'Optional' })}
              </p>
            </div>
          </div>
        </div>

        {/* Form Footer with Total Price and Actions */}
        <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
          <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
            <span className='text-gray-400 text-sm uppercase tracking-wide'>
              {t('grocery.form.totalPrice', { fallback: 'Total Price' })}
            </span>
            <div className='flex items-center mt-1'>
              <span className='text-3xl font-light'>
                ${currentPrice.toFixed(2)}
              </span>
              {selectedItems && selectedItems.length > 0 && (
                <span className='ml-2 text-sm bg-blue-800 px-2 py-1 rounded'>
                  {selectedItems.length}{' '}
                  {t('grocery.form.items', { fallback: 'items' })}
                </span>
              )}
            </div>
          </div>

          <div className='flex space-x-4'>
            <button
              type='button'
              onClick={onCancel}
              className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition'
            >
              {t('common.cancel', { fallback: 'Cancel' })}
            </button>

            <button
              type='submit'
              className='px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition flex items-center'
            >
              <CreditCard className='h-4 w-4 mr-2' />
              {t('grocery.form.proceedToPayment', {
                fallback: 'Proceed to Payment',
              })}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default GroceryForm;
