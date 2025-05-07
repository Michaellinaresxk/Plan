// TabSelector.tsx
import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { ShoppingBag, Wine } from 'lucide-react';

interface TabSelectorProps {
  activeTab: 'grocery' | 'spirits';
  onTabChange: (tab: 'grocery' | 'spirits') => void;
}

/**
 * Componente que renderiza el selector de pestañas entre Grocery y Spirits
 */
const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className='flex border-b'>
      <button
        type='button'
        className={`flex-1 py-3 px-4 font-medium flex justify-center items-center space-x-2 ${
          activeTab === 'grocery'
            ? 'text-blue-600 border-b-2 border-blue-500'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('grocery')}
        aria-pressed={activeTab === 'grocery'}
      >
        <ShoppingBag className='h-5 w-5' />
        <span>
          {t('grocery.service.tabs.grocery', { fallback: 'Grocery' })}
        </span>
      </button>
      <button
        type='button'
        className={`flex-1 py-3 px-4 font-medium flex justify-center items-center space-x-2 ${
          activeTab === 'spirits'
            ? 'text-blue-600 border-b-2 border-blue-500'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('spirits')}
        aria-pressed={activeTab === 'spirits'}
      >
        <Wine className='h-5 w-5' />
        <span>
          {t('grocery.service.tabs.spirits', { fallback: 'Spirits & Wine' })}
        </span>
      </button>
    </div>
  );
};

export default TabSelector;
