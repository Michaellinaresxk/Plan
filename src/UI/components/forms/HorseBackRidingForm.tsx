import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

interface HorseBackRidingFormProps {
  service: Service;
  onSubmit?: (formData: any) => void;
  onCancel?: () => void;
}

// Location options configuration - simplified
const LOCATION_OPTIONS = [
  { id: 'punta-cana-resorts', name: 'Punta Cana Resorts' },
  { id: 'cap-cana', name: 'Cap Cana' },
  { id: 'bavaro', name: 'Bavaro' },
  { id: 'punta-village', name: 'Punta Village' },
  { id: 'uvero-alto', name: 'Uvero Alto' },
  { id: 'macao-beach', name: 'Macao Beach Area' },
] as const;

// Experience levels
const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    name: 'First Time Rider',
    description: 'Never ridden before',
  },
  { id: 'novice', name: 'Beginner', description: 'Limited experience' },
  {
    id: 'intermediate',
    name: 'Some Experience',
    description: 'Comfortable with basics',
  },
  {
    id: 'advanced',
    name: 'Experienced Rider',
    description: 'Confident and skilled',
  },
] as const;

// Package options
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
  },
];

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
    timeSlot: '', // 'morning', 'afternoon', 'sunset'
    location: '',
    participantCount: 2,
    minorsCount: 0,
    packageType: 'classic-beach', // 'classic-beach', 'sunset-premium'
    experienceLevel: 'beginner',
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    confirmSpecialNeeds: false,
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(service.price);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate price based on selections
  useEffect(() => {
    const selectedPackage = PACKAGE_OPTIONS.find(
      (pkg) => pkg.id === formData.packageType
    );
    const basePrice = selectedPackage?.price || service.price;

    // Simple pricing: base price per participant
    const totalPrice = basePrice * formData.participantCount;

    // Additional fee for special needs accommodations
    const specialNeedsFee = formData.hasSpecialNeeds ? 25 : 0;

    setCurrentPrice(totalPrice + specialNeedsFee);
  }, [
    formData.participantCount,
    formData.packageType,
    formData.hasSpecialNeeds,
    service.price,
  ]);

  // Handle input changes
  const handleChange = (
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
  };

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

  // Handle participant count changes
  const updateParticipantCount = (increment: boolean) => {
    setFormData((prev) => {
      const newCount = increment
        ? Math.min(8, prev.participantCount + 1) // Max 8 people for safety
        : Math.max(1, prev.participantCount - 1);

      // If decreasing participants, ensure minors count doesn't exceed total
      const adjustedMinorsCount = Math.min(prev.minorsCount, newCount);

      return {
        ...prev,
        participantCount: newCount,
        minorsCount: adjustedMinorsCount,
      };
    });
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
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

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Please select experience level';
    }

    // Validate minors count
    if (formData.minorsCount > formData.participantCount) {
      newErrors.minorsCount =
        'Number of minors cannot exceed total participants';
    }

    if (formData.minorsCount < 0) {
      newErrors.minorsCount = 'Number of minors cannot be negative';
    }

    // Validate special needs
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

    console.log(
      '🏇 HorseBackRidingForm - Starting submission with data:',
      formData
    );

    if (!validateForm()) {
      console.log('❌ HorseBackRidingForm - Validation errors:', errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDate = new Date(formData.date);
      const bookingStartDate = new Date(selectedDate);
      const bookingEndDate = new Date(selectedDate);

      // Set times based on time slot
      switch (formData.timeSlot) {
        case 'morning':
          bookingStartDate.setHours(9, 0, 0, 0);
          bookingEndDate.setHours(11, 0, 0, 0);
          break;
        case 'afternoon':
          bookingStartDate.setHours(14, 0, 0, 0);
          bookingEndDate.setHours(16, 0, 0, 0);
          break;
        case 'sunset':
          bookingStartDate.setHours(16, 30, 0, 0);
          bookingEndDate.setHours(19, 0, 0, 0);
          break;
      }

      // Get selected location name
      const selectedLocation =
        LOCATION_OPTIONS.find((loc) => loc.id === formData.location)?.name ||
        formData.location;

      // Get selected package
      const selectedPackage = PACKAGE_OPTIONS.find(
        (pkg) => pkg.id === formData.packageType
      );

      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'horseback-riding',
          totalPrice: currentPrice,
          calculatedPrice: currentPrice,
          locationName: selectedLocation,
          packageDetails: selectedPackage,
        },
        totalPrice: currentPrice,
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
            name: selectedPackage?.name || 'Horseback Riding Adventure',
            quantity: 1,
            price: currentPrice,
            totalPrice: currentPrice,
            timeSlot: formData.timeSlot,
            packageType: formData.packageType,
            experienceLevel: formData.experienceLevel,
            location: selectedLocation,
          },
        ],
        clientInfo: undefined,
        horsebackSpecifics: {
          timeSlot: formData.timeSlot,
          location: formData.location,
          locationName: selectedLocation,
          packageType: formData.packageType,
          packageName: selectedPackage?.name,
          experienceLevel: formData.experienceLevel,
          hasSpecialNeeds: formData.hasSpecialNeeds,
          specialNeedsDetails: formData.specialNeedsDetails,
          participantCount: formData.participantCount,
          minorsCount: formData.minorsCount,
          additionalNotes: formData.additionalNotes,
        },
      };

      console.log(
        '🏇 HorseBackRidingForm - Reservation data created:',
        reservationData
      );

      setReservationData(reservationData);

      if (onSubmit) {
        console.log('🏇 HorseBackRidingForm - Calling onSubmit callback');
        await onSubmit(reservationData);
      } else {
        console.log(
          '🏇 HorseBackRidingForm - No onSubmit, navigating to confirmation'
        );
        router.push('/reservation-confirmation');
      }
    } catch (error) {
      console.error('❌ HorseBackRidingForm - Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPremium = formData.packageType === 'sunset-premium';

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
            {/* Package Selection */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Sparkles
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-amber-600'
                  }`}
                />
                Choose Your Package
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {PACKAGE_OPTIONS.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.packageType === pkg.id
                          ? `${
                              isPremium
                                ? 'bg-orange-50 border-orange-300'
                                : 'bg-amber-50 border-amber-300'
                            } shadow-sm`
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, packageType: pkg.id }))
                    }
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center'>
                        <div
                          className={`
                          w-5 h-5 rounded-full border flex items-center justify-center mr-3
                          ${
                            formData.packageType === pkg.id
                              ? `${
                                  isPremium
                                    ? 'border-orange-500 bg-orange-500'
                                    : 'border-amber-500 bg-amber-500'
                                }`
                              : 'border-gray-300'
                          }
                        `}
                        >
                          {formData.packageType === pkg.id && (
                            <CheckCircle className='w-4 h-4 text-white' />
                          )}
                        </div>
                        <span className='font-bold text-gray-800'>
                          {pkg.name}
                        </span>
                      </div>
                      <span className='text-xl font-bold text-gray-800'>
                        ${pkg.price}
                      </span>
                    </div>
                    <p className='text-gray-600 text-sm ml-8'>
                      {pkg.description}
                    </p>
                    <div className='flex items-center text-gray-500 text-sm mt-1 ml-8'>
                      <Clock className='w-4 h-4 mr-1' />
                      {pkg.duration}
                    </div>
                  </div>
                ))}
              </div>

              {errors.packageType && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.packageType}
                </p>
              )}
            </div>

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

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {/* Morning Option */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.timeSlot === 'morning'
                          ? `${
                              isPremium
                                ? 'bg-orange-50 border-orange-300'
                                : 'bg-amber-50 border-amber-300'
                            } shadow-sm`
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, timeSlot: 'morning' }))
                    }
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${
                          formData.timeSlot === 'morning'
                            ? `${
                                isPremium
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-amber-500 bg-amber-500'
                              }`
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.timeSlot === 'morning' && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <Sunrise
                          className={`w-5 h-5 mr-2 ${
                            isPremium ? 'text-orange-500' : 'text-amber-500'
                          }`}
                        />
                        <span className='font-medium'>Morning</span>
                      </div>
                    </div>
                    <p className='text-gray-500 text-sm mt-2 ml-8'>
                      9:00 AM - 11:00 AM
                    </p>
                  </div>

                  {/* Afternoon Option */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.timeSlot === 'afternoon'
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
                        timeSlot: 'afternoon',
                      }))
                    }
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${
                          formData.timeSlot === 'afternoon'
                            ? `${
                                isPremium
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-amber-500 bg-amber-500'
                              }`
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.timeSlot === 'afternoon' && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <Sun
                          className={`w-5 h-5 mr-2 ${
                            isPremium ? 'text-orange-500' : 'text-amber-500'
                          }`}
                        />
                        <span className='font-medium'>Afternoon</span>
                      </div>
                    </div>
                    <p className='text-gray-500 text-sm mt-2 ml-8'>
                      2:00 PM - 4:00 PM
                    </p>
                  </div>

                  {/* Sunset Option */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all relative
                      ${
                        formData.timeSlot === 'sunset'
                          ? `${
                              isPremium
                                ? 'bg-orange-50 border-orange-300'
                                : 'bg-amber-50 border-amber-300'
                            } shadow-sm`
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, timeSlot: 'sunset' }))
                    }
                  >
                    {formData.packageType === 'sunset-premium' && (
                      <div className='absolute top-1 right-1 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold'>
                        PREMIUM
                      </div>
                    )}
                    <div className='flex items-center'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${
                          formData.timeSlot === 'sunset'
                            ? `${
                                isPremium
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-amber-500 bg-amber-500'
                              }`
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.timeSlot === 'sunset' && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <Activity
                          className={`w-5 h-5 mr-2 ${
                            isPremium ? 'text-orange-500' : 'text-amber-500'
                          }`}
                        />
                        <span className='font-medium'>Sunset</span>
                      </div>
                    </div>
                    <p className='text-gray-500 text-sm mt-2 ml-8'>
                      4:30 PM - 7:00 PM
                    </p>
                    {formData.packageType === 'sunset-premium' && (
                      <p className='text-orange-600 text-xs mt-1 ml-8 font-medium'>
                        Includes champagne toast
                      </p>
                    )}
                  </div>
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
                    isPremium ? 'text-orange-600' : 'text-amber-600'
                  }`}
                />
                Pickup Location
              </h3>

              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                  <MapPin
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-orange-600' : 'text-amber-600'
                    }`}
                  />
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
                            ? `${
                                isPremium
                                  ? 'bg-orange-50 border-orange-300'
                                  : 'bg-amber-50 border-amber-300'
                              } shadow-sm`
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
                              ? `${
                                  isPremium
                                    ? 'border-orange-500 bg-orange-500'
                                    : 'border-amber-500 bg-amber-500'
                                }`
                              : 'border-gray-300'
                          }
                        `}
                        >
                          {formData.location === location.id && (
                            <CheckCircle className='w-4 h-4 text-white' />
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
                  <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
                )}

                {/* Additional pickup info */}
                {formData.location && (
                  <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-start'>
                      <Info className='w-4 h-4 text-blue-600 mr-2 mt-0.5' />
                      <div className='text-sm text-blue-800'>
                        <strong>Pickup Information:</strong> Our team will
                        contact you 24 hours before your tour to confirm the
                        exact pickup time and location within your selected
                        area.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Participants Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Users
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-amber-600'
                  }`}
                />
                Participants
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
                    Maximum group size reached
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
                      {formData.minorsCount} participant(s) under 18 detected.
                      Adult supervision is required. Minimum age is 6 years.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Experience Level Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Star
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-amber-600'
                  }`}
                />
                Riding Experience
              </h3>

              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                  <Star
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-orange-600' : 'text-amber-600'
                    }`}
                  />
                  What's your riding experience? *
                </label>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <div
                      key={level.id}
                      className={`
                        border rounded-lg p-4 cursor-pointer transition-all
                        ${
                          formData.experienceLevel === level.id
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
                          experienceLevel: level.id,
                        }))
                      }
                    >
                      <div className='flex items-start'>
                        <div
                          className={`
                          w-5 h-5 rounded-full border flex items-center justify-center mr-3 mt-0.5
                          ${
                            formData.experienceLevel === level.id
                              ? `${
                                  isPremium
                                    ? 'border-orange-500 bg-orange-500'
                                    : 'border-amber-500 bg-amber-500'
                                }`
                              : 'border-gray-300'
                          }
                        `}
                        >
                          {formData.experienceLevel === level.id && (
                            <CheckCircle className='w-4 h-4 text-white' />
                          )}
                        </div>
                        <div>
                          <span className='font-medium text-gray-800'>
                            {level.name}
                          </span>
                          <p className='text-sm text-gray-600 mt-1'>
                            {level.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.experienceLevel && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.experienceLevel}
                  </p>
                )}
              </div>
            </div>

            {/* Special Needs Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Shield
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-amber-600'
                  }`}
                />
                Safety & Special Considerations
              </h3>

              {/* Special Needs Toggle */}
              <div className='mt-4'>
                <div
                  className={`
                    flex items-center justify-between p-4 border rounded-lg cursor-pointer
                    ${
                      formData.hasSpecialNeeds
                        ? `${
                            isPremium
                              ? 'border-orange-300 bg-orange-50'
                              : 'border-amber-300 bg-amber-50'
                          }`
                        : 'border-gray-200 hover:bg-gray-50'
                    }
                  `}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      hasSpecialNeeds: !prev.hasSpecialNeeds,
                      specialNeedsDetails: !prev.hasSpecialNeeds
                        ? prev.specialNeedsDetails
                        : '',
                      confirmSpecialNeeds: !prev.hasSpecialNeeds
                        ? prev.confirmSpecialNeeds
                        : false,
                    }))
                  }
                >
                  <div className='flex items-center'>
                    <div
                      className={`
                      w-5 h-5 rounded-full border flex items-center justify-center mr-3
                      ${
                        formData.hasSpecialNeeds
                          ? `${
                              isPremium
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-amber-500 bg-amber-500'
                            }`
                          : 'border-gray-300'
                      }
                    `}
                    >
                      {formData.hasSpecialNeeds && (
                        <CheckCircle className='w-4 h-4 text-white' />
                      )}
                    </div>
                    <span className='font-medium text-gray-800'>
                      Physical limitations or mobility concerns
                    </span>
                  </div>
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      isPremium ? 'text-orange-500' : 'text-amber-500'
                    }`}
                  />
                </div>

                {/* Special Needs Details */}
                {formData.hasSpecialNeeds && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-4 p-4 border rounded-lg ${
                      isPremium ? 'border-orange-200' : 'border-amber-200'
                    }`}
                  >
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Please specify any physical limitations or concerns *
                    </label>
                    <textarea
                      name='specialNeedsDetails'
                      value={formData.specialNeedsDetails}
                      onChange={handleChange}
                      placeholder='Describe any injuries, mobility issues, or conditions that would affect your riding experience...'
                      className={`w-full p-3 border ${
                        errors.specialNeedsDetails
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } rounded-lg ${
                        isPremium
                          ? 'focus:ring-orange-500 focus:border-orange-500'
                          : 'focus:ring-amber-500 focus:border-amber-500'
                      } bg-white resize-none h-24`}
                    />
                    {errors.specialNeedsDetails && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.specialNeedsDetails}
                      </p>
                    )}

                    {/* Confirmation checkbox */}
                    <div className='mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                      <div className='flex items-start'>
                        <div className='flex items-center h-5'>
                          <input
                            id='confirmSpecialNeeds'
                            name='confirmSpecialNeeds'
                            type='checkbox'
                            checked={formData.confirmSpecialNeeds}
                            onChange={handleChange}
                            className={`h-4 w-4 ${
                              isPremium ? 'text-orange-600' : 'text-amber-600'
                            } focus:ring-2 border-gray-300 rounded`}
                          />
                        </div>
                        <label
                          htmlFor='confirmSpecialNeeds'
                          className='ml-3 text-sm text-gray-700'
                        >
                          I confirm that the information provided is accurate
                          and understand that our guides will provide
                          appropriate assistance
                        </label>
                      </div>
                      {errors.confirmSpecialNeeds && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.confirmSpecialNeeds}
                        </p>
                      )}
                    </div>

                    <div className='mt-3 flex items-start'>
                      <Info className='h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0' />
                      <p className='text-xs text-gray-500'>
                        Additional fee for specialized assistance. Our
                        experienced guides will ensure a safe and enjoyable
                        experience tailored to your needs.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Additional Notes Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Info
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-amber-600'
                  }`}
                />
                Additional Information
              </h3>

              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Info
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-orange-600' : 'text-amber-600'
                    }`}
                  />
                  Special Requests
                </label>
                <textarea
                  name='additionalNotes'
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder='Celebration details, dietary requirements, photo preferences, or any other special requests...'
                  className={`w-full p-3 border border-gray-300 rounded-lg ${
                    isPremium
                      ? 'focus:ring-orange-500 focus:border-orange-500'
                      : 'focus:ring-amber-500 focus:border-amber-500'
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
                    <li>• Minimum age: 6 years old</li>
                    <li>• Maximum weight: 250 lbs (113 kg)</li>
                    <li>• Closed-toe shoes required (no sandals)</li>
                    <li>• Not recommended for pregnant women</li>
                    <li>• Weather dependent - may be rescheduled</li>
                    <li>• All riders must follow guide instructions</li>
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
                  ${currentPrice.toFixed(2)}
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
                <div>
                  Participants: {formData.participantCount} × $
                  {PACKAGE_OPTIONS.find(
                    (pkg) => pkg.id === formData.packageType
                  )?.price || service.price}
                </div>
                {formData.minorsCount > 0 && (
                  <div className='text-yellow-400'>
                    {formData.minorsCount} participant(s) under 18
                  </div>
                )}
                {formData.hasSpecialNeeds && (
                  <div>Specialized assistance: +$25</div>
                )}
                <div className='text-amber-400'>
                  Includes: Transportation, equipment, guide & refreshments
                </div>
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
