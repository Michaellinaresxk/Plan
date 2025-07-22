import React, { useState, useEffect, useCallback } from 'react';
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
import { useReservation } from '@/context/BookingContext'; // ✅ AGREGAR ESTE IMPORT
import { useRouter } from 'next/navigation'; // ✅ AGREGAR ESTE IMPORT

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

  // ✅ AGREGAR ESTAS LÍNEAS
  const { setReservationData } = useReservation();
  const router = useRouter();

  // ✅ Estado unificado para evitar problemas de sincronización
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    childrenCount: 1,
    childrenAges: [''],
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(service.price);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get service data
  const serviceData = ServiceManager.getData(service.id);

  // Get minimum booking duration from service data
  const minimumBooking = serviceData?.metaData?.minimumBooking
    ? parseInt(serviceData.metaData.minimumBooking.toString())
    : 3; // Default minimum is 3 hours

  // ✅ Helper para actualizar campos del formulario
  const updateFormField = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Limpiar error cuando el usuario corrige
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Calculate price based on form data
  useEffect(() => {
    let price = service.price;

    // Calculate duration in hours if both times are set
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);

      // If end time is earlier than start time, assume it's the next day
      let duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (duration < 0) {
        duration += 24;
      }

      // Apply minimum booking check
      duration = Math.max(duration, minimumBooking);

      // Apply hourly rate
      price = price * duration;
    }

    // Additional child fee
    const additionalChildFee = 10; // $10 per additional child
    if (formData.childrenCount > 1) {
      price += (formData.childrenCount - 1) * additionalChildFee;
    }

    // Special needs fee if applicable
    if (formData.hasSpecialNeeds) {
      price += 15; // $15 surcharge for special needs care
    }

    setCurrentPrice(price);
  }, [
    formData.startTime,
    formData.endTime,
    formData.location,
    formData.childrenCount,
    formData.hasSpecialNeeds,
    service.price,
    minimumBooking,
  ]);

  // ✅ Validación mejorada
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = t('form.errors.required') || 'Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime =
        t('form.errors.required') || 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = t('form.errors.required') || 'End time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = t('form.errors.required') || 'Location is required';
    }

    // Validate children ages are filled
    const filledAges = formData.childrenAges.filter((age) => age.trim() !== '');
    if (filledAges.length < formData.childrenCount) {
      newErrors.childrenAges =
        t('form.errors.fillAllAges') || 'Please fill all children ages';
    }

    // Validate special needs details if that option is selected
    if (formData.hasSpecialNeeds && !formData.specialNeedsDetails.trim()) {
      newErrors.specialNeedsDetails =
        t('form.errors.required') || 'Special needs details are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  // ✅ Handle form submission - CAMBIO CRÍTICO AQUÍ
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
        // ✅ ESTRUCTURA EXACTA COMO AIRPORT TRANSFER
        const reservationData = {
          service,
          totalPrice: currentPrice, // ✅ CAMPO CRÍTICO EN EL NIVEL RAÍZ
          formData: {
            serviceId: service.id,
            serviceName: service.name,
            serviceType: 'babysitter', // ✅ AGREGAR serviceType
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: formData.location,
            childrenCount: formData.childrenCount,
            childrenAges: formData.childrenAges,
            hasSpecialNeeds: formData.hasSpecialNeeds,
            specialNeedsDetails: formData.specialNeedsDetails,
            specialRequests: formData.specialRequests,
            calculatedPrice: currentPrice,
          },
          bookingDate: new Date(),
          clientInfo: undefined, // ✅ MANTENER CONSISTENCIA
        };

        console.log('🍼 BabysitterForm - Reservation data:', reservationData);
        console.log('💰 Total Price at root level:', currentPrice);

        // ✅ USAR EL MISMO PATRÓN QUE AIRPORT TRANSFER
        setReservationData(reservationData);
        router.push('/reservation-confirmation');
      } catch (error) {
        console.error('❌ Babysitter booking error:', error);
        alert('Error processing booking. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, service, formData, currentPrice, setReservationData, router]
  );

  // ✅ Handle input changes - mejorado
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      if (name === 'hasSpecialNeeds' && !checked) {
        // Si se desactiva special needs, resetear detalles
        updateFormField('hasSpecialNeeds', checked);
        updateFormField('specialNeedsDetails', '');
      } else {
        updateFormField(name, type === 'checkbox' ? checked : value);
      }
    },
    [updateFormField]
  );

  // ✅ Handle children count changes - corregido
  const updateChildrenCount = useCallback(
    (increment: boolean) => {
      const newCount = increment
        ? formData.childrenCount + 1
        : Math.max(1, formData.childrenCount - 1);

      // Update ages array to match the new count
      let newAges = [...formData.childrenAges];
      if (increment) {
        newAges.push(''); // Add empty age for new child
      } else if (formData.childrenCount > 1) {
        newAges = newAges.slice(0, -1); // Remove last age
      }

      setFormData((prev) => ({
        ...prev,
        childrenCount: newCount,
        childrenAges: newAges,
      }));

      // Limpiar errores relacionados
      if (errors.childrenAges) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.childrenAges;
          return newErrors;
        });
      }
    },
    [formData.childrenCount, formData.childrenAges, errors]
  );

  // ✅ Handle child age changes - corregido
  const handleAgeChange = useCallback(
    (index: number, value: string) => {
      const newAges = [...formData.childrenAges];
      newAges[index] = value;
      updateFormField('childrenAges', newAges);
    },
    [formData.childrenAges, updateFormField]
  );

  // ✅ Toggle special needs - corregido
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
        {/* Form Header - Kid-friendly Style */}
        <div className='bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 p-6 relative overflow-hidden'>
          {/* Decorative elements */}
          <div className='absolute top-0 right-0 w-64 h-64 opacity-10'>
            <svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'>
              <path
                fill='#FFFFFF'
                d='M42.8,-62.2C54.9,-56.3,63.7,-42.8,69.8,-28.5C75.9,-14.2,79.3,0.9,75.2,14.3C71.2,27.7,59.7,39.3,46.8,47.3C34,55.3,19.8,59.7,4.9,63C-10,66.3,-25.6,68.6,-37.7,62.3C-49.8,56,-58.4,41.2,-62.5,26.2C-66.6,11.3,-66.2,-3.9,-63.6,-19.3C-61,-34.7,-56.1,-50.3,-45.5,-56.7C-34.9,-63,-17.5,-60,-1.4,-58C14.7,-55.9,30.7,-68.1,42.8,-62.2Z'
                transform='translate(100 100)'
              />
            </svg>
          </div>

          <div className='relative z-10'>
            <h2 className='text-3xl font-bold text-white tracking-wide flex items-center'>
              <Baby className='w-8 h-8 mr-3' />
              {t('services.babysitter.luxuryBooking', 'Happy Kids Babysitting')}
            </h2>
            <p className='text-purple-100 mt-2 text-lg'>
              {t(
                'services.babysitter.luxuryDescription',
                'Professional childcare in the comfort of your accommodation'
              )}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className='p-8 space-y-8 relative'>
          {/* Background patterns */}
          <div className='absolute -right-6 top-40 opacity-5 w-40 h-40 rotate-12'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
              <path
                fill='currentColor'
                d='M500.203,196.093l-64.293,5.6-57.604-78.094c-2.604-3.604-6.703-5.604-11.096-5.604 c-0.5,0-1.102,0-1.602,0.102c-4.898,0.5-9.199,3.5-11.199,8l-44.699,97.797l-84.793-147.09 c-2.398-4.301-6.898-6.801-11.797-6.801c-4.898,0-9.398,2.5-11.797,6.801l-84.793,147.09L72.789,126.3 c-2-4.5-6.301-7.5-11.199-8c-4.801-0.5-9.602,1.5-12.699,5.5L5.289,201.792c-4.199,5.402-4.102,13.004,0.199,18.305 c4.301,5.301,11.801,7,17.896,4.301l58.09-25.9l39.902,74.09c1.199,2.301,2.602,4.102,4.398,5.602 c6.699,5.201,16.898,3.9,21.797-3l71.895-102.691l58.504,162.888c1.5,4.301,5.199,7.5,9.799,8.398 c0.898,0.102,1.699,0.203,2.5,0.203c3.598,0,7.098-1.5,9.699-4.102l76.891-78.792l76.797,38.695 c2,1,4.102,1.5,6.199,1.5c7,0,13.199-4.699,15-11.5C478.305,276.487,515.105,227.389,500.203,196.093z'
              ></path>
            </svg>
          </div>

          {/* Scheduling Section */}
          <div className='space-y-6'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <Calendar className='w-6 h-6 mr-2 text-purple-600' />
              {t('services.babysitter.form.scheduling', 'Scheduling')}
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            {/* Date Field - ✅ CORREGIDO */}
            <div className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-purple-800 mb-3'>
                <Calendar className='w-5 h-5 mr-2 text-purple-600' />
                {t('services.babysitter.form.date', 'Date')} *
              </label>
              <input
                type='date'
                name='date'
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-4 border-2 ${
                  errors.date ? 'border-red-400' : 'border-purple-200'
                } rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white shadow-sm transition-all duration-200`}
                min={new Date().toISOString().split('T')[0]}
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
                  {t('services.babysitter.form.startTime', 'Start Time')} *
                </label>
                <input
                  type='time'
                  name='startTime'
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full p-4 border-2 ${
                    errors.startTime ? 'border-red-400' : 'border-purple-200'
                  } rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white shadow-sm transition-all duration-200`}
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
                  {t('services.babysitter.form.endTime', 'End Time')} *
                </label>
                <input
                  type='time'
                  name='endTime'
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full p-4 border-2 ${
                    errors.endTime ? 'border-red-400' : 'border-purple-200'
                  } rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white shadow-sm transition-all duration-200`}
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
                {t(
                  'services.babysitter.form.minimumBooking',
                  `Minimum booking duration is ${minimumBooking} hours. Shorter bookings will be charged at the ${minimumBooking}-hour rate.`
                )}
              </p>
            </div>
          </div>

          {/* Location - ✅ CORREGIDO */}
          <div className='bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm'>
            <label className='flex items-center text-sm font-medium text-purple-800 mb-3'>
              <MapPin className='w-5 h-5 mr-2 text-purple-600' />
              Location *
            </label>
            <input
              type='text'
              name='location'
              value={formData.location}
              onChange={handleChange}
              className={`w-full p-4 border-2 ${
                errors.location ? 'border-red-400' : 'border-purple-200'
              } rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white shadow-sm transition-all duration-200`}
              placeholder='Please provide the complete address where the babysitting will take place'
            />
            {errors.location && (
              <p className='text-red-500 text-xs mt-2 flex items-center'>
                <AlertCircle className='w-3 h-3 mr-1' />
                {errors.location}
              </p>
            )}
          </div>

          {/* Children Information */}
          <div className='space-y-6 mt-10'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <Baby className='w-6 h-6 mr-2 text-purple-600' />
              {t(
                'services.babysitter.form.childrenInfo',
                'Tell Us About Your Children'
              )}
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            {/* Children Count - ✅ CORREGIDO */}
            <div className='bg-pink-50 p-6 rounded-xl border border-pink-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-pink-800 mb-3'>
                <Users className='w-5 h-5 mr-2 text-pink-600' />
                {t(
                  'services.babysitter.form.childrenCount',
                  'How many children need care?'
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

              {formData.childrenCount > 1 && (
                <p className='text-sm text-pink-700 mt-3 text-center flex items-center justify-center'>
                  <DollarSign className='w-4 h-4 mr-1' />
                  +$10{' '}
                  {t(
                    'services.babysitter.form.perAdditionalChild',
                    'per additional child'
                  )}
                </p>
              )}
            </div>

            {/* Children Ages */}
            <div className='space-y-4'>
              <div className='bg-pink-50 p-6 rounded-xl border border-pink-100 shadow-sm'>
                <label className='flex items-center text-sm font-medium text-pink-800 mb-3'>
                  <Baby className='w-5 h-5 mr-2 text-pink-600' />
                  {t(
                    'services.babysitter.form.childrenAges',
                    'How old are they?'
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
                          'services.babysitter.form.agePlaceholder',
                          'e.g., 3 years'
                        )}
                        className={`flex-1 p-3 border ${
                          errors.childrenAges
                            ? 'border-red-400'
                            : 'border-pink-200'
                        } rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white`}
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
            </div>

            {/* Special Needs Toggle - ✅ CORREGIDO */}
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
                    {t(
                      'services.babysitter.form.specialNeeds',
                      'Child with special needs or disabilities'
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
                      'services.babysitter.form.specialNeedsDetails',
                      'Please tell us about any special needs'
                    )}{' '}
                    *
                  </label>
                  <textarea
                    name='specialNeedsDetails'
                    value={formData.specialNeedsDetails}
                    onChange={handleChange}
                    placeholder={t(
                      'services.babysitter.form.specialNeedsPlaceholder',
                      'Please describe any special requirements, medical conditions, allergies, etc.'
                    )}
                    className={`w-full p-4 border-2 ${
                      errors.specialNeedsDetails
                        ? 'border-red-400'
                        : 'border-purple-200'
                    } rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white shadow-sm h-32`}
                  ></textarea>
                  {errors.specialNeedsDetails && (
                    <p className='text-red-500 text-xs mt-2 flex items-center'>
                      <AlertCircle className='w-3 h-3 mr-1' />
                      {errors.specialNeedsDetails}
                    </p>
                  )}
                  <p className='text-sm text-purple-700 mt-3 flex items-center'>
                    <DollarSign className='w-4 h-4 mr-1' />
                    <span>
                      +$15{' '}
                      {t(
                        'services.babysitter.form.specialNeedsFee',
                        'additional fee for specialized care'
                      )}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <div className='space-y-6 mt-10'>
            <h3 className='text-xl font-bold text-purple-900 flex items-center'>
              <MessageSquare className='w-6 h-6 mr-2 text-purple-600' />
              {t(
                'services.babysitter.form.specialRequests',
                'Additional Information'
              )}
              <div className='ml-2 h-1 flex-grow bg-gradient-to-r from-purple-200 to-transparent rounded-full'></div>
            </h3>

            <div className='bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm'>
              <label className='flex items-center text-sm font-medium text-indigo-800 mb-3'>
                <MessageSquare className='w-5 h-5 mr-2 text-indigo-600' />
                {t(
                  'services.babysitter.form.additionalInfo',
                  'Anything else we should know?'
                )}
              </label>
              <textarea
                name='specialRequests'
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder={t(
                  'services.babysitter.form.requestsPlaceholder',
                  'Favorite activities, routines, nap times, dietary preferences, or anything else that would help our babysitter provide the best care'
                )}
                className='w-full p-4 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white shadow-sm h-32'
              ></textarea>
            </div>
          </div>
        </div>

        {/* Modern Footer with Price and Actions */}
        <div className='bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-700 text-white p-8 rounded-b-2xl'>
          <div className='flex flex-col md:flex-row items-center justify-between'>
            <div className='flex flex-col items-center md:items-start mb-6 md:mb-0'>
              <span className='text-purple-200 text-sm uppercase tracking-wide font-medium'>
                {t('services.babysitter.form.totalPrice', 'Estimated Total')}
              </span>
              <div className='flex items-center mt-1'>
                <span className='text-4xl font-bold'>
                  ${currentPrice.toFixed(2)}
                </span>
                <span className='ml-2 bg-purple-500/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide'>
                  {t('services.babysitter.form.fullService', 'Full Service')}
                </span>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <button
                type='button'
                onClick={onCancel}
                className='px-6 py-3 border-2 border-white/30 rounded-xl text-white hover:bg-white/10 transition-colors'
              >
                {t('common.cancel', 'Cancel')}
              </button>

              <button
                type='submit'
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center font-medium ${
                  isSubmitting
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
                    {t('services.babysitter.form.bookNow', 'Book Your Sitter')}
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
