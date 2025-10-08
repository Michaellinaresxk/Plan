/**
 * ✅ FIXED: Sistema de Auto-Registro de Formularios
 *
 * PROBLEMA RESUELTO: propsMappers inconsistentes
 * SOLUCIÓN: Todos los propsMappers ahora usan 4 parámetros consistentemente
 */

export interface FormRegistration {
  name: string;
  component: () => Promise<any>; // Lazy import
  servicePatterns: string[]; // Patrones de IDs de servicios que maneja
  requiresItems?: boolean;
  propsMapper: (
    service: any,
    selectedItems?: any[],
    additionalData?: any,
    onCancel?: () => void
  ) => any;
}

// Registry global de formularios
const formRegistry = new Map<string, FormRegistration>();

/**
 * Registra un formulario en el sistema
 */
export const registerForm = (registration: FormRegistration) => {
  formRegistry.set(registration.name, registration);
  console.log(
    `📝 Form registered: ${
      registration.name
    } for patterns: ${registration.servicePatterns.join(', ')}`
  );
};

/**
 * Encuentra el formulario correcto para un servicio
 */
export const findFormForService = (
  serviceId: string
): FormRegistration | null => {
  const lowerServiceId = serviceId.toLowerCase();

  // Buscar por patrones exactos primero
  for (const [_, form] of formRegistry) {
    if (form.servicePatterns.includes(serviceId)) {
      return form;
    }
  }

  // Buscar por patrones parciales
  for (const [_, form] of formRegistry) {
    if (
      form.servicePatterns.some(
        (pattern) =>
          lowerServiceId.includes(pattern.toLowerCase()) ||
          pattern.toLowerCase().includes(lowerServiceId)
      )
    ) {
      return form;
    }
  }

  return null;
};

/**
 * Obtiene todos los formularios registrados
 */
export const getAllRegisteredForms = (): FormRegistration[] => {
  return Array.from(formRegistry.values());
};

// ===================================
// ✅ AUTO-REGISTRO DE FORMULARIOS CON PROPSMAPPERS CONSISTENTES
// ===================================

/**
 * ✅ Helper para crear propsMapper estándar y consistente
 */
const createStandardPropsMapper = (
  formName: string,
  requiresSelectedItems = false
) => {
  return (
    service: any,
    selectedItems: any[] = [],
    additionalData: any = {},
    onCancel?: () => void
  ) => {
    // ✅ Debug logging para cada form
    console.log(`🔧 ${formName} propsMapper called:`, {
      service: service?.id,
      selectedItemsCount: selectedItems.length,
      hasOnCancel: typeof onCancel === 'function',
      hasOnSubmit: typeof additionalData?.onSubmit === 'function',
      additionalDataKeys: Object.keys(additionalData),
    });

    const baseProps = {
      service,
      onCancel, // ✅ CRITICAL: Siempre pasar onCancel
      onSubmit:
        additionalData?.onSubmit ||
        ((data: any) => {
          console.log(`✅ ${formName} submitted:`, data);
        }),
    };

    // Agregar selectedItems si es requerido
    if (requiresSelectedItems) {
      return {
        ...baseProps,
        selectedItems,
      };
    }

    // Pasar datos adicionales específicos del formulario
    return {
      ...baseProps,
      initialData: additionalData?.initialData,
      selectedVehicle: additionalData?.selectedVehicle,
      ...additionalData, // Spread para props específicos
    };
  };
};

// ✅ Airport Transfer Form
registerForm({
  name: 'AirportTransferForm',
  component: () => import('@/UI/components/forms/AirportTransferForm'),
  servicePatterns: [
    'airport-transfers',
    'luxe-arrival',
    'airport',
    'transfer',
    'transport',
  ],
  propsMapper: createStandardPropsMapper('AirportTransferForm'),
});

// ✅  Point to point Transfer Form
registerForm({
  name: 'PointToPointTransferForm',
  component: () => import('@/UI/components/forms/PointToPointTransferForm'),
  servicePatterns: [
    'point-to-point-transfers',
    'luxe-arrival',
    'airport',
    'transfer',
    'transport',
  ],
  propsMapper: createStandardPropsMapper('PointToPointTransferForm'),
});

// ✅ HorseBack Riding Form
registerForm({
  name: 'HorseBackRidingForm',
  component: () => import('@/UI/components/forms/HorseBackRidingForm'),
  servicePatterns: ['horseback-riding'],
  requiresItems: false,
  propsMapper: createStandardPropsMapper('HorseBackRidingForm'),
});

