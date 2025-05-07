// SubmitButton.tsx
import React from 'react';
import { useTranslation } from '@/lib/i18n/client';

interface SubmitButtonProps {
  onSubmit: () => void;
  disabled?: boolean;
}

/**
 * Componente para el botón de envío del formulario
 */
const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end'>
      <button
        type='button'
        onClick={onSubmit}
        disabled={disabled}
        className={`
          px-6 py-2 bg-blue-600 text-white font-medium rounded-lg
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:ring-offset-2 transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {t('grocery.service.submit', { fallback: 'Submit Grocery List' })}
      </button>
    </div>
  );
};

export default SubmitButton;
