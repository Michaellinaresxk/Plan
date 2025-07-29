import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Calendar,
  Clock,
  CreditCard,
  AlertCircle,
  Check,
  MapPin,
  MessageSquare,
  User,
  Users,
  X,
  Crown,
  Star,
  Guitar,
  Piano,
  Mic,
  Plus,
  Youtube,
  Heart,
  Sparkles,
  ArrowRight,
  Timer,
  Play,
  Pause,
  Globe,
  CheckCircle,
  Wine,
  Building,
} from 'lucide-react';
import { useReservation } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';

// Location options configuration
const LOCATION_OPTIONS = [
  { id: 'punta-cana-resorts', name: 'Punta Cana Resorts' },
  { id: 'cap-cana', name: 'Cap Cana' },
  { id: 'bavaro', name: 'Bavaro' },
  { id: 'punta-village', name: 'Punta Village' },
] as const;

const LiveMusicForm = ({ service, onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { setReservationData } = useReservation();

  const [formData, setFormData] = useState({
    // Event Details
    date: '',
    startTime: '',
    location: '', // Changed to use location ID
    eventType: '',

    // Musicians Selection
    performerType: '',

    // Music Style
    musicGenre: '',

    // Performance Settings
    performanceFormat: '', // 'continuous', 'two-sets', 'three-sets'

    // Music Language
    musicLanguage: 'mixed', // 'english', 'spanish', 'mixed'

    // Music References
    musicReferences: [''],

    // Special Requests
    specialRequests: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensemble Options
  const performerTypes = [
    {
      id: 'soloist-acoustic',
      name: 'Acoustic Soloist',
      description: 'Intimate acoustic guitar and vocals for romantic ambiance',
      image:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format',
      price: 180,
      icon: <Mic className='w-5 h-5' />,
      badge: 'Popular',
      badgeColor: 'bg-blue-500',
    },
    {
      id: 'duo',
      name: 'Musical Duo',
      description:
        'Perfect harmony with guitar, vocals and complementary instruments',
      image:
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop&auto=format',
      price: 320,
      icon: <Users className='w-5 h-5' />,
      badge: 'Recommended',
      badgeColor: 'bg-green-500',
    },
    {
      id: 'trio',
      name: 'Musical Trio',
      description: 'Three-piece ensemble for fuller sound and variety',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
      price: 480,
      icon: <Music className='w-5 h-5' />,
      badge: 'Premium',
      badgeColor: 'bg-amber-500',
    },
    {
      id: 'quartet',
      name: 'Musical Quartet',
      description: 'Four musicians creating rich, full arrangements',
      image:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop&auto=format',
      price: 680,
      icon: <Guitar className='w-5 h-5' />,
      badge: 'Professional',
      badgeColor: 'bg-purple-500',
    },
    {
      id: 'quintet',
      name: 'Full Band (5+)',
      description: 'Complete band experience with full sound production',
      image:
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop&auto=format',
      price: 920,
      icon: <Crown className='w-5 h-5' />,
      badge: 'Luxury',
      badgeColor: 'bg-red-500',
    },
  ];

  // Music Styles
  const musicGenres = [
    {
      id: 'acoustic-pop',
      name: 'Acoustic & Pop',
      description: 'Relaxing acoustic covers and popular hits',
      color: 'from-green-400 to-emerald-600',
      icon: '🎸',
    },
    {
      id: 'jazz-lounge',
      name: 'Jazz & Lounge',
      description: 'Sophisticated jazz standards and smooth melodies',
      color: 'from-purple-400 to-indigo-600',
      icon: '🎷',
    },
    {
      id: 'latin-tropical',
      name: 'Latin & Tropical',
      description: 'Vibrant Latin rhythms and Caribbean influences',
      color: 'from-orange-400 to-red-600',
      icon: '🌴',
    },
    {
      id: 'rock-classics',
      name: 'Rock & Classics',
      description: 'Rock anthems and timeless classics',
      color: 'from-gray-400 to-gray-700',
      icon: '⚡',
    },
    {
      id: 'world-international',
      name: 'World & International',
      description: 'International music and diverse cultural sounds',
      color: 'from-blue-400 to-cyan-600',
      icon: '🌍',
    },
    {
      id: 'custom-mix',
      name: 'Custom Mix',
      description: 'Tell us your specific preferences',
      color: 'from-amber-400 to-yellow-600',
      icon: '✨',
    },
  ];

  // Modern Event Types with sophisticated design
  const eventTypes = [
    {
      id: 'wedding',
      name: 'Wedding Ceremony',
      icon: Heart,
      gradient: 'from-rose-400 via-pink-400 to-rose-500',
      description: 'Romantic melodies for your special day',
      accentColor: 'bg-rose-500',
      shadowColor: 'shadow-rose-500/20',
      bgHover: 'group-hover:bg-rose-50',
    },
    {
      id: 'anniversary',
      name: 'Anniversary',
      icon: Crown,
      gradient: 'from-red-400 via-rose-400 to-pink-500',
      description: 'Celebrating love and cherished memories',
      accentColor: 'bg-red-500',
      shadowColor: 'shadow-red-500/20',
      bgHover: 'group-hover:bg-red-50',
    },
    {
      id: 'birthday',
      name: 'Birthday Party',
      icon: Star,
      gradient: 'from-purple-400 via-indigo-400 to-purple-500',
      description: 'Joyful celebration of another year',
      accentColor: 'bg-purple-500',
      shadowColor: 'shadow-purple-500/20',
      bgHover: 'group-hover:bg-purple-50',
    },
    {
      id: 'dinner',
      name: 'Dinner Experience',
      icon: Wine,
      gradient: 'from-amber-400 via-orange-400 to-red-500',
      description: 'Sophisticated dining atmosphere',
      accentColor: 'bg-amber-500',
      shadowColor: 'shadow-amber-500/20',
      bgHover: 'group-hover:bg-amber-50',
    },
    {
      id: 'corporate',
      name: 'Corporate Event',
      icon: Building,
      gradient: 'from-slate-400 via-gray-500 to-slate-600',
      description: 'Professional networking ambiance',
      accentColor: 'bg-slate-500',
      shadowColor: 'shadow-slate-500/20',
      bgHover: 'group-hover:bg-slate-50',
    },
    {
      id: 'celebration',
      name: 'Special Celebration',
      icon: Sparkles,
      gradient: 'from-emerald-400 via-teal-400 to-cyan-500',
      description: 'Memorable moments deserve music',
      accentColor: 'bg-emerald-500',
      shadowColor: 'shadow-emerald-500/20',
      bgHover: 'group-hover:bg-emerald-50',
    },
  ];

  const performanceFormats = [
    {
      id: 'continuous',
      name: '90 Minutes Continuous',
      description: 'One continuous 1.5-hour performance',
      icon: <Play className='w-5 h-5' />,
      duration: '90 min non-stop',
    },
    {
      id: 'two-sets',
      name: 'Two Sets of 45 Minutes',
      description: 'Two 45-minute sets with a break in between',
      icon: <Pause className='w-5 h-5' />,
      duration: '45 min + 45 min',
    },
    {
      id: 'three-sets',
      name: 'Three Sets of 30 Minutes',
      description: 'Three 30-minute sets with breaks',
      icon: <Timer className='w-5 h-5' />,
      duration: '30 min + 30 min + 30 min',
    },
  ];

  const musicLanguages = [
    {
      id: 'english',
      name: 'English',
      description: 'Songs primarily in English',
      icon: '🇺🇸',
    },
    {
      id: 'spanish',
      name: 'Spanish',
      description: 'Songs primarily in Spanish',
      icon: '🇪🇸',
    },
    {
      id: 'mixed',
      name: 'Mixed Languages',
      description: 'Combination of English and Spanish songs',
      icon: '🌍',
    },
  ];

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle location selection
  const handleLocationSelect = (locationId) => {
    setFormData((prev) => ({
      ...prev,
      location: locationId,
    }));

    // Clear location error if exists
    if (errors.location) {
      setErrors((prev) => ({
        ...prev,
        location: '',
      }));
    }
  };

  const addMusicReference = () => {
    setFormData((prev) => ({
      ...prev,
      musicReferences: [...prev.musicReferences, ''],
    }));
  };

  const removeMusicReference = (index) => {
    setFormData((prev) => ({
      ...prev,
      musicReferences: prev.musicReferences.filter((_, i) => i !== index),
    }));
  };

  const updateMusicReference = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      musicReferences: prev.musicReferences.map((ref, i) =>
        i === index ? value : ref
      ),
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.date) newErrors.date = 'Please select a date';
      if (!formData.startTime) newErrors.startTime = 'Please select start time';
      if (!formData.location) newErrors.location = 'Please select a location';
      if (!formData.eventType) newErrors.eventType = 'Please select event type';
    }

    if (step === 2) {
      if (!formData.performerType)
        newErrors.performerType = 'Please select your musicians';
      if (!formData.musicGenre)
        newErrors.musicGenre = 'Please select music style';
      if (!formData.performanceFormat)
        newErrors.performanceFormat = 'Please select performance format';
      if (!formData.musicLanguage)
        newErrors.musicLanguage = 'Please select song language preference';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      const selectedPerformer = performerTypes.find(
        (p) => p.id === formData.performerType
      );
      const selectedGenre = musicGenres.find(
        (g) => g.id === formData.musicGenre
      );
      const selectedFormat = performanceFormats.find(
        (f) => f.id === formData.performanceFormat
      );
      const selectedLanguage = musicLanguages.find(
        (l) => l.id === formData.musicLanguage
      );

      // Get selected location name
      const selectedLocation =
        LOCATION_OPTIONS.find((loc) => loc.id === formData.location)?.name ||
        formData.location;

      // ✅ CALCULAR EL PRECIO TOTAL ANTES DE CREAR LA RESERVA
      const totalPrice = selectedPerformer?.price || service.price || 180;

      // Create booking date properly
      const selectedDate = new Date(formData.date);
      const [hours, minutes] = formData.startTime.split(':');

      const bookingStartDate = new Date(selectedDate);
      bookingStartDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Live music performance typically lasts 1.5 hours (90 minutes)
      const bookingEndDate = new Date(bookingStartDate);
      bookingEndDate.setHours(
        bookingStartDate.getHours() + 1,
        bookingStartDate.getMinutes() + 30
      );

      // ✅ CREAR RESERVATION DATA SIGUIENDO EL PATRÓN DEL AIRPORT FORM
      const reservationData = {
        service,
        totalPrice, // ✅ CRÍTICO: totalPrice directamente en el objeto principal
        formData: {
          ...formData,
          // Filter out empty music references
          musicReferences: formData.musicReferences.filter(
            (ref) => ref.trim() !== ''
          ),
          serviceType: 'live-music',
          calculatedPrice: totalPrice,
          locationName: selectedLocation,
          performerName: selectedPerformer?.name,
          musicGenreName: selectedGenre?.name,
          performanceFormatName: selectedFormat?.name,
          performanceFormatDuration: selectedFormat?.duration,
          musicLanguageName: selectedLanguage?.name,
        },
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: 1,
          children: 0,
          total: 1,
        },
        selectedItems: [
          {
            id: formData.performerType,
            name: selectedPerformer?.name || 'Live Music Performance',
            quantity: 1,
            price: totalPrice,
            totalPrice: totalPrice,
            performerType: selectedPerformer?.name,
            musicGenre: selectedGenre?.name,
            performanceFormat: selectedFormat?.name,
            musicLanguage: selectedLanguage?.name,
            location: selectedLocation,
          },
        ],
        clientInfo: undefined, // Will be filled in the confirmation page
        liveMusicSpecifics: {
          performerType: formData.performerType,
          musicGenre: formData.musicGenre,
          performanceFormat: formData.performanceFormat,
          musicLanguage: formData.musicLanguage,
          location: formData.location,
          locationName: selectedLocation,
          eventType: formData.eventType,
          musicReferences: formData.musicReferences.filter((ref) => ref.trim()),
          specialRequests: formData.specialRequests,
        },
      };

      console.log(
        '🎵 LiveMusicForm - Reservation data created:',
        reservationData
      );
      console.log('💰 Total Price included:', totalPrice); // Debug log

      // ✅ USAR setReservationData Y NAVEGAR COMO EN AIRPORT FORM
      setReservationData(reservationData);
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ LiveMusicForm - Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPerformer = performerTypes.find(
    (p) => p.id === formData.performerType
  );
  const selectedGenre = musicGenres.find((g) => g.id === formData.musicGenre);
  const selectedFormat = performanceFormats.find(
    (f) => f.id === formData.performanceFormat
  );
  const selectedLanguage = musicLanguages.find(
    (l) => l.id === formData.musicLanguage
  );

  return (
    <div className='w-full max-w-6xl mx-auto'>
      {/* Progress Bar */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          {[1, 2, 3].map((step) => (
            <div key={step} className='flex items-center'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > step ? <Check className='w-5 h-5' /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`h-1 w-32 mx-4 transition-all duration-300 ${
                    currentStep > step
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-gray-800'>
            {currentStep === 1 && 'Event Details'}
            {currentStep === 2 && 'Musicians & Performance'}
            {currentStep === 3 && 'Music References & Final Details'}
          </h3>
          <p className='text-gray-600 text-sm'>Step {currentStep} of 3</p>
        </div>
      </div>

      <div className='bg-white rounded-3xl shadow-2xl overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-slate-800 to-gray-900 p-8 text-white text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className='text-3xl font-bold mb-2'>Live Music Experience</h2>
            <p className='text-white/80 text-lg'>
              Create unforgettable memories with professional live music
            </p>
          </motion.div>
        </div>

        <div className='p-8'>
          <AnimatePresence mode='wait'>
            {/* Step 1: Event Details */}
            {currentStep === 1 && (
              <motion.div
                key='step1'
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className='space-y-8'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-bold text-gray-800 mb-3'>
                      <Calendar className='w-4 h-4 inline mr-2' />
                      Event Date *
                    </label>
                    <input
                      type='date'
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full p-4 border-2 rounded-xl font-medium transition-all duration-300 focus:ring-4 focus:ring-amber-100 focus:border-amber-500 ${
                        errors.date
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    {errors.date && (
                      <p className='text-red-500 text-sm mt-2 flex items-center'>
                        <AlertCircle className='w-4 h-4 mr-1' />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-bold text-gray-800 mb-3'>
                      <Clock className='w-4 h-4 inline mr-2' />
                      Start Time *
                    </label>
                    <input
                      type='time'
                      value={formData.startTime}
                      onChange={(e) =>
                        handleChange('startTime', e.target.value)
                      }
                      className={`w-full p-4 border-2 rounded-xl font-medium transition-all duration-300 focus:ring-4 focus:ring-amber-100 focus:border-amber-500 ${
                        errors.startTime
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    {errors.startTime && (
                      <p className='text-red-500 text-sm mt-2 flex items-center'>
                        <AlertCircle className='w-4 h-4 mr-1' />
                        {errors.startTime}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location Selection */}
                <div className='space-y-4'>
                  <label className='flex items-center text-sm font-bold text-gray-800 mb-3'>
                    <MapPin className='w-4 h-4 mr-2 text-amber-600' />
                    Event Location *
                  </label>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {LOCATION_OPTIONS.map((location) => (
                      <div
                        key={location.id}
                        className={`
                          border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-md
                          ${
                            formData.location === location.id
                              ? 'bg-amber-50 border-amber-300 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                        onClick={() => handleLocationSelect(location.id)}
                      >
                        <div className='flex items-center'>
                          <div
                            className={`
                            w-5 h-5 rounded-full border flex items-center justify-center mr-3
                            ${
                              formData.location === location.id
                                ? 'border-amber-500 bg-amber-500'
                                : 'border-gray-300'
                            }
                          `}
                          >
                            {formData.location === location.id && (
                              <CheckCircle className='w-4 h-4 text-white' />
                            )}
                          </div>
                          <span className='font-medium text-gray-800'>
                            {location.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.location && (
                    <p className='text-red-500 text-sm mt-2 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Modern Event Type Cards */}
                <div>
                  <label className='block text-sm font-bold text-gray-800 mb-6'>
                    Event Type *
                  </label>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {eventTypes.map((type) => {
                      const IconComponent = type.icon;
                      const isSelected = formData.eventType === type.id;

                      return (
                        <motion.div
                          key={type.id}
                          className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 group border-2 ${
                            isSelected
                              ? `border-transparent shadow-2xl ${type.shadowColor} scale-105`
                              : 'border-gray-200/60 hover:border-gray-300 hover:shadow-lg shadow-gray-200/20'
                          }`}
                          onClick={() => handleChange('eventType', type.id)}
                          whileHover={{
                            scale: isSelected ? 1.05 : 1.02,
                            y: -5,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Sophisticated Gradient Background */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${
                              type.gradient
                            } transition-opacity duration-500 ${
                              isSelected
                                ? 'opacity-15'
                                : 'opacity-5 group-hover:opacity-10'
                            }`}
                          />

                          {/* Animated Selection Ring */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-20 rounded-3xl`}
                            />
                          )}

                          {/* Selection Check - Top Right */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`absolute top-4 right-4 z-30 w-7 h-7 ${type.accentColor} rounded-full flex items-center justify-center shadow-lg`}
                            >
                              <Check className='w-4 h-4 text-white' />
                            </motion.div>
                          )}

                          <div
                            className={`relative z-20 p-8 text-center transition-all duration-300 ${type.bgHover}`}
                          >
                            {/* Modern Icon Container */}
                            <div
                              className={`relative mx-auto w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all duration-500 ${
                                isSelected
                                  ? `${type.accentColor} shadow-lg scale-110`
                                  : `bg-white/80 group-hover:bg-white shadow-md group-hover:scale-105`
                              }`}
                            >
                              <IconComponent
                                className={`w-8 h-8 transition-all duration-300 ${
                                  isSelected
                                    ? 'text-white'
                                    : 'text-gray-600 group-hover:text-gray-800'
                                }`}
                              />

                              {/* Subtle glow effect */}
                              {isSelected && (
                                <div
                                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${type.gradient} opacity-20 blur-sm`}
                                />
                              )}
                            </div>

                            {/* Enhanced Typography */}
                            <h4
                              className={`font-bold text-lg mb-3 transition-colors duration-300 ${
                                isSelected
                                  ? 'text-gray-900'
                                  : 'text-gray-800 group-hover:text-gray-900'
                              }`}
                            >
                              {type.name}
                            </h4>

                            <p
                              className={`text-sm leading-relaxed transition-colors duration-300 ${
                                isSelected
                                  ? 'text-gray-700'
                                  : 'text-gray-600 group-hover:text-gray-700'
                              }`}
                            >
                              {type.description}
                            </p>

                            {/* Modern Bottom Accent */}
                            <div
                              className={`mt-6 h-1 w-16 mx-auto rounded-full transition-all duration-500 ${
                                isSelected
                                  ? `bg-gradient-to-r ${type.gradient} opacity-80 scale-110`
                                  : `bg-gray-300 group-hover:bg-gradient-to-r group-hover:${type.gradient} group-hover:opacity-60 scale-90 group-hover:scale-100`
                              }`}
                            />
                          </div>

                          {/* Subtle Border Glow */}
                          {isSelected && (
                            <div
                              className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${type.gradient} opacity-20 blur-xl`}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  {errors.eventType && (
                    <p className='text-red-500 text-sm mt-6 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {errors.eventType}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Musicians & Performance */}
            {currentStep === 2 && (
              <motion.div
                key='step2'
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className='space-y-12'
              >
                {/* Choose Musicians */}
                <div>
                  <h3 className='text-xl font-bold text-gray-800 mb-6 flex items-center'>
                    <Music className='w-6 h-6 mr-3 text-amber-600' />
                    Choose Your Musicians
                  </h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {performerTypes.map((performer) => (
                      <div
                        key={performer.id}
                        className={`relative border-3 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl group ${
                          formData.performerType === performer.id
                            ? 'border-amber-500 shadow-xl scale-105'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() =>
                          handleChange('performerType', performer.id)
                        }
                      >
                        <div
                          className={`absolute top-3 left-3 z-20 ${performer.badgeColor} text-white px-2 py-1 rounded-full text-xs font-bold`}
                        >
                          {performer.badge}
                        </div>

                        {formData.performerType === performer.id && (
                          <div className='absolute top-3 right-3 z-20 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center'>
                            <Check className='w-5 h-5 text-white' />
                          </div>
                        )}

                        <div className='relative h-40 overflow-hidden'>
                          <img
                            src={performer.image}
                            alt={performer.name}
                            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

                          <div className='absolute bottom-3 left-3 right-3 text-white'>
                            <div className='flex items-center justify-between mb-1'>
                              <h4 className='font-bold text-lg'>
                                {performer.name}
                              </h4>
                              <span className='text-xl font-bold'>
                                ${performer.price}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className='p-4'>
                          <p className='text-gray-600 text-sm leading-relaxed'>
                            {performer.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.performerType && (
                    <p className='text-red-500 text-sm mt-4 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {errors.performerType}
                    </p>
                  )}
                </div>

                {/* Music Style */}
                <div>
                  <h3 className='text-xl font-bold text-gray-800 mb-6'>
                    Music Style
                  </h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {musicGenres.map((genre) => (
                      <div
                        key={genre.id}
                        className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 overflow-hidden group ${
                          formData.musicGenre === genre.id
                            ? 'border-amber-500 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => handleChange('musicGenre', genre.id)}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                        />

                        <div className='relative z-10'>
                          <div className='flex items-center justify-between mb-3'>
                            <div className='flex items-center'>
                              <span className='text-2xl mr-3'>
                                {genre.icon}
                              </span>
                              <h4 className='font-bold text-lg text-gray-800'>
                                {genre.name}
                              </h4>
                            </div>
                            {formData.musicGenre === genre.id && (
                              <Check className='w-6 h-6 text-amber-500' />
                            )}
                          </div>
                          <p className='text-gray-600 leading-relaxed'>
                            {genre.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.musicGenre && (
                    <p className='text-red-500 text-sm mt-4 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {errors.musicGenre}
                    </p>
                  )}
                </div>

                {/* Music Language Selection */}
                <div>
                  <h3 className='text-xl font-bold text-gray-800 mb-6 flex items-center'>
                    <Globe className='w-6 h-6 mr-3 text-amber-600' />
                    Song Language Preference
                  </h3>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {musicLanguages.map((language) => (
                      <div
                        key={language.id}
                        className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                          formData.musicLanguage === language.id
                            ? 'border-amber-500 bg-amber-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() =>
                          handleChange('musicLanguage', language.id)
                        }
                      >
                        <div className='text-center'>
                          <div className='text-3xl mb-3'>{language.icon}</div>
                          <h4 className='font-bold text-lg text-gray-800 mb-2'>
                            {language.name}
                          </h4>
                          <p className='text-gray-600 text-sm'>
                            {language.description}
                          </p>
                          {formData.musicLanguage === language.id && (
                            <div className='mt-3'>
                              <Check className='w-6 h-6 text-amber-500 mx-auto' />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Format */}
                <div>
                  <h3 className='text-xl font-bold text-gray-800 mb-4'>
                    Performance Format
                  </h3>
                  <p className='text-gray-600 mb-6'>
                    Our standard performance is 90 minutes. Choose how you'd
                    like it divided. If you need more time, we can organize it
                    during the event.
                  </p>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {performanceFormats.map((format) => (
                      <div
                        key={format.id}
                        className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                          formData.performanceFormat === format.id
                            ? 'border-amber-500 bg-amber-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() =>
                          handleChange('performanceFormat', format.id)
                        }
                      >
                        <div className='flex items-center mb-3'>
                          <div className='w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mr-3'>
                            {format.icon}
                          </div>
                          <div>
                            <h4 className='font-bold text-gray-800'>
                              {format.name}
                            </h4>
                            <div className='text-xs text-amber-600 font-medium'>
                              {format.duration}
                            </div>
                          </div>
                          {formData.performanceFormat === format.id && (
                            <div className='ml-auto'>
                              <Check className='w-6 h-6 text-amber-500' />
                            </div>
                          )}
                        </div>
                        <p className='text-gray-600 text-sm'>
                          {format.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {errors.performanceFormat && (
                    <p className='text-red-500 text-sm mt-4 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {errors.performanceFormat}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Music References & Final Details */}
            {currentStep === 3 && (
              <motion.div
                key='step3'
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className='space-y-8'
              >
                {/* Music References */}
                <div>
                  <h3 className='text-xl font-bold text-gray-800 mb-6 flex items-center'>
                    <Youtube className='w-6 h-6 mr-3 text-amber-600' />
                    Music References (Optional)
                  </h3>

                  <div className='space-y-4'>
                    <p className='text-gray-600 mb-4'>
                      Share YouTube or Spotify links of songs that represent the
                      style you're looking for
                    </p>

                    {formData.musicReferences.map((reference, index) => (
                      <div key={index} className='flex gap-3'>
                        <div className='flex-1'>
                          <input
                            type='text'
                            value={reference}
                            onChange={(e) =>
                              updateMusicReference(index, e.target.value)
                            }
                            placeholder={`Music reference ${
                              index + 1
                            } (YouTube, Spotify, etc.)`}
                            className='w-full p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-300'
                          />
                        </div>
                        {formData.musicReferences.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeMusicReference(index)}
                            className='p-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300'
                            title='Remove this reference'
                          >
                            <X className='w-5 h-5' />
                          </button>
                        )}
                      </div>
                    ))}

                    {formData.musicReferences.length < 5 && (
                      <button
                        type='button'
                        onClick={addMusicReference}
                        className='flex items-center text-amber-600 hover:text-amber-700 transition-colors font-medium'
                      >
                        <div className='w-10 h-10 rounded-full border-2 border-dashed border-amber-300 flex items-center justify-center mr-3 hover:border-amber-400 hover:bg-amber-50 transition-all duration-300'>
                          <Plus className='w-5 h-5' />
                        </div>
                        Add another music reference
                      </button>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                    <MessageSquare className='w-6 h-6 mr-3 text-amber-600' />
                    Special Requests
                  </h3>

                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) =>
                      handleChange('specialRequests', e.target.value)
                    }
                    placeholder='Any specific songs for special moments, setup requirements, or other details...'
                    rows={5}
                    className='w-full p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-300 resize-none'
                  />
                </div>

                {/* Booking Summary */}
                {selectedPerformer && (
                  <div className='bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6'>
                    <h4 className='font-bold text-gray-800 mb-4 flex items-center'>
                      <Sparkles className='w-5 h-5 mr-2 text-amber-600' />
                      Booking Summary
                    </h4>
                    <div className='space-y-3'>
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-700'>Date & Time:</span>
                        <span className='font-bold text-gray-900'>
                          {formData.date} at {formData.startTime}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-700'>Location:</span>
                        <span className='font-bold text-gray-900'>
                          {LOCATION_OPTIONS.find(
                            (loc) => loc.id === formData.location
                          )?.name || 'Selected Location'}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-700'>Musicians:</span>
                        <span className='font-bold text-gray-900'>
                          {selectedPerformer.name}
                        </span>
                      </div>
                      {selectedGenre && (
                        <div className='flex justify-between items-center'>
                          <span className='text-gray-700'>Music Style:</span>
                          <span className='font-bold text-gray-900'>
                            {selectedGenre.name}
                          </span>
                        </div>
                      )}
                      {selectedFormat && (
                        <div className='flex justify-between items-center'>
                          <span className='text-gray-700'>
                            Performance Format:
                          </span>
                          <span className='font-bold text-gray-900'>
                            {selectedFormat.name}
                          </span>
                        </div>
                      )}
                      {formData.musicLanguage && (
                        <div className='flex justify-between items-center'>
                          <span className='text-gray-700'>Song Language:</span>
                          <span className='font-bold text-gray-900'>
                            {selectedLanguage?.name}
                          </span>
                        </div>
                      )}
                      <div className='border-t border-amber-300 pt-3 mt-4'>
                        <div className='flex justify-between items-center'>
                          <span className='font-bold text-gray-900'>
                            Total Price:
                          </span>
                          <span className='text-3xl font-bold text-amber-700'>
                            ${selectedPerformer.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className='p-4 bg-red-50 border border-red-200 rounded-xl'>
                    <p className='text-red-800 flex items-center'>
                      <AlertCircle className='w-5 h-5 mr-2' />
                      {errors.submit}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className='bg-gray-50 border-t p-6 flex justify-between items-center'>
          <div className='flex gap-4'>
            {currentStep > 1 && (
              <button
                type='button'
                onClick={prevStep}
                className='px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors'
              >
                Previous
              </button>
            )}

            <button
              type='button'
              onClick={onCancel}
              className='px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors'
            >
              Cancel
            </button>
          </div>

          <div className='flex gap-4'>
            {currentStep < 3 ? (
              <button
                type='button'
                onClick={nextStep}
                className='px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2'
              >
                Continue
                <ArrowRight className='w-5 h-5' />
              </button>
            ) : (
              <button
                type='button'
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <CreditCard className='w-5 h-5' />
                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMusicForm;
