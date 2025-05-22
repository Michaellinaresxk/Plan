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
  MapPin,
  X,
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
    deliveryAddress: '',
    foodRestrictions: '',
    hasAllergies: 'no', // Changed to string for radio buttons (yes/no)
    specialRequests: '',
    allergyDetails: '',
    acceptAllergensForOthers: false,
    allergyAcknowledgement: false,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(service.price);
  const timeSlots = ['9:00 - 13:00', '14:00 - 18:00'];

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Limpia errores cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
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

    if (!formData.deliveryAddress) {
      newErrors.deliveryAddress = t('form.errors.required', {
        fallback: 'Delivery address is required',
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

    // Allergy-related validations
    if (formData.hasAllergies === 'yes' && !formData.allergyDetails.trim()) {
      newErrors.allergyDetails = t('form.errors.required', {
        fallback: 'Please provide details about the allergies',
      });
    }

    // Check acknowledgement checkbox for allergies
    if (formData.hasAllergies === 'yes' && !formData.allergyAcknowledgement) {
      newErrors.allergyAcknowledgement = t(
        'form.errors.acknowledgementRequired',
        {
          fallback: 'Please acknowledge this statement',
        }
      );
    }

    // Validate acceptance of allergens for others
    if (formData.hasAllergies === 'yes' && !formData.acceptAllergensForOthers) {
      newErrors.acceptAllergensForOthers = t('form.errors.required', {
        fallback: 'Please acknowledge the disclaimer',
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission attempt (shows confirmation dialog)
  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // If form is valid, show confirmation dialog
    setShowConfirmDialog(true);
  };

  // Handle actual form submission after confirmation
  const handleConfirmedSubmit = () => {
    // Close dialog
    setShowConfirmDialog(false);

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
    <>
      <form
        onSubmit={handleSubmitAttempt}
        className='w-full mx-auto overflow-hidden'
      >
        <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
          {/* Form Header */}
          <div className='bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-6 text-white'>
            <h2 className='text-2xl font-light tracking-wide'>
              {t('grocery.form.title', {
                fallback: 'Grocery Delivery Details',
              })}
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

              {/* Delivery Address */}
              <div className='mt-4'>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <MapPin className='w-4 h-4 mr-2 text-blue-700' />
                  {t('grocery.form.deliveryAddress', {
                    fallback: 'Delivery Address',
                  })}{' '}
                  *
                </label>
                <textarea
                  name='deliveryAddress'
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder={t('grocery.form.deliveryAddressPlaceholder', {
                    fallback:
                      'Enter your complete delivery address including street, number, apartment/unit, city, and postal code',
                  })}
                  className={`w-full p-3 border ${
                    errors.deliveryAddress
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 min-h-[80px]`}
                ></textarea>
                {errors.deliveryAddress && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.deliveryAddress}
                  </p>
                )}
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
                  placeholder={t(
                    'grocery.form.dietaryRestrictionsPlaceholder',
                    {
                      fallback:
                        'List any dietary restrictions (e.g., vegetarian, gluten-free)',
                    }
                  )}
                  className={`w-full p-3 border ${
                    errors.foodRestrictions
                      ? 'border-red-500'
                      : 'border-gray-300'
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

              {/* Allergies Radio Buttons */}
              <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                <p className='text-sm font-medium text-gray-700 mb-3'>
                  {t('grocery.form.allergiesQuestion', {
                    fallback:
                      'Do you have severe allergies that require special handling?',
                  })}{' '}
                  *
                </p>

                <div className='flex space-x-6'>
                  <div className='flex items-center'>
                    <input
                      type='radio'
                      id='allergiesYes'
                      name='hasAllergies'
                      value='yes'
                      checked={formData.hasAllergies === 'yes'}
                      onChange={handleChange}
                      className='h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300'
                    />
                    <label
                      htmlFor='allergiesYes'
                      className='ml-2 text-gray-700'
                    >
                      {t('common.yes', { fallback: 'Yes' })}
                    </label>
                  </div>

                  <div className='flex items-center'>
                    <input
                      type='radio'
                      id='allergiesNo'
                      name='hasAllergies'
                      value='no'
                      checked={formData.hasAllergies === 'no'}
                      onChange={handleChange}
                      className='h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300'
                    />
                    <label htmlFor='allergiesNo' className='ml-2 text-gray-700'>
                      {t('common.no', { fallback: 'No' })}
                    </label>
                  </div>
                </div>

                {/* Campo adicional que aparece cuando se selecciona "Yes" */}
                {formData.hasAllergies === 'yes' && (
                  <div className='mt-4 pl-6 border-l-4 border-blue-300 bg-blue-50 p-4 rounded-r-lg'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('grocery.form.allergyDetails', {
                        fallback: 'Please specify your allergies:',
                      })}
                      <span className='text-red-500'> *</span>
                    </label>
                    <textarea
                      name='allergyDetails'
                      value={formData.allergyDetails || ''}
                      onChange={handleChange}
                      placeholder={t('grocery.form.allergyDetailsPlaceholder', {
                        fallback:
                          'List specific food items, ingredients, or products you are allergic to...',
                      })}
                      className={`w-full p-3 border ${
                        errors.allergyDetails
                          ? 'border-red-500'
                          : 'border-blue-300'
                      } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[100px]`}
                      required={formData.hasAllergies === 'yes'}
                    ></textarea>
                    {errors.allergyDetails && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.allergyDetails}
                      </p>
                    )}

                    {/* Checkbox para confirmar conocimiento de los riesgos */}
                    <div className='mt-4 bg-white p-3 rounded-lg border border-blue-200'>
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          id='allergyAcknowledgement'
                          name='allergyAcknowledgement'
                          checked={formData.allergyAcknowledgement || false}
                          onChange={handleChange}
                          className='h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300 rounded'
                        />
                        <label
                          htmlFor='allergyAcknowledgement'
                          className='ml-2 text-sm text-gray-700'
                        >
                          {t('grocery.form.allergyAcknowledgement', {
                            fallback:
                              'I understand that while special care will be taken, I should verify ingredients upon delivery.',
                          })}
                        </label>
                      </div>
                      {errors.allergyAcknowledgement && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors.allergyAcknowledgement}
                        </p>
                      )}
                    </div>

                    {/* Disclaimer and Checkbox for allowing allergens for others */}
                    <div className='mt-4'>
                      <div className='p-3 bg-white rounded-lg border border-amber-300'>
                        <p className='text-amber-800 text-sm mb-3 font-medium'>
                          {t('grocery.form.allergyDisclaimer', {
                            fallback:
                              'Disclaimer: If you authorize the purchase of ingredients that may cause allergies, please understand that these are intended for other guests who can safely consume them. We will follow your instructions, but the responsibility for ensuring proper handling and consumption after delivery is yours.',
                          })}
                        </p>

                        <div className='flex items-center'>
                          <input
                            type='checkbox'
                            id='acceptAllergensForOthers'
                            name='acceptAllergensForOthers'
                            checked={formData.acceptAllergensForOthers}
                            onChange={handleChange}
                            className='h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300 rounded'
                          />
                          <label
                            htmlFor='acceptAllergensForOthers'
                            className='ml-2 text-gray-700 text-sm'
                          >
                            {t('grocery.form.acceptAllergensForOthers', {
                              fallback:
                                'I understand and authorize the purchase of ingredients that may cause allergies, as they are intended for other guests.',
                            })}
                          </label>
                        </div>
                        {errors.acceptAllergensForOthers && (
                          <p className='text-red-500 text-xs mt-1'>
                            {errors.acceptAllergensForOthers}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
                    errors.specialRequests
                      ? 'border-red-500'
                      : 'border-gray-300'
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

      {/* Custom Confirmation Dialog */}
      {showConfirmDialog && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
            {/* Dialog Header */}
            <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
              <h2 className='text-xl font-semibold text-gray-800'>
                {t('grocery.form.confirmOrder', {
                  fallback: 'Confirm Your Order',
                })}
              </h2>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className='text-gray-500 hover:text-gray-700 transition-colors'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Dialog Content */}
            <div className='px-6 py-4'>
              <div className='space-y-4'>
                {/* Order Summary */}
                <h3 className='font-medium text-gray-800'>
                  {t('grocery.form.orderSummary', {
                    fallback: 'Order Summary',
                  })}
                </h3>

                <div className='bg-gray-50 p-4 rounded-lg text-sm'>
                  <div className='flex justify-between py-1'>
                    <span className='text-gray-600'>
                      {t('grocery.form.deliveryDate', {
                        fallback: 'Delivery Date',
                      })}
                    </span>
                    <span className='font-medium'>{formData.date}</span>
                  </div>
                  <div className='flex justify-between py-1'>
                    <span className='text-gray-600'>
                      {t('grocery.form.deliveryTime', {
                        fallback: 'Delivery Time',
                      })}
                    </span>
                    <span className='font-medium'>{formData.hour}</span>
                  </div>
                  <div className='flex justify-between py-1'>
                    <span className='text-gray-600'>
                      {t('grocery.form.items', { fallback: 'Items' })}
                    </span>
                    <span className='font-medium'>{selectedItems.length}</span>
                  </div>
                  <div className='flex justify-between py-1 border-t border-gray-200 mt-2 pt-2'>
                    <span className='text-gray-600'>
                      {t('grocery.form.totalPrice', {
                        fallback: 'Total Price',
                      })}
                    </span>
                    <span className='font-medium'>
                      ${currentPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Address Confirmation */}
                <div className='mt-3'>
                  <h4 className='font-medium text-gray-700'>
                    {t('grocery.form.deliveryAddress', {
                      fallback: 'Delivery Address',
                    })}
                  </h4>
                  <p className='bg-white border border-gray-200 p-3 rounded-lg mt-1 text-sm'>
                    {formData.deliveryAddress}
                  </p>
                </div>

                {/* Allergy Warning if applicable */}
                {formData.hasAllergies === 'yes' && (
                  <div className='mt-3 bg-amber-50 border border-amber-200 p-3 rounded-lg'>
                    <h4 className='font-medium text-amber-800'>
                      {t('grocery.form.allergyWarningTitle', {
                        fallback: 'Allergy Information',
                      })}
                    </h4>
                    <p className='text-sm text-amber-700 mt-1'>
                      {t('grocery.form.allergyWarningConfirm', {
                        fallback:
                          'You have indicated that you or someone has severe allergies. Please ensure all information is correct.',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dialog Footer */}
            <div className='border-t border-gray-200 px-6 py-4 flex justify-end space-x-3'>
              <button
                type='button'
                onClick={() => setShowConfirmDialog(false)}
                className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'
              >
                {t('common.back', { fallback: 'Back to Form' })}
              </button>
              <button
                type='button'
                onClick={handleConfirmedSubmit}
                className='px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition'
              >
                {t('grocery.form.confirmAndPay', {
                  fallback: 'Confirm and Pay',
                })}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroceryForm;
