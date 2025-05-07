import React from 'react';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ServiceExtendedDetails } from '@/constants/services/serviceDetails';
import { BlockConfig } from '../ServiceContentOrchestrator';
import {
  Clock,
  MapPin,
  Users,
  Shield,
  Anchor,
  Ship,
  Heart,
  ChefHat,
  Check,
  Fish,
  Utensils,
  Car,
  LifeBuoy,
  Leaf,
} from 'lucide-react';

interface FeaturesBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
}

/**
 * Features Block Component
 *
 * Renders the key features of a service based on service type
 * Uses different feature sets based on the service ID
 */
const FeaturesBlock: React.FC<FeaturesBlockProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  blockConfig,
  t,
}) => {
  // Extract features from blockConfig data if provided
  const featureData = blockConfig.data || {};

  // Determine which special renderer to use based on service ID
  if (service.id.includes('yoga')) {
    return renderYogaFeatures(featureData, primaryColor, t);
  } else if (service.id.includes('catamaran') || service.id.includes('yacht')) {
    return renderBoatFeatures(featureData, primaryColor, t);
  } else if (
    service.id.includes('airport') ||
    service.id.includes('transfer')
  ) {
    return renderTransportFeatures(featureData, primaryColor, t);
  } else if (service.id.includes('chef') || service.id.includes('culinary')) {
    return renderChefFeatures(featureData, primaryColor, t);
  }

  // Default feature renderer if no specialized rendering is available
  return renderDefaultFeatures(
    service,
    serviceData,
    extendedDetails,
    primaryColor,
    t
  );
};

/**
 * Renders yoga-specific features
 */
