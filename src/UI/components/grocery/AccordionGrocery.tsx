import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package, ShoppingCart } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import GroceryItem from './GroceryItem';
import { GroceryCategory } from '@/constants/GroceryShopping';

interface CategoryAccordionProps {
  category: GroceryCategory;
  selectedItems: string[];
  onItemToggle: (id: string) => void;
}

/**
 * Componente de acordeón modernizado que muestra una categoría con sus ítems
 */
const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  category,
  selectedItems,
  onItemToggle,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  // Calcula cuántos ítems están seleccionados en esta categoría
  const selectedCount = category.items.filter((item) =>
    selectedItems.includes(item.id)
  ).length;

  // Calcular el porcentaje de ítems seleccionados para la barra de progreso
  const progressPercentage = (selectedCount / category.items.length) * 100;

  return (
    <div
      className='rounded-xl overflow-hidden transition-all duration-300 bg-white border border-gray-100 hover:border-blue-200'
      style={{
        boxShadow: isHovered
          ? '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.05)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={toggleAccordion}
        className={`w-full px-6 py-5 flex justify-between items-center transition-all duration-300`}
        aria-expanded={isOpen}
        aria-controls={`category-${category.id}`}
      >
        <div className='flex items-center'>
          {/* Icono de categoría */}
          <span
            className={`w-10 h-10 flex items-center justify-center rounded-full mr-4 transition-colors ${
              isOpen || isHovered
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <Package className='w-5 h-5' />
          </span>

          <div className='flex flex-col items-start'>
            <span className='font-semibold text-gray-800 text-lg leading-tight'>
              {t(category.translationKey, { fallback: category.id })}
            </span>

            {/* Información de ítems */}
            <span className='text-sm text-gray-500 mt-1'>
              {selectedCount > 0
                ? `${selectedCount} de ${category.items.length} seleccionados`
                : `${category.items.length} ítems disponibles`}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          {/* Contador con badge */}
          {selectedCount > 0 && (
            <div className='flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full'>
              <ShoppingCart className='w-3.5 h-3.5 mr-1.5' />
              <span className='font-medium'>{selectedCount}</span>
            </div>
          )}

          {/* Icono de expansión con efecto */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              isOpen
                ? 'bg-blue-500 text-white rotate-180'
                : 'bg-gray-100 text-gray-500'
            }`}
            style={{
              transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ChevronDown className='h-5 w-5' />
          </div>
        </div>
      </button>

      {/* Barra de progreso */}
      {selectedCount > 0 && (
        <div className='h-1 w-full bg-gray-100'>
          <div
            className='h-full bg-blue-500 transition-all duration-500 ease-out'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}

      {/* Contenido del acordeón */}
      <div
        id={`category-${category.id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className={`bg-white px-6 py-6 border-t border-gray-100 ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {category.items.map((item) => (
              <GroceryItem
                key={item.id}
                id={item.id}
                translationKey={item.translationKey}
                isSelected={selectedItems.includes(item.id)}
                onToggle={onItemToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAccordion;
