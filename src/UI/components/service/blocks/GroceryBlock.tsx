// src/UI/components/blocks/GroceryBlock.tsx
import React from 'react';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { BlockConfig } from '../ServiceContentOrchestrator';
import { ShoppingBag } from 'lucide-react';
import GroceryShoppingService from '../../grocery/GroceryShoppingService';

interface GroceryBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
  viewContext?: 'standard-view' | 'premium-view';
}

const GroceryBlock: React.FC<GroceryBlockProps> = ({
  service,
  serviceData,
  primaryColor,
  blockConfig,
  t,
}) => {
  return (
    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <ShoppingBag className={`mr-2 text-${primaryColor}-500`} size={20} />
          {blockConfig.title ||
            t('groceryService.title', { fallback: 'Grocery Shopping Service' })}
        </h3>

        {/* Description from service data if available */}
        {serviceData?.descriptionKey && (
          <p className='text-gray-700 mb-6'>
            {t(serviceData.descriptionKey, { fallback: service.description })}
          </p>
        )}

        {/* Render the complete GroceryShoppingService */}
        <div className='mt-8'>
          <GroceryShoppingService />
        </div>
      </div>
    </div>
  );
};

export default GroceryBlock;
