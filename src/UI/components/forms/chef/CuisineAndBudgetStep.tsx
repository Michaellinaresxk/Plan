import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  Utensils,
  Check,
  ChefHat,
  Sparkles,
  Star,
  Crown,
  Globe,
  Award,
  AlertTriangle,
} from 'lucide-react';
import {
  budgetOptions,
  chefsSpecialMenus,
  cuisineTypes,
} from '@/constants/chef/chefForm';

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
        cardBg: 'from-orange-100 to-amber-100',
        experience: 'Auténtica',
        description: 'Cocina casera llena de sabor y personalidad',
      };
    }
  };

  const theme = getChefTheme();

  // Show chef's special menu selection
  const [showSpecialMenu, setShowSpecialMenu] = useState(
    !!formData.selectedSpecialMenu
  );

  // Local state to ensure UI updates properly
  const [selectedCuisine, setSelectedCuisine] = useState(
    formData.cuisineType || ''
  );
  const [selectedBudget, setSelectedBudget] = useState(
    formData.budgetOption || ''
  );
  const [selectedSpecialMenu, setSelectedSpecialMenu] = useState(
    formData.selectedSpecialMenu || ''
  );

  // Mapeo explícito entre menús especiales y tipos de cocina
  const menuToCuisineMap: Record<string, string> = {
    mediterranean: 'mediterranean',
    italian: 'italian',
    asian: 'asian',
    mexican: 'mexican',
  };

  // Handle cuisine type selection
  const handleCuisineSelect = (cuisineId: string) => {
    setSelectedCuisine(cuisineId);
    onChange('cuisineType', cuisineId);
    setSelectedSpecialMenu('');
    onChange('selectedSpecialMenu', '');
  };

  // Handle budget option selection
  const handleBudgetSelect = (budgetId: string) => {
    setSelectedBudget(budgetId);
    onChange('budgetOption', budgetId);
  };

  // Handle special menu selection
  const handleSpecialMenuSelect = (menuId: string) => {
    const selectedMenu = chefsSpecialMenus.find((menu) => menu.id === menuId);

    if (selectedMenu) {
      const cuisineTypeValue = menuToCuisineMap[menuId] || menuId;
      setSelectedSpecialMenu(menuId);
      setSelectedCuisine(cuisineTypeValue);
      onChange('selectedSpecialMenu', menuId);
      onChange('cuisineType', cuisineTypeValue);
    } else {
      setSelectedSpecialMenu('');
      onChange('selectedSpecialMenu', '');
    }
  };

  // Sync effect
  useEffect(() => {
    if (selectedCuisine && selectedCuisine !== formData.cuisineType) {
      onChange('cuisineType', selectedCuisine);
    }
  }, [selectedCuisine]);

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
            <Utensils className='w-10 h-10 text-white drop-shadow-lg' />
          </div>
          <h3 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4'>
            Cocina & Experiencia
          </h3>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light'>
            Selecciona el estilo culinario para tu{' '}
            <span className={`font-bold text-${theme.textColor}`}>
              {theme.experience} {theme.name}
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
              <Utensils className='w-8 h-8 text-white' />
            )}
          </div>
          <div>
            <h4 className={`text-2xl font-bold text-${theme.textColor}`}>
              {theme.name} Seleccionado
            </h4>
            <p className='text-gray-700 text-lg'>{theme.description}</p>
          </div>
          <div className='ml-auto'>
            <div
              className={`px-4 py-2 bg-white rounded-xl border border-${theme.borderColor} ${theme.iconColor} font-semibold`}
            >
              ✓ Confirmado
            </div>
          </div>
        </div>
      </div>

      {/* Campos ocultos para asegurar que el formulario tiene los valores */}
      <input type='hidden' name='cuisineType' value={selectedCuisine} />
      <input type='hidden' name='budgetOption' value={selectedBudget} />
      <input
        type='hidden'
        name='selectedSpecialMenu'
        value={selectedSpecialMenu}
      />

      {!showSpecialMenu ? (
        <>
          {/* Cuisine Selection */}
          <div className='space-y-8'>
            <div className='text-center'>
              <h4 className='text-2xl font-bold text-gray-900 mb-2'>
                Estilo Culinario
              </h4>
              <p className='text-gray-600'>
                {formData.chefType === 'professional'
                  ? 'Explora nuestros menús curados de nivel mundial'
                  : 'Elige el estilo que más te guste para personalizar tu experiencia'}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine.id}
                  type='button'
                  onClick={() => handleCuisineSelect(cuisine.id)}
                  className={`
                    group relative overflow-hidden p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 text-left w-full
                    ${
                      selectedCuisine === cuisine.id
                        ? `${theme.selectedBorder} ${theme.selectedBg} shadow-2xl ${theme.shadow} ring-4 ring-${theme.primaryColor}-200/50`
                        : `border-gray-200 hover:border-${theme.borderColor} hover:shadow-xl bg-white`
                    }
                  `}
                >
                  {/* Background Pattern for Professional */}
                  {formData.chefType === 'professional' && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5`}
                    ></div>
                  )}

                  <div className='relative z-10'>
                    <div className='flex justify-between items-start mb-4'>
                      <div className='flex items-center space-x-4'>
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <Globe className='w-6 h-6 text-white' />
                        </div>
                        <div>
                          <h4 className='font-bold text-gray-900 text-xl mb-1'>
                            {cuisine.name}
                          </h4>
                          {formData.chefType === 'professional' && (
                            <div className='flex items-center space-x-2'>
                              <Award className='w-4 h-4 text-amber-500' />
                              <span className='text-amber-600 text-sm font-medium'>
                                Menú Curado
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {cuisine.price > 0 && (
                        <div
                          className={`px-3 py-1 bg-gradient-to-r ${theme.gradient} text-white rounded-full text-sm font-bold shadow-lg`}
                        >
                          +${cuisine.price}
                        </div>
                      )}
                    </div>

                    <p className='text-gray-600 mb-4 leading-relaxed'>
                      {cuisine.description}
                    </p>

                    {formData.chefType === 'professional' && (
                      <div
                        className={`p-3 bg-gradient-to-r ${theme.cardBg} rounded-xl border border-${theme.borderColor} mb-4`}
                      >
                        <p
                          className={`text-${theme.textColor} text-sm font-medium`}
                        >
                          ✨ Ingredientes premium y técnicas profesionales
                          incluidas
                        </p>
                      </div>
                    )}

                    {selectedCuisine === cuisine.id && (
                      <div className='flex justify-end'>
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center shadow-lg`}
                        >
                          <Check className='w-5 h-5 text-white' />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {errors.cuisineType && (
              <div className='flex items-center justify-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 max-w-md mx-auto'>
                <AlertTriangle className='w-5 h-5' />
                <p className='font-medium'>{errors.cuisineType}</p>
              </div>
            )}

            {/* Chef Special Menus Option */}
            {formData.chefType === 'professional' && (
              <div className='text-center'>
                <button
                  type='button'
                  onClick={() => setShowSpecialMenu(true)}
                  className={`inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  <ChefHat className='w-6 h-6' />
                  <span>Explorar Menús Signature del Chef</span>
                  <Crown className='w-5 h-5' />
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        // Chef's Special Menu Selection (Solo para Professional)
        <>
          <div className='space-y-8'>
            <div className='flex justify-between items-center'>
              <div className='text-center flex-1'>
                <div className='flex items-center justify-center space-x-3 mb-4'>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center`}
                  >
                    <Crown className='w-6 h-6 text-white' />
                  </div>
                  <h4 className={`text-2xl font-bold text-${theme.textColor}`}>
                    Menús Signature Exclusivos
                  </h4>
                </div>
                <p className='text-gray-600'>
                  Creaciones únicas de nuestros chefs experimentados
                </p>
              </div>
              <button
                type='button'
                onClick={() => setShowSpecialMenu(false)}
                className={`text-${theme.textColor} hover:text-${theme.primaryColor}-900 underline underline-offset-2 font-medium transition-colors`}
              >
                ← Volver a Selección de Cocina
              </button>
            </div>

            <div className='space-y-6'>
              {chefsSpecialMenus.map((menu) => (
                <button
                  key={menu.id}
                  type='button'
                  onClick={() => handleSpecialMenuSelect(menu.id)}
                  className={`
                    group relative overflow-hidden p-8 rounded-3xl border-2 cursor-pointer transition-all duration-700 w-full text-left hover:scale-102
                    ${
                      selectedSpecialMenu === menu.id
                        ? `${theme.selectedBorder} ${theme.selectedBg} shadow-2xl ${theme.shadow} ring-4 ring-${theme.primaryColor}-200/50`
                        : `border-gray-200 hover:border-${theme.borderColor} hover:shadow-xl bg-white`
                    }
                  `}
                >
                  {/* Premium Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5`}
                  ></div>

                  <div className='relative z-10'>
                    <div className='flex justify-between items-start mb-6'>
                      <div className='flex items-center space-x-4'>
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${theme.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          <ChefHat className='w-8 h-8 text-white' />
                        </div>
                        <div>
                          <h4 className='font-bold text-2xl text-gray-900 mb-2'>
                            {menu.title}
                          </h4>
                          <div className='flex items-center space-x-3'>
                            <div className='flex items-center space-x-1'>
                              <Crown className='w-4 h-4 text-amber-500' />
                              <span className='text-amber-600 text-sm font-medium'>
                                Menú Signature
                              </span>
                            </div>
                            <div className='flex items-center space-x-1'>
                              <Award className='w-4 h-4 text-purple-500' />
                              <span className='text-purple-600 text-sm font-medium'>
                                Chef Experimentado
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-2xl font-bold shadow-lg`}
                      >
                        ${menu.price} por persona
                      </div>
                    </div>

                    <p className='text-gray-700 text-lg leading-relaxed mb-6'>
                      {menu.description}
                    </p>

                    <div
                      className={`bg-gradient-to-r ${theme.cardBg} rounded-2xl p-6 border border-${theme.borderColor} shadow-inner`}
                    >
                      <h5
                        className={`font-bold text-${theme.textColor} text-lg mb-4 flex items-center`}
                      >
                        <Sparkles className='w-5 h-5 mr-2' />
                        Menú Degustación:
                      </h5>
                      <div className='space-y-3'>
                        {menu.courses.map((course, idx) => (
                          <div
                            key={idx}
                            className='flex items-start space-x-3 p-3 bg-white/80 rounded-xl border border-white/50'
                          >
                            <div
                              className={`w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                            >
                              {idx + 1}
                            </div>
                            <div>
                              <span className='font-semibold text-gray-900'>
                                {course.name}:
                              </span>{' '}
                              <span className='text-gray-700'>
                                {course.description}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedSpecialMenu === menu.id && (
                      <div className='flex justify-end mt-6'>
                        <div
                          className={`flex items-center space-x-3 px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-2xl shadow-lg`}
                        >
                          <Check className='w-6 h-6' />
                          <span className='font-bold'>Menú Seleccionado</span>
                          <Crown className='w-5 h-5' />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Selection Summary */}
      {(selectedCuisine || selectedSpecialMenu) && selectedBudget && (
        <div
          className={`p-8 bg-gradient-to-r ${theme.lightGradient} rounded-3xl border-2 border-${theme.borderColor} shadow-2xl ${theme.shadow}`}
        >
          <div className='text-center mb-6'>
            <h4 className={`text-2xl font-bold text-${theme.textColor} mb-2`}>
              Resumen de tu Experiencia {theme.experience}
            </h4>
            <p className='text-gray-700'>
              Configuración seleccionada para tu {theme.name}
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50'>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center`}
                >
                  {selectedSpecialMenu ? (
                    <ChefHat className='w-6 h-6 text-white' />
                  ) : (
                    <Globe className='w-6 h-6 text-white' />
                  )}
                </div>
                <div>
                  <h5 className='font-bold text-gray-900'>Estilo Culinario</h5>
                  <p className={`text-${theme.textColor} font-medium`}>
                    {selectedSpecialMenu
                      ? chefsSpecialMenus.find(
                          (m) => m.id === selectedSpecialMenu
                        )?.title
                      : cuisineTypes.find((c) => c.id === selectedCuisine)
                          ?.name}
                  </p>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50'>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-xl flex items-center justify-center`}
                >
                  <Star className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h5 className='font-bold text-gray-900'>
                    Nivel de Experiencia
                  </h5>
                  <p className={`text-${theme.textColor} font-medium`}>
                    {budgetOptions.find((b) => b.id === selectedBudget)?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 text-center'>
            <div
              className={`inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white rounded-2xl shadow-lg`}
            >
              <Crown className='w-8 h-8' />
              <div>
                <h5 className='font-bold text-xl'>Configuración Completa</h5>
                <p className='opacity-90'>
                  Lista para continuar con tu experiencia{' '}
                  {theme.experience.toLowerCase()}
                </p>
              </div>
              <Sparkles className='w-6 h-6' />
            </div>
          </div>
        </div>
      )}

      {/* Save Selection Button */}
      <div className='text-center'>
        <button
          type='button'
          onClick={() => {
            onChange('cuisineType', selectedCuisine);
            onChange('budgetOption', selectedBudget);
            onChange('selectedSpecialMenu', selectedSpecialMenu);
          }}
          className={`px-12 py-4 bg-gradient-to-r ${theme.gradient} text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          <div className='flex items-center space-x-3'>
            <Check className='w-6 h-6' />
            <span>Confirmar Selecciones Culinarias</span>
            {formData.chefType === 'professional' ? (
              <Crown className='w-5 h-5' />
            ) : (
              <Sparkles className='w-5 h-5' />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default CuisineAndBudgetStep;
