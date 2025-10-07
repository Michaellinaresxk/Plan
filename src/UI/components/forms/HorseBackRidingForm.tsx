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
  participantCount: number;
  minorsCount: number;
}

interface FormErrors {
  [key: string]: string;
}

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
    participantCount: 2,
    minorsCount: 0,
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

  const basePrice = useMemo(() => {
    return service.price * formData.participantCount;
  }, [formData.participantCount, service.price]);

  const priceWithTax = useMemo(() => {
    return calculatePriceWithTax(basePrice, TAX_RATE);
  }, [basePrice]);

  const totalPrice = priceWithTax.total;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      updateFormField(name, value);
    },
    [updateFormField]
  );

  const createCounterHandler = (field: keyof FormData, min = 0, max = 8) => ({
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

  const participantCounter = createCounterHandler('participantCount', 1);

  useEffect(() => {
    if (formData.minorsCount > formData.participantCount) {
      setFormData((prev) => ({
        ...prev,
        minorsCount: Math.min(prev.minorsCount, prev.participantCount),
      }));
    }
  }, [formData.participantCount]);

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

    if (formData.participantCount < 1) {
      newErrors.participantCount = t(
        'services.standard.horsebackRidingForm.fields.totalParticipants.min'
      );
    }

    if (formData.participantCount > 8) {
      newErrors.participantCount = t(
        'services.standard.horsebackRidingForm.fields.totalParticipants.max'
      );
    }

    if (formData.minorsCount > formData.participantCount) {
      newErrors.minorsCount = t(
        'services.standard.horsebackRidingForm.fields.minors.error'
      );
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
          adults: formData.participantCount - formData.minorsCount,
          children: formData.minorsCount,
          total: formData.participantCount,
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
          participantCount: formData.participantCount,
          minorsCount: formData.minorsCount,
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

  const Counter = ({
    label,
    value,
    onIncrement,
    onDecrement,
    icon: Icon,
    min = 0,
    max = 8,
  }: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    icon: React.ElementType;
    min?: number;
    max?: number;
  }) => (
    <div>
      <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
        <Icon className='w-4 h-4 mr-2 text-amber-600' />
        {label}
      </label>
      <div className='flex border border-gray-300 rounded-lg overflow-hidden bg-white'>
        <button
          type='button'
          onClick={onDecrement}
          disabled={value <= min}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50'
        >
          -
        </button>
        <div className='flex-1 py-2 text-center font-medium'>{value}</div>
        <button
          type='button'
          onClick={onIncrement}
          disabled={value >= max}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50'
        >
          +
        </button>
      </div>
      {value >= max && (
        <p className='text-xs text-amber-600 mt-1'>
          {t(
            'services.standard.horsebackRidingForm.fields.totalParticipants.maxReached'
          )}
        </p>
      )}
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
                          {formData.timeSlot
                            ? TIME_SLOTS.find(
                                (s) => s.value === formData.timeSlot
                              )?.label
                            : t(
                                'services.standard.horsebackRidingForm.fields.timeSlot.placeholder'
                              )}
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

            {/* Participants Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
                {t(
                  'services.standard.horsebackRidingForm.sections.participants'
                )}
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div
                  ref={(el) =>
                    el && fieldRefs.current.set('participantCount', el)
                  }
                >
                  <Counter
                    label={t(
                      'services.standard.horsebackRidingForm.fields.totalParticipants.label'
                    )}
                    value={formData.participantCount}
                    onIncrement={participantCounter.increment}
                    onDecrement={participantCounter.decrement}
                    icon={Users}
                    min={1}
                    max={8}
                  />
                </div>

                <div
                  ref={(el) => el && fieldRefs.current.set('minorsCount', el)}
                >
                  <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <Baby className='w-4 h-4 mr-2 text-amber-600' />
                    {t(
                      'services.standard.horsebackRidingForm.fields.minors.label'
                    )}
                  </label>
                  <input
                    type='number'
                    name='minorsCount'
                    min='0'
                    max={formData.participantCount}
                    value={formData.minorsCount}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${
                      errors.minorsCount ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
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
                        {t(
                          'services.standard.horsebackRidingForm.fields.minors.info'
                        )}
                      </p>
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
                        'services.standard.horsebackRidingForm.safety.requirement1'
                      )}
                    </li>
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
                    <li>
                      •{' '}
                      {t(
                        'services.standard.horsebackRidingForm.safety.requirement7'
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

                  <div className='flex justify-between'>
                    <span>
                      {t(
                        'services.standard.horsebackRidingForm.pricing.package'
                      )}{' '}
                      ({formData.participantCount}{' '}
                      {formData.participantCount === 1
                        ? t(
                            'services.standard.horsebackRidingForm.capacity.person'
                          )
                        : t(
                            'services.standard.horsebackRidingForm.capacity.people'
                          )}
                      )
                    </span>
                    <span className='font-medium'>${basePrice.toFixed(2)}</span>
                  </div>

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
                  disabled={isSubmitting || formData.participantCount > 8}
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
