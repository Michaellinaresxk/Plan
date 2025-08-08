import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { Service } from '@/types/type';
import {
  Calendar,
  MapPin,
  Users,
  Baby,
  Clock,
  AlertTriangle,
  Info,
  Waves,
  Star,
  CheckCircle,
} from 'lucide-react';

// Types for better type safety
interface ChildInfo {
  id: string;
  age: number;
  hasCharge: boolean;
}

interface FormData {
  // Tour details
  tourDate: string;
  location: string; // ✅ Now stores location ID instead of free text

  // Participants
  adultCount: number;
  childCount: number;
  children: ChildInfo[];

  // Additional options
  specialRequests: string;
}

interface FormErrors {
  [key: string]: string;
}

interface SaonaIslandFormProps {
  service: Service;
  onSubmit?: (
    formData: FormData & { totalPrice: number; pickupTime: string }
  ) => void;
  onCancel: () => void;
}

// ✅ Location options configuration - same as BabysitterForm
const LOCATION_OPTIONS = [
  { id: 'punta-cana-resorts', name: 'Punta Cana Resorts' },
  { id: 'cap-cana', name: 'Cap Cana' },
  { id: 'bavaro', name: 'Bavaro' },
  { id: 'punta-village', name: 'Punta Village' },
] as const;

// Age restrictions and pricing configuration
const AGE_CONFIG = {
  FREE_AGE_LIMIT: 5,
  CHILD_PRICE_LIMIT: 12,
  ADULT_PRICE: 85,
  CHILD_PRICE: 60,
  FREE_PRICE: 0,
};

