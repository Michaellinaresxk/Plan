import { ServiceId, SERVICE_IDS } from './serviceId';

// Type for service categories
export type ServiceCategory =
  | 'all'
  | 'water-activities'
  | 'tours'
  | 'transportation'
  | 'wellness'
  | 'food-drinks'
  | 'leisure'
  | 'luxury';

// Mapping of service IDs to categories
const SERVICE_CATEGORY_MAP: Record<ServiceId, ServiceCategory> = {
  // Water Activities
  [SERVICE_IDS.CATAMARAN]: 'water-activities',
  [SERVICE_IDS.PRIVATE_CATAMARAN]: 'water-activities',
  [SERVICE_IDS.PRIVATE_YACHT]: 'water-activities',
  [SERVICE_IDS.LUXE_YACHT]: 'water-activities',
  [SERVICE_IDS.DEEP_SEA_FISHING]: 'water-activities',
  [SERVICE_IDS.PRIVATE_FISHING]: 'water-activities',

  // Tours and Excursions
  [SERVICE_IDS.SAONA_TOUR]: 'tours',
  [SERVICE_IDS.ADVENTURE_EXCURSIONS]: 'tours',
  [SERVICE_IDS.HORSEBACK_RIDING]: 'tours',

  // Transportation
  [SERVICE_IDS.AIRPORT_TRANSFER]: 'transportation',
  [SERVICE_IDS.GOLF_CART]: 'transportation',
  [SERVICE_IDS.BIKE_RENTALS]: 'transportation',
  [SERVICE_IDS.LUXE_GOLF_CART]: 'transportation',
  [SERVICE_IDS.LUXE_EBIKES]: 'transportation',
  [SERVICE_IDS.LUXE_ARRIVAL]: 'transportation',

  // Wellness
  [SERVICE_IDS.YOGA]: 'wellness',
  [SERVICE_IDS.PERSONAL_TRAINER]: 'wellness',
  [SERVICE_IDS.LUXE_YOGA]: 'wellness',
  [SERVICE_IDS.LUXE_FITNESS]: 'wellness',
  [SERVICE_IDS.LUXE_MASSEUSE]: 'wellness',

  // Food and Drinks
  [SERVICE_IDS.CHEF]: 'food-drinks',
  [SERVICE_IDS.LUXE_CULINARY]: 'food-drinks',

  // Leisure and Entertainment
  [SERVICE_IDS.BABYSITTER]: 'leisure',
  [SERVICE_IDS.KARAOKE]: 'leisure',
  [SERVICE_IDS.LIVE_MUSIC]: 'leisure',
  [SERVICE_IDS.CUSTOM_DECORATIONS]: 'leisure',
  [SERVICE_IDS.GROCERY]: 'leisure',
};

/**
 * Gets the category for a service by its ID
 * @param serviceId - The ID of the service
 * @returns The category of the service, or 'all' if not found
 */
export function getServiceCategory(serviceId: string): ServiceCategory {
  if (serviceId in SERVICE_CATEGORY_MAP) {
    return SERVICE_CATEGORY_MAP[serviceId as ServiceId];
  }
  return 'all';
}

/**
 * Gets all service IDs in a specific category
 * @param category - The category to filter by
 * @returns An array of service IDs in the specified category
 */
export function getServiceIdsByCategory(
  category: ServiceCategory
): ServiceId[] {
  if (category === 'all') {
    return Object.values(SERVICE_IDS);
  }

  return Object.entries(SERVICE_CATEGORY_MAP)
    .filter(([, serviceCategory]) => serviceCategory === category)
    .map(([id]) => id as ServiceId);
}

/**
 * Gets an array of all available categories
 * @returns Array of all categories
 */
export function getAllCategories(): ServiceCategory[] {
  // Create a set to get unique categories
  const categoriesSet = new Set<ServiceCategory>(
    Object.values(SERVICE_CATEGORY_MAP)
  );

  // Convert to array and ensure 'all' is first
  return ['all', ...Array.from(categoriesSet).filter((cat) => cat !== 'all')];
}

/**
 * Checks if a category has any services for a specific package type
 * @param category - The category to check
 * @param packageType - The package type to check
 * @returns True if the category has services for the package type
 */
export function categoryHasServicesForPackage(
  category: ServiceCategory,
  packageType: string
): boolean {
  const serviceIds = getServiceIdsByCategory(category);
  // This function requires serviceDataById which should be imported from serviceData
  // We don't have access to it here, so this would need to be moved to serviceManager
  // Implementation would check if any service in the category has the package type
  return serviceIds.length > 0;
}
