// views/LiveMusicServiceView.tsx (versión mejorada)

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import {
  Music,
  Calendar,
  Check,
  Sparkles,
  Heart,
  X,
  PlayCircle,
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
      <div className='ounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-white mb-6 flex items-center'>
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
