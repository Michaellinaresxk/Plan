import React, { useMemo, Suspense } from 'react';
import { Service } from '@/types/type';
import { useTranslation } from '@/lib/i18n/client';
import { AlertCircle, Loader2 } from 'lucide-react';
import { findFormForService } from '@/utils/formRegistry';

interface ServiceFormFactoryProps {
  service: Service;
  selectedItems?: any[]; // ✅ ADDED: Agregado selectedItems
  additionalData?: any;
  onCancel: () => void;
}

/**
 * ✅ FIXED ServiceFormFactory - Parámetros corregidos
 *
 * PROBLEMA ENCONTRADO: Los parámetros se pasaban en orden incorrecto
 * - FormRegistry espera: (service, selectedItems, additionalData, onCancel)
 * - ServiceFormFactory pasaba: (service, additionalData, onCancel)
 *
 * RESULTADO: onCancel llegaba como undefined
 */
const ServiceFormFactory: React.FC<ServiceFormFactoryProps> = ({
  service,
  selectedItems = [], // ✅ FIXED: Agregado selectedItems con default
  additionalData = {},
  onCancel,
}) => {
  const { t } = useTranslation();

  // ✅ DEBUG: Logging para verificar parámetros
  console.log('🏭 ServiceFormFactory Debug:', {
    serviceId: service.id,
    hasOnCancel: typeof onCancel === 'function',
    selectedItemsCount: selectedItems.length,
    additionalDataKeys: Object.keys(additionalData),
    onCancel: onCancel,
  });

  // 1. Auto-detectar formulario
  const formConfig = useMemo(() => {
    const registration = findFormForService(service.id);

    if (!registration) {
      console.warn(
        `⚠️ No form found for service: ${service.id}, using default`
      );
      return findFormForService('*');
    }

    console.log(`✅ Form found for ${service.id}: ${registration.name}`);
    return registration;
  }, [service.id]);

  // ✅ FIXED: Preparar props con parámetros en orden correcto
  const formProps = useMemo(() => {
    if (!formConfig) return {};

    console.log('🔧 Calling propsMapper with:', {
      service: service.id,
      selectedItemsCount: selectedItems.length,
      additionalData: Object.keys(additionalData),
      onCancelType: typeof onCancel,
    });

    // ✅ CRITICAL FIX: Pasar parámetros en el orden correcto
    return formConfig.propsMapper(
      service, // 1. service
      selectedItems, // 2. selectedItems (era el que faltaba)
      additionalData, // 3. additionalData
      onCancel // 4. onCancel (ahora llega correctamente)
    );
  }, [formConfig, service, selectedItems, additionalData, onCancel]);

  // ✅ DEBUG: Verificar props finales
  console.log('📋 Final form props:', {
    hasService: !!formProps.service,
    hasOnCancel: typeof formProps.onCancel === 'function',
    hasOnSubmit: typeof formProps.onSubmit === 'function',
    onCancelValue: formProps.onCancel,
  });

  // 4. Renderizar formulario
  return (
    <div className='service-form-container'>
      <Suspense
        fallback={
          <div className='flex items-center justify-center p-12'>
            <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
            <span className='ml-3 text-gray-600'>Loading form...</span>
          </div>
        }
      >
        <LazyFormRenderer
          formConfig={formConfig!}
          formProps={formProps}
          onCancel={onCancel} // ✅ Pass onCancel as backup
        />
      </Suspense>
    </div>
  );
};

// ✅ IMPROVED: Componente separado para renderizar formularios lazy
const LazyFormRenderer: React.FC<{
  formConfig: any;
  formProps: any;
  onCancel: () => void; // ✅ Added onCancel as backup
}> = ({ formConfig, formProps, onCancel }) => {
  const [FormComponent, setFormComponent] =
    React.useState<React.ComponentType<any> | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    formConfig
      .component()
      .then((module: any) => {
        setFormComponent(() => module.default || module);
      })
      .catch((error: Error) => {
        console.error(`❌ Failed to load ${formConfig.name}:`, error);
        setLoadError(error.message);
      });
  }, [formConfig]);

  if (loadError) {
    return (
      <div className='p-6 text-center'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4'>
          <AlertCircle className='w-8 h-8 text-red-600' />
        </div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          Form Loading Error
        </h3>
        <p className='text-gray-600 mb-4'>
          Failed to load the form component. Please try again.
        </p>
        {/* ✅ IMPROVED: Botón para cerrar en caso de error */}
        <button
          onClick={onCancel}
          className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
        >
          Close
        </button>
        <details className='text-xs text-gray-500 mt-4'>
          <summary>Error details</summary>
          <code>{loadError}</code>
        </details>
      </div>
    );
  }

  if (!FormComponent) {
    return (
      <div className='flex items-center justify-center p-12'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
        <span className='ml-3 text-gray-600'>Loading {formConfig.name}...</span>
      </div>
    );
  }

  // ✅ IMPROVED: Verificar que formProps.onCancel existe antes de renderizar
  const finalProps = {
    ...formProps,
    // Asegurar que onCancel siempre exista
    onCancel: formProps.onCancel || onCancel,
  };

  console.log('🎯 Rendering form with final props:', {
    formName: formConfig.name,
    hasOnCancel: typeof finalProps.onCancel === 'function',
    propsKeys: Object.keys(finalProps),
  });

  return <FormComponent {...finalProps} />;
};

export default ServiceFormFactory;
