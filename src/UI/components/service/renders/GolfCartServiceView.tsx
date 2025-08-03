import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Users,
  Clock,
  Battery,
  MapPin,
  Star,
  Shield,
  CheckCircle,
  Phone,
  Calendar,
  ArrowRight,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Zap,
  Navigation,
  CreditCard,
  AlertCircle,
  Fuel,
  Award,
  Heart,
  Camera,
  Route,
  Sun,
  Anchor,
  Crown,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { BookingDate } from '@/types/type';
import BookingModal from '@/UI/components/modal/BookingModal';

// Types
interface GolfCartOption {
  id: string;
  name: string;
  spanishName: string;
  seats: number;
  price: number;
  priceUnit: 'day' | 'hour';
  description: string;
  spanishDescription: string;
  image: string;
  features: string[];
  spanishFeatures: string[];
  isPopular: boolean;
  gradient: string;
}

interface GolfCartRentalServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

// Real data based on your PDF
const GOLF_CART_OPTIONS: GolfCartOption[] = [
  {
    id: '4-seater',
    name: '4-Seater Cart',
    spanishName: 'Carrito de 4 Plazas',
    seats: 4,
    price: 45,
    priceUnit: 'day',
    description:
      'Perfect for couples or small families. Compact and efficient for resort exploration.',
    spanishDescription:
      'Perfecto para parejas o familias pequeñas. Compacto y eficiente para explorar el resort.',
    image:
      'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=800&h=600&fit=crop',
    features: [
      'Fully charged battery',
      'Free delivery & pickup',
      '24/7 support included',
      'Safety equipment',
      'Quick orientation',
    ],
    spanishFeatures: [
      'Batería completamente cargada',
      'Entrega y recogida gratis',
      'Soporte 24/7 incluido',
      'Equipo de seguridad',
      'Orientación rápida',
    ],
    isPopular: false,
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    id: '6-seater',
    name: '6-Seater Cart',
    spanishName: 'Carrito de 6 Plazas',
    seats: 6,
    price: 65,
    priceUnit: 'day',
    description:
      'Ideal for larger groups and families. More space and comfort for extended exploration.',
    spanishDescription:
      'Ideal para grupos grandes y familias. Más espacio y comodidad para exploración extendida.',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    features: [
      'Fully charged battery',
      'Free delivery & pickup',
      '24/7 support included',
      'Safety equipment',
      'Quick orientation',
      'Extra storage space',
    ],
    spanishFeatures: [
      'Batería completamente cargada',
      'Entrega y recogida gratis',
      'Soporte 24/7 incluido',
      'Equipo de seguridad',
      'Orientación rápida',
      'Espacio extra de almacenamiento',
    ],
    isPopular: true,
    gradient: 'from-emerald-600 to-teal-600',
  },
];

