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
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      pattern:
        "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
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
        'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2077&q=80',
      pattern:
        "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpolygon points='30,5 35,20 50,20 40,30 45,45 30,35 15,45 20,30 10,20 25,20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
      gradient: 'from-indigo-600 via-purple-600 to-pink-500',
      glowColor: 'shadow-purple-500/25',
      accentColor: 'purple',
      icon: <ChefHat className='w-8 h-8' />,
    },
  ];

  return (
    <div className='space-y-12'>
      {/* Luxury Header */}
      <div className='relative text-center space-y-6 py-8'>
        <div className='absolute inset-0 bg-gradient-to-r from-amber-50 via-white to-purple-50 rounded-3xl -mx-4'></div>
        <div className='relative z-10'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full mb-6 shadow-2xl shadow-orange-500/25'>
            <ChefHat className='w-10 h-10 text-white drop-shadow-lg' />
          </div>
          <h3 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4'>
            Experiencia Culinaria de Lujo
          </h3>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light'>
            Descubre el arte de la gastronomía personalizada. Cada chef aporta
            su propia maestría para crear momentos únicos que trascienden una
            simple comida.
          </p>
        </div>
      </div>

      {/* Luxury Chef Cards */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-10'>
        {chefTypes.map((chef) => (
          <div
            key={chef.id}
            onClick={() => onChange('chefType', chef.id)}
            className='group relative'
          >
            {/* Main Card Container */}
            <div
              className={`
              relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-700 
              backdrop-blur-sm border border-white/20
              ${
                formData.chefType === chef.id
                  ? `shadow-2xl ${chef.glowColor} scale-105 ring-2 ring-white/30`
                  : 'hover:shadow-2xl hover:scale-102 shadow-xl'
              }
            `}
              style={{
                background: `linear-gradient(135deg, ${
                  chef.id === 'standard'
                    ? 'rgba(251, 146, 60, 0.1) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(252, 211, 77, 0.1) 100%'
                    : 'rgba(139, 92, 246, 0.1) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(236, 72, 153, 0.1) 100%'
                })`,
                backgroundImage: `url("${chef.pattern}")`,
              }}
            >
              {/* Premium Badge */}
              {chef.badge && (
                <div className='absolute top-6 right-6 z-30'>
                  <div className='bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center shadow-2xl shadow-purple-500/50 backdrop-blur-sm border border-white/20'>
                    {chef.badge.icon}
                    <span className='ml-2'>{chef.badge.text}</span>
                  </div>
                </div>
              )}

              {/* Selection Indicator */}
              {formData.chefType === chef.id && (
                <div className='absolute top-6 left-6 z-30'>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/30
                    ${
                      chef.id === 'standard'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                    }`}
                  >
                    <Check className='w-6 h-6 text-white drop-shadow-lg' />
                  </div>
                </div>
              )}

              {/* Hero Image Section */}
              <div className='relative h-80 overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20'></div>
                <img
                  src={chef.imageUrl}
                  alt={chef.name}
                  className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                />

                {/* Luxury Overlay with Text */}
                <div className='absolute inset-0 z-20'>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${chef.gradient} opacity-30`}
                  ></div>
                  <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
                    <div className='flex items-center space-x-4 mb-3'>
                      <div
                        className={`p-3 rounded-2xl backdrop-blur-sm border border-white/30
                        ${
                          chef.id === 'standard'
                            ? 'bg-orange-500/20'
                            : 'bg-purple-500/20'
                        }`}
                      >
                        {chef.icon}
                      </div>
                      <div>
                        <h3 className='text-3xl font-bold drop-shadow-lg'>
                          {chef.name}
                        </h3>
                        <h4 className='text-xl font-semibold text-white/90'>
                          {chef.title}
                        </h4>
                      </div>
                    </div>
                    <p className='text-lg text-white/80 font-medium'>
                      {chef.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className='p-8 space-y-8 relative z-10'>
                {/* Description */}
                <div className='space-y-4'>
                  <p className='text-gray-700 text-lg leading-relaxed font-light'>
                    {chef.description}
                  </p>

                  {/* Special Note for Standard Chef */}
                  {chef.note && (
                    <div
                      className={`relative p-6 rounded-2xl backdrop-blur-sm border
                      ${
                        chef.id === 'standard'
                          ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/50'
                          : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200/50'
                      }`}
                    >
                      <p
                        className={`font-semibold text-center flex items-center justify-center
                        ${
                          chef.id === 'standard'
                            ? 'text-orange-800'
                            : 'text-purple-800'
                        }
                      `}
                      >
                        <Sparkles className='w-5 h-5 mr-2' />
                        {chef.note}
                      </p>
                    </div>
                  )}
                </div>

                {/* Premium Features */}
                <div className='space-y-6'>
                  <h4 className='font-bold text-gray-900 text-xl flex items-center'>
                    <Star className='w-6 h-6 mr-3 text-amber-500' />
                    Experiencia Incluida
                  </h4>
                  <div className='space-y-4'>
                    {chef.features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105
                        ${
                          feature.highlight
                            ? chef.id === 'standard'
                              ? 'bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200'
                              : 'bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200'
                            : 'bg-gray-50/50 hover:bg-white/80'
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-xl backdrop-blur-sm
                          ${
                            chef.id === 'standard'
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                          }`}
                        >
                          {feature.icon}
                        </div>
                        <span className='font-medium text-gray-800 text-lg'>
                          {feature.text}
                        </span>
                        {feature.highlight && (
                          <div className='ml-auto'>
                            <Sparkles className='w-5 h-5 text-amber-500' />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Luxury Pricing */}
                <div className='relative'>
                  <div
                    className={`p-8 rounded-2xl backdrop-blur-sm border-2 
                    ${
                      chef.id === 'standard'
                        ? 'bg-gradient-to-r from-orange-50/80 to-amber-50/80 border-orange-200/50'
                        : 'bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border-purple-200/50'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='space-y-2'>
                        <div className='flex items-baseline space-x-3'>
                          <span className='text-4xl font-bold text-gray-900'>
                            ${chef.price}
                          </span>
                          <span className='text-xl text-gray-600 font-medium'>
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
                        className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300
                        ${
                          formData.chefType === chef.id
                            ? chef.id === 'standard'
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/30'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-purple-500/30'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {formData.chefType === chef.id ? (
                          <div className='flex items-center space-x-2'>
                            <Check className='w-5 h-5' />
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

              {/* Luxury Hover Effect */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none
                bg-gradient-to-br ${chef.gradient} bg-opacity-5 rounded-3xl`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {errors.chefType && (
        <div className='text-center'>
          <div className='inline-block p-4 bg-red-50 border border-red-200 rounded-2xl'>
            <p className='text-red-600 font-medium'>{errors.chefType}</p>
          </div>
        </div>
      )}

      {/* Luxury Help Section */}
      <div className='relative overflow-hidden rounded-3xl'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700'></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className='relative z-10 p-8 text-white'>
          <div className='flex items-start space-x-6'>
            <div className='flex-shrink-0'>
              <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30'>
                <ChefHat className='w-8 h-8 text-white' />
              </div>
            </div>
            <div className='flex-1 space-y-4'>
              <h4 className='font-bold text-2xl'>
                ¿Cómo elegir tu experiencia perfecta?
              </h4>
              <div className='grid md:grid-cols-2 gap-6 text-white/90'>
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
            className={`inline-flex items-center space-x-4 px-8 py-6 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/30
            ${
              formData.chefType === 'standard'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/30'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-purple-500/30'
            } text-white`}
          >
            <div className='w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30'>
              {formData.chefType === 'standard' ? (
                <Utensils className='w-7 h-7' />
              ) : (
                <ChefHat className='w-7 h-7' />
              )}
            </div>
            <div className='text-left'>
              <div className='font-bold text-xl'>
                {chefTypes.find((c) => c.id === formData.chefType)?.name}{' '}
                Confirmado
              </div>
              <div className='text-lg opacity-90'>
                ${chefTypes.find((c) => c.id === formData.chefType)?.price} USD
                por experiencia
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Check className='w-8 h-8' />
              <Sparkles className='w-6 h-6' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefTypeStep;