// ✅  Babysitter Form
registerForm({
  name: 'BabysitterForm',
  component: () => import('@/UI/components/forms/BabysitterForm'),
  servicePatterns: ['babysitter', 'baby-sitter', 'luxe-childcare', 'childcare'],
  propsMapper: createStandardPropsMapper('BabysitterForm'),
});

// ✅ Decoration Form - Mantiene su lógica especial pero consistente
registerForm({
  name: 'CustomDecorationForm',
  component: () => import('@/UI/components/forms/CustomDecorationForm'),
  servicePatterns: [
    'custom-decorations',
    'luxe-decorations',
    'decoration',
    'decor',
  ],
  propsMapper: (
    service: any,
    selectedItems: any[] = [],
    additionalData: any = {},
    onCancel?: () => void
  ) => {
    console.log('🔧 CustomDecorationForm propsMapper called:', {
      service: service?.id,
      hasOnCancel: typeof onCancel === 'function',
    });

    return {
      service,
      onCancel,
      onBookService:
        additionalData?.onBookService ||
        ((service: any, dates: any, guests: number, formData: any) => {
          console.log('✅ Decoration booked:', {
            service,
            dates,
            guests,
            formData,
          });
        }),
      onClose: onCancel,
    };
  },
});

// ✅ Massage Form
registerForm({
  name: 'MassageForm',
  component: () => import('@/UI/components/forms/massage/MassageForm'),
  servicePatterns: [
    'massage',
    'standard-massage',
    'luxe-spa',
    'luxe-massage',
    'spa',
  ],
  propsMapper: createStandardPropsMapper('MassageForm'),
});

// ✅  Bike Form
registerForm({
  name: 'BikeForm',
  component: () => import('@/UI/components/forms/BikeForm'),
  servicePatterns: [
    'bike-rental',
    'bike-rentals',
    'luxe-bike',
    'bike',
    'bicycle',
  ],
  propsMapper: createStandardPropsMapper('BikeForm'),
});

// ✅ Live Music Form
registerForm({
  name: 'LiveMusicForm',
  component: () => import('@/UI/components/forms/LiveMusicForm'),
  servicePatterns: ['live-music', 'luxe-music', 'music', 'musician'],
  propsMapper: createStandardPropsMapper('LiveMusicForm'),
});

// ✅ Yoga Form
registerForm({
  name: 'YogaServiceForm',
  component: () => import('@/UI/components/forms/YogaServiceForm'),
  servicePatterns: ['yoga', 'yoga-session', 'yoga-standard'],
  propsMapper: createStandardPropsMapper('YogaServiceForm'),
});

// ✅ Luxe Yoga Form
registerForm({
  name: 'LuxeYogaServiceForm',
  component: () => import('@/UI/components/forms/YogaServiceForm'),
  servicePatterns: ['luxe-yoga'],
  propsMapper: createStandardPropsMapper('LuxeYogaServiceForm'),
});

// ✅ Golf Cart Form
registerForm({
  name: 'GolfCartForm',
  component: () => import('@/UI/components/forms/GolfCartForm'),
  servicePatterns: ['golf-cart-rentals'],
  propsMapper: createStandardPropsMapper('GolfCartForm'),
});

// ✅ Chef Form
registerForm({
  name: 'ChefForm',
  component: () => import('@/UI/components/forms/chef/ChefForm'),
  servicePatterns: [
    'personal-chef',
    'luxe-chef',
    'luxe-dining',
    'chef',
    'culinary',
  ],
  propsMapper: createStandardPropsMapper('ChefForm'),
});

// ✅ Saona Island Form
registerForm({
  name: 'SaonaIslandForm',
  component: () => import('@/UI/components/forms/SaonaIslandForm'),
  servicePatterns: ['saona-island-tour'],
  propsMapper: createStandardPropsMapper('SaonaIslandForm'),
});

// ✅ Personal Trainer Form
registerForm({
  name: 'PersonalTrainerForm',
  component: () => import('@/UI/components/forms/PersonalTrainerForm'),
  servicePatterns: ['personal-training', 'luxe-fitness', 'fitness'],
  propsMapper: createStandardPropsMapper('PersonalTrainerForm'),
});

// ✅ Karaoke Form
registerForm({
  name: 'KaraokeForm',
  component: () => import('@/UI/components/forms/KaraokeFrom'),
  servicePatterns: ['karaoke'],
  propsMapper: createStandardPropsMapper('KaraokeForm'),
});

