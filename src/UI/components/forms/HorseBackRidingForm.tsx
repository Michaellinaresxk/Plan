import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { Service } from '@/types/type';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Baby,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  Mountain,
  CreditCard,
  Sunrise,
  Sun,
} from 'lucide-react';
import { useLocationPricing } from '@/hooks/useLocationPricing';
import { LocationSelector } from '../service/LocationSelector';
import FormHeader from './FormHeader';
import { useFormModal } from '@/hooks/useFormModal';

interface HorseBackRidingFormProps {
  service: Service;
  onSubmit?: (formData: any) => void;
  onCancel?: () => void;
}

interface FormData {
  date: string;
  timeSlot: string;
  location: string;
  participantCount: number;
  minorsCount: number;
}

interface FormErrors {
  [key: string]: string;
}

// Time slot configuration
const TIME_SLOTS = [
  {
    id: '8am',
    name: 'Morning Start',
    time: '8:00 AM',
    icon: Sunrise,
    description: 'Perfect for cooler weather',
  },
  {
    id: '10am',
    name: 'Mid-Morning',
    time: '10:00 AM',
    icon: Sun,
    description: 'Great lighting conditions',
  },
] as const;

// Transport pricing
const HORSEBACK_TRANSPORT_PRICING = {
  small: 80, // 1-6 people
  large: 120, // 7-8 people (max for safety)
  maxCapacity: 8,
};

