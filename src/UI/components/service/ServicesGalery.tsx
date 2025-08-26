import {
  Anchor,
  ArrowRight,
  Car,
  Crown,
  MapPin,
  Music,
  Sparkles,
  Users,
  Play,
  Star,
} from 'lucide-react';
import { createElement, useEffect, useState } from 'react';

const ServicesGallery = () => {
  const LUXURY_SERVICES = [
    {
      id: 1,
      title: 'Traslados al Aeropuerto',
      category: 'water',
      image:
        'https://denomades.imgix.net/destinos/santiago/8/vehiculo-transporte-pasajeros.jpg?w=907&h=494&fit=crop&q=100&auto=format,compress&fm=webp',
      icon: Anchor,
      height: 'h-80',
    },
    {
      id: 2,
      title: 'Yate Privado',
      category: 'water',
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600019/1_nyrndv.jpg',
      icon: Anchor,
      height: 'h-96',
    },
    {
      id: 3,
      title: 'Música en Vivo',
      category: 'entertainment',
      image:
        'https://plus.unsplash.com/premium_photo-1719467541072-7b53ae7e93c4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: Music,
      height: 'h-72',
    },
    {
      id: 4,
      title: 'Golf Cart',
      category: 'transport',
      image:
        'https://images.pexels.com/photos/9207203/pexels-photo-9207203.jpeg',
      icon: Car,
      height: 'h-64',
    },
    {
      id: 5,
      title: 'Atv Aventures',
      category: 'tours',
      image:
        'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595140/2_fhmcnt.jpg',
      icon: MapPin,
      height: 'h-88',
    },
    {
      id: 6,
      title: 'Experiencias Gourmet',
      category: 'entertainment',
      image:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      icon: Users,
      height: 'h-80',
    },
  ];

  const FILTER_CATEGORIES = {
    all: { label: 'Todos', icon: Sparkles },
    water: { label: 'Acuáticos', icon: Anchor },
    tours: { label: 'Tours', icon: MapPin },
    transport: { label: 'Transporte', icon: Car },
    entertainment: { label: 'Entretenimiento', icon: Music },
  };

  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredServices, setFilteredServices] = useState(LUXURY_SERVICES);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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
    <>
      <style jsx>{`
        @keyframes gentleFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gentle-float {
          animation: gentleFloat 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-slide-down {
          animation: slideDown 0.8s ease-out forwards;
        }

        .service-card {
          transition: all 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
        }

        .service-card:hover .service-image {
          transform: scale(1.03);
        }

        .filter-btn {
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          transform: translateY(-1px);
        }

        .masonry-grid {
          columns: 2;
          column-gap: 0.75rem;
        }

        @media (min-width: 768px) {
          .masonry-grid {
            columns: 2;
            column-gap: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .masonry-grid {
            columns: 3;
          }
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .masonry-item:nth-child(1) {
          animation-delay: 0.1s;
        }
        .masonry-item:nth-child(2) {
          animation-delay: 0.15s;
        }
        .masonry-item:nth-child(3) {
          animation-delay: 0.2s;
        }
        .masonry-item:nth-child(4) {
          animation-delay: 0.25s;
        }
        .masonry-item:nth-child(5) {
          animation-delay: 0.3s;
        }
        .masonry-item:nth-child(6) {
          animation-delay: 0.35s;
        }

        .cta-card {
          background: linear-gradient(
            135deg,
            #f8fafc 0%,
            #e2e8f0 50%,
            #cbd5e1 100%
          );
          position: relative;
          overflow: hidden;
        }

        .cta-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.8),
            transparent
          );
          transition: left 0.8s;
        }

        .cta-card:hover::before {
          left: 100%;
        }

        .cta-button {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 0, 0, 0.1),
            transparent
          );
          transition: left 0.5s;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .pattern-dots {
          background-image: radial-gradient(
            circle,
            #cbd5e1 1px,
            transparent 1px
          );
          background-size: 20px 20px;
          opacity: 0.5;
        }

        .pattern-grid {
          background-image: linear-gradient(
              rgba(71, 85, 105, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(71, 85, 105, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <section className='py-20 md:py-32 bg-white overflow-hidden relative min-h-screen'>
        {/* Subtle background pattern */}
        <div className='absolute inset-0 pattern-dots'></div>
        <div className='absolute inset-0 pattern-grid opacity-30'></div>

        {/* Floating geometric elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div
            className='absolute top-20 left-20 w-20 h-20 border border-slate-200 rounded-full animate-gentle-float'
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className='absolute top-40 right-32 w-16 h-16 bg-slate-100 rounded-lg rotate-45 animate-gentle-float'
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className='absolute bottom-32 left-32 w-12 h-12 border-2 border-slate-200 rounded-full animate-gentle-float'
            style={{ animationDelay: '4s' }}
          ></div>
          <div
            className='absolute bottom-20 right-20 w-8 h-8 bg-slate-200 rounded-full animate-gentle-float'
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className='container mx-auto px-6 relative z-10'>
          {/* Header */}
          <div
            className={`text-center mb-16 md:mb-20 ${
              isVisible ? 'animate-fade-in-up' : ''
            }`}
          >
            <div className='inline-block mb-6'>
              <div className='flex items-center justify-center gap-2 text-slate-500 font-medium tracking-wider text-sm uppercase'>
                <div className='w-8 h-0.5 bg-slate-300'></div>
                <span>Experiencias Exclusivas</span>
                <div className='w-8 h-0.5 bg-slate-300'></div>
              </div>
            </div>
            <h2 className='text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight'>
              Galería de Servicios
            </h2>
            <p className='text-xl md:text-2xl text-slate-700 leading-relaxed font-light max-w-3xl mx-auto'>
              Descubre nuestra colección completa de experiencias de lujo,
              diseñadas para crear momentos únicos en el paraíso de Punta Cana
            </p>
          </div>

          {/* Minimalist Filter Buttons */}
          <div className='flex flex-wrap justify-center gap-2 mb-20'>
            {categories.map((category, index) => {
              const CategoryIcon = FILTER_CATEGORIES[category].icon;
              const isActive = activeFilter === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className={`filter-btn group flex items-center px-5 py-3 rounded-full text-sm font-medium border transition-all duration-300 animate-slide-down ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {createElement(CategoryIcon, {
                    className: `w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110`,
                  })}
                  <span>{FILTER_CATEGORIES[category].label}</span>
                </button>
              );
            })}
          </div>

          {/* Clean Masonry Grid */}
          <div className='masonry-grid max-w-7xl mx-auto'>
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                className={`masonry-item service-card group cursor-pointer ${service.height}`}
              >
                <div className='relative h-full rounded-xl overflow-hidden bg-white border border-slate-100'>
                  <div className='absolute inset-0'>
                    <img
                      src={service.image}
                      alt={service.title}
                      className='service-image w-full h-full object-cover transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  </div>

                  {/* Clean title overlay */}
                  <div className='absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
                    <div className='bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50'>
                      <h3 className='font-semibold text-slate-900 text-center'>
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elegant CTA Section */}
        <div className='px-2 mt-32'>
          <div className=' mx-auto'>
            <div className='cta-card rounded-3xl p-12 md:p-20 text-center relative border border-slate-200'>
              {/* Subtle decorative elements */}
              <div className='absolute top-8 left-8 w-12 h-12 border border-slate-300 rounded-full opacity-30'></div>
              <div className='absolute top-12 right-12 w-8 h-8 bg-slate-200 rounded-full opacity-40'></div>
              <div className='absolute bottom-8 left-12 w-6 h-6 border-2 border-slate-300 rotate-45 opacity-30'></div>
              <div className='absolute bottom-12 right-8 w-10 h-10 border border-slate-300 rounded-full opacity-25'></div>

              <div className='relative z-10'>
                {/* Icon */}
                <div className='mb-8 flex justify-center'>
                  <div className='p-4 bg-slate-100 rounded-2xl border border-slate-200'>
                    <Star className='w-8 h-8 text-slate-600' />
                  </div>
                </div>

                <h2 className='text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight'>
                  Creamos Tu Experiencia Perfecta
                </h2>

                <p className='text-xl md:text-2xl text-slate-700 leading-relaxed font-light mb-12 max-w-3xl mx-auto'>
                  Nuestro equipo de expertos está listo para diseñar unas
                  vacaciones completamente personalizadas que superen todas tus
                  expectativas.
                </p>

                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                  <a
                    href='/standard-package'
                    className='cta-button group bg-white border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-3 min-w-[250px]'
                  >
                    <Crown className='w-5 h-5 transition-transform group-hover:scale-110' />
                    <span>Standard Packages</span>
                    <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                  </a>

                  <a
                    href='/premium-package'
                    className='cta-button group bg-slate-900 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-3 min-w-[250px]'
                  >
                    <Crown className='w-5 h-5 transition-transform group-hover:scale-110' />
                    <span>Xclusive Packages</span>
                    <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                  </a>
                </div>

                <div className='mt-8 flex items-center justify-center gap-4 text-sm text-slate-500'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-slate-300 rounded-full'></div>
                    <span>Servicio 24/7</span>
                  </div>
                  <div className='w-px h-4 bg-slate-300'></div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-slate-300 rounded-full'></div>
                    <span>Experiencias Únicas</span>
                  </div>
                  <div className='w-px h-4 bg-slate-300'></div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-slate-300 rounded-full'></div>
                    <span>Totalmente Personalizado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesGallery;
