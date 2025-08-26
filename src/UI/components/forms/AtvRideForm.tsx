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

// Vehicle types with updated pricing
const VEHICLE_TYPES = {
  atv: { name: 'ATV Quad', price: 50, maxParticipants: 1 },
  buggy: { name: 'Dune Buggy', price: 45, maxParticipants: 2 },
  polaris: { name: 'Polaris RZR', price: null, maxParticipants: 2 },
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
    totalParticipants: selectedVehicle?.maxParticipants || 1,
    hasExperience: true,
    specialRequests: '',
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Get vehicle info
  const vehicleInfo =
    VEHICLE_TYPES[formData.vehicleType as keyof typeof VEHICLE_TYPES];

  // Calculate base price
  const basePrice = useMemo(() => {
    if (!vehicleInfo?.price) return 0; // Polaris - contact for pricing
    return vehicleInfo.price * formData.vehicleCount;
  }, [vehicleInfo, formData.vehicleCount]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!vehicleInfo?.price) return 0; // Polaris
    return basePrice + totalLocationCost;
  }, [basePrice, totalLocationCost, vehicleInfo]);

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

  // Handle vehicle count changes
  const updateVehicleCount = useCallback(
    (increment: boolean) => {
      setFormData((prev) => {
        const newCount = increment
          ? Math.min(4, prev.vehicleCount + 1) // Max 4 vehicles
          : Math.max(1, prev.vehicleCount - 1);

        // Update total participants based on vehicle type and count
        const maxParticipantsPerVehicle = vehicleInfo?.maxParticipants || 1;
        const newTotalParticipants = newCount * maxParticipantsPerVehicle;

        return {
          ...prev,
          vehicleCount: newCount,
          totalParticipants: newTotalParticipants,
        };
      });
    },
    [vehicleInfo]
  );

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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

    if (formData.vehicleCount > 4) {
      newErrors.vehicleCount = 'Maximum 4 vehicles allowed';
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

  const isPremium = formData.vehicleType === 'polaris';

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
            subtitle='Explore tropical paradise through jungle trails and pristine
              beaches'
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
                Vehicle Selection
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
                  <option value='atv'>ATV Quad - $50 (1 person)</option>
                  <option value='buggy'>Dune Buggy - $45 (2 people)</option>
                  <option value='polaris'>
                    Polaris RZR - Contact for pricing (2 people)
                  </option>
                </select>
                {errors.vehicleType && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.vehicleType}
                  </p>
                )}
              </div>

              {/* Vehicle Count */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Users
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-purple-600' : 'text-green-600'
                    }`}
                  />
                  Number of Vehicles
                </label>
                <div className='flex border border-gray-300 rounded-lg overflow-hidden max-w-xs bg-white'>
                  <button
                    type='button'
                    onClick={() => updateVehicleCount(false)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                  >
                    -
                  </button>
                  <div className='flex-1 py-2 text-center'>
                    {formData.vehicleCount}
                  </div>
                  <button
                    type='button'
                    onClick={() => updateVehicleCount(true)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                  >
                    +
                  </button>
                </div>
                <p className='text-sm text-gray-600 mt-1'>
                  Total participants: {formData.totalParticipants}
                </p>
                {formData.vehicleCount >= 4 && (
                  <p className='text-sm text-amber-600 mt-1'>
                    Maximum vehicles reached
                  </p>
                )}
                {errors.vehicleCount && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.vehicleCount}
                  </p>
                )}
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

          {/* Form Footer */}
          <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
            <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
              <span className='text-gray-400 text-sm uppercase tracking-wide'>
                Total Price
              </span>
              <div className='flex items-center mt-1'>
                <span className='text-3xl font-light'>
                  {vehicleInfo?.price
                    ? `$${totalPrice.toFixed(2)}`
                    : 'Contact Us'}
                </span>
                <span className='ml-2 text-sm bg-green-800 px-2 py-1 rounded'>
                  {formData.totalParticipants}{' '}
                  {formData.totalParticipants === 1 ? 'person' : 'people'}
                </span>
              </div>

              {/* Price breakdown */}
              {vehicleInfo?.price && (
                <div className='text-xs text-gray-400 mt-2 space-y-1'>
                  <div className='text-green-400 font-medium'>
                    {vehicleInfo.name} × {formData.vehicleCount}
                  </div>
                  <div>Vehicles: ${basePrice.toFixed(2)}</div>
                  <div>Transport: ${transportCost.toFixed(2)}</div>
                  {locationSurcharge > 0 && (
                    <div>Location: +${locationSurcharge.toFixed(2)}</div>
                  )}
                  {selectedLocation && (
                    <div className='text-green-400'>
                      Pickup: {selectedLocation.name}
                    </div>
                  )}
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
                disabled={
                  isSubmitting ||
                  (!vehicleInfo?.price && formData.vehicleType === 'polaris')
                }
                className={`px-8 py-3 ${
                  isPremium
                    ? 'bg-purple-600 hover:bg-purple-500'
                    : 'bg-green-600 hover:bg-green-500'
                } text-white rounded-lg transition flex items-center disabled:opacity-50`}
              >
                <CreditCard className='h-4 w-4 mr-2' />
                {isSubmitting
                  ? 'Booking...'
                  : formData.vehicleType === 'polaris'
                  ? 'Contact for Booking'
                  : 'Book Adventure'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AtvRideForm;
