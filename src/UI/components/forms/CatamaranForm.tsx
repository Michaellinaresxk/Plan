import React, { useState, useEffect, useMemo } from 'react';
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
  Star,
  Check,
  Crown,
  Anchor,
  Sun,
  Music,
  Ship,
} from 'lucide-react';
import { useFormModal } from '@/hooks/useFormModal';
import FormHeader from './FormHeader';
import { LOCATION_OPTIONS } from '@/constants/location/location';

// Age restrictions and pricing configuration
const AGE_CONFIG = {
  FREE_AGE_LIMIT: 5, // Children 5 and under are free
  CHILD_PRICE_LIMIT: 12, // Children 6-12 have reduced price
  CHILD_DISCOUNT: 0.3, // 30% discount for children
  FREE_PRICE: 0, // Free for children 5 and under
};

interface ChildInfo {
  id: string;
  age: number;
  hasCharge: boolean;
}

interface SelectedCatamaran {
  id: string;
  name: string;
  category?: string;
  description?: string;
  image?: string;
  pricing?: {
    minimumRate: number;
    baseGroupSize: number;
    additionalPersonRate: number;
    currency: string;
  };
  timeSlots?: Array<{ id: string; time: string }>;
  duration?: string;
  includes?: string[];
  destinations?: string[];
  features?: string[];
  highlights?: string[];
  notes?: string;
  capacity?: number;
}

interface FormData {
  // Tour details
  tourDate: string;
  location: string;
  timeSlot: string;

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

interface CatamaranFormProps {
  service: Service;
  selectedCatamaran: SelectedCatamaran;
  onSubmit?: (
    formData: FormData & {
      totalPrice: number;
      catamaranDetails: SelectedCatamaran;
    }
  ) => void;
  onCancel: () => void;
}

// Real pricing calculation using catamaran's actual pricing structure
const calculateRealPrice = (
  catamaran: SelectedCatamaran,
  groupSize: number
): number => {
  if (!catamaran?.pricing) {
    console.warn('CatamaranForm: Pricing data missing, using fallback');
    return groupSize * 89; // Fallback price
  }

  const { minimumRate, baseGroupSize, additionalPersonRate } =
    catamaran.pricing;

  if (groupSize <= baseGroupSize) {
    return minimumRate;
  }

  const additionalPeople = groupSize - baseGroupSize;
  return minimumRate + additionalPeople * additionalPersonRate;
};

// Time slots - using real catamaran time slots or fallback
const getTimeSlots = (catamaran: SelectedCatamaran) => {
  if (
    catamaran &&
    catamaran.timeSlots &&
    Array.isArray(catamaran.timeSlots) &&
    catamaran.timeSlots.length > 0
  ) {
    return catamaran.timeSlots.map((slot) => ({
      id: slot.id,
      time: slot.time,
      label: slot.time,
    }));
  }

  // Fallback time slots
  return [
    { id: 'morning', time: '8:30 AM - 11:30 AM', label: 'Morning Adventure' },
    { id: 'midday', time: '11:30 AM - 2:30 PM', label: 'Midday Experience' },
    {
      id: 'afternoon',
      time: '2:30 PM - 5:30 PM',
      label: 'Afternoon Adventure',
    },
  ];
};

// Tour information
const TOUR_INFO = {
  DURATION: '3 hours',
  RESTRICTIONS: [
    'Not recommended for pregnant women',
    'Children under 8 cannot use the water slide (Premium options)',
    'Minimum age: No restrictions (babies welcome)',
    'Children must be supervised at all times',
    'Weather dependent - may be rescheduled',
  ],
};

const CatamaranForm: React.FC<CatamaranFormProps> = ({
  service,
  selectedCatamaran,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel });

  // Get time slots for selected catamaran
  const timeSlots = useMemo(
    () => getTimeSlots(selectedCatamaran),
    [selectedCatamaran]
  );

