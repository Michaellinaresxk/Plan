import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  AlertCircle,
  Info,
  Sparkles,
  Star,
  Crown,
  Shield,
  Heart,
  CheckCircle2,
  Plus,
  X,
  AlertTriangle,
} from 'lucide-react';

interface DietaryRestrictionsStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors: Record<string, string>;
}

const DietaryRestrictionsStep: React.FC<DietaryRestrictionsStepProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const { t } = useTranslation();
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    []
  );

  // Get chef theme
  const getChefTheme = () => {
    if (formData.chefType === 'professional') {
      return {
        name: 'Chef Experimentado',
        gradient: 'from-purple-600 to-indigo-700',
        lightGradient: 'from-purple-50 to-indigo-50',
        bgGradient: 'from-purple-500/10 to-indigo-500/10',
        textColor: 'purple-700',
        borderColor: 'purple-300',
        hoverBorder: 'purple-400',
        selectedBg: 'purple-50',
        selectedBorder: 'purple-500',
        buttonGradient: 'from-purple-600 to-indigo-600',
        experience: 'Premium',
        icon: Crown,
        description: 'Atención especializada con técnicas profesionales',
      };
    } else {
      return {
        name: 'Chef Regular',
        gradient: 'from-orange-500 to-amber-600',
        lightGradient: 'from-orange-50 to-amber-50',
        bgGradient: 'from-orange-500/10 to-amber-500/10',
        textColor: 'orange-700',
        borderColor: 'orange-300',
        hoverBorder: 'orange-400',
        selectedBg: 'orange-50',
        selectedBorder: 'orange-500',
        buttonGradient: 'from-orange-500 to-amber-500',
        experience: 'Auténtica',
        icon: Heart,
        description: 'Adaptación cuidadosa de recetas tradicionales',
      };
    }
  };

  const theme = getChefTheme();
  const ChefIcon = theme.icon;

  // Common dietary restrictions
  const commonRestrictions = [
    { id: 'vegetarian', name: 'Vegetariano', icon: '🥬', color: 'green' },
    { id: 'vegan', name: 'Vegano', icon: '🌱', color: 'emerald' },
    { id: 'gluten-free', name: 'Sin Gluten', icon: '🌾', color: 'yellow' },
    { id: 'dairy-free', name: 'Sin Lácteos', icon: '🥛', color: 'blue' },
    { id: 'nut-allergies', name: 'Sin Frutos Secos', icon: '🥜', color: 'red' },
    {
      id: 'seafood-allergies',
      name: 'Sin Mariscos',
      icon: '🦐',
      color: 'pink',
    },
    { id: 'keto', name: 'Cetogénica', icon: '🥓', color: 'purple' },
    {
      id: 'low-carb',
      name: 'Baja en Carbohidratos',
      icon: '🥗',
      color: 'teal',
    },
  ];

  const handleQuickRestriction = (restriction: any) => {
    const isSelected = selectedRestrictions.includes(restriction.id);
    let newSelected;

    if (isSelected) {
      newSelected = selectedRestrictions.filter((id) => id !== restriction.id);
    } else {
      newSelected = [...selectedRestrictions, restriction.id];
    }

    setSelectedRestrictions(newSelected);

    // Update form data
    const restrictionNames = newSelected
      .map((id) => commonRestrictions.find((r) => r.id === id)?.name)
      .filter(Boolean);

    const currentCustom = formData.customDietaryRestrictions || '';
    const allRestrictions =
      restrictionNames.length > 0
        ? currentCustom
          ? `${restrictionNames.join(', ')}, ${currentCustom}`
          : restrictionNames.join(', ')
        : currentCustom;

    onChange({
      target: {
        name: 'dietaryRestrictions',
        value: allRestrictions,
      },
    } as any);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const customValue = e.target.value;

    onChange({
      target: {
        name: 'customDietaryRestrictions',
        value: customValue,
      },
    } as any);

    // Also update the main field
    const restrictionNames = selectedRestrictions
      .map((id) => commonRestrictions.find((r) => r.id === id)?.name)
      .filter(Boolean);

    const allRestrictions =
      restrictionNames.length > 0
        ? customValue
          ? `${restrictionNames.join(', ')}, ${customValue}`
          : restrictionNames.join(', ')
        : customValue;

    onChange({
      target: {
        name: 'dietaryRestrictions',
        value: allRestrictions,
      },
    } as any);
  };

  return (
    <div className='max-w-4xl mx-auto space-y-10'>
      {/* Header */}
      <div className='text-center space-y-6'>
        <div
          className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${theme.gradient} rounded-3xl shadow-2xl mb-6`}
        >
          <Shield className='w-10 h-10 text-white' />
        </div>
        <div>
          <h3 className='text-3xl font-bold text-gray-900 mb-3'>
            Restricciones Dietéticas
          </h3>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Aseguramos que cada plato sea seguro y delicioso para todos tus
            invitados
          </p>
        </div>
      </div>

      {/* Chef Experience Badge */}
      <div
        className={`relative bg-gradient-to-br ${theme.lightGradient} rounded-3xl p-8 border border-${theme.borderColor} shadow-xl overflow-hidden`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} opacity-50`}
        ></div>
        <div className='relative z-10 flex items-center space-x-6'>
          <div
            className={`w-16 h-16 bg-gradient-to-br ${theme.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
          >
            <ChefIcon className='w-8 h-8 text-white' />
          </div>
          <div className='flex-1'>
            <div className='flex items-center space-x-3 mb-2'>
              <h4 className={`text-xl font-bold text-${theme.textColor}`}>
                {theme.experience} {theme.name}
              </h4>
              <div
                className={`px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-${theme.borderColor}`}
              >
                <span
                  className={`text-sm font-semibold text-${theme.textColor}`}
                >
                  Especializado
                </span>
              </div>
            </div>
            <p className='text-gray-700 leading-relaxed'>{theme.description}</p>
          </div>
        </div>
      </div>

      {/* Quick Selection */}
      <div className='space-y-6'>
        <div className='text-center'>
          <h4 className='text-2xl font-semibold text-gray-900 mb-2'>
            Restricciones Comunes
          </h4>
          <p className='text-gray-600'>
            Selecciona todas las que apliquen para ti y tus invitados
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {commonRestrictions.map((restriction) => {
            const isSelected = selectedRestrictions.includes(restriction.id);
            return (
              <button
                key={restriction.id}
                type='button'
                onClick={() => handleQuickRestriction(restriction)}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  isSelected
                    ? `border-${restriction.color}-400 bg-${restriction.color}-50 shadow-lg`
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {isSelected && (
                  <div
                    className={`absolute -top-2 -right-2 w-6 h-6 bg-${restriction.color}-500 rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <CheckCircle2 className='w-4 h-4 text-white' />
                  </div>
                )}

                <div className='text-center space-y-3'>
                  <div className='text-3xl mb-2'>{restriction.icon}</div>
                  <div
                    className={`font-semibold text-sm transition-colors ${
                      isSelected
                        ? `text-${restriction.color}-700`
                        : 'text-gray-700 group-hover:text-gray-900'
                    }`}
                  >
                    {restriction.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Severe Allergies Alert */}
      <div className='bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden'>
        <div className='bg-gradient-to-r from-red-50 to-orange-50 px-8 py-6 border-b border-red-100'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center'>
              <AlertTriangle className='w-5 h-5 text-white' />
            </div>
            <div>
              <h4 className='text-lg font-semibold text-gray-900'>
                Protocolo de Alergias Severas
              </h4>
              <p className='text-sm text-gray-600'>
                Para alergias que requieren protocolos especiales de seguridad
              </p>
            </div>
          </div>
        </div>

        <div className='p-8'>
          <label className='flex items-start space-x-4 cursor-pointer'>
            <input
              type='checkbox'
              id='hasAllergies'
              name='hasAllergies'
              checked={formData.hasAllergies || false}
              onChange={onChange}
              className={`mt-1 h-5 w-5 text-red-600 focus:ring-red-500 border-red-300 rounded-lg transition-all duration-200`}
            />
            <div className='flex-1'>
              <div className='font-semibold text-red-700 text-lg mb-2'>
                ⚠️ Tengo o mis invitados tienen alergias severas
              </div>
              <p className='text-gray-700 leading-relaxed'>
                To help us better prepare for your stay, we kindly ask that you
                inform us in advance of any food or environmental allergies
                affecting anyone in your group. This information allows us to
                communicate relevant details to service providers such as chefs
                or housekeeping, and to help ensure your comfort throughout your
                visit. Sharing this in advance is the best way to support a
                smooth and enjoyable experience for everyone.
              </p>

              {formData.chefType === 'professional' && (
                <div className='mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200'>
                  <div className='flex items-center space-x-2'>
                    <Crown className='w-5 h-5 text-purple-600' />
                    <span className='font-medium text-purple-700'>
                      Protocolo Profesional
                    </span>
                  </div>
                  <p className='text-purple-600 text-sm mt-1'>
                    Seguimos estándares profesionales de prevención de
                    contaminación cruzada con utensilios y áreas de preparación
                    dedicados.
                  </p>
                </div>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Summary Section */}
      {(formData.dietaryRestrictions || selectedRestrictions.length > 0) && (
        <div
          className={`bg-gradient-to-br ${theme.lightGradient} rounded-3xl p-8 border-2 border-${theme.borderColor} shadow-2xl`}
        >
          <div className='text-center mb-6'>
            <h4 className={`text-2xl font-bold text-${theme.textColor} mb-2`}>
              Restricciones Registradas
            </h4>
            <p className='text-gray-700'>
              Tu {theme.name} está completamente informado y preparado
            </p>
          </div>

          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 space-y-4'>
            {selectedRestrictions.length > 0 && (
              <div>
                <h5 className='font-semibold text-gray-900 mb-3'>
                  Restricciones Seleccionadas:
                </h5>
                <div className='flex flex-wrap gap-2'>
                  {selectedRestrictions.map((id) => {
                    const restriction = commonRestrictions.find(
                      (r) => r.id === id
                    );
                    return restriction ? (
                      <span
                        key={id}
                        className={`inline-flex items-center space-x-2 px-3 py-1 bg-${restriction.color}-100 text-${restriction.color}-800 rounded-full text-sm font-medium border border-${restriction.color}-200`}
                      >
                        <span>{restriction.icon}</span>
                        <span>{restriction.name}</span>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {formData.customDietaryRestrictions && (
              <div>
                <h5 className='font-semibold text-gray-900 mb-2'>
                  Detalles Adicionales:
                </h5>
                <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
                  <p className='text-gray-700 leading-relaxed'>
                    {formData.customDietaryRestrictions}
                  </p>
                </div>
              </div>
            )}

            {formData.hasAllergies && (
              <div className='flex items-center space-x-3 p-4 bg-red-50 rounded-xl border border-red-200'>
                <AlertTriangle className='w-5 h-5 text-red-600' />
                <span className='font-medium text-red-700'>
                  Protocolos especiales para alergias severas activados
                </span>
              </div>
            )}
          </div>

          <div className='mt-6 text-center'>
            <div
              className={`inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white rounded-2xl shadow-lg`}
            >
              <Shield className='w-6 h-6' />
              <div className='text-left'>
                <div className='font-bold'>Información Segura</div>
                <div className='text-sm opacity-90'>
                  Chef completamente informado
                </div>
              </div>
              <CheckCircle2 className='w-6 h-6' />
            </div>
          </div>
        </div>
      )}

      {/* Safety Information */}
      {/* <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200 shadow-lg'>
        <div className='flex items-start space-x-6'>
          <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0'>
            <Info className='w-8 h-8 text-white' />
          </div>
          <div className='space-y-4'>
            <h4 className='font-bold text-blue-900 text-xl'>
              Nuestro Compromiso con la Seguridad Alimentaria
            </h4>
            <p className='text-blue-800 leading-relaxed'>
              {formData.chefType === 'professional'
                ? 'Nuestros chefs experimentados tienen certificación en seguridad alimentaria y experiencia trabajando con restricciones dietéticas complejas. Utilizamos técnicas profesionales para prevenir la contaminación cruzada.'
                : 'Nuestros chefs toman muy en serio todas las restricciones dietéticas. Con experiencia en cocina familiar, adaptan cuidadosamente cada receta para garantizar una comida segura y deliciosa.'}
            </p>
            <div className='grid md:grid-cols-2 gap-4'>
              {[
                'Verificación rigurosa de ingredientes',
                'Prevención de contaminación cruzada',
                'Utensilios y superficies dedicados',
                'Comunicación clara sobre ingredientes',
              ].map((item, index) => (
                <div key={index} className='flex items-center space-x-2'>
                  <CheckCircle2 className='w-5 h-5 text-blue-600 flex-shrink-0' />
                  <span className='text-sm text-blue-800'>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DietaryRestrictionsStep;
