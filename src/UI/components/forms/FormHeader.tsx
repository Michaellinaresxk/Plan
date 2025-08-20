import React from 'react';
import { X } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isPremium?: boolean;
  onClose?: () => void;
  onCancel?: () => void; // ✅ ADDED: Compatibilidad con onCancel
  className?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  showCloseButton?: boolean; // ✅ ADDED: Control sobre mostrar botón
}

const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  isPremium = false,
  onClose,
  onCancel,
  className = '',
  gradientFrom,
  gradientVia,
  gradientTo,
  showCloseButton = true,
}) => {
  const handleClose = () => {
    const closeFunction = onClose || onCancel;

    console.log('🔴 FormHeader - Close button clicked:', {
      hasOnClose: typeof onClose === 'function',
      hasOnCancel: typeof onCancel === 'function',
      willExecute: typeof closeFunction === 'function',
    });

    if (closeFunction && typeof closeFunction === 'function') {
      try {
        closeFunction();
        console.log('✅ FormHeader - Close function executed successfully');
      } catch (error) {
        console.error('❌ FormHeader - Error executing close function:', error);
      }
    } else {
      console.warn(
        '⚠️ FormHeader - No close function provided, trying fallback'
      );
      // Fallback: disparar evento personalizado
      window.dispatchEvent(new CustomEvent('modal:close'));

      // Fallback: buscar botón de cierre en el DOM
      const modalCloseButton = document.querySelector(
        '[data-modal-close]'
      ) as HTMLElement;
      if (modalCloseButton) {
        modalCloseButton.click();
        console.log('✅ FormHeader - Fallback close button clicked');
      }
    }
  };

  // Determinar colores del gradiente
  const getGradientClasses = () => {
    if (gradientFrom && gradientVia && gradientTo) {
      return `from-${gradientFrom} via-${gradientVia} to-${gradientTo}`;
    }

    if (isPremium) {
      return 'from-orange-800 via-orange-700 to-orange-800';
    }

    return 'from-amber-800 via-amber-700 to-amber-800';
  };

  const getTextColors = () => {
    if (isPremium) {
      return {
        subtitle: 'text-orange-100',
        closeHover: 'hover:bg-orange-700',
      };
    }

    return {
      subtitle: 'text-amber-100',
      closeHover: 'hover:bg-amber-700',
    };
  };

  const colors = getTextColors();

  return (
    <div
      className={`bg-gradient-to-r ${getGradientClasses()} p-6 text-white relative ${className}`}
    >
      {/* ✅ IMPROVED: Botón de cierre con mejor control */}
      {showCloseButton && (
        <button
          type='button'
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${colors.closeHover} hover:bg-opacity-20 z-10`}
          aria-label='Cerrar formulario'
          title='Cerrar'
          data-testid='form-header-close' // ✅ Para testing
        >
          <X className='w-5 h-5' />
        </button>
      )}

      {/* Contenido del header */}
      <div className={showCloseButton ? 'pr-12' : ''}>
        <h2 className='text-2xl font-semibold tracking-wide flex items-center'>
          {Icon && <Icon className='w-6 h-6 mr-3' />}
          {title}
        </h2>
        {subtitle && (
          <p className={`${colors.subtitle} mt-1 font-light`}>{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default FormHeader;

// ===================================
// 🔧 EJEMPLOS DE USO MEJORADOS
// ===================================

/*
✅ Uso en formularios existentes (COMPATIBLE con onCancel):

// En HorseBackRidingForm:
<FormHeader
  title="Horseback Riding Adventure"
  subtitle="Experience the magic of riding along pristine Macao Beach"
  icon={Mountain}
  isPremium={isPremium}
  onCancel={onCancel} // ✅ Usa onCancel directamente
/>

// O si quieres renombrarlo:
<FormHeader
  title="Horseback Riding Adventure"
  subtitle="Experience the magic of riding along pristine Macao Beach"
  icon={Mountain}
  isPremium={isPremium}
  onClose={onCancel} // ✅ Pasa onCancel como onClose
/>

// Para debugging, agrega esto temporalmente:
<FormHeader
  title="Test Form"
  subtitle="Testing close functionality"
  onCancel={() => {
    console.log('🧪 Test close clicked');
    onCancel?.();
  }}
/>
*/
