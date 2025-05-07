'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { BookingProvider } from '@/context/BookingContext';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Check, Calendar } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { useBooking } from '@/context/BookingContext';
import { getRelatedServices, getServiceById } from '@/utils/servicesUtils';
import Navbar from '@/UI/components/shared/Navbar';
import CartSidebar from '@/UI/components/shared/CartSidebar';
import Footer from '@/UI/components/shared/Footer';

// Interfaz para los parámetros de la página
interface ServicePageParams {
  params: {
    id: string;
  };
}

export default function ServicePage({ params }: ServicePageParams) {
  const { id } = params;
  const { t } = useTranslation();
  const {
    addService,
    bookService,
    setDates,
    setGuests,
    selectedServices,
    cartVisible,
  } = useBooking();

  // Obtener los datos del servicio usando el ID
  const serviceData = getServiceById(id);

  // Si no se encuentra el servicio, mostrar página 404
  if (!serviceData) {
    return notFound();
  }

  // Convertir a formato legacy para compatibilidad con componentes existentes
  const service = {
    id: serviceData.id,
    name: t(serviceData.titleKey, { fallback: serviceData.id }),
    img: serviceData.imageUrl,
    description: t(serviceData.descriptionKey, {
      fallback: 'No description available',
    }),
    packageType: serviceData.packageType,
    price: serviceData.basePrice,
    duration: serviceData.duration || 0,
    available: true,
    fullDescription: serviceData.fullDescriptionKey
      ? t(serviceData.fullDescriptionKey, { fallback: '' })
      : '',
    priceUnit: t(serviceData.priceUnit, { fallback: 'per unit' }),
  };

  // Obtener servicios relacionados
  const relatedServicesData = getRelatedServices(id, 3);

  // Convertir servicios relacionados a formato legacy
  const relatedServices = relatedServicesData.map((data) => ({
    id: data.id,
    name: t(data.titleKey, { fallback: data.id }),
    img: data.imageUrl,
    description: t(data.descriptionKey, {
      fallback: 'No description available',
    }),
    packageType: data.packageType,
    price: data.basePrice,
    duration: data.duration || 0,
    available: true,
  }));

  // Función para agregar servicio al carrito
  const handleAddToCart = () => {
    // Convert service to required format for the BookingContext
    const serviceToAdd = {
      id: service.id,
      name: service.name,
      img: service.img,
      description: service.description,
      packageType: service.packageType,
      price: service.price,
      duration: service.duration,
      available: true,
    };

    addService(serviceToAdd);
  };

  return (
    <BookingProvider>
      <div className='min-h-screen flex flex-col'>
        <Navbar />

        <main className='flex-grow pt-24 pb-16'>
          {/* Breadcrumb */}
          <div className='container mx-auto px-6 mb-8'>
            <Link
              href='/services'
              className='inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              {t('serviceDetails.backToServices', {
                fallback: 'Back to services',
              })}
            </Link>
          </div>

          {/* Service Details */}
          <div className='container mx-auto px-6'>
            <div className='bg-white rounded-xl shadow-md overflow-hidden mb-12'>
              <div className='md:flex'>
                {/* Service Image */}
                <div className='md:w-1/2 h-64 md:h-auto relative'>
                  <Image
                    src={service.img}
                    alt={service.name}
                    fill
                    className='object-cover'
                  />
                </div>

                {/* Service Info */}
                <div className='p-8 md:w-1/2'>
                  <div className='uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1'>
                    {t(`serviceCategory.${serviceData.category}`, {
                      fallback: serviceData.category,
                    })}
                  </div>
                  <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                    {service.name}
                  </h1>

                  <div className='flex items-center mb-6'>
                    <div className='flex items-center mr-6'>
                      <Clock className='h-5 w-5 text-gray-500 mr-2' />
                      <span className='text-gray-700'>
                        {service.duration}{' '}
                        {t('serviceDetails.hour', {
                          count: service.duration,
                          fallback: 'hour(s)',
                        })}
                      </span>
                    </div>
                    {serviceData.metaData?.maxPeople && (
                      <div className='flex items-center'>
                        <Users className='h-5 w-5 text-gray-500 mr-2' />
                        <span className='text-gray-700'>
                          {t('serviceDetails.upTo', { fallback: 'Up to' })}{' '}
                          {serviceData.metaData.maxPeople}{' '}
                          {t('serviceDetails.people', { fallback: 'people' })}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className='text-gray-600 mb-8'>{service.description}</p>

                  <div className='mb-8'>
                    <div className='font-semibold text-lg text-gray-900 mb-2'>
                      {t('serviceDetails.price', { fallback: 'Price' })}:
                    </div>
                    <div className='flex items-baseline'>
                      <span className='text-3xl font-bold text-gray-900'>
                        ${service.price}
                      </span>
                      <span className='text-gray-600 ml-2'>
                        {service.priceUnit}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className='w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center'
                  >
                    <Calendar className='mr-2 h-5 w-5' />
                    {t('serviceDetails.addToPackage', {
                      fallback: 'Add to Package',
                    })}
                  </button>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {service.fullDescription && (
              <div className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  {t('serviceDetails.aboutService', {
                    fallback: 'About this Service',
                  })}
                </h2>
                <div className='prose max-w-none text-gray-700'>
                  <p>{service.fullDescription}</p>
                </div>
              </div>
            )}

            {/* What's Included Section */}
            {serviceData.includes && serviceData.includes.length > 0 && (
              <div className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  {t('serviceDetails.included', {
                    fallback: "What's Included",
                  })}
                </h2>
                <div className='grid md:grid-cols-2 gap-4'>
                  {serviceData.includes.map((includeKey, index) => (
                    <div key={index} className='flex items-start'>
                      <div className='flex-shrink-0 mt-0.5'>
                        <Check className='h-5 w-5 text-green-500' />
                      </div>
                      <div className='ml-3 text-gray-700'>
                        {t(includeKey, { fallback: includeKey })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info Section */}
            {serviceData.additionalInfoKeys &&
              serviceData.additionalInfoKeys.length > 0 && (
                <div className='mb-12'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                    {t('serviceDetails.additionalInfo', {
                      fallback: 'Additional Information',
                    })}
                  </h2>
                  <div className='bg-gray-50 p-6 rounded-lg'>
                    <ul className='space-y-3'>
                      {serviceData.additionalInfoKeys.map((infoKey, index) => (
                        <li key={index} className='text-gray-700'>
                          {t(infoKey, { fallback: infoKey })}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            {/* Related Services Section */}
            {relatedServices.length > 0 && (
              <div>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  {t('serviceDetails.relatedServices', {
                    fallback: 'You Might Also Like',
                  })}
                </h2>
                <div className='grid md:grid-cols-3 gap-6'>
                  {relatedServices.map((relatedService) => (
                    <Link
                      href={`/service/${relatedService.id}`}
                      key={relatedService.id}
                    >
                      <div className='bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
                        <div className='h-48 relative'>
                          <Image
                            src={relatedService.img}
                            alt={relatedService.name}
                            fill
                            className='object-cover'
                          />
                        </div>
                        <div className='p-4'>
                          <h3 className='font-semibold text-gray-900 mb-1'>
                            {relatedService.name}
                          </h3>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-600 text-sm'>
                              ${relatedService.price}
                            </span>
                            <div className='flex items-center text-sm text-gray-500'>
                              <Clock className='h-4 w-4 mr-1' />
                              <span>{relatedService.duration}h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <CartSidebar />
        <Footer />
      </div>
    </BookingProvider>
  );
}
