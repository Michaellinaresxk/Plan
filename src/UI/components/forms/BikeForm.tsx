import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Bike,
  Calendar,
  MapPin,
  Users,
  Baby,
  CheckCircle,
  CreditCard,
  Info,
  Clock,
  AlertTriangle,
  Star,
  Shield,
} from 'lucide-react';

// Types for better type safety
interface BikeType {
  id: string;
  name: string;
  icon: string;
  color: string;
  price: number;
  description: string;
  ageRange: string;
  minAge: number;
  maxAge: number;
  features: string[];
  isPremium?: boolean;
}

interface ChildInfo {
  id: string;
  age: number;
  recommendedBike: string;
}

interface FormData {
  // Rental details
  startDate: string;
  endDate: string;
  startTime: string;
  location: string;

  // Participants
  adultCount: number;
  childCount: number;
  children: ChildInfo[];

  // Bike selection
  selectedBikes: Record<string, number>; // bikeType -> quantity

  // Additional options
  needsHelmet: boolean;
  needsLock: boolean;
  deliveryToHotel: boolean;
  specialRequests: string;
}

interface FormErrors {
  [key: string]: string;
}

interface BikeFormProps {
  service: Service;
  onSubmit: (
    formData: FormData & { totalPrice: number; rentalDays: number }
  ) => void;
  onCancel: () => void;
}

// Bike types configuration based on your BikeRentalServiceView
const BIKE_TYPES: BikeType[] = [
  {
    id: 'kids-bike',
    name: 'Kids Bikes',
    icon: '🚲',
    color: 'from-pink-500 to-purple-500',
    price: 15,
    description: 'Safe and fun bikes designed specifically for children',
    ageRange: '4-12 years',
    minAge: 4,
    maxAge: 12,
    features: ['Training wheels available', 'Safety features', 'Bright colors'],
  },
  {
    id: 'beachCruiser',
    name: 'Beach Cruisers',
    icon: '🏖️',
    color: 'from-blue-500 to-cyan-500',
    price: 25,
    description: 'Perfect for coastal rides and beach exploration',
    ageRange: '13+ years',
    minAge: 13,
    maxAge: 99,
    features: ['Comfortable seating', 'Easy pedaling', 'Beach-friendly'],
  },
  {
    id: 'cityBike',
    name: 'City Bikes',
    icon: '🏙️',
    color: 'from-green-500 to-emerald-500',
    price: 30,
    description: 'Ideal for urban exploration and local attractions',
    ageRange: '13+ years',
    minAge: 13,
    maxAge: 99,
    features: ['Versatile design', 'Comfortable ride', 'City-friendly'],
  },
  {
    id: 'mountainBike',
    name: 'Mountain Bikes',
    icon: '⛰️',
    color: 'from-orange-500 to-red-500',
    price: 35,
    description: 'Built for adventure and off-road trails',
    ageRange: '16+ years',
    minAge: 16,
    maxAge: 99,
    features: ['Off-road capability', 'Durable frame', 'Adventure-ready'],
  },
  {
    id: 'eBike',
    name: 'E-Bikes',
    icon: '⚡',
    color: 'from-purple-500 to-pink-500',
    price: 45,
    description: 'Premium electric assistance for effortless rides',
    ageRange: '18+ years',
    minAge: 18,
    maxAge: 99,
    features: ['Electric assistance', 'Premium experience', 'Effortless rides'],
    isPremium: true,
  },
];

// Popular locations in Punta Cana
const LOCATIONS = [
  'Hotel pickup',
  'Bavaro Beach',
  'Cap Cana',
  'Uvero Alto',
  'Macao Beach',
  'Downtown Punta Cana',
  'Playa Blanca',
  'Arena Gorda',
  'El Cortecito',
  'Other (specify in special requests)',
];

