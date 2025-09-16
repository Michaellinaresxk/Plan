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
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  Car,
  Mountain,
  Sparkles,
  Shield,
  CreditCard,
  Sunrise,
  Sun,
  Activity,
  DollarSign,
  Eye,
  Shirt,
  Waves,
} from 'lucide-react';
import { useLocationPricing } from '@/hooks/useLocationPricing';
import { LocationSelector } from '../service/LocationSelector';
import FormHeader from './FormHeader';
import { useFormModal } from '@/hooks/useFormModal';

interface AtvRideFormProps {
  service: Service;
  selectedVehicle?: any;
  onSubmit?: (formData: any) => void;
  onCancel?: () => void;
}

// Fixed Vehicle types with correct pricing and structure
const VEHICLE_TYPES = {
  atv: {
    name: 'ATV Quad',
    price: 85,
    maxParticipants: 1,
    description: 'Solo rider adventure',
  },
  buggy: {
    name: 'Dune Buggy',
    price: 65,
    maxParticipants: 2,
    description: 'Perfect for couples',
  },
  polaris: {
    name: 'Polaris RZR',
    price: 160,
    maxParticipants: 2,
    description: 'Premium off-road experience',
  },
  polarisFamiliar: {
    name: 'Polaris Familiar',
    price: 215,
    maxParticipants: 4,
    description: 'Family adventure vehicle',
  },
};

// Time slots for ATV adventures
const TIME_SLOTS = [
  {
    id: '8am',
    name: 'Morning Adventure',
    time: '8:00 AM',
    pickup: '7:30 AM',
    icon: Sunrise,
    description: 'Perfect for cooler weather',
  },
  {
    id: '11am',
    name: 'Mid-Morning',
    time: '11:00 AM',
    pickup: '10:30 AM',
    icon: Sun,
    description: 'Great lighting conditions',
  },
  {
    id: '2pm',
    name: 'Afternoon Adventure',
    time: '2:00 PM',
    pickup: '1:30 PM',
    icon: Activity,
    description: 'Perfect for photos',
  },
] as const;

// ATV specific transport pricing
const ATV_TRANSPORT_PRICING = {
  small: 60, // 1-4 people
  large: 100, // 5-8 people
  maxCapacity: 8,
};

