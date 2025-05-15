import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { motion } from 'framer-motion';
import {
  Palette,
  Camera,
  Sparkles,
  Heart,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Bookmark,
  PartyPopper,
  Briefcase,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';

interface CustomDecorationsServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// Imágenes para la galería - en una aplicación real vendrían del backend
const decorationGallery = [
  {
    src: 'https://images.unsplash.com/photo-1580740103686-55594a00a1b0?q=80&w=2787&auto=format&fit=crop',
    alt: 'Romantic beach dinner setup with candles and flowers',
    category: 'romantic',
    tags: ['romantic', 'dinner', 'beach'],
  },
  {
    src: 'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?q=80&w=2940&auto=format&fit=crop',
    alt: 'Elegant birthday celebration decoration with balloons',
    category: 'birthday',
    tags: ['birthday', 'celebration', 'elegant'],
  },
  {
    src: 'https://images.unsplash.com/photo-1464699798531-2ecf3a63fe09?q=80&w=2940&auto=format&fit=crop',
    alt: 'Luxury beach picnic setup with cushions and umbrella',
    category: 'beachPicnic',
    tags: ['beach', 'picnic', 'luxury'],
  },
];

// Componente principal para CustomDecorationsServiceView
const CustomDecorationsServiceView: React.FC<
  CustomDecorationsServiceViewProps
> = ({ service, serviceData, extendedDetails, primaryColor, viewContext }) => {
  const { t } = useTranslation();
  const { bookService } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  const handleBooking = (date: BookingDate) => {
    
  }

  // Determinar si es un servicio premium
  const isPremium =
    service.packageType.includes('premium') || viewContext === 'premium-view';

  // Manejar la navegación de la galería
  const navigateGallery = (direction: number) => {
    const newIndex = currentGalleryIndex + direction;
    if (newIndex >= 0 && newIndex < decorationGallery.length) {
      setCurrentGalleryIndex(newIndex);
    }
  };

  // Variantes de animación
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className='space-y-12'>
      {/* Hero Section con Galería Interactiva */}
      <motion.div
        className='relative h-[500px] rounded-2xl overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        {/* Imagen principal con overlay */}
        <Image
          src={decorationGallery[currentGalleryIndex].src}
          alt={decorationGallery[currentGalleryIndex].alt}
          fill
          className='object-cover'
          priority
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            isPremium
              ? 'from-amber-900/80 to-amber-700/50'
              : 'from-blue-900/80 to-blue-700/50'
          }`}
        ></div>

        {/* Navegación de galería */}
        <div className='absolute inset-0 flex items-center justify-between px-4 z-10'>
          <button
            onClick={() => navigateGallery(-1)}
            disabled={currentGalleryIndex === 0}
            className={`h-12 w-12 rounded-full flex items-center justify-center ${
              currentGalleryIndex === 0
                ? 'bg-gray-700/30 text-gray-400 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            } transition-all duration-300`}
          >
            <ChevronLeft className='h-6 w-6' />
          </button>

          <button
            onClick={() => navigateGallery(1)}
            disabled={currentGalleryIndex === decorationGallery.length - 1}
            className={`h-12 w-12 rounded-full flex items-center justify-center ${
              currentGalleryIndex === decorationGallery.length - 1
                ? 'bg-gray-700/30 text-gray-400 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            } transition-all duration-300`}
          >
            <ChevronRight className='h-6 w-6' />
          </button>
        </div>

        {/* Contenido Hero */}
        <div className='absolute bottom-0 left-0 right-0 p-8 z-10'>
          <div className='max-w-3xl'>
            {isPremium && (
              <span className='inline-block px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold uppercase rounded-full mb-4'>
                Premium Experience
              </span>
            )}

            <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
              {serviceData?.titleKey
                ? t(serviceData.titleKey)
                : 'Custom Decoration Services'}
            </h1>

            <p className='text-xl text-white/90 mb-6'>
              {serviceData?.descriptionKey
                ? t(serviceData.descriptionKey)
                : 'Transform your space into something extraordinary for your special occasion'}
            </p>

            <div className='flex flex-wrap gap-3'>
              <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center px-6 py-3 ${
                  isPremium
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } rounded-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105`}
              >
                Book Now
                <ArrowRight className='ml-2 h-5 w-5' />
              </button>
            </div>
          </div>
        </div>

        {/* Indicadores de Galería */}
        <div className='absolute bottom-6 right-6 flex space-x-2 z-10'>
          {decorationGallery.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGalleryIndex(index)}
              className={`h-2 w-${
                index === currentGalleryIndex ? '10' : '6'
              } rounded-full transition-all duration-300 ${
                index === currentGalleryIndex ? 'bg-white' : 'bg-white/30'
              }`}
              aria-label={`Go to image ${index + 1}`}
            ></button>
          ))}
        </div>
      </motion.div>

      {/* Celebration Occasions Section */}
      <motion.div
        id='celebration-occasions'
        className='bg-white rounded-xl shadow-lg overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
            <PartyPopper
              className={`mr-2 text-${primaryColor}-500`}
              size={22}
            />
            Select Your Celebration Occasion
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[
              {
                id: 'birthday',
                name: 'Birthday Celebration',
                icon: <PartyPopper size={24} />,
                description:
                  'Make their special day unforgettable with balloons, banners, and personalized decorations.',
              },
              {
                id: 'anniversary',
                name: 'Anniversary',
                icon: <Heart size={24} />,
                description:
                  'Celebrate your love story with romantic settings and meaningful decorative elements.',
              },
              {
                id: 'proposal',
                name: 'Proposal Setup',
                icon: <Sparkles size={24} />,
                description:
                  'Create the perfect romantic environment for your surprise proposal moment.',
              },
              {
                id: 'wedding',
                name: 'Wedding Celebration',
                icon: <Heart size={24} />,
                description:
                  'Elegant decorations for intimate wedding receptions and celebrations.',
              },
              {
                id: 'babyShower',
                name: 'Baby Shower',
                icon: <Heart size={24} />,
                description:
                  'Sweet and charming decorations to welcome the newest family member.',
              },
              {
                id: 'graduation',
                name: 'Graduation Party',
                icon: <Bookmark size={24} />,
                description:
                  'Celebrate academic achievements with themed decorations and photo opportunities.',
              },
              {
                id: 'holiday',
                name: 'Holiday Celebration',
                icon: <Sparkles size={24} />,
                description:
                  'Festive decorations for Christmas, New Year, Halloween, and other holidays.',
              },
              {
                id: 'corporate',
                name: 'Corporate Event',
                icon: <Briefcase size={24} />,
                description:
                  'Professional and elegant setups for business meetings and corporate events.',
              },
              {
                id: 'custom',
                name: 'Custom Occasion',
                icon: <Palette size={24} />,
                description:
                  'Have something specific in mind? We will work with you to create your vision.',
              },
            ].map((occasion) => (
              <div
                key={occasion.id}
                // className={`border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 ${
                //   selectedOccasion === occasion.id
                //     ? `border-${primaryColor}-500 bg-${primaryColor}-50 shadow-md`
                //     : 'border-gray-200 hover:border-gray-300'
                // }`}
                // onClick={() => setSelectedOccasion(occasion.id)}
              >
                <div className='p-5 cursor-pointer flex flex-col h-full'>
                  <div className='flex items-start'>
                    <div
                      className={`p-2 rounded-full ${
                        isPremium
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      } mr-3`}
                    >
                      {occasion.icon}
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-medium text-gray-900'>
                        {occasion.name}
                      </h3>
                    </div>
                    {/* <div
                      className={`h-5 w-5 rounded-full border ${
                        selectedOccasion === occasion.id
                          ? isPremium
                            ? 'bg-amber-500 border-amber-500'
                            : 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      } flex items-center justify-center`}
                    >
                      {selectedOccasion === occasion.id && (
                        <Check className='h-3 w-3 text-white' />
                      )}
                    </div> */}
                  </div>

                  <p className='text-gray-600 text-sm mt-2'>
                    {occasion.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gallery Grid - Galería de inspiración */}
      <motion.div initial='hidden' animate='visible' variants={fadeIn}>
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
            <Camera className={`mr-2 text-${primaryColor}-500`} size={22} />
            Inspiration Gallery
          </h2>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {decorationGallery.map((image, index) => (
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
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4'>
                  <div>
                    <p className='text-white font-medium mb-1'>
                      {image.category.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <div className='flex flex-wrap gap-1'>
                      {image.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className='text-xs bg-white/20 px-2 py-1 rounded-full text-white backdrop-blur-sm'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        className={`rounded-xl overflow-hidden ${
          isPremium
            ? 'bg-gradient-to-r from-amber-600 to-amber-800'
            : 'bg-gradient-to-r from-blue-600 to-blue-800'
        }`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className='p-10 md:p-16 text-white text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Create Your Perfect Celebration
          </h2>
          <p className='text-xl opacity-90 mb-8 max-w-2xl mx-auto'>
            {isPremium
              ? 'Our premium decoration services bring your vision to life with exclusive materials and personalized design.'
              : 'Transform any space into an unforgettable setting with our custom decoration services.'}
          </p>
          <div className='flex flex-wrap gap-4 justify-center'>
            <button
              onClick={() => setIsModalOpen(true)}
              className={`py-3 px-8 bg-white flex items-center font-medium rounded-lg ${
                isPremium
                  ? 'text-amber-700 hover:bg-amber-50'
                  : 'text-blue-700 hover:bg-blue-50'
              } transition-colors duration-300`}
            >
              Book Your Decoration
              <ArrowRight className='ml-2 h-5 w-5' />
            </button>

            <button
              onClick={() =>
                document
                  .getElementById('celebration-occasions')
                  .scrollIntoView({ behavior: 'smooth' })
              }
              className='py-3 px-8 border border-white/30 backdrop-blur-sm hover:bg-white/10 text-white rounded-lg font-medium transition-colors duration-300'
            >
              Explore Options
              <ChevronRight className='ml-2 h-5 w-5 inline' />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Features Grid - Ventajas del servicio */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-3 gap-6'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
      >
        <div className={`p-6 hover:shadow-md transition-shadow`}>
          <div
            className={`w-12 h-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mb-4`}
          >
            <Palette className={`h-6 w-6 text-${primaryColor}-600`} />
          </div>
          <h3 className='text-lg font-semibold mb-2'>Personalized Designs</h3>
          <p className='text-gray-600'>
            Every decoration is uniquely designed to match your vision and
            preferences for the occasion.
          </p>
        </div>

        <div className={`p-6 hover:shadow-md transition-shadow`}>
          <div
            className={`w-12 h-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mb-4`}
          >
            <Sparkles className={`h-6 w-6 text-${primaryColor}-600`} />
          </div>
          <h3 className='text-lg font-semibold mb-2'>Premium Materials</h3>
          <p className='text-gray-600'>
            We use only high-quality decorative elements that create stunning
            visual impact for your events.
          </p>
        </div>

        <div className={`p-6 hover:shadow-md transition-shadow`}>
          <div
            className={`w-12 h-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mb-4`}
          >
            <PartyPopper className={`h-6 w-6 text-${primaryColor}-600`} />
          </div>
          <h3 className='text-lg font-semibold mb-2'>Full-Service Setup</h3>
          <p className='text-gray-600'>
            Our team handles everything from design to installation and removal,
            leaving you free to enjoy.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomDecorationsServiceView;
