import React from 'react';
import {
  ChefHat,
  Utensils,
  Check,
  Star,
  Crown,
  Heart,
  Sparkles,
  AlertTriangle,
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
      tagline: 'Cocina del corazón',
      price: 120,
      description: 'Experiencia auténtica y personalizada',
      imageUrl:
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      gradient: 'from-orange-500 to-amber-500',
      icon: <Utensils className='w-6 h-6' />,
      highlights: [
        'Menú personalizado',
        'Ambiente familiar',
        'Flexibilidad total',
      ],
    },
    {
      id: 'professional',
      name: 'Chef Experimentado',
      tagline: 'Gastronomía premium',
      price: 175,
      description: 'Experiencia de nivel mundial',
      imageUrl:
        'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      gradient: 'from-purple-500 to-indigo-600',
      icon: <ChefHat className='w-6 h-6' />,
      highlights: [
        'Técnicas profesionales',
        'Presentación gourmet',
        'Ingredientes premium',
      ],
      premium: true,
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Compact Hero */}
      <div className='text-center space-y-4'>
        <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg'>
          <ChefHat className='w-8 h-8 text-white' />
        </div>
        <div>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900'>
            Elige tu Chef Personal
          </h2>
          <p className='text-gray-600 mt-2'>
            Dos niveles de experiencia culinaria
          </p>
        </div>
      </div>

      {/* Simplified Chef Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {chefTypes.map((chef) => (
          <div
            key={chef.id}
            onClick={() => onChange('chefType', chef.id)}
            className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
              formData.chefType === chef.id
                ? 'border-blue-500 ring-4 ring-blue-200 scale-105 shadow-xl'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            {/* Image Header */}
            <div className='relative h-32'>
              <img
                src={chef.imageUrl}
                alt={chef.name}
                className='w-full h-full object-cover'
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${chef.gradient} opacity-75`}
              />

              {/* Premium Badge */}
              {chef.premium && (
                <div className='absolute top-3 right-3'>
                  <div className='bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1'>
                    <Crown className='w-4 h-4 text-purple-600' />
                    <span className='text-xs font-bold text-purple-600'>
                      PREMIUM
                    </span>
                  </div>
                </div>
              )}

              {/* Selection Check */}
              {formData.chefType === chef.id && (
                <div className='absolute top-3 left-3'>
                  <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg'>
                    <Check className='w-5 h-5 text-green-600' />
                  </div>
                </div>
              )}

              {/* Chef Info Overlay */}
              <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-white/20 backdrop-blur-sm rounded-lg'>
                      {chef.icon}
                    </div>
                    <div>
                      <h3 className='font-bold text-lg'>{chef.name}</h3>
                      <p className='text-sm opacity-90'>{chef.tagline}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-2xl font-bold'>${chef.price}</div>
                    <div className='text-xs opacity-80'>USD</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Content */}
            <div className='p-4 bg-white'>
              <p className='text-gray-700 text-sm mb-3 text-center'>
                {chef.description}
              </p>

              {/* Key Highlights - Horizontal */}
              <div className='flex flex-wrap gap-1 justify-center'>
                {chef.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full'
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              {/* Selection Button */}
              <div className='mt-4'>
                <div
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-center transition-all ${
                    formData.chefType === chef.id
                      ? `bg-gradient-to-r ${chef.gradient} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formData.chefType === chef.id ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <Check className='w-4 h-4' />
                      <span>Seleccionado</span>
                    </div>
                  ) : (
                    'Elegir este Chef'
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {errors.chefType && (
        <div className='text-center'>
          <div className='inline-flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
            <AlertTriangle className='w-4 h-4 text-red-600' />
            <p className='text-red-600 text-sm font-medium'>
              {errors.chefType}
            </p>
          </div>
        </div>
      )}

      {/* Quick Comparison */}
      <div className='bg-gray-50 rounded-xl p-4'>
        <h4 className='font-semibold text-center text-gray-900 mb-3'>
          ¿Cuál elegir?
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='flex items-start space-x-3'>
            <div className='w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
              <Heart className='w-4 h-4 text-orange-600' />
            </div>
            <div>
              <span className='font-medium text-orange-800'>Chef Regular</span>
              <p className='text-gray-600 mt-1'>
                Perfecto para cenas familiares, celebraciones íntimas y
                experiencias auténticas.
              </p>
            </div>
          </div>
          <div className='flex items-start space-x-3'>
            <div className='w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
              <Crown className='w-4 h-4 text-purple-600' />
            </div>
            <div>
              <span className='font-medium text-purple-800'>
                Chef Experimentado
              </span>
              <p className='text-gray-600 mt-1'>
                Ideal para ocasiones especiales, aniversarios y eventos que
                requieren nivel gourmet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Confirmation */}
      {formData.chefType && (
        <div className='text-center'>
          <div
            className={`inline-flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-lg text-white ${
              formData.chefType === 'standard'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600'
            }`}
          >
            <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
              {formData.chefType === 'standard' ? (
                <Utensils className='w-5 h-5' />
              ) : (
                <ChefHat className='w-5 h-5' />
              )}
            </div>
            <div className='text-left'>
              <div className='font-bold'>
                {chefTypes.find((c) => c.id === formData.chefType)?.name}{' '}
                Confirmado
              </div>
              <div className='text-sm opacity-90'>
                ${chefTypes.find((c) => c.id === formData.chefType)?.price} USD
                por experiencia
              </div>
            </div>
            <Sparkles className='w-5 h-5' />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefTypeStep;
