import React from 'react';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ServiceExtendedDetails } from '@/constants/services/serviceDetails';
import { BlockConfig } from '../ServiceContentOrchestrator';

interface OptionsBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
}

/**
 * Options Block Component
 *
 * Renders the various options and upgrades available for a service
 */
const OptionsBlock: React.FC<OptionsBlockProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  blockConfig,
  t,
}) => {
  // If no options to display, don't render the block
  if (!serviceData?.options || Object.keys(serviceData.options).length === 0) {
    return null;
  }

  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>
          {blockConfig.title || t('serviceDetails.options')}
        </h3>

        <div className='space-y-6'>
          {Object.entries(serviceData.options).map(([optionKey, option]) => (
            <div key={optionKey} className='option-category'>
              <h4 className='text-lg font-medium text-gray-800 mb-3'>
                {t(option.nameKey, { fallback: formatOptionName(optionKey) })}
              </h4>

              {option.subOptions && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {Object.entries(option.subOptions).map(
                    ([subOptionKey, subOption]) => (
                      <div
                        key={subOptionKey}
                        className={`p-4 rounded-lg border ${
                          isObject(subOption) &&
                          'price' in subOption &&
                          Number(subOption.price) > 0
                            ? `border-${primaryColor}-200 bg-${primaryColor}-50/30`
                            : 'border-gray-200 bg-gray-50/50'
                        }`}
                      >
                        <div className='flex justify-between items-start'>
                          <span className='font-medium text-gray-800'>
                            {isObject(subOption) && 'nameKey' in subOption
                              ? t(subOption.nameKey, {
                                  fallback: formatOptionName(subOptionKey),
                                })
                              : formatOptionName(subOptionKey)}
                          </span>

                          {isObject(subOption) &&
                            'price' in subOption &&
                            subOption.price !== 0 && (
                              <span
                                className={`font-medium ${
                                  Number(subOption.price) > 0
                                    ? `text-${primaryColor}-600`
                                    : 'text-green-600'
                                }`}
                              >
                                {Number(subOption.price) > 0 ? '+' : ''}$
                                {subOption.price}
                              </span>
                            )}
                        </div>

                        {isObject(subOption) &&
                          'descriptionKey' in subOption && (
                            <p className='text-sm text-gray-500 mt-2'>
                              {t(subOption.descriptionKey, { fallback: '' })}
                            </p>
                          )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Helper function to format option names from camelCase or kebab-case
 */
const formatOptionName = (name: string): string => {
  // Convert camelCase to spaces
  const spacedName = name.replace(/([A-Z])/g, ' $1').trim();

  // Convert kebab-case to spaces
  const formattedName = spacedName.replace(/-/g, ' ');

  // Capitalize first letter
  return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
};

/**
 * Type guard to check if a value is an object
 */
const isObject = (value: any): value is Record<string, any> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export default OptionsBlock;
