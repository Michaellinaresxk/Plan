import { Service } from '@/types/type';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/context/BookingContext';
import {
  Calendar,
  Users,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Sunrise,
  Sunset,
  MessageSquare,
  Info,
  MapPin,
  Activity,
  Target,
  Dumbbell,
  Baby,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/client';
import { useEffect, useState } from 'react';
import { LOCATION_OPTIONS } from '@/constants/location/location';
import { useFormModal } from '@/hooks/useFormModal';
import FormHeader from './FormHeader';

interface PersonalTrainerFormProps {
  service: Service;
  onSubmit?: (formData: any) => void;
  onCancel: () => void;
}

const PersonalTrainerForm: React.FC<PersonalTrainerFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setReservationData } = useReservation();
  const { handleClose } = useFormModal({ onCancel });

  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '', // 'morning', 'afternoon'
    location: '',
    participantCount: 1,
    minorsCount: 0, // Simple count of participants under 18
    workoutType: '', // 'strength', 'cardio', 'functional', 'hiit', 'mixed'
    fitnessLevel: '', // 'beginner', 'intermediate', 'advanced'
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    confirmSpecialNeeds: false,
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(service.price);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate price based on participant count and workout type
  useEffect(() => {
    const basePrice = service.price;

    // Price adjustment based on workout type
    let typeMultiplier = 1;
    switch (formData.workoutType) {
      case 'hiit':
      case 'functional':
        typeMultiplier = 1.15; // 15% increase for specialized training
        break;
      case 'strength':
        typeMultiplier = 1.1; // 10% increase for strength training
        break;
      default:
        typeMultiplier = 1;
    }

    const adjustedBasePrice = basePrice * typeMultiplier;

    // Group discount calculation
    const pricePerPerson =
      formData.participantCount > 1
        ? adjustedBasePrice * 0.85 // 15% discount per additional person
        : adjustedBasePrice;

    const totalPrice = pricePerPerson * formData.participantCount;

    // Additional fee for special needs accommodations
    const specialNeedsFee = formData.hasSpecialNeeds ? 20 : 0;

    setCurrentPrice(totalPrice + specialNeedsFee);
  }, [
    formData.participantCount,
    formData.workoutType,
    formData.hasSpecialNeeds,
    service.price,
  ]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));

      if (name === 'hasSpecialNeeds' && !checked) {
        setFormData((prev) => ({
          ...prev,
          hasSpecialNeeds: false,
          specialNeedsDetails: '',
          confirmSpecialNeeds: false,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear errors for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setFormData((prev) => ({
      ...prev,
      location: locationId,
    }));

    // Clear location error if exists
    if (errors.location) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.location;
        return newErrors;
      });
    }
  };

  // Handle participant count changes
  const updateParticipantCount = (increment: boolean) => {
    setFormData((prev) => {
      const newCount = increment
        ? Math.min(6, prev.participantCount + 1) // Max 6 people for safety
        : Math.max(1, prev.participantCount - 1);

      // If decreasing participants, ensure minors count doesn't exceed total
      const adjustedMinorsCount = Math.min(prev.minorsCount, newCount);

      return {
        ...prev,
        participantCount: newCount,
        minorsCount: adjustedMinorsCount,
      };
    });
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.date) {
      newErrors.date = t('form.errors.required', {
        fallback: 'Date is required',
      });
    }

    if (!formData.location) {
      newErrors.location = t('form.errors.required', {
        fallback: 'Please select a location',
      });
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = t('form.errors.required', {
        fallback: 'Please select a time slot',
      });
    }

    if (!formData.workoutType) {
      newErrors.workoutType = t('form.errors.required', {
        fallback: 'Please select workout type',
      });
    }

    if (!formData.fitnessLevel) {
      newErrors.fitnessLevel = t('form.errors.required', {
        fallback: 'Please select fitness level',
      });
    }

    // Validate minors count
    if (formData.minorsCount > formData.participantCount) {
      newErrors.minorsCount =
        'Number of minors cannot exceed total participants';
    }

    if (formData.minorsCount < 0) {
      newErrors.minorsCount = 'Number of minors cannot be negative';
    }

    // Validate special needs
    if (formData.hasSpecialNeeds) {
      if (!formData.specialNeedsDetails.trim()) {
        newErrors.specialNeedsDetails = t('form.errors.required', {
          fallback: 'Please provide details about special needs',
        });
      }

      if (!formData.confirmSpecialNeeds) {
        newErrors.confirmSpecialNeeds = t('form.errors.confirmation', {
          fallback: 'Please confirm special needs accommodation',
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('❌ PersonalTrainerForm - Validation errors:', errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDate = new Date(formData.date);
      const bookingStartDate = new Date(selectedDate);
      const bookingEndDate = new Date(selectedDate);

      switch (formData.timeSlot) {
        case 'morning':
          bookingStartDate.setHours(7, 0, 0, 0);
          bookingEndDate.setHours(11, 0, 0, 0);
          break;
        case 'afternoon':
          bookingStartDate.setHours(13, 0, 0, 0);
          bookingEndDate.setHours(18, 0, 0, 0);
          break;
      }

      // Get selected location name
      const selectedLocation =
        LOCATION_OPTIONS.find((loc) => loc.id === formData.location)?.name ||
        formData.location;

      const reservationData = {
        service: service,
        formData: {
          ...formData,
          serviceType: 'personal-trainer',
          totalPrice: currentPrice,
          calculatedPrice: currentPrice,
          locationName: selectedLocation,
        },
        totalPrice: currentPrice,
        bookingDate: bookingStartDate,
        endDate: bookingEndDate,
        participants: {
          adults: formData.participantCount - formData.minorsCount,
          children: formData.minorsCount,
          total: formData.participantCount,
        },
        selectedItems: [
          {
            id: 'personal-training-session',
            name: `${
              formData.timeSlot.charAt(0).toUpperCase() +
              formData.timeSlot.slice(1)
            } Personal Training Session - ${formData.workoutType.toUpperCase()}`,
            quantity: 1,
            price: currentPrice,
            totalPrice: currentPrice,
            timeSlot: formData.timeSlot,
            workoutType: formData.workoutType,
            fitnessLevel: formData.fitnessLevel,
            specialNeeds: formData.hasSpecialNeeds,
            location: selectedLocation,
          },
        ],
        clientInfo: undefined,
        personalTrainerSpecifics: {
          timeSlot: formData.timeSlot,
          location: formData.location,
          locationName: selectedLocation,
          workoutType: formData.workoutType,
          fitnessLevel: formData.fitnessLevel,
          hasSpecialNeeds: formData.hasSpecialNeeds,
          specialNeedsDetails: formData.specialNeedsDetails,
          participantCount: formData.participantCount,
          minorsCount: formData.minorsCount,
          additionalNotes: formData.additionalNotes,
        },
      };

      console.log(
        '💪 PersonalTrainerForm - Reservation data created:',
        reservationData
      );

      setReservationData(reservationData);

      if (onSubmit) {
        await onSubmit(reservationData);
      }

      router.push('/reservation-confirmation');
    } catch (error) {
      console.error('❌ PersonalTrainerForm - Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit reservation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPremium = service.packageType?.includes('premium');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
        <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
          {/* Form Header */}

          <FormHeader
            title='Personal Training Session'
            subtitle='Transform your fitness journey with a certified personal trainer'
            icon={Dumbbell}
            isPremium={isPremium}
            onCancel={handleClose}
            showCloseButton={true}
            gradientFrom='blue-800'
            gradientVia='via-blue-700'
            gradientTo='cyan-800'
          />

          {/* Form Body */}
          <div className='p-8 space-y-8'>
            {/* Date and Time Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Calendar
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-blue-600'
                  }`}
                />
                {t('services.personalTrainer.scheduling', {
                  fallback: 'Training Schedule',
                })}
              </h3>

              {/* Date Selection */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-orange-600' : 'text-blue-600'
                    }`}
                  />
                  {t('services.personalTrainer.date', {
                    fallback: 'Select Date',
                  })}{' '}
                  *
                </label>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full p-3 border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 ${
                    isPremium
                      ? 'focus:ring-orange-500 focus:border-orange-500'
                      : 'focus:ring-blue-500 focus:border-blue-500'
                  } bg-gray-50`}
                />
                {errors.date && (
                  <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
                )}
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-orange-600' : 'text-blue-600'
                    }`}
                  />
                  {t('services.personalTrainer.timeSlot', {
                    fallback: 'Time Slot',
                  })}{' '}
                  *
                </label>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Morning Option */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.timeSlot === 'morning'
                          ? `${
                              isPremium
                                ? 'bg-orange-50 border-orange-300'
                                : 'bg-blue-50 border-blue-300'
                            } shadow-sm`
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, timeSlot: 'morning' }))
                    }
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${
                          formData.timeSlot === 'morning'
                            ? `${
                                isPremium
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-blue-500 bg-blue-500'
                              }`
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.timeSlot === 'morning' && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <Sunrise
                          className={`w-5 h-5 mr-2 ${
                            isPremium ? 'text-orange-500' : 'text-blue-500'
                          }`}
                        />
                        <span className='font-medium'>
                          {t('services.personalTrainer.morning', {
                            fallback: 'Morning',
                          })}
                        </span>
                      </div>
                    </div>
                    <p className='text-gray-500 text-sm mt-2 ml-8'>
                      {t('services.personalTrainer.morningTime', {
                        fallback: '7:00 AM - 11:00 AM',
                      })}
                    </p>
                  </div>

                  {/* Afternoon Option */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.timeSlot === 'afternoon'
                          ? `${
                              isPremium
                                ? 'bg-orange-50 border-orange-300'
                                : 'bg-blue-50 border-blue-300'
                            } shadow-sm`
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        timeSlot: 'afternoon',
                      }))
                    }
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${
                          formData.timeSlot === 'afternoon'
                            ? `${
                                isPremium
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-blue-500 bg-blue-500'
                              }`
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.timeSlot === 'afternoon' && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <Activity
                          className={`w-5 h-5 mr-2 ${
                            isPremium ? 'text-orange-500' : 'text-blue-500'
                          }`}
                        />
                        <span className='font-medium'>
                          {t('services.personalTrainer.afternoon', {
                            fallback: 'Afternoon',
                          })}
                        </span>
                      </div>
                    </div>
                    <p className='text-gray-500 text-sm mt-2 ml-8'>
                      {t('services.personalTrainer.afternoonTime', {
                        fallback: '1:00 PM - 6:00 PM',
                      })}
                    </p>
                  </div>
                </div>

                {errors.timeSlot && (
                  <p className='text-red-500 text-xs mt-1'>{errors.timeSlot}</p>
                )}
              </div>
            </div>

            {/* Location Selection */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <MapPin
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-blue-600'
                  }`}
                />
                {t('services.personalTrainer.location', {
                  fallback: 'Location',
                })}
              </h3>

              <div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {LOCATION_OPTIONS.map((location) => (
                    <div
                      key={location.id}
                      className={`
                        border rounded-lg p-4 cursor-pointer transition-all
                        ${
                          formData.location === location.id
                            ? `${
                                isPremium
                                  ? 'bg-orange-50 border-orange-300'
                                  : 'bg-blue-50 border-blue-300'
                              } shadow-sm`
                            : 'border-gray-200 hover:bg-gray-50'
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
                              ? `${
                                  isPremium
                                    ? 'border-orange-500 bg-orange-500'
                                    : 'border-blue-500 bg-blue-500'
                                }`
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
                  <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
                )}
              </div>
            </div>

            {/* Participants Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Users
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-blue-600'
                  }`}
                />
                {t('services.personalTrainer.participants', {
                  fallback: 'Participants',
                })}
              </h3>

              {/* Participant Count */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Users
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-orange-600' : 'text-blue-600'
                    }`}
                  />
                  {t('services.personalTrainer.participantCount', {
                    fallback: 'Number of Participants',
                  })}
                </label>
                <div className='flex border border-gray-300 rounded-lg overflow-hidden max-w-xs bg-white'>
                  <button
                    type='button'
                    onClick={() => updateParticipantCount(false)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                  >
                    -
                  </button>
                  <div className='flex-1 py-2 text-center'>
                    {formData.participantCount}
                  </div>
                  <button
                    type='button'
                    onClick={() => updateParticipantCount(true)}
                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition'
                  >
                    +
                  </button>
                </div>
                {formData.participantCount > 1 && (
                  <p className='text-sm text-gray-500 mt-1'>
                    {t('services.personalTrainer.groupDiscount', {
                      fallback:
                        '15% discount per additional person (max 6 people)',
                    })}
                  </p>
                )}
                {formData.participantCount >= 6 && (
                  <p className='text-sm text-amber-600 mt-1'>
                    Maximum group size reached
                  </p>
                )}
              </div>

              {/* Minors Count */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Baby
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-orange-600' : 'text-blue-600'
                    }`}
                  />
                  Number of participants under 18
                </label>
                <input
                  type='number'
                  name='minorsCount'
                  min='0'
                  max={formData.participantCount}
                  value={formData.minorsCount}
                  onChange={handleChange}
                  className={`w-full max-w-xs p-3 border ${
                    errors.minorsCount ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 ${
                    isPremium
                      ? 'focus:ring-orange-500 focus:border-orange-500'
                      : 'focus:ring-blue-500 focus:border-blue-500'
                  } bg-gray-50`}
                  placeholder='0'
                />
                {errors.minorsCount && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.minorsCount}
                  </p>
                )}

                {formData.minorsCount > 0 && (
                  <div className='flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200 mt-3'>
                    <Info className='h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0' />
                    <p className='text-xs text-blue-700'>
                      {formData.minorsCount} participant(s) under 18 detected.
                      Adult supervision is required during the training session.
                    </p>
                  </div>
                )}
              </div>

              {/* Special Needs Toggle */}
              <div className='mt-4'>
                <div
                  className={`
                    flex items-center justify-between p-4 border rounded-lg cursor-pointer
                    ${
                      formData.hasSpecialNeeds
                        ? `${
                            isPremium
                              ? 'border-orange-300 bg-orange-50'
                              : 'border-blue-300 bg-blue-50'
                          }`
                        : 'border-gray-200 hover:bg-gray-50'
                    }
                  `}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      hasSpecialNeeds: !prev.hasSpecialNeeds,
                      specialNeedsDetails: !prev.hasSpecialNeeds
                        ? prev.specialNeedsDetails
                        : '',
                      confirmSpecialNeeds: !prev.hasSpecialNeeds
                        ? prev.confirmSpecialNeeds
                        : false,
                    }))
                  }
                >
                  <div className='flex items-center'>
                    <div
                      className={`
                      w-5 h-5 rounded-full border flex items-center justify-center mr-3
                      ${
                        formData.hasSpecialNeeds
                          ? `${
                              isPremium
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-blue-500 bg-blue-500'
                            }`
                          : 'border-gray-300'
                      }
                    `}
                    >
                      {formData.hasSpecialNeeds && (
                        <CheckCircle className='w-4 h-4 text-white' />
                      )}
                    </div>
                    <span className='font-medium text-gray-800'>
                      {t('services.personalTrainer.specialNeeds', {
                        fallback: 'Physical limitations or injuries',
                      })}
                    </span>
                  </div>
                  <AlertCircle
                    className={`w-5 h-5 ${
                      isPremium ? 'text-orange-500' : 'text-blue-500'
                    }`}
                  />
                </div>

                {/* Special Needs Details */}
                {formData.hasSpecialNeeds && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-4 p-4 border rounded-lg ${
                      isPremium ? 'border-orange-200' : 'border-blue-200'
                    }`}
                  >
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('services.personalTrainer.specialNeedsDetails', {
                        fallback:
                          'Please specify any injuries, physical limitations, or medical conditions',
                      })}{' '}
                      *
                    </label>
                    <textarea
                      name='specialNeedsDetails'
                      value={formData.specialNeedsDetails}
                      onChange={handleChange}
                      placeholder={t(
                        'services.personalTrainer.specialNeedsPlaceholder',
                        {
                          fallback:
                            'Describe any injuries, surgeries, or conditions that would affect your training...',
                        }
                      )}
                      className={`w-full p-3 border ${
                        errors.specialNeedsDetails
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } rounded-lg ${
                        isPremium
                          ? 'focus:ring-orange-500 focus:border-orange-500'
                          : 'focus:ring-blue-500 focus:border-blue-500'
                      } bg-white resize-none h-24`}
                    />
                    {errors.specialNeedsDetails && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.specialNeedsDetails}
                      </p>
                    )}

                    {/* Confirmation checkbox */}
                    <div className='mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                      <div className='flex items-start'>
                        <div className='flex items-center h-5'>
                          <input
                            id='confirmSpecialNeeds'
                            name='confirmSpecialNeeds'
                            type='checkbox'
                            checked={formData.confirmSpecialNeeds}
                            onChange={handleChange}
                            className={`h-4 w-4 ${
                              isPremium ? 'text-orange-600' : 'text-blue-600'
                            } focus:ring-2 border-gray-300 rounded`}
                          />
                        </div>
                        <label
                          htmlFor='confirmSpecialNeeds'
                          className='ml-3 text-sm text-gray-700'
                        >
                          {t('services.personalTrainer.confirmSpecialNeeds', {
                            fallback:
                              'I confirm that the information provided is accurate and understand that specialized training may be required',
                          })}
                        </label>
                      </div>
                      {errors.confirmSpecialNeeds && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.confirmSpecialNeeds}
                        </p>
                      )}
                    </div>

                    <div className='mt-3 flex items-start'>
                      <Info className='h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0' />
                      <p className='text-xs text-gray-500'>
                        {t('services.personalTrainer.specialNeedsNotice', {
                          fallback:
                            'Additional fee for specialized training programs. Our certified trainer will customize the workout to accommodate your specific needs safely.',
                        })}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Additional Notes Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <MessageSquare
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-orange-600' : 'text-blue-600'
                  }`}
                />
                {t('services.personalTrainer.additionalInfo', {
                  fallback: 'Additional Information',
                })}
              </h3>

              <div>
                <textarea
                  name='additionalNotes'
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder={t('services.personalTrainer.notesPlaceholder', {
                    fallback:
                      'Fitness goals, preferred exercises, equipment availability, specific areas to focus on...',
                  })}
                  className={`w-full p-3 border border-gray-300 rounded-lg ${
                    isPremium
                      ? 'focus:ring-orange-500 focus:border-orange-500'
                      : 'focus:ring-blue-500 focus:border-blue-500'
                  } bg-gray-50 resize-none h-24`}
                />
              </div>
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-800 text-sm'>{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Form Footer */}
          <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
            <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
              <span className='text-gray-400 text-sm uppercase tracking-wide'>
                {t('services.personalTrainer.totalPrice', {
                  fallback: 'Total Price',
                })}
              </span>
              <div className='flex items-center mt-1'>
                <span className='text-3xl font-light'>
                  ${currentPrice.toFixed(2)}
                </span>
                {formData.participantCount > 1 && (
                  <span className='ml-2 text-sm bg-blue-800 px-2 py-1 rounded'>
                    {formData.participantCount}{' '}
                    {t('services.personalTrainer.people', {
                      fallback: 'people',
                    })}
                  </span>
                )}
              </div>

              {/* Price breakdown */}
              <div className='text-xs text-gray-400 mt-2 space-y-1'>
                <div>
                  {formData.timeSlot &&
                    formData.workoutType &&
                    `${
                      formData.timeSlot.charAt(0).toUpperCase() +
                      formData.timeSlot.slice(1)
                    } ${formData.workoutType.toUpperCase()} Training at ${
                      LOCATION_OPTIONS.find(
                        (loc) => loc.id === formData.location
                      )?.name || 'Selected Location'
                    }`}
                </div>
                {formData.participantCount > 1 && (
                  <div className='text-blue-400'>
                    Group discount applied (15% off per additional person)
                  </div>
                )}
                {(formData.workoutType === 'hiit' ||
                  formData.workoutType === 'functional') && (
                  <div className='text-yellow-400'>
                    Specialized training surcharge (+15%)
                  </div>
                )}
                {formData.workoutType === 'strength' && (
                  <div className='text-yellow-400'>
                    Strength training surcharge (+10%)
                  </div>
                )}
                {formData.hasSpecialNeeds && (
                  <div>Specialized training program: +$20</div>
                )}
                {formData.minorsCount > 0 && (
                  <div className='text-yellow-400'>
                    {formData.minorsCount} participant(s) under 18
                  </div>
                )}
              </div>
            </div>

            <div className='flex space-x-4'>
              <button
                type='button'
                onClick={onCancel}
                disabled={isSubmitting}
                className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition disabled:opacity-50'
              >
                {t('common.cancel', { fallback: 'Cancel' })}
              </button>

              <button
                type='submit'
                disabled={isSubmitting}
                className={`px-8 py-3 ${
                  isPremium
                    ? 'bg-orange-600 hover:bg-orange-500'
                    : 'bg-blue-600 hover:bg-blue-500'
                } text-white rounded-lg transition flex items-center disabled:opacity-50`}
              >
                <CreditCard className='h-4 w-4 mr-2' />
                {isSubmitting
                  ? t('services.personalTrainer.booking', {
                      fallback: 'Booking...',
                    })
                  : t('services.personalTrainer.book', {
                      fallback: 'Book Training',
                    })}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default PersonalTrainerForm;
