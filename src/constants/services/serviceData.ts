// ================================================================
// SERVICES DATA
// ================================================================

import { ServiceData } from '@/types/services';
import { SERVICE_IDS } from './serviceId';

// Centralized object with all services information
export const SERVICES_DATA: Record<string, ServiceData> = {
  // CHEF SERVICE
  [SERVICE_IDS.CHEF]: {
    id: SERVICE_IDS.CHEF,
    titleKey: 'services.standard.privateChef.name',
    descriptionKey: 'services.standard.privateChef.description',
    fullDescriptionKey: 'services.standard.privateChef.full',
    basePrice: 200,
    priceUnit: 'services.priceUnits.perDay',
    category: 'food-drinks',
    packageType: ['standard'],
    imageUrl: '/images/chef.jpg',
    duration: 3,
    isPopular: true,
    bookingDuration: {
      min: 1,
      max: 14,
      unit: 'days',
    },
    options: {
      cuisineType: {
        id: 'cuisineType',
        nameKey: 'services.chef.options.cuisineType.title',
        subOptions: {
          italian: {
            id: 'italian',
            nameKey: 'services.chef.options.cuisineType.options.italian',
            price: 0,
          },
          mexican: {
            id: 'mexican',
            nameKey: 'services.chef.options.cuisineType.options.mexican',
            price: 0,
          },
          dominican: {
            id: 'dominican',
            nameKey: 'services.chef.options.cuisineType.options.dominican',
            price: 0,
          },
        },
      },
      mealCount: {
        id: 'mealCount',
        nameKey: 'services.chef.options.mealCount.title',
        subOptions: {
          breakfast: {
            id: 'breakfast',
            nameKey: 'services.chef.options.mealCount.options.breakfast',
            price: 40,
          },
          lunch: {
            id: 'lunch',
            nameKey: 'services.chef.options.mealCount.options.lunch',
            price: 60,
          },
          dinner: {
            id: 'dinner',
            nameKey: 'services.chef.options.mealCount.options.dinner',
            price: 80,
          },
          fullDay: {
            id: 'fullDay',
            nameKey: 'services.chef.options.mealCount.options.fullDay',
            price: 150,
          },
        },
      },
    },
    additionalInfoKeys: [
      'services.chef.additionalInfo.1',
      'services.chef.additionalInfo.2',
      'services.chef.additionalInfo.3',
    ],
    includes: [
      'services.chef.includes.1',
      'services.chef.includes.2',
      'services.chef.includes.3',
      'services.chef.includes.4',
    ],
    relatedServices: [SERVICE_IDS.GROCERY],
    tags: ['food', 'in-house'],
    metaData: {
      maxPeople: 10,
      needsGroceries: true,
      includedServices: 'shopping,cooking,cleaning',
    },
  },

  // GOLF CART RENTALS
  [SERVICE_IDS.GOLF_CART]: {
    id: SERVICE_IDS.GOLF_CART,
    titleKey: 'services.standard.golfCartRentals.name',
    descriptionKey: 'services.standard.golfCartRentals.description',
    fullDescriptionKey: 'services.standard.golfCartRentals.full',
    basePrice: 65,
    priceUnit: 'services.priceUnits.perDay',
    category: 'transportation',
    packageType: ['standard'],
    imageUrl: '/images/golf-cart.jpg',
    duration: 24,
    isPopular: true,
    bookingDuration: {
      min: 1,
      max: 30,
      unit: 'days',
    },
    options: {
      cartType: {
        id: 'cartType',
        nameKey: 'services.golfCart.options.cartType.title',
        subOptions: {
          standard: {
            id: 'standard',
            nameKey: 'services.golfCart.options.cartType.options.standard',
            price: 0,
          },
          luxury: {
            id: 'luxury',
            nameKey: 'services.golfCart.options.cartType.options.luxury',
            price: 25,
          },
          sixSeater: {
            id: 'sixSeater',
            nameKey: 'services.golfCart.options.cartType.options.sixSeater',
            price: 30,
          },
        },
      },
      insurance: {
        id: 'insurance',
        nameKey: 'services.golfCart.options.insurance.title',
        subOptions: {
          basic: {
            id: 'basic',
            nameKey: 'services.golfCart.options.insurance.options.basic',
            price: 5,
          },
          full: {
            id: 'full',
            nameKey: 'services.golfCart.options.insurance.options.full',
            price: 10,
          },
        },
      },
    },
    additionalInfoKeys: [
      'services.golfCart.additionalInfo.1',
      'services.golfCart.additionalInfo.2',
    ],
    relatedServices: [SERVICE_IDS.AIRPORT_TRANSFER, SERVICE_IDS.BIKE_RENTALS],
    tags: ['transport', 'mobility'],
    metaData: {
      requiresLicense: false,
      maxSpeed: '25 km/h',
      depositRequired: '200',
    },
  },

  // YOGA SERVICE
  [SERVICE_IDS.YOGA]: {
    id: SERVICE_IDS.YOGA,
    titleKey: 'services.standard.yogaStandard.name',
    descriptionKey: 'services.standard.yogaStandard.description',
    fullDescriptionKey: 'services.standard.yogaStandard.full',
    basePrice: 50,
    priceUnit: 'services.priceUnits.perSession',
    category: 'wellness',
    packageType: ['standard'],
    imageUrl: '/images/yoga.jpg',
    duration: 1,
    bookingDuration: {
      min: 1,
      max: 10,
      unit: 'hours',
    },
    options: {
      yogaStyle: {
        id: 'yogaStyle',
        nameKey: 'services.yoga.options.yogaStyle.title',
        subOptions: {
          hatha: {
            id: 'hatha',
            nameKey: 'services.yoga.options.yogaStyle.options.hatha',
            price: 0,
          },
          vinyasa: {
            id: 'vinyasa',
            nameKey: 'services.yoga.options.yogaStyle.options.vinyasa',
            price: 0,
          },
          restorative: {
            id: 'restorative',
            nameKey: 'services.yoga.options.yogaStyle.options.restorative',
            price: 0,
          },
          meditation: {
            id: 'meditation',
            nameKey: 'services.yoga.options.yogaStyle.options.meditation',
            price: -10,
          },
        },
      },
      location: {
        id: 'location',
        nameKey: 'services.yoga.options.location.title',
        subOptions: {
          beach: {
            id: 'beach',
            nameKey: 'services.yoga.options.location.options.beach',
            price: 15,
          },
          pool: {
            id: 'pool',
            nameKey: 'services.yoga.options.location.options.pool',
            price: 0,
          },
          indoors: {
            id: 'indoors',
            nameKey: 'services.yoga.options.location.options.indoors',
            price: 0,
          },
        },
      },
    },
    additionalInfoKeys: [
      'services.yoga.additionalInfo.1',
      'services.yoga.additionalInfo.2',
    ],
    specialRender: 'yoga',
    relatedServices: [SERVICE_IDS.PERSONAL_TRAINER],
    tags: ['wellness', 'fitness', 'relaxation'],
    availability: {
      daysOfWeek: [1, 2, 3, 4, 5, 6],
      hoursOfDay: [6, 7, 8, 9, 16, 17, 18],
    },
    metaData: {
      equipmentProvided: true,
      languages: 'english,spanish',
      experienceLevel: 'beginner,intermediate,advanced',
      yogaStyles: ['hatha', 'vinyasa', 'ashtanga', 'yin', 'restorative'],
      includes: [
        'Yoga Mats',
        'Props & Supports (as needed)',
        'Personalized Guidance',
      ],
      notIncluded: ['Gratuity (optional)'],
      disclaimer:
        'For your safety, consult with a physician before beginning any new activity.',
    },
  },

  // Add other services from your original SERVICES_DATA...

  // Example of a premium service
  [SERVICE_IDS.LUXE_YACHT]: {
    id: SERVICE_IDS.LUXE_YACHT,
    titleKey: 'services.premium.luxeYacht.name',
    descriptionKey: 'services.premium.luxeYacht.description',
    fullDescriptionKey: 'services.premium.luxeYacht.full',
    basePrice: 1500,
    priceUnit: 'services.priceUnits.perDay',
    category: 'water-activities',
    packageType: ['premium'],
    imageUrl: '/images/luxe-yacht.jpg',
    duration: 8,
    isPopular: true,
    bookingDuration: {
      min: 1,
      max: 2,
      unit: 'days',
    },
    options: {
      // Add options specific to the yacht service
    },
    specialRender: 'yacht',
    includes: [
      'services.luxeYacht.includes.1',
      'services.luxeYacht.includes.2',
      'services.luxeYacht.includes.3',
      'services.luxeYacht.includes.4',
    ],
    notIncluded: ['services.luxeYacht.notIncluded.1'],
    relatedServices: [
      SERVICE_IDS.PRIVATE_CATAMARAN,
      SERVICE_IDS.PRIVATE_FISHING,
    ],
    tags: ['luxury', 'water', 'private'],
    metaData: {
      size: '50 Feet',
      capacity: 'Up to 19 People',
      includedCrew: 'Captain,Steward',
      halfDayOption: true,
      menuOptions: 'classic1,classic2,premium',
    },
  },
};
