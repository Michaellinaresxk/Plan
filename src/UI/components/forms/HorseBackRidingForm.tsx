import React, { useState, useMemo, useCallback } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Baby,
  AlertTriangle,
  Info,
  CheckCircle,
  Mountain,
  CreditCard,
  ChevronDown,
  ChevronUp,
  User,
  UserPlus,
} from 'lucide-react';

interface FormData {
  date: string;
  pickupTime: string;
  adults: number;
  children: number;
  infants: number;
}

interface FormErrors {
  [key: string]: string;
}

// Generar horarios de recogida (4pm = 5pm inicio)
const generatePickupTimes = () => {
  const times = [
    { value: '16:00', label: '4:00 PM', startTime: '5:00 PM' },
    { value: '15:00', label: '3:00 PM', startTime: '4:00 PM' },
    { value: '14:00', label: '2:00 PM', startTime: '3:00 PM' },
  ];
  return times;
};

const PICKUP_TIMES = generatePickupTimes();

const HorseBackRidingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    date: '',
    pickupTime: '',
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimeSlotOpen, setIsTimeSlotOpen] = useState(false);

  const TAX_RATE = 5;
  const PRICE_PER_PERSON = 120;

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

  const totalParticipants = useMemo(() => {
    return formData.adults + formData.children + formData.infants;
  }, [formData.adults, formData.children, formData.infants]);

  const basePrice = useMemo(() => {
    return PRICE_PER_PERSON * totalParticipants;
  }, [totalParticipants]);

  const subtotal = useMemo(() => {
    return basePrice;
  }, [basePrice]);

  const tax = useMemo(() => {
    return (subtotal * TAX_RATE) / 100;
  }, [subtotal]);

  const totalPrice = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      updateFormField(name, value);
    },
    [updateFormField]
  );

  const createCounter = (field: keyof FormData, min = 0) => ({
    value: formData[field] as number,
    increment: () => {
      const currentValue = formData[field] as number;
      updateFormField(field, currentValue + 1);
    },
    decrement: () => {
      const currentValue = formData[field] as number;
      if (currentValue > min) {
        updateFormField(field, currentValue - 1);
      }
    },
  });

  const adultCounter = createCounter('adults', 1);
  const childCounter = createCounter('children', 0);
  const infantCounter = createCounter('infants', 0);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Please select a pickup time';
    }

    if (totalParticipants === 0) {
      newErrors.participants = 'At least one participant is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Booking data:', formData);
      // Handle submission
    } catch (error) {
      console.error('Error:', error);
      setErrors({
        submit: 'There was an error processing your booking',
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
    sublabel: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    icon: React.ElementType;
    min?: number;
  }) => (
    <div className='flex items-center justify-between py-4 border-b border-gray-100 last:border-0'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center'>
          <Icon className='w-5 h-5 text-amber-600' />
        </div>
        <div>
          <div className='text-sm font-medium text-gray-900'>{label}</div>
          <div className='text-xs text-gray-500'>{sublabel}</div>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={onDecrement}
          disabled={value <= min}
          className='w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed'
        >
          <span className='text-xl font-light'>−</span>
        </button>
        <div className='w-12 text-center text-base font-medium text-gray-900'>
          {value}
        </div>
        <button
          type='button'
          onClick={onIncrement}
          className='w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition'
        >
          <span className='text-xl font-light'>+</span>
        </button>
      </div>
    </div>
  );

  const selectedTime = PICKUP_TIMES.find(
    (t) => t.value === formData.pickupTime
  );

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden'
      >
        {/* Header */}
        <div className='bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6'>
          <div className='flex items-center gap-3 mb-2'>
            <Mountain className='w-8 h-8 text-white' />
            <h2 className='text-2xl font-light text-white'>
              Horseback Riding Experience
            </h2>
          </div>
          <p className='text-amber-50 text-sm font-light'>
            Book your unforgettable sunset adventure
          </p>
        </div>

        <div className='p-8 space-y-8'>
          {/* Date Selection */}
          <div>
            <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
              <Calendar className='w-4 h-4 mr-2 text-amber-600' />
              Select Date *
            </label>
            <input
              type='date'
              name='date'
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border ${
                errors.date ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p className='text-red-500 text-xs mt-2 flex items-center gap-1'>
                <AlertTriangle className='w-3 h-3' />
                {errors.date}
              </p>
            )}
          </div>

          {/* Pickup Time Accordion */}
          <div>
            <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
              <Clock className='w-4 h-4 mr-2 text-amber-600' />
              Pick Up Time *
            </label>
            <div className='border border-gray-200 rounded-xl overflow-hidden'>
              <button
                type='button'
                onClick={() => setIsTimeSlotOpen(!isTimeSlotOpen)}
                className='w-full px-4 py-4 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between'
              >
                <div className='text-left'>
                  {formData.pickupTime ? (
                    <div>
                      <div className='text-base font-medium text-gray-900'>
                        Pick up: {selectedTime?.label}
                      </div>
                      <div className='text-sm text-gray-500'>
                        Experience starts: {selectedTime?.startTime}
                      </div>
                    </div>
                  ) : (
                    <div className='text-gray-500'>Select pickup time</div>
                  )}
                </div>
                {isTimeSlotOpen ? (
                  <ChevronUp className='w-5 h-5 text-gray-600' />
                ) : (
                  <ChevronDown className='w-5 h-5 text-gray-600' />
                )}
              </button>

              {isTimeSlotOpen && (
                <div className='p-4 bg-white border-t border-gray-100'>
                  <div className='space-y-2'>
                    {PICKUP_TIMES.map((time) => (
                      <button
                        key={time.value}
                        type='button'
                        className={`
                          w-full p-4 rounded-lg border-2 transition-all text-left
                          ${
                            formData.pickupTime === time.value
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-gray-200 hover:border-amber-300 bg-white'
                          }
                        `}
                        onClick={() => {
                          updateFormField('pickupTime', time.value);
                          setIsTimeSlotOpen(false);
                        }}
                      >
                        <div className='flex items-center justify-between'>
                          <div>
                            <div className='font-medium text-gray-900 flex items-center gap-2'>
                              {formData.pickupTime === time.value && (
                                <CheckCircle className='w-4 h-4 text-amber-600' />
                              )}
                              Pick up: {time.label}
                            </div>
                            <div className='text-sm text-gray-500 mt-1'>
                              Experience starts: {time.startTime}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {errors.pickupTime && (
              <p className='text-red-500 text-xs mt-2 flex items-center gap-1'>
                <AlertTriangle className='w-3 h-3' />
                {errors.pickupTime}
              </p>
            )}
          </div>

          {/* Participants */}
          <div>
            <label className='flex items-center text-sm font-medium text-gray-700 mb-4'>
              <Users className='w-4 h-4 mr-2 text-amber-600' />
              Participants *
            </label>
            <div className='border border-gray-200 rounded-xl p-4 bg-gray-50'>
              <ParticipantCounter
                label='Adult'
                sublabel='Above 12 years'
                value={adultCounter.value}
                onIncrement={adultCounter.increment}
                onDecrement={adultCounter.decrement}
                icon={User}
                min={1}
              />
              <ParticipantCounter
                label='Child'
                sublabel='3 - 12 years'
                value={childCounter.value}
                onIncrement={childCounter.increment}
                onDecrement={childCounter.decrement}
                icon={Users}
              />
              <ParticipantCounter
                label='Infant'
                sublabel='0 - 3 years'
                value={infantCounter.value}
                onIncrement={infantCounter.increment}
                onDecrement={infantCounter.decrement}
                icon={Baby}
              />
            </div>
            {errors.participants && (
              <p className='text-red-500 text-xs mt-2 flex items-center gap-1'>
                <AlertTriangle className='w-3 h-3' />
                {errors.participants}
              </p>
            )}
            <div className='flex items-start gap-2 mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100'>
              <Info className='w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0' />
              <p className='text-xs text-blue-700'>
                Children must be accompanied by an adult. Safety equipment
                provided for all ages.
              </p>
            </div>
          </div>

          {/* Safety Information */}
          <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
            <div className='flex items-start gap-3'>
              <AlertTriangle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
              <div>
                <h4 className='font-medium text-red-800 mb-2'>
                  Safety Requirements
                </h4>
                <ul className='text-xs text-red-700 space-y-1.5'>
                  <li>• Minimum age: 3 years old</li>
                  <li>• Weight limit: 250 lbs per rider</li>
                  <li>• Closed-toe shoes required</li>
                  <li>• No riding experience necessary</li>
                  <li>• Pregnant women cannot participate</li>
                  <li>• Medical conditions must be disclosed</li>
                </ul>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-xl'>
              <p className='text-red-800 text-sm flex items-center gap-2'>
                <AlertTriangle className='w-4 h-4' />
                {errors.submit}
              </p>
            </div>
          )}
        </div>

        {/* Footer with Pricing */}
        <div className='bg-zinc-900 text-white px-8 py-6'>
          <div className='space-y-4'>
            {/* Price Breakdown */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-amber-400 font-medium'>
                  Horseback Riding Experience
                </span>
              </div>

              <div className='flex justify-between text-sm text-gray-400'>
                <span>
                  Package ({totalParticipants}{' '}
                  {totalParticipants === 1 ? 'person' : 'people'})
                </span>
                <span className='font-medium text-white'>
                  ${basePrice.toFixed(2)}
                </span>
              </div>

              <div className='border-t border-gray-700 pt-3 space-y-2'>
                <div className='flex justify-between text-sm text-gray-400'>
                  <span>Subtotal</span>
                  <span className='font-medium text-white'>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between text-sm text-amber-400'>
                  <span>Processing Fee ({TAX_RATE}%)</span>
                  <span className='font-medium'>${tax.toFixed(2)}</span>
                </div>
              </div>

              {formData.pickupTime && (
                <div className='text-amber-400 text-sm pt-2'>
                  🕒 Pick up: {selectedTime?.label} | Start:{' '}
                  {selectedTime?.startTime}
                </div>
              )}
            </div>

            {/* Total */}
            <div className='border-t border-gray-700 pt-4'>
              <div className='flex items-center justify-between'>
                <span className='text-gray-400 text-sm uppercase tracking-wide'>
                  Total Price
                </span>
                <span className='text-3xl font-light text-white'>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700'>
              <button
                type='button'
                className='flex-1 px-6 py-3 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition font-medium'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl'
              >
                <CreditCard className='w-4 h-4' />
                {isSubmitting ? 'Processing...' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HorseBackRidingForm;
