// components/forms/BabysitterForm.tsx
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
  DollarSign,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import { LOCATION_OPTIONS } from '@/constants/location/location';
import FormHeader from './FormHeader';
import { useFormModal } from '@/hooks/useFormModal';
import { useScrollToError } from '@/hooks/useScrollToError';
import { calculatePriceWithTax } from '@/utils/priceCalculator';

interface BabysitterFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const BabysitterForm: React.FC<BabysitterFormProps> = ({
  service,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { setReservationData } = useReservation();
  const router = useRouter();
  const { handleClose } = useFormModal({ onCancel });

  const [formData, setFormData] = useState({
    date: '',
    startTime: '08:00',
    hours: 1,
    childrenCount: 1,
    childrenAges: [''],
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fieldRefs, scrollToFirstError } = useScrollToError(errors);

  const PRICE_PER_CHILD_PER_HOUR = 20;
  const SPECIAL_NEEDS_FEE = 15;
  const TAX_RATE = 5;
  const MIN_HOURS = 2;
  const MAX_HOURS = 12;

  const checkFormValidity = useMemo(() => {
    const isDateValid = !!formData.date;
    const isStartTimeValid = !!formData.startTime;
    const isHoursValid =
      formData.hours >= MIN_HOURS && formData.hours <= MAX_HOURS;

    const filledAges = formData.childrenAges.filter((age) => age.trim() !== '');
    const areAgesValid = filledAges.length >= formData.childrenCount;

    const areSpecialNeedsValid =
      !formData.hasSpecialNeeds || !!formData.specialNeedsDetails.trim();

    return {
      isValid:
        isDateValid &&
        isStartTimeValid &&
        isHoursValid &&
        areAgesValid &&
        areSpecialNeedsValid,
      checks: {
        date: isDateValid,
        startTime: isStartTimeValid,
        hours: isHoursValid,
        ages: areAgesValid,
        specialNeeds: areSpecialNeedsValid,
      },
    };
  }, [formData]);

  const priceBreakdown = useMemo(() => {
    const basePrice =
      formData.childrenCount * formData.hours * PRICE_PER_CHILD_PER_HOUR;

    let subtotal = basePrice;
    if (formData.hasSpecialNeeds) {
      subtotal += SPECIAL_NEEDS_FEE;
    }

    const priceWithTax = calculatePriceWithTax(subtotal, TAX_RATE);

    return {
      basePrice,
      specialNeedsFee: formData.hasSpecialNeeds ? SPECIAL_NEEDS_FEE : 0,
      subtotal: priceWithTax.subtotal,
      tax: priceWithTax.tax,
      total: priceWithTax.total,
    };
  }, [formData.childrenCount, formData.hours, formData.hasSpecialNeeds]);

  const updateFormField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = t('services.standard.babysitterForm.fields.date.error');
    }

    if (!formData.startTime) {
      newErrors.startTime = t(
        'services.standard.babysitterForm.fields.startTime.error'
      );
    }

    if (formData.hours < MIN_HOURS || formData.hours > MAX_HOURS) {
      newErrors.hours = t(
        'services.standard.babysitterForm.fields.hours.error',
        { min: MIN_HOURS, max: MAX_HOURS }
      );
    }

    const filledAges = formData.childrenAges.filter((age) => age.trim() !== '');
    if (filledAges.length < formData.childrenCount) {
      newErrors.childrenAges = t(
        'services.standard.babysitterForm.fields.childrenAges.error'
      );
    }

    // if (formData.hasSpecialNeeds && !formData.specialNeedsDetails.trim()) {
    //   newErrors.specialNeedsDetails = t(
    //     'services.standard.babysitterForm.fields.specialNeeds.error'
    //   );
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      console.log('🚀 Form submitted!');
      console.log('📋 Current form data:', formData);
      console.log('💰 Current price:', priceBreakdown);

      const isValid = validateForm();
      console.log('✅ Form is valid:', isValid);

      if (!isValid) {
        console.log('❌ Validation failed, not proceeding');
        scrollToFirstError();
        return;
      }

      setIsSubmitting(true);

      try {
        const selectedLocation = LOCATION_OPTIONS.find(
          (loc) => loc.id === formData.location
        );

        const reservationData = {
          service,
          totalPrice: priceBreakdown.total,
          formData: {
            serviceId: service.id,
            serviceName: service.name,
            serviceType: 'babysitter',
            date: formData.date,
            startTime: formData.startTime,
            hours: formData.hours,
            childrenCount: formData.childrenCount,
            childrenAges: formData.childrenAges,
            hasSpecialNeeds: formData.hasSpecialNeeds,
            specialNeedsDetails: formData.specialNeedsDetails,
            specialRequests: formData.specialRequests,
            calculatedPrice: priceBreakdown.total,
            priceBreakdown: priceBreakdown,
          },
          bookingDate: new Date(),
          clientInfo: undefined,
          babysitterSpecifics: {
            childrenCount: formData.childrenCount,
            childrenAges: formData.childrenAges,
            hasSpecialNeeds: formData.hasSpecialNeeds,
            specialNeedsDetails: formData.specialNeedsDetails,
            specialRequests: formData.specialRequests,
            duration: formData.hours,
          },
        };

        console.log('🍼 BabysitterForm - Reservation data:', reservationData);
        console.log('📍 Selected location:', selectedLocation);
        console.log('💰 Total Price at root level:', priceBreakdown.total);

        setReservationData(reservationData);

        console.log('📡 Navigating to reservation confirmation...');
        router.push('/reservation-confirmation');
      } catch (error) {
        console.error('❌ Babysitter booking error:', error);
        alert(t('services.standard.babysitterForm.errors.bookingError'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validateForm,
      service,
      formData,
      priceBreakdown,
      setReservationData,
      router,
      t,
      scrollToFirstError,
    ]
  );

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

  const handleAgeChange = useCallback(
    (index: number, value: string) => {
      const newAges = [...formData.childrenAges];
      newAges[index] = value;
      updateFormField('childrenAges', newAges);
    },
    [formData.childrenAges, updateFormField]
  );

  const toggleSpecialNeeds = useCallback(() => {
    const newValue = !formData.hasSpecialNeeds;
    updateFormField('hasSpecialNeeds', newValue);
    if (!newValue) {
      updateFormField('specialNeedsDetails', '');
    }
  }, [formData.hasSpecialNeeds, updateFormField]);

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-full mx-auto overflow-hidden'
    >
      <div className='bg-white rounded-lg md:rounded-2xl shadow-lg border-t-4 md:border-t-8 border-purple-500 overflow-hidden'>
        {/* Form Header */}
        <FormHeader
          title={t('services.standard.babysitterForm.header.title')}
          subtitle={t('services.standard.babysitterForm.header.subtitle')}
          icon={Baby}
          onCancel={handleClose}
          showCloseButton={true}
          gradientFrom='purple-500'
          gradientVia='purple-500'
          gradientTo='purple-500'
        />

        {/* Form Body */}
        <div className='p-3 sm:p-4 md:p-6 lg:p-8 space-y-5 md:space-y-6 lg:space-y-8 overflow-x-hidden'>
          {/* Scheduling Section */}
          <div className='space-y-3 md:space-y-4'>
            <h3 className='text-base md:text-lg lg:text-xl font-bold text-purple-900 flex items-center gap-2 min-w-0'>
              <Calendar className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-600 flex-shrink-0' />
              <span className='text-sm sm:text-base md:text-lg lg:text-xl truncate'>
                {t('services.standard.babysitterForm.sections.scheduling')}
              </span>
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full min-w-0'></div>
            </h3>

            {/* Date Field */}
            <div
              className='bg-gradient-to-br from-purple-50/50 to-indigo-50/50 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl border border-purple-100/50 backdrop-blur-sm'
              ref={(el) => el && fieldRefs.current.set('date', el)}
            >
              <label className='flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2 gap-2'>
                <Calendar className='w-4 h-4 md:w-5 md:h-5 text-purple-500 flex-shrink-0' />
                <span className='truncate'>
                  {t('services.standard.babysitterForm.fields.date.label')}
                </span>
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                name='date'
                value={formData.date}
                onChange={handleChange}
                onClick={(e) => e.currentTarget.showPicker()}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-2.5 md:p-3 lg:p-4 border rounded-lg md:rounded-xl shadow-sm transition-all duration-200 text-sm md:text-base lg:text-lg focus:ring-2 focus:outline-none bg-white/80 backdrop-blur-sm
                  ${
                    errors.date
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:border-purple-400 focus:ring-purple-200'
                  }
                  [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  [&::-webkit-calendar-picker-indicator]:opacity-100
                `}
                style={{
                  colorScheme: 'light',
                }}
              />
              {errors.date && (
                <div className='flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg mt-2'>
                  <AlertCircle className='w-3 h-3 md:w-4 md:h-4 text-red-500 flex-shrink-0' />
                  <p className='text-red-600 text-xs md:text-sm font-medium truncate'>
                    {errors.date}
                  </p>
                </div>
              )}
            </div>

            {/* Start Time and Hours */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-6'>
              {/* Start Time - Custom Time Picker */}
              <div
                className='bg-gradient-to-br from-purple-50/50 to-indigo-50/50 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl border border-purple-100/50 backdrop-blur-sm'
                ref={(el) => el && fieldRefs.current.set('startTime', el)}
              >
                <label className='flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-3 gap-2'>
                  <Clock className='w-4 h-4 md:w-5 md:h-5 text-purple-500 flex-shrink-0' />
                  <span className='truncate'>
                    {t(
                      'services.standard.babysitterForm.fields.startTime.label'
                    )}
                  </span>
                  <span className='text-red-500'>*</span>
                </label>

                {/* Custom Time Selector */}
                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-200'>
                  <div className='flex items-center justify-center gap-2 md:gap-3'>
                    {/* Hour Selector */}
                    <div className='flex flex-col items-center'>
                      <button
                        type='button'
                        onClick={() => {
                          const [hour, minute] = (
                            formData.startTime || '09:00'
                          ).split(':');
                          const newHour = (parseInt(hour) + 1) % 24;
                          updateFormField(
                            'startTime',
                            `${newHour.toString().padStart(2, '0')}:${minute}`
                          );
                        }}
                        className='w-8 h-8 md:w-9 md:h-9 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-600 flex items-center justify-center transition-colors'
                      >
                        <span className='text-lg leading-none'>▴</span>
                      </button>

                      <div className='my-2 md:my-3 px-3 py-2 md:px-4 md:py-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl min-w-[50px] md:min-w-[60px]'>
                        <span className='text-xl md:text-2xl font-bold text-white block text-center'>
                          {formData.startTime
                            ? formData.startTime.split(':')[0]
                            : '09'}
                        </span>
                      </div>

                      <button
                        type='button'
                        onClick={() => {
                          const [hour, minute] = (
                            formData.startTime || '09:00'
                          ).split(':');
                          const newHour = (parseInt(hour) - 1 + 24) % 24;
                          updateFormField(
                            'startTime',
                            `${newHour.toString().padStart(2, '0')}:${minute}`
                          );
                        }}
                        className='w-8 h-8 md:w-9 md:h-9 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-600 flex items-center justify-center transition-colors'
                      >
                        <span className='text-lg leading-none'>▾</span>
                      </button>
                      <span className='text-xs text-gray-500 mt-1 font-medium'>
                        Hora
                      </span>
                    </div>

                    {/* Separator */}
                    <span className='text-2xl md:text-3xl font-bold text-purple-500 pb-6'>
                      :
                    </span>

                    {/* Minute Selector */}
                    <div className='flex flex-col items-center'>
                      <button
                        type='button'
                        onClick={() => {
                          const [hour, minute] = (
                            formData.startTime || '09:00'
                          ).split(':');
                          const newMinute = (parseInt(minute) + 15) % 60;
                          updateFormField(
                            'startTime',
                            `${hour}:${newMinute.toString().padStart(2, '0')}`
                          );
                        }}
                        className='w-8 h-8 md:w-9 md:h-9 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center transition-colors'
                      >
                        <span className='text-lg leading-none'>▴</span>
                      </button>

                      <div className='my-2 md:my-3 px-3 py-2 md:px-4 md:py-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl min-w-[50px] md:min-w-[60px]'>
                        <span className='text-xl md:text-2xl font-bold text-white block text-center'>
                          {formData.startTime
                            ? formData.startTime.split(':')[1]
                            : '00'}
                        </span>
                      </div>

                      <button
                        type='button'
                        onClick={() => {
                          const [hour, minute] = (
                            formData.startTime || '09:00'
                          ).split(':');
                          const newMinute = (parseInt(minute) - 15 + 60) % 60;
                          updateFormField(
                            'startTime',
                            `${hour}:${newMinute.toString().padStart(2, '0')}`
                          );
                        }}
                        className='w-8 h-8 md:w-9 md:h-9 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center transition-colors'
                      >
                        <span className='text-lg leading-none'>▾</span>
                      </button>
                      <span className='text-xs text-gray-500 mt-1 font-medium'>
                        Min
                      </span>
                    </div>
                  </div>

                  {/* Time Display */}
                  <div className='mt-3 text-center'>
                    <span className='text-xs text-gray-500'>
                      Hora seleccionada:{' '}
                    </span>
                    <span className='text-sm font-bold text-purple-600'>
                      {formData.startTime || '09:00'}
                    </span>
                  </div>
                </div>

                {errors.startTime && (
                  <div className='flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg mt-2'>
                    <AlertCircle className='w-3 h-3 md:w-4 md:h-4 text-red-500 flex-shrink-0' />
                    <p className='text-red-600 text-xs md:text-sm font-medium truncate'>
                      {errors.startTime}
                    </p>
                  </div>
                )}
              </div>

              {/* Hours Counter */}
              <div
                className='bg-gradient-to-br from-purple-50/50 to-indigo-50/50 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl border border-purple-100/50 backdrop-blur-sm'
                ref={(el) => el && fieldRefs.current.set('hours', el)}
              >
                <label className='flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2 gap-2'>
                  <Clock className='w-4 h-4 md:w-5 md:h-5 text-purple-500 flex-shrink-0' />
                  <span className='truncate'>
                    {t('services.standard.babysitterForm.fields.endTime.label')}
                  </span>
                  <span className='text-red-500'>*</span>
                </label>

                <div className='flex items-center justify-center gap-2 md:gap-3 lg:gap-4'>
                  <button
                    type='button'
                    onClick={() =>
                      updateFormField(
                        'hours',
                        Math.max(MIN_HOURS, formData.hours - 1)
                      )
                    }
                    disabled={formData.hours <= MIN_HOURS}
                    className='w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 text-gray-600 hover:text-purple-600 font-bold transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 flex items-center justify-center flex-shrink-0'
                  >
                    <span className='text-xl md:text-2xl leading-none'>−</span>
                  </button>

                  <div className='flex flex-col items-center min-w-0'>
                    <div className='px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg'>
                      <span className='text-xl md:text-2xl lg:text-3xl font-bold text-white'>
                        {formData.hours}
                      </span>
                    </div>
                    <span className='text-xs md:text-sm text-gray-500 mt-1.5 md:mt-2 font-medium'>
                      {formData.hours === 1 ? 'hora' : 'horas'}
                    </span>
                  </div>

                  <button
                    type='button'
                    onClick={() =>
                      updateFormField(
                        'hours',
                        Math.min(MAX_HOURS, formData.hours + 1)
                      )
                    }
                    disabled={formData.hours >= MAX_HOURS}
                    className='w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 text-gray-600 hover:text-purple-600 font-bold transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 flex items-center justify-center flex-shrink-0'
                  >
                    <span className='text-xl md:text-2xl leading-none'>+</span>
                  </button>
                </div>

                {errors.hours && (
                  <div className='flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg mt-2'>
                    <AlertCircle className='w-3 h-3 md:w-4 md:h-4 text-red-500 flex-shrink-0' />
                    <p className='text-red-600 text-xs md:text-sm font-medium truncate'>
                      {errors.hours}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Children Information */}
          <div className='space-y-3 md:space-y-4 mt-4 md:mt-6'>
            <h3 className='text-base md:text-lg lg:text-xl font-bold text-purple-900 flex items-center gap-2 min-w-0'>
              <Baby className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-600 flex-shrink-0' />
              <span className='text-sm sm:text-base md:text-lg lg:text-xl truncate'>
                {t('services.standard.babysitterForm.sections.childrenInfo')}
              </span>
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full min-w-0'></div>
            </h3>

            {/* Children Count */}
            <div className='bg-gradient-to-br from-pink-50/50 to-purple-50/50 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl border border-pink-100/50 backdrop-blur-sm'>
              <label className='flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2 md:mb-3 gap-2'>
                <Users className='w-4 h-4 md:w-5 md:h-5 text-pink-500 flex-shrink-0' />
                <span className='truncate'>
                  {t(
                    'services.standard.babysitterForm.fields.childrenCount.label'
                  )}
                </span>
              </label>

              <div className='flex items-center justify-center gap-3 md:gap-4 lg:gap-6'>
                <button
                  type='button'
                  onClick={() => updateChildrenCount(false)}
                  disabled={formData.childrenCount <= 1}
                  className='w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 text-gray-600 hover:text-pink-600 font-bold transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 flex items-center justify-center flex-shrink-0'
                >
                  <span className='text-xl md:text-2xl leading-none'>−</span>
                </button>

                <div className='flex flex-col items-center min-w-0'>
                  <div className='w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg'>
                    <span className='text-xl md:text-2xl lg:text-3xl font-bold text-white'>
                      {formData.childrenCount}
                    </span>
                  </div>
                  <span className='text-xs md:text-sm text-gray-500 mt-1.5 md:mt-2 font-medium'>
                    {formData.childrenCount === 1 ? 'niño' : 'niños'}
                  </span>
                </div>

                <button
                  type='button'
                  onClick={() => updateChildrenCount(true)}
                  className='w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 text-gray-600 hover:text-pink-600 font-bold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center flex-shrink-0'
                >
                  <span className='text-xl md:text-2xl leading-none'>+</span>
                </button>
              </div>

              <div className='mt-3 p-2.5 md:p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-pink-200/50'>
                <p className='text-xs md:text-sm text-gray-600 text-center flex items-center justify-center gap-1.5'>
                  <DollarSign className='w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-pink-500 flex-shrink-0' />
                  <span className='font-medium truncate'>
                    {t(
                      'services.standard.babysitterForm.pricing.pricePerChild'
                    )}
                  </span>
                </p>
              </div>
            </div>

            {/* Children Ages */}
            <div
              className='bg-gradient-to-br from-pink-50/50 to-purple-50/50 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl border border-pink-100/50 backdrop-blur-sm'
              ref={(el) => el && fieldRefs.current.set('childrenAges', el)}
            >
              <label className='flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2 md:mb-3 gap-2'>
                <Baby className='w-4 h-4 md:w-5 md:h-5 text-pink-500 flex-shrink-0' />
                <span className='truncate'>
                  {t(
                    'services.standard.babysitterForm.fields.childrenAges.label'
                  )}
                </span>
                <span className='text-red-500'>*</span>
              </label>

              <div className='space-y-2 md:space-y-2.5'>
                {formData.childrenAges.map((age, index) => (
                  <div key={index} className='group relative'>
                    <div className='flex items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-sm p-2.5 md:p-3 rounded-lg md:rounded-xl border border-gray-200 hover:border-pink-300 transition-all duration-200 shadow-sm hover:shadow-md'>
                      <div className='flex items-center justify-center min-w-[28px] h-7 md:min-w-[32px] md:h-8 lg:min-w-[36px] lg:h-9 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-lg font-semibold text-xs md:text-sm shadow-sm flex-shrink-0'>
                        {index + 1}
                      </div>

                      <div className='flex-1 relative min-w-0'>
                        <select
                          value={age}
                          onChange={(e) =>
                            handleAgeChange(index, e.target.value)
                          }
                          className={`w-full px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 bg-transparent border-0 text-xs md:text-sm lg:text-base font-medium text-gray-700 cursor-pointer appearance-none focus:outline-none focus:ring-0 transition-all
                            ${!age ? 'text-gray-400' : 'text-gray-800'}
                            ${errors.childrenAges ? 'text-red-600' : ''}
                          `}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ec4899'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.25rem center',
                            backgroundSize: '1rem',
                            paddingRight: '1.75rem',
                          }}
                        >
                          <option value=''>Edad</option>
                          <option value='0-6 meses'>0-6 meses</option>
                          <option value='6-12 meses'>6-12 meses</option>
                          <option value='1 año'>1 año</option>
                          <option value='2 años'>2 años</option>
                          <option value='3 años'>3 años</option>
                          <option value='4 años'>4 años</option>
                          <option value='5 años'>5 años</option>
                          <option value='6 años'>6 años</option>
                          <option value='7 años'>7 años</option>
                          <option value='8 años'>8 años</option>
                          <option value='9 años'>9 años</option>
                          <option value='10 años'>10 años</option>
                          <option value='11 años'>11 años</option>
                          <option value='12 años'>12 años</option>
                          <option value='13 años'>13 años</option>
                          <option value='14 años'>14 años</option>
                          <option value='15 años'>15 años</option>
                          <option value='16 años'>16 años</option>
                          <option value='17 años'>17 años</option>
                        </select>
                      </div>

                      {age && (
                        <div className='flex-shrink-0 w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 bg-green-500 rounded-full flex items-center justify-center shadow-sm'>
                          <CheckCircle className='w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white' />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {errors.childrenAges && (
                  <div className='flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg mt-2'>
                    <AlertCircle className='w-3 h-3 md:w-4 md:h-4 text-red-500 flex-shrink-0' />
                    <p className='text-red-600 text-xs md:text-sm font-medium break-words'>
                      {errors.childrenAges}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Special Needs */}
            <div
              className='mt-3 md:mt-4'
              ref={(el) =>
                el && fieldRefs.current.set('specialNeedsDetails', el)
              }
            >
              <button
                type='button'
                className='w-full flex items-center justify-between p-3 md:p-4 lg:p-5 border border-gray-200 rounded-lg md:rounded-xl bg-white hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50/30 hover:to-pink-50/30 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group min-w-0'
                onClick={toggleSpecialNeeds}
              >
                <div className='flex items-center gap-2 md:gap-3 min-w-0 flex-1'>
                  <div
                    className={`relative w-5 h-5 md:w-6 md:h-6 rounded-lg flex-shrink-0 transition-all duration-200 ${
                      formData.hasSpecialNeeds
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-sm'
                        : 'bg-white border-2 border-gray-300 group-hover:border-purple-400'
                    }`}
                  >
                    {formData.hasSpecialNeeds && (
                      <CheckCircle className='w-full h-full text-white p-0.5' />
                    )}
                  </div>

                  <div className='flex flex-col items-start min-w-0 flex-1'>
                    <span className='font-semibold text-gray-800 text-xs sm:text-sm md:text-base truncate w-full'>
                      {t(
                        'services.standard.babysitterForm.fields.specialNeeds.toggle'
                      )}
                    </span>
                    <span className='text-xs text-gray-500 hidden sm:block truncate w-full'>
                      Info adicional de cuidados
                    </span>
                  </div>
                </div>

                <Heart
                  className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 ml-2 transition-all duration-200 ${
                    formData.hasSpecialNeeds
                      ? 'text-pink-500 fill-pink-500'
                      : 'text-gray-300 group-hover:text-pink-400'
                  }`}
                />
              </button>

              {formData.hasSpecialNeeds && (
                <div className='mt-2.5 md:mt-3'>
                  <div className='pl-3 md:pl-4 lg:pl-6 border-l-4 border-purple-400 bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-3 md:p-4 lg:p-6 rounded-r-lg md:rounded-r-xl backdrop-blur-sm'>
                    <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-2 md:mb-3'>
                      {t(
                        'services.standard.babysitterForm.fields.specialNeeds.label'
                      )}{' '}
                      <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                      name='specialNeedsDetails'
                      value={formData.specialNeedsDetails}
                      onChange={handleChange}
                      placeholder={t(
                        'services.standard.babysitterForm.fields.specialNeeds.placeholder'
                      )}
                      className={`w-full p-2.5 md:p-3 lg:p-4 border rounded-lg md:rounded-xl shadow-sm h-20 md:h-24 lg:h-32 text-xs md:text-sm lg:text-base transition-all focus:ring-2 focus:outline-none resize-none
                        ${
                          errors.specialNeedsDetails
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-200 bg-red-50/50'
                            : 'border-gray-200 focus:border-purple-400 focus:ring-purple-200 bg-white/80 backdrop-blur-sm'
                        }
                      `}
                    ></textarea>
                    {errors.specialNeedsDetails && (
                      <div className='flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg mt-2'>
                        <AlertCircle className='w-3 h-3 md:w-4 md:h-4 text-red-500 flex-shrink-0' />
                        <p className='text-red-600 text-xs md:text-sm font-medium break-words'>
                          {errors.specialNeedsDetails}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <div className='space-y-3 md:space-y-4 mt-4 md:mt-6'>
            <h3 className='text-base md:text-lg lg:text-xl font-bold text-purple-900 flex items-center gap-2 min-w-0'>
              <MessageSquare className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-600 flex-shrink-0' />
              <span className='text-sm sm:text-base md:text-lg lg:text-xl truncate'>
                {t('services.standard.babysitterForm.sections.additionalInfo')}
              </span>
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full min-w-0'></div>
            </h3>

            <div className='bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl border border-indigo-100/50 backdrop-blur-sm'>
              <label className='flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2 gap-2'>
                <MessageSquare className='w-4 h-4 md:w-5 md:h-5 text-indigo-500 flex-shrink-0' />
                <span className='truncate'>
                  {t(
                    'services.standard.babysitterForm.fields.specialRequests.label'
                  )}
                </span>
                <span className='text-xs text-gray-400 font-normal'>
                  (Opcional)
                </span>
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder={t(
                  'services.standard.babysitterForm.fields.specialRequests.placeholder'
                )}
                className='w-full p-2.5 md:p-3 lg:p-4 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white/80 backdrop-blur-sm shadow-sm h-20 md:h-24 lg:h-32 text-xs md:text-sm lg:text-base focus:outline-none transition-all resize-none'
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className='rounded-b-lg md:rounded-b-2xl p-3 sm:p-4 md:p-6 lg:p-8 text-white overflow-hidden'
          style={{
            background:
              'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #7c3aed 100%)',
          }}
        >
          <div className='flex flex-col space-y-3 md:space-y-4'>
            <div className='text-center md:text-left'>
              <div className='text-xs text-purple-200 mt-2 space-y-0.5'>
                <div className='break-words'>
                  {formData.childrenCount}{' '}
                  {formData.childrenCount === 1 ? 'niño' : 'niños'} ×{' '}
                  {formData.hours} {formData.hours === 1 ? 'hora' : 'horas'} × $
                  {PRICE_PER_CHILD_PER_HOUR} = $
                  {priceBreakdown.basePrice.toFixed(2)}
                </div>

                <div className='border-t border-purple-300 my-1 pt-1'>
                  <div>Subtotal: ${priceBreakdown.subtotal.toFixed(2)}</div>
                  <div className='text-yellow-200 break-words'>
                    {t('common.fee.creditcard')} ({TAX_RATE}%): $
                    {priceBreakdown.tax.toFixed(2)}
                  </div>
                </div>
              </div>
              <div>
                <p className='text-purple-200 text-xs md:text-sm'>
                  {t('services.standard.babysitterForm.pricing.totalPrice')}
                </p>
                <p className='text-2xl md:text-3xl font-bold'>
                  ${priceBreakdown.total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 md:gap-3 lg:gap-4 w-full'>
              <button
                type='button'
                onClick={onCancel}
                disabled={isSubmitting}
                className='w-full sm:flex-1 px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 border-2 border-white/30 rounded-lg md:rounded-xl text-white text-sm md:text-base hover:bg-white/10 transition-colors disabled:opacity-50'
              >
                <span className='truncate'>
                  {t('services.standard.babysitterForm.buttons.cancel')}
                </span>
              </button>

              <button
                type='submit'
                disabled={isSubmitting || !checkFormValidity.isValid}
                className={`w-full sm:flex-1 px-3 md:px-4 lg:px-8 py-2 md:py-2.5 lg:py-3 rounded-lg md:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center font-medium text-sm md:text-base gap-2 ${
                  isSubmitting || !checkFormValidity.isValid
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white flex-shrink-0'></div>
                    <span className='truncate'>
                      {t('services.standard.babysitterForm.buttons.processing')}
                    </span>
                  </>
                ) : (
                  <>
                    <CreditCard className='h-4 w-4 md:h-5 md:w-5 flex-shrink-0' />
                    <span className='truncate'>
                      {t('services.standard.babysitterForm.buttons.submit')}
                    </span>
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
