import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Users,
  Utensils,
  MessageCircle,
  Calendar,
  Check,
  Coffee,
  Sun,
  Moon,
  Plus,
  Minus,
  Sparkles,
  Star,
  Crown,
} from 'lucide-react';

export interface DayServiceConfig {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'full-day' | ''; // ✅ Agregamos full-day
  mealTypes?: ('breakfast' | 'lunch' | 'dinner')[]; // ✅ Para múltiples comidas
  menuType:
    | 'standard'
    | 'mediterranean'
    | 'italian'
    | 'asian'
    | 'mexican'
    | 'custom'
    | '';
  customMenuType?: string; // ✅ Para menú personalizado
  specificTime: string;
  specificTimes?: string[]; // ✅ Para múltiples horarios
  guestCount: number;
  specialRequest: string;
}

interface MultipleDaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  existingConfig?: DayServiceConfig;
  onSave: (config: DayServiceConfig) => void;
  chefType: 'standard' | 'professional';
}

const MultipleDaysModal: React.FC<MultipleDaysModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  existingConfig,
  onSave,
  chefType,
}) => {
  const [config, setConfig] = useState<DayServiceConfig>({
    date: selectedDate,
    mealType: '',
    mealTypes: [],
    menuType: '',
    customMenuType: '',
    specificTime: '',
    specificTimes: [],
    guestCount: 2,
    specialRequest: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get chef theme for visual consistency
  const getChefTheme = () => {
    if (chefType === 'professional') {
      return {
        gradient: 'from-purple-600 via-indigo-600 to-blue-600',
        lightGradient: 'from-purple-50 to-indigo-50',
        accentColor: 'purple',
        name: 'Chef Experimentado',
      };
    } else {
      return {
        gradient: 'from-orange-600 via-amber-600 to-yellow-500',
        lightGradient: 'from-orange-50 to-amber-50',
        accentColor: 'orange',
        name: 'Chef Regular',
      };
    }
  };

  const theme = getChefTheme();

  // ✅ Enhanced meal types with Full Day option
  const mealTypes = [
    {
      id: 'breakfast',
      name: 'Desayuno',
      time: '8:00 AM',
      icon: Coffee,
      gradient: 'from-amber-400 to-orange-500',
      bgImage:
        'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Comienza el día perfecto',
    },
    {
      id: 'lunch',
      name: 'Comida',
      time: '1:00 PM',
      icon: Sun,
      gradient: 'from-orange-400 to-red-500',
      bgImage:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Disfruta del mediodía',
    },
    {
      id: 'dinner',
      name: 'Cena',
      time: '7:00 PM',
      icon: Moon,
      gradient: 'from-purple-500 to-indigo-600',
      bgImage:
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Noche memorable',
    },
    {
      id: 'full-day',
      name: 'Día Completo',
      time: 'Todo el día',
      icon: Crown,
      gradient: 'from-emerald-500 to-teal-600',
      bgImage:
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Desayuno, comida y cena',
      premium: true,
    },
  ];

  // ✅ Enhanced menu options for both chef types
  const getMenuOptions = () => {
    const baseOptions = [
      {
        id: 'mediterranean',
        name: 'Mediterráneo',
        emoji: '🫒',
        description: 'Sabores del mar',
        bgImage:
          'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'italian',
        name: 'Italiano',
        emoji: '🍝',
        description: 'Pastas artesanales',
        bgImage:
          'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'asian',
        name: 'Asiático',
        emoji: '🍜',
        description: 'Equilibrio perfecto',
        bgImage:
          'https://images.unsplash.com/photo-1617093727343-374698b1b08d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'mexican',
        name: 'Mexicano',
        emoji: '🌮',
        description: 'Especias vibrantes',
        bgImage:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'custom',
        name: 'Personalizado',
        emoji: '👨‍🍳',
        description: 'Tu estilo favorito',
        bgImage:
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        isCustom: true,
      },
    ];

    if (chefType === 'standard') {
      // Solo mostrar opción personalizada para chef regular
      return baseOptions.filter((option) => option.id === 'custom');
    }

    return baseOptions;
  };

  const menuOptions = getMenuOptions();

  // Update config when modal opens
  useEffect(() => {
    if (isOpen) {
      if (existingConfig) {
        setConfig(existingConfig);
      } else {
        setConfig({
          date: selectedDate,
          mealType: '',
          mealTypes: [],
          menuType: '',
          customMenuType: '',
          specificTime: '',
          specificTimes: [],
          guestCount: 2,
          specialRequest: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, selectedDate, existingConfig]);

  // ✅ Handle meal type selection (multiple or single)
  const handleMealTypeSelection = (mealId: string) => {
    if (mealId === 'full-day') {
      // Full day includes all meals
      setConfig((prev) => ({
        ...prev,
        mealType: 'full-day',
        mealTypes: ['breakfast', 'lunch', 'dinner'],
        specificTimes: ['8:00 AM', '1:00 PM', '7:00 PM'],
      }));
    } else {
      // Individual meal or toggle
      const currentMealTypes = config.mealTypes || [];
      let newMealTypes: ('breakfast' | 'lunch' | 'dinner')[];

      if (currentMealTypes.includes(mealId as any)) {
        // Remove if already selected
        newMealTypes = currentMealTypes.filter((meal) => meal !== mealId);
      } else {
        // Add if not selected
        newMealTypes = [...currentMealTypes, mealId] as (
          | 'breakfast'
          | 'lunch'
          | 'dinner'
        )[];
      }

      // Update times based on selected meals
      const specificTimes = newMealTypes.map((meal) => {
        const mealInfo = mealTypes.find((m) => m.id === meal);
        return mealInfo?.time || '';
      });

      setConfig((prev) => ({
        ...prev,
        mealType: newMealTypes.length === 1 ? newMealTypes[0] : '',
        mealTypes: newMealTypes,
        specificTimes,
      }));
    }

    if (errors.mealType) {
      setErrors((prev) => ({ ...prev, mealType: '' }));
    }
  };

  // ✅ Handle menu type selection
  const handleMenuTypeSelection = (menuId: string) => {
    setConfig((prev) => ({
      ...prev,
      menuType: menuId,
      customMenuType: menuId === 'custom' ? prev.customMenuType : '',
    }));

    if (errors.menuType) {
      setErrors((prev) => ({ ...prev, menuType: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (
      !config.mealType &&
      (!config.mealTypes || config.mealTypes.length === 0)
    ) {
      newErrors.mealType = 'Selecciona al menos un momento del día';
    }

    if (!config.menuType) {
      newErrors.menuType = 'Selecciona un estilo de cocina';
    }

    if (config.menuType === 'custom' && !config.customMenuType?.trim()) {
      newErrors.customMenuType = 'Especifica tu estilo de cocina personalizado';
    }

    if (config.guestCount < 1) {
      newErrors.guestCount = 'Mínimo 1 persona';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(config);
      onClose();
    }
  };

  const updateGuestCount = (increment: boolean) => {
    setConfig((prev) => ({
      ...prev,
      guestCount: increment
        ? Math.min(10, prev.guestCount + 1)
        : Math.max(1, prev.guestCount - 1),
    }));
    if (errors.guestCount) {
      setErrors((prev) => ({ ...prev, guestCount: '' }));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl md:mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300'>
        {/* Enhanced Header */}
        <div className='relative overflow-hidden rounded-t-3xl md:rounded-t-3xl'>
          <div className='absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'></div>
          <div className='relative z-10 p-6 text-white'>
            <div className='flex justify-between items-start mb-4'>
              <div className='flex items-center space-x-4'>
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${theme.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <Calendar className='w-7 h-7 text-white' />
                </div>
                <div>
                  <h2 className='text-2xl font-bold'>Configurar Día</h2>
                  <p className='text-gray-300 capitalize'>
                    {formatDate(selectedDate)}
                  </p>
                  <div className='flex items-center space-x-2 mt-1'>
                    <Star className='w-4 h-4 text-amber-400' />
                    <span className='text-sm text-amber-200'>{theme.name}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className='w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>

        <div className='p-6 space-y-8'>
          {/* ✅ Enhanced Meal Type Selection with Multiple Options */}
          <div>
            <div className='flex items-center space-x-3 mb-4'>
              <div
                className={`w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-lg flex items-center justify-center`}
              >
                <Clock className='w-5 h-5 text-white' />
              </div>
              <h3 className='text-lg font-bold text-gray-900'>
                ¿Qué momento del día?
              </h3>
              <span className='text-red-500'>*</span>
            </div>

            <div className='mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200'>
              <p className='text-blue-800 text-sm font-medium'>
                💡 Puedes seleccionar uno o varios momentos del día, o elegir
                "Día Completo" para una experiencia gastronómica completa.
              </p>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {mealTypes.map((meal) => {
                const isSelected =
                  config.mealType === meal.id ||
                  (config.mealTypes &&
                    config.mealTypes.includes(meal.id as any)) ||
                  (config.mealType === 'full-day' && meal.id !== 'full-day');

                return (
                  <div
                    key={meal.id}
                    onClick={() => handleMealTypeSelection(meal.id)}
                    className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? 'ring-4 ring-amber-400 ring-opacity-50 scale-105 shadow-xl'
                        : 'hover:shadow-lg'
                    }`}
                  >
                    <div className='relative h-24'>
                      <img
                        src={meal.bgImage}
                        alt={meal.name}
                        className='w-full h-full object-cover'
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${meal.gradient} opacity-80`}
                      />

                      {/* Premium badge for full day */}
                      {meal.premium && (
                        <div className='absolute top-2 left-2'>
                          <div className='bg-amber-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs'>
                            <Crown className='w-3 h-3' />
                            <span>Premium</span>
                          </div>
                        </div>
                      )}

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className='absolute top-2 right-2'>
                          <div className='w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg'>
                            <Check className='w-4 h-4 text-green-600' />
                          </div>
                        </div>
                      )}

                      {/* Content overlay */}
                      <div className='absolute inset-0 flex items-center justify-center text-white p-3'>
                        <div className='text-center'>
                          <meal.icon className='w-6 h-6 mx-auto mb-1' />
                          <h4 className='font-bold text-xs'>{meal.name}</h4>
                          <p className='text-xs opacity-90'>{meal.time}</p>
                          <p className='text-xs opacity-75 mt-1'>
                            {meal.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected meals summary */}
            {(config.mealTypes && config.mealTypes.length > 0) ||
              (config.mealType === 'full-day' && (
                <div className='mt-4 p-4 bg-green-50 rounded-xl border border-green-200'>
                  <h5 className='font-bold text-green-800 mb-2'>
                    Momentos seleccionados:
                  </h5>
                  <div className='flex flex-wrap gap-2'>
                    {config.mealType === 'full-day' ? (
                      <span className='px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium flex items-center space-x-1'>
                        <Crown className='w-4 h-4' />
                        <span>Día Completo</span>
                      </span>
                    ) : (
                      config.mealTypes?.map((mealTypeId) => {
                        const meal = mealTypes.find((m) => m.id === mealTypeId);
                        return meal ? (
                          <span
                            key={mealTypeId}
                            className='px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium'
                          >
                            {meal.name}
                          </span>
                        ) : null;
                      })
                    )}
                  </div>
                </div>
              ))}

            {errors.mealType && (
              <p className='text-red-500 text-sm mt-2 flex items-center'>
                <X className='w-4 h-4 mr-1' />
                {errors.mealType}
              </p>
            )}
          </div>

          {/* ✅ Enhanced Menu Type Selection */}
          <div>
            <div className='flex items-center space-x-3 mb-4'>
              <div
                className={`w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-lg flex items-center justify-center`}
              >
                <Utensils className='w-5 h-5 text-white' />
              </div>
              <h3 className='text-lg font-bold text-gray-900'>
                Estilo de cocina
              </h3>
              <span className='text-red-500'>*</span>
            </div>

            <div
              className={`grid gap-3 ${
                menuOptions.length > 2
                  ? 'grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {menuOptions.map((menu) => (
                <div
                  key={menu.id}
                  onClick={() => handleMenuTypeSelection(menu.id)}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                    config.menuType === menu.id
                      ? 'ring-4 ring-blue-400 ring-opacity-50 scale-105 shadow-xl'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className='relative h-20'>
                    <img
                      src={menu.bgImage}
                      alt={menu.name}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-black/50' />

                    {/* Selection indicator */}
                    {config.menuType === menu.id && (
                      <div className='absolute top-2 right-2'>
                        <div className='w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg'>
                          <Check className='w-3 h-3 text-green-600' />
                        </div>
                      </div>
                    )}

                    {/* Content overlay */}
                    <div className='absolute inset-0 flex items-center justify-center text-white p-2'>
                      <div className='text-center'>
                        <div className='text-2xl mb-1'>{menu.emoji}</div>
                        <h4 className='font-bold text-xs'>{menu.name}</h4>
                        <p className='text-xs opacity-75'>{menu.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Custom menu input */}
            {config.menuType === 'custom' && (
              <div className='mt-4 space-y-3'>
                <label className='block text-sm font-bold text-gray-900'>
                  Especifica tu estilo de cocina preferido *
                </label>
                <input
                  type='text'
                  value={config.customMenuType || ''}
                  onChange={(e) => {
                    setConfig((prev) => ({
                      ...prev,
                      customMenuType: e.target.value,
                    }));
                    if (errors.customMenuType) {
                      setErrors((prev) => ({ ...prev, customMenuType: '' }));
                    }
                  }}
                  placeholder='Ej: Cocina local dominicana, Fusión asiática-caribeña, Vegana gourmet...'
                  className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.customMenuType
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200'
                  }`}
                />
                {errors.customMenuType && (
                  <p className='text-red-500 text-sm flex items-center'>
                    <X className='w-4 h-4 mr-1' />
                    {errors.customMenuType}
                  </p>
                )}
              </div>
            )}

            {errors.menuType && (
              <p className='text-red-500 text-sm mt-2 flex items-center'>
                <X className='w-4 h-4 mr-1' />
                {errors.menuType}
              </p>
            )}
          </div>

          {/* Guest Count - mismo código anterior */}
          <div>
            <div className='flex items-center space-x-3 mb-4'>
              <div
                className={`w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-lg flex items-center justify-center`}
              >
                <Users className='w-5 h-5 text-white' />
              </div>
              <h3 className='text-lg font-bold text-gray-900'>
                Número de personas
              </h3>
              <span className='text-red-500'>*</span>
            </div>

            <div
              className={`bg-gradient-to-r ${theme.lightGradient} rounded-2xl p-6 border border-gray-200`}
            >
              <div className='flex items-center justify-center space-x-6'>
                <button
                  type='button'
                  onClick={() => updateGuestCount(false)}
                  disabled={config.guestCount <= 1}
                  className={`w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center transition-all hover:scale-110 shadow-lg ${
                    config.guestCount <= 1
                      ? 'border-gray-200 text-gray-400'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Minus className='w-5 h-5' />
                </button>

                <div className='text-center'>
                  <div className='text-4xl font-bold text-gray-800 mb-1'>
                    {config.guestCount}
                  </div>
                  <div className='text-sm text-gray-600 font-medium'>
                    {config.guestCount === 1 ? 'persona' : 'personas'}
                  </div>
                </div>

                <button
                  type='button'
                  onClick={() => updateGuestCount(true)}
                  disabled={config.guestCount >= 10}
                  className={`w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center transition-all hover:scale-110 shadow-lg ${
                    config.guestCount >= 10
                      ? 'border-gray-200 text-gray-400'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Plus className='w-5 h-5' />
                </button>
              </div>
            </div>
          </div>

          {/* Special Request */}
          <div>
            <div className='flex items-center space-x-3 mb-3'>
              <div
                className={`w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-lg flex items-center justify-center`}
              >
                <MessageCircle className='w-5 h-5 text-white' />
              </div>
              <h3 className='text-lg font-bold text-gray-900'>
                Solicitudes especiales
              </h3>
              <span className='text-gray-400 text-sm'>(opcional)</span>
            </div>

            <div className='relative'>
              <textarea
                value={config.specialRequest}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    setConfig((prev) => ({ ...prev, specialRequest: value }));
                  }
                }}
                placeholder='Preferencias, alergias o solicitudes especiales para este día...'
                className='w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 resize-none transition-all'
                rows={3}
              />
              <div className='absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded-full border'>
                {config.specialRequest.length}/200
              </div>
            </div>
          </div>

          {/* Enhanced Summary */}
          {((config.mealTypes && config.mealTypes.length > 0) ||
            config.mealType) &&
            config.menuType && (
              <div className='bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6'>
                <div className='flex items-center space-x-3 mb-3'>
                  <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                    <Check className='w-5 h-5 text-white' />
                  </div>
                  <h4 className='font-bold text-green-800'>
                    Configuración Lista
                  </h4>
                  <Sparkles className='w-5 h-5 text-green-600' />
                </div>
                <div className='text-green-700 space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <span>🍽️</span>
                    <span>
                      <strong>
                        {config.mealType === 'full-day'
                          ? 'Día Completo (Desayuno, Comida y Cena)'
                          : config.mealTypes
                              ?.map(
                                (mealId) =>
                                  mealTypes.find((m) => m.id === mealId)?.name
                              )
                              .join(', ')}
                      </strong>
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span>👨‍🍳</span>
                    <span>
                      <strong>
                        {config.menuType === 'custom' && config.customMenuType
                          ? config.customMenuType
                          : menuOptions.find((m) => m.id === config.menuType)
                              ?.name}
                      </strong>
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span>👥</span>
                    <span>
                      <strong>{config.guestCount}</strong>{' '}
                      {config.guestCount === 1 ? 'persona' : 'personas'}
                    </span>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Enhanced Footer */}
        <div className='border-t bg-gray-50 p-6 rounded-b-3xl'>
          <div className='flex space-x-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-4 px-6 text-gray-600 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold'
            >
              Cancelar
            </button>
            <button
              type='button'
              onClick={handleSave}
              disabled={
                !(
                  (config.mealTypes && config.mealTypes.length > 0) ||
                  config.mealType
                ) || !config.menuType
              }
              className={`flex-2 py-4 px-8 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center shadow-lg ${
                !(
                  (config.mealTypes && config.mealTypes.length > 0) ||
                  config.mealType
                ) || !config.menuType
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                  : `bg-gradient-to-r ${theme.gradient} hover:shadow-xl text-white`
              }`}
            >
              <Check className='w-5 h-5 mr-2' />
              Guardar Configuración
              <Sparkles className='w-4 h-4 ml-2' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleDaysModal;
