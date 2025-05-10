import React from 'react';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { BlockConfig } from '../ServiceContentOrchestrator';
import { Info } from 'lucide-react';

interface MetadataBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
}

/**
 * Metadata Block Component
 *
 * Renders additional metadata and details about a service
 */
const MetadataBlock: React.FC<MetadataBlockProps> = ({
  serviceData,
  extendedDetails,
  primaryColor,
  blockConfig,
  t,
}) => {
  // Get metadata from service data
  const metadata = serviceData?.metaData || {};

  // Get additional details from extended details
  const details = extendedDetails?.details || {};

  // Filter out specific metadata that is handled elsewhere
  const filteredMetadata = Object.entries(metadata).filter(
    ([key, value]) =>
      typeof value !== 'object' &&
      key !== 'maxPeople' &&
      key !== 'rating' &&
      key !== 'places' &&
      key !== 'timeSlots' &&
      key !== 'equipmentProvided' &&
      key !== 'experienceLevel' &&
      value !== null
  );

  // If no metadata to display, don't render the block
  if (filteredMetadata.length === 0 && Object.keys(details).length === 0) {
    return null;
  }

  return (
    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <Info className={`mr-2 text-${primaryColor}-500`} size={20} />
          {blockConfig.title || t('serviceDetails.details')}
        </h3>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Render service metadata */}
          {filteredMetadata.map(([key, value]) => (
            <div
              key={key}
              className={`p-3 bg-gray-50 rounded-lg border border-${primaryColor}-100`}
            >
              <div className='text-sm text-gray-500 capitalize'>
                {t(`services.metadata.${key}`, {
                  fallback: formatMetadataKey(key),
                })}
              </div>
              <div className='font-medium'>{formatMetadataValue(value, t)}</div>
            </div>
          ))}

          {/* Render extended details if available */}
          {Object.entries(details).map(([key, value]) => {
            // Handle different value types differently
            if (Array.isArray(value)) {
              return (
                <div
                  key={key}
                  className={`p-3 bg-gray-50 rounded-lg border border-${primaryColor}-100 col-span-2`}
                >
                  <div className='text-sm text-gray-500 capitalize mb-2'>
                    {t(`serviceDetails.details.${key}`, {
                      fallback: formatMetadataKey(key),
                    })}
                  </div>
                  <ul className='list-disc pl-5 space-y-1'>
                    {value.map((item, i) => (
                      <li key={i} className='text-gray-700'>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            } else if (typeof value === 'object' && value !== null) {
              return (
                <div
                  key={key}
                  className={`p-3 bg-gray-50 rounded-lg border border-${primaryColor}-100 col-span-2`}
                >
                  <div className='text-sm text-gray-500 capitalize mb-2'>
                    {t(`serviceDetails.details.${key}`, {
                      fallback: formatMetadataKey(key),
                    })}
                  </div>
                  <ul className='list-disc pl-5 space-y-1'>
                    {Object.entries(value).map(([subKey, subValue], i) => (
                      <li key={i} className='text-gray-700'>
                        <span className='font-medium'>
                          {formatMetadataKey(subKey)}:
                        </span>{' '}
                        {formatMetadataValue(subValue, t)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            } else {
              return (
                <div
                  key={key}
                  className={`p-3 bg-gray-50 rounded-lg border border-${primaryColor}-100`}
                >
                  <div className='text-sm text-gray-500 capitalize'>
                    {t(`serviceDetails.details.${key}`, {
                      fallback: formatMetadataKey(key),
                    })}
                  </div>
                  <div className='font-medium'>
                    {formatMetadataValue(value, t)}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Helper function to format metadata keys
 */
const formatMetadataKey = (key: string): string => {
  // Convert camelCase to spaces
  const spacedKey = key.replace(/([A-Z])/g, ' $1').trim();

  // Convert kebab-case or snake_case to spaces
  const formattedKey = spacedKey.replace(/[-_]/g, ' ');

  // Capitalize first letter
  return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
};

/**
 * Helper function to format metadata values
 */
const formatMetadataValue = (value: any, t: any): string => {
  if (typeof value === 'boolean') {
    return value ? t('common.answers.yes') : t('common.not');
  } else if (typeof value === 'string' && value.includes(',')) {
    // Assume it's a comma-separated list and try to translate each item
    return value
      .split(',')
      .map((v) =>
        t(`services.metadata.values.${v.trim()}`, {
          fallback: v.trim(),
        })
      )
      .join(', ');
  } else {
    return String(value);
  }
};

export default MetadataBlock;
