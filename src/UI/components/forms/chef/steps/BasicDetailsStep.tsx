import React from 'react';
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
  CalendarRange,
} from 'lucide-react';
import { occasionTypes } from '@/constants/chef/chefForm';

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

  // Time options with visual styling
  const timeOptions = [
    {
      value: 'Breakfast',
      label: 'Desayuno Gourmet',
      icon: <Coffee className='w-5 h-5' />,
      time: '8:00 - 11:00 AM',
      gradient: 'from-amber-400 to-orange-500',
      image:
        'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      value: 'Lunch',
      label: 'Almuerzo de Lujo',
      icon: <Sun className='w-5 h-5' />,
      time: '12:00 - 3:00 PM',
      gradient: 'from-orange-400 to-red-500',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      value: 'Dinner',
      label: 'Cena Memorable',
      icon: <Moon className='w-5 h-5' />,
      time: '6:00 - 10:00 PM',
      gradient: 'from-purple-500 to-indigo-600',
      image:
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
  ];

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

      {/* Chef Type Indicator */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-6 border border-blue-200'>
        <div className='flex items-center space-x-4'>
          <div className='w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg'>
            {formData.chefType === 'professional' ? (
              <Sparkles className='w-6 h-6 md:w-8 md:h-8 text-white' />
            ) : (
              <Calendar className='w-6 h-6 md:w-8 md:h-8 text-white' />
            )}
          </div>
          <div className='flex-1'>
            <h4 className='text-lg md:text-xl font-bold text-blue-800 mb-1'>
              {formData.chefType === 'professional'
                ? 'Experiencia Premium'
                : 'Experiencia Auténtica'}{' '}
              -{' '}
              {formData.serviceType === 'single'
                ? 'Una Ocasión'
                : 'Múltiples Días'}
            </h4>
            <p className='text-blue-700 text-sm md:text-base'>
              {formData.chefType === 'professional'
                ? 'Gastronomía de nivel mundial personalizada'
                : 'Cocina del corazón con sabores únicos'}
            </p>
          </div>
          <div className='px-3 py-1 md:px-4 md:py-2 bg-white rounded-xl border border-blue-200 text-blue-600 font-semibold text-sm'>
            ✓ Confirmado
          </div>
        </div>
      </div>

      {/* Date & Time Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8'>
        {/* Date Selection */}
        <div className='space-y-6'>
          {formData.serviceType === 'single' ? (
            <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100'>
              <label className='block font-semibold text-gray-900 mb-4 flex items-center text-lg'>
                <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3'>
                  <Calendar className='w-5 h-5 text-white' />
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
                  className={`w-full p-4 text-lg border-2 ${
                    errors.date
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 hover:border-green-300 focus:border-green-500'
                  } rounded-xl focus:ring-4 focus:ring-green-500/20 transition-all duration-300 bg-white shadow-sm`}
                />
                {formData.date && (
                  <div className='absolute top-4 right-4'>
                    <CheckCircle2 className='w-6 h-6 text-green-500' />
                  </div>
                )}
              </div>
              {errors.date && (
                <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 mt-3'>
                  <AlertTriangle className='w-5 h-5' />
                  <p className='text-sm font-medium'>{errors.date}</p>
                </div>
              )}
              <div className='mt-3 text-sm text-green-700 flex items-center'>
                <Sparkles className='w-4 h-4 mr-1' />
                Tu chef creará una experiencia única este día
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

      {/* Location and Occasion Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8'>
        {/* Location Field */}
        <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200'>
          <label className='block font-semibold text-gray-900 mb-4 flex items-center text-lg'>
            <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3'>
              <MapPin className='w-5 h-5 text-white' />
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
              className={`w-full p-4 text-lg border-2 ${
                errors.locationAddress
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 hover:border-green-300 focus:border-green-500'
              } rounded-xl focus:ring-4 focus:ring-green-500/20 transition-all duration-300 bg-white shadow-sm`}
            />
            {formData.locationAddress && (
              <div className='absolute top-4 right-4'>
                <CheckCircle2 className='w-6 h-6 text-green-500' />
              </div>
            )}
          </div>
          {errors.locationAddress && (
            <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 mt-3'>
              <AlertTriangle className='w-5 h-5' />
              <p className='text-sm font-medium'>{errors.locationAddress}</p>
            </div>
          )}
          <div className='mt-3 text-sm text-green-700 flex items-center'>
            <Sparkles className='w-4 h-4 mr-1' />
            Tu chef se encargará de todo en la comodidad de tu hogar
          </div>
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
        )}
    </div>
  );
};

export default BasicDetailsStep;
