import React from 'react';
import {
  ChefHat,
  Utensils,
  Check,
  Star,
  Clock,
  Users,
  Award,
  Heart,
  Sparkles,
  Crown,
  AlertCircle,
} from 'lucide-react';

interface ChefTypeStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const ChefTypeStep: React.FC<ChefTypeStepProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const chefTypes = [
    {
      id: 'standard',
      name: 'Chef Regular',
      title: 'Experiencia Auténtica',
      subtitle: 'Cocina del corazón, sabores únicos',
      price: 120,
      description:
        'Una experiencia culinaria íntima y personalizada donde cada plato cuenta una historia. Nuestros chefs regulares transforman ingredientes frescos en momentos memorables con el cariño de la cocina casera.',
      note: 'Menú completamente personalizable • Sin restricciones creativas',
      features: [
        {
          icon: <Heart className='w-5 h-5' />,
          text: 'Cocina adaptada a tu historia personal',
          highlight: true,
        },
        {
          icon: <Users className='w-5 h-5' />,
          text: 'Ambiente familiar y acogedor',
        },
        {
          icon: <Clock className='w-5 h-5' />,
          text: 'Flexibilidad total en timing y menú',
        },
        {
          icon: <Sparkles className='w-5 h-5' />,
          text: 'Relación calidad-precio excepcional',
        },
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-orange-600 via-amber-500 to-yellow-400',
      glowColor: 'shadow-orange-500/25',
      accentColor: 'orange',
      icon: <Utensils className='w-8 h-8' />,
    },
    {
      id: 'professional',
      name: 'Chef Experimentado',
      title: 'Maestría Gastronómica',
      subtitle: 'Arte culinario de nivel mundial',
      price: 175,
      badge: { text: 'Premium', icon: <Crown className='w-4 h-4' /> },
      description:
        'Una sinfonía de sabores orquestada por maestros culinarios. Cada plato es una obra de arte que combina técnica profesional, ingredientes selectos y presentación espectacular para crear experiencias gastronómicas inolvidables.',
      features: [
        {
          icon: <Award className='w-5 h-5' />,
          text: 'Maestros con certificación internacional',
          highlight: true,
        },
        {
          icon: <Star className='w-5 h-5' />,
          text: 'Menús signature exclusivos y curados',
        },
        {
          icon: <ChefHat className='w-5 h-5' />,
          text: 'Presentación de nivel Michelin',
        },
        {
          icon: <Sparkles className='w-5 h-5' />,
          text: 'Experiencia gastronómica transformadora',
        },
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-indigo-600 via-purple-600 to-pink-500',
      glowColor: 'shadow-purple-500/25',
      accentColor: 'purple',
      icon: <ChefHat className='w-8 h-8' />,
    },
  ];

  return (
    <div className='space-y-8 md:space-y-12'>
      {/* Hero Header with Image */}
      <div className='relative h-40 md:h-64 lg:h-80 rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8'>
        <img
          src='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          alt='Chef cooking with passion'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
        <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white'>
          <div className='flex items-center space-x-3 md:space-x-4 mb-2 md:mb-3'>
            <div className='w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg'>
              <ChefHat className='w-6 h-6 md:w-8 md:h-8' />
            </div>
            <div>
              <h1 className='text-xl md:text-3xl lg:text-4xl font-bold'>
                Experiencia Culinaria de Lujo
              </h1>
              <p className='text-white/90 text-sm md:text-lg'>
                Elige tu chef personal perfecto
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chef Cards */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 lg:gap-10'>
        {chefTypes.map((chef) => (
          <div
            key={chef.id}
            onClick={() => onChange('chefType', chef.id)}
            className='group relative cursor-pointer'
          >
            {/* Main Card Container */}
            <div
              className={`
              relative overflow-hidden rounded-2xl md:rounded-3xl transition-all duration-700 
              backdrop-blur-sm border border-white/20 h-full bg-white shadow-lg
              ${
                formData.chefType === chef.id
                  ? `shadow-2xl ${chef.glowColor} scale-105 ring-2 ring-white/30`
                  : 'hover:shadow-2xl hover:scale-102'
              }
            `}
            >
              {/* Premium Badge */}
              {chef.badge && (
                <div className='absolute top-4 md:top-6 right-4 md:right-6 z-30'>
                  <div className='bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-bold flex items-center shadow-2xl shadow-purple-500/50 backdrop-blur-sm border border-white/20'>
                    {chef.badge.icon}
                    <span className='ml-1 md:ml-2'>{chef.badge.text}</span>
                  </div>
                </div>
              )}

              {/* Selection Indicator */}
              {formData.chefType === chef.id && (
                <div className='absolute top-4 md:top-6 left-4 md:left-6 z-30'>
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/30 bg-white`}
                  >
                    <Check className='w-5 h-5 md:w-6 md:h-6 text-green-600 drop-shadow-lg' />
                  </div>
                </div>
              )}

              {/* Hero Image Section */}
              <div className='relative h-48 md:h-64 lg:h-80 overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20'></div>
                <img
                  src={chef.imageUrl}
                  alt={chef.name}
                  className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                />

                {/* Overlay with Text */}
                <div className='absolute inset-0 z-20'>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${chef.gradient} opacity-30`}
                  ></div>
                  <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white'>
                    <div className='flex items-center space-x-3 md:space-x-4 mb-2 md:mb-3'>
                      <div
                        className={`p-2 md:p-3 rounded-xl md:rounded-2xl backdrop-blur-sm border border-white/30 bg-${chef.accentColor}-500/20`}
                      >
                        {chef.icon}
                      </div>
                      <div>
                        <h3 className='text-2xl md:text-3xl font-bold drop-shadow-lg'>
                          {chef.name}
                        </h3>
                        <h4 className='text-lg md:text-xl font-semibold text-white/90'>
                          {chef.title}
                        </h4>
                      </div>
                    </div>
                    <p className='text-base md:text-lg text-white/80 font-medium'>
                      {chef.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className='p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 lg:space-y-8 relative z-10'>
                {/* Description */}
                <div className='space-y-3 md:space-y-4'>
                  <p className='text-gray-700 text-base md:text-lg leading-relaxed font-light'>
                    {chef.description}
                  </p>

                  {/* Special Note */}
                  {chef.note && (
                    <div className='relative p-4 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-sm border bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'>
                      <p className='font-semibold text-center flex items-center justify-center text-orange-800'>
                        <Sparkles className='w-4 h-4 md:w-5 md:h-5 mr-2' />
                        {chef.note}
                      </p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className='space-y-4 md:space-y-6'>
                  <h4 className='font-bold text-gray-900 text-lg md:text-xl flex items-center'>
                    <Star className='w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-amber-500' />
                    Experiencia Incluida
                  </h4>
                  <div className='space-y-3 md:space-y-4'>
                    {chef.features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                          feature.highlight
                            ? 'bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200'
                            : 'bg-gray-50/50 hover:bg-white/80'
                        }`}
                      >
                        <div
                          className={`p-2 md:p-2.5 rounded-xl backdrop-blur-sm bg-gradient-to-r ${chef.gradient} text-white`}
                        >
                          {feature.icon}
                        </div>
                        <span className='font-medium text-gray-800 text-sm md:text-base lg:text-lg'>
                          {feature.text}
                        </span>
                        {feature.highlight && (
                          <div className='ml-auto'>
                            <Sparkles className='w-4 h-4 md:w-5 md:h-5 text-amber-500' />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className='relative'>
                  <div className='p-6 md:p-8 rounded-xl md:rounded-2xl backdrop-blur-sm border-2 bg-gradient-to-r from-gray-50/80 to-gray-100/80 border-gray-200'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-2'>
                        <div className='flex items-baseline space-x-3'>
                          <span className='text-3xl md:text-4xl font-bold text-gray-900'>
                            ${chef.price}
                          </span>
                          <span className='text-lg md:text-xl text-gray-600 font-medium'>
                            USD
                          </span>
                        </div>
                        <div className='text-gray-600 font-medium'>
                          Por experiencia completa
                        </div>
                        <div className='text-sm text-gray-500'>
                          Incluye hasta 10 personas
                        </div>
                      </div>

                      <div
                        className={`px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg transition-all duration-300 ${
                          formData.chefType === chef.id
                            ? `bg-gradient-to-r ${chef.gradient} text-white ${chef.glowColor}`
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {formData.chefType === chef.id ? (
                          <div className='flex items-center space-x-2'>
                            <Check className='w-4 h-4 md:w-5 md:h-5' />
                            <span>Seleccionado</span>
                          </div>
                        ) : (
                          'Elegir Experiencia'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none bg-gradient-to-br ${chef.gradient} bg-opacity-5 rounded-2xl md:rounded-3xl`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {errors.chefType && (
        <div className='text-center'>
          <div className='inline-flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-2xl'>
            <AlertCircle className='w-5 h-5 text-red-600' />
            <p className='text-red-600 font-medium'>{errors.chefType}</p>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className='relative overflow-hidden rounded-2xl md:rounded-3xl'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700'></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className='relative z-10 p-6 md:p-8 text-white'>
          <div className='flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6'>
            <div className='flex-shrink-0'>
              <div className='w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30'>
                <ChefHat className='w-6 h-6 md:w-8 md:h-8 text-white' />
              </div>
            </div>
            <div className='flex-1 space-y-4'>
              <h4 className='font-bold text-xl md:text-2xl'>
                ¿Cómo elegir tu experiencia perfecta?
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-white/90'>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-3 h-3 bg-orange-400 rounded-full'></div>
                    <span className='font-semibold'>Chef Regular</span>
                  </div>
                  <p className='text-sm ml-6'>
                    Perfecto para cenas íntimas, celebraciones familiares o
                    cuando buscas una experiencia auténtica y completamente
                    personalizada.
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-3 h-3 bg-purple-400 rounded-full'></div>
                    <span className='font-semibold'>Chef Experimentado</span>
                  </div>
                  <p className='text-sm ml-6'>
                    Ideal para ocasiones especiales, aniversarios, eventos
                    corporativos o cuando deseas una experiencia gastronómica de
                    nivel mundial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Confirmation */}
      {formData.chefType && (
        <div className='text-center'>
          <div
            className={`inline-flex items-center space-x-3 md:space-x-4 px-6 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-3xl shadow-2xl backdrop-blur-sm border border-white/30 ${
              formData.chefType === 'standard'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/30'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-purple-500/30'
            } text-white`}
          >
            <div className='w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30'>
              {formData.chefType === 'standard' ? (
                <Utensils className='w-6 h-6 md:w-7 md:h-7' />
              ) : (
                <ChefHat className='w-6 h-6 md:w-7 md:h-7' />
              )}
            </div>
            <div className='text-left'>
              <div className='font-bold text-lg md:text-xl'>
                {chefTypes.find((c) => c.id === formData.chefType)?.name}{' '}
                Confirmado
              </div>
              <div className='text-base md:text-lg opacity-90'>
                ${chefTypes.find((c) => c.id === formData.chefType)?.price} USD
                por experiencia
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Check className='w-6 h-6 md:w-8 md:h-8' />
              <Sparkles className='w-5 h-5 md:w-6 md:h-6' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefTypeStep;