  // Form state
  const [formData, setFormData] = useState<FormData>({
    tourDate: '',
    location: '',
    timeSlot: timeSlots[0]?.id || 'morning',
    adultCount: 2,
    childCount: 0,
    children: [],
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total participants - memoized for performance
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

  // Calculate pricing for children using REAL pricing
  const calculateChildPrice = (age: number): number => {
    if (age <= AGE_CONFIG.FREE_AGE_LIMIT) {
      return AGE_CONFIG.FREE_PRICE;
    } else if (age <= AGE_CONFIG.CHILD_PRICE_LIMIT) {
      if (!selectedCatamaran?.pricing?.minimumRate) {
        return Math.round(89 * (1 - AGE_CONFIG.CHILD_DISCOUNT)); // Fallback
      }
      return Math.round(
        selectedCatamaran.pricing.minimumRate * (1 - AGE_CONFIG.CHILD_DISCOUNT)
      );
    } else {
      return Math.round(calculateRealPrice(selectedCatamaran, 1));
    }
  };

  // Calculate total price using REAL pricing structure - memoized for performance
  const calculatePrice = useMemo(() => {
    // Use real pricing calculation
    const basePrice = calculateRealPrice(
      selectedCatamaran,
      formData.adultCount
    );

    // Add children prices
    let childrenTotal = 0;
    formData.children.forEach((child) => {
      childrenTotal += calculateChildPrice(child.age);
    });

    return basePrice + childrenTotal;
  }, [formData.adultCount, formData.children, selectedCatamaran]);

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

    // Catamaran validation
    if (!selectedCatamaran) {
      newErrors.selectedCatamaran = 'Catamaran selection is required';
    }

    // Required fields validation
    if (!formData.tourDate) {
      newErrors.tourDate = 'Tour date is required';
    }

    if (!formData.location) {
      newErrors.location = 'Pickup location is required';
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Time slot is required';
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

    // Capacity validation
    const maxCapacity = selectedCatamaran?.capacity || 50;
    if (totalParticipants > maxCapacity) {
      newErrors.adultCount = `Maximum capacity is ${maxCapacity} people. Please reduce participants.`;
    }

    // Children age validation
    formData.children.forEach((child, index) => {
      if (child.age < 0 || child.age > 17) {
        newErrors[`child-${index}-age`] = 'Child age must be between 0 and 17';
      }
    });

    return newErrors;
  };

  // Handle form submission - Fixed version based on LuxCatamaranForm
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug logging
    console.log('🛥️ CatamaranForm - Submit started with:', {
      selectedCatamaran,
      formData,
      totalPrice: calculatePrice,
    });

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ CatamaranForm - Validation errors:', validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Same day booking confirmation
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

      // Get selected time slot
      const selectedTimeSlot = timeSlots.find(
        (slot) => slot.id === formData.timeSlot
      );
      const pickupTime =
        selectedTimeSlot?.time || timeSlots[0]?.time || '9:00 AM';

      // Create booking date properly
      const selectedDate = new Date(formData.tourDate);

      // Set pickup time - improved parsing
      const timeString = pickupTime.split(' - ')[0] || pickupTime; // Get start time only
      const [time, period] = timeString.split(' ');
      const [hours, minutes] = time.split(':').map(Number);

      const bookingStartDate = new Date(selectedDate);
      bookingStartDate.setHours(
        period === 'PM' && hours !== 12
          ? hours + 12
          : hours === 12 && period === 'AM'
          ? 0
          : hours,
        minutes || 0,
        0,
        0
      );

      // Set end time
      const bookingEndDate = new Date(bookingStartDate);
      const duration = selectedCatamaran?.duration || TOUR_INFO.DURATION;
      const durationHours = duration.includes('3') ? 3 : 4; // Parse duration
      bookingEndDate.setHours(bookingStartDate.getHours() + durationHours);

      // Create reservation data - Simplified structure like LuxCatamaranForm
      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'catamaran-tour',
          totalPrice: calculatePrice,
          catamaranDetails: selectedCatamaran,
          pickupTime: pickupTime,
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
            id: `catamaran-${selectedCatamaran.id}`,
            name: selectedCatamaran?.name || 'Catamaran Experience',
            quantity: 1,
            price: calculatePrice,
            totalPrice: calculatePrice,
            pickupTime: pickupTime,
            duration: selectedCatamaran?.duration || TOUR_INFO.DURATION,
          },
        ],
        clientInfo: undefined,
        // Simplified catamaran-specific data
        catamaranSpecifics: {
          catamaranType: selectedCatamaran.id,
          catamaranName: selectedCatamaran?.name || 'Catamaran',
          category: selectedCatamaran?.category,
          hasWaterSlide:
            selectedCatamaran?.features?.includes('Water Slide') || false,
          capacity: selectedCatamaran?.capacity || 50,
          basePrice: selectedCatamaran?.pricing?.minimumRate || 89,
          pickupTime: pickupTime,
          timeSlot: formData.timeSlot,
          duration: selectedCatamaran?.duration || TOUR_INFO.DURATION,
          adultCount: formData.adultCount,
          childCount: formData.childCount,
          children: formData.children,
          specialRequests: formData.specialRequests,
          features: selectedCatamaran?.includes || [],
          restrictions: TOUR_INFO.RESTRICTIONS,
        },
      };

      console.log(
        '🛥️ CatamaranForm - Reservation data created:',
        reservationData
      );

      // Store in context
      setReservationData(reservationData);

      // Call the onSubmit callback if provided
      if (onSubmit) {
        await onSubmit({
          ...formData,
          totalPrice: calculatePrice,
          catamaranDetails: selectedCatamaran,
        });
      }

      console.log('🛥️ CatamaranForm - Navigating to confirmation...');

      // Navigate to confirmation page
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ CatamaranForm - Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generic input handler with error clearing
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

  // Counter handlers with bounds checking
  const createCounterHandler = (field: keyof FormData, min = 0, max = 50) => ({
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

  const adultCounter = createCounterHandler('adultCount', 1, 50);
  const childCounter = createCounterHandler('childCount', 0, 50);

  // Handle location selection with error clearing
  const handleLocationSelect = (locationId: string) => {
    setFormData((prev) => ({
      ...prev,
      location: locationId,
    }));

    // Clear location error if exists
    if (errors.location) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.location;
        return newErrors;
      });
    }
  };

  // Handle child age changes with pricing updates
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

  // Reusable Counter component
  const Counter = ({
    label,
    value,
    onIncrement,
    onDecrement,
    icon: Icon,
    min = 0,
    max = 50,
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
          disabled={value >= max}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50'
        >
          +
        </button>
      </div>
      {value >= max && (
        <p className='text-xs text-amber-600 mt-1'>
          Maximum capacity reached: {max}
        </p>
      )}
    </div>
  );

  // Get category icon based on catamaran category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'party':
        return Music;
      case 'classic':
        return Anchor;
      case 'sunset':
        return Sun;
      case 'premium':
        return Crown;
      default:
        return Anchor;
    }
  };

  // Selected Catamaran Summary Component
  const SelectedCatamaranSummary = () => {
    const CategoryIcon = getCategoryIcon(
      selectedCatamaran?.category || 'classic'
    );

    return (
      <div className='bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200'>
        <div className='flex items-start space-x-4'>
          <div className='flex-shrink-0'>
            <img
              src={selectedCatamaran?.image || '/default-catamaran.jpg'}
              alt={selectedCatamaran?.name || 'Catamaran'}
              className='w-20 h-20 rounded-lg object-cover'
            />
          </div>
          <div className='flex-1'>
            <div className='flex items-center space-x-2 mb-2'>
              <CategoryIcon className='w-5 h-5 text-blue-600' />
              <h3 className='text-xl font-bold text-gray-800'>
                {selectedCatamaran?.name || 'Catamaran'}
              </h3>
            </div>
            <p className='text-gray-600 text-sm mb-3'>
              {selectedCatamaran?.description || 'Caribbean adventure'}
            </p>

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div className='bg-white rounded-lg p-3'>
                <div className='font-semibold text-gray-700'>Duration</div>
                <div className='text-blue-600'>
                  {selectedCatamaran?.duration || '3 hours'}
                </div>
              </div>
              <div className='bg-white rounded-lg p-3'>
                <div className='font-semibold text-gray-700'>Base Rate</div>
                <div className='text-blue-600'>
                  ${selectedCatamaran?.pricing?.minimumRate || 89} USD
                </div>
                <div className='text-xs text-gray-500'>
                  (1-{selectedCatamaran?.pricing?.baseGroupSize || 5} people)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        <FormHeader
          title={`Book ${selectedCatamaran?.name || 'Catamaran'}`}
          subtitle='Complete your Caribbean catamaran adventure booking'
          onCancel={handleClose}
          showCloseButton={true}
          gradientFrom='blue-500'
          gradientVia='teal-700'
          gradientTo='blue-800'
        />

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Selected Catamaran Summary */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Your Selected Experience
            </h3>
            <SelectedCatamaranSummary />
          </div>

          {/* Tour Date & Time Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Tour Date & Time
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

              {/* Time Slot */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 mr-2 text-blue-700' />
                  Departure Time *
                </label>
                <select
                  name='timeSlot'
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.timeSlot ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
                >
                  {timeSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.time}
                    </option>
                  ))}
                </select>
                {errors.timeSlot && (
                  <p className='text-red-500 text-xs mt-1'>{errors.timeSlot}</p>
                )}
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
              <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                <MapPin className='w-4 h-4 mr-2 text-blue-700' />
                Select Pickup Location *
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {LOCATION_OPTIONS.map((location) => (
                  <div
                    key={location.id}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.location === location.id
                          ? 'bg-blue-50 border-blue-300 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => handleLocationSelect(location.id)}
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${
                          formData.location === location.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.location === location.id && (
                          <Check className='w-3 h-3 text-white' />
                        )}
                      </div>
                      <span className='font-medium text-gray-800'>
                        {location.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {errors.location && (
                <p className='text-red-500 text-xs mt-2'>{errors.location}</p>
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
                max={50}
              />

              <Counter
                label='Children (0-17)'
                value={formData.childCount}
                onIncrement={childCounter.increment}
                onDecrement={childCounter.decrement}
                icon={Baby}
                max={50}
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
                        : price <
                          (selectedCatamaran?.pricing?.minimumRate || 89)
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
                                : price <
                                  (selectedCatamaran?.pricing?.minimumRate ||
                                    89)
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
          </div>

          {/* What's Included Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              What's Included
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {selectedCatamaran?.includes?.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center text-sm text-gray-700'
                >
                  <Star className='w-4 h-4 text-yellow-500 mr-2 flex-shrink-0' />
                  {item}
                </div>
              )) || (
                <div className='text-gray-500 italic'>
                  Caribbean adventure with all amenities
                </div>
              )}
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
                Special Requests or Requirements
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50'
                placeholder='Celebration details, dietary requirements, mobility assistance, or any special requests...'
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
        <div className='rounded-2xl bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
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

            {/* Price breakdown using REAL pricing */}
            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              <div className='text-blue-400 font-medium'>
                {selectedCatamaran?.name || 'Catamaran Experience'}
              </div>
              {selectedCatamaran?.pricing ? (
                <>
                  <div>
                    Base rate (1-{selectedCatamaran.pricing.baseGroupSize}{' '}
                    adults): ${selectedCatamaran.pricing.minimumRate}
                  </div>
                  {formData.adultCount >
                    selectedCatamaran.pricing.baseGroupSize && (
                    <div>
                      Additional adults (
                      {formData.adultCount -
                        selectedCatamaran.pricing.baseGroupSize}
                      ): $
                      {(formData.adultCount -
                        selectedCatamaran.pricing.baseGroupSize) *
                        selectedCatamaran.pricing.additionalPersonRate}
                    </div>
                  )}
                </>
              ) : (
                <div>
                  Total for {formData.adultCount} adults: $
                  {formData.adultCount * 89}
                </div>
              )}
              {formData.children.map((child, index) => {
                const price = calculateChildPrice(child.age);
                return (
                  <div key={child.id}>
                    Child {index + 1} ({child.age} years): ${price}
                  </div>
                );
              })}
              <div className='text-cyan-400'>
                Includes:{' '}
                {selectedCatamaran?.includes?.slice(0, 2).join(', ') ||
                  'Caribbean adventure'}
                {selectedCatamaran?.includes &&
                  selectedCatamaran.includes.length > 2 &&
                  ' & more'}
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
              <Ship className='h-4 w-4 mr-2' />
              {isSubmitting
                ? 'Booking...'
                : `Book ${selectedCatamaran?.name || 'Catamaran'}`}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CatamaranForm;
