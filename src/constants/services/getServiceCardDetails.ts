/**
 * Helper functions for working with services in UI components
 * This file provides easy-to-use functions for common service operations in UI components
 */

import { Service } from '@/types/type';
import ServiceManager from './ServiceManager';

/**
 * Get enhanced details for a service card display
 * @param serviceId - ID of the service
 * @returns Object with display-ready service details
 */
export function getServiceCardDetails(serviceId: string) {
  const service = ServiceManager.get(serviceId);
  if (!service) return null;

  const enhancedService = ServiceManager.enhance(service);
  const extendedDetails = ServiceManager.getDetails(serviceId);

  return {
    service,
    enhancedService,
    // Common display properties
    tagline: extendedDetails.tagline || '',
    priceUnit: extendedDetails.priceUnit || 'per service',
    timeDescription: getTimeDescription(service, extendedDetails),
    highlights: getServiceHighlights(serviceId),
  };
}

/**
 * Get formatted time description for service
 */
function getTimeDescription(service: Service, details: any): string {
  if (details.schedule) return details.schedule;

  if (service.duration) {
    // Format based on duration
    if (service.duration >= 24) {
      const days = Math.floor(service.duration / 24);
      return days === 1 ? '1 day' : `${days} days`;
    } else {
      return service.duration === 1 ? '1 hour' : `${service.duration} hours`;
    }
  }

  return details.minimumBooking || '';
}

/**
 * Get key highlights to display for a service
 */
function getServiceHighlights(serviceId: string): string[] {
  const details = ServiceManager.getDetails(serviceId);

  // Return the first three includes if available
  if (details.includes && details.includes.length > 0) {
    return details.includes.slice(0, 3);
  }

  // Fallback to category-based highlights
  const category = ServiceManager.getCategory(serviceId);

  const categoryHighlights = {
    'water-activities': [
      'Professional equipment',
      'Experienced guides',
      'Safety briefing',
    ],
    transportation: [
      'Comfortable vehicles',
      'Professional drivers',
      'Flexible scheduling',
    ],
    wellness: [
      'Certified instructors',
      'All equipment provided',
      'Personalized attention',
    ],
    'food-drinks': [
      'Fresh, local ingredients',
      'Customized menu options',
      'Professional service',
    ],
    tours: [
      'Expert tour guides',
      'Transportation included',
      'Unique experiences',
    ],
    leisure: [
      'Professional service',
      'All equipment provided',
      'Flexible scheduling',
    ],
  };

  // @ts-ignore - TypeScript doesn't know we have these categories
  return (
    categoryHighlights[category] || [
      'Professional service',
      'Personalized attention',
      'Excellent customer service',
    ]
  );
}

/**
 * Get related services to recommend with a service
 * @param serviceId - ID of the service
 * @param limit - Maximum number of related services
 * @returns Array of related services
 */
export function getRelatedServicesForCard(
  serviceId: string,
  limit: number = 3
): Service[] {
  return ServiceManager.getRelated(serviceId, limit);
}

/**
 * Get popular services for a specific package type
 * @param packageType - The package type to filter by
 * @param limit - Maximum number of services to return
 * @returns Array of popular services
 */
export function getPopularServicesForPackage(
  packageType: string,
  limit: number = 6
): Service[] {
  const allServices = ServiceManager.getByPackageType(packageType as any);

  // First try to get popular services
  const popularServices = allServices.filter((service) => {
    const serviceData = ServiceManager.getData(service.id);
    return serviceData?.isPopular;
  });

  if (popularServices.length >= limit) {
    return popularServices.slice(0, limit);
  }

  // Fallback to returning all services up to the limit
  return allServices.slice(0, limit);
}

/**
 * Calculate the price of a service with options
 * @param serviceId - ID of the service
 * @param options - Selected options
 * @param duration - Duration of the service
 * @returns Formatted price string
 */
export function calculateFormattedPrice(
  serviceId: string,
  options: Record<string, string> = {},
  duration: number = 1
): string {
  const price = ServiceManager.calculatePrice(serviceId, options, duration);

  // Format price with commas for thousands
  return `$${price.toLocaleString()}`;
}
