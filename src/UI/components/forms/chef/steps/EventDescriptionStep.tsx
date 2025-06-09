import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  MessageCircle,
  ChefHat,
  Check,
  Star,
  Crown,
  Sparkles,
  Users,
  Calendar,
  MapPin,
  Utensils,
  Heart,
  Award,
} from 'lucide-react';
import {
  budgetOptions,
  chefsSpecialMenus,
  cuisineTypes,
  occasionTypes,
} from '@/constants/chefFormConsts';

interface EventDescriptionStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors: Record<string, string>;
}

const EventDescriptionStep: React.FC<EventDescriptionStepProps> = ({
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
        description:
          'Una sinfonía de sabores orquestada por maestros culinarios',
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
        description: 'Cocina del corazón con sabores que cuentan historias',
      };
    }
  };

  const theme = getChefTheme();

  // Get display values
  const selectedCuisine = cuisineTypes.find(
    (c) => c.id === formData.cuisineType
  );
  const selectedBudget = budgetOptions.find(
    (b) => b.id === formData.budgetOption
  );
  const selectedMenu = chefsSpecialMenus.find(
    (m) => m.id === formData.selectedSpecialMenu
  );
  const selectedOccasion = occasionTypes.find(
    (o) => o.id === formData.occasion
  );

  // Calculate total guests
  const totalGuests = formData.guestCount + formData.childrenCount;

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
            <MessageCircle className='w-10 h-10 text-white drop-shadow-lg' />
          </div>
          <h3 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4'>
            Describe tu Evento
          </h3>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light'>
            Comparte los detalles de tu{' '}
            <span className={`font-bold text-${theme.textColor}`}>
              experiencia {theme.experience.toLowerCase()}
            </span>
            . {theme.description}.
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
              {theme.name} - Experiencia {theme.experience}
            </h4>
            <p className='text-gray-700'>{theme.description}</p>
          </div>
          <div
            className={`px-4 py-2 bg-white rounded-xl border border-${theme.borderColor} ${theme.iconColor} font-semibold`}
          >
            ✓ Confirmado
          </div>
        </div>
      </div>

      {/* Event Description Input */}
      <div className='space-y-6'>
        <div className='space-y-4'>
          <label className='flex items-center text-xl font-bold text-gray-900 mb-4'>
            <div
              className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center mr-4 shadow-lg`}
            >
              <MessageCircle className='w-6 h-6 text-white' />
            </div>
            Cuéntanos sobre tu evento y solicitudes especiales *
          </label>

          <div
            className={`p-6 bg-gradient-to-r ${theme.cardBg} rounded-2xl border border-${theme.borderColor} mb-4`}
          >
            <h5 className={`font-bold text-${theme.textColor} mb-2`}>
              💡 Qué incluir en tu descripción:
            </h5>
            <div className='grid md:grid-cols-2 gap-4 text-sm'>
              <div className='space-y-1'>
                <p className='text-gray-700'>
                  • Ambiente deseado para el evento
                </p>
                <p className='text-gray-700'>
                  • Platos favoritos o preferencias
                </p>
                <p className='text-gray-700'>• Estilo de servicio preferido</p>
              </div>
              <div className='space-y-1'>
                <p className='text-gray-700'>• Ocasión especial a celebrar</p>
                <p className='text-gray-700'>
                  • Invitados con gustos específicos
                </p>
                <p className='text-gray-700'>• Cualquier solicitud especial</p>
              </div>
            </div>
          </div>

          <div className='relative'>
            <textarea
              name='eventDescription'
              value={formData.eventDescription}
              onChange={onChange}
              placeholder={`Describe tu evento especial para tu ${
                theme.name
              }. ${
                formData.chefType === 'professional'
                  ? 'Comparte tu visión para que nuestro chef experimentado pueda crear una experiencia gastronómica única que supere tus expectativas.'
                  : 'Cuéntanos qué hace especial esta ocasión para que nuestro chef pueda adaptar cada plato a tus gustos y crear una experiencia memorable.'
              }`}
              className={`w-full p-6 text-lg border-2 ${
                errors.eventDescription
                  ? 'border-red-400 bg-red-50'
                  : `border-gray-200 hover:border-${theme.borderColor} focus:border-${theme.primaryColor}-500`
              } rounded-2xl focus:ring-4 focus:ring-${
                theme.primaryColor
              }-500/20 transition-all duration-300 bg-white shadow-lg min-h-[250px] resize-none`}
            />
            {formData.eventDescription &&
              formData.eventDescription.length > 50 && (
                <div className='absolute top-6 right-6'>
                  <Check className='w-6 h-6 text-green-500' />
                </div>
              )}
          </div>

          {errors.eventDescription && (
            <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200'>
              <MessageCircle className='w-5 h-5' />
              <p className='font-medium'>{errors.eventDescription}</p>
            </div>
          )}

          <div className='flex justify-between items-center text-sm'>
            <p className='text-gray-500'>
              {formData.eventDescription
                ? `${formData.eventDescription.length}/1000 caracteres`
                : 'Comparte todos los detalles que consideres importantes'}
            </p>
            {formData.eventDescription &&
              formData.eventDescription.length > 800 && (
                <p className={`text-${theme.textColor} font-medium`}>
                  {1000 - formData.eventDescription.length} caracteres restantes
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Experience Summary */}
      <div
        className={`p-8 bg-gradient-to-r ${theme.lightGradient} rounded-3xl border-2 border-${theme.borderColor} shadow-2xl ${theme.shadow}`}
      >
        <div className='text-center mb-8'>
          <h4
            className={`text-3xl font-bold text-${theme.textColor} mb-4 flex items-center justify-center`}
          >
            {formData.chefType === 'professional' ? (
              <Crown className='w-8 h-8 mr-3' />
            ) : (
              <ChefHat className='w-8 h-8 mr-3' />
            )}
            Tu Experiencia {theme.experience}
          </h4>
          <p className='text-gray-700 text-lg'>
            Resumen completo de tu reserva personalizada
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Service Details */}
          <div className='space-y-6'>
            <h5 className='font-bold text-gray-900 text-xl mb-4 flex items-center'>
              <Star className='w-6 h-6 mr-2 text-amber-500' />
              Detalles del Servicio
            </h5>

            <div className='space-y-4'>
              <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50'>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center`}
                >
                  <ChefHat className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h6 className='font-bold text-gray-900'>{theme.name}</h6>
                  <p className={`text-${theme.textColor} font-medium`}>
                    Experiencia {theme.experience}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50'>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center`}
                >
                  <Calendar className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h6 className='font-bold text-gray-900'>
                    Fechas de Servicio
                  </h6>
                  <p className={`text-${theme.textColor} font-medium`}>
                    {formData.serviceType === 'multiple'
                      ? `${formData.dates?.length || 0} días seleccionados`
                      : formData.date
                      ? new Date(formData.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Fecha por confirmar'}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50'>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center`}
                >
                  <Users className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h6 className='font-bold text-gray-900'>Comensales</h6>
                  <p className={`text-${theme.textColor} font-medium`}>
                    {totalGuests} persona{totalGuests !== 1 ? 's' : ''} total
                    {formData.childrenCount > 0 && (
                      <span className='text-gray-600 ml-2'>
                        ({formData.guestCount} adultos +{' '}
                        {formData.childrenCount} niños)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50'>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center`}
                >
                  <MapPin className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h6 className='font-bold text-gray-900'>Ubicación</h6>
                  <p className={`text-${theme.textColor} font-medium text-sm`}>
                    {formData.locationAddress || 'Dirección por confirmar'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Culinary Experience */}
          <div className='space-y-6'>
            <h5 className='font-bold text-gray-900 text-xl mb-4 flex items-center'>
              <Utensils className='w-6 h-6 mr-2 text-amber-500' />
              Experiencia Culinaria
            </h5>

            <div className='space-y-4'>
              <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50'>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center`}
                >
                  <Utensils className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h6 className='font-bold text-gray-900'>Estilo Culinario</h6>
                  <p className={`text-${theme.textColor} font-medium`}>
                    {selectedMenu
                      ? `${selectedMenu.title} (Menú Signature)`
                      : selectedCuisine?.name || 'Por seleccionar'}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50'>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center`}
                >
                  <Star className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h6 className='font-bold text-gray-900'>
                    Nivel de Experiencia
                  </h6>
                  <p className={`text-${theme.textColor} font-medium`}>
                    {selectedBudget?.name || 'Estándar'}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50'>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center`}
                >
                  <Award className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h6 className='font-bold text-gray-900'>Ocasión</h6>
                  <p className={`text-${theme.textColor} font-medium`}>
                    {formData.occasion === 'other'
                      ? formData.otherOccasion || 'Ocasión especial'
                      : selectedOccasion?.name || 'Por especificar'}
                  </p>
                </div>
              </div>

              {formData.dietaryRestrictions && (
                <div className='flex items-start space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50'>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Heart className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h6 className='font-bold text-gray-900'>
                      Restricciones Dietéticas
                    </h6>
                    <p className={`text-${theme.textColor} text-sm`}>
                      Atención personalizada incluida
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Final Summary */}
        <div className='mt-8 text-center'>
          <div
            className={`inline-flex items-center space-x-4 px-8 py-6 bg-gradient-to-r ${theme.gradient} text-white rounded-3xl shadow-2xl ${theme.shadow}`}
          >
            <Sparkles className='w-8 h-8' />
            <div>
              <h5 className='font-bold text-2xl'>
                ¡Tu Experiencia está Lista!
              </h5>
              <p className='text-lg opacity-90'>
                {formData.chefType === 'professional'
                  ? 'Experiencia gastronómica premium confirmada'
                  : 'Experiencia culinaria auténtica confirmada'}
              </p>
            </div>
            <Crown className='w-8 h-8' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDescriptionStep;
