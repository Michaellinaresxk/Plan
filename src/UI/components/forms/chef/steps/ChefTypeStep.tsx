import React from 'react';
import { ChefHat, Utensils, Check, Star } from 'lucide-react';

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
      title: 'Affordable Home Cooking',
      price: 120,
      description: 'The regular cooks are individuals who cook well and offer their services at an affordable price. We\'ve worked with them in the past and had good experiences. However, they don\'t work exclusively as chefs, nor do they actively promote themselves as such.',
      note: 'El chef regular no ofrece ni trabaja con un menú establecido',
      features: [
        'Personalized cooking based on your requests',
        'Home-style cuisine preparation', 
        'Flexible menu planning',
        'Good value for money',
        'Works with guest guidance'
      ],
      icon: <Utensils className="w-6 h-6" />
    },
    {
      id: 'professional',
      name: 'Chef Experimentado',
      title: 'Professional Culinary Experience',
      price: 175,
      badge: 'Professional',
      description: 'A professional chef has formal culinary training and works full-time in the culinary field. They typically offer a curated menu, maintain high presentation standards, and have experience in handling special dietary needs or preferences.',
      features: [
        'Formal culinary training & certification',
        'Curated signature menus available',
        'High-end presentation standards',
        'Special dietary needs expertise',
        'Restaurant-quality experience'
      ],
      icon: <ChefHat className="w-6 h-6" />
    }
  ];

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
        <ChefHat className='w-5 h-5 mr-2 text-amber-600' />
        Selecciona tu Tipo de Chef
      </h3>

      <div className="space-y-4">
        <p className='text-gray-600'>
          Elige el tipo de experiencia culinaria que deseas para tu evento:
        </p>

        <div className='grid grid-cols-1 gap-6 mt-6'>
          {chefTypes.map((chef) => (
            <div
              key={chef.id}
              onClick={() => onChange('chefType', chef.id)}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg
                ${
                  formData.chefType === chef.id
                    ? 'border-amber-500 bg-amber-50 shadow-md'
                    : 'border-gray-200 hover:border-amber-300'
                }
              `}
            >
              {chef.badge && (
                <div className="absolute -top-3 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Star className="w-3 h-3 inline mr-1" />
                  {chef.badge}
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    formData.chefType === chef.id ? 'bg-amber-200' : 'bg-gray-100'
                  }`}>
                    {chef.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{chef.name}</h3>
                    <p className="text-amber-700 font-medium">{chef.title}</p>
                  </div>
                </div>
                
                {formData.chefType === chef.id && (
                  <div className='w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center'>
                    <Check className='w-4 h-4 text-white' />
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {chef.description}
              </p>

              {chef.note && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-amber-800 text-sm font-medium">
                    📝 {chef.note}
                  </p>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-gray-800 text-sm">¿Qué incluye?</h4>
                {chef.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">
                      US${chef.price}
                    </span>
                    <span className="text-gray-600 ml-2">por día</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      Hasta 10 personas
                    </div>
                    <div className="text-xs text-gray-400">
                      Los precios pueden variar para grupos más grandes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {errors.chefType && (
          <p className='text-red-500 text-sm mt-2'>{errors.chefType}</p>
        )}
      </div>

      {/* Information Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ChefHat className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h4 className="font-medium text-blue-800">¿Necesitas ayuda para decidir?</h4>
            <p className="text-blue-700 text-sm mt-1">
              Si buscas una experiencia más casual y personalizada, elige Chef Regular. 
              Si prefieres un servicio más refinado con menús curados, elige Chef Experimentado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefTypeStep;