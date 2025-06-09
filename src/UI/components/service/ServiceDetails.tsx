// ServiceDetails.tsx (with 90% width)

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import { motion } from 'framer-motion';
import { ServiceData } from '@/types/services';
import { Service } from '@/types/type';
import { ArrowLeft } from 'lucide-react';
import ServiceViewFactory from './factory/ServiceViewFactory';
import { useRouter } from 'next/navigation';
interface ServiceDetailsProps {
  service: Service;
  serviceData?: ServiceData;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  serviceData,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  // Determinar si es premium
  const isPremium = service.packageType.includes('premium');
  const primaryColor = isPremium ? 'amber' : 'blue';

  return (
    <div
      className={`bg-gray-50 min-h-screen pb-16  ${
        isPremium ? 'bg-gray-900' : ''
      }`}
    >
      {/* Hero Section con imagen de fondo */}
      <div className='relative h-[40vh] lg:h-[50vh] overflow-hidden'>
        <Image
          src={service.img}
          alt={service.name}
          fill
          className='object-cover'
        />
        <div
          className={`absolute inset-0 ${
            isPremium
              ? 'bg-gradient-to-b from-black/70 to-black/80'
              : 'bg-gradient-to-b from-black/50 to-black/70'
          }`}
        />

        {/* Hero content - Keep container for hero only */}
        <div className='container mx-auto px-6 relative h-full flex flex-col justify-end pb-10'>
          <button
            onClick={() => router.back()}
            className='text-white mb-6 inline-flex items-center hover:underline'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            {t('services.actions.backToServices')}
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isPremium && (
              <span className='bg-amber-500 text-amber-950 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 uppercase'>
                Premium
              </span>
            )}
            <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>
              {service.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area - Now with 90% width */}
      <div className='w-[90%] mx-auto px-4 pt-12'>
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
