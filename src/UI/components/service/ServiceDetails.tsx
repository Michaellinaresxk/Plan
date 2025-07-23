import React from 'react';
import { ServiceData } from '@/types/services';
import { Service } from '@/types/type';
import ServiceViewFactory from './factory/ServiceViewFactory';
interface ServiceDetailsProps {
  service: Service;
  serviceData?: ServiceData;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  serviceData,
}) => {
  // Determinar si es premium
  const isPremium = service.packageType.includes('premium');
  const primaryColor = isPremium ? 'amber' : 'blue';

  return (
    <div
      className={`bg-gray-50 min-h-screen pb-16  ${
        isPremium ? 'bg-gray-900' : ''
      }`}
    >
      {/* Main Content Area - Now with 90% width */}
      <div className='w-full mx-auto pt-12'>
        <ServiceViewFactory
          service={service}
          serviceData={serviceData}
          primaryColor={primaryColor}
        />
      </div>
    </div>
  );
};

export default ServiceDetails;
