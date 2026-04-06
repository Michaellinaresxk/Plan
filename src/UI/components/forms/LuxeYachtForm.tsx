import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Calendar,
  Crown,
  Users,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  Info,
  Baby,
  MapPin,
  Waves,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import {
  LOCATION_OPTIONS,
  LuxeYachtFormProps,
  YachtFormData,
} from '@/types/yachts';
import { ACTIVITY_OPTIONS, TIME_SLOTS } from '@/constants/yacht/yachts';

// ─── Subcomponents ────────────────────────────────────────────────────────────

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h3 className='text-sm font-semibold text-stone-900 uppercase tracking-[0.15em] border-b border-stone-200 pb-3'>
    {children}
  </h3>
);

const FieldLabel: React.FC<{
  icon?: React.ElementType;
  children: React.ReactNode;
  required?: boolean;
}> = ({ icon: Icon, children, required }) => (
  <label className='flex items-center text-xs font-medium text-stone-700 mb-2'>
    {Icon && <Icon className='w-3.5 h-3.5 mr-1.5 text-stone-400' />}
    {children}
    {required && <span className='text-amber-600 ml-1'>*</span>}
  </label>
);

const FieldError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <p className='flex items-center gap-1 text-red-600 text-xs mt-1'>
      <AlertCircle className='w-3 h-3' />
      {message}
    </p>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const LuxeYachtForm: React.FC<LuxeYachtFormProps> = ({
  yacht: providedYacht,
  service,
  onSubmit,
  onCancel,
  isOpen,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  const defaultYacht = {
    id: 'azimut-s7',
    name: 'Azimut S7',
    price: 3500,
    isPremium: false,
    mainImage:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=800&fit=crop',
    specifications: {
      maxGuests: 12,
      length: '68 ft',
      cabins: 3,
      bathrooms: 2,
      crew: 3,
      maxSpeed: '32 knots',
      manufacturer: 'Azimut',
      year: 2023,
    },
    location: 'Punta Cana Marina',
  };

  const yacht = providedYacht || defaultYacht;

  const [formData, setFormData] = useState<YachtFormData>({
    date: '',
    startTime: '',
    guests: 2,
    minorsCount: 0,
    name: '',
    email: '',
    phone: '',
    message: '',
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    confirmSpecialNeeds: false,
    experienceLevel: 'beginner',
    activityPreferences: [],
    location: '',
  });

  const [errors, setErrors] = useState<Partial<YachtFormData>>({});
  const [currentPrice, setCurrentPrice] = useState(yacht?.price || 3500);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputBase =
    'w-full p-3 border rounded-none bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-colors';

  useEffect(() => {
    if (!yacht?.price) return;
    const base = yacht.price;
    const adjusted = formData.guests > 4 ? base * 1.1 : base;
    setCurrentPrice(adjusted + (formData.hasSpecialNeeds ? 50 : 0));
  }, [formData.guests, formData.hasSpecialNeeds, yacht?.price]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value, type } = e.target;
      const checked =
        'checked' in e.target ? (e.target as HTMLInputElement).checked : false;
      setFormData((prev) => {
        const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
        if (name === 'hasSpecialNeeds' && !checked) {
          next.specialNeedsDetails = '';
          next.confirmSpecialNeeds = false;
        }
        return next;
      });
      if (errors[name as keyof YachtFormData])
        setErrors((p) => {
          const n = { ...p };
          delete n[name as keyof YachtFormData];
          return n;
        });
    },
    [errors],
  );

  const handleLocationSelect = useCallback(
    (id: string) => {
      setFormData((p) => ({ ...p, location: id }));
      if (errors.location)
        setErrors((p) => {
          const n = { ...p };
          delete n.location;
          return n;
        });
    },
    [errors],
  );

  const toggleActivity = useCallback((id: string) => {
    setFormData((p) => ({
      ...p,
      activityPreferences: p.activityPreferences.includes(id)
        ? p.activityPreferences.filter((a) => a !== id)
        : [...p.activityPreferences, id],
    }));
  }, []);

  const updateGuests = useCallback(
    (inc: boolean) => {
      setFormData((p) => {
        const max = yacht?.specifications?.maxGuests || 12;
        const next = inc
          ? Math.min(p.guests + 1, max)
          : Math.max(1, p.guests - 1);
        return {
          ...p,
          guests: next,
          minorsCount: Math.min(p.minorsCount, next),
        };
      });
    },
    [yacht],
  );

  const validate = useCallback((): boolean => {
    const errs: Partial<YachtFormData> = {};
    if (!formData.name.trim()) errs.name = 'Required';
    if (!formData.email.trim()) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email';
    if (!formData.phone.trim()) errs.phone = 'Required';
    if (!formData.date) errs.date = 'Required';
    if (!formData.startTime) errs.startTime = 'Required';
    if (!formData.location) errs.location = 'Required';
    if (formData.minorsCount > formData.guests)
      errs.minorsCount = 'Cannot exceed total guests';
    if (formData.hasSpecialNeeds) {
      if (!formData.specialNeedsDetails.trim())
        errs.specialNeedsDetails = 'Required';
      if (!formData.confirmSpecialNeeds)
        errs.confirmSpecialNeeds = 'Please confirm';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      setIsSubmitting(true);

      try {
        const selectedDate = new Date(formData.date);
        const start = new Date(selectedDate);
        const [h, m] = formData.startTime.split(':').map(Number);
        start.setHours(h, m || 0, 0, 0);
        const end = new Date(selectedDate);
        end.setHours(17, 30, 0, 0);

        const locationName =
          LOCATION_OPTIONS.find((l) => l.id === formData.location)?.name ||
          formData.location;
        const activities = ACTIVITY_OPTIONS.filter((a) =>
          formData.activityPreferences.includes(a.id),
        ).map((a) => a.name);

        const reservationData = {
          service: service || {
            id: yacht?.id || defaultYacht.id,
            name: yacht?.name || defaultYacht.name,
            price: yacht?.price || defaultYacht.price,
            packageType: yacht?.isPremium ? 'premium' : 'standard',
          },
          formData: {
            ...formData,
            serviceType: 'yacht',
            totalPrice: currentPrice,
            locationName,
          },
          totalPrice: currentPrice,
          bookingDate: start,
          endDate: end,
          participants: {
            adults: formData.guests - formData.minorsCount,
            children: formData.minorsCount,
            total: formData.guests,
          },
          clientInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          yachtSpecifics: {
            yachtId: yacht?.id || defaultYacht.id,
            yachtName: yacht?.name || defaultYacht.name,
            startTime: formData.startTime,
            location: formData.location,
            locationName,
            hasSpecialNeeds: formData.hasSpecialNeeds,
            specialNeedsDetails: formData.specialNeedsDetails,
            guests: formData.guests,
            minorsCount: formData.minorsCount,
            activityPreferences: formData.activityPreferences,
            selectedActivities: activities,
            additionalNotes: formData.message,
          },
        };

        fetch('/api/services/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceName: yacht?.name || defaultYacht.name,
            serviceType: 'luxury-yacht',
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            tourDate: formData.date,
            timeSlot: formData.startTime,
            totalGuests: formData.guests,
            totalPrice: currentPrice,
            message: formData.message,
          }),
        }).catch(() => {});

        setReservationData(reservationData);
        if (onSubmit) await onSubmit(reservationData);
        router.push('/reservation-confirmation');
      } catch {
        setErrors({
          submit: 'Unable to send inquiry. Please try again.',
        } as any);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validate,
      formData,
      currentPrice,
      yacht,
      service,
      setReservationData,
      onSubmit,
      router,
    ],
  );

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4'
    >
      <div className='bg-white border border-stone-200 max-w-3xl w-full max-h-[95vh] overflow-hidden'>
        {/* Header */}
        <div className='relative h-32 overflow-hidden'>
          <Image
            src={yacht?.mainImage || defaultYacht.mainImage}
            alt={yacht?.name || defaultYacht.name}
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
          <button
            onClick={onCancel}
            className='absolute top-3 right-3 w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors'
          >
            <X className='w-3.5 h-3.5' />
          </button>
          <div className='absolute bottom-0 left-0 right-0 p-5 text-white flex items-end justify-between'>
            <div>
              <h2 className='text-lg font-light tracking-wide'>
                {yacht?.name || defaultYacht.name}
              </h2>
              <p className='text-white/60 text-xs mt-0.5'>
                Private Caribbean Experience — 9:00 AM to 5:30 PM
              </p>
            </div>
            <div className='text-right'>
              <span className='text-2xl font-light'>
                ${currentPrice.toLocaleString()}
              </span>
              <span className='text-white/50 text-[11px] block'>per day</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className='max-h-[55vh] overflow-y-auto'>
          <form onSubmit={handleSubmit} className='p-6 sm:p-8 space-y-8'>
            <div className='space-y-5'>
              <SectionHeading>Contact</SectionHeading>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div>
                  <FieldLabel required>Full Name</FieldLabel>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Your name'
                    className={`${inputBase} ${errors.name ? 'border-red-400' : 'border-stone-300'}`}
                  />
                  <FieldError message={errors.name as string} />
                </div>
                <div>
                  <FieldLabel icon={Mail} required>
                    Email
                  </FieldLabel>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='you@email.com'
                    className={`${inputBase} ${errors.email ? 'border-red-400' : 'border-stone-300'}`}
                  />
                  <FieldError message={errors.email as string} />
                </div>
                <div>
                  <FieldLabel icon={Phone} required>
                    Phone
                  </FieldLabel>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder='+1 (555) 000-0000'
                    className={`${inputBase} ${errors.phone ? 'border-red-400' : 'border-stone-300'}`}
                  />
                  <FieldError message={errors.phone as string} />
                </div>
              </div>
            </div>

            <div className='space-y-5'>
              <SectionHeading>Schedule</SectionHeading>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <FieldLabel icon={Calendar} required>
                    Date
                  </FieldLabel>
                  <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleChange}
                    min={tomorrowISO}
                    className={`${inputBase} ${errors.date ? 'border-red-400' : 'border-stone-300'}`}
                  />
                  <FieldError message={errors.date as string} />
                </div>
                <div>
                  <FieldLabel icon={Clock} required>
                    Departure
                  </FieldLabel>
                  <select
                    name='startTime'
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`${inputBase} ${errors.startTime ? 'border-red-400' : 'border-stone-300'}`}
                  >
                    <option value=''>Select time</option>
                    {TIME_SLOTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <p className='text-[10px] text-stone-400 mt-1'>
                    Returns at 5:30 PM
                  </p>
                  <FieldError message={errors.startTime as string} />
                </div>
              </div>
            </div>

            <div className='space-y-5'>
              <SectionHeading>Location</SectionHeading>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {LOCATION_OPTIONS.map((loc) => {
                  const sel = formData.location === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type='button'
                      onClick={() => handleLocationSelect(loc.id)}
                      className={`flex items-center border p-3 text-left transition-colors ${sel ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${sel ? 'border-stone-900 bg-stone-900' : 'border-stone-300'}`}
                      >
                        {sel && <Check className='w-2.5 h-2.5 text-white' />}
                      </div>
                      <span className='text-xs font-medium text-stone-800'>
                        {loc.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FieldError message={errors.location as string} />
            </div>

            <div className='space-y-5'>
              <SectionHeading>Guests</SectionHeading>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <FieldLabel icon={Users}>
                    Total (Max: {yacht?.specifications?.maxGuests || 12})
                  </FieldLabel>
                  <div className='flex border border-stone-300 overflow-hidden bg-white'>
                    <button
                      type='button'
                      onClick={() => updateGuests(false)}
                      className='px-4 py-2 bg-stone-50 hover:bg-stone-100 text-sm'
                    >
                      −
                    </button>
                    <div className='flex-1 py-2 text-center text-sm font-medium'>
                      {formData.guests}
                    </div>
                    <button
                      type='button'
                      onClick={() => updateGuests(true)}
                      className='px-4 py-2 bg-stone-50 hover:bg-stone-100 text-sm'
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <FieldLabel icon={Baby}>Under 18</FieldLabel>
                  <input
                    type='number'
                    name='minorsCount'
                    min='0'
                    max={formData.guests}
                    value={formData.minorsCount}
                    onChange={handleChange}
                    className={`${inputBase} border-stone-300`}
                  />
                  <FieldError message={errors.minorsCount as string} />
                </div>
              </div>
            </div>

            <div className='space-y-5'>
              <SectionHeading>Activities (Optional)</SectionHeading>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                {ACTIVITY_OPTIONS.map((a) => {
                  const sel = formData.activityPreferences.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type='button'
                      onClick={() => toggleActivity(a.id)}
                      className={`flex items-center gap-2 border p-3 text-left transition-colors text-xs ${sel ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}
                    >
                      <div
                        className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 ${sel ? 'border-stone-900 bg-stone-900' : 'border-stone-300'}`}
                      >
                        {sel && <Check className='w-2 h-2 text-white' />}
                      </div>
                      {a.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className='space-y-5'>
              <SectionHeading>Special Requirements</SectionHeading>
              <button
                type='button'
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    hasSpecialNeeds: !p.hasSpecialNeeds,
                    specialNeedsDetails: p.hasSpecialNeeds
                      ? ''
                      : p.specialNeedsDetails,
                    confirmSpecialNeeds: p.hasSpecialNeeds
                      ? false
                      : p.confirmSpecialNeeds,
                  }))
                }
                className={`flex items-center justify-between w-full border p-4 text-left transition-colors ${formData.hasSpecialNeeds ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.hasSpecialNeeds ? 'border-stone-900 bg-stone-900' : 'border-stone-300'}`}
                  >
                    {formData.hasSpecialNeeds && (
                      <CheckCircle className='w-2.5 h-2.5 text-white' />
                    )}
                  </div>
                  <span className='text-xs font-medium text-stone-800'>
                    Disability or mobility requirements
                  </span>
                </div>
              </button>

              {formData.hasSpecialNeeds && (
                <div className='space-y-3 ml-4 pl-4 border-l-2 border-stone-200'>
                  <textarea
                    name='specialNeedsDetails'
                    value={formData.specialNeedsDetails}
                    onChange={handleChange}
                    placeholder='Describe requirements...'
                    className={`${inputBase} border-stone-300 resize-none h-20`}
                  />
                  <FieldError message={errors.specialNeedsDetails as string} />
                  <label className='flex items-start gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      name='confirmSpecialNeeds'
                      checked={formData.confirmSpecialNeeds}
                      onChange={handleChange}
                      className='h-4 w-4 text-stone-900 focus:ring-stone-900 border-stone-300 rounded mt-0.5'
                    />
                    <span className='text-xs text-stone-600'>
                      I confirm someone in my group requires these
                      accommodations
                    </span>
                  </label>
                  <FieldError message={errors.confirmSpecialNeeds as string} />
                  <p className='text-[10px] text-stone-400'>
                    Additional fee may apply. Our team will discuss
                    arrangements.
                  </p>
                </div>
              )}
            </div>

            <div className='space-y-4'>
              <SectionHeading>Notes</SectionHeading>
              <textarea
                name='message'
                value={formData.message}
                onChange={handleChange}
                rows={2}
                placeholder='Celebrations, dietary requirements, special requests...'
                className={`${inputBase} border-stone-300 resize-none`}
              />
            </div>

            {(errors as any).submit && (
              <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-xs text-red-800'>
                <AlertCircle className='w-3.5 h-3.5 flex-shrink-0' />
                {(errors as any).submit}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className='bg-stone-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='text-center sm:text-left'>
            <span className='text-stone-500 text-xs uppercase tracking-wider'>
              Estimated
            </span>
            <div className='text-2xl font-light mt-0.5'>
              ${currentPrice.toLocaleString()}
            </div>
            <div className='text-[10px] text-stone-500 mt-1 space-y-0.5'>
              <div>{yacht?.name || defaultYacht.name}</div>
              {formData.guests > 4 && (
                <div className='text-amber-400'>Large group fee (+10%)</div>
              )}
              {formData.hasSpecialNeeds && <div>Accommodation fee: +$50</div>}
            </div>
          </div>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={onCancel}
              disabled={isSubmitting}
              className='px-5 py-3 border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 text-xs transition-colors disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              onClick={handleSubmit}
              className='px-7 py-3 bg-white text-stone-900 hover:bg-amber-50 text-xs font-medium tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50'
            >
              <CreditCard className='w-3.5 h-3.5' />
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LuxeYachtForm;
