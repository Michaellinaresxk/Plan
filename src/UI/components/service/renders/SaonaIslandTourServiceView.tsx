import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MapPin,
  Users,
  Clock,
  Utensils,
  Camera,
  ArrowRight,
  Star,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Calendar,
  Sun,
  Fish,
  Waves,
  Anchor,
  AlertCircle,
  Heart,
  Award,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Palmtree,
  Compass,
  Sparkles,
  Car,
  ShoppingBag,
  Music,
  Timer,
  Sunset,
  CloudRain,
  AlertTriangle,
  Shirt,
  DollarSign,
  Camera as CameraIcon,
  Icon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import BookingModal from '../../modal/BookingModal';
import { BookingDate, Service } from '@/constants/formFields';
import { useTranslation } from '@/lib/i18n/client';
import { useBooking } from '@/context/BookingContext';

// Types
interface TourPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  includes: string[];
  maxGuests: number;
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
}

// ✅ Detailed itinerary data
interface ItineraryStep {
  time: string;
  title: string;
  description: string;
  icon: React.ElementType;
  duration?: string;
  highlights?: string[];
}

const ITINERARY_STEPS: ItineraryStep[] = [
  {
    time: '7:00 - 7:45 AM',
    title: 'Hotel Pickup',
    description:
      'Recogida en tu hotel o resort. Nuestro equipo te llevará al punto de encuentro principal.',
    icon: Car,
    duration: '30-45 min',
    highlights: ['Transporte cómodo', 'Guía local', 'Recogida puntual'],
  },
  {
    time: '8:00 - 8:30 AM',
    title: 'Meeting Point & Options',
    description:
      'Llegada al punto de encuentro donde puedes elegir transporte regular grupal o upgrade a transporte privado para llegar más rápido.',
    icon: MapPin,
    highlights: [
      'Opción de transporte privado',
      'Menos espera',
      'Llegada más rápida',
    ],
  },
  {
    time: '8:30 - 9:00 AM',
    title: 'Souvenir Stop',
    description:
      'Parada en tienda local para comprar souvenirs, usar el baño y prepararse para la aventura.',
    icon: ShoppingBag,
    duration: '15-20 min',
    highlights: [
      'Artesanías locales',
      'Servicios sanitarios',
      'Últimas compras',
    ],
  },
  {
    time: '9:30 - 11:00 AM',
    title: 'Catamaran Experience',
    description:
      'Viaje en catamarán con música, animación, bailarines y bebidas incluidas (refresco, hielo, ron). Los fotógrafos ofrecen servicios adicionales.',
    icon: Music,
    duration: '1.5 horas',
    highlights: [
      'Música y animación',
      'Bebidas incluidas',
      'Bailarines profesionales',
      'Fotógrafos (servicio adicional)',
    ],
  },
  {
    time: '11:00 - 11:15 AM',
    title: 'Natural Pool Stop',
    description:
      'Parada de 15 minutos en la famosa piscina natural con aguas cristalinas y estrellas de mar.',
    icon: Waves,
    duration: '15 min',
    highlights: ['Aguas cristalinas', 'Estrellas de mar', 'Fotos perfectas'],
  },
  {
    time: '11:30 AM - 3:00 PM',
    title: 'Saona Island Paradise',
    description:
      'Llegada a Isla Saona. Disfruta del buffet típico dominicano con bebidas, área de recreo con tumbonas en la playa.',
    icon: Palmtree,
    duration: '3.5 horas',
    highlights: [
      'Buffet dominicano',
      'Bebidas gaseosas, ron, agua',
      'Tumbonas en la playa',
      'Tiempo libre',
      'Servicios adicionales externos',
    ],
  },
  {
    time: '3:00 - 4:30 PM',
    title: 'Speedboat Return',
    description:
      'Regreso en lancha rápida (sin refrigerio) directamente al punto de partida.',
    icon: Anchor,
    duration: '1.5 horas',
    highlights: [
      'Viaje más rápido',
      'Vistas espectaculares',
      'Llegada directa',
    ],
  },
  {
    time: '5:00 - 6:00 PM',
    title: 'Return to Hotel',
    description:
      'Transporte de regreso a tu hotel o resort, llegada aproximada entre 5:00 y 6:00 PM.',
    icon: Sunset,
    duration: '30-60 min',
    highlights: [
      'Transporte incluido',
      'Llegada cómoda',
      'Día completo terminado',
    ],
  },
];

