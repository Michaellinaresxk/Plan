import { Service } from '@/types/type';
import {
  Calendar,
  Users,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  SunMedium,
  Moon,
  MessageSquare,
  Info,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/client';
import { useEffect, useState } from 'react';

interface YogaServiceFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const YogaServiceForm: React.FC<YogaServiceFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '', // 'morning' or 'evening'
    location: '',
    participantCount: 1,
    hasSpecialNeeds: false,
    specialNeedsDetails: '',
    confirmSpecialNeeds: false,
    additionalNotes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(service.price);

  // Calculate price based on participant count
  useEffect(() => {
    const basePrice = service.price;
    const pricePerPerson =
      formData.participantCount > 1
        ? basePrice * 0.8 // 20% discount per additional person
        : basePrice;

    const totalPrice = pricePerPerson * formData.participantCount;

    // Additional fee for special needs accommodations
    const specialNeedsFee = formData.hasSpecialNeeds ? 15 : 0;

    setCurrentPrice(totalPrice + specialNeedsFee);
  }, [formData.participantCount, formData.hasSpecialNeeds, service.price]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      // For checkbox inputs
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));

      // If unchecking hasSpecialNeeds, also reset related fields
      if (name === 'hasSpecialNeeds' && !checked) {
        setFormData((prev) => ({
          ...prev,
          hasSpecialNeeds: false,
          specialNeedsDetails: '',
          confirmSpecialNeeds: false,
        }));
      }
    } else {
      // For other input types
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear any errors for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle participant count changes
  const updateParticipantCount = (increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      participantCount: increment
        ? prev.participantCount + 1
        : Math.max(1, prev.participantCount - 1),
    }));
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
      newErrors.location = t('form.errors.confirmation', {
        fallback: 'Please confirm location',
      });
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = t('form.errors.required', {
        fallback: 'Please select a time slot',
      });
    }

    // Validate special needs confirmation if applicable
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Add calculated price to form data before submission
    const submissionData = {
      ...formData,
      calculatedPrice: currentPrice,
      serviceId: service.id,
      serviceName: service.name,
    };

    onSubmit(submissionData);
  };

  // Determine if service is premium based on package type
  const isPremium = service.packageType?.includes('premium');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
        <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
          {/* Form Header - Zen Style */}
          <div
            className={`bg-gradient-to-r ${
              isPremium
                ? 'from-amber-800 via-amber-700 to-amber-800'
                : 'from-teal-800 via-teal-700 to-teal-800'
            } p-6 text-white`}
          >
            <h2 className='text-2xl font-light tracking-wide flex items-center'>
              {t('services.yoga.formTitle', {
                fallback: 'Yoga Session Booking',
              })}
            </h2>
            <p
              className={`${
                isPremium ? 'text-amber-100' : 'text-teal-100'
              } mt-1 font-light`}
            >
              {t('services.yoga.formDescription', {
                fallback:
                  'Find your inner peace with a personalized yoga session',
              })}
            </p>
          </div>

          {/* Form Body */}
          <div className='p-8 space-y-8'>
            {/* Date and Time Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Calendar
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.yoga.scheduling', {
                  fallback: 'Session Scheduling',
                })}
              </h3>

              {/* Date Selection */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-amber-600' : 'text-teal-600'
                    }`}
                  />
                  {t('services.yoga.date', { fallback: 'Select Date' })} *
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
                      ? 'focus:ring-amber-500 focus:border-amber-500'
                      : 'focus:ring-teal-500 focus:border-teal-500'
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
                      isPremium ? 'text-amber-600' : 'text-teal-600'
                    }`}
                  />
                  {t('services.yoga.timeSlot', { fallback: 'Time Slot' })} *
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
                                ? 'bg-amber-50 border-amber-300'
                                : 'bg-teal-50 border-teal-300'
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
                                  ? 'border-amber-500 bg-amber-500'
                                  : 'border-teal-500 bg-teal-500'
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
                        <SunMedium
                          className={`w-5 h-5 mr-2 ${
                            isPremium ? 'text-amber-500' : 'text-teal-500'
                          }`}
                        />
                        <span className='font-medium'>
                          {t('services.yoga.morning', {
                            fallback: 'Morning Session',
                          })}
                        </span>
                      </div>
                    </div>
                    <p className='text-gray-500 text-sm mt-2 ml-8'>
                      {t('services.yoga.morningTime', {
                        fallback: '7:00 AM - 11:00 AM',
                      })}
                    </p>
                  </div>

                  {/* Evening Option */}
                  <div
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        formData.timeSlot === 'evening'
                          ? `${
                              isPremium
                                ? 'bg-amber-50 border-amber-300'
                                : 'bg-teal-50 border-teal-300'
                            } shadow-sm`
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, timeSlot: 'evening' }))
                    }
                  >
                    <div className='flex items-center'>
                      <div
                        className={`
                        w-5 h-5 rounded-full border flex items-center justify-center mr-3
                        ${
                          formData.timeSlot === 'evening'
                            ? `${
                                isPremium
                                  ? 'border-amber-500 bg-amber-500'
                                  : 'border-teal-500 bg-teal-500'
                              }`
                            : 'border-gray-300'
                        }
                      `}
                      >
                        {formData.timeSlot === 'evening' && (
                          <CheckCircle className='w-4 h-4 text-white' />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <Moon
                          className={`w-5 h-5 mr-2 ${
                            isPremium ? 'text-amber-500' : 'text-teal-500'
                          }`}
                        />
                        <span className='font-medium'>
                          {t('services.yoga.evening', {
                            fallback: 'Evening Session',
                          })}
                        </span>
                      </div>
                    </div>
                    <p className='text-gray-500 text-sm mt-2 ml-8'>
                      {t('services.yoga.eveningTime', {
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

            {/* Location */}
            <div>
              <label className='flex items-center text-sm font-medium  text-grey-800 mb-2'>
                <MapPin className='w-4 h-4 mr-2 text-teal-500' />
                Location *
              </label>
              <input
                name='location'
                value={formData.location}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                } `}
                placeholder='Please provide the complete address where the yoga personal  will take place'
              />
              {errors.location && (
                <p className='text-red-500 text-xs mt-1'>{errors.location}</p>
              )}
            </div>

            {/* Participants Section */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <Users
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.yoga.participants', { fallback: 'Participants' })}
              </h3>

              {/* Participant Count */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Users
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-amber-600' : 'text-teal-600'
                    }`}
                  />
                  {t('services.yoga.participantCount', {
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
                    {t('services.yoga.groupDiscount', {
                      fallback: '20% discount per additional person',
                    })}
                  </p>
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
                              ? 'border-amber-300 bg-amber-50'
                              : 'border-teal-300 bg-teal-50'
                          }`
                        : 'border-gray-200 hover:bg-gray-50'
                    }
                  `}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      hasSpecialNeeds: !prev.hasSpecialNeeds,
                      // Reset related fields if turning off
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
                                ? 'border-amber-500 bg-amber-500'
                                : 'border-teal-500 bg-teal-500'
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
                      {t('services.yoga.specialNeeds', {
                        fallback: 'Disability or mobility constraints',
                      })}
                    </span>
                  </div>
                  <AlertCircle
                    className={`w-5 h-5 ${
                      isPremium ? 'text-amber-500' : 'text-teal-500'
                    }`}
                  />
                </div>

                {/* Special Needs Details (conditional) */}
                {formData.hasSpecialNeeds && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-4 p-4 border rounded-lg ${
                      isPremium ? 'border-amber-200' : 'border-teal-200'
                    }`}
                  >
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('services.yoga.specialNeedsDetails', {
                        fallback:
                          'Please specify disability or mobility constraints',
                      })}{' '}
                      *
                    </label>
                    <textarea
                      name='specialNeedsDetails'
                      value={formData.specialNeedsDetails}
                      onChange={handleChange}
                      placeholder={t('services.yoga.specialNeedsPlaceholder', {
                        fallback:
                          'Describe any conditions that would require special accommodation...',
                      })}
                      className={`w-full p-3 border ${
                        errors.specialNeedsDetails
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } rounded-lg ${
                        isPremium
                          ? 'focus:ring-amber-500 focus:border-amber-500'
                          : 'focus:ring-teal-500 focus:border-teal-500'
                      } bg-white resize-none h-24`}
                    />
                    {errors.specialNeedsDetails && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.specialNeedsDetails}
                      </p>
                    )}

                    {/* Double confirmation checkbox */}
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
                              isPremium ? 'text-amber-600' : 'text-teal-600'
                            } focus:ring-2 border-gray-300 rounded`}
                          />
                        </div>
                        <label
                          htmlFor='confirmSpecialNeeds'
                          className='ml-3 text-sm text-gray-700'
                        >
                          {t('services.yoga.confirmSpecialNeeds', {
                            fallback:
                              'I confirm that I or someone in my group has the special needs described above and requires accommodation',
                          })}
                        </label>
                      </div>
                      {errors.confirmSpecialNeeds && (
                        <p className='text-red-500 text-xs mt-1'>
                          {errors.confirmSpecialNeeds}
                        </p>
                      )}
                    </div>

                    {/* Special needs notice */}
                    <div className='mt-3 flex items-start'>
                      <Info className='h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0' />
                      <p className='text-xs text-gray-500'>
                        {t('services.yoga.specialNeedsNotice', {
                          fallback:
                            'There is a small additional fee for special accommodations. Our yoga instructor will contact you before the session to discuss specific adaptations needed.',
                        })}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Additional Notes Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
                <MessageSquare
                  className={`w-5 h-5 mr-2 ${
                    isPremium ? 'text-amber-600' : 'text-teal-600'
                  }`}
                />
                {t('services.yoga.additionalInfo', {
                  fallback: 'Additional Information',
                })}
              </h3>

              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <MessageSquare
                    className={`w-4 h-4 mr-2 ${
                      isPremium ? 'text-amber-600' : 'text-teal-600'
                    }`}
                  />
                  {t('services.yoga.notes', { fallback: 'Notes' })}
                </label>
                <textarea
                  name='additionalNotes'
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder={t('services.yoga.notesPlaceholder', {
                    fallback:
                      'Experience level, style preferences, specific goals for the session...',
                  })}
                  className={`w-full p-3 border border-gray-300 rounded-lg ${
                    isPremium
                      ? 'focus:ring-amber-500 focus:border-amber-500'
                      : 'focus:ring-teal-500 focus:border-teal-500'
                  } bg-gray-50 resize-none h-24`}
                />
              </div>
            </div>
          </div>

          {/* Form Footer with Price and Actions */}
          <div className='bg-gray-900 text-white p-6 flex flex-col md:flex-row items-center justify-between'>
            <div className='flex flex-col items-center md:items-start mb-4 md:mb-0'>
              <span className='text-gray-400 text-sm uppercase tracking-wide'>
                {t('services.yoga.totalPrice', { fallback: 'Total Price' })}
              </span>
              <div className='flex items-center mt-1'>
                <span className='text-3xl font-light'>
                  ${currentPrice.toFixed(2)}
                </span>
                {formData.participantCount > 1 && (
                  <span className='ml-2 text-sm bg-blue-800 px-2 py-1 rounded'>
                    {formData.participantCount}{' '}
                    {t('services.yoga.people', { fallback: 'people' })}
                  </span>
                )}
              </div>
              {formData.hasSpecialNeeds && (
                <span className='text-xs text-gray-400 mt-1'>
                  {t('services.yoga.includesSpecialAccommodation', {
                    fallback: 'Includes special accommodation fee',
                  })}
                </span>
              )}
            </div>

            <div className='flex space-x-4'>
              <button
                type='button'
                onClick={onCancel}
                className='px-5 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition'
              >
                {t('common.cancel', { fallback: 'Cancel' })}
              </button>

              <button
                type='submit'
                className={`px-8 py-3 ${
                  isPremium
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-teal-600 hover:bg-teal-500'
                } text-white rounded-lg transition flex items-center`}
              >
                <CreditCard className='h-4 w-4 mr-2' />
                {t('services.yoga.book', { fallback: 'Book Session' })}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default YogaServiceForm;
