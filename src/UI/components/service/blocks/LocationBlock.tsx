import React from 'react';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ServiceExtendedDetails } from '@/constants/services/serviceDetails';
import { BlockConfig } from '../ServiceContentOrchestrator';
import { MapPin, Navigation } from 'lucide-react';

interface LocationsBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
}

/**
 * Locations Block Component
 *
 * Renders locations and places associated with a service
 */
const LocationsBlock: React.FC<LocationsBlockProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  blockConfig,
  t,
}) => {
  // Get location from extended details
  const location = extendedDetails?.location || '';

  // Get places from extended details
  let places: string[] = [];
  if (extendedDetails?.places) {
    places = Array.isArray(extendedDetails.places)
      ? extendedDetails.places
      : extendedDetails.places.toString().split(',');
  }

  // Get location options if available
  const locationOptions = serviceData?.options?.location?.subOptions || {};

  // If no location information to display, don't render the block
  if (
    !location &&
    places.length === 0 &&
    Object.keys(locationOptions).length === 0
  ) {
    return null;
  }

  return (
    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>
          {blockConfig.title || t('serviceDetails.locations')}
        </h3>

        <div className='space-y-6'>
          {/* Main location if available */}
          {location && (
            <div className='mb-6'>
              <h4 className='text-lg font-medium text-gray-800 mb-3 flex items-center'>
                <MapPin className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                {t('serviceDetails.mainLocation')}
              </h4>
              <p className='text-gray-700'>{location}</p>
            </div>
          )}

          {/* Places/destinations if available */}
          {places.length > 0 && (
            <div className='mb-6'>
              <h4 className='text-lg font-medium text-gray-800 mb-3 flex items-center'>
                <Navigation
                  className={`h-5 w-5 text-${primaryColor}-500 mr-2`}
                />
                {t('serviceDetails.destinations')}
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {places.map((place, index) => (
                  <div key={index} className='flex items-start'>
                    <MapPin
                      className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                    />
                    <span className='text-gray-700'>{place}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location options if available */}
          {Object.keys(locationOptions).length > 0 && (
            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-3 flex items-center'>
                <MapPin className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                {t('serviceDetails.locationOptions')}
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {Object.entries(locationOptions).map(([key, option]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg bg-${primaryColor}-50 border border-${primaryColor}-100`}
                  >
                    <div className='flex justify-between items-start'>
                      <span className='font-medium text-gray-800'>
                        {typeof option === 'object' && 'nameKey' in option
                          ? t(option.nameKey, {
                              fallback: formatLocationName(key),
                            })
                          : formatLocationName(key)}
                      </span>

                      {typeof option === 'object' &&
                        'price' in option &&
                        option.price !== 0 && (
                          <span
                            className={`font-medium ${
                              Number(option.price) > 0
                                ? `text-${primaryColor}-600`
                                : 'text-green-600'
                            }`}
                          >
                            {Number(option.price) > 0 ? '+' : ''}${option.price}
                          </span>
                        )}
                    </div>

                    {typeof option === 'object' &&
                      'descriptionKey' in option && (
                        <p className='text-sm text-gray-600 mt-2'>
                          {t(option.descriptionKey, { fallback: '' })}
                        </p>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Helper function to format location names
 */
const formatLocationName = (name: string): string => {
  // Convert camelCase to spaces
  const spacedName = name.replace(/([A-Z])/g, ' $1').trim();

  // Convert kebab-case to spaces
  const formattedName = spacedName.replace(/-/g, ' ');

  // Capitalize first letter
  return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
};

export default LocationsBlock;
