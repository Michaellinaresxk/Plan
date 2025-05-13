// views/CustomDecorationsServiceView.tsx (versión mejorada)

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import {
  Palette,
  Calendar,
  Clock,
  Camera,
  Users,
  AlertCircle,
  Check,
  Sparkles,
  X,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';

interface CustomDecorationsServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

// Imágenes para la galería
const decorationImages = [
  {
    src: 'https://images.unsplash.com/photo-1580740103686-55594a00a1b0?q=80&w=2787&auto=format&fit=crop',
    alt: 'Romantic beach setup with candles and flowers',
    category: 'romantic',
  },
  {
    src: 'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?q=80&w=2940&auto=format&fit=crop',
    alt: 'Elegant birthday decoration with balloons and cake',
    category: 'birthday',
  },
  {
    src: 'https://images.unsplash.com/photo-1464699798531-2ecf3a63fe09?q=80&w=2940&auto=format&fit=crop',
    alt: 'Luxury beach picnic setup with cushions and umbrella',
    category: 'beachPicnic',
  },
  {
    src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2940&auto=format&fit=crop',
    alt: 'Elegant dining table with floral arrangements',
    category: 'luxuryDining',
  },
  {
    src: 'https://images.unsplash.com/photo-1626760890874-522e0f47e3e1?q=80&w=3087&auto=format&fit=crop',
    alt: 'Colorful kids party setup with themes and games',
    category: 'kidsParty',
  },
  {
    src: 'https://images.unsplash.com/photo-1523362289600-a70b4a0e09e4?q=80&w=3024&auto=format&fit=crop',
    alt: 'Beautiful balloon garland arrangement',
    category: 'balloonGarlands',
  },
];

const CustomDecorationsServiceView: React.FC<
  CustomDecorationsServiceViewProps
> = ({ service, serviceData, primaryColor }) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Extraer datos específicos
  const decorationOptions =
    serviceData?.options?.decorationType?.subOptions || {};
  const extrasOptions = serviceData?.options?.extras?.subOptions || {};

  // Metadatos relevantes
  const bookingNotice = serviceData?.metaData?.bookingNotice || '48 hours';
  const setupLocation =
    serviceData?.metaData?.setupLocation || 'Indoor or outdoor';
  const customization = serviceData?.metaData?.customization || 'High';

  // Manejar la reserva
  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='space-y-8'>
      {/* Galería de fotos */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
            <Camera className={`mr-2 text-${primaryColor}-500`} size={20} />
            {t('decorationDetails.inspirationGallery')}
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {decorationImages.map((image, index) => (
              <div
                key={index}
                className='relative aspect-video rounded-lg overflow-hidden cursor-pointer group'
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3'>
                  <p className='text-white text-sm font-medium'>
                    {t(`decorationDetails.${image.category}`, {
                      fallback:
                        image.category.charAt(0).toUpperCase() +
                        image.category.slice(1).replace(/([A-Z])/g, ' $1'),
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tipos de decoración */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
            <Palette className={`mr-2 text-${primaryColor}-500`} size={20} />
            {t('decorationDetails.decorationTypes')}
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Object.entries(decorationOptions).map(
              ([key, option]: [string, any]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg hover:shadow-md transition-shadow ${
                    option.price > 0
                      ? `border-${primaryColor}-200 bg-${primaryColor}-50/30`
                      : 'border-gray-200 bg-gray-50/50'
                  } border group`}
                >
                  <div className='flex justify-between items-start'>
                    <h4 className='font-medium text-gray-800'>
                      {t(option.nameKey, {
                        fallback:
                          key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/([A-Z])/g, ' $1'),
                      })}
                    </h4>

                    {option.price !== 0 && (
                      <span
                        className={`font-medium ${
                          option.price > 0
                            ? `text-${primaryColor}-600`
                            : 'text-green-600'
                        }`}
                      >
                        {option.price > 0 ? '+' : ''}${option.price}
                      </span>
                    )}
                  </div>

                  {/* Botón de Book This Style añadido a cada tipo de decoración */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={`mt-3 w-full py-2 px-3 bg-transparent border border-${primaryColor}-400 text-${primaryColor}-600 group-hover:bg-${primaryColor}-500 group-hover:text-white font-medium rounded-lg transition-colors text-sm hidden group-hover:block`}
                  >
                    {t('decorationDetails.bookThisStyle')}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      {/* Hero Section para decoraciones */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='relative h-96 w-full'>
          <Image
            src='https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?q=80&w=2940&auto=format&fit=crop'
            alt='Luxury decoration services'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent'>
            <div className='p-8 h-full flex flex-col justify-end'>
              <h2 className='text-3xl font-bold text-white mb-2'>
                {serviceData?.titleKey ? t(serviceData.titleKey) : service.name}
              </h2>
              <p className='text-lg text-white max-w-2xl'>
                {serviceData?.descriptionKey
                  ? t(serviceData.descriptionKey)
                  : service.description}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className={`mt-6 px-6 py-3 bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-white font-medium rounded-lg transition-colors flex items-center space-x-2 w-auto`}
              >
                <Calendar size={18} />
                <span>{t('serviceDetails.bookNow')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Descripción principal con call-to-action */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <div className='flex flex-col md:flex-row gap-8'>
            <div className='flex-1'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('decorationDetails.transformYourSpace')}
              </h2>
              {serviceData?.fullDescriptionKey && (
                <p className='text-gray-700 mb-6'>
                  {t(serviceData.fullDescriptionKey)}
                </p>
              )}

              <div className='space-y-4 mb-6'>
                <div className='flex items-start'>
                  <Sparkles
                    className={`h-5 w-5 text-${primaryColor}-500 mr-3 mt-1`}
                  />
                  <p className='text-gray-700'>
                    {t('decorationDetails.benefit1')}
                  </p>
                </div>
                <div className='flex items-start'>
                  <Sparkles
                    className={`h-5 w-5 text-${primaryColor}-500 mr-3 mt-1`}
                  />
                  <p className='text-gray-700'>
                    {t('decorationDetails.benefit2')}
                  </p>
                </div>
                <div className='flex items-start'>
                  <Sparkles
                    className={`h-5 w-5 text-${primaryColor}-500 mr-3 mt-1`}
                  />
                  <p className='text-gray-700'>
                    {t('decorationDetails.benefit3')}
                  </p>
                </div>
              </div>
            </div>

            <div className='md:w-1/3 bg-gray-50 p-6 rounded-xl border border-gray-100'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                {t('decorationDetails.readyToTransform')}
              </h3>
              <p className='text-gray-600 mb-4'>
                {t('decorationDetails.bookEarly')}
              </p>

              <div className='space-y-3 mb-6'>
                <div className='flex items-center'>
                  <Check className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                  <span className='text-gray-700'>
                    {t('decorationDetails.perk1')}
                  </span>
                </div>
                <div className='flex items-center'>
                  <Check className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                  <span className='text-gray-700'>
                    {t('decorationDetails.perk2')}
                  </span>
                </div>
                <div className='flex items-center'>
                  <Check className={`h-5 w-5 text-${primaryColor}-500 mr-2`} />
                  <span className='text-gray-700'>
                    {t('decorationDetails.perk3')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className={`w-full py-3 px-4 bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center`}
              >
                <Calendar className='mr-2' size={20} />
                {t('serviceDetails.bookNow')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Extras disponibles */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
            <Sparkles className={`mr-2 text-${primaryColor}-500`} size={20} />
            {t('decorationDetails.enhanceYourExperience')}
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Object.entries(extrasOptions)
              .filter(([key]) => key !== 'none')
              .map(([key, option]: [string, any]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border ${
                    option.price > 0
                      ? `border-${primaryColor}-200 bg-${primaryColor}-50/30`
                      : 'border-gray-200 bg-gray-50/50'
                  } flex justify-between items-center`}
                >
                  <div>
                    <h4 className='font-medium text-gray-800'>
                      {t(option.nameKey, {
                        fallback:
                          key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/([A-Z])/g, ' $1'),
                      })}
                    </h4>
                    <p className='text-sm text-gray-600'>
                      {t(`decorationDetails.${key}Desc`, {
                        fallback: `Enhance your decoration with a beautiful ${key}`,
                      })}
                    </p>
                  </div>

                  <div className='text-right'>
                    <span
                      className={`font-medium block text-${primaryColor}-600`}
                    >
                      ${option.price}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Call to action final */}
      <div
        className={`bg-${primaryColor}-500 rounded-xl shadow-lg overflow-hidden text-white`}
      >
        <div className='p-6 md:p-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
            <div>
              <h3 className='text-xl font-bold mb-2'>
                {t('decorationDetails.readyToBegin')}
              </h3>
              <p className='text-${primaryColor}-100'>
                {t('decorationDetails.limitedAvailability')}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className='py-3 px-6 bg-white text-gray-900 font-medium rounded-lg transition-colors hover:bg-gray-100 flex items-center'
            >
              <Calendar className='mr-2' size={20} />
              {t('serviceDetails.bookNow')}
            </button>
          </div>
        </div>
      </div>

      {/* Info adicional */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
            <Users className={`mr-2 text-${primaryColor}-500`} size={20} />
            {t('decorationDetails.additionalInfo')}
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div
              className={`p-4 rounded-lg bg-${primaryColor}-50/60 border border-${primaryColor}-100`}
            >
              <p className='text-sm text-gray-500 mb-1'>
                {t('decorationDetails.bookingNotice')}
              </p>
              <p className='font-medium text-gray-900'>{bookingNotice}</p>
            </div>
            <div
              className={`p-4 rounded-lg bg-${primaryColor}-50/60 border border-${primaryColor}-100`}
            >
              <p className='text-sm text-gray-500 mb-1'>
                {t('decorationDetails.setupLocation')}
              </p>
              <p className='font-medium text-gray-900'>{setupLocation}</p>
            </div>
            <div
              className={`p-4 rounded-lg bg-${primaryColor}-50/60 border border-${primaryColor}-100`}
            >
              <p className='text-sm text-gray-500 mb-1'>
                {t('decorationDetails.customizationLevel')}
              </p>
              <p className='font-medium text-gray-900'>{customization}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer si existe */}
      {serviceData?.disclaimer && (
        <div className='bg-amber-50 rounded-xl p-6 border border-amber-100'>
          <h3 className='font-medium text-amber-800 mb-2 flex items-center'>
            <AlertCircle className='w-5 h-5 mr-2' />
            {t('services.common.importantNote')}
          </h3>
          <p className='text-amber-700'>{t(serviceData.disclaimer)}</p>
        </div>
      )}

      {/* Modal de reserva */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBookingConfirm}
          service={service}
        />
      )}

      {/* Visor de imagen a pantalla completa */}
      {selectedImageIndex !== null && (
        <div
          className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center'
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            className='absolute top-4 right-4 text-white bg-black/20 p-2 rounded-full hover:bg-black/40'
            onClick={() => setSelectedImageIndex(null)}
          >
            <X size={24} />
          </button>

          <div className='relative w-[90vw] h-[80vh]'>
            <Image
              src={decorationImages[selectedImageIndex].src}
              alt={decorationImages[selectedImageIndex].alt}
              fill
              className='object-contain'
            />
          </div>

          <div className='absolute bottom-4 left-0 right-0 text-center text-white'>
            <p className='text-lg'>
              {decorationImages[selectedImageIndex].alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDecorationsServiceView;
