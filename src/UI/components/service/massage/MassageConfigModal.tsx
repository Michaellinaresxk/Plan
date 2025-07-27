import { motion } from 'framer-motion';
import IntensityBadge from './IntensityBadge';
import {
  ArrowRight,
  Calendar,
  Clock,
  Heart,
  Info,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  Timer,
  Users,
  X,
} from 'lucide-react';

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

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const totalPrice = formData.selectedDuration.price * formData.persons;
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
        },
        bookingDate: new Date(`${formData.date}T${formData.time}`),
        clientInfo: undefined,
      };

      await onConfirm(reservationData);
    } catch (error) {
      console.error('Error submitting massage booking:', error);
      setErrors({ submit: 'Failed to submit booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = formData.selectedDuration.price * formData.persons;
  const isValid = formData.date && formData.time && formData.location.trim();

  if (!isOpen) return null;

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
        className='relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
      >
        <div className='sticky top-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-6'>
              <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-lg'>
                {massage.emoji}
              </div>
              <div>
                <h3 className='text-2xl font-bold mb-1'>{massage.name}</h3>
                <p className='text-emerald-100 text-lg'>
                  {massage.description}
                </p>
                <div className='flex items-center gap-4 mt-2'>
                  <IntensityBadge intensity={massage.intensity} />
                  {massage.isPremium && (
                    <span className='bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold'>
                      Premium Experience
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className='p-3 hover:bg-white/10 rounded-full transition-colors'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
        </div>

        <div className='p-8 space-y-8'>
          <div className='bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100'>
            <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
              <Sparkles className='w-5 h-5 text-emerald-600' />
              Treatment Benefits
            </h4>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {massage.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className='bg-white/70 backdrop-blur-sm text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium text-center border border-emerald-200'
                >
                  {benefit}
                </div>
              ))}
            </div>
            <p className='text-gray-700 mt-4 leading-relaxed'>
              {massage.longDescription}
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div>
              <label className='block text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                <Timer className='w-5 h-5 text-emerald-600' />
                Choose Your Experience
              </label>
              <div className='space-y-4'>
                {massage.durations.map((option) => (
                  <button
                    key={option.duration}
                    onClick={() => updateField('selectedDuration', option)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                      formData.selectedDuration.duration === option.duration
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                        : 'border-gray-200 hover:border-emerald-300 bg-white'
                    }`}
                  >
                    <div className='flex justify-between items-center'>
                      <div>
                        <div className='font-bold text-gray-900 text-lg mb-1'>
                          {option.duration} minutes
                        </div>
                        <div className='text-sm text-gray-600'>
                          {option.popular
                            ? 'Most Popular Choice'
                            : 'Perfect for focused treatment'}
                        </div>
                        {option.popular && (
                          <div className='mt-2'>
                            <span className='bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold'>
                              Recommended
                            </span>
                          </div>
                        )}
                      </div>
                      <div className='text-right'>
                        <div className='text-2xl font-bold text-emerald-600'>
                          ${option.price}
                        </div>
                        <div className='text-sm text-gray-500'>per person</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='block text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                <Users className='w-5 h-5 text-emerald-600' />
                Group Size
              </label>
              <div className='bg-gray-50 rounded-2xl p-6'>
                <div className='flex items-center justify-center gap-6 mb-4'>
                  <button
                    onClick={() =>
                      updateField('persons', Math.max(1, formData.persons - 1))
                    }
                    disabled={formData.persons <= 1}
                    className='w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 transition-all shadow-sm'
                  >
                    <Minus className='w-5 h-5 text-gray-600' />
                  </button>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-gray-900 mb-1'>
                      {formData.persons}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {formData.persons === 1 ? 'person' : 'people'}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      updateField(
                        'persons',
                        Math.min(massage.maxPersons, formData.persons + 1)
                      )
                    }
                    disabled={formData.persons >= massage.maxPersons}
                    className='w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 transition-all shadow-sm'
                  >
                    <Plus className='w-5 h-5 text-gray-600' />
                  </button>
                </div>
                <div className='text-center text-sm text-gray-600'>
                  Maximum capacity: {massage.maxPersons}{' '}
                  {massage.maxPersons === 1 ? 'person' : 'people'}
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                <Calendar className='w-5 h-5 text-emerald-600' />
                Preferred Date *
              </label>
              <input
                type='date'
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-lg ${
                  errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.date && (
                <p className='text-red-500 text-sm mt-2'>{errors.date}</p>
              )}
            </div>

            <div>
              <label className='block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                <Clock className='w-5 h-5 text-emerald-600' />
                Preferred Time *
              </label>
              <select
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
                className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-lg ${
                  errors.time ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value=''>Select your preferred time</option>
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

          <div>
            <label className='block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
              <MapPin className='w-5 h-5 text-emerald-600' />
              Service Location *
            </label>
            <input
              type='text'
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder='Enter the complete address where you would like your massage'
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-lg ${
                errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.location && (
              <p className='text-red-500 text-sm mt-2'>{errors.location}</p>
            )}
            <p className='text-gray-600 text-sm mt-2'>
              We provide in-home, hotel, and office massage services throughout
              the area
            </p>
          </div>

          <div>
            <label className='block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
              <Heart className='w-5 h-5 text-emerald-600' />
              Special Requests & Health Information
            </label>
            <textarea
              value={formData.specialNeeds}
              onChange={(e) => updateField('specialNeeds', e.target.value)}
              placeholder='Please share any health conditions, injuries, allergies, or special preferences to help us customize your perfect massage experience...'
              className='w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none h-24 transition-all'
            />
            <div className='flex items-start gap-3 mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200'>
              <Info className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
              <p className='text-sm text-blue-800'>
                Your comfort and safety are our priority. All information helps
                our licensed therapists provide the most beneficial and relaxing
                experience possible.
              </p>
            </div>
          </div>

          <div className='bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-2xl p-8 shadow-xl'>
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
              <div className='flex-1'>
                <h4 className='text-2xl font-bold mb-4 flex items-center gap-2'>
                  <Sparkles className='w-6 h-6' />
                  Your Wellness Experience
                </h4>
                <div className='space-y-2 text-emerald-100'>
                  <div className='flex items-center gap-3 text-lg'>
                    <span className='text-2xl'>{massage.emoji}</span>
                    <span className='font-semibold'>{massage.name}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <Timer className='w-4 h-4' />
                    <span>
                      {formData.selectedDuration.duration} minutes of pure bliss
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <Users className='w-4 h-4' />
                    <span>
                      {formData.persons}{' '}
                      {formData.persons === 1 ? 'person' : 'people'}
                    </span>
                  </div>
                  {formData.date && formData.time && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Calendar className='w-4 h-4' />
                      <span>
                        {new Date(formData.date).toLocaleDateString()} at{' '}
                        {formData.time}
                      </span>
                    </div>
                  )}
                  {formData.location && (
                    <div className='flex items-center gap-2 text-sm'>
                      <MapPin className='w-4 h-4' />
                      <span className='truncate'>{formData.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className='text-right lg:text-center'>
                <div className='text-4xl lg:text-5xl font-bold mb-2'>
                  ${totalPrice}
                </div>
                <div className='text-emerald-200 text-lg'>Total Investment</div>
                <div className='text-emerald-200 text-sm mt-1'>
                  in your wellness
                </div>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-xl'>
              <p className='text-red-800'>{errors.submit}</p>
            </div>
          )}
        </div>

        <div className='sticky bottom-0 bg-white border-t border-gray-200 p-6'>
          <div className='flex gap-4'>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className='flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
                isValid && !isSubmitting
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />
                  Processing your booking...
                </>
              ) : (
                <>
                  <Heart className='w-5 h-5' />
                  Confirm My Wellness Experience
                  <ArrowRight className='w-5 h-5' />
                </>
              )}
            </button>
          </div>
          <p className='text-center text-sm text-gray-500 mt-3'>
            Secure booking • Flexible rescheduling • Licensed therapists
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MassageConfigModal;
