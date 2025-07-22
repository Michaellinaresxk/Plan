import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  Utensils,
  Crown,
  Star,
  Sparkles,
  Check,
  AlertTriangle,
  Heart,
  ChefHat,
  BookOpen,
  Users,
  Clock,
} from 'lucide-react';
import RestaurantMenuSelector from './RestaurantMenuSelector';

interface CuisineAndBudgetStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const CuisineAndBudgetStep: React.FC<CuisineAndBudgetStepProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const { t } = useTranslation();
  const [customCuisineInput, setCustomCuisineInput] = useState('');
  const [showChefMenu, setShowChefMenu] = useState(false);

  // Get chef theme for visual consistency
  const getChefTheme = () => {
    if (formData.chefType === 'professional') {
      return {
        name: 'Chef Experimentado',
        gradient: 'from-purple-600 to-indigo-700',
        lightGradient: 'from-purple-50 to-indigo-50',
        textColor: 'purple-800',
        borderColor: 'purple-300',
        selectedBg: 'purple-50',
        selectedBorder: 'purple-500',
        buttonGradient: 'from-purple-600 to-indigo-600',
        experience: 'Premium',
        icon: Crown,
      };
    } else {
      return {
        name: 'Chef Regular',
        gradient: 'from-orange-500 to-amber-600',
        lightGradient: 'from-orange-50 to-amber-50',
        textColor: 'orange-800',
        borderColor: 'orange-300',
        selectedBg: 'orange-50',
        selectedBorder: 'orange-500',
        buttonGradient: 'from-orange-500 to-amber-500',
        experience: 'Auténtica',
        icon: Heart,
      };
    }
  };

  const theme = getChefTheme();
  const ChefIcon = theme.icon;

  // Enhanced cuisine options - now available for both chef types
  const getAvailableCuisineTypes = () => {
    const allCuisines = [
      {
        id: 'mediterranean',
        name: 'Mediterránea',
        emoji: '🫒',
        description: 'Sabores frescos del mar Mediterráneo',
        image:
          'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'italian',
        name: 'Italiana',
        emoji: '🍝',
        description: 'Auténtica cocina italiana tradicional',
        image:
          'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'asian',
        name: 'Asiática',
        emoji: '🍜',
        description: 'Fusión de sabores asiáticos',
        image:
          'https://images.unsplash.com/photo-1617093727343-374698b1b08d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'mexican',
        name: 'Mexicana',
        emoji: '🌮',
        description: 'Especias y tradición mexicana',
        image:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'caribbean',
        name: 'Caribeña',
        emoji: '🥥',
        description: 'Sabores tropicales del Caribe',
        image:
          'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'french',
        name: 'Francesa',
        emoji: '🥖',
        description: 'Elegancia y técnica francesa',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      },
    ];

    // Add custom option for both chef types
    const customOption = {
      id: 'custom',
      name: 'Personalizado',
      emoji: '👨‍🍳',
      description:
        formData.chefType === 'professional'
          ? 'Dinos tu estilo favorito - adaptamos cualquier cocina'
          : 'Tu estilo de cocina favorito, preparado con amor',
      image:
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      isCustom: true,
    };

    if (formData.chefType === 'standard') {
      // Chef regular: mostrar algunas opciones básicas + personalizado
      return [
        allCuisines.find((c) => c.id === 'italian'),
        allCuisines.find((c) => c.id === 'mexican'),
        allCuisines.find((c) => c.id === 'caribbean'),
        customOption,
      ].filter(Boolean);
    } else {
      // Chef profesional: todas las opciones + personalizado
      return [...allCuisines, customOption];
    }
  };

  const availableCuisines = getAvailableCuisineTypes();

  // Handle cuisine selection with custom option
  const handleCuisineSelection = (cuisineId: string) => {
    onChange('cuisineType', cuisineId);

    if (cuisineId === 'custom') {
      // If custom is selected, clear special menu selection
      onChange('selectedSpecialMenu', '');
    } else {
      // Clear custom input if a predefined cuisine is selected
      setCustomCuisineInput('');
      onChange('customCuisineType', '');
    }
  };

  // Handle custom cuisine input
  const handleCustomCuisineChange = (value: string) => {
    setCustomCuisineInput(value);
    onChange('customCuisineType', value);
  };

  // Handle menu items selection
  const handleMenuItemsChange = useCallback(
    (selectedItems: any[]) => {
      onChange('selectedMenuItems', selectedItems);
    },
    [onChange]
  );

  // Enhanced chef's special menus (only for professional chef)
  const getAvailableSpecialMenus = () => {
    if (formData.chefType !== 'professional') return [];

    return [
      {
        id: 'tasting-menu',
        title: 'Menú Degustación Signature',
        description: 'Experiencia gastronómica de 7 tiempos',
        courses: 7,
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        features: [
          'Ingredientes premium',
          'Maridaje incluido',
          'Presentación gourmet',
        ],
      },
      {
        id: 'fusion-experience',
        title: 'Experiencia Fusión Tropical',
        description: 'Cocina internacional con toques caribeños',
        courses: 5,
        image:
          'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        features: ['Fusión única', 'Productos locales', 'Técnicas modernas'],
      },
      {
        id: 'romantic-dinner',
        title: 'Cena Romántica Premium',
        description: 'Experiencia íntima para parejas',
        courses: 6,
        image:
          'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        features: [
          'Ambiente romántico',
          'Servicio discreto',
          'Detalles especiales',
        ],
      },
    ];
  };

  const specialMenus = getAvailableSpecialMenus();

  return (
    <div className='max-w-6xl mx-auto space-y-12'>
      {/* Header */}
      <div className='text-center space-y-6'>
        <div
          className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${theme.gradient} rounded-3xl shadow-2xl mb-6`}
        >
          <Utensils className='w-10 h-10 text-white' />
        </div>
        <div>
          <h3 className='text-3xl font-bold text-gray-900 mb-3'>
            Experiencia Culinaria
          </h3>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
            Personaliza tu experiencia gastronómica con tu{' '}
            <span className={`font-bold text-${theme.textColor}`}>
              {theme.name}
            </span>
          </p>
        </div>
      </div>

      {/* Chef's Special Menus (Professional Only) */}
      {formData.chefType === 'professional' && specialMenus.length > 0 && (
        <div className='space-y-8'>
          <div className='text-center'>
            <div className='flex items-center justify-center space-x-3 mb-4'>
              <Crown className='w-8 h-8 text-purple-600' />
              <h4 className='text-2xl font-bold text-gray-900'>
                Menús Signature del Chef
              </h4>
              <Crown className='w-8 h-8 text-purple-600' />
            </div>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Experiencias gastronómicas únicas diseñadas exclusivamente por
              nuestros chefs experimentados
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-6'>
            {specialMenus.map((menu) => (
              <div
                key={menu.id}
                onClick={() => {
                  onChange('selectedSpecialMenu', menu.id);
                  onChange('cuisineType', ''); // Clear regular cuisine when selecting special menu
                }}
                className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                  formData.selectedSpecialMenu === menu.id
                    ? 'ring-4 ring-purple-400 ring-opacity-50 scale-105 shadow-2xl'
                    : 'hover:shadow-xl'
                }`}
              >
                <div className='relative h-48'>
                  <img
                    src={menu.image}
                    alt={menu.title}
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

                  {/* Premium badge */}
                  <div className='absolute top-4 left-4'>
                    <div className='bg-purple-600 text-white px-3 py-1 rounded-full flex items-center space-x-2 text-sm font-bold'>
                      <Crown className='w-4 h-4' />
                      <span>Signature</span>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {formData.selectedSpecialMenu === menu.id && (
                    <div className='absolute top-4 right-4'>
                      <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg'>
                        <Check className='w-5 h-5 text-green-600' />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                    <h5 className='font-bold text-lg mb-2'>{menu.title}</h5>
                    <p className='text-sm opacity-90 mb-3'>
                      {menu.description}
                    </p>

                    <div className='flex items-center space-x-4 text-sm'>
                      <span>{menu.courses} tiempos</span>
                      <span>•</span>
                      <span>Experiencia Premium</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className='p-6 bg-white'>
                  <div className='space-y-2'>
                    {menu.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className='flex items-center space-x-2 text-sm text-gray-600'
                      >
                        <Check className='w-4 h-4 text-green-500' />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Selection button */}
                  <div className='mt-4'>
                    <div
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-center transition-all ${
                        formData.selectedSpecialMenu === menu.id
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formData.selectedSpecialMenu === menu.id ? (
                        <div className='flex items-center justify-center space-x-2'>
                          <Check className='w-4 h-4' />
                          <span>Menú Seleccionado</span>
                        </div>
                      ) : (
                        'Seleccionar este Menú'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* OR divider */}
          <div className='relative py-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-lg'>
              <span className='bg-white px-6 text-gray-500 font-medium'>
                O elige otra opción
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Cuisine Type Selection */}
      <div className='space-y-8'>
        <div
          className={`grid gap-6 ${
            availableCuisines.length > 4
              ? 'grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-2 md:grid-cols-4'
          }`}
        >
          {availableCuisines.map((cuisine) => (
            <div
              key={cuisine.id}
              onClick={() => handleCuisineSelection(cuisine.id)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                formData.cuisineType === cuisine.id
                  ? `ring-4 ring-${theme.selectedBorder} ring-opacity-50 scale-105 shadow-xl`
                  : 'hover:shadow-lg'
              }`}
            >
              <div className='relative h-32'>
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-black/40' />

                {/* Custom badge */}
                {cuisine.isCustom && (
                  <div className='absolute top-3 left-3'>
                    <div
                      className={`bg-${theme.borderColor} text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs`}
                    >
                      <ChefHat className='w-3 h-3' />
                      <span>Tu Estilo</span>
                    </div>
                  </div>
                )}

                {/* Selection indicator */}
                {formData.cuisineType === cuisine.id && (
                  <div className='absolute top-3 right-3'>
                    <div className='w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg'>
                      <Check className='w-4 h-4 text-green-600' />
                    </div>
                  </div>
                )}

                {/* Content overlay */}
                <div className='absolute inset-0 flex items-center justify-center text-white p-4'>
                  <div className='text-center'>
                    <div className='text-3xl mb-2'>{cuisine.emoji}</div>
                    <h5 className='font-bold text-sm'>{cuisine.name}</h5>
                    <p className='text-xs opacity-90 mt-1'>
                      {cuisine.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom cuisine input */}
        {formData.cuisineType === 'custom' && (
          <div className='mt-6 space-y-4'>
            <div
              className={`bg-gradient-to-r ${theme.lightGradient} rounded-2xl p-6 border border-${theme.borderColor}`}
            >
              <label className='block text-lg font-bold text-gray-900 mb-3'>
                🎨 Describe tu estilo de cocina ideal
              </label>
              <input
                type='text'
                value={customCuisineInput}
                onChange={(e) => handleCustomCuisineChange(e.target.value)}
                placeholder={
                  formData.chefType === 'professional'
                    ? 'Ej: Fusión asiática-caribeña, Cocina molecular, Vegana gourmet, etc.'
                    : 'Ej: Comida casera dominicana, Pasta italiana auténtica, Tacos mexicanos tradicionales...'
                }
                className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-${
                  theme.selectedBorder
                }/20 focus:border-${
                  theme.selectedBorder
                } transition-all text-lg ${
                  errors.customCuisineType
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200'
                }`}
              />
              {errors.customCuisineType && (
                <p className='text-red-500 text-sm mt-2 flex items-center'>
                  <AlertTriangle className='w-4 h-4 mr-1' />
                  {errors.customCuisineType}
                </p>
              )}

              <div className='mt-4 p-4 bg-white/70 rounded-xl border border-white/50'>
                <p className={`text-${theme.textColor} text-sm font-medium`}>
                  💡{' '}
                  {formData.chefType === 'professional'
                    ? 'Nuestro chef experimentado puede adaptar cualquier estilo culinario con técnicas profesionales'
                    : 'Tu chef adaptará tus platillos favoritos con el toque casero que tanto te gusta'}
                </p>
              </div>
            </div>
          </div>
        )}

        {errors.cuisineType && (
          <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200'>
            <AlertTriangle className='w-5 h-5' />
            <p className='font-medium'>{errors.cuisineType}</p>
          </div>
        )}
      </div>

      {/* OR divider */}
      <div className='relative py-8'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-300' />
        </div>
        <div className='relative flex justify-center text-lg'>
          <span className='bg-white px-6 text-gray-500 font-medium'>
            O elige el menú del chef
          </span>
        </div>
      </div>

      {/* ✅ NEW: Chef Menu Option */}
      {!formData.selectedSpecialMenu && (
        <div className='space-y-8'>
          {/* Chef Menu Option */}
          <div className='space-y-6'>
            <div
              onClick={() => setShowChefMenu(!showChefMenu)}
              className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                showChefMenu
                  ? `border-${theme.selectedBorder} bg-${theme.selectedBg} shadow-xl`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      showChefMenu
                        ? `bg-gradient-to-br ${theme.gradient}`
                        : 'bg-gray-100'
                    }`}
                  >
                    <BookOpen
                      className={`w-6 h-6 ${
                        showChefMenu ? 'text-white' : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <div>
                    <h5 className='text-lg font-bold text-gray-900 mb-1'>
                      Ver Menú del Chef
                    </h5>
                    <p className='text-gray-600 text-sm'>
                      Explora platillos específicos y arma tu menú personalizado
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform duration-300 ${
                    showChefMenu ? 'rotate-180' : ''
                  }`}
                >
                  <svg
                    className='w-6 h-6 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Chef Menu Component */}
            {showChefMenu && (
              <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
                <div className='p-6 border-b border-gray-200 bg-gray-50'>
                  <div className='flex items-center space-x-3'>
                    <BookOpen className='w-6 h-6 text-amber-600' />
                    <h6 className='text-lg font-bold text-gray-900'>
                      Menú del Chef
                    </h6>
                    {formData.selectedMenuItems &&
                      formData.selectedMenuItems.length > 0 && (
                        <div className='bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium'>
                          {formData.selectedMenuItems.length} platillo
                          {formData.selectedMenuItems.length !== 1
                            ? 's'
                            : ''}{' '}
                          seleccionado
                          {formData.selectedMenuItems.length !== 1 ? 's' : ''}
                        </div>
                      )}
                  </div>
                  <p className='text-gray-600 mt-2'>
                    Selecciona los platillos específicos que deseas para tu
                    evento
                  </p>
                </div>

                <RestaurantMenuSelector
                  onSelectionChange={handleMenuItemsChange}
                  allowQuantitySelection={true}
                  showPricing={true}
                  maxSelections={
                    formData.chefType === 'professional' ? undefined : 10
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CuisineAndBudgetStep;
