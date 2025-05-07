import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { ServiceData } from '@/types/services';
import { Service } from '@/types/type';
import {
  Anchor,
  Ship,
  Users,
  Fish,
  Clock,
  Map,
  LifeBuoy,
  Utensils,
} from 'lucide-react';

interface CatamaranDetailsProps {
  service: Service;
  serviceData?: ServiceData;
}

/**
 * Componente especializado para mostrar detalles de servicios de catamaran
 */
const CatamaranDetails: React.FC<CatamaranDetailsProps> = ({
  service,
  serviceData,
}) => {
  const { t } = useTranslation();

  // Extraer datos específicos
  const isPrivate = service.id.includes('private');
  const capacity =
    serviceData?.metaData?.capacity ||
    (isPrivate ? '19 personas' : '40 personas');

  // Extraer lugares para visitar si están disponibles
  let destinations: string[] = [];
  if (serviceData?.metaData?.places) {
    const placesStr = serviceData.metaData.places.toString();
    destinations = Array.isArray(serviceData.metaData.places)
      ? serviceData.metaData.places
      : placesStr.split(',');
  }

  // Extraer opciones de bar abierto si están disponibles
  let drinkOptions: string[] = [];
  if (serviceData?.metaData?.openBarOptions) {
    const optionsStr = serviceData.metaData.openBarOptions.toString();
    drinkOptions = Array.isArray(serviceData.metaData.openBarOptions)
      ? serviceData.metaData.openBarOptions
      : optionsStr.split(',');
  }

  // Extraer horarios disponibles
  let timeSlots: string[] = [];
  if (serviceData?.metaData?.timeSlots) {
    const timeSlotsStr = serviceData.metaData.timeSlots.toString();
    timeSlots = Array.isArray(serviceData.metaData.timeSlots)
      ? serviceData.metaData.timeSlots
      : timeSlotsStr.split(',');
  }

  return (
    <div className='mt-6'>
      {/* Información principal del barco */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        {/* Tipo de experiencia */}
        <div className='bg-blue-50 p-4 rounded-lg'>
          <h3 className='font-medium text-gray-900 mb-2 flex items-center'>
            <Ship className='h-5 w-5 text-blue-600 mr-2' />
            {t('catamaranDetails.experience')}
          </h3>
          <p className='text-gray-700'>
            {isPrivate
              ? t('catamaranDetails.privateExperience')
              : t('catamaranDetails.groupExperience')}
          </p>
        </div>

        {/* Capacidad */}
        <div className='bg-blue-50 p-4 rounded-lg'>
          <h3 className='font-medium text-gray-900 mb-2 flex items-center'>
            <Users className='h-5 w-5 text-blue-600 mr-2' />
            {t('catamaranDetails.capacity')}
          </h3>
          <p className='text-gray-700'>{capacity}</p>
        </div>
      </div>

      {/* Destinos y horarios */}
      <div className='mb-8'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          {t('catamaranDetails.destinations')}
        </h3>

        {destinations.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-6'>
            {destinations.map((destination, index) => (
              <div key={index} className='flex items-start'>
                <Map className='h-5 w-5 text-blue-600 mr-2 mt-0.5' />
                <span className='text-gray-700'>{destination}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex items-start mb-6'>
            <Map className='h-5 w-5 text-blue-600 mr-2 mt-0.5' />
            <div className='text-gray-700'>
              <p>{t('catamaranDetails.snorkelArea')}</p>
              <p>{t('catamaranDetails.naturalPools')}</p>
              <p>{t('catamaranDetails.beautifulBeaches')}</p>
            </div>
          </div>
        )}

        {/* Horarios disponibles */}
        {timeSlots.length > 0 && (
          <div className='mt-4'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>
              {t('catamaranDetails.availableTimes')}
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className='flex items-center bg-gray-100 p-3 rounded-lg'
                >
                  <Clock className='h-5 w-5 text-blue-600 mr-2' />
                  <span className='text-gray-800'>{slot}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bar abierto y snacks */}
      {(isPrivate || drinkOptions.length > 0) && (
        <div className='mb-8'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            {t('catamaranDetails.refreshments')}
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Bar abierto */}
            <div>
              <h4 className='font-medium text-gray-800 mb-2 flex items-center'>
                <Utensils className='h-5 w-5 text-blue-600 mr-2' />
                {isPrivate
                  ? t('catamaranDetails.premiumOpenBar')
                  : t('catamaranDetails.openBar')}
              </h4>

              {drinkOptions.length > 0 ? (
                <ul className='space-y-1 text-gray-700'>
                  {drinkOptions.map((drink, index) => (
                    <li key={index} className='flex items-start'>
                      <span className='mr-2'>•</span>
                      <span>{drink}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className='space-y-1 text-gray-700'>
                  <li className='flex items-start'>
                    <span className='mr-2'>•</span>
                    <span>{t('catamaranDetails.beer')}</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2'>•</span>
                    <span>{t('catamaranDetails.rum')}</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2'>•</span>
                    <span>{t('catamaranDetails.softDrinks')}</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2'>•</span>
                    <span>{t('catamaranDetails.water')}</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Snacks */}
            <div>
              <h4 className='font-medium text-gray-800 mb-2 flex items-center'>
                <Utensils className='h-5 w-5 text-blue-600 mr-2' />
                {t('catamaranDetails.snacks')}
              </h4>
              <ul className='space-y-1 text-gray-700'>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>{t('catamaranDetails.tropicalFruits')}</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>{t('catamaranDetails.sandwiches')}</span>
                </li>
                {isPrivate && (
                  <li className='flex items-start'>
                    <span className='mr-2'>•</span>
                    <span>{t('catamaranDetails.premiumSnacks')}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Qué llevar */}
      <div className='border-t border-gray-200 pt-6 mt-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-3'>
          {t('catamaranDetails.whatToBring')}
        </h3>
        <ul className='space-y-2'>
          <li className='flex items-start'>
            <span className='text-gray-700 flex'>
              <span className='mr-2'>•</span>
              {t('catamaranDetails.swimwear')}
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-gray-700 flex'>
              <span className='mr-2'>•</span>
              {t('catamaranDetails.towel')}
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-gray-700 flex'>
              <span className='mr-2'>•</span>
              {t('catamaranDetails.sunscreen')}
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-gray-700 flex'>
              <span className='mr-2'>•</span>
              {t('catamaranDetails.camera')}
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-gray-700 flex'>
              <span className='mr-2'>•</span>
              {t('catamaranDetails.cash')}
            </span>
          </li>
        </ul>
      </div>

      {/* Actividades disponibles */}
      <div className='border-t border-gray-200 pt-6 mt-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-3'>
          {t('catamaranDetails.activities')}
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='flex items-center'>
            <LifeBuoy className='h-5 w-5 text-blue-600 mr-2' />
            <span className='text-gray-700'>
              {t('catamaranDetails.snorkeling')}
            </span>
          </div>
          <div className='flex items-center'>
            <Anchor className='h-5 w-5 text-blue-600 mr-2' />
            <span className='text-gray-700'>
              {t('catamaranDetails.swimming')}
            </span>
          </div>
          <div className='flex items-center'>
            <Ship className='h-5 w-5 text-blue-600 mr-2' />
            <span className='text-gray-700'>
              {t('catamaranDetails.sailing')}
            </span>
          </div>
          <div className='flex items-center'>
            <Fish className='h-5 w-5 text-blue-600 mr-2' />
            <span className='text-gray-700'>
              {t('catamaranDetails.marineLife')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatamaranDetails;
