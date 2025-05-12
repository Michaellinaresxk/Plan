import { Service, EnhancedService, PackageType } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { ServiceId, isValidServiceId } from '../constants/services/serviceId';
import {
  getServiceExtendedDetails,
} from '../constants/services/serviceDetails';
import {
  SERVICES_DATA,
  getServiceDataById,
  getAllServiceData,
  getServiceDataByCategory,
  getServiceDataByPackageType,
  getPopularServiceData,
  getRelatedServiceData,
  calculateServicePrice,
} from '../constants/services/serviceData';
import ServiceManager from '@/constants/services/ServiceManager';

/**
 * Converts a ServiceData (new structured format) to Service (old array format)
 * for backward compatibility during transition
 * @param serviceData - The service data in the new format
 * @returns The service data converted to the old format
 */
export function adaptServiceDataToService(serviceData: ServiceData): Service {
  return {
    id: serviceData.id,
    name: serviceData.id, // This will be replaced with i18n translation in the components
    img: serviceData.imageUrl,
    description: serviceData.descriptionKey, // This will be replaced with i18n translation in the components
    packageType: serviceData.packageType as PackageType[],
    price: serviceData.basePrice,
    duration: serviceData.duration || 0,
    available: true,
  };
}

/**
 * Gets a service by its ID from the centralized data store
 * @param serviceId - The ID of the service to get
 * @returns The service if found, undefined otherwise
 */
export function getServiceById(serviceId: string): Service | undefined {
  const serviceData = getServiceDataById(serviceId);
  if (!serviceData) {
    return undefined;
  }

  return adaptServiceDataToService(serviceData);
}

/**
 * Gets all services as an array
 * @returns Array of all services in the old format
 */
export function getAllServices(): Service[] {
  return getAllServiceData().map(adaptServiceDataToService);
}

/**
 * Gets all services from a specific category
 * @param category - The category to filter by
 * @returns Array of services in the specified category
 */
export function getServicesByCategory(category: string): Service[] {
  return getServiceDataByCategory(category as any).map(
    adaptServiceDataToService
  );
}

/**
 * Gets services for a specific package type
 * @param packageType - The package type to filter by
 * @returns Array of services for the specified package type
 */
export function getServicesByPackageType(packageType: PackageType): Service[] {
  return getServiceDataByPackageType(packageType).map(
    adaptServiceDataToService
  );
}

/**
 * Gets popular services
 * @param limit - Maximum number of services to return
 * @returns Array of popular services
 */
export function getPopularServices(limit?: number): Service[] {
  const popularServices = getPopularServiceData().map(
    adaptServiceDataToService
  );

  if (limit && limit > 0 && popularServices.length > limit) {
    return popularServices.slice(0, limit);
  }

  return popularServices;
}

/**
 * Gets related services for a specific service
 * @param serviceId - The ID of the service to get related services for
 * @param limit - Maximum number of related services to return
 * @returns Array of related services
 */
export function getRelatedServices(
  serviceId: string,
  limit: number = 3
): Service[] {
  const relatedServiceData = getRelatedServiceData(serviceId, limit);
  if (relatedServiceData.length === 0) {
    // Fallback: if no related services defined, find some from the same category
    const category = ServiceManager.getCategory(serviceId);
    return getServicesByCategory(category)
      .filter((s) => s.id !== serviceId)
      .slice(0, limit);
  }

  return relatedServiceData.map(adaptServiceDataToService);
}

/**
 * Enhances a service with its extended details
 * @param service - The base service to enhance
 * @returns The service enhanced with additional details
 */
export function enhanceServiceDetails(service: Service): EnhancedService {
  const extendedDetails = getServiceExtendedDetails(service.id);

  return {
    ...service,
    ...extendedDetails,
    // Convert property names to match EnhancedService interface
    fullDescription:
      extendedDetails.fullDescription || extendedDetails.description,
    includes: extendedDetails.includes || [],
    whatToBring: extendedDetails.whatToBring || [],
    schedule: extendedDetails.schedule || '',
    pickupTime: extendedDetails.pickupTime || '',
    priceUnit: extendedDetails.priceUnit || '',
    capacity: extendedDetails.capacity || '',
    size: extendedDetails.size || '',
    location: extendedDetails.location || '',
    menuOptions: extendedDetails.menuOptions || [],
    halfDayOption: extendedDetails.halfDayOption || { available: false },
  };
}

