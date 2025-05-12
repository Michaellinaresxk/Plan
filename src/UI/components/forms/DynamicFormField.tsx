import { useTranslation } from '@/lib/i18n/client';
import { differenceInDays, format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock, Upload } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { Controller } from 'react-hook-form';

const DynamicFormField = ({ field, isPremium, formMethods }) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = formMethods;

  // Check if field should be conditionally rendered
  if (field.dependsOn) {
    const watchedValue = watch(field.dependsOn.field);
    if (watchedValue !== field.dependsOn.value) {
      return null;
    }
  }

  const accentColor = isPremium ? 'amber' : 'blue';

  // Error message display
  const fieldError = errors[field.id];

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            id={field.id}
            {...register(field.id, {
              required: field.required && 'This field is required',
              pattern: field.validation?.pattern
                ? {
                    value: new RegExp(field.validation.pattern),
                    message: 'Invalid format',
                  }
                : undefined,
            })}
            placeholder={field.placeholder}
            className={`
              w-full p-3 border rounded-lg focus:outline-none focus:ring-2
              ${
                fieldError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : `focus:ring-${accentColor}-500 focus:border-${accentColor}-500`
              }
            `}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            {...register(field.id, {
              required: field.required && 'This field is required',
            })}
            placeholder={field.placeholder}
            rows={4}
            className={`
              w-full p-3 border rounded-lg focus:outline-none focus:ring-2
              ${
                fieldError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : `focus:ring-${accentColor}-500 focus:border-${accentColor}-500`
              }
            `}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            {...register(field.id, {
              required: field.required && 'This field is required',
            })}
            className={`
              w-full p-3 pr-10 appearance-none border rounded-lg focus:outline-none focus:ring-2
              ${
                fieldError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : `focus:ring-${accentColor}-500 focus:border-${accentColor}-500`
              }
            `}
          >
            <option value=''>{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            id={field.id}
            type='number'
            {...register(field.id, {
              required: field.required && 'This field is required',
              min: field.validation?.min
                ? {
                    value: field.validation.min,
                    message: `Minimum value is ${field.validation.min}`,
                  }
                : undefined,
              max: field.validation?.max
                ? {
                    value: field.validation.max,
                    message: `Maximum value is ${field.validation.max}`,
                  }
                : undefined,
            })}
            placeholder={field.placeholder}
            className={`
              w-full p-3 border rounded-lg focus:outline-none focus:ring-2
              ${
                fieldError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : `focus:ring-${accentColor}-500 focus:border-${accentColor}-500`
              }
            `}
          />
        );

      case 'date':
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required && 'This field is required' }}
            render={({ field: { onChange, value } }) => (
              <div
                className={`border rounded-xl overflow-hidden shadow-sm ${
                  isPremium ? 'border-amber-200' : 'border-blue-200'
                }`}
              >
                <DayPicker
                  mode='single'
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) =>
                    onChange(date ? date.toISOString() : null)
                  }
                  disabled={{ before: new Date() }}
                  className='rdp-custom p-2'
                  styles={{
                    day_selected: {
                      backgroundColor: isPremium ? '#f59e0b' : '#3b82f6',
                      color: 'white',
                    },
                    day_today: {
                      color: isPremium ? '#f59e0b' : '#3b82f6',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </div>
            )}
          />
        );

      case 'dateRange':
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required && 'This field is required' }}
            render={({ field: { onChange, value } }) => (
              <div
                className={`border rounded-xl overflow-hidden shadow-sm ${
                  isPremium ? 'border-amber-200' : 'border-blue-200'
                }`}
              >
                <DayPicker
                  mode='range'
                  selected={value}
                  onSelect={onChange}
                  disabled={{ before: new Date() }}
                  className='rdp-custom p-2'
                  styles={{
                    day_selected: {
                      backgroundColor: isPremium ? '#f59e0b' : '#3b82f6',
                      color: 'white',
                    },
                    day_today: {
                      color: isPremium ? '#f59e0b' : '#3b82f6',
                      fontWeight: 'bold',
                    },
                  }}
                />

                {value?.from && value?.to && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg my-2 mx-2 ${
                      isPremium
                        ? 'bg-amber-50 border border-amber-100'
                        : 'bg-blue-50 border border-blue-100'
                    }`}
                  >
                    <p className='text-sm flex items-center'>
                      <Calendar
                        size={15}
                        className={`mr-1.5 ${
                          isPremium ? 'text-amber-500' : 'text-blue-500'
                        }`}
                      />
                      <span>
                        {format(new Date(value.from), 'PPP')} —{' '}
                        {format(new Date(value.to), 'PPP')}
                      </span>
                    </p>
                    <p className='text-xs text-gray-500 mt-1'>
                      {differenceInDays(
                        new Date(value.to),
                        new Date(value.from)
                      ) + 1}{' '}
                      {differenceInDays(
                        new Date(value.to),
                        new Date(value.from)
                      ) +
                        1 ===
                      1
                        ? t('calendar.day', { fallback: 'day' })
                        : t('calendar.days', { fallback: 'days' })}
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          />
        );

      case 'time':
        return (
          <div className='relative'>
            <input
              id={field.id}
              type='time'
              {...register(field.id, {
                required: field.required && 'This field is required',
              })}
              className={`
                w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2
                ${
                  fieldError
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : `focus:ring-${accentColor}-500 focus:border-${accentColor}-500`
                }
              `}
            />
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Clock size={18} className='text-gray-400' />
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className='flex items-center'>
            <input
              id={field.id}
              type='checkbox'
              {...register(field.id)}
              className={`
                w-5 h-5 rounded focus:ring-2 text-${accentColor}-500
                focus:ring-${accentColor}-500
              `}
            />
            <label htmlFor={field.id} className='ml-2 text-sm text-gray-700'>
              {field.label}
            </label>
          </div>
        );

      case 'upload':
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required && 'This field is required' }}
            render={({ field: { onChange, value } }) => (
              <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
                <div className='space-y-1 text-center'>
                  <Upload className='mx-auto h-12 w-12 text-gray-400' />
                  <div className='flex text-sm text-gray-600'>
                    <label
                      htmlFor={`file-upload-${field.id}`}
                      className={`relative cursor-pointer rounded-md font-medium text-${accentColor}-600 hover:text-${accentColor}-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-${accentColor}-500`}
                    >
                      <span>Upload a file</span>
                      <input
                        id={`file-upload-${field.id}`}
                        name={field.id}
                        type='file'
                        className='sr-only'
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                      />
                    </label>
                    <p className='pl-1'>or drag and drop</p>
                  </div>
                  <p className='text-xs text-gray-500'>
                    PNG, JPG, GIF up to 10MB
                  </p>
                  {value && (
                    <p className='text-sm text-gray-600 mt-2'>
                      Selected file: {value.name}
                    </p>
                  )}
                </div>
              </div>
            )}
          />
        );

      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  return (
    <div className='mb-4'>
      {field.type !== 'checkbox' && (
        <label
          htmlFor={field.id}
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          {field.label}
          {field.required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      {renderField()}

      {field.helpText && (
        <p className='mt-1 text-xs text-gray-500'>{field.helpText}</p>
      )}

      {fieldError && (
        <p className='mt-1 text-xs text-red-500'>{fieldError.message}</p>
      )}
    </div>
  );
};

export default DynamicFormField;