const SaonaIslandForm: React.FC<SaonaIslandFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  // Tour information
  const TOUR_INFO = {
    PICKUP_TIME: '7:30 AM',
    DURATION: '8-9 hours',
    INCLUDES: [
      'Round-trip transportation',
      'Catamaran ride',
      'Natural pool swimming',
      'Beach time at Saona Island',
      'Buffet lunch',
      'Open bar (local drinks)',
      'Snorkeling equipment',
      'Life jackets',
    ],
    RESTRICTIONS: [
      'Not recommended for pregnant women',
      'Not suitable for people with mobility issues',
      'Minimum age: No restrictions (babies welcome)',
      'Children must be supervised at all times',
    ],
  };

  // ✅ Fixed: Form state with proper initial values
  const [formData, setFormData] = useState<FormData>({
    tourDate: '',
    location: '', // ✅ Fixed: Now properly initialized as empty string
    adultCount: 2,
    childCount: 0,
    children: [],
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Helper to update form fields - optimized like BabysitterForm
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

  // ✅ Handle location selection - same logic as BabysitterForm
  const handleLocationSelect = useCallback(
    (locationId: string) => {
      updateFormField('location', locationId);
    },
    [updateFormField]
  );

  // Calculate total participants
  const totalParticipants = useMemo(() => {
    return formData.adultCount + formData.childCount;
  }, [formData.adultCount, formData.childCount]);

  // Update children array when child count changes
  useEffect(() => {
    const currentChildrenCount = formData.children.length;
    const newChildCount = formData.childCount;

    if (newChildCount > currentChildrenCount) {
      const newChildren = [...formData.children];
      for (let i = currentChildrenCount; i < newChildCount; i++) {
        const defaultAge = 8;
        newChildren.push({
          id: `child-${i + 1}`,
          age: defaultAge,
          hasCharge: defaultAge > AGE_CONFIG.FREE_AGE_LIMIT,
        });
      }
      setFormData((prev) => ({ ...prev, children: newChildren }));
    } else if (newChildCount < currentChildrenCount) {
      setFormData((prev) => ({
        ...prev,
        children: prev.children.slice(0, newChildCount),
      }));
    }
  }, [formData.childCount]);

  // Calculate pricing for children
  const calculateChildPrice = (age: number): number => {
    if (age <= AGE_CONFIG.FREE_AGE_LIMIT) {
      return AGE_CONFIG.FREE_PRICE;
    } else if (age <= AGE_CONFIG.CHILD_PRICE_LIMIT) {
      return AGE_CONFIG.CHILD_PRICE;
    } else {
      return AGE_CONFIG.ADULT_PRICE;
    }
  };

  // Calculate total price
  const calculatePrice = useMemo(() => {
    let total = 0;
    total += formData.adultCount * AGE_CONFIG.ADULT_PRICE;
    formData.children.forEach((child) => {
      total += calculateChildPrice(child.age);
    });
    return total;
  }, [formData.adultCount, formData.children]);

  // Date validation helpers
  const isSameDay = (dateString: string): boolean => {
    if (!dateString) return false;
    const today = new Date();
    const selectedDate = new Date(dateString);
    return today.toDateString() === selectedDate.toDateString();
  };

  const hasMinimum24Hours = (dateString: string): boolean => {
    if (!dateString) return false;
    const now = new Date();
    const selectedDate = new Date(dateString);
    const differenceMs = selectedDate.getTime() - now.getTime();
    const hours = differenceMs / (1000 * 60 * 60);
    return hours >= 24;
  };

  // ✅ Updated validation to check location ID like BabysitterForm
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.tourDate) {
      newErrors.tourDate = 'Tour date is required';
    }

    // ✅ Updated: Validate location ID instead of free text
    if (!formData.location) {
      newErrors.location = 'Please select a pickup location';
    }

    // Date validations
    if (
      formData.tourDate &&
      !isSameDay(formData.tourDate) &&
      !hasMinimum24Hours(formData.tourDate)
    ) {
      newErrors.tourDate = 'Bookings must be made at least 24 hours in advance';
    }

    // Participant validation
    if (totalParticipants < 1) {
      newErrors.adultCount = 'At least one participant is required';
    }

    // Children age validation
    formData.children.forEach((child, index) => {
      if (child.age < 0 || child.age > 17) {
        newErrors[`child-${index}-age`] = 'Child age must be between 0 and 17';
      }
    });

    return newErrors;
  };

  // ✅ Updated submit handler to include location name like BabysitterForm
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ SaonaForm - Validation errors:', validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSameDay(formData.tourDate)) {
        if (
          !window.confirm(
            'You are booking for today. This requires immediate confirmation from our team. Continue?'
          )
        ) {
          setIsSubmitting(false);
          return;
        }
      }

      const selectedDate = new Date(formData.tourDate);
      const bookingStartDate = new Date(selectedDate);
      bookingStartDate.setHours(7, 30, 0, 0);
      const bookingEndDate = new Date(selectedDate);
      bookingEndDate.setHours(18, 30, 0, 0);

      // ✅ Get selected location name like BabysitterForm
      const selectedLocation = LOCATION_OPTIONS.find(
        (loc) => loc.id === formData.location
      );

      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'saona-island',
          totalPrice: calculatePrice,
          pickupTime: TOUR_INFO.PICKUP_TIME,
          // ✅ Add location name for display
          locationName: selectedLocation?.name || formData.location,
        },
        totalPrice: calculatePrice,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: formData.adultCount,
          children: formData.childCount,
          total: totalParticipants,
        },
        selectedItems: [
          {
            id: 'saona-island-tour',
            name: 'Saona Island Tour',
            quantity: 1,
            price: calculatePrice,
            totalPrice: calculatePrice,
            pickupTime: TOUR_INFO.PICKUP_TIME,
            duration: TOUR_INFO.DURATION,
          },
        ],
        clientInfo: undefined,
        // ✅ Updated with location details
        saonaSpecifics: {
          pickupTime: TOUR_INFO.PICKUP_TIME,
          duration: TOUR_INFO.DURATION,
          adultCount: formData.adultCount,
          childCount: formData.childCount,
          children: formData.children,
          specialRequests: formData.specialRequests,
          includes: TOUR_INFO.INCLUDES,
          restrictions: TOUR_INFO.RESTRICTIONS,
          // ✅ Add location details like BabysitterForm
          location: formData.location,
          locationName: selectedLocation?.name || formData.location,
        },
      };

      console.log('🏝️ SaonaForm - Reservation data created:', reservationData);
      console.log('📍 Selected location:', selectedLocation);

      setReservationData(reservationData);

      if (onSubmit) {
        await onSubmit({
          ...formData,
          totalPrice: calculatePrice,
          pickupTime: TOUR_INFO.PICKUP_TIME,
        });
      }

      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ SaonaForm - Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generic input handler
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      updateFormField(name, value);
    },
    [updateFormField]
  );

  // Counter handlers
  const createCounterHandler = (field: keyof FormData, min = 0, max = 20) => ({
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

  const adultCounter = createCounterHandler('adultCount', 1);
  const childCounter = createCounterHandler('childCount', 0);

  // Child age handler
  const handleChildAgeChange = (childId: string, age: number) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((child) =>
        child.id === childId
          ? {
              ...child,
              age,
              hasCharge: age > AGE_CONFIG.FREE_AGE_LIMIT,
            }
          : child
      ),
    }));
  };

  // Counter component
  const Counter = ({
    label,
    value,
    onIncrement,
    onDecrement,
    icon: Icon,
    min = 0,
  }: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    icon: React.ElementType;
    min?: number;
  }) => (
    <div>
      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
        <Icon className='w-4 h-4 mr-2 text-blue-700' />
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
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
        >
          +
        </button>
      </div>
    </div>
  );

  // Tour restrictions component
  const TourRestrictionsSection = () => (
    <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
      <div className='flex items-start'>
        <AlertTriangle className='w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5' />
        <div>
          <h4 className='font-medium text-amber-800 mb-2'>
            Tour Restrictions & Important Information
          </h4>
          <ul className='text-sm text-amber-700 space-y-1'>
            {TOUR_INFO.RESTRICTIONS.map((restriction, index) => (
              <li key={index}>• {restriction}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-800 via-blue-700 to-cyan-800 p-6 text-white'>
          <h2 className='text-2xl font-light tracking-wide'>
            Saona Island Tour Booking
          </h2>
          <p className='text-blue-100 mt-1 font-light'>
            Paradise adventure with catamaran, natural pools, and pristine
            beaches
          </p>
          <div className='mt-3 flex items-center text-blue-100 text-sm'>
            <Clock className='w-4 h-4 mr-2' />
            Pickup: {TOUR_INFO.PICKUP_TIME} | Duration: {TOUR_INFO.DURATION}
          </div>
        </div>

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Tour Date Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Tour Date
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-blue-700' />
                  Select Tour Date *
                </label>
                <input
                  type='date'
                  name='tourDate'
                  value={formData.tourDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.tourDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.tourDate && (
                  <p className='text-red-500 text-xs mt-1'>{errors.tourDate}</p>
                )}
              </div>

              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 mr-2 text-blue-700' />
                  Pickup Time
                </label>
                <div className='w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600'>
                  {TOUR_INFO.PICKUP_TIME} (Fixed)
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  Pickup time is fixed for all participants
                </p>
              </div>
            </div>

            {/* Booking timing warnings */}
            {formData.tourDate && (
              <div className='mt-4'>
                {isSameDay(formData.tourDate) ? (
                  <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
                    <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
                    <div className='text-sm text-amber-800'>
                      <strong>Same-day booking:</strong> Requires immediate
                      confirmation from our team. Subject to availability.
                    </div>
                  </div>
                ) : !hasMinimum24Hours(formData.tourDate) ? (
                  <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-start'>
                    <AlertTriangle className='w-4 h-4 text-red-600 mr-2 mt-0.5' />
                    <div className='text-sm text-red-800'>
                      <strong>Advance booking required:</strong> Please book at
                      least 24 hours in advance.
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* ✅ Updated Location Section - Using card selection like BabysitterForm */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Pickup Location
            </h3>

            <div className='bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-blue-800 mb-4'>
                <MapPin className='w-5 h-5 mr-2 text-blue-600' />
                Select your pickup location *
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {LOCATION_OPTIONS.map((location) => (
                  <div
                    key={location.id}
                    className={`
                      border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
                      ${
                        formData.location === location.id
                          ? 'border-blue-500 bg-white shadow-lg ring-2 ring-blue-200'
                          : 'border-blue-200 bg-white hover:border-blue-300 hover:bg-blue-25'
                      }
                    `}
                    onClick={() => handleLocationSelect(location.id)}
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all
                          ${
                            formData.location === location.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-blue-300'
                          }
                        `}
                      >
                        {formData.location === location.id && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <MapPin className='w-4 h-4 mr-2 text-blue-500' />
                        <span className='font-medium text-blue-900 text-sm'>
                          {location.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.location && (
                <p className='text-red-500 text-xs mt-3 flex items-center'>
                  <AlertTriangle className='w-3 h-3 mr-1' />
                  {errors.location}
                </p>
              )}

              {/* Display selected location */}
              {formData.location && (
                <div className='mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200'>
                  <p className='text-sm text-blue-800 flex items-center'>
                    <CheckCircle className='w-4 h-4 mr-2 text-blue-600' />
                    Selected pickup location:{' '}
                    <span className='font-medium ml-1'>
                      {
                        LOCATION_OPTIONS.find(
                          (loc) => loc.id === formData.location
                        )?.name
                      }
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Participants Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Participants
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Counter
                label='Adults (13+)'
                value={formData.adultCount}
                onIncrement={adultCounter.increment}
                onDecrement={adultCounter.decrement}
                icon={Users}
                min={1}
              />

              <Counter
                label='Children (0-17)'
                value={formData.childCount}
                onIncrement={childCounter.increment}
                onDecrement={childCounter.decrement}
                icon={Baby}
              />
            </div>

            {/* Children Details */}
            {formData.childCount > 0 && (
              <div className='space-y-4'>
                <h4 className='font-medium text-gray-800'>Children Details</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {formData.children.map((child, index) => {
                    const price = calculateChildPrice(child.age);
                    const priceLabel =
                      price === 0
                        ? 'Free'
                        : price === AGE_CONFIG.CHILD_PRICE
                        ? 'Child Price'
                        : 'Adult Price';

                    return (
                      <div key={child.id} className='p-4 bg-gray-50 rounded-lg'>
                        <div className='flex items-center justify-between mb-2'>
                          <label className='text-sm font-medium text-gray-700'>
                            Child {index + 1} Age
                          </label>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              price === 0
                                ? 'bg-green-100 text-green-800'
                                : price === AGE_CONFIG.CHILD_PRICE
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            ${price} - {priceLabel}
                          </span>
                        </div>
                        <select
                          value={child.age}
                          onChange={(e) =>
                            handleChildAgeChange(
                              child.id,
                              parseInt(e.target.value)
                            )
                          }
                          className='w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500'
                        >
                          {Array.from({ length: 18 }, (_, i) => i).map(
                            (age) => (
                              <option key={age} value={age}>
                                {age === 0
                                  ? 'Baby (under 1)'
                                  : `${age} years old`}
                              </option>
                            )
                          )}
                        </select>
                        {errors[`child-${index}-age`] && (
                          <p className='text-red-500 text-xs mt-1'>
                            {errors[`child-${index}-age`]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Total participants display */}
            <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm text-blue-800'>
                <strong>Total participants:</strong> {totalParticipants} (
                {formData.adultCount} adults + {formData.childCount} children)
              </p>
            </div>
          </div>

          {/* What's Included Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              What's Included
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {TOUR_INFO.INCLUDES.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center text-sm text-gray-700'
                >
                  <Star className='w-4 h-4 text-yellow-500 mr-2 flex-shrink-0' />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Special Requests Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Additional Information
            </h3>

            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <Info className='w-4 h-4 mr-2 text-blue-700' />
                Special Requests or Dietary Requirements
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50'
                placeholder='Any special requests, dietary requirements, mobility assistance needs, or additional information...'
              />
            </div>
          </div>

          {/* Tour Restrictions */}
          <TourRestrictionsSection />

          {/* Error Display */}
          {errors.submit && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-800 text-sm'>{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Footer with Price and Actions */}
        <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
          <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
            <span className='text-gray-400 text-sm uppercase tracking-wide'>
              Total Price
            </span>
            <div className='flex items-center mt-1'>
              <span className='text-3xl font-light'>
                ${calculatePrice.toFixed(2)}
              </span>
              <span className='ml-2 text-sm bg-blue-800 px-2 py-1 rounded'>
                {totalParticipants}{' '}
                {totalParticipants === 1 ? 'person' : 'people'}
              </span>
            </div>

            {/* Price breakdown */}
            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              <div>
                Adults: {formData.adultCount} × ${AGE_CONFIG.ADULT_PRICE} = $
                {formData.adultCount * AGE_CONFIG.ADULT_PRICE}
              </div>
              {formData.children.map((child, index) => {
                const price = calculateChildPrice(child.age);
                return (
                  <div key={child.id}>
                    Child {index + 1} ({child.age} years): ${price}
                  </div>
                );
              })}
              {/* ✅ Display selected location in price breakdown */}
              {formData.location && (
                <div className='text-blue-400'>
                  Pickup from:{' '}
                  {
                    LOCATION_OPTIONS.find((loc) => loc.id === formData.location)
                      ?.name
                  }
                </div>
              )}
              <div className='text-blue-400'>
                Includes: Transportation, catamaran, lunch, open bar & equipment
              </div>
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
              disabled={isSubmitting}
              className='px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition flex items-center disabled:opacity-50'
            >
              <Waves className='h-4 w-4 mr-2' />
              {isSubmitting ? 'Booking...' : 'Book Tour'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SaonaIslandForm;
