/**
 * Service Manager
 * This file provides a unified interface for accessing all service-related functionality
 * It brings together all the different service modules into a clean API
 */

import { Service, PackageType } from '@/types/type';
import { SERVICE_IDS } from './serviceId';
import { getServiceCategory, ServiceCategory } from './serviceCategories';
import { getServiceExtendedDetails } from './serviceDetails';
import * as ServiceDataAPI from './serviceData';
import * as ServiceUtils from '@/utils/servicesUtils';

/**
 * The main service manager object that provides all service-related functionality
 */
export const ServiceManager = {
  // Constants
  IDs: SERVICE_IDS,

  // Basic queries - Modern format (ServiceData)
  getData: ServiceDataAPI.getServiceDataById,
  getAllData: ServiceDataAPI.getAllServiceData,
  getDataByCategory: ServiceDataAPI.getServiceDataByCategory,
  getDataByPackageType: ServiceDataAPI.getServiceDataByPackageType,
  getPopularData: ServiceDataAPI.getPopularServiceData,
  getRelatedData: ServiceDataAPI.getRelatedServiceData,

  // Basic queries - Legacy format (Service)
  get: ServiceUtils.getServiceById,
  getAll: ServiceUtils.getAllServices,
  getByCategory: ServiceUtils.getServicesByCategory,
  getByPackageType: ServiceUtils.getServicesByPackageType,
  getPopular: ServiceUtils.getPopularServices,
  getRelated: ServiceUtils.getRelatedServices,

  // Enhanced service details
  getDetails: getServiceExtendedDetails,
  enhance: ServiceUtils.enhanceServiceDetails,
  getFullService: ServiceUtils.getFullServiceData,

  // Utility functions
  getCategory: getServiceCategory,
  getTranslationPath: ServiceUtils.getServiceTranslationPath,
  adaptLegacyServices: ServiceUtils.adaptServicesArray,
  calculatePrice: ServiceUtils.calculatePrice,
  search: ServiceUtils.searchServices,

  /**
   * Get all services in a specific category and package type
   * @param category - Category to filter by
   * @param packageType - Package type to filter by
   * @returns Services in the specified category and package type
   */
  getByCategoryAndPackage: (
    category: ServiceCategory,
    packageType: PackageType
  ): Service[] => {
    return ServiceUtils.getServicesByCategory(category).filter((service) =>
      service.packageType.includes(packageType)
    );
  },

  /**
   * Checks if a service belongs to a specific category
   * @param serviceId - The ID of the service
   * @param category - The category to check
   * @returns True if the service belongs to the category, false otherwise
   */
  isInCategory: (serviceId: string, category: ServiceCategory): boolean => {
    return getServiceCategory(serviceId) === category;
  },

  /**
   * Checks if a service is available for a package type
   * @param serviceId - The ID of the service
   * @param packageType - The package type to check
   * @returns True if the service is available for the package type, false otherwise
   */
  isAvailableForPackage: (
    serviceId: string,
    packageType: PackageType
  ): boolean => {
    const service = ServiceUtils.getServiceById(serviceId);
    return !!service && service.packageType.includes(packageType);
  },

  /**
   * Gets services that are recommended to pair with a specific service
   * If related services are defined, use those, otherwise use services in the same category
   * @param serviceId - ID of the service
   * @param limit - Maximum number of recommended services
   * @returns Recommended services
   */
  getRecommendedServices: (serviceId: string, limit: number = 3): Service[] => {
    return ServiceUtils.getRelatedServices(serviceId, limit);
  },
};

export default ServiceManager;
