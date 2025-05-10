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
  /**
   * Helper function to check if a translation was successful
   * Returns false if the translation still looks like a key
   */
  const isValidTranslation = (
    translatedText: string,
    originalKey: string
  ): boolean => {
    // Check if the translation is different from the key or doesn't follow the pattern of a translation key
    return (
      translatedText !== originalKey && !translatedText.startsWith('services.')
    );
  };

  // Combine itinerary steps from both sources and filter out invalid translations
  const itinerary = [
    ...(serviceData?.itinerary || [])
      .map((key) => {
        const translated = t(key, { fallback: null });
        return {
          content: translated,
          isTranslationKey: true,
          originalKey: key,
        };
      })
      .filter(
        (item) =>
          item.content && isValidTranslation(item.content, item.originalKey)
      ),
    ...(extendedDetails?.itinerary || [])
      .map((item) => {
        // If it's a translation key, try to translate it
        if (typeof item === 'string' && item.startsWith('services.')) {
          const translated = t(item, { fallback: null });
          return {
            content: translated,
            isTranslationKey: true,
            originalKey: item,
          };
        }
        // Otherwise, use the item as is
        return {
          content: item,
          isTranslationKey: false,
          originalKey: item,
        };
      })
      .filter((item) => {
        // For translation keys, check if translation was successful
        if (item.isTranslationKey) {
          return (
            item.content && isValidTranslation(item.content, item.originalKey)
          );
        }
        // For non-translation keys, just check that content exists
        return item.content;
      }),
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
