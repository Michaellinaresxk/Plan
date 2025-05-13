import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import GroceryItem from './GroceryItem';
import { GroceryCategory } from '@/constants/GroceryShopping';

interface CategoryAccordionProps {
  category: GroceryCategory;
  selectedItems: string[];
  onItemToggle: (id: string) => void;
}

/**
 * Componente de acordeón que muestra una categoría con sus ítems
 */
const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  category,
  selectedItems,
  onItemToggle,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  // Calcula cuántos ítems están seleccionados en esta categoría
  const selectedCount = category.items.filter((item) =>
    selectedItems.includes(item.id)
  ).length;

  return (
    <div className='mb-5 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg'>
      <button
        onClick={toggleAccordion}
        className={`w-full px-5 py-4 flex justify-between items-center transition-all duration-300 ${
          isOpen
            ? 'bg-gradient-to-r from-blue-50 to-white border-b border-blue-100'
            : 'bg-white hover:bg-gray-50'
        }`}
        aria-expanded={isOpen}
        aria-controls={`category-${category.id}`}
      >
        <div className='flex items-center'>
          <span className='font-bold text-gray-800 text-lg'>
            {t(category.translationKey, { fallback: category.id })}
          </span>
          {selectedCount > 0 && (
            <span className='ml-3 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full'>
              {selectedCount}
            </span>
          )}
        </div>
        <div
          className={`p-2 rounded-full transition-colors ${
            isOpen ? 'bg-blue-50 text-blue-500' : 'text-gray-400'
          }`}
        >
          {isOpen ? (
            <ChevronUp className='h-5 w-5' />
          ) : (
            <ChevronDown className='h-5 w-5' />
          )}
        </div>
      </button>

      {isOpen && (
        <div id={`category-${category.id}`} className='bg-white px-5 py-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
      )}
    </div>
  );
};

export default CategoryAccordion;