const AtvRideForm: React.FC<AtvRideFormProps> = ({
  service,
  selectedVehicle,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel });

  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    location: '',
    vehicleType: selectedVehicle?.id || 'atv',
    vehicleCount: 1,
    totalParticipants: 1, // Start with 1 person
    hasExperience: true,
    specialRequests: '',
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current vehicle info
  const currentVehicle = useMemo(
    () => VEHICLE_TYPES[formData.vehicleType as keyof typeof VEHICLE_TYPES],
    [formData.vehicleType]
  );

  // Use location pricing hook
  const {
    locationOptions,
    selectedLocation,
    locationSurcharge,
    transportCost,
    totalLocationCost,
  } = useLocationPricing({
    selectedLocationId: formData.location,
    totalParticipants: formData.totalParticipants,
    servicePricing: ATV_TRANSPORT_PRICING,
  });

  // Calculate base price (price per machine × number of machines)
  const basePrice = useMemo(() => {
    if (!currentVehicle?.price) return 0;
    return currentVehicle.price * formData.vehicleCount;
  }, [currentVehicle, formData.vehicleCount]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!currentVehicle?.price) return 0;
    return basePrice + totalLocationCost;
  }, [basePrice, totalLocationCost, currentVehicle]);

  // Update vehicle count when total participants or vehicle type changes
  useEffect(() => {
    if (currentVehicle) {
      const vehiclesNeeded = Math.ceil(
        formData.totalParticipants / currentVehicle.maxParticipants
      );
      if (vehiclesNeeded !== formData.vehicleCount) {
        setFormData((prev) => ({
          ...prev,
          vehicleCount: vehiclesNeeded,
        }));
      }
    }
  }, [formData.totalParticipants, formData.vehicleType, currentVehicle]);

  // Handle input changes
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;

      if (type === 'checkbox') {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      // Clear errors for this field
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Handle location selection
  const handleLocationSelect = useCallback(
    (locationId: string) => {
      setFormData((prev) => ({
        ...prev,
        location: locationId,
      }));

      if (errors.location) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.location;
          return newErrors;
        });
      }
    },
    [errors.location]
  );

  // Handle people count changes
  const updatePeopleCount = useCallback((increment: boolean) => {
    setFormData((prev) => {
      const newCount = increment
        ? Math.min(16, prev.totalParticipants + 1) // Max 16 people
        : Math.max(1, prev.totalParticipants - 1); // Min 1 person

      return {
        ...prev,
        totalParticipants: newCount,
      };
    });
  }, []);

  // Handle vehicle count changes
  const updateVehicleCount = useCallback((increment: boolean) => {
    setFormData((prev) => {
      const newCount = increment
        ? Math.min(8, prev.vehicleCount + 1) // Max 8 vehicles
        : Math.max(1, prev.vehicleCount - 1); // Min 1 vehicle

      return {
        ...prev,
        vehicleCount: newCount,
      };
    });
  }, []);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const maxCapacity =
      (currentVehicle?.maxParticipants || 1) * formData.vehicleCount;

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.location) {
      newErrors.location = 'Please select a location';
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Please select a time slot';
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Please select a vehicle';
    }

    if (formData.totalParticipants < 1) {
      newErrors.totalParticipants = 'At least 1 person required';
    }

    if (formData.totalParticipants > 16) {
      newErrors.totalParticipants = 'Maximum 16 people allowed';
    }

    if (formData.vehicleCount < 1) {
      newErrors.vehicleCount = 'At least 1 vehicle required';
    }

    if (formData.vehicleCount > 8) {
      newErrors.vehicleCount = 'Maximum 8 vehicles allowed';
    }

    // Critical validation: Check capacity
    if (formData.totalParticipants > maxCapacity) {
      newErrors.totalParticipants = `Cannot fit ${formData.totalParticipants} people in ${formData.vehicleCount} vehicle(s). Maximum capacity is ${maxCapacity} people.`;
      newErrors.vehicleCount = `Need at least ${Math.ceil(
        formData.totalParticipants / (currentVehicle?.maxParticipants || 1)
      )} vehicles for ${formData.totalParticipants} people.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
          bookingEndDate.setHours(11, 0, 0, 0); // 3 hour duration
          break;
        case '11am':
          bookingStartDate.setHours(11, 0, 0, 0);
          bookingEndDate.setHours(14, 0, 0, 0); // 3 hour duration
          break;
        case '2pm':
          bookingStartDate.setHours(14, 0, 0, 0);
          bookingEndDate.setHours(17, 0, 0, 0); // 3 hour duration
          break;
      }

      const selectedTimeSlot = TIME_SLOTS.find(
        (slot) => slot.id === formData.timeSlot
      );

      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'atv-adventure',
          totalPrice,
          basePrice,
          transportCost,
          locationSurcharge,
          locationName: selectedLocation?.name || formData.location,
          pickupTime: selectedTimeSlot?.pickup,
        },
        totalPrice,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: formData.totalParticipants,
          children: 0,
          total: formData.totalParticipants,
        },
        selectedItems: [
          {
            id: `atv-${formData.vehicleType}`,
            quantity: formData.vehicleCount,
            price: totalPrice,
            totalPrice,
            timeSlot: formData.timeSlot,
            vehicleType: formData.vehicleType,
            location: selectedLocation?.name || formData.location,
          },
        ],
        clientInfo: undefined,
        atvSpecifics: {
          timeSlot: formData.timeSlot,
          pickupTime: selectedTimeSlot?.pickup,
          location: formData.location,
          locationName: selectedLocation?.name || formData.location,
          vehicleType: formData.vehicleType,
          vehicleCount: formData.vehicleCount,
          totalParticipants: formData.totalParticipants,
          hasExperience: formData.hasExperience,
          specialRequests: formData.specialRequests,
          additionalNotes: formData.additionalNotes,
          pricing: {
            basePrice,
            transportCost,
            locationSurcharge,
            totalPrice,
          },
        },
      };

      setReservationData(reservationData);

      if (onSubmit) {
        await onSubmit(reservationData);
      } else {
        router.push('/reservation-confirmation');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPremium =
    formData.vehicleType === 'polaris' ||
    formData.vehicleType === 'polarisFamiliar';

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
            title='ATVs Adventure'
            subtitle='Explore tropical paradise through jungle trails and pristine beaches'
            icon={Mountain}
            isPremium={isPremium}
            onCancel={handleClose}
            showCloseButton={true}
            gradientFrom='green-800'
            gradientVia='green-600'
            gradientTo='amber-500'
          />

          {/* Form Body */}
          <div className='p-8 space-y-8'>
            {/* Date and Time Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Calendar
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-purple-600' : 'text-green-600'
                  }`}
                />
                Schedule Your Adventure
              </h3>

              {/* Date Selection */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-purple-600' : 'text-green-600'
                    }`}
                  />
                  Select Date *
                </label>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full p-3 border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 ${
                    isPremium
                      ? 'focus:ring-purple-500 focus:border-purple-500'
                      : 'focus:ring-green-500 focus:border-green-500'
                  } bg-gray-50`}
                />
                {errors.date && (
                  <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
                )}
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-purple-600' : 'text-green-600'
                    }`}
                  />
                  Time Slot *
                </label>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {TIME_SLOTS.map((slot) => {
                    const IconComponent = slot.icon;
                    return (
                      <div
                        key={slot.id}
                        className={`
                          border rounded-lg p-4 cursor-pointer transition-all
                          ${
                            formData.timeSlot === slot.id
                              ? `${
                                  isPremium
                                    ? 'bg-purple-50 border-purple-300'
                                    : 'bg-green-50 border-green-300'
                                } shadow-sm`
                              : 'border-gray-200 hover:bg-gray-50'
                          }
                        `}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            timeSlot: slot.id,
                          }))
                        }
                      >
                        <div className='flex items-center'>
                          <div
                            className={`
                            w-5 h-5 rounded-full border flex items-center justify-center mr-3
                            ${
                              formData.timeSlot === slot.id
                                ? `${
                                    isPremium
                                      ? 'border-purple-500 bg-purple-500'
                                      : 'border-green-500 bg-green-500'
                                  }`
                                : 'border-gray-300'
                            }
                          `}
                          >
                            {formData.timeSlot === slot.id && (
                              <CheckCircle className='w-4 h-4 text-white' />
                            )}
                          </div>
                          <div className='flex items-center'>
                            <IconComponent
                              className={`w-5 h-5 mr-2 ${
                                isPremium ? 'text-purple-500' : 'text-green-500'
                              }`}
                            />
                            <span className='font-medium'>{slot.name}</span>
                          </div>
                        </div>
                        <p className='text-gray-500 text-sm mt-2 ml-8'>
                          Adventure: {slot.time}
                        </p>
                        <p className='text-gray-400 text-xs mt-1 ml-8'>
                          Pickup: {slot.pickup}
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
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <MapPin
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-purple-600' : 'text-green-600'
                  }`}
                />
                Pickup Location
              </h3>

              <LocationSelector
                selectedLocationId={formData.location}
                onLocationSelect={handleLocationSelect}
                locationOptions={locationOptions}
                error={errors.location}
                isPremium={isPremium}
              />
            </div>

            {/* Vehicle Selection */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Car
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-purple-600' : 'text-green-600'
                  }`}
                />
                Vehicle & Group Size
              </h3>

              {/* Vehicle Type */}
              <div>
                <select
                  name='vehicleType'
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 ${
                    isPremium
                      ? 'focus:ring-purple-500 focus:border-purple-500'
                      : 'focus:ring-green-500 focus:border-green-500'
                  } bg-gray-50`}
                >
                  {Object.entries(VEHICLE_TYPES).map(([key, vehicle]) => (
                    <option key={key} value={key}>
                      {vehicle.name} - ${vehicle.price} (Max{' '}
                      {vehicle.maxParticipants}{' '}
                      {vehicle.maxParticipants === 1 ? 'person' : 'people'})
                    </option>
                  ))}
                </select>

                {/* Vehicle Description */}
                {currentVehicle && (
                  <div className='mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                    <p className='text-sm text-blue-800'>
                      <strong>{currentVehicle.name}:</strong>{' '}
                      {currentVehicle.description}
                    </p>
                    <p className='text-xs text-blue-600 mt-1'>
                      Price: ${currentVehicle.price} per vehicle | Max capacity:{' '}
                      {currentVehicle.maxParticipants}{' '}
                      {currentVehicle.maxParticipants === 1
                        ? 'person'
                        : 'people'}{' '}
                      per vehicle
                    </p>
                  </div>
                )}

                {errors.vehicleType && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.vehicleType}
                  </p>
                )}
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Number of People Input */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Users
                      className={`w-4 h-4 mr-2 ${
                        isPremium ? 'text-purple-600' : 'text-green-600'
                      }`}
                    />
                    Number of People *
                  </label>
                  <div className='flex items-center border border-gray-300 rounded-lg overflow-hidden max-w-xs bg-white'>
                    <button
                      type='button'
                      onClick={() => updatePeopleCount(false)}
                      className='px-3 py-2 bg-gray-100 hover:bg-gray-200 transition'
                      disabled={formData.totalParticipants <= 1}
                    >
                      -
                    </button>
                    <input
                      type='number'
                      value={formData.totalParticipants}
                      onChange={(e) => {
                        const value = Math.max(
                          1,
                          Math.min(16, parseInt(e.target.value) || 1)
                        );
                        setFormData((prev) => ({
                          ...prev,
                          totalParticipants: value,
                        }));
                      }}
                      min='1'
                      max='16'
                      className='flex-1 py-2 text-center border-0 focus:ring-0 focus:outline-none font-medium'
                    />
                    <button
                      type='button'
                      onClick={() => updatePeopleCount(true)}
                      className='px-3 py-2 bg-gray-100 hover:bg-gray-200 transition'
                    >
                      +
                    </button>
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>
                    Maximum 16 people per group
                  </p>
                  {errors.totalParticipants && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.totalParticipants}
                    </p>
                  )}
                </div>

                {/* Number of Vehicles Input */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Car
                      className={`w-4 h-4 mr-2 ${
                        isPremium ? 'text-purple-600' : 'text-green-600'
                      }`}
                    />
                    Number of Vehicles *
                  </label>
                  <div className='flex items-center border border-gray-300 rounded-lg overflow-hidden max-w-xs bg-white'>
                    <button
                      type='button'
                      onClick={() => updateVehicleCount(false)}
                      className='px-3 py-2 bg-gray-100 hover:bg-gray-200 transition'
                      disabled={formData.vehicleCount <= 1}
                    >
                      -
                    </button>
                    <input
                      type='number'
                      value={formData.vehicleCount}
                      onChange={(e) => {
                        const value = Math.max(
                          1,
                          Math.min(8, parseInt(e.target.value) || 1)
                        );
                        setFormData((prev) => ({
                          ...prev,
                          vehicleCount: value,
                        }));
                      }}
                      min='1'
                      max='8'
                      className='flex-1 py-2 text-center border-0 focus:ring-0 focus:outline-none font-medium'
                    />
                    <button
                      type='button'
                      onClick={() => updateVehicleCount(true)}
                      className='px-3 py-2 bg-gray-100 hover:bg-gray-200 transition'
                      disabled={formData.vehicleCount >= 8}
                    >
                      +
                    </button>
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>
                    Maximum 8 vehicles per group
                  </p>
                  {errors.vehicleCount && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.vehicleCount}
                    </p>
                  )}
                </div>
              </div>

              {/* Capacity Validation and Info */}
              <div>
                {(() => {
                  const maxCapacity =
                    (currentVehicle?.maxParticipants || 1) *
                    formData.vehicleCount;
                  const isOverCapacity =
                    formData.totalParticipants > maxCapacity;
                  const suggestedVehicles = Math.ceil(
                    formData.totalParticipants /
                      (currentVehicle?.maxParticipants || 1)
                  );

                  if (isOverCapacity) {
                    return (
                      <div className='p-4 bg-red-50 border-2 border-red-300 rounded-lg'>
                        <div className='flex items-start gap-3'>
                          <AlertTriangle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                          <div>
                            <h4 className='font-semibold text-red-800 mb-2'>
                              ❌ Capacity Exceeded!
                            </h4>
                            <p className='text-red-700 text-sm mb-3'>
                              <strong>
                                {formData.totalParticipants} people
                              </strong>{' '}
                              cannot fit in{' '}
                              <strong>
                                {formData.vehicleCount}{' '}
                                {currentVehicle?.name || 'vehicle'}
                                {formData.vehicleCount !== 1 ? 's' : ''}
                              </strong>
                              <br />
                              Maximum capacity:{' '}
                              <strong>{maxCapacity} people</strong> (
                              {currentVehicle?.maxParticipants} per vehicle)
                            </p>

                            <div className='space-y-2'>
                              <p className='text-red-800 font-medium text-sm'>
                                💡 Solutions:
                              </p>
                              <div className='text-sm text-red-700 space-y-1'>
                                <div className='flex items-center gap-2'>
                                  <span className='w-2 h-2 bg-red-500 rounded-full'></span>
                                  <span>
                                    Increase to{' '}
                                    <strong>
                                      {suggestedVehicles} vehicles
                                    </strong>{' '}
                                    of {currentVehicle?.name}
                                  </span>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        vehicleCount: suggestedVehicles,
                                      }))
                                    }
                                    className='ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition'
                                  >
                                    Apply
                                  </button>
                                </div>
                                {currentVehicle?.id !== 'polarisFamiliar' && (
                                  <div className='flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-red-500 rounded-full'></span>
                                    <span>
                                      Or switch to{' '}
                                      <strong>Polaris Familiar</strong> (4
                                      people per vehicle)
                                    </span>
                                    <button
                                      type='button'
                                      onClick={() =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          vehicleType: 'polarisFamiliar',
                                          vehicleCount: Math.ceil(
                                            formData.totalParticipants / 4
                                          ),
                                        }))
                                      }
                                      className='ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition'
                                    >
                                      Switch
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
                      <div className='flex items-center gap-2 mb-2'>
                        <CheckCircle className='w-4 h-4 text-green-600' />
                        <span className='text-sm font-medium text-green-800'>
                          ✅ Perfect Fit!
                        </span>
                      </div>
                      <div className='text-xs text-green-700 space-y-1'>
                        <div>
                          <strong>Capacity:</strong>{' '}
                          {formData.totalParticipants}/{maxCapacity} people
                        </div>
                        <div>
                          <strong>Vehicles:</strong> {formData.vehicleCount} ×{' '}
                          {currentVehicle?.name}
                        </div>
                        <div>
                          <strong>Cost:</strong> {formData.vehicleCount} × $
                          {currentVehicle?.price || 0} = ${basePrice}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Additional Information */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Info
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-purple-600' : 'text-green-600'
                  }`}
                />
                Special Requests
              </h3>

              <div>
                <textarea
                  name='additionalNotes'
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder='Celebration details, photo preferences, or any other special requests...'
                  className={`w-full p-3 border border-gray-300 rounded-lg ${
                    isPremium
                      ? 'focus:ring-purple-500 focus:border-purple-500'
                      : 'focus:ring-green-500 focus:border-green-500'
                  } bg-gray-50 resize-none h-24`}
                />
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
                    <li>• Minimum age: 16 years old (18+ to drive solo)</li>
                    <li>• Valid driver's license required</li>
                    <li>• Closed-toe shoes mandatory (no sandals)</li>
                    <li>• Not recommended for pregnant women</li>
                    <li>• Weather dependent - may be rescheduled</li>
                    <li>• Maximum 4 vehicles per group</li>
                    <li>
                      • Life vests not included for cenote (additional service)
                    </li>
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

          {/* Form Footer with corrected price calculation */}
          <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
            <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
              <span className='text-gray-400 text-sm uppercase tracking-wide'>
                Total Price
              </span>
              <div className='flex items-center mt-1'>
                <span className='text-3xl font-light'>
                  {currentVehicle?.price
                    ? `$${totalPrice.toFixed(2)}`
                    : 'Contact Us'}
                </span>
                <span className='ml-2 text-sm bg-green-800 px-2 py-1 rounded'>
                  {formData.totalParticipants}{' '}
                  {formData.totalParticipants === 1 ? 'person' : 'people'}
                </span>
              </div>

              {/* Detailed price breakdown */}
              {currentVehicle?.price && (
                <div className='text-xs text-gray-400 mt-2 space-y-1'>
                  <div className='text-green-400 font-medium'>
                    {currentVehicle.name}
                  </div>
                  <div>
                    {formData.vehicleCount} vehicle
                    {formData.vehicleCount !== 1 ? 's' : ''} × $
                    {currentVehicle.price} = ${basePrice.toFixed(2)}
                  </div>
                  <div>Transport: ${transportCost.toFixed(2)}</div>
                  {locationSurcharge > 0 && (
                    <div>
                      Location surcharge: +${locationSurcharge.toFixed(2)}
                    </div>
                  )}
                  {selectedLocation && (
                    <div className='text-green-400'>
                      Pickup: {selectedLocation.name}
                    </div>
                  )}
                  <div className='border-t border-gray-600 pt-1 mt-1 text-white font-medium'>
                    Total: ${totalPrice.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div className='flex space-x-4'>
              <button
                type='button'
                onClick={() => onCancel?.()}
                disabled={isSubmitting}
                className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition disabled:opacity-50'
              >
                Cancel
              </button>

              <button
                type='submit'
                disabled={isSubmitting || !currentVehicle?.price}
                className={`px-8 py-3 ${
                  isPremium
                    ? 'bg-purple-600 hover:bg-purple-500'
                    : 'bg-green-600 hover:bg-green-500'
                } text-white rounded-lg transition flex items-center disabled:opacity-50`}
              >
                <CreditCard className='h-4 w-4 mr-2' />
                {isSubmitting
                  ? 'Booking...'
                  : currentVehicle?.price
                  ? 'Book Adventure'
                  : 'Contact for Booking'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AtvRideForm;