const HorseBackRidingForm: React.FC<HorseBackRidingFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel });

  // Form state - same pattern as SaonaIslandForm
  const [formData, setFormData] = useState<FormData>({
    date: '',
    timeSlot: '',
    location: '',
    participantCount: 2,
    minorsCount: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to update form fields - same as SaonaIslandForm
  const updateFormField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Use location pricing hook
  const {
    locationOptions,
    selectedLocation,
    locationSurcharge,
    transportCost,
    totalLocationCost,
  } = useLocationPricing({
    selectedLocationId: formData.location,
    totalParticipants: formData.participantCount,
    servicePricing: HORSEBACK_TRANSPORT_PRICING,
  });

  // Calculate base price
  const basePrice = useMemo(() => {
    return service.price * formData.participantCount;
  }, [formData.participantCount, service.price]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return basePrice + totalLocationCost;
  }, [basePrice, totalLocationCost]);

  // Generic input handler - same as SaonaIslandForm
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      updateFormField(name, value);
    },
    [updateFormField]
  );

  // Handle location selection - same pattern as SaonaIslandForm
  const handleLocationSelect = useCallback(
    (locationId: string) => {
      updateFormField('location', locationId);
    },
    [updateFormField]
  );

  // Counter handlers - same pattern as SaonaIslandForm
  const createCounterHandler = (field: keyof FormData, min = 0, max = 8) => ({
    increment: () =>
      setFormData((prev) => ({
        ...prev,
        [field]: Math.min(max, (prev[field] as number) + 1),
      })),
    decrement: () =>
      setFormData((prev) => ({
        ...prev,
        [field]: Math.max(min, (prev[field] as number) - 1),
      })),
  });

  const participantCounter = createCounterHandler('participantCount', 1);

  // Update minors count when participant count changes
  useEffect(() => {
    if (formData.minorsCount > formData.participantCount) {
      setFormData((prev) => ({
        ...prev,
        minorsCount: Math.min(prev.minorsCount, prev.participantCount),
      }));
    }
  }, [formData.participantCount]);

  // Validation function - exact same pattern as SaonaIslandForm
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.location) {
      newErrors.location = 'Please select a pickup location';
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Please select a time slot';
    }

    // Participant validation
    if (formData.participantCount < 1) {
      newErrors.participantCount = 'At least one participant is required';
    }

    if (formData.participantCount > 8) {
      newErrors.participantCount = 'Maximum 8 participants allowed for safety';
    }

    if (formData.minorsCount > formData.participantCount) {
      newErrors.minorsCount =
        'Number of minors cannot exceed total participants';
    }

    return newErrors;
  };

  // Submit handler - exact same pattern as SaonaIslandForm
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ HorseBackForm - Validation errors:', validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDate = new Date(formData.date);
      const bookingStartDate = new Date(selectedDate);
      const bookingEndDate = new Date(selectedDate);

      // Set times based on time slot
      switch (formData.timeSlot) {
        case '8am':
          bookingStartDate.setHours(8, 0, 0, 0);
          bookingEndDate.setHours(11, 0, 0, 0);
          break;
        case '10am':
          bookingStartDate.setHours(10, 0, 0, 0);
          bookingEndDate.setHours(13, 0, 0, 0);
          break;
      }

      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'horseback-riding',
          totalPrice,
          basePrice,
          transportCost,
          locationSurcharge,
          locationName: selectedLocation?.name || formData.location,
        },
        totalPrice,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: formData.participantCount - formData.minorsCount,
          children: formData.minorsCount,
          total: formData.participantCount,
        },
        selectedItems: [
          {
            id: 'horseback-classic',
            name: 'Horseback Riding Adventure',
            quantity: 1,
            price: totalPrice,
            totalPrice,
            timeSlot: formData.timeSlot,
            location: selectedLocation?.name || formData.location,
          },
        ],
        clientInfo: undefined,
        horsebackSpecifics: {
          timeSlot: formData.timeSlot,
          location: formData.location,
          locationName: selectedLocation?.name || formData.location,
          participantCount: formData.participantCount,
          minorsCount: formData.minorsCount,
          pricing: {
            basePrice,
            transportCost,
            locationSurcharge,
            totalPrice,
          },
        },
      };

      console.log(
        '🐎 HorseBackForm - Reservation data created:',
        reservationData
      );

      setReservationData(reservationData);

      if (onSubmit) {
        await onSubmit(reservationData);
      }

      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ HorseBackForm - Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Counter component - same as SaonaIslandForm
  const Counter = ({
    label,
    value,
    onIncrement,
    onDecrement,
    icon: Icon,
    min = 0,
    max = 8,
  }: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    icon: React.ElementType;
    min?: number;
    max?: number;
  }) => (
    <div>
      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
        <Icon className='w-4 h-4 mr-2 text-amber-600' />
        {label}
      </label>
      <div className='flex border border-gray-300 rounded-lg overflow-hidden bg-white'>
        <button
          type='button'
          onClick={onDecrement}
          disabled={value <= min}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50'
        >
          -
        </button>
        <div className='flex-1 py-2 text-center font-medium'>{value}</div>
        <button
          type='button'
          onClick={onIncrement}
          disabled={value >= max}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50'
        >
          +
        </button>
      </div>
      {value >= max && (
        <p className='text-xs text-amber-600 mt-1'>
          Maximum {max} participants allowed
        </p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
        <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
          {/* Form Header */}
          <FormHeader
            title='Horseback Riding Adventure'
            subtitle='Experience the magic of riding along pristine Macao Beach'
            icon={Mountain}
            isPremium={false}
            onCancel={handleClose}
            showCloseButton={true}
          />

          {/* Form Body */}
          <div className='p-8 space-y-8'>
            {/* Date and Time Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                Schedule Your Adventure
              </h3>

              {/* Date Selection */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-amber-600' />
                  Select Date *
                </label>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
                )}
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 mr-2 text-amber-600' />
                  Time Slot *
                </label>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {TIME_SLOTS.map((slot) => {
                    const IconComponent = slot.icon;
                    return (
                      <div
                        key={slot.id}
                        className={`
                          border rounded-lg p-4 cursor-pointer transition-all
                          ${
                            formData.timeSlot === slot.id
                              ? 'bg-amber-50 border-amber-300 shadow-sm'
                              : 'border-gray-200 hover:bg-gray-50'
                          }
                        `}
                        onClick={() => updateFormField('timeSlot', slot.id)}
                      >
                        <div className='flex items-center'>
                          <div
                            className={`
                            w-5 h-5 rounded-full border flex items-center justify-center mr-3
                            ${
                              formData.timeSlot === slot.id
                                ? 'border-amber-500 bg-amber-500'
                                : 'border-gray-300'
                            }
                          `}
                          >
                            {formData.timeSlot === slot.id && (
                              <CheckCircle className='w-4 h-4 text-white' />
                            )}
                          </div>
                          <div className='flex items-center'>
                            <IconComponent className='w-5 h-5 mr-2 text-amber-500' />
                            <span className='font-medium'>{slot.name}</span>
                          </div>
                        </div>
                        <p className='text-gray-500 text-sm mt-2 ml-8'>
                          {slot.time}
                        </p>
                        <p className='text-gray-400 text-xs mt-1 ml-8'>
                          {slot.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {errors.timeSlot && (
                  <p className='text-red-500 text-xs mt-1'>{errors.timeSlot}</p>
                )}
              </div>
            </div>

            {/* Location Selection */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                Pickup Location
              </h3>

              <LocationSelector
                selectedLocationId={formData.location}
                onLocationSelect={handleLocationSelect}
                locationOptions={locationOptions}
                error={errors.location}
                isPremium={false}
              />
            </div>

            {/* Participants Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                Participants (Maximum 8)
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Counter
                  label='Total Participants'
                  value={formData.participantCount}
                  onIncrement={participantCounter.increment}
                  onDecrement={participantCounter.decrement}
                  icon={Users}
                  min={1}
                  max={8}
                />

                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Baby className='w-4 h-4 mr-2 text-amber-600' />
                    Number of participants under 18
                  </label>
                  <input
                    type='number'
                    name='minorsCount'
                    min='0'
                    max={formData.participantCount}
                    value={formData.minorsCount}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${
                      errors.minorsCount ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
                    placeholder='0'
                  />
                  {errors.minorsCount && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.minorsCount}
                    </p>
                  )}

                  {formData.minorsCount > 0 && (
                    <div className='flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200 mt-3'>
                      <Info className='h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0' />
                      <p className='text-xs text-blue-700'>
                        Children under 6 must be accompanied by an adult.
                        Minimum age is 6 years for solo riding.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Safety Information */}
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <div className='flex items-start'>
                <AlertTriangle className='w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5' />
                <div>
                  <h4 className='font-medium text-red-800 mb-2'>
                    Safety Requirements & Restrictions
                  </h4>
                  <ul className='text-sm text-red-700 space-y-1'>
                    <li>• Minimum age: 6 years old (with adult supervision)</li>
                    <li>• Maximum weight: 300 lbs (136 kg)</li>
                    <li>• Closed-toe shoes required (no sandals)</li>
                    <li>• Not recommended for pregnant women</li>
                    <li>• Weather dependent - may be rescheduled</li>
                    <li>• All riders must follow guide instructions</li>
                    <li>• Maximum 8 participants per group for safety</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-800 text-sm'>{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Form Footer */}
          <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
            <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
              <span className='text-gray-400 text-sm uppercase tracking-wide'>
                Total Price
              </span>
              <div className='flex items-center mt-1'>
                <span className='text-3xl font-light'>
                  ${totalPrice.toFixed(2)}
                </span>
                <span className='ml-2 text-sm bg-amber-800 px-2 py-1 rounded'>
                  {formData.participantCount}{' '}
                  {formData.participantCount === 1 ? 'person' : 'people'}
                </span>
              </div>

              {/* Price breakdown */}
              <div className='text-xs text-gray-400 mt-2 space-y-1'>
                <div className='text-amber-400 font-medium'>
                  Classic Beach Adventure
                </div>
                <div>Package: ${basePrice.toFixed(2)}</div>
                <div>Transport: ${transportCost.toFixed(2)}</div>
                {locationSurcharge > 0 && (
                  <div>Location: +${locationSurcharge.toFixed(2)}</div>
                )}
                {selectedLocation && (
                  <div className='text-amber-400'>
                    Pickup: {selectedLocation.name}
                  </div>
                )}
              </div>
            </div>

            <div className='flex space-x-4'>
              <button
                type='button'
                onClick={onCancel}
                disabled={isSubmitting}
                className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition disabled:opacity-50'
              >
                Cancel
              </button>

              <button
                type='submit'
                disabled={isSubmitting || formData.participantCount > 8}
                className='px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition flex items-center disabled:opacity-50'
              >
                <CreditCard className='h-4 w-4 mr-2' />
                {isSubmitting ? 'Booking...' : 'Book Adventure'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default HorseBackRidingForm;
