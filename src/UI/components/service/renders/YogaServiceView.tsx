import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { User, MapPin, Leaf, CheckCircle, Shield } from 'lucide-react';

interface YogaServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const YogaServiceView: React.FC<YogaServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();

  // Extraer datos específicos de yoga
  const yogaStyles = serviceData?.metaData?.yogaStyles || [];
  const equipmentIncluded = serviceData?.metaData?.equipmentProvided !== false;
  const experienceLevels = extractExperienceLevels(serviceData);

  // Extraer ubicaciones disponibles
  let locations: Record<string, any> = {};
  if (serviceData?.options?.location?.subOptions) {
    locations = serviceData.options.location.subOptions;
  }

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

      {/* Sección de estilos de yoga */}
      {yogaStyles.length > 0 && (
        <div className='bg-white rounded-xl shadow-sm overflow-hidden p-6'>
          <h3 className='text-xl font-semibold text-gray-800 mb-3 flex items-center'>
            <Leaf className={`mr-2 text-${primaryColor}-500`} size={20} />
            {t('yogaDetails.availableStyles')}
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {yogaStyles.map((style: string, index: number) => (
              <div
                key={index}
                className={`flex items-center bg-${primaryColor}-50 p-3 rounded-lg`}
              >
                <Leaf className={`h-5 w-5 text-${primaryColor}-600 mr-2`} />
                <span className='text-gray-800 capitalize'>{style}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de niveles de experiencia */}
      {experienceLevels.length > 0 && (
        <div className='bg-white rounded-xl shadow-sm overflow-hidden p-6'>
          <h3 className='text-xl font-semibold text-gray-800 mb-3 flex items-center'>
            <User className={`mr-2 text-${primaryColor}-500`} size={20} />
            {t('yogaDetails.experienceLevels')}
          </h3>
          <div className='flex flex-wrap gap-2'>
            {experienceLevels.map((level: string, index: number) => (
              <span
                key={index}
                className={`px-3 py-1 bg-${primaryColor}-50 text-${primaryColor}-700 rounded-full text-sm flex items-center`}
              >
                <CheckCircle className='h-3.5 w-3.5 mr-1' />
                <span className='capitalize'>{level.trim()}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Información sobre ubicaciones */}
      {Object.keys(locations).length > 0 && (
        <div className='bg-white rounded-xl shadow-sm overflow-hidden p-6'>
          <h3 className='text-xl font-semibold text-gray-800 mb-3 flex items-center'>
            <MapPin className={`mr-2 text-${primaryColor}-500`} size={20} />
            {t('yogaDetails.locations')}
          </h3>
          <div className='space-y-3'>
            {Object.entries(locations).map(([key, location]) => (
              <div key={key} className='flex items-start'>
                <MapPin
                  className={`h-5 w-5 text-${primaryColor}-600 mr-2 mt-0.5`}
                />
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

      {/* Sección de equipamiento */}
      <div className='bg-white rounded-xl shadow-sm overflow-hidden p-6'>
        <h3 className='text-xl font-semibold text-gray-800 mb-3 flex items-center'>
          <Shield className={`mr-2 text-${primaryColor}-500`} size={20} />
          {t('yogaDetails.equipment')}
        </h3>
        <p className='text-gray-700'>
          {equipmentIncluded
            ? t('yogaDetails.equipmentIncluded')
            : t('yogaDetails.bringOwnEquipment')}
        </p>
      </div>

      {/* Beneficios de yoga */}
      <div className='bg-white rounded-xl shadow-sm overflow-hidden p-6'>
        <h3 className='text-xl font-semibold text-gray-800 mb-3 flex items-center'>
          <CheckCircle className={`mr-2 text-${primaryColor}-500`} size={20} />
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
              <CheckCircle className={`h-5 w-5 text-green-500 mr-2 mt-0.5`} />
              <span className='text-gray-700'>{t(benefit)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function para extraer niveles de experiencia
const extractExperienceLevels = (serviceData?: ServiceData): string[] => {
  if (!serviceData?.metaData?.experienceLevel) return [];
  return serviceData.metaData.experienceLevel.toString().split(',');
};

export default YogaServiceView;
