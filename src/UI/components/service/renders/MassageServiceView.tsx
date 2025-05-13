// views/MassageServiceView.tsx

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Clock,
  MapPin,
  Users,
  Calendar,
  Check,
  Shield,
  Info,
  ChevronRight,
  ArrowRight,
  Play,
} from 'lucide-react';
import BookingModal from '@/UI/components/modal/BookingModal';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';

interface MassageServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
}

const MassageServiceView: React.FC<MassageServiceViewProps> = ({
  service,
  serviceData,
  extendedDetails,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookService } = useBooking();

  // Determinar si es servicio premium
  const isPremium = service.packageType.includes('premium');

  // Extraer propiedades relevantes
  const tagline = extendedDetails?.tagline || 'Rejuvenate Your Body & Mind';
  const slogan = extendedDetails?.slogan || 'EXPERIENCE TOTAL RELAXATION';

  // Extraer incluye/no incluye si existen
  const includes = extendedDetails?.includes || [
    'Professional licensed massage therapist',
    'Premium oils and lotions',
    'Relaxing music',
    'Aromatherapy options',
  ];

  const notIncluded = extendedDetails?.notIncluded || [
    'Gratuity (optional, appreciated)',
  ];

  // Extraer ubicaciones/lugares si existen
  const location =
    extendedDetails?.location || 'At your villa or accommodation';

  // Imágenes para la galería (usar las que estén disponibles o placeholders)
  const galleryImages = extendedDetails?.gallery?.images || [
    {
      src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      alt: 'Luxury massage treatment',
      caption:
        'Premium massage experience in the comfort of your accommodation',
    },
    {
      src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3',
      alt: 'Massage stones treatment',
      caption: 'Hot stone therapy for deeper muscle relaxation',
    },
    {
      src: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      alt: 'Premium massage oils',
      caption: 'Premium aromatherapy oils for enhanced wellbeing',
    },
  ];

  // Extraer técnicas de masaje
  const techniques = [
    {
      name: 'Swedish Massage',
      description:
        'Gentle pressure and flowing movements for deep relaxation and stress relief',
      icon: '🌊',
    },
    {
      name: 'Deep Tissue',
      description:
        'Intense pressure to release chronic tension in muscles and connective tissue',
      icon: '💪',
    },
    {
      name: 'Aromatherapy',
      description:
        'Essential oils combined with massage therapy to enhance overall wellbeing',
      icon: '🌿',
    },
    {
      name: 'Hot Stone',
      description:
        'Heated stones and gentle pressure to melt away tension and improve circulation',
      icon: '🔥',
    },
  ];

  // Beneficios principales
  const benefits = [
    'Reduces stress and anxiety',
    'Relieves muscle tension and pain',
    'Improves circulation',
    'Boosts immune system',
    'Enhances sleep quality',
    'Increases energy levels',
  ];

  // Manejar la apertura del modal de reserva
  const handleOpenBookingModal = () => {
    setIsModalOpen(true);
  };

  // Manejar la confirmación de reserva
  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  return (
    <div className='space-y-16'>
      {/* Hero section con llamado a la acción */}
      <div className='relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 to-black'>
        <div className='absolute inset-0 bg-opacity-60 z-0'>
          <div className='h-full w-full bg-gradient-to-t from-black to-transparent opacity-90'></div>
        </div>

        <div className='relative z-10 px-8 py-16 flex flex-col lg:flex-row items-center'>
          <div className='w-full lg:w-1/2 mb-10 lg:mb-0'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isPremium && (
                <span className='inline-block px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold uppercase rounded-full mb-4'>
                  Premium Experience
                </span>
              )}

              <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
                {tagline}
              </h1>

              <p className='text-lg text-gray-300 mb-6'>{slogan}</p>

              <p className='text-white/80 mb-8 max-w-xl'>
                {serviceData?.fullDescriptionKey
                  ? t(serviceData.fullDescriptionKey)
                  : 'Experience the ultimate in relaxation with our premium massage therapy. Our professional therapists bring the spa to you, delivering personalized treatments in the comfort of your accommodation.'}
              </p>

              <button
                onClick={handleOpenBookingModal}
                className={`flex items-center px-8 py-4 ${
                  isPremium
                    ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } rounded-full font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                Book Now
                <ArrowRight className='ml-2 h-5 w-5' />
              </button>
            </motion.div>
          </div>

          <div className='w-full lg:w-1/2 flex justify-center'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='relative h-64 w-64 md:h-96 md:w-96 rounded-full overflow-hidden border-8 border-white/10'
            >
              <Image
                src={service.img || galleryImages[0].src}
                alt={service.name}
                fill
                className='object-cover'
              />

              <div className='absolute inset-0 flex items-center justify-center'>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`h-16 w-16 rounded-full ${
                    isPremium ? 'bg-amber-500' : 'bg-blue-600'
                  } flex items-center justify-center cursor-pointer shadow-lg`}
                >
                  <Play className='h-6 w-6 text-white' />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Key features section - modern card design */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {[
          {
            icon: <Clock />,
            title: 'Duration Options',
            description: `${service.duration} hour session with extended options available`,
          },
          {
            icon: <MapPin />,
            title: 'Convenient Location',
            description: location || 'In-room service at your accommodation',
          },
          {
            icon: <Users />,
            title: 'Expert Therapists',
            description: isPremium
              ? 'Elite certified specialists'
              : 'Licensed massage professionals',
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 ${
              isPremium ? 'hover:border-amber-200' : 'hover:border-blue-200'
            } group`}
          >
            <div
              className={`p-4 rounded-full inline-flex ${
                isPremium
                  ? 'bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'
                  : 'bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white'
              } mb-4 transition-colors duration-300`}
            >
              {feature.icon}
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-2'>
              {feature.title}
            </h3>
            <p className='text-gray-600'>{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Gallery section - modern masonry */}
      <div>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-3xl font-bold text-gray-900'>
            Experience Gallery
          </h2>
          <button
            className={`text-${
              isPremium ? 'amber' : 'blue'
            }-600 flex items-center font-medium`}
          >
            View all photos
            <ChevronRight className='h-5 w-5 ml-1' />
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='md:col-span-7 relative h-96 rounded-2xl overflow-hidden group'
          >
            <Image
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
              <p className='p-6 text-white font-medium'>
                {galleryImages[0].caption}
              </p>
            </div>
          </motion.div>

          <div className='md:col-span-5 grid grid-rows-2 gap-4'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='relative h-44 rounded-2xl overflow-hidden group'
            >
              <Image
                src={galleryImages[1].src}
                alt={galleryImages[1].alt}
                fill
                className='object-cover transition-transform duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
                <p className='p-4 text-white font-medium text-sm'>
                  {galleryImages[1].caption}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='relative h-44 rounded-2xl overflow-hidden group'
            >
              <Image
                src={galleryImages[2].src}
                alt={galleryImages[2].alt}
                fill
                className='object-cover transition-transform duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
                <p className='p-4 text-white font-medium text-sm'>
                  {galleryImages[2].caption}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Massage techniques section - modern, luxury cards */}
      <div>
        <div className='text-center mb-12'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-3xl font-bold text-gray-900 mb-4'
          >
            Specialized Techniques
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='text-gray-600 max-w-2xl mx-auto'
          >
            Our therapists are trained in multiple massage modalities to provide
            a customized experience tailored to your needs
          </motion.p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {techniques.map((technique, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 bg-white rounded-xl border border-gray-100 ${
                isPremium ? 'hover:border-amber-200' : 'hover:border-blue-200'
              } hover:shadow-xl transition-all duration-300 flex items-start`}
            >
              <div className='text-4xl mr-4'>{technique.icon}</div>
              <div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  {technique.name}
                </h3>
                <p className='text-gray-600'>{technique.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits section - stylish design */}
      <div
        className={`rounded-2xl ${
          isPremium
            ? 'bg-gradient-to-r from-amber-50 to-amber-100/30'
            : 'bg-gradient-to-r from-blue-50 to-blue-100/30'
        } p-10`}
      >
        <div className='text-center mb-10'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-3xl font-bold text-gray-900 mb-4'
          >
            Health & Wellness Benefits
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '120px' }}
            transition={{ duration: 0.8 }}
            className={`h-1 ${
              isPremium ? 'bg-amber-500' : 'bg-blue-500'
            } mx-auto mb-6`}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className='flex items-start'
            >
              <div
                className={`rounded-full p-2 ${
                  isPremium
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-blue-100 text-blue-600'
                } mr-3 flex-shrink-0`}
              >
                <Check className='h-4 w-4' />
              </div>
              <p className='text-gray-700 font-medium'>{benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* What's included section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-3xl font-bold text-gray-900 mb-6'
          >
            What's Included
          </motion.h2>

          <ul className='space-y-4'>
            {includes.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className='flex items-start'
              >
                <div
                  className={`p-1 rounded-full ${
                    isPremium ? 'bg-amber-500' : 'bg-blue-500'
                  } mr-3 flex-shrink-0 mt-1`}
                >
                  <Check className='h-4 w-4 text-white' />
                </div>
                <span className='text-gray-700'>{item}</span>
              </motion.li>
            ))}
          </ul>

          {notIncluded.length > 0 && (
            <div className='mt-8'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Not Included
              </h3>

              <ul className='space-y-2'>
                {notIncluded.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                    className='flex items-start text-gray-600'
                  >
                    <span className='mr-3'>•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className={`rounded-xl ${
            isPremium ? 'bg-amber-50' : 'bg-blue-50'
          } p-8 lg:p-10`}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-2xl font-bold text-gray-900 mb-6 flex items-center'
          >
            <Info
              className={`mr-3 ${
                isPremium ? 'text-amber-500' : 'text-blue-500'
              }`}
            />
            Booking Information
          </motion.h2>

          <div className='space-y-6'>
            <div className='flex items-start'>
              <Calendar
                className={`h-5 w-5 ${
                  isPremium ? 'text-amber-500' : 'text-blue-500'
                } mr-3 mt-1 flex-shrink-0`}
              />
              <div>
                <h3 className='font-semibold text-gray-800'>Advance Booking</h3>
                <p className='text-gray-600'>
                  We recommend booking at least 24 hours in advance
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <Clock
                className={`h-5 w-5 ${
                  isPremium ? 'text-amber-500' : 'text-blue-500'
                } mr-3 mt-1 flex-shrink-0`}
              />
              <div>
                <h3 className='font-semibold text-gray-800'>
                  Appointment Length
                </h3>
                <p className='text-gray-600'>
                  Standard sessions are {service.duration} hour, with options to
                  extend
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <Users
                className={`h-5 w-5 ${
                  isPremium ? 'text-amber-500' : 'text-blue-500'
                } mr-3 mt-1 flex-shrink-0`}
              />
              <div>
                <h3 className='font-semibold text-gray-800'>
                  Multiple Sessions
                </h3>
                <p className='text-gray-600'>
                  Group bookings are available for couples or friends
                </p>
              </div>
            </div>

            <div className='mt-8'>
              <button
                onClick={handleOpenBookingModal}
                className={`w-full py-4 ${
                  isPremium
                    ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } rounded-xl font-bold shadow-md transform transition-all duration-300 hover:shadow-lg flex items-center justify-center`}
              >
                Book Your Session Now
                <ArrowRight className='ml-2 h-5 w-5' />
              </button>

              <p className='text-center mt-4 text-sm text-gray-500'>
                Flexible cancellation up to 24 hours before appointment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final disclaimer / important note */}
      {(extendedDetails?.disclaimer || extendedDetails?.finalMessage) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='rounded-xl bg-gray-50 p-6 border border-gray-200'
        >
          <div className='flex'>
            <Shield className='flex-shrink-0 h-6 w-6 text-gray-400 mr-3 mt-0.5' />
            <div>
              <h4 className='font-semibold text-gray-800 mb-2'>
                {extendedDetails?.disclaimer
                  ? 'Important Information'
                  : 'Final Note'}
              </h4>
              <p className='text-gray-600'>
                {extendedDetails?.disclaimer
                  ? extendedDetails.disclaimer
                  : extendedDetails?.finalMessage ||
                    'Please inform your therapist of any injuries, medical conditions, or preferences before your session begins to ensure a safe and customized experience.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Booking modal */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleBookingConfirm}
            service={service}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MassageServiceView;
