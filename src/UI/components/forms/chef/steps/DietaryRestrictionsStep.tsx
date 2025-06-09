import React from 'react';
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

  // Get chef theme
  const getChefTheme = () => {
    if (formData.chefType === 'professional') {
      return {
        name: 'Chef Experimentado',
        primaryColor: 'purple',
        secondaryColor: 'indigo',
        accentColor: 'blue',
        gradient: 'from-purple-500 via-indigo-600 to-blue-500',
        lightGradient: 'from-purple-50 via-white to-indigo-50',
        textColor: 'purple-800',
        borderColor: 'purple-200',
        shadow: 'shadow-purple-500/25',
        selectedBg: 'bg-purple-50',
        selectedBorder: 'border-purple-500',
        iconColor: 'text-purple-600',
        buttonGradient: 'from-purple-500 to-indigo-600',
        cardBg: 'from-purple-100 to-indigo-100',
        experience: 'Premium',
        description: 'Atención especializada a restricciones dietéticas',
        expertise:
          'Nuestros chefs experimentados tienen experiencia trabajando con las restricciones más complejas',
      };
    } else {
      return {
        name: 'Chef Regular',
        primaryColor: 'orange',
        secondaryColor: 'amber',
        accentColor: 'yellow',
        gradient: 'from-orange-500 via-amber-500 to-yellow-400',
        lightGradient: 'from-orange-50 via-white to-amber-50',
        textColor: 'orange-800',
        borderColor: 'orange-200',
        shadow: 'shadow-orange-500/25',
        selectedBg: 'bg-orange-50',
        selectedBorder: 'border-orange-500',
        iconColor: 'text-orange-600',
        buttonGradient: 'from-orange-500 to-amber-500',
        cardBg: 'from-orange-100 to-amber-100',
        experience: 'Auténtica',
        description: 'Adaptación cuidadosa de recetas tradicionales',
        expertise:
          'Nuestros chefs regulares adaptan recetas familiares para cumplir con tus necesidades dietéticas',
      };
    }
  };

  const theme = getChefTheme();

  // Common dietary restrictions for quick selection
  const commonRestrictions = [
    { id: 'vegetarian', name: 'Vegetariano', icon: '🥬' },
    { id: 'vegan', name: 'Vegano', icon: '🌱' },
    { id: 'gluten-free', name: 'Sin Gluten', icon: '🌾' },
    { id: 'dairy-free', name: 'Sin Lácteos', icon: '🥛' },
    { id: 'nut-allergies', name: 'Alergia a Frutos Secos', icon: '🥜' },
    { id: 'seafood-allergies', name: 'Alergia a Mariscos', icon: '🦐' },
  ];

  const handleQuickRestriction = (restriction: string) => {
    const currentRestrictions = formData.dietaryRestrictions || '';
    const newRestrictions = currentRestrictions
      ? `${currentRestrictions}, ${restriction}`
      : restriction;

    onChange({
      target: {
        name: 'dietaryRestrictions',
        value: newRestrictions,
      },
    } as any);
  };

  return (
    <div className='space-y-12'>
      {/* Themed Header */}
      <div className='relative text-center space-y-6 py-8'>
        <div
          className={`absolute inset-0 bg-gradient-to-r ${theme.lightGradient} rounded-3xl -mx-4`}
        ></div>
        <div className='relative z-10'>
          <div
            className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${theme.gradient} rounded-full mb-6 shadow-2xl ${theme.shadow}`}
          >
            <Shield className='w-10 h-10 text-white drop-shadow-lg' />
          </div>
          <h3 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4'>
            Restricciones Dietéticas
          </h3>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light'>
            Con tu{' '}
            <span className={`font-bold text-${theme.textColor}`}>
              {theme.experience} {theme.name}
            </span>
            , cada restricción dietética es tratada con el máximo cuidado y
            profesionalismo.
          </p>
        </div>
      </div>

      {/* Chef Type Indicator */}
      <div
        className={`p-6 bg-gradient-to-r ${theme.cardBg} rounded-2xl border border-${theme.borderColor} shadow-lg`}
      >
        <div className='flex items-center space-x-4'>
          <div
            className={`w-16 h-16 bg-gradient-to-r ${theme.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
          >
            {formData.chefType === 'professional' ? (
              <Crown className='w-8 h-8 text-white' />
            ) : (
              <Heart className='w-8 h-8 text-white' />
            )}
          </div>
          <div className='flex-1'>
            <h4 className={`text-xl font-bold text-${theme.textColor} mb-1`}>
              {theme.description}
            </h4>
            <p className='text-gray-700'>{theme.expertise}</p>
          </div>
          <div
            className={`px-4 py-2 bg-white rounded-xl border border-${theme.borderColor} ${theme.iconColor} font-semibold`}
          >
            ✓ Especializado
          </div>
        </div>
      </div>

      {/* Quick Selection for Common Restrictions */}
      <div className='space-y-6'>
        <div className='text-center'>
          <h4 className='text-2xl font-bold text-gray-900 mb-2'>
            Restricciones Comunes
          </h4>
          <p className='text-gray-600'>
            Selecciona rápidamente las restricciones más comunes
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {commonRestrictions.map((restriction) => (
            <button
              key={restriction.id}
              type='button'
              onClick={() => handleQuickRestriction(restriction.name)}
              className={`group p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg border-gray-200 hover:border-${theme.borderColor} bg-white hover:${theme.selectedBg}`}
            >
              <div className='text-center space-y-2'>
                <div className='text-3xl'>{restriction.icon}</div>
                <div
                  className={`font-semibold text-gray-900 group-hover:text-${theme.textColor}`}
                >
                  {restriction.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dietary Restrictions Input */}
      <div className='space-y-6'>
        <div className='space-y-4'>
          <label className='flex items-center text-xl font-bold text-gray-900 mb-4'>
            <div
              className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center mr-4 shadow-lg`}
            >
              <AlertCircle className='w-6 h-6 text-white' />
            </div>
            Detalles de Restricciones y Alergias
          </label>

          <div className='relative'>
            <textarea
              name='dietaryRestrictions'
              value={formData.dietaryRestrictions}
              onChange={onChange}
              placeholder={`Describe en detalle cualquier alergia, intolerancia o preferencia dietética. ${
                formData.chefType === 'professional'
                  ? 'Nuestro chef experimentado puede adaptar técnicas culinarias profesionales para cualquier restricción.'
                  : 'Nuestro chef adaptará cuidadosamente las recetas para cumplir con tus necesidades.'
              }`}
              className={`w-full p-6 text-lg border-2 ${
                errors.dietaryRestrictions
                  ? 'border-red-400 bg-red-50'
                  : `border-gray-200 hover:border-${theme.borderColor} focus:border-${theme.primaryColor}-500`
              } rounded-2xl focus:ring-4 focus:ring-${
                theme.primaryColor
              }-500/20 transition-all duration-300 bg-white shadow-lg min-h-[200px] resize-none`}
            />
            {formData.dietaryRestrictions && (
              <div className='absolute top-6 right-6'>
                <CheckCircle2 className='w-6 h-6 text-green-500' />
              </div>
            )}
          </div>

          {errors.dietaryRestrictions && (
            <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200'>
              <AlertCircle className='w-5 h-5' />
              <p className='font-medium'>{errors.dietaryRestrictions}</p>
            </div>
          )}

          <div className='flex justify-between items-center text-sm'>
            <p className='text-gray-500'>
              {formData.dietaryRestrictions
                ? `${formData.dietaryRestrictions.length}/500 caracteres`
                : 'Opcional, pero altamente recomendado si aplica'}
            </p>
            {formData.dietaryRestrictions &&
              formData.dietaryRestrictions.length > 400 && (
                <p className={`text-${theme.textColor} font-medium`}>
                  {500 - formData.dietaryRestrictions.length} caracteres
                  restantes
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Severe Allergies Checkbox */}
      <div
        className={`p-6 bg-gradient-to-r ${theme.cardBg} rounded-2xl border-2 border-${theme.borderColor} shadow-lg`}
      >
        <div className='flex items-start space-x-4'>
          <input
            type='checkbox'
            id='hasAllergies'
            name='hasAllergies'
            checked={formData.hasAllergies}
            onChange={onChange}
            className={`mt-1 h-6 w-6 text-${theme.primaryColor}-700 focus:ring-${theme.primaryColor}-500 border-${theme.borderColor} rounded-lg`}
          />
          <div className='flex-1'>
            <label
              htmlFor='hasAllergies'
              className={`font-bold text-${theme.textColor} text-lg cursor-pointer`}
            >
              ⚠️ Alergias Severas o Anafilaxis
            </label>
            <p className={`text-${theme.textColor} mt-2 text-sm`}>
              Marca esta casilla si tienes o alguno de tus invitados tiene
              alergias severas que requieren atención especial y protocolos de
              seguridad alimentaria.
            </p>
            {formData.chefType === 'professional' && (
              <div className='mt-3 p-3 bg-white/80 rounded-xl border border-white/50'>
                <p className='text-purple-700 text-sm font-medium'>
                  ✨ Como chef experimentado, seguimos protocolos profesionales
                  de prevención de contaminación cruzada.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-lg'>
        <div className='flex items-start space-x-6'>
          <div className='flex-shrink-0'>
            <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg'>
              <Info className='w-8 h-8 text-white' />
            </div>
          </div>
          <div className='flex-1 space-y-4'>
            <h4 className='font-bold text-blue-900 text-xl'>
              Compromiso con la Seguridad Alimentaria
            </h4>
            <div className='space-y-3 text-blue-800'>
              <p className='leading-relaxed'>
                {formData.chefType === 'professional' ? (
                  <>
                    Nuestros chefs experimentados tienen certificación en
                    seguridad alimentaria y experiencia trabajando con las
                    restricciones dietéticas más complejas. Utilizamos técnicas
                    profesionales para prevenir la contaminación cruzada.
                  </>
                ) : (
                  <>
                    Nuestros chefs regulares toman muy en serio todas las
                    restricciones dietéticas. Con experiencia en cocina
                    familiar, adaptan cuidadosamente cada receta para garantizar
                    una comida segura y deliciosa.
                  </>
                )}
              </p>
              <div className='grid md:grid-cols-2 gap-4 mt-4'>
                <div className='flex items-center space-x-2'>
                  <CheckCircle2 className='w-5 h-5 text-blue-600' />
                  <span className='text-sm'>Verificación de ingredientes</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <CheckCircle2 className='w-5 h-5 text-blue-600' />
                  <span className='text-sm'>
                    Prevención de contaminación cruzada
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <CheckCircle2 className='w-5 h-5 text-blue-600' />
                  <span className='text-sm'>
                    Utensilios y superficies dedicados
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <CheckCircle2 className='w-5 h-5 text-blue-600' />
                  <span className='text-sm'>
                    Comunicación clara sobre ingredientes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Children Dietary Preferences */}
      {formData.childrenCount > 0 && (
        <div
          className={`p-6 bg-gradient-to-r ${theme.cardBg} rounded-2xl border border-${theme.borderColor} shadow-lg`}
        >
          <div className='flex items-start space-x-4'>
            <div
              className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}
            >
              <Heart className='w-6 h-6 text-white' />
            </div>
            <div>
              <h4 className={`font-bold text-${theme.textColor} text-lg mb-2`}>
                Preferencias Dietéticas para Niños
              </h4>
              <p className={`text-${theme.textColor} leading-relaxed`}>
                Si tus niños tienen preferencias alimentarias específicas,
                aversiones o restricciones dietéticas, por favor menciónalo en
                el campo anterior.
                {formData.chefType === 'professional' ? (
                  <>
                    {' '}
                    Nuestros chefs experimentados pueden preparar opciones
                    kid-friendly sofisticadas que cumplan con cualquier
                    restricción.
                  </>
                ) : (
                  <>
                    {' '}
                    Nuestros chefs pueden adaptar recetas familiares para crear
                    opciones que los niños amen.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section if restrictions are provided */}
      {formData.dietaryRestrictions && (
        <div
          className={`p-8 bg-gradient-to-r ${theme.lightGradient} rounded-3xl border-2 border-${theme.borderColor} shadow-2xl ${theme.shadow}`}
        >
          <div className='text-center mb-6'>
            <h4 className={`text-2xl font-bold text-${theme.textColor} mb-2`}>
              Restricciones Registradas
            </h4>
            <p className='text-gray-700'>
              Tu {theme.name} está preparado para estas necesidades
            </p>
          </div>

          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50'>
            <div className='flex items-start space-x-4'>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                <Shield className='w-6 h-6 text-white' />
              </div>
              <div className='flex-1'>
                <h5 className='font-bold text-gray-900 mb-2'>
                  Información Proporcionada:
                </h5>
                <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
                  <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                    {formData.dietaryRestrictions}
                  </p>
                </div>
                {formData.hasAllergies && (
                  <div className='mt-4 flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200'>
                    <AlertCircle className='w-5 h-5' />
                    <span className='font-medium'>
                      Protocolos especiales para alergias severas activados
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='mt-6 text-center'>
            <div
              className={`inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white rounded-2xl shadow-lg`}
            >
              <Shield className='w-8 h-8' />
              <div>
                <h5 className='font-bold text-xl'>Información Segura</h5>
                <p className='opacity-90'>
                  Tu chef está completamente informado
                </p>
              </div>
              <Sparkles className='w-6 h-6' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietaryRestrictionsStep;
