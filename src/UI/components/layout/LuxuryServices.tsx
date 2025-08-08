import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Anchor,
  Music,
  Car,
  MapPin,
  Users,
  Calendar,
  Star,
  ArrowRight,
  Sparkles,
  Filter,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const useAutoSlider = (itemsLength, interval = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || itemsLength <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % itemsLength);
    }, interval);

    return () => clearInterval(timer);
  }, [itemsLength, interval, isAutoPlaying]);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % itemsLength);
  const goToPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + itemsLength) % itemsLength);
  const goToSlide = (index) => setCurrentIndex(index);

  return {
    currentIndex,
    goToNext,
    goToPrev,
    goToSlide,
    setIsAutoPlaying,
  };
};
// ============================================

const LUXURY_SERVICES = [
  {
    id: 1,
    title: 'Catamaran de Lujo',
    category: 'water',
    description:
      'Navegación exclusiva en aguas cristalinas con servicio premium',
    image:
      'https://res.cloudinary.com/michaelxk-com/image/upload/v1625794349/nuestra%20flota/lagoon%2042/1_uspfu7.jpg',
    price: 'Desde $120',
    duration: '4 horas',
    rating: 4.9,
    icon: Anchor,
  },
  {
    id: 2,
    title: 'Yate Privado',
    category: 'water',
    description: 'Experiencia completamente personalizada con capitán privado',
    image:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600019/1_nyrndv.jpg',
    price: 'Desde $800',
    duration: '8 horas',
    rating: 5.0,
    icon: Anchor,
  },
  {
    id: 3,
    title: 'Música en Vivo',
    category: 'entertainment',
    description: 'Artistas exclusivos en locaciones privadas',
    image:
      'https://plus.unsplash.com/premium_photo-1719467541072-7b53ae7e93c4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: 'Desde $200',
    duration: '3 horas',
    rating: 4.8,
    icon: Music,
  },
  {
    id: 4,
    title: 'Tour en Golf Cart',
    category: 'transport',
    description: 'Recorrido VIP por lugares exclusivos',
    image:
      'https://images.pexels.com/photos/9207203/pexels-photo-9207203.jpeg?_gl=1*72ntg3*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTM5ODExOTQkbzkkZzEkdDE3NTM5ODEyMzgkajE2JGwwJGgw',
    price: 'Desde $80',
    duration: '2 horas',
    rating: 4.7,
    icon: Car,
  },
  {
    id: 5,
    title: 'Excursión Isla Saona',
    category: 'tours',
    description: 'Acceso VIP a paraísos exclusivos',
    image: '/img/saona.jpeg',
    price: 'Desde $150',
    duration: 'Todo el día',
    rating: 4.9,
    icon: MapPin,
  },
  {
    id: 6,
    title: 'Experiencias Gourmet',
    category: 'entertainment',
    description: 'Chef privado y cenas en locaciones únicas',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    price: 'Desde $300',
    duration: '4 horas',
    rating: 5.0,
    icon: Users,
  },
];

const FILTER_CATEGORIES = {
  all: { label: 'Todos los Servicios', icon: Sparkles },
  water: { label: 'Experiencias Acuáticas', icon: Anchor },
  tours: { label: 'Tours Exclusivos', icon: MapPin },
  transport: { label: 'Transporte Premium', icon: Car },
  entertainment: { label: 'Entretenimiento VIP', icon: Music },
};

// ============================================
// SERVICIOS OVERVIEW SECTION
// ============================================

