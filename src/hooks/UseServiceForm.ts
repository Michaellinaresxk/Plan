// src/hooks/useServiceForm.ts
import { useMemo } from 'react';
import { Service } from '@/types/type';
import {
  findFormForService,
  getAllRegisteredForms,
} from '@/utils/formRegistry';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  translationKey?: string;
}

interface UseServiceFormProps {
  service: Service;
  selectedItems?: GroceryItem[];
  additionalData?: any;
  onCancel: () => void;
}

/**
 * Hook opcional para casos donde necesites más control sobre el proceso
 * de selección y configuración de formularios.
 *
 * La mayoría de casos pueden usar directamente ServiceFormFactory,
 * pero este hook es útil para:
 *
 * - Validaciones custom antes de mostrar el formulario
 * - Manipulación avanzada de props
 * - Lógica condicional compleja
 * - Testing y debugging
 */
export const useServiceForm = ({
  service,
  selectedItems = [],
  additionalData = {},
  onCancel,
}: UseServiceFormProps) => {
  // Encontrar configuración del formulario
  const formRegistration = useMemo(() => {
    return findFormForService(service.id);
  }, [service.id]);

  // Información de debug
  const debugInfo = useMemo(() => {
    const allForms = getAllRegisteredForms();
    const possibleMatches = allForms.filter((form) =>
      form.servicePatterns.some(
        (pattern) =>
          service.id.toLowerCase().includes(pattern.toLowerCase()) ||
          pattern.toLowerCase().includes(service.id.toLowerCase())
      )
    );

    return {
      serviceId: service.id,
      foundForm: formRegistration?.name || null,
      allAvailableForms: allForms.map((f) => f.name),
      possibleMatches: possibleMatches.map((f) => ({
        name: f.name,
        patterns: f.servicePatterns,
      })),
      registeredPatterns: allForms.reduce((acc, form) => {
        acc[form.name] = form.servicePatterns;
        return acc;
      }, {} as Record<string, string[]>),
    };
  }, [service.id, formRegistration]);

  // Validaciones
  const validation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar que existe configuración
    if (!formRegistration) {
      errors.push('no_form_configuration');
    }

    // Validar servicio
    if (!service || !service.id) {
      errors.push('invalid_service');
    }

    if (!additionalData?.onSubmit && formRegistration?.name !== 'GroceryForm') {
      warnings.push('missing_onSubmit_callback');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      hasWarnings: warnings.length > 0,
    };
  }, [formRegistration, selectedItems, service, additionalData]);

  // Preparar props del formulario
  const formProps = useMemo(() => {
    if (!formRegistration) return null;

    try {
      return formRegistration.propsMapper(
        service,
        selectedItems,
        additionalData,
        onCancel
      );
    } catch (error) {
      console.error('Error preparing form props:', error);
      return null;
    }
  }, [formRegistration, service, selectedItems, additionalData, onCancel]);

  // Cargar componente lazy
  const loadFormComponent = async () => {
    if (!formRegistration) return null;

    try {
      const module = await formRegistration.component();
      return module.default || module;
    } catch (error) {
      console.error(
        `Failed to load form component ${formRegistration.name}:`,
        error
      );
      throw error;
    }
  };

  // Utilidades para debugging
  const getFormSuggestions = () => {
    if (formRegistration) return [];

    return debugInfo.possibleMatches.length > 0
      ? debugInfo.possibleMatches
      : [
          {
            name: 'Manual Registration Needed',
            patterns: [
              `Add '${service.id}' to an existing form's servicePatterns`,
            ],
          },
        ];
  };

  return {
    // Estado principal
    formRegistration,
    validation,
    formProps,

    // Funciones
    loadFormComponent,
    getFormSuggestions,

    // Debug info
    debugInfo: process.env.NODE_ENV === 'development' ? debugInfo : undefined,

    // Estados derivados
    isReady: validation.isValid && formProps !== null,
    needsItems: formRegistration?.requiresItems || false,
    formName: formRegistration?.name || 'Unknown',

    // Helpers
    canRender: () => validation.isValid && formRegistration !== null,
    getValidationMessage: () => {
      if (validation.errors.includes('no_form_configuration')) {
        return `No form configuration found for service: ${service.id}`;
      }
      if (validation.errors.includes('missing_required_items')) {
        return 'This service requires items to be selected first';
      }
      if (validation.errors.includes('invalid_service')) {
        return 'Invalid service provided';
      }
      return null;
    },
  };
};

// Hook para registrar formularios dinámicamente (casos muy avanzados)
export const useFormRegistration = () => {
  const registerDynamicForm = (registration: any) => {
    // Importa la función de registro
    import('@/utils/formRegistry').then(({ registerForm }) => {
      registerForm(registration);
    });
  };

  const getAllForms = () => {
    return getAllRegisteredForms();
  };

  const findForm = (serviceId: string) => {
    return findFormForService(serviceId);
  };

  return {
    registerDynamicForm,
    getAllForms,
    findForm,
  };
};

// Ejemplo de uso del hook:
/*
function CustomBookingFlow({ service, selectedItems }) {
  const {
    formRegistration,
    validation,
    formProps,
    loadFormComponent,
    debugInfo,
    isReady,
    canRender,
    getValidationMessage,
  } = useServiceForm({
    service,
    selectedItems,
    additionalData: { 
      onSubmit: (data) => handleCustomSubmit(data),
    },
    onCancel: () => handleCustomCancel(),
  });

  // Validaciones custom
  if (!canRender()) {
    return <div>Error: {getValidationMessage()}</div>;
  }

  // Lógica custom antes de renderizar
  const shouldShowPreview = service.price > 1000;
  
  return (
    <div>
      {shouldShowPreview && <ExpensiveServiceWarning />}
      <DynamicFormRenderer 
        formRegistration={formRegistration}
        formProps={formProps}
        onLoad={loadFormComponent}
      />
      {debugInfo && <DebugPanel info={debugInfo} />}
    </div>
  );
}
*/
