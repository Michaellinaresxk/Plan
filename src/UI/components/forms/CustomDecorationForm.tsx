import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import {
  Upload,
  Calendar,
  MessageSquare,
  Clock,
  AlertCircle,
  Palette,
  Camera,
  MapPin,
  Heart,
  Gift,
  Cake,
  Star,
  CreditCard,
  CheckCircle,
  Phone,
  Mail,
  User,
  ArrowRight,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ColorPicker from '../shared/ColorPicker';
import { LOCATION_OPTIONS } from '@/constants/location/location';
import { useFormModal } from '@/hooks/useFormModal';
import FormHeader from './FormHeader';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomDecorationFormProps {
  service: Service;
  onClose: () => void;
}

interface DecorationFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  occasion: string;
  customOccasion: string;
  colors: string[];
  notes: string;
  referenceImage: File | null;
}

interface FormErrors {
  [key: string]: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_ADVANCE_HOURS = 72;

const OCCASIONS = [
  { id: 'birthday', label: 'Birthday Party', icon: Cake },
  { id: 'anniversary', label: 'Anniversary', icon: Heart },
  { id: 'proposal', label: 'Marriage Proposal', icon: Star },
  { id: 'romantic', label: 'Romantic Dinner', icon: Heart },
  { id: 'baby-shower', label: 'Baby Shower', icon: Gift },
  { id: 'other', label: 'Other', icon: Star },
] as const;

const OCCASION_MULTIPLIERS: Record<string, number> = {
  birthday: 1.0,
  anniversary: 1.2,
  proposal: 1.5,
  romantic: 1.3,
  'baby-shower': 1.1,
  other: 1.0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMinDateISO(): string {
  const d = new Date();
  d.setHours(d.getHours() + MIN_ADVANCE_HOURS);
  return d.toISOString().split('T')[0];
}

function isDateTooSoon(dateStr: string): boolean {
  if (!dateStr) return false;
  const min = new Date();
  min.setHours(min.getHours() + MIN_ADVANCE_HOURS);
  return new Date(dateStr) < min;
}

function getLocationName(id: string): string {
  return LOCATION_OPTIONS.find((l) => l.id === id)?.name ?? id;
}

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
    {required && <span className='text-amber-600 ml-1'>*</span>}
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

const CustomDecorationForm: React.FC<CustomDecorationFormProps> = ({
  service,
  onClose,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel: onClose });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<DecorationFormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '12:00',
    location: '',
    occasion: '',
    customOccasion: '',
    colors: ['#FFCD61', '#ffffff'],
    notes: '',
    referenceImage: null,
  });

  const inputBase =
    'w-full p-3 border rounded-none bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-colors';

  // ── Derived ─────────────────────────────────────────────────────────

  const estimatedPrice = useMemo(() => {
    const base = service.price || 200;
    const mult = OCCASION_MULTIPLIERS[form.occasion] || 1.0;
    return Math.round(base * mult);
  }, [service.price, form.occasion]);

  const dateWarning = useMemo(() => {
    if (form.date && isDateTooSoon(form.date)) {
      return 'Decorations require 72 hours advance notice';
    }
    return '';
  }, [form.date]);

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
    <K extends keyof DecorationFormData>(
      field: K,
      value: DecorationFormData[K],
    ) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      clearError(field);
    },
    [clearError],
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      updateField(name as keyof DecorationFormData, value);
    },
    [updateField],
  );

  // ── Colors ──────────────────────────────────────────────────────────

  const addColor = useCallback(() => {
    setForm((prev) => {
      if (prev.colors.length >= 5) return prev;
      return { ...prev, colors: [...prev.colors, '#FFFFFF'] };
    });
  }, []);

  const removeColor = useCallback((index: number) => {
    setForm((prev) => {
      if (prev.colors.length <= 1) return prev;
      return { ...prev, colors: prev.colors.filter((_, i) => i !== index) };
    });
  }, []);

  const updateColor = useCallback((index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c, i) => (i === index ? value : c)),
    }));
  }, []);

  // ── Image ───────────────────────────────────────────────────────────

  const handleImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      updateField('referenceImage', file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    [updateField],
  );

  const clearImage = useCallback(() => {
    updateField('referenceImage', null);
    setImagePreview(null);
  }, [updateField]);

  // ── Validation ──────────────────────────────────────────────────────

  const validate = useCallback((): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Required';
    if (!form.date) errs.date = 'Required';
    else if (isDateTooSoon(form.date)) errs.date = '72 hours advance required';
    if (!form.time) errs.time = 'Required';
    if (!form.location) errs.location = 'Required';
    if (!form.occasion) errs.occasion = 'Required';
    if (form.occasion === 'other' && !form.customOccasion.trim()) {
      errs.customOccasion = 'Please specify';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  // ── Submit (inquiry pattern) ────────────────────────────────────────

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);

      try {
        const finalOccasion =
          form.occasion === 'other' ? form.customOccasion : form.occasion;
        const locationName = getLocationName(form.location);

        const bookingStart = new Date(`${form.date}T${form.time}`);
        const bookingEnd = new Date(bookingStart);
        bookingEnd.setHours(bookingStart.getHours() + 3);

        // ── Send inquiry email (same pattern as LuxeYachtForm) ──
        const emailData = {
          serviceName: 'Custom Decoration Service',
          serviceType: 'custom-decoration',
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          tourDate: form.date,
          timeSlot: form.time,
          totalGuests: 1,
          totalPrice: estimatedPrice,
          message: [
            `Occasion: ${finalOccasion}`,
            `Location: ${locationName}`,
            `Colors: ${form.colors.join(', ')}`,
            form.notes ? `Notes: ${form.notes}` : '',
            form.referenceImage
              ? `Reference image attached: ${form.referenceImage.name}`
              : '',
          ]
            .filter(Boolean)
            .join('\n'),
        };

        fetch('/api/services/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData),
        }).catch((err) => console.error('Inquiry email failed:', err));

        // ── Store reservation data ──
        const reservationData = {
          service,
          totalPrice: estimatedPrice,
          formData: {
            ...form,
            serviceType: 'custom-decoration',
            totalPrice: estimatedPrice,
            locationName,
            occasion: finalOccasion,
          },
          bookingDate: bookingStart,
          endDate: bookingEnd,
          clientInfo: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          decorationSpecifics: {
            occasion: finalOccasion,
            colors: form.colors,
            location: form.location,
            locationName,
            notes: form.notes,
            referenceImage: form.referenceImage?.name ?? null,
            setupTime: form.time,
            estimatedDuration: '3 hours',
          },
        };

        setReservationData(reservationData);
        router.push('/reservation-confirmation');
      } catch (error) {
        console.error('Form submission error:', error);
        setErrors({ submit: 'Unable to send inquiry. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, form, estimatedPrice, service, setReservationData, router],
  );

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto'>
      <div className='bg-white border border-stone-200'>
        <FormHeader
          title='Custom Decoration'
          subtitle="Tell us about your event — we'll design the perfect setting"
          icon={Palette}
          onCancel={handleClose}
          showCloseButton
          gradientFrom='stone-800'
          gradientVia='stone-800'
          gradientTo='stone-900'
        />

        <div className='p-6 sm:p-8 lg:p-10 space-y-10'>
          {/* ─ Contact Info ─ */}
          <div className='space-y-6'>
            <SectionHeading>Contact Information</SectionHeading>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
              <div>
                <FieldLabel icon={User} required>
                  Full Name
                </FieldLabel>
                <input
                  type='text'
                  name='name'
                  value={form.name}
                  onChange={handleInput}
                  placeholder='Your name'
                  className={`${inputBase} ${errors.name ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.name} />
              </div>
              <div>
                <FieldLabel icon={Mail} required>
                  Email
                </FieldLabel>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleInput}
                  placeholder='you@email.com'
                  className={`${inputBase} ${errors.email ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.email} />
              </div>
              <div>
                <FieldLabel icon={Phone} required>
                  Phone
                </FieldLabel>
                <input
                  type='tel'
                  name='phone'
                  value={form.phone}
                  onChange={handleInput}
                  placeholder='+1 (555) 000-0000'
                  className={`${inputBase} ${errors.phone ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.phone} />
              </div>
            </div>
          </div>

          {/* ─ Event Details ─ */}
          <div className='space-y-6'>
            <SectionHeading>Event Details</SectionHeading>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <FieldLabel icon={Calendar} required>
                  Date
                </FieldLabel>
                <input
                  type='date'
                  name='date'
                  value={form.date}
                  onChange={handleInput}
                  min={getMinDateISO()}
                  className={`${inputBase} ${errors.date ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.date} />
                {dateWarning && !errors.date && (
                  <p className='text-amber-600 text-xs mt-1'>{dateWarning}</p>
                )}
              </div>
              <div>
                <FieldLabel icon={Clock} required>
                  Delivery Time
                </FieldLabel>
                <input
                  type='time'
                  name='time'
                  value={form.time}
                  onChange={handleInput}
                  className={`${inputBase} ${errors.time ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.time} />
              </div>
            </div>

            {/* Location */}
            <div>
              <FieldLabel icon={MapPin} required>
                Location
              </FieldLabel>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {LOCATION_OPTIONS.map((loc) => {
                  const selected = form.location === loc.id;
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

            <p className='flex items-center gap-2 text-xs text-stone-400 bg-stone-50 border border-stone-200 p-3'>
              <AlertCircle className='w-3.5 h-3.5 flex-shrink-0' />
              Minimum 72 hours advance booking required for preparation
            </p>
          </div>

          {/* ─ Occasion ─ */}
          <div className='space-y-6'>
            <SectionHeading>Occasion</SectionHeading>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {OCCASIONS.map(({ id, label, icon: Icon }) => {
                const selected = form.occasion === id;
                return (
                  <button
                    key={id}
                    type='button'
                    onClick={() => updateField('occasion', id)}
                    className={`flex items-center gap-3 border p-4 text-left transition-colors ${
                      selected
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${selected ? 'text-stone-900' : 'text-stone-400'}`}
                    />
                    <span className='text-xs font-medium text-stone-800'>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
            <FieldError message={errors.occasion} />

            <AnimatePresence>
              {form.occasion === 'other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type='text'
                    name='customOccasion'
                    value={form.customOccasion}
                    onChange={handleInput}
                    placeholder='Describe your occasion'
                    className={`${inputBase} ${errors.customOccasion ? 'border-red-400' : 'border-stone-300'}`}
                  />
                  <FieldError message={errors.customOccasion} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─ Colors ─ */}
          <div className='space-y-4'>
            <SectionHeading>Color Palette</SectionHeading>
            <div className='flex flex-wrap gap-3 items-center'>
              {form.colors.map((color, i) => (
                <div key={i} className='relative group'>
                  <ColorPicker
                    color={color}
                    onChange={(c) => updateColor(i, c)}
                  />
                  {form.colors.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeColor(i)}
                      className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-stone-900 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {form.colors.length < 5 && (
                <button
                  type='button'
                  onClick={addColor}
                  className='w-10 h-10 border border-dashed border-stone-300 hover:border-stone-500 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors text-lg'
                >
                  +
                </button>
              )}
            </div>
            <p className='text-xs text-stone-400'>
              Choose 2–5 colors. Our decorators will create a harmonious scheme.
            </p>
          </div>

          {/* ─ Inspiration + Notes ─ */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <SectionHeading>Inspiration Photo</SectionHeading>
              <label
                className={`flex flex-col items-center justify-center h-36 border border-dashed cursor-pointer transition-colors ${
                  imagePreview
                    ? 'border-stone-400 bg-stone-50'
                    : 'border-stone-300 hover:border-stone-500'
                }`}
              >
                {imagePreview ? (
                  <div className='relative w-full h-full flex items-center justify-center p-3'>
                    <img
                      src={imagePreview}
                      alt='Preview'
                      className='max-h-full max-w-full object-contain'
                    />
                    <button
                      type='button'
                      onClick={(e) => {
                        e.preventDefault();
                        clearImage();
                      }}
                      className='absolute top-1 right-1 w-6 h-6 bg-stone-900 text-white flex items-center justify-center text-xs'
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className='w-6 h-6 text-stone-300 mb-2' />
                    <span className='text-xs text-stone-400'>
                      Upload a reference photo
                    </span>
                  </>
                )}
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImage}
                />
              </label>
            </div>

            <div className='space-y-4'>
              <SectionHeading>Additional Notes</SectionHeading>
              <textarea
                name='notes'
                value={form.notes}
                onChange={handleInput}
                rows={5}
                className={`${inputBase} border-stone-300 resize-none`}
                placeholder='Special requirements, themes, specific decorations...'
              />
            </div>
          </div>
        </div>

        {/* ─ Footer ─ */}
        <div className='bg-stone-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6'>
          <div className='text-center sm:text-left'>
            <span className='text-stone-500 text-xs uppercase tracking-wider'>
              Estimated
            </span>
            <div className='text-3xl font-light mt-1'>${estimatedPrice}</div>
            <p className='text-stone-500 text-[11px] mt-1'>
              Final price confirmed after consultation
            </p>
          </div>

          <div className='flex gap-3'>
            <button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className='px-6 py-3 border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 text-sm transition-colors disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-8 py-3 bg-white text-stone-900 hover:bg-amber-50 text-sm font-medium tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50'
            >
              <CreditCard className='w-4 h-4' />
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </div>

        {errors.submit && (
          <div className='flex items-center gap-2 p-4 bg-red-50 border-t border-red-200 text-sm text-red-800'>
            <AlertCircle className='w-4 h-4 flex-shrink-0' />
            {errors.submit}
          </div>
        )}
      </div>
    </form>
  );
};

export default CustomDecorationForm;
