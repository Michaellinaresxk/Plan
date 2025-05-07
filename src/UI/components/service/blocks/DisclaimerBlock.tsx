import React from 'react';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ServiceExtendedDetails } from '@/constants/services/serviceDetails';
import { BlockConfig } from '../ServiceContentOrchestrator';
import { Shield, AlertCircle } from 'lucide-react';

interface DisclaimerBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
}

/**
 * Disclaimer Block Component
 *
 * Renders important notices and disclaimers for a service
 */
const DisclaimerBlock: React.FC<DisclaimerBlockProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  blockConfig,
  t,
}) => {
  // Get the disclaimer from serviceData or extendedDetails
  const disclaimer = serviceData?.disclaimer
    ? t(serviceData.disclaimer, { fallback: '' })
    : extendedDetails?.disclaimer || '';

  // Get the final message if available
  const finalMessage = extendedDetails?.finalMessage || '';

  // If no disclaimer or final message to display, don't render the block
  if (!disclaimer && !finalMessage) {
    return null;
  }

  return (
    <div>
      {/* Disclaimer section */}
      {disclaimer && (
        <div className='p-4 bg-amber-50 rounded-lg border border-amber-100'>
          <h4 className='font-medium text-amber-800 mb-2 flex items-center'>
            <AlertCircle className='w-5 h-5 mr-2' />
            {blockConfig.title || t('serviceDetails.importantNote')}
          </h4>
          <p className='text-amber-700'>{disclaimer}</p>
        </div>
      )}

      {/* Final message section */}
      {finalMessage && (
        <div
          className={`mt-4 p-4 bg-${primaryColor}-50 rounded-lg border border-${primaryColor}-100`}
        >
          <h4 className='font-medium text-gray-800 mb-2 flex items-center'>
            <Shield className={`w-5 h-5 mr-2 text-${primaryColor}-500`} />
            {t('serviceDetails.finalThoughts')}
          </h4>
          <p className={`text-${primaryColor}-700 italic`}>{finalMessage}</p>
        </div>
      )}
    </div>
  );
};

export default DisclaimerBlock;
