// src/hooks/useFormModal.ts
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseFormModalProps {
  onCancel?: () => void;
  redirectPath?: string;
  shouldRedirect?: boolean;
}

/**
 * Hook para manejar el cierre consistente de modales de formularios
 *
 * Este hook garantiza que todos los formularios se cierren correctamente
 * independientemente de cómo se implemente el modal padre.
 */
export const useFormModal = ({
  onCancel,
  redirectPath = '/',
  shouldRedirect = false,
}: UseFormModalProps = {}) => {
  const router = useRouter();

  const handleClose = useCallback(() => {
    // Primero intentar cerrar con el callback proporcionado
    if (onCancel && typeof onCancel === 'function') {
      try {
        onCancel();
        return;
      } catch (error) {
        console.warn('Error calling onCancel:', error);
      }
    }

    // Si no hay callback o falló, intentar cerrar el modal de otras formas

    // 1. Buscar y disparar eventos de cierre de modal comunes
    const modalCloseEvents = [
      'modal:close',
      'dialog:close',
      'overlay:close',
      'form:cancel',
    ];

    modalCloseEvents.forEach((eventName) => {
      try {
        window.dispatchEvent(new CustomEvent(eventName));
      } catch (error) {
        // Silently ignore
      }
    });

    // 2. Intentar encontrar y hacer click en botones de cierre comunes
    const closeSelectors = [
      '[data-modal-close]',
      '[data-dialog-close]',
      '.modal-close',
      '.dialog-close',
      'button[aria-label="Close"]',
      'button[aria-label="close"]',
    ];

    for (const selector of closeSelectors) {
      try {
        const closeButton = document.querySelector(selector) as HTMLElement;
        if (closeButton) {
          closeButton.click();
          return;
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    // 3. Manejar escape key
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      keyCode: 27,
      bubbles: true,
    });
    document.dispatchEvent(escapeEvent);

    // 4. Como último recurso, redirigir si está habilitado
    if (shouldRedirect) {
      router.push(redirectPath);
    }

    // 5. Log para debugging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '🚨 Modal close fallback used - consider implementing proper onCancel prop'
      );
    }
  }, [onCancel, router, redirectPath, shouldRedirect]);

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose]
  );

  // Función para registrar el listener de escape
  const registerEscapeListener = useCallback(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  return {
    handleClose,
    registerEscapeListener,
    // Alias para mayor claridad semántica
    closeModal: handleClose,
    cancelForm: handleClose,
  };
};

/**
 * Hook específico para formularios que necesitan confirmación antes de cerrar
 */
export const useFormModalWithConfirmation = ({
  onCancel,
  hasUnsavedChanges = false,
  confirmationMessage = '¿Estás seguro de que quieres cerrar? Los cambios no guardados se perderán.',
}: UseFormModalProps & {
  hasUnsavedChanges?: boolean;
  confirmationMessage?: string;
} = {}) => {
  const { handleClose: baseHandleClose, registerEscapeListener } = useFormModal(
    { onCancel }
  );

  const handleCloseWithConfirmation = useCallback(() => {
    if (hasUnsavedChanges) {
      if (window.confirm(confirmationMessage)) {
        baseHandleClose();
      }
    } else {
      baseHandleClose();
    }
  }, [hasUnsavedChanges, confirmationMessage, baseHandleClose]);

  return {
    handleClose: handleCloseWithConfirmation,
    registerEscapeListener,
    closeModal: handleCloseWithConfirmation,
    cancelForm: handleCloseWithConfirmation,
  };
};
