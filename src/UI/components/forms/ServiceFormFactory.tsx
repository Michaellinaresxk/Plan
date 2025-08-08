import React, { useMemo, Suspense } from 'react';
import { Service } from '@/types/type';
import { useTranslation } from '@/lib/i18n/client';
import { AlertCircle, Loader2 } from 'lucide-react';
import { findFormForService } from '@/utils/formRegistry';

interface ServiceFormFactoryProps {
  service: Service;
  additionalData?: any;
  onCancel: () => void;
}

/**
 * Ultra-Clean ServiceFormFactory
 *
 * Solo 3 responsabilidades:
 * 1. Encontrar el formulario correcto (auto-detección)
 * 2. Validar requisitos
 * 3. Renderizar con lazy loading
 *
 * Todo lo demás está en el sistema de registro automático
 */
const ServiceFormFactory: React.FC<ServiceFormFactoryProps> = ({
  service,
  additionalData = {},
  onCancel,
}) => {
  const { t } = useTranslation();

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

  // 3. Preparar props
  const formProps = useMemo(() => {
    if (!formConfig) return {};
    return formConfig.propsMapper(service, additionalData, onCancel);
  }, [formConfig, service, additionalData, onCancel]);

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
        <LazyFormRenderer formConfig={formConfig!} formProps={formProps} />
      </Suspense>
    </div>
  );
};

// Componente separado para renderizar formularios lazy
const LazyFormRenderer: React.FC<{
  formConfig: any;
  formProps: any;
}> = ({ formConfig, formProps }) => {
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
        <details className='text-xs text-gray-500'>
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

  return <FormComponent {...formProps} />;
};

export default ServiceFormFactory;

// ===================================
// INSTRUCCIONES DE USO
// ===================================

/*
PARA AGREGAR UN NUEVO FORMULARIO:

1. Crea tu componente de formulario normalmente
2. Agrega una línea en formRegistry.ts: se encuentra en src/utils/formRegistry.ts
3. ¡YA ESTÁ! El sistema detectará automáticamente cuándo usar tu formulario.

PATRÓN DE NOMENCLATURA RECOMENDADO:

Para servicios: 'categoria-tipo' o 'luxe-categoria'
Ejemplos: 'massage-relaxing', 'luxe-spa', 'bike-mountain', 'yoga-beginner'

El sistema buscará automáticamente por:
1. Coincidencia exacta del ID
2. Patrones que contengan palabras clave
3. Fallback al formulario default

DEBUG EN DESARROLLO:

El sistema mostrará automáticamente en console:
- Qué formulario se detectó para cada servicio
- Qué props se están pasando
- Errores de carga o configuración
- Patrones de búsqueda utilizados

ARQUITECTURA COMPLETA:

BookingModal.tsx
    ↓
ServiceFormFactory.tsx (ultra-simple)
    ↓
formRegistry.ts (auto-registro)
    ↓
[Formulario específico].tsx

MIGRACIÓN DESDE SISTEMA ANTERIOR:

Si tienes formularios existentes que no funcionan:
1. Abre la consola del navegador
2. Busca logs como "⚠️ No form found for service: X"
3. Agrega el ID faltante a servicePatterns en formRegistry.ts
4. Reinicia y debería funcionar automáticamente

*/
