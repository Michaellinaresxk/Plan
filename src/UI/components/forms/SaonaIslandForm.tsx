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
  Car,
  DollarSign,
} from 'lucide-react';

// Types for better type safety
interface ChildInfo {
  id: string;
  age: number;
  hasCharge: boolean;
  price: number;
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
  onSubmit?: (
    formData: FormData & { totalPrice: number; pickupTime: string }
  ) => void;
  onCancel: () => void;
}

// ✅ Updated Location options with pricing
const LOCATION_OPTIONS = [
  {
    id: 'punta-cana-resorts',
    name: 'Punta Cana Resorts',
    surcharge: 0,
    description: 'Precio estándar',
  },
  {
    id: 'bavaro',
    name: 'Bavaro',
    surcharge: 0,
    description: 'Mismo precio que Punta Cana',
  },
  {
    id: 'cap-cana',
    name: 'Cap Cana',
    surcharge: 15,
    description: '+$15 USD adicional',
  },
  {
    id: 'uvero-alto',
    name: 'Uvero Alto',
    surcharge: 15,
    description: '+$15 USD adicional',
  },
] as const;

// ✅ Updated Age and pricing configuration
const PRICING_CONFIG = {
  // Age restrictions
  FREE_AGE_LIMIT: 4, // 4 años para abajo gratis
  CHILD_AGE_LIMIT: 6, // 5-6 años precio de niño
  ADULT_AGE_START: 7, // 7+ años paga como adulto
  MAX_AGE_LIMIT: 75, // No apta para mayores de 75 años

  // Base prices per person
  BASE_PRICE_PER_PERSON: 55,
  FREE_PRICE: 0,

  // Transport costs based on group size
  TRANSPORT_1_8_PEOPLE: 120,
  TRANSPORT_9_15_PEOPLE: 160,
} as const;

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
    PICKUP_TIME: '7:00 AM - 7:45 AM',
    DURATION: '8-9 hours',
    INCLUDES: [
      'Round-trip transportation',
      'Catamaran or speedboat ride',
      'Natural pool swimming (15 min stop)',
      'Beach time at Saona Island',
      'Dominican buffet lunch',
      'Drinks (soft drinks, rum, water)',
      'Animation and music on catamaran',
      'Professional guide',
      'Life jackets',
    ],
    RESTRICTIONS: [
      'Not recommended for pregnant women',
      'Not suitable for people with mobility issues',
      'Not suitable for people over 75 years old',
      'Minimum age: No restrictions (babies welcome)',
      'Children must be supervised at all times',
      'Tour does not cancel for rain - only in extreme weather conditions',
    ],
  };

  // ✅ Form state with proper initial values
  const [formData, setFormData] = useState<FormData>({
    tourDate: '',
    location: '',
    adultCount: 2,
    childCount: 0,
    children: [],
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Helper to update form fields
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

  // ✅ Handle location selection
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
        const price = calculateChildPrice(defaultAge);
        newChildren.push({
          id: `child-${i + 1}`,
          age: defaultAge,
          hasCharge: defaultAge > PRICING_CONFIG.FREE_AGE_LIMIT,
          price,
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

  // ✅ Updated pricing calculation for children
  const calculateChildPrice = (age: number): number => {
    if (age <= PRICING_CONFIG.FREE_AGE_LIMIT) {
      return PRICING_CONFIG.FREE_PRICE;
    } else if (age <= PRICING_CONFIG.CHILD_AGE_LIMIT) {
      // 5-6 años: precio de niño (50% del precio base)
      return PRICING_CONFIG.BASE_PRICE_PER_PERSON * 0.5;
    } else {
      // 7+ años: precio de adulto
      return PRICING_CONFIG.BASE_PRICE_PER_PERSON;
    }
  };

  // ✅ Calculate transport cost based on group size
  const calculateTransportCost = (totalPeople: number): number => {
    if (totalPeople <= 8) {
      return PRICING_CONFIG.TRANSPORT_1_8_PEOPLE;
    } else if (totalPeople <= 15) {
      return PRICING_CONFIG.TRANSPORT_9_15_PEOPLE;
    }
    return PRICING_CONFIG.TRANSPORT_9_15_PEOPLE; // Max 15 people
  };

  // ✅ Get location surcharge
  const getLocationSurcharge = (): number => {
    const selectedLocation = LOCATION_OPTIONS.find(
      (loc) => loc.id === formData.location
    );
    return selectedLocation?.surcharge || 0;
  };

  // ✅ Calculate total price with new formula
  const calculatePrice = useMemo(() => {
    let basePrice = 0;

    // Adults: count × base price per person
    basePrice += formData.adultCount * PRICING_CONFIG.BASE_PRICE_PER_PERSON;

    // Children: individual pricing based on age
    formData.children.forEach((child) => {
      basePrice += calculateChildPrice(child.age);
    });

    // Transport cost based on total participants
    const transportCost = calculateTransportCost(totalParticipants);

    // Location surcharge
    const locationSurcharge = getLocationSurcharge();

    return basePrice + transportCost + locationSurcharge;
  }, [
    formData.adultCount,
    formData.children,
    totalParticipants,
    formData.location,
  ]);

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

  // ✅ Updated validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.tourDate) {
      newErrors.tourDate = 'Tour date is required';
    }

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

    // ✅ Maximum participants validation
    if (totalParticipants > 15) {
      newErrors.adultCount = 'Maximum 15 participants allowed';
    }

    // ✅ Age restrictions validation
    if (formData.adultCount > 0) {
      // Check if any adult is over 75 (assuming adults are 18+, but we need age input for this)
      // For now, we'll add this as a warning in the restrictions section
    }

    // Children age validation
    formData.children.forEach((child, index) => {
      if (child.age < 0 || child.age > 17) {
        newErrors[`child-${index}-age`] = 'Child age must be between 0 and 17';
      }
    });

    return newErrors;
  };

  // ✅ Updated submit handler
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
          locationName: selectedLocation?.name || formData.location,
          transportCost: calculateTransportCost(totalParticipants),
          locationSurcharge: getLocationSurcharge(),
          basePrice:
            calculatePrice -
            calculateTransportCost(totalParticipants) -
            getLocationSurcharge(),
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
        saonaSpecifics: {
          pickupTime: TOUR_INFO.PICKUP_TIME,
          duration: TOUR_INFO.DURATION,
          adultCount: formData.adultCount,
          childCount: formData.childCount,
          children: formData.children,
          specialRequests: formData.specialRequests,
          includes: TOUR_INFO.INCLUDES,
          restrictions: TOUR_INFO.RESTRICTIONS,
          location: formData.location,
          locationName: selectedLocation?.name || formData.location,
          pricing: {
            basePrice:
              calculatePrice -
              calculateTransportCost(totalParticipants) -
              getLocationSurcharge(),
            transportCost: calculateTransportCost(totalParticipants),
            locationSurcharge: getLocationSurcharge(),
            totalPrice: calculatePrice,
          },
        },
      };

      console.log('🏝️ SaonaForm - Reservation data created:', reservationData);

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
  const createCounterHandler = (field: keyof FormData, min = 0, max = 15) => ({
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
              hasCharge: age > PRICING_CONFIG.FREE_AGE_LIMIT,
              price: calculateChildPrice(age),
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
    max = 15,
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
          Maximum {max} participants allowed
        </p>
      )}
    </div>
  );

  // ✅ Pricing breakdown component
  const PricingBreakdown = () => {
    const basePrice =
      calculatePrice -
      calculateTransportCost(totalParticipants) -
      getLocationSurcharge();
    const transportCost = calculateTransportCost(totalParticipants);
    const locationSurcharge = getLocationSurcharge();

    return (
      <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
        <h4 className='font-medium text-blue-800 mb-3 flex items-center'>
          <DollarSign className='w-4 h-4 mr-2' />
          Pricing Breakdown
        </h4>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span>Adults ({formData.adultCount} × $55):</span>
            <span>
              $
              {(
                formData.adultCount * PRICING_CONFIG.BASE_PRICE_PER_PERSON
              ).toFixed(2)}
            </span>
          </div>
          {formData.children.map((child, index) => (
            <div key={child.id} className='flex justify-between'>
              <span>
                Child {index + 1} ({child.age} years):
              </span>
              <span>${child.price.toFixed(2)}</span>
            </div>
          ))}
          <div className='flex justify-between font-medium'>
            <span>Subtotal (per person costs):</span>
            <span>${basePrice.toFixed(2)}</span>
          </div>
          <div className='flex justify-between'>
            <span>
              Transport ({totalParticipants <= 8 ? '1-8' : '9-15'} people):
            </span>
            <span>${transportCost.toFixed(2)}</span>
          </div>
          {locationSurcharge > 0 && (
            <div className='flex justify-between'>
              <span>Location surcharge:</span>
              <span>${locationSurcharge.toFixed(2)}</span>
            </div>
          )}
          <div className='border-t pt-2 flex justify-between font-bold text-blue-800'>
            <span>Total:</span>
            <span>${calculatePrice.toFixed(2)}</span>
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
                  Pickup time window for all participants
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

          {/* ✅ Updated Location Section with pricing info */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Pickup Location
            </h3>

            <div className='bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-blue-800 mb-4'>
                <MapPin className='w-5 h-5 mr-2 text-blue-600' />
                Select your pickup location *
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {LOCATION_OPTIONS.map((location) => (
                  <div
                    key={location.id}
                    className={`
                      border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
                      ${
                        formData.location === location.id
                          ? 'border-blue-500 bg-white shadow-lg ring-2 ring-blue-200'
                          : 'border-blue-200 bg-white hover:border-blue-300'
                      }
                    `}
                    onClick={() => handleLocationSelect(location.id)}
                  >
                    <div className='flex items-start justify-between'>
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
                        <div>
                          <div className='flex items-center'>
                            <MapPin className='w-4 h-4 mr-1 text-blue-500' />
                            <span className='font-medium text-blue-900 text-sm'>
                              {location.name}
                            </span>
                          </div>
                          <p className='text-xs text-blue-600 mt-1'>
                            {location.description}
                          </p>
                        </div>
                      </div>
                      {location.surcharge > 0 && (
                        <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
                          +${location.surcharge}
                        </span>
                      )}
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
                    {getLocationSurcharge() > 0 && (
                      <span className='ml-2 bg-blue-800 text-white px-2 py-1 rounded text-xs'>
                        +${getLocationSurcharge()} USD
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Participants Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Participants (Maximum 15)
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Counter
                label='Adults (7+ years) - $55 each'
                value={formData.adultCount}
                onIncrement={adultCounter.increment}
                onDecrement={adultCounter.decrement}
                icon={Users}
                min={1}
                max={15}
              />

              <Counter
                label='Children (0-17 years)'
                value={formData.childCount}
                onIncrement={childCounter.increment}
                onDecrement={childCounter.decrement}
                icon={Baby}
                max={15}
              />
            </div>

            {/* ✅ Age pricing info */}
            <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
              <h4 className='font-medium text-green-800 mb-2'>
                Age-Based Pricing
              </h4>
              <div className='text-sm text-green-700 space-y-1'>
                <div>• 0-4 years: Free</div>
                <div>• 5-6 years: $27.50 (Child price - 50% off)</div>
                <div>• 7+ years: $55 (Adult price)</div>
              </div>
            </div>

            {/* Children Details */}
            {formData.childCount > 0 && (
              <div className='space-y-4'>
                <h4 className='font-medium text-gray-800'>Children Details</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {formData.children.map((child, index) => {
                    const price = calculateChildPrice(child.age);
                    let priceLabel = '';
                    let priceColor = '';

                    if (price === 0) {
                      priceLabel = 'Free';
                      priceColor = 'bg-green-100 text-green-800';
                    } else if (child.age <= PRICING_CONFIG.CHILD_AGE_LIMIT) {
                      priceLabel = 'Child Price';
                      priceColor = 'bg-orange-100 text-orange-800';
                    } else {
                      priceLabel = 'Adult Price';
                      priceColor = 'bg-blue-100 text-blue-800';
                    }

                    return (
                      <div key={child.id} className='p-4 bg-gray-50 rounded-lg'>
                        <div className='flex items-center justify-between mb-2'>
                          <label className='text-sm font-medium text-gray-700'>
                            Child {index + 1} Age
                          </label>
                          <span
                            className={`text-xs px-2 py-1 rounded ${priceColor}`}
                          >
                            ${price.toFixed(2)} - {priceLabel}
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
              <p className='text-sm text-blue-800 flex items-center justify-between'>
                <span>
                  <strong>Total participants:</strong> {totalParticipants} (
                  {formData.adultCount} adults + {formData.childCount} children)
                </span>
                <span className='text-xs bg-blue-800 text-white px-2 py-1 rounded'>
                  Transport: {totalParticipants <= 8 ? '$120' : '$160'}
                </span>
              </p>
            </div>
          </div>

          {/* ✅ Pricing breakdown */}
          <PricingBreakdown />

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

            {/* Compact price breakdown */}
            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              <div>
                Per person: $
                {(
                  calculatePrice -
                  calculateTransportCost(totalParticipants) -
                  getLocationSurcharge()
                ).toFixed(2)}
              </div>
              <div>
                Transport ({totalParticipants <= 8 ? '1-8' : '9-15'} people): $
                {calculateTransportCost(totalParticipants)}
              </div>
              {getLocationSurcharge() > 0 && (
                <div className='text-blue-400'>
                  Location surcharge: ${getLocationSurcharge()}
                </div>
              )}
              {formData.location && (
                <div className='text-blue-400'>
                  Pickup from:{' '}
                  {
                    LOCATION_OPTIONS.find((loc) => loc.id === formData.location)
                      ?.name
                  }
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
              disabled={isSubmitting || totalParticipants > 15}
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
