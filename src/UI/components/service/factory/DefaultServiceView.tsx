import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';

interface DefaultServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const DefaultServiceView: React.FC<DefaultServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-8'>
      {/* Sección de descripción */}
      <div className='bg-white rounded-xl shadow-sm overflow-hidden p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          {serviceData?.titleKey ? t(serviceData.titleKey) : service.name}
        </h2>
        <p className='text-lg text-gray-700 mb-6'>
          {serviceData?.descriptionKey
            ? t(serviceData.descriptionKey)
            : service.description}
        </p>
        {serviceData?.fullDescriptionKey && (
          <p className='text-gray-700 mt-3'>
            {t(serviceData.fullDescriptionKey)}
          </p>
        )}
      </div>

      {/* Incluidos en el servicio */}
      {serviceData?.includes && serviceData.includes.length > 0 && (
        <div className='bg-white rounded-xl shadow-sm overflow-hidden p-6'>
          <h3 className='text-xl font-semibold text-gray-800 mb-3'>
            {t('serviceDetails.included')}
          </h3>
          <ul className='space-y-2'>
            {serviceData.includes.map((includeKey, index) => (
              <li key={index} className='flex items-start'>
                <div
                  className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                >
                  <svg
                    className={`h-3 w-3 text-${primaryColor}-600`}
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <span className='text-gray-700'>{t(includeKey)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Más secciones genéricas según sea necesario */}
    </div>
  );
};

export default DefaultServiceView;
