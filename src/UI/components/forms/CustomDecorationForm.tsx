import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service, BookingDate } from '@/types/type';
import {
  Upload,
  Calendar,
  MessageSquare,
  Tag,
  Clock,
  AlertCircle,
  Home,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ColorPicker from '../shared/ColorPicker';

interface CustomDecorationFormProps {
  service: Service;
  onBookService: (
    service: Service,
    dates: BookingDate,
    guests: number,
    formData: Record<string, any>
  ) => void;
  onClose: () => void;
}

const CustomDecorationForm: React.FC<CustomDecorationFormProps> = ({
  service,
  onBookService,
  onClose,
}) => {
  const { t } = useTranslation();

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

  // Decoration occasion options
  const occasionOptions = [
    { id: 'birthday', label: t('decorationForm.occasions.birthday') },
    { id: 'anniversary', label: t('decorationForm.occasions.anniversary') },
    { id: 'proposal', label: t('decorationForm.occasions.proposal') },
    { id: 'romantic', label: t('decorationForm.occasions.romantic') },
    { id: 'baby-shower', label: t('decorationForm.occasions.babyShower') },
    { id: 'other', label: t('decorationForm.occasions.other') },
  ];

  // Get the minimum date (72 hours from now)
  function getMinimumDate(): Date {
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + 72); // Add 72 hours
    return minDate;
  }

  // Format minimum date as YYYY-MM-DD for the date input
  function formatMinDateForInput(): string {
    const minDate = getMinimumDate();
    return minDate.toISOString().split('T')[0];
  }

  // Check date is valid (minimum 72 hours in advance)
  useEffect(() => {
    if (date) {
      const now = new Date();
      const minBookingTime = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours from now

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

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add/remove colors
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

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!date) {
      newErrors.date = t('forms.errors.dateRequired', {
        fallback: 'Date is required',
      });
    } else {
      const now = new Date();
      const minBookingTime = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours from now
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

    if (!location) {
      newErrors.location = t('forms.errors.locationRequired', {
        fallback: 'Location type is required',
      });
    }

    if (!exactAddress.trim()) {
      newErrors.exactAddress = t('forms.errors.addressRequired', {
        fallback: 'Exact address in Punta Cana is required',
      });
    } else if (!exactAddress.toLowerCase().includes('punta cana')) {
      newErrors.exactAddress = t('forms.errors.puntaCanaOnly', {
        fallback: 'This service is only available in Punta Cana area',
      });
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

    setIsSubmitting(true);

    // Create booking date object
    const dateObj = date ? new Date(date) : new Date();
    const bookingDate: BookingDate = {
      startDate: dateObj,
      endDate: dateObj,
    };

    // Determine final occasion value (either selected option or custom text)
    const finalOccasion = occasion === 'other' ? customOccasion : occasion;

    // Create form data
    const formData = {
      date: dateObj,
      time,
      occasion: finalOccasion,
      locationType: location,
      exactAddress,
      colors,
      notes,
      referenceImage,
    };

    // Call onBookService with the required parameters
    // Using 1 as a placeholder for guests since it's required by the interface
    // but might not be relevant for decorations
    onBookService(service, bookingDate, 1, formData);

    setIsSubmitting(false);
    onClose();
  };

  const isPremium = service.packageType.includes('premium');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={isPremium ? 'text-white' : ''}
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Service Location Notice */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <AlertCircle className='h-5 w-5 text-blue-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm text-blue-700'>
                {t('decorationForm.serviceAreaNotice', {
                  fallback:
                    'Our decoration services are currently available only in the Punta Cana area. Please ensure your event location is within this region.',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-gray-700 font-medium mb-2'>
              {t('decorationForm.date')} <span className='text-red-500'>*</span>
              <span className='ml-1 text-sm text-gray-500 font-normal'>
                (min. 72h in advance)
              </span>
            </label>
            <div className='relative'>
              <div className='flex items-center'>
                <span className='absolute left-3 text-gray-400'>
                  <Calendar size={18} />
                </span>
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
                  className={`w-full pl-10 py-2 border rounded-lg ${
                    errors.date || invalidDateMessage
                      ? 'border-red-500'
                      : isPremium
                      ? 'premium-input'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              {(errors.date || invalidDateMessage) && (
                <p className='mt-1 text-red-500 text-sm'>
                  {errors.date || invalidDateMessage}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className='block text-gray-700 font-medium mb-2'>
              {t('decorationForm.time')} <span className='text-red-500'>*</span>
            </label>
            <div className='relative flex items-center'>
              <span className='absolute left-3 text-gray-400'>
                <Clock size={18} />
              </span>
              <input
                type='time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full pl-10 py-2 border rounded-lg ${
                  errors.time
                    ? 'border-red-500'
                    : isPremium
                    ? 'premium-input'
                    : 'border-gray-300'
                }`}
              />
              {errors.time && (
                <p className='mt-1 text-red-500 text-sm'>{errors.time}</p>
              )}
            </div>
          </div>
        </div>

        {/* Occasion */}
        <div>
          <label className='block text-gray-700 font-medium mb-2'>
            {t('decorationForm.occasion')}{' '}
            <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-3 text-gray-400'>
              <Tag size={18} />
            </span>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className={`w-full pl-10 py-2 border rounded-lg appearance-none ${
                errors.occasion
                  ? 'border-red-500'
                  : isPremium
                  ? 'premium-select'
                  : 'border-gray-300'
              }`}
            >
              <option value=''>{t('forms.select')}</option>
              {occasionOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='fill-current h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
            {errors.occasion && (
              <p className='mt-1 text-red-500 text-sm'>{errors.occasion}</p>
            )}
          </div>
        </div>

        {/* Custom Occasion (only shown when 'other' is selected) */}
        {occasion === 'other' && (
          <div>
            <label className='block text-gray-700 font-medium mb-2'>
              {t('decorationForm.customOccasion', {
                fallback: 'Specify your occasion',
              })}{' '}
              <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-3 text-gray-400'>
                <Tag size={18} />
              </span>
              <input
                type='text'
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                placeholder={t('decorationForm.customOccasionPlaceholder', {
                  fallback: 'e.g., Corporate event, Garden party',
                })}
                className={`w-full pl-10 py-2 border rounded-lg ${
                  errors.customOccasion
                    ? 'border-red-500'
                    : isPremium
                    ? 'premium-input'
                    : 'border-gray-300'
                }`}
              />
              {errors.customOccasion && (
                <p className='mt-1 text-red-500 text-sm'>
                  {errors.customOccasion}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Exact Address */}
        <div>
          <label className='block text-gray-700 font-medium mb-2'>
            {t('decorationForm.exactAddress', {
              fallback: 'Exact Address in Punta Cana',
            })}{' '}
            <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-3 text-gray-400'>
              <Home size={18} />
            </span>
            <textarea
              value={exactAddress}
              onChange={(e) => setExactAddress(e.target.value)}
              rows={3}
              placeholder={t('decorationForm.addressPlaceholder', {
                fallback:
                  'Full address in Punta Cana area (hotel name, villa number, street, etc.)',
              })}
              className={`w-full pl-10 py-2 border rounded-lg resize-none ${
                errors.exactAddress
                  ? 'border-red-500'
                  : isPremium
                  ? 'premium-input'
                  : 'border-gray-300'
              }`}
            ></textarea>
            {errors.exactAddress && (
              <p className='mt-1 text-red-500 text-sm'>{errors.exactAddress}</p>
            )}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <label className='block text-gray-700 font-medium mb-2'>
            {t('decorationForm.colors')}
          </label>
          <div className='space-y-3'>
            <div className='flex flex-wrap gap-3 items-center'>
              {colors.map((color, index) => (
                <div key={index} className='flex items-center'>
                  <ColorPicker
                    color={color}
                    onChange={(newColor) => updateColor(index, newColor)}
                  />
                  {colors.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeColor(index)}
                      className='ml-2 text-gray-400 hover:text-red-500'
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {colors.length < 5 && (
                <button
                  type='button'
                  onClick={addColor}
                  className='px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100'
                >
                  + {t('decorationForm.addColor')}
                </button>
              )}
            </div>
            <p className='text-sm text-gray-500'>
              {t('decorationForm.colorsHint')}
            </p>
          </div>
        </div>

        {/* Reference Image Upload */}
        <div>
          <label className='block text-gray-700 font-medium mb-2'>
            {t('decorationForm.referenceImage')}
          </label>
          <div className='flex items-center justify-center w-full'>
            <label
              className={`flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                isPremium
                  ? 'border-amber-500/30 hover:border-amber-500/50 hover:bg-gray-800/30'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                {imagePreview ? (
                  <div className='relative w-full h-full flex items-center justify-center'>
                    <img
                      src={imagePreview}
                      alt='Upload preview'
                      className='h-24 object-contain'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setReferenceImage(null);
                        setImagePreview(null);
                      }}
                      className={`absolute top-0 right-0 ${
                        isPremium
                          ? 'bg-amber-500 text-black'
                          : 'bg-red-500 text-white'
                      } rounded-full p-1`}
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload
                      className={`w-8 h-8 ${
                        isPremium ? 'text-amber-500/70' : 'text-gray-400'
                      }`}
                    />
                    <p
                      className={`mb-2 text-sm ${
                        isPremium ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {t('decorationForm.uploadInstruction')}
                    </p>
                    <p
                      className={`text-xs ${
                        isPremium ? 'text-gray-400' : 'text-gray-400'
                      }`}
                    >
                      {t('decorationForm.uploadHint')}
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
        </div>

        {/* Additional Notes */}
        <div>
          <label className='block text-gray-700 font-medium mb-2'>
            {t('decorationForm.notes')}
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-3 text-gray-400'>
              <MessageSquare size={18} />
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className={`w-full pl-10 py-2 border rounded-lg resize-none ${
                isPremium ? 'premium-input' : 'border-gray-300'
              }`}
              placeholder={t('decorationForm.notesPlaceholder')}
            ></textarea>
          </div>
        </div>

        {/* Required fields notice */}
        <p className='text-sm text-gray-500'>
          <span className='text-red-500'>*</span>{' '}
          {t('forms.requiredFields', { fallback: 'Required fields' })}
        </p>

        {/* Submit Button */}
        <div className='flex justify-end space-x-3'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100'
          >
            {t('forms.cancel')}
          </button>
          <button
            type='submit'
            disabled={isSubmitting || !!invalidDateMessage}
            className={`px-4 py-2 ${
              isPremium
                ? 'luxury-button text-black font-medium'
                : 'bg-amber-500 text-black hover:bg-amber-600'
            } rounded-lg transition-colors ${
              isSubmitting || !!invalidDateMessage
                ? 'opacity-70 cursor-not-allowed'
                : ''
            }`}
          >
            {isSubmitting ? t('forms.submitting') : t('forms.confirmBooking')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CustomDecorationForm;
