import React from 'react';
import {
  Calendar,
  CalendarRange,
  Check,
  Clock,
  Sparkles,
  Star,
  Crown,
  Users,
  MapPin,
  Award,
  Heart,
  Coffee,
  AlertTriangle,
} from 'lucide-react';

interface ServiceTypeStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const ChefServiceTypeStep: React.FC<ServiceTypeStepProps> = ({
  formData,
  onChange,
  errors,
}) => {
  // Get chef theme for consistent styling
  const getChefTheme = () => {
    if (formData.chefType === 'professional') {
      return {
        name: 'Chef Experimentado',
        gradient: 'from-purple-500 via-indigo-600 to-blue-500',
        lightGradient: 'from-purple-50 via-white to-indigo-50',
        textColor: 'purple-800',
        iconColor: 'text-purple-600',
        experience: 'Premium',
        description: 'Experiencia gastronómica de nivel mundial',
      };
    } else {
      return {
        name: 'Chef Regular',
        gradient: 'from-orange-500 via-amber-500 to-yellow-400',
        lightGradient: 'from-orange-50 via-white to-amber-50',
        textColor: 'orange-800',
        iconColor: 'text-orange-600',
        experience: 'Auténtica',
        description: 'Cocina del corazón con sabores únicos',
      };
    }
  };

  const theme = getChefTheme();

  const serviceTypes = [
    {
      id: 'single',
      name: 'Experiencia Única',
      title: 'Una Noche Perfecta',
      subtitle: 'Momentos únicos e inolvidables',
      description:
        'Una experiencia culinaria excepcional diseñada para crear el momento perfecto. Ideal para celebraciones especiales, citas románticas o cuando deseas vivir una experiencia gastronómica memorable.',
      features: [
        {
          icon: <Star className='w-5 h-5' />,
          text: 'Experiencia completamente personalizada',
          highlight: true,
        },
        {
          icon: <Clock className='w-5 h-5' />,
          text: 'Tiempo dedicado exclusivamente a tu evento',
        },
        {
          icon: <Sparkles className='w-5 h-5' />,
          text: 'Atención al detalle excepcional',
        },
        {
          icon: <Calendar className='w-5 h-5' />,
          text: 'Planificación simplificada',
        },
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: <Calendar className='w-8 h-8' />,
      note: 'Perfecto para ocasiones especiales y experiencias íntimas',
      benefits: [
        'Cena romántica',
        'Celebración familiar',
        'Evento corporativo especial',
      ],
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'multiple',
      name: 'Experiencia Extendida',
      title: 'Jornada Gastronómica',
      subtitle: 'Múltiples días de excelencia culinaria',
      description:
        'Una aventura culinaria completa que se extiende por varios días. Perfecta para vacaciones, estancias prolongadas o cuando deseas explorar diferentes estilos gastronómicos con la comodidad de un chef personal.',
      features: [
        {
          icon: <CalendarRange className='w-5 h-5' />,
          text: 'Múltiples experiencias únicas',
          highlight: true,
        },
        {
          icon: <Crown className='w-5 h-5' />,
          text: 'Variedad de menús y estilos culinarios',
        },
        {
          icon: <Star className='w-5 h-5' />,
          text: 'Mejor valor por experiencia completa',
        },
        {
          icon: <Sparkles className='w-5 h-5' />,
          text: 'Configuración personalizada por día',
        },
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: <CalendarRange className='w-8 h-8' />,
      note: 'Ideal para vacaciones y estancias prolongadas',
      benefits: [
        'Vacaciones gastronómicas',
        'Retiros corporativos',
        'Celebraciones extendidas',
      ],
      badge: { text: 'Más Popular', icon: <Star className='w-4 h-4' /> },
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className='space-y-8 md:space-y-12'>
      {/* Hero Section */}
      <div className='relative h-40 md:h-64 lg:h-80 rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8'>
        <img
          src='https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          alt='Multiple dining experiences'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
        <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white'>
          <div className='flex items-center space-x-3 md:space-x-4 mb-2 md:mb-3'>
            <div
              className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center shadow-lg`}
            >
              <CalendarRange className='w-6 h-6 md:w-8 md:h-8' />
            </div>
            <div>
              <h1 className='text-xl md:text-3xl lg:text-4xl font-bold'>
                Tipo de Servicio
              </h1>
              <p className='text-white/90 text-sm md:text-lg'>
                Elige la experiencia perfecta para ti
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chef Selection Indicator */}
      <div
        className={`p-4 md:p-6 bg-gradient-to-r ${theme.lightGradient} rounded-2xl border border-gray-200 shadow-lg`}
      >
        <div className='flex items-center space-x-4'>
          <div
            className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${theme.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
          >
            {formData.chefType === 'professional' ? (
              <Crown className='w-6 h-6 md:w-8 md:h-8 text-white' />
            ) : (
              <Heart className='w-6 h-6 md:w-8 md:h-8 text-white' />
            )}
          </div>
          <div className='flex-1'>
            <h4
              className={`text-lg md:text-xl font-bold ${theme.textColor} mb-1`}
            >
              {theme.name} - Experiencia {theme.experience}
            </h4>
            <p className='text-gray-700 text-sm md:text-base'>
              {theme.description}
            </p>
          </div>
          <div
            className={`px-3 py-1 md:px-4 md:py-2 bg-white rounded-xl border border-gray-200 ${theme.iconColor} font-semibold text-sm`}
          >
            ✓ Confirmado
          </div>
        </div>
      </div>

      {/* Service Type Selection */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10'>
        {serviceTypes.map((service) => (
          <div
            key={service.id}
            onClick={() => onChange('serviceType', service.id)}
            className='group relative cursor-pointer'
          >
            {/* Main Card Container */}
            <div
              className={`
              relative overflow-hidden rounded-2xl md:rounded-3xl transition-all duration-700 
              backdrop-blur-sm border border-white/20 h-full bg-white shadow-lg
              ${
                formData.serviceType === service.id
                  ? 'shadow-2xl scale-105 ring-4 ring-blue-400 ring-opacity-50'
                  : 'hover:shadow-2xl hover:scale-102'
              }
            `}
            >
              {/* Badge for Popular Option */}
              {service.badge && (
                <div className='absolute top-4 md:top-6 right-4 md:right-6 z-30'>
                  <div className='bg-amber-500 text-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-bold flex items-center shadow-2xl backdrop-blur-sm border border-white/20'>
                    {service.badge.icon}
                    <span className='ml-1 md:ml-2'>{service.badge.text}</span>
                  </div>
                </div>
              )}

              {/* Selection Indicator */}
              {formData.serviceType === service.id && (
                <div className='absolute top-4 md:top-6 left-4 md:left-6 z-30'>
                  <div className='w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/30'>
                    <Check className='w-5 h-5 md:w-6 md:h-6 text-green-600 drop-shadow-lg' />
                  </div>
                </div>
              )}

              {/* Hero Image Section */}
              <div className='relative h-48 md:h-56 lg:h-64 overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20'></div>
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                />

                {/* Overlay with Text */}
                <div className='absolute inset-0 z-20'>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-30`}
                  ></div>
                  <div className='absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 text-white'>
                    <div className='flex items-center space-x-3 md:space-x-4 mb-2 md:mb-3'>
                      <div className='p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30'>
                        {service.icon}
                      </div>
                      <div>
                        <h3 className='text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-lg'>
                          {service.name}
                        </h3>
                        <h4 className='text-base md:text-lg lg:text-xl font-semibold text-white/90'>
                          {service.title}
                        </h4>
                      </div>
                    </div>
                    <p className='text-sm md:text-base lg:text-lg text-white/80 font-medium'>
                      {service.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className='p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 lg:space-y-8 relative z-10'>
                {/* Description */}
                <div className='space-y-3 md:space-y-4'>
                  <p className='text-gray-700 text-base md:text-lg leading-relaxed font-light'>
                    {service.description}
                  </p>

                  {/* Special Note */}
                  <div className='relative p-4 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-sm border bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'>
                    <p className='font-semibold text-center flex items-center justify-center text-gray-800'>
                      <Sparkles className='w-4 h-4 md:w-5 md:h-5 mr-2' />
                      {service.note}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className='space-y-4 md:space-y-6'>
                  <h4 className='font-bold text-gray-900 text-lg md:text-xl flex items-center'>
                    <Star className='w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-amber-500' />
                    Características Incluidas
                  </h4>
                  <div className='space-y-3 md:space-y-4'>
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                          feature.highlight
                            ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200'
                            : 'bg-gray-50/50 hover:bg-white/80'
                        }`}
                      >
                        <div
                          className={`p-2 md:p-2.5 rounded-xl backdrop-blur-sm bg-gradient-to-r ${service.gradient} text-white`}
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

                {/* Benefits Section */}
                <div className='space-y-4'>
                  <h5 className='font-semibold text-gray-800 text-base md:text-lg'>
                    Ideal para:
                  </h5>
                  <div className='flex flex-wrap gap-2 md:gap-3'>
                    {service.benefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className='px-3 py-1 md:px-4 md:py-2 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium border border-blue-200'
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Selection Button */}
                <div
                  className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl font-bold text-center transition-all duration-300 text-base md:text-lg shadow-lg ${
                    formData.serviceType === service.id
                      ? `bg-gradient-to-r ${service.gradient} text-white shadow-xl`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-xl'
                  }`}
                >
                  {formData.serviceType === service.id ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <Check className='w-5 h-5' />
                      <span>Experiencia Seleccionada</span>
                    </div>
                  ) : (
                    'Elegir Esta Experiencia'
                  )}
                </div>
              </div>

              {/* Hover Effect */}
              <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none bg-blue-800/5 rounded-2xl md:rounded-3xl'></div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {errors.serviceType && (
        <div className='text-center'>
          <div className='inline-flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-2xl'>
            <AlertTriangle className='w-5 h-5 text-red-600' />
            <p className='text-red-600 font-medium'>{errors.serviceType}</p>
          </div>
        </div>
      )}

      {/* Comparison Section */}
      <div className='relative overflow-hidden rounded-2xl md:rounded-3xl'>
        <div className='absolute inset-0 bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900'></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className='relative z-10 p-6 md:p-8 text-white'>
          <div className='text-center mb-6 md:mb-8'>
            <h4 className='font-bold text-xl md:text-2xl mb-3 md:mb-4'>
              Comparación de Experiencias
            </h4>
            <p className='text-gray-300 text-base md:text-lg'>
              Encuentra la opción perfecta para tu ocasión con tu {theme.name}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-10 h-10 md:w-12 md:h-12 bg-slate-700 rounded-xl flex items-center justify-center'>
                  <Calendar className='w-5 h-5 md:w-6 md:h-6 text-white' />
                </div>
                <div>
                  <h5 className='font-bold text-lg md:text-xl text-slate-300'>
                    Experiencia Única
                  </h5>
                  <p className='text-gray-300 text-sm md:text-base'>
                    Un momento perfecto
                  </p>
                </div>
              </div>
              <div className='space-y-3 text-gray-300'>
                <div className='flex items-center space-x-3'>
                  <Clock className='w-4 h-4 md:w-5 md:h-5 text-slate-400' />
                  <span className='text-sm md:text-base'>
                    2-4 horas de servicio dedicado
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Star className='w-4 h-4 md:w-5 md:h-5 text-slate-400' />
                  <span className='text-sm md:text-base'>
                    Experiencia completamente personalizada
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Sparkles className='w-4 h-4 md:w-5 md:h-5 text-slate-400' />
                  <span className='text-sm md:text-base'>
                    Ideal para ocasiones especiales
                  </span>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-10 h-10 md:w-12 md:h-12 bg-slate-700 rounded-xl flex items-center justify-center'>
                  <CalendarRange className='w-5 h-5 md:w-6 md:h-6 text-white' />
                </div>
                <div>
                  <h5 className='font-bold text-lg md:text-xl text-slate-300'>
                    Experiencia Extendida
                  </h5>
                  <p className='text-gray-300 text-sm md:text-base'>
                    Jornada gastronómica completa
                  </p>
                </div>
              </div>
              <div className='space-y-3 text-gray-300'>
                <div className='flex items-center space-x-3'>
                  <CalendarRange className='w-4 h-4 md:w-5 md:h-5 text-slate-400' />
                  <span className='text-sm md:text-base'>
                    Múltiples días de experiencias únicas
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Crown className='w-4 h-4 md:w-5 md:h-5 text-slate-400' />
                  <span className='text-sm md:text-base'>
                    Variedad de menús y estilos
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Star className='w-4 h-4 md:w-5 md:h-5 text-slate-400' />
                  <span className='text-sm md:text-base'>
                    Mejor valor por experiencia completa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Confirmation */}
      {formData.serviceType && (
        <div className='text-center'>
          <div className='inline-flex items-center space-x-3 md:space-x-4 px-6 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-3xl shadow-2xl bg-gradient-to-r from-slate-800 to-gray-800 text-white'>
            <div className='w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30'>
              {formData.serviceType === 'single' ? (
                <Calendar className='w-6 h-6 md:w-7 md:h-7' />
              ) : (
                <CalendarRange className='w-6 h-6 md:w-7 md:h-7' />
              )}
            </div>
            <div className='text-left'>
              <div className='font-bold text-lg md:text-xl'>
                {serviceTypes.find((s) => s.id === formData.serviceType)?.name}{' '}
                Confirmada
              </div>
              <div className='text-base md:text-lg opacity-90'>
                {formData.serviceType === 'single'
                  ? 'Una experiencia perfecta'
                  : 'Múltiples experiencias gastronómicas'}
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

export default ChefServiceTypeStep;
