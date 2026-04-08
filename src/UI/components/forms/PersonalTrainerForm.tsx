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
  Sunrise,
  MessageSquare,
  Info,
  MapPin,
  Activity,
  Target,
  Dumbbell,
  Baby,
  Flame,
  Zap,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/client';
import { useState, useMemo, useCallback } from 'react';
import { LOCATION_OPTIONS } from '@/constants/location/location';
import { useFormModal } from '@/hooks/useFormModal';
import { useScrollToError } from '@/hooks/useScrollToError';
import { calculatePriceWithTax } from '@/utils/priceCalculator';
import FormHeader from './FormHeader';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PersonalTrainerFormProps {
  service: Service;
  onSubmit?: (formData: any) => void;
  onCancel: () => void;
}

interface FormData {
  date: string;
  timeSlot: string;
  location: string;
  participantCount: number;
  minorsCount: number;
  workoutType: string;
  fitnessLevel: string;
  hasSpecialNeeds: boolean;
  specialNeedsDetails: string;
  confirmSpecialNeeds: boolean;
  additionalNotes: string;
}

interface FormErrors {
  [key: string]: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PRICE = 40;
const SPECIAL_NEEDS_FEE = 20;
const GROUP_DISCOUNT = 0.85; // 15% off per person in group
const TAX_RATE = 5; // 5% processing fee

const WORKOUT_TYPES = [
  { id: 'cardio', label: 'Cardio', icon: Heart, multiplier: 1.0 },
  { id: 'strength', label: 'Strength', icon: Dumbbell, multiplier: 1.1 },
  { id: 'functional', label: 'Functional', icon: Target, multiplier: 1.15 },
  { id: 'hiit', label: 'HIIT', icon: Flame, multiplier: 1.15 },
  { id: 'mixed', label: 'Mixed', icon: Zap, multiplier: 1.0 },
] as const;

const FITNESS_LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
] as const;

const TIME_SLOTS = [
  {
    id: 'morning',
    label: 'Morning',
    time: '7:00 AM – 11:00 AM',
    icon: Sunrise,
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    time: '1:00 PM – 6:00 PM',
    icon: Activity,
  },
] as const;

// ─── Subcomponents ────────────────────────────────────────────────────────────

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h3 className='text-sm font-semibold text-stone-900 uppercase tracking-[0.15em] border-b border-stone-200 pb-3'>
    {children}
  </h3>
);

const FieldLabel: React.FC<{
  icon: React.ElementType;
  children: React.ReactNode;
  required?: boolean;
}> = ({ icon: Icon, children, required }) => (
  <label className='flex items-center text-sm font-medium text-stone-700 mb-2'>
    <Icon className='w-4 h-4 mr-2 text-stone-400' />
    {children}
    {required && <span className='text-blue-600 ml-1'>*</span>}
  </label>
);

