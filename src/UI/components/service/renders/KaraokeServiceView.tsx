// views/KaraokeServiceView.tsx

import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ServiceExtendedDetails } from '@/constants/services/serviceDetails';
import {
  Music,
  Mic,
  Headphones,
  Users,
  Clock,
  Zap,
  Settings,
  Check,
  AlertCircle,
  PartyPopper,
  Calendar,
} from 'lucide-react';

interface KaraokeServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
}

const KaraokeServiceView: React.FC<KaraokeServiceViewProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
}) => {
  const { t } = useTranslation();

  // Extract setup options if they exist
  let setupOptions: Record<string, any> = {};
  if (serviceData?.options?.setupType?.subOptions) {
    setupOptions = serviceData.options.setupType.subOptions;
  }

  // Extract host options if they exist
  let hostOptions: Record<string, any> = {};
  if (serviceData?.options?.hostIncluded?.subOptions) {
    hostOptions = serviceData.options.hostIncluded.subOptions;
  }

  // Get time slots/session types from extended details
  const timeSlots = extendedDetails?.timeSlots || [];

  // Get number of songs available
  const songsAvailable = serviceData?.metaData?.songsAvailable || 5000;

  // Get available languages
  const languages = serviceData?.metaData?.languages
    ? serviceData.metaData.languages.toString().split(',')
    : ['english', 'spanish'];

  // Get includes & itinerary from extended details
  const includes = extendedDetails?.includes || [];
  const notIncluded = extendedDetails?.notIncluded || [];
  const itinerary = extendedDetails?.itinerary || [];

  // Get tagline and slogan
  const tagline = extendedDetails?.tagline || '';
  const slogan = extendedDetails?.slogan || '';

  // Get additional details
  const details = extendedDetails?.details || {};

  // Get disclaimer
  const disclaimer = extendedDetails?.disclaimer || serviceData?.disclaimer;

  return (
    <div className='space-y-8'>
      {/* Description Section with Tagline/Slogan */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          {/* Tagline and slogan if available */}
          {(tagline || slogan) && (
            <div className='mb-4'>
              {tagline && (
                <p className='text-lg font-medium text-gray-700'>{tagline}</p>
              )}
              {slogan && (
                <p className='text-sm text-gray-500 uppercase tracking-wide'>
                  {slogan}
                </p>
              )}
            </div>
          )}

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
      </div>

      {/* Service Highlights */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <div className={`bg-${primaryColor}-50 p-4 rounded-lg`}>
          <h3 className='font-medium text-gray-900 mb-2 flex items-center'>
            <PartyPopper className={`h-5 w-5 text-${primaryColor}-600 mr-2`} />
            {t('karaokeDetails.experienceType')}
          </h3>
          <p className='text-gray-700'>
            {t('karaokeDetails.entertainmentDescription')}
          </p>
        </div>

        <div className={`bg-${primaryColor}-50 p-4 rounded-lg`}>
          <h3 className='font-medium text-gray-900 mb-2 flex items-center'>
            <Clock className={`h-5 w-5 text-${primaryColor}-600 mr-2`} />
            {t('karaokeDetails.duration')}
          </h3>
          <p className='text-gray-700'>
            {t('karaokeDetails.standardDuration', { hours: service.duration })}
          </p>
        </div>
      </div>

      {/* Setup Options */}
      {Object.keys(setupOptions).length > 0 && (
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='p-6 md:p-8'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
              <Settings className={`mr-2 text-${primaryColor}-500`} size={20} />
              {t('karaokeDetails.setupOptions')}
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Object.entries(setupOptions).map(([key, option]) => (
                <div
                  key={key}
                  className={`border rounded-lg overflow-hidden ${
                    key === 'premium'
                      ? `border-${primaryColor}-200 bg-${primaryColor}-50/30`
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <div className='p-4'>
                    <div className='flex justify-between items-start'>
                      <h4 className='font-medium text-gray-800 flex items-center'>
                        {key === 'premium' ? (
                          <Zap
                            className={`h-4 w-4 mr-2 text-${primaryColor}-500`}
                          />
                        ) : (
                          <Settings className={`h-4 w-4 mr-2 text-gray-500`} />
                        )}
                        {typeof option === 'object' && 'nameKey' in option
                          ? t(option.nameKey, { fallback: key })
                          : key}
                      </h4>

                      {typeof option === 'object' &&
                        'price' in option &&
                        option.price !== 0 && (
                          <span
                            className={`font-medium ${
                              Number(option.price) > 0
                                ? `text-${primaryColor}-600`
                                : 'text-green-600'
                            }`}
                          >
                            {Number(option.price) > 0 ? '+' : ''}${option.price}
                          </span>
                        )}
                    </div>

                    <div className='mt-2 text-sm text-gray-600'>
                      {key === 'basic' ? (
                        <p>{t('karaokeDetails.basicDescription')}</p>
                      ) : (
                        <p>{t('karaokeDetails.premiumDescription')}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Host Options */}
      {Object.keys(hostOptions).length > 0 && (
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='p-6 md:p-8'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
              <Users className={`mr-2 text-${primaryColor}-500`} size={20} />
              {t('karaokeDetails.hostOptions')}
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Object.entries(hostOptions).map(([key, option]) => (
                <div
                  key={key}
                  className={`border rounded-lg overflow-hidden ${
                    key === 'yes'
                      ? `border-${primaryColor}-200 bg-${primaryColor}-50/30`
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <div className='p-4'>
                    <div className='flex justify-between items-start'>
                      <h4 className='font-medium text-gray-800'>
                        {typeof option === 'object' && 'nameKey' in option
                          ? t(option.nameKey, {
                              fallback:
                                key === 'yes' ? 'With Host' : 'Without Host',
                            })
                          : key === 'yes'
                          ? 'With Host'
                          : 'Without Host'}
                      </h4>

                      {typeof option === 'object' &&
                        'price' in option &&
                        option.price !== 0 && (
                          <span
                            className={`font-medium ${
                              Number(option.price) > 0
                                ? `text-${primaryColor}-600`
                                : 'text-green-600'
                            }`}
                          >
                            {Number(option.price) > 0 ? '+' : ''}${option.price}
                          </span>
                        )}
                    </div>

                    <div className='mt-2 text-sm text-gray-600'>
                      {key === 'yes' ? (
                        <p>{t('karaokeDetails.withHostDescription')}</p>
                      ) : (
                        <p>{t('karaokeDetails.withoutHostDescription')}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Session Types */}
      {timeSlots && timeSlots.length > 0 && (
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='p-6 md:p-8'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
              <Mic className={`mr-2 text-${primaryColor}-500`} size={20} />
              {t('karaokeDetails.sessionTypes')}
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={`flex items-center bg-${primaryColor}-50 p-3 rounded-lg`}
                >
                  <Music className={`h-5 w-5 text-${primaryColor}-600 mr-2`} />
                  <span className='text-gray-800'>{slot}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* What's Included Section */}
      {(includes.length > 0 || notIncluded.length > 0) && (
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='p-6 md:p-8'>
            <h3 className='text-xl font-bold text-gray-900 mb-6'>
              {t('serviceDetails.whatsIncluded')}
            </h3>

            <div className='grid md:grid-cols-2 gap-8'>
              {includes.length > 0 && (
                <div>
                  <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                    <Check
                      className={`mr-2 text-${primaryColor}-500`}
                      size={18}
                    />
                    {t('serviceDetails.includedInService')}
                  </h4>

                  <ul className='space-y-3'>
                    {includes.map((item, index) => (
                      <li key={index} className='flex items-start'>
                        <div
                          className={`mt-1 h-5 w-5 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                        >
                          <Check
                            className={`h-3 w-3 text-${primaryColor}-600`}
                          />
                        </div>
                        <span className='text-gray-700'>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {notIncluded.length > 0 && (
                <div>
                  <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                    <AlertCircle
                      className={`mr-2 text-${primaryColor}-500`}
                      size={18}
                    />
                    {t('serviceDetails.notIncluded')}
                  </h4>

                  <ul className='space-y-3'>
                    {notIncluded.map((item, index) => (
                      <li
                        key={index}
                        className='flex items-start text-gray-700'
                      >
                        <div className='mt-1 h-5 w-5 flex items-center justify-center mr-3 flex-shrink-0'>
                          <span className='text-sm font-medium'>•</span>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Itinerary Section */}
      {itinerary.length > 0 && (
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='p-6 md:p-8'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              {t('serviceDetails.whatToExpect')}
            </h3>

            <ol className='space-y-4'>
              {itinerary.map((step, index) => (
                <li key={index} className='flex items-start'>
                  <div
                    className={`mt-0.5 h-6 w-6 rounded-full bg-${primaryColor}-500 text-white flex items-center justify-center mr-3 flex-shrink-0 font-medium text-sm`}
                  >
                    {index + 1}
                  </div>
                  <span className='text-gray-700'>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Additional Details */}
      {Object.keys(details).length > 0 && (
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='p-6 md:p-8'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
              <Info className={`mr-2 text-${primaryColor}-500`} size={20} />
              {t('serviceDetails.additionalDetails')}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Recommended Time */}
              {details.recommendedTime && (
                <div className='flex items-start'>
                  <Clock
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <div>
                    <p className='font-medium text-gray-800'>
                      {t('karaokeDetails.recommendedTime')}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {details.recommendedTime}
                    </p>
                  </div>
                </div>
              )}

              {/* Space Needed */}
              {details.spaceNeeded && (
                <div className='flex items-start'>
                  <Map
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <div>
                    <p className='font-medium text-gray-800'>
                      {t('karaokeDetails.spaceNeeded')}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {details.spaceNeeded}
                    </p>
                  </div>
                </div>
              )}

              {/* Power Access */}
              {details.powerAccess && (
                <div className='flex items-start'>
                  <Zap
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <div>
                    <p className='font-medium text-gray-800'>
                      {t('karaokeDetails.powerAccess')}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {details.powerAccess}
                    </p>
                  </div>
                </div>
              )}

              {/* Custom Options */}
              {details.customOptions && details.customOptions.length > 0 && (
                <div className='flex items-start'>
                  <Settings
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <div>
                    <p className='font-medium text-gray-800'>
                      {t('karaokeDetails.customOptions')}
                    </p>
                    <div className='flex flex-wrap gap-2 mt-1'>
                      {details.customOptions.map(
                        (option: string, index: number) => (
                          <span
                            key={index}
                            className={`px-2 py-0.5 bg-${primaryColor}-100 text-${primaryColor}-800 rounded-full text-xs`}
                          >
                            {option}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Available Languages */}
      {languages && languages.length > 0 && (
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='p-6 md:p-8'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
              <Headphones
                className={`mr-2 text-${primaryColor}-500`}
                size={20}
              />
              {t('karaokeDetails.languages')}
            </h3>
            <div className='flex flex-wrap gap-2'>
              {languages.map((language, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 bg-${primaryColor}-50 text-${primaryColor}-700 rounded-full text-sm flex items-center`}
                >
                  <Check className='h-3.5 w-3.5 mr-1' />
                  <span className='capitalize'>{language.trim()}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Important Notes & Disclaimer */}
      {disclaimer && (
        <div className='bg-amber-50 rounded-lg border border-amber-100 p-4'>
          <h4 className='font-medium text-amber-800 mb-2 flex items-center'>
            <AlertCircle className='w-5 h-5 mr-2' />
            {t('karaokeDetails.importantNote')}
          </h4>
          <p className='text-amber-700'>{disclaimer}</p>
          {details.powerAccess && (
            <p className='text-amber-700 mt-2 text-sm'>
              {t('karaokeDetails.powerRequirement')}: {details.powerAccess}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default KaraokeServiceView;
