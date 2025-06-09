// components/chef/steps/MultipleDaysModal.tsx
import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Users,
  Utensils,
  MessageCircle,
  Calendar,
  Check,
} from 'lucide-react';

export interface DayServiceConfig {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | '';
  menuType: 'standard' | 'mediterranean' | 'italian' | 'asian' | 'mexican' | '';
  specificTime: string;
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
    menuType: '',
    specificTime: '',
    guestCount: 2,
    specialRequest: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update config when modal opens with existing data or new date
  useEffect(() => {
    if (isOpen) {
      if (existingConfig) {
        setConfig(existingConfig);
      } else {
        setConfig({
          date: selectedDate,
          mealType: '',
          menuType: '',
          specificTime: '',
          guestCount: 2,
          specialRequest: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, selectedDate, existingConfig]);

  // Meal type options
  const mealTypes = [
    {
      id: 'breakfast',
      name: 'Desayuno',
      timeRange: '7:00 AM - 10:00 AM',
      icon: <Calendar className='w-5 h-5' />,
      description: 'Comienza el día con un delicioso desayuno',
    },
    {
      id: 'lunch',
      name: 'Comida',
      timeRange: '12:00 PM - 3:00 PM',
      icon: <Calendar className='w-5 h-5' />,
      description: 'Disfruta de una comida completa y satisfactoria',
    },
    {
      id: 'dinner',
      name: 'Cena',
      timeRange: '6:00 PM - 9:00 PM',
      icon: <Calendar className='w-5 h-5' />,
      description: 'Termina el día con una cena especial',
    },
  ];

  // Menu options based on chef type
  const getMenuOptions = () => {
    if (chefType === 'standard') {
      return [
        {
          id: 'standard',
          name: 'Cocina Personalizada',
          description:
            'El chef trabajará contigo para crear un menú basado en tus preferencias',
          note: 'Sin menú fijo - totalmente personalizable',
        },
      ];
    } else {
      return [
        {
          id: 'mediterranean',
          name: 'Mediterráneo',
          description:
            'Aceite de oliva, pescados frescos, verduras y hierbas aromáticas',
        },
        {
          id: 'italian',
          name: 'Italiano',
          description:
            'Pastas frescas, risottos cremosos y auténticos sabores de Italia',
        },
        {
          id: 'asian',
          name: 'Asiático',
          description:
            'Sabores equilibrados con ingredientes frescos y técnicas tradicionales',
        },
        {
          id: 'mexican',
          name: 'Mexicano',
          description:
            'Especias vibrantes y ingredientes frescos de la cocina tradicional',
        },
      ];
    }
  };

  const menuOptions = getMenuOptions();

  // Time slots based on meal type
  const getTimeSlots = () => {
    switch (config.mealType) {
      case 'breakfast':
        return [
          '7:00 AM',
          '7:30 AM',
          '8:00 AM',
          '8:30 AM',
          '9:00 AM',
          '9:30 AM',
        ];
      case 'lunch':
        return [
          '12:00 PM',
          '12:30 PM',
          '1:00 PM',
          '1:30 PM',
          '2:00 PM',
          '2:30 PM',
        ];
      case 'dinner':
        return [
          '6:00 PM',
          '6:30 PM',
          '7:00 PM',
          '7:30 PM',
          '8:00 PM',
          '8:30 PM',
        ];
      default:
        return [];
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!config.mealType) {
      newErrors.mealType = 'Selecciona el tipo de comida';
    }

    if (!config.menuType) {
      newErrors.menuType = 'Selecciona el tipo de menú';
    }

    if (!config.specificTime) {
      newErrors.specificTime = 'Selecciona una hora específica';
    }

    if (config.guestCount < 1) {
      newErrors.guestCount = 'Debe haber al menos 1 huésped';
    }

    if (config.guestCount > 10) {
      newErrors.guestCount = 'Máximo 10 huéspedes permitidos';
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

    // Clear guest count error when updating
    if (errors.guestCount) {
      setErrors((prev) => ({ ...prev, guestCount: '' }));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleMealTypeChange = (mealType: any) => {
    setConfig((prev) => ({
      ...prev,
      mealType,
      specificTime: '', // Reset time when meal type changes
    }));

    // Clear errors
    if (errors.mealType) {
      setErrors((prev) => ({ ...prev, mealType: '' }));
    }
    if (errors.specificTime) {
      setErrors((prev) => ({ ...prev, specificTime: '' }));
    }
  };

  const handleMenuTypeChange = (menuType: any) => {
    setConfig((prev) => ({ ...prev, menuType }));

    // Clear error
    if (errors.menuType) {
      setErrors((prev) => ({ ...prev, menuType: '' }));
    }
  };

  const handleTimeChange = (time: string) => {
    setConfig((prev) => ({ ...prev, specificTime: time }));

    // Clear error
    if (errors.specificTime) {
      setErrors((prev) => ({ ...prev, specificTime: '' }));
    }
  };

  const handleSpecialRequestChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length <= 300) {
      setConfig((prev) => ({ ...prev, specialRequest: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 p-6 text-white rounded-t-xl'>
          <div className='flex justify-between items-start'>
            <div>
              <h2 className='text-xl font-semibold'>Configurar Servicio</h2>
              <p className='text-amber-100 mt-1 capitalize'>
                {formatDate(selectedDate)}
              </p>
              <div className='mt-2 text-sm text-amber-200'>
                Chef {chefType === 'standard' ? 'Regular' : 'Experimentado'}
              </div>
            </div>
            <button
              onClick={onClose}
              className='text-amber-100 hover:text-white transition-colors p-1 hover:bg-amber-800 rounded'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
        </div>

        <div className='p-6 space-y-6'>
          {/* Meal Type Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              <Clock className='w-4 h-4 inline mr-2' />
              Tipo de Comida *
            </label>
            <div className='grid grid-cols-1 gap-3'>
              {mealTypes.map((meal) => (
                <button
                  key={meal.id}
                  type='button'
                  onClick={() => handleMealTypeChange(meal.id)}
                  className={`p-4 text-left border-2 rounded-lg transition-all ${
                    config.mealType === meal.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      {meal.icon}
                      <div>
                        <h4 className='font-medium text-gray-900'>
                          {meal.name}
                        </h4>
                        <p className='text-sm text-gray-600'>
                          {meal.timeRange}
                        </p>
                      </div>
                    </div>
                    {config.mealType === meal.id && (
                      <Check className='w-5 h-5 text-amber-600' />
                    )}
                  </div>
                  <p className='text-xs text-gray-500 mt-2'>
                    {meal.description}
                  </p>
                </button>
              ))}
            </div>
            {errors.mealType && (
              <p className='text-red-500 text-sm mt-1'>{errors.mealType}</p>
            )}
          </div>

          {/* Menu Type Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              <Utensils className='w-4 h-4 inline mr-2' />
              Tipo de Menú *
            </label>
            <div className='space-y-3'>
              {menuOptions.map((menu) => (
                <button
                  key={menu.id}
                  type='button'
                  onClick={() => handleMenuTypeChange(menu.id)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    config.menuType === menu.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <h4 className='font-medium text-gray-900'>{menu.name}</h4>
                      <p className='text-sm text-gray-600 mt-1'>
                        {menu.description}
                      </p>
                      {menu.note && (
                        <p className='text-xs text-amber-700 mt-1 font-medium'>
                          {menu.note}
                        </p>
                      )}
                    </div>
                    {config.menuType === menu.id && (
                      <Check className='w-5 h-5 text-amber-600 ml-2 flex-shrink-0' />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {errors.menuType && (
              <p className='text-red-500 text-sm mt-1'>{errors.menuType}</p>
            )}
          </div>

          {/* Specific Time Selection */}
          {config.mealType && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Hora Específica *
              </label>
              <div className='grid grid-cols-3 gap-2'>
                {getTimeSlots().map((time) => (
                  <button
                    key={time}
                    type='button'
                    onClick={() => handleTimeChange(time)}
                    className={`p-3 text-sm border rounded-lg transition-all ${
                      config.specificTime === time
                        ? 'border-amber-500 bg-amber-50 text-amber-800'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {errors.specificTime && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.specificTime}
                </p>
              )}
            </div>
          )}

          {/* Guest Count */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              <Users className='w-4 h-4 inline mr-2' />
              Cantidad de Personas *
            </label>
            <div className='flex items-center justify-center space-x-4 bg-gray-50 rounded-lg p-4'>
              <button
                type='button'
                onClick={() => updateGuestCount(false)}
                className='w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-bold transition-colors'
                disabled={config.guestCount <= 1}
              >
                -
              </button>
              <div className='text-center min-w-[80px]'>
                <div className='text-2xl font-semibold text-gray-800'>
                  {config.guestCount}
                </div>
                <div className='text-xs text-gray-500'>
                  {config.guestCount === 1 ? 'persona' : 'personas'}
                </div>
              </div>
              <button
                type='button'
                onClick={() => updateGuestCount(true)}
                className='w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-bold transition-colors'
                disabled={config.guestCount >= 10}
              >
                +
              </button>
            </div>
            {errors.guestCount && (
              <p className='text-red-500 text-sm mt-1'>{errors.guestCount}</p>
            )}
            <div className='mt-2 text-xs text-gray-500 text-center'>
              Rango: 1-10 personas por servicio
            </div>
          </div>

          {/* Special Request */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              <MessageCircle className='w-4 h-4 inline mr-2' />
              Solicitud Especial
            </label>
            <textarea
              value={config.specialRequest}
              onChange={handleSpecialRequestChange}
              placeholder='Describe cualquier preferencia especial, alergias, o solicitudes para este día...'
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[80px] resize-none'
              rows={3}
            />
            <div className='flex justify-between items-center mt-1'>
              <div className='text-xs text-gray-500'>
                {config.specialRequest.length}/300 caracteres
              </div>
              {config.specialRequest.length >= 250 && (
                <div className='text-xs text-amber-600'>
                  {300 - config.specialRequest.length} caracteres restantes
                </div>
              )}
            </div>
          </div>

          {/* Configuration Summary */}
          {config.mealType && config.menuType && config.specificTime && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <h4 className='font-medium text-green-800 mb-2'>
                Resumen de Configuración:
              </h4>
              <div className='text-sm text-green-700 space-y-1'>
                <div>
                  📅 <strong>Fecha:</strong> {formatDate(config.date)}
                </div>
                <div>
                  🍽️ <strong>Comida:</strong>{' '}
                  {mealTypes.find((m) => m.id === config.mealType)?.name} a las{' '}
                  {config.specificTime}
                </div>
                <div>
                  👨‍🍳 <strong>Menú:</strong>{' '}
                  {menuOptions.find((m) => m.id === config.menuType)?.name}
                </div>
                <div>
                  👥 <strong>Personas:</strong> {config.guestCount}
                </div>
                {config.specialRequest && (
                  <div>
                    💬 <strong>Solicitud:</strong>{' '}
                    {config.specialRequest.substring(0, 50)}
                    {config.specialRequest.length > 50 ? '...' : ''}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='border-t p-6 bg-gray-50 rounded-b-xl'>
          <div className='flex justify-between items-center'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors'
            >
              Cancelar
            </button>
            <button
              type='button'
              onClick={handleSave}
              className='px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium flex items-center'
              disabled={
                !config.mealType || !config.menuType || !config.specificTime
              }
            >
              <Check className='w-4 h-4 mr-2' />
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleDaysModal;
