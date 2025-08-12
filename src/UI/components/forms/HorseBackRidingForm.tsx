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
  Star,
  Mountain,
  Sparkles,
  Shield,
  CreditCard,
  Sunrise,
  Sun,
  Activity,
  DollarSign,
} from 'lucide-react';
import { useLocationPricing } from '@/hooks/useLocationPricing';
import { LocationSelector } from '../service/LocationSelector';

interface HorseBackRidingFormProps {
  service: Service;
  onSubmit?: (formData: any) => void;
  onCancel?: () => void;
}

// Time slot configuration - specific for horseback riding
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
  {
    id: '2pm',
    name: 'Afternoon Adventure',
    time: '2:00 PM',
    icon: Activity,
    description: 'Perfect for photos',
  },
] as const;

// Package options with updated pricing
const PACKAGE_OPTIONS = [
  {
    id: 'classic-beach',
    name: 'Classic Beach Adventure',
    price: 89,
    duration: '2 Hours',
    description: 'Perfect introduction to beach horseback riding',
  },
  {
    id: 'sunset-premium',
    name: 'Premium Sunset Experience',
    price: 129,
    duration: '2.5 Hours',
    description: 'Romantic sunset ride with champagne toast',
    availableTimeSlots: ['2pm'], // Only available at 2pm for sunset timing
  },
];

