// views/LiveMusicServiceView.tsx (versión mejorada)

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import {
  Music,
  Users,
  Clock,
  Calendar,
  Star,
  Check,
  Sparkles,
  Heart,
  X,
  PlayCircle,
  Headphones,
  Radio,
} from 'lucide-react';
import BookingModal from '@/UI/components/modal/BookingModal';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';

interface LiveMusicServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

// Galería de imágenes de música en vivo
const musicGallery = [
  {
    src: 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2940&auto=format&fit=crop',
    alt: 'Solo acoustic guitarist performing',
    type: 'soloist',
  },
  {
    src: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2832&auto=format&fit=crop',
    alt: 'Jazz duo performing at intimate venue',
    type: 'duo',
  },
  {
    src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2940&auto=format&fit=crop',
    alt: 'String trio performing classical music',
    type: 'trio',
  },
  {
    src: 'https://images.unsplash.com/photo-1598387846148-47e82ee3f653?q=80&w=2940&auto=format&fit=crop',
    alt: 'Jazz quartet performing at an event',
    type: 'quartet',
  },
  {
    src: 'https://images.unsplash.com/photo-1576458146240-d3d77512fdf5?q=80&w=2940&auto=format&fit=crop',
    alt: 'Full band setup for an outdoor event',
    type: 'quintet',
  },
  {
    src: 'https://images.unsplash.com/photo-1465225314224-587cd83d322b?q=80&w=2940&auto=format&fit=crop',
    alt: 'Ambient event lighting with live performers',
    type: 'atmosphere',
  },
];

// Géneros musicales con iconos
const musicGenres = [
  { name: 'Jazz & Blues', icon: <Radio size={18} /> },
  { name: 'Classical', icon: <Music size={18} /> },
  { name: 'Pop & Contemporary', icon: <Headphones size={18} /> },
  { name: 'Latin & International', icon: <Globe size={18} /> },
  { name: 'Acoustic', icon: <Music size={18} /> },
  { name: 'Electronic & Ambient', icon: <Radio size={18} /> },
];

