import { SERVICE_CATEGORIES } from "@/constants/services/serviceCategories";
import { SERVICES_DATA } from "@/constants/services/serviceData";
import { ServiceCategory, ServiceData } from "@/types/services";
import { PackageType, Service } from "@/types/type";

/**
 * Get a service's category based on its ID
 */
export function getServiceCategory(serviceId: string): ServiceCategory {
  return SERVICE_CATEGORIES[serviceId] || 'all';
}

/**
 * Get a service by its ID
 */
export function getServiceById(id: string): ServiceData | undefined {
  return SERVICES_DATA[id];
}

/**
 * Get all services as an array
 */
export function getAllServices(): ServiceData[] {
  return Object.values(SERVICES_DATA);
}

/**
 * Get services filtered by category
 */
export function getServicesByCategory(
  category: ServiceCategory
): ServiceData[] {
  if (category === 'all') {
    return getAllServices();
  }
  return getAllServices().filter((service) => service.category === category);
}

/**
 * Get services filtered by package type
 */
export function getServicesByPackageType(
  packageType: PackageType
): ServiceData[] {
  return getAllServices().filter((service) =>
    service.packageType.includes(packageType)
  );
}

/**
 * Get popular services
 */
export function getPopularServices(): ServiceData[] {
  return getAllServices().filter((service) => service.isPopular);
}

/**
 * Get related services for a specific service
 */
export function getRelatedServices(
  serviceId: string,
  limit?: number
): ServiceData[] {
  const service = getServiceById(serviceId);

  if (
    !service ||
    !service.relatedServices ||
    service.relatedServices.length === 0
  ) {
    return [];
  }

  let related = service.relatedServices
    .map((id) => getServiceById(id))
    .filter((service): service is ServiceData => !!service);

  if (limit && limit > 0 && related.length > limit) {
    related = related.slice(0, limit);
  }

  return related;
}

/**
 * Get services with similar category to the specified service
 */
export function getSimilarCategoryServices(
  serviceId: string,
  packageType: PackageType,
  limit: number = 3
): ServiceData[] {
  const service = getServiceById(serviceId);
  if (!service) return [];

  const category = service.category;

  // Find services in the same category, excluding the current service
  const categoryServices = getServicesByCategory(category).filter(
    (s) => s.id !== serviceId && s.packageType.includes(packageType)
  );

  if (categoryServices.length >= limit) {
    return categoryServices.slice(0, limit);
  }

  // If we don't have enough services in the same category, get some from the same package type
  const packageServices = getServicesByPackageType(packageType).filter(
    (s) => s.id !== serviceId && s.category !== category
  );

  return [...categoryServices, ...packageServices].slice(0, limit);
}

/**
 * Calculate the price of a service with selected options
 */
export function calculateServicePrice(
  serviceId: string,
  selectedOptions: Record<string, string>,
  duration: number = 1
): number {
  const service = getServiceById(serviceId);
  if (!service) return 0;

  let totalPrice = service.basePrice * duration;

  // Add the price of each selected option
  Object.entries(selectedOptions).forEach(
    ([optionCategory, selectedOptionId]) => {
      const categoryOptions = service.options?.[optionCategory];
      if (categoryOptions?.subOptions) {
        const option = categoryOptions.subOptions[selectedOptionId];
        if (option && typeof option.price === 'number') {
          totalPrice += option.price * duration;
        }
      }
    }
  );

  return totalPrice;
}

// ================================================================
// MIGRATION UTILITIES
// ================================================================

/**
 * Adapt from ServiceData (new format) to Service (old format)
 * for maintaining compatibility during transition
 */
export function adaptToLegacyService(serviceData: ServiceData): Service {
  return {
    id: serviceData.id,
    name: serviceData.titleKey.split('.').pop() || serviceData.id, // Simple extraction from the translation key
    img: serviceData.imageUrl,
    description: serviceData.descriptionKey,
    packageType: serviceData.packageType,
    price: serviceData.basePrice,
    duration: serviceData.duration || 0,
    available: true,
  };
}

/**
 * Convert from legacy Service to enhanced ServiceData
 */
export function enhanceLegacyService(legacyService: Service): ServiceData {
  // Default category based on ID
  const category = getServiceCategory(legacyService.id);

  // Extract package type
  const packageType = legacyService.packageType || ['standard'];

  // Determine if this is a premium service
  const isPremium = packageType.includes('premium');
  const packagePrefix = isPremium ? 'premium' : 'standard';

  // Generate translation keys
  const serviceNameKey = legacyService.id.replace(/-([a-z])/g, (_, letter) =>
    letter.toUpperCase()
  );
  const titleKey = `services.${packagePrefix}.${serviceNameKey}.name`;
  const descriptionKey = `services.${packagePrefix}.${serviceNameKey}.description`;
  const fullDescriptionKey = `services.${packagePrefix}.${serviceNameKey}.full`;

  return {
    id: legacyService.id,
    titleKey,
    descriptionKey,
    fullDescriptionKey,
    basePrice: legacyService.price,
    priceUnit: `services.priceUnits.per${
      legacyService.duration > 1 ? 'Day' : 'Session'
    }`,
    category,
    packageType,
    imageUrl: legacyService.img,
    duration: legacyService.duration,
    isPopular: false, // Default
  };
}

/**
 * Gets all services in the legacy format
 */
export function getAllLegacyServices(): Service[] {
  return getAllServices().map(adaptToLegacyService);
}

/**
 * Get services filtered by package type (in legacy format)
 */
export function getLegacyServicesByPackageType(
  packageType: PackageType
): Service[] {
  return getServicesByPackageType(packageType).map(adaptToLegacyService);
}