const ServicesOverview = () => {
  return (
    <section className='py-24 bg-white relative overflow-hidden'>
      {/* Subtle Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent)] bg-[length:100px_100px]' />
      </div>

      <div className='container mx-auto px-6 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='max-w-5xl mx-auto text-center'
        >
          <div className='flex items-center justify-center mb-8'>
            <div className='w-24 h-px bg-gradient-to-r from-transparent to-slate-800' />
            <Sparkles className='mx-4 w-8 h-8 text-slate-800' />
            <div className='w-24 h-px bg-gradient-to-l from-transparent to-slate-800' />
          </div>

          <h2 className='text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight'>
            Servicios de Lujo Exclusivos
          </h2>

          <p className='text-xl md:text-2xl text-slate-700 leading-relaxed font-light'>
            En Lux Punta Cana, transformamos cada momento en una experiencia
            extraordinaria. Desde aventuras en yates privados hasta cenas
            exclusivas en la playa, nuestro equipo especializado diseña
            experiencias únicas que superan toda expectativa.
            <span className='text-blue-600 font-medium'>
              {' '}
              Porque el lujo verdadero está en los detalles.
            </span>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className='mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto'
          >
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>15+</div>
              <div className='text-slate-600 text-sm'>Años de Experiencia</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>500+</div>
              <div className='text-slate-600 text-sm'>Clientes Satisfechos</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>100%</div>
              <div className='text-slate-600 text-sm'>Servicio Premium</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// LUXURY SLIDER PARA HOMEPAGE
// ============================================

const LuxuryServicesSlider = () => {
  const { currentIndex, goToNext, goToPrev, setIsAutoPlaying } = useAutoSlider(
    LUXURY_SERVICES.length,
    6000
  );

  const router = useRouter();

  const handleServiceNavigation = (serviceId: string) => {
    // router.push(`/standard-package/${serviceId}`);
    router.push(`/standard-package`);
  };

  return (
    <section className='py-20 bg-black relative overflow-hidden'>
      {/* Subtle Background Pattern */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className='absolute inset-0'
      />

      <div className='container mx-auto px-6 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <h2 className='text-5xl md:text-7xl font-bold mb-6  text-white'>
            Experiencias
          </h2>
          <p className='text-gray-600 text-xl max-w-3xl mx-auto font-light'>
            Cada servicio es una obra maestra diseñada para crear recuerdos
            inolvidables
          </p>
        </motion.div>

        {/* Main Slider */}
        <div
          className='relative max-w-7xl mx-auto'
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className='relative h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-white'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className='absolute inset-0'
              >
                <div className='relative w-full h-full'>
                  <img
                    src={LUXURY_SERVICES[currentIndex].image}
                    alt={LUXURY_SERVICES[currentIndex].title}
                    className='w-full h-full object-cover'
                  />

                  {/* Dark Overlay for Text Contrast */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20' />

                  {/* Content */}
                  <div className='absolute inset-0 flex items-end'>
                    <div className='w-full p-12 md:p-16'>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className='max-w-4xl'
                      >
                        <h3 className='text-5xl md:text-7xl font-bold text-white mb-6 leading-tight'>
                          {LUXURY_SERVICES[currentIndex].title}
                        </h3>

                        <div className='flex flex-wrap items-center gap-8 mb-10'>
                          <div className='flex items-center text-white/80 text-lg'>
                            <Calendar className='w-6 h-6 mr-3' />
                            {LUXURY_SERVICES[currentIndex].duration}
                          </div>
                        </div>

                        <motion.button
                          onClick={() =>
                            handleServiceNavigation(currentIndex.toString())
                          }
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          className='group px-10 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-amber-500/25 transition-all duration-500'
                        >
                          <span className='flex items-center'>
                            Reservar Ahora
                            <ArrowRight className='ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300' />
                          </span>
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation with Dark Theme for White Background */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrev}
            className='absolute top-1/2 -translate-y-1/2 -left-6 w-16 h-16 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-800 transition-all duration-500 z-20 shadow-2xl'
          >
            <ChevronLeft className='w-8 h-8' />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNext}
            className='absolute top-1/2 -translate-y-1/2 -right-6 w-16 h-16 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-800 transition-all duration-500 z-20 shadow-2xl'
          >
            <ChevronRight className='w-8 h-8' />
          </motion.button>

          {/* Dark Indicators for White Background */}
          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4 z-20'>
            {LUXURY_SERVICES.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-500 ${
                  index === currentIndex
                    ? 'w-12 h-3 bg-slate-900 rounded-full'
                    : 'w-3 h-3 bg-slate-400 hover:bg-slate-600 rounded-full'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// SERVICES GALLERY - OPTIMIZADA PARA MÓVILES
// ============================================

const ServicesGallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredServices, setFilteredServices] = useState(LUXURY_SERVICES);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredServices(LUXURY_SERVICES);
    } else {
      setFilteredServices(
        LUXURY_SERVICES.filter((service) => service.category === activeFilter)
      );
    }
  }, [activeFilter]);

  const categories = Object.keys(FILTER_CATEGORIES);

  return (
    <section className='py-10 bg-gradient-to-br from-gray-50 via-white to-blue-50'>
      <div className='container mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-20'
        >
          <h2 className='text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight'>
            Galería de Servicios
          </h2>
          <p className='text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed'>
            Descubre nuestra colección completa de experiencias de lujo, cada
            una cuidadosamente diseñada para ofrecer momentos únicos e
            inolvidables en el paraíso de Punta Cana
          </p>
        </motion.div>

        {/* Luxury Filter Buttons - OPTIMIZADOS PARA MÓVILES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='flex flex-wrap justify-center gap-2 md:gap-6 mb-16'
        >
          {categories.map((category) => {
            const CategoryIcon = FILTER_CATEGORIES[category].icon;
            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(category)}
                className={`group flex items-center px-3 py-2 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold text-xs md:text-lg transition-all duration-500 shadow-lg ${
                  activeFilter === category
                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-2xl shadow-slate-900/20'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 hover:shadow-xl'
                }`}
              >
                {React.createElement(CategoryIcon, {
                  className: `w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-3 ${
                    activeFilter === category
                      ? 'text-amber-400'
                      : 'text-slate-500 group-hover:text-slate-700'
                  }`,
                })}
                <span className='hidden sm:inline'>
                  {FILTER_CATEGORIES[category].label}
                </span>
                <span className='sm:hidden'>
                  {FILTER_CATEGORIES[category].label.split(' ')[0]}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Luxury Cards Grid - 2 COLUMNAS EN MÓVILES */}
        <motion.div
          layout
          className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-7xl mx-auto'
        >
          <AnimatePresence>
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -15 }}
                className='group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700'
              >
                {/* Image with Overlay Text - MÁS PEQUEÑA EN MÓVILES */}
                <div className='relative h-40 md:h-80 overflow-hidden'>
                  <img
                    src={service.image}
                    alt={service.title}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                  />

                  {/* Gradient Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

                  {/* Content Overlay - OPTIMIZADO PARA MÓVILES */}
                  <div className='absolute inset-0 flex flex-col justify-end p-3 md:p-8'>
                    <h3 className='text-sm md:text-3xl font-bold text-white mb-2 md:mb-3 leading-tight'>
                      {service.title}
                    </h3>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center text-white/80'>
                        <Calendar className='w-3 h-3 md:w-5 md:h-5 mr-1 md:mr-2' />
                        <span className='font-medium text-xs md:text-base'>
                          {service.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function LuxuryServicesComplete() {
  return (
    <div className='min-h-screen'>
      {/* Services Overview - Párrafo descriptivo de la empresa */}
      <ServicesOverview />
      {/* Services Gallery - Para página de servicios */}
      <ServicesGallery />
      {/* Luxury Slider - Para homepage */}
      <LuxuryServicesSlider />
    </div>
  );
}
