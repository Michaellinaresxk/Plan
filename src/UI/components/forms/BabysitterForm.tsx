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

// ✅ NUEVAS IMPORTACIONES
import { useScrollToError } from '@/hooks/useScrollToError';
import { calculatePriceWithTax } from '@/utils/priceCalculator';

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

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    hours: 2, // ✅ NUEVO: horas en lugar de endTime
    location: '',
    childrenCount: 1,
    childrenAges: [''],
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ HOOK PARA SCROLL A ERRORES
  const { fieldRefs, scrollToFirstError } = useScrollToError(errors);

  // ✅ CONSTANTES DE PRECIO
  const PRICE_PER_CHILD_PER_HOUR = 20; // $20 por niño por hora
  const SPECIAL_NEEDS_FEE = 15;
  const TAX_RATE = 5; // 5%
  const MIN_HOURS = 2; // Mínimo 2 horas
  const MAX_HOURS = 12; // Máximo 12 horas

  const checkFormValidity = useMemo(() => {
    const isDateValid = !!formData.date;
    const isStartTimeValid = !!formData.startTime;
    const isHoursValid =
      formData.hours >= MIN_HOURS && formData.hours <= MAX_HOURS;
    const isLocationValid = !!formData.location;

    const filledAges = formData.childrenAges.filter((age) => age.trim() !== '');
    const areAgesValid = filledAges.length >= formData.childrenCount;

    const areSpecialNeedsValid =
      !formData.hasSpecialNeeds || !!formData.specialNeedsDetails.trim();

    return {
      isValid:
        isDateValid &&
        isStartTimeValid &&
        isHoursValid &&
        isLocationValid &&
        areAgesValid &&
        areSpecialNeedsValid,
      checks: {
        date: isDateValid,
        startTime: isStartTimeValid,
        hours: isHoursValid,
        location: isLocationValid,
        ages: areAgesValid,
        specialNeeds: areSpecialNeedsValid,
      },
    };
  }, [formData]);

  // ✅ CÁLCULO DE PRECIO SIMPLIFICADO
  const priceBreakdown = useMemo(() => {
    // Precio base: niños × horas × precio por hora
    const basePrice =
      formData.childrenCount * formData.hours * PRICE_PER_CHILD_PER_HOUR;

    // Agregar cargo por necesidades especiales si aplica
    let subtotal = basePrice;
    if (formData.hasSpecialNeeds) {
      subtotal += SPECIAL_NEEDS_FEE;
    }

    // Calcular tax y total
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

  const handleLocationSelect = useCallback(
    (locationId: string) => {
      updateFormField('location', locationId);
    },
    [updateFormField]
  );

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

    if (!formData.location) {
      newErrors.location = t(
        'services.standard.babysitterForm.fields.location.error'
      );
    }

    const filledAges = formData.childrenAges.filter((age) => age.trim() !== '');
    if (filledAges.length < formData.childrenCount) {
      newErrors.childrenAges = t(
        'services.standard.babysitterForm.fields.childrenAges.error'
      );
    }

    if (formData.hasSpecialNeeds && !formData.specialNeedsDetails.trim()) {
      newErrors.specialNeedsDetails = t(
        'services.standard.babysitterForm.fields.specialNeeds.error'
      );
    }

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
            location: formData.location,
            locationName: selectedLocation?.name || formData.location,
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
            location: formData.location,
            locationName: selectedLocation?.name || formData.location,
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
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-2xl shadow-lg border-t-8 border-purple-500'>
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
        <div className='p-8 space-y-8 relative'>
          {/* Scheduling Section */}
          <div className='space-y-6'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <Calendar className='w-6 h-6 mr-2 text-purple-600' />
              {t('services.standard.babysitterForm.sections.scheduling')}
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            {/* Date Field */}
            <div
              className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'
              ref={(el) => el && fieldRefs.current.set('date', el)}
            >
              <label className='flex items-center text-sm font-medium text-purple-800 mb-3'>
                <Calendar className='w-5 h-5 mr-2 text-purple-600' />
                {t('services.standard.babysitterForm.fields.date.label')} *
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

            {/* Start Time and Hours */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Start Time */}
              <div
                className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'
                ref={(el) => el && fieldRefs.current.set('startTime', el)}
              >
                <label className='flex items-center text-sm font-medium text-purple-800 mb-3'>
                  <Clock className='w-5 h-5 mr-2 text-purple-600' />
                  {t(
                    'services.standard.babysitterForm.fields.startTime.label'
                  )}{' '}
                  *
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

              {/* ✅ Hours Counter with Buttons */}
              <div
                className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'
                ref={(el) => el && fieldRefs.current.set('hours', el)}
              >
                <label className='flex items-center text-sm font-medium text-purple-800 mb-3'>
                  <Clock className='w-5 h-5 mr-2 text-purple-600' />
                  {t('services.standard.babysitterForm.fields.endTime.label')} *
                </label>

                <div className='flex w-full bg-white rounded-xl overflow-hidden shadow-sm border-2 border-purple-200'>
                  <button
                    type='button'
                    onClick={() =>
                      updateFormField(
                        'hours',
                        Math.max(MIN_HOURS, formData.hours - 1)
                      )
                    }
                    disabled={formData.hours <= MIN_HOURS}
                    className='w-16 py-4 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    -
                  </button>
                  <div className='flex-grow py-4 font-bold text-lg text-purple-900 text-center flex items-center justify-center'>
                    <span className='text-2xl'>{formData.hours}</span>
                    <span className='text-sm ml-2 text-purple-600'>
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
                    className='w-16 py-4 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    +
                  </button>
                </div>

                {errors.hours && (
                  <p className='text-red-500 text-xs mt-2 flex items-center'>
                    <AlertCircle className='w-3 h-3 mr-1' />
                    {errors.hours}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Children Information */}
          <div className='space-y-6 mt-10'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <Baby className='w-6 h-6 mr-2 text-purple-600' />
              {t('services.standard.babysitterForm.sections.childrenInfo')}
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            {/* Children Count */}
            <div className='bg-pink-50 p-6 rounded-xl border border-pink-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-pink-800 mb-3'>
                <Users className='w-5 h-5 mr-2 text-pink-600' />
                {t(
                  'services.standard.babysitterForm.fields.childrenCount.label'
                )}
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

              <p className='text-sm text-pink-700 mt-3 text-center flex items-center justify-center'>
                <DollarSign className='w-4 h-4 mr-1' />
                {t('services.standard.babysitterForm.pricing.pricePerChild')}
              </p>
            </div>

            {/* Children Ages */}
            <div
              className='bg-pink-50 p-6 rounded-xl border border-pink-100 shadow-sm'
              ref={(el) => el && fieldRefs.current.set('childrenAges', el)}
            >
              <label className='flex items-center text-sm font-medium text-pink-800 mb-3'>
                <Baby className='w-5 h-5 mr-2 text-pink-600' />
                {t(
                  'services.standard.babysitterForm.fields.childrenAges.label'
                )}{' '}
                *
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
                      placeholder={t(
                        'services.standard.babysitterForm.fields.childrenAges.placeholder'
                      )}
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
            <div
              className='mt-6'
              ref={(el) =>
                el && fieldRefs.current.set('specialNeedsDetails', el)
              }
            >
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
                    {t(
                      'services.standard.babysitterForm.fields.specialNeeds.toggle'
                    )}
                  </span>
                </div>
                <Heart className='w-6 h-6 text-pink-500' />
              </div>

              {/* Special Needs Details */}
              {formData.hasSpecialNeeds && (
                <div className='mt-4 pl-6 border-l-4 border-purple-300 bg-purple-50 p-6 rounded-xl'>
                  <label className='block text-sm font-medium text-purple-800 mb-3'>
                    {t(
                      'services.standard.babysitterForm.fields.specialNeeds.label'
                    )}{' '}
                    *
                  </label>
                  <textarea
                    name='specialNeedsDetails'
                    value={formData.specialNeedsDetails}
                    onChange={handleChange}
                    placeholder={t(
                      'services.standard.babysitterForm.fields.specialNeeds.placeholder'
                    )}
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
                </div>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <div className='space-y-6 mt-10'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <MessageSquare className='w-6 h-6 mr-2 text-purple-600' />
              {t('services.standard.babysitterForm.sections.additionalInfo')}
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            <div className='bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-indigo-800 mb-3'>
                <MessageSquare className='w-5 h-5 mr-2 text-indigo-600' />
                {t(
                  'services.standard.babysitterForm.fields.specialRequests.label'
                )}
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder={t(
                  'services.standard.babysitterForm.fields.specialRequests.placeholder'
                )}
                className='w-full p-4 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm h-32 focus:outline-none'
              ></textarea>
            </div>
          </div>
        </div>

        {/* ✅ Footer Simplificado */}
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
                <p className='text-purple-200 text-sm'>
                  {t('services.standard.babysitterForm.pricing.totalPrice')}
                </p>
                <p className='text-3xl font-bold'>
                  ${priceBreakdown.total.toFixed(2)}
                </p>

                {/* ✅ Price breakdown simplificado - SIN specialCare */}
                <div className='text-xs text-purple-200 mt-2 space-y-1'>
                  <div>
                    {formData.childrenCount}{' '}
                    {formData.childrenCount === 1 ? 'niño' : 'niños'} ×{' '}
                    {formData.hours} {formData.hours === 1 ? 'hora' : 'horas'} ×
                    ${PRICE_PER_CHILD_PER_HOUR} = $
                    {priceBreakdown.basePrice.toFixed(2)}
                  </div>

                  <div className='border-t border-purple-300 my-1 pt-1'>
                    <div>Subtotal: ${priceBreakdown.subtotal.toFixed(2)}</div>
                    <div className='text-yellow-200'>
                      {t('common.fee.creditcard')} ({TAX_RATE}%): $
                      {priceBreakdown.tax.toFixed(2)}
                    </div>
                  </div>
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
                {t('services.standard.babysitterForm.buttons.cancel')}
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
                    {t('services.standard.babysitterForm.buttons.processing')}
                  </>
                ) : (
                  <>
                    <CreditCard className='h-5 w-5 mr-2' />
                    {t('services.standard.babysitterForm.buttons.submit')}
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
