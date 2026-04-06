import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Plane,
  Calendar,
  Users,
  Baby,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Info,
  Clock,
  AlertTriangle,
  AlertCircle,
  Truck,
  Bus,
  MapPin,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import FormHeader from '@/UI/components/forms/FormHeader';
import AirlineSelector from '@/UI/components/service/AirlineSelector';
import {
  getAirlineInfo,
  validateAirlineWithTerminal,
} from '@/constants/airlines';
import { LOCATION_OPTIONS } from '@/constants/location/location';
import { useFormModal } from '@/hooks/useFormModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  airline: string;
  flightNumber: string;
  arrivalTime: string;
  arrivalTerminal: string;
  isRoundTrip: boolean;
  returnDate: string;
  returnAirline: string;
  returnFlightNumber: string;
  departureTime: string;
  departureTerminal: string;
  pickupTime: string;
  passengerCount: number;
  kidsCount: number;
  needsCarSeat: boolean;
  carSeatCount: number;
  vehicleType: string;
  locationArea: string;
  location: string;
  pickupName: string;
}

interface FormErrors {
  [key: string]: string;
}

interface AirportTransferFormProps {
  service: Service;
  onSubmit: (formData: FormData & { totalPrice: number }) => void;
  onCancel: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VEHICLES: Record<
  string,
  {
    name: string;
    capacity: number;
    cost: number;
    description: string;
    icon: React.ReactNode;
  }
> = {
  suv: {
    name: 'SUV',
    capacity: 6,
    cost: 25,
    description: 'Spacious for medium groups',
    icon: <Truck className='w-4 h-4' />,
  },
  van: {
    name: 'Van',
    capacity: 15,
    cost: 50,
    description: 'Large capacity, everyone together',
    icon: <Bus className='w-4 h-4' />,
  },
  two_suvs: {
    name: 'Two SUVs',
    capacity: 12,
    cost: 75,
    description: 'Flexibility for large groups',
    icon: <Truck className='w-4 h-4' />,
  },
};

const CAR_SEAT_PRICE = 25;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSameDay(d: string): boolean {
  if (!d) return false;
  return new Date().toDateString() === new Date(d).toDateString();
}

function has24h(d: string): boolean {
  if (!d) return false;
  return (new Date(d).getTime() - Date.now()) / 36e5 >= 24;
}

function getAirlineCode(airline: string): string {
  return getAirlineInfo(airline)?.code || '';
}

function formatFlightNum(num: string, code: string): string {
  if (!code || !num) return num;
  const clean = num.replace(/^[A-Z]{1,3}/i, '');
  return `${code}${clean}`;
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

const AirportTransferForm: React.FC<AirportTransferFormProps> = ({
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
    date: '',
    airline: '',
    flightNumber: '',
    arrivalTime: '',
    arrivalTerminal: '',
    isRoundTrip: false,
    returnDate: '',
    returnAirline: '',
    returnFlightNumber: '',
    departureTime: '',
    departureTerminal: '',
    pickupTime: '',
    passengerCount: 2,
    kidsCount: 0,
    needsCarSeat: false,
    carSeatCount: 0,
    vehicleType: 'suv',
    locationArea: '',
    location: '',
    pickupName: '',
  });

  const inputBase =
    'w-full p-3 border rounded-none bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-colors';

  const totalPassengers = useMemo(
    () => form.passengerCount + form.kidsCount,
    [form.passengerCount, form.kidsCount],
  );

  const totalPrice = useMemo(() => {
    let p = service.price;
    p += VEHICLES[form.vehicleType]?.cost ?? 0;
    if (form.isRoundTrip) p *= 1.8;
    p += form.carSeatCount * CAR_SEAT_PRICE;
    return Math.round(p);
  }, [service.price, form.vehicleType, form.isRoundTrip, form.carSeatCount]);

  useEffect(() => {
    if (totalPassengers > 6 && form.vehicleType === 'suv') {
      setForm((prev) => ({ ...prev, vehicleType: 'van' }));
    }
  }, [totalPassengers, form.vehicleType]);

  const clearError = useCallback((f: string) => {
    setErrors((prev) => {
      if (!prev[f]) return prev;
      const n = { ...prev };
      delete n[f];
      return n;
    });
  }, []);

  const updateField = useCallback(
    (field: string, value: unknown) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      clearError(field);
    },
    [clearError],
  );