// Horseback riding specific transport pricing
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

  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    location: '',
    participantCount: 2,
    minorsCount: 0,
    packageType: 'classic-beach',
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    confirmSpecialNeeds: false,
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
    totalParticipants: formData.participantCount,
    servicePricing: HORSEBACK_TRANSPORT_PRICING,
  });

  // Calculate base price
  const basePrice = useMemo(() => {
    const selectedPackage = PACKAGE_OPTIONS.find(
      (pkg) => pkg.id === formData.packageType
    );
    let price =
      (selectedPackage?.price || service.price) * formData.participantCount;

    // Add special needs fee if applicable
    if (formData.hasSpecialNeeds) {
      price += 25;
    }

    return price;
  }, [
    formData.packageType,
    formData.participantCount,
    formData.hasSpecialNeeds,
    service.price,
  ]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return basePrice + totalLocationCost;
  }, [basePrice, totalLocationCost]);

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

        if (name === 'hasSpecialNeeds' && !checked) {
          setFormData((prev) => ({
            ...prev,
            hasSpecialNeeds: false,
            specialNeedsDetails: '',
            confirmSpecialNeeds: false,
          }));
        }
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

  // Handle participant count changes
  const updateParticipantCount = useCallback((increment: boolean) => {
    setFormData((prev) => {
      const newCount = increment
        ? Math.min(8, prev.participantCount + 1) // Max 8 people for safety
        : Math.max(1, prev.participantCount - 1);

      const adjustedMinorsCount = Math.min(prev.minorsCount, newCount);

      return {
        ...prev,
        participantCount: newCount,
        minorsCount: adjustedMinorsCount,
      };
    });
  }, []);

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

    if (!formData.packageType) {
      newErrors.packageType = 'Please select a package';
    }

    if (formData.minorsCount > formData.participantCount) {
      newErrors.minorsCount =
        'Number of minors cannot exceed total participants';
    }

    if (formData.participantCount > 8) {
      newErrors.participantCount = 'Maximum 8 participants allowed for safety';
    }

    if (formData.hasSpecialNeeds) {
      if (!formData.specialNeedsDetails.trim()) {
        newErrors.specialNeedsDetails =
          'Please provide details about special needs';
      }

      if (!formData.confirmSpecialNeeds) {
        newErrors.confirmSpecialNeeds =
          'Please confirm special needs accommodation';
      }
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

      // Set times based on time slot - specific times for horseback riding
      switch (formData.timeSlot) {
        case '8am':
          bookingStartDate.setHours(8, 0, 0, 0);
          bookingEndDate.setHours(11, 0, 0, 0); // 3 hour duration
          break;
        case '10am':
          bookingStartDate.setHours(10, 0, 0, 0);
          bookingEndDate.setHours(13, 0, 0, 0); // 3 hour duration
          break;
        case '2pm':
          bookingStartDate.setHours(14, 0, 0, 0);
          bookingEndDate.setHours(17, 0, 0, 0); // 3 hour duration
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
            id: `horseback-${formData.packageType}`,
            quantity: 1,
            price: totalPrice,
            totalPrice,
            timeSlot: formData.timeSlot,
            packageType: formData.packageType,
            location: selectedLocation?.name || formData.location,
          },
        ],
        clientInfo: undefined,
        horsebackSpecifics: {
          timeSlot: formData.timeSlot,
          location: formData.location,
          locationName: selectedLocation?.name || formData.location,
          packageType: formData.packageType,
          hasSpecialNeeds: formData.hasSpecialNeeds,
          specialNeedsDetails: formData.specialNeedsDetails,
          participantCount: formData.participantCount,
          minorsCount: formData.minorsCount,
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

  const isPremium = formData.packageType === 'sunset-premium';

  // Get available time slots for selected package
  const availableTimeSlots = useMemo(() => {
    const selectedPackage = PACKAGE_OPTIONS.find(
      (pkg) => pkg.id === formData.packageType
    );
    if (selectedPackage?.availableTimeSlots) {
      return TIME_SLOTS.filter((slot) =>
        selectedPackage.availableTimeSlots.includes(slot.id)
      );
    }
    return TIME_SLOTS;
  }, [formData.packageType]);

  // Pricing breakdown component
  const PricingBreakdown = () => (
    <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
      <h4 className='font-medium text-blue-800 mb-3 flex items-center'>
        <DollarSign className='w-4 h-4 mr-2' />
        Pricing Breakdown
      </h4>
      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span>
            Package ({formData.participantCount} × $
            {PACKAGE_OPTIONS.find((pkg) => pkg.id === formData.packageType)
              ?.price || service.price}
            ):
          </span>
          <span>${basePrice - (formData.hasSpecialNeeds ? 25 : 0)}</span>
        </div>
        {formData.hasSpecialNeeds && (
          <div className='flex justify-between'>
            <span>Special assistance:</span>
            <span>$25.00</span>
          </div>
        )}
        <div className='flex justify-between font-medium'>
          <span>Subtotal (package costs):</span>
          <span>${basePrice.toFixed(2)}</span>
        </div>
        <div className='flex justify-between'>
          <span>
            Transport ({formData.participantCount <= 6 ? '1-6' : '7-8'} people):
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
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
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
          <div
            className={`bg-gradient-to-r ${
              isPremium
                ? 'from-orange-800 via-orange-700 to-orange-800'
                : 'from-amber-800 via-amber-700 to-amber-800'
            } p-6 text-white`}
          >
            <h2 className='text-2xl font-semibold tracking-wide flex items-center'>
              <Mountain className='w-6 h-6 mr-3' />
              Horseback Riding Adventure
            </h2>
            <p
              className={`${
                isPremium ? 'text-orange-100' : 'text-amber-100'
              } mt-1 font-light`}
            >
              Experience the magic of riding along pristine Macao Beach
            </p>
          </div>

          {/* Form Body */}
          <div className='p-8 space-y-8'>
            {/* Date and Time Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Calendar
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-amber-600'
                  }`}
                />
                Schedule Your Adventure
              </h3>

              {/* Date Selection */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-orange-600' : 'text-amber-600'
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
                      ? 'focus:ring-orange-500 focus:border-orange-500'
                      : 'focus:ring-amber-500 focus:border-amber-500'
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
                      isPremium ? 'text-orange-600' : 'text-amber-600'
                    }`}
                  />
                  Time Slot *
                </label>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {availableTimeSlots.map((slot) => {
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
                                    ? 'bg-orange-50 border-orange-300'
                                    : 'bg-amber-50 border-amber-300'
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
                                      ? 'border-orange-500 bg-orange-500'
                                      : 'border-amber-500 bg-amber-500'
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
                                isPremium ? 'text-orange-500' : 'text-amber-500'
                              }`}
                            />
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

            {/* Location Selection using the new component */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <MapPin
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-amber-600'
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

              {formData.location && (
                <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                  <div className='flex items-start'>
                    <Info className='w-4 h-4 text-blue-600 mr-2 mt-0.5' />
                    <div className='text-sm text-blue-800'>
                      <strong>Pickup Information:</strong> Our team will contact
                      you 24 hours before your tour to confirm the exact pickup
                      time and location within your selected area.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Participants Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Users
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-amber-600'
                  }`}
                />
                Participants (Maximum 8 for safety)
              </h3>

              {/* Participant Count */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Users
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-orange-600' : 'text-amber-600'
                    }`}
                  />
                  Number of Participants
                </label>
                <div className='flex border border-gray-300 rounded-lg overflow-hidden max-w-xs bg-white'>
                  <button
                    type='button'
                    onClick={() => updateParticipantCount(false)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                  >
                    -
                  </button>
                  <div className='flex-1 py-2 text-center'>
                    {formData.participantCount}
                  </div>
                  <button
                    type='button'
                    onClick={() => updateParticipantCount(true)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                  >
                    +
                  </button>
                </div>
                {formData.participantCount >= 8 && (
                  <p className='text-sm text-amber-600 mt-1'>
                    Maximum group size reached (safety limit)
                  </p>
                )}
                {errors.participantCount && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.participantCount}
                  </p>
                )}
              </div>

              {/* Minors Count */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Baby
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-orange-600' : 'text-amber-600'
                    }`}
                  />
                  Number of participants under 18
                </label>
                <input
                  type='number'
                  name='minorsCount'
                  min='0'
                  max={formData.participantCount}
                  value={formData.minorsCount}
                  onChange={handleChange}
                  className={`w-full max-w-xs p-3 border ${
                    errors.minorsCount ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 ${
                    isPremium
                      ? 'focus:ring-orange-500 focus:border-orange-500'
                      : 'focus:ring-amber-500 focus:border-amber-500'
                  } bg-gray-50`}
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
                      Children under 6 must be accompanied by an adult. Minimum
                      age is 6 years for solo riding.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing breakdown */}
            <PricingBreakdown />

            {/* Special Needs Section - keeping existing code for brevity */}
            {/* ... (same as original) ... */}

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
                  {
                    PACKAGE_OPTIONS.find(
                      (pkg) => pkg.id === formData.packageType
                    )?.name
                  }
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
                onClick={() => onCancel?.()}
                disabled={isSubmitting}
                className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition disabled:opacity-50'
              >
                Cancel
              </button>

              <button
                type='submit'
                disabled={isSubmitting}
                className={`px-8 py-3 ${
                  isPremium
                    ? 'bg-orange-600 hover:bg-orange-500'
                    : 'bg-amber-600 hover:bg-amber-500'
                } text-white rounded-lg transition flex items-center disabled:opacity-50`}
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
