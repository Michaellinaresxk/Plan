import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { ServiceData } from '@/types/services';
import { Service } from '@/types/type';
import { User, MapPin, Leaf, CheckCircle } from 'lucide-react';

interface YogaDetailsProps {
  service: Service;
  serviceData?: ServiceData;
}

/**
 * Componente especializado para mostrar detalles de servicios de yoga
 */
const YogaDetails: React.FC<YogaDetailsProps> = ({ service, serviceData }) => {
  const { t } = useTranslation();

  // Extraer estilos de yoga de los metadatos o usar valores predeterminados
  const yogaStyles = serviceData?.metaData?.yogaStyles || [];

  // Extraer equipamiento incluido
  const equipmentIncluded = serviceData?.metaData?.equipmentProvided !== false;

  // Extraer niveles de experiencia
  let experienceLevels: string[] = [];
  if (serviceData?.metaData?.experienceLevel) {
    const expLevels = serviceData.metaData.experienceLevel.toString();
    experienceLevels = expLevels.split(',');
  }

  // Extraer ubicaciones disponibles
  let locations: Record<string, any> = {};
  if (serviceData?.options?.location?.subOptions) {
    locations = serviceData.options.location.subOptions;
  }

  return (
    <div className='mt-6'>
      {/* Estilos de yoga */}
      {Array.isArray(yogaStyles) && yogaStyles.length > 0 && (
        <div className='mb-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-3'>
            {t('yogaDetails.availableStyles')}
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {yogaStyles.map((style, index) => (
              <div
                key={index}
                className='flex items-center bg-blue-50 p-3 rounded-lg'
              >
                <Leaf className='h-5 w-5 text-blue-600 mr-2' />
                <span className='text-gray-800 capitalize'>
                  {typeof style === 'string' ? style : `Style ${index + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información sobre ubicaciones */}
      {Object.keys(locations).length > 0 && (
        <div className='mb-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-3'>
            {t('yogaDetails.locations')}
          </h3>
          <div className='space-y-3'>
            {Object.entries(locations).map(([key, location]) => (
              <div key={key} className='flex items-start'>
                <MapPin className='h-5 w-5 text-blue-600 mr-2 mt-0.5' />
                <div>
                  <p className='text-gray-800 font-medium capitalize'>
                    {typeof location === 'object' && 'nameKey' in location
                      ? t(location.nameKey, { fallback: key })
                      : key}
                  </p>
                  {typeof location === 'object' &&
                    'price' in location &&
                    location.price !== 0 && (
                      <p className='text-sm text-gray-600'>
                        {location.price > 0
                          ? `+$${location.price}`
                          : `-$${Math.abs(location.price)}`}
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información sobre niveles de experiencia */}
      {experienceLevels.length > 0 && (
        <div className='mb-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-3'>
            {t('yogaDetails.experienceLevels')}
          </h3>
          <div className='flex flex-wrap gap-2'>
            {experienceLevels.map((level, index) => (
              <span
                key={index}
                className='px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center'
              >
                <CheckCircle className='h-3.5 w-3.5 mr-1' />
                <span className='capitalize'>{level.trim()}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Información sobre equipamiento */}
      <div className='border-t border-gray-200 pt-6 mt-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-3'>
          {t('yogaDetails.whatToBring')}
        </h3>
        <ul className='space-y-2'>
          {!equipmentIncluded && (
            <li className='flex items-start'>
              <span className='text-gray-700 flex'>
                <span className='mr-2'>•</span>
                {t('yogaDetails.yogaMat')}
              </span>
            </li>
          )}
          <li className='flex items-start'>
            <span className='text-gray-700 flex'>
              <span className='mr-2'>•</span>
              {t('yogaDetails.comfortableClothing')}
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-gray-700 flex'>
              <span className='mr-2'>•</span>
              {t('yogaDetails.water')}
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-gray-700 flex'>
              <span className='mr-2'>•</span>
              {t('yogaDetails.towel')}
            </span>
          </li>
        </ul>
      </div>

      {/* Beneficios de yoga */}
      <div className='border-t border-gray-200 pt-6 mt-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-3'>
          {t('yogaDetails.benefits')}
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {[
            'yogaDetails.benefitFlexibility',
            'yogaDetails.benefitStrength',
            'yogaDetails.benefitMindfulness',
            'yogaDetails.benefitStress',
          ].map((benefit, index) => (
            <div key={index} className='flex items-start'>
              <CheckCircle className='h-5 w-5 text-green-500 mr-2 mt-0.5' />
              <span className='text-gray-700'>{t(benefit)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YogaDetails;
