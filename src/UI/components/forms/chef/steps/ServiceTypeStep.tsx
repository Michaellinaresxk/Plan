import React from 'react';
import {
  Calendar,
  CalendarRange,
  Check,
  Star,
  AlertTriangle,
  Sparkles,
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
  // Get chef theme for visual consistency
  const getChefTheme = () => {
    if (formData.chefType === 'professional') {
      return {
        name: 'Chef Experimentado',
        gradient: 'from-purple-500 to-indigo-600',
        textColor: 'purple-800',
        experience: 'Premium',
      };
    } else {
      return {
        name: 'Chef Regular',
        gradient: 'from-orange-500 to-amber-500',
        textColor: 'orange-800',
        experience: 'Auténtica',
      };
    }
  };

  const theme = getChefTheme();

  const serviceTypes = [
    {
      id: 'single',
      name: 'Experiencia única',
      tagline: 'Para un evento en particular',
      description: 'Perfecta para celebraciones especiales',
      imageUrl:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      icon: <Calendar className='w-6 h-6' />,
      highlights: [
        '2-4 horas dedicadas',
        'Planificación simple',
        'Atención exclusiva',
      ],
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'multiple',
      name: 'Múltiples Días',
      tagline: 'Jornada gastronómica',
      description: 'Experiencia culinaria extendida',
      imageUrl:
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      icon: <CalendarRange className='w-6 h-6' />,
      highlights: ['Variedad de menús', 'Mejor valor', 'Configuración por día'],
      gradient: 'from-emerald-500 to-teal-600',
      popular: true,
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Compact Header with Chef Context */}
      <div className='text-center space-y-4'>
        <div
          className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${theme.gradient} rounded-2xl shadow-lg`}
        >
          <CalendarRange className='w-8 h-8 text-white' />
        </div>
        <div>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900'>
            Tipo de Servicio
          </h2>
          <p className='text-gray-600 mt-2'>
            Con tu{' '}
            <span className={`font-semibold text-${theme.textColor}`}>
              {theme.name}
            </span>
          </p>
        </div>
      </div>

      {/* Chef Selection Confirmation */}
      <div
        className={`p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200`}
      >
        <div className='flex items-center space-x-3'>
          <div
            className={`w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-lg flex items-center justify-center`}
          >
            <Check className='w-5 h-5 text-white' />
          </div>
          <div>
            <h4 className={`font-semibold text-${theme.textColor}`}>
              {theme.name} - Experiencia {theme.experience}
            </h4>
            <p className='text-gray-600 text-sm'>Confirmado para tu evento</p>
          </div>
        </div>
      </div>

      {/* Simplified Service Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {serviceTypes.map((service) => (
          <div
            key={service.id}
            onClick={() => onChange('serviceType', service.id)}
            className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
              formData.serviceType === service.id
                ? 'border-blue-500 ring-4 ring-blue-200 scale-105 shadow-xl'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            {/* Image Header */}
            <div className='relative h-32'>
              <img
                src={service.imageUrl}
                alt={service.name}
                className='w-full h-full object-cover'
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-75`}
              />

              {/* Popular Badge */}
              {service.popular && (
                <div className='absolute top-3 right-3'>
                  <div className='bg-amber-500 text-white px-2 py-1 rounded-full flex items-center space-x-1'>
                    <Star className='w-3 h-3' />
                    <span className='text-xs font-bold'>Popular</span>
                  </div>
                </div>
              )}

              {/* Selection Check */}
              {formData.serviceType === service.id && (
                <div className='absolute top-3 left-3'>
                  <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg'>
                    <Check className='w-5 h-5 text-green-600' />
                  </div>
                </div>
              )}

              {/* Service Info Overlay */}
              <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-white/20 backdrop-blur-sm rounded-lg'>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className='font-bold text-lg'>{service.name}</h3>
                    <p className='text-sm opacity-90'>{service.tagline}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Content */}
            <div className='p-4 bg-white'>
              <p className='text-gray-700 text-sm mb-3 text-center'>
                {service.description}
              </p>

              {/* Key Highlights - Horizontal */}
              <div className='flex flex-wrap gap-1 justify-center mb-4'>
                {service.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full'
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              {/* Selection Button */}
              <div
                className={`w-full py-3 px-4 rounded-lg font-semibold text-center transition-all ${
                  formData.serviceType === service.id
                    ? `bg-gradient-to-r ${service.gradient} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {formData.serviceType === service.id ? (
                  <div className='flex items-center justify-center space-x-2'>
                    <Check className='w-4 h-4' />
                    <span>Seleccionado</span>
                  </div>
                ) : (
                  'Elegir este Servicio'
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {errors.serviceType && (
        <div className='text-center'>
          <div className='inline-flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
            <AlertTriangle className='w-4 h-4 text-red-600' />
            <p className='text-red-600 text-sm font-medium'>
              {errors.serviceType}
            </p>
          </div>
        </div>
      )}

      {/* Quick Comparison */}
      <div className='bg-gray-50 rounded-xl p-4'>
        <h4 className='font-semibold text-center text-gray-900 mb-3'>
          ¿Una ocasión o varios días?
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='flex items-start space-x-3'>
            <div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
              <Calendar className='w-4 h-4 text-blue-600' />
            </div>
            <div>
              <span className='font-medium text-blue-800'>Una Ocasión</span>
              <p className='text-gray-600 mt-1'>
                Ideal para cenas románticas, celebraciones familiares o eventos
                corporativos únicos.
              </p>
            </div>
          </div>
          <div className='flex items-start space-x-3'>
            <div className='w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
              <CalendarRange className='w-4 h-4 text-emerald-600' />
            </div>
            <div>
              <span className='font-medium text-emerald-800'>
                Múltiples Días
              </span>
              <p className='text-gray-600 mt-1'>
                Perfecto para vacaciones, retiros o cuando quieres explorar
                diferentes estilos culinarios.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Confirmation */}
      {formData.serviceType && (
        <div className='text-center'>
          <div
            className={`inline-flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-lg text-white ${
              formData.serviceType === 'single'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600'
            }`}
          >
            <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
              {formData.serviceType === 'single' ? (
                <Calendar className='w-5 h-5' />
              ) : (
                <CalendarRange className='w-5 h-5' />
              )}
            </div>
            <div className='text-left'>
              <div className='font-bold'>
                {serviceTypes.find((s) => s.id === formData.serviceType)?.name}{' '}
                Confirmado
              </div>
              <div className='text-sm opacity-90'>
                {formData.serviceType === 'single'
                  ? 'Una experiencia perfecta'
                  : 'Jornada gastronómica completa'}
              </div>
            </div>
            <Sparkles className='w-5 h-5' />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefServiceTypeStep;