/**
 * Convert a ServiceData to an EnhancedService (fully enriched format)
 * @param serviceData - Original service data to enhance
 * @returns Fully enhanced service with all details
 */
export function convertToEnhancedService(
  serviceData: ServiceData
): EnhancedService {
  const baseService = adaptServiceDataToService(serviceData);
  return enhanceServiceDetails(baseService);
}

/**
 * Adapts the legacy SERVICES array (from serviceList.ts) to work with the current system
 * This allows backward compatibility during migration
 * @param services - Legacy services array from the old data structure
 * @returns The same services, ensuring compatibility with current system
 */
export function adaptServicesArray(services: Service[]): Service[] {
  // In a fully migrated system, this function would convert old format to new
  // and then back to ensure consistent behavior

  // For backward compatibility, we'll now just return the original services
  // In the future, you could enhance this with validation or data enrichment
  return services.map((service) => {
    // If the service already exists in SERVICES_DATA, use the enhanced version
    if (
      isValidServiceId(service.id) &&
      SERVICES_DATA[service.id as ServiceId]
    ) {
      return {
        ...service,
        // Optionally override with canonical data
        price: SERVICES_DATA[service.id as ServiceId].basePrice,
        duration:
          SERVICES_DATA[service.id as ServiceId].duration || service.duration,
      };
    }

    // Otherwise return the original service
    return service;
  });
}

/**
 * Gets the translation path for a service
 * @param serviceId - The ID of the service
 * @returns The translation path for the service
 */
export function getServiceTranslationPath(serviceId: string): string {
  // Determine if it's a premium service
  const isPremium = serviceId.startsWith('luxe-');
  const type = isPremium ? 'premium' : 'standard';

  // Convert the ID to a format that matches translation keys
  let key = serviceId;

  // Remove the 'luxe-' prefix if present
  if (isPremium) {
    key = key.replace('luxe-', '');
  }

  // Convert kebab-case to camelCase for translation key
  key = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

  return `services.${type}.${key}`;
}

/**
 * Calculates service price based on options and duration
 * @param serviceId - The ID of the service
 * @param selectedOptions - Options selected for the service
 * @param duration - Duration of the service
 * @returns Calculated price
 */
export function calculatePrice(
  serviceId: string,
  selectedOptions: Record<string, string> = {},
  duration: number = 1
): number {
  return calculateServicePrice(serviceId, selectedOptions, duration);
}

/**
 * Get full service data with all details
 * This is a convenience function that combines multiple operations
 * @param serviceId - ID of the service
 * @returns All data for a service in a unified format
 */
export function getFullServiceData(
  serviceId: string
): (ServiceData & ServiceExtendedDetails) | undefined {
  const baseData = getServiceDataById(serviceId);
  if (!baseData) return undefined;

  const extendedDetails = getServiceExtendedDetails(serviceId);

  return {
    ...baseData,
    ...extendedDetails,
  };
}

/**
 * Search for services by text
 * @param searchText - Text to search for
 * @param packageType - Optional package type to filter by
 * @returns Services matching the search criteria
 */
export function searchServices(
  searchText: string,
  packageType?: PackageType
): Service[] {
  const allServices = packageType
    ? getServicesByPackageType(packageType)
    : getAllServices();

  if (!searchText || searchText.trim() === '') {
    return allServices;
  }

  const normalizedSearch = searchText.toLowerCase().trim();

  return allServices.filter(
    (service) =>
      service.id.toLowerCase().includes(normalizedSearch) ||
      service.name.toLowerCase().includes(normalizedSearch) ||
      service.description.toLowerCase().includes(normalizedSearch)
  );
}
