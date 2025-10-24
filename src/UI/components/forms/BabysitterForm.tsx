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
  const MIN_HOURS = 1;
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
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        {/* Form Header */}
        <FormHeader
          title={t('services.standard.babysitterForm.header.title')}
          subtitle={t('services.standard.babysitterForm.header.subtitle')}
          icon={Baby}
          onCancel={handleClose}
          showCloseButton={true}
          gradientFrom='slate-700'
          gradientVia='slate-800'
          gradientTo='slate-900'
        />

        {/* Form Body */}
        <div className='p-4 sm:p-6 md:p-8 space-y-6'>
          {/* Scheduling Section */}
          <div className='space-y-4'>
            <h3 className='text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200'>
              <Calendar className='w-5 h-5 text-slate-600 flex-shrink-0' />
              <span>
                {t('services.standard.babysitterForm.sections.scheduling')}
              </span>
            </h3>

            {/* Date, Start Time and Hours - Responsive Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {/* Date Field */}
              <div
                className='bg-gray-50 p-4 rounded-lg border border-gray-200'
                ref={(el) => el && fieldRefs.current.set('date', el)}
              >
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2 gap-2'>
                  <Calendar className='w-4 h-4 text-slate-600 flex-shrink-0' />
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
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:outline-none bg-white transition-all
                    ${
                      errors.date
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-gray-300 focus:border-slate-600 focus:ring-slate-100'
                    }
                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  `}
                  style={{ colorScheme: 'light' }}
                />
                {errors.date && (
                  <div className='flex items-start gap-2 mt-2 text-xs text-red-600'>
                    <AlertCircle className='w-3 h-3 flex-shrink-0 mt-0.5' />
                    <p className='break-words'>{errors.date}</p>
                  </div>
                )}
              </div>

              {/* Start Time - Compact Version */}
              <div
                className='bg-gray-50 p-4 rounded-lg border border-gray-200'
                ref={(el) => el && fieldRefs.current.set('startTime', el)}
              >
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2 gap-2'>
                  <Clock className='w-4 h-4 text-slate-600 flex-shrink-0' />
                  <span className='truncate'>
                    {t(
                      'services.standard.babysitterForm.fields.startTime.label'
                    )}
                  </span>
                  <span className='text-red-500'>*</span>
                </label>

                <div className='bg-white rounded-lg p-3 border border-gray-200'>
                  <div className='flex items-center justify-center gap-2'>
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
                        className='w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors'
                      >
                        <span className='text-base leading-none'>▴</span>
                      </button>

                      <div className='my-2 px-3 py-2 bg-slate-700 rounded-lg min-w-[45px]'>
                        <span className='text-xl font-semibold text-white block text-center'>
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
                        className='w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors'
                      >
                        <span className='text-base leading-none'>▾</span>
                      </button>
                    </div>

                    <span className='text-2xl font-semibold text-slate-400 pb-5'>
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
                        className='w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors'
                      >
                        <span className='text-base leading-none'>▴</span>
                      </button>

                      <div className='my-2 px-3 py-2 bg-slate-700 rounded-lg min-w-[45px]'>
                        <span className='text-xl font-semibold text-white block text-center'>
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
                        className='w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors'
                      >
                        <span className='text-base leading-none'>▾</span>
                      </button>
                    </div>
                  </div>
                </div>

                {errors.startTime && (
                  <div className='flex items-start gap-2 mt-2 text-xs text-red-600'>
                    <AlertCircle className='w-3 h-3 flex-shrink-0 mt-0.5' />
                    <p className='break-words'>{errors.startTime}</p>
                  </div>
                )}
              </div>

              {/* Hours Field - Compact */}
              <div
                className='bg-gray-50 p-4 rounded-lg border border-gray-200'
                ref={(el) => el && fieldRefs.current.set('hours', el)}
              >
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2 gap-2'>
                  <Clock className='w-4 h-4 text-slate-600 flex-shrink-0' />
                  <span className='truncate'>
                    {t('services.standard.babysitterForm.fields.hours.label')}
                  </span>
                  <span className='text-red-500'>*</span>
                </label>

                <div className='bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-center gap-3'>
                  <button
                    type='button'
                    onClick={() =>
                      updateFormField('hours', Math.max(1, formData.hours - 1))
                    }
                    disabled={formData.hours <= 1}
                    className='w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-gray-50 disabled:text-gray-300 text-slate-700 flex items-center justify-center transition-colors font-semibold text-lg'
                  >
                    −
                  </button>

                  <div className='flex flex-col items-center'>
                    <div className='w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center'>
                      <span className='text-2xl font-semibold text-white'>
                        {formData.hours}
                      </span>
                    </div>
                    <span className='text-xs text-gray-600 mt-1'>
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
                    className='w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-gray-50 disabled:text-gray-300 text-slate-700 flex items-center justify-center transition-colors font-semibold text-lg'
                  >
                    +
                  </button>
                </div>

                {errors.hours && (
                  <div className='flex items-start gap-2 mt-2 text-xs text-red-600'>
                    <AlertCircle className='w-3 h-3 flex-shrink-0 mt-0.5' />
                    <p className='break-words'>{errors.hours}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Children Section */}
          <div className='space-y-4'>
            <h3 className='text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200'>
              <Users className='w-5 h-5 text-slate-600 flex-shrink-0' />
              <span>
                {t('services.standard.babysitterForm.sections.childrenInfo')}
              </span>
            </h3>

            {/* Children Count - Full width with price info */}
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-3 gap-2'>
                <Users className='w-4 h-4 text-slate-600 flex-shrink-0' />
                <span className='truncate'>
                  {t(
                    'services.standard.babysitterForm.fields.childrenCount.label'
                  )}
                </span>
              </label>

              <div className='flex items-center justify-center gap-4'>
                <button
                  type='button'
                  onClick={() => updateChildrenCount(false)}
                  disabled={formData.childrenCount <= 1}
                  className='w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-gray-50 disabled:text-gray-300 text-slate-700 flex items-center justify-center transition-colors font-semibold text-xl'
                >
                  −
                </button>

                <div className='flex flex-col items-center'>
                  <div className='w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center'>
                    <span className='text-3xl font-semibold text-white'>
                      {formData.childrenCount}
                    </span>
                  </div>
                  <span className='text-sm text-gray-600 mt-2'>
                    {formData.childrenCount === 1 ? 'niño' : 'niños'}
                  </span>
                </div>

                <button
                  type='button'
                  onClick={() => updateChildrenCount(true)}
                  className='w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors font-semibold text-xl'
                >
                  +
                </button>
              </div>

              <div className='mt-3 p-2.5 bg-white rounded-lg border border-slate-200'>
                <p className='text-xs text-gray-600 text-center flex items-center justify-center gap-1.5'>
                  <DollarSign className='w-4 h-4 text-slate-600 flex-shrink-0' />
                  <span className='font-medium'>
                    {t(
                      'services.standard.babysitterForm.pricing.pricePerChild'
                    )}
                  </span>
                </p>
              </div>
            </div>

            {/* Children Ages - Dynamic list based on count */}
            <div
              className='bg-gray-50 p-4 rounded-lg border border-gray-200'
              ref={(el) => el && fieldRefs.current.set('childrenAges', el)}
            >
              <label className='flex items-center text-sm font-medium text-gray-700 mb-3 gap-2'>
                <Baby className='w-4 h-4 text-slate-600 flex-shrink-0' />
                <span className='truncate'>
                  {t(
                    'services.standard.babysitterForm.fields.childrenAges.label'
                  )}
                </span>
                <span className='text-red-500'>*</span>
              </label>

              <div className='space-y-2.5'>
                {formData.childrenAges.map((age, index) => (
                  <div key={index} className='group relative'>
                    <div className='flex items-center gap-2.5 bg-white p-3 rounded-lg border border-gray-200 hover:border-slate-400 transition-all'>
                      <div className='flex items-center justify-center min-w-[32px] h-8 bg-slate-700 text-white rounded-lg font-semibold text-sm flex-shrink-0'>
                        {index + 1}
                      </div>

                      <div className='flex-1 relative'>
                        <select
                          value={age}
                          onChange={(e) =>
                            handleAgeChange(index, e.target.value)
                          }
                          className={`w-full px-3 py-2 bg-transparent border-0 text-sm font-medium cursor-pointer appearance-none focus:outline-none focus:ring-0 transition-all
                            ${!age ? 'text-gray-400' : 'text-gray-800'}
                            ${errors.childrenAges ? 'text-red-600' : ''}
                          `}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.25rem center',
                            backgroundSize: '1rem',
                            paddingRight: '1.75rem',
                          }}
                        >
                          <option value=''>Selecciona edad</option>
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
                        <div className='flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                          <CheckCircle className='w-4 h-4 text-white' />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {errors.childrenAges && (
                  <div className='flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg mt-2'>
                    <AlertCircle className='w-3 h-3 text-red-500 flex-shrink-0 mt-0.5' />
                    <p className='text-red-600 text-xs font-medium break-words'>
                      {errors.childrenAges}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Special Needs Toggle */}
            <div
              className='mt-4'
              ref={(el) =>
                el && fieldRefs.current.set('specialNeedsDetails', el)
              }
            >
              <button
                type='button'
                className='w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:border-slate-400 hover:bg-gray-50 transition-all cursor-pointer group'
                onClick={toggleSpecialNeeds}
              >
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <div
                    className={`relative w-6 h-6 rounded-lg flex-shrink-0 transition-all ${
                      formData.hasSpecialNeeds
                        ? 'bg-slate-700'
                        : 'bg-white border-2 border-gray-300 group-hover:border-slate-400'
                    }`}
                  >
                    {formData.hasSpecialNeeds && (
                      <CheckCircle className='w-full h-full text-white p-0.5' />
                    )}
                  </div>

                  <div className='flex flex-col items-start min-w-0 flex-1'>
                    <span className='font-semibold text-gray-800 text-sm truncate w-full'>
                      {t(
                        'services.standard.babysitterForm.fields.specialNeeds.toggle'
                      )}
                    </span>
                    <span className='text-xs text-gray-500 hidden sm:block truncate w-full'>
                      Información adicional de cuidados
                    </span>
                  </div>
                </div>

                <Heart
                  className={`w-6 h-6 flex-shrink-0 ml-2 transition-all ${
                    formData.hasSpecialNeeds
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-300 group-hover:text-red-400'
                  }`}
                />
              </button>

              {formData.hasSpecialNeeds && (
                <div className='mt-3 pl-6 border-l-2 border-slate-600'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
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
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm h-24 focus:ring-2 focus:outline-none bg-white resize-none transition-all
                      ${
                        errors.specialNeedsDetails
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                          : 'border-gray-300 focus:border-slate-600 focus:ring-slate-100'
                      }
                    `}
                  ></textarea>
                  {errors.specialNeedsDetails && (
                    <div className='flex items-start gap-2 mt-2 text-xs text-red-600'>
                      <AlertCircle className='w-3 h-3 flex-shrink-0 mt-0.5' />
                      <p className='break-words'>
                        {errors.specialNeedsDetails}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Info Section */}
          <div className='space-y-4'>
            <h3 className='text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200'>
              <MessageSquare className='w-5 h-5 text-slate-600 flex-shrink-0' />
              <span>
                {t('services.standard.babysitterForm.sections.additionalInfo')}
              </span>
            </h3>

            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2 gap-2'>
                <MessageSquare className='w-4 h-4 text-slate-600 flex-shrink-0' />
                <span className='truncate'>
                  {t(
                    'services.standard.babysitterForm.fields.specialRequests.label'
                  )}
                </span>
                <span className='text-xs text-gray-500 font-normal'>
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
                className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm h-20 focus:ring-2 focus:ring-slate-100 focus:border-slate-600 bg-white focus:outline-none resize-none transition-all'
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer with Price Summary */}
        <div className='bg-slate-800 p-4 sm:p-6 rounded-b-lg border-t border-slate-700'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            {/* Price Breakdown */}
            <div className='flex-1'>
              <div className='bg-slate-700/50 rounded-lg p-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                  <div className='space-y-1'>
                    <div className='flex justify-between text-gray-300'>
                      <span>Servicio base</span>
                      <span className='font-medium'>
                        ${priceBreakdown.basePrice.toFixed(2)}
                      </span>
                    </div>
                    <div className='text-xs text-gray-400'>
                      {formData.childrenCount}{' '}
                      {formData.childrenCount === 1 ? 'niño' : 'niños'} ×{' '}
                      {formData.hours} {formData.hours === 1 ? 'hora' : 'horas'}
                    </div>
                  </div>

                  <div className='space-y-1 sm:border-l sm:border-slate-600 sm:pl-3'>
                    <div className='flex justify-between text-gray-300'>
                      <span>Subtotal</span>
                      <span className='font-medium'>
                        ${priceBreakdown.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between text-amber-400 text-xs'>
                      <span>
                        {t('common.fee.creditcard')} ({TAX_RATE}%)
                      </span>
                      <span className='font-medium'>
                        ${priceBreakdown.tax.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex justify-between items-center mt-3 pt-3 border-t border-slate-600'>
                  <span className='text-sm text-gray-400'>
                    {t('services.standard.babysitterForm.pricing.totalPrice')}
                  </span>
                  <span className='text-2xl md:text-3xl font-bold text-white'>
                    ${priceBreakdown.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]'>
              <button
                type='button'
                onClick={onCancel}
                disabled={isSubmitting}
                className='w-full px-4 py-2.5 border border-slate-600 rounded-lg text-gray-300 text-sm hover:bg-slate-700 transition-colors disabled:opacity-50 font-medium'
              >
                {t('services.standard.babysitterForm.buttons.cancel')}
              </button>

              <button
                type='submit'
                disabled={isSubmitting || !checkFormValidity.isValid}
                className={`w-full px-6 py-2.5 rounded-lg transition-all flex items-center justify-center font-medium text-sm gap-2 ${
                  isSubmitting || !checkFormValidity.isValid
                    ? 'bg-slate-600 text-gray-400 cursor-not-allowed'
                    : 'bg-slate-600 hover:bg-slate-700 text-white shadow-lg shadow-slate-900/30'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    <span>
                      {t('services.standard.babysitterForm.buttons.processing')}
                    </span>
                  </>
                ) : (
                  <>
                    <CreditCard className='h-4 w-4' />
                    <span>
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
