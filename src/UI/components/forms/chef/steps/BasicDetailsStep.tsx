import React, { useState } from 'react';
import { occasionTypes } from '@/constants/chefFormConsts';
import { useTranslation } from '@/lib/i18n/client';
import MultipleDaysModal, { DayServiceConfig } from './MultipleDaysModal';
import {
  Calendar,
  Clock,
  Gift,
  MapPin,
  Settings,
  CheckCircle2,
  Edit3,
  AlertTriangle,
  Users,
  Utensils,
  MessageCircle,
  Sparkles,
  Star,
  Crown,
  Coffee,
  Sun,
  Moon,
} from 'lucide-react';

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

  // Convert formData.dates to Set for easier manipulation
  const selectedDates = new Set(formData.dates || []);

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

  // Get menu type display names
  const getMenuTypeDisplay = (menuType: string) => {
    const menuTypes: Record<string, string> = {
      standard: 'Personalizada',
      mediterranean: 'Mediterráneo',
      italian: 'Italiano',
      asian: 'Asiático',
      mexican: 'Mexicano',
    };
    return menuTypes[menuType] || menuType;
  };

  // Calculate configuration progress
  const configuredDays = Object.keys(dayConfigurations).length;
  const selectedDaysCount = selectedDates.size;
  const isAllConfigured =
    configuredDays === selectedDaysCount && selectedDaysCount > 0;

  // Time options with luxury styling
  const timeOptions = [
    {
      value: 'Breakfast',
      label: 'Desayuno Gourmet',
      icon: <Coffee className='w-5 h-5' />,
      time: '8:00 - 11:00 AM',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      value: 'Lunch',
      label: 'Almuerzo de Lujo',
      icon: <Sun className='w-5 h-5' />,
      time: '12:00 - 3:00 PM',
      gradient: 'from-orange-400 to-red-500',
    },
    {
      value: 'Dinner',
      label: 'Cena Memorable',
      icon: <Moon className='w-5 h-5' />,
      time: '6:00 - 10:00 PM',
      gradient: 'from-purple-500 to-indigo-600',
    },
  ];

  // Simple Calendar Component (replacing CalendarPicker)
  const SimpleCalendar = () => {
    const today = new Date();
    const minDate = new Date(getMinDate());
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Generate days for current and next month
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

  // Debug effect
  React.useEffect(() => {
    console.log('📅 BasicDetailsStep - formData.dates:', formData.dates);
    console.log(
      '📅 BasicDetailsStep - selectedDates:',
      Array.from(selectedDates)
    );
  }, [formData.dates]);

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
            <Calendar className='w-10 h-10 text-white drop-shadow-lg' />
          </div>
          <h3 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4'>
            Cuándo & Dónde
          </h3>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light'>
            Configura los detalles de tu experiencia culinaria{' '}
            <span className={`font-semibold text-${theme.textColor}`}>
              {formData.chefType === 'professional' ? 'Premium' : 'Auténtica'}
            </span>
            . Cada detalle es importante para crear el momento perfecto.
          </p>
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

              {/* Time Selection */}
              <div className='space-y-4'>
                <label className='flex items-center text-lg font-semibold text-gray-800 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4'>
                    <Clock className='w-6 h-6 text-white' />
                  </div>
                  Momento del Día *
                </label>
                <div className='space-y-3'>
                  {timeOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() =>
                        onChange({
                          target: { name: 'time', value: option.value },
                        } as any)
                      }
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        formData.time === option.value
                          ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg shadow-purple-200'
                          : 'border-gray-200 hover:border-purple-300 bg-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4'>
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-r ${option.gradient} text-white shadow-lg`}
                          >
                            {option.icon}
                          </div>
                          <div>
                            <h4 className='font-semibold text-gray-900'>
                              {option.label}
                            </h4>
                            <p className='text-gray-600 text-sm'>
                              {option.time}
                            </p>
                          </div>
                        </div>
                        {formData.time === option.value && (
                          <CheckCircle2 className='w-6 h-6 text-purple-500' />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
          /* Multiple Days Service */
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

            <div
              className={`bg-gradient-to-r ${theme.lightGradient} rounded-3xl p-8 border border-${theme.borderColor}`}
            >
              <div className='text-center mb-6'>
                <h4 className='text-2xl font-bold text-gray-900 mb-2'>
                  Selecciona tus Fechas
                </h4>
                <p className='text-gray-600'>
                  Haz clic en las fechas para crear tu experiencia gastronómica
                  personalizada
                </p>
              </div>

              {/* Instructions */}
              <div className='mb-6 p-6 bg-white/80 backdrop-blur-sm border border-blue-300 rounded-2xl shadow-lg'>
                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0'>
                    <Sparkles className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h5 className='font-bold text-blue-900 mb-1'>
                      Configuración Personalizada
                    </h5>
                    <p className='text-blue-700'>
                      Cada fecha seleccionada abrirá un modal para configurar
                      horario, menú y detalles específicos del servicio.
                    </p>
                  </div>
                </div>
              </div>

              {errors.dates && (
                <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 mb-6'>
                  <AlertTriangle className='w-5 h-5' />
                  <p className='font-medium'>{errors.dates}</p>
                </div>
              )}

              {/* Simple Calendar */}
              <SimpleCalendar />

              {/* Selected Dates Configuration */}
              {selectedDates.size > 0 && (
                <div className='mt-8 space-y-6'>
                  <div className='flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200'>
                    <h4 className='font-bold text-gray-900 text-xl flex items-center'>
                      <Settings className='w-6 h-6 mr-3 text-indigo-600' />
                      Configuración de Servicios ({selectedDaysCount} días)
                    </h4>
                    <div className='flex items-center space-x-3'>
                      {isAllConfigured ? (
                        <div className='flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-xl border border-green-200'>
                          <CheckCircle2 className='w-5 h-5' />
                          <span className='font-medium'>Todo Configurado</span>
                        </div>
                      ) : (
                        <div className='flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-xl border border-amber-200'>
                          <AlertTriangle className='w-5 h-5' />
                          <span className='font-medium'>
                            {configuredDays}/{selectedDaysCount} configurados
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='space-y-4'>
                    {Array.from(selectedDates)
                      .sort()
                      .map((date) => {
                        const config = dayConfigurations[date];
                        const isConfigured =
                          config &&
                          config.mealType &&
                          config.menuType &&
                          config.specificTime;
                        const mealInfo = config?.mealType
                          ? getMealTypeInfo(config.mealType)
                          : null;

                        return (
                          <div
                            key={date}
                            className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                              isConfigured
                                ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
                                : 'border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 shadow-md'
                            }`}
                          >
                            <div className='p-6'>
                              <div className='flex items-center justify-between mb-4'>
                                <div className='flex items-center space-x-4'>
                                  <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                                      isConfigured
                                        ? 'bg-green-500'
                                        : 'bg-amber-500'
                                    }`}
                                  >
                                    {isConfigured ? (
                                      <CheckCircle2 className='w-6 h-6 text-white' />
                                    ) : (
                                      <Settings className='w-6 h-6 text-white' />
                                    )}
                                  </div>
                                  <div>
                                    <h5 className='font-bold text-gray-900 text-lg capitalize'>
                                      {new Date(date).toLocaleDateString(
                                        'es-ES',
                                        {
                                          weekday: 'long',
                                          month: 'long',
                                          day: 'numeric',
                                        }
                                      )}
                                    </h5>
                                    <p className='text-gray-600'>
                                      {new Date(date).getFullYear()}
                                    </p>
                                  </div>
                                </div>

                                <div className='flex items-center space-x-3'>
                                  <button
                                    type='button'
                                    onClick={() => handleEditDayConfig(date)}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:scale-105 ${
                                      isConfigured
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                                    }`}
                                  >
                                    <Edit3 className='w-5 h-5 mr-2' />
                                    {isConfigured ? 'Editar' : 'Configurar'}
                                  </button>
                                  <button
                                    type='button'
                                    onClick={() => handleRemoveDate(date)}
                                    className='text-red-600 hover:text-red-800 p-3 hover:bg-red-50 rounded-xl transition-colors border border-red-200 hover:border-red-300'
                                    title='Remover fecha'
                                  >
                                    <AlertTriangle className='w-5 h-5' />
                                  </button>
                                </div>
                              </div>

                              {isConfigured ? (
                                <div className='space-y-4'>
                                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    <div
                                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl border ${mealInfo?.color} shadow-sm`}
                                    >
                                      {mealInfo?.icon}
                                      <div>
                                        <span className='font-semibold text-sm'>
                                          {mealInfo?.name}
                                        </span>
                                        <p className='text-xs opacity-80'>
                                          {config.specificTime}
                                        </p>
                                      </div>
                                    </div>

                                    <div className='flex items-center space-x-3 px-4 py-3 bg-blue-100 text-blue-800 border border-blue-200 rounded-xl shadow-sm'>
                                      <Utensils className='w-4 h-4' />
                                      <div>
                                        <span className='font-semibold text-sm'>
                                          {getMenuTypeDisplay(config.menuType)}
                                        </span>
                                        <p className='text-xs opacity-80'>
                                          Menú
                                        </p>
                                      </div>
                                    </div>

                                    <div className='flex items-center space-x-3 px-4 py-3 bg-purple-100 text-purple-800 border border-purple-200 rounded-xl shadow-sm'>
                                      <Users className='w-4 h-4' />
                                      <div>
                                        <span className='font-semibold text-sm'>
                                          {config.guestCount} personas
                                        </span>
                                        <p className='text-xs opacity-80'>
                                          Comensales
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {config.specialRequest && (
                                    <div className='p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200'>
                                      <div className='flex items-start space-x-3'>
                                        <MessageCircle className='w-5 h-5 text-gray-600 mt-0.5' />
                                        <div>
                                          <h6 className='font-semibold text-gray-900 mb-1'>
                                            Solicitud Especial:
                                          </h6>
                                          <p className='text-gray-700 text-sm'>
                                            {config.specialRequest}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className='text-center py-6'>
                                  <div className='flex items-center justify-center space-x-2 text-amber-700 mb-2'>
                                    <AlertTriangle className='w-5 h-5' />
                                    <span className='font-semibold'>
                                      Configuración Pendiente
                                    </span>
                                  </div>
                                  <p className='text-amber-600 text-sm'>
                                    Haz clic en "Configurar" para personalizar
                                    esta fecha
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Actions for multiple selection */}
                  <div className='flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200'>
                    <button
                      type='button'
                      onClick={clearAllDates}
                      className='text-gray-600 hover:text-gray-800 underline underline-offset-2 font-medium transition-colors'
                    >
                      Limpiar todas las fechas
                    </button>

                    {!isAllConfigured && selectedDaysCount > 0 && (
                      <div className='flex items-center space-x-2 text-amber-700 bg-amber-100 px-4 py-2 rounded-xl border border-amber-200'>
                        <AlertTriangle className='w-5 h-5' />
                        <span className='font-medium'>
                          Configura todos los días para continuar
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Location and Occasion Section */}
      <div className='space-y-8'>
        <div className='text-center'>
          <h4 className='text-2xl font-bold text-gray-900 mb-2'>
            Detalles del Evento
          </h4>
          <p className='text-gray-600'>
            Información esencial para personalizar tu experiencia
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Location Field */}
          <div className='space-y-4'>
            <label className='flex items-center text-lg font-semibold text-gray-800 mb-4'>
              <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4'>
                <MapPin className='w-6 h-6 text-white' />
              </div>
              Dirección del Evento *
            </label>
            <div className='relative'>
              <input
                type='text'
                name='locationAddress'
                value={formData.locationAddress}
                onChange={onChange}
                placeholder='Ingresa la dirección completa donde se realizará el evento'
                className={`w-full p-6 text-lg border-2 ${
                  errors.locationAddress
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 hover:border-green-300 focus:border-green-500'
                } rounded-2xl focus:ring-4 focus:ring-green-500/20 transition-all duration-300 bg-white shadow-lg`}
              />
              {formData.locationAddress && (
                <div className='absolute top-6 right-6'>
                  <CheckCircle2 className='w-6 h-6 text-green-500' />
                </div>
              )}
            </div>
            {errors.locationAddress && (
              <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200'>
                <AlertTriangle className='w-5 h-5' />
                <p className='text-sm font-medium'>{errors.locationAddress}</p>
              </div>
            )}
            <div className='bg-green-50 p-4 rounded-xl border border-green-200'>
              <p className='text-green-800 text-sm font-medium'>
                💡 Incluye cualquier detalle relevante como número de
                apartamento, instrucciones de acceso, etc.
              </p>
            </div>
          </div>

          {/* Occasion Field */}
          <div className='space-y-4'>
            <label className='flex items-center text-lg font-semibold text-gray-800 mb-4'>
              <div className='w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mr-4'>
                <Gift className='w-6 h-6 text-white' />
              </div>
              Tipo de Ocasión *
            </label>
            <select
              name='occasion'
              value={formData.occasion}
              onChange={onChange}
              className={`w-full p-6 text-lg border-2 ${
                errors.occasion
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 hover:border-pink-300 focus:border-pink-500'
              } rounded-2xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 bg-white shadow-lg`}
            >
              <option value=''>Selecciona la ocasión</option>
              {occasionTypes.map((occasion) => (
                <option key={occasion.id} value={occasion.id}>
                  {occasion.name}
                </option>
              ))}
            </select>
            {errors.occasion && (
              <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200'>
                <AlertTriangle className='w-5 h-5' />
                <p className='text-sm font-medium'>{errors.occasion}</p>
              </div>
            )}

            {/* Custom occasion input */}
            {formData.occasion === 'other' && (
              <div className='space-y-3'>
                <label className='text-lg font-semibold text-gray-800 block'>
                  Especifica la ocasión *
                </label>
                <input
                  type='text'
                  name='otherOccasion'
                  value={formData.otherOccasion}
                  onChange={onChange}
                  placeholder='Describe tu ocasión especial'
                  className={`w-full p-6 text-lg border-2 ${
                    errors.otherOccasion
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 hover:border-pink-300 focus:border-pink-500'
                  } rounded-2xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 bg-white shadow-lg`}
                />
                {errors.otherOccasion && (
                  <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200'>
                    <AlertTriangle className='w-5 h-5' />
                    <p className='text-sm font-medium'>
                      {errors.otherOccasion}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      {formData.serviceType === 'multiple' && selectedDates.size > 0 && (
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
                  {selectedDaysCount} fecha{selectedDaysCount !== 1 ? 's' : ''}{' '}
                  seleccionada{selectedDaysCount !== 1 ? 's' : ''}
                </h5>
                {configuredDays > 0 && (
                  <p className='text-green-600 font-medium'>
                    {configuredDays} configuración
                    {configuredDays !== 1 ? 'es' : ''} completada
                    {configuredDays !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            <div
              className={`px-6 py-3 rounded-xl font-semibold ${
                isAllConfigured
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {isAllConfigured ? (
                <div className='flex items-center space-x-2'>
                  <CheckCircle2 className='w-5 h-5' />
                  <span>Listo para continuar</span>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <Settings className='w-5 h-5' />
                  <span>Configura los días restantes</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
