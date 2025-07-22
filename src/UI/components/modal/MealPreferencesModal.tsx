import React, { useState, useEffect } from 'react';
import {
  X,
  Coffee,
  Sun,
  Moon,
  Crown,
  ChefHat,
  Utensils,
  Save,
  AlertCircle,
} from 'lucide-react';

interface MealPreference {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  preferences: string;
  dietaryRestrictions: string;
  specialRequests: string;
}

interface MealPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: 'breakfast' | 'lunch' | 'dinner' | null;
  existingPreference?: MealPreference;
  onSave: (preference: MealPreference) => void;
  chefType: 'professional' | 'standard';
}

const MealPreferencesModal: React.FC<MealPreferencesModalProps> = ({
  isOpen,
  onClose,
  mealType,
  existingPreference,
  onSave,
  chefType,
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    preferences: '',
    dietaryRestrictions: '',
    specialRequests: '',
  });

  // Estado de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Configuración del tema basado en el tipo de chef
  const getTheme = () => {
    if (chefType === 'professional') {
      return {
        gradient: 'from-purple-500 via-indigo-600 to-blue-500',
        lightGradient: 'from-purple-50 via-white to-indigo-50',
        primary: 'purple-600',
        border: 'purple-200',
        text: 'purple-800',
      };
    }
    return {
      gradient: 'from-orange-500 via-amber-500 to-yellow-400',
      lightGradient: 'from-orange-50 via-white to-amber-50',
      primary: 'orange-600',
      border: 'orange-200',
      text: 'orange-800',
    };
  };

  // Configuración específica por tipo de comida
  const getMealConfig = () => {
    const configs = {
      breakfast: {
        title: 'Preferencias de Desayuno',
        icon: <Coffee className='w-6 h-6' />,
        gradient: 'from-amber-400 to-orange-500',
        examples: [
          'Huevos benedictinos',
          'Pancakes con frutas',
          'Avocado toast',
          'Smoothie bowls',
        ],
        placeholder:
          'Ejemplo: Me encanta el café colombiano, prefiero huevos revueltos con aguacate y pan tostado integral...',
      },
      lunch: {
        title: 'Preferencias de Almuerzo',
        icon: <Sun className='w-6 h-6' />,
        gradient: 'from-orange-400 to-red-500',
        examples: [
          'Ensaladas gourmet',
          'Pasta fresca',
          'Mariscos',
          'Carnes a la parrilla',
        ],
        placeholder:
          'Ejemplo: Disfruto de ensaladas frescas con proteína, pasta casera, o pescados a la plancha...',
      },
      dinner: {
        title: 'Preferencias de Cena',
        icon: <Moon className='w-6 h-6' />,
        gradient: 'from-purple-500 to-indigo-600',
        examples: [
          'Cortes premium',
          'Mariscos frescos',
          'Risottos',
          'Postres artesanales',
        ],
        placeholder:
          'Ejemplo: Me gusta la carne roja término medio, mariscos frescos, y siempre espacio para postre...',
      },
    };
    return configs[mealType || 'breakfast'];
  };

  const theme = getTheme();
  const mealConfig = getMealConfig();

  // Inicializar datos del formulario
  useEffect(() => {
    if (existingPreference) {
      setFormData({
        preferences: existingPreference.preferences,
        dietaryRestrictions: existingPreference.dietaryRestrictions,
        specialRequests: existingPreference.specialRequests,
      });
    } else {
      setFormData({
        preferences: '',
        dietaryRestrictions: '',
        specialRequests: '',
      });
    }
    setErrors({});
  }, [existingPreference, isOpen]);

  // Manejar cambios en el formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error si existe
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.preferences.trim()) {
      newErrors.preferences = 'Por favor, describe tus preferencias de menú';
    } else if (formData.preferences.trim().length < 10) {
      newErrors.preferences =
        'Por favor, proporciona más detalles (mínimo 10 caracteres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar guardado
  const handleSave = () => {
    if (!validateForm() || !mealType) return;

    const preference: MealPreference = {
      mealType,
      preferences: formData.preferences.trim(),
      dietaryRestrictions: formData.dietaryRestrictions.trim(),
      specialRequests: formData.specialRequests.trim(),
    };

    onSave(preference);
    onClose();
  };

  // Agregar ejemplo al campo de preferencias
  const addExample = (example: string) => {
    const currentValue = formData.preferences;
    const newValue = currentValue ? `${currentValue}, ${example}` : example;

    setFormData((prev) => ({
      ...prev,
      preferences: newValue,
    }));
  };

  if (!isOpen || !mealType) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${mealConfig.gradient} p-6 rounded-t-3xl relative`}
        >
          <button
            onClick={onClose}
            className='absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-white' />
          </button>

          <div className='flex items-center space-x-4'>
            <div className='p-3 bg-white/20 rounded-xl'>{mealConfig.icon}</div>
            <div>
              <h2 className='text-2xl font-bold text-white'>
                {mealConfig.title}
              </h2>
              <p className='text-white/90'>
                Personaliza tu experiencia culinaria
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Información del chef */}
          <div
            className={`p-4 bg-gradient-to-r ${theme.lightGradient} rounded-xl border border-${theme.border}`}
          >
            <div className='flex items-center space-x-3'>
              <ChefHat className={`w-5 h-5 text-${theme.primary}`} />
              <span className={`font-semibold text-${theme.text}`}>
                Chef {chefType === 'professional' ? 'Profesional' : 'Estándar'}{' '}
                -
                {chefType === 'professional'
                  ? ' Experiencia Premium'
                  : ' Cocina Auténtica'}
              </span>
            </div>
          </div>

          {/* Preferencias principales */}
          <div className='space-y-3'>
            <label className='block text-lg font-semibold text-gray-800'>
              ¿Qué te gustaría{' '}
              {mealType === 'breakfast'
                ? 'desayunar'
                : mealType === 'lunch'
                ? 'almorzar'
                : 'cenar'}
              ? *
            </label>
            <textarea
              name='preferences'
              value={formData.preferences}
              onChange={handleChange}
              placeholder={mealConfig.placeholder}
              rows={4}
              className={`w-full p-4 border-2 ${
                errors.preferences
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 focus:border-blue-500'
              } rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 resize-none`}
            />
            {errors.preferences && (
              <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl'>
                <AlertCircle className='w-4 h-4' />
                <span className='text-sm'>{errors.preferences}</span>
              </div>
            )}
          </div>

          {/* Ejemplos sugeridos */}
          <div className='space-y-3'>
            <h4 className='font-semibold text-gray-800'>
              Sugerencias populares:
            </h4>
            <div className='grid grid-cols-2 gap-2'>
              {mealConfig.examples.map((example, index) => (
                <button
                  key={index}
                  type='button'
                  onClick={() => addExample(example)}
                  className='p-3 text-left border border-gray-200 hover:border-blue-300 rounded-xl hover:bg-blue-50 transition-colors text-sm'
                >
                  + {example}
                </button>
              ))}
            </div>
          </div>

          {/* Restricciones dietéticas */}
          <div className='space-y-3'>
            <label className='block font-semibold text-gray-800'>
              Restricciones dietéticas o alergias
            </label>
            <input
              type='text'
              name='dietaryRestrictions'
              value={formData.dietaryRestrictions}
              onChange={handleChange}
              placeholder='Ejemplo: Vegetariano, sin gluten, alérgico a los mariscos...'
              className='w-full p-4 border-2 border-gray-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-300'
            />
          </div>

          {/* Solicitudes especiales */}
          <div className='space-y-3'>
            <label className='block font-semibold text-gray-800'>
              Solicitudes especiales
            </label>
            <textarea
              name='specialRequests'
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder='Ejemplo: Presentación especial, ingredientes orgánicos, maridaje con vinos...'
              rows={3}
              className='w-full p-4 border-2 border-gray-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 resize-none'
            />
          </div>
        </div>

        {/* Footer */}
        <div className='p-6 border-t border-gray-200 flex space-x-3'>
          <button
            onClick={onClose}
            className='flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium'
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 px-6 py-3 bg-gradient-to-r ${mealConfig.gradient} text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center space-x-2`}
          >
            <Save className='w-5 h-5' />
            <span>Guardar Preferencias</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealPreferencesModal;
