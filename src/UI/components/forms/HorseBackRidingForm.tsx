import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { Service } from '@/types/type';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Baby,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  Mountain,
  CreditCard,
  ChevronDown,
  ChevronUp,
  User,
} from 'lucide-react';
import FormHeader from './FormHeader';
import { useFormModal } from '@/hooks/useFormModal';
import { useScrollToError } from '@/hooks/useScrollToError';
import { calculatePriceWithTax } from '@/utils/priceCalculator';

interface HorseBackRidingFormProps {
  service: Service;
  onSubmit?: (formData: any) => void;
  onCancel?: () => void;
}

interface FormData {
  date: string;
  timeSlot: string;
  adults: number;
  children: number;
  infants: number;
}

interface FormErrors {
  [key: string]: string;
}

// Precios por categoría
const ADULT_PRICE = 75; // Más de 10 años
const CHILD_PRICE = 75 * 0.5; // 5 a 10 años: 50%
const INFANT_PRICE = 0; // Menores de 5 años: gratis

// Generar horarios entre 8 AM y 2 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 14; hour++) {
    const time12h = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    slots.push({
      value: `${hour}:00`,
      label: `${time12h}:00 ${ampm}`,
    });
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const HorseBackRidingForm: React.FC<HorseBackRidingFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel });

  const [formData, setFormData] = useState<FormData>({
    date: '',
    timeSlot: '',
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimeSlotOpen, setIsTimeSlotOpen] = useState(false);

  const { fieldRefs, scrollToFirstError } = useScrollToError(errors);

  const TAX_RATE = 5; // 5%

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

  // Calcular precio base por categoría
  const basePrice = useMemo(() => {
    return (
      formData.adults * ADULT_PRICE +
      formData.children * CHILD_PRICE +
      formData.infants * INFANT_PRICE
    );
  }, [formData.adults, formData.children, formData.infants]);

  const priceWithTax = useMemo(() => {
    return calculatePriceWithTax(basePrice, TAX_RATE);
  }, [basePrice]);

  const totalPrice = priceWithTax.total;
  const totalParticipants =
    formData.adults + formData.children + formData.infants;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      updateFormField(name, value);
    },
    [updateFormField]
  );

  const createCounterHandler = (field: keyof FormData, min = 0, max = 999) => ({
    increment: () =>
      setFormData((prev) => ({
        ...prev,
        [field]: Math.min(max, (prev[field] as number) + 1),
      })),
    decrement: () =>
      setFormData((prev) => ({
        ...prev,
        [field]: Math.max(min, (prev[field] as number) - 1),
      })),
  });
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(true);
  const adultsCounter = createCounterHandler('adults', 1);
  const childrenCounter = createCounterHandler('children', 0);
  const infantsCounter = createCounterHandler('infants', 0);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.date) {
      newErrors.date = t(
        'services.standard.horsebackRidingForm.fields.date.required'
      );
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = t(
        'services.standard.horsebackRidingForm.fields.timeSlot.required'
      );
    }

    if (totalParticipants < 1) {
      newErrors.participants = 'At least one participant is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ HorseBackForm - Validation errors:', validationErrors);
      scrollToFirstError();
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDate = new Date(formData.date);
      const bookingStartDate = new Date(selectedDate);
      const bookingEndDate = new Date(selectedDate);

      // Parsear la hora seleccionada
      const [hour] = formData.timeSlot.split(':').map(Number);
      bookingStartDate.setHours(hour, 0, 0, 0);
      bookingEndDate.setHours(hour + 3, 0, 0, 0); // 3 horas de duración

      const reservationData = {
        service: service,
        formData: {
          ...formData,
          participantCount: totalParticipants,
          serviceType: 'horseback-riding',
          totalPrice,
          basePrice,
          subtotal: priceWithTax.subtotal,
          tax: priceWithTax.tax,
          taxRate: TAX_RATE,
        },
        totalPrice,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          total: totalParticipants,
        },
        selectedItems: [
          {
            id: 'horseback-classic',
            name: t('services.standard.horsebackRidingForm.header.title'),
            quantity: 1,
            price: totalPrice,
            totalPrice,
            timeSlot: formData.timeSlot,
          },
        ],
        clientInfo: undefined,
        horsebackSpecifics: {
          timeSlot: formData.timeSlot,
          participantCount: totalParticipants,
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          pricing: {
            basePrice,
            subtotal: priceWithTax.subtotal,
            tax: priceWithTax.tax,
            taxRate: TAX_RATE,
            totalPrice,
          },
        },
      };

      console.log(
        '🐎 HorseBackForm - Reservation data created:',
        reservationData
      );

      setReservationData(reservationData);

      if (onSubmit) {
        await onSubmit(reservationData);
      }

      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ HorseBackForm - Error submitting form:', error);
      setErrors({
        submit: t('services.standard.horsebackRidingForm.errors.submit'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ParticipantCounter = ({
    label,
    sublabel,
    value,
    onIncrement,
    onDecrement,
    icon: Icon,
    min = 0,
  }: {
    label: string;
    sublabel?: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    icon: React.ElementType;
    min?: number;
  }) => (
    <div className='flex items-center justify-between py-4 border-b border-gray-200 last:border-0'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0'>
          <Icon className='w-5 h-5 text-amber-600' />
        </div>
        <div>
          <div className='text-sm font-medium text-gray-800'>{label}</div>
          {sublabel && <div className='text-xs text-gray-500'>{sublabel}</div>}
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={onDecrement}
          disabled={value <= min}
          className='w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed'
        >
          <span className='text-lg font-light'>−</span>
        </button>
        <div className='w-10 text-center text-base font-medium text-gray-800'>
          {value}
        </div>
        <button
          type='button'
          onClick={onIncrement}
          className='w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 flex items-center justify-center transition'
        >
          <span className='text-lg font-light'>+</span>
        </button>
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
          <FormHeader
            title={t('services.standard.horsebackRidingForm.header.title')}
            subtitle={t(
              'services.standard.horsebackRidingForm.header.subtitle'
            )}
            icon={Mountain}
            isPremium={false}
            onCancel={handleClose}
            showCloseButton={true}
          />

          <div className='p-8 space-y-8'>
            {/* Date and Time Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                {t('services.standard.horsebackRidingForm.sections.schedule')}
              </h3>

              {/* Date Selection */}
              <div ref={(el) => el && fieldRefs.current.set('date', el)}>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-amber-600' />
                  {t(
                    'services.standard.horsebackRidingForm.fields.date.label'
                  )}{' '}
                  *
                </label>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleInputChange}
                  onClick={(e) => e.currentTarget.showPicker()}
                  className={`w-full p-3 border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
                )}
              </div>

              {/* Time Slot Accordion */}
              <div ref={(el) => el && fieldRefs.current.set('timeSlot', el)}>
                <div className='border border-gray-200 rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => setIsTimeSlotOpen(!isTimeSlotOpen)}
                    className='w-full p-4 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between'
                  >
                    <div className='flex items-center'>
                      <Clock className='w-5 h-5 text-amber-600 mr-3' />
                      <div className='text-left'>
                        <h4 className='text-base font-medium text-gray-800'>
                          {t(
                            'services.standard.horsebackRidingForm.fields.timeSlot.label'
                          )}{' '}
                          *
                        </h4>
                        <p className='text-sm text-gray-600'>
                          {TIME_SLOTS.find((s) => s.value === formData.timeSlot)
                            ?.label || 'Select time'}
                        </p>
                      </div>
                    </div>
                    {isTimeSlotOpen ? (
                      <ChevronUp className='w-5 h-5 text-gray-600' />
                    ) : (
                      <ChevronDown className='w-5 h-5 text-gray-600' />
                    )}
                  </button>

                  {isTimeSlotOpen && (
                    <div className='p-4 bg-white max-h-64 overflow-y-auto'>
                      <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot.value}
                            type='button'
                            className={`
                              p-3 rounded-lg border-2 transition-all text-sm font-medium
                              ${
                                formData.timeSlot === slot.value
                                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                                  : 'border-gray-200 hover:border-amber-300 text-gray-700'
                              }
                            `}
                            onClick={() => {
                              updateFormField('timeSlot', slot.value);
                              setIsTimeSlotOpen(false);
                            }}
                          >
                            <div className='flex items-center justify-center'>
                              {formData.timeSlot === slot.value && (
                                <CheckCircle className='w-4 h-4 mr-1' />
                              )}
                              {slot.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {errors.timeSlot && (
                  <p className='text-red-500 text-xs mt-2'>{errors.timeSlot}</p>
                )}
              </div>
            </div>

            {/* Participants Section - Accordion */}
            <div className='border border-gray-300 rounded-lg overflow-hidden bg-white'>
              {/* Accordion Header */}
              <button
                onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
                className='w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors'
                aria-expanded={isParticipantsOpen}
              >
                <div className='text-left flex '>
                  <User className='w-5 h-5 text-amber-600 mr-3' />
                  <h4 className='text-base font-medium text-gray-800'>
                    {t(
                      'services.standard.horsebackRidingForm.sections.participants'
                    )}{' '}
                    *
                    {errors.participants && (
                      <AlertTriangle className='w-4 h-4 text-red-500' />
                    )}
                  </h4>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    isParticipantsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Accordion Content */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isParticipantsOpen
                    ? 'max-h-[2000px] opacity-100'
                    : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className='p-4 pt-0 space-y-4'>
                  <div
                    ref={(el) =>
                      el && fieldRefs.current.set('participants', el)
                    }
                  >
                    <div className='border border-gray-300 rounded-lg p-4 bg-gray-50'>
                      <ParticipantCounter
                        label='Adults'
                        sublabel={`Above 10 years • $${ADULT_PRICE}`}
                        value={formData.adults}
                        onIncrement={adultsCounter.increment}
                        onDecrement={adultsCounter.decrement}
                        icon={User}
                        min={1}
                      />
                      <ParticipantCounter
                        label='Children'
                        sublabel={`5 to 10 years • $${CHILD_PRICE.toFixed(
                          2
                        )} (50% off)`}
                        value={formData.children}
                        onIncrement={childrenCounter.increment}
                        onDecrement={childrenCounter.decrement}
                        icon={Users}
                      />
                      <ParticipantCounter
                        label='Infants'
                        sublabel='Under 5 years • Free'
                        value={formData.infants}
                        onIncrement={infantsCounter.increment}
                        onDecrement={infantsCounter.decrement}
                        icon={Baby}
                      />
                    </div>

                    {errors.participants && (
                      <p className='text-red-500 text-xs mt-2 flex items-center gap-1'>
                        <AlertTriangle className='w-3 h-3' />
                        {errors.participants}
                      </p>
                    )}
                  </div>

                  {/* Info box for children/infants */}
                  {(formData.children > 0 || formData.infants > 0) && (
                    <div className='flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200'>
                      <Info className='h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0' />
                      <div className='text-xs text-blue-700'>
                        <p className='font-medium mb-1'>Age Requirements:</p>
                        <ul className='space-y-1'>
                          <li>
                            • Adults (10+ years): Full price ${ADULT_PRICE}
                          </li>
                          <li>
                            • Children (5-10 years): 50% discount $
                            {CHILD_PRICE.toFixed(2)}
                          </li>
                          <li>• Infants (under 5): Free</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Safety Information */}
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <div className='flex items-start'>
                <AlertTriangle className='w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5' />
                <div>
                  <h4 className='font-medium text-red-800 mb-2'>
                    {t('services.standard.horsebackRidingForm.safety.title')}
                  </h4>
                  <ul className='text-sm text-red-700 space-y-1'>
                    <li>
                      •{' '}
                      {t(
                        'services.standard.horsebackRidingForm.safety.requirement2'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'services.standard.horsebackRidingForm.safety.requirement3'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'services.standard.horsebackRidingForm.safety.requirement4'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'services.standard.horsebackRidingForm.safety.requirement5'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'services.standard.horsebackRidingForm.safety.requirement6'
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-800 text-sm'>{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='bg-gray-900 text-white p-6'>
            <div className='flex flex-col space-y-6'>
              {/* Price Breakdown */}
              <div className='flex flex-col'>
                <div className='text-xs text-gray-400 space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-amber-400 font-medium'>
                      {t('services.standard.horsebackRidingForm.header.title')}
                    </span>
                  </div>

                  {/* Breakdown por categoría */}
                  {formData.adults > 0 && (
                    <div className='flex justify-between'>
                      <span>
                        {formData.adults} Adult{formData.adults > 1 ? 's' : ''}{' '}
                        × ${ADULT_PRICE}
                      </span>
                      <span className='font-medium'>
                        ${(formData.adults * ADULT_PRICE).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {formData.children > 0 && (
                    <div className='flex justify-between'>
                      <span>
                        {formData.children} Child
                        {formData.children > 1 ? 'ren' : ''} × $
                        {CHILD_PRICE.toFixed(2)}
                      </span>
                      <span className='font-medium'>
                        ${(formData.children * CHILD_PRICE).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {formData.infants > 0 && (
                    <div className='flex justify-between text-green-400'>
                      <span>
                        {formData.infants} Infant
                        {formData.infants > 1 ? 's' : ''} × Free
                      </span>
                      <span className='font-medium'>$0.00</span>
                    </div>
                  )}

                  <div className='border-t border-gray-700 pt-2 mt-2 space-y-1'>
                    <div className='flex justify-between'>
                      <span>Subtotal</span>
                      <span className='font-medium'>
                        ${priceWithTax.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between text-yellow-400'>
                      <span>
                        {t('common.fee.creditcard')} ({TAX_RATE}%)
                      </span>
                      <span className='font-medium'>
                        ${priceWithTax.tax.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {formData.timeSlot && (
                    <div className='text-amber-400 pt-2'>
                      🕒{' '}
                      {t(
                        'services.standard.horsebackRidingForm.fields.timeSlot.label'
                      )}
                      :{' '}
                      {
                        TIME_SLOTS.find((s) => s.value === formData.timeSlot)
                          ?.label
                      }
                    </div>
                  )}
                </div>

                {/* Total Price */}
                <div className='border-t border-gray-700 mt-4 pt-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-400 text-sm uppercase tracking-wide'>
                      {t(
                        'services.standard.horsebackRidingForm.pricing.totalPrice'
                      )}
                    </span>
                    <div className='flex items-center'>
                      <span className='text-3xl font-light'>
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-700'>
                <button
                  type='button'
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className='flex-1 px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition disabled:opacity-50'
                >
                  {t('services.standard.horsebackRidingForm.buttons.cancel')}
                </button>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='flex-1 px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition flex items-center justify-center disabled:opacity-50'
                >
                  <CreditCard className='h-4 w-4 mr-2' />
                  {isSubmitting
                    ? t('services.standard.horsebackRidingForm.buttons.booking')
                    : t('services.standard.horsebackRidingForm.buttons.book')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default HorseBackRidingForm;
