import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  Calendar,
  Clock,
  Gift,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Coffee,
  Sun,
  Moon,
  Check,
  ChefHat,
  Crown,
  Utensils,
} from 'lucide-react';
import { occasionTypes } from '@/constants/chef/chefForm';
import MealPreferencesModal from '@/UI/components/modal/MealPreferencesModal';
import { DayServiceConfig } from './MultipleDaysModal';

// Interfaz para las preferencias de comida
interface MealPreference {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  preferences: string;
  dietaryRestrictions: string;
  specialRequests: string;
}

interface BasicDetailsStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onDateSelect: (dates: string[]) => void;
  errors: Record<string, string>;
  getMinDate: () => string;
}

const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({
  formData,
  onChange,
  onDateSelect,
  errors,
  getMinDate,
}) => {
  const { t } = useTranslation();

  // ✅ Estados para el modal de preferencias de comida
  const [mealPreferencesModal, setMealPreferencesModal] = useState({
    isOpen: false,
    mealType: null as 'breakfast' | 'lunch' | 'dinner' | null,
  });

  // ✅ Estado para almacenar las preferencias de comida
  const [mealPreferences, setMealPreferences] = useState<
    Record<string, MealPreference>
  >({});

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
        experience: 'Premium',
        description: 'Experiencia gastronómica de nivel mundial',
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
        experience: 'Auténtica',
        description: 'Cocina casera llena de sabor y personalidad',
      };
    }
  };

  const theme = getChefTheme();

  // State for multiple days configuration
  const [dayConfigurations, setDayConfigurations] = useState<
    Record<string, DayServiceConfig>
  >({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<string>('');

  // ✅ State for single day multiple time selection
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  // Convert formData.dates to Set for easier manipulation
  const selectedDates = new Set(formData.dates || []);

  // ✅ Enhanced time options with multiple selection capability
  const timeOptions = [
    {
      value: 'breakfast',
      label: 'Desayuno Gourmet',
      icon: <Coffee className='w-5 h-5' />,
      time: '8:00 - 11:00 AM',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      value: 'lunch',
      label: 'Almuerzo de Lujo',
      icon: <Sun className='w-5 h-5' />,
      time: '12:00 - 3:00 PM',
      gradient: 'from-orange-400 to-red-500',
    },
    {
      value: 'dinner',
      label: 'Cena Memorable',
      icon: <Moon className='w-5 h-5' />,
      time: '6:00 - 10:00 PM',
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      value: 'full-day',
      label: 'Día Completo',
      icon: <Crown className='w-5 h-5' />,
      time: 'Desayuno, Comida y Cena',
      gradient: 'from-emerald-500 to-teal-600',
      premium: true,
    },
  ];

  // ✅ Función para abrir el modal de preferencias
  const openMealPreferencesModal = (
    mealType: 'breakfast' | 'lunch' | 'dinner'
  ) => {
    setMealPreferencesModal({
      isOpen: true,
      mealType,
    });
  };

  // ✅ Función para cerrar el modal de preferencias
  const closeMealPreferencesModal = () => {
    setMealPreferencesModal({
      isOpen: false,
      mealType: null,
    });
  };

  // ✅ Función para guardar las preferencias de comida
  const handleSaveMealPreferences = (preference: MealPreference) => {
    setMealPreferences((prev) => ({
      ...prev,
      [preference.mealType]: preference,
    }));

    // También actualizar el formData para enviar al backend
    const syntheticEvent = {
      target: {
        name: 'mealPreferences',
        value: {
          ...mealPreferences,
          [preference.mealType]: preference,
        },
        type: 'custom',
      },
    } as any;
    onChange(syntheticEvent);
  };

  // ✅ Handle time selection for single day service (actualizado)
  const handleTimeSelection = useCallback(
    (timeValue: string) => {
      if (timeValue === 'full-day') {
        // Full day selection - select all three meals
        setSelectedTimes(['breakfast', 'lunch', 'dinner']);

        // Update form data
        const syntheticEvent = {
          target: {
            name: 'time',
            value: 'full-day',
            type: 'custom',
          },
        } as any;
        onChange(syntheticEvent);

        // Also update times array for consistency
        const syntheticEventTimes = {
          target: {
            name: 'times',
            value: ['breakfast', 'lunch', 'dinner'],
            type: 'custom',
          },
        } as any;
        onChange(syntheticEventTimes);

        // ✅ Abrir modales para cada comida del día completo
        setTimeout(() => {
          openMealPreferencesModal('breakfast');
        }, 300);
      } else {
        // Individual time selection
        let newSelectedTimes: string[];

        if (selectedTimes.includes(timeValue)) {
          // Remove if already selected
          newSelectedTimes = selectedTimes.filter((time) => time !== timeValue);
        } else {
          // Add if not selected
          newSelectedTimes = [...selectedTimes, timeValue];

          // ✅ Abrir modal de preferencias para la comida seleccionada
          setTimeout(() => {
            openMealPreferencesModal(
              timeValue as 'breakfast' | 'lunch' | 'dinner'
            );
          }, 300);
        }

        setSelectedTimes(newSelectedTimes);

        // Update form data
        if (newSelectedTimes.length === 0) {
          // No times selected
          const syntheticEvent = {
            target: { name: 'time', value: '', type: 'custom' },
          } as any;
          onChange(syntheticEvent);
        } else if (newSelectedTimes.length === 1) {
          // Single time selected
          const syntheticEvent = {
            target: {
              name: 'time',
              value: newSelectedTimes[0],
              type: 'custom',
            },
          } as any;
          onChange(syntheticEvent);
        } else {
          // Multiple times selected
          const syntheticEvent = {
            target: { name: 'time', value: 'multiple', type: 'custom' },
          } as any;
          onChange(syntheticEvent);
        }

        // Also update times array
        const syntheticEventTimes = {
          target: { name: 'times', value: newSelectedTimes, type: 'custom' },
        } as any;
        onChange(syntheticEventTimes);
      }

      // Clear time error if any
      if (errors.time) {
        const { time, ...otherErrors } = errors;
        onChange({
          target: { name: '__clearErrors', value: otherErrors, type: 'custom' },
        } as any);
      }
    },
    [selectedTimes, onChange, errors]
  );

  // ✅ Initialize selected times from formData
  React.useEffect(() => {
    if (formData.time === 'full-day') {
      setSelectedTimes(['breakfast', 'lunch', 'dinner']);
    } else if (formData.times && Array.isArray(formData.times)) {
      setSelectedTimes(formData.times);
    } else if (formData.time && formData.time !== 'multiple') {
      setSelectedTimes([formData.time]);
    }

    // ✅ Inicializar preferencias de comida desde formData
    if (formData.mealPreferences) {
      setMealPreferences(formData.mealPreferences);
    }
  }, [formData.time, formData.times, formData.mealPreferences]);

  // ✅ Función para obtener información de preferencias de comida
  const getMealPreferenceInfo = (mealType: string) => {
    const preference = mealPreferences[mealType];
    if (!preference) return null;

    return {
      hasPreferences: !!preference.preferences,
      preferencesText: preference.preferences,
      hasDietaryRestrictions: !!preference.dietaryRestrictions,
      hasSpecialRequests: !!preference.specialRequests,
    };
  };

  // Handle date toggle for multiple days service
  const handleDateToggle = (date: string) => {
    if (formData.serviceType === 'multiple') {
      console.log('📅 Date clicked:', date);
      console.log('📅 Currently selected dates:', Array.from(selectedDates));

      const newDates = new Set(selectedDates);
      const isSelected = newDates.has(date);

      if (isSelected) {
        newDates.delete(date);
        // Remove configuration for this date
        const newConfigurations = { ...dayConfigurations };
        delete newConfigurations[date];
        setDayConfigurations(newConfigurations);
      } else {
        newDates.add(date);
        // Open modal for configuration
        setTimeout(() => {
          setSelectedDateForModal(date);
          setModalOpen(true);
        }, 100);
      }

      const newDatesArray = Array.from(newDates);
      console.log('📅 New dates array:', newDatesArray);
      onDateSelect(newDatesArray);
    }
  };

  // Handle day configuration save
  const handleDayConfigSave = (config: DayServiceConfig) => {
    setDayConfigurations((prev) => ({
      ...prev,
      [config.date]: config,
    }));
  };

  // Handle editing existing configuration
  const handleEditDayConfig = (date: string) => {
    setSelectedDateForModal(date);
    setModalOpen(true);
  };

  // Handle removing a date
  const handleRemoveDate = (date: string) => {
    const newDates = new Set(selectedDates);
    newDates.delete(date);
    const newDatesArray = Array.from(newDates);

    onDateSelect(newDatesArray);

    // Remove configuration for this date
    const newConfigurations = { ...dayConfigurations };
    delete newConfigurations[date];
    setDayConfigurations(newConfigurations);
  };

  // Clear all dates
  const clearAllDates = () => {
    onDateSelect([]);
    setDayConfigurations({});
  };

  // Get meal type display info
  const getMealTypeInfo = (mealType: string) => {
    const mealTypes: Record<
      string,
      { name: string; icon: JSX.Element; color: string }
    > = {
      breakfast: {
        name: 'Desayuno',
        icon: <Coffee className='w-4 h-4' />,
        color: 'bg-amber-100 text-amber-800 border-amber-200',
      },
      lunch: {
        name: 'Comida',
        icon: <Sun className='w-4 h-4' />,
        color: 'bg-orange-100 text-orange-800 border-orange-200',
      },
      dinner: {
        name: 'Cena',
        icon: <Moon className='w-4 h-4' />,
        color: 'bg-purple-100 text-purple-800 border-purple-200',
      },
    };
    return (
      mealTypes[mealType] || {
        name: mealType,
        icon: <Utensils className='w-4 h-4' />,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
      }
    );
  };

  // Calculate configuration progress
  const configuredDays = Object.keys(dayConfigurations).length;
  const selectedDaysCount = selectedDates.size;
  const isAllConfigured =
    configuredDays === selectedDaysCount && selectedDaysCount > 0;

  // Simple Calendar Component (same as before)
  const SimpleCalendar = () => {
    const today = new Date();
    const minDate = new Date(getMinDate());
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const generateCalendarDays = () => {
      const days = [];
      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 2, 0); // Two months

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split('T')[0];
        const isSelectable = d >= minDate;
        const isSelected = selectedDates.has(dateStr);

        if (isSelectable) {
          days.push({
            date: dateStr,
            day: d.getDate(),
            month: d.getMonth(),
            isSelected,
            isToday: d.toDateString() === today.toDateString(),
          });
        }
      }
      return days;
    };

    const calendarDays = generateCalendarDays();
    const monthNames = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    return (
      <div className='bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg'>
        <div className='grid grid-cols-7 gap-2'>
          {/* Day headers */}
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div
              key={day}
              className='text-center text-sm font-semibold text-gray-600 p-2'
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((dayObj) => (
            <button
              key={dayObj.date}
              type='button'
              onClick={() => handleDateToggle(dayObj.date)}
              className={`
                p-3 text-sm rounded-xl transition-all duration-300 hover:scale-110 font-medium
                ${
                  dayObj.isSelected
                    ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}`
                    : `bg-gray-50 hover:bg-gray-100 text-gray-800 hover:border-${theme.borderColor} border border-transparent`
                }
                ${
                  dayObj.isToday && !dayObj.isSelected
                    ? 'ring-2 ring-blue-400'
                    : ''
                }
              `}
            >
              <div className='text-center'>
                <div>{dayObj.day}</div>
                <div className='text-xs opacity-75'>
                  {monthNames[dayObj.month]}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='space-y-8 md:space-y-12'>
      {/* Hero Section */}
      <div className='relative h-40 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8'>
        <img
          src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          alt='Elegant dining setup'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
        <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white'>
          <div className='flex items-center space-x-3 md:space-x-4'>
            <Calendar className='w-8 h-8 md:w-10 md:h-10' />
            <div>
              <h2 className='text-xl md:text-3xl font-bold'>Cuándo y Dónde</h2>
              <p className='text-white/90 text-sm md:text-lg'>
                Configura los detalles de tu experiencia culinaria
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selection Section */}
      <div className='space-y-8'>
        {formData.serviceType === 'single' ? (
          /* Single Day Service */
          <div className='space-y-6'>
            <div className='text-center space-y-4'>
              <div
                className={`inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r ${theme.selectedBg} to-${theme.primaryColor}-100 rounded-2xl border border-${theme.borderColor}`}
              >
                <Calendar className={`w-6 h-6 ${theme.iconColor}`} />
                <span
                  className={`font-semibold text-${theme.textColor} text-lg`}
                >
                  Experiencia{' '}
                  {formData.chefType === 'professional'
                    ? 'Premium'
                    : 'Auténtica'}{' '}
                  Seleccionada
                </span>
                <Sparkles className={`w-5 h-5 ${theme.iconColor}`} />
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Date Selection */}
              <div className='space-y-4'>
                <label className='flex items-center text-lg font-semibold text-gray-800 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4'>
                    <Calendar className='w-6 h-6 text-white' />
                  </div>
                  Fecha de tu Experiencia *
                </label>
                <div className='relative'>
                  <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={onChange}
                    min={getMinDate()}
                    className={`w-full p-6 text-lg border-2 ${
                      errors.date
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
                    } rounded-2xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white shadow-lg`}
                  />
                  {formData.date && (
                    <div className='absolute top-6 right-6'>
                      <CheckCircle2 className='w-6 h-6 text-green-500' />
                    </div>
                  )}
                </div>
                {errors.date && (
                  <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200'>
                    <AlertTriangle className='w-5 h-5' />
                    <p className='text-sm font-medium'>{errors.date}</p>
                  </div>
                )}
              </div>

              {/* ✅ Enhanced Time Selection with Multiple Options */}
              <div className='space-y-4'>
                <label className='flex items-center text-lg font-semibold text-gray-800 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4'>
                    <Clock className='w-6 h-6 text-white' />
                  </div>
                  Momento del Día *
                </label>

                {/* Information about multiple selection */}
                <div className='mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200'>
                  <p className='text-blue-800 text-sm font-medium'>
                    💡 Puedes seleccionar uno o varios momentos del día, o
                    elegir "Día Completo" para una experiencia gastronómica
                    completa.
                  </p>
                </div>

                <div className='space-y-3'>
                  {timeOptions.map((option) => {
                    const isSelected =
                      option.value === 'full-day'
                        ? formData.time === 'full-day' ||
                          selectedTimes.length === 3
                        : selectedTimes.includes(option.value);

                    // ✅ Obtener información de preferencias para este tipo de comida
                    const mealPreferenceInfo =
                      option.value !== 'full-day'
                        ? getMealPreferenceInfo(option.value)
                        : null;

                    return (
                      <div
                        key={option.value}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          isSelected
                            ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg shadow-purple-200'
                            : 'border-gray-200 hover:border-purple-300 bg-white shadow-md hover:shadow-lg'
                        }`}
                      >
                        <div
                          onClick={() => handleTimeSelection(option.value)}
                          className='flex items-center justify-between'
                        >
                          <div className='flex items-center space-x-4'>
                            <div
                              className={`p-3 rounded-xl bg-gradient-to-r ${option.gradient} text-white shadow-lg`}
                            >
                              {option.icon}
                            </div>
                            <div>
                              <div className='flex items-center space-x-2'>
                                <h4 className='font-semibold text-gray-900'>
                                  {option.label}
                                </h4>
                                {option.premium && (
                                  <div className='bg-emerald-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs'>
                                    <Crown className='w-3 h-3' />
                                    <span>Premium</span>
                                  </div>
                                )}
                              </div>
                              <p className='text-gray-600 text-sm'>
                                {option.time}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className='w-6 h-6 text-purple-500' />
                          )}
                        </div>

                        {/* ✅ Mostrar preferencias configuradas */}
                        {isSelected && mealPreferenceInfo && (
                          <div className='mt-4 pt-4 border-t border-purple-200'>
                            {mealPreferenceInfo.hasPreferences ? (
                              <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                  <div className='flex items-center space-x-2'>
                                    <ChefHat className='w-4 h-4 text-green-600' />
                                    <span className='text-sm font-medium text-green-800'>
                                      Preferencias configuradas
                                    </span>
                                  </div>
                                  <button
                                    type='button'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openMealPreferencesModal(
                                        option.value as
                                          | 'breakfast'
                                          | 'lunch'
                                          | 'dinner'
                                      );
                                    }}
                                    className='text-xs text-blue-600 hover:text-blue-800 underline'
                                  >
                                    Editar
                                  </button>
                                </div>
                                <p className='text-sm text-gray-700 line-clamp-2'>
                                  {mealPreferenceInfo.preferencesText}
                                </p>
                                {(mealPreferenceInfo.hasDietaryRestrictions ||
                                  mealPreferenceInfo.hasSpecialRequests) && (
                                  <div className='flex space-x-2 text-xs'>
                                    {mealPreferenceInfo.hasDietaryRestrictions && (
                                      <span className='px-2 py-1 bg-amber-100 text-amber-800 rounded-full'>
                                        Restricciones
                                      </span>
                                    )}
                                    {mealPreferenceInfo.hasSpecialRequests && (
                                      <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full'>
                                        Solicitudes especiales
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className='flex items-center justify-between'>
                                <span className='text-sm text-amber-600 font-medium'>
                                  ⚠️ Configura tus preferencias de menú
                                </span>
                                <button
                                  type='button'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openMealPreferencesModal(
                                      option.value as
                                        | 'breakfast'
                                        | 'lunch'
                                        | 'dinner'
                                    );
                                  }}
                                  className='text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors'
                                >
                                  Configurar
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ✅ Para día completo, mostrar todas las preferencias */}
                        {isSelected && option.value === 'full-day' && (
                          <div className='mt-4 pt-4 border-t border-purple-200 space-y-3'>
                            {['breakfast', 'lunch', 'dinner'].map(
                              (mealType) => {
                                const mealInfo =
                                  getMealPreferenceInfo(mealType);
                                const mealConfig = {
                                  breakfast: {
                                    name: 'Desayuno',
                                    icon: <Coffee className='w-3 h-3' />,
                                  },
                                  lunch: {
                                    name: 'Almuerzo',
                                    icon: <Sun className='w-3 h-3' />,
                                  },
                                  dinner: {
                                    name: 'Cena',
                                    icon: <Moon className='w-3 h-3' />,
                                  },
                                }[mealType];

                                return (
                                  <div
                                    key={mealType}
                                    className='flex items-center justify-between text-sm'
                                  >
                                    <div className='flex items-center space-x-2'>
                                      {mealConfig.icon}
                                      <span className='font-medium'>
                                        {mealConfig.name}:
                                      </span>
                                      {mealInfo?.hasPreferences ? (
                                        <span className='text-green-600'>
                                          ✓ Configurado
                                        </span>
                                      ) : (
                                        <span className='text-amber-600'>
                                          ⚠️ Pendiente
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      type='button'
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openMealPreferencesModal(
                                          mealType as
                                            | 'breakfast'
                                            | 'lunch'
                                            | 'dinner'
                                        );
                                      }}
                                      className='text-xs text-blue-600 hover:text-blue-800 underline'
                                    >
                                      {mealInfo?.hasPreferences
                                        ? 'Editar'
                                        : 'Configurar'}
                                    </button>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ✅ Selected times summary */}
                {selectedTimes.length > 0 && (
                  <div className='mt-4 p-4 bg-green-50 rounded-xl border border-green-200'>
                    <h5 className='font-bold text-green-800 mb-2'>
                      Momentos seleccionados:
                    </h5>
                    <div className='flex flex-wrap gap-2'>
                      {formData.time === 'full-day' ? (
                        <span className='px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium flex items-center space-x-1'>
                          <Crown className='w-4 h-4' />
                          <span>Día Completo</span>
                        </span>
                      ) : (
                        selectedTimes.map((timeId) => {
                          const timeOption = timeOptions.find(
                            (t) => t.value === timeId
                          );
                          return timeOption ? (
                            <span
                              key={timeId}
                              className='px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium'
                            >
                              {timeOption.label}
                            </span>
                          ) : null;
                        })
                      )}
                    </div>
                  </div>
                )}

                {errors.time && (
                  <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200'>
                    <AlertTriangle className='w-5 h-5' />
                    <p className='text-sm font-medium'>{errors.time}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Multiple Days Service - existing code */
          <div className='space-y-8'>
            <div className='text-center space-y-4'>
              <div
                className={`inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r ${theme.selectedBg} to-${theme.primaryColor}-100 rounded-2xl border border-${theme.borderColor}`}
              >
                <Calendar className={`w-6 h-6 ${theme.iconColor}`} />
                <span
                  className={`font-semibold text-${theme.textColor} text-lg`}
                >
                  Experiencia{' '}
                  {formData.chefType === 'professional'
                    ? 'Premium'
                    : 'Auténtica'}{' '}
                  Extendida
                </span>
                <Crown className={`w-5 h-5 ${theme.iconColor}`} />
              </div>
            </div>
          ) : (
            <div className='bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200'>
              <h3 className='font-semibold text-gray-900 mb-4 flex items-center text-lg'>
                <CalendarRange className='w-6 h-6 mr-3 text-purple-600' />
                Experiencia de Múltiples Días
              </h3>
              <div className='bg-white rounded-xl p-4 border border-purple-100'>
                <p className='text-gray-700 text-center mb-4'>
                  📅 Selecciona las fechas para tu experiencia culinaria
                  extendida
                </p>
                <div className='bg-purple-50 rounded-lg p-4'>
                  <p className='text-sm text-purple-700 flex items-center'>
                    <Sparkles className='w-4 h-4 mr-2' />
                    Cada fecha será configurada individualmente con menús y
                    horarios únicos
                  </p>
                </div>
              </div>
              {errors.dates && (
                <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 mt-3'>
                  <AlertTriangle className='w-5 h-5' />
                  <p className='font-medium'>{errors.dates}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div className='space-y-6'>
          <div>
            <h3 className='font-semibold text-gray-900 mb-4 flex items-center text-lg'>
              <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3'>
                <Clock className='w-5 h-5 text-white' />
              </div>
              Momento Perfecto del Día *
            </h3>
            <div className='space-y-3'>
              {timeOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() =>
                    onChange({
                      target: { name: 'time', value: option.value },
                    } as any)
                  }
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                    formData.time === option.value
                      ? 'ring-4 ring-purple-400 ring-opacity-50 scale-105 shadow-xl'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className='relative h-20 md:h-24 flex items-center'>
                    <img
                      src={option.image}
                      alt={option.label}
                      className='w-full h-full object-cover'
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-80`}
                    />

                    <div className='absolute inset-0 flex items-center justify-between p-4 md:p-6 text-white'>
                      <div className='flex items-center space-x-3 md:space-x-4'>
                        <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30'>
                          {option.icon}
                        </div>
                        <div>
                          <h4 className='font-bold text-lg md:text-xl'>
                            {option.label}
                          </h4>
                          <p className='text-sm md:text-base opacity-90'>
                            {option.time}
                          </p>
                        </div>
                      </div>

                      {formData.time === option.value && (
                        <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg'>
                          <CheckCircle2 className='w-6 h-6 text-green-600' />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.time && (
              <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 mt-3'>
                <AlertTriangle className='w-5 h-5' />
                <p className='text-sm font-medium'>{errors.time}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location and Occasion Section - existing code remains the same */}
      <div className='space-y-8'>
        <div className='text-center'>
          <h4 className='text-2xl font-bold text-gray-900 mb-2'>
            Detalles del Evento
          </h4>
          <p className='text-gray-600'>
            Información esencial para personalizar tu experiencia
          </p>
        </div>

        {/* Occasion Field */}
        <div className='bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200'>
          <label className='block font-semibold text-gray-900 mb-4 flex items-center text-lg'>
            <div className='w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mr-3'>
              <Gift className='w-5 h-5 text-white' />
            </div>
            Tipo de Ocasión *
          </label>
          <select
            name='occasion'
            value={formData.occasion}
            onChange={onChange}
            className={`w-full p-4 text-lg border-2 ${
              errors.occasion
                ? 'border-red-400 bg-red-50'
                : 'border-gray-200 hover:border-pink-300 focus:border-pink-500'
            } rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 bg-white shadow-sm`}
          >
            <option value=''>Selecciona la ocasión</option>
            {occasionTypes.map((occasion) => (
              <option key={occasion.id} value={occasion.id}>
                {occasion.name}
              </option>
            ))}
          </select>
          {errors.occasion && (
            <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 mt-3'>
              <AlertTriangle className='w-5 h-5' />
              <p className='text-sm font-medium'>{errors.occasion}</p>
            </div>
          )}

          {/* Custom occasion input */}
          {formData.occasion === 'other' && (
            <div className='mt-4'>
              <label className='block font-semibold text-gray-900 mb-2'>
                Especifica la ocasión *
              </label>
              <input
                type='text'
                name='otherOccasion'
                value={formData.otherOccasion}
                onChange={onChange}
                placeholder='Describe tu ocasión especial'
                className={`w-full p-4 text-lg border-2 ${
                  errors.otherOccasion
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 hover:border-pink-300 focus:border-pink-500'
                } rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 bg-white shadow-sm`}
              />
              {errors.otherOccasion && (
                <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 mt-3'>
                  <AlertTriangle className='w-5 h-5' />
                  <p className='text-sm font-medium'>{errors.otherOccasion}</p>
                </div>
              )}
            </div>
          )}

          <div className='mt-3 text-sm text-pink-700 flex items-center'>
            <Gift className='w-4 h-4 mr-1' />
            Cada ocasión merece una experiencia única
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {(formData.date || formData.dates?.length > 0) &&
        formData.time &&
        formData.locationAddress &&
        formData.occasion && (
          <div className='bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-200 shadow-lg'>
            <div className='text-center mb-6'>
              <h4 className='text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center'>
                <CheckCircle2 className='w-6 h-6 md:w-8 md:h-8 mr-3 text-green-600' />
                Detalles Confirmados
              </h4>
              <p className='text-gray-600'>
                Tu experiencia culinaria está tomando forma
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200'>
                  <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center'>
                    <Calendar className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h5 className='font-bold text-gray-900'>Fecha</h5>
                    <p className='text-gray-700'>
                      {formData.serviceType === 'single'
                        ? formData.date
                          ? new Date(formData.date).toLocaleDateString(
                              'es-ES',
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )
                          : 'Por definir'
                        : `${formData.dates?.length || 0} días seleccionados`}
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200'>
                  <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center'>
                    <Clock className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h5 className='font-bold text-gray-900'>Momento</h5>
                    <p className='text-gray-700'>
                      {timeOptions.find((t) => t.value === formData.time)
                        ?.label || formData.time}
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200'>
                  <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center'>
                    <MapPin className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h5 className='font-bold text-gray-900'>Ubicación</h5>
                    <p className='text-gray-700 text-sm'>
                      {formData.locationAddress}
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200'>
                  <div className='w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center'>
                    <Gift className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h5 className='font-bold text-gray-900'>Ocasión</h5>
                    <p className='text-gray-700'>
                      {formData.occasion === 'other'
                        ? formData.otherOccasion
                        : occasionTypes.find((o) => o.id === formData.occasion)
                            ?.name || formData.occasion}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-6 text-center'>
              <div className='inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg'>
                <Sparkles className='w-6 h-6' />
                <span className='font-semibold'>
                  ¡Perfecto! Continuemos con los comensales
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Day Summary */}
      {formData.serviceType === 'single' &&
        (formData.date || selectedTimes.length > 0) && (
          <div
            className={`p-8 bg-gradient-to-r ${theme.lightGradient} rounded-3xl border border-${theme.borderColor} shadow-lg`}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center`}
                >
                  <Calendar className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h5 className='font-bold text-gray-900 text-lg'>
                    Experiencia {theme.experience} Configurada
                  </h5>
                  {formData.date && (
                    <p className='text-gray-600'>
                      {new Date(formData.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                  {selectedTimes.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {formData.time === 'full-day' ? (
                        <span className='px-2 py-1 bg-emerald-500 text-white rounded-full text-xs font-medium flex items-center space-x-1'>
                          <Crown className='w-3 h-3' />
                          <span>Día Completo</span>
                        </span>
                      ) : (
                        selectedTimes.map((timeId) => {
                          const timeOption = timeOptions.find(
                            (t) => t.value === timeId
                          );
                          return timeOption ? (
                            <span
                              key={timeId}
                              className='px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-medium'
                            >
                              {timeOption.label}
                            </span>
                          ) : null;
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`px-6 py-3 rounded-xl font-semibold ${
                  formData.date && (selectedTimes.length > 0 || formData.time)
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {formData.date &&
                (selectedTimes.length > 0 || formData.time) ? (
                  <div className='flex items-center space-x-2'>
                    <CheckCircle2 className='w-5 h-5' />
                    <span>Listo para continuar</span>
                  </div>
                ) : (
                  <div className='flex items-center space-x-2'>
                    <Settings className='w-5 h-5' />
                    <span>Completa la configuración</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* ✅ Modal de Preferencias de Comida */}
      <MealPreferencesModal
        isOpen={mealPreferencesModal.isOpen}
        onClose={closeMealPreferencesModal}
        mealType={mealPreferencesModal.mealType}
        existingPreference={
          mealPreferencesModal.mealType
            ? mealPreferences[mealPreferencesModal.mealType]
            : undefined
        }
        onSave={handleSaveMealPreferences}
        chefType={formData.chefType || 'standard'}
      />

      {/* Multiple Days Modal */}
      <MultipleDaysModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDateForModal}
        existingConfig={dayConfigurations[selectedDateForModal]}
        onSave={handleDayConfigSave}
        chefType={formData.chefType || 'standard'}
      />
    </div>
  );
};

export default BasicDetailsStep;
