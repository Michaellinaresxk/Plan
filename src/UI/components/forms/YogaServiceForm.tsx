import { Service } from '@/types/type';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import {
  Calendar,
  Users,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  SunMedium,
  Moon,
  MessageSquare,
  Info,
  Baby,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/client';
import { useEffect, useState, useMemo } from 'react';
import { LOCATION_OPTIONS } from '@/constants/location/location';
import FormHeader from './FormHeader';
import { useFormModal } from '@/hooks/useFormModal';
import { useScrollToError } from '@/hooks/useScrollToError';
import { calculatePriceWithTax } from '@/utils/priceCalculator';

interface YogaServiceFormProps {
  service: Service;
  onSubmit?: (formData: any) => void;
  onCancel: () => void;
}

interface FormData {
  date: string;
  timeSlot: string;
  location: string;
  yogaType: string;
  participantCount: number;
  minorsCount: number;
  hasSpecialNeeds: boolean;
  specialNeedsDetails: string;
  confirmSpecialNeeds: boolean;
  additionalNotes: string;
}

interface FormErrors {
  [key: string]: string;
}

// ✅ Tipos de yoga con precios base
const YOGA_TYPES = {
  fitness: {
    price: 120,
  },
  relaxation: {
    price: 120,
  },
  soundBath: {
    price: 140,
  },
  aerial: {
    price: 140,
  },
};

// ✅ Constantes de pricing
const ADDITIONAL_PERSON_PRICE = 30; // +$30 por cada persona adicional
const TAX_RATE = 5; // 5%

const YogaServiceForm: React.FC<YogaServiceFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  const [formData, setFormData] = useState<FormData>({
    date: '',
    timeSlot: '',
    location: '',
    yogaType: 'fitness', // Default
    participantCount: 1,
    minorsCount: 0,
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    confirmSpecialNeeds: false,
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleClose } = useFormModal({ onCancel });

  // ✅ HOOK PARA SCROLL A ERRORES
  const { fieldRefs, scrollToFirstError } = useScrollToError(errors);

  // ✅ Obtener el tipo de yoga seleccionado
  const currentYogaType = useMemo(
    () => YOGA_TYPES[formData.yogaType as keyof typeof YOGA_TYPES],
    [formData.yogaType]
  );

  // ✅ CÁLCULO DE PRECIO BASE
  // Primera persona = precio base
  // Personas adicionales = +$30 cada una
  const basePrice = useMemo(() => {
    if (!currentYogaType?.price) return 0;

    const firstPersonPrice = currentYogaType.price;
    const additionalPeople = Math.max(0, formData.participantCount - 1);
    const additionalCost = additionalPeople * ADDITIONAL_PERSON_PRICE;

    return firstPersonPrice + additionalCost;
  }, [currentYogaType, formData.participantCount]);

  // ✅ CÁLCULO DE PRECIO CON TAX
  const priceWithTax = useMemo(() => {
    if (!currentYogaType?.price) return { subtotal: 0, tax: 0, total: 0 };

    const subtotal = basePrice;
    return calculatePriceWithTax(subtotal, TAX_RATE);
  }, [basePrice, currentYogaType]);

  // ✅ Mantener totalPrice para compatibilidad
  const totalPrice = priceWithTax.total;

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
        ? prev.participantCount + 1
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
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.date) {
      newErrors.date = t('form.errors.required', {
        fallback: 'Date is required',
      });
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = t('form.errors.required', {
        fallback: 'Please select a time slot',
      });
    }

    if (!formData.yogaType) {
      newErrors.yogaType = t('form.errors.required', {
        fallback: 'Please select a yoga type',
      });
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (!validationErrors) {
      console.log('❌ YogaForm - Validation errors:', errors);
      // ✅ SCROLL AL PRIMER ERROR
      scrollToFirstError();
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDate = new Date(formData.date);
      const bookingStartDate = new Date(selectedDate);
      const bookingEndDate = new Date(selectedDate);

      if (formData.timeSlot === 'morning') {
        bookingStartDate.setHours(7, 0, 0, 0);
        bookingEndDate.setHours(11, 0, 0, 0);
      } else {
        bookingStartDate.setHours(13, 0, 0, 0);
        bookingEndDate.setHours(18, 0, 0, 0);
      }

      // Get selected location name
      const selectedLocation =
        LOCATION_OPTIONS.find((loc) => loc.id === formData.location)?.name ||
        formData.location;

      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'yoga',
          totalPrice,
          basePrice,
          // ✅ AGREGAR info de tax
          subtotal: priceWithTax.subtotal,
          tax: priceWithTax.tax,
          taxRate: TAX_RATE,
          locationName: selectedLocation,
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
            id: `yoga-${formData.yogaType}`,
            name: `${
              formData.timeSlot === 'morning' ? 'Morning' : 'Evening'
            } ${t(
              `services.standard.yogaForm.yogaTypes.${formData.yogaType}.name`
            )}`,
            quantity: 1,
            price: totalPrice,
            totalPrice,
            timeSlot: formData.timeSlot,
            yogaType: formData.yogaType,
            specialNeeds: formData.hasSpecialNeeds,
            location: selectedLocation,
          },
        ],
        clientInfo: undefined,
        yogaSpecifics: {
          timeSlot: formData.timeSlot,
          yogaType: formData.yogaType,
          location: formData.location,
          locationName: selectedLocation,
          hasSpecialNeeds: formData.hasSpecialNeeds,
          specialNeedsDetails: formData.specialNeedsDetails,
          participantCount: formData.participantCount,
          minorsCount: formData.minorsCount,
          additionalNotes: formData.additionalNotes,
          pricing: {
            basePrice,
            subtotal: priceWithTax.subtotal,
            tax: priceWithTax.tax,
            taxRate: TAX_RATE,
            totalPrice,
          },
        },
      };

      console.log('🧘 YogaForm - Reservation data created:', reservationData);

      setReservationData(reservationData);

      if (onSubmit) {
        await onSubmit(reservationData);
      }

      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ YogaForm - Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPremium = service.packageType?.includes('premium');

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
            title={t('services.standard.yogaForm.header.title')}
            subtitle={t('services.standard.yogaForm.header.subtitle')}
            onCancel={handleClose}
            showCloseButton={true}
            gradientFrom='green-800'
            gradientVia='teal-800'
            gradientTo='teal-800'
          />

          {/* Form Body */}
          <div className='p-4 space-y-8'>
            {/* Date and Time Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Calendar className='w-5 h-5 mr-2 text-teal-600' />
                {t('services.standard.yogaForm.timeslot.date')}
              </h3>

              {/* ✅ Date Selection con REF */}
              <div ref={(el) => el && fieldRefs.current.set('date', el)}>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleChange}
                  onClick={(e) => e.currentTarget.showPicker()}
                  min={new Date().toISOString().split('T')[0]}
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

              {/* ✅ Time Slot Selection con REF */}
              <div ref={(el) => el && fieldRefs.current.set('timeSlot', el)}>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-amber-600' : 'text-teal-600'
                    }`}
                  />
                  {t('services.standard.yogaForm.timeslot.title')} *
                </label>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Morning Option */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.timeSlot === 'morning'
                          ? `${
                              isPremium
                                ? 'bg-amber-50 border-amber-300'
                                : 'bg-teal-50 border-teal-300'
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
                                  ? 'border-amber-500 bg-amber-500'
                                  : 'border-teal-500 bg-teal-500'
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
                        <SunMedium
                          className={`w-5 h-5 mr-2 ${
                            isPremium ? 'text-amber-500' : 'text-teal-500'
                          }`}
                        />
                        <span className='font-medium'>
                          {t('services.standard.yogaForm.timeslot.morning')}
                        </span>
                      </div>
                    </div>
                    <p className='text-gray-500 text-sm mt-2 ml-8'>
                      7:00 AM - 11:00 AM
                    </p>
                  </div>

                  {/* Evening Option */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.timeSlot === 'evening'
                          ? `${
                              isPremium
                                ? 'bg-amber-50 border-amber-300'
                                : 'bg-teal-50 border-teal-300'
                            } shadow-sm`
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, timeSlot: 'evening' }))
                    }
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${
                          formData.timeSlot === 'evening'
                            ? `${
                                isPremium
                                  ? 'border-amber-500 bg-amber-500'
                                  : 'border-teal-500 bg-teal-500'
                              }`
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.timeSlot === 'evening' && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <Moon
                          className={`w-5 h-5 mr-2 ${
                            isPremium ? 'text-amber-500' : 'text-teal-500'
                          }`}
                        />
                        <span className='font-medium'>
                          {t('services.standard.yogaForm.timeslot.evening')}
                        </span>
                      </div>
                    </div>
                    <p className='text-gray-500 text-sm mt-2 ml-8'>
                      1:00 PM - 6:00 PM
                    </p>
                  </div>
                </div>

                {errors.timeSlot && (
                  <p className='text-red-500 text-xs mt-1'>{errors.timeSlot}</p>
                )}
              </div>
            </div>

            {/* ✅ YOGA TYPE SELECTION */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Sparkles
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.standard.yogaForm.yogaTypes.title')}
              </h3>

              <div ref={(el) => el && fieldRefs.current.set('yogaType', el)}>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  {/* Yoga | Pilates | Fitness - $120 */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.yogaType === 'fitness'
                          ? `${
                              isPremium
                                ? 'bg-amber-50 border-amber-300'
                                : 'bg-teal-50 border-teal-300'
                            } shadow-sm`
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, yogaType: 'fitness' }))
                    }
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center
                        ${
                          formData.yogaType === 'fitness'
                            ? `${
                                isPremium
                                  ? 'border-amber-500 bg-amber-500'
                                  : 'border-teal-500 bg-teal-500'
                              }`
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.yogaType === 'fitness' && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <span
                        className={`text-lg font-semibold ${
                          formData.yogaType === 'fitness'
                            ? isPremium
                              ? 'text-amber-600'
                              : 'text-teal-600'
                            : 'text-gray-600'
                        }`}
                      >
                        $120
                      </span>
                    </div>
                    <h4 className='font-medium text-gray-800'>
                      {t('services.standard.yogaForm.yogaTypes.fitness.name')}
                    </h4>
                    <p className='text-xs text-gray-500 mt-1'>
                      {t(
                        'services.standard.yogaForm.yogaTypes.fitness.description'
                      )}
                    </p>
                  </div>

                  {/* Relaxation | Meditation - $120 */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.yogaType === 'relaxation'
                          ? `${
                              isPremium
                                ? 'bg-amber-50 border-amber-300'
                                : 'bg-teal-50 border-teal-300'
                            } shadow-sm`
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        yogaType: 'relaxation',
                      }))
                    }
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center
                        ${
                          formData.yogaType === 'relaxation'
                            ? `${
                                isPremium
                                  ? 'border-amber-500 bg-amber-500'
                                  : 'border-teal-500 bg-teal-500'
                              }`
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.yogaType === 'relaxation' && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <span
                        className={`text-lg font-semibold ${
                          formData.yogaType === 'relaxation'
                            ? isPremium
                              ? 'text-amber-600'
                              : 'text-teal-600'
                            : 'text-gray-600'
                        }`}
                      >
                        $120
                      </span>
                    </div>
                    <h4 className='font-medium text-gray-800'>
                      {t(
                        'services.standard.yogaForm.yogaTypes.relaxation.name'
                      )}
                    </h4>
                    <p className='text-xs text-gray-500 mt-1'>
                      {t(
                        'services.standard.yogaForm.yogaTypes.relaxation.description'
                      )}
                    </p>
                  </div>

                  {/* Yoga w/Sound Bath - $140 */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.yogaType === 'soundBath'
                          ? `${
                              isPremium
                                ? 'bg-amber-50 border-amber-300'
                                : 'bg-teal-50 border-teal-300'
                            } shadow-sm`
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        yogaType: 'soundBath',
                      }))
                    }
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center
                        ${
                          formData.yogaType === 'soundBath'
                            ? `${
                                isPremium
                                  ? 'border-amber-500 bg-amber-500'
                                  : 'border-teal-500 bg-teal-500'
                              }`
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.yogaType === 'soundBath' && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <span
                        className={`text-lg font-semibold ${
                          formData.yogaType === 'soundBath'
                            ? isPremium
                              ? 'text-amber-600'
                              : 'text-teal-600'
                            : 'text-gray-600'
                        }`}
                      >
                        $140
                      </span>
                    </div>
                    <h4 className='font-medium text-gray-800'>
                      {t('services.standard.yogaForm.yogaTypes.soundBath.name')}
                    </h4>
                    <p className='text-xs text-gray-500 mt-1'>
                      {t(
                        'services.standard.yogaForm.yogaTypes.soundBath.description'
                      )}
                    </p>
                  </div>

                  {/* Aerial Yoga or Pilates - $140 */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.yogaType === 'aerial'
                          ? `${
                              isPremium
                                ? 'bg-amber-50 border-amber-300'
                                : 'bg-teal-50 border-teal-300'
                            } shadow-sm`
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        yogaType: 'aerial',
                      }))
                    }
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center
                        ${
                          formData.yogaType === 'aerial'
                            ? `${
                                isPremium
                                  ? 'border-amber-500 bg-amber-500'
                                  : 'border-teal-500 bg-teal-500'
                              }`
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.yogaType === 'aerial' && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <span
                        className={`text-lg font-semibold ${
                          formData.yogaType === 'aerial'
                            ? isPremium
                              ? 'text-amber-600'
                              : 'text-teal-600'
                            : 'text-gray-600'
                        }`}
                      >
                        $140
                      </span>
                    </div>
                    <h4 className='font-medium text-gray-800'>
                      {t('services.standard.yogaForm.yogaTypes.aerial.name')}
                    </h4>
                    <p className='text-xs text-gray-500 mt-1'>
                      {t(
                        'services.standard.yogaForm.yogaTypes.aerial.description'
                      )}
                    </p>
                  </div>
                </div>

                {errors.yogaType && (
                  <p className='text-red-500 text-xs mt-1'>{errors.yogaType}</p>
                )}
              </div>
            </div>

            {/* Participants Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Users
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.standard.yogaForm.participants.title')}
              </h3>

              <section className='grid grid-cols-2 md:grid-cols-2 gap-6'>
                {/* ✅ Participant Count con REF */}
                <div
                  ref={(el) =>
                    el && fieldRefs.current.set('participantCount', el)
                  }
                >
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Users
                      className={`w-4 h-4 mr-2 ${
                        isPremium ? 'text-amber-600' : 'text-teal-600'
                      }`}
                    />
                    {t('services.standard.yogaForm.participants.number')}
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

                  {/* ✅ MOSTRAR PRECIO ADICIONAL */}
                  {formData.participantCount > 1 && (
                    <div className='mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200'>
                      <p className='text-xs text-blue-700'>
                        +{formData.participantCount - 1} ×{' '}
                        {t(
                          'services.standard.yogaForm.participants.additionalPerson',
                          {
                            price: ADDITIONAL_PERSON_PRICE,
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Minors Count */}
                <div
                  ref={(el) => el && fieldRefs.current.set('minorsCount', el)}
                >
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Baby
                      className={`w-4 h-4 mr-2 ${
                        isPremium ? 'text-amber-600' : 'text-teal-600'
                      }`}
                    />
                    {t('services.standard.yogaForm.participants.under18')}
                  </label>
                  <input
                    type='number'
                    name='minorsCount'
                    min='0'
                    max={formData.participantCount}
                    value={formData.minorsCount}
                    onChange={handleChange}
                    className={`w-full max-w-xs p-2 border ${
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
                        {formData.minorsCount}{' '}
                        {t('services.standard.yogaForm.participants.warning')}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Special Needs Toggle */}
              <div className='mt-4'>
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
                      {t('services.standard.yogaForm.disability.title')}
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
                    className={`mt-4 p-4 border rounded-lg ${
                      isPremium ? 'border-amber-200' : 'border-teal-200'
                    }`}
                  >
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('services.standard.yogaForm.disability.specify')} *
                    </label>
                    <textarea
                      name='specialNeedsDetails'
                      value={formData.specialNeedsDetails}
                      onChange={handleChange}
                      placeholder={t(
                        'services.standard.yogaForm.disability.describe'
                      )}
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
                          {t(
                            'services.standard.yogaForm.disability.confirmation'
                          )}
                        </label>
                      </div>
                      {errors.confirmSpecialNeeds && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.confirmSpecialNeeds}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Additional Notes Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <MessageSquare
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.standard.yogaForm.footer.additionalInfo')}
              </h3>

              <div>
                <textarea
                  name='additionalNotes'
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder={t(
                    'services.standard.yogaForm.footer.experience'
                  )}
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
          </div>

          {/* ✅ Form Footer - ACTUALIZADO con desglose de tax */}
          <div className='rounded-2xl bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
            <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
              <span className='text-gray-400 text-sm uppercase tracking-wide'>
                {t('services.standard.yogaForm.footer.total')}
              </span>
              <div className='flex items-center mt-1'>
                <span className='text-3xl font-light'>
                  ${totalPrice.toFixed(2)}
                </span>
                {formData.participantCount > 1 && (
                  <span className='ml-2 text-sm bg-blue-800 px-2 py-1 rounded'>
                    {formData.participantCount}{' '}
                    {t('services.yoga.people', { fallback: 'people' })}
                  </span>
                )}
              </div>

              {/* ✅ Price breakdown */}
              <div className='text-xs text-gray-400 mt-2 space-y-1'>
                <div className='text-teal-400 font-medium'>
                  {t(
                    `services.standard.yogaForm.yogaTypes.${formData.yogaType}.name`
                  )}{' '}
                  - {formData.timeSlot === 'morning' ? 'Morning' : 'Evening'}
                </div>
                <div>
                  {t('services.standard.yogaForm.pricing.basePrice')}: $
                  {currentYogaType?.price || 0}
                </div>
                {formData.participantCount > 1 && (
                  <div>
                    {formData.participantCount - 1} ×{' '}
                    {t(
                      'services.standard.yogaForm.participants.additionalPerson',
                      {
                        price: ADDITIONAL_PERSON_PRICE,
                      }
                    )}
                    : +$
                    {(
                      (formData.participantCount - 1) *
                      ADDITIONAL_PERSON_PRICE
                    ).toFixed(2)}
                  </div>
                )}

                {/* ✅ DESGLOSE DE TAX */}
                <div className='border-t border-gray-700 pt-1 mt-1'>
                  <div>Subtotal: ${priceWithTax.subtotal.toFixed(2)}</div>
                  <div className='text-yellow-400'>
                    {t('common.fee.creditcard')} ({TAX_RATE}%): $
                    {priceWithTax.tax.toFixed(2)}
                  </div>
                </div>

                {formData.minorsCount > 0 && (
                  <div className='text-yellow-400'>
                    {formData.minorsCount} participant(s){' '}
                    {t('services.standard.yogaForm.footer.under18')}
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
                {t('services.standard.yogaForm.footer.buttons.cancel')}
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
                  ? t('services.standard.yogaForm.footer.buttons.booking')
                  : t('services.standard.yogaForm.footer.buttons.bookNow')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default YogaServiceForm;