const FieldError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <p className='flex items-center gap-1 text-red-600 text-xs mt-1.5'>
      <AlertCircle className='w-3 h-3' />
      {message}
    </p>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const PersonalTrainerForm: React.FC<PersonalTrainerFormProps> = ({
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
    location: '',
    participantCount: 1,
    minorsCount: 0,
    workoutType: '',
    fitnessLevel: '',
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    confirmSpecialNeeds: false,
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fieldRefs, scrollToFirstError } = useScrollToError(errors);

  // ── Derived pricing (useMemo, not useEffect) ───────────────────────

  const workoutMultiplier = useMemo(() => {
    const found = WORKOUT_TYPES.find((w) => w.id === formData.workoutType);
    return found?.multiplier ?? 1;
  }, [formData.workoutType]);

  const basePrice = useMemo(() => {
    const adjustedBase = BASE_PRICE * workoutMultiplier;

    const pricePerPerson =
      formData.participantCount > 1
        ? adjustedBase * GROUP_DISCOUNT
        : adjustedBase;

    const subtotal = pricePerPerson * formData.participantCount;
    const specialFee = formData.hasSpecialNeeds ? SPECIAL_NEEDS_FEE : 0;

    return subtotal + specialFee;
  }, [formData.participantCount, formData.hasSpecialNeeds, workoutMultiplier]);

  // ✅ Tax calculation — same pattern as YogaServiceForm
  const priceWithTax = useMemo(
    () => calculatePriceWithTax(basePrice, TAX_RATE),
    [basePrice],
  );

  const totalPrice = priceWithTax.total;

  // ── Field helpers ───────────────────────────────────────────────────

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field);
    },
    [clearError],
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;

      if (type === 'checkbox') {
        updateField(name as keyof FormData, checked as any);

        if (name === 'hasSpecialNeeds' && !checked) {
          setFormData((prev) => ({
            ...prev,
            hasSpecialNeeds: false,
            specialNeedsDetails: '',
            confirmSpecialNeeds: false,
          }));
        }
      } else {
        updateField(name as keyof FormData, value as any);
      }
    },
    [updateField],
  );

  const updateParticipantCount = useCallback((increment: boolean) => {
    setFormData((prev) => {
      const newCount = increment
        ? Math.min(6, prev.participantCount + 1)
        : Math.max(1, prev.participantCount - 1);

      return {
        ...prev,
        participantCount: newCount,
        minorsCount: Math.min(prev.minorsCount, newCount),
      };
    });
  }, []);

  // ── Validation ──────────────────────────────────────────────────────

  const validateForm = useCallback((): boolean => {
    const errs: FormErrors = {};

    if (!formData.date) errs.date = 'Date is required';
    if (!formData.location) errs.location = 'Please select a location';
    if (!formData.timeSlot) errs.timeSlot = 'Please select a time slot';
    if (!formData.workoutType) errs.workoutType = 'Please select workout type';
    if (!formData.fitnessLevel)
      errs.fitnessLevel = 'Please select fitness level';

    if (formData.minorsCount > formData.participantCount) {
      errs.minorsCount = 'Cannot exceed total participants';
    }
    if (formData.minorsCount < 0) {
      errs.minorsCount = 'Cannot be negative';
    }

    if (formData.hasSpecialNeeds) {
      if (!formData.specialNeedsDetails.trim()) {
        errs.specialNeedsDetails = 'Please provide details';
      }
      if (!formData.confirmSpecialNeeds) {
        errs.confirmSpecialNeeds = 'Please confirm';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  // ── Submit ──────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
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

        const selectedLocation =
          LOCATION_OPTIONS.find((loc) => loc.id === formData.location)?.name ||
          formData.location;

        const slotLabel =
          formData.timeSlot.charAt(0).toUpperCase() +
          formData.timeSlot.slice(1);

        const reservationData = {
          service,
          formData: {
            ...formData,
            serviceType: 'personal-trainer',
            totalPrice,
            basePrice,
            subtotal: priceWithTax.subtotal,
            tax: priceWithTax.tax,
            taxRate: TAX_RATE,
            calculatedPrice: totalPrice,
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
              id: 'personal-training-session',
              name: `${slotLabel} Personal Training – ${formData.workoutType.toUpperCase()}`,
              quantity: 1,
              price: totalPrice,
              totalPrice,
              timeSlot: formData.timeSlot,
              workoutType: formData.workoutType,
              fitnessLevel: formData.fitnessLevel,
              specialNeeds: formData.hasSpecialNeeds,
              location: selectedLocation,
            },
          ],
          clientInfo: undefined,
          personalTrainerSpecifics: {
            timeSlot: formData.timeSlot,
            location: formData.location,
            locationName: selectedLocation,
            workoutType: formData.workoutType,
            fitnessLevel: formData.fitnessLevel,
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

        setReservationData(reservationData);

        if (onSubmit) {
          await onSubmit(reservationData);
        }

        router.push('/reservation-confirmation');
      } catch (error) {
        console.error('❌ PersonalTrainerForm - Error:', error);
        setErrors({
          submit: 'Failed to submit reservation. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validateForm,
      scrollToFirstError,
      formData,
      service,
      totalPrice,
      basePrice,
      priceWithTax,
      setReservationData,
      onSubmit,
      router,
    ],
  );

  const isPremium = service.packageType?.includes('premium');

  const inputBase =
    'w-full p-3 border rounded-none bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-colors';

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <form onSubmit={handleSubmit} className='w-full mx-auto'>
        <div className='bg-white border border-stone-200'>
          <FormHeader
            title='Personal Training Session'
            subtitle='Transform your fitness journey with a certified personal trainer'
            icon={Dumbbell}
            isPremium={isPremium}
            onCancel={handleClose}
            showCloseButton
            gradientFrom='stone-800'
            gradientVia='stone-800'
            gradientTo='stone-900'
          />

          <div className='p-6 sm:p-8 lg:p-10 space-y-10'>
            {/* ─ Schedule ─ */}
            <div className='space-y-6'>
              <SectionHeading>Training Schedule</SectionHeading>

              {/* Date */}
              <div ref={(el) => el && fieldRefs.current.set('date', el)}>
                <FieldLabel icon={Calendar} required>
                  {t('services.personalTrainer.date', {
                    fallback: 'Select Date',
                  })}
                </FieldLabel>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleChange}
                  onClick={(e) => e.currentTarget.showPicker()}
                  min={new Date().toISOString().split('T')[0]}
                  className={`${inputBase} ${errors.date ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.date} />
              </div>

              {/* Time Slot */}
              <div ref={(el) => el && fieldRefs.current.set('timeSlot', el)}>
                <FieldLabel icon={Clock} required>
                  Time Slot
                </FieldLabel>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {TIME_SLOTS.map(({ id, label, time, icon: Icon }) => {
                    const selected = formData.timeSlot === id;
                    return (
                      <button
                        key={id}
                        type='button'
                        onClick={() => updateField('timeSlot', id)}
                        className={`flex items-center gap-3 border p-4 text-left transition-colors ${
                          selected
                            ? 'border-stone-900 bg-stone-50'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selected
                              ? 'border-stone-900 bg-stone-900'
                              : 'border-stone-300'
                          }`}
                        >
                          {selected && (
                            <CheckCircle className='w-2.5 h-2.5 text-white' />
                          )}
                        </div>
                        <Icon
                          className={`w-4 h-4 ${selected ? 'text-stone-900' : 'text-stone-400'}`}
                        />
                        <div>
                          <span className='text-sm font-medium text-stone-800'>
                            {label}
                          </span>
                          <p className='text-xs text-stone-400'>{time}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <FieldError message={errors.timeSlot} />
              </div>
            </div>

            {/* ─ Location ─ */}
            <div className='space-y-6'>
              <SectionHeading>Location</SectionHeading>
              <div ref={(el) => el && fieldRefs.current.set('location', el)}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {LOCATION_OPTIONS.map((loc) => {
                    const selected = formData.location === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type='button'
                        onClick={() => updateField('location', loc.id)}
                        className={`flex items-center border p-3 text-left transition-colors text-sm ${
                          selected
                            ? 'border-stone-900 bg-stone-50'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                            selected
                              ? 'border-stone-900 bg-stone-900'
                              : 'border-stone-300'
                          }`}
                        >
                          {selected && (
                            <CheckCircle className='w-2.5 h-2.5 text-white' />
                          )}
                        </div>
                        <span className='text-stone-800 font-medium text-xs'>
                          {loc.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <FieldError message={errors.location} />
              </div>
            </div>

            {/* ─ Workout Type ─ */}
            <div className='space-y-6'>
              <SectionHeading>Workout Type</SectionHeading>
              <div ref={(el) => el && fieldRefs.current.set('workoutType', el)}>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
                  {WORKOUT_TYPES.map(
                    ({ id, label, icon: Icon, multiplier }) => {
                      const selected = formData.workoutType === id;
                      const surcharge =
                        multiplier > 1
                          ? `+${Math.round((multiplier - 1) * 100)}%`
                          : null;
                      return (
                        <button
                          key={id}
                          type='button'
                          onClick={() => updateField('workoutType', id)}
                          className={`relative flex flex-col items-center gap-2 border p-4 transition-colors ${
                            selected
                              ? 'border-stone-900 bg-stone-50'
                              : 'border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${selected ? 'text-stone-900' : 'text-stone-400'}`}
                          />
                          <span className='text-xs font-medium text-stone-800'>
                            {label}
                          </span>
                          {surcharge && (
                            <span className='text-[10px] text-amber-600 font-medium'>
                              {surcharge}
                            </span>
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
                <FieldError message={errors.workoutType} />
              </div>
            </div>

            {/* ─ Fitness Level ─ */}
            <div className='space-y-6'>
              <SectionHeading>Fitness Level</SectionHeading>
              <div
                ref={(el) => el && fieldRefs.current.set('fitnessLevel', el)}
              >
                <div className='grid grid-cols-3 gap-3'>
                  {FITNESS_LEVELS.map(({ id, label }) => {
                    const selected = formData.fitnessLevel === id;
                    return (
                      <button
                        key={id}
                        type='button'
                        onClick={() => updateField('fitnessLevel', id)}
                        className={`border p-3 text-sm font-medium transition-colors ${
                          selected
                            ? 'border-stone-900 bg-stone-50 text-stone-900'
                            : 'border-stone-200 hover:border-stone-400 text-stone-500'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <FieldError message={errors.fitnessLevel} />
              </div>
            </div>

            {/* ─ Participants ─ */}
            <div className='space-y-6'>
              <SectionHeading>Participants</SectionHeading>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Count */}
                <div
                  ref={(el) =>
                    el && fieldRefs.current.set('participantCount', el)
                  }
                >
                  <FieldLabel icon={Users}>Number of Participants</FieldLabel>
                  <div className='flex border border-stone-300 overflow-hidden max-w-xs bg-white'>
                    <button
                      type='button'
                      onClick={() => updateParticipantCount(false)}
                      className='px-4 py-2 bg-stone-100 hover:bg-stone-200 transition text-stone-700'
                    >
                      −
                    </button>
                    <div className='flex-1 py-2 text-center text-sm font-medium text-stone-900'>
                      {formData.participantCount}
                    </div>
                    <button
                      type='button'
                      onClick={() => updateParticipantCount(true)}
                      className='px-4 py-2 bg-stone-100 hover:bg-stone-200 transition text-stone-700'
                    >
                      +
                    </button>
                  </div>

                  {formData.participantCount > 1 && (
                    <p className='text-xs text-stone-400 mt-2'>
                      15% group discount applied per person (max 6)
                    </p>
                  )}
                  {formData.participantCount >= 6 && (
                    <p className='text-xs text-amber-600 mt-1'>
                      Maximum group size reached
                    </p>
                  )}
                </div>

                {/* Minors */}
                <div
                  ref={(el) => el && fieldRefs.current.set('minorsCount', el)}
                >
                  <FieldLabel icon={Baby}>Participants under 18</FieldLabel>
                  <input
                    type='number'
                    name='minorsCount'
                    min='0'
                    max={formData.participantCount}
                    value={formData.minorsCount}
                    onChange={handleChange}
                    className={`${inputBase} max-w-xs ${
                      errors.minorsCount ? 'border-red-400' : 'border-stone-300'
                    }`}
                    placeholder='0'
                  />
                  <FieldError message={errors.minorsCount} />

                  {formData.minorsCount > 0 && (
                    <p className='flex items-center gap-2 text-xs text-stone-400 bg-stone-50 border border-stone-200 p-3 mt-3'>
                      <Info className='w-3.5 h-3.5 flex-shrink-0' />
                      {formData.minorsCount} participant(s) under 18 — adult
                      supervision required.
                    </p>
                  )}
                </div>
              </div>

              {/* Special Needs */}
              <div>
                <button
                  type='button'
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
                  className={`w-full flex items-center justify-between border p-4 text-left transition-colors ${
                    formData.hasSpecialNeeds
                      ? 'border-stone-900 bg-stone-50'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        formData.hasSpecialNeeds
                          ? 'border-stone-900 bg-stone-900'
                          : 'border-stone-300'
                      }`}
                    >
                      {formData.hasSpecialNeeds && (
                        <CheckCircle className='w-2.5 h-2.5 text-white' />
                      )}
                    </div>
                    <span className='text-sm font-medium text-stone-800'>
                      Physical limitations or injuries
                    </span>
                  </div>
                  <AlertCircle className='w-4 h-4 text-stone-400' />
                </button>

                <AnimatePresence>
                  {formData.hasSpecialNeeds && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className='mt-4 p-5 border border-stone-200 space-y-4'
                    >
                      <div>
                        <FieldLabel icon={AlertCircle} required>
                          Describe injuries, limitations, or conditions
                        </FieldLabel>
                        <textarea
                          name='specialNeedsDetails'
                          value={formData.specialNeedsDetails}
                          onChange={handleChange}
                          placeholder='Describe any injuries, surgeries, or conditions that would affect your training...'
                          className={`${inputBase} resize-none h-24 ${
                            errors.specialNeedsDetails
                              ? 'border-red-400'
                              : 'border-stone-300'
                          }`}
                        />
                        <FieldError message={errors.specialNeedsDetails} />
                      </div>

                      <div className='p-3 bg-stone-50 border border-stone-200'>
                        <div className='flex items-start'>
                          <input
                            id='confirmSpecialNeeds'
                            name='confirmSpecialNeeds'
                            type='checkbox'
                            checked={formData.confirmSpecialNeeds}
                            onChange={handleChange}
                            className='h-4 w-4 text-stone-900 border-stone-300 rounded mt-0.5'
                          />
                          <label
                            htmlFor='confirmSpecialNeeds'
                            className='ml-3 text-xs text-stone-600'
                          >
                            I confirm this information is accurate and
                            understand that specialized training may be required
                          </label>
                        </div>
                        <FieldError message={errors.confirmSpecialNeeds} />
                      </div>

                      <p className='flex items-center gap-2 text-xs text-stone-400'>
                        <Info className='w-3.5 h-3.5 flex-shrink-0' />
                        Additional $20 fee for specialized training programs.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ─ Additional Notes ─ */}
            <div className='space-y-4'>
              <SectionHeading>Additional Information</SectionHeading>
              <textarea
                name='additionalNotes'
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder='Fitness goals, preferred exercises, equipment availability, specific areas to focus on...'
                className={`${inputBase} border-stone-300 resize-none h-24`}
              />
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className='flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-sm text-red-800'>
                <AlertCircle className='w-4 h-4 flex-shrink-0' />
                {errors.submit}
              </div>
            )}
          </div>

          {/* ─ Footer ─ */}
          <div className='bg-stone-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6'>
            <div className='text-center sm:text-left'>
              <span className='text-stone-500 text-xs uppercase tracking-wider'>
                Total Price
              </span>
              <div className='flex items-center gap-3 mt-1'>
                <span className='text-3xl font-light'>
                  ${totalPrice.toFixed(2)}
                </span>
                {formData.participantCount > 1 && (
                  <span className='text-xs bg-stone-800 px-2 py-1'>
                    {formData.participantCount} people
                  </span>
                )}
              </div>

              {/* ✅ Price breakdown with tax */}
              <div className='text-[11px] text-stone-500 mt-2 space-y-0.5'>
                {formData.workoutType && formData.timeSlot && (
                  <div className='text-stone-400'>
                    {formData.timeSlot.charAt(0).toUpperCase() +
                      formData.timeSlot.slice(1)}{' '}
                    {formData.workoutType.toUpperCase()} Training
                    {formData.location &&
                      ` at ${
                        LOCATION_OPTIONS.find((l) => l.id === formData.location)
                          ?.name ?? 'Selected Location'
                      }`}
                  </div>
                )}

                <div>
                  Base: ${BASE_PRICE}
                  {workoutMultiplier > 1 &&
                    ` × ${workoutMultiplier} (+${Math.round((workoutMultiplier - 1) * 100)}%)`}
                  {formData.participantCount > 1 &&
                    ` × ${formData.participantCount} (15% off ea.)`}
                </div>

                {formData.hasSpecialNeeds && (
                  <div>Specialized program: +$20</div>
                )}

                <div className='border-t border-stone-700 pt-1 mt-1'>
                  <div>Subtotal: ${priceWithTax.subtotal.toFixed(2)}</div>
                  <div className='text-amber-400'>
                    {t('common.fee.creditcard', { fallback: 'Processing fee' })}{' '}
                    ({TAX_RATE}%): ${priceWithTax.tax.toFixed(2)}
                  </div>
                </div>

                {formData.minorsCount > 0 && (
                  <div className='text-amber-400'>
                    {formData.minorsCount} participant(s) under 18
                  </div>
                )}
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                type='button'
                onClick={onCancel}
                disabled={isSubmitting}
                className='px-6 py-3 border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 text-sm transition-colors disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='px-8 py-3 bg-white text-stone-900 hover:bg-stone-100 text-sm font-medium tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50'
              >
                <CreditCard className='w-4 h-4' />
                {isSubmitting ? 'Booking...' : 'Book Training'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default PersonalTrainerForm;
