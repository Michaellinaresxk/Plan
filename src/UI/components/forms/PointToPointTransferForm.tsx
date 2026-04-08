import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  MapPin,
  Calendar,
  Users,
  Baby,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Info,
  Car,
  Clock,
  AlertTriangle,
  AlertCircle,
  Truck,
  Bus,
  Navigation,
  ArrowRight,
  Repeat,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import FormHeader from '@/UI/components/forms/FormHeader';
import { useFormModal } from '@/hooks/useFormModal';
import { LOCATION_OPTIONS } from '@/constants/location/location';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  phone: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocationArea: string;
  destinationZone: string;
  isRoundTrip: boolean;
  returnDate: string;
  returnTime: string;
  passengerCount: number;
  kidsCount: number;
  needsCarSeat: boolean;
  carSeatCount: number;
  vehicleType: string;
  specialRequests: string;
}

interface FormErrors {
  [key: string]: string;
}

interface Props {
  service: Service;
  onSubmit: (formData: FormData & { totalPrice: number }) => void;
  onCancel: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VEHICLES: Record<
  string,
  { name: string; capacity: number; cost: number; description: string }
> = {
  suv: {
    name: 'SUV',
    capacity: 6,
    cost: 25,
    description: 'Spacious for medium groups',
  },
  van: {
    name: 'Van',
    capacity: 15,
    cost: 50,
    description: 'Large capacity, everyone together',
  },
  two_suvs: {
    name: 'Two SUVs',
    capacity: 12,
    cost: 75,
    description: 'Flexibility for large groups',
  },
};

const DESTINATIONS = [
  {
    id: 'punta-cana-center',
    name: 'Punta Cana Center',
    price: 30,
    time: '15–20 min',
    popular: true,
  },
  { id: 'bavaro', name: 'Bavaro', price: 35, time: '20–25 min', popular: true },
  {
    id: 'cap-cana',
    name: 'Cap Cana',
    price: 40,
    time: '25–30 min',
    popular: true,
  },
  {
    id: 'uvero-alto',
    name: 'Uvero Alto',
    price: 60,
    time: '35–45 min',
    popular: false,
  },
  {
    id: 'la-romana',
    name: 'La Romana',
    price: 90,
    time: '1.5–2 hours',
    popular: true,
  },
  {
    id: 'bayahibe',
    name: 'Bayahíbe',
    price: 100,
    time: '1.5–2 hours',
    popular: true,
  },
  {
    id: 'santo-domingo',
    name: 'Santo Domingo',
    price: 150,
    time: '2.5–3 hours',
    popular: false,
  },
] as const;

const CAR_SEAT_PRICE = 25;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSameDay(d: string): boolean {
  return d ? new Date().toDateString() === new Date(d).toDateString() : false;
}
function has24h(d: string): boolean {
  return d ? (new Date(d).getTime() - Date.now()) / 36e5 >= 24 : false;
}
function getLocationName(id: string): string {
  return LOCATION_OPTIONS.find((l) => l.id === id)?.name ?? id;
}
function getDestName(id: string): string {
  return DESTINATIONS.find((d) => d.id === id)?.name ?? id;
}
function getDestPrice(id: string): number {
  return DESTINATIONS.find((d) => d.id === id)?.price ?? 0;
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

const Counter: React.FC<{
  label: string;
  value: number;
  onInc: () => void;
  onDec: () => void;
  icon: React.ElementType;
  min?: number;
}> = ({ label, value, onInc, onDec, icon: Icon, min = 0 }) => (
  <div>
    <FieldLabel icon={Icon}>{label}</FieldLabel>
    <div className='flex border border-stone-300 overflow-hidden bg-white'>
      <button
        type='button'
        onClick={onDec}
        disabled={value <= min}
        className='px-4 py-2 bg-stone-50 hover:bg-stone-100 transition disabled:opacity-40 text-sm'
      >
        −
      </button>
      <div className='flex-1 py-2 text-center text-sm font-medium'>{value}</div>
      <button
        type='button'
        onClick={onInc}
        className='px-4 py-2 bg-stone-50 hover:bg-stone-100 transition text-sm'
      >
        +
      </button>
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const PointToPointTransferForm: React.FC<Props> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose, registerEscapeListener } = useFormModal({ onCancel });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const c = registerEscapeListener();
    return c;
  }, [registerEscapeListener]);

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    pickupDate: '',
    pickupTime: '',
    pickupLocationArea: '',
    destinationZone: '',
    isRoundTrip: false,
    returnDate: '',
    returnTime: '',
    passengerCount: 2,
    kidsCount: 0,
    needsCarSeat: false,
    carSeatCount: 0,
    vehicleType: 'suv',
    specialRequests: '',
  });

  const inputBase =
    'w-full p-3 border rounded-none bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-colors';

  const totalPassengers = useMemo(
    () => form.passengerCount + form.kidsCount,
    [form.passengerCount, form.kidsCount],
  );

  const totalPrice = useMemo(() => {
    let p = service.price + getDestPrice(form.destinationZone);
    p += VEHICLES[form.vehicleType]?.cost ?? 0;
    if (form.isRoundTrip) p *= 1.8;
    p += form.carSeatCount * CAR_SEAT_PRICE;
    return Math.round(p);
  }, [
    service.price,
    form.destinationZone,
    form.vehicleType,
    form.isRoundTrip,
    form.carSeatCount,
  ]);

  useEffect(() => {
    if (totalPassengers <= 6 && form.vehicleType === 'van')
      setForm((p) => ({ ...p, vehicleType: 'suv' }));
  }, [totalPassengers, form.vehicleType]);

  const clearError = useCallback((f: string) => {
    setErrors((p) => {
      if (!p[f]) return p;
      const n = { ...p };
      delete n[f];
      return n;
    });
  }, []);

  const updateField = useCallback(
    (field: string, value: unknown) => {
      setForm((p) => ({ ...p, [field]: value }));
      clearError(field);
    },
    [clearError],
  );

  const handleInput = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value, type } = e.target;
      const checked = 'checked' in e.target ? e.target.checked : false;
      setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
      if (name === 'needsCarSeat' && !checked)
        setForm((p) => ({ ...p, carSeatCount: 0 }));
      clearError(name);
    },
    [clearError],
  );

  const validate = useCallback((): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Required';
    if (!form.pickupDate) errs.pickupDate = 'Required';
    if (!form.pickupTime) errs.pickupTime = 'Required';
    if (!form.pickupLocationArea) errs.pickupLocationArea = 'Required';
    if (!form.destinationZone) errs.destinationZone = 'Required';

    if (form.isRoundTrip) {
      if (!form.returnDate) errs.returnDate = 'Required';
      if (!form.returnTime) errs.returnTime = 'Required';
      if (
        form.pickupDate &&
        form.returnDate &&
        new Date(form.returnDate) < new Date(form.pickupDate)
      )
        errs.returnDate = 'Must be after pickup';
    }

    if (
      form.pickupDate &&
      !isSameDay(form.pickupDate) &&
      !has24h(form.pickupDate)
    )
      errs.pickupDate = '24h advance required';
    if (totalPassengers < 1) errs.passengerCount = 'At least 1';
    const v = VEHICLES[form.vehicleType];
    if (v && totalPassengers > v.capacity)
      errs.vehicleType = `Max ${v.capacity}`;
    if (form.needsCarSeat && form.carSeatCount === 0)
      errs.carSeatCount = 'Specify quantity';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form, totalPassengers]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      setIsSubmitting(true);

      try {
        const pickupName = getLocationName(form.pickupLocationArea);
        const destName = getDestName(form.destinationZone);

        // ── Inquiry ──
        fetch('/api/services/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceName: 'Point-to-Point Transfer',
            serviceType: 'point-to-point-transfer',
            customerName: form.name,
            customerEmail: form.email,
            customerPhone: form.phone,
            tourDate: form.pickupDate,
            timeSlot: form.pickupTime,
            totalGuests: totalPassengers,
            totalPrice,
            message: [
              `Route: ${pickupName} → ${destName}`,
              `Vehicle: ${VEHICLES[form.vehicleType]?.name}`,
              form.isRoundTrip
                ? `Round trip: ${form.returnDate} ${form.returnTime}`
                : 'One way',
              form.specialRequests ? `Notes: ${form.specialRequests}` : '',
            ]
              .filter(Boolean)
              .join('\n'),
          }),
        }).catch((err) => console.error('Inquiry failed:', err));

        // ── Reservation ──
        setReservationData({
          service,
          totalPrice,
          formData: {
            ...form,
            serviceType: 'point-to-point-transfer',
            pickupLocationAreaName: pickupName,
            destinationZoneName: destName,
          },
          bookingDate: new Date(`${form.pickupDate}T${form.pickupTime}`),
          clientInfo: { name: form.name, email: form.email, phone: form.phone },
          pointToPointSpecifics: {
            pickupLocationArea: form.pickupLocationArea,
            destinationZone: form.destinationZone,
            pickupLocationAreaName: pickupName,
            destinationZoneName: destName,
            vehicleType: form.vehicleType,
            totalPassengers,
            carSeats: form.carSeatCount,
            isRoundTrip: form.isRoundTrip,
          },
        });

        router.push('/reservation-confirmation');
      } catch (error) {
        console.error('Submission error:', error);
        setErrors({ submit: 'Unable to send inquiry. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validate,
      form,
      totalPrice,
      totalPassengers,
      service,
      setReservationData,
      router,
    ],
  );

  const counter = (
    field: 'passengerCount' | 'kidsCount' | 'carSeatCount',
    min = 0,
    max = 20,
  ) => ({
    onInc: () =>
      setForm((p) => ({
        ...p,
        [field]: Math.min(max, (p[field] as number) + 1),
      })),
    onDec: () =>
      setForm((p) => ({
        ...p,
        [field]: Math.max(min, (p[field] as number) - 1),
      })),
  });

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto'>
      <div className='bg-white border border-stone-200'>
        <FormHeader
          title='Point-to-Point Transfer'
          subtitle='Private transportation between any two locations'
          icon={Car}
          onCancel={handleClose}
          showCloseButton
          gradientFrom='stone-800'
          gradientVia='stone-800'
          gradientTo='stone-900'
        />

        <div className='p-6 sm:p-8 lg:p-10 space-y-10'>
          {/* Contact */}
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

          {/* Route */}
          <div className='space-y-6'>
            <SectionHeading>Route</SectionHeading>

            {/* Pickup area */}
            <div>
              <FieldLabel icon={MapPin} required>
                Pickup Area
              </FieldLabel>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {LOCATION_OPTIONS.map((loc) => {
                  const sel = form.pickupLocationArea === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type='button'
                      onClick={() => updateField('pickupLocationArea', loc.id)}
                      className={`flex items-center border p-3 text-left transition-colors ${
                        sel
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                          sel
                            ? 'border-stone-900 bg-stone-900'
                            : 'border-stone-300'
                        }`}
                      >
                        {sel && (
                          <CheckCircle className='w-2.5 h-2.5 text-white' />
                        )}
                      </div>
                      <span className='text-xs font-medium text-stone-800'>
                        {loc.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FieldError message={errors.pickupLocationArea} />
            </div>

            {/* Destination */}
            <div>
              <FieldLabel icon={Navigation} required>
                Destination Zone
              </FieldLabel>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {DESTINATIONS.map((zone) => {
                  const sel = form.destinationZone === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type='button'
                      onClick={() => updateField('destinationZone', zone.id)}
                      className={`border p-4 text-left transition-colors ${
                        sel
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-2'>
                          <div
                            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              sel
                                ? 'border-stone-900 bg-stone-900'
                                : 'border-stone-300'
                            }`}
                          >
                            {sel && (
                              <CheckCircle className='w-2 h-2 text-white' />
                            )}
                          </div>
                          <span className='text-xs font-medium text-stone-800'>
                            {zone.name}
                          </span>
                          {zone.popular && (
                            <span className='text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5'>
                              Popular
                            </span>
                          )}
                        </div>
                        <span className='text-xs font-medium text-stone-500'>
                          ${zone.price}
                        </span>
                      </div>
                      <div className='flex items-center gap-1 text-[11px] text-stone-400 ml-5'>
                        <Clock className='w-3 h-3' />
                        {zone.time}
                      </div>
                    </button>
                  );
                })}
              </div>
              <FieldError message={errors.destinationZone} />
            </div>

            {/* Route preview */}
            {form.pickupLocationArea && form.destinationZone && (
              <div className='bg-stone-50 border border-stone-200 p-4'>
                <div className='flex items-center gap-3 text-sm'>
                  <span className='text-stone-900 font-medium'>
                    {getLocationName(form.pickupLocationArea)}
                  </span>
                  <ArrowRight className='w-3.5 h-3.5 text-stone-400' />
                  <span className='text-stone-900 font-medium'>
                    {getDestName(form.destinationZone)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className='space-y-6'>
            <SectionHeading>Schedule</SectionHeading>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <FieldLabel icon={Calendar} required>
                  Pickup Date
                </FieldLabel>
                <input
                  type='date'
                  name='pickupDate'
                  value={form.pickupDate}
                  onChange={handleInput}
                  min={new Date().toISOString().split('T')[0]}
                  className={`${inputBase} ${errors.pickupDate ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.pickupDate} />
              </div>
              <div>
                <FieldLabel icon={Clock} required>
                  Pickup Time
                </FieldLabel>
                <input
                  type='time'
                  name='pickupTime'
                  value={form.pickupTime}
                  onChange={handleInput}
                  className={`${inputBase} ${errors.pickupTime ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.pickupTime} />
              </div>
            </div>

            {form.pickupDate && isSameDay(form.pickupDate) && (
              <div className='flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-sm text-amber-800'>
                <Info className='w-4 h-4 mt-0.5 flex-shrink-0' />
                <span>
                  <strong>Same-day booking</strong> — requires immediate
                  confirmation.
                </span>
              </div>
            )}

            <button
              type='button'
              onClick={() =>
                setForm((p) => ({ ...p, isRoundTrip: !p.isRoundTrip }))
              }
              className='flex items-center justify-between w-full p-4 border border-stone-200 bg-stone-50 hover:bg-stone-100 transition text-left'
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    form.isRoundTrip
                      ? 'border-stone-900 bg-stone-900'
                      : 'border-stone-300'
                  }`}
                >
                  {form.isRoundTrip && (
                    <CheckCircle className='w-2.5 h-2.5 text-white' />
                  )}
                </div>
                <span className='text-sm font-medium text-stone-800'>
                  Round Trip
                </span>
              </div>
              {form.isRoundTrip ? (
                <ChevronUp className='w-4 h-4 text-stone-400' />
              ) : (
                <ChevronDown className='w-4 h-4 text-stone-400' />
              )}
            </button>

            {form.isRoundTrip && (
              <div className='ml-4 pl-4 border-l-2 border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <FieldLabel icon={Calendar} required>
                    Return Date
                  </FieldLabel>
                  <input
                    type='date'
                    name='returnDate'
                    value={form.returnDate}
                    onChange={handleInput}
                    min={
                      form.pickupDate || new Date().toISOString().split('T')[0]
                    }
                    className={`${inputBase} ${errors.returnDate ? 'border-red-400' : 'border-stone-300'}`}
                  />
                  <FieldError message={errors.returnDate} />
                </div>
                <div>
                  <FieldLabel icon={Clock} required>
                    Return Time
                  </FieldLabel>
                  <input
                    type='time'
                    name='returnTime'
                    value={form.returnTime}
                    onChange={handleInput}
                    className={`${inputBase} ${errors.returnTime ? 'border-red-400' : 'border-stone-300'}`}
                  />
                  <FieldError message={errors.returnTime} />
                </div>
              </div>
            )}
          </div>

          {/* Passengers + Vehicle */}
          <div className='space-y-6'>
            <SectionHeading>Passengers & Vehicle</SectionHeading>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <Counter
                label='Adults'
                value={form.passengerCount}
                icon={Users}
                min={1}
                {...counter('passengerCount', 1)}
              />
              <Counter
                label='Children'
                value={form.kidsCount}
                icon={Baby}
                {...counter('kidsCount')}
              />
            </div>

            {/* Vehicle selection */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
              {Object.entries(VEHICLES).map(([key, v]) => {
                const sel = form.vehicleType === key;
                return (
                  <button
                    key={key}
                    type='button'
                    onClick={() => updateField('vehicleType', key)}
                    className={`border p-4 text-left transition-colors ${
                      sel
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-xs font-medium text-stone-800'>
                        {v.name}
                      </span>
                      <span className='text-xs text-stone-500'>+${v.cost}</span>
                    </div>
                    <p className='text-[11px] text-stone-400'>
                      {v.description}
                    </p>
                    <p className='text-[10px] text-stone-400 mt-1'>
                      Up to {v.capacity} passengers
                    </p>
                  </button>
                );
              })}
            </div>
            <FieldError message={errors.vehicleType} />

            {/* Car seats */}
            <label className='flex items-center gap-2 bg-stone-50 border border-stone-200 p-3 cursor-pointer'>
              <input
                type='checkbox'
                name='needsCarSeat'
                checked={form.needsCarSeat}
                onChange={handleInput}
                className='h-4 w-4 text-stone-900 focus:ring-stone-900 border-stone-300 rounded'
              />
              <span className='text-sm text-stone-700'>
                I need child safety seats
              </span>
            </label>
            {form.needsCarSeat && (
              <Counter
                label='Car seats needed'
                value={form.carSeatCount}
                icon={Baby}
                {...counter('carSeatCount')}
              />
            )}
            <FieldError message={errors.carSeatCount} />
          </div>

          {/* Notes */}
          <div className='space-y-4'>
            <SectionHeading>Additional Notes</SectionHeading>
            <textarea
              name='specialRequests'
              value={form.specialRequests}
              onChange={handleInput}
              rows={3}
              className={`${inputBase} border-stone-300 resize-none`}
              placeholder='Accessibility needs, additional stops, special requirements...'
            />
          </div>
        </div>

        {/* Footer */}
        <div className='bg-stone-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6'>
          <div className='text-center sm:text-left'>
            <span className='text-stone-500 text-xs uppercase tracking-wider'></span>
            <div className='text-3xl font-light mt-1'></div>
            {form.pickupLocationArea && form.destinationZone && (
              <p className='text-stone-500 text-[11px] mt-1'>
                {getLocationName(form.pickupLocationArea)} →{' '}
                {getDestName(form.destinationZone)}
              </p>
            )}
          </div>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={handleClose}
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

export default PointToPointTransferForm;
