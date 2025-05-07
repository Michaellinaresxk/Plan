// SummaryBar.tsx
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';

interface SummaryBarProps {
  selectedCount: number;
  onClearAll: () => void;
}

/**
 * Componente que muestra un resumen de los items seleccionados
 * y permite limpiar la selección
 */
const SummaryBar: React.FC<SummaryBarProps> = ({
  selectedCount,
  onClearAll,
}) => {
  const { t } = useTranslation();

  return (
    <div className='px-6 py-4 bg-gray-50 border-b'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          <ShoppingCart className='h-5 w-5 text-blue-500 mr-2' />
          <span className='text-sm font-medium'>
            {selectedCount}{' '}
            {t('grocery.service.itemsSelected', { fallback: 'items selected' })}
          </span>
        </div>

        {selectedCount > 0 && (
          <button
            type='button'
            onClick={onClearAll}
            className='text-sm text-red-600 hover:text-red-800 transition-colors'
          >
            {t('grocery.service.clearSelection', {
              fallback: 'Clear selection',
            })}
          </button>
        )}
      </div>
    </div>
  );
};

export default SummaryBar;