// ✅ Lux Catamaran Form
registerForm({
  name: 'LuxCatamaranForm',
  component: () => import('@/UI/components/forms/LuxCatamaranForm'),
  servicePatterns: ['private-catamaran'],
  propsMapper: createStandardPropsMapper('LuxCatamaranForm'),
});

// ✅ Catamaran Form
registerForm({
  name: 'CatamaranForm',
  component: () => import('@/UI/components/forms/CatamaranForm'),
  servicePatterns: ['catamaran'],
  propsMapper: createStandardPropsMapper('CatamaranForm'),
});

// ✅ ATV Ride Form
registerForm({
  name: 'AtvRideForm',
  component: () => import('@/UI/components/forms/AtvRideForm'),
  servicePatterns: ['atv-excursions', 'atv-adventure', 'atv', 'quad', 'buggy'],
  propsMapper: (
    service: any,
    selectedItems: any[] = [],
    additionalData: any = {},
    onCancel?: () => void
  ) => {
    console.log('🔧 AtvRideForm propsMapper called:', {
      service: service?.id,
      hasOnCancel: typeof onCancel === 'function',
      hasSelectedVehicle: !!additionalData?.selectedVehicle,
    });

    return {
      service,
      onCancel,
      selectedVehicle: additionalData?.selectedVehicle,
      onSubmit:
        additionalData?.onSubmit ||
        ((data: any) => {
          console.log('✅ ATV Adventure submitted:', data);
        }),
    };
  },
});

// ✅ Luxe Yacht Form
registerForm({
  name: 'LuxeYachtForm',
  component: () => import('@/UI/components/forms/LuxeYachtForm'),
  servicePatterns: ['luxe-yacht'],
  propsMapper: createStandardPropsMapper('LuxeYachtForm'),
});

// ✅ Default Form - Ahora usa 4 parámetros consistentemente
registerForm({
  name: 'DefaultServiceForm',
  component: () => import('@/UI/components/forms/DefaultServiceForm'),
  servicePatterns: ['*'],
  propsMapper: (
    service: any,
    selectedItems: any[] = [],
    additionalData: any = {},
    onCancel?: () => void
  ) => {
    console.log('🔧 DefaultServiceForm propsMapper called:', {
      service: service?.id,
      hasOnCancel: typeof onCancel === 'function',
    });

    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ Using DefaultServiceForm for service: ${service?.id}`);
      console.log('Consider adding specific form registration for better UX');
    }

    return {
      service,
      onCancel,
    };
  },
});

/**
 * Función de debug para verificar registros
 */
export const debugFormRegistry = () => {
  if (process.env.NODE_ENV === 'development') {
    console.group('📋 Form Registry Debug');

    const forms = getAllRegisteredForms();
    forms.forEach((form) => {
      console.log(`📝 ${form.name}:`, {
        patterns: form.servicePatterns,
        requiresItems: form.requiresItems || false,
        hasPropsMapper: typeof form.propsMapper === 'function',
      });
    });

    console.groupEnd();
  }
};

/**
 * Función para verificar que un servicio tiene formulario
 */
export const checkServiceHasForm = (serviceId: string): boolean => {
  const form = findFormForService(serviceId);
  if (!form) {
    console.warn(`⚠️ No form found for service: ${serviceId}`);
    return false;
  }
  console.log(`✅ Form found for ${serviceId}: ${form.name}`);
  return true;
};

// ✅ Test propsMapper consistency
export const testPropsMapperConsistency = () => {
  if (process.env.NODE_ENV === 'development') {
    console.group('🧪 Testing propsMapper consistency');

    const testService = { id: 'test-service', name: 'Test' };
    const testSelectedItems = [];
    const testAdditionalData = { onSubmit: () => {} };
    const testOnCancel = () => console.log('Test cancel');

    const forms = getAllRegisteredForms();
    forms.forEach((form) => {
      try {
        const props = form.propsMapper(
          testService,
          testSelectedItems,
          testAdditionalData,
          testOnCancel
        );
        const hasOnCancel = typeof props.onCancel === 'function';

        console.log(
          `${hasOnCancel ? '✅' : '❌'} ${
            form.name
          }: onCancel = ${typeof props.onCancel}`
        );

        if (!hasOnCancel) {
          console.error(
            `❌ ${form.name} propsMapper not returning onCancel correctly`
          );
        }
      } catch (error) {
        console.error(`❌ ${form.name} propsMapper error:`, error);
      }
    });

    console.groupEnd();
  }
};

// Ejecutar debug en desarrollo
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    debugFormRegistry();
    testPropsMapperConsistency();
  }, 1000);
}

console.log(
  '✅ All forms auto-registered successfully with FIXED propsMappers'
);
