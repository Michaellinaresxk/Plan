import React, { useState } from 'react';
import { occasionTypes } from '@/constants/chefFormConsts';
import { useDateSelection } from '@/hooks/useDateSelection';
import { useTranslation } from '@/lib/i18n/client';
import CalendarPicker from '@/UI/components/calendar/CalendarPicker';
import SelectedDatesSummary from '@/UI/components/calendar/SelectedDatesSummary';
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

  // State for multiple days configuration
  const [dayConfigurations, setDayConfigurations] = useState<
    Record<string, DayServiceConfig>
  >({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<string>('');

  // Use the custom hook for date selection
  const { selectedDates, toggleDate, removeDate, clearAllDates } =
    useDateSelection(formData.dates || [], (dates) => {
      onDateSelect(dates);
      // Remove configurations for dates that are no longer selected
      const newConfigurations = { ...dayConfigurations };
      Object.keys(newConfigurations).forEach((date) => {
        if (!dates.includes(date)) {
          delete newConfigurations[date];
        }
      });
      setDayConfigurations(newConfigurations);
    });

  // Handle date click for multiple days service
  const handleDateClick = (date: string) => {
    if (formData.serviceType === 'multiple') {
      // Check if date is already selected
      const isSelected = selectedDates.has(date);

      // Toggle the date selection first
      toggleDate(date);

      // If the date is being selected (not deselected), open modal
      if (!isSelected) {
        setTimeout(() => {
          setSelectedDateForModal(date);
          setModalOpen(true);
        }, 100);
      }
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
    removeDate(date);
    // Remove configuration for this date
    const newConfigurations = { ...dayConfigurations };
    delete newConfigurations[date];
    setDayConfigurations(newConfigurations);
  };

  // Get meal type display names
  const getMealTypeDisplay = (mealType: string) => {
    const mealTypes: Record<string, string> = {
      breakfast: 'Desayuno',
      lunch: 'Comida',
      dinner: 'Cena',
    };
    return mealTypes[mealType] || mealType;
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

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
        <Calendar className='w-5 h-5 mr-2 text-amber-600' />
        {t('chef.form.step1.title', { fallback: 'When & Where' })}
      </h3>

      {/* Date Selection */}
      {formData.serviceType === 'single' ? (
        /* Single Day Service */
        <div>
          <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
            <Calendar className='w-4 h-4 mr-2 text-amber-700' />
            {t('chef.form.date', { fallback: 'Date' })} *
          </label>
          <input
            type='date'
            name='date'
            value={formData.date}
            onChange={onChange}
            min={getMinDate()}
            className={`w-full p-3 border ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
          />
          {errors.date && (
            <p className='text-red-500 text-xs mt-1'>{errors.date}</p>
          )}
        </div>
      ) : (
        /* Multiple Days Service */
        <div>
          <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
            <Calendar className='w-4 h-4 mr-2 text-amber-700' />
            {t('chef.form.selectDates', { fallback: 'Select Dates' })} *
          </label>

          {/* Instructions for multiple days */}
          <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-blue-700'>
              💡 <strong>Instrucciones:</strong> Haz clic en las fechas para
              seleccionarlas. Para cada fecha seleccionada, se abrirá un modal
              para configurar el horario, menú y detalles específicos del
              servicio.
            </p>
          </div>

          {errors.dates && (
            <p className='text-red-500 text-xs mb-3'>{errors.dates}</p>
          )}

          <CalendarPicker
            selectedDates={selectedDates}
            onDateToggle={handleDateClick}
            minDate={getMinDate()}
          />

          {/* Selected Dates with Configurations */}
          {selectedDates.size > 0 && (
            <div className='mt-6'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='font-medium text-gray-800 flex items-center'>
                  <Settings className='w-4 h-4 mr-2' />
                  Configuración de Servicios ({selectedDaysCount} días)
                </h4>
                <div className='flex items-center space-x-2'>
                  {isAllConfigured ? (
                    <span className='text-sm text-green-600 flex items-center'>
                      <CheckCircle2 className='w-4 h-4 mr-1' />
                      Todo configurado
                    </span>
                  ) : (
                    <span className='text-sm text-amber-600 flex items-center'>
                      <AlertTriangle className='w-4 h-4 mr-1' />
                      {configuredDays}/{selectedDaysCount} configurados
                    </span>
                  )}
                </div>
              </div>

              <div className='space-y-3'>
                {Array.from(selectedDates)
                  .sort()
                  .map((date) => {
                    const config = dayConfigurations[date];
                    const isConfigured =
                      config &&
                      config.mealType &&
                      config.menuType &&
                      config.specificTime;

                    return (
                      <div
                        key={date}
                        className={`border rounded-lg p-4 transition-all ${
                          isConfigured
                            ? 'border-green-200 bg-green-50'
                            : 'border-amber-200 bg-amber-50'
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-3'>
                            <div
                              className={`w-3 h-3 rounded-full ${
                                isConfigured ? 'bg-green-500' : 'bg-amber-500'
                              }`}
                            ></div>
                            <div className='flex-1'>
                              <h5 className='font-medium text-gray-800 capitalize'>
                                {new Date(date).toLocaleDateString('es-ES', {
                                  weekday: 'long',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </h5>
                              {isConfigured ? (
                                <div className='text-sm text-gray-600 mt-1'>
                                  <div className='flex flex-wrap items-center gap-2'>
                                    <span className='inline-flex items-center px-2 py-1 bg-white rounded-md border border-gray-200'>
                                      <Clock className='w-3 h-3 mr-1' />
                                      <strong>
                                        {getMealTypeDisplay(config.mealType)}
                                      </strong>{' '}
                                      - {config.specificTime}
                                    </span>
                                    <span className='inline-flex items-center px-2 py-1 bg-white rounded-md border border-gray-200'>
                                      <Utensils className='w-3 h-3 mr-1' />
                                      {getMenuTypeDisplay(config.menuType)}
                                    </span>
                                    <span className='inline-flex items-center px-2 py-1 bg-white rounded-md border border-gray-200'>
                                      <Users className='w-3 h-3 mr-1' />
                                      {config.guestCount} personas
                                    </span>
                                  </div>
                                  {config.specialRequest && (
                                    <div className='mt-2'>
                                      <p className='text-xs text-gray-500 bg-white p-2 rounded border border-gray-200'>
                                        <MessageCircle className='w-3 h-3 inline mr-1' />
                                        <strong>Solicitud:</strong>{' '}
                                        {config.specialRequest}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className='mt-1'>
                                  <p className='text-sm text-amber-700 flex items-center'>
                                    <AlertTriangle className='w-4 h-4 mr-1' />
                                    Configuración pendiente - Haz clic en
                                    "Configurar"
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className='flex items-center space-x-2 ml-4'>
                            {isConfigured && (
                              <CheckCircle2 className='w-5 h-5 text-green-600 flex-shrink-0' />
                            )}
                            <button
                              type='button'
                              onClick={() => handleEditDayConfig(date)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center ${
                                isConfigured
                                  ? 'text-green-700 hover:bg-green-100 border border-green-200'
                                  : 'text-amber-700 hover:bg-amber-100 border border-amber-200 bg-white'
                              }`}
                            >
                              <Edit3 className='w-4 h-4 mr-1' />
                              {isConfigured ? 'Editar' : 'Configurar'}
                            </button>
                            <button
                              type='button'
                              onClick={() => handleRemoveDate(date)}
                              className='text-red-600 hover:text-red-800 text-sm px-2 py-1 hover:bg-red-50 rounded transition-colors'
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Actions for multiple selection */}
              <div className='mt-4 flex items-center justify-between pt-3 border-t border-gray-200'>
                <button
                  type='button'
                  onClick={() => {
                    clearAllDates();
                    setDayConfigurations({});
                  }}
                  className='text-sm text-gray-600 hover:text-gray-800 underline'
                >
                  Limpiar todas las fechas
                </button>

                {!isAllConfigured && selectedDaysCount > 0 && (
                  <div className='text-sm text-amber-600 flex items-center'>
                    <AlertTriangle className='w-4 h-4 mr-1' />
                    Configura todos los días para continuar
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Time Field - Only for Single Day Service */}
      {formData.serviceType === 'single' && (
        <div>
          <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
            <Clock className='w-4 h-4 mr-2 text-amber-700' />
            {t('chef.form.time', { fallback: 'Time' })} *
          </label>
          <select
            name='time'
            value={formData.time}
            onChange={onChange}
            className={`w-full p-3 border ${
              errors.time ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
          >
            <option value=''>Select a time</option>
            <option value='Breakfast'>Breakfast</option>
            <option value='Lunch'>Lunch</option>
            <option value='Dinner'>Dinner</option>
          </select>
          {errors.time && (
            <p className='text-red-500 text-xs mt-1'>{errors.time}</p>
          )}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Location Field */}
        <div>
          <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
            <MapPin className='w-4 h-4 mr-2 text-amber-700' />
            {t('chef.form.location', { fallback: 'Location Address' })} *
          </label>
          <input
            type='text'
            name='locationAddress'
            value={formData.locationAddress}
            onChange={onChange}
            placeholder='Enter the full address where the event will be held'
            className={`w-full p-3 border ${
              errors.locationAddress ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
          />
          {errors.locationAddress && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.locationAddress}
            </p>
          )}
          <p className='text-xs text-gray-500 mt-1'>
            Please provide the complete address including any relevant details
            for the chef
          </p>
        </div>

        {/* Occasion Field */}
        <div>
          <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
            <Gift className='w-4 h-4 mr-2 text-amber-700' />
            {t('chef.form.occasion', { fallback: 'Occasion' })} *
          </label>
          <select
            name='occasion'
            value={formData.occasion}
            onChange={onChange}
            className={`w-full p-3 border ${
              errors.occasion ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
          >
            <option value=''>Select occasion</option>
            {occasionTypes.map((occasion) => (
              <option key={occasion.id} value={occasion.id}>
                {occasion.name}
              </option>
            ))}
          </select>
          {errors.occasion && (
            <p className='text-red-500 text-xs mt-1'>{errors.occasion}</p>
          )}

          {/* Show custom occasion input if "Other" is selected */}
          {formData.occasion === 'other' && (
            <div className='mt-3'>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>
                Please specify the occasion *
              </label>
              <input
                type='text'
                name='otherOccasion'
                value={formData.otherOccasion}
                onChange={onChange}
                placeholder='Enter the occasion'
                className={`w-full p-3 border ${
                  errors.otherOccasion ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-gray-50`}
              />
              {errors.otherOccasion && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.otherOccasion}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      {formData.serviceType === 'multiple' && selectedDates.size > 0 && (
        <div className='pt-4 border-t border-gray-100'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-gray-600 flex items-center'>
              <Calendar className='w-4 h-4 mr-1' />
              {selectedDaysCount} date{selectedDaysCount !== 1 ? 's' : ''}{' '}
              selected
              {configuredDays > 0 && (
                <span className='ml-2 text-green-600'>
                  • {configuredDays} configurados
                </span>
              )}
            </span>
            <span
              className={`font-medium ${
                isAllConfigured ? 'text-green-600' : 'text-amber-600'
              }`}
            >
              {isAllConfigured
                ? 'Ready to continue'
                : 'Configure remaining days'}
            </span>
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
