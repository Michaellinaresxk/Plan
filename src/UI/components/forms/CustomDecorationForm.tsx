import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service, BookingDate } from '@/types/type';
import {
  Upload,
  Calendar,
  Palette,
  MapPin,
  MessageSquare,
  Tag,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ColorPicker from '../ColorPicker';

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
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string>('12:00');
  const [location, setLocation] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('');
  const [colors, setColors] = useState<string[]>(['#FFCD61', '#ffffff']);
  const [notes, setNotes] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Decoration occasion options
  const occasionOptions = [
    { id: 'birthday', label: t('decorationForm.occasions.birthday') },
    { id: 'anniversary', label: t('decorationForm.occasions.anniversary') },
    { id: 'proposal', label: t('decorationForm.occasions.proposal') },
    { id: 'romantic', label: t('decorationForm.occasions.romantic') },
    { id: 'baby-shower', label: t('decorationForm.occasions.babyShower') },
    { id: 'other', label: t('decorationForm.occasions.other') },
  ];

  // Location options
  const locationOptions = [
    { id: 'indoor', label: t('decorationForm.locations.indoor') },
    { id: 'outdoor', label: t('decorationForm.locations.outdoor') },
    { id: 'poolside', label: t('decorationForm.locations.poolside') },
    { id: 'beach', label: t('decorationForm.locations.beach') },
    { id: 'terrace', label: t('decorationForm.locations.terrace') },
  ];

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
      newErrors.date = t('forms.errors.dateRequired');
    }

    if (!time) {
      newErrors.time = t('forms.errors.timeRequired');
    }

    if (!occasion) {
      newErrors.occasion = t('forms.errors.occasionRequired');
    }

    if (!location) {
      newErrors.location = t('forms.errors.locationRequired');
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

    // Create form data
    const formData = {
      date: dateObj,
      time,
      occasion,
      location,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Date and Time Selection */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-gray-700 font-medium mb-2'>
              {t('decorationForm.date')}
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
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-10 py-2 border rounded-lg ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.date && (
                <p className='mt-1 text-red-500 text-sm'>{errors.date}</p>
              )}
            </div>
          </div>

          <div>
            <label className='block text-gray-700 font-medium mb-2'>
              {t('decorationForm.time')}
            </label>
            <div className='relative flex items-center'>
              <input
                type='time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full pl-10 py-2 border rounded-lg ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className='absolute left-3 text-gray-400'>
                <Calendar size={18} />
              </span>
              {errors.time && (
                <p className='mt-1 text-red-500 text-sm'>{errors.time}</p>
              )}
            </div>
          </div>
        </div>

        {/* Occasion */}
        <div>
          <label className='block text-gray-700 font-medium mb-2'>
            {t('decorationForm.occasion')}
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-3 text-gray-400'>
              <Tag size={18} />
            </span>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className={`w-full pl-10 py-2 border rounded-lg appearance-none ${
                errors.occasion ? 'border-red-500' : 'border-gray-300'
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

        {/* Location */}
        <div>
          <label className='block text-gray-700 font-medium mb-2'>
            {t('decorationForm.location')}
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-3 text-gray-400'>
              <MapPin size={18} />
            </span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full pl-10 py-2 border rounded-lg appearance-none ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value=''>{t('forms.select')}</option>
              {locationOptions.map((option) => (
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
            {errors.location && (
              <p className='mt-1 text-red-500 text-sm'>{errors.location}</p>
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
            <label className='flex flex-col w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50'>
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
                      className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className='w-8 h-8 text-gray-400' />
                    <p className='mb-2 text-sm text-gray-500'>
                      {t('decorationForm.uploadInstruction')}
                    </p>
                    <p className='text-xs text-gray-400'>
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
              className='w-full pl-10 py-2 border border-gray-300 rounded-lg resize-none'
              placeholder={t('decorationForm.notesPlaceholder')}
            ></textarea>
          </div>
        </div>

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
            disabled={isSubmitting}
            className={`px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
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
