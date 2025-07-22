// src/UI/components/forms/GroceryForm.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  ShoppingBag,
  AlertTriangle,
  DollarSign,
  Check,
  X,
  Phone,
  User,
  MapPin as LocationIcon,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  translationKey?: string;
}

interface GroceryFormProps {
  service: Service;
  selectedItems?: GroceryItem[];
  onCancel: () => void;
}

interface FormData {
  date: string;
  hour: string;
  deliveryAddress: string;
  exactAddress: string;
  numberOfGuests: number;
  receiveTheGrocery: string;
  items: GroceryItem[];
  hasAllergies: 'yes' | 'no';
  allergyDetails: string;
  foodRestrictions: string;
  specialRequests: string;
}

// Separate validation logic
const validateFormData = (
  formData: FormData,
  t: any
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.date) {
    errors.date = t('grocery.form.errors.dateRequired', {
      fallback: 'Delivery date is required',
    });
  }

  if (!formData.hour) {
    errors.hour = t('grocery.form.errors.timeRequired', {
      fallback: 'Arrival estimate is required',
    });
  }

  if (!formData.deliveryAddress.trim()) {
    errors.deliveryAddress = t('grocery.form.errors.addressRequired', {
      fallback: 'Delivery address is required',
    });
  }

  if (!formData.receiveTheGrocery.trim()) {
    errors.receiveTheGrocery = t('grocery.form.errors.receiveTheGrocery', {
      fallback: 'Contact information is required',
    });
  }

  if (formData.numberOfGuests < 1) {
    errors.numberOfGuests = t('grocery.form.errors.guestsRequired', {
      fallback: 'Number of guests must be at least 1',
    });
  }

  if (formData.items.length === 0) {
    errors.items = t('grocery.form.errors.itemsRequired', {
      fallback: 'Please select at least one item from the grocery list',
    });
  }

  if (formData.hasAllergies === 'yes' && !formData.allergyDetails.trim()) {
    errors.allergyDetails = t('grocery.form.errors.allergyDetailsRequired', {
      fallback: 'Please specify allergy details',
    });
  }

  return errors;
};