const renderYogaFeatures = (featureData: any, primaryColor: string, t: any) => {
  const {
    yogaStyles = [],
    equipmentIncluded = true,
    experienceLevels = [],
  } = featureData;

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        {t('yogaDetails.features')}
      </h3>

      {/* Yoga styles */}
      {yogaStyles.length > 0 && (
        <div className='mb-6'>
          <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
            <Leaf className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            {t('yogaDetails.availableStyles')}
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {yogaStyles.map((style: string, index: number) => (
              <div
                key={index}
                className={`flex items-center bg-${primaryColor}-50 p-3 rounded-lg`}
              >
                <Leaf className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                <span className='text-gray-800 capitalize'>{style}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience levels */}
      {experienceLevels.length > 0 && (
        <div className='mb-6'>
          <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
            <Users className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            {t('yogaDetails.experienceLevels')}
          </h4>
          <div className='flex flex-wrap gap-2'>
            {experienceLevels.map((level: string, index: number) => (
              <span
                key={index}
                className={`px-3 py-1 bg-${primaryColor}-50 text-${primaryColor}-700 rounded-full text-sm flex items-center`}
              >
                <Check className='h-3.5 w-3.5 mr-1' />
                <span className='capitalize'>{level.trim()}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Equipment information */}
      <div className='border-t border-gray-100 pt-4 mt-4'>
        <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
          <Shield className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
          {t('yogaDetails.equipment')}
        </h4>
        <p className='text-gray-700'>
          {equipmentIncluded
            ? t('yogaDetails.equipmentIncluded')
            : t('yogaDetails.bringOwnEquipment')}
        </p>
      </div>
    </div>
  );
};

/**
 * Renders boat-specific features (catamaran or yacht)
 */
const renderBoatFeatures = (featureData: any, primaryColor: string, t: any) => {
  const {
    isPrivate = false,
    capacity = '20 personas',
    destinations = [],
    drinkOptions = [],
  } = featureData;

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        {t('boatDetails.features')}
      </h3>

      {/* Main boat features */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        {/* Type of experience */}
        <div className={`bg-${primaryColor}-50 p-4 rounded-lg`}>
          <h4 className='font-medium text-gray-900 mb-2 flex items-center'>
            <Ship className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            {t('boatDetails.experience')}
          </h4>
          <p className='text-gray-700'>
            {isPrivate
              ? t('boatDetails.privateExperience')
              : t('boatDetails.groupExperience')}
          </p>
        </div>

        {/* Capacity */}
        <div className={`bg-${primaryColor}-50 p-4 rounded-lg`}>
          <h4 className='font-medium text-gray-900 mb-2 flex items-center'>
            <Users className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            {t('boatDetails.capacity')}
          </h4>
          <p className='text-gray-700'>{capacity}</p>
        </div>
      </div>

      {/* Destinations if available */}
      {destinations.length > 0 && (
        <div className='mb-6'>
          <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
            <MapPin className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            {t('boatDetails.destinations')}
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {destinations.map((destination: string, index: number) => (
              <div key={index} className='flex items-start'>
                <MapPin
                  className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                />
                <span className='text-gray-700'>{destination}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      <div className='border-t border-gray-200 pt-4 mt-4'>
        <h4 className='font-medium text-gray-800 mb-3 flex items-center'>
          <LifeBuoy className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
          {t('boatDetails.activities')}
        </h4>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='flex items-center'>
            <LifeBuoy className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            <span className='text-gray-700'>{t('boatDetails.snorkeling')}</span>
          </div>
          <div className='flex items-center'>
            <Anchor className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            <span className='text-gray-700'>{t('boatDetails.swimming')}</span>
          </div>
          <div className='flex items-center'>
            <Ship className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            <span className='text-gray-700'>{t('boatDetails.sailing')}</span>
          </div>
          <div className='flex items-center'>
            <Fish className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            <span className='text-gray-700'>{t('boatDetails.marineLife')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Renders transport-specific features (airport transfers)
 */
const renderTransportFeatures = (
  featureData: any,
  primaryColor: string,
  t: any
) => {
  const {
    isPremium = false,
    travelTime = '20-40 min',
    hasFlightTracking = false,
    hasChildSeats = false,
  } = featureData;

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        {t('transportDetails.features')}
      </h3>

      {/* Main transport features */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <div className={`bg-${primaryColor}-50 p-4 rounded-lg`}>
          <h4 className='font-medium text-gray-900 mb-2 flex items-center'>
            <Car className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            {t('transportDetails.serviceType')}
          </h4>
          <p className='text-gray-700'>
            {isPremium
              ? t('transportDetails.premiumService')
              : t('transportDetails.privateService')}
          </p>
        </div>

        <div className={`bg-${primaryColor}-50 p-4 rounded-lg`}>
          <h4 className='font-medium text-gray-900 mb-2 flex items-center'>
            <Clock className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            {t('transportDetails.estimatedTime')}
          </h4>
          <p className='text-gray-700'>{travelTime}</p>
        </div>
      </div>

      {/* Additional features */}
      <div className='mt-6'>
        <h4 className='font-medium text-gray-800 mb-3'>
          {t('transportDetails.serviceFeatures')}
        </h4>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4'>
          <div className='flex items-start'>
            <Check className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`} />
            <div>
              <p className='font-medium text-gray-800'>
                {t('transportDetails.meetGreet')}
              </p>
              <p className='text-sm text-gray-600'>
                {t('transportDetails.meetGreetDescription')}
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <Check className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`} />
            <div>
              <p className='font-medium text-gray-800'>
                {t('transportDetails.doorToDoor')}
              </p>
              <p className='text-sm text-gray-600'>
                {t('transportDetails.doorToDoorDescription')}
              </p>
            </div>
          </div>

          {hasFlightTracking && (
            <div className='flex items-start'>
              <Check
                className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
              />
              <div>
                <p className='font-medium text-gray-800'>
                  {t('transportDetails.flightTracking')}
                </p>
                <p className='text-sm text-gray-600'>
                  {t('transportDetails.flightTrackingDescription')}
                </p>
              </div>
            </div>
          )}

          {hasChildSeats && (
            <div className='flex items-start'>
              <Check
                className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
              />
              <div>
                <p className='font-medium text-gray-800'>
                  {t('transportDetails.childSeats')}
                </p>
                <p className='text-sm text-gray-600'>
                  {t('transportDetails.childSeatsDescription')}
                </p>
              </div>
            </div>
          )}

          {isPremium && (
            <div className='flex items-start'>
              <Check
                className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
              />
              <div>
                <p className='font-medium text-gray-800'>
                  {t('transportDetails.premiumRefreshments')}
                </p>
                <p className='text-sm text-gray-600'>
                  {t('transportDetails.premiumRefreshmentsDescription')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Renders chef-specific features
 */
const renderChefFeatures = (featureData: any, primaryColor: string, t: any) => {
  const { isPremium = false, maxPeople = 10 } = featureData;

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        {t('chefDetails.features')}
      </h3>

      {/* Main chef features */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className={`bg-${primaryColor}-50 p-4 rounded-lg`}>
          <h4 className='font-medium text-gray-900 mb-2 flex items-center'>
            <ChefHat className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            {t('chefDetails.experience')}
          </h4>
          <p className='text-gray-700'>
            {isPremium
              ? t('chefDetails.gourmetExperience')
              : t('chefDetails.personalizedExperience')}
          </p>
        </div>

        <div className={`bg-${primaryColor}-50 p-4 rounded-lg`}>
          <h4 className='font-medium text-gray-900 mb-2 flex items-center'>
            <Users className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
            {t('chefDetails.capacity')}
          </h4>
          <p className='text-gray-700'>
            {t('chefDetails.upToGuests', { count: maxPeople })}
          </p>
        </div>
      </div>

      {/* Culinary experience */}
      <div className='mt-6'>
        <h4 className='font-medium text-gray-800 mb-3'>
          {t('chefDetails.culinaryExperience')}
        </h4>

        <div className='space-y-4'>
          <div className='flex'>
            <span className='flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-medium mr-3'>
              1
            </span>
            <div className='text-gray-700'>
              <p className='font-medium'>{t('chefDetails.step1Title')}</p>
              <p className='text-sm'>{t('chefDetails.step1Description')}</p>
            </div>
          </div>

          <div className='flex'>
            <span className='flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-medium mr-3'>
              2
            </span>
            <div className='text-gray-700'>
              <p className='font-medium'>{t('chefDetails.step2Title')}</p>
              <p className='text-sm'>{t('chefDetails.step2Description')}</p>
            </div>
          </div>

          <div className='flex'>
            <span className='flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-medium mr-3'>
              3
            </span>
            <div className='text-gray-700'>
              <p className='font-medium'>{t('chefDetails.step3Title')}</p>
              <p className='text-sm'>{t('chefDetails.step3Description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Default feature renderer for services without specialized renderers
 */
const renderDefaultFeatures = (
  service: Service,
  serviceData?: ServiceData,
  extendedDetails?: ServiceExtendedDetails,
  primaryColor: string,
  t: any
) => {
  return (
    <div className='bg-white p-6 rounded-xl shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        {t('serviceDetails.keyFeatures')}
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Duration feature */}
        {service.duration > 0 && (
          <div className='flex items-start'>
            <div
              className={`h-10 w-10 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
            >
              <Clock className={`h-5 w-5 text-${primaryColor}-600`} />
            </div>
            <div>
              <p className='font-medium text-gray-800'>
                {t('serviceDetails.duration')}
              </p>
              <p className='text-gray-600'>
                {service.duration === 1
                  ? t('common.hour', { count: 1 })
                  : service.duration === 24
                  ? t('common.day', { count: 1 })
                  : t('common.hours', { count: service.duration })}
              </p>
            </div>
          </div>
        )}

        {/* Capacity/max people feature */}
        {serviceData?.metaData?.maxPeople && (
          <div className='flex items-start'>
            <div
              className={`h-10 w-10 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
            >
              <Users className={`h-5 w-5 text-${primaryColor}-600`} />
            </div>
            <div>
              <p className='font-medium text-gray-800'>
                {t('serviceDetails.capacity')}
              </p>
              <p className='text-gray-600'>
                {t('serviceDetails.upTo')} {serviceData.metaData.maxPeople}{' '}
                {t('serviceDetails.people')}
              </p>
            </div>
          </div>
        )}

        {/* Location feature */}
        {extendedDetails?.location && (
          <div className='flex items-start'>
            <div
              className={`h-10 w-10 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
            >
              <MapPin className={`h-5 w-5 text-${primaryColor}-600`} />
            </div>
            <div>
              <p className='font-medium text-gray-800'>
                {t('serviceDetails.location')}
              </p>
              <p className='text-gray-600'>{extendedDetails.location}</p>
            </div>
          </div>
        )}

        {/* Size feature if available */}
        {extendedDetails?.size && (
          <div className='flex items-start'>
            <div
              className={`h-10 w-10 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
            >
              <Ship className={`h-5 w-5 text-${primaryColor}-600`} />
            </div>
            <div>
              <p className='font-medium text-gray-800'>
                {t('serviceDetails.size')}
              </p>
              <p className='text-gray-600'>{extendedDetails.size}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturesBlock;
