import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Music,
  Calendar,
  Clock,
  Users,
  CreditCard,
  AlertCircle,
  Star,
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
} from 'lucide-react';

interface LiveMusicFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const LiveMusicForm: React.FC<LiveMusicFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    performerType: '',
    duration: '',
    hasSpecificSongs: false,
    specificSongs: '',
    musicGenre: '',
    specialRequests: '',
    venue: '',
    guestCount: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(service.price);

  // Steps configuration
  const steps = [
    {
      id: 'basics',
      title: 'Event Details',
      icon: Calendar,
      description: 'When and where is your event?',
    },
    {
      id: 'performers',
      title: 'Choose Your Musicians',
      icon: Users,
      description: 'Select the perfect performers',
    },
    {
      id: 'music',
      title: 'Musical Preferences',
      icon: Music,
      description: 'Tell us about your music style',
    },
    {
      id: 'details',
      title: 'Final Details',
      icon: Star,
      description: 'Any special requests?',
    },
  ];

  // Performer types with pricing
  const performerTypes = [
    {
      id: 'soloist',
      name: 'Solo Artist',
      description: 'Perfect intimate performances',
      price: 150,
      icon: '🎸',
      capacity: '1-30',
      specialties: ['Acoustic', 'Vocals', 'Guitar/Piano'],
      gradient: 'from-orange-400 to-pink-500',
    },
    {
      id: 'duo',
      name: 'Musical Duo',
      description: 'Beautiful harmonies & variety',
      price: 250,
      icon: '🎭',
      capacity: '1-50',
      specialties: ['Harmonies', 'Multiple Instruments', 'Interactive'],
      gradient: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'trio',
      name: 'Talented Trio',
      description: 'Rich sound with full coverage',
      price: 350,
      icon: '🎼',
      capacity: '1-80',
      specialties: ['Full Band Sound', 'Diverse Repertoire', 'Professional'],
      gradient: 'from-green-400 to-emerald-500',
    },
    {
      id: 'band',
      name: 'Full Band',
      description: 'Complete concert experience',
      price: 500,
      icon: '🎪',
      capacity: '1-150',
      specialties: ['Complete Sound', 'High Energy', 'Party Atmosphere'],
      gradient: 'from-purple-400 to-pink-500',
    },
  ];

  // Duration options
  const durationOptions = [
    {
      id: 'regular',
      name: 'Classic Sets',
      description: '2 sets of 45 minutes',
      sets: 2,
      setDuration: 45,
      breakTime: 15,
      icon: '⏰',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'triple',
      name: 'Mini Sessions',
      description: '3 sets of 30 minutes',
      sets: 3,
      setDuration: 30,
      breakTime: 15,
      icon: '🎵',
      color: 'from-green-500 to-teal-600',
    },
    {
      id: 'continuous',
      name: 'Non-Stop Music',
      description: '90 minutes continuous',
      sets: 1,
      setDuration: 90,
      breakTime: 0,
      icon: '🎶',
      color: 'from-purple-500 to-pink-600',
    },
  ];

  // Music genres
  const musicGenres = [
    {
      id: 'jazz',
      name: 'Jazz & Blues',
      icon: '🎺',
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'acoustic',
      name: 'Acoustic Pop',
      icon: '🎸',
      color: 'from-emerald-400 to-green-500',
    },
    {
      id: 'classical',
      name: 'Classical',
      icon: '🎻',
      color: 'from-indigo-400 to-purple-500',
    },
    {
      id: 'caribbean',
      name: 'Caribbean',
      icon: '🏝️',
      color: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'pop',
      name: 'Pop Hits',
      icon: '🎤',
      color: 'from-pink-400 to-rose-500',
    },
    {
      id: 'latin',
      name: 'Latin Vibes',
      icon: '💃',
      color: 'from-red-400 to-pink-500',
    },
    {
      id: 'international',
      name: 'World Music',
      icon: '🌍',
      color: 'from-teal-400 to-cyan-500',
    },
    {
      id: 'custom',
      name: 'Custom Mix',
      icon: '🎨',
      color: 'from-violet-400 to-purple-500',
    },
  ];

  // Calculate price
  useEffect(() => {
    const selectedPerformer = performerTypes.find(
      (p) => p.id === formData.performerType
    );
    const selectedDuration = durationOptions.find(
      (d) => d.id === formData.duration
    );

    if (selectedPerformer && selectedDuration) {
      let price = selectedPerformer.price * selectedDuration.sets;
      if (formData.guestCount > 50) price *= 1.2;
      setCurrentPrice(price);
    }
  }, [formData.performerType, formData.duration, formData.guestCount]);

  // Navigation
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Event Details
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.startTime) newErrors.startTime = 'Time is required';
        if (!formData.venue) newErrors.venue = 'Venue is required';
        break;
      case 1: // Performers
        if (!formData.performerType)
          newErrors.performerType = 'Please select performers';
        if (!formData.duration) newErrors.duration = 'Please select duration';
        break;
      case 2: // Music
        if (!formData.musicGenre)
          newErrors.musicGenre = 'Please select music style';
        break;
      case 3: // Details - optional
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      const submissionData = {
        ...formData,
        calculatedPrice: currentPrice,
        serviceId: service.id,
        serviceName: service.name,
      };
      onSubmit(submissionData);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const updateGuestCount = (increment: boolean) => {
    handleChange(
      'guestCount',
      increment ? formData.guestCount + 1 : Math.max(1, formData.guestCount - 1)
    );
  };

  // Step content renderers
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='space-y-6'>
            <h3 className='text-2xl font-bold text-gray-800 text-center mb-8'>
              Start with the basics
            </h3>

            {/* Date & Time */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700 flex items-center'>
                  <Calendar className='w-4 h-4 mr-2 text-blue-500' />
                  Event Date *
                </label>
                <input
                  type='date'
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.date
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className='text-red-500 text-sm flex items-center'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    {errors.date}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700 flex items-center'>
                  <Clock className='w-4 h-4 mr-2 text-blue-500' />
                  Start Time *
                </label>
                <input
                  type='time'
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.startTime
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.startTime && (
                  <p className='text-red-500 text-sm flex items-center'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    {errors.startTime}
                  </p>
                )}
              </div>
            </div>

            {/* Guest Count */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 flex items-center'>
                <Users className='w-4 h-4 mr-2 text-blue-500' />
                Expected Guests
              </label>
              <div className='flex items-center justify-center'>
                <div className='flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden w-48'>
                  <button
                    type='button'
                    onClick={() => updateGuestCount(false)}
                    className='p-3 bg-gray-50 hover:bg-gray-100 transition-colors'
                  >
                    <ChevronLeft className='w-5 h-5' />
                  </button>
                  <div className='flex-1 py-3 text-center font-bold text-lg'>
                    {formData.guestCount}
                  </div>
                  <button
                    type='button'
                    onClick={() => updateGuestCount(true)}
                    className='p-3 bg-gray-50 hover:bg-gray-100 transition-colors'
                  >
                    <ChevronRight className='w-5 h-5' />
                  </button>
                </div>
              </div>
            </div>

            {/* Venue */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 flex items-center'>
                <MapPin className='w-4 h-4 mr-2 text-blue-500' />
                Venue Address *
              </label>
              <textarea
                value={formData.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
                placeholder='Enter the complete address where the performance will take place...'
                rows={3}
                className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                  errors.venue
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.venue && (
                <p className='text-red-500 text-sm flex items-center'>
                  <AlertCircle className='w-4 h-4 mr-1' />
                  {errors.venue}
                </p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className='space-y-8'>
            <h3 className='text-2xl font-bold text-gray-800 text-center mb-8'>
              Choose your perfect performers
            </h3>

            {/* Performer Types */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {performerTypes.map((performer) => (
                <div
                  key={performer.id}
                  className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    formData.performerType === performer.id
                      ? 'ring-4 ring-blue-500 shadow-2xl'
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                  onClick={() => handleChange('performerType', performer.id)}
                >
                  <div
                    className={`bg-gradient-to-br ${performer.gradient} p-6 text-white`}
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <div className='text-4xl'>{performer.icon}</div>
                      <div className='text-right'>
                        <div className='text-2xl font-bold'>
                          ${performer.price}
                        </div>
                        <div className='text-sm opacity-90'>per set</div>
                      </div>
                    </div>
                    <h4 className='text-xl font-bold mb-2'>{performer.name}</h4>
                    <p className='text-sm opacity-90 mb-4'>
                      {performer.description}
                    </p>
                    <div className='flex flex-wrap gap-1 mb-3'>
                      {performer.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className='bg-white/20 text-xs px-2 py-1 rounded-full'
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <div className='text-sm opacity-90'>
                      Perfect for {performer.capacity} guests
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.performerType && (
              <p className='text-red-500 text-center flex items-center justify-center'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {errors.performerType}
              </p>
            )}

            {/* Duration Options */}
            <div className='space-y-4'>
              <h4 className='text-lg font-semibold text-gray-800 text-center'>
                How long should they play?
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {durationOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.duration === option.id
                        ? 'ring-4 ring-blue-500 transform scale-105'
                        : 'hover:scale-105'
                    }`}
                    onClick={() => handleChange('duration', option.id)}
                  >
                    <div
                      className={`bg-gradient-to-br ${option.color} p-6 text-white text-center`}
                    >
                      <div className='text-3xl mb-3'>{option.icon}</div>
                      <h5 className='font-bold text-lg mb-2'>{option.name}</h5>
                      <p className='text-sm opacity-90 mb-4'>
                        {option.description}
                      </p>
                      <div className='grid grid-cols-3 gap-2 text-xs'>
                        <div>
                          <div className='font-bold text-lg'>{option.sets}</div>
                          <div className='opacity-80'>Sets</div>
                        </div>
                        <div>
                          <div className='font-bold text-lg'>
                            {option.setDuration}m
                          </div>
                          <div className='opacity-80'>Each</div>
                        </div>
                        <div>
                          <div className='font-bold text-lg'>
                            {option.breakTime}m
                          </div>
                          <div className='opacity-80'>Break</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.duration && (
                <p className='text-red-500 text-center flex items-center justify-center'>
                  <AlertCircle className='w-4 h-4 mr-1' />
                  {errors.duration}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className='space-y-8'>
            <h3 className='text-2xl font-bold text-gray-800 text-center mb-8'>
              What's your musical vibe?
            </h3>

            {/* Music Genres */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {musicGenres.map((genre) => (
                <div
                  key={genre.id}
                  className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    formData.musicGenre === genre.id
                      ? 'ring-4 ring-blue-500 shadow-xl'
                      : 'shadow-md hover:shadow-lg'
                  }`}
                  onClick={() => handleChange('musicGenre', genre.id)}
                >
                  <div
                    className={`bg-gradient-to-br ${genre.color} p-6 text-white text-center`}
                  >
                    <div className='text-3xl mb-3'>{genre.icon}</div>
                    <h5 className='font-bold text-sm'>{genre.name}</h5>
                  </div>
                </div>
              ))}
            </div>
            {errors.musicGenre && (
              <p className='text-red-500 text-center flex items-center justify-center'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {errors.musicGenre}
              </p>
            )}

            {/* Specific Songs */}
            <div className='bg-gray-50 p-6 rounded-xl space-y-4'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={formData.hasSpecificSongs}
                  onChange={(e) =>
                    handleChange('hasSpecificSongs', e.target.checked)
                  }
                  className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                />
                <span className='font-medium text-gray-800'>
                  I have specific songs in mind
                </span>
              </label>

              {formData.hasSpecificSongs && (
                <textarea
                  value={formData.specificSongs}
                  onChange={(e) =>
                    handleChange('specificSongs', e.target.value)
                  }
                  placeholder='List your favorite songs or special requests...'
                  rows={4}
                  className='w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none'
                />
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className='space-y-8'>
            <h3 className='text-2xl font-bold text-gray-800 text-center mb-8'>
              Any special touches?
            </h3>

            <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl'>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Special Requests (Optional)
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) =>
                  handleChange('specialRequests', e.target.value)
                }
                placeholder='Any special songs, themes, or requirements for your event...'
                rows={4}
                className='w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none'
              />
            </div>

            {/* Price Summary */}
            <div className='bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white'>
              <h4 className='text-lg font-semibold mb-4 text-center'>
                Your Booking Summary
              </h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span>Performers:</span>
                  <span>
                    {
                      performerTypes.find(
                        (p) => p.id === formData.performerType
                      )?.name
                    }
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Duration:</span>
                  <span>
                    {
                      durationOptions.find((d) => d.id === formData.duration)
                        ?.name
                    }
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Music Style:</span>
                  <span>
                    {
                      musicGenres.find((g) => g.id === formData.musicGenre)
                        ?.name
                    }
                  </span>
                </div>
                <div className='border-t border-white/20 pt-2 mt-4'>
                  <div className='flex justify-between items-center text-xl font-bold'>
                    <span>Total Price:</span>
                    <span>${currentPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-2xl shadow-2xl'>
        {/* Header with Steps */}
        <div className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6'>
          <h2 className='text-2xl font-bold text-white text-center mb-6'>
            Book Your Live Music Experience
          </h2>

          {/* Step Indicator */}
          <div className='flex justify-between items-center'>
            {steps.map((step, index) => (
              <div key={step.id} className='flex items-center'>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    index <= currentStep
                      ? 'bg-white text-indigo-600'
                      : 'bg-white/20 text-white/60'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className='w-5 h-5' />
                  ) : (
                    <step.icon className='w-5 h-5' />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-1 mx-2 transition-all ${
                      index < currentStep ? 'bg-white' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className='text-center mt-4'>
            <h3 className='text-lg font-semibold text-white'>
              {steps[currentStep].title}
            </h3>
            <p className='text-white/80 text-sm'>
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className='p-8 min-h-[500px]'>{renderStepContent()}</div>

        {/* Navigation Footer */}
        <div className='bg-gray-50 p-6 flex justify-between items-center'>
          <button
            type='button'
            onClick={currentStep === 0 ? onCancel : prevStep}
            className='px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors flex items-center'
          >
            <ChevronLeft className='w-4 h-4 mr-2' />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </button>

          <div className='text-sm text-gray-500'>
            Step {currentStep + 1} of {steps.length}
          </div>

          <button
            type='button'
            onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
            className='px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center'
          >
            {currentStep === steps.length - 1 ? (
              <>
                <CreditCard className='w-4 h-4 mr-2' />
                Book Now
              </>
            ) : (
              <>
                Next
                <ChevronRight className='w-4 h-4 ml-2' />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveMusicForm;
