import React from 'react';

interface FormDataRendererProps {
  formData?: Record<string, any> | null;
  title?: string;
  showEmptyFields?: boolean;
  className?: string;
}

// Default props para mayor seguridad
const defaultProps: Partial<FormDataRendererProps> = {
  formData: {},
  title: 'Resumen de Información',
  showEmptyFields: false,
  className: '',
};

const FormDataRenderer: React.FC<FormDataRendererProps> = ({ formData }) => {
  // Guard clause para prevenir errores
  if (!formData || typeof formData !== 'object') {
    return (
      <div className='p-6 bg-gray-50 rounded-lg border border-gray-200'>
        <div className='text-center text-gray-500'>
          <p>No hay datos disponibles para mostrar</p>
        </div>
      </div>
    );
  }

  // Verificación adicional para asegurar que formData es un objeto válido
  const safeFormData = formData || {};

  try {
    // Filter out internal/system fields con verificación adicional
    const filteredData = Object.entries(safeFormData).filter(([key, value]) => {
      // Verificar que key existe y no es undefined
      if (!key || typeof key !== 'string') {
        return false;
      }

      // Filtrar campos internos/del sistema
      const systemFields = [
        'id',
        'createdAt',
        'updatedAt',
        'internalId',
        '__typename',
        '_id',
        'version',
        'metadata',
      ];

      // Filtrar campos vacíos o undefined
      if (value === undefined || value === null || value === '') {
        return false;
      }

      // Filtrar arrays vacíos
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }

      // Filtrar objetos vacíos
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      ) {
        return false;
      }

      return !systemFields.includes(key);
    });

    // Si no hay datos filtrados
    if (filteredData.length === 0) {
      return (
        <div className='p-6 bg-gray-50 rounded-lg border border-gray-200'>
          <div className='text-center text-gray-500'>
            <p>No hay información completada para mostrar</p>
          </div>
        </div>
      );
    }

    return (
      <div className='space-y-6'>
        <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Resumen de Información
            </h3>
            <p className='text-sm text-gray-600 mt-1'>
              Revisa los datos ingresados antes de continuar
            </p>
          </div>

          <div className='p-6 space-y-4'>
            {filteredData.map(([key, value]) => (
              <FormField key={key} fieldKey={key} value={value} />
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering form data:', error);
    return (
      <div className='p-6 bg-red-50 rounded-lg border border-red-200'>
        <div className='text-center text-red-600'>
          <p>Error al mostrar los datos del formulario</p>
          <p className='text-sm mt-1'>
            Por favor, verifica la información ingresada
          </p>
        </div>
      </div>
    );
  }
};

// Componente auxiliar para renderizar cada campo
interface FormFieldProps {
  fieldKey: string;
  value: any;
}

const FormField: React.FC<FormFieldProps> = ({ fieldKey, value }) => {
  const formatFieldName = (key: string): string => {
    // Convertir camelCase a formato legible
    const formatted = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    // Mapeo de nombres específicos para mejor UX
    const fieldNameMap: Record<string, string> = {
      'Guest Count': 'Número de Invitados',
      'Children Count': 'Número de Niños',
      'Children Ages': 'Edades de los Niños',
      'Dietary Restrictions': 'Restricciones Dietéticas',
      'Custom Dietary Restrictions': 'Restricciones Adicionales',
      'Has Allergies': 'Alergias Severas',
      'Chef Type': 'Tipo de Chef',
      'Event Date': 'Fecha del Evento',
      'Event Time': 'Hora del Evento',
      'Special Requests': 'Solicitudes Especiales',
    };

    return fieldNameMap[formatted] || formatted;
  };

  const formatValue = (val: any): string => {
    if (val === null || val === undefined) {
      return 'No especificado';
    }

    if (typeof val === 'boolean') {
      return val ? 'Sí' : 'No';
    }

    if (Array.isArray(val)) {
      if (val.length === 0) return 'Ninguno';

      // Si es array de objetos con age (niños)
      if (val.every((item) => typeof item === 'object' && 'age' in item)) {
        return val
          .map((child, index) => `Niño ${index + 1}: ${child.age} años`)
          .join(', ');
      }

      return val.join(', ');
    }

    if (typeof val === 'object') {
      try {
        return JSON.stringify(val, null, 2);
      } catch {
        return 'Datos complejos';
      }
    }

    if (typeof val === 'string' && val.length > 100) {
      return val.substring(0, 100) + '...';
    }

    return String(val);
  };

  const getFieldIcon = (key: string): string => {
    const iconMap: Record<string, string> = {
      guestCount: '👥',
      childrenCount: '👶',
      childrenAges: '🎂',
      dietaryRestrictions: '🥗',
      hasAllergies: '⚠️',
      chefType: '👨‍🍳',
      eventDate: '📅',
      eventTime: '🕐',
      specialRequests: '✨',
    };

    return iconMap[key] || '📝';
  };

  return (
    <div className='flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors'>
      <div className='flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
        <span className='text-sm'>{getFieldIcon(fieldKey)}</span>
      </div>
      <div className='flex-1 min-w-0'>
        <dt className='text-sm font-semibold text-gray-900 mb-1'>
          {formatFieldName(fieldKey)}
        </dt>
        <dd className='text-sm text-gray-700 break-words'>
          {formatValue(value)}
        </dd>
      </div>
    </div>
  );
};

export default FormDataRenderer;