// What to bring items
const WHAT_TO_BRING = [
  {
    icon: Car,
    title: 'Toalla',
    description: 'Para secarte después de nadar',
  },
  {
    icon: '',
    title: 'Chanclas',
    description: 'Calzado cómodo para la playa',
  },
  {
    icon: Sun,
    title: 'Gafas de Sol',
    description: 'Protección esencial del sol caribeño',
  },
  {
    icon: DollarSign,
    title: 'Efectivo',
    description: 'Para souvenirs, propinas y servicios adicionales',
  },
  {
    icon: CameraIcon,
    title: 'Cámara',
    description: 'Para capturar momentos inolvidables',
  },
  {
    icon: Shirt,
    title: 'Protector Solar',
    description: 'SPF 30+ recomendado',
  },
];

// Simple gallery data
const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946732/WhatsApp_Image_2021-08-11_at_10.08.08_PM_1_r8bxkd.jpg',
    alt: 'Playa Isla Saona',
    title: 'Playa de Arena Blanca',
  },
  {
    id: 2,
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946716/playa_isla_saona_wti2ri.jpg',
    alt: 'Piscina Natural',
    title: 'Piscina Natural',
  },
  {
    id: 3,
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946768/Saona_island_rvgcvb.jpg',
    alt: 'Estrellas de Mar',
    title: 'Estrellas de Mar',
  },
  {
    id: 4,
    src: 'https://puntacanaexcursions.online/wp-content/uploads/2024/09/saona-island-2-scaled.jpg',
    alt: 'Lancha',
    title: 'Transporte Marítimo',
  },
];

// Single standard tour package
const tourPackage: TourPackage = {
  id: 'classic',
  name: 'Excursión Isla Saona',
  price: 55,
  duration: '8-9 horas',
  includes: [
    'Transporte desde tu hotel',
    'Paseo en catamaran y lancha rápida',
    'Almuerzo buffet típico dominicano',
    'Parada en piscina natural',
    'Guía local experimentado',
    'Tiempo libre en la playa',
    'Bebidas incluidas (refresco, ron, agua)',
    'Animación y música',
  ],
  maxGuests: 15,
};

