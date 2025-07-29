import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Car,
  Clock,
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  ArrowRight,
  Shield,
  AlertTriangle,
  Plane,
  Repeat,
  Check,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BookingDate } from '@/types/type';
import BookingModal from '../../modal/BookingModal';

interface AirportServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
}

const AirportServiceView: React.FC<AirportServiceViewProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookService } = useBooking();

  // Determinar si es servicio premium
  const isPremium = service.packageType.includes('premium');

  // Extraer propiedades relevantes
  const tagline = extendedDetails?.tagline || 'Start Your Vacation Stress-Free';
  const travelTime =
    extendedDetails?.travelTime ||
    serviceData?.metaData?.travelTime ||
    '20-40 min';

  // Extraer incluye/no incluye si existen
  const includes = extendedDetails?.includes || [
    'Professional, experienced driver',
    'Air-conditioned modern vehicle',
    'Flight tracking service',
    'Meet & greet at arrivals',
  ];

  const notIncluded = extendedDetails?.notIncluded || [
    'Gratuity (optional, appreciated)',
  ];

  // Extraer opciones de viaje (ida o ida y vuelta) si existen
  let tripOptions = {};
  if (serviceData?.options?.isRoundTrip?.subOptions) {
    tripOptions = serviceData.options.isRoundTrip.subOptions;
  } else {
    // Valores por defecto si no existen
    tripOptions = {
      oneWay: {
        nameKey: 'services.airport.options.isRoundTrip.options.oneWay',
        price: 0,
      },
      roundTrip: {
        nameKey: 'services.airport.options.isRoundTrip.options.roundTrip',
        price: 'double',
      },
    };
  }

  // Imágenes para la galería (usar las que estén disponibles o placeholders)
  const galleryImages = extendedDetails?.gallery?.images || [
    {
      src: 'https://www.teletrans.cl/wp-content/uploads/2019/09/taxi-ejecutivo.jpg',
      alt: 'Luxury airport transfer',
      caption: 'Premium private transportation to and from the airport',
    },
    {
      src: 'https://images.pexels.com/photos/13861/IMG_3496bfree.jpg?_gl=1*1xzu124*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTM3OTg1NjgkbzgkZzEkdDE3NTM4MDEzNTYkajUwJGwwJGgw',
      alt: 'Modern SUV',
      caption: 'Comfortable, air-conditioned modern vehicles',
    },
    {
      src: 'https://images.unsplash.com/photo-1577435213005-1acb8929ad3e?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3',
      alt: 'Airport terminal',
      caption: 'Direct pickup at the airport for a seamless arrival experience',
    },
  ];

  // Extraer detalles adicionales
  const hasFlightTracking = serviceData?.metaData?.flightTracking !== false;
  const hasChildSeats = serviceData?.metaData?.childSeats !== false;

  // Manejar la confirmación de reserva
  const handleBookingConfirm = (
    bookingService: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(bookingService, dates, guests);
    setIsModalOpen(false);
  };

  // Características destacadas
  const features = [
    {
      icon: <Clock />,
      title: 'Efficient Service',
      description: `${travelTime} typical travel time`,
    },
    {
      icon: <Plane />,
      title: 'Flight Monitoring',
      description: 'We track your flight for on-time pickup',
    },
    {
      icon: isPremium ? <Users /> : <Car />,
      title: isPremium ? 'VIP Experience' : 'Modern Vehicles',
      description: isPremium
        ? 'Personalized luxury service'
        : 'Clean, comfortable transportation',
    },
  ];

  function formatTripOptionName(key: string): string {
    if (key === 'oneWay') return 'One Way';
    if (key === 'roundTrip') return 'Round Trip';
    return key.replace(/([A-Z])/g, ' $1').trim();
  }

  return (
    <div className='space-y-16'>
      {/* Hero section con llamado a la acción */}
      <div className='w-full relative overflow-hidden my-6 sm:my-8 lg:my-12'>
        <div className='absolute inset-0 z-0'>
          <img
            src={service.img || galleryImages[0].src}
            alt={service.name}
            className='absolute inset-0 w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-gray-900/95 to-gray-900/70'></div>

          {/* Overlay adicional para mejor contraste */}
          <div className='absolute inset-0 bg-black/10 z-[1]' />
        </div>

        <div className='relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 xl:py-24'>
          <div className='max-w-4xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='space-y-4 sm:space-y-6 lg:space-y-8'
            >
              {isPremium && (
                <span className='inline-block px-3 py-1 sm:px-4 sm:py-2 bg-amber-400 text-amber-900 text-xs sm:text-sm font-bold uppercase rounded-full'>
                  Premium Service
                </span>
              )}

              <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight'>
                {tagline}
              </h1>

              <p className='text-base sm:text-lg lg:text-xl text-gray-300'>
                Seamless transportation to and from the airport
              </p>

              <p className='text-sm sm:text-base lg:text-lg text-white/80 max-w-3xl leading-relaxed'>
                {serviceData?.fullDescriptionKey
                  ? t(serviceData.fullDescriptionKey)
                  : 'Skip the taxi lines and begin your vacation right away with our private airport transfer service. Your personal driver will be waiting, ready to welcome you with comfort and efficiency.'}
              </p>

              <div className='pt-2 sm:pt-4'>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 ${
                    isPremium
                      ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } rounded-lg font-bold text-sm sm:text-base lg:text-lg shadow-lg transform transition-all duration-300 hover:scale-105`}
                >
                  <span>Book Now</span>
                  <ArrowRight className='ml-2 h-4 w-4 sm:h-5 sm:w-5' />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trip options section */}
      <div
        className={`rounded-xl ${
          isPremium
            ? 'bg-gradient-to-br from-amber-50 to-amber-100/30'
            : 'bg-gradient-to-br from-blue-50 to-blue-100/30'
        } p-8 md:p-10`}
      >
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8'>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='text-3xl font-bold text-gray-900 mb-2'
            >
              Trip Options
            </motion.h2>
            <p className='text-gray-600'>
              Choose a one-way or round-trip transfer for maximum convenience
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`px-5 py-3 ${
              isPremium
                ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } rounded-lg font-medium shadow-md transition-colors duration-300 whitespace-nowrap`}
          >
            Book Now
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {Object.entries(tripOptions).map(([key, option], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'
            >
              <div
                className={`w-2 ${isPremium ? 'bg-amber-500' : 'bg-blue-500'}`}
              ></div>
              <div className='flex items-center p-6 w-full'>
                <div
                  className={`p-3 rounded-full mr-4 ${
                    isPremium
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  } flex-shrink-0`}
                >
                  {key === 'oneWay' ? <ArrowRight /> : <Repeat />}
                </div>

                <div className='flex-grow'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {typeof option === 'object' && 'nameKey' in option
                      ? t(option.nameKey, {
                          fallback: formatTripOptionName(key),
                        })
                      : formatTripOptionName(key)}
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    {key === 'oneWay'
                      ? 'One-way transfer to or from the airport'
                      : 'Return transfers included, for arrival and departure'}
                  </p>
                </div>

                <div className='flex-shrink-0 ml-4'>
                  {typeof option === 'object' && 'price' in option && (
                    <div className='text-right'>
                      {option.price === 'double' ? (
                        <span className='text-sm font-medium text-gray-500'>
                          2x base price
                        </span>
                      ) : option.price > 0 ? (
                        <span
                          className={`text-sm font-medium text-${primaryColor}-600`}
                        >
                          +${option.price}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gallery section - stylish design */}
      <div className='px-6 py-8'>
        <div className='flex items-center justify-between mb-8 '>
          <h2 className='text-3xl font-bold text-gray-900'>
            Our Service Gallery
          </h2>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${
                index === 0
                  ? 'col-span-3 md:col-span-2 h-80'
                  : 'col-span-3 md:col-span-1 h-64'
              } rounded-xl overflow-hidden group`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className='object-cover transition-transform duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
                <p className='p-6 text-white font-medium'>{image.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Traveler tips section */}
      <div
        className={`rounded-xl px-6 py-8 ${
          isPremium
            ? 'bg-amber-50 border border-amber-100'
            : 'bg-blue-50 border border-blue-100'
        } p-8`}
      >
        <div className='flex items-center mb-6'>
          <AlertTriangle
            className={`h-6 w-6 ${
              isPremium ? 'text-amber-500' : 'text-blue-500'
            } mr-3`}
          />
          <h2 className='text-2xl font-bold text-gray-900'>Traveler Tips</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-lg p-5 shadow-sm'>
            <Calendar
              className={`h-5 w-5 ${
                isPremium ? 'text-amber-500' : 'text-blue-500'
              } mb-3`}
            />
            <h3 className='font-semibold text-gray-800 mb-2'>
              Book in Advance
            </h3>
            <p className='text-gray-600 text-sm'>
              Reserve your transfer at least 24 hours before your flight for the
              best experience
            </p>
          </div>

          <div className='bg-white rounded-lg p-5 shadow-sm'>
            <MapPin
              className={`h-5 w-5 ${
                isPremium ? 'text-amber-500' : 'text-blue-500'
              } mb-3`}
            />
            <h3 className='font-semibold text-gray-800 mb-2'>
              Provide Complete Details
            </h3>
            <p className='text-gray-600 text-sm'>
              Include your flight number, arrival/departure time, and
              accommodation address
            </p>
          </div>

          <div className='bg-white rounded-lg p-5 shadow-sm'>
            <Clock
              className={`h-5 w-5 ${
                isPremium ? 'text-amber-500' : 'text-blue-500'
              } mb-3`}
            />
            <h3 className='font-semibold text-gray-800 mb-2'>
              Allow Buffer Time
            </h3>
            <p className='text-gray-600 text-sm'>
              For departures, schedule your pickup with ample time before your
              flight
            </p>
          </div>
        </div>
      </div>

      {/* Service features section */}
      <div className='grid grid-cols-1 px-6 py-8 lg:grid-cols-2 gap-10'>
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-3xl font-bold text-gray-900 mb-6'
          >
            Service Features
          </motion.h2>

          <div className='space-y-6'>
            <div className='flex items-start'>
              <div
                className={`p-2 rounded-full ${
                  isPremium
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                } mr-4 flex-shrink-0 mt-1`}
              >
                <CheckCircle className='h-5 w-5' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-1'>
                  Meet & Greet Service
                </h3>
                <p className='text-gray-600'>
                  Your driver will wait for you at the arrivals area with a
                  personalized sign
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <div
                className={`p-2 rounded-full ${
                  isPremium
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                } mr-4 flex-shrink-0 mt-1`}
              >
                <CheckCircle className='h-5 w-5' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-1'>
                  Door-to-Door Service
                </h3>
                <p className='text-gray-600'>
                  Direct transportation to your accommodation without additional
                  stops
                </p>
              </div>
            </div>

            {hasFlightTracking && (
              <div className='flex items-start'>
                <div
                  className={`p-2 rounded-full ${
                    isPremium
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  } mr-4 flex-shrink-0 mt-1`}
                >
                  <CheckCircle className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Flight Tracking
                  </h3>
                  <p className='text-gray-600'>
                    We monitor your flight to adjust pickup time in case of
                    delays
                  </p>
                </div>
              </div>
            )}

            {hasChildSeats && (
              <div className='flex items-start'>
                <div
                  className={`p-2 rounded-full ${
                    isPremium
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  } mr-4 flex-shrink-0 mt-1`}
                >
                  <CheckCircle className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Child Seats Available
                  </h3>
                  <p className='text-gray-600'>
                    Safety seats for children available upon request
                  </p>
                </div>
              </div>
            )}

            {isPremium && (
              <div className='flex items-start'>
                <div className='p-2 rounded-full bg-amber-100 text-amber-700 mr-4 flex-shrink-0 mt-1'>
                  <CheckCircle className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Premium Refreshments
                  </h3>
                  <p className='text-gray-600'>
                    Complimentary water and refreshments during your journey
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-3xl font-bold text-gray-900 mb-6'
          >
            What is Included
          </motion.h2>

          <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
            <ul className='space-y-3'>
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
                    } mr-3 flex-shrink-0 mt-1.5`}
                  >
                    <Check className='h-3 w-3 text-white' />
                  </div>
                  <span className='text-gray-700'>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {notIncluded.length > 0 && (
            <div className='bg-gray-50 rounded-xl p-6 border border-gray-200'>
              <h3 className='font-semibold text-gray-800 mb-3'>Not Included</h3>

              <ul className='space-y-2'>
                {notIncluded.map((item, index) => (
                  <li key={index} className='flex items-start text-gray-600'>
                    <span className='mr-2'>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Final booking call-to-action */}
      <div className='bg-gray-900  overflow-hidden'>
        <div className='p-8 md:p-12'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
            <div>
              <h2 className='text-3xl font-bold text-white mb-3'>
                Ready to Book Your Airport Transfer?
              </h2>
              <p className='text-gray-300 max-w-2xl mb-6 md:mb-0'>
                Secure your hassle-free transportation now and start your
                vacation the moment you land
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className={`px-8 py-4 ${
                isPremium
                  ? 'bg-amber-500 hover:bg-amber-600 text-amber-900'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } rounded-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 whitespace-nowrap`}
            >
              Book Your Transfer
              <ArrowRight className='inline-block ml-2 h-5 w-5' />
            </button>
          </div>
        </div>
      </div>

      {/* Key features section */}
      <div className='grid grid-cols-1 px-6 py-8 md:grid-cols-3 gap-6'>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ${
              isPremium ? 'hover:border-amber-200' : 'hover:border-blue-200'
            }`}
          >
            <div
              className={`p-3 rounded-full inline-flex ${
                isPremium
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-blue-100 text-blue-600'
              } mb-4`}
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

      {/* Disclaimer */}
      {(extendedDetails?.disclaimer || serviceData?.disclaimer) && (
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
                Important Information
              </h4>
              <p className='text-gray-600'>
                {extendedDetails?.disclaimer ||
                  t(serviceData?.disclaimer || '', {
                    fallback:
                      'Please provide accurate flight details and contact information to ensure a smooth pickup process. Changes or cancellations should be made at least 24 hours in advance.',
                  })}
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

export default AirportServiceView;
