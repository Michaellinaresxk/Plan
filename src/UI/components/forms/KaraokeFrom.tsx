import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  Mic,
  Calendar,
  Clock,
  MapPin,
  Youtube,
  CreditCard,
  AlertCircle,
  Check,
  X,
  Plus,
  Info,
  Volume2,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import {
  FormErrors,
  KaraokeFormProps,
  PRICING,
  SETUP_TYPES,
  FormData,
} from '@/constants/karaoke';
import { LOCATION_OPTIONS } from '@/constants/location/location';
import FormHeader from './FormHeader';
import { useFormModal } from '@/hooks/useFormModal';
import { calculatePriceWithTax } from '@/utils/priceCalculator';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EnhancedFormData extends Omit<FormData, 'location'> {
  location: string;
  endTime: string;
  confirmOutdoorPolicy: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EXTRA_HOUR_RATE = 50;
const INCLUDED_HOURS = 4;
const TAX_RATE = 5; // 5% processing fee

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getEventDuration(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  if (end <= start) return 0;
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

function isSameDay(dateString: string): boolean {
  if (!dateString) return false;
  return new Date().toDateString() === new Date(dateString).toDateString();
}

function hasMinimum24Hours(dateString: string): boolean {
  if (!dateString) return false;
  const diff = new Date(dateString).getTime() - Date.now();
  return diff / (1000 * 60 * 60) >= 24;
}

function getLocationName(locationId: string): string {
  return (
    LOCATION_OPTIONS.find((loc) => loc.id === locationId)?.name ?? locationId
  );
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
  return <p className='text-red-600 text-xs mt-1.5'>{message}</p>;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const KaraokeForm: React.FC<KaraokeFormProps> = ({ service, onCancel }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<EnhancedFormData>({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    hasProjectionSpace: false,
    needsScreen: false,
    setupType: '',
    musicReferences: [''],
    specialRequests: '',
    confirmOutdoorPolicy: false,
  });

  // ── Derived values ──────────────────────────────────────────────────────────

  const eventDuration = useMemo(
    () => getEventDuration(formData.startTime, formData.endTime),
    [formData.startTime, formData.endTime],
  );

  // ✅ Base price (subtotal before tax)
  const basePrice = useMemo(() => {
    let total = PRICING.BASE_PRICE;
    if (formData.needsScreen) total += PRICING.SCREEN_RENTAL;
    if (formData.setupType === 'outdoor') total += PRICING.OUTDOOR_SETUP;
    if (eventDuration > INCLUDED_HOURS) {
      total += (eventDuration - INCLUDED_HOURS) * EXTRA_HOUR_RATE;
    }
    return total;
  }, [formData.needsScreen, formData.setupType, eventDuration]);

  // ✅ Tax calculation — same pattern as YogaServiceForm / PersonalTrainerForm
  const priceWithTax = useMemo(
    () => calculatePriceWithTax(basePrice, TAX_RATE),
    [basePrice],
  );

  const totalPrice = priceWithTax.total;

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = useCallback((): boolean => {
    const errs: FormErrors = {};

    if (!formData.date) errs.date = 'Required';
    if (!formData.startTime) errs.startTime = 'Required';
    if (!formData.endTime) errs.endTime = 'Required';
    if (!formData.location) errs.location = 'Required';
    if (!formData.setupType) errs.setupType = 'Please select a setup type';

    if (formData.startTime && formData.endTime && eventDuration <= 0) {
      errs.endTime = 'End time must be after start time';
    }

    if (
      formData.date &&
      !isSameDay(formData.date) &&
      !hasMinimum24Hours(formData.date)
    ) {
      errs.date = 'Bookings require at least 24 hours advance notice';
    }

    if (formData.setupType === 'outdoor' && !formData.confirmOutdoorPolicy) {
      errs.confirmOutdoorPolicy = 'Please confirm the outdoor sound policy';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData, eventDuration]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const updateField = useCallback(
    <K extends keyof EnhancedFormData>(
      field: K,
      value: EnhancedFormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      clearError(field);
    },
    [clearError],
  );

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value, type } = e.target;
      const checked = 'checked' in e.target ? e.target.checked : false;
      updateField(
        name as keyof EnhancedFormData,
        type === 'checkbox' ? checked : value,
      );
    },
    [updateField],
  );

  const handleSetupType = useCallback(
    (type: 'indoor' | 'outdoor') => {
      setFormData((prev) => ({
        ...prev,
        setupType: type,
        confirmOutdoorPolicy:
          type === 'indoor' ? false : prev.confirmOutdoorPolicy,
      }));
      clearError('setupType');
    },
    [clearError],
  );

  const handleProjectionSpace = useCallback((hasSpace: boolean) => {
    setFormData((prev) => ({
      ...prev,
      hasProjectionSpace: hasSpace,
      needsScreen: !hasSpace,
    }));
  }, []);

  // Music references
  const addMusicRef = useCallback(() => {
    setFormData((prev) => {
      if (prev.musicReferences.length >= 10) return prev;
      return { ...prev, musicReferences: [...prev.musicReferences, ''] };
    });
  }, []);

  const removeMusicRef = useCallback((index: number) => {
    setFormData((prev) => {
      if (prev.musicReferences.length <= 1) return prev;
      return {
        ...prev,
        musicReferences: prev.musicReferences.filter((_, i) => i !== index),
      };
    });
  }, []);

  const updateMusicRef = useCallback((index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      musicReferences: prev.musicReferences.map((ref, i) =>
        i === index ? value : ref,
      ),
    }));
  }, []);

  // Submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);

      try {
        const locationName = getLocationName(formData.location);

        const reservationData = {
          service,
          totalPrice,
          formData: {
            ...formData,
            serviceType: 'karaoke' as const,
            totalPrice,
            basePrice,
            subtotal: priceWithTax.subtotal,
            tax: priceWithTax.tax,
            taxRate: TAX_RATE,
            calculatedPrice: totalPrice,
            locationName,
            eventDuration,
          },
          bookingDate: new Date(`${formData.date}T${formData.startTime}`),
          endDate: new Date(`${formData.date}T${formData.endTime}`),
          clientInfo: undefined,
          karaokeSpecifics: {
            setupType: formData.setupType,
            location: formData.location,
            locationName,
            hasProjectionSpace: formData.hasProjectionSpace,
            needsScreen: formData.needsScreen,
            musicReferences: formData.musicReferences.filter((r) => r.trim()),
            specialRequests: formData.specialRequests,
            eventDuration,
            isExtendedSession: eventDuration > INCLUDED_HOURS,
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
        router.push('/reservation-confirmation');
      } catch (error) {
        console.error('KaraokeForm submission error:', error);
        setErrors({
          submit: t('form.errors.submitError', {
            fallback: 'Unable to process your reservation. Please try again.',
          }),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validate,
      formData,
      service,
      totalPrice,
      basePrice,
      priceWithTax,
      eventDuration,
      setReservationData,
      router,
      t,
    ],
  );

  // ── Shared input classes ────────────────────────────────────────────────────

  const inputBase =
    'w-full p-3 border rounded-none bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-colors';

  const inputError = (field: string) =>
    errors[field] ? 'border-red-400' : 'border-stone-300';

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto'>
      <div className='bg-white border border-stone-200'>
        {/* Header */}
        <FormHeader
          title='Karaoke'
          subtitle='Private entertainment, professionally delivered'
          icon={Mic}
          onCancel={handleClose}
          showCloseButton
          gradientFrom='stone-800'
          gradientVia='stone-800'
          gradientTo='stone-900'
        />

        {/* Body */}
        <div className='p-6 sm:p-8 lg:p-10 space-y-10'>
          {/* ─ Event Details ─ */}
          <div className='space-y-6'>
            <SectionHeading>Event Details</SectionHeading>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <FieldLabel icon={Calendar} required>
                  Date
                </FieldLabel>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleInputChange}
                  min={todayISO}
                  className={`${inputBase} ${inputError('date')}`}
                />
                <FieldError message={errors.date} />
              </div>

              <div>
                <FieldLabel icon={Clock} required>
                  Start Time
                </FieldLabel>
                <input
                  type='time'
                  name='startTime'
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={`${inputBase} ${inputError('startTime')}`}
                />
                <FieldError message={errors.startTime} />
              </div>

              <div>
                <FieldLabel icon={Clock} required>
                  End Time
                </FieldLabel>
                <input
                  type='time'
                  name='endTime'
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={`${inputBase} ${inputError('endTime')}`}
                />
                <FieldError message={errors.endTime} />
              </div>
            </div>

            {/* Location */}
            <div>
              <FieldLabel icon={MapPin} required>
                Event Location
              </FieldLabel>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {LOCATION_OPTIONS.map((loc) => {
                  const isSelected = formData.location === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type='button'
                      onClick={() => updateField('location', loc.id)}
                      className={`flex items-center border p-4 text-left transition-colors ${
                        isSelected
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'border-stone-900 bg-stone-900'
                            : 'border-stone-300'
                        }`}
                      >
                        {isSelected && (
                          <Check className='w-2.5 h-2.5 text-white' />
                        )}
                      </div>
                      <span className='text-sm font-medium text-stone-800'>
                        {loc.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FieldError message={errors.location} />
            </div>

            {/* Date warnings */}
            {formData.date && isSameDay(formData.date) && (
              <div className='flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-sm text-amber-800'>
                <Info className='w-4 h-4 mt-0.5 flex-shrink-0' />
                <span>
                  <strong>Same-day booking</strong> — requires immediate
                  confirmation from our team.
                </span>
              </div>
            )}

            {formData.date &&
              !isSameDay(formData.date) &&
              !hasMinimum24Hours(formData.date) && (
                <div className='flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-sm text-red-800'>
                  <AlertCircle className='w-4 h-4 mt-0.5 flex-shrink-0' />
                  <span>Please book at least 24 hours in advance.</span>
                </div>
              )}
          </div>

          {/* ─ Setup Type ─ */}
          <div className='space-y-6'>
            <SectionHeading>Setup Environment</SectionHeading>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {SETUP_TYPES.map((setup) => {
                const Icon = setup.icon;
                const isSelected = formData.setupType === setup.id;

                return (
                  <button
                    key={setup.id}
                    type='button'
                    onClick={() =>
                      handleSetupType(setup.id as 'indoor' | 'outdoor')
                    }
                    className={`border p-6 text-left transition-colors ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex items-center gap-3'>
                        <Icon
                          className={`w-5 h-5 ${isSelected ? 'text-stone-900' : 'text-stone-400'}`}
                        />
                        <span className='font-medium text-stone-900 text-sm'>
                          {setup.name}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className='w-4 h-4 text-stone-900' />
                      )}
                    </div>

                    <p className='text-xs text-stone-500 mb-3'>
                      {setup.description}
                    </p>

                    <div className='space-y-1'>
                      {setup.benefits.map((benefit, i) => (
                        <div
                          key={i}
                          className='flex items-center gap-2 text-xs text-stone-400'
                        >
                          <div className='w-1 h-1 bg-stone-300 rounded-full' />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <FieldError message={errors.setupType} />

            {/* Outdoor policy */}
            {formData.setupType === 'outdoor' && (
              <div className='p-5 bg-amber-50/50 border border-amber-200'>
                <div className='flex items-start gap-3'>
                  <Volume2 className='w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5' />
                  <div className='flex-1 space-y-3'>
                    <h4 className='text-sm font-medium text-amber-900'>
                      Outdoor Sound Policy
                    </h4>
                    <p className='text-xs text-amber-700 leading-relaxed'>
                      Sound levels must comply with local ordinances. Events
                      typically conclude by 10:00 PM. Volume may be adjusted per
                      venue requirements. Additional permits may apply for
                      certain locations.
                    </p>

                    <label className='flex items-start gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        name='confirmOutdoorPolicy'
                        checked={formData.confirmOutdoorPolicy}
                        onChange={handleInputChange}
                        className='h-4 w-4 text-stone-900 focus:ring-stone-900 border-stone-300 rounded mt-0.5'
                      />
                      <span className='text-xs text-amber-800'>
                        I understand and agree to comply with the outdoor sound
                        policy
                      </span>
                    </label>
                    <FieldError message={errors.confirmOutdoorPolicy} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─ Music Preferences ─ */}
          <div className='space-y-6'>
            <SectionHeading>Music Preferences</SectionHeading>

            <div className='space-y-4'>
              <FieldLabel icon={Youtube}>Song Requests (Optional)</FieldLabel>
              <p className='text-xs text-stone-500'>
                Share YouTube or Spotify links, or simply the song name and
                artist.
              </p>

              {formData.musicReferences.map((ref, index) => (
                <div key={index} className='flex gap-2'>
                  <input
                    type='text'
                    value={ref}
                    onChange={(e) => updateMusicRef(index, e.target.value)}
                    placeholder={`Song request ${index + 1}`}
                    className={`${inputBase} border-stone-300`}
                  />
                  {formData.musicReferences.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeMusicRef(index)}
                      className='px-3 text-stone-400 hover:text-red-600 transition-colors'
                      aria-label='Remove song'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  )}
                </div>
              ))}

              {formData.musicReferences.length < 10 && (
                <button
                  type='button'
                  onClick={addMusicRef}
                  className='flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm transition-colors'
                >
                  <Plus className='w-4 h-4' />
                  Add another song
                </button>
              )}
            </div>
          </div>

          {/* ─ Special Requests ─ */}
          <div className='space-y-4'>
            <SectionHeading>Additional Notes</SectionHeading>
            <textarea
              name='specialRequests'
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows={3}
              className={`${inputBase} border-stone-300 resize-none`}
              placeholder='Setup requirements, themes, or any other details...'
            />
          </div>

          {/* ─ What's Included ─ */}
          <div className='bg-stone-50 border border-stone-200 p-5'>
            <div className='flex items-start gap-3'>
              <Mic className='w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0' />
              <div>
                <h4 className='text-sm font-medium text-stone-900 mb-3'>
                  Included
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-xs text-stone-600'>
                  <span>Professional karaoke system</span>
                  <span>Wireless microphones</span>
                  <span>High-quality speakers</span>
                  <span>Curated music library</span>
                  <span>Setup & technical support</span>
                  <span>Ambient lighting effects</span>
                  {formData.needsScreen && (
                    <span className='text-amber-700'>
                      Projection screen rental
                    </span>
                  )}
                  {eventDuration > INCLUDED_HOURS && (
                    <span className='text-amber-700'>
                      Extended session ({eventDuration.toFixed(1)} hours)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─ Footer ─ */}
        <div className='bg-stone-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6'>
          <div className='text-center sm:text-left'>
            <span className='text-stone-500 text-xs uppercase tracking-wider'>
              Total
            </span>
            <div className='text-3xl font-light mt-1'>
              ${totalPrice.toFixed(2)}
            </div>

            {/* ✅ Price breakdown with tax */}
            <div className='text-[11px] text-stone-500 mt-2 space-y-0.5'>
              <div>Base: ${PRICING.BASE_PRICE}</div>
              {formData.needsScreen && (
                <div>Screen: +${PRICING.SCREEN_RENTAL}</div>
              )}
              {formData.setupType === 'outdoor' && (
                <div>Outdoor: +${PRICING.OUTDOOR_SETUP}</div>
              )}
              {eventDuration > INCLUDED_HOURS && (
                <div>
                  Extended ({(eventDuration - INCLUDED_HOURS).toFixed(1)}h): +$
                  {((eventDuration - INCLUDED_HOURS) * EXTRA_HOUR_RATE).toFixed(
                    0,
                  )}
                </div>
              )}

              {/* ✅ Tax breakdown */}
              <div className='border-t border-stone-700 pt-1 mt-1'>
                <div>Subtotal: ${priceWithTax.subtotal.toFixed(2)}</div>
                <div className='text-amber-400'>
                  {t('common.fee.creditcard', { fallback: 'Processing fee' })} (
                  {TAX_RATE}%): ${priceWithTax.tax.toFixed(2)}
                </div>
              </div>

              {formData.location && (
                <div className='text-stone-400'>
                  {getLocationName(formData.location)}
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
              className='px-8 py-3 bg-white text-stone-900 hover:bg-amber-50 text-sm font-medium tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50'
            >
              <CreditCard className='w-4 h-4' />
              {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
            </button>
          </div>
        </div>

        {/* Submit error */}
        {errors.submit && (
          <div className='flex items-start gap-2 p-4 bg-red-50 border-t border-red-200 text-sm text-red-800'>
            <AlertCircle className='w-4 h-4 mt-0.5 flex-shrink-0' />
            <span>{errors.submit}</span>
          </div>
        )}
      </div>
    </form>
  );
};

export default KaraokeForm;
