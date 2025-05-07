import React from 'react';
import { useTranslation } from '@/lib/i18n/client';

interface SpecialRequestsProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Componente para capturar solicitudes especiales y alergias
 */
const SpecialRequests: React.FC<SpecialRequestsProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className='px-6 py-4 border-t border-gray-200'>
      <label
        htmlFor='special-requests'
        className='block text-sm font-medium text-gray-700 mb-2'
      >
        {t('grocery.service.specialRequests', { fallback: 'Special Requests' })}
      </label>
      <textarea
        id='special-requests'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors'
        placeholder={t('grocery.service.specialRequestsPlaceholder', {
          fallback:
            'Please indicate any specific requests or food allergies here...',
        })}
      ></textarea>
    </div>
  );
};

export default SpecialRequests;
