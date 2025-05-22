import { occasionTypes } from '@/constants/chefFormConsts';
import { useDateSelection } from '@/hooks/useDateSelection';
import { useTranslation } from '@/lib/i18n/client';
import CalendarPicker from '@/UI/components/calendar/CalendarPicker';
import SelectedDatesSummary from '@/UI/components/calendar/SelectedDatesSummary';
import { Calendar, Clock, Gift, MapPin } from 'lucide-react';

// Main Basic Details Step Component
const BasicDetailsStep = ({
  formData,
  onChange,
  onDateSelect,
  errors,
  getMinDate,
}) => {
  const { t } = useTranslation();

  // Use the custom hook for date selection
  const { selectedDates, toggleDate, removeDate, clearAllDates } =
    useDateSelection(formData.dates || [], onDateSelect);

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
        <Calendar className='w-5 h-5 mr-2 text-amber-600' />
        {t('chef.form.step1.title', { fallback: 'When & Where' })}
      </h3>

      {/* Service Type Toggle - Optional, based on your needs */}
      {formData.serviceType && (
        <div className='mb-6'>
          <label className='text-sm font-medium text-gray-700 mb-3 block'>
            Service Type
          </label>
          <div className='flex gap-4'>
            <label className='flex items-center cursor-pointer'>
              <input
                type='radio'
                name='serviceType'
                value='single'
                checked={formData.serviceType === 'single'}
                onChange={onChange}
                className='mr-2 text-amber-600 focus:ring-amber-500'
              />
              <span className='text-gray-700'>Single Day Service</span>
            </label>
            <label className='flex items-center cursor-pointer'>
              <input
                type='radio'
                name='serviceType'
                value='multiple'
                checked={formData.serviceType === 'multiple'}
                onChange={onChange}
                className='mr-2 text-amber-600 focus:ring-amber-500'
              />
              <span className='text-gray-700'>Multiple Days Service</span>
            </label>
          </div>
        </div>
      )}

      {/* Date Selection */}
      {formData.serviceType === 'single' ? (
        /* Single Day Service */
        <div>
          <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
            <Calendar className='w-4 h-4 mr-2 text-amber-700' />
            {t('chef.form.date', { fallback: 'Date' })} *
          </label>
          <input
            type='date'
            name='date'
            value={formData.date}
            onChange={onChange}
            min={getMinDate()}
            className={`w-full p-3 border ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
          />
          {errors.date && (
            <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
          )}
        </div>
      ) : (
        /* Multiple Days Service */
        <div>
          <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
            <Calendar className='w-4 h-4 mr-2 text-amber-700' />
            {t('chef.form.selectDates', { fallback: 'Select Dates' })} *
          </label>

          {errors.dates && (
            <p className='text-red-500 text-xs mb-3'>{errors.dates}</p>
          )}

          <CalendarPicker
            selectedDates={selectedDates}
            onDateToggle={toggleDate}
            minDate={getMinDate()}
          />

          <SelectedDatesSummary
            selectedDates={selectedDates}
            onRemoveDate={removeDate}
            onClearAll={clearAllDates}
          />
        </div>
      )}

      {/* Time Field */}
      <div>
        <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
          <Clock className='w-4 h-4 mr-2 text-amber-700' />
          {t('chef.form.time', { fallback: 'Time' })} *
        </label>
        <select
          name='time'
          value={formData.time}
          onChange={onChange}
          className={`w-full p-3 border ${
            errors.time ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
        >
          <option value=''>Select a time</option>
          <option value='Breakfast'>Breakfast</option>
          <option value='Lunch'>Lunch</option>
          <option value='Dinner'>Dinner</option>
        </select>
        {errors.time && (
          <p className='text-red-500 text-xs mt-1'>{errors.time}</p>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Location Field */}
        <div>
          <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
            <MapPin className='w-4 h-4 mr-2 text-amber-700' />
            {t('chef.form.location', { fallback: 'Location Address' })} *
          </label>
          <input
            type='text'
            name='locationAddress'
            value={formData.locationAddress}
            onChange={onChange}
            placeholder='Enter the full address where the event will be held'
            className={`w-full p-3 border ${
              errors.locationAddress ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
          />
          {errors.locationAddress && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.locationAddress}
            </p>
          )}
          <p className='text-xs text-gray-500 mt-1'>
            Please provide the complete address including any relevant details
            for the chef
          </p>
        </div>

        {/* Occasion Field */}
        <div>
          <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
            <Gift className='w-4 h-4 mr-2 text-amber-700' />
            {t('chef.form.occasion', { fallback: 'Occasion' })} *
          </label>
          <select
            name='occasion'
            value={formData.occasion}
            onChange={onChange}
            className={`w-full p-3 border ${
              errors.occasion ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
          >
            <option value=''>Select occasion</option>
            {occasionTypes.map((occasion) => (
              <option key={occasion.id} value={occasion.id}>
                {occasion.name}
              </option>
            ))}
          </select>
          {errors.occasion && (
            <p className='text-red-500 text-xs mt-1'>{errors.occasion}</p>
          )}

          {/* Show custom occasion input if "Other" is selected */}
          {formData.occasion === 'other' && (
            <div className='mt-3'>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>
                Please specify the occasion *
              </label>
              <input
                type='text'
                name='otherOccasion'
                value={formData.otherOccasion}
                onChange={onChange}
                placeholder='Enter the occasion'
                className={`w-full p-3 border ${
                  errors.otherOccasion ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
              />
              {errors.otherOccasion && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.otherOccasion}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      {formData.serviceType === 'multiple' && selectedDates.size > 0 && (
        <div className='pt-4 border-t border-gray-100'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-gray-600 flex items-center'>
              <Calendar className='w-4 h-4 mr-1' />
              {selectedDates.size} date{selectedDates.size !== 1 ? 's' : ''}{' '}
              selected
            </span>
            <span className='text-amber-600 font-medium'>
              Ready to continue
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicDetailsStep;
