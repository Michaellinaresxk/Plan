import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Calendar,
  Clock,
  Users,
  Baby,
  CheckCircle,
  Heart,
  MessageSquare,
  CreditCard,
  AlertCircle,
  Info,
  Shield,
  DollarSign,
  MapPin,
} from 'lucide-react';
import ServiceManager from '@/constants/services/ServiceManager';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import { LOCATION_OPTIONS } from '@/constants/location/location';
import FormHeader from './FormHeader';
import { useFormModal } from '@/hooks/useFormModal';

interface BabysitterFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const BabysitterForm: React.FC<BabysitterFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { setReservationData } = useReservation();
  const router = useRouter();
  const { handleClose } = useFormModal({ onCancel });
  // ✅ Updated state with location as ID instead of free text
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: '', // Now stores the location ID
    childrenCount: 1,
    childrenAges: [''],
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get service data
  const serviceData = ServiceManager.getData(service.id);
  const minimumBooking = serviceData?.metaData?.minimumBooking
    ? parseInt(serviceData.metaData.minimumBooking.toString())
    : 3;

  // ✅ Updated validation to check location ID
  const checkFormValidity = useMemo(() => {
    const isDateValid = !!formData.date;
    const isStartTimeValid = !!formData.startTime;
    const isEndTimeValid = !!formData.endTime;
    const isLocationValid = !!formData.location; // Now checking for location ID

    const filledAges = formData.childrenAges.filter((age) => age.trim() !== '');
    const areAgesValid = filledAges.length >= formData.childrenCount;

    const areSpecialNeedsValid =
      !formData.hasSpecialNeeds || !!formData.specialNeedsDetails.trim();

    return {
      isValid:
        isDateValid &&
        isStartTimeValid &&
        isEndTimeValid &&
        isLocationValid &&
        areAgesValid &&
        areSpecialNeedsValid,
      checks: {
        date: isDateValid,
        startTime: isStartTimeValid,
        endTime: isEndTimeValid,
        location: isLocationValid,
        ages: areAgesValid,
        specialNeeds: areSpecialNeedsValid,
      },
    };
  }, [formData]);

  // Calculate price
  const currentPrice = useMemo(() => {
    let price = service.price;

    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);

      let duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (duration < 0) {
        duration += 24;
      }

      duration = Math.max(duration, minimumBooking);
      price = price * duration;
    }

    const additionalChildFee = 10;
    if (formData.childrenCount > 1) {
      price += (formData.childrenCount - 1) * additionalChildFee;
    }

    if (formData.hasSpecialNeeds) {
      price += 15;
    }

    return price;
  }, [
    formData.startTime,
    formData.endTime,
    formData.childrenCount,
    formData.hasSpecialNeeds,
    service.price,
    minimumBooking,
  ]);

  // ✅ Helper para actualizar campos - optimizado
  const updateFormField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // ✅ Handle location selection - similar to YogaServiceForm
  const handleLocationSelect = useCallback(
    (locationId: string) => {
      updateFormField('location', locationId);
    },
    [updateFormField]
  );

  // ✅ Updated validation for location ID
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (!formData.location) {
      newErrors.location = 'Please select a location';
    }

    const filledAges = formData.childrenAges.filter((age) => age.trim() !== '');
    if (filledAges.length < formData.childrenCount) {
      newErrors.childrenAges = 'Please fill all children ages';
    }

    if (formData.hasSpecialNeeds && !formData.specialNeedsDetails.trim()) {
      newErrors.specialNeedsDetails = 'Special needs details are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ✅ Updated submit handler to include location name
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      console.log('🚀 Form submitted!');
      console.log('📋 Current form data:', formData);
      console.log('💰 Current price:', currentPrice);

      const isValid = validateForm();
      console.log('✅ Form is valid:', isValid);

      if (!isValid) {
        console.log('❌ Validation failed, not proceeding');
        return;
      }

      setIsSubmitting(true);

      try {
        // ✅ Get selected location name
        const selectedLocation = LOCATION_OPTIONS.find(
          (loc) => loc.id === formData.location
        );

        const reservationData = {
          service,
          totalPrice: currentPrice,
          formData: {
            serviceId: service.id,
            serviceName: service.name,
            serviceType: 'babysitter',
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: formData.location, // Location ID
            locationName: selectedLocation?.name || formData.location, // Location name for display
            childrenCount: formData.childrenCount,
            childrenAges: formData.childrenAges,
            hasSpecialNeeds: formData.hasSpecialNeeds,
            specialNeedsDetails: formData.specialNeedsDetails,
            specialRequests: formData.specialRequests,
            calculatedPrice: currentPrice,
          },
          bookingDate: new Date(),
          clientInfo: undefined,
          // ✅ Add babysitter specific data similar to yogaSpecifics
          babysitterSpecifics: {
            location: formData.location,
            locationName: selectedLocation?.name || formData.location,
            childrenCount: formData.childrenCount,
            childrenAges: formData.childrenAges,
            hasSpecialNeeds: formData.hasSpecialNeeds,
            specialNeedsDetails: formData.specialNeedsDetails,
            specialRequests: formData.specialRequests,
            duration:
              formData.startTime && formData.endTime
                ? Math.max(
                    (new Date(`2000-01-01T${formData.endTime}`).getTime() -
                      new Date(`2000-01-01T${formData.startTime}`).getTime()) /
                      (1000 * 60 * 60),
                    minimumBooking
                  )
                : minimumBooking,
          },
        };

        console.log('🍼 BabysitterForm - Reservation data:', reservationData);
        console.log('📍 Selected location:', selectedLocation);
        console.log('💰 Total Price at root level:', currentPrice);

        setReservationData(reservationData);

        console.log('📡 Navigating to reservation confirmation...');
        router.push('/reservation-confirmation');
      } catch (error) {
        console.error('❌ Babysitter booking error:', error);
        alert('Error processing booking. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validateForm,
      service,
      formData,
      currentPrice,
      setReservationData,
      router,
      minimumBooking,
    ]
  );

  // Handle input changes
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      if (name === 'hasSpecialNeeds' && !checked) {
        updateFormField('hasSpecialNeeds', checked);
        updateFormField('specialNeedsDetails', '');
      } else {
        updateFormField(name, type === 'checkbox' ? checked : value);
      }
    },
    [updateFormField]
  );

  // Handle children count changes
  const updateChildrenCount = useCallback(
    (increment: boolean) => {
      const newCount = increment
        ? formData.childrenCount + 1
        : Math.max(1, formData.childrenCount - 1);

      let newAges = [...formData.childrenAges];
      if (increment) {
        newAges.push('');
      } else if (formData.childrenCount > 1) {
        newAges = newAges.slice(0, -1);
      }

      setFormData((prev) => ({
        ...prev,
        childrenCount: newCount,
        childrenAges: newAges,
      }));

      setErrors((prev) => {
        if (prev.childrenAges) {
          const newErrors = { ...prev };
          delete newErrors.childrenAges;
          return newErrors;
        }
        return prev;
      });
    },
    [formData.childrenCount, formData.childrenAges]
  );

  // Handle child age changes
  const handleAgeChange = useCallback(
    (index: number, value: string) => {
      const newAges = [...formData.childrenAges];
      newAges[index] = value;
      updateFormField('childrenAges', newAges);
    },
    [formData.childrenAges, updateFormField]
  );

  // Toggle special needs
  const toggleSpecialNeeds = useCallback(() => {
    const newValue = !formData.hasSpecialNeeds;
    updateFormField('hasSpecialNeeds', newValue);
    if (!newValue) {
      updateFormField('specialNeedsDetails', '');
    }
  }, [formData.hasSpecialNeeds, updateFormField]);

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-2xl shadow-lg border-t-8 border-purple-500'>
        {/* Form Header */}

        <FormHeader
          title=' Happy Kids Babysitting'
          subtitle='Professional childcare in the comfort of your accommodation'
          icon={Baby}
          onCancel={handleClose}
          showCloseButton={true}
          gradientFrom='purple-500'
          gradientVia='purple-500'
          gradientTo='purple-500'
        />

        {/* Form Body */}
        <div className='p-8 space-y-8 relative'>
          {/* Scheduling Section */}
          <div className='space-y-6'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <Calendar className='w-6 h-6 mr-2 text-purple-600' />
              Scheduling
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            {/* Date Field */}
            <div className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-purple-800 mb-3'>
                <Calendar className='w-5 h-5 mr-2 text-purple-600' />
                Date *
              </label>
              <input
                type='date'
                name='date'
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-4 border-2 rounded-xl shadow-sm transition-all duration-200 text-lg focus:ring-2 focus:outline-none
                  ${
                    errors.date
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50'
                      : 'border-purple-200 focus:border-purple-400 focus:ring-purple-200 bg-white'
                  }
                  [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  [&::-webkit-calendar-picker-indicator]:opacity-100
                `}
                style={{
                  colorScheme: 'light',
                }}
              />
              {errors.date && (
                <p className='text-red-500 text-xs mt-2 flex items-center'>
                  <AlertCircle className='w-3 h-3 mr-1' />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time Range Fields */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Start Time */}
              <div className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'>
                <label className='flex items-center text-sm font-medium text-purple-800 mb-3'>
                  <Clock className='w-5 h-5 mr-2 text-purple-600' />
                  Start Time *
                </label>
                <input
                  type='time'
                  name='startTime'
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full p-4 border-2 rounded-xl shadow-sm transition-all duration-200 text-lg focus:ring-2 focus:outline-none
                    ${
                      errors.startTime
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50'
                        : 'border-purple-200 focus:border-purple-400 focus:ring-purple-200 bg-white'
                    }
                  `}
                />
                {errors.startTime && (
                  <p className='text-red-500 text-xs mt-2 flex items-center'>
                    <AlertCircle className='w-3 h-3 mr-1' />
                    {errors.startTime}
                  </p>
                )}
              </div>

              {/* End Time */}
              <div className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'>
                <label className='flex items-center text-sm font-medium text-purple-800 mb-3'>
                  <Clock className='w-5 h-5 mr-2 text-purple-600' />
                  End Time *
                </label>
                <input
                  type='time'
                  name='endTime'
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full p-4 border-2 rounded-xl shadow-sm transition-all duration-200 text-lg focus:ring-2 focus:outline-none
                    ${
                      errors.endTime
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50'
                        : 'border-purple-200 focus:border-purple-400 focus:ring-purple-200 bg-white'
                    }
                  `}
                />
                {errors.endTime && (
                  <p className='text-red-500 text-xs mt-2 flex items-center'>
                    <AlertCircle className='w-3 h-3 mr-1' />
                    {errors.endTime}
                  </p>
                )}
              </div>
            </div>

            {/* Minimum Booking Notice */}
            <div className='flex items-center p-4 bg-indigo-50 rounded-xl border border-indigo-100 shadow-inner'>
              <Info className='h-6 w-6 text-indigo-500 mr-3 flex-shrink-0' />
              <p className='text-sm text-indigo-700'>
                Minimum booking duration is {minimumBooking} hours. Shorter
                bookings will be charged at the {minimumBooking}-hour rate.
              </p>
            </div>
          </div>

          {/* ✅ Location Selection - Updated to use selection cards */}
          <div className='space-y-6'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <MapPin className='w-6 h-6 mr-2 text-purple-600' />
              Location
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            <div className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-purple-800 mb-4'>
                <MapPin className='w-5 h-5 mr-2 text-purple-600' />
                Select your location *
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {LOCATION_OPTIONS.map((location) => (
                  <div
                    key={location.id}
                    className={`
                      border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
                      ${
                        formData.location === location.id
                          ? 'border-purple-500 bg-white shadow-lg ring-2 ring-purple-200'
                          : 'border-purple-200 bg-white hover:border-purple-300 hover:bg-purple-25'
                      }
                    `}
                    onClick={() => handleLocationSelect(location.id)}
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all
                          ${
                            formData.location === location.id
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-purple-300'
                          }
                        `}
                      >
                        {formData.location === location.id && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <MapPin className='w-4 h-4 mr-2 text-purple-500' />
                        <span className='font-medium text-purple-900 text-sm'>
                          {location.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.location && (
                <p className='text-red-500 text-xs mt-3 flex items-center'>
                  <AlertCircle className='w-3 h-3 mr-1' />
                  {errors.location}
                </p>
              )}

              {/* Display selected location */}
              {formData.location && (
                <div className='mt-4 p-3 bg-purple-100 rounded-lg border border-purple-200'>
                  <p className='text-sm text-purple-800 flex items-center'>
                    <CheckCircle className='w-4 h-4 mr-2 text-purple-600' />
                    Selected:{' '}
                    <span className='font-medium ml-1'>
                      {
                        LOCATION_OPTIONS.find(
                          (loc) => loc.id === formData.location
                        )?.name
                      }
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Children Information */}
          <div className='space-y-6 mt-10'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <Baby className='w-6 h-6 mr-2 text-purple-600' />
              Tell Us About Your Children
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            {/* Children Count */}
            <div className='bg-pink-50 p-6 rounded-xl border border-pink-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-pink-800 mb-3'>
                <Users className='w-5 h-5 mr-2 text-pink-600' />
                How many children need care?
              </label>

              <div className='flex w-48 mx-auto bg-white rounded-xl overflow-hidden shadow-sm border-2 border-pink-200'>
                <button
                  type='button'
                  onClick={() => updateChildrenCount(false)}
                  disabled={formData.childrenCount <= 1}
                  className='w-16 py-3 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  -
                </button>
                <div className='flex-grow py-3 font-bold text-lg text-pink-900 text-center'>
                  {formData.childrenCount}
                </div>
                <button
                  type='button'
                  onClick={() => updateChildrenCount(true)}
                  className='w-16 py-3 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xl transition-colors'
                >
                  +
                </button>
              </div>

              {formData.childrenCount > 1 && (
                <p className='text-sm text-pink-700 mt-3 text-center flex items-center justify-center'>
                  <DollarSign className='w-4 h-4 mr-1' />
                  +$10 per additional child
                </p>
              )}
            </div>

            {/* Children Ages */}
            <div className='bg-pink-50 p-6 rounded-xl border border-pink-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-pink-800 mb-3'>
                <Baby className='w-5 h-5 mr-2 text-pink-600' />
                How old are they? *
              </label>

              <div className='space-y-3'>
                {formData.childrenAges.map((age, index) => (
                  <div
                    key={index}
                    className='flex items-center bg-white p-3 rounded-lg border-2 border-pink-200 shadow-sm'
                  >
                    <div className='flex items-center justify-center w-8 h-8 bg-pink-200 text-pink-800 rounded-full mr-3 font-bold'>
                      {index + 1}
                    </div>
                    <input
                      type='text'
                      value={age}
                      onChange={(e) => handleAgeChange(index, e.target.value)}
                      placeholder='e.g., 3 years'
                      className={`flex-1 p-3 border rounded-lg transition-all focus:ring-2 focus:outline-none
                        ${
                          errors.childrenAges
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50'
                            : 'border-pink-200 focus:border-pink-400 focus:ring-pink-200 bg-white'
                        }
                      `}
                    />
                  </div>
                ))}

                {errors.childrenAges && (
                  <p className='text-red-500 text-xs mt-2 flex items-center'>
                    <AlertCircle className='w-3 h-3 mr-1' />
                    {errors.childrenAges}
                  </p>
                )}
              </div>
            </div>

            {/* Special Needs Toggle */}
            <div className='mt-6'>
              <div
                className='flex items-center justify-between p-5 border-2 border-purple-200 rounded-xl bg-white hover:border-purple-300 transition cursor-pointer shadow-sm'
                onClick={toggleSpecialNeeds}
              >
                <div className='flex items-center'>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.hasSpecialNeeds
                        ? 'border-purple-600 bg-purple-600'
                        : 'border-purple-300'
                    }`}
                  >
                    {formData.hasSpecialNeeds && (
                      <CheckCircle className='w-4 h-4 text-white' />
                    )}
                  </div>
                  <span className='ml-3 font-medium text-purple-900'>
                    Child with special needs or disabilities
                  </span>
                </div>
                <Heart className='w-6 h-6 text-pink-500' />
              </div>

              {/* Special Needs Details */}
              {formData.hasSpecialNeeds && (
                <div className='mt-4 pl-6 border-l-4 border-purple-300 bg-purple-50 p-6 rounded-xl'>
                  <label className='block text-sm font-medium text-purple-800 mb-3'>
                    Please tell us about any special needs *
                  </label>
                  <textarea
                    name='specialNeedsDetails'
                    value={formData.specialNeedsDetails}
                    onChange={handleChange}
                    placeholder='Please describe any special requirements, medical conditions, allergies, etc.'
                    className={`w-full p-4 border-2 rounded-xl shadow-sm h-32 transition-all focus:ring-2 focus:outline-none
                      ${
                        errors.specialNeedsDetails
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50'
                          : 'border-purple-200 focus:border-purple-400 focus:ring-purple-200 bg-white'
                      }
                    `}
                  ></textarea>
                  {errors.specialNeedsDetails && (
                    <p className='text-red-500 text-xs mt-2 flex items-center'>
                      <AlertCircle className='w-3 h-3 mr-1' />
                      {errors.specialNeedsDetails}
                    </p>
                  )}
                  <p className='text-sm text-purple-700 mt-3 flex items-center'>
                    <DollarSign className='w-4 h-4 mr-1' />
                    <span>+$15 additional fee for specialized care</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <div className='space-y-6 mt-10'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <MessageSquare className='w-6 h-6 mr-2 text-purple-600' />
              Additional Information
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            <div className='bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-indigo-800 mb-3'>
                <MessageSquare className='w-5 h-5 mr-2 text-indigo-600' />
                Anything else we should know?
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder='Favorite activities, routines, nap times, dietary preferences, or anything else that would help our babysitter provide the best care'
                className='w-full p-4 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm h-32 focus:outline-none'
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer with Price and Actions */}
        <div
          className='rounded-2xl p-8 rounded-b-2xl text-white'
          style={{
            background:
              'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #7c3aed 100%)',
          }}
        >
          <div className='flex flex-col md:flex-row items-center justify-between'>
            {/* Price Display */}
            <div className='mb-4 md:mb-0'>
              <div className='text-center md:text-left'>
                <p className='text-purple-200 text-sm'>Total Price</p>
                <p className='text-3xl font-bold'>${currentPrice.toFixed(2)}</p>

                {/* Price breakdown */}
                <div className='text-xs text-purple-200 mt-2 space-y-1'>
                  {formData.location && (
                    <div>
                      Babysitting at{' '}
                      {
                        LOCATION_OPTIONS.find(
                          (loc) => loc.id === formData.location
                        )?.name
                      }
                    </div>
                  )}
                  {formData.childrenCount > 1 && (
                    <div className='text-pink-200'>
                      {formData.childrenCount} children (+$10 per additional
                      child)
                    </div>
                  )}
                  {formData.hasSpecialNeeds && (
                    <div>Special care needs: +$15</div>
                  )}
                </div>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <button
                type='button'
                onClick={onCancel}
                disabled={isSubmitting}
                className='px-6 py-3 border-2 border-white/30 rounded-xl text-white hover:bg-white/10 transition-colors disabled:opacity-50'
              >
                Cancel
              </button>

              <button
                type='submit'
                disabled={isSubmitting || !checkFormValidity.isValid}
                className={`px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center font-medium ${
                  isSubmitting || !checkFormValidity.isValid
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className='h-5 w-5 mr-2' />
                    Book Your Sitter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BabysitterForm;
