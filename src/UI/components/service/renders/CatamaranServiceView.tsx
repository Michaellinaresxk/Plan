import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Anchor,
  Ship,
  Users,
  Fish,
  Clock,
  Map,
  LifeBuoy,
  Utensils,
  Calendar,
  Sun,
  Camera,
  Wind,
  Droplets,
  ArrowRight,
  Star,
  CheckCircle,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

interface CatamaranServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const CatamaranServiceView: React.FC<CatamaranServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const { addService, selectedServices } = useBooking();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'faq'>(
    'overview'
  );

  // Verificar si el servicio ya está seleccionado
  const isSelected = selectedServices.some((s) => s.id === service.id);

  // Extraer datos específicos
  const isPrivate = service.id.includes('private');
  const isPremium = service.packageType.includes('premium');
  const capacity =
    serviceData?.metaData?.capacity ||
    (isPrivate ? '19 personas' : '40 personas');

  // Extraer lugares para visitar si están disponibles
  let destinations: string[] = [];
  if (serviceData?.metaData?.places) {
    const placesStr = serviceData.metaData.places.toString();
    destinations = Array.isArray(serviceData.metaData.places)
      ? serviceData.metaData.places
      : placesStr.split(',');
  }

  // Si no hay destinos definidos, usamos esta lista por defecto
  if (destinations.length === 0) {
    destinations = [
      'Isla Saona',
      'Arrecifes de coral',
      'Piscinas naturales',
      'Palmera torcida',
      'Bahía de las Águilas',
    ];
  }

  // Extraer opciones de bar abierto si están disponibles
  let drinkOptions: string[] = [];
  if (serviceData?.metaData?.openBarOptions) {
    const optionsStr = serviceData.metaData.openBarOptions.toString();
    drinkOptions = Array.isArray(serviceData.metaData.openBarOptions)
      ? serviceData.metaData.openBarOptions
      : optionsStr.split(',');
  }

  // Opciones por defecto si no hay disponibles
  if (drinkOptions.length === 0) {
    drinkOptions = [
      'Mojito',
      'Cuba Libre',
      'Piña Colada',
      'Daiquiri',
      'Cerveza local',
      'Agua y refrescos',
    ];
  }

  // Extraer horarios disponibles
  let timeSlots: string[] = [];
  if (serviceData?.metaData?.timeSlots) {
    const timeSlotsStr = serviceData.metaData.timeSlots.toString();
    timeSlots = Array.isArray(serviceData.metaData.timeSlots)
      ? serviceData.metaData.timeSlots
      : timeSlotsStr.split(',');
  }

  // Horarios por defecto si no hay disponibles
  if (timeSlots.length === 0) {
    timeSlots = [
      '8:30 AM – 11:30 AM',
      '12:00 PM – 3:00 PM',
      '3:30 PM – 6:30 PM (Sunset Experience)',
    ];
  }

  // Imágenes de catamaranes (en una aplicación real vendrían de tu API)
  const galleryImages = [
    {
      src: '/img/beach.jpg',
      alt: 'Catamaran sailing on bright blue water',
      caption: 'Navegando por aguas cristalinas',
    },
    {
      src: 'https://coastalmags.com/wp-content/uploads/2023/02/pardo-59.jpg',
      alt: 'Luxury catamaran deck view',
      caption: 'Amplios espacios para relajarse',
    },
    {
      src: 'https://image.cnbj1.fds.api.mi-img.com/article-images/1a59a65e0d8fd43eb51621f1b3a95a1f-0.jpg?thumb=1&w=2560&h=1440',
      alt: 'Snorkeling from catamaran',
      caption: 'Experiencia de snorkel en arrecifes de coral',
    },
    {
      src: 'https://i0.wp.com/www.sailingtotem.com/wp-content/uploads/2020/10/Catamaran-raft-up-in-French-Polynesia.jpg?resize=1000%2C750&ssl=1',
      alt: 'Catamaran anchored near beach',
      caption: 'Paradas en playas paradisíacas',
    },
  ];

  // Preguntas frecuentes
  const faqs = [
    {
      question: '¿Necesito saber nadar para disfrutar este paseo?',
      answer:
        'No es obligatorio. Proporcionamos chalecos salvavidas y supervisión profesional para todos los pasajeros. Sin embargo, saber nadar mejorará tu experiencia durante las actividades de snorkel.',
    },
    {
      question: '¿Qué debo llevar al paseo?',
      answer:
        'Recomendamos traer traje de baño, toalla, protector solar biodegradable, sombrero, gafas de sol, cámara (preferiblemente impermeable) y dinero en efectivo para compras opcionales.',
    },
    {
      question: '¿Es adecuado para niños?',
      answer:
        'Sí, este paseo es perfecto para familias. Los niños de todas las edades son bienvenidos, y tenemos chalecos salvavidas de diferentes tamaños disponibles.',
    },
    {
      question: '¿Qué sucede en caso de mal tiempo?',
      answer:
        'La seguridad es nuestra prioridad. En caso de condiciones climáticas adversas, podemos reprogramar tu reserva para otra fecha o ofrecerte un reembolso completo.',
    },
  ];

  // Características destacadas
  const highlights = [
    {
      icon: <Ship className='h-6 w-6' />,
      title: isPrivate ? 'Experiencia privada' : 'Catamaran de lujo',
      description: isPrivate
        ? 'Disfruta de privacidad total con familia y amigos'
        : 'Embarcación moderna con todas las comodidades',
    },
    {
      icon: <Anchor className='h-6 w-6' />,
      title: 'Equipamiento completo',
      description: 'Equipo de snorkel incluido para explorar arrecifes',
    },
    {
      icon: <Utensils className='h-6 w-6' />,
      title: 'Gastronomía a bordo',
      description:
        isPrivate || isPremium
          ? 'Menú gourmet con opciones personalizadas'
          : 'Buffet tropical con bebidas incluidas',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Capacidad',
      description: `Hasta ${capacity.split(' ')[0]} pasajeros cómodamente`,
    },
  ];

  // Opciones de fechas disponibles (simuladas)
  const availableDates = [
    { display: 'Hoy', value: 'today' },
    { display: 'Mañana', value: 'tomorrow' },
    { display: 'En 2 días', value: 'day_after' },
    { display: 'Próxima semana', value: 'next_week' },
    { display: 'Fechas personalizadas', value: 'custom' },
  ];

  // Animación para elementos
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='space-y-12'>
      {/* Hero Section */}
      <motion.div
        className='relative h-[50vh] rounded-3xl overflow-hidden'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        transition={{ duration: 0.6 }}
      >
        <Image
          src={galleryImages[0].src}
          alt={`${service.name} hero image`}
          fill
          className='object-cover'
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-${primaryColor}-900/90 via-${primaryColor}-900/50 to-transparent`}
        >
          <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
            <div className='flex items-center mb-4'>
              {isPrivate || isPremium ? (
                <div className='bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center'>
                  <Star className='h-4 w-4 text-yellow-300 mr-2' />
                  <span className='text-sm font-medium uppercase'>
                    Experiencia Premium
                  </span>
                </div>
              ) : (
                <div className='bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center'>
                  <Anchor className='h-4 w-4 text-white mr-2' />
                  <span className='text-sm font-medium'>Aventura Marítima</span>
                </div>
              )}
            </div>
            <h1 className='text-4xl md:text-5xl font-bold mb-2'>
              {serviceData?.titleKey ? t(serviceData.titleKey) : service.name}
            </h1>
            <p className='text-xl md:text-2xl text-white/90 max-w-xl'>
              {serviceData?.descriptionKey
                ? t(serviceData.descriptionKey)
                : isPrivate
                ? 'Exclusiva experiencia marítima para ti y tus invitados'
                : 'Descubre el paraíso en un inolvidable paseo por el mar'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Details Cards */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-4 gap-4'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        transition={{ duration: 0.6, delay: 0.1, staggerChildren: 0.1 }}
      >
        {highlights.map((highlight, index) => (
          <motion.div
            key={index}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-t-4 border-${primaryColor}-500`}
            variants={fadeIn}
          >
            <div
              className={`h-12 w-12 rounded-full bg-${primaryColor}-50 text-${primaryColor}-600 flex items-center justify-center mb-4`}
            >
              {highlight.icon}
            </div>
            <h3 className='font-bold text-gray-800 mb-2'>{highlight.title}</h3>
            <p className='text-gray-600 text-sm'>{highlight.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Navegación por pestañas */}
      <div className='border-b border-gray-200'>
        <nav className='flex space-x-8'>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'overview'
                ? `border-${primaryColor}-500 text-${primaryColor}-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Descripción
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'itinerary'
                ? `border-${primaryColor}-500 text-${primaryColor}-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Itinerario
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'faq'
                ? `border-${primaryColor}-500 text-${primaryColor}-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Preguntas Frecuentes
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className='mt-8'>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className='space-y-10'>
            {/* Descripción detallada */}
            <motion.div
              className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
              initial='hidden'
              animate='visible'
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2
                  className={`text-2xl font-bold text-${primaryColor}-800 mb-4`}
                >
                  {isPrivate
                    ? 'Tu experiencia exclusiva en el mar'
                    : 'Una aventura marítima incomparable'}
                </h2>
                <div className='prose max-w-none text-gray-700'>
                  <p className='mb-4'>
                    {serviceData?.fullDescriptionKey
                      ? t(serviceData.fullDescriptionKey)
                      : isPrivate
                      ? 'Disfruta de una experiencia completamente privada a bordo de nuestro lujoso catamarán, donde tú y tus invitados serán los únicos pasajeros. Nuestro atento equipo estará dedicado exclusivamente a ustedes, garantizando un nivel de servicio personalizado incomparable.'
                      : 'Embárcate en una aventura inolvidable por las aguas cristalinas del Caribe a bordo de nuestro espacioso catamarán. Navegaremos entre arrecifes de coral vibrantes y playas de arena blanca, mientras disfrutas del sol, el mar y la mejor hospitalidad.'}
                  </p>
                  <p>
                    {isPrivate
                      ? 'El paseo incluye paradas en los puntos más exclusivos, equipo de snorkel de primera calidad, un exquisito menú personalizado y una selección premium de bebidas. Todo está diseñado para crear recuerdos inolvidables en un entorno paradisíaco.'
                      : 'Durante el viaje, tendrás la oportunidad de nadar en aguas turquesas, practicar snorkel entre coloridos peces tropicales, relajarte en playas vírgenes y disfrutar de un delicioso buffet tropical acompañado de bebidas refrescantes.'}
                  </p>
                </div>
              </div>
              <div className='relative h-[400px] rounded-xl overflow-hidden shadow-xl'>
                <Image
                  src={galleryImages[1].src}
                  alt='Catamaran experience'
                  fill
                  className='object-cover'
                />
              </div>
            </motion.div>

            {/* Galería de imágenes */}
            <motion.div
              className='bg-white rounded-xl shadow-md overflow-hidden p-6'
              initial='hidden'
              animate='visible'
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2
                className={`text-2xl font-bold text-${primaryColor}-800 mb-6 flex items-center`}
              >
                <Camera className='mr-2' />
                Galería de experiencias
              </h2>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className='relative h-48 rounded-lg overflow-hidden group'
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
                      <p className='p-3 text-white text-sm'>{image.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Destinos y Lugares */}
            <motion.div
              className='grid grid-cols-1 md:grid-cols-2 gap-8'
              initial='hidden'
              animate='visible'
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Destinos */}
              <div className='bg-white rounded-xl shadow-md p-6'>
                <h2
                  className={`text-xl font-bold text-${primaryColor}-800 mb-4 flex items-center`}
                >
                  <Map className='mr-2' />
                  Destinos de Ensueño
                </h2>
                <div className='space-y-3'>
                  {destinations.map((destination, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg bg-${primaryColor}-50 flex items-start`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-3 flex-shrink-0`}
                      >
                        <Map className={`h-4 w-4 text-${primaryColor}-600`} />
                      </div>
                      <div>
                        <h3 className='font-medium text-gray-800'>
                          {destination}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {getDestinationDescription(destination)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar abierto y snacks */}
              <div className='bg-white rounded-xl shadow-md p-6'>
                <h2
                  className={`text-xl font-bold text-${primaryColor}-800 mb-4 flex items-center`}
                >
                  <Utensils className='mr-2' />
                  {isPrivate
                    ? 'Bar Premium & Gastronomía'
                    : 'Bar Abierto & Snacks'}
                </h2>

                <div className='space-y-4'>
                  <div>
                    <h3 className='font-medium text-gray-800 mb-2 flex items-center'>
                      <DollarSign
                        className={`h-5 w-5 text-${primaryColor}-500 mr-2`}
                      />
                      Bebidas Incluidas
                    </h3>
                    <div className='grid grid-cols-2 gap-2'>
                      {drinkOptions.map((drink, index) => (
                        <div key={index} className='flex items-center'>
                          <CheckCircle
                            className={`h-4 w-4 text-${primaryColor}-500 mr-2`}
                          />
                          <span className='text-gray-700'>{drink}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className='font-medium text-gray-800 mb-2 flex items-center'>
                      <Utensils
                        className={`h-5 w-5 text-${primaryColor}-500 mr-2`}
                      />
                      Alimentación
                    </h3>
                    <p className='text-gray-700'>
                      {isPrivate
                        ? 'Menú gourmet personalizado con opciones para todos los gustos, elaborado con ingredientes frescos y locales por nuestro chef.'
                        : 'Buffet tropical con una selección de frutas frescas, snacks, sándwiches y especialidades dominicanas para disfrutar durante la travesía.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actividades disponibles */}
            <motion.div
              className='bg-white rounded-xl shadow-md p-6'
              initial='hidden'
              animate='visible'
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2
                className={`text-xl font-bold text-${primaryColor}-800 mb-6 flex items-center`}
              >
                <Ship className='mr-2' />
                Actividades a Bordo
              </h2>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                <div
                  className={`p-4 rounded-xl bg-${primaryColor}-50 text-center`}
                >
                  <div
                    className={`h-12 w-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mx-auto mb-3`}
                  >
                    <LifeBuoy className={`h-6 w-6 text-${primaryColor}-600`} />
                  </div>
                  <h3 className='font-medium text-gray-800 mb-1'>Snorkeling</h3>
                  <p className='text-sm text-gray-600'>
                    Explora vibrantes arrecifes de coral
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl bg-${primaryColor}-50 text-center`}
                >
                  <div
                    className={`h-12 w-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mx-auto mb-3`}
                  >
                    <Droplets className={`h-6 w-6 text-${primaryColor}-600`} />
                  </div>
                  <h3 className='font-medium text-gray-800 mb-1'>Natación</h3>
                  <p className='text-sm text-gray-600'>
                    En aguas cristalinas y seguras
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl bg-${primaryColor}-50 text-center`}
                >
                  <div
                    className={`h-12 w-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mx-auto mb-3`}
                  >
                    <Sun className={`h-6 w-6 text-${primaryColor}-600`} />
                  </div>
                  <h3 className='font-medium text-gray-800 mb-1'>
                    Baño de Sol
                  </h3>
                  <p className='text-sm text-gray-600'>
                    En la amplia cubierta con colchonetas
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl bg-${primaryColor}-50 text-center`}
                >
                  <div
                    className={`h-12 w-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mx-auto mb-3`}
                  >
                    <Fish className={`h-6 w-6 text-${primaryColor}-600`} />
                  </div>
                  <h3 className='font-medium text-gray-800 mb-1'>
                    Vida Marina
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Observación de peces tropicales
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <motion.div
            className='space-y-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className='bg-white rounded-xl shadow-md p-6'>
              <h2
                className={`text-2xl font-bold text-${primaryColor}-800 mb-6`}
              >
                Tu día en el mar
              </h2>

              <div className='relative'>
                {/* Línea de tiempo vertical */}
                <div className='absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200'></div>

                <div className='space-y-8'>
                  {/* Paso 1 */}
                  <div className='flex'>
                    <div
                      className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 mr-4 flex-shrink-0`}
                    >
                      <Clock className='h-8 w-8' />
                    </div>
                    <div className='pt-3'>
                      <h3 className='text-lg font-bold text-gray-800'>
                        9:00 AM - Bienvenida y check-in
                      </h3>
                      <p className='text-gray-600 mt-2'>
                        Te recibimos en nuestro punto de encuentro con un
                        cocktail de bienvenida. Nuestro staff te dará una breve
                        orientación sobre seguridad y el itinerario del día.
                      </p>
                    </div>
                  </div>

                  {/* Paso 2 */}
                  <div className='flex'>
                    <div
                      className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 mr-4 flex-shrink-0`}
                    >
                      <Ship className='h-8 w-8' />
                    </div>
                    <div className='pt-3'>
                      <h3 className='text-lg font-bold text-gray-800'>
                        9:30 AM - Zarpe y navegación
                      </h3>
                      <p className='text-gray-600 mt-2'>
                        Comenzamos nuestra aventura navegando hacia nuestro
                        primer destino mientras disfrutas de las vistas, música
                        caribeña y bebidas refrescantes.
                      </p>
                    </div>
                  </div>

                  {/* Paso 3 */}
                  <div className='flex'>
                    <div
                      className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 mr-4 flex-shrink-0`}
                    >
                      <LifeBuoy className='h-8 w-8' />
                    </div>
                    <div className='pt-3'>
                      <h3 className='text-lg font-bold text-gray-800'>
                        10:30 AM - Primera parada: Snorkeling
                      </h3>
                      <p className='text-gray-600 mt-2'>
                        Llegamos a un increíble arrecife de coral donde podrás
                        practicar snorkel con nuestro equipo profesional.
                        Observa peces tropicales y corales en aguas cristalinas.
                      </p>
                    </div>
                  </div>

                  {/* Paso 4 */}
                  <div className='flex'>
                    <div
                      className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 mr-4 flex-shrink-0`}
                    >
                      <Utensils className='h-8 w-8' />
                    </div>
                    <div className='pt-3'>
                      <h3 className='text-lg font-bold text-gray-800'>
                        12:30 PM - Almuerzo en la playa
                      </h3>
                      <p className='text-gray-600 mt-2'>
                        Desembarcamos en una playa paradisíaca donde disfrutarás
                        de un delicioso{' '}
                        {isPrivate ? 'menú gourmet' : 'buffet tropical'} con
                        bebidas incluidas. Tiempo libre para relajarte en la
                        playa.
                      </p>
                    </div>
                  </div>

                  {/* Paso 5 */}
                  <div className='flex'>
                    <div
                      className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 mr-4 flex-shrink-0`}
                    >
                      <Map className='h-8 w-8' />
                    </div>
                    <div className='pt-3'>
                      <h3 className='text-lg font-bold text-gray-800'>
                        2:30 PM - Piscina natural
                      </h3>
                      <p className='text-gray-600 mt-2'>
                        Visitamos la famosa piscina natural, un banco de arena
                        en medio del mar con aguas cristalinas poco profundas.
                        Perfecto para fotos y relajación.
                      </p>
                    </div>
                  </div>

                  {/* Paso 6 */}
                  <div className='flex'>
                    <div
                      className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 mr-4 flex-shrink-0`}
                    >
                      <Wind className='h-8 w-8' />
                    </div>
                    <div className='pt-3'>
                      <h3 className='text-lg font-bold text-gray-800'>
                        4:30 PM - Navegación de regreso
                      </h3>
                      <p className='text-gray-600 mt-2'>
                        Regresamos a nuestro punto de partida con música,
                        diversión y navegación relajada. Disfruta de las últimas
                        vistas del atardecer{' '}
                        {isPremium && 'con una copa de champagne'}.
                      </p>
                    </div>
                  </div>

                  {/* Paso 7 */}
                  <div className='flex'>
                    <div
                      className={`relative z-10 flex items-center justify-center h-16 w-16 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 mr-4 flex-shrink-0`}
                    >
                      <CheckCircle className='h-8 w-8' />
                    </div>
                    <div className='pt-3'>
                      <h3 className='text-lg font-bold text-gray-800'>
                        5:30 PM - Desembarque y despedida
                      </h3>
                      <p className='text-gray-600 mt-2'>
                        Llegamos a nuestro punto de origen donde nos despedimos
                        con recuerdos inolvidables y fotos que nuestro equipo ha
                        tomado durante el día.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios disponibles */}
            <div className='bg-white rounded-xl shadow-md p-6'>
              <h2
                className={`text-xl font-bold text-${primaryColor}-800 mb-4 flex items-center`}
              >
                <Clock className='mr-2' />
                Horarios Disponibles
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      index === 2
                        ? `border-${primaryColor}-300 bg-${primaryColor}-50`
                        : 'border-gray-200'
                    } hover:border-${primaryColor}-300 transition-colors cursor-pointer group`}
                  >
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-gray-800'>{slot}</span>
                      {index === 2 && (
                        <span
                          className={`text-xs font-medium bg-${primaryColor}-100 text-${primaryColor}-800 px-2 py-1 rounded-full`}
                        >
                          Popular
                        </span>
                      )}
                    </div>
                    <p className='text-sm text-gray-500 mt-1'>
                      {index === 0
                        ? 'Ideal para madrugadores'
                        : index === 1
                        ? 'Horario más tranquilo'
                        : 'Experiencia con puesta de sol'}
                    </p>
                  </div>
                ))}
              </div>
              <p className='mt-4 text-sm text-gray-500 flex items-center'>
                <AlertCircle className='h-4 w-4 mr-1' />
                La disponibilidad puede variar según la temporada y clima.
                Reservación previa requerida.
              </p>
            </div>

            {/* Qué llevar */}
            <div className='bg-white rounded-xl shadow-md p-6'>
              <h2
                className={`text-xl font-bold text-${primaryColor}-800 mb-4 flex items-center`}
              >
                <CheckCircle className='mr-2' />
                Qué Debes Llevar
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='flex items-start'>
                  <CheckCircle
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <div>
                    <p className='font-medium text-gray-800'>Traje de baño</p>
                    <p className='text-sm text-gray-600'>
                      Cómodo para actividades acuáticas
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <CheckCircle
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <div>
                    <p className='font-medium text-gray-800'>Toalla</p>
                    <p className='text-sm text-gray-600'>
                      Para secarte después del snorkel
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <CheckCircle
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <div>
                    <p className='font-medium text-gray-800'>Protector solar</p>
                    <p className='text-sm text-gray-600'>
                      Preferiblemente biodegradable
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <CheckCircle
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <div>
                    <p className='font-medium text-gray-800'>Cámara</p>
                    <p className='text-sm text-gray-600'>
                      A prueba de agua si es posible
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <CheckCircle
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <div>
                    <p className='font-medium text-gray-800'>
                      Gorra o sombrero
                    </p>
                    <p className='text-sm text-gray-600'>
                      Para protegerte del sol
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <CheckCircle
                    className={`h-5 w-5 text-${primaryColor}-500 mr-2 mt-0.5`}
                  />
                  <div>
                    <p className='font-medium text-gray-800'>
                      Dinero en efectivo
                    </p>
                    <p className='text-sm text-gray-600'>
                      Para compras opcionales de recuerdos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <motion.div
            className='bg-white rounded-xl shadow-md p-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className={`text-2xl font-bold text-${primaryColor}-800 mb-6`}>
              Preguntas Frecuentes
            </h2>

            <div className='space-y-4'>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border border-gray-200 hover:border-${primaryColor}-200 transition-colors`}
                >
                  <h3 className='font-medium text-gray-900 mb-2'>
                    {faq.question}
                  </h3>
                  <p className='text-gray-700'>{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Reserva / Call to Action */}
      <motion.div
        className={`bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-800 rounded-xl shadow-xl overflow-hidden`}
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className='p-8 md:p-10 text-white'>
          <div className='md:flex justify-between items-center'>
            <div className='mb-6 md:mb-0'>
              <h2 className='text-2xl md:text-3xl font-bold mb-2'>
                ¿Listo para zarpar?
              </h2>
              <p className='text-white/90 md:max-w-md'>
                Reserva ahora tu experiencia en catamarán y prepárate para un
                día inolvidable en el paraíso.
              </p>
            </div>

            <div className='space-y-6 md:w-96'>
              {/* Selector de fecha */}
              <div>
                <label className='block text-white text-sm font-medium mb-2'>
                  Selecciona una fecha
                </label>
                <select
                  className='w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg py-2.5 px-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50'
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value=''>Seleccionar fecha...</option>
                  {availableDates.map((date, index) => (
                    <option key={index} value={date.value}>
                      {date.display}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de pasajeros */}
              <div>
                <label className='block text-white text-sm font-medium mb-2'>
                  Número de pasajeros
                </label>
                <div className='flex items-center'>
                  <button
                    className='bg-white/20 border border-white/30 rounded-l-lg p-2.5'
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  >
                    -
                  </button>
                  <div className='bg-white/20 border-t border-b border-white/30 py-2.5 px-4 text-center min-w-[60px]'>
                    {guestCount}
                  </div>
                  <button
                    className='bg-white/20 border border-white/30 rounded-r-lg p-2.5'
                    onClick={() =>
                      setGuestCount(
                        Math.min(parseInt(capacity), guestCount + 1)
                      )
                    }
                  >
                    +
                  </button>
                  <span className='ml-3 text-sm opacity-75'>
                    Máximo {capacity}
                  </span>
                </div>
              </div>

              {/* Botón de reserva */}
              <button
                className='w-full bg-white text-${primaryColor}-700 font-bold py-3 px-6 rounded-lg hover:bg-${primaryColor}-50 transition-colors flex items-center justify-center space-x-2'
                onClick={() => addService(service)}
              >
                <span>
                  {isSelected ? 'Actualizar Reserva' : 'Reservar Ahora'}
                </span>
                <ArrowRight className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Función auxiliar para obtener descripciones de destinos
function getDestinationDescription(destination: string): string {
  const destinations: Record<string, string> = {
    'Isla Saona':
      'Paradisíaca isla de arena blanca y aguas turquesas, parte del Parque Nacional del Este.',
    'Arrecifes de coral':
      'Vibrantes ecosistemas marinos con coloridos peces tropicales y formaciones de coral.',
    'Piscinas naturales':
      'Bancos de arena en aguas cristalinas poco profundas, perfectos para relajarse.',
    'Palmera torcida':
      'Icónica palmera inclinada sobre el mar, uno de los puntos fotográficos más populares.',
    'Bahía de las Águilas':
      'Una de las playas más hermosas y vírgenes de la República Dominicana.',
  };

  return (
    destinations[destination] ||
    'Un hermoso destino en las aguas cristalinas del Caribe.'
  );
}

export default CatamaranServiceView;