const LiveMusicServiceView: React.FC<LiveMusicServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Extraer datos específicos de música
  const performerOptions =
    serviceData?.options?.performerType?.subOptions || {};
  const durationOptions = serviceData?.options?.duration?.subOptions || {};

  // Metadatos relevantes
  const bookingNotice = serviceData?.metaData?.bookingNotice || '72 hours';
  const setupLocation =
    serviceData?.metaData?.setupLocation || 'Indoor or outdoor';
  const standardSessionLength =
    serviceData?.metaData?.standardSessionLength || '60-90 minutes';

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
    <div className='space-y-10'>
      {/* Ventajas del servicio */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div
          className={`bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-${primaryColor}-500 p-6`}
        >
          <div
            className={`w-12 h-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mb-4`}
          >
            <Sparkles className={`h-6 w-6 text-${primaryColor}-600`} />
          </div>
          <h3 className='text-lg font-semibold mb-2'>
            {t('musicDetails.advantage1Title')}
          </h3>
          <p className='text-gray-600'>
            {t('musicDetails.advantage1Description')}
          </p>
        </div>

        <div
          className={`bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-${primaryColor}-500 p-6`}
        >
          <div
            className={`w-12 h-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mb-4`}
          >
            <Heart className={`h-6 w-6 text-${primaryColor}-600`} />
          </div>
          <h3 className='text-lg font-semibold mb-2'>
            {t('musicDetails.advantage2Title')}
          </h3>
          <p className='text-gray-600'>
            {t('musicDetails.advantage2Description')}
          </p>
        </div>

        <div
          className={`bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-${primaryColor}-500 p-6`}
        >
          <div
            className={`w-12 h-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mb-4`}
          >
            <PlayCircle className={`h-6 w-6 text-${primaryColor}-600`} />
          </div>
          <h3 className='text-lg font-semibold mb-2'>
            {t('musicDetails.advantage3Title')}
          </h3>
          <p className='text-gray-600'>
            {t('musicDetails.advantage3Description')}
          </p>
        </div>
      </div>

      {/* Hero section con imagen de fondo y call-to-action */}
      <div className='relative overflow-hidden rounded-2xl shadow-xl'>
        <div className='absolute inset-0 bg-black'>
          <Image
            src='https://images.unsplash.com/photo-1496449903678-68ddcb189a24?q=80&w=2940&auto=format&fit=crop'
            alt='Live music performance'
            fill
            className='object-cover opacity-80'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30' />
        </div>

        <div className='relative z-10 px-8 py-16 md:py-24 md:px-12 max-w-4xl'>
          <span
            className={`inline-block px-3 py-1 rounded-full bg-${primaryColor}-500/20 text-${primaryColor}-400 text-sm font-medium mb-4`}
          >
            {t('musicDetails.transformYourEvent')}
          </span>

          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight'>
            {serviceData?.titleKey ? t(serviceData.titleKey) : service.name}
          </h1>

          <p className='text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl'>
            {serviceData?.descriptionKey
              ? t(serviceData.descriptionKey)
              : service.description}
          </p>

          <div className='flex flex-wrap gap-4'>
            <button
              onClick={() => setIsModalOpen(true)}
              className={`px-6 py-3 bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2`}
            >
              <Calendar size={18} />
              {t('serviceDetails.bookNow')}
            </button>

            <a
              href='#performer-options'
              className='px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg transition-colors flex items-center gap-2'
            >
              <Music size={18} />
              {t('musicDetails.exploreOptions')}
            </a>
          </div>
        </div>
      </div>

      {/* Galería de imágenes */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
            <Music className={`mr-2 text-${primaryColor}-500`} size={22} />
            {t('musicDetails.gallery')}
          </h2>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {musicGallery.map((image, index) => (
              <div
                key={index}
                className='relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group'
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3'>
                  <p className='text-white text-sm font-medium'>
                    {image.type.charAt(0).toUpperCase() + image.type.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tipos de actuación */}
      <div
        id='performer-options'
        className='bg-white rounded-xl shadow-lg overflow-hidden'
      >
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
            <Music className={`mr-2 text-${primaryColor}-500`} size={22} />
            {t('musicDetails.performerOptions')}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Object.entries(performerOptions).map(
              ([key, option]: [string, any]) => {
                // Encontrar imagen correspondiente
                const imageForOption = musicGallery.find(
                  (img) => img.type === key
                );

                return (
                  <div
                    key={key}
                    className={`rounded-xl overflow-hidden border ${
                      option.price > 0
                        ? `border-${primaryColor}-200`
                        : 'border-gray-200'
                    } hover:shadow-lg transition-shadow group`}
                  >
                    {/* Imagen del tipo de actuación */}
                    <div className='relative h-48 overflow-hidden'>
                      <Image
                        src={imageForOption?.src || musicGallery[0].src}
                        alt={`${key} performer`}
                        fill
                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-4'>
                        <h3 className='text-white font-bold'>
                          {t(option.nameKey, {
                            fallback:
                              key.charAt(0).toUpperCase() + key.slice(1),
                          })}
                        </h3>
                      </div>
                    </div>

                    {/* Detalles */}
                    <div className='p-5'>
                      <div className='flex justify-between items-start mb-3'>
                        <p className='text-gray-600 text-sm'>
                          {key === 'soloist'
                            ? '1 musician'
                            : key === 'duo'
                            ? '2 musicians'
                            : key === 'trio'
                            ? '3 musicians'
                            : key === 'quartet'
                            ? '4 musicians'
                            : '5 musicians'}
                        </p>

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

                      <p className='text-sm text-gray-500 mb-4'>
                        {t(`musicDetails.${key}Description`, {
                          fallback: `Perfect for ${
                            key === 'soloist' ? 'intimate' : 'larger'
                          } gatherings and special occasions.`,
                        })}
                      </p>

                      <button
                        onClick={() => setIsModalOpen(true)}
                        className={`w-full py-2 px-3 rounded-lg text-sm border border-${primaryColor}-500 text-${primaryColor}-600 hover:bg-${primaryColor}-500 hover:text-white transition-colors flex items-center justify-center gap-2`}
                      >
                        <Calendar size={16} />
                        {t('musicDetails.selectOption')}
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Géneros musicales */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
            <Radio className={`mr-2 text-${primaryColor}-500`} size={22} />
            {t('musicDetails.availableGenres')}
          </h2>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {musicGenres.map((genre, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg bg-${primaryColor}-50/40 flex items-center gap-3`}
              >
                <div
                  className={`w-10 h-10 rounded-full bg-${primaryColor}-100 flex items-center justify-center`}
                >
                  {genre.icon}
                </div>
                <span className='font-medium'>{genre.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Opciones de duración */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
            <Clock className={`mr-2 text-${primaryColor}-500`} size={22} />
            {t('musicDetails.durationOptions')}
          </h2>

          <div className='space-y-5'>
            {Object.entries(durationOptions).map(
              ([key, option]: [string, any]) => (
                <div
                  key={key}
                  className={`p-5 rounded-xl ${
                    option.price > 0
                      ? `border-${primaryColor}-200 bg-${primaryColor}-50/20`
                      : 'border-gray-200 bg-gray-50/50'
                  } border hover:shadow-md transition-shadow`}
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='font-semibold text-gray-800 text-lg'>
                        {t(option.nameKey, {
                          fallback: key.charAt(0).toUpperCase() + key.slice(1),
                        })}
                      </h3>
                      {option.descriptionKey && (
                        <p className='text-gray-600 mt-2'>
                          {t(option.descriptionKey, { fallback: '' })}
                        </p>
                      )}
                    </div>

                    <div className='text-right'>
                      {option.price !== 0 && (
                        <span
                          className={`font-medium inline-block mb-2 ${
                            option.price > 0
                              ? `text-${primaryColor}-600`
                              : 'text-green-600'
                          }`}
                        >
                          {option.price > 0 ? '+' : ''}${option.price}
                        </span>
                      )}

                      <button
                        onClick={() => setIsModalOpen(true)}
                        className={`block ml-auto py-2 px-4 rounded-lg text-sm bg-${primaryColor}-100 text-${primaryColor}-700 hover:bg-${primaryColor}-200 transition-colors`}
                      >
                        {t('musicDetails.select')}
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Qué esperar */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
            <Star className={`mr-2 text-${primaryColor}-500`} size={22} />
            {t('musicDetails.whatToExpect')}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <div className='space-y-6'>
                <div className='flex items-start'>
                  <div
                    className={`h-12 w-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-4 flex-shrink-0`}
                  >
                    <Calendar className={`h-6 w-6 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 text-lg mb-2'>
                      {t('musicDetails.booking')}
                    </h3>
                    <p className='text-gray-600'>
                      {t('musicDetails.bookingDescription', {
                        notice: bookingNotice,
                      })}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className={`h-12 w-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-4 flex-shrink-0`}
                  >
                    <Clock className={`h-6 w-6 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 text-lg mb-2'>
                      {t('musicDetails.performance')}
                    </h3>
                    <p className='text-gray-600'>
                      {t('musicDetails.performanceDescription', {
                        length: standardSessionLength,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className='space-y-6'>
                <div className='flex items-start'>
                  <div
                    className={`h-12 w-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-4 flex-shrink-0`}
                  >
                    <Music className={`h-6 w-6 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 text-lg mb-2'>
                      {t('musicDetails.repertoire')}
                    </h3>
                    <p className='text-gray-600'>
                      {t('musicDetails.repertoireDescription')}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className={`h-12 w-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-4 flex-shrink-0`}
                  >
                    <Users className={`h-6 w-6 text-${primaryColor}-600`} />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 text-lg mb-2'>
                      {t('musicDetails.location')}
                    </h3>
                    <p className='text-gray-600'>
                      {t('musicDetails.locationDescription', {
                        location: setupLocation,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div
        className={`bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-500 rounded-xl shadow-lg overflow-hidden text-white`}
      >
        <div className='p-8 md:p-10'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
            <div>
              <h2 className='text-2xl md:text-3xl font-bold mb-2'>
                {t('musicDetails.readyToBook')}
              </h2>
              <p className='text-${primaryColor}-100'>
                {t('musicDetails.limitedAvailability')}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className='py-3 px-8 bg-white text-gray-900 font-medium rounded-lg transition-colors hover:bg-gray-100 whitespace-nowrap'
            >
              {t('serviceDetails.bookNow')}
            </button>
          </div>
        </div>
      </div>

      {/* Testimonios (opcional) */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
            <Star className={`mr-2 text-${primaryColor}-500`} size={22} />
            {t('musicDetails.testimonials')}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='p-6 border border-gray-200 rounded-xl bg-gray-50'>
              <div className='flex items-center mb-4'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className='h-5 w-5 text-yellow-400 fill-yellow-400'
                  />
                ))}
              </div>
              <p className='text-gray-700 italic mb-4'>
                "{t('musicDetails.testimonial1')}"
              </p>
              <p className='font-medium text-gray-900'>— Maria & Carlos</p>
            </div>

            <div className='p-6 border border-gray-200 rounded-xl bg-gray-50'>
              <div className='flex items-center mb-4'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className='h-5 w-5 text-yellow-400 fill-yellow-400'
                  />
                ))}
              </div>
              <p className='text-gray-700 italic mb-4'>
                "{t('musicDetails.testimonial2')}"
              </p>
              <p className='font-medium text-gray-900'>— Jennifer & David</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional - para disclaimers, requisitos, etc. */}
      {serviceData?.disclaimer && (
        <div className='bg-amber-50 rounded-xl p-6 border border-amber-100'>
          <h3 className='font-medium text-amber-800 mb-2 flex items-center'>
            <Check className='w-5 h-5 mr-2' />
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
              src={musicGallery[selectedImageIndex].src}
              alt={musicGallery[selectedImageIndex].alt}
              fill
              className='object-contain'
            />
          </div>

          <div className='absolute bottom-4 left-0 right-0 text-center text-white'>
            <p className='text-lg'>{musicGallery[selectedImageIndex].alt}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Definición del componente Globe para un icono que no estaba incluido
function Globe(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <circle cx='12' cy='12' r='10'></circle>
      <line x1='2' y1='12' x2='22' y2='12'></line>
      <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'></path>
    </svg>
  );
}

export default LiveMusicServiceView;
