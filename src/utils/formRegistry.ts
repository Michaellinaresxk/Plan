/**
 * Sistema de Auto-Registro de Formularios
 *
 * Este archivo permite registrar automáticamente nuevos formularios
 * sin necesidad de modificar el ServiceFormFactory
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
// AUTO-REGISTRO DE FORMULARIOS
// ===================================

// Grocery Form
// registerForm({
//   name: 'GroceryForm',
//   component: () => import('@/UI/components/forms/GroceryForm'),
//   servicePatterns: ['grocery-shopping', 'luxe-grocery', 'grocery', 'groceries'],
//   requiresItems: true,
//   propsMapper: (service, selectedItems, additionalData, onCancel) => ({
//     service,
//     selectedItems: selectedItems || [],
//     onCancel,
//   }),
// });

// Airport Transfer Form
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
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit ||
      ((data: any) => console.log('Airport transfer:', data)),
    onCancel,
  }),
});

// HorseBack Riding Form
registerForm({
  name: 'HorseBackRidingForm',
  component: () => import('@/UI/components/forms/HorseBackRidingForm'),
  servicePatterns: ['tours'],
  requiresItems: true,
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    selectedItems: selectedItems || [],
    onCancel,
  }),
});

// Babysitter Form
registerForm({
  name: 'BabysitterForm',
  component: () => import('@/UI/components/forms/BabysitterForm'),
  servicePatterns: ['babysitter', 'baby-sitter', 'luxe-childcare', 'childcare'],
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit ||
      ((data: any) => console.log('Babysitter:', data)),
    onCancel,
  }),
});

// Decoration Form
registerForm({
  name: 'CustomDecorationForm',
  component: () => import('@/UI/components/forms/CustomDecorationForm'),
  servicePatterns: [
    'custom-decorations',
    'luxe-decorations',
    'decoration',
    'decor',
  ],
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onBookService:
      additionalData?.onBookService ||
      ((service: any, dates: any, guests: number, formData: any) => {
        console.log('Decoration booked:', { service, dates, guests, formData });
      }),
    onClose: onCancel,
  }),
});

// Massage Form
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
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    onSubmit:
      additionalData?.onSubmit ||
      ((data: any) => console.log('Massage:', data)),
    onCancel,
    initialData: additionalData?.initialData,
  }),
});

// Bike Form
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
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit || ((data: any) => console.log('Bike:', data)),
    onCancel,
  }),
});

// Live Music Form
registerForm({
  name: 'LiveMusicForm',
  component: () => import('@/UI/components/forms/LiveMusicForm'),
  servicePatterns: ['live-music', 'luxe-music', 'music', 'musician'],
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit ||
      ((data: any) => console.log('Live music:', data)),
    onCancel,
  }),
});

// Yoga Form
registerForm({
  name: 'YogaServiceForm',
  component: () => import('@/UI/components/forms/YogaServiceForm'),
  servicePatterns: ['yoga', 'yoga-session', 'yoga-standard', 'luxe-yoga'],
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit || ((data: any) => console.log('Yoga:', data)),
    onCancel,
  }),
});

// Luxe Yoga Form
registerForm({
  name: 'LuxeYogaServiceForm',
  component: () => import('@/UI/components/forms/YogaServiceForm'),
  servicePatterns: ['yoga', 'yoga-session', 'yoga-standard', 'luxe-yoga'],
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit || ((data: any) => console.log('Yoga:', data)),
    onCancel,
  }),
});

// Chef Form
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
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit || ((data: any) => console.log('Chef:', data)),
    onCancel,
  }),
});

// Default Form (fallback)
registerForm({
  name: 'DefaultServiceForm',
  component: () => import('@/UI/components/forms/DefaultServiceForm'),
  servicePatterns: ['*'], // Catch-all
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onCancel,
  }),
});

// AtvRideForm Form
registerForm({
  name: 'AtvRideForm',
  component: () => import('@/UI/components/forms/AtvRideForm'),
  // servicePatterns: ['atv-excursions'],
  servicePatterns: ['tours'],
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit ||
      ((data: any) => console.log('AtvRideForm Tour:', data)),
    onCancel,
  }),
});

// Saona Island Form
registerForm({
  name: 'SaonaIslandForm',
  component: () => import('@/UI/components/forms/SaonaIslandForm'),
  servicePatterns: ['saona-island-tour'],
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit ||
      ((data: any) => console.log('Saona Island Tour:', data)),
    onCancel,
  }),
});

// Personal Trainer Form
registerForm({
  name: 'personalTraining',
  component: () => import('@/UI/components/forms/PersonalTrainerForm'),
  servicePatterns: ['personal-training', 'luxe-fitness', 'fitness'],
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit ||
      ((data: any) => console.log('Personal Trainer:', data)),
    onCancel,
  }),
});

// Karaoke Form
registerForm({
  name: 'KaraokeFrom',
  component: () => import('@/UI/components/forms/KaraokeFrom'),
  servicePatterns: ['karaoke'],
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit ||
      ((data: any) => console.log('Karaoke:', data)),
    onCancel,
  }),
});

// Catamaran Form
registerForm({
  name: 'private-catamaran',
  component: () => import('@/UI/components/forms/CatamaranForm'),
  servicePatterns: ['private-catamaran'],
  propsMapper: (service, selectedItems, additionalData, onCancel) => ({
    service,
    onSubmit:
      additionalData?.onSubmit ||
      ((data: any) => console.log('private-catamaran:', data)),
    onCancel,
  }),
});

console.log('✅ All forms auto-registered successfully');
