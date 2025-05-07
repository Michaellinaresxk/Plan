'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useBooking } from '@/context/BookingContext';
import { ServiceData } from '@/types/services';
import { Service } from '@/types/type';
import { Check, Clock, Users, Star, ArrowLeft, Calendar } from 'lucide-react';

// Importar componentes de secciones especializadas
import YogaDetails from './renders/YogaDetails';
import CatamaranDetails from './renders/CatamaranDetails';
import AirportDetails from './renders/AirportDetails';
import ChefDetails from './renders/ChefDetails';
import DefaultDetails from './renders/DefaultDetails';

// Mapeado de especialistas por tipo de servicio
const SPECIALIZED_RENDERERS = {
  yoga: YogaDetails,
  catamaran: CatamaranDetails,
  airport: AirportDetails,
  chef: ChefDetails,
  default: DefaultDetails,
};

interface ServiceDetailsProps {
  service: Service;
  serviceData?: ServiceData;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  serviceData,
}) => {
  const { t } = useTranslation();
  const { addService, selectedServices } = useBooking();

  // Verificar si el servicio ya está seleccionado
  const isSelected = selectedServices.some((s) => s.id === service.id);

  // Determinar qué componente especializado renderizar basado en los metadatos
  const getSpecializedRenderer = () => {
    // Si tenemos serviceData con specialRender definido, lo usamos
    if (serviceData?.specialRender) {
      const SpecialRenderer =
        SPECIALIZED_RENDERERS[serviceData.specialRender] ||
        SPECIALIZED_RENDERERS.default;
      return <SpecialRenderer service={service} serviceData={serviceData} />;
    }

    // O si podemos inferirlo del ID del servicio
    const serviceType = service.id.includes('yoga')
      ? 'yoga'
      : service.id.includes('catamaran')
      ? 'catamaran'
      : service.id.includes('airport')
      ? 'airport'
      : service.id.includes('golf-cart')
      ? 'golf-cart'
      : service.id.includes('chef')
      ? 'chef'
      : 'default';

    const SpecialRenderer =
      SPECIALIZED_RENDERERS[serviceType] || SPECIALIZED_RENDERERS.default;
    return <SpecialRenderer service={service} serviceData={serviceData} />;
  };

  // Preparar datos de traducción
  const isPremium = service.packageType.includes('premium');
  const packageType = isPremium ? 'premium' : 'standard';
  const serviceName = serviceData?.titleKey
    ? t(serviceData.titleKey, { fallback: service.name })
    : service.name;
  const serviceDescription = serviceData?.descriptionKey
    ? t(serviceData.descriptionKey, { fallback: service.description })
    : service.description;
  const fullDescription = serviceData?.fullDescriptionKey
    ? t(serviceData.fullDescriptionKey, { fallback: '' })
    : '';

  // Formatear precio con moneda
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(service.price);

  // Obtener unidad de precio traducida
  const priceUnit = serviceData?.priceUnit
    ? t(serviceData.priceUnit, {
        fallback: service.duration === 24 ? 'per day' : 'per session',
      })
    : service.duration === 24
    ? 'per day'
    : 'per session';

  return (
    <div className='bg-gray-50 min-h-screen pb-16'>
      {/* Hero Section con imagen de fondo */}
      <div className='relative h-[40vh] lg:h-[50vh] overflow-hidden'>
        <Image
          src={service.img}
          alt={serviceName}
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/50 to-black/70' />

        {/* Contenido sobre imagen */}
        <div className='container mx-auto px-6 relative h-full flex flex-col justify-end pb-10'>
          <Link
            href='/services'
            className='text-white mb-6 inline-flex items-center hover:underline'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            {t('serviceDetails.backToServices')}
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
            <p className='text-gray-200 md:text-xl max-w-2xl'>
              {serviceDescription}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className='container mx-auto px-6 pt-12'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Columna principal de contenido */}
          <div className='lg:col-span-2'>
            <div className='bg-white p-6 rounded-xl shadow-sm mb-8'>
              <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                {t('serviceDetails.aboutService')}
              </h2>

              <div className='prose max-w-none text-gray-700 mb-6'>
                <p>{fullDescription || serviceDescription}</p>
              </div>

              {/* Características del servicio */}
              <div className='grid grid-cols-2 gap-4 py-4'>
                <div className='flex items-center text-gray-600'>
                  <Clock className='h-5 w-5 mr-2 text-blue-500' />
                  <span>
                    {service.duration}{' '}
                    {service.duration === 1
                      ? t('common.hour')
                      : service.duration === 24
                      ? t('common.day')
                      : t('common.hours')}
                  </span>
                </div>

                {serviceData?.metaData?.maxPeople && (
                  <div className='flex items-center text-gray-600'>
                    <Users className='h-5 w-5 mr-2 text-blue-500' />
                    <span>
                      {t('common.upTo')} {serviceData.metaData.maxPeople}{' '}
                      {t('common.people')}
                    </span>
                  </div>
                )}

                {serviceData?.availability?.daysOfWeek && (
                  <div className='flex items-center text-gray-600'>
                    <Calendar className='h-5 w-5 mr-2 text-blue-500' />
                    <span>
                      {serviceData.availability.daysOfWeek.length === 7
                        ? t('common.availableAllDays')
                        : t('common.availableSelect')}
                    </span>
                  </div>
                )}
              </div>

              {/* Sección dinámica basada en tipo de servicio */}
              {getSpecializedRenderer()}
            </div>

            {/* Secciones adicionales si existen */}
            {serviceData?.includes && (
              <div className='bg-white p-6 rounded-xl shadow-sm mb-8'>
                <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                  {t('serviceDetails.includes')}
                </h3>
                <ul className='space-y-2'>
                  {serviceData.includes.map((item, index) => (
                    <li key={index} className='flex items-start'>
                      <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5' />
                      <span className='text-gray-700'>
                        {t(item, { fallback: item })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {serviceData?.notIncluded && (
              <div className='bg-white p-6 rounded-xl shadow-sm mb-8'>
                <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                  {t('serviceDetails.notIncluded')}
                </h3>
                <ul className='space-y-2'>
                  {serviceData.notIncluded.map((item, index) => (
                    <li key={index} className='flex items-start text-gray-700'>
                      <span className='mr-2'>•</span>
                      <span>{t(item, { fallback: item })}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {serviceData?.itinerary && (
              <div className='bg-white p-6 rounded-xl shadow-sm mb-8'>
                <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                  {t('serviceDetails.itinerary')}
                </h3>
                <ol className='space-y-4'>
                  {serviceData.itinerary.map((item, index) => (
                    <li key={index} className='flex'>
                      <span className='flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-medium mr-3'>
                        {index + 1}
                      </span>
                      <span className='text-gray-700 pt-0.5'>
                        {t(item, { fallback: item })}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Sidebar - Reserva y opciones */}
          <div className='lg:col-span-1'>
            <div className='bg-white p-6 rounded-xl shadow-sm sticky top-24'>
              <div className='flex justify-between items-center mb-6'>
                <div>
                  <span className='text-3xl font-bold text-gray-900'>
                    {formattedPrice}
                  </span>
                  <span className='text-gray-500 ml-1'>{priceUnit}</span>
                </div>

                {serviceData?.metaData?.rating && (
                  <div className='flex items-center'>
                    <Star className='h-5 w-5 text-amber-400 fill-amber-400' />
                    <span className='ml-1 text-gray-700'>
                      {serviceData.metaData.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Opciones del servicio si existen */}
              {serviceData?.options &&
                Object.keys(serviceData.options).length > 0 && (
                  <div className='space-y-4 mb-6'>
                    <h4 className='font-medium text-gray-800'>
                      {t('serviceDetails.options')}
                    </h4>

                    {Object.entries(serviceData.options).map(
                      ([optionKey, option]) => (
                        <div key={optionKey} className='mb-4'>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            {t(option.nameKey, { fallback: option.id })}
                          </label>
                          <select className='w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
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
                                    {subOption.price !== 0 &&
                                      ` (${subOption.price > 0 ? '+' : ''}$${
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

              {/* Botón de reserva */}
              <button
                onClick={() => addService(service)}
                className={`w-full py-3 px-4 rounded-lg font-medium ${
                  isPremium
                    ? 'bg-amber-500 hover:bg-amber-600 text-black'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors flex items-center justify-center`}
              >
                {isSelected
                  ? t('serviceDetails.removeFromPackage')
                  : t('serviceDetails.addToPackage')}
              </button>

              {/* Disclaimer si existe */}
              {serviceData?.disclaimer && (
                <p className='text-sm text-gray-500 mt-4'>
                  {t(serviceData.disclaimer, { fallback: '' })}
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
