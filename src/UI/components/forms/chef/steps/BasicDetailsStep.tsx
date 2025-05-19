// steps/BasicDetailsStep.jsx
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Gift } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { formatDate } from '@/utils/chefFormUtils';
import { occasionTypes } from '@/constants/chefFormConsts';

interface BasicDetailsStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onDateSelect: (dates: string[]) => void;
  errors: Record<string, string>;
  getMinDate: () => string;
}

const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({
  formData,
  onChange,
  onDateSelect,
  errors,
  getMinDate,
}) => {
  const { t } = useTranslation();
  const [calendar, setCalendar] = useState<Set<string>>(
    new Set(formData.dates)
  );

  // Helper function to toggle date selection for multiple days service
  const toggleDateSelection = (dateStr: string) => {
    const newDates = new Set(calendar);

    if (newDates.has(dateStr)) {
      newDates.delete(dateStr);
    } else {
      newDates.add(dateStr);
    }

    setCalendar(newDates);
    onDateSelect(Array.from(newDates));
  };

  // Generate calendar days for multiple days selection
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1); // Start from tomorrow

    // Generate 30 days from tomorrow
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      days.push({
        date,
        dateStr,
        selected: calendar.has(dateStr),
      });
    }

    return days;
  };

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
        <Calendar className='w-5 h-5 mr-2 text-amber-600' />
        {t('chef.form.step1.title', { fallback: 'When & Where' })}
      </h3>

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
          <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
            <Calendar className='w-4 h-4 mr-2 text-amber-700' />
            {t('chef.form.selectDates', { fallback: 'Select Dates' })} *
          </label>

          {errors.dates && (
            <p className='text-red-500 text-xs mb-2'>{errors.dates}</p>
          )}

          <div className='bg-gray-50 rounded-lg border border-gray-300 p-4'>
            <div className='grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-500 mb-2'>
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            <div className='grid grid-cols-7 gap-2'>
              {generateCalendarDays().map((day) => {
                const dayOfWeek = day.date.getDay();

                // If this is the first day and it doesn't start on Sunday,
                // add empty placeholders for the days of the week before it
                if (day === generateCalendarDays()[0]) {
                  const placeholders = [];
                  for (let i = 0; i < dayOfWeek; i++) {
                    placeholders.push(
                      <div key={`placeholder-${i}`} className='h-10'></div>
                    );
                  }

                  if (placeholders.length > 0) {
                    return [
                      ...placeholders,
                      <button
                        key={day.dateStr}
                        type='button'
                        onClick={() => toggleDateSelection(day.dateStr)}
                        className={`h-10 rounded-lg flex items-center justify-center font-medium
                          ${
                            day.selected
                              ? 'bg-amber-600 text-white'
                              : 'bg-white border border-gray-300 hover:bg-amber-50'
                          }
                        `}
                      >
                        {day.date.getDate()}
                      </button>,
                    ];
                  }
                }

                return (
                  <button
                    key={day.dateStr}
                    type='button'
                    onClick={() => toggleDateSelection(day.dateStr)}
                    className={`h-10 rounded-lg flex items-center justify-center font-medium 
                      ${
                        day.selected
                          ? 'bg-amber-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-amber-50'
                      }
                    `}
                  >
                    {day.date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Dates Summary */}
          {calendar.size > 0 && (
            <div className='mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100'>
              <div className='text-sm font-medium text-amber-800 mb-1'>
                Selected dates: {calendar.size}
              </div>
              <div className='flex flex-wrap gap-2'>
                {Array.from(calendar)
                  .sort()
                  .map((dateStr) => (
                    <div
                      key={dateStr}
                      className='text-xs bg-white px-2 py-1 rounded border border-amber-200'
                    >
                      {formatDate(dateStr)}
                    </div>
                  ))}
              </div>
            </div>
          )}
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
        {/* Location Field - Direct Address Input */}
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
              <label className='text-sm font-medium text-gray-700 mb-2'>
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
    </div>
  );
};

export default BasicDetailsStep;
