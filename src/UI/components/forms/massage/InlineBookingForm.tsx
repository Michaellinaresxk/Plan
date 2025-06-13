import { Service } from '@/constants/formFields';
import { ServiceData } from '@/types/services';
import { motion } from 'framer-motion';
import {
  Clock,
  ArrowRight,
  Users,
  Timer,
  Calendar,
  Plus,
  Minus,
  X,
  Accessibility,
  Info,
  CreditCard,
  MapPin,
} from 'lucide-react'; // Componente del formulario inline
import { useCallback, useState } from 'react';

interface MassageServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

const InlineBookingForm = ({
  selectedMassage,
  onCancel,
  onConfirm,
}: MassageServiceViewProps) => {
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

  const [selectedDuration, setSelectedDuration] = useState(
    selectedMassage.durations[0]
  );
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [persons, setPersons] = useState(1);
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [errors, setErrors] = useState({}); // Nuevo: estado para errores
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo: estado de carga

  const totalPrice = selectedDuration.price * persons;
  const isFormValid = date && time;

  // Nuevo: validación del formulario
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!date) newErrors.date = 'Date required';
    if (!time) newErrors.time = 'Time required';
    if (!location) newErrors.location = 'Address id required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [date, time]);

  // Corregido: manejar envío del formulario
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      // Crear los datos de reserva en el formato correcto
      const reservationData = {
        service: selectedMassage,
        formData: {
          serviceId: selectedMassage.id,
          serviceName: selectedMassage.name,
          duration: selectedDuration.duration,
          date,
          time,
          location,
          persons,
          specialNeeds,
          calculatedPrice: totalPrice,
        },
        totalPrice,
        bookingDate: new Date(),
      };

      onConfirm(reservationData);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateForm,
    selectedMassage,
    selectedDuration,
    date,
    time,
    location,
    persons,
    specialNeeds,
    totalPrice,
    onConfirm,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
      className='bg-white rounded-3xl shadow-2xl p-8 mt-8 border border-stone-200'
      id='booking-form'
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-8 pb-6 border-b border-stone-200'>
        <div className='flex items-center gap-4'>
          <div className='w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-2xl'>
            {selectedMassage.emoji}
          </div>
          <div>
            <h3 className='text-2xl font-semibold text-stone-800 mb-1'>
              Complete your {selectedMassage.name} booking
            </h3>
            <p className='text-stone-600'>{selectedMassage.description}</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className='p-2 hover:bg-stone-100 rounded-lg transition-colors'
        >
          <X className='w-6 h-6 text-stone-600' />
        </button>
      </div>

      <div className='space-y-8'>
        {/* Duration Selection */}
        <div>
          <h4 className='text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2'>
            <Timer className='w-5 h-5 text-green-800' />
            Treatment Duration
          </h4>
          <div
            className={`grid gap-4 ${
              selectedMassage.durations.length === 1
                ? 'grid-cols-1 max-w-sm'
                : selectedMassage.durations.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-3'
            }`}
          >
            {selectedMassage.durations.map((option, index) => (
              <button
                key={option.duration}
                onClick={() => setSelectedDuration(option)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedDuration.duration === option.duration
                    ? 'border-stone-800 bg-stone-50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className='font-semibold text-stone-800'>
                  {option.duration} minutes
                </div>
                <div className='text-xl font-bold text-stone-800 mt-1'>
                  ${option.price}
                </div>
                {persons > 1 && (
                  <div className='text-sm text-stone-500 mt-1'>
                    ${option.price * persons} total
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
              <Calendar className='w-5 h-5 text-green-800' />
              Date
            </label>
            <input
              type='date'
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-lg transition-colors ${
                errors.date
                  ? 'border-red-300 bg-red-50 focus:border-red-400'
                  : 'border-stone-300'
              }`}
            />
            {errors.date && (
              <p className='text-red-500 text-sm mt-2'>{errors.date}</p>
            )}
          </div>

          <div>
            <label className='block text-lg font-semibold  mb-3 flex items-center gap-2'>
              <Clock className='w-5 h-5 text-green-800' />
              Time
            </label>
            <select
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                if (errors.time) setErrors((prev) => ({ ...prev, time: '' }));
              }}
              className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-lg transition-colors ${
                errors.time
                  ? 'border-red-300 bg-red-50 focus:border-red-400'
                  : 'border-stone-300'
              }`}
            >
              <option value=''>Select time</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time && (
              <p className='text-red-500 text-sm mt-2'>{errors.time}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className='flex items-center  text-lg font-semibold  text-grey-800 mb-2'>
            <MapPin className='w-5 h-5 mr-2 text-green-800' />
            Address *
          </label>
          <input
            name='location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            } `}
            placeholder='Please provide the complete address where the personal will take place.'
          />
          {errors.location && (
            <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
          )}
        </div>

        {/* Number of People */}
        <div>
          <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
            <Users className='w-5 h-5 text-green-800' />
            Number of People
          </label>
          <div className='flex items-center justify-between bg-stone-50 rounded-xl p-4'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => setPersons(Math.max(1, persons - 1))}
                className='w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors'
                disabled={persons <= 1}
              >
                <Minus className='w-5 h-5 text-stone-600' />
              </button>
              <span className='text-2xl font-semibold text-stone-800 w-12 text-center'>
                {persons}
              </span>
              <button
                onClick={() =>
                  setPersons(Math.min(selectedMassage.maxPersons, persons + 1))
                }
                className='w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors'
                disabled={persons >= selectedMassage.maxPersons}
              >
                <Plus className='w-5 h-5 text-stone-600' />
              </button>
            </div>
            <span className='text-stone-600'>
              Maximum: {selectedMassage.maxPersons} people
            </span>
          </div>
        </div>

        {/* Special Needs & Disability */}
        <div>
          <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
            <Accessibility className='w-5 h-5 text-green-800' />
            Special Needs & Disabilities
          </label>
          <textarea
            value={specialNeeds}
            onChange={(e) => setSpecialNeeds(e.target.value)}
            placeholder='Please mention any medical conditions, disabilities, injuries, pregnancy, allergies, mobility restrictions, or special accommodations we should consider to personalize your experience safely...'
            className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none h-32 text-lg'
          />
          <div className='flex items-start gap-2 mt-3 text-stone-600'>
            <Info className='w-5 h-5 mt-0.5 flex-shrink-0' />
            <p className='text-sm leading-relaxed'>
              This information is confidential and helps us adapt the treatment
              to your specific needs. Our therapists are trained to work with
              various conditions and limitations.
            </p>
          </div>
        </div>

        {/* Price Summary */}
        <div className='bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl p-6'>
          <div className='flex justify-between items-center'>
            <div>
              <h4 className='text-xl font-semibold mb-2'>Booking Summary</h4>
              <div className='space-y-1 text-stone-300'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>{selectedMassage.emoji}</span>
                  <span>{selectedMassage.name}</span>
                </div>
                <div>
                  {selectedDuration.duration} minutes • {persons}{' '}
                  {persons === 1 ? 'person' : 'people'}
                </div>
                {date && time && (
                  <div>
                    {new Date(date).toLocaleDateString()} at {time}
                  </div>
                )}
              </div>
            </div>
            <div className='text-right'>
              <div className='text-3xl font-bold'>${totalPrice}</div>
              <div className='text-stone-300'>Total Price</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4'>
          <button
            onClick={onCancel}
            className='flex-1 py-4 border-2 border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors font-semibold'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              isFormValid && !isSubmitting
                ? 'bg-stone-800 text-white hover:bg-stone-700'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className='w-5 h-5' />
                Confirm Booking
                <ArrowRight className='w-5 h-5' />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InlineBookingForm;
