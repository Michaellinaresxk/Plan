// hooks/useScrollToError.ts
import { useEffect, useRef } from 'react';

interface UseScrollToErrorOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  offset?: number;
}

/**
 * Hook reutilizable para hacer scroll automático al primer campo con error
 *
 * @param errors - Objeto con los errores de validación
 * @param options - Opciones de scroll
 * @returns Objeto con funciones para registrar referencias de campos
 *
 * @example
 * const { fieldRefs, scrollToFirstError } = useScrollToError(errors);
 *
 * // En tu JSX:
 * <input ref={(el) => fieldRefs.current.set('fieldName', el)} />
 *
 * // Al validar:
 * if (!isValid) {
 *   scrollToFirstError();
 *   return;
 * }
 */
export const useScrollToError = (
  errors: Record<string, string>,
  options: UseScrollToErrorOptions = {}
) => {
  const { behavior = 'smooth', block = 'center', offset = 100 } = options;

  // Map para almacenar referencias a los campos del formulario
  const fieldRefs = useRef<Map<string, HTMLElement>>(new Map());

  /**
   * Scroll al primer campo con error
   */
  const scrollToFirstError = () => {
    const firstErrorKey = Object.keys(errors)[0];

    if (!firstErrorKey) return;

    const element = fieldRefs.current.get(firstErrorKey);

    if (element) {
      // Calcular posición con offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior,
      });

      // Enfocar el elemento después de un pequeño delay
      setTimeout(() => {
        element.focus();
      }, 300);
    }
  };

  /**
   * Efecto para scroll automático cuando cambian los errores
   */
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      scrollToFirstError();
    }
  }, [Object.keys(errors).join(',')]);

  /**
   * Limpiar referencias al desmontar
   */
  useEffect(() => {
    return () => {
      fieldRefs.current.clear();
    };
  }, []);

  return {
    fieldRefs,
    scrollToFirstError,
  };
};
