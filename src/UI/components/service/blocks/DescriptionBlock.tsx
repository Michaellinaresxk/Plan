import React from 'react';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ServiceExtendedDetails } from '@/constants/services/serviceDetails';
import { BlockConfig } from '../ServiceContentOrchestrator';
import { Info, Tag } from 'lucide-react';

interface DescriptionBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
}

/**
 * Description Block Component
 *
 * Renders the main description of a service with title and description
 */
const DescriptionBlock: React.FC<DescriptionBlockProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  blockConfig,
  t,
}) => {
  // Get the service title and description
  const title = serviceData?.titleKey
    ? t(serviceData.titleKey, { fallback: service.name })
    : service.name;

  const description = serviceData?.descriptionKey
    ? t(serviceData.descriptionKey, { fallback: service.description })
    : service.description;

  const fullDescription = serviceData?.fullDescriptionKey
    ? t(serviceData.fullDescriptionKey, { fallback: '' })
    : extendedDetails?.fullDescription || extendedDetails?.description || '';

  const slogan = extendedDetails?.slogan || '';
  const tagline = extendedDetails?.tagline || '';

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm'>
      {/* Custom title if provided */}
      {blockConfig.title ? (
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>
          {blockConfig.title}
        </h2>
      ) : (
        <h2 className='text-2xl font-bold text-gray-800 mb-4 flex items-center'>
          <Info className={`mr-2 text-${primaryColor}-500`} size={20} />
          {t('serviceDetails.aboutService')}
        </h2>
      )}

      {/* Optional tagline/slogan */}
      {(tagline || slogan) && (
        <div className='mb-4'>
          {tagline && (
            <p className='text-lg font-medium text-gray-700'>{tagline}</p>
          )}
          {slogan && (
            <p className='text-sm text-gray-500 uppercase tracking-wide'>
              {slogan}
            </p>
          )}
        </div>
      )}

      <div className='prose max-w-none text-gray-700 mb-6'>
        <p>{description}</p>
        {fullDescription && fullDescription !== description && (
          <p className='mt-4'>{fullDescription}</p>
        )}
      </div>

      {/* Service tags if available */}
      {serviceData?.tags && serviceData.tags.length > 0 && (
        <div className='mt-6 flex flex-wrap gap-3'>
          {serviceData.tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${primaryColor}-100 text-${primaryColor}-800`}
            >
              <Tag className='w-4 h-4 mr-1' />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DescriptionBlock;
