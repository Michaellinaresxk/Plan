import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import { motion } from 'framer-motion';
import { Service } from '@/types/type';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { getServiceCategory } from '@/utils/servicesUtils';

interface RelatedServicesProps {
  services: Service[];
  currentServiceId: string;
}

/**
 * Componente para mostrar servicios relacionados en la página de detalles
 */
const RelatedServices: React.FC<RelatedServicesProps> = ({
  services,
  currentServiceId,
}) => {
  const { t } = useTranslation();

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        {t('relatedServices.title', { fallback: 'You might also like' })}
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {services.map((service) => {
          // Obtener categoría del servicio para la etiqueta
          const category = getServiceCategory(service.id);

          // Determinar si es un servicio premium
          const isPremium = service.packageType.includes('premium');

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow'
            >
              <Link href={`/service/${service.id}`}>
                <div className='relative h-48 overflow-hidden'>
                  <Image
                    src={service.img}
                    alt={service.name}
                    fill
                    className='object-cover transition-transform hover:scale-105 duration-300'
                  />

                  {/* Etiqueta de Premium */}
                  {isPremium && (
                    <div className='absolute top-2 right-2 bg-amber-500 text-amber-950 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                      Premium
                    </div>
                  )}
                </div>

                <div className='p-4'>
                  <h3 className='font-bold text-gray-800 text-lg mb-2'>
                    {service.name}
                  </h3>

                  <p className='text-gray-600 text-sm line-clamp-2 mb-4'>
                    {service.description}
                  </p>

                  <div className='flex justify-between items-center'>
                    <div className='flex space-x-4'>
                      {/* Duración */}
                      <div className='flex items-center text-xs text-gray-500'>
                        <Clock className='h-3.5 w-3.5 mr-1' />
                        <span>
                          {service.duration}{' '}
                          {service.duration === 1
                            ? t('common.hour')
                            : service.duration === 24
                            ? t('common.day')
                            : t('common.hours')}
                        </span>
                      </div>

                      {/* Categoría */}
                      <div className='flex items-center text-xs text-gray-500'>
                        <Tag className='h-3.5 w-3.5 mr-1' />
                        <span className='capitalize'>
                          {t(`categories.${category}`, {
                            fallback: category.replace(/-/g, ' '),
                          })}
                        </span>
                      </div>
                    </div>

                    <div className='text-blue-600 text-lg font-bold'>
                      ${service.price}
                    </div>
                  </div>

                  <div className='mt-4 text-blue-600 font-medium text-sm flex items-center hover:text-blue-800'>
                    {t('relatedServices.viewDetails')}
                    <ArrowRight className='h-4 w-4 ml-1' />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedServices;
