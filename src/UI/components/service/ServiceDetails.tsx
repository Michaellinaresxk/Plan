import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useBooking } from '@/context/BookingContext';
import { ServiceData } from '@/types/services';
import { Service } from '@/types/type';
import { Check, Star, ArrowLeft, Calendar } from 'lucide-react';
import ServiceContentOrchestrator from './ServiceContentOrchestrator';
import ServiceManager from '@/constants/services/ServiceManager';

interface ServiceDetailsEnhancedProps {
  service: Service;
  serviceData?: ServiceData;
}

/**
 * Enhanced Service Details Component
 *
 * This is a drop-in replacement for the existing ServiceDetails component
 * that uses the new ServiceContentOrchestrator to render service details
 * in a more flexible and scalable way.
 */
const ServiceDetails: React.FC<ServiceDetailsEnhancedProps> = ({
  service,
  serviceData,
}) => {
  const { t } = useTranslation();
  const { addService, selectedServices } = useBooking();

  // Get extended details from ServiceManager
  const extendedDetails = ServiceManager.getDetails(service.id);

  // Verify if the service is already selected
  const isSelected = selectedServices.some((s) => s.id === service.id);

  // Determine if service is premium
  const isPremium = service.packageType.includes('premium');
  const packageType = isPremium ? 'premium' : 'standard';

  // Get translations for service data
  const serviceName = serviceData?.titleKey
    ? t(serviceData.titleKey, { fallback: service.name })
    : service.name;

  // Format price with currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(service.price);

  // Get price unit translation
  const priceUnit = serviceData?.priceUnit
    ? t(serviceData.priceUnit, {
        fallback: service.duration === 24 ? 'per day' : 'per session',
      })
    : service.duration === 24
    ? 'per day'
    : 'per session';

  return (
    <div
      className={`bg-gray-50 min-h-screen pb-16 ${
        isPremium ? 'bg-gray-900' : ''
      }`}
    >
      {/* Hero Section with Background Image */}
      <div className='relative h-[40vh] lg:h-[50vh] overflow-hidden'>
        <Image
          src={service.img}
          alt={serviceName}
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

        {/* Content overlay */}
        <div className='container mx-auto px-6 relative h-full flex flex-col justify-end pb-10'>
          <Link
            href='/services'
            className='text-white mb-6 inline-flex items-center hover:underline'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            {t('services.actions.backToServices')}
          </Link>

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
              {serviceName}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='container mx-auto px-6 pt-12'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main content column */}
          <div className='lg:col-span-2'>
            {/* Orchestrated content blocks */}
            <ServiceContentOrchestrator
              service={service}
              serviceData={serviceData}
              extendedDetails={extendedDetails}
              viewContext={isPremium ? 'premium-view' : 'standard-view'}
            />
          </div>

          {/* Sidebar - Booking and options */}
          <div className='lg:col-span-1'>
            <div
              className={`${
                isPremium ? 'bg-gray-800 border-gray-700' : 'bg-white'
              } p-6 rounded-xl shadow-sm sticky top-24`}
            >
              <div className='flex justify-between items-center mb-6'>
                <div>
                  <span
                    className={`text-3xl font-bold ${
                      isPremium ? 'text-amber-400' : 'text-gray-900'
                    }`}
                  >
                    {formattedPrice}
                  </span>
                  <span
                    className={`${
                      isPremium ? 'text-gray-400' : 'text-gray-500'
                    } ml-1`}
                  >
                    {priceUnit}
                  </span>
                </div>

                {serviceData?.metaData?.rating && (
                  <div className='flex items-center'>
                    <Star
                      className={`h-5 w-5 ${
                        isPremium
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-yellow-400 fill-yellow-400'
                      }`}
                    />
                    <span
                      className={`ml-1 ${
                        isPremium ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {serviceData.metaData.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Service options if available */}
              {serviceData?.options &&
                Object.keys(serviceData.options).length > 0 && (
                  <div className='space-y-4 mb-6'>
                    <h4
                      className={`font-medium ${
                        isPremium ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {t('serviceDetails.options')}
                    </h4>

                    {Object.entries(serviceData.options).map(
                      ([optionKey, option]) => (
                        <div key={optionKey} className='mb-4'>
                          <label
                            className={`block text-sm font-medium ${
                              isPremium ? 'text-gray-300' : 'text-gray-700'
                            } mb-2`}
                          >
                            {t(option.nameKey, { fallback: option.id })}
                          </label>
                          <select
                            className={`w-full border ${
                              isPremium
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'border-gray-300 text-gray-900'
                            } rounded-md py-2 px-3 focus:outline-none focus:ring-2 ${
                              isPremium
                                ? 'focus:ring-amber-500 focus:border-amber-500'
                                : 'focus:ring-blue-500 focus:border-blue-500'
                            }`}
                          >
                            {option.subOptions &&
                              Object.entries(option.subOptions).map(
                                ([subOptionKey, subOption]) => (
                                  <option
                                    key={subOptionKey}
                                    value={subOption.id}
                                  >
                                    {t(subOption.nameKey, {
                                      fallback: subOption.id,
                                    })}
                                    {typeof subOption === 'object' &&
                                      'price' in subOption &&
                                      subOption.price !== 0 &&
                                      ` (${subOption.price > 0 ? '+' : ''}${
                                        subOption.price
                                      })`}
                                  </option>
                                )
                              )}
                          </select>
                        </div>
                      )
                    )}
                  </div>
                )}

              {/* Booking button */}
              <button
                onClick={() => addService(service)}
                className={`w-full py-3 px-4 rounded-lg font-medium ${
                  isPremium
                    ? isSelected
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-black'
                    : isSelected
                    ? 'bg-blue-700 hover:bg-blue-800 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors flex items-center justify-center`}
              >
                {isSelected ? (
                  <>
                    <Check className='mr-2' size={20} />
                    {t('serviceDetails.removeFromPackage')}
                  </>
                ) : (
                  <>
                    <Calendar className='mr-2' size={20} />
                    {t('serviceDetails.addToPackage')}
                  </>
                )}
              </button>

              {/* Disclaimer if available */}
              {serviceData?.disclaimer && (
                <p
                  className={`text-sm ${
                    isPremium ? 'text-gray-400' : 'text-gray-500'
                  } mt-4`}
                >
                  {t(serviceData.disclaimer, { fallback: 'Disclaimer' })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