// Utility functions
const categorizeItems = (items: GroceryItem[]) => {
  const categories: Record<
    string,
    { category: string; subcategories: Record<string, GroceryItem[]> }
  > = {};

  items.forEach((item) => {
    if (!categories[item.category]) {
      categories[item.category] = {
        category: item.category,
        subcategories: {},
      };
    }

    const subcategory = item.subcategory || 'general';
    if (!categories[item.category].subcategories[subcategory]) {
      categories[item.category].subcategories[subcategory] = [];
    }

    categories[item.category].subcategories[subcategory].push(item);
  });

  return categories;
};

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 20; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 20) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const GroceryForm: React.FC<GroceryFormProps> = ({
  service,
  selectedItems = [],
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  const [formData, setFormData] = useState<FormData>({
    date: '',
    hour: '',
    deliveryAddress: '',
    exactAddress: '',
    receiveTheGrocery: '',
    numberOfGuests: 1,
    items: selectedItems,
    hasAllergies: 'no',
    allergyDetails: '',
    foodRestrictions: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPremium = service.packageType.includes('premium');

  // Update items when selectedItems prop changes
  useEffect(() => {
    if (selectedItems && selectedItems.length > 0) {
      setFormData((prev) => {
        const currentItemIds = prev.items.map((item) => item.id).sort();
        const newItemIds = selectedItems.map((item) => item.id).sort();

        if (
          currentItemIds.length !== newItemIds.length ||
          !currentItemIds.every((id, index) => id === newItemIds[index])
        ) {
          return { ...prev, items: selectedItems };
        }
        return prev;
      });
    }
  }, [selectedItems]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    let processedValue = value;

    // Handle number inputs properly
    if (type === 'number') {
      processedValue = Math.max(1, parseInt(value) || 1).toString();
    }

    // Handle tel inputs - only allow numbers, +, -, spaces, and parentheses
    if (type === 'tel') {
      processedValue = value.replace(/[^0-9+\-\s\(\)]/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const calculateEstimatedTotal = (): number => {
    let total = service.price;
    const estimatedCostPerItem = 5;
    total += formData.items.length * estimatedCostPerItem;
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateFormData(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const reservationData = {
        service,
        formData: {
          ...formData,
          categorizedItems: categorizeItems(formData.items),
          itemCount: formData.items.length,
          serviceType: 'grocery-shopping',
        },
        totalPrice: calculateEstimatedTotal(),
        bookingDate: new Date(`${formData.date}T${formData.hour}`),
        clientInfo: undefined,
      };

      setReservationData(reservationData);
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ GroceryForm - Error submitting form:', error);
      setErrors({
        submit: t('grocery.form.errors.submitError', {
          fallback: 'Failed to submit reservation. Please try again.',
        }),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categorizedItems = categorizeItems(formData.items);

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Selected Items Summary */}
      {formData.items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            isPremium
              ? 'bg-amber-50 border-amber-200'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className='flex items-center mb-3'>
            <ShoppingBag
              className={`h-5 w-5 mr-2 ${
                isPremium ? 'text-amber-600' : 'text-blue-600'
              }`}
            />
            <h3
              className={`font-medium ${
                isPremium ? 'text-amber-800' : 'text-blue-800'
              }`}
            >
              {t('grocery.form.selectedItems', { fallback: 'Selected Items' })}{' '}
              ({formData.items.length})
            </h3>
          </div>

          <div className='space-y-2 max-h-32 overflow-y-auto'>
            {Object.entries(categorizedItems).map(
              ([categoryKey, categoryData]) => (
                <div key={categoryKey} className='text-sm'>
                  <span className='font-medium text-gray-700 capitalize'>
                    {categoryKey}:
                  </span>
                  {Object.entries(categoryData.subcategories).map(
                    ([subKey, items]) => (
                      <div key={subKey} className='ml-2 text-gray-600'>
                        {subKey !== 'general' && (
                          <span className='text-xs text-gray-500'>
                            {subKey}:{' '}
                          </span>
                        )}
                        {items.map((item, index) => (
                          <span key={item.id} className='inline-block mr-1'>
                            {t(item.translationKey || item.id, {
                              fallback: item.name,
                            })}
                            {index < items.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Date & Time Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='date'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              <Calendar className='h-4 w-4 inline mr-1' />
              {t('grocery.form.deliveryDate', { fallback: 'Delivery Date' })} *
            </label>
            <input
              type='date'
              id='date'
              name='date'
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                errors.date
                  ? 'border-red-300 focus:ring-red-500'
                  : isPremium
                  ? 'border-amber-300 focus:ring-amber-500'
                  : 'border-blue-300 focus:ring-blue-500'
              }`}
            />
            {errors.date && (
              <p className='mt-1 text-sm text-red-600 flex items-center'>
                <AlertTriangle className='h-4 w-4 mr-1' />
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='hour'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              <Clock className='h-4 w-4 inline mr-1' />
              {t('grocery.form.arrivalEstimate', {
                fallback: 'Arrival Estimate',
              })}{' '}
              *
            </label>
            <select
              id='hour'
              name='hour'
              value={formData.hour}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                errors.hour
                  ? 'border-red-300 focus:ring-red-500'
                  : isPremium
                  ? 'border-amber-300 focus:ring-amber-500'
                  : 'border-blue-300 focus:ring-blue-500'
              }`}
            >
              <option value=''>
                {t('grocery.form.selectTime', { fallback: 'Select time' })}
              </option>
              {generateTimeSlots().map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.hour && (
              <p className='mt-1 text-sm text-red-600 flex items-center'>
                <AlertTriangle className='h-4 w-4 mr-1' />
                {errors.hour}
              </p>
            )}
          </div>
        </div>

        {/* Contact & Guests Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='receiveTheGrocery'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              <Phone className='h-4 w-4 inline mr-1' />
              {t('grocery.form.receiveTheGrocery', {
                fallback: 'Who will receive the grocery shopping',
              })}{' '}
              *
            </label>
            <input
              type='tel'
              id='receiveTheGrocery'
              name='receiveTheGrocery'
              value={formData.receiveTheGrocery}
              onChange={handleInputChange}
              placeholder={t('grocery.form.receiveTheGrocery', {
                fallback: 'Provides your concierge contact number',
              })}
              pattern='[0-9+\-\s\(\)]*'
              inputMode='tel'
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                errors.receiveTheGrocery
                  ? 'border-red-300 focus:ring-red-500'
                  : isPremium
                  ? 'border-amber-300 focus:ring-amber-500'
                  : 'border-blue-300 focus:ring-blue-500'
              }`}
            />
            {errors.receiveTheGrocery && (
              <p className='mt-1 text-sm text-red-600 flex items-center'>
                <Phone className='h-4 w-4 mr-1' />
                {errors.receiveTheGrocery}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='numberOfGuests'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              <User className='h-4 w-4 inline mr-1' />
              {t('grocery.form.numberOfGuests', {
                fallback: 'Number of guests',
              })}{' '}
              *
            </label>
            <input
              type='number'
              id='numberOfGuests'
              name='numberOfGuests'
              value={formData.numberOfGuests}
              onChange={handleInputChange}
              min='1'
              max='50'
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                errors.numberOfGuests
                  ? 'border-red-300 focus:ring-red-500'
                  : isPremium
                  ? 'border-amber-300 focus:ring-amber-500'
                  : 'border-blue-300 focus:ring-blue-500'
              }`}
            />
            {errors.numberOfGuests && (
              <p className='mt-1 text-sm text-red-600 flex items-center'>
                <AlertTriangle className='h-4 w-4 mr-1' />
                {errors.numberOfGuests}
              </p>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='deliveryAddress'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              <MapPin className='h-4 w-4 inline mr-1' />
              {t('grocery.form.deliveryAddress', {
                fallback: 'Delivery Address',
              })}{' '}
              *
            </label>
            <input
              type='text'
              id='deliveryAddress'
              name='deliveryAddress'
              value={formData.deliveryAddress}
              onChange={handleInputChange}
              placeholder={t('grocery.form.addressPlaceholder', {
                fallback: 'Hotel name or general area',
              })}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                errors.deliveryAddress
                  ? 'border-red-300 focus:ring-red-500'
                  : isPremium
                  ? 'border-amber-300 focus:ring-amber-500'
                  : 'border-blue-300 focus:ring-blue-500'
              }`}
            />
            {errors.deliveryAddress && (
              <p className='mt-1 text-sm text-red-600 flex items-center'>
                <AlertTriangle className='h-4 w-4 mr-1' />
                {errors.deliveryAddress}
              </p>
            )}
          </div>
        </div>
        {/* Allergies Section */}
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h4 className='font-medium text-gray-900 mb-3'>
            {t('grocery.form.dietaryInfo', { fallback: 'Dietary Information' })}
          </h4>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('grocery.form.allergies', {
                  fallback: 'Do you have any allergies?',
                })}
              </label>
              <div className='flex space-x-6'>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    name='hasAllergies'
                    value='no'
                    checked={formData.hasAllergies === 'no'}
                    onChange={handleInputChange}
                    className={`mr-2 ${
                      isPremium ? 'text-amber-600' : 'text-blue-600'
                    }`}
                  />
                  {t('common.no', { fallback: 'No' })}
                </label>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    name='hasAllergies'
                    value='yes'
                    checked={formData.hasAllergies === 'yes'}
                    onChange={handleInputChange}
                    className={`mr-2 ${
                      isPremium ? 'text-amber-600' : 'text-blue-600'
                    }`}
                  />
                  {t('common.yes', { fallback: 'Yes' })}
                </label>
              </div>
            </div>

            {formData.hasAllergies === 'yes' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <textarea
                  name='allergyDetails'
                  value={formData.allergyDetails}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder={t('grocery.form.allergyPlaceholder', {
                    fallback: 'Please specify your allergies...',
                  })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                    errors.allergyDetails
                      ? 'border-red-300 focus:ring-red-500'
                      : isPremium
                      ? 'border-amber-300 focus:ring-amber-500'
                      : 'border-blue-300 focus:ring-blue-500'
                  }`}
                />
                {errors.allergyDetails && (
                  <p className='mt-1 text-sm text-red-600 flex items-center'>
                    <AlertTriangle className='h-4 w-4 mr-1' />
                    {errors.allergyDetails}
                  </p>
                )}
              </motion.div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='foodRestrictions'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  {t('grocery.form.foodRestrictions', {
                    fallback: 'Dietary Restrictions',
                  })}
                </label>
                <textarea
                  id='foodRestrictions'
                  name='foodRestrictions'
                  value={formData.foodRestrictions}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder={t('grocery.form.restrictionsPlaceholder', {
                    fallback: 'Vegetarian, vegan, gluten-free, etc.',
                  })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                    isPremium
                      ? 'border-amber-300 focus:ring-amber-500'
                      : 'border-blue-300 focus:ring-blue-500'
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor='specialRequests'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  {t('grocery.form.specialRequests', {
                    fallback: 'Special Requests',
                  })}
                </label>
                <textarea
                  id='specialRequests'
                  name='specialRequests'
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder={t('grocery.form.requestsPlaceholder', {
                    fallback: 'Any special requests or preferences...',
                  })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                    isPremium
                      ? 'border-amber-300 focus:ring-amber-500'
                      : 'border-blue-300 focus:ring-blue-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Estimated Total */}
        <div
          className={`p-4 rounded-lg border ${
            isPremium
              ? 'bg-amber-50 border-amber-200'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className='flex items-center justify-between mb-2'>
            <span
              className={`text-sm font-medium ${
                isPremium ? 'text-amber-800' : 'text-blue-800'
              }`}
            >
              {t('grocery.form.estimatedTotal', {
                fallback: 'Estimated Total',
              })}
              :
            </span>
            <span
              className={`text-xl font-bold ${
                isPremium ? 'text-amber-900' : 'text-blue-900'
              }`}
            >
              <DollarSign className='h-5 w-5 inline' />
              {calculateEstimatedTotal().toFixed(2)}
            </span>
          </div>
          <p className='text-xs text-gray-600'>
            {t('grocery.form.estimateNote', {
              fallback:
                'Final price will be calculated based on actual items and market prices',
            })}
          </p>
        </div>
        {/* Error Messages */}
        {errors.items && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-sm text-red-600 flex items-center'>
              <AlertTriangle className='h-4 w-4 mr-1' />
              {errors.items}
            </p>
          </div>
        )}
        {errors.submit && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-sm text-red-600 flex items-center'>
              <X className='h-4 w-4 mr-1' />
              {errors.submit}
            </p>
          </div>
        )}
        {/* Submit Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t'>
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
          >
            {t('common.cancel', { fallback: 'Cancel' })}
          </button>

          <button
            type='submit'
            disabled={isSubmitting || formData.items.length === 0}
            className={`flex-1 py-3 px-6 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
              isSubmitting || formData.items.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : isPremium
                ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                {t('common.processing', { fallback: 'Processing...' })}
              </>
            ) : (
              <>
                <Check className='h-4 w-4 mr-2' />
                {t('grocery.form.submitReservation', {
                  fallback: 'Submit Reservation',
                })}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroceryForm;
