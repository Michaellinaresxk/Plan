import {
  Accessibility,
  ArrowRight,
  Calendar,
  CheckCircle,
  Heart,
  Info,
  Minus,
  Plus,
  Timer,
  Users,
} from 'lucide-react';
import { useState } from 'react';

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

const PreSelectedBookingForm = ({ service, onConfirm, onCancel }) => {
  const [duration, setDuration] = useState(service.durations[0].duration);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [persons, setPersons] = useState(1);
  const [specialNeeds, setSpecialNeeds] = useState('');

  const currentPrice =
    service.durations.find((d) => d.duration === duration)?.price || 0;
  const totalPrice = currentPrice * persons;

  const handleSubmit = () => {
    if (!date || !time) return;

    onConfirm({
      serviceId: service.id,
      serviceName: service.name,
      duration,
      price: totalPrice,
      date,
      time,
      persons,
      specialNeeds,
      emoji: service.emoji,
    });
  };

  const isFormValid = date && time;

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* Duration Selection */}
      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <h3 className='text-2xl font-semibold text-stone-800 mb-6 flex items-center gap-3'>
          <Timer className='w-6 h-6 text-stone-600' />
          Treatment Duration
        </h3>

        <div
          className={`grid gap-4 ${
            service.durations.length === 1
              ? 'grid-cols-1 max-w-md'
              : service.durations.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {service.durations.map((option, index) => (
            <button
              key={option.duration}
              onClick={() => setDuration(option.duration)}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                duration === option.duration
                  ? 'border-stone-800 bg-stone-50 shadow-md'
                  : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
              }`}
            >
              {index === 0 && service.durations.length > 1 && (
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white px-3 py-1 rounded-full text-xs font-medium'>
                  Popular
                </div>
              )}
              <div className='font-semibold text-stone-800 mb-2 text-lg'>
                {option.duration} minutes
              </div>
              <div className='text-stone-600 mb-3'>
                {option.duration === 30 && 'Quick session'}
                {option.duration === 60 && 'Standard session'}
                {option.duration === 90 && 'Extended experience'}
                {option.duration === 120 && 'Complete relaxation'}
              </div>
              <div className='text-2xl font-bold text-stone-800'>
                ${option.price}
              </div>
              <div className='text-sm text-stone-500'>
                ${option.price * persons} total
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <h3 className='text-2xl font-semibold text-stone-800 mb-6 flex items-center gap-3'>
          <Calendar className='w-6 h-6 text-stone-600' />
          Date & Time
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-lg font-medium text-stone-800 mb-3'>
              Select Date
            </label>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-lg'
            />
          </div>

          <div>
            <label className='block text-lg font-medium text-stone-800 mb-3'>
              Select Time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-lg'
            >
              <option value=''>Choose time slot</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Persons Selection */}
      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <h3 className='text-2xl font-semibold text-stone-800 mb-6 flex items-center gap-3'>
          <Users className='w-6 h-6 text-stone-600' />
          Number of People
        </h3>

        <div className='flex items-center justify-between bg-stone-50 rounded-xl p-6'>
          <div className='flex items-center gap-6'>
            <button
              onClick={() => setPersons(Math.max(1, persons - 1))}
              className='w-12 h-12 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm'
            >
              <Minus className='w-6 h-6 text-stone-600' />
            </button>
            <span className='text-3xl font-semibold text-stone-800 w-16 text-center'>
              {persons}
            </span>
            <button
              onClick={() =>
                setPersons(Math.min(service.maxPersons, persons + 1))
              }
              className='w-12 h-12 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm'
            >
              <Plus className='w-6 h-6 text-stone-600' />
            </button>
          </div>
          <div className='text-stone-600'>
            <span className='text-lg'>
              Maximum: {service.maxPersons} people
            </span>
          </div>
        </div>
      </div>

      {/* Special Needs & Disabilities */}
      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <h3 className='text-2xl font-semibold text-stone-800 mb-6 flex items-center gap-3'>
          <Accessibility className='w-6 h-6 text-stone-600' />
          Special Needs & Medical Considerations
        </h3>

        <textarea
          value={specialNeeds}
          onChange={(e) => setSpecialNeeds(e.target.value)}
          placeholder='Please mention any medical conditions, disabilities, injuries, pregnancy, allergies, mobility restrictions, or special accommodations we should consider to personalize your experience safely...'
          className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none h-32 text-lg'
        />
        <div className='flex items-start gap-2 mt-3 text-stone-600'>
          <Info className='w-5 h-5 mt-0.5 flex-shrink-0' />
          <p className='text-sm leading-relaxed'>
            This information is confidential and helps us adapt the treatment to
            your specific needs. Our therapists are trained to work with various
            conditions, disabilities, and limitations.
          </p>
        </div>
      </div>

      {/* Price Summary */}
      <div className='bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl p-8'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h3 className='text-2xl font-semibold mb-4 flex items-center gap-3'>
              <CheckCircle className='w-6 h-6' />
              Booking Summary
            </h3>
            <div className='space-y-2 text-stone-300'>
              <div className='flex items-center gap-2'>
                <span className='text-xl'>{service.emoji}</span>
                <span className='text-lg'>{service.name}</span>
              </div>
              <div>{duration} minutes treatment</div>
              <div>
                {persons} {persons === 1 ? 'person' : 'people'}
              </div>
              {date && time && (
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  <span>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    at {time}
                  </span>
                </div>
              )}
              {specialNeeds && (
                <div className='text-sm bg-white/10 rounded-lg p-3 mt-3'>
                  <strong>Special considerations:</strong>{' '}
                  {specialNeeds.slice(0, 100)}
                  {specialNeeds.length > 100 ? '...' : ''}
                </div>
              )}
            </div>
          </div>
          <div className='text-right'>
            <div className='text-4xl font-bold'>${totalPrice}</div>
            <div className='text-stone-300'>Total Price</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 pt-4'>
        <button
          onClick={onCancel}
          className='flex-1 py-4 border-2 border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors font-semibold text-lg'
        >
          Change Service
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`flex-1 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
            isFormValid
              ? 'bg-stone-800 text-white hover:bg-stone-700 shadow-lg'
              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
          }`}
        >
          <Heart className='w-6 h-6' />
          Confirm Booking
          <ArrowRight className='w-6 h-6' />
        </button>
      </div>
    </div>
  );
};

export default PreSelectedBookingForm;
