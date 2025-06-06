// src/UI/components/forms/DefaultServiceForm.tsx
import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { Calendar, Clock, Users, AlertTriangle, Check, X } from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';

interface DefaultServiceFormProps {
  service: Service;
  onCancel: () => void;
}

interface FormData {
  date: string;
  time: string;
  guests: number;
  specialRequests: string;
}

const DefaultServiceForm: React.FC<DefaultServiceFormProps> = ({
  service,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    guests: 1,
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate time slots
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = t('form.errors.dateRequired', {
        fallback: 'Date is required',
      });
    }

    if (!formData.time) {
      newErrors.time = t('form.errors.timeRequired', {
        fallback: 'Time is required',
      });
    }

    if (formData.guests < 1 || formData.guests > 20) {
      newErrors.guests = t('form.errors.guestsInvalid', {
        fallback: 'Number of guests must be between 1 and 20',
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = (): number => {
    // Base service price
    let total = service.price;

    // Add extra cost for additional guests (if applicable)
    if (formData.guests > 1) {
      const extraGuestCost = service.price * 0.1; // 10% per extra guest
      total += (formData.guests - 1) * extraGuestCost;
    }

    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📝 DefaultServiceForm - Submitting reservation:', formData);

      // Create reservation data
      const reservationData = {
        service,
        formData: {
          ...formData,
          serviceType: 'default',
        },
        totalPrice: calculateTotal(),
        bookingDate: new Date(`${formData.date}T${formData.time}`),
        clientInfo: undefined, // Will be filled in the confirmation page
      };

      console.log(
        '📝 DefaultServiceForm - Reservation data created:',
        reservationData
      );

      // Store in context
      setReservationData(reservationData);

      // Navigate to confirmation page
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ DefaultServiceForm - Error submitting form:', error);
      setErrors({
        submit: t('form.errors.submitError', {
          fallback: 'Failed to submit reservation. Please try again.',
        }),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPremium = service.packageType.includes('premium');

  return (
    <div className='space-y-6'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Date and Time */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Date */}
          <div>
            <label
              htmlFor='date'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              <Calendar className='h-4 w-4 inline mr-1' />
              {t('form.date', { fallback: 'Date' })} *
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

          {/* Time */}
          <div>
            <label
              htmlFor='time'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              <Clock className='h-4 w-4 inline mr-1' />
              {t('form.time', { fallback: 'Time' })} *
            </label>
            <select
              id='time'
              name='time'
              value={formData.time}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                errors.time
                  ? 'border-red-300 focus:ring-red-500'
                  : isPremium
                  ? 'border-amber-300 focus:ring-amber-500'
                  : 'border-blue-300 focus:ring-blue-500'
              }`}
            >
              <option value=''>
                {t('form.selectTime', { fallback: 'Select time' })}
              </option>
              {generateTimeSlots().map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time && (
              <p className='mt-1 text-sm text-red-600 flex items-center'>
                <AlertTriangle className='h-4 w-4 mr-1' />
                {errors.time}
              </p>
            )}
          </div>
        </div>

        {/* Number of Guests */}
        <div>
          <label
            htmlFor='guests'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            <Users className='h-4 w-4 inline mr-1' />
            {t('form.guests', { fallback: 'Number of Guests' })} *
          </label>
          <select
            id='guests'
            name='guests'
            value={formData.guests}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
              errors.guests
                ? 'border-red-300 focus:ring-red-500'
                : isPremium
                ? 'border-amber-300 focus:ring-amber-500'
                : 'border-blue-300 focus:ring-blue-500'
            }`}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}{' '}
                {num === 1
                  ? t('form.guest', { fallback: 'guest' })
                  : t('form.guests', { fallback: 'guests' })}
              </option>
            ))}
          </select>
          {errors.guests && (
            <p className='mt-1 text-sm text-red-600 flex items-center'>
              <AlertTriangle className='h-4 w-4 mr-1' />
              {errors.guests}
            </p>
          )}
        </div>

        {/* Special Requests */}
        <div>
          <label
            htmlFor='specialRequests'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            {t('form.specialRequests', { fallback: 'Special Requests' })}
          </label>
          <textarea
            id='specialRequests'
            name='specialRequests'
            value={formData.specialRequests}
            onChange={handleInputChange}
            rows={4}
            placeholder={t('form.specialRequestsPlaceholder', {
              fallback: 'Any special requests or preferences...',
            })}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${
              isPremium
                ? 'border-amber-300 focus:ring-amber-500'
                : 'border-blue-300 focus:ring-blue-500'
            }`}
          />
        </div>

        {/* Total Price */}
        <div
          className={`p-4 rounded-lg ${
            isPremium ? 'bg-amber-50' : 'bg-blue-50'
          }`}
        >
          <div className='flex items-center justify-between'>
            <span
              className={`text-sm font-medium ${
                isPremium ? 'text-amber-800' : 'text-blue-800'
              }`}
            >
              {t('form.total', { fallback: 'Total' })}:
            </span>
            <span
              className={`text-lg font-bold ${
                isPremium ? 'text-amber-900' : 'text-blue-900'
              }`}
            >
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
          {formData.guests > 1 && (
            <p className='text-xs text-gray-600 mt-1'>
              {t('form.guestsPricing', {
                fallback: `Base price + additional charge for ${
                  formData.guests - 1
                } extra guests`,
              })}
            </p>
          )}
        </div>

        {/* Errors */}
        {errors.submit && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-sm text-red-600 flex items-center'>
              <X className='h-4 w-4 mr-1' />
              {errors.submit}
            </p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 pt-4'>
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
          >
            {t('common.cancel', { fallback: 'Cancel' })}
          </button>

          <button
            type='submit'
            disabled={isSubmitting}
            className={`flex-1 py-3 px-6 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : isPremium
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-blue-600 hover:bg-blue-700'
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
                {t('form.submitReservation', {
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

export default DefaultServiceForm;
