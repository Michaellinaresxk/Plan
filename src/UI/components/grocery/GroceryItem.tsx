import React from 'react';
import { useTranslation } from '@/lib/i18n/client';

interface GroceryItemProps {
  id: string;
  translationKey: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

/**
 * Componente que renderiza un ítem individual con un checkbox para selección
 */
const GroceryItem: React.FC<GroceryItemProps> = ({
  id,
  translationKey,
  isSelected,
  onToggle,
}) => {
  const { t } = useTranslation();
  const itemId = `grocery-${id}`;

  return (
    <div className='flex items-center mb-2 last:mb-0'>
      <input
        type='checkbox'
        id={itemId}
        checked={isSelected}
        onChange={() => onToggle(id)}
        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer'
      />
      <label
        htmlFor={itemId}
        className='ml-2 text-sm font-medium text-gray-700 cursor-pointer'
      >
        {t(translationKey, { fallback: id })}
      </label>
    </div>
  );
};

export default GroceryItem;
