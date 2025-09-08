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
  CreditCard,
  Waves,
  Ship,
  Sun,
  Shield,
  Star,
  Check,
} from 'lucide-react';
import { useFormModal } from '@/hooks/useFormModal';
import FormHeader from './FormHeader';
import { defaultDropAnimation } from '@dnd-kit/core';

// Types for better type safety
interface ChildInfo {
  id: string;
  age: number;
  hasCharge: boolean;
}

interface CatamaranOption {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
  hasWaterSlide: boolean;
  image: string;
  features: string[];
  description: string;
}

interface FormData {
  // Tour details
  tourDate: string;
  location: string;
  timeSlot: string;

  // Catamaran selection
  selectedCatamaran: string;

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

interface LuxCatamaranFormProps {
  service: Service;
  onSubmit?: (
    formData: FormData & {
      totalPrice: number;
      catamaranDetails: CatamaranOption;
    }
  ) => void;
  onCancel: () => void;
}

// Age restrictions and pricing configuration
const AGE_CONFIG = {
  FREE_AGE_LIMIT: 5, // Children 5 and under are free
  CHILD_PRICE_LIMIT: 12, // Children 6-12 have reduced price
  CHILD_DISCOUNT: 0.3, // 30% discount for children
  FREE_PRICE: 0, // Free for children 5 and under
};

const LOCATION_OPTIONS = [
  { id: 'punta-cana-resorts', name: 'Punta Cana Resorts' },
  { id: 'cap-cana', name: 'Cap Cana' },
  { id: 'bavaro', name: 'Bavaro' },
  { id: 'punta-village', name: 'Puntacana Village' },
  { id: 'uvero-alto', name: 'Uvero Alto' },
  { id: 'macao', name: 'Macao Beach Area' },
] as const;

// Catamaran options
const CATAMARAN_OPTIONS: CatamaranOption[] = [
  {
    id: 'classic',
    name: 'Classic Adventure',
    basePrice: 89,
    capacity: 40,
    hasWaterSlide: false,
    image:
      'https://images.pexels.com/photos/4600762/pexels-photo-4600762.jpeg?_gl=1*mwst98*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTM3OTg1NjgkbzgkZzEkdDE3NTM3OTg1NzMkajU1JGwwJGgw',
    features: [
      'Open Bar with Standard Drinks',
      'Gourmet Buffet Lunch',
      'Professional Snorkeling Equipment',
      'Experienced Crew',
      'Beach Access',
      'Life Jackets & Safety Equipment',
    ],
    description:
      'Perfect for groups looking for a complete Caribbean catamaran experience with all the essentials.',
  },
  {
    id: 'premium-slide',
    name: 'Premium with Water Slide',
    basePrice: 129,
    capacity: 30,
    hasWaterSlide: true,
    image:
      'https://www.whitesandwatersports.com/assets/images/2020-09-02-11-41-55-IMG0606.JPG',
    features: [
      'All Classic Features Included',
      'Thrilling Water Slide',
      'Premium Bar with Craft Cocktails',
      'VIP Service & Priority Boarding',
      'Professional Photo Package',
      'Exclusive Beach Areas',
      'Enhanced Sound System',
    ],
    description:
      'Ultimate luxury experience with water slide, premium amenities, and VIP treatment for special celebrations.',
  },
];

// Time slots
const TIME_SLOTS = [
  {
    id: 'morning',
    time: '9:00 AM',
    endTime: '1:00 PM',
    label: 'Morning Adventure',
  },
  {
    id: 'afternoon',
    time: '2:00 PM',
    endTime: '6:00 PM',
    label: 'Sunset Experience',
    popular: true,
  },
];

// Tour information
const TOUR_INFO = {
  DURATION: '4-6 hours',
  RESTRICTIONS: [
    'Not recommended for pregnant women',
    'Children under 8 cannot use the water slide (Premium option)',
    'Minimum age: No restrictions (babies welcome)',
    'Children must be supervised at all times',
    'Weather dependent - may be rescheduled',
  ],
};

const LuxCatamaranForm: React.FC<LuxCatamaranFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel });

  // Form state
  const [formData, setFormData] = useState<FormData>({
    tourDate: '',
    location: '',
    timeSlot: 'afternoon', // Default to popular time
    selectedCatamaran: 'classic', // Default to classic
    adultCount: 2,
    childCount: 0,
    children: [],
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get selected catamaran details
  const selectedCatamaranData = useMemo(() => {
    return (
      CATAMARAN_OPTIONS.find((cat) => cat.id === formData.selectedCatamaran) ||
      CATAMARAN_OPTIONS[0]
    );
  }, [formData.selectedCatamaran]);

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

  // Calculate pricing for children based on selected catamaran
  const calculateChildPrice = (age: number): number => {
    if (age <= AGE_CONFIG.FREE_AGE_LIMIT) {
      return AGE_CONFIG.FREE_PRICE;
    } else if (age <= AGE_CONFIG.CHILD_PRICE_LIMIT) {
      return Math.round(
        selectedCatamaranData.basePrice * (1 - AGE_CONFIG.CHILD_DISCOUNT)
      );
    } else {
      return selectedCatamaranData.basePrice;
    }
  };

  // Calculate total price
  const calculatePrice = useMemo(() => {
    let total = 0;

    // Adults price (base price of selected catamaran)
    total += formData.adultCount * selectedCatamaranData.basePrice;

    // Children price based on age and selected catamaran
    formData.children.forEach((child) => {
      total += calculateChildPrice(child.age);
    });

    return total;
  }, [formData.adultCount, formData.children, selectedCatamaranData]);

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

    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Time slot is required';
    }

    if (!formData.selectedCatamaran) {
      newErrors.selectedCatamaran = 'Please select a catamaran option';
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
    if (totalParticipants > selectedCatamaranData.capacity) {
      newErrors.adultCount = `Selected catamaran capacity is ${selectedCatamaranData.capacity} people. Please reduce participants or choose a different option.`;
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const selectedTimeSlot = TIME_SLOTS.find(
        (slot) => slot.id === formData.timeSlot
      );
      const pickupTime = selectedTimeSlot?.time || '9:00 AM';

      // Create booking date properly
      const selectedDate = new Date(formData.tourDate);

      // Set pickup time
      const [time, period] = pickupTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const bookingStartDate = new Date(selectedDate);
      bookingStartDate.setHours(
        period === 'PM' && hours !== 12
          ? hours + 12
          : hours === 12 && period === 'AM'
          ? 0
          : hours,
        minutes,
        0,
        0
      );

      // Set end time (4-6 hours later)
      const bookingEndDate = new Date(bookingStartDate);
      bookingEndDate.setHours(bookingStartDate.getHours() + 5); // Average 5 hours

      // Create reservation data
      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'catamaran-tour',
          totalPrice: calculatePrice,
          catamaranDetails: selectedCatamaranData,
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
            id: `catamaran-${formData.selectedCatamaran}`,
            name: selectedCatamaranData.name,
            quantity: 1,
            price: calculatePrice,
            totalPrice: calculatePrice,
            pickupTime: pickupTime,
            duration: TOUR_INFO.DURATION,
          },
        ],
        clientInfo: undefined,
        // Catamaran-specific data
        catamaranSpecifics: {
          catamaranType: formData.selectedCatamaran,
          catamaranName: selectedCatamaranData.name,
          hasWaterSlide: selectedCatamaranData.hasWaterSlide,
          capacity: selectedCatamaranData.capacity,
          basePrice: selectedCatamaranData.basePrice,
          pickupTime: pickupTime,
          timeSlot: formData.timeSlot,
          duration: TOUR_INFO.DURATION,
          adultCount: formData.adultCount,
          childCount: formData.childCount,
          children: formData.children,
          specialRequests: formData.specialRequests,
          features: selectedCatamaranData.features,
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
          catamaranDetails: selectedCatamaranData,
        });
      }

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

  const adultCounter = createCounterHandler(
    'adultCount',
    1,
    selectedCatamaranData.capacity
  );
  const childCounter = createCounterHandler(
    'childCount',
    0,
    selectedCatamaranData.capacity
  );

  // Handle location selection
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
    max = 20,
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
          Maximum capacity for selected catamaran: {max}
        </p>
      )}
    </div>
  );

  // Catamaran selection component
  const CatamaranSelection = () => (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {CATAMARAN_OPTIONS.map((catamaran) => (
        <div
          key={catamaran.id}
          className={`relative border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
            formData.selectedCatamaran === catamaran.id
              ? 'border-blue-500 shadow-2xl ring-4 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
          }`}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              selectedCatamaran: catamaran.id,
            }))
          }
        >
          {/* Catamaran Image */}
          <div className='relative h-48 overflow-hidden'>
            <img
              src={catamaran.image}
              alt={catamaran.name}
              className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />

            {/* Premium Badge */}
            {catamaran.hasWaterSlide && (
              <div className='absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1'>
                <Waves className='w-4 h-4' />
                Premium
              </div>
            )}

            {/* Selection Indicator */}
            <div className='absolute top-4 left-4'>
              <input
                type='radio'
                name='selectedCatamaran'
                value={catamaran.id}
                checked={formData.selectedCatamaran === catamaran.id}
                onChange={handleInputChange}
                className='w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 focus:ring-blue-500'
              />
            </div>

            {/* Price Overlay */}
            <div className='absolute bottom-4 left-4 text-white'>
              <div className='text-2xl font-bold'>${catamaran.basePrice}</div>
              <div className='text-sm opacity-90'>per adult</div>
            </div>
          </div>

          {/* Catamaran Info */}
          <div className='p-6'>
            <div className='flex items-center justify-between mb-3'>
              <h4 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                <Ship className='w-6 h-6 text-blue-600' />
                {catamaran.name}
              </h4>
            </div>
            <div className='flex items-center text-gray-600 text-sm'>
              <Users className='w-4 h-4 mr-1' />
              {catamaran.capacity} guests
            </div>
          </div>

          {/* Selection Border Effect */}
          {formData.selectedCatamaran === catamaran.id && (
            <div className='absolute inset-0 border-2 border-blue-500 rounded-2xl pointer-events-none'></div>
          )}
        </div>
      ))}
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
        <FormHeader
          title='Catamaran Adventure Booking'
          subtitle=' Choose your perfect Caribbean catamaran experience'
          // icon={Chip}
          onCancel={handleClose}
          showCloseButton={true}
          gradientFrom='blue-500'
          gradientVia='teal-700'
          gradientTo='blue-800'
        />

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Catamaran Selection */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Choose Your Catamaran
            </h3>
            <CatamaranSelection />
            {errors.selectedCatamaran && (
              <p className='text-red-500 text-sm'>{errors.selectedCatamaran}</p>
            )}
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
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.time} - {slot.endTime} ({slot.label})
                      {slot.popular ? ' - Most Popular' : ''}
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
                max={selectedCatamaranData.capacity}
              />

              <Counter
                label='Children (0-17)'
                value={formData.childCount}
                onIncrement={childCounter.increment}
                onDecrement={childCounter.decrement}
                icon={Baby}
                max={Math.max(
                  0,
                  selectedCatamaranData.capacity - formData.adultCount
                )}
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
                        : price < selectedCatamaranData.basePrice
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
                                : price < selectedCatamaranData.basePrice
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
                        {selectedCatamaranData.hasWaterSlide &&
                          child.age < 8 && (
                            <p className='text-xs text-amber-600 mt-1'>
                              Note: Children under 8 cannot use the water slide
                            </p>
                          )}
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
              {selectedCatamaranData.features.map((item, index) => (
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

            {/* Price breakdown */}
            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              <div className='text-blue-400 font-medium'>
                {selectedCatamaranData.name}
              </div>
              <div>
                Adults: {formData.adultCount} × $
                {selectedCatamaranData.basePrice} = $
                {formData.adultCount * selectedCatamaranData.basePrice}
              </div>
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
                {selectedCatamaranData.hasWaterSlide
                  ? 'Water slide, premium bar, '
                  : 'Open bar, '}
                buffet, snorkeling & all equipment
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
              {isSubmitting ? 'Booking...' : 'Book Catamaran'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LuxCatamaranForm;