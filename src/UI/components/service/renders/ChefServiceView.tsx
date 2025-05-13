// views/ChefServiceView.tsx

import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ChefHat, Utensils, Users, Check, AlertCircle } from 'lucide-react';

interface ChefServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const ChefServiceView: React.FC<ChefServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();

  // Determinar si es servicio premium
  const isPremium = service.packageType.includes('premium');

  // Extraer opciones de cocina si existen
  let cuisineOptions: Record<string, any> = {};
  if (serviceData?.options?.cuisineType?.subOptions) {
    cuisineOptions = serviceData.options.cuisineType.subOptions;
  }

  // Extraer opciones de comidas si existen
  let mealOptions: Record<string, any> = {};
  if (serviceData?.options?.mealCount?.subOptions) {
    mealOptions = serviceData.options.mealCount.subOptions;
  }

  // Obtener número máximo de personas
  const maxPeople = serviceData?.metaData?.maxPeople || 10;

  return (
    <div className='space-y-8'>
      {/* Descripción */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            {serviceData?.titleKey ? t(serviceData.titleKey) : service.name}
          </h2>
          <p className='text-lg text-gray-700 mb-6'>
            {serviceData?.descriptionKey
              ? t(serviceData.descriptionKey)
              : service.description}
          </p>
          {serviceData?.fullDescriptionKey && (
            <p className='text-gray-700 mt-3'>
              {t(serviceData.fullDescriptionKey)}
            </p>
          )}
        </div>
      </div>

      {/* Destacados del servicio */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <div className={`bg-${primaryColor}-50 p-4 rounded-lg`}>
          <h3 className='font-medium text-gray-900 mb-2 flex items-center'>
            <ChefHat className={`h-5 w-5 text-${primaryColor}-600 mr-2`} />
            {t('chefDetails.experience')}
          </h3>
          <p className='text-gray-700'>
            {isPremium
              ? t('chefDetails.gourmetExperience')
              : t('chefDetails.personalizedExperience')}
          </p>
        </div>

        <div className={`bg-${primaryColor}-50 p-4 rounded-lg`}>
          <h3 className='font-medium text-gray-900 mb-2 flex items-center'>
            <Users className={`h-5 w-5 text-${primaryColor}-600 mr-2`} />
            {t('chefDetails.capacity')}
          </h3>
          <p className='text-gray-700'>
            {t('chefDetails.upToGuests', { count: maxPeople })}
          </p>
        </div>
      </div>

      {/* Tipos de Cocina */}
      {Object.keys(cuisineOptions).length > 0 && (
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='p-6 md:p-8'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              {t('chefDetails.cuisineTypes')}
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {Object.entries(cuisineOptions).map(([key, cuisine]) => (
                <div
                  key={key}
                  className='bg-gray-100 p-4 rounded-lg relative overflow-hidden group hover:shadow-md transition-shadow'
                >
                  {/* Gradiente decorativo */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${primaryColor}-500/5 to-${primaryColor}-500/20 opacity-0 group-hover:opacity-100 transition-opacity`}
                  ></div>

                  <h4 className='font-medium text-gray-800 mb-2 relative z-10'>
                    {typeof cuisine === 'object' && 'nameKey' in cuisine
                      ? t(cuisine.nameKey, { fallback: key })
                      : key}
                  </h4>

                  {isPremium && (
                    <p className='text-xs text-gray-500 italic relative z-10'>
                      {t('chefDetails.premiumIngredients')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Opciones de Comidas */}
      {Object.keys(mealOptions).length > 0 && (
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='p-6 md:p-8'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              {t('chefDetails.mealOptions')}
            </h3>
            <div className='space-y-3'>
              {Object.entries(mealOptions).map(([key, meal]) => (
                <div
                  key={key}
                  className='flex justify-between items-center border-b border-gray-200 pb-3'
                >
                  <div className='flex items-center'>
                    <Utensils
                      className={`h-5 w-5 text-${primaryColor}-600 mr-3`}
                    />
                    <div>
                      <h4 className='font-medium text-gray-800'>
                        {typeof meal === 'object' && 'nameKey' in meal
                          ? t(meal.nameKey, { fallback: key })
                          : key}
                      </h4>
                      {key === 'fullDay' && (
                        <p className='text-sm text-gray-600'>
                          {t('chefDetails.fullDayDescription')}
                        </p>
                      )}
                    </div>
                  </div>

                  {typeof meal === 'object' && 'price' in meal && (
                    <span className='font-medium text-gray-900'>
                      {meal.price > 0 ? `+$${meal.price}` : ''}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Proceso del servicio */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            {t('chefDetails.serviceProcess')}
          </h3>
          <ol className='space-y-4'>
            <li className='flex'>
              <span
                className={`flex-shrink-0 h-6 w-6 rounded-full bg-${primaryColor}-100 text-${primaryColor}-800 flex items-center justify-center font-medium mr-3`}
              >
                1
              </span>
              <div className='text-gray-700'>
                <p className='font-medium'>{t('chefDetails.step1Title')}</p>
                <p className='text-sm'>{t('chefDetails.step1Description')}</p>
              </div>
            </li>

            <li className='flex'>
              <span
                className={`flex-shrink-0 h-6 w-6 rounded-full bg-${primaryColor}-100 text-${primaryColor}-800 flex items-center justify-center font-medium mr-3`}
              >
                2
              </span>
              <div className='text-gray-700'>
                <p className='font-medium'>{t('chefDetails.step2Title')}</p>
                <p className='text-sm'>{t('chefDetails.step2Description')}</p>
              </div>
            </li>

            <li className='flex'>
              <span
                className={`flex-shrink-0 h-6 w-6 rounded-full bg-${primaryColor}-100 text-${primaryColor}-800 flex items-center justify-center font-medium mr-3`}
              >
                3
              </span>
              <div className='text-gray-700'>
                <p className='font-medium'>{t('chefDetails.step3Title')}</p>
                <p className='text-sm'>{t('chefDetails.step3Description')}</p>
              </div>
            </li>

            <li className='flex'>
              <span
                className={`flex-shrink-0 h-6 w-6 rounded-full bg-${primaryColor}-100 text-${primaryColor}-800 flex items-center justify-center font-medium mr-3`}
              >
                4
              </span>
              <div className='text-gray-700'>
                <p className='font-medium'>{t('chefDetails.step4Title')}</p>
                <p className='text-sm'>{t('chefDetails.step4Description')}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* Notas importantes */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
            <AlertCircle className={`h-5 w-5 text-amber-500 mr-2`} />
            {t('chefDetails.importantNotes')}
          </h3>

          <ul className='space-y-2'>
            <li className='flex items-start'>
              <Check className={`h-5 w-5 text-green-500 mr-2 mt-0.5`} />
              <span className='text-gray-700'>{t('chefDetails.note1')}</span>
            </li>
            <li className='flex items-start'>
              <Check className={`h-5 w-5 text-green-500 mr-2 mt-0.5`} />
              <span className='text-gray-700'>{t('chefDetails.note2')}</span>
            </li>
            <li className='flex items-start'>
              <Check className={`h-5 w-5 text-green-500 mr-2 mt-0.5`} />
              <span className='text-gray-700'>{t('chefDetails.note3')}</span>
            </li>
            {serviceData?.metaData?.needsGroceries && (
              <li className='flex items-start'>
                <AlertCircle className={`h-5 w-5 text-amber-500 mr-2 mt-0.5`} />
                <span className='text-gray-700'>
                  {t('chefDetails.groceriesNote')}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChefServiceView;
