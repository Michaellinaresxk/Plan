import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Clock,
  Info,
  MapPin,
  Minus,
  Plus,
  Timer,
  Users,
  X,
  CheckCircle,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { calculatePriceWithTax } from '@/utils/priceCalculator';

// ─── Constants ────────────────────────────────────────────────────────────────

const LOCATION_OPTIONS = [
  { id: 'punta-cana-resorts', name: 'Puntacana Resorts' },
  { id: 'cap-cana', name: 'Cap Cana' },
  { id: 'bavaro', name: 'Bavaro' },
  { id: 'punta-village', name: 'Puntacana Village' },
  { id: 'uvero-alto', name: 'Uvero Alto' },
  { id: 'macao', name: 'Macao' },
] as const;

const TAX_RATE = 5;

const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

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

const MassageConfigModal = ({ massage, isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    massageId: massage.id,
    massageName: massage.name,
    selectedDuration: massage.durations[0],
    persons: 1,
    date: '',
    time: '',
    location: '',
    specialNeeds: '',
    serviceType: 'massage-therapy',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputBase =
    'w-full p-3 border rounded-none bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-colors';

  const updateField = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location) newErrors.location = 'Please select a location';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.date, formData.time, formData.location]);

  // ✅ Pricing with tax
  const basePrice = useMemo(
    () => formData.selectedDuration.price * formData.persons,
    [formData.selectedDuration.price, formData.persons],
  );

  const priceWithTax = useMemo(
    () => calculatePriceWithTax(basePrice, TAX_RATE),
    [basePrice],
  );

  const totalPrice = priceWithTax.total;
  const isValid = formData.date && formData.time && formData.location;

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const selectedLocation = LOCATION_OPTIONS.find(
        (loc) => loc.id === formData.location,
      );

      const reservationData = {
        service: {
          id: 'massage-therapy',
          name: 'Massage Therapy Service',
          type: 'massage-therapy',
          price: totalPrice,
        },
        totalPrice,
        formData: {
          ...formData,
          serviceType: 'massage',
          locationName: selectedLocation?.name || formData.location,
          massageDetails: {
            id: massage.id,
            name: massage.name,
            category: massage.category,
            intensity: massage.intensity,
            isPremium: massage.isPremium,
            benefits: massage.benefits,
            emoji: massage.emoji,
            maxPersons: massage.maxPersons,
          },
          calculatedPrice: totalPrice,
          basePrice,
          subtotal: priceWithTax.subtotal,
          tax: priceWithTax.tax,
          taxRate: TAX_RATE,
        },
        bookingDate: new Date(`${formData.date}T${formData.time}`),
        clientInfo: undefined,
        massageSpecifics: {
          duration: formData.selectedDuration.duration,
          location: formData.location,
          locationName: selectedLocation?.name || formData.location,
          persons: formData.persons,
          specialNeeds: formData.specialNeeds,
          massageType: massage.name,
          intensity: massage.intensity,
          pricing: {
            basePrice,
            subtotal: priceWithTax.subtotal,
            tax: priceWithTax.tax,
            taxRate: TAX_RATE,
            totalPrice,
          },
        },
      };

      await onConfirm(reservationData);
    } catch (error) {
      console.error('Error submitting massage booking:', error);
      setErrors({ submit: 'Failed to submit booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateForm,
    formData,
    massage,
    totalPrice,
    basePrice,
    priceWithTax,
    onConfirm,
  ]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='relative bg-white border border-stone-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto'
      >
        {/* ─ Header ─ */}
        <div className='sticky top-0 z-10 bg-stone-900 text-white p-6 sm:p-8'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-amber-400 uppercase tracking-[0.25em] text-[10px] font-medium mb-1'>
                {massage.category} • {massage.intensity}
              </p>
              <h3 className='text-xl sm:text-2xl font-light tracking-tight'>
                {massage.name}
              </h3>
              <p className='text-stone-400 text-sm mt-1 max-w-md'>
                {massage.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-white/10 transition-colors flex-shrink-0'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* ─ Body ─ */}
        <div className='p-6 sm:p-8 lg:p-10 space-y-10'>
          {/* Benefits — compact tags */}
          <div className='flex flex-wrap gap-2'>
            {massage.benefits.map((benefit, idx) => (
              <span
                key={idx}
                className='text-[11px] text-stone-600 border border-stone-200 px-2.5 py-1'
              >
                {benefit}
              </span>
            ))}
          </div>

          {/* Duration */}
          <div className='space-y-4'>
            <SectionHeading>Duration</SectionHeading>
            <div
              className={`grid gap-3 ${
                massage.durations.length === 1
                  ? 'grid-cols-1 max-w-xs'
                  : 'grid-cols-2'
              }`}
            >
              {massage.durations.map((option) => {
                const selected =
                  formData.selectedDuration.duration === option.duration;
                return (
                  <button
                    key={option.duration}
                    type='button'
                    onClick={() => updateField('selectedDuration', option)}
                    className={`border p-4 text-left transition-colors ${
                      selected
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className='flex justify-between items-baseline'>
                      <span className='text-sm font-medium text-stone-900'>
                        {option.duration} min
                      </span>
                      <span className='text-lg font-light text-stone-900'>
                        ${option.price}
                      </span>
                    </div>
                    <p className='text-[11px] text-stone-400 mt-1'>
                      per person
                    </p>
                    {option.popular && (
                      <span className='inline-block mt-2 text-[10px] text-amber-600 font-medium uppercase tracking-wider'>
                        Recommended
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Size */}
          <div className='space-y-4'>
            <SectionHeading>Group Size</SectionHeading>
            <div className='flex border border-stone-300 overflow-hidden max-w-xs bg-white'>
              <button
                type='button'
                onClick={() =>
                  updateField('persons', Math.max(1, formData.persons - 1))
                }
                disabled={formData.persons <= 1}
                className='px-4 py-2 bg-stone-100 hover:bg-stone-200 transition text-stone-700 disabled:opacity-50'
              >
                <Minus className='w-4 h-4' />
              </button>
              <div className='flex-1 py-2 text-center text-sm font-medium text-stone-900'>
                {formData.persons}
              </div>
              <button
                type='button'
                onClick={() =>
                  updateField(
                    'persons',
                    Math.min(massage.maxPersons, formData.persons + 1),
                  )
                }
                disabled={formData.persons >= massage.maxPersons}
                className='px-4 py-2 bg-stone-100 hover:bg-stone-200 transition text-stone-700 disabled:opacity-50'
              >
                <Plus className='w-4 h-4' />
              </button>
            </div>
            <p className='text-[11px] text-stone-400'>
              Maximum {massage.maxPersons}{' '}
              {massage.maxPersons === 1 ? 'person' : 'people'}
            </p>
          </div>

          {/* Date & Time */}
          <div className='space-y-4'>
            <SectionHeading>Schedule</SectionHeading>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <FieldLabel icon={Calendar} required>
                  Date
                </FieldLabel>
                <input
                  type='date'
                  value={formData.date}
                  onClick={(e) => e.currentTarget.showPicker()}
                  onChange={(e) => updateField('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`${inputBase} ${errors.date ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.date} />
              </div>
              <div>
                <FieldLabel icon={Clock} required>
                  Time
                </FieldLabel>
                <select
                  value={formData.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  className={`${inputBase} ${errors.time ? 'border-red-400' : 'border-stone-300'}`}
                >
                  <option value=''>Select time</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.time} />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className='space-y-4'>
            <SectionHeading>Location</SectionHeading>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {LOCATION_OPTIONS.map((location) => {
                const selected = formData.location === location.id;
                return (
                  <button
                    key={location.id}
                    type='button'
                    onClick={() => updateField('location', location.id)}
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
                      {location.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <FieldError message={errors.location} />
          </div>

          {/* Special Needs */}
          <div className='space-y-4'>
            <SectionHeading>Health Information</SectionHeading>
            <textarea
              value={formData.specialNeeds}
              onChange={(e) => updateField('specialNeeds', e.target.value)}
              placeholder='Medical conditions, injuries, allergies, or special preferences...'
              className={`${inputBase} border-stone-300 resize-none h-24`}
            />
            <p className='flex items-center gap-2 text-xs text-stone-400'>
              <Info className='w-3.5 h-3.5 flex-shrink-0' />
              Confidential — helps our therapists customize your session safely.
            </p>
          </div>

          {/* Error */}
          {errors.submit && (
            <div className='flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-sm text-red-800'>
              <AlertCircle className='w-4 h-4 flex-shrink-0' />
              {errors.submit}
            </div>
          )}
        </div>

        {/* ─ Footer ─ */}
        <div className='sticky bottom-0 bg-stone-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6'>
          <div className='text-center sm:text-left'>
            <span className='text-stone-500 text-xs uppercase tracking-wider'>
              Total
            </span>
            <div className='flex items-center gap-3 mt-1'>
              <span className='text-3xl font-light'>
                ${totalPrice.toFixed(2)}
              </span>
              {formData.persons > 1 && (
                <span className='text-xs bg-stone-800 px-2 py-1'>
                  {formData.persons} people
                </span>
              )}
            </div>

            <div className='text-[11px] text-stone-500 mt-2 space-y-0.5'>
              <div className='text-stone-400'>
                {massage.name} — {formData.selectedDuration.duration} min
              </div>
              <div>
                ${formData.selectedDuration.price} × {formData.persons}{' '}
                {formData.persons === 1 ? 'person' : 'people'}
              </div>
              <div className='border-t border-stone-700 pt-1 mt-1'>
                <div>Subtotal: ${priceWithTax.subtotal.toFixed(2)}</div>
                <div className='text-amber-400'>
                  Processing fee ({TAX_RATE}%): ${priceWithTax.tax.toFixed(2)}
                </div>
              </div>
            </div>
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
              type='button'
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className='px-8 py-3 bg-white text-stone-900 hover:bg-amber-50 text-sm font-medium tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50 disabled:bg-stone-700 disabled:text-stone-500'
            >
              <CreditCard className='w-4 h-4' />
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MassageConfigModal;
