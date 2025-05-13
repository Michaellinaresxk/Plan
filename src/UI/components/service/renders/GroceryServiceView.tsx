// views/GroceryServiceView.tsx

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ShoppingBag, Clock, Truck, Filter } from 'lucide-react';

interface GroceryServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor: string;
}

const GroceryServiceView: React.FC<GroceryServiceViewProps> = ({
  service,
  serviceData,
  primaryColor,
}) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Datos del servicio
  const deliveryTime = serviceData?.metaData?.deliveryTime || '24-48 hours';
  const minimumOrder = serviceData?.metaData?.minimumOrder || '$50';

  // Categorías de ejemplo para el filtro
  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'produce', name: 'Fresh Produce' },
    { id: 'bakery', name: 'Bakery & Pastries' },
    { id: 'meat', name: 'Meat & Seafood' },
    { id: 'dairy', name: 'Dairy & Eggs' },
    { id: 'pantry', name: 'Pantry Essentials' },
    { id: 'snacks', name: 'Snacks & Treats' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'organic', name: 'Organic' },
    { id: 'gourmet', name: 'Gourmet' },
  ];

  return (
    <div className='space-y-8'>
      {/* Sección de introducción */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2 flex items-center'>
            <ShoppingBag
              className={`mr-3 text-${primaryColor}-500`}
              size={24}
            />
            {t('groceryService.title', {
              fallback: 'Grocery Shopping Service',
            })}
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

          {/* Características destacadas */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
            <div
              className={`flex items-start p-4 bg-${primaryColor}-50 rounded-lg`}
            >
              <div
                className={`h-12 w-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-4`}
              >
                <Clock className={`h-6 w-6 text-${primaryColor}-600`} />
              </div>
              <div>
                <h3 className='font-medium text-gray-900 mb-1'>
                  {t('groceryService.deliveryTime')}
                </h3>
                <p className='text-gray-700'>{deliveryTime}</p>
              </div>
            </div>
            <div
              className={`flex items-start p-4 bg-${primaryColor}-50 rounded-lg`}
            >
              <div
                className={`h-12 w-12 rounded-full bg-${primaryColor}-100 flex items-center justify-center mr-4`}
              >
                <ShoppingBag className={`h-6 w-6 text-${primaryColor}-600`} />
              </div>
              <div>
                <h3 className='font-medium text-gray-900 mb-1'>
                  {t('groceryService.minimumOrder')}
                </h3>
                <p className='text-gray-700'>{minimumOrder}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de búsqueda y filtrado */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <div className='flex flex-col md:flex-row gap-4 mb-6'>
            {/* Campo de búsqueda */}
            <div className='relative flex-1'>
              <input
                type='text'
                placeholder={t('groceryService.searchPlaceholder', {
                  fallback: 'Search for items...',
                })}
                className='w-full py-3 px-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
              <svg
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                width='20'
                height='20'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>

            {/* Botón de filtro - Móvil */}
            <div className='md:hidden'>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center w-full py-3 px-4 rounded-lg border border-gray-300 ${
                  showFilters
                    ? `bg-${primaryColor}-50 text-${primaryColor}-700`
                    : 'bg-white text-gray-700'
                }`}
              >
                <Filter size={20} className='mr-2' />
                <span>
                  {t('groceryService.filter', { fallback: 'Filter' })}
                </span>
              </button>
            </div>
          </div>

          {/* Filtros - Móvil acordeón */}
          <div
            className={`md:hidden mb-6 overflow-hidden transition-all ${
              showFilters ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-medium text-gray-800 mb-3'>
                {t('groceryService.categories', { fallback: 'Categories' })}
              </h3>
              <div className='grid grid-cols-2 gap-2'>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === category.id
                        ? `bg-${primaryColor}-100 text-${primaryColor}-800`
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filtros - Desktop horizontal */}
          <div className='hidden md:block mb-6'>
            <div className='flex space-x-2 overflow-x-auto pb-2'>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`whitespace-nowrap py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === category.id
                      ? `bg-${primaryColor}-100 text-${primaryColor}-800`
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Productos destacados */}
          <div>
            <h3 className='text-lg font-semibold text-gray-800 mb-6 flex items-center'>
              <ShoppingBag className='h-5 w-5 mr-2 text-blue-500' />
              {t('groceryService.featuredItems', {
                fallback: 'Featured Items',
              })}
            </h3>

            <GroceryItems activeFilter={activeFilter} />

            {/* Ver más botón */}
            <div className='mt-8 text-center'>
              <button
                className={`py-3 px-6 bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-white font-medium rounded-lg transition-colors`}
              >
                {t('groceryService.viewMore', { fallback: 'View More Items' })}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categorías populares */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h3 className='text-lg font-semibold text-gray-800 mb-6'>
            {t('groceryService.browseCategories', {
              fallback: 'Browse by Category',
            })}
          </h3>

          <AccordionGrocery />
        </div>
      </div>

      {/* Información de entrega */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <h3 className='text-lg font-semibold text-gray-800 mb-6 flex items-center'>
            <Truck className='h-5 w-5 mr-2 text-blue-500' />
            {t('groceryService.deliveryInfo', {
              fallback: 'Delivery Information',
            })}
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div
              className={`p-4 bg-${primaryColor}-50 rounded-lg border border-${primaryColor}-100`}
            >
              <h4 className='font-medium text-gray-800 mb-2'>
                {t('groceryService.standardDelivery', {
                  fallback: 'Standard Delivery',
                })}
              </h4>
              <p className='text-gray-700 mb-2'>
                {t('groceryService.standardDeliveryDesc', {
                  fallback:
                    'Delivery within 24-48 hours of placing your order.',
                })}
              </p>
              <div className='flex items-center text-sm text-gray-600'>
                <Clock className='h-4 w-4 mr-1' />
                <span>24-48 hours</span>
              </div>
            </div>

            <div
              className={`p-4 bg-${primaryColor}-50 rounded-lg border border-${primaryColor}-100`}
            >
              <h4 className='font-medium text-gray-800 mb-2'>
                {t('groceryService.expressDelivery', {
                  fallback: 'Express Delivery',
                })}
              </h4>
              <p className='text-gray-700 mb-2'>
                {t('groceryService.expressDeliveryDesc', {
                  fallback:
                    'Need it faster? Select express delivery at checkout.',
                })}
              </p>
              <div className='flex items-center text-sm text-gray-600'>
                <Clock className='h-4 w-4 mr-1' />
                <span>3-6 hours</span>
              </div>
            </div>
          </div>

          <div className='mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100'>
            <h4 className='font-medium text-amber-800 mb-2 flex items-center'>
              <svg
                className='h-5 w-5 mr-2'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              {t('groceryService.importantNote', {
                fallback: 'Important Note',
              })}
            </h4>
            <p className='text-amber-700'>
              {t('groceryService.deliveryNote', {
                fallback:
                  'Delivery times may vary based on availability and location. Orders placed after 6 PM will be processed the next day.',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryServiceView;
