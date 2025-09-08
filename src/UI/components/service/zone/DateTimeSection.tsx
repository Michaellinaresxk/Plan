import React from 'react';
import {
  Calendar,
  Clock,
  Info,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Repeat,
} from 'lucide-react';

interface DateTimeSectionProps {
  formData: {
    pickupDate: string;
    pickupTime: string;
    isRoundTrip: boolean;
    returnDate: string;
    returnTime: string;
  };
  errors: { [key: string]: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoundTripToggle: () => void;
  isSameDay: (date: string) => boolean;
  hasMinimum24Hours: (date: string) => boolean;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  formData,
  errors,
  onInputChange,
  onRoundTripToggle,
  isSameDay,
  hasMinimum24Hours,
}) => {
  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
        Schedule Information
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Pickup Date */}
        <div>
          <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
            <Calendar className='w-4 h-4 mr-2 text-emerald-700' />
            Pickup Date *
          </label>
          <input
            type='date'
            name='pickupDate'
            value={formData.pickupDate}
            onChange={onInputChange}
            className={`w-full p-3 border ${
              errors.pickupDate ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50`}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.pickupDate && (
            <p className='text-red-500 text-xs mt-1'>{errors.pickupDate}</p>
          )}
        </div>

        {/* Pickup Time */}
        <div>
          <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
            <Clock className='w-4 h-4 mr-2 text-emerald-700' />
            Pickup Time *
          </label>
          <input
            type='time'
            name='pickupTime'
            value={formData.pickupTime}
            onChange={onInputChange}
            className={`w-full p-3 border ${
              errors.pickupTime ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50`}
          />
          {errors.pickupTime && (
            <p className='text-red-500 text-xs mt-1'>{errors.pickupTime}</p>
          )}
        </div>
      </div>

      {/* Booking timing warnings */}
      {formData.pickupDate && (
        <div className='mt-4'>
          {isSameDay(formData.pickupDate) ? (
            <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start'>
              <Info className='w-4 h-4 text-amber-600 mr-2 mt-0.5' />
              <div className='text-sm text-amber-800'>
                <strong>Same-day booking:</strong> Requires immediate
                confirmation from our team.
              </div>
            </div>
          ) : !hasMinimum24Hours(formData.pickupDate) ? (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-start'>
              <AlertTriangle className='w-4 h-4 text-red-600 mr-2 mt-0.5' />
              <div className='text-sm text-red-800'>
                <strong>Advance booking required:</strong> Please book at least
                24 hours in advance.
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Round Trip Toggle */}
      <div className='mt-6'>
        <div
          className='flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer'
          onClick={onRoundTripToggle}
        >
          <div className='flex items-center'>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                formData.isRoundTrip
                  ? 'border-emerald-700 bg-emerald-700'
                  : 'border-gray-400'
              }`}
            >
              {formData.isRoundTrip && (
                <CheckCircle className='w-4 h-4 text-white' />
              )}
            </div>
            <span className='ml-3 font-medium text-gray-800'>
              Round Trip Service
            </span>
          </div>
          <span className='text-emerald-700'>
            {formData.isRoundTrip ? (
              <ChevronUp className='w-5 h-5' />
            ) : (
              <ChevronDown className='w-5 h-5' />
            )}
          </span>
        </div>

        {/* Return Trip Details */}
        {formData.isRoundTrip && (
          <div className='mt-4 pl-6 border-l-2 border-emerald-200 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Return Date */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 mr-2 text-emerald-700' />
                  Return Date *
                </label>
                <input
                  type='date'
                  name='returnDate'
                  value={formData.returnDate}
                  onChange={onInputChange}
                  className={`w-full p-3 border ${
                    errors.returnDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50`}
                  min={
                    formData.pickupDate ||
                    new Date().toISOString().split('T')[0]
                  }
                />
                {errors.returnDate && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.returnDate}
                  </p>
                )}
              </div>

              {/* Return Time */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 mr-2 text-emerald-700' />
                  Return Time *
                </label>
                <input
                  type='time'
                  name='returnTime'
                  value={formData.returnTime}
                  onChange={onInputChange}
                  className={`w-full p-3 border ${
                    errors.returnTime ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50`}
                />
                {errors.returnTime && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.returnTime}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimeSection;
