import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  GROCERY_CATEGORIES,
  SPIRIT_CATEGORIES,
} from '@/constants/GroceryShopping';
import TabSelector from './TabSelector';
import SummaryBar from './SummaryBar';
import SpecialRequests from './SpecialRequests';
import SubmitButton from './SubmitButton';
import AccordionGrocery from './AccordionGrocery';

/**
 * Componente principal para la selección de productos de supermercado y licores
 */
const GroceryShoppingSelector: React.FC = () => {
  const { t } = useTranslation();

  // Estados
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'grocery' | 'spirits'>('grocery');
  const [specialRequests, setSpecialRequests] = useState('');

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

  const handleSubmit = () => {
    // En una aplicación real, esto enviaría los datos al backend
    console.log('Enviando ítems seleccionados:', selectedItems);
    console.log('Solicitudes especiales:', specialRequests);

    // Para demostración, mostraremos una alerta
    alert(
      `Seleccionaste ${selectedItems.length} ítems para tu lista de compras!`
    );
  };

  // Selecciona las categorías según la pestaña activa
  const categories =
    activeTab === 'grocery' ? GROCERY_CATEGORIES : SPIRIT_CATEGORIES;
  const columns = splitIntoColumns(categories, 2);
  return (
    <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
      {/* Cabecera */}
      <div className='bg-blue-600 px-6 py-4 text-white'>
        <h2 className='text-xl font-semibold'>
          {t('grocery.service.title', { fallback: 'Grocery Shopping Service' })}
        </h2>
        <p className='text-blue-100 mt-1'>
          {t('grocery.service.subtitle', {
            fallback:
              'Select the items you would like to include in your grocery list',
          })}
        </p>
      </div>

      {/* Selector de pestañas */}
      <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Barra de resumen */}
      <SummaryBar
        selectedCount={selectedItems.length}
        onClearAll={handleClearAll}
      />

      {/* Contenido principal - Categorías con sus ítems */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6'>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className='flex flex-col gap-3 sm:gap-6'>
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

      {/* Solicitudes especiales */}
      <SpecialRequests value={specialRequests} onChange={setSpecialRequests} />

      {/* Botón de envío */}
      <SubmitButton
        onSubmit={handleSubmit}
        disabled={selectedItems.length === 0}
      />
    </div>
  );
};

export default GroceryShoppingSelector;