// Simple Video Hero
const IslandHero: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

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

  return (
    <div className='relative h-screen w-full overflow-hidden'>
      {/* Video Background */}
      <video
        ref={videoRef}
        className='absolute inset-0 w-full h-full object-cover'
        loop
        muted={isMuted}
        playsInline
        poster='https://res.cloudinary.com/ddg92xar5/image/upload/v1755946732/WhatsApp_Image_2021-08-11_at_10.08.08_PM_1_r8bxkd.jpg'
      >
        <source
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1755946763/WhatsApp_Image_2021-08-11_at_10.08.09_PM_2_bx0kcz.jpg'
          type='video/mp4'
        />
      </video>

      {/* Simple Video Controls */}
      <div className='absolute top-4 right-4 flex gap-2'>
        <button
          onClick={togglePlay}
          className='w-10 h-10 bg-black/30 rounded-lg flex items-center justify-center hover:bg-black/50 transition-colors text-white'
        >
          {isPlaying ? (
            <Pause className='w-5 h-5' />
          ) : (
            <Play className='w-5 h-5' />
          )}
        </button>
        <button
          onClick={toggleMute}
          className='w-10 h-10 bg-black/30 rounded-lg flex items-center justify-center hover:bg-black/50 transition-colors text-white'
        >
          {isMuted ? (
            <VolumeX className='w-5 h-5' />
          ) : (
            <Volume2 className='w-5 h-5' />
          )}
        </button>
      </div>

      {/* Natural Overlay */}
      <div className='absolute inset-0 bg-black/30' />

      {/* Hero Content - Natural and Simple */}
      <div className='absolute inset-0 flex items-end text-center text-white p-4'>
        <div className='w-full'>
          {/* Simple Location Badge */}
          <div className='inline-flex items-center bg-white/20 px-4 py-2 rounded-full mb-6'>
            <MapPin className='w-4 h-4 mr-2' />
            <span className='font-medium'>Saona Tour</span>
          </div>

          {/* Natural Title - Appropriate Size */}
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight'>
            Isla Saona
          </h1>

          {/* Simple Subtitle */}
          <p className='text-lg sm:text-xl md:text-2xl text-white/90 mb-4 font-light'>
            Excursión de Un Día
          </p>

          {/* Natural Description */}
          <p className='text-sm sm:text-base md:text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed'>
            Disfruta de un día completo en una de las islas más hermosas del
            Caribe. Playa, naturaleza y cultura dominicana en una sola
            excursión.
          </p>

          {/* Pricing info */}
          <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 inline-block'>
            <p className='text-white text-lg'>
              Desde{' '}
              <span className='text-3xl font-bold text-cyan-400'>$55</span>
              <span className='text-sm text-white/80 ml-1'>
                por persona + transporte
              </span>
            </p>
            <p className='text-xs text-white/70 mt-1'>
              Niños 0-4 años gratis • Máximo 15 personas
            </p>
          </div>

          {/* Simple CTA */}
          <button
            onClick={onBookClick}
            className='bg-cyan-600 hover:bg-cyan-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-3 mx-auto transition-all duration-300 shadow-lg'
          >
            <Anchor className='w-5 h-5' />
            Reservar Excursión
            <ArrowRight className='w-5 h-5' />
          </button>

          {/* Simple trust indicators */}
          <div className='flex flex-wrap justify-center items-center gap-4 mt-6 text-white/70 text-sm'>
            <div className='flex items-center gap-1'>
              <Star className='w-4 h-4 text-yellow-400 fill-current' />
              <span>4.8/5</span>
            </div>
            <span>•</span>
            <span>Más de 1,000 excursionistas</span>
            <span>•</span>
            <span>Guías profesionales</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ New Itinerary Section
const ItinerarySection: React.FC = () => {
  return (
    <section className='w-full py-12'>
      <div className='text-center mb-10'>
        <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-3'>
          Itinerario Completo
        </h2>
        <p className='text-slate-600'>
          Conoce paso a paso tu aventura en Isla Saona
        </p>
      </div>

      <div className='max-w-4xl mx-auto'>
        <div className='relative'>
          {/* Timeline line */}
          <div className='absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-blue-200'></div>

          {ITINERARY_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative flex items-start mb-8 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className='absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10'></div>

                {/* Content */}
                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    isEven ? 'md:pr-8' : 'md:pl-8'
                  }`}
                >
                  <div
                    className={`bg-white rounded-lg shadow-lg p-6 border border-blue-100 ${
                      !isEven ? 'md:text-right' : ''
                    }`}
                  >
                    <div
                      className={`flex items-center mb-3 ${
                        !isEven ? 'md:justify-end' : ''
                      }`}
                    >
                      <div
                        className={`w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ${
                          !isEven ? 'md:order-2 md:ml-3' : 'mr-3'
                        }`}
                      >
                        <Icon className='w-5 h-5 text-blue-600' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-800 text-lg'>
                          {step.title}
                        </h3>
                        <div className='flex items-center gap-2 text-sm text-blue-600'>
                          <Clock className='w-3 h-3' />
                          <span>{step.time}</span>
                          {step.duration && (
                            <>
                              <span>•</span>
                              <span>{step.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className='text-gray-600 mb-4 leading-relaxed'>
                      {step.description}
                    </p>

                    {step.highlights && (
                      <div className='space-y-1'>
                        {step.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center text-sm text-green-700 ${
                              !isEven ? 'md:justify-end' : ''
                            }`}
                          >
                            <Check className='w-3 h-3 mr-2 text-green-500 flex-shrink-0' />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ✅ What to Bring Section
const WhatToBringSection: React.FC = () => {
  return (
    <section className='w-full py-12 bg-blue-50'>
      <div className='text-center mb-10'>
        <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-3'>
          Qué Llevar
        </h2>
        <p className='text-slate-600'>
          Prepárate para el día perfecto en el paraíso
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto'>
        {WHAT_TO_BRING.map((item, index) => {
          return (
            <div
              key={index}
              className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'
            >
              {/* <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                <Icon className='w-6 h-6 text-blue-600' />
              </div> */}
              <h3 className='text-lg font-semibold text-slate-800 mb-2'>
                {item.title}
              </h3>
              <p className='text-slate-600 text-sm leading-relaxed'>
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto'>
        <div className='flex items-start'>
          <Sun className='w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5' />
          <div>
            <h4 className='font-medium text-yellow-800 mb-1'>
              Consejo Importante
            </h4>
            <p className='text-sm text-yellow-700'>
              Lleva ropa cómoda y traje de baño. El protector solar es esencial
              - ¡el sol caribeño es fuerte! No olvides efectivo para propinas y
              souvenirs locales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ✅ Weather Disclaimer Section
const WeatherDisclaimerSection: React.FC = () => {
  return (
    <section className='w-full py-8'>
      <div className='bg-slate-100 border border-slate-200 rounded-lg p-6'>
        <div className='flex items-start'>
          <div className='w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0'>
            <CloudRain className='w-6 h-6 text-slate-600' />
          </div>
          <div className='flex-1'>
            <h3 className='font-semibold text-slate-800 mb-3 text-lg flex items-center'>
              <AlertTriangle className='w-5 h-5 text-slate-600 mr-2' />
              Política de Cancelaciones por Clima
            </h3>
            <div className='space-y-3 text-slate-700'>
              <p className='leading-relaxed'>
                <strong>La excursión NO se cancela por lluvia.</strong> El
                Caribe tropical puede tener lluvias breves que no afectan la
                experiencia. Nuestros catamaranes y áreas de la isla están
                preparados para condiciones climáticas normales.
              </p>
              <p className='leading-relaxed'>
                La excursión únicamente se cancela en casos de{' '}
                <strong>condiciones climáticas extremas</strong>
                que representen un riesgo para la seguridad de los pasajeros,
                como:
              </p>
              <ul className='list-disc list-inside space-y-1 ml-4 text-sm'>
                <li>Tormentas tropicales o huracanes</li>
                <li>Condiciones marítimas peligrosas</li>
                <li>Alertas meteorológicas oficiales</li>
              </ul>
              <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <p className='text-blue-800 text-sm'>
                  <strong>Garantía:</strong> Si cancelamos por condiciones
                  extremas, te ofrecemos reembolso completo o cambio de fecha
                  sin costo adicional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Simple Gallery Component
const SimpleGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        (selectedImage - 1 + galleryImages.length) % galleryImages.length
      );
    }
  };

  return (
    <section className='w-full rounded-lg p-4 sm:p-6'>
      {/* Simple Header */}
      <div className='text-center mb-6'>
        <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-2'>
          Conoce la Isla
        </h2>
        <p className='text-slate-600'>Un vistazo a lo que vas a descubrir</p>
      </div>

      {/* Simple Grid - 4 columns */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
        {galleryImages.map((image, index) => (
          <div
            key={image.id}
            className='group relative overflow-hidden rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 aspect-square'
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            />

            {/* Simple overlay */}
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

            {/* Simple content */}
            <div className='absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
              <h3 className='font-medium text-sm'>{image.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Lightbox */}
      {selectedImage !== null && (
        <div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'>
          <button
            onClick={() => setSelectedImage(null)}
            className='absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors text-white'
          >
            <X className='w-5 h-5' />
          </button>

          <button
            onClick={prevImage}
            className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors text-white'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>

          <button
            onClick={nextImage}
            className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors text-white'
          >
            <ChevronRight className='w-5 h-5' />
          </button>

          <div className='relative max-w-4xl max-h-[80vh] w-full'>
            <img
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].alt}
              className='w-full h-full object-contain rounded-lg'
            />

            <div className='absolute bottom-0 left-0 right-0 bg-black/60 p-4 rounded-b-lg'>
              <h3 className='text-lg font-semibold text-white'>
                {galleryImages[selectedImage].title}
              </h3>
            </div>
          </div>

          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 px-3 py-1 rounded-full text-white text-sm'>
            {selectedImage + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  );
};

// Island Features - Natural Focus
const IslandExperience: React.FC = () => {
  const experiences = [
    {
      icon: Waves,
      title: 'Piscina Natural',
      description:
        'Aguas cristalinas de medio metro de profundidad con estrellas de mar',
    },
    {
      icon: Fish,
      title: 'Vida Marina',
      description:
        'Observa peces tropicales y estrellas de mar en su hábitat natural',
    },
    {
      icon: Utensils,
      title: 'Comida Criolla',
      description:
        'Almuerzo buffet con platos típicos dominicanos preparados localmente',
    },
    {
      icon: Palmtree,
      title: 'Playa Virgen',
      description: 'Kilómetros de playa de arena blanca rodeada de palmeras',
    },
  ];

  return (
    <section className='w-full'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-3'>
          Qué Vas a Vivir
        </h2>
        <p className='text-slate-600'>
          Una excursión auténtica por la naturaleza caribeña
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {experiences.map((exp, index) => {
          const Icon = exp.icon;
          return (
            <div
              key={index}
              className='bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'
            >
              <div className='w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4'>
                <Icon className='w-6 h-6 text-teal-600' />
              </div>
              <h3 className='text-lg font-semibold text-slate-800 mb-2'>
                {exp.title}
              </h3>
              <p className='text-slate-600 text-sm leading-relaxed'>
                {exp.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// Practical Information
const TourInformation: React.FC = () => {
  return (
    <section className='w-full bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6'>
      <div className='flex items-start gap-4'>
        <div className='w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0'>
          <AlertCircle className='w-5 h-5 text-blue-600' />
        </div>
        <div className='flex-1'>
          <h3 className='font-semibold text-blue-800 mb-3 text-lg'>
            Información Práctica
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-blue-700 text-sm'>
            <div className='space-y-2'>
              <p>• Recogida en hoteles: 7:00 AM - 7:45 AM</p>
              <p>• Regreso aproximado: 5:00 PM - 6:00 PM</p>
              <p>• Incluye almuerzo y bebidas</p>
              <p>• Máximo 15 personas por grupo</p>
            </div>
            <div className='space-y-2'>
              <p>• Edad mínima: Sin restricciones (bebés bienvenidos)</p>
              <p>• No apta para mayores de 75 años</p>
              <p>• Ropa cómoda y traje de baño recomendado</p>
              <p>• Actividad familiar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Special Banner Section
const SpecialBanner = ({ onBookClick }) => {
  return (
    <section className='relative py-32 overflow-hidden'>
      {/* Background Image with Parallax Effect */}
      <div className='absolute inset-0'>
        <img
          src='https://res.cloudinary.com/ddg92xar5/image/upload/v1755946736/saona_sky_ax2yol.jpg'
          alt='Saona Island experience'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent' />
      </div>

      {/* Content */}
      <div className='relative z-10 max-w-6xl mx-auto px-4'>
        <div className='max-w-2xl'>
          <div className='inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-cyan-400/30'>
            <Sparkles className='w-4 h-4 text-cyan-400' />
            <span className='text-cyan-200 text-sm font-medium'>
              Experiencia Premium
            </span>
          </div>

          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Crea Recuerdos Que
            <span className='block text-cyan-400'>Durarán Toda la Vida</span>
          </h2>

          <p className='text-lg text-white/90 mb-8'>
            Únete a más de 1,000 viajeros que han experimentado la magia de Isla
            Saona. Nuestros guías expertos y catamaranes cómodos aseguran una
            aventura segura e inolvidable para toda la familia.
          </p>

          <div className='flex flex-wrap gap-6 mb-8'>
            <div className='flex items-center gap-2 text-white'>
              <Heart className='w-5 h-5 text-red-400' />
              <span>Familiar</span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Shield className='w-5 h-5 text-green-400' />
              <span>100% Seguro</span>
            </div>
            <div className='flex items-center gap-2 text-white'>
              <Star className='w-5 h-5 text-amber-400' />
              <span>Mejor Valorado</span>
            </div>
          </div>

          <button
            onClick={onBookClick}
            className='bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl'
          >
            Reservar Ahora
          </button>
        </div>
      </div>
    </section>
  );
};

// Decoration Banners Section
const BannersSection: React.FC<{
  onBookClick: () => void;
}> = ({ onBookClick }) => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };
  const DECORATION_BANNERS = [
    {
      id: 'natural-pool',
      title: 'Piscina Natural',
      subtitle: 'Aguas cristalinas con estrellas de mar en su hábitat natural',
      image:
        'https://puntacanaexcursions.online/wp-content/uploads/2024/09/saaoaaa.jpeg',
    },
    {
      id: 'catamaran',
      title: 'Experiencia en Catamarán',
      subtitle: 'Música, animación y bebidas mientras navegas hacia el paraíso',
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946768/Saona_island_rvgcvb.jpg',
    },
    {
      id: 'beach-paradise',
      title: 'Paraíso Playero',
      subtitle: 'Tumbonas, buffet dominicano y tiempo libre en arena blanca',
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1755946763/WhatsApp_Image_2021-08-11_at_10.08.09_PM_2_bx0kcz.jpg',
    },
  ] as const;

  // Individual Banner Card
  const BannerCard: React.FC<{
    banner: (typeof DECORATION_BANNERS)[0];
    reverse: boolean;
    onBookClick: () => void;
  }> = ({ banner, reverse, onBookClick }) => (
    <motion.div
      className={`grid lg:grid-cols-2 gap-12 items-center ${
        reverse ? 'lg:grid-flow-col-dense' : ''
      }`}
    >
      {/* Image */}
      <div
        className={`relative h-96 rounded-2xl overflow-hidden ${
          reverse ? 'lg:col-start-2' : ''
        }`}
      >
        <img
          src={banner.image}
          alt={banner.title}
          className='w-full h-full object-cover'
        />
      </div>

      {/* Content */}
      <div
        className={`space-y-6 ${reverse ? 'lg:col-start-1 lg:text-right' : ''}`}
      >
        <h2 className='text-4xl md:text-5xl font-light text-stone-800'>
          {banner.title}
        </h2>
        <p className='text-xl text-stone-600 leading-relaxed'>
          {banner.subtitle}
        </p>
      </div>
    </motion.div>
  );

  return (
    <motion.section
      className='py-20 px-2'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={staggerChildren}
    >
      <div className='max-w-7xl mx-auto space-y-16'>
        {DECORATION_BANNERS.map((banner, index) => (
          <BannerCard
            key={banner.id}
            banner={banner}
            reverse={index % 2 === 1}
            onBookClick={onBookClick}
          />
        ))}
      </div>
    </motion.section>
  );
};

// Main Component - Natural Island Excursion
const SaonaIslandTourServiceView: React.FC = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { bookService } = useBooking();
  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  const handleBooking = useCallback(
    async (service: Service, dates: BookingDate, guests: number) => {
      try {
        setIsLoading(true);
        await bookService(service, dates, guests);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Booking failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [bookService]
  );

  return (
    <div className='min-h-screen w-full bg-slate-50'>
      {/* Island Hero Section */}
      <IslandHero onBookClick={handleBookNow} />

      {/* Main content - Full width responsive */}
      <div className='w-full px-2 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12 mx-auto'>
        {/* Compact Gallery */}
        <SimpleGallery />

        {/* Island Experience */}
        <IslandExperience />

        {/* ✅ What to Bring Section */}
        <WhatToBringSection />

        <BannersSection onBookClick={handleBookNow} />

        <SpecialBanner onBookClick={handleBookNow} />

        {/* ✅ New Itinerary Section */}
        <ItinerarySection />

        {/* Practical Information */}
        <TourInformation />

        {/* ✅ Weather Disclaimer */}
        <WeatherDisclaimerSection />
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleBooking}
            service={service}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SaonaIslandTourServiceView;
