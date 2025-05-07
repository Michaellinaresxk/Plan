import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { ServiceData } from '@/types/services';
import { Service } from '@/types/type';
import {
  Car,
  Clock,
  Map,
  Users,
  Check,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface AirportDetailsProps {
  service: Service;
  serviceData?: ServiceData;
}

/**
 * Componente especializado para mostrar detalles de servicios de transporte desde aeropuerto
 */
const AirportDetails: React.FC<AirportDetailsProps> = ({
  service,
  serviceData,
}) => {
  const { t } = useTranslation();

  // Determinar si es servicio premium
  const isPremium =
    service.id.includes('luxe') || service.packageType.includes('premium');

  // Extraer opciones de vehículo si existen
  let vehicleOptions: Record<string, any> = {};
  if (serviceData?.options?.vehicleType?.subOptions) {
    vehicleOptions = serviceData.options.vehicleType.subOptions;
  }

  // Extraer opciones de viaje (ida o ida y vuelta) si existen
  let tripOptions: Record<string, any> = {};
  if (serviceData?.options?.isRoundTrip?.subOptions) {
    tripOptions = serviceData.options.isRoundTrip.subOptions;
  }

  // Obtener tiempo de viaje estimado
  const travelTime = serviceData?.metaData?.travelTime || '20-40 min';

  // Verificar si tiene tracking de vuelo
  const hasFlightTracking = serviceData?.metaData?.flightTracking || false;

  // Verificar si ofrece asientos para niños
  const hasChildSeats = serviceData?.metaData?.childSeats || false;

  return (
    <div className='mt-6'>
      {/* Destacados del servicio */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-blue-50 p-4 rounded-lg'>
          <h3 className='font-medium text-gray-900 mb-2 flex items-center'>
            <Car className='h-5 w-5 text-blue-600 mr-2' />
            {t('airportDetails.serviceType')}
          </h3>
          <p className='text-gray-700'>
            {isPremium
              ? t('airportDetails.premiumService')
              : t('airportDetails.privateService')}
          </p>
        </div>

        <div className='bg-blue-50 p-4 rounded-lg'>
          <h3 className='font-medium text-gray-900 mb-2 flex items-center'>
            <Clock className='h-5 w-5 text-blue-600 mr-2' />
            {t('airportDetails.estimatedTime')}
          </h3>
          <p className='text-gray-700'>{travelTime}</p>
        </div>
      </div>

      {/* Opciones de vehículo */}
      {Object.keys(vehicleOptions).length > 0 && (
        <div className='mb-8'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            {t('airportDetails.vehicleOptions')}
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {Object.entries(vehicleOptions).map(([key, vehicle]) => (
              <div
                key={key}
                className='border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='h-40 bg-gray-100 relative'>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Car className='h-16 w-16 text-gray-400' />
                  </div>
                </div>

                <div className='p-4'>
                  <h4 className='font-medium text-gray-800 mb-1'>
                    {typeof vehicle === 'object' && 'nameKey' in vehicle
                      ? t(vehicle.nameKey, { fallback: capitalize(key) })
                      : capitalize(key)}
                  </h4>

                  {getVehicleCapacity(key)}

                  {typeof vehicle === 'object' &&
                    'price' in vehicle &&
                    vehicle.price !== 0 && (
                      <p className='text-sm text-blue-600 font-medium mt-2'>
                        {vehicle.price > 0 ? `+$${vehicle.price}` : ''}
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opciones de viaje */}
      {Object.keys(tripOptions).length > 0 && (
        <div className='mb-8'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            {t('airportDetails.tripOptions')}
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Object.entries(tripOptions).map(([key, trip]) => (
              <div
                key={key}
                className='flex items-start p-4 border border-gray-200 rounded-lg'
              >
                <div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4'>
                  {key === 'roundTrip' ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M14 5l7 7m0 0l-7 7m7-7H3'
                      />
                    </svg>
                  )}
                </div>

                <div>
                  <h4 className='font-medium text-gray-800 mb-1'>
                    {typeof trip === 'object' && 'nameKey' in trip
                      ? t(trip.nameKey, {
                          fallback:
                            key === 'roundTrip' ? 'Round Trip' : 'One Way',
                        })
                      : key === 'roundTrip'
                      ? 'Round Trip'
                      : 'One Way'}
                  </h4>

                  <p className='text-sm text-gray-600'>
                    {key === 'roundTrip'
                      ? t('airportDetails.roundTripDescription')
                      : t('airportDetails.oneWayDescription')}
                  </p>

                  {typeof trip === 'object' &&
                    'price' in trip &&
                    trip.price !== 0 && (
                      <p className='text-sm text-blue-600 font-medium mt-2'>
                        {trip.price > 0 ? `+${trip.price}` : ''}
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Características adicionales */}
      <div className='mb-8'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          {t('airportDetails.serviceFeatures')}
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4'>
          <div className='flex items-start'>
            <Check className='h-5 w-5 text-green-500 mr-2 mt-0.5' />
            <div>
              <p className='font-medium text-gray-800'>
                {t('airportDetails.meetGreet')}
              </p>
              <p className='text-sm text-gray-600'>
                {t('airportDetails.meetGreetDescription')}
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <Check className='h-5 w-5 text-green-500 mr-2 mt-0.5' />
            <div>
              <p className='font-medium text-gray-800'>
                {t('airportDetails.doorToDoor')}
              </p>
              <p className='text-sm text-gray-600'>
                {t('airportDetails.doorToDoorDescription')}
              </p>
            </div>
          </div>

          {hasFlightTracking && (
            <div className='flex items-start'>
              <Check className='h-5 w-5 text-green-500 mr-2 mt-0.5' />
              <div>
                <p className='font-medium text-gray-800'>
                  {t('airportDetails.flightTracking')}
                </p>
                <p className='text-sm text-gray-600'>
                  {t('airportDetails.flightTrackingDescription')}
                </p>
              </div>
            </div>
          )}

          {hasChildSeats && (
            <div className='flex items-start'>
              <Check className='h-5 w-5 text-green-500 mr-2 mt-0.5' />
              <div>
                <p className='font-medium text-gray-800'>
                  {t('airportDetails.childSeats')}
                </p>
                <p className='text-sm text-gray-600'>
                  {t('airportDetails.childSeatsDescription')}
                </p>
              </div>
            </div>
          )}

          {isPremium && (
            <div className='flex items-start'>
              <Check className='h-5 w-5 text-green-500 mr-2 mt-0.5' />
              <div>
                <p className='font-medium text-gray-800'>
                  {t('airportDetails.premiumRefreshments')}
                </p>
                <p className='text-sm text-gray-600'>
                  {t('airportDetails.premiumRefreshmentsDescription')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recomendaciones para el viajero */}
      <div className='border-t border-gray-200 pt-6 mt-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
          <AlertCircle className='h-5 w-5 text-amber-500 mr-2' />
          {t('airportDetails.travelerTips')}
        </h3>

        <ul className='space-y-2'>
          <li className='flex items-start'>
            <Calendar className='h-5 w-5 text-blue-500 mr-2 mt-0.5' />
            <span className='text-gray-700'>{t('airportDetails.tip1')}</span>
          </li>
          <li className='flex items-start'>
            <Map className='h-5 w-5 text-blue-500 mr-2 mt-0.5' />
            <span className='text-gray-700'>{t('airportDetails.tip2')}</span>
          </li>
          <li className='flex items-start'>
            <Clock className='h-5 w-5 text-blue-500 mr-2 mt-0.5' />
            <span className='text-gray-700'>{t('airportDetails.tip3')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Función auxiliar para obtener la capacidad basada en el tipo de vehículo
function getVehicleCapacity(vehicleType: string): JSX.Element {
  let capacity = '';

  switch (vehicleType.toLowerCase()) {
    case 'sedan':
      capacity = '1-3 passengers, 2-3 suitcases';
      break;
    case 'suv':
      capacity = '1-5 passengers, 3-4 suitcases';
      break;
    case 'van':
      capacity = '1-7 passengers, 6-7 suitcases';
      break;
    default:
      capacity = 'Standard capacity';
  }

  return <p className='text-sm text-gray-600'>{capacity}</p>;
}

// Función auxiliar para capitalizar texto
function capitalize(text: string): string {
  return (
    text.charAt(0).toUpperCase() + text.slice(1).replace(/([A-Z])/g, ' $1')
  );
}

export default AirportDetails;
