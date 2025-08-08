import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
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
  Star,
  Phone,
  MessageCircle,
  PlayCircle,
  ChevronRight,
  Zap,
  Heart,
  Award,
  Globe,
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
  const [activeStep, setActiveStep] = useState(0);
  const { bookService } = useBooking();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Determinar si es servicio premium
  const isPremium = service.packageType.includes('premium');

  // Extraer propiedades relevantes
  const tagline = extendedDetails?.tagline || 'Your Journey Starts Here';
  const travelTime =
    extendedDetails?.travelTime ||
    serviceData?.metaData?.travelTime ||
    '20-40 min';

  // Incluye/no incluye
  const includes = extendedDetails?.includes || [
    'Professional, experienced driver',
    'Air-conditioned modern vehicle',
    'Flight tracking service',
    'Meet & greet at arrivals',
  ];

  const notIncluded = extendedDetails?.notIncluded || [
    'Gratuity (optional, appreciated)',
  ];

  // Trip options
  let tripOptions = {};
  if (serviceData?.options?.isRoundTrip?.subOptions) {
    tripOptions = serviceData.options.isRoundTrip.subOptions;
  } else {
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

  // Galería ampliada con más variedad
  const galleryImages = extendedDetails?.gallery?.images || [
    {
      src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070',
      alt: 'Professional chauffeur',
      caption: 'Meet your professional driver',
      category: 'driver',
    },
    {
      src: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070',
      alt: 'Luxury vehicle interior',
      caption: 'Premium comfort during your ride',
      category: 'vehicle',
    },
    {
      src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074',
      alt: 'Airport terminal',
      caption: 'Seamless airport pickup',
      category: 'airport',
    },
    {
      src: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2070',
      alt: 'Happy travelers',
      caption: 'Satisfied customers arrive stress-free',
      category: 'customers',
    },
  ];

  // Detalles adicionales
  const hasFlightTracking = serviceData?.metaData?.flightTracking !== false;
  const hasChildSeats = serviceData?.metaData?.childSeats !== false;

  // Testimonios
  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York',
      rating: 5,
      text: 'Absolutely flawless service! My driver was waiting exactly where promised, and the ride was so comfortable. Worth every penny.',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Michael Chen',
      location: 'San Francisco',
      rating: 5,
      text: 'Professional, punctual, and pristine vehicles. This is how airport transfers should be done. Highly recommend!',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Emma Rodriguez',
      location: 'Miami',
      rating: 5,
      text: 'The flight tracking feature saved my trip! My flight was delayed but my driver adjusted automatically. Amazing service.',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
  ];

  // Proceso paso a paso
  const steps = [
    {
      icon: <Calendar className='w-8 h-8' />,
      title: 'Book Online',
      description: 'Reserve in just 2 minutes with instant confirmation',
    },
    {
      icon: <Plane className='w-8 h-8' />,
      title: 'We Track Your Flight',
      description: 'Our system monitors your flight automatically',
    },
    {
      icon: <Users className='w-8 h-8' />,
      title: 'Meet Your Driver',
      description: 'Professional chauffeur waiting with your name sign',
    },
    {
      icon: <Car className='w-8 h-8' />,
      title: 'Enjoy the Ride',
      description: 'Relax in comfort as we take care of everything',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Manejar confirmación de reserva
  const handleBookingConfirm = (
    bookingService: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(bookingService, dates, guests);
    setIsModalOpen(false);
  };

  function formatTripOptionName(key: string): string {
    if (key === 'oneWay') return 'One Way';
    if (key === 'roundTrip') return 'Round Trip';
    return key.replace(/([A-Z])/g, ' $1').trim();
  }

  // Auto-play para el proceso
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative bg-white overflow-hidden'>
      {/* Hero Section - Más cinematográfico */}
      <div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        {/* Background Video Effect */}
        <motion.div style={{ y }} className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-gray-900/90 z-10' />
          <img
            src={service.img || galleryImages[0].src}
            alt={service.name}
            className='w-full h-full object-cover scale-110'
          />
          {/* Animated overlay */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 animate-pulse z-5' />
        </motion.div>

        {/* Floating particles effect */}
        <div className='absolute inset-0 z-5'>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className='absolute w-2 h-2 bg-white/20 rounded-full'
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeOut',
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: '100%',
              }}
            />
          ))}
        </div>

        <div className='relative z-20 container mx-auto px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className='max-w-5xl mx-auto'
          >
            {isPremium && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className='inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-amber-900 rounded-full font-bold text-sm uppercase tracking-wider mb-8 shadow-2xl'
              >
                <Award className='w-4 h-4' />
                <span>Premium Experience</span>
                <Star className='w-4 h-4 fill-current' />
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className='text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight'
            >
              <span className='block'>
                {tagline.split(' ').slice(0, -1).join(' ')}
              </span>
              <span
                className={`block ${
                  isPremium ? 'text-amber-400' : 'text-blue-400'
                } italic`}
              >
                {tagline.split(' ').slice(-1)}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className='text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'
            >
              Experience seamless, luxury transportation that transforms your
              journey into an unforgettable beginning
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6'
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className={`group relative px-8 py-4 bg-gradient-to-r ${
                  isPremium
                    ? 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-900'
                    : 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
                } rounded-2xl font-bold text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 overflow-hidden`}
              >
                <span className='relative z-10 flex items-center'>
                  Book Your Transfer
                  <ArrowRight className='ml-2 w-5 h-5 transition-transform group-hover:translate-x-1' />
                </span>
                <div className='absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300' />
              </button>

              <button className='group flex items-center text-white hover:text-gray-300 transition-colors'>
                <PlayCircle className='w-12 h-12 mr-3 group-hover:scale-110 transition-transform' />
                <span className='font-medium'>Watch How It Works</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className='mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto'
            >
              <div className='text-center'>
                <div
                  className={`text-3xl font-bold ${
                    isPremium ? 'text-amber-400' : 'text-blue-400'
                  }`}
                >
                  50K+
                </div>
                <div className='text-gray-300 text-sm'>Happy Travelers</div>
              </div>
              <div className='text-center'>
                <div
                  className={`text-3xl font-bold ${
                    isPremium ? 'text-amber-400' : 'text-blue-400'
                  }`}
                >
                  24/7
                </div>
                <div className='text-gray-300 text-sm'>Available Service</div>
              </div>
              <div className='text-center'>
                <div
                  className={`text-3xl font-bold ${
                    isPremium ? 'text-amber-400' : 'text-blue-400'
                  }`}
                >
                  4.9★
                </div>
                <div className='text-gray-300 text-sm'>Average Rating</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator mejorado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20'
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className='flex flex-col items-center text-white/70'
          >
            <span className='text-sm mb-2'>Scroll to explore</span>
            <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className='w-1 h-3 bg-white/60 rounded-full mt-2'
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* How It Works - Proceso interactivo */}
      <div className='py-20 bg-gradient-to-br from-gray-50 to-blue-50/30'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              How It{' '}
              <span className={isPremium ? 'text-amber-500' : 'text-blue-500'}>
                Works
              </span>
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Four simple steps to your perfect airport transfer experience
            </p>
          </motion.div>

          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative text-center p-6 rounded-3xl transition-all duration-500 cursor-pointer ${
                    activeStep === index
                      ? `${
                          isPremium
                            ? 'bg-amber-100 border-2 border-amber-300'
                            : 'bg-blue-100 border-2 border-blue-300'
                        } transform scale-105`
                      : 'bg-white border-2 border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      activeStep === index
                        ? `${
                            isPremium
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`
                        : 'bg-gray-100 text-gray-600'
                    } transition-all duration-300`}
                  >
                    {step.icon}
                  </div>
                  <h3 className='font-bold text-lg mb-2'>{step.title}</h3>
                  <p className='text-gray-600 text-sm leading-relaxed'>
                    {step.description}
                  </p>

                  {/* Step number */}
                  <div
                    className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      activeStep === index
                        ? `${
                            isPremium
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className='flex justify-center'>
              <div className='flex space-x-2'>
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full transition-all duration-300 ${
                      activeStep === index
                        ? `${isPremium ? 'bg-amber-500' : 'bg-blue-500'}`
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Options - Más visual e interactivo */}
      <div className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              Choose Your{' '}
              <span className={isPremium ? 'text-amber-500' : 'text-blue-500'}>
                Journey
              </span>
            </h2>
            <p className='text-xl text-gray-600'>
              Flexible options designed around your travel needs
            </p>
          </motion.div>

          <div className='max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {Object.entries(tripOptions).map(([key, option], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className='group relative overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500' />
                <div className='relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-gray-200'>
                  {/* Icon and pricing */}
                  <div className='flex items-start justify-between mb-6'>
                    <div
                      className={`p-4 rounded-2xl ${
                        isPremium
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-blue-100 text-blue-600'
                      } group-hover:scale-110 transition-transform duration-300`}
                    >
                      {key === 'oneWay' ? (
                        <ArrowRight className='w-8 h-8' />
                      ) : (
                        <Repeat className='w-8 h-8' />
                      )}
                    </div>

                    {typeof option === 'object' && 'price' in option && (
                      <div className='text-right'>
                        {option.price === 'double' ? (
                          <div className='flex items-center space-x-2'>
                            <span className='text-sm text-gray-500'>
                              Price:
                            </span>
                            <span className='text-2xl font-bold text-gray-900'>
                              2x
                            </span>
                          </div>
                        ) : option.price > 0 ? (
                          <div className='flex items-center space-x-2'>
                            <span className='text-sm text-gray-500'>From:</span>
                            <span
                              className={`text-2xl font-bold text-${primaryColor}-600`}
                            >
                              +${option.price}
                            </span>
                          </div>
                        ) : (
                          <div className='flex items-center space-x-2'>
                            <span className='text-sm text-gray-500'>
                              Starting at:
                            </span>
                            <span className='text-2xl font-bold text-green-600'>
                              Base Rate
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                    {typeof option === 'object' && 'nameKey' in option
                      ? t(option.nameKey, {
                          fallback: formatTripOptionName(key),
                        })
                      : formatTripOptionName(key)}
                  </h3>

                  <p className='text-gray-600 mb-6 leading-relaxed'>
                    {key === 'oneWay'
                      ? 'Perfect for one-way trips. Whether arriving or departing, we ensure you reach your destination comfortably and on time.'
                      : 'Complete round-trip service. From arrival to departure, we handle both legs of your journey with consistent excellence.'}
                  </p>

                  {/* Features list */}
                  <ul className='space-y-2 mb-6'>
                    {(key === 'oneWay'
                      ? [
                          'Professional meet & greet',
                          'Flight tracking included',
                          'Door-to-door service',
                        ]
                      : [
                          'Two-way transfers',
                          'Consistent driver when possible',
                          'Priority booking',
                          'Best value option',
                        ]
                    ).map((feature, idx) => (
                      <li
                        key={idx}
                        className='flex items-center text-sm text-gray-600'
                      >
                        <Check
                          className={`w-4 h-4 mr-2 ${
                            isPremium ? 'text-amber-500' : 'text-blue-500'
                          }`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      isPremium
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } transform hover:scale-105`}
                  >
                    Select This Option
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Reimaginada - Más inmersiva */}
      <div
        className={`py-20 ${
          isPremium
            ? 'bg-gradient-to-br from-amber-50 to-orange-50'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50'
        }`}
      >
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              See the{' '}
              <span className={isPremium ? 'text-amber-500' : 'text-blue-500'}>
                Difference
              </span>
            </h2>
            <p className='text-xl text-gray-600'>
              Real moments from real journeys with our service
            </p>
          </motion.div>

          {/* Gallery grid con efectos más avanzados */}
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative group cursor-pointer ${
                    index === 0
                      ? 'col-span-2 row-span-2'
                      : index === 3
                      ? 'col-span-2'
                      : ''
                  }`}
                >
                  <div className='relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500'>
                    <div
                      className={`aspect-square ${
                        index === 0
                          ? 'aspect-square md:aspect-[2/1]'
                          : index === 3
                          ? 'aspect-[2/1]'
                          : ''
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className='object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110'
                      />
                    </div>

                    {/* Overlay con información */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500' />

                    <div className='absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500'>
                      <h4 className='font-bold text-lg mb-2'>
                        {image.caption}
                      </h4>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          isPremium
                            ? 'bg-amber-500/20 text-amber-200'
                            : 'bg-blue-500/20 text-blue-200'
                        }`}
                      >
                        {image.category}
                      </span>
                    </div>

                    {/* Hover icon */}
                    <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                      <div
                        className={`p-2 rounded-full ${
                          isPremium ? 'bg-amber-500' : 'bg-blue-500'
                        } text-white`}
                      >
                        <PlayCircle className='w-5 h-5' />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials - Nueva sección */}
      <div className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              What Travelers{' '}
              <span className={isPremium ? 'text-amber-500' : 'text-blue-500'}>
                Say
              </span>
            </h2>
            <p className='text-xl text-gray-600'>
              Real experiences from thousands of satisfied customers
            </p>
          </motion.div>

          <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className='relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100'
              >
                {/* Quote icon */}
                <div
                  className={`absolute -top-4 left-8 w-8 h-8 ${
                    isPremium ? 'bg-amber-500' : 'bg-blue-500'
                  } rounded-full flex items-center justify-center`}
                >
                  <span className='text-white font-bold text-lg'>"</span>
                </div>

                {/* Stars */}
                <div className='flex space-x-1 mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        isPremium ? 'text-amber-400' : 'text-blue-400'
                      } fill-current`}
                    />
                  ))}
                </div>

                <p className='text-gray-700 mb-6 leading-relaxed italic'>
                  "{testimonial.text}"
                </p>

                <div className='flex items-center'>
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className='w-12 h-12 rounded-full mr-4 object-cover'
                  />
                  <div>
                    <h4 className='font-bold text-gray-900'>
                      {testimonial.name}
                    </h4>
                    <p className='text-gray-500 text-sm'>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Features - Rediseñado con iconos más grandes */}
      <div className='py-20 bg-gray-900'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
              Why Choose{' '}
              <span className={isPremium ? 'text-amber-400' : 'text-blue-400'}>
                Our Service
              </span>
            </h2>
            <p className='text-xl text-gray-300'>
              Premium features that make all the difference
            </p>
          </motion.div>

          <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                icon: <Zap className='w-12 h-12' />,
                title: 'Instant Confirmation',
                description:
                  'Book and receive confirmation within seconds, 24/7',
              },
              {
                icon: <Heart className='w-12 h-12' />,
                title: 'Personal Touch',
                description:
                  'Every journey tailored to your specific needs and preferences',
              },
              {
                icon: <Shield className='w-12 h-12' />,
                title: '100% Reliable',
                description:
                  'Guaranteed on-time service with real-time flight tracking',
              },
              {
                icon: <Globe className='w-12 h-12' />,
                title: 'Global Coverage',
                description:
                  'Available in major airports worldwide with local expertise',
              },
              {
                icon: <Award className='w-12 h-12' />,
                title: 'Premium Fleet',
                description:
                  'Luxury vehicles maintained to the highest standards',
              },
              {
                icon: <Users className='w-12 h-12' />,
                title: 'Professional Drivers',
                description: 'Vetted, trained, and professional chauffeurs',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='group text-center p-8 rounded-3xl bg-gray-800 hover:bg-gray-700 transition-all duration-500 hover:transform hover:-translate-y-2'
              >
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${
                    isPremium
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-blue-500/20 text-blue-400'
                  } group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className='text-xl font-bold text-white mb-4'>
                  {feature.title}
                </h3>
                <p className='text-gray-300 leading-relaxed'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Incluido/No Incluido - Más visual */}
      <div className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className='text-3xl font-bold text-gray-900 mb-8 flex items-center'>
                <CheckCircle
                  className={`w-8 h-8 mr-3 ${
                    isPremium ? 'text-amber-500' : 'text-blue-500'
                  }`}
                />
                What's Included
              </h3>

              <div className='space-y-4'>
                {includes.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className='flex items-start group'
                  >
                    <div
                      className={`p-2 rounded-full ${
                        isPremium ? 'bg-amber-500' : 'bg-blue-500'
                      } mr-4 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Check className='w-4 h-4 text-white' />
                    </div>
                    <span className='text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition-colors'>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className='text-3xl font-bold text-gray-900 mb-8 flex items-center'>
                <AlertTriangle className='w-8 h-8 mr-3 text-gray-400' />
                Not Included
              </h3>

              <div className='space-y-4'>
                {notIncluded.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className='flex items-start'
                  >
                    <div className='p-2 rounded-full bg-gray-300 mr-4 flex-shrink-0 mt-1'>
                      <span className='w-4 h-4 flex items-center justify-center text-white text-xs font-bold'>
                        ×
                      </span>
                    </div>
                    <span className='text-gray-600 text-lg leading-relaxed'>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Quick booking CTA */}
              <div className='mt-8 p-6 bg-gray-50 rounded-2xl'>
                <h4 className='font-bold text-gray-900 mb-2'>Ready to book?</h4>
                <p className='text-gray-600 mb-4 text-sm'>
                  Get instant confirmation and join thousands of satisfied
                  travelers.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`w-full py-3 rounded-xl font-semibold ${
                    isPremium
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } transition-colors`}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Multiple CTAs */}
      <div className='py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden'>
        {/* Background pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className='relative z-10 container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className='text-4xl md:text-6xl font-bold text-white mb-6'>
                Your Perfect Transfer
                <span
                  className={`block ${
                    isPremium ? 'text-amber-400' : 'text-blue-400'
                  }`}
                >
                  Awaits You
                </span>
              </h2>

              <p className='text-xl text-gray-300 mb-12 max-w-2xl mx-auto'>
                Join over 50,000 travelers who chose excellence. Book now and
                experience the difference.
              </p>

              <div className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6'>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`group px-10 py-5 bg-gradient-to-r ${
                    isPremium
                      ? 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-900'
                      : 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
                  } rounded-2xl font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-105`}
                >
                  <span className='flex items-center'>
                    Book Your Transfer
                    <ArrowRight className='ml-3 w-6 h-6 transition-transform group-hover:translate-x-1' />
                  </span>
                </button>

                <div className='flex items-center space-x-4'>
                  <button className='flex items-center text-white hover:text-gray-300 transition-colors'>
                    <Phone className='w-5 h-5 mr-2' />
                    <span>Call Us</span>
                  </button>
                  <span className='text-gray-500'>|</span>
                  <button className='flex items-center text-white hover:text-gray-300 transition-colors'>
                    <MessageCircle className='w-5 h-5 mr-2' />
                    <span>Live Chat</span>
                  </button>
                </div>
              </div>

              {/* Trust indicators */}
              <div className='mt-12 flex items-center justify-center space-x-8 text-gray-400 text-sm'>
                <div className='flex items-center'>
                  <Shield className='w-4 h-4 mr-2' />
                  <span>Secure Booking</span>
                </div>
                <div className='flex items-center'>
                  <Zap className='w-4 h-4 mr-2' />
                  <span>Instant Confirmation</span>
                </div>
                <div className='flex items-center'>
                  <Heart className='w-4 h-4 mr-2' />
                  <span>24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      {(extendedDetails?.disclaimer || serviceData?.disclaimer) && (
        <div className='py-12 bg-gray-50'>
          <div className='container mx-auto px-4'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg border border-gray-100'
            >
              <div className='flex'>
                <Shield className='flex-shrink-0 w-8 h-8 text-gray-400 mr-4 mt-1' />
                <div>
                  <h4 className='font-bold text-gray-800 mb-4 text-xl'>
                    Important Information
                  </h4>
                  <p className='text-gray-600 leading-relaxed text-lg'>
                    {extendedDetails?.disclaimer ||
                      t(serviceData?.disclaimer || '', {
                        fallback:
                          'Please provide accurate flight details and contact information to ensure a smooth pickup process. Changes or cancellations should be made at least 24 hours in advance.',
                      })}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
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
