import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Calendar,
  MapPin,
  Users,
  Baby,
  Clock,
  AlertTriangle,
  Info,
  CreditCard,
  Waves,
  Ship,
  Sun,
  Shield,
  Star,
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
  location: string;

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
  onSubmit: (
    formData: FormData & { totalPrice: number; pickupTime: string }
  ) => void;
  onCancel: () => void;
}

// Age restrictions and pricing configuration
const AGE_CONFIG = {
  FREE_AGE_LIMIT: 5, // Children 5 and under are free
  CHILD_PRICE_LIMIT: 12, // Children 6-12 have reduced price
  ADULT_PRICE: 85, // Adult price
  CHILD_PRICE: 60, // Child price (6-12 years)
  FREE_PRICE: 0, // Free for children 5 and under
};

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

const SaonaIslandForm: React.FC<SaonaIslandFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    tourDate: '',
    location: '',
    adultCount: 2,
    childCount: 0,
    children: [],
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Calculate total participants
  const totalParticipants = useMemo(() => {
    return formData.adultCount + formData.childCount;
  }, [formData.adultCount, formData.childCount]);

  // Update children array when child count changes
  useEffect(() => {
    const currentChildrenCount = formData.children.length;
    const newChildCount = formData.childCount;

    if (newChildCount > currentChildrenCount) {
      // Add new children
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
      // Remove children
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

    // Adults price
    total += formData.adultCount * AGE_CONFIG.ADULT_PRICE;

    // Children price based on age
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

  // Form validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.tourDate) {
      newErrors.tourDate = 'Tour date is required';
    }

    if (!formData.location) {
      newErrors.location = 'Pickup location is required';
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Same day booking confirmation
      if (isSameDay(formData.tourDate)) {
        if (
          !window.confirm(
            'You are booking for today. This requires immediate confirmation from our team. Continue?'
          )
        ) {
          return;
        }
      }

      onSubmit({
        ...formData,
        totalPrice: calculatePrice,
        pickupTime: TOUR_INFO.PICKUP_TIME,
      });
    }
  };

  // Generic input handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

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

  // Age restrictions component
  const AgeRestrictionsSection = () => (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
      <div className='flex items-start'>
        <Info className='w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5' />
        <div>
          <h4 className='font-medium text-blue-800 mb-2'>
            Age & Pricing Information
          </h4>
          <div className='text-sm text-blue-700 space-y-2'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-white p-3 rounded border border-blue-100'>
                <div className='font-medium text-green-600'>
                  Ages 0-{AGE_CONFIG.FREE_AGE_LIMIT}
                </div>
                <div className='text-xs'>FREE</div>
                <div className='text-xs text-gray-600'>No charge</div>
              </div>
              <div className='bg-white p-3 rounded border border-blue-100'>
                <div className='font-medium text-orange-600'>
                  Ages {AGE_CONFIG.FREE_AGE_LIMIT + 1}-
                  {AGE_CONFIG.CHILD_PRICE_LIMIT}
                </div>
                <div className='text-xs'>${AGE_CONFIG.CHILD_PRICE}</div>
                <div className='text-xs text-gray-600'>Child price</div>
              </div>
              <div className='bg-white p-3 rounded border border-blue-100'>
                <div className='font-medium text-blue-600'>Ages 13+</div>
                <div className='text-xs'>${AGE_CONFIG.ADULT_PRICE}</div>
                <div className='text-xs text-gray-600'>Adult price</div>
              </div>
            </div>
          </div>
        </div>
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
              {/* Tour Date */}
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

              {/* Pickup Time Display */}
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

          {/* Location Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Pickup Location
            </h3>

            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <MapPin className='w-4 h-4 mr-2 text-blue-700' />
                Pickup Location *
              </label>
              {/* <select
                name='location'
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full p-3 border ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
              >
                <option value=''>Select pickup location</option>
                {LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select> */}
              {errors.location && (
                <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
              )}
              <p className='text-xs text-gray-500 mt-1'>
                Exact pickup time will be confirmed 24 hours before tour
              </p>
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

          {/* Age Restrictions Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Age Restrictions & Pricing
            </h3>
            <AgeRestrictionsSection />
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
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                placeholder='Any special requests, dietary requirements, mobility assistance needs, or additional information...'
              />
            </div>
          </div>

          {/* Tour Restrictions */}
          <TourRestrictionsSection />
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
            </div>
          </div>

          <div className='flex space-x-4'>
            <button
              type='button'
              onClick={onCancel}
              className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition'
            >
              Cancel
            </button>

            <button
              type='submit'
              className='px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition flex items-center'
            >
              <Waves className='h-4 w-4 mr-2' />
              Book Tour
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SaonaIslandForm;
