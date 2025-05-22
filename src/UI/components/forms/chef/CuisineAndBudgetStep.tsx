import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Utensils, Check, ChefHat } from 'lucide-react';
import {
  budgetOptions,
  chefsSpecialMenus,
  cuisineTypes,
} from '@/constants/chefFormConsts';

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

  // Debug log when component mounts and when form data changes
  useEffect(() => {
    console.log('Current form data:', formData);
    console.log('Selected cuisine:', selectedCuisine);
  }, [formData, selectedCuisine]);

  // Mapeo explícito entre menús especiales y tipos de cocina
  // Esto es crucial para asegurar que se seleccione el tipo de cocina correcto
  const menuToCuisineMap: Record<string, string> = {
    mediterranean: 'mediterranean', // el id del menú especial -> id del tipo de cocina
    // Añade todos los mapeos necesarios aquí
    italian: 'italian',
    asian: 'asian',
    // etc...
  };

  // Handle cuisine type selection
  const handleCuisineSelect = (cuisineId: string) => {
    console.log(`Selecting cuisine: ${cuisineId}`);

    // Actualizar tanto el estado local como el estado del formulario padre
    setSelectedCuisine(cuisineId);
    onChange('cuisineType', cuisineId);

    // Reset special menu when cuisine changes
    setSelectedSpecialMenu('');
    onChange('selectedSpecialMenu', '');

    // Debugging
    console.log('Updated cuisineType to:', cuisineId);
  };

  // Handle budget option selection
  const handleBudgetSelect = (budgetId: string) => {
    console.log(`Selecting budget: ${budgetId}`);

    setSelectedBudget(budgetId);
    onChange('budgetOption', budgetId);
  };

  // Handle special menu selection
  const handleSpecialMenuSelect = (menuId: string) => {
    console.log(`Selecting special menu: ${menuId}`);

    const selectedMenu = chefsSpecialMenus.find((menu) => menu.id === menuId);

    if (selectedMenu) {
      // Usar el mapeo para obtener el tipo de cocina correspondiente
      // Si no existe en el mapeo, usar el ID del menú como fallback
      const cuisineTypeValue = menuToCuisineMap[menuId] || menuId;

      console.log(
        `Mapping special menu ${menuId} to cuisine type ${cuisineTypeValue}`
      );

      // Actualizar estados
      setSelectedSpecialMenu(menuId);
      setSelectedCuisine(cuisineTypeValue);

      // Actualizar estado del padre - ESTO ES LO MÁS IMPORTANTE
      onChange('selectedSpecialMenu', menuId);
      onChange('cuisineType', cuisineTypeValue);

      // Log para debug
      console.log('After update - cuisineType should be:', cuisineTypeValue);
    } else {
      setSelectedSpecialMenu('');
      onChange('selectedSpecialMenu', '');
    }
  };

  // Este efecto es importante - asegúrate de que los cambios en el estado local
  // se reflejen en el estado del formulario padre
  useEffect(() => {
    if (selectedCuisine && selectedCuisine !== formData.cuisineType) {
      onChange('cuisineType', selectedCuisine);
      console.log('Sync effect - updated cuisineType to:', selectedCuisine);
    }
  }, [selectedCuisine]);

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
        <Utensils className='w-5 h-5 mr-2 text-amber-600' />
        {t('chef.form.step3.title', { fallback: 'Cuisine & Budget' })}
      </h3>

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
          <div>
            <label className='block text-lg font-medium text-gray-800 mb-3'>
              {t('chef.form.cuisineType', {
                fallback: 'What cuisine would you like?',
              })}{' '}
              *
            </label>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine.id}
                  type='button'
                  onClick={() => handleCuisineSelect(cuisine.id)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md text-left w-full
                    ${
                      selectedCuisine === cuisine.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }
                  `}
                >
                  <div className='flex justify-between items-center'>
                    <h4 className='font-medium text-gray-900'>
                      {cuisine.name}
                    </h4>
                    {cuisine.price > 0 && (
                      <span className='text-amber-700 font-medium'>
                        +${cuisine.price}
                      </span>
                    )}
                  </div>
                  <p className='text-sm text-gray-600 mt-1'>
                    {cuisine.description}
                  </p>

                  {selectedCuisine === cuisine.id && (
                    <div className='mt-2 flex justify-end'>
                      <div className='w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center'>
                        <Check className='w-4 h-4 text-white' />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {errors.cuisineType && (
              <p className='text-red-500 text-sm mt-2'>{errors.cuisineType}</p>
            )}

            <div className='mt-4 text-center'>
              <button
                type='button'
                onClick={() => setShowSpecialMenu(true)}
                className='inline-flex items-center text-amber-700 hover:text-amber-800 underline underline-offset-2 font-medium'
              >
                <ChefHat className='w-4 h-4 mr-1' />
                Need inspiration? Try Chef Special Menus
              </button>
            </div>
          </div>
        </>
      ) : (
        // Chef's Special Menu Selection
        <>
          <div>
            <div className='flex justify-between items-center mb-3'>
              <label className='block text-lg font-medium text-gray-800'>
                {t('chef.form.specialMenu', {
                  fallback: "Chef's Special Menus",
                })}
              </label>
              <button
                type='button'
                onClick={() => setShowSpecialMenu(false)}
                className='text-amber-700 hover:text-amber-800 underline underline-offset-2 text-sm'
              >
                Back to Cuisine Selection
              </button>
            </div>

            <div className='space-y-4'>
              {chefsSpecialMenus.map((menu) => (
                <button
                  key={menu.id}
                  type='button'
                  onClick={() => handleSpecialMenuSelect(menu.id)}
                  className={`
                    p-5 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md w-full text-left
                    ${
                      selectedSpecialMenu === menu.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }
                  `}
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <h4 className='font-medium text-lg text-gray-900'>
                        {menu.title}
                      </h4>
                      <p className='text-sm text-gray-600 mt-1'>
                        {menu.description}
                      </p>
                    </div>
                    <span className='text-amber-700 font-medium whitespace-nowrap ml-2'>
                      ${menu.price} per person
                    </span>
                  </div>

                  <div className='mt-4 bg-white/80 rounded-lg p-3 border border-gray-100'>
                    <h5 className='font-medium text-gray-800 mb-2'>
                      Sample Menu:
                    </h5>
                    <ul className='space-y-2'>
                      {menu.courses.map((course, idx) => (
                        <li key={idx} className='text-sm'>
                          <span className='font-medium'>{course.name}:</span>{' '}
                          {course.description}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedSpecialMenu === menu.id && (
                    <div className='mt-2 flex justify-end'>
                      <div className='w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center'>
                        <Check className='w-4 h-4 text-white' />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Budget Selection */}
      <div className='mt-8'>
        <label className='block text-lg font-medium text-gray-800 mb-3'>
          {t('chef.form.budget', {
            fallback: 'Choose your budget experience',
          })}{' '}
          *
        </label>

        <div className='grid grid-cols-1 gap-4'>
          {budgetOptions.map((option) => (
            <button
              key={option.id}
              type='button'
              onClick={() => handleBudgetSelect(option.id)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md text-left w-full
                ${
                  selectedBudget === option.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
                }
              `}
            >
              <div className='flex justify-between items-center'>
                <h4 className='font-medium text-gray-900'>{option.name}</h4>
                {option.id === 'professional' && (
                  <span className='text-amber-700 font-medium'>
                    +${option.price - 120}
                  </span>
                )}
              </div>
              <p className='text-sm text-gray-600 mt-1'>{option.description}</p>

              {selectedBudget === option.id && (
                <div className='mt-2 flex justify-end'>
                  <div className='w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center'>
                    <Check className='w-4 h-4 text-white' />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {errors.budgetOption && (
          <p className='text-red-500 text-sm mt-2'>{errors.budgetOption}</p>
        )}
      </div>

      {/* Botón para guardar selecciones antes de continuar */}
      <button
        type='button'
        onClick={() => {
          // Forzar actualización directa de todos los campos
          onChange('cuisineType', selectedCuisine);
          onChange('budgetOption', selectedBudget);
          onChange('selectedSpecialMenu', selectedSpecialMenu);

          console.log('Selecciones guardadas explícitamente');
          console.log({
            cuisineType: selectedCuisine,
            budgetOption: selectedBudget,
            selectedSpecialMenu: selectedSpecialMenu,
          });
        }}
        className='mt-4 w-full py-3 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 transition-colors'
      >
        Guardar selecciones
      </button>
    </div>
  );
};

export default CuisineAndBudgetStep;
