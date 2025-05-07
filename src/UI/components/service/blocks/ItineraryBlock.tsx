import React from 'react';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ServiceExtendedDetails } from '@/constants/services/serviceDetails';
import { BlockConfig } from '../ServiceContentOrchestrator';

interface ItineraryBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
}

/**
 * Itinerary Block Component
 *
 * Renders the service itinerary or step-by-step process
 */
const ItineraryBlock: React.FC<ItineraryBlockProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  blockConfig,
  t,
}) => {
  // Combine itinerary steps from both sources
  const itinerary = [
    ...(serviceData?.itinerary || []).map((key) => ({
      content: t(key, { fallback: key }),
      isTranslationKey: true,
    })),
    ...(extendedDetails?.itinerary || []).map((item) => ({
      content:
        typeof item === 'string' && item.startsWith('services.')
          ? t(item, { fallback: item.split('.').pop() || item })
          : item,
      isTranslationKey: false,
    })),
  ];

  // If no itinerary to display, don't render the block
  if (itinerary.length === 0) {
    return null;
  }

  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>
          {blockConfig.title || t('serviceDetails.whatToExpect')}
        </h3>

        <ol className='space-y-4'>
          {itinerary.map((step, index) => (
            <li key={index} className='flex items-start'>
              <div
                className={`mt-0.5 h-6 w-6 rounded-full bg-${primaryColor}-500 text-white flex items-center justify-center mr-3 flex-shrink-0 font-medium text-sm`}
              >
                {index + 1}
              </div>
              <span className='text-gray-700'>{step.content}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default ItineraryBlock;
