import React from 'react';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ServiceExtendedDetails } from '@/constants/services/serviceDetails';
import { BlockConfig } from '../ServiceContentOrchestrator';
import { Check, DollarSign } from 'lucide-react';

interface IncludesBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
}

/**
 * Includes Block Component
 *
 * Renders what's included and not included in a service
 */
const IncludesBlock: React.FC<IncludesBlockProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  blockConfig,
  t,
}) => {
  // Combine includes from both sources
  const includes = [
    ...(serviceData?.includes || []).map((key) => ({
      content: t(key, { fallback: key }),
      isTranslationKey: true,
    })),
    ...(extendedDetails?.includes || []).map((item) => ({
      content:
        typeof item === 'string' && item.startsWith('services.')
          ? t(item, { fallback: item.split('.').pop() || item })
          : item,
      isTranslationKey: false,
    })),
  ];

  // Combine not included items from both sources
  const notIncluded = [
    ...(serviceData?.notIncluded || []).map((key) => ({
      content: t(key, { fallback: key }),
      isTranslationKey: true,
    })),
    ...(extendedDetails?.notIncluded || []).map((item) => ({
      content:
        typeof item === 'string' && item.startsWith('services.')
          ? t(item, { fallback: item.split('.').pop() || item })
          : item,
      isTranslationKey: false,
    })),
  ];

  // If no items to display, don't render the block
  if (includes.length === 0 && notIncluded.length === 0) {
    return null;
  }

  return (
    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>
          {blockConfig.title || t('serviceDetails.whatsIncluded')}
        </h3>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* What's Included Section */}
          {includes.length > 0 && (
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <Check className={`mr-2 text-${primaryColor}-500`} size={18} />
                {t('serviceDetails.includedInService')}
              </h4>

              <ul className='space-y-3'>
                {includes.map((item, index) => (
                  <li key={index} className='flex items-start'>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 text-${primaryColor}-600`} />
                    </div>
                    <span className='text-gray-700'>{item.content}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Not Included Section */}
          {notIncluded.length > 0 && (
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <DollarSign
                  className={`mr-2 text-${primaryColor}-500`}
                  size={18}
                />
                {t('serviceDetails.notIncluded')}
              </h4>

              <ul className='space-y-3'>
                {notIncluded.map((item, index) => (
                  <li key={index} className='flex items-start text-gray-700'>
                    <div className='mt-1 h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0'>
                      <span className='text-sm font-medium'>•</span>
                    </div>
                    <span>{item.content}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncludesBlock;