// Video Hero Component
const VideoHero: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const content = {
    en: {
      badge: 'PREMIUM MOBILITY',
      title: 'Move Freely',
      subtitle: 'Explore Comfortably',
      description:
        'Cruise your resort, villa community, or local beach town with our fully charged, comfortable golf carts. Perfect for getting around quickly and easily.',
      cta: 'Explore Options',
      stats: [
        { number: '2', label: 'Cart Options' },
        { number: '24/7', label: 'Support' },
        { number: 'Free', label: 'Delivery' },
      ],
    },
    es: {
      badge: 'MOVILIDAD PREMIUM',
      title: 'Muévete Libremente',
      subtitle: 'Explora con Comodidad',
      description:
        'Recorre tu resort, comunidad o zona de playa con nuestros carritos de golf cómodos y completamente cargados. Perfectos para moverte fácil y rápidamente.',
      cta: 'Explorar Opciones',
      stats: [
        { number: '2', label: 'Opciones' },
        { number: '24/7', label: 'Soporte' },
        { number: 'Gratis', label: 'Entrega' },
      ],
    },
  };

  const currentContent = content[language];

  return (
    <div className='relative h-screen overflow-hidden'>
      {/* Video Background */}
      <video
        ref={videoRef}
        className='absolute inset-0 w-full h-full object-cover'
        loop
        muted={isMuted}
        playsInline
        poster='https://images.pexels.com/photos/9207203/pexels-photo-9207203.jpeg?_gl=1*u4cath*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQyMjU5NDckbzE0JGcxJHQxNzU0MjI2MDMxJGo0OCRsMCRoMA..'
      >
        <source
          src='https://cdn.coverr.co/videos/coverr-golf-cart-on-tropical-resort-4563/1080p.mp4'
          type='video/mp4'
        />
        <img
          src='https://images.pexels.com/photos/9207176/pexels-photo-9207176.jpeg?_gl=1*1b9egi*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQyMjU5NDckbzE0JGcxJHQxNzU0MjI1OTcwJGozNyRsMCRoMA..'
          alt='Golf cart rental'
          className='w-full h-full object-cover'
        />
      </video>

      {/* Video Controls */}
      <div className='absolute top-6 right-6 flex gap-2 z-20'>
        <button
          onClick={togglePlay}
          className='w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/20 text-white'
        >
          {isPlaying ? (
            <Pause className='w-5 h-5' />
          ) : (
            <Play className='w-5 h-5' />
          )}
        </button>
        <button
          onClick={toggleMute}
          className='w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/20 text-white'
        >
          {isMuted ? (
            <VolumeX className='w-5 h-5' />
          ) : (
            <Volume2 className='w-5 h-5' />
          )}
        </button>
      </div>

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-cyan-900/60' />

      {/* Hero Content */}
      <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
        <div className='max-w-5xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8'
          >
            <Car className='w-5 h-5 mr-3 text-cyan-300' />
            <span className='font-semibold text-lg'>
              {currentContent.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className='text-6xl md:text-7xl font-bold mb-6 leading-tight'
          >
            {currentContent.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className='text-2xl md:text-3xl text-white/90 mb-4 font-light'
          >
            {currentContent.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className='text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed'
          >
            {currentContent.description}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            onClick={onBookClick}
            className='bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto transition-all duration-300 hover:scale-105 shadow-2xl'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentContent.cta}
            <ArrowRight className='w-6 h-6' />
          </motion.button>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className='grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto'
          >
            {currentContent.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className='text-center'
              >
                <div className='text-3xl font-bold text-cyan-400'>
                  {stat.number}
                </div>
                <div className='text-sm text-gray-300 uppercase tracking-wider'>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Golf Cart Option Card
const GolfCartCard: React.FC<{
  cart: GolfCartOption;
  isSelected: boolean;
  onSelect: () => void;
  language: 'en' | 'es';
}> = ({ cart, isSelected, onSelect, language }) => {
  const [isHovered, setIsHovered] = useState(false);

  const displayName = language === 'es' ? cart.spanishName : cart.name;
  const displayDescription =
    language === 'es' ? cart.spanishDescription : cart.description;
  const displayFeatures =
    language === 'es' ? cart.spanishFeatures : cart.features;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden cursor-pointer border-2 ${
        isSelected
          ? 'border-blue-500 ring-4 ring-blue-500/20'
          : 'border-gray-100'
      }`}
      onClick={onSelect}
    >
      {/* Popular Badge */}
      {cart.isPopular && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className='absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 z-10'
        >
          <Crown className='w-4 h-4' />
          <span>{language === 'es' ? 'Más Popular' : 'Most Popular'}</span>
        </motion.div>
      )}

      {/* Image Container */}
      <div className='relative h-72 overflow-hidden'>
        <motion.img
          src={cart.image}
          alt={displayName}
          className='w-full h-full object-cover'
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.7 }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />

        {/* Quick Stats Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className='absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white border border-white/20'
        >
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Users className='w-4 h-4' />
              <span className='text-sm font-medium'>
                {cart.seats} {language === 'es' ? 'asientos' : 'seats'}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Battery className='w-4 h-4' />
              <span className='text-sm font-medium'>
                {language === 'es' ? 'Cargado' : 'Charged'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'
          >
            <CheckCircle className='w-5 h-5 text-white' />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className='p-6'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h3 className='text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors'>
              {displayName}
            </h3>
            <p className='text-gray-500 text-sm font-medium'>
              {cart.seats} {language === 'es' ? 'pasajeros' : 'passengers'} •{' '}
              {language === 'es' ? 'Eléctrico' : 'Electric'}
            </p>
          </div>
          <div className='text-right'>
            <div className='text-3xl font-bold text-gray-900'>
              ${cart.price}
            </div>
            <div className='text-sm text-gray-500'>
              {language === 'es' ? 'por día' : 'per day'}
            </div>
          </div>
        </div>

        <p className='text-gray-600 mb-6'>{displayDescription}</p>

        {/* Features */}
        <div className='space-y-3 mb-6'>
          {displayFeatures.slice(0, 4).map((feature, index) => (
            <div
              key={index}
              className='flex items-center gap-3 text-sm text-gray-600'
            >
              <div className='w-5 h-5 bg-green-100 rounded-full flex items-center justify-center'>
                <CheckCircle className='w-3 h-3 text-green-600' />
              </div>
              <span>{feature}</span>
            </div>
          ))}
          {displayFeatures.length > 4 && (
            <div className='text-sm text-blue-600 font-medium'>
              +{displayFeatures.length - 4}{' '}
              {language === 'es' ? 'más características' : 'more features'}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
            isSelected
              ? `bg-gradient-to-r ${cart.gradient} text-white shadow-lg`
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>
            {isSelected
              ? language === 'es'
                ? 'Seleccionado'
                : 'Selected'
              : language === 'es'
              ? 'Seleccionar'
              : 'Select'}
          </span>
          {!isSelected && <ArrowRight className='w-5 h-5' />}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Process Section
const ProcessSection: React.FC<{ language: 'en' | 'es' }> = ({ language }) => {
  const content = {
    en: {
      title: 'How It Works',
      subtitle: 'Simple process, maximum convenience',
      steps: [
        {
          number: '01',
          title: 'We Deliver',
          description: 'Your golf cart delivered to your location',
          icon: <Car className='w-8 h-8' />,
        },
        {
          number: '02',
          title: 'Quick Orientation',
          description: 'Safety overview and driving instructions',
          icon: <Shield className='w-8 h-8' />,
        },
        {
          number: '03',
          title: 'Explore & Enjoy',
          description: 'Drive and explore your surroundings freely',
          icon: <Route className='w-8 h-8' />,
        },
        {
          number: '04',
          title: 'We Pick Up',
          description: 'Scheduled pickup at your convenience',
          icon: <Clock className='w-8 h-8' />,
        },
      ],
    },
    es: {
      title: 'Cómo Funciona',
      subtitle: 'Proceso simple, máxima conveniencia',
      steps: [
        {
          number: '01',
          title: 'Entregamos',
          description: 'Tu carrito entregado en tu ubicación',
          icon: <Car className='w-8 h-8' />,
        },
        {
          number: '02',
          title: 'Orientación Rápida',
          description: 'Consejos de seguridad e instrucciones',
          icon: <Shield className='w-8 h-8' />,
        },
        {
          number: '03',
          title: 'Explora y Disfruta',
          description: 'Conduce y explora libremente',
          icon: <Route className='w-8 h-8' />,
        },
        {
          number: '04',
          title: 'Recogemos',
          description: 'Recogida programada cuando gustes',
          icon: <Clock className='w-8 h-8' />,
        },
      ],
    },
  };

  const currentContent = content[language];

  return (
    <section className='py-20 bg-gradient-to-br from-blue-50 to-cyan-50'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            {currentContent.title}
          </h2>
          <p className='text-xl text-gray-600'>{currentContent.subtitle}</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {currentContent.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className='text-center'
            >
              <div className='relative mb-6'>
                <div className='w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 text-blue-600'>
                  {step.icon}
                </div>
                <div className='absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                  {step.number}
                </div>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                {step.title}
              </h3>
              <p className='text-gray-600'>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Info Section
const InfoSection: React.FC<{ language: 'en' | 'es' }> = ({ language }) => {
  const content = {
    en: {
      title: 'Good to Know',
      requirements: {
        title: 'Driver Requirements',
        items: [
          'Must be 18+ years old',
          "Valid driver's license required",
          'Basic driving experience recommended',
        ],
      },
      rental: {
        title: 'Rental Duration',
        items: [
          'Flexible based on your itinerary',
          'Daily, weekly rates available',
          'Extended rentals welcome',
        ],
      },
      safety: {
        title: 'Safety First',
        items: [
          'Drive responsibly at all times',
          'Follow resort and local rules',
          'Speed limit compliance required',
        ],
      },
      delivery: {
        title: 'Delivery Zone',
        items: [
          'Available throughout Punta Cana',
          'Resort and villa deliveries',
          'Beach town coverage',
        ],
      },
    },
    es: {
      title: 'Información Útil',
      requirements: {
        title: 'Requisitos para Conducir',
        items: [
          'Mayor de 18 años',
          'Licencia de conducir válida',
          'Experiencia básica recomendada',
        ],
      },
      rental: {
        title: 'Duración del Alquiler',
        items: [
          'Flexible según tu itinerario',
          'Tarifas diarias y semanales',
          'Alquileres extendidos bienvenidos',
        ],
      },
      safety: {
        title: 'Seguridad Primero',
        items: [
          'Conduce responsablemente',
          'Sigue las reglas del resort',
          'Cumple los límites de velocidad',
        ],
      },
      delivery: {
        title: 'Zona de Entrega',
        items: [
          'Disponible en toda Punta Cana',
          'Entregas en resorts y villas',
          'Cobertura en pueblos costeros',
        ],
      },
    },
  };

  const currentContent = content[language];

  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            {currentContent.title}
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {Object.values(currentContent)
            .slice(1)
            .map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className='bg-gray-50 rounded-2xl p-6'
              >
                <h3 className='text-lg font-bold text-gray-900 mb-4'>
                  {section.title}
                </h3>
                <ul className='space-y-3'>
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className='flex items-start gap-3 text-sm text-gray-600'
                    >
                      <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mt-16 bg-amber-50 border-l-4 border-amber-400 rounded-2xl p-6'
        >
          <div className='flex items-start'>
            <AlertCircle className='w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0' />
            <div>
              <h3 className='font-bold text-amber-800 mb-2'>
                {language === 'es'
                  ? 'Descargo de Responsabilidad'
                  : 'Disclaimer'}
              </h3>
              <p className='text-amber-700 text-sm'>
                {language === 'es'
                  ? 'Conduce bajo tu propia responsabilidad. Sigue las reglas del resort o comunidad y respeta las normas de tránsito locales.'
                  : 'Drive at your own discretion. Please follow all community or resort rules and respect local driving laws.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Main Component
const GolfCartRentalServiceView: React.FC<GolfCartRentalServiceViewProps> = ({
  service,
  serviceData,
}) => {
  const { bookService } = useBooking();
  const [selectedCart, setSelectedCart] = useState<string>('6-seater');
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedCartData = GOLF_CART_OPTIONS.find(
    (cart) => cart.id === selectedCart
  );

  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  const handleBookingConfirm = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    bookService(service, dates, guests);
    setIsModalOpen(false);
  };

  const content = {
    en: {
      sectionTitle: 'Choose Your Golf Cart',
      sectionSubtitle: 'Select the perfect option for your group',
      ctaTitle: 'Ready to Explore?',
      ctaDescription:
        'Book your golf cart today and start exploring Punta Cana with complete freedom and comfort.',
      ctaButton: 'Book Now',
      ctaFeatures: 'Free delivery • 24/7 support • Fully charged',
    },
    es: {
      sectionTitle: 'Elige Tu Carrito de Golf',
      sectionSubtitle: 'Selecciona la opción perfecta para tu grupo',
      ctaTitle: '¿Listo para Explorar?',
      ctaDescription:
        'Reserva tu carrito de golf hoy y comienza a explorar Punta Cana con total libertad y comodidad.',
      ctaButton: 'Reservar Ahora',
      ctaFeatures: 'Entrega gratis • Soporte 24/7 • Completamente cargado',
    },
  };

  const currentContent = content[language];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Video Hero Section */}
      <VideoHero onBookClick={handleBookNow} />

      {/* Language Toggle for Sections */}
      <div className='sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex justify-center'>
            <div className='flex bg-gray-100 rounded-full p-1'>
              <button
                onClick={() => setLanguage('en')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  language === 'es'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Español
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className='max-w-7xl mx-auto px-6 py-16 space-y-20'>
        {/* Golf Cart Selection */}
        <section className='bg-white rounded-3xl p-10 shadow-xl'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-slate-800 mb-4'>
              {currentContent.sectionTitle}
            </h2>
            <p className='text-xl text-slate-600'>
              {currentContent.sectionSubtitle}
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {GOLF_CART_OPTIONS.map((cart) => (
              <GolfCartCard
                key={cart.id}
                cart={cart}
                isSelected={selectedCart === cart.id}
                onSelect={() => setSelectedCart(cart.id)}
                language={language}
              />
            ))}
          </div>
        </section>

        {/* Selected Cart Details */}
        {selectedCartData && (
          <motion.section
            layout
            className={`bg-gradient-to-r ${selectedCartData.gradient} rounded-3xl p-10 text-white shadow-2xl`}
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div>
                <h3 className='text-3xl font-bold mb-6'>
                  {language === 'es'
                    ? selectedCartData.spanishName
                    : selectedCartData.name}
                </h3>
                <p className='text-xl text-white/90 mb-8 leading-relaxed'>
                  {language === 'es'
                    ? selectedCartData.spanishDescription
                    : selectedCartData.description}
                </p>

                <div className='flex items-center gap-8 mb-8'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold'>
                      ${selectedCartData.price}
                    </div>
                    <div className='text-white/70'>
                      {language === 'es' ? 'por día' : 'per day'}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold'>
                      {selectedCartData.seats}
                    </div>
                    <div className='text-white/70'>
                      {language === 'es' ? 'asientos' : 'seats'}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold'>24/7</div>
                    <div className='text-white/70'>
                      {language === 'es' ? 'soporte' : 'support'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className='bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg'
                >
                  <Calendar className='w-5 h-5' />
                  {language === 'es' ? 'Reservar Ahora' : 'Book Now'}
                </button>
              </div>

              <div className='relative h-96 rounded-2xl overflow-hidden shadow-2xl'>
                <img
                  src={selectedCartData.image}
                  alt={
                    language === 'es'
                      ? selectedCartData.spanishName
                      : selectedCartData.name
                  }
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* Process Section */}
        <ProcessSection language={language} />

        {/* Info Section */}
        <InfoSection language={language} />

        {/* Call to Action */}
        <section className='relative overflow-hidden rounded-3xl h-96 shadow-2xl'>
          <img
            src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920'
            alt='Golf cart adventure'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-slate-900/80 to-blue-900/60' />

          <div className='absolute inset-0 flex items-center justify-center text-center text-white p-8'>
            <div className='max-w-3xl'>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className='text-5xl font-bold mb-6'
              >
                {currentContent.ctaTitle}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className='text-xl text-white/90 mb-8'
              >
                {currentContent.ctaDescription}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className='flex flex-col sm:flex-row gap-4 justify-center items-center'
              >
                <button
                  onClick={handleBookNow}
                  className='bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 transition-all duration-300 hover:scale-105 shadow-2xl'
                >
                  <Car className='w-6 h-6' />
                  {currentContent.ctaButton}
                </button>
                <div className='text-white/80 text-sm'>
                  {currentContent.ctaFeatures}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBookingConfirm}
          service={service}
        />
      )}
    </div>
  );
};

export default GolfCartRentalServiceView;
