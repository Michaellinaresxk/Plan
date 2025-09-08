import React from 'react';
import { Users, Info, MapPin, Navigation } from 'lucide-react';

interface AdditionalInfoSectionProps {
  formData: {
    pickupName: string;
    pickupAddress: string;
    destinationAddress: string;
    specialRequests: string;
  };
  errors: { [key: string]: string };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2'>
        Address & Additional Information
      </h3>

      {/* Pickup Address */}
      <div>
        <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
          <MapPin className='w-4 h-4 mr-2 text-emerald-700' />
          Pickup Address *
        </label>
        <textarea
          name='pickupAddress'
          value={formData.pickupAddress}
          onChange={onInputChange}
          rows={3}
          className={`w-full p-3 border ${
            errors.pickupAddress ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 resize-none`}
          placeholder='Complete pickup address (hotel name, street address, landmarks...)'
        />
        {errors.pickupAddress && (
          <p className='text-red-500 text-xs mt-1'>{errors.pickupAddress}</p>
        )}
      </div>

      {/* Destination Address */}
      <div>
        <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
          <Navigation className='w-4 h-4 mr-2 text-emerald-700' />
          Destination Address *
        </label>
        <textarea
          name='destinationAddress'
          value={formData.destinationAddress}
          onChange={onInputChange}
          rows={3}
          className={`w-full p-3 border ${
            errors.destinationAddress ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 resize-none`}
          placeholder='Complete destination address (hotel, restaurant, attraction...)'
        />
        {errors.destinationAddress && (
          <p className='text-red-500 text-xs mt-1'>
            {errors.destinationAddress}
          </p>
        )}
      </div>

      {/* Pickup Name */}
      <div>
        <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
          <Users className='w-4 h-4 mr-2 text-emerald-700' />
          Pickup Contact Name (optional)
        </label>
        <input
          type='text'
          name='pickupName'
          value={formData.pickupName}
          onChange={onInputChange}
          placeholder='Name for driver identification'
          className='w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50'
        />
      </div>

      {/* Special Requests */}
      <div>
        <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
          <Info className='w-4 h-4 mr-2 text-emerald-700' />
          Special Requests (optional)
        </label>
        <textarea
          name='specialRequests'
          value={formData.specialRequests}
          onChange={onInputChange}
          rows={3}
          className='w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 resize-none'
          placeholder='Any special requirements, accessibility needs, or additional stops...'
        />
      </div>
    </div>
  );
};

export default AdditionalInfoSection;
