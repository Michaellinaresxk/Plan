import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
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
  CheckCircle,
} from 'lucide-react';

// ✅ Location options configuration - consistent with other forms
const LOCATION_OPTIONS = [
  { id: 'punta-cana-resorts', name: 'Punta Cana Resorts' },
  { id: 'cap-cana', name: 'Cap Cana' },
  { id: 'bavaro', name: 'Bavaro' },
  { id: 'punta-village', name: 'Punta Village' },
  { id: 'uvero-alto', name: 'Uvero Alto' },
  { id: 'macao', name: 'Macao' },
] as const;

interface MassageFormProps {
  selectedMassageData: any; // The pre-selected massage service
  onSubmit?: (formData: any) => void;
  onCancel: () => void;
}

const MassageForm: React.FC<MassageFormProps> = ({
  selectedMassageData,
  onSubmit,
  onCancel,
}) => {
  const router = useRouter();
  const { setReservationData } = useReservation();

  // ✅ Early return if no massage data is provided
  if (!selectedMassageData || !selectedMassageData.durations) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-stone-800 mb-4'>
            No massage selected
          </h2>
          <button
            onClick={onCancel}
            className='px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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

  // ✅ Safe initialization with fallback for undefined selectedMassageData
  const [formData, setFormData] = useState({
    selectedDuration: selectedMassageData?.durations?.[0] || {
      duration: 60,
      price: 100,
    },
    date: '',
    time: '',
    location: '', // Now stores location ID
    persons: 1,
    specialNeeds: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Identical helper function to InlineBookingForm
  const updateFormField = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear specific error when user corrects it
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

  // ✅ Identical location selection handler
  const handleLocationSelect = useCallback(
    (locationId) => {
      updateFormField('location', locationId);
    },
    [updateFormField]
  );

  // ✅ Identical validation logic
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.location) {
      newErrors.location = 'Please select a location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.date, formData.time, formData.location]);

  // ✅ Identical derived calculations
  const totalPrice = formData.selectedDuration.price * formData.persons;
  const isFormValid = formData.date && formData.time && formData.location;

  // ✅ Identical submit handler
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Get selected location name
      const selectedLocation = LOCATION_OPTIONS.find(
        (loc) => loc.id === formData.location
      );

      // Structure exactly as expected by confirmation page
      const reservationData = {
        service: selectedMassageData,
        formData: {
          serviceId: selectedMassageData.id,
          serviceName: selectedMassageData.name,
          serviceType: 'massage',
          duration: formData.selectedDuration.duration,
          date: formData.date,
          time: formData.time,
          location: formData.location, // Location ID
          locationName: selectedLocation?.name || formData.location, // Location name for display
          persons: formData.persons,
          specialNeeds: formData.specialNeeds,
          calculatedPrice: totalPrice,
        },
        totalPrice: totalPrice,
        bookingDate: new Date(),
        // ✅ Add massage specific data similar to other forms
        massageSpecifics: {
          duration: formData.selectedDuration.duration,
          location: formData.location,
          locationName: selectedLocation?.name || formData.location,
          persons: formData.persons,
          specialNeeds: formData.specialNeeds,
          massageType: selectedMassageData.name,
          intensity: selectedMassageData.intensity,
        },
      };

      console.log('MassageForm sending reservationData:', reservationData);
      console.log('📍 Selected location:', selectedLocation);

      // Set reservation data in context
      setReservationData(reservationData);

      // Navigate to confirmation
      router.push('/reservation-confirmation');

      // Also call onSubmit if provided for compatibility
      if (onSubmit) {
        onSubmit(reservationData);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error processing booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateForm,
    selectedMassageData,
    formData,
    totalPrice,
    setReservationData,
    router,
    onSubmit,
  ]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-stone-50 to-stone-100'>
      <div className='max-w-4xl mx-auto px-6 py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-3xl shadow-2xl p-8 border border-stone-200'
        >
          {/* Header - Identical to InlineBookingForm */}
          <div className='flex items-center justify-between mb-8 pb-6 border-b border-stone-200'>
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-2xl'>
                {selectedMassageData.emoji}
              </div>
              <div>
                <h3 className='text-2xl font-semibold text-stone-800 mb-1'>
                  Complete your {selectedMassageData.name} booking
                </h3>
                <p className='text-stone-600'>
                  {selectedMassageData.description}
                </p>
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
            {/* Duration Selection - Identical */}
            <div>
              <h4 className='text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2'>
                <Timer className='w-5 h-5 text-green-800' />
                Treatment Duration
              </h4>
              <div
                className={`grid gap-4 ${
                  selectedMassageData.durations.length === 1
                    ? 'grid-cols-1 max-w-sm'
                    : selectedMassageData.durations.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-3'
                }`}
              >
                {selectedMassageData.durations.map((option, index) => (
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

            {/* Date & Time - Identical */}
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

            {/* Location Selection - Identical */}
            <div>
              <label className='flex items-center text-lg font-semibold text-stone-800 mb-4'>
                <MapPin className='w-5 h-5 mr-2 text-green-800' />
                Select your location *
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {LOCATION_OPTIONS.map((location) => (
                  <div
                    key={location.id}
                    className={`
                      border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
                      ${
                        formData.location === location.id
                          ? 'border-stone-800 bg-stone-50 shadow-lg ring-2 ring-stone-200'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-25'
                      }
                    `}
                    onClick={() => handleLocationSelect(location.id)}
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all
                          ${
                            formData.location === location.id
                              ? 'border-stone-800 bg-stone-800'
                              : 'border-stone-300'
                          }
                        `}
                      >
                        {formData.location === location.id && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <MapPin className='w-4 h-4 mr-2 text-stone-600' />
                        <span className='font-medium text-stone-800 text-sm'>
                          {location.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.location && (
                <p className='text-red-500 text-sm mt-3 flex items-center'>
                  <Info className='w-3 h-3 mr-1' />
                  {errors.location}
                </p>
              )}

              {/* Display selected location */}
              {formData.location && (
                <div className='mt-4 p-3 bg-stone-100 rounded-lg border border-stone-200'>
                  <p className='text-sm text-stone-700 flex items-center'>
                    <CheckCircle className='w-4 h-4 mr-2 text-green-600' />
                    Selected:{' '}
                    <span className='font-medium ml-1'>
                      {
                        LOCATION_OPTIONS.find(
                          (loc) => loc.id === formData.location
                        )?.name
                      }
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Number of People - Identical */}
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
                      updateFormField(
                        'persons',
                        Math.max(1, formData.persons - 1)
                      )
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
                        Math.min(
                          selectedMassageData?.maxPersons || 4,
                          formData.persons + 1
                        )
                      )
                    }
                    className='w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={
                      formData.persons >= (selectedMassageData?.maxPersons || 4)
                    }
                  >
                    <Plus className='w-5 h-5 text-stone-600' />
                  </button>
                </div>
                <span className='text-stone-600'>
                  Maximum: {selectedMassageData?.maxPersons || 4} people
                </span>
              </div>
            </div>

            {/* Special Needs & Disability - Identical */}
            <div>
              <label className='block text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2'>
                <Accessibility className='w-5 h-5 text-green-800' />
                Special Needs & Disabilities
              </label>
              <textarea
                value={formData.specialNeeds}
                onChange={(e) =>
                  updateFormField('specialNeeds', e.target.value)
                }
                placeholder='Please mention any medical conditions, disabilities, injuries, pregnancy, allergies, mobility restrictions, or special accommodations we should consider to personalize your experience safely...'
                className='w-full p-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none h-32 text-lg'
              />
              <div className='flex items-start gap-2 mt-3 text-stone-600'>
                <Info className='w-5 h-5 mt-0.5 flex-shrink-0' />
                <p className='text-sm leading-relaxed'>
                  This information is confidential and helps us adapt the
                  treatment to your specific needs. Our therapists are trained
                  to work with various conditions and limitations.
                </p>
              </div>
            </div>

            {/* Price Summary - Identical */}
            <div className='bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl p-6'>
              <div className='flex justify-between items-center'>
                <div>
                  <h4 className='text-xl font-semibold mb-2'>
                    Booking Summary
                  </h4>
                  <div className='space-y-1 text-stone-300'>
                    <div className='flex items-center gap-2'>
                      <span className='text-lg'>
                        {selectedMassageData.emoji}
                      </span>
                      <span>{selectedMassageData.name}</span>
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
                      <div className='text-sm flex items-center'>
                        <MapPin className='w-3 h-3 mr-1' />
                        {
                          LOCATION_OPTIONS.find(
                            (loc) => loc.id === formData.location
                          )?.name
                        }
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

            {/* Action Buttons - Identical */}
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
      </div>
    </div>
  );
};

export default MassageForm;
