import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  GROCERY_CATEGORIES,
  GroceryItem,
  SPIRIT_CATEGORIES,
} from '@/constants/GroceryShopping';
import TabSelector from './TabSelector';
import SummaryBar from './SummaryBar';
import SpecialRequests from './SpecialRequests';
import SubmitButton from './SubmitButton';
import AccordionGrocery from './AccordionGrocery';
import { ShoppingBasket, Wine, Check, Sparkles } from 'lucide-react';

/**
 * Componente principal para la selección de productos de supermercado y licores
 * Versión modernizada con mejor UX/UI
 */

interface GroceryShoppingSelectorProps {
  onItemsSelected: (items: GroceryItem[]) => void;
  // Add a new prop for the parent's openModal function
  onSubmit?: () => void;
}

const GroceryShoppingSelector: React.FC<GroceryShoppingSelectorProps> = ({
  onItemsSelected,
  onSubmit,
}) => {
  const { t } = useTranslation();

  // Estados
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'grocery' | 'spirits'>('grocery');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejadores de eventos
  const handleToggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  function splitIntoColumns<T>(items: T[], columns: number): T[][] {
    const result = Array.from({ length: columns }, () => []);
    items.forEach((item, index) => {
      result[index % columns].push(item);
    });
    return result;
  }

  const handleClearAll = () => {
    setSelectedItems([]);
  };

  // Selecciona las categorías según la pestaña activa
  const categories =
    activeTab === 'grocery' ? GROCERY_CATEGORIES : SPIRIT_CATEGORIES;
  const columns = splitIntoColumns(categories, 2);

  const handleSubmit = () => {
    // Show loading state
    setIsSubmitting(true);

    // Simulate a short delay for UI feedback
    setTimeout(() => {
      setIsSubmitting(false);

      // Call the parent's submit handler if provided
      if (onSubmit) {
        onSubmit();
      }
    }, 300);
  };

  useEffect(() => {
    if (onItemsSelected) {
      onItemsSelected(selectedItems);
    }
  }, [selectedItems, onItemsSelected]);

  useEffect(() => {
    onItemsSelected(selectedItems);
  }, [selectedItems, onItemsSelected]);

  return (
    <div className='w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
      {/* Cabecera con degradado moderno */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 text-white'>
        <div className='flex items-center'>
          {activeTab === 'grocery' ? (
            <ShoppingBasket className='w-6 h-6 mr-3 text-blue-100' />
          ) : (
            <Wine className='w-6 h-6 mr-3 text-blue-100' />
          )}
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('grocery.service.title', {
              fallback: 'Grocery Shopping Service',
            })}
          </h2>
        </div>
        <p className='text-blue-100 mt-2 font-light'>
          {t('grocery.service.subtitle', {
            fallback:
              'Select the items you would like to include in your grocery list',
          })}
        </p>
      </div>

      {/* Contenedor principal con padding adecuado */}
      <div className='p-6 sm:p-8'>
        {/* Selector de pestañas - asumimos que el componente se actualizará en consecuencia */}
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Barra de resumen con animación y diseño mejorado */}
        <div className='mt-6 mb-8'>
          <SummaryBar
            selectedCount={selectedItems.length}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Panel principal con sombras suaves y espaciado mejorado */}
        <div className='bg-gray-50 rounded-xl p-6 mb-8'>
          {/* Contenido principal - Categorías con sus ítems */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8'>
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className='flex flex-col gap-4 sm:gap-6'>
                {column.map((category) => (
                  <AccordionGrocery
                    key={category.id}
                    category={category}
                    selectedItems={selectedItems}
                    onItemToggle={handleToggleItem}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Solicitudes especiales con diseño mejorado */}
        <div className='mb-8'>
          <SpecialRequests
            value={specialRequests}
            onChange={setSpecialRequests}
          />
        </div>

        {/* Sección inferior con botón de envío */}
        <div className='flex justify-between items-center'>
          <div className='text-sm text-gray-500 flex items-center'>
            {selectedItems.length > 0 && (
              <>
                <Check className='w-4 h-4 text-green-500 mr-1' />
                <span>
                  {selectedItems.length}{' '}
                  {selectedItems.length === 1 ? 'item' : 'items'} seleccionados
                </span>
              </>
            )}
          </div>

          {/* Botón de envío con transición y estado de carga */}
          <div className='relative'>
            {selectedItems.length > 0 && (
              <span className='absolute -top-1 -right-1'>
                <Sparkles className='w-4 h-4 text-amber-500 animate-pulse' />
              </span>
            )}
            {/* <SubmitButton
              onSubmit={handleSubmit}
              disabled={selectedItems.length === 0 || isSubmitting}
              isLoading={isSubmitting}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryShoppingSelector;