const BikeForm: React.FC<BikeFormProps> = ({ service, onSubmit, onCancel }) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    location: '',
    adultCount: 2,
    childCount: 0,
    children: [],
    selectedBikes: {},
    needsHelmet: true,
    needsLock: true,
    deliveryToHotel: true,
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Calculate rental days
  const rentalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1); // Include both start and end days
  }, [formData.startDate, formData.endDate]);

  // Calculate total bikes needed
  const totalBikesNeeded = useMemo(() => {
    return formData.adultCount + formData.childCount;
  }, [formData.adultCount, formData.childCount]);

  // Calculate total bikes selected
  const totalBikesSelected = useMemo(() => {
    return Object.values(formData.selectedBikes).reduce(
      (sum, count) => sum + count,
      0
    );
  }, [formData.selectedBikes]);

  // Auto-recommend bikes based on children ages
  const recommendedBikes = useMemo(() => {
    const recommendations: Record<string, number> = {};

    // Add recommendations for adults
    if (formData.adultCount > 0) {
      recommendations['cityBike'] =
        (recommendations['cityBike'] || 0) + formData.adultCount;
    }

    // Add recommendations for children based on age
    formData.children.forEach((child) => {
      const suitableBike = BIKE_TYPES.find(
        (bike) => child.age >= bike.minAge && child.age <= bike.maxAge
      );
      if (suitableBike) {
        recommendations[suitableBike.id] =
          (recommendations[suitableBike.id] || 0) + 1;
      }
    });

    return recommendations;
  }, [formData.adultCount, formData.children]);

  // Update children array when child count changes
  useEffect(() => {
    const currentChildrenCount = formData.children.length;
    const newChildCount = formData.childCount;

    if (newChildCount > currentChildrenCount) {
      // Add new children
      const newChildren = [...formData.children];
      for (let i = currentChildrenCount; i < newChildCount; i++) {
        newChildren.push({
          id: `child-${i + 1}`,
          age: 8, // Default age
          recommendedBike: 'kids-bike',
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

  // Auto-apply recommendations when they change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedBikes: { ...recommendedBikes },
    }));
  }, [recommendedBikes]);

  // Calculate total price
  const calculatePrice = useMemo(() => {
    let total = 0;

    // Calculate bike rental costs
    Object.entries(formData.selectedBikes).forEach(([bikeType, count]) => {
      const bike = BIKE_TYPES.find((b) => b.id === bikeType);
      if (bike) {
        total += bike.price * count * rentalDays;
      }
    });

    // Add delivery fee if needed
    if (formData.deliveryToHotel && formData.location !== 'Hotel pickup') {
      total += 10; // Delivery fee
    }

    return total;
  }, [
    formData.selectedBikes,
    formData.deliveryToHotel,
    formData.location,
    rentalDays,
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

  // Form validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    // Date validations
    if (
      formData.startDate &&
      !isSameDay(formData.startDate) &&
      !hasMinimum24Hours(formData.startDate)
    ) {
      newErrors.startDate =
        'Bookings must be made at least 24 hours in advance';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Participant validation
    if (totalBikesNeeded < 1) {
      newErrors.adultCount = 'At least one participant is required';
    }

    // Children age validation
    formData.children.forEach((child, index) => {
      if (child.age < 4 || child.age > 17) {
        newErrors[`child-${index}-age`] = 'Child age must be between 4 and 17';
      }
    });

    // Bike selection validation
    if (totalBikesSelected !== totalBikesNeeded) {
      newErrors.selectedBikes = `Please select exactly ${totalBikesNeeded} bikes`;
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Same day booking confirmation
      if (isSameDay(formData.startDate)) {
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
        rentalDays,
      });
    }
  };

  // Generic input handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
              recommendedBike:
                BIKE_TYPES.find(
                  (bike) => age >= bike.minAge && age <= bike.maxAge
                )?.id || 'kids-bike',
            }
          : child
      ),
    }));
  };

  // Bike selection handler
  const handleBikeSelection = (bikeId: string, count: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedBikes: {
        ...prev.selectedBikes,
        [bikeId]: Math.max(0, count),
      },
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
        <Icon className='w-4 h-4 mr-2 text-green-700' />
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

  // Bike selector component
  const BikeSelector = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h4 className='text-lg font-medium text-gray-800'>Select Your Bikes</h4>
        <div className='text-sm text-gray-600'>
          {totalBikesSelected} of {totalBikesNeeded} bikes selected
        </div>
      </div>

      {totalBikesSelected !== totalBikesNeeded && (
        <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
          <AlertTriangle className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
          <div className='text-sm text-amber-800'>
            <strong>Note:</strong> Please select exactly {totalBikesNeeded}{' '}
            bikes ({formData.adultCount} adults + {formData.childCount}{' '}
            children).
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {BIKE_TYPES.map((bike) => {
          const selectedCount = formData.selectedBikes[bike.id] || 0;
          const recommendedCount = recommendedBikes[bike.id] || 0;
          const isRecommended = recommendedCount > 0;

          return (
            <div
              key={bike.id}
              className={`relative p-4 border rounded-lg transition-all ${
                selectedCount > 0
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300'
              }`}
            >
              {isRecommended && (
                <div className='absolute -top-2 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded'>
                  Recommended ({recommendedCount})
                </div>
              )}

              {bike.isPremium && (
                <div className='absolute -top-2 right-4 bg-purple-500 text-white text-xs px-2 py-1 rounded'>
                  Premium
                </div>
              )}

              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center'>
                  <span className='text-2xl mr-3'>{bike.icon}</span>
                  <div>
                    <h5 className='font-medium'>{bike.name}</h5>
                    <p className='text-sm text-gray-600'>{bike.ageRange}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-lg font-bold text-green-600'>
                    ${bike.price}
                  </div>
                  <div className='text-xs text-gray-500'>per day</div>
                </div>
              </div>

              <p className='text-sm text-gray-600 mb-3'>{bike.description}</p>

              <div className='mb-3'>
                <div className='text-xs text-gray-500 mb-1'>Features:</div>
                <div className='flex flex-wrap gap-1'>
                  {bike.features.map((feature, index) => (
                    <span
                      key={index}
                      className='text-xs bg-gray-100 px-2 py-1 rounded'
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700'>
                  Quantity:
                </span>
                <div className='flex items-center space-x-2'>
                  <button
                    type='button'
                    onClick={() =>
                      handleBikeSelection(bike.id, selectedCount - 1)
                    }
                    disabled={selectedCount === 0}
                    className='w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50'
                  >
                    -
                  </button>
                  <span className='w-8 text-center font-medium'>
                    {selectedCount}
                  </span>
                  <button
                    type='button'
                    onClick={() =>
                      handleBikeSelection(bike.id, selectedCount + 1)
                    }
                    className='w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200'
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {errors.selectedBikes && (
        <p className='text-red-500 text-xs'>{errors.selectedBikes}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Header */}
        <div className='bg-gradient-to-r from-green-800 via-green-700 to-teal-800 p-6 text-white'>
          <h2 className='text-2xl font-light tracking-wide'>
            Bike Rental Booking
          </h2>
          <p className='text-green-100 mt-1 font-light'>
            Explore Punta Cana with high-quality bikes delivered to your
            location
          </p>
        </div>

        {/* Form Body */}
        <div className='p-8 space-y-8'>
          {/* Rental Period Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Rental Period
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Start Date */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-green-700' />
                  Start Date *
                </label>
                <input
                  type='date'
                  name='startDate'
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-green-500 focus:border-green-500 bg-gray-50`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.startDate && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.startDate}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-green-700' />
                  End Date *
                </label>
                <input
                  type='date'
                  name='endDate'
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-green-500 focus:border-green-500 bg-gray-50`}
                  min={
                    formData.startDate || new Date().toISOString().split('T')[0]
                  }
                />
                {errors.endDate && (
                  <p className='text-red-500 text-xs mt-1'>{errors.endDate}</p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 mr-2 text-green-700' />
                  Preferred Start Time
                </label>
                <select
                  name='startTime'
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-gray-50'
                >
                  <option value='08:00'>8:00 AM</option>
                  <option value='09:00'>9:00 AM</option>
                  <option value='10:00'>10:00 AM</option>
                  <option value='11:00'>11:00 AM</option>
                  <option value='12:00'>12:00 PM</option>
                  <option value='13:00'>1:00 PM</option>
                  <option value='14:00'>2:00 PM</option>
                  <option value='15:00'>3:00 PM</option>
                </select>
              </div>
            </div>

            {/* Rental period display */}
            {formData.startDate && formData.endDate && (
              <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
                <p className='text-sm text-green-800'>
                  <strong>Rental period:</strong> {rentalDays}{' '}
                  {rentalDays === 1 ? 'day' : 'days'}
                </p>
              </div>
            )}

            {/* Booking timing warnings */}
            {formData.startDate && (
              <div className='mt-4'>
                {isSameDay(formData.startDate) ? (
                  <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
                    <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
                    <div className='text-sm text-amber-800'>
                      <strong>Same-day booking:</strong> Requires immediate
                      confirmation from our team.
                    </div>
                  </div>
                ) : !hasMinimum24Hours(formData.startDate) ? (
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
              Location & Delivery
            </h3>

            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <MapPin className='w-4 h-4 mr-2 text-green-700' />
                Pickup/Delivery Location *
              </label>
              <select
                name='location'
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full p-3 border ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-green-500 focus:border-green-500 bg-gray-50`}
              >
                <option value=''>Select location</option>
                {LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.location && (
                <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
              )}
            </div>

            <div className='flex items-center bg-gray-50 p-3 border border-gray-300 rounded-lg'>
              <input
                type='checkbox'
                id='deliveryToHotel'
                name='deliveryToHotel'
                checked={formData.deliveryToHotel}
                onChange={handleInputChange}
                className='h-4 w-4 text-green-700 focus:ring-green-500 border-gray-300 rounded'
              />
              <label
                htmlFor='deliveryToHotel'
                className='ml-2 text-sm text-gray-700'
              >
                Hotel delivery and pickup service (+$10)
              </label>
            </div>
          </div>

          {/* Participants Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Participants
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Counter
                label='Adults (18+)'
                value={formData.adultCount}
                onIncrement={adultCounter.increment}
                onDecrement={adultCounter.decrement}
                icon={Users}
                min={1}
              />

              <Counter
                label='Children (4-17)'
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
                  {formData.children.map((child, index) => (
                    <div key={child.id} className='p-4 bg-gray-50 rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <label className='text-sm font-medium text-gray-700'>
                          Child {index + 1} Age
                        </label>
                        {child.recommendedBike && (
                          <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
                            {
                              BIKE_TYPES.find(
                                (b) => b.id === child.recommendedBike
                              )?.name
                            }
                          </span>
                        )}
                      </div>
                      <select
                        value={child.age}
                        onChange={(e) =>
                          handleChildAgeChange(
                            child.id,
                            parseInt(e.target.value)
                          )
                        }
                        className='w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500'
                      >
                        {Array.from({ length: 14 }, (_, i) => i + 4).map(
                          (age) => (
                            <option key={age} value={age}>
                              {age} years old
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
                  ))}
                </div>
              </div>
            )}

            {/* Total participants display */}
            <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
              <p className='text-sm text-green-800'>
                <strong>Total participants:</strong> {totalBikesNeeded}(
                {formData.adultCount} adults + {formData.childCount} children)
              </p>
            </div>
          </div>

          {/* Bike Selection Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Bike Selection
            </h3>
            <BikeSelector />
          </div>

          {/* Additional Options Section */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
              Additional Options
            </h3>

            <div className='space-y-4'>
              <div className='flex items-center bg-gray-50 p-3 border border-gray-300 rounded-lg'>
                <input
                  type='checkbox'
                  id='needsHelmet'
                  name='needsHelmet'
                  checked={formData.needsHelmet}
                  onChange={handleInputChange}
                  className='h-4 w-4 text-green-700 focus:ring-green-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='needsHelmet'
                  className='ml-2 text-sm text-gray-700 flex items-center'
                >
                  <Shield className='w-4 h-4 mr-1 text-green-600' />
                  Include safety helmets (Free - Highly recommended)
                </label>
              </div>

              <div className='flex items-center bg-gray-50 p-3 border border-gray-300 rounded-lg'>
                <input
                  type='checkbox'
                  id='needsLock'
                  name='needsLock'
                  checked={formData.needsLock}
                  onChange={handleInputChange}
                  className='h-4 w-4 text-green-700 focus:ring-green-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='needsLock'
                  className='ml-2 text-sm text-gray-700'
                >
                  Include bike locks (Free)
                </label>
              </div>
            </div>

            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <Info className='w-4 h-4 mr-2 text-green-700' />
                Special Requests or Notes
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500'
                placeholder='Any special requests, preferred routes, or additional information...'
              />
            </div>
          </div>

          {/* Safety Information */}
          <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
            <div className='flex items-start'>
              <AlertTriangle className='w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5' />
              <div>
                <h4 className='font-medium text-amber-800 mb-2'>
                  Safety Information
                </h4>
                <ul className='text-sm text-amber-700 space-y-1'>
                  <li>
                    • Helmets are strongly recommended and provided free of
                    charge
                  </li>
                  <li>• Children under 16 must be accompanied by an adult</li>
                  <li>• Please follow all local traffic regulations</li>
                  <li>• Rental includes basic insurance coverage</li>
                </ul>
              </div>
            </div>
          </div>
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
              {rentalDays > 1 && (
                <span className='ml-2 text-sm bg-green-800 px-2 py-1 rounded'>
                  {rentalDays} days
                </span>
              )}
            </div>

            {/* Price breakdown */}
            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              {Object.entries(formData.selectedBikes).map(
                ([bikeType, count]) => {
                  if (count === 0) return null;
                  const bike = BIKE_TYPES.find((b) => b.id === bikeType);
                  if (!bike) return null;
                  return (
                    <div key={bikeType}>
                      {bike.name}: {count} × ${bike.price} × {rentalDays} days =
                      ${bike.price * count * rentalDays}
                    </div>
                  );
                }
              )}
              {formData.deliveryToHotel &&
                formData.location !== 'Hotel pickup' && (
                  <div>Delivery service: +$10</div>
                )}
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
              className='px-8 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg transition flex items-center'
            >
              <CreditCard className='h-4 w-4 mr-2' />
              Book Bikes
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BikeForm;
