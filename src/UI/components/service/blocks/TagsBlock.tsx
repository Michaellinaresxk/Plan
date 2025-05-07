import React from 'react';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ServiceExtendedDetails } from '@/constants/services/serviceDetails';
import { BlockConfig } from '../ServiceContentOrchestrator';
import { Tag } from 'lucide-react';

interface TagsBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
}

/**
 * Tags Block Component
 *
 * Renders tags associated with a service
 */
const TagsBlock: React.FC<TagsBlockProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  blockConfig,
  t,
}) => {
  // Get tags from service data
  const tags = serviceData?.tags || [];

  // If no tags to display, don't render the block
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <Tag className={`mr-2 text-${primaryColor}-500`} size={20} />
          {blockConfig.title || t('serviceDetails.tags')}
        </h3>

        <div className='flex flex-wrap gap-2'>
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1 bg-${primaryColor}-50 text-${primaryColor}-700 rounded-full text-sm font-medium`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsBlock;