  const handleInput = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value, type } = e.target;
      const checked = 'checked' in e.target ? e.target.checked : false;

      setForm((prev) => {
        const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
        if (name === 'airline') {
          const info = getAirlineInfo(value);
          next.arrivalTerminal = info?.terminal || '';
          if (next.flightNumber && info?.code)
            next.flightNumber = formatFlightNum(next.flightNumber, info.code);
        }
        if (name === 'returnAirline') {
          const info = getAirlineInfo(value);
          next.departureTerminal = info?.terminal || '';
          if (next.returnFlightNumber && info?.code)
            next.returnFlightNumber = formatFlightNum(
              next.returnFlightNumber,
              info.code,
            );
        }
        return next;
      });

      if (
        name === 'needsCarSeat' &&
        !('checked' in e.target && e.target.checked)
      ) {
        setForm((prev) => ({ ...prev, carSeatCount: 0 }));
      }
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
    if (!form.date) errs.date = 'Required';
    if (!form.airline) errs.airline = 'Required';
    if (!form.flightNumber) errs.flightNumber = 'Required';
    if (!form.arrivalTime) errs.arrivalTime = 'Required';
    if (!form.locationArea) errs.locationArea = 'Required';
    if (!form.location) errs.location = 'Required';

    const av = validateAirlineWithTerminal(form.airline);
    if (av) errs.airline = av;

    if (form.isRoundTrip) {
      if (!form.returnDate) errs.returnDate = 'Required';
      if (!form.returnAirline) errs.returnAirline = 'Required';
      if (!form.returnFlightNumber) errs.returnFlightNumber = 'Required';
      if (!form.departureTime) errs.departureTime = 'Required';
      if (!form.pickupTime) errs.pickupTime = 'Required';
      const rv = validateAirlineWithTerminal(form.returnAirline);
      if (rv) errs.returnAirline = rv;
      if (
        form.date &&
        form.returnDate &&
        new Date(form.returnDate) <= new Date(form.date)
      )
        errs.returnDate = 'Must be after arrival';
    }

    if (form.date && !isSameDay(form.date) && !has24h(form.date))
      errs.date = '24h advance required';
    if (totalPassengers < 1) errs.passengerCount = 'At least 1 passenger';
    const v = VEHICLES[form.vehicleType];
    if (v && totalPassengers > v.capacity)
      errs.vehicleType = `Max ${v.capacity} passengers`;
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
        const locationName = getLocationName(form.locationArea);

        // ── Inquiry email ──
        const emailData = {
          serviceName: 'Airport Transfer',
          serviceType: 'airport-transfer',
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          tourDate: form.date,
          timeSlot: form.arrivalTime,
          totalGuests: totalPassengers,
          totalPrice,
          message: [
            `Flight: ${form.flightNumber} (${form.airline})`,
            `Arrival: ${form.arrivalTime}`,
            `Destination: ${locationName} — ${form.location}`,
            `Vehicle: ${VEHICLES[form.vehicleType]?.name}`,
            form.isRoundTrip
              ? `Round trip: ${form.returnDate} ${form.departureTime}`
              : 'One way',
            form.carSeatCount > 0 ? `Car seats: ${form.carSeatCount}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
        };

        fetch('/api/services/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData),
        }).catch((err) => console.error('Inquiry email failed:', err));

        // ── Reservation data ──
        const reservationData = {
          service,
          totalPrice,
          formData: {
            ...form,
            serviceType: 'airport-transfers',
            locationAreaName: locationName,
            terminalInfo: {
              arrival: {
                airline: form.airline,
                terminal: getAirlineInfo(form.airline)?.terminal || 'TBD',
              },
              departure: form.isRoundTrip
                ? {
                    airline: form.returnAirline,
                    terminal:
                      getAirlineInfo(form.returnAirline)?.terminal || 'TBD',
                  }
                : null,
            },
          },
          bookingDate: new Date(`${form.date}T${form.arrivalTime}`),
          clientInfo: { name: form.name, email: form.email, phone: form.phone },
          airportTransferSpecifics: {
            locationArea: form.locationArea,
            locationAreaName: locationName,
            exactDestination: form.location,
            vehicleType: form.vehicleType,
            totalPassengers,
            carSeats: form.carSeatCount,
            isRoundTrip: form.isRoundTrip,
          },
        };

        setReservationData(reservationData);
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
          title='Airport Transfer'
          subtitle='Private transportation from Punta Cana International Airport'
          icon={Plane}
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

          {/* Flight Info */}
          <div className='space-y-6'>
            <SectionHeading>Flight Information</SectionHeading>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <FieldLabel icon={Calendar} required>
                  Arrival Date
                </FieldLabel>
                <input
                  type='date'
                  name='date'
                  value={form.date}
                  onChange={handleInput}
                  min={new Date().toISOString().split('T')[0]}
                  className={`${inputBase} ${errors.date ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.date} />
              </div>
              <AirlineSelector
                name='airline'
                value={form.airline}
                onChange={handleInput}
                error={errors.airline}
                label='Arrival Airline *'
                placeholder='Search airline...'
              />
              <div>
                <FieldLabel icon={Plane} required>
                  Flight Number
                </FieldLabel>
                <input
                  type='text'
                  name='flightNumber'
                  value={form.flightNumber}
                  onChange={handleInput}
                  placeholder={`${getAirlineCode(form.airline) || 'AA'}1234`}
                  className={`${inputBase} ${errors.flightNumber ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.flightNumber} />
              </div>
              <div>
                <FieldLabel icon={Clock} required>
                  Scheduled Arrival
                </FieldLabel>
                <input
                  type='time'
                  name='arrivalTime'
                  value={form.arrivalTime}
                  onChange={handleInput}
                  className={`${inputBase} ${errors.arrivalTime ? 'border-red-400' : 'border-stone-300'}`}
                />
                <FieldError message={errors.arrivalTime} />
              </div>
            </div>

            {form.date && isSameDay(form.date) && (
              <div className='flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-sm text-amber-800'>
                <Info className='w-4 h-4 mt-0.5 flex-shrink-0' />
                <span>
                  <strong>Same-day booking</strong> — requires immediate
                  confirmation.
                </span>
              </div>
            )}

            {/* Round trip toggle */}
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
                  Round Trip Service
                </span>
              </div>
              {form.isRoundTrip ? (
                <ChevronUp className='w-4 h-4 text-stone-400' />
              ) : (
                <ChevronDown className='w-4 h-4 text-stone-400' />
              )}
            </button>

            {form.isRoundTrip && (
              <div className='ml-4 pl-4 border-l-2 border-stone-200 space-y-5'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div>
                    <FieldLabel icon={Calendar} required>
                      Departure Date
                    </FieldLabel>
                    <input
                      type='date'
                      name='returnDate'
                      value={form.returnDate}
                      onChange={handleInput}
                      min={form.date || new Date().toISOString().split('T')[0]}
                      className={`${inputBase} ${errors.returnDate ? 'border-red-400' : 'border-stone-300'}`}
                    />
                    <FieldError message={errors.returnDate} />
                  </div>
                  <AirlineSelector
                    name='returnAirline'
                    value={form.returnAirline}
                    onChange={handleInput}
                    error={errors.returnAirline}
                    label='Departure Airline *'
                    placeholder='Search airline...'
                  />
                  <div>
                    <FieldLabel icon={Plane} required>
                      Return Flight Number
                    </FieldLabel>
                    <input
                      type='text'
                      name='returnFlightNumber'
                      value={form.returnFlightNumber}
                      onChange={handleInput}
                      placeholder={`${getAirlineCode(form.returnAirline) || 'AA'}1234`}
                      className={`${inputBase} ${errors.returnFlightNumber ? 'border-red-400' : 'border-stone-300'}`}
                    />
                    <FieldError message={errors.returnFlightNumber} />
                  </div>
                  <div>
                    <FieldLabel icon={Clock} required>
                      Departure Time
                    </FieldLabel>
                    <input
                      type='time'
                      name='departureTime'
                      value={form.departureTime}
                      onChange={handleInput}
                      className={`${inputBase} ${errors.departureTime ? 'border-red-400' : 'border-stone-300'}`}
                    />
                    <FieldError message={errors.departureTime} />
                  </div>
                  <div className='md:col-span-2'>
                    <FieldLabel icon={Clock} required>
                      Hotel Pickup Time
                    </FieldLabel>
                    <input
                      type='time'
                      name='pickupTime'
                      value={form.pickupTime}
                      onChange={handleInput}
                      className={`${inputBase} ${errors.pickupTime ? 'border-red-400' : 'border-stone-300'}`}
                    />
                    <p className='text-xs text-stone-400 mt-1'>
                      Recommended: 3–4 hours before departure for international
                      flights
                    </p>
                    <FieldError message={errors.pickupTime} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Passengers */}
          <div className='space-y-6'>
            <SectionHeading>Passengers</SectionHeading>
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
            <div className='text-xs text-stone-500 bg-stone-50 border border-stone-200 p-3'>
              Total passengers:{' '}
              <strong className='text-stone-900'>{totalPassengers}</strong>
            </div>

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

          {/* Destination */}
          <div className='space-y-6'>
            <SectionHeading>Destination</SectionHeading>
            <div>
              <FieldLabel icon={MapPin} required>
                Select area
              </FieldLabel>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {LOCATION_OPTIONS.map((loc) => {
                  const sel = form.locationArea === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type='button'
                      onClick={() => updateField('locationArea', loc.id)}
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
              <FieldError message={errors.locationArea} />
            </div>
            <div>
              <FieldLabel icon={MapPin} required>
                Exact Address
              </FieldLabel>
              <textarea
                name='location'
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                rows={2}
                placeholder='Hotel name, villa number, street...'
                className={`${inputBase} resize-none ${errors.location ? 'border-red-400' : 'border-stone-300'}`}
              />
              <FieldError message={errors.location} />
            </div>
            <div>
              <FieldLabel icon={User}>Pickup Name (optional)</FieldLabel>
              <input
                type='text'
                name='pickupName'
                value={form.pickupName}
                onChange={handleInput}
                placeholder='Name on pickup sign'
                className={`${inputBase} border-stone-300`}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='bg-stone-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6'>
          <div className='text-center sm:text-left'>
            <span className='text-stone-500 text-xs uppercase tracking-wider'>
              Estimated
            </span>
            <div className='text-3xl font-light mt-1'>${totalPrice}</div>
            <p className='text-stone-500 text-[11px] mt-1'>
              Final price confirmed after review
            </p>
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

export default AirportTransferForm;
