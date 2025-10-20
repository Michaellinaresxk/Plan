import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Waves,
  Crown,
  Users,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  Info,
  Baby,
  MapPin,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/client';
import {
  LOCATION_OPTIONS,
  LuxeYachtFormProps,
  YachtFormData,
} from '@/types/yachts';
import { ACTIVITY_OPTIONS, TIME_SLOTS } from '@/constants/yacht/yachts';

const LuxeYachtForm: React.FC<LuxeYachtFormProps> = ({
  yacht: providedYacht,
  service,
  onSubmit,
  onCancel,
  isOpen,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  // Default yacht data si no se proporciona uno
  const defaultYacht = {
    id: 'azimut-s7',
    name: 'Azimut S7',
    price: 3500,
    isPremium: false,
    mainImage:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=800&fit=crop',
    specifications: {
      maxGuests: 12,
      length: '68 ft',
      cabins: 3,
      bathrooms: 2,
      crew: 3,
      maxSpeed: '32 knots',
      manufacturer: 'Azimut',
      year: 2023,
    },
    location: 'Punta Cana Marina',
  };

  // Usar el yacht proporcionado o el por defecto
  const yacht = providedYacht || defaultYacht;

  const [formData, setFormData] = useState<YachtFormData>({
    date: '',
    startTime: '',
    guests: 2,
    minorsCount: 0,
    name: '',
    email: '',
    phone: '',
    message: '',
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    confirmSpecialNeeds: false,
    experienceLevel: 'beginner',
    activityPreferences: [],
    location: '', // Agregamos location al estado
  });

  const [errors, setErrors] = useState<Partial<YachtFormData>>({});
  const [currentPrice, setCurrentPrice] = useState(yacht?.price || 3500);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate price based on guest count and special needs
  useEffect(() => {
    if (!yacht?.price) return;

    const basePrice = yacht.price;
    const pricePerGuest = formData.guests > 4 ? basePrice * 1.1 : basePrice; // 10% increase for more than 4 guests
    const specialNeedsFee = formData.hasSpecialNeeds ? 50 : 0; // Special needs accommodation fee

    setCurrentPrice(pricePerGuest + specialNeedsFee);
  }, [formData.guests, formData.hasSpecialNeeds, yacht?.price]);

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

  // Handle location selection - igual que PersonalTrainerForm
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

  // Handle activity preferences selection
  const toggleActivityPreference = (activityId: string) => {
    setFormData((prev) => ({
      ...prev,
      activityPreferences: prev.activityPreferences.includes(activityId)
        ? prev.activityPreferences.filter((id) => id !== activityId)
        : [...prev.activityPreferences, activityId],
    }));
  };

  // Handle guest count changes
  const updateGuestCount = (increment: boolean) => {
    setFormData((prev) => {
      const maxGuests = yacht?.specifications?.maxGuests || 12;
      const newCount = increment
        ? Math.min(prev.guests + 1, maxGuests)
        : Math.max(1, prev.guests - 1);

      // If decreasing guests, ensure minors count doesn't exceed total
      const adjustedMinorsCount = Math.min(prev.minorsCount, newCount);

      return {
        ...prev,
        guests: newCount,
        minorsCount: adjustedMinorsCount,
      };
    });
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Partial<YachtFormData> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = t('form.errors.required', {
        fallback: 'Name is required',
      });
    }

    if (!formData.email.trim()) {
      newErrors.email = t('form.errors.required', {
        fallback: 'Email is required',
      });
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('form.errors.required', {
        fallback: 'Phone is required',
      });
    }

    if (!formData.date) {
      newErrors.date = t('form.errors.required', {
        fallback: 'Date is required',
      });
    }

    if (!formData.startTime) {
      newErrors.startTime = t('form.errors.required', {
        fallback: 'Start time is required',
      });
    }

    if (!formData.location) {
      newErrors.location = t('form.errors.required', {
        fallback: 'Please select a location',
      });
    }

    // Validate minors count
    if (formData.minorsCount > formData.guests) {
      newErrors.minorsCount = 'Number of minors cannot exceed total guests';
    }

    if (formData.minorsCount < 0) {
      newErrors.minorsCount = 'Number of minors cannot be negative';
    }

    // Validate special needs
    if (formData.hasSpecialNeeds) {
      if (!formData.specialNeedsDetails.trim()) {
        newErrors.specialNeedsDetails = t('form.errors.required', {
          fallback: 'Please provide details about special needs',
        });
      }

      if (!formData.confirmSpecialNeeds) {
        newErrors.confirmSpecialNeeds = t('form.errors.confirmation', {
          fallback: 'Please confirm special needs accommodation',
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - igual que PersonalTrainerForm
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('❌ YachtForm - Validation errors:', errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDate = new Date(formData.date);
      const bookingStartDate = new Date(selectedDate);
      const bookingEndDate = new Date(selectedDate);

      // Set start time based on selection
      const [hours, minutes] = formData.startTime.split(':').map(Number);
      bookingStartDate.setHours(hours, minutes || 0, 0, 0);

      // Yacht service is typically 8.5 hours (9 AM - 5:30 PM)
      bookingEndDate.setHours(17, 30, 0, 0);

      // Get selected location name
      const selectedLocation =
        LOCATION_OPTIONS.find((loc) => loc.id === formData.location)?.name ||
        formData.location;

      // Get selected activities names
      const selectedActivities = ACTIVITY_OPTIONS.filter((activity) =>
        formData.activityPreferences.includes(activity.id)
      ).map((activity) => activity.name);

      const reservationData = {
        service: service || {
          id: yacht?.id || defaultYacht.id,
          name: yacht?.name || defaultYacht.name,
          price: yacht?.price || defaultYacht.price,
          packageType: yacht?.isPremium ? 'premium' : 'standard',
        },
        formData: {
          ...formData,
          serviceType: 'yacht',
          totalPrice: currentPrice,
          calculatedPrice: currentPrice,
          locationName: selectedLocation,
        },
        totalPrice: currentPrice,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: formData.guests - formData.minorsCount,
          children: formData.minorsCount,
          total: formData.guests,
        },
        selectedItems: [
          {
            id: `yacht-${yacht?.id || defaultYacht.id}`,
            name: `${yacht?.name || defaultYacht.name} - Caribbean Experience`,
            quantity: 1,
            price: currentPrice,
            totalPrice: currentPrice,
            startTime: formData.startTime,
            specialNeeds: formData.hasSpecialNeeds,
            location: selectedLocation,
            activities: selectedActivities,
          },
        ],
        clientInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        yachtSpecifics: {
          yachtId: yacht?.id || defaultYacht.id,
          yachtName: yacht?.name || defaultYacht.name,
          startTime: formData.startTime,
          location: formData.location,
          locationName: selectedLocation,
          hasSpecialNeeds: formData.hasSpecialNeeds,
          specialNeedsDetails: formData.specialNeedsDetails,
          guests: formData.guests,
          minorsCount: formData.minorsCount,
          experienceLevel: formData.experienceLevel,
          activityPreferences: formData.activityPreferences,
          selectedActivities: selectedActivities,
          additionalNotes: formData.message,
          yachtSpecs: yacht?.specifications || defaultYacht.specifications,
        },
      };

      const emailData = {
        serviceName: yacht?.name || defaultYacht.name,
        serviceType: 'luxury-yacht',
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        tourDate: formData.date,
        timeSlot: formData.startTime,
        totalGuests: formData.guests,
        childCount: formData.minorsCount,
        totalPrice: currentPrice,
        message: formData.message,
      };

      fetch('/api/services/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      }).catch((error) => console.error('❌ Email failed:', error));

      console.log('🛥️ YachtForm - Reservation data created:', reservationData);

      // Use setReservationData and router.push like PersonalTrainerForm
      setReservationData(reservationData);

      if (onSubmit) {
        await onSubmit(reservationData);
      }

      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ YachtForm - Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const isPremium =
    yacht?.isPremium || service?.packageType?.includes('premium');

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'
    >
      <div className='bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl'>
        {/* Form Header */}
        <div className='relative'>
          {/* Background Image */}
          <div className='h-40 overflow-hidden'>
            <img
              src={yacht?.mainImage || defaultYacht.mainImage}
              alt={yacht?.name || defaultYacht.name}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
          </div>

          {/* Close Button */}
          <button
            onClick={onCancel}
            className='absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors'
          >
            <X className='w-4 h-4' />
          </button>

          {/* Header Content */}
          <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='flex items-center gap-3 mb-2'>
                  <h2 className='text-2xl font-light tracking-wide'>
                    {yacht?.name || defaultYacht.name}
                  </h2>
                  {isPremium && (
                    <div className='bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1'>
                      <Crown className='w-3 h-3' />
                      Premium
                    </div>
                  )}
                </div>
                <p className='text-white/90 text-sm'>
                  {t('services.yacht.formDescription', {
                    fallback:
                      'Private Caribbean yacht experience - 9:00 AM to 5:30 PM',
                  })}
                </p>
              </div>
              <div className='text-right'>
                <div className='text-3xl font-light'>
                  ${currentPrice.toLocaleString()}
                </div>
                <div className='text-white/80 text-sm'>per day</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className='max-h-[60vh] overflow-y-auto'>
          <form onSubmit={handleSubmit} className='p-8 space-y-8'>
            {/* Date and Time Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Calendar
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.yacht.scheduling', {
                  fallback: 'Yacht Scheduling',
                })}
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Date Selection */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Calendar
                      className={`w-4 h-4 mr-2 ${
                        isPremium ? 'text-amber-600' : 'text-teal-600'
                      }`}
                    />
                    {t('services.yacht.date', { fallback: 'Select Date' })} *
                  </label>
                  <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleChange}
                    onClick={(e) => e.currentTarget.showPicker()}
                    min={getTomorrowDate()}
                    className={`w-full p-3 border ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 ${
                      isPremium
                        ? 'focus:ring-amber-500 focus:border-amber-500'
                        : 'focus:ring-teal-500 focus:border-teal-500'
                    } bg-gray-50`}
                  />
                  {errors.date && (
                    <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
                  )}
                </div>

                {/* Start Time Selection */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Clock
                      className={`w-4 h-4 mr-2 ${
                        isPremium ? 'text-amber-600' : 'text-teal-600'
                      }`}
                    />
                    {t('services.yacht.startTime', {
                      fallback: 'Departure Time',
                    })}{' '}
                    *
                  </label>
                  <select
                    name='startTime'
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.startTime ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 ${
                      isPremium
                        ? 'focus:ring-amber-500 focus:border-amber-500'
                        : 'focus:ring-teal-500 focus:border-teal-500'
                    } bg-gray-50`}
                  >
                    <option value=''>Select departure time</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.name}
                      </option>
                    ))}
                  </select>
                  {errors.startTime && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.startTime}
                    </p>
                  )}
                  <p className='text-xs text-gray-500 mt-1'>
                    Service ends at 5:30 PM regardless of start time
                  </p>
                </div>
              </div>
            </div>

            {/* Location Selection - igual que PersonalTrainerForm */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <MapPin
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.yacht.location', {
                  fallback: 'Location',
                })}
              </h3>

              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                  <MapPin
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-amber-600' : 'text-teal-600'
                    }`}
                  />
                  Select Departure Location *
                </label>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {LOCATION_OPTIONS.map((location) => (
                    <div
                      key={location.id}
                      className={`
                        border rounded-lg p-4 cursor-pointer transition-all
                        ${
                          formData.location === location.id
                            ? `${
                                isPremium
                                  ? 'bg-amber-50 border-amber-300'
                                  : 'bg-teal-50 border-teal-300'
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
                                    ? 'border-amber-500 bg-amber-500'
                                    : 'border-teal-500 bg-teal-500'
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
              </div>
            </div>

            {/* Guests Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Users
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.yacht.guests', { fallback: 'Guests Information' })}
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Guest Count */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Users
                      className={`w-4 h-4 mr-2 ${
                        isPremium ? 'text-amber-600' : 'text-teal-600'
                      }`}
                    />
                    Total Guests (Max: {yacht?.specifications?.maxGuests || 12})
                  </label>
                  <div className='flex border border-gray-300 rounded-lg overflow-hidden max-w-xs bg-white'>
                    <button
                      type='button'
                      onClick={() => updateGuestCount(false)}
                      className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                    >
                      -
                    </button>
                    <div className='flex-1 py-2 text-center font-medium'>
                      {formData.guests}
                    </div>
                    <button
                      type='button'
                      onClick={() => updateGuestCount(true)}
                      className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Minors Count */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Baby
                      className={`w-4 h-4 mr-2 ${
                        isPremium ? 'text-amber-600' : 'text-teal-600'
                      }`}
                    />
                    Guests under 18
                  </label>
                  <input
                    type='number'
                    name='minorsCount'
                    min='0'
                    max={formData.guests}
                    value={formData.minorsCount}
                    onChange={handleChange}
                    className={`w-full max-w-xs p-3 border ${
                      errors.minorsCount ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 ${
                      isPremium
                        ? 'focus:ring-amber-500 focus:border-amber-500'
                        : 'focus:ring-teal-500 focus:border-teal-500'
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
                        {formData.minorsCount} guest(s) under 18 detected. Adult
                        supervision is required at all times.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Phone
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.yacht.contact', {
                  fallback: 'Contact Information',
                })}
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Full Name */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    Full Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 ${
                      isPremium
                        ? 'focus:ring-amber-500 focus:border-amber-500'
                        : 'focus:ring-teal-500 focus:border-teal-500'
                    } bg-gray-50`}
                    placeholder='Enter your full name'
                  />
                  {errors.name && (
                    <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Mail
                      className={`w-4 h-4 mr-2 ${
                        isPremium ? 'text-amber-600' : 'text-teal-600'
                      }`}
                    />
                    Email <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 ${
                      isPremium
                        ? 'focus:ring-amber-500 focus:border-amber-500'
                        : 'focus:ring-teal-500 focus:border-teal-500'
                    } bg-gray-50`}
                    placeholder='your@email.com'
                  />
                  {errors.email && (
                    <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Phone
                      className={`w-4 h-4 mr-2 ${
                        isPremium ? 'text-amber-600' : 'text-teal-600'
                      }`}
                    />
                    Phone <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 ${
                      isPremium
                        ? 'focus:ring-amber-500 focus:border-amber-500'
                        : 'focus:ring-teal-500 focus:border-teal-500'
                    } bg-gray-50`}
                    placeholder='+1 (555) 000-0000'
                  />
                  {errors.phone && (
                    <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Preferences Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Waves
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.yacht.activities', {
                  fallback: 'Preferred Activities',
                })}
              </h3>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3'>
                  Select your preferred activities (optional)
                </label>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                  {ACTIVITY_OPTIONS.map((activity) => (
                    <div
                      key={activity.id}
                      className={`
                        border rounded-lg p-3 cursor-pointer transition-all
                        ${
                          formData.activityPreferences.includes(activity.id)
                            ? `${
                                isPremium
                                  ? 'bg-amber-50 border-amber-300'
                                  : 'bg-teal-50 border-teal-300'
                              } shadow-sm`
                            : 'border-gray-200 hover:bg-gray-50'
                        }
                      `}
                      onClick={() => toggleActivityPreference(activity.id)}
                    >
                      <div className='flex items-center'>
                        <div
                          className={`
                          w-4 h-4 rounded border flex items-center justify-center mr-3
                          ${
                            formData.activityPreferences.includes(activity.id)
                              ? `${
                                  isPremium
                                    ? 'border-amber-500 bg-amber-500'
                                    : 'border-teal-500 bg-teal-500'
                                }`
                              : 'border-gray-300'
                          }
                        `}
                        >
                          {formData.activityPreferences.includes(
                            activity.id
                          ) && <CheckCircle className='w-3 h-3 text-white' />}
                        </div>
                        <span className='text-sm font-medium text-gray-800'>
                          {activity.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Needs Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <AlertCircle
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.yacht.specialNeeds', {
                  fallback: 'Special Requirements',
                })}
              </h3>

              {/* Special Needs Toggle */}
              <div
                className={`
                  flex items-center justify-between p-4 border rounded-lg cursor-pointer
                  ${
                    formData.hasSpecialNeeds
                      ? `${
                          isPremium
                            ? 'border-amber-300 bg-amber-50'
                            : 'border-teal-300 bg-teal-50'
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
                              ? 'border-amber-500 bg-amber-500'
                              : 'border-teal-500 bg-teal-500'
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
                    Disability or mobility requirements
                  </span>
                </div>
                <AlertCircle
                  className={`w-5 h-5 ${
                    isPremium ? 'text-amber-500' : 'text-teal-500'
                  }`}
                />
              </div>

              {/* Special Needs Details */}
              {formData.hasSpecialNeeds && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-4 border rounded-lg ${
                    isPremium ? 'border-amber-200' : 'border-teal-200'
                  }`}
                >
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Please specify requirements *
                  </label>
                  <textarea
                    name='specialNeedsDetails'
                    value={formData.specialNeedsDetails}
                    onChange={handleChange}
                    placeholder='Describe any conditions that would require special accommodation...'
                    className={`w-full p-3 border ${
                      errors.specialNeedsDetails
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-lg ${
                      isPremium
                        ? 'focus:ring-amber-500 focus:border-amber-500'
                        : 'focus:ring-teal-500 focus:border-teal-500'
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
                            isPremium ? 'text-amber-600' : 'text-teal-600'
                          } focus:ring-2 border-gray-300 rounded`}
                        />
                      </div>
                      <label
                        htmlFor='confirmSpecialNeeds'
                        className='ml-3 text-sm text-gray-700'
                      >
                        I confirm that someone in my group requires the special
                        accommodations described above
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
                      There is an additional fee for special accommodations. Our
                      team will contact you to discuss specific arrangements.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Additional Notes Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <MessageSquare
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.yacht.additionalInfo', {
                  fallback: 'Additional Information',
                })}
              </h3>

              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <MessageSquare
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-amber-600' : 'text-teal-600'
                    }`}
                  />
                  Special Requests & Notes
                </label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  placeholder='Celebrations, dietary requirements, specific destinations, or any other special requests...'
                  className={`w-full p-3 border border-gray-300 rounded-lg ${
                    isPremium
                      ? 'focus:ring-amber-500 focus:border-amber-500'
                      : 'focus:ring-teal-500 focus:border-teal-500'
                  } bg-gray-50 resize-none h-24`}
                />
              </div>
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-800 text-sm'>{errors.submit}</p>
              </div>
            )}
          </form>
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
              {formData.guests > 1 && (
                <span className='ml-2 text-sm bg-blue-800 px-2 py-1 rounded'>
                  {formData.guests} guests
                </span>
              )}
            </div>

            {/* Price breakdown */}
            <div className='text-xs text-gray-400 mt-2 space-y-1'>
              <div>
                Caribbean Yacht Experience ({yacht?.name || defaultYacht.name})
              </div>
              <div>
                {formData.startTime &&
                  `Departure: ${formData.startTime} - Return: 5:30 PM`}
              </div>
              {formData.guests > 4 && (
                <div className='text-yellow-400'>
                  Large group fee applied (+10%)
                </div>
              )}
              {formData.hasSpecialNeeds && (
                <div>Special accommodation fee: +$50</div>
              )}
              {formData.minorsCount > 0 && (
                <div className='text-blue-400'>
                  {formData.minorsCount} guest(s) under 18
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
              {t('common.cancel', { fallback: 'Cancel' })}
            </button>

            <button
              type='submit'
              disabled={isSubmitting}
              className={`px-8 py-3 ${
                isPremium
                  ? 'bg-amber-600 hover:bg-amber-500'
                  : 'bg-teal-600 hover:bg-teal-500'
              } text-white rounded-lg transition flex items-center disabled:opacity-50`}
            >
              <CreditCard className='h-4 w-4 mr-2' />
              {isSubmitting
                ? t('services.yacht.booking', { fallback: 'Booking...' })
                : t('services.yacht.book', {
                    fallback: 'Book Yacht Experience',
                  })}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LuxeYachtForm;
