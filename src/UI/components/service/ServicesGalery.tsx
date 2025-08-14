import { AnimatePresence, motion } from 'framer-motion';
import {
  Anchor,
  ArrowRight,
  Car,
  Crown,
  MapPin,
  Music,
  Sparkles,
  Users,
} from 'lucide-react';
import { createElement, useEffect, useState } from 'react';

const ServicesGallery = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const slideIn = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

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
      description:
        'Experiencia completamente personalizada con capitán privado',
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
    <section className='py-20 md:py-32 bg-slate-900 overflow-hidden relative'>
      {/* Parallax background elements */}
      <motion.div
        className='absolute inset-0 opacity-20'
        animate={{
          y: [0, -20, 0],
          rotate: [0, 1, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className='absolute top-10 left-10 w-32 h-32 bg-blue-400/30 rounded-full blur-3xl'></div>
        <div className='absolute top-40 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl'></div>
        <div className='absolute bottom-20 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl'></div>
      </motion.div>

      <motion.div
        className='absolute inset-0 opacity-10'
        animate={{
          y: [0, 30, 0],
          rotate: [0, -1, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className='absolute top-60 right-10 w-28 h-28 bg-blue-600/20 rounded-full blur-2xl'></div>
        <div className='absolute bottom-40 right-1/3 w-36 h-36 bg-blue-400/15 rounded-full blur-3xl'></div>
      </motion.div>

      <div className='container mx-auto px-6 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className='text-center mb-16 md:mb-24'
        >
          <h2 className='text-4xl md:text-6xl font-bold mb-8 text-white leading-tight'>
            Galería de Servicios
          </h2>
          <p className='text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed'>
            Descubre nuestra colección completa de experiencias de lujo, cada
            una cuidadosamente diseñada para ofrecer momentos únicos e
            inolvidables en el paraíso de Punta Cana
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className='flex flex-wrap justify-center gap-3 md:gap-6 mb-20'
        >
          {categories.map((category, index) => {
            const CategoryIcon = FILTER_CATEGORIES[category].icon;
            return (
              <motion.button
                key={category}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{
                  scale: 1.1,
                  rotateY: 10,
                  rotateX: 5,
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveFilter(category)}
                className={`group relative flex items-center px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold text-sm md:text-lg transition-all duration-700 shadow-2xl backdrop-blur-md border transform-gpu ${
                  activeFilter === category
                    ? 'bg-blue-600/80 text-white border-blue-400/50 shadow-blue-500/50'
                    : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/20 hover:border-white/40 shadow-black/20'
                }`}
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {createElement(CategoryIcon, {
                  className: `w-4 h-4 md:w-6 md:h-6 mr-2 md:mr-3 transition-transform duration-500 group-hover:rotate-12 ${
                    activeFilter === category
                      ? 'text-blue-200'
                      : 'text-slate-300'
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

        {/* 3D Cards Grid */}
        <motion.div
          layout
          className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto'
          style={{ perspective: '1000px' }}
        >
          <AnimatePresence mode='popLayout'>
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{
                  opacity: 0,
                  y: 100,
                  rotateX: 45,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -100,
                  rotateX: -45,
                  scale: 0.8,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                }}
                whileHover={{
                  y: -20,
                  rotateX: 15,
                  rotateY: 5,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                className='group relative overflow-hidden transform-gpu'
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
              >
                {/* Main Card */}
                <div className='relative h-48 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-700'>
                  {/* Background Image with 3D effect */}
                  <div className='absolute inset-0 overflow-hidden'>
                    <img
                      src={service.image}
                      alt={service.title}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-75 group-hover:brightness-90'
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent' />
                  <div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />

                  {/* Floating particles */}
                  <div className='absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-80 group-hover:animate-ping transition-opacity duration-300'></div>
                  <div className='absolute top-8 right-8 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-pulse transition-opacity duration-500 delay-200'></div>

                  {/* Content container */}
                  <div className='absolute inset-0 flex flex-col justify-end p-4 md:p-8'>
                    <div className='backdrop-blur-md bg-white/10 rounded-xl md:rounded-2xl p-3 md:p-6 border border-white/20 transform group-hover:scale-105 transition-all duration-500 shadow-xl'>
                      {/* Service Title */}
                      <h3 className='text-sm md:text-lg font-bold text-center text-white mb-2 md:mb-3 leading-tight'>
                        {service.title}
                      </h3>

                      {/* Duration */}
                      {/* <div className='flex items-center justify-center'>
                        <div className='flex items-center bg-blue-500/20 backdrop-blur-sm px-3 md:px-4 py-1 md:py-2 rounded-full border border-white/30'>
                          <Calendar className='w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-blue-300' />
                          <span className='font-semibold text-xs md:text-sm text-white'>
                            {service.duration}
                          </span>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  {/* 3D border effect */}
                  <div className='absolute inset-0 rounded-2xl md:rounded-3xl border border-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                </div>

                {/* Floating shadow */}
                <div className='absolute -inset-2 bg-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10'></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Final CTA */}
      <motion.div
        className='px-4'
        initial='hidden'
        animate='visible'
        variants={fadeInUp}
      >
        <div className='relative mt-20 overflow-hidden rounded-3xl'>
          <div className='relative z-10 p-16 text-center text-white'>
            <motion.h2
              className='text-3xl md:text-6xl font-bold mb-6'
              variants={fadeInUp}
            >
              Let's Create Your{' '}
              <span className='text-amber-300'>Dream Experience </span> Together
            </motion.h2>
            <motion.p
              className='text-1xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed'
              variants={fadeInUp}
            >
              Our dedicated team is here to craft a truly unforgettable and
              personalized vacation, just for you.
            </motion.p>
            <motion.div
              className='flex flex-col sm:flex-row gap-6 justify-center items-center'
              variants={fadeInUp}
            >
              <a
                href='/standard-package'
                className='bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-white hover:text-amber-900 transition-all duration-500 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 w-fit'
              >
                <Crown className='w-4 h-4 md:w-5 md:h-5' />
                Ver Standard Packages
              </a>
              <a
                href='/premium-package'
                className='bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-white hover:text-amber-900 transition-all duration-500 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 w-fit'
              >
                <Crown className='w-4 h-4 md:w-5 md:h-5' />
                Ver Xclusive Packages
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
export default ServicesGallery;
