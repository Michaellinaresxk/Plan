import React from 'react';
import {
  Calendar,
  CalendarRange,
  Check,
  Clock,
  Sparkles,
  Star,
  Crown,
} from 'lucide-react';

interface ServiceTypeStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const ServiceTypeStep: React.FC<ServiceTypeStepProps> = ({
  formData,
  onChange,
  errors,
}) => {
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
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      gradient: 'from-rose-500 via-pink-500 to-purple-600',
      accentColor: 'rose',
      icon: <Calendar className='w-8 h-8' />,
      note: 'Perfecto para ocasiones especiales y experiencias íntimas',
      benefits: [
        'Cena romántica',
        'Celebración familiar',
        'Evento corporativo especial',
      ],
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
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
      gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
      accentColor: 'indigo',
      icon: <CalendarRange className='w-8 h-8' />,
      note: 'Ideal para vacaciones y estancias prolongadas',
      benefits: [
        'Vacaciones gastronómicas',
        'Retiros corporativos',
        'Celebraciones extendidas',
      ],
      badge: { text: 'Más Popular', icon: <Star className='w-4 h-4' /> },
    },
  ];

  return (
    <div className='space-y-12'>
      {/* Luxury Header */}
      <div className='relative text-center space-y-6 py-8'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-3xl -mx-4'></div>
        <div className='relative z-10'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 rounded-full mb-6 shadow-2xl shadow-purple-500/25'>
            <CalendarRange className='w-10 h-10 text-white drop-shadow-lg' />
          </div>
          <h3 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4'>
            Elige tu Tipo de Servicio
          </h3>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light'>
            Selecciona la experiencia que mejor se adapte a tu ocasión. Cada
            opción está diseñada para ofrecer momentos gastronómicos
            excepcionales.
          </p>
        </div>
      </div>

      {/* Service Type Cards */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
        {serviceTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => onChange('serviceType', type.id)}
            className='group relative'
          >
            {/* Main Card Container */}
            <div
              className={`
              relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-700 
              backdrop-blur-sm border border-white/20 h-full
              ${
                formData.serviceType === type.id
                  ? `shadow-2xl scale-105 ring-2 ring-white/30 ${
                      type.accentColor === 'rose'
                        ? 'shadow-rose-500/25'
                        : 'shadow-indigo-500/25'
                    }`
                  : 'hover:shadow-2xl hover:scale-102 shadow-xl'
              }
            `}
              style={{
                background: `linear-gradient(135deg, ${
                  type.accentColor === 'rose'
                    ? 'rgba(244, 63, 94, 0.1) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(236, 72, 153, 0.1) 100%'
                    : 'rgba(99, 102, 241, 0.1) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(59, 130, 246, 0.1) 100%'
                })`,
              }}
            >
              {/* Badge for Popular Option */}
              {type.badge && (
                <div className='absolute top-6 right-6 z-30'>
                  <div className='bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center shadow-2xl shadow-amber-500/50 backdrop-blur-sm border border-white/20'>
                    {type.badge.icon}
                    <span className='ml-2'>{type.badge.text}</span>
                  </div>
                </div>
              )}

              {/* Selection Indicator */}
              {formData.serviceType === type.id && (
                <div className='absolute top-6 left-6 z-30'>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/30
                    ${
                      type.accentColor === 'rose'
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                        : 'bg-gradient-to-r from-indigo-500 to-blue-500'
                    }`}
                  >
                    <Check className='w-6 h-6 text-white drop-shadow-lg' />
                  </div>
                </div>
              )}

              {/* Hero Image Section */}
              <div className='relative h-64 overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20'></div>
                <img
                  src={type.imageUrl}
                  alt={type.name}
                  className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                />

                {/* Luxury Overlay with Text */}
                <div className='absolute inset-0 z-20'>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-30`}
                  ></div>
                  <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
                    <div className='flex items-center space-x-4 mb-3'>
                      <div
                        className={`p-3 rounded-2xl backdrop-blur-sm border border-white/30
                        ${
                          type.accentColor === 'rose'
                            ? 'bg-rose-500/20'
                            : 'bg-indigo-500/20'
                        }`}
                      >
                        {type.icon}
                      </div>
                      <div>
                        <h3 className='text-2xl font-bold drop-shadow-lg'>
                          {type.name}
                        </h3>
                        <h4 className='text-lg font-semibold text-white/90'>
                          {type.title}
                        </h4>
                      </div>
                    </div>
                    <p className='text-base text-white/80 font-medium'>
                      {type.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className='p-8 space-y-8 relative z-10 flex-1'>
                {/* Description */}
                <div className='space-y-4'>
                  <p className='text-gray-700 text-lg leading-relaxed font-light'>
                    {type.description}
                  </p>

                  {/* Special Note */}
                  <div
                    className={`relative p-6 rounded-2xl backdrop-blur-sm border
                    ${
                      type.accentColor === 'rose'
                        ? 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200/50'
                        : 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200/50'
                    }`}
                  >
                    <p
                      className={`font-semibold text-center flex items-center justify-center
                      ${
                        type.accentColor === 'rose'
                          ? 'text-rose-800'
                          : 'text-indigo-800'
                      }
                    `}
                    >
                      <Sparkles className='w-5 h-5 mr-2' />
                      {type.note}
                    </p>
                  </div>
                </div>

                {/* Premium Features */}
                <div className='space-y-6'>
                  <h4 className='font-bold text-gray-900 text-xl flex items-center'>
                    <Star className='w-6 h-6 mr-3 text-amber-500' />
                    Características Incluidas
                  </h4>
                  <div className='space-y-4'>
                    {type.features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105
                        ${
                          feature.highlight
                            ? type.accentColor === 'rose'
                              ? 'bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200'
                              : 'bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-200'
                            : 'bg-gray-50/50 hover:bg-white/80'
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-xl backdrop-blur-sm
                          ${
                            type.accentColor === 'rose'
                              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                              : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white'
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

                {/* Benefits Section */}
                <div className='space-y-4'>
                  <h5 className='font-semibold text-gray-800 text-lg'>
                    Ideal para:
                  </h5>
                  <div className='flex flex-wrap gap-3'>
                    {type.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className={`px-4 py-2 rounded-full text-sm font-medium border
                        ${
                          type.accentColor === 'rose'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selection Button */}
                <div className='pt-6'>
                  <div
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 text-center
                    ${
                      formData.serviceType === type.id
                        ? type.accentColor === 'rose'
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/30'
                          : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-indigo-500/30'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl'
                    }`}
                  >
                    {formData.serviceType === type.id ? (
                      <div className='flex items-center justify-center space-x-2'>
                        <Check className='w-5 h-5' />
                        <span>Experiencia Seleccionada</span>
                      </div>
                    ) : (
                      'Elegir Esta Experiencia'
                    )}
                  </div>
                </div>
              </div>

              {/* Luxury Hover Effect */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none
                bg-gradient-to-br ${type.gradient} bg-opacity-5 rounded-3xl`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {errors.serviceType && (
        <div className='text-center'>
          <div className='inline-block p-4 bg-red-50 border border-red-200 rounded-2xl'>
            <p className='text-red-600 font-medium'>{errors.serviceType}</p>
          </div>
        </div>
      )}

      {/* Comparison Section */}
      <div className='relative overflow-hidden rounded-3xl'>
        <div className='absolute inset-0 bg-gradient-to-r from-slate-800 via-gray-900 to-slate-800'></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className='relative z-10 p-8 text-white'>
          <div className='text-center mb-8'>
            <h4 className='font-bold text-2xl mb-4'>
              Comparación de Experiencias
            </h4>
            <p className='text-gray-300 text-lg'>
              Encuentra la opción perfecta para tu ocasión
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center'>
                  <Calendar className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h5 className='font-bold text-xl text-rose-300'>
                    Experiencia Única
                  </h5>
                  <p className='text-gray-300'>Un momento perfecto</p>
                </div>
              </div>
              <div className='space-y-3 text-gray-300'>
                <div className='flex items-center space-x-3'>
                  <Clock className='w-5 h-5 text-rose-400' />
                  <span>2-4 horas de servicio dedicado</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Star className='w-5 h-5 text-rose-400' />
                  <span>Experiencia completamente personalizada</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Sparkles className='w-5 h-5 text-rose-400' />
                  <span>Ideal para ocasiones especiales</span>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center'>
                  <CalendarRange className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h5 className='font-bold text-xl text-indigo-300'>
                    Experiencia Extendida
                  </h5>
                  <p className='text-gray-300'>Jornada gastronómica completa</p>
                </div>
              </div>
              <div className='space-y-3 text-gray-300'>
                <div className='flex items-center space-x-3'>
                  <CalendarRange className='w-5 h-5 text-indigo-400' />
                  <span>Múltiples días de experiencias únicas</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Crown className='w-5 h-5 text-indigo-400' />
                  <span>Variedad de menús y estilos</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Star className='w-5 h-5 text-indigo-400' />
                  <span>Mejor valor por experiencia completa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Confirmation */}
      {formData.serviceType && (
        <div className='text-center'>
          <div
            className={`inline-flex items-center space-x-4 px-8 py-6 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/30
            ${
              formData.serviceType === 'single'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-rose-500/30'
                : 'bg-gradient-to-r from-indigo-500 to-blue-500 shadow-indigo-500/30'
            } text-white`}
          >
            <div className='w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30'>
              {formData.serviceType === 'single' ? (
                <Calendar className='w-7 h-7' />
              ) : (
                <CalendarRange className='w-7 h-7' />
              )}
            </div>
            <div className='text-left'>
              <div className='font-bold text-xl'>
                {serviceTypes.find((s) => s.id === formData.serviceType)?.name}{' '}
                Confirmada
              </div>
              <div className='text-lg opacity-90'>
                {formData.serviceType === 'single'
                  ? 'Una experiencia perfecta'
                  : 'Múltiples experiencias gastronómicas'}
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

export default ServiceTypeStep;
