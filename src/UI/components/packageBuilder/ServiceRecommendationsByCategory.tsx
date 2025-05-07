import React, { useState, useEffect } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Anchor,
  Car,
  Heart,
  Utensils,
  Music,
  ArrowRight,
  Compass,
  Filter,
  Zap,
} from 'lucide-react';
import ServiceRecommendationCard from './ServiceRecomendationCard';

interface ServiceRecommendationsByCategoryProps {
  services: Service[];
  purpose?: string;
  onComplete?: () => void;
}

interface CategoryData {
  id: string;
  name: string;
  icon: React.ReactNode;
  services: Service[];
}

const ServiceRecommendationsByCategory: React.FC<
  ServiceRecommendationsByCategoryProps
> = ({ services, purpose, onComplete }) => {
  const { t } = useTranslation();
  const { packageType, selectedServices, addService, removeService } =
    useBooking();

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Process services into categories
  useEffect(() => {
    setLoading(true);

    // Get filtered services based on package type
    let filteredServices = [...services];
    if (packageType) {
      filteredServices = filteredServices.filter((service) =>
        service.packageType.includes(packageType)
      );
    }

    // Prioritize based on travel purpose if present
    if (purpose) {
      filteredServices = applyPurposeFiltering(filteredServices, purpose);
    }

    // Categorize services
    const categorizedServices = categorizeServices(filteredServices);
    setCategories(categorizedServices);

    // Set first category as active by default
    if (categorizedServices.length > 0) {
      setActiveCategory(categorizedServices[0].id);
    }

    setLoading(false);
  }, [services, packageType, purpose]);

  // Helper function to categorize services
  const categorizeServices = (services: Service[]): CategoryData[] => {
    const categoriesMap = new Map<string, CategoryData>();

    // Define categories
    categoriesMap.set('water-activities', {
      id: 'water-activities',
      name: t('categories.waterActivities', { fallback: 'Water Activities' }),
      icon: <Anchor className='h-5 w-5' />,
      services: [],
    });

    categoriesMap.set('tours', {
      id: 'tours',
      name: t('categories.tours', { fallback: 'Tours & Excursions' }),
      icon: <Compass className='h-5 w-5' />,
      services: [],
    });

    categoriesMap.set('transportation', {
      id: 'transportation',
      name: t('categories.transportation', { fallback: 'Transportation' }),
      icon: <Car className='h-5 w-5' />,
      services: [],
    });

    categoriesMap.set('wellness', {
      id: 'wellness',
      name: t('categories.wellness', { fallback: 'Wellness & Spa' }),
      icon: <Heart className='h-5 w-5' />,
      services: [],
    });

    categoriesMap.set('food-drinks', {
      id: 'food-drinks',
      name: t('categories.foodDrinks', { fallback: 'Food & Drinks' }),
      icon: <Utensils className='h-5 w-5' />,
      services: [],
    });

    categoriesMap.set('leisure', {
      id: 'leisure',
      name: t('categories.leisure', { fallback: 'Entertainment & Leisure' }),
      icon: <Music className='h-5 w-5' />,
      services: [],
    });

    // Put services into categories
    services.forEach((service) => {
      const category = getCategoryFromServiceId(service.id);
      if (categoriesMap.has(category)) {
        const categoryData = categoriesMap.get(category);
        if (categoryData) {
          categoryData.services.push(service);
        }
      }
    });

    // Return only categories that have services
    return Array.from(categoriesMap.values()).filter(
      (category) => category.services.length > 0
    );
  };

  // Helper function to get category from service ID
  const getCategoryFromServiceId = (serviceId: string): string => {
    if (
      serviceId.includes('yoga') ||
      serviceId.includes('masseuse') ||
      serviceId.includes('fitness')
    ) {
      return 'wellness';
    } else if (
      serviceId.includes('catamaran') ||
      serviceId.includes('yacht') ||
      serviceId.includes('fishing')
    ) {
      return 'water-activities';
    } else if (serviceId.includes('chef') || serviceId.includes('culinary')) {
      return 'food-drinks';
    } else if (
      serviceId.includes('music') ||
      serviceId.includes('karaoke') ||
      serviceId.includes('baby')
    ) {
      return 'leisure';
    } else if (
      serviceId.includes('golf-cart') ||
      serviceId.includes('bike') ||
      serviceId.includes('airport')
    ) {
      return 'transportation';
    } else if (
      serviceId.includes('island') ||
      serviceId.includes('excursion') ||
      serviceId.includes('adventure')
    ) {
      return 'tours';
    }
    return 'other';
  };

  // Apply travel purpose filtering
  const applyPurposeFiltering = (
    services: Service[],
    purpose: string
  ): Service[] => {
    // Create a copy for sorting
    const sortedServices = [...services];

    // Define priority categories based on purpose
    const priorityCategories: string[] = [];

    switch (purpose) {
      case 'relaxation':
        priorityCategories.push('wellness', 'food-drinks');
        break;
      case 'adventure':
        priorityCategories.push('water-activities', 'tours');
        break;
      case 'celebration':
        priorityCategories.push('food-drinks', 'leisure');
        break;
      case 'family':
        priorityCategories.push('tours', 'leisure', 'water-activities');
        break;
    }

    // Sort services to prioritize the selected categories
    sortedServices.sort((a, b) => {
      const catA = getCategoryFromServiceId(a.id);
      const catB = getCategoryFromServiceId(b.id);

      const isPriorityA = priorityCategories.includes(catA);
      const isPriorityB = priorityCategories.includes(catB);

      if (isPriorityA && !isPriorityB) return -1;
      if (!isPriorityA && isPriorityB) return 1;
      return 0;
    });

    return sortedServices;
  };

  // Handle toggling service selection
  const toggleService = (service: Service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  // Check if a service is selected
  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((service) => service.id === serviceId);
  };

  // Handle 'Select All in Category'
  const selectAllInCategory = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      category.services.forEach((service) => {
        if (!isServiceSelected(service.id)) {
          addService(service);
        }
      });
    }
  };

  // If loading, show a loading state
  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <div className='w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4'></div>
        <p className='text-gray-600'>
          {t('recommendations.loading', {
            fallback: 'Organizing services for you...',
          })}
        </p>
      </div>
    );
  }

  // If no categories with services, show empty state
  if (categories.length === 0) {
    return (
      <div className='max-w-4xl mx-auto py-8 px-4'>
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 text-center'>
          <Filter className='h-12 w-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-800 mb-2'>
            {t('recommendations.noServices.title', {
              fallback: 'No Services Available',
            })}
          </h3>
          <p className='text-gray-600'>
            {t('recommendations.noServices.message', {
              fallback:
                "We couldn't find any services that match your criteria.",
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto py-8'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>
        {t('recommendations.title', {
          fallback: 'Recommended Services for Your Trip',
        })}
      </h2>

      <p className='text-gray-600 mb-8'>
        {t('recommendations.subtitle', {
          fallback:
            'Browse and select from our recommended services based on your preferences.',
        })}
      </p>

      {/* Category tabs */}
      <div className='flex overflow-x-auto pb-2 mb-8'>
        <div className='flex space-x-2'>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-4 py-2 rounded-full whitespace-nowrap transition-colors flex items-center
                ${
                  activeCategory === category.id
                    ? packageType === 'standard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }
              `}
            >
              <span className='mr-2'>{category.icon}</span>
              <span className='font-medium'>{category.name}</span>
              {category.services.some((service) =>
                isServiceSelected(service.id)
              ) && (
                <span
                  className={`
                  ml-2 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                  ${
                    packageType === 'standard'
                      ? 'bg-blue-500 text-white'
                      : 'bg-amber-500 text-white'
                  }
                `}
                >
                  {
                    category.services.filter((service) =>
                      isServiceSelected(service.id)
                    ).length
                  }
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active category content */}
      {activeCategory && (
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xl font-semibold text-gray-900 flex items-center'>
              {categories.find((cat) => cat.id === activeCategory)?.icon}
              <span className='ml-2'>
                {categories.find((cat) => cat.id === activeCategory)?.name}
              </span>
            </h3>

            {/* Quick action buttons */}
            <button
              onClick={() => selectAllInCategory(activeCategory)}
              className={`
                px-4 py-2 text-sm rounded-lg font-medium flex items-center
                ${
                  packageType === 'standard'
                    ? 'text-blue-700 hover:bg-blue-50'
                    : 'text-amber-700 hover:bg-amber-50'
                }
              `}
            >
              <Zap className='mr-1 h-4 w-4' />
              {t('recommendations.selectAll', {
                fallback: 'Select All in Category',
              })}
            </button>
          </div>

          {/* Services grid */}
          <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8'>
            {categories
              .find((cat) => cat.id === activeCategory)
              ?.services.map((service) => (
                <ServiceRecommendationCard
                  key={service.id}
                  service={service}
                  isSelected={isServiceSelected(service.id)}
                  onToggle={() => toggleService(service)}
                  packageType={packageType || 'standard'}
                />
              ))}
          </div>
        </div>
      )}

      {/* Show selected count and continue button */}
      <div className='mt-12 pt-6 border-t border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='mb-4 md:mb-0'>
            <span className='text-gray-700 font-medium'>
              {t('recommendations.selectedCount', {
                fallback: 'Selected Services:',
              })}
            </span>
            <span
              className={`
              ml-2 font-bold text-lg
              ${packageType === 'standard' ? 'text-blue-600' : 'text-amber-600'}
            `}
            >
              {selectedServices.length}
            </span>
          </div>

          {onComplete && (
            <button
              onClick={onComplete}
              disabled={selectedServices.length === 0}
              className={`
                px-6 py-3 rounded-lg font-medium flex items-center
                ${
                  selectedServices.length > 0
                    ? packageType === 'standard'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {t('recommendations.continue', {
                fallback: 'Continue to Scheduling',
              })}
              <ArrowRight className='ml-2 h-5 w-5' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceRecommendationsByCategory;
