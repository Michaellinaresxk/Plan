import { DEFAULT_LOCATION_OPTIONS } from '@/constants/location/location';
import { LocationSelectorProps } from '@/types/location';
import { CheckCircle, MapPin } from 'lucide-react';

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocationId,
  onLocationSelect,
  locationOptions = DEFAULT_LOCATION_OPTIONS,
  error,
  isPremium = false,
}) => {
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
        {locationOptions.map((location) => (
          <div
            key={location.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all relative
              ${
                selectedLocationId === location.id
                  ? `${
                      isPremium
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-amber-50 border-amber-300'
                    } shadow-sm`
                  : 'border-gray-200 hover:bg-gray-50'
              }
            `}
            onClick={() => onLocationSelect(location.id)}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div
                  className={`
                    w-5 h-5 rounded-full border flex items-center justify-center mr-3
                    ${
                      selectedLocationId === location.id
                        ? `${
                            isPremium
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-amber-500 bg-amber-500'
                          }`
                        : 'border-gray-300'
                    }
                  `}
                >
                  {selectedLocationId === location.id && (
                    <CheckCircle className='w-4 h-4 text-white' />
                  )}
                </div>
                <div>
                  <span className='font-medium text-gray-800 text-sm'>
                    {location.name}
                  </span>
                  <p className='text-xs text-gray-500 mt-1'>
                    {location.description}
                  </p>
                </div>
              </div>
              {location.surcharge > 0 && (
                <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
                  +${location.surcharge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </div>
  );
};
