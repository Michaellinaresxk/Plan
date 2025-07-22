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
} from 'lucide-react';
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
    '08:00',
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

  // ✅ Estado inicial bien estructurado
  const [formData, setFormData] = useState({
    selectedDuration: selectedMassage.durations[0],
    date: '',
    time: '',
    location: '',
    persons: 1,
    specialNeeds: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Función helper para actualizar estado sin resetear otros campos
  const updateFormField = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Limpiar error específico cuando el usuario corrige
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // ✅ Validación mejorada
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.date, formData.time, formData.location]);

  // ✅ Cálculos derivados
  const totalPrice = formData.selectedDuration.price * formData.persons;
  const isFormValid =
    formData.date && formData.time && formData.location.trim();

  // ✅ Submit handler corregido - manteniendo estructura original
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Estructura exacta que espera la página de confirmación
      const reservationData = {
        service: selectedMassage,
        formData: {
          serviceId: selectedMassage.id,
          serviceName: selectedMassage.name,
          duration: formData.selectedDuration.duration,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          persons: formData.persons,
          specialNeeds: formData.specialNeeds,
          calculatedPrice: totalPrice,
        },
        totalPrice: totalPrice, // Asegurar que sea un número
        bookingDate: new Date(),
      };

      console.log(
        'InlineBookingForm sending reservationData:',
        reservationData
      );
      await onConfirm(reservationData);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error processing booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, selectedMassage, formData, totalPrice, onConfirm]);

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
          type='button'
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
                type='button'
                onClick={() => updateFormField('selectedDuration', option)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  formData.selectedDuration.duration === option.duration
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
                {formData.persons > 1 && (
                  <div className='text-sm text-stone-500 mt-1'>
                    ${option.price * formData.persons} total
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
              value={formData.date}
              onChange={(e) => updateFormField('date', e.target.value)}
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
            <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
              <Clock className='w-5 h-5 text-green-800' />
              Time
            </label>
            <select
              value={formData.time}
              onChange={(e) => updateFormField('time', e.target.value)}
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

        {/* Location - ✅ CORREGIDO */}
        <div>
          <label className='flex items-center text-lg font-semibold text-stone-800 mb-3'>
            <MapPin className='w-5 h-5 mr-2 text-green-800' />
            Address *
          </label>
          <input
            type='text'
            name='location'
            value={formData.location}
            onChange={(e) => updateFormField('location', e.target.value)}
            className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent text-lg transition-colors ${
              errors.location
                ? 'border-red-300 bg-red-50 focus:border-red-400'
                : 'border-stone-300'
            }`}
            placeholder='Please provide the complete address where the service will take place.'
          />
          {errors.location && (
            <p className='text-red-500 text-sm mt-2'>{errors.location}</p>
          )}
        </div>

        {/* Number of People - ✅ CORREGIDO */}
        <div>
          <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
            <Users className='w-5 h-5 text-green-800' />
            Number of People
          </label>
          <div className='flex items-center justify-between bg-stone-50 rounded-xl p-4'>
            <div className='flex items-center gap-4'>
              <button
                type='button'
                onClick={() =>
                  updateFormField('persons', Math.max(1, formData.persons - 1))
                }
                className='w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={formData.persons <= 1}
              >
                <Minus className='w-5 h-5 text-stone-600' />
              </button>
              <span className='text-2xl font-semibold text-stone-800 w-12 text-center'>
                {formData.persons}
              </span>
              <button
                type='button'
                onClick={() =>
                  updateFormField(
                    'persons',
                    Math.min(selectedMassage.maxPersons, formData.persons + 1)
                  )
                }
                className='w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={formData.persons >= selectedMassage.maxPersons}
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
            value={formData.specialNeeds}
            onChange={(e) => updateFormField('specialNeeds', e.target.value)}
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
                  {formData.selectedDuration.duration} minutes •{' '}
                  {formData.persons}{' '}
                  {formData.persons === 1 ? 'person' : 'people'}
                </div>
                {formData.date && formData.time && (
                  <div>
                    {new Date(formData.date).toLocaleDateString()} at{' '}
                    {formData.time}
                  </div>
                )}
                {formData.location && (
                  <div className='text-sm'>📍 {formData.location}</div>
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
            type='button'
            onClick={onCancel}
            className='flex-1 py-4 border-2 border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors font-semibold'
          >
            Cancel
          </button>
          <button
            type='button'
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
