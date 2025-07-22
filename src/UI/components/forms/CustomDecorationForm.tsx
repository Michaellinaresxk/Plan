import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import { Service, BookingDate } from '@/types/type';
import {
  Upload,
  Calendar,
  MessageSquare,
  Tag,
  Clock,
  AlertCircle,
  Home,
  Palette,
  Camera,
  MapPin,
  Sparkles,
  Heart,
  Gift,
  Cake,
  Star,
  CreditCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ColorPicker from '../shared/ColorPicker';

interface CustomDecorationFormProps {
  service: Service;
  onBookService?: (
    service: Service,
    dates: BookingDate,
    guests: number,
    formData: Record<string, any>
  ) => void; // Made optional for compatibility
  onClose: () => void;
}

const CustomDecorationForm: React.FC<CustomDecorationFormProps> = ({
  service,
  onBookService,
  onClose,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();

  // Form state
  const [date, setDate] = useState<Date | null>(getMinimumDate());
  const [time, setTime] = useState<string>('12:00');
  const [location, setLocation] = useState<string>('');
  const [exactAddress, setExactAddress] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('');
  const [customOccasion, setCustomOccasion] = useState<string>('');
  const [colors, setColors] = useState<string[]>(['#FFCD61', '#ffffff']);
  const [notes, setNotes] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invalidDateMessage, setInvalidDateMessage] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);

  // Enhanced decoration occasion options with icons
  const occasionOptions = [
    {
      id: 'birthday',
      label: t('decorationForm.occasions.birthday', {
        fallback: 'Birthday Party',
      }),
      icon: <Cake className='w-5 h-5' />,
      color: 'from-pink-500 to-purple-500',
    },
    {
      id: 'anniversary',
      label: t('decorationForm.occasions.anniversary', {
        fallback: 'Anniversary',
      }),
      icon: <Heart className='w-5 h-5' />,
      color: 'from-red-500 to-pink-500',
    },
    {
      id: 'proposal',
      label: t('decorationForm.occasions.proposal', {
        fallback: 'Marriage Proposal',
      }),
      icon: <Sparkles className='w-5 h-5' />,
      color: 'from-amber-500 to-yellow-500',
    },
    {
      id: 'romantic',
      label: t('decorationForm.occasions.romantic', {
        fallback: 'Romantic Dinner',
      }),
      icon: <Heart className='w-5 h-5' />,
      color: 'from-rose-500 to-red-500',
    },
    {
      id: 'baby-shower',
      label: t('decorationForm.occasions.babyShower', {
        fallback: 'Baby Shower',
      }),
      icon: <Gift className='w-5 h-5' />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'other',
      label: t('decorationForm.occasions.other', { fallback: 'Other' }),
      icon: <Star className='w-5 h-5' />,
      color: 'from-gray-500 to-gray-600',
    },
  ];

  // Get the minimum date (72 hours from now)
  function getMinimumDate(): Date {
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + 72);
    return minDate;
  }

  function formatMinDateForInput(): string {
    const minDate = getMinimumDate();
    return minDate.toISOString().split('T')[0];
  }

  // Check date is valid
  useEffect(() => {
    if (date) {
      const now = new Date();
      const minBookingTime = new Date(now.getTime() + 72 * 60 * 60 * 1000);

      if (date < minBookingTime) {
        setInvalidDateMessage(
          t('decorationForm.errors.minAdvanceTime', {
            fallback:
              'Decoration services require minimum 72 hours advance booking',
          })
        );
      } else {
        setInvalidDateMessage('');
      }
    }
  }, [date, t]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferenceImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Color management
  const addColor = () => {
    if (colors.length < 5) {
      setColors([...colors, '#FFFFFF']);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      const updatedColors = [...colors];
      updatedColors.splice(index, 1);
      setColors(updatedColors);
    }
  };

  const updateColor = (index: number, newColor: string) => {
    const updatedColors = [...colors];
    updatedColors[index] = newColor;
    setColors(updatedColors);
  };

  // Form validation - FIXED: Improved validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!date) {
      newErrors.date = t('forms.errors.dateRequired', {
        fallback: 'Date is required',
      });
    } else {
      const now = new Date();
      const minBookingTime = new Date(now.getTime() + 72 * 60 * 60 * 1000);
      if (date < minBookingTime) {
        newErrors.date = t('decorationForm.errors.minAdvanceTime', {
          fallback:
            'Decoration services require minimum 72 hours advance booking',
        });
      }
    }

    if (!time) {
      newErrors.time = t('forms.errors.timeRequired', {
        fallback: 'Time is required',
      });
    }

    if (!occasion) {
      newErrors.occasion = t('forms.errors.occasionRequired', {
        fallback: 'Occasion is required',
      });
    } else if (occasion === 'other' && !customOccasion.trim()) {
      newErrors.customOccasion = t('forms.errors.customOccasionRequired', {
        fallback: 'Please specify the occasion',
      });
    }

    if (!exactAddress.trim()) {
      newErrors.exactAddress = t('forms.errors.addressRequired', {
        fallback: 'Exact address is required',
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate base price for decoration service
  const calculatePrice = () => {
    // Base price for decoration service (could be from service.price or default)
    const basePrice = service.price || 200;

    // Additional pricing based on occasion complexity
    const occasionMultipliers: Record<string, number> = {
      birthday: 1.0,
      anniversary: 1.2,
      proposal: 1.5,
      romantic: 1.3,
      'baby-shower': 1.1,
      other: 1.0,
    };

    const multiplier = occasionMultipliers[occasion] || 1.0;
    const totalPrice = basePrice * multiplier;

    return Math.round(totalPrice);
  };

  // FIXED: Handle form submission following BikeForm pattern
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('❌ CustomDecorationForm - Validation errors:', errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const dateObj = date ? new Date(date) : new Date();

      // Create booking date with specific time
      const bookingStartDate = new Date(dateObj);
      const [hours, minutes] = time.split(':');
      bookingStartDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Decoration service typically takes 2-4 hours for setup
      const bookingEndDate = new Date(bookingStartDate);
      bookingEndDate.setHours(bookingStartDate.getHours() + 3);

      const finalOccasion = occasion === 'other' ? customOccasion : occasion;
      const totalPrice = calculatePrice();

      const bookingDate: BookingDate = {
        startDate: bookingStartDate,
        endDate: bookingEndDate,
      };

      const formData = {
        date: dateObj,
        time,
        occasion: finalOccasion,
        locationType: location,
        exactAddress,
        colors,
        notes,
        referenceImage,
        serviceType: 'custom-decoration',
        totalPrice,
      };

      // FIXED: Create reservation data matching BikeForm structure
      const reservationData = {
        service: service,
        formData: formData,
        totalPrice: totalPrice,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: 1,
          children: 0,
          total: 1,
        },
        selectedItems: [
          {
            id: 'custom-decoration',
            name: `${finalOccasion} Decoration Service`,
            quantity: 1,
            price: totalPrice,
            totalPrice: totalPrice,
            occasion: finalOccasion,
            colors: colors,
          },
        ],
        clientInfo: undefined, // Will be filled in the confirmation page
        // Additional decoration-specific data
        decorationSpecifics: {
          occasion: finalOccasion,
          colors: colors,
          exactAddress: exactAddress,
          notes: notes,
          referenceImage: referenceImage ? referenceImage.name : null,
          setupTime: time,
          estimatedDuration: '3 hours',
        },
      };

      console.log(
        '🎨 CustomDecorationForm - Reservation data created:',
        reservationData
      );

      // Store in context (like BikeForm)
      setReservationData(reservationData);

      // Call the onBookService callback if provided (optional)
      if (onBookService) {
        await onBookService(service, bookingDate, 1, formData);
      }

      // Navigate to confirmation page (like BikeForm)
      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ CustomDecorationForm - Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPremium = service.packageType?.includes('premium');

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <motion.div
        className='max-w-4xl mx-auto'
        initial='hidden'
        animate='visible'
        variants={stagger}
      >
        {/* Header */}
        <motion.div className='text-center mb-8' variants={fadeInUp}>
          <div className='inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 mb-4'>
            <Palette className='w-5 h-5 text-purple-600 mr-2' />
            <span className='text-sm font-medium text-gray-700'>
              Custom Decoration Service
            </span>
          </div>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Design Your Perfect Event
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Let's create a magical atmosphere that matches your vision and makes
            your celebration unforgettable
          </p>
        </motion.div>

        {/* Service Area Notice */}
        <motion.div
          className='bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 mb-8'
          variants={fadeInUp}
        >
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <MapPin className='w-6 h-6 text-blue-600' />
            </div>
            <div className='ml-4'>
              <h3 className='font-semibold text-blue-900 mb-2'>Service Area</h3>
              <p className='text-blue-700'>
                Our decoration services are available throughout the Punta Cana
                area. Please provide your exact address for our team to deliver
                the best service.
              </p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className='grid lg:grid-cols-2 gap-8'>
            {/* Left Column */}
            <div className='space-y-8'>
              {/* Date and Time */}
              <motion.div
                className='bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/40'
                variants={fadeInUp}
              >
                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                  <Calendar className='w-6 h-6 mr-3 text-purple-600' />
                  When is your event?
                </h2>

                <div className='grid grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-gray-700 font-medium mb-3'>
                      Date <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        type='date'
                        value={date ? date.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const newDate = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          setDate(newDate);
                        }}
                        min={formatMinDateForInput()}
                        className={`w-full px-4 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                          errors.date || invalidDateMessage
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-200 focus:border-purple-400'
                        }`}
                      />
                      {(errors.date || invalidDateMessage) && (
                        <p className='mt-2 text-red-500 text-sm flex items-center'>
                          <AlertCircle className='w-4 h-4 mr-1' />
                          {errors.date || invalidDateMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className='block text-gray-700 font-medium mb-3'>
                      Deliver Time <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <Clock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                      <input
                        type='time'
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                          errors.time
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-200 focus:border-purple-400'
                        }`}
                      />
                      {errors.time && (
                        <p className='mt-2 text-red-500 text-sm flex items-center'>
                          <AlertCircle className='w-4 h-4 mr-1' />
                          {errors.time}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className='mt-4 p-4 bg-purple-50 rounded-2xl'>
                  <p className='text-sm text-purple-700 flex items-center'>
                    <AlertCircle className='w-4 h-4 mr-2' />
                    Minimum 72 hours advance booking required for proper
                    preparation
                  </p>
                </div>
              </motion.div>

              {/* Occasion Selection */}
              <motion.div
                className='bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/40'
                variants={fadeInUp}
              >
                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                  <Sparkles className='w-6 h-6 mr-3 text-purple-600' />
                  What's the occasion?
                </h2>

                <div className='grid grid-cols-2 gap-4'>
                  {occasionOptions.map((option) => (
                    <motion.div
                      key={option.id}
                      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        occasion === option.id
                          ? 'border-purple-400 bg-purple-50 scale-105'
                          : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white/80'
                      }`}
                      onClick={() => setOccasion(option.id)}
                      whileHover={{ y: -2 }}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center text-white mb-3`}
                      >
                        {option.icon}
                      </div>
                      <h3 className='font-semibold text-gray-900 text-sm'>
                        {option.label}
                      </h3>

                      {occasion === option.id && (
                        <div className='absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center'>
                          <span className='text-white text-xs'>✓</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {errors.occasion && (
                  <p className='mt-4 text-red-500 text-sm flex items-center'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    {errors.occasion}
                  </p>
                )}

                <AnimatePresence>
                  {occasion === 'other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className='mt-6'
                    >
                      <label className='block text-gray-700 font-medium mb-3'>
                        Specify your occasion{' '}
                        <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        value={customOccasion}
                        onChange={(e) => setCustomOccasion(e.target.value)}
                        placeholder='e.g., Corporate event, Garden party'
                        className={`w-full px-4 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                          errors.customOccasion
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-200 focus:border-purple-400'
                        }`}
                      />
                      {errors.customOccasion && (
                        <p className='mt-2 text-red-500 text-sm flex items-center'>
                          <AlertCircle className='w-4 h-4 mr-1' />
                          {errors.customOccasion}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Location */}
              <motion.div
                className='bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/40'
                variants={fadeInUp}
              >
                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                  <Home className='w-6 h-6 mr-3 text-purple-600' />
                  Where is your event?
                </h2>

                <div>
                  <label className='block text-gray-700 font-medium mb-3'>
                    Exact Address <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <MapPin className='absolute left-4 top-4 text-gray-400 w-5 h-5' />
                    <textarea
                      value={exactAddress}
                      onChange={(e) => setExactAddress(e.target.value)}
                      rows={4}
                      placeholder='Full address (hotel name, villa number, street, etc.)'
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 resize-none ${
                        errors.exactAddress
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-gray-200 focus:border-purple-400'
                      }`}
                    />
                    {errors.exactAddress && (
                      <p className='mt-2 text-red-500 text-sm flex items-center'>
                        <AlertCircle className='w-4 h-4 mr-1' />
                        {errors.exactAddress}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className='space-y-8'>
              {/* Color Palette */}
              <motion.div
                className='bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/40'
                variants={fadeInUp}
              >
                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                  <Palette className='w-6 h-6 mr-3 text-purple-600' />
                  Choose your colors
                </h2>

                <div className='space-y-6'>
                  <div className='flex flex-wrap gap-4 items-center'>
                    {colors.map((color, index) => (
                      <div key={index} className='flex items-center group'>
                        <div className='relative'>
                          <ColorPicker
                            color={color}
                            onChange={(newColor) =>
                              updateColor(index, newColor)
                            }
                          />
                          {colors.length > 1 && (
                            <button
                              type='button'
                              onClick={() => removeColor(index)}
                              className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {colors.length < 5 && (
                      <button
                        type='button'
                        onClick={addColor}
                        className='w-12 h-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center group'
                      >
                        <span className='text-2xl text-gray-400 group-hover:text-purple-600'>
                          +
                        </span>
                      </button>
                    )}
                  </div>

                  <div className='p-4 bg-purple-50 rounded-2xl'>
                    <p className='text-sm text-purple-700'>
                      💡 Choose 2-5 colors that represent your event's theme.
                      Our decorators will create a harmonious color scheme.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Reference Image */}
              <motion.div
                className='bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/40'
                variants={fadeInUp}
              >
                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                  <Camera className='w-6 h-6 mr-3 text-purple-600' />
                  Inspiration photo
                </h2>

                <div className='relative'>
                  <label
                    className={`flex flex-col w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                      imagePreview
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                    }`}
                  >
                    <div className='flex flex-col items-center justify-center h-full'>
                      {imagePreview ? (
                        <div className='relative w-full h-full flex items-center justify-center p-4'>
                          <img
                            src={imagePreview}
                            alt='Upload preview'
                            className='max-h-full max-w-full object-contain rounded-xl'
                          />
                          <button
                            type='button'
                            onClick={(e) => {
                              e.preventDefault();
                              setReferenceImage(null);
                              setImagePreview(null);
                            }}
                            className='absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors'
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className='w-12 h-12 text-gray-400 mb-4' />
                          <p className='text-lg font-medium text-gray-700 mb-2'>
                            Upload inspiration photo
                          </p>
                          <p className='text-sm text-gray-500 text-center px-4'>
                            Share a photo of decorations you love to help us
                            understand your vision
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </motion.div>

              {/* Additional Notes */}
              <motion.div
                className='bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/40'
                variants={fadeInUp}
              >
                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                  <MessageSquare className='w-6 h-6 mr-3 text-purple-600' />
                  Additional details
                </h2>

                <div className='relative'>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    className='w-full px-4 py-4 border-2 border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 resize-none'
                    placeholder='Tell us more about your vision, special requirements, or any specific decorations you have in mind...'
                  />
                </div>
              </motion.div>

              {/* Price Display */}
              <motion.div
                className='bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white'
                variants={fadeInUp}
              >
                <h2 className='text-2xl font-bold mb-4 flex items-center'>
                  <CreditCard className='w-6 h-6 mr-3' />
                  Service Pricing
                </h2>

                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-lg'>Estimated Total:</span>
                    <span className='text-3xl font-bold'>
                      ${calculatePrice()}
                    </span>
                  </div>

                  {occasion && (
                    <div className='text-sm opacity-90'>
                      <div>Base decoration service</div>
                      {occasion === 'proposal' && (
                        <div>+ Premium proposal setup</div>
                      )}
                      {occasion === 'anniversary' && (
                        <div>+ Romantic enhancement</div>
                      )}
                      {occasion === 'romantic' && (
                        <div>+ Intimate atmosphere</div>
                      )}
                    </div>
                  )}

                  <div className='text-sm opacity-75 pt-2 border-t border-white/20'>
                    Final price confirmed after consultation
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <motion.div
              className='mt-8 p-4 bg-red-50 border border-red-200 rounded-2xl'
              variants={fadeInUp}
            >
              <p className='text-red-800 text-sm flex items-center'>
                <AlertCircle className='w-4 h-4 mr-2' />
                {errors.submit}
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className='flex justify-center gap-6 mt-12'
            variants={fadeInUp}
          >
            <button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className='px-8 py-4 border-2 border-gray-300 bg-white/80 backdrop-blur-sm rounded-2xl text-gray-700 font-semibold hover:bg-white hover:border-gray-400 transition-all duration-300 disabled:opacity-50'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={isSubmitting || !!invalidDateMessage}
              className={`px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                isSubmitting ? 'animate-pulse' : ''
              }`}
            >
              {isSubmitting ? (
                <span className='flex items-center'>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3'></div>
                  Creating your booking...
                </span>
              ) : (
                <span className='flex items-center'>
                  <Sparkles className='w-5 h-5 mr-2' />
                  Confirm Booking
                </span>
              )}
            </button>
          </motion.div>

          {/* Required fields notice */}
          <motion.p
            className='text-center text-sm text-gray-500 mt-6'
            variants={fadeInUp}
          >
            <span className='text-red-500'>*</span> Required fields
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default CustomDecorationForm;
