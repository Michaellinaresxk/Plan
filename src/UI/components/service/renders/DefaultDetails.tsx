import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { ServiceData } from '@/types/services';
import { Service } from '@/types/type';
import { Tag, Info } from 'lucide-react';

interface DefaultDetailsProps {
  service: Service;
  serviceData?: ServiceData;
}

/**
 * Componente por defecto para mostrar detalles de servicio genéricos
 * Este se usa cuando no hay un componente especializado para el tipo de servicio
 */
const DefaultDetails: React.FC<DefaultDetailsProps> = ({
  service,
  serviceData,
}) => {
  const { t } = useTranslation();

  return (
    <div className='mt-6'>
      {/* Tags del servicio si existen */}
      {serviceData?.tags && serviceData.tags.length > 0 && (
        <div className='mb-6'>
          <h3 className='text-gray-700 font-medium mb-2 flex items-center'>
            <Tag className='h-4 w-4 mr-2 text-blue-500' />
            {t('serviceDetails.tags')}
          </h3>
          <div className='flex flex-wrap gap-2'>
            {serviceData.tags.map((tag, index) => (
              <span
                key={index}
                className='px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional si existe */}
      {serviceData?.additionalInfoKeys &&
        serviceData.additionalInfoKeys.length > 0 && (
          <div className='border-t border-gray-200 pt-6 mt-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
              <Info className='h-5 w-5 mr-2 text-blue-500' />
              {t('serviceDetails.additionalInfo')}
            </h3>

            <div className='space-y-4'>
              {serviceData.additionalInfoKeys.map((infoKey, index) => (
                <p key={index} className='text-gray-700'>
                  {t(infoKey, {
                    fallback: `Additional information ${index + 1}`,
                  })}
                </p>
              ))}
            </div>
          </div>
        )}

      {/* Metadatos generales si existen */}
      {serviceData?.metaData &&
        Object.keys(serviceData.metaData).length > 0 && (
          <div className='border-t border-gray-200 pt-6 mt-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              {t('serviceDetails.details')}
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {Object.entries(serviceData.metaData)
                .filter(
                  ([key, value]) =>
                    typeof value !== 'object' &&
                    key !== 'maxPeople' &&
                    key !== 'rating' &&
                    value !== null
                )
                .map(([key, value]) => (
                  <div key={key} className='flex flex-col'>
                    <span className='text-sm text-gray-500 capitalize'>
                      {key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())
                        .replace(/[_-]/g, ' ')}
                    </span>
                    <span className='text-gray-700'>
                      {typeof value === 'boolean'
                        ? value
                          ? t('common.answers.yes')
                          : t('common.answers.not')
                        : value.toString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default DefaultDetails;
