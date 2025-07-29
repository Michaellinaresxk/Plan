import { ServiceData } from '@/types/services';
import { ServiceId, SERVICE_IDS } from './serviceId';
import { ServiceCategory } from './serviceCategories';

/**
 * Centralized object with all services information
 * This is the source of truth for all service data
 */
export const SERVICES_DATA: Record<ServiceId, ServiceData> = {
  // CHEF SERVICE
  [SERVICE_IDS.CHEF]: {
    id: SERVICE_IDS.CHEF,
    titleKey: 'services.standard.privateChef.name',
    descriptionKey: 'services.standard.privateChef.description',
    fullDescriptionKey: 'services.standard.privateChef.full',
    basePrice: 120,
    priceUnit: 'services.priceUnits.perDay',
    category: 'food-drinks',
    packageType: ['standard'],
    imageUrl:
      'https://plus.unsplash.com/premium_photo-1661288474987-1e90159ff2ca?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: 3,
    isPopular: true,
    bookingDuration: {
      min: 1,
      max: 14,
      unit: 'days',
    },
    options: {
      chefType: {
        id: 'chefType',
        nameKey: 'services.chef.options.chefType.title',
        subOptions: {
          regular: {
            id: 'regular',
            nameKey: 'services.chef.options.chefType.options.regular',
            price: 0, // Base price $120
            descriptionKey:
              'services.chef.options.chefType.options.regularDescription',
          },
          professional: {
            id: 'professional',
            nameKey: 'services.chef.options.chefType.options.professional',
            price: 55, // $175 total
            descriptionKey:
              'services.chef.options.chefType.options.professionalDescription',
          },
        },
      },
      guestCount: {
        id: 'guestCount',
        nameKey: 'services.chef.options.guestCount.title',
        subOptions: {
          small: {
            id: 'small',
            nameKey: 'services.chef.options.guestCount.options.small',
            price: 0,
            capacityInfo: {
              min: 1,
              max: 10,
            },
          },
          medium: {
            id: 'medium',
            nameKey: 'services.chef.options.guestCount.options.medium',
            price: 30,
            capacityInfo: {
              min: 11,
              max: 15,
            },
          },
          large: {
            id: 'large',
            nameKey: 'services.chef.options.guestCount.options.large',
            price: 60,
            capacityInfo: {
              min: 16,
              max: 20,
            },
          },
        },
      },
    },
    includes: [
      'services.chef.includes.1',
      'services.chef.includes.2',
      'services.chef.includes.3',
      'services.chef.includes.4',
      'services.chef.includes.5',
    ],
    notIncluded: ['services.chef.notIncluded.1', 'services.chef.notIncluded.2'],
    additionalInfoKeys: [
      'services.chef.additionalInfo.1',
      'services.chef.additionalInfo.2',
    ],
    relatedServices: [SERVICE_IDS.GROCERY],
    tags: ['culinary', 'dining', 'personal chef'],
    metaData: {
      regularChefDescription:
        "Regular cooks are individuals who cook well and offer their services at an affordable price. They don't work exclusively as chefs, nor do they actively promote themselves as such. They do not offer a set menu and usually work with guidance or requests from the guests.",
      professionalChefDescription:
        'A professional chef has formal culinary training and works full-time in the culinary field. They typically offer a curated menu, maintain high presentation standards, and have experience in handling special dietary needs or preferences.',
      requiresConsultation: true,
      cuisineTypes: [
        'Dominican Traditional',
        'International',
        'Mediterranean',
        'Asian Fusion',
        'Seafood Specialist',
        'Vegetarian/Vegan Options',
      ],
      dietaryAccommodations:
        'We accommodate allergies, intolerances, and preferences with advance notice',
      maxPeople: 20,
      needsGroceries: true,
    },
  },

  // YOGA SERVICE
  [SERVICE_IDS.YOGA]: {
    id: SERVICE_IDS.YOGA,
    titleKey: 'services.standard.yogaStandard.tagline',
    descriptionKey: 'services.standard.yogaStandard.description',
    fullDescriptionKey: 'services.standard.yogaStandard.full',
    basePrice: 50,
    priceUnit: 'services.priceUnits.perSession',
    category: 'wellness',
    packageType: ['standard'],
    imageUrl:
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    },
  },

  // MESSAGE
  [SERVICE_IDS.MASSAGE]: {
    id: SERVICE_IDS.MASSAGE,
    titleKey: 'services.standard.massage.name',
    descriptionKey: 'services.standard.massage.short',
    fullDescriptionKey: 'services.standard.massage.full',
    basePrice: 100,
    priceUnit: 'services.priceUnits.perSession',
    category: 'wellness',
    packageType: ['standard'],
    imageUrl:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: 1,
    bookingDuration: {
      min: 0.5,
      max: 4,
      unit: 'hours',
    },
    options: {
      massageType: {
        id: 'massageType',
        nameKey: 'services.massage.options.massageType.title',
        subOptions: {
          relaxing: {
            id: 'relaxing',
            nameKey: 'services.massage.options.massageType.options.relaxing',
            price: 120,
            duration: 60,
          },
          deep: {
            id: 'deep',
            nameKey: 'services.massage.options.massageType.options.deep',
            price: 130,
            duration: 60,
          },
          sport: {
            id: 'sport',
            nameKey: 'services.massage.options.massageType.options.sport',
            price: 150,
            duration: 90,
          },
          head: {
            id: 'head',
            nameKey: 'services.massage.options.massageType.options.head',
            price: 50,
            duration: 30,
          },
          foot: {
            id: 'foot',
            nameKey: 'services.massage.options.massageType.options.foot',
            price: 50,
            duration: 30,
          },
          thai: {
            id: 'thai',
            nameKey: 'services.massage.options.massageType.options.thai',
            price: 100,
            duration: 60,
          },
          pregnancy: {
            id: 'pregnancy',
            nameKey: 'services.massage.options.massageType.options.pregnancy',
            price: 100,
            duration: 60,
          },
          bfParadise: {
            id: 'bfParadise',
            nameKey: 'services.massage.options.massageType.options.bfParadise',
            price: 120,
            duration: 60,
          },
        },
      },
      duration: {
        id: 'duration',
        nameKey: 'services.massage.options.duration.title',
        subOptions: {
          30: {
            id: '30',
            nameKey: 'services.massage.options.duration.options.30',
            price: 0,
          },
          60: {
            id: '60',
            nameKey: 'services.massage.options.duration.options.60',
            price: 0,
          },
          90: {
            id: '90',
            nameKey: 'services.massage.options.duration.options.90',
            price: 20,
          },
        },
      },
      therapyType: {
        id: 'therapyType',
        nameKey: 'services.massage.options.therapyType.title',
        subOptions: {
          stone: {
            id: 'stone',
            nameKey: 'services.massage.options.therapyType.options.stone',
            price: 160,
            duration: 90,
          },
          bamboo: {
            id: 'bamboo',
            nameKey: 'services.massage.options.therapyType.options.bamboo',
            price: 160,
            duration: 90,
          },
          cupping: {
            id: 'cupping',
            nameKey: 'services.massage.options.therapyType.options.cupping',
            price: 160,
            duration: 90,
          },
          lymphatic: {
            id: 'lymphatic',
            nameKey: 'services.massage.options.therapyType.options.lymphatic',
            price: 150,
            duration: 90,
          },
        },
      },
    },
    additionalInfoKeys: [
      'services.massage.additionalInfo.1',
      'services.massage.additionalInfo.2',
      'services.massage.additionalInfo.3',
    ],
    specialRender: 'massage',
    relatedServices: [SERVICE_IDS.YOGA],
    tags: ['wellness', 'relaxation', 'therapy', 'spa'],
    availability: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      hoursOfDay: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    },
    metaData: {
      professionalTherapists: true,
      allAges: true,
      customDuration: true,
      inRoomService: true,
      organicProducts: true,
      languages: 'english,spanish',
      specialties: 'relaxation,therapeutic,couples,pregnancy,kids',
    },
  },

  // SAONA ISLAND TOUR
  [SERVICE_IDS.SAONA_TOUR]: {
    id: SERVICE_IDS.SAONA_TOUR,
    titleKey: 'services.standard.saonaTour.name',
    descriptionKey: 'services.standard.saonaTour.description',
    fullDescriptionKey: 'services.standard.saonaTour.full',
    basePrice: 85,
    priceUnit: 'services.priceUnits.perPerson',
    category: 'tours',
    packageType: ['standard'],
    imageUrl: '/img/saona.jpeg',
    duration: 8, // Full day (8 hours)
    bookingDuration: {
      min: 1,
      max: 1,
      unit: 'days',
    },
    options: {
      groupSize: {
        id: 'groupSize',
        nameKey: 'services.saonaTour.options.groupSize.title',
        subOptions: {
          small: {
            id: 'small',
            nameKey: 'services.saonaTour.options.groupSize.options.small',
            descriptionKey:
              'services.saonaTour.options.groupSize.options.smallDescription',
            price: 0,
          },
          medium: {
            id: 'medium',
            nameKey: 'services.saonaTour.options.groupSize.options.medium',
            descriptionKey:
              'services.saonaTour.options.groupSize.options.mediumDescription',
            price: -5, // Small discount per person for larger group
          },
          large: {
            id: 'large',
            nameKey: 'services.saonaTour.options.groupSize.options.large',
            descriptionKey:
              'services.saonaTour.options.groupSize.options.largeDescription',
            price: -10, // Larger discount per person for largest group
          },
        },
      },
    },
    includes: [
      'services.saonaTour.includes.1', // Tour guide
      'services.saonaTour.includes.2', // Round-trip transportation
      'services.saonaTour.includes.3', // Catamaran ride
      'services.saonaTour.includes.4', // Buffet lunch
      'services.saonaTour.includes.5', // Open bar
      'services.saonaTour.includes.6', // Entertainment
    ],
    whatToBring: [
      'services.saonaTour.whatToBring.1', // Towel
      'services.saonaTour.whatToBring.2', // Sunscreen
      'services.saonaTour.whatToBring.3', // Swimwear
      'services.saonaTour.whatToBring.4', // Camera
      'services.saonaTour.whatToBring.5', // Cash
    ],
    itinerary: [
      'services.saonaTour.itinerary.1', // Pickup from villa
      'services.saonaTour.itinerary.2', // Transfer to Bayahibe
      'services.saonaTour.itinerary.3', // Boat ride to Natural Pool
      'services.saonaTour.itinerary.4', // Visit to Saona Island
      'services.saonaTour.itinerary.5', // Return trip by catamaran
      'services.saonaTour.itinerary.6', // Drop-off at villa
    ],
    specialRender: 'special',
    relatedServices: [
      SERVICE_IDS.PRIVATE_CATAMARAN,
      SERVICE_IDS.DEEP_SEA_FISHING,
    ],
    tags: ['tour', 'island', 'boat', 'beach', 'swimming'],
    metaData: {
      pickupTime: '7:30 AM',
      maxPeople: 20,
      mealIncluded: true,
      openBar: true,
      snorkelingIncluded: true,
    },
  },

  // KARAOKE SERVICE
  [SERVICE_IDS.KARAOKE]: {
    id: SERVICE_IDS.KARAOKE,
    titleKey: 'services.standard.karaoke.name',
    descriptionKey: 'services.standard.karaoke.description',
    fullDescriptionKey: 'services.standard.karaoke.full',
    basePrice: 120,
    priceUnit: 'services.priceUnits.perSession',
    category: 'leisure',
    packageType: ['standard'],
    imageUrl:
      'https://production-media-prisoner-of-payload.s3.amazonaws.com/media/Lucky-Voice-2021-Adults-Edited-AntTran-1935%20RESIZED-4-1920x1440.jpg',
    duration: 3,
    bookingDuration: {
      min: 2,
      max: 5,
      unit: 'hours',
    },
    options: {
      setupType: {
        id: 'setupType',
        nameKey: 'services.karaoke.options.setupType.title',
        subOptions: {
          basic: {
            id: 'basic',
            nameKey: 'services.karaoke.options.setupType.options.basic',
            price: 0,
          },
        },
      },
      hostIncluded: {
        id: 'hostIncluded',
        nameKey: 'services.karaoke.options.hostIncluded.title',
        subOptions: {
          yes: {
            id: 'yes',
            nameKey: 'services.karaoke.options.hostIncluded.options.yes',
            price: 40,
          },
          no: {
            id: 'no',
            nameKey: 'services.karaoke.options.hostIncluded.options.no',
            price: 0,
          },
        },
      },
    },
    additionalInfoKeys: [
      'services.karaoke.additionalInfo.1',
      'services.karaoke.additionalInfo.2',
    ],
    specialRender: 'karaoke',
    includes: [
      'services.karaoke.includes.1',
      'services.karaoke.includes.2',
      'services.karaoke.includes.3',
      'services.karaoke.includes.4',
    ],
    notIncluded: ['services.karaoke.notIncluded.1'],
    itinerary: [
      'services.karaoke.itinerary.1',
      'services.karaoke.itinerary.2',
      'services.karaoke.itinerary.3',
      'services.karaoke.itinerary.4',
    ],
    disclaimer: 'services.karaoke.disclaimer',
    tags: ['entertainment', 'party', 'music'],
    metaData: {
      songsAvailable: 5000,
      languages: 'english,spanish,italian,french',
      equipmentIncluded: 'microphones,speakers,screen,lights',
    },
  },

  // PERSONAL_TRAINER SERVICE
  [SERVICE_IDS.PERSONAL_TRAINER]: {
    id: SERVICE_IDS.PERSONAL_TRAINER,
    titleKey: 'services.standard.personalTraining.name',
    descriptionKey: 'services.standard.personalTraining.short',
    fullDescriptionKey: 'services.standard.personalTraining.full',
    basePrice: 80,
    priceUnit: 'services.priceUnits.perSession',
    category: 'wellness',
    packageType: ['standard'],
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: 1,
    bookingDuration: {
      min: 1,
      max: 5,
      unit: 'hours',
    },
    options: {
      trainingType: {
        id: 'trainingType',
        nameKey: 'services.personalTraining.options.trainingType.title',
        subOptions: {
          strength: {
            id: 'strength',
            nameKey:
              'services.personalTraining.options.trainingType.options.strength',
            price: 0,
          },
          hiit: {
            id: 'hiit',
            nameKey:
              'services.personalTraining.options.trainingType.options.hiit',
            price: 0,
          },
          functional: {
            id: 'functional',
            nameKey:
              'services.personalTraining.options.trainingType.options.functional',
            price: 0,
          },
          flexibility: {
            id: 'flexibility',
            nameKey:
              'services.personalTraining.options.trainingType.options.flexibility',
            price: -10,
          },
          prenatal: {
            id: 'prenatal',
            nameKey:
              'services.personalTraining.options.trainingType.options.prenatal',
            price: 15,
          },
          cardioKickboxing: {
            id: 'cardioKickboxing',
            nameKey:
              'services.personalTraining.options.trainingType.options.cardioKickboxing',
            price: 10,
          },
        },
      },
      location: {
        id: 'location',
        nameKey: 'services.personalTraining.options.location.title',
        subOptions: {
          villa: {
            id: 'villa',
            nameKey: 'services.personalTraining.options.location.options.villa',
            price: 0,
          },
          resortGym: {
            id: 'resortGym',
            nameKey:
              'services.personalTraining.options.location.options.resortGym',
            price: 0,
          },
          beachside: {
            id: 'beachside',
            nameKey:
              'services.personalTraining.options.location.options.beachside',
            price: 20,
          },
        },
      },
    },
    additionalInfoKeys: [
      'services.personalTraining.additionalInfo.1',
      'services.personalTraining.additionalInfo.2',
      'services.personalTraining.additionalInfo.3',
    ],
    specialRender: 'personalTraining',
    relatedServices: [SERVICE_IDS.YOGA],
    tags: ['wellness', 'fitness', 'personal', 'training'],
    availability: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      hoursOfDay: [6, 7, 8, 9, 10, 16, 17, 18, 19],
    },
    metaData: {
      equipmentProvided: true,
      languages: 'english,spanish',
      experienceLevel: 'beginner,intermediate,advanced',
      sessionDuration: 60,
      agePolicy: '16+',
      adaptable: true,
      certifiedTrainers: true,
      customWorkoutPlan: true,
      disclaimer: 'services.personalTraining.disclaimer',
    },
  },

  // AIRPORT TRANSFERS
  [SERVICE_IDS.AIRPORT_TRANSFER]: {
    id: SERVICE_IDS.AIRPORT_TRANSFER,
    titleKey: 'services.standard.airportTransfers.name',
    descriptionKey: 'services.standard.airportTransfers.description',
    fullDescriptionKey: 'services.standard.airportTransfers.full',
    basePrice: 40, // Updated base price for standard van (1-6 people)
    priceUnit: 'services.priceUnits.perTrip',
    category: 'transportation',
    packageType: ['standard'],
    imageUrl:
      'https://denomades.imgix.net/destinos/santiago/8/vehiculo-transporte-pasajeros.jpg?w=907&h=494&fit=crop&q=100&auto=format,compress&fm=webp',
    duration: 1,
    specialRender: 'airport',
    options: {
      vehicleType: {
        id: 'vehicleType',
        nameKey: 'services.airportTransfer.options.vehicleType.title',
        subOptions: {
          vanSmall: {
            id: 'vanSmall',
            nameKey:
              'services.airportTransfer.options.vehicleType.options.vanSmall',
            price: 0, // Base price $40
            descriptionKey:
              'services.airportTransfer.options.vehicleType.options.vanSmallDesc',
            capacityInfo: {
              min: 1,
              max: 6,
              price: 40,
            },
          },
          vanMedium: {
            id: 'vanMedium',
            nameKey:
              'services.airportTransfer.options.vehicleType.options.vanMedium',
            price: 25, // $65 total
            descriptionKey:
              'services.airportTransfer.options.vehicleType.options.vanMediumDesc',
            capacityInfo: {
              min: 7,
              max: 10,
              price: 65,
            },
          },
          vanLarge: {
            id: 'vanLarge',
            nameKey:
              'services.airportTransfer.options.vehicleType.options.vanLarge',
            price: 35, // $75 total
            descriptionKey:
              'services.airportTransfer.options.vehicleType.options.vanLargeDesc',
            capacityInfo: {
              min: 11,
              max: 16,
              price: 75,
            },
          },
          suv: {
            id: 'suv',
            nameKey: 'services.airportTransfer.options.vehicleType.options.suv',
            price: 30, // $70 total
            descriptionKey:
              'services.airportTransfer.options.vehicleType.options.suvDesc',
            capacityInfo: {
              min: 1,
              max: 6,
              price: 70,
            },
          },
        },
      },
      isRoundTrip: {
        id: 'isRoundTrip',
        nameKey: 'services.airportTransfer.options.isRoundTrip.title',
        subOptions: {
          oneWay: {
            id: 'oneWay',
            nameKey:
              'services.airportTransfer.options.isRoundTrip.options.oneWay',
            price: 0,
          },
          roundTrip: {
            id: 'roundTrip',
            nameKey:
              'services.airportTransfer.options.isRoundTrip.options.roundTrip',
            price: 'double', // Special indicator to double the base price
          },
        },
      },
    },
    includes: [
      'services.airportTransfer.includes.1',
      'services.airportTransfer.includes.2',
      'services.airportTransfer.includes.3',
      'services.airportTransfer.includes.4',
    ],
    notIncluded: ['services.airportTransfer.notIncluded.1'],
    itinerary: [
      'services.airportTransfer.itinerary.1',
      'services.airportTransfer.itinerary.2',
      'services.airportTransfer.itinerary.3',
      'services.airportTransfer.itinerary.4',
    ],
    relatedServices: [SERVICE_IDS.GOLF_CART],
    tags: ['transport', 'airport'],
    metaData: {
      travelTime: '20-40 min',
      availability: '24/7',
      flightTracking: true,
      childSeats: true,
      providerChoice: true,
      providers: ['Provider 1', 'Provider 2'],
    },
  },

  // [SERVICE_IDS.GROCERY]: {
  //   id: SERVICE_IDS.GROCERY,
  //   titleKey: 'services.standard.groceryShopping.name',
  //   descriptionKey: 'services.standard.groceryShopping.description',
  //   fullDescriptionKey: 'services.standard.groceryShopping.full',
  //   basePrice: 50, // Adjust as needed
  //   priceUnit: 'services.priceUnits.perService',
  //   category: 'leisure',
  //   packageType: ['standard'],
  //   imageUrl:
  //     'https://plus.unsplash.com/premium_photo-1661381001052-2f5327899acd?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //   duration: 0,
  //   specialRender: 'grocery', // Indicates special rendering is needed
  //   isPopular: false,
  //   // Add other standard service properties as needed
  //   tags: ['convenience', 'food', 'shopping'],
  //   metaData: {
  //     deliveryTime: '24-48 hours',
  //     minimumOrder: '$50',
  //   },
  // },

  // BABYSITTER SERVICE
  [SERVICE_IDS.BABYSITTER]: {
    id: SERVICE_IDS.BABYSITTER,
    titleKey: 'services.standard.babysitter.name',
    descriptionKey: 'services.standard.babysitter.description',
    fullDescriptionKey: 'services.standard.babysitter.full',
    basePrice: 20,
    priceUnit: 'services.priceUnits.perHour',
    category: 'leisure',
    packageType: ['standard'],
    imageUrl:
      'https://www.ymcalouisville.org/sites/default/files/styles/medium_landscape_4x3/public/2021-11/baby-sitter-training-2.jpg?h=140c1f52&itok=Xyr5JUxS',
    duration: 1,
    specialRender: 'babysitter',
    bookingDuration: {
      min: 3,
      max: 12,
      unit: 'hours',
    },
    options: {
      timeSlot: {
        id: 'timeSlot',
        nameKey: 'services.babysitter.options.timeSlot.title',
        subOptions: {
          daytime: {
            id: 'daytime',
            nameKey: 'services.babysitter.options.timeSlot.options.daytime',
            price: 0,
          },
          evening: {
            id: 'evening',
            nameKey: 'services.babysitter.options.timeSlot.options.evening',
            price: 5,
          },
          overnight: {
            id: 'overnight',
            nameKey: 'services.babysitter.options.timeSlot.options.overnight',
            price: 15,
          },
        },
      },
      childCount: {
        id: 'childCount',
        nameKey: 'services.babysitter.options.childCount.title',
        subOptions: {
          one: {
            id: 'one',
            nameKey: 'services.babysitter.options.childCount.options.one',
            price: 0,
          },
          two: {
            id: 'two',
            nameKey: 'services.babysitter.options.childCount.options.two',
            price: 10,
          },
          threePlus: {
            id: 'threePlus',
            nameKey: 'services.babysitter.options.childCount.options.threePlus',
            price: 25,
          },
        },
      },
    },
    includes: [
      'services.babysitter.includes.1',
      'services.babysitter.includes.2',
      'services.babysitter.includes.3',
      'services.babysitter.includes.4',
    ],
    notIncluded: ['services.babysitter.notIncluded.1'],
    itinerary: [
      'services.babysitter.itinerary.1',
      'services.babysitter.itinerary.2',
      'services.babysitter.itinerary.3',
      'services.babysitter.itinerary.4',
    ],
    tags: ['childcare', 'family'],
    metaData: {
      minimumBooking: '3 hours',
      ageRange: '6 months to 12 years',
      safetyStandards: 'CPR-trained,First-aid certified,Background-checked',
      availability: 'Day & evening; overnight upon request',
    },
  },

  // CUSTOM DECORATIONS SERVICE
  [SERVICE_IDS.CUSTOM_DECORATIONS]: {
    id: SERVICE_IDS.CUSTOM_DECORATIONS,
    titleKey: 'services.standard.customDecorations.name',
    descriptionKey: 'services.standard.customDecorations.description',
    fullDescriptionKey: 'services.standard.customDecorations.full',
    basePrice: 150,
    priceUnit: 'services.priceUnits.perSetup',
    category: 'leisure',
    packageType: ['standard'],
    imageUrl:
      'https://images.unsplash.com/photo-1604668915840-580c30026e5f?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: 0, // No tiene duración específica
    specialRender: 'decorations',
    bookingDuration: {
      min: 1,
      max: 1,
      unit: 'setups',
    },
    options: {
      decorationType: {
        id: 'decorationType',
        nameKey: 'services.customDecorations.options.decorationType.title',
        subOptions: {
          romantic: {
            id: 'romantic',
            nameKey:
              'services.customDecorations.options.decorationType.options.romantic',
            price: 0,
          },
          birthday: {
            id: 'birthday',
            nameKey:
              'services.customDecorations.options.decorationType.options.birthday',
            price: 25,
          },
          balloonGarlands: {
            id: 'balloonGarlands',
            nameKey:
              'services.customDecorations.options.decorationType.options.balloonGarlands',
            price: 35,
          },
          beachPicnic: {
            id: 'beachPicnic',
            nameKey:
              'services.customDecorations.options.decorationType.options.beachPicnic',
            price: 50,
          },
          kidsParty: {
            id: 'kidsParty',
            nameKey:
              'services.customDecorations.options.decorationType.options.kidsParty',
            price: 45,
          },
          luxuryDining: {
            id: 'luxuryDining',
            nameKey:
              'services.customDecorations.options.decorationType.options.luxuryDining',
            price: 75,
          },
        },
      },
      extras: {
        id: 'extras',
        nameKey: 'services.customDecorations.options.extras.title',
        subOptions: {
          none: {
            id: 'none',
            nameKey: 'services.customDecorations.options.extras.options.none',
            price: 0,
          },
          cake: {
            id: 'cake',
            nameKey: 'services.customDecorations.options.extras.options.cake',
            price: 45,
          },
          flowers: {
            id: 'flowers',
            nameKey:
              'services.customDecorations.options.extras.options.flowers',
            price: 55,
          },
          welcomeSign: {
            id: 'welcomeSign',
            nameKey:
              'services.customDecorations.options.extras.options.welcomeSign',
            price: 25,
          },
        },
      },
    },
    includes: [
      'services.customDecorations.includes.1',
      'services.customDecorations.includes.2',
      'services.customDecorations.includes.3',
      'services.customDecorations.includes.4',
    ],
    notIncluded: ['services.customDecorations.notIncluded.1'],
    itinerary: [
      'services.customDecorations.itinerary.1',
      'services.customDecorations.itinerary.2',
      'services.customDecorations.itinerary.3',
      'services.customDecorations.itinerary.4',
    ],
    disclaimer: 'services.customDecorations.disclaimer',
    relatedServices: [SERVICE_IDS.CHEF, SERVICE_IDS.LIVE_MUSIC],
    tags: ['events', 'celebration', 'decorations', 'birthday', 'romantic'],
    metaData: {
      bookingNotice: '48 hours',
      setupLocation: 'Indoor or outdoor',
      customization: 'High',
    },
  },

  // LIVE MUSIC SERVICE
  [SERVICE_IDS.LIVE_MUSIC]: {
    id: SERVICE_IDS.LIVE_MUSIC,
    titleKey: 'services.standard.liveMusic.name',
    descriptionKey: 'services.standard.liveMusic.description',
    fullDescriptionKey: 'services.standard.liveMusic.full',
    basePrice: 200,
    priceUnit: 'services.priceUnits.perPerformance',
    category: 'leisure',
    packageType: ['standard'],
    imageUrl:
      'https://plus.unsplash.com/premium_photo-1719467541072-7b53ae7e93c4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: 2, // Duración en horas (estándar)
    specialRender: 'music',
    bookingDuration: {
      min: 1,
      max: 4,
      unit: 'hours',
    },
    options: {
      performerType: {
        id: 'performerType',
        nameKey: 'services.liveMusic.options.performerType.title',
        subOptions: {
          soloist: {
            id: 'soloist',
            nameKey: 'services.liveMusic.options.performerType.options.soloist',
            price: 0,
          },
          duo: {
            id: 'duo',
            nameKey: 'services.liveMusic.options.performerType.options.duo',
            price: 100,
          },
          trio: {
            id: 'trio',
            nameKey: 'services.liveMusic.options.performerType.options.trio',
            price: 200,
          },
          quartet: {
            id: 'quartet',
            nameKey: 'services.liveMusic.options.performerType.options.quartet',
            price: 300,
          },
          quintet: {
            id: 'quintet',
            nameKey: 'services.liveMusic.options.performerType.options.quintet',
            price: 400,
          },
        },
      },
      duration: {
        id: 'duration',
        nameKey: 'services.liveMusic.options.duration.title',
        subOptions: {
          standard: {
            id: 'standard',
            nameKey: 'services.liveMusic.options.duration.options.standard',
            descriptionKey:
              'services.liveMusic.options.duration.options.standardDescription',
            price: 0,
          },
          extended: {
            id: 'extended',
            nameKey: 'services.liveMusic.options.duration.options.extended',
            descriptionKey:
              'services.liveMusic.options.duration.options.extendedDescription',
            price: 75,
          },
          fullEvent: {
            id: 'fullEvent',
            nameKey: 'services.liveMusic.options.duration.options.fullEvent',
            descriptionKey:
              'services.liveMusic.options.duration.options.fullEventDescription',
            price: 150,
          },
        },
      },
    },
    includes: [
      'services.liveMusic.includes.1',
      'services.liveMusic.includes.2',
      'services.liveMusic.includes.3',
      'services.liveMusic.includes.4',
    ],
    notIncluded: ['services.liveMusic.notIncluded.1'],
    itinerary: [
      'services.liveMusic.itinerary.1',
      'services.liveMusic.itinerary.2',
      'services.liveMusic.itinerary.3',
      'services.liveMusic.itinerary.4',
    ],
    disclaimer: 'services.liveMusic.disclaimer',
    relatedServices: [SERVICE_IDS.CUSTOM_DECORATIONS, SERVICE_IDS.CHEF],
    tags: ['entertainment', 'music', 'live', 'events', 'celebration'],
    metaData: {
      bookingNotice: '72 hours',
      setupLocation: 'Indoor or outdoor',
      electricityRequired: true,
      standardSessionLength: '60-90 minutes',
    },
  },

  // BIKE_RENTALS SERVICE
  [SERVICE_IDS.BIKE_RENTALS]: {
    id: SERVICE_IDS.BIKE_RENTALS,
    titleKey: 'services.standard.bikeRental.name',
    descriptionKey: 'services.standard.bikeRental.short',
    fullDescriptionKey: 'services.standard.bikeRental.full',
    basePrice: 25,
    priceUnit: 'services.priceUnits.perDay',
    category: 'adventure',
    packageType: ['standard'],
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: 1,
    bookingDuration: {
      min: 1,
      max: 7,
      unit: 'days',
    },
    options: {
      bikeType: {
        id: 'bikeType',
        nameKey: 'services.bikeRental.options.bikeType.title',
        subOptions: {
          beachCruiser: {
            id: 'beachCruiser',
            nameKey:
              'services.bikeRental.options.bikeType.options.beachCruiser',
            price: 0,
          },
          cityBike: {
            id: 'cityBike',
            nameKey: 'services.bikeRental.options.bikeType.options.cityBike',
            price: 5,
          },
          mountainBike: {
            id: 'mountainBike',
            nameKey:
              'services.bikeRental.options.bikeType.options.mountainBike',
            price: 10,
          },
          eBike: {
            id: 'eBike',
            nameKey: 'services.bikeRental.options.bikeType.options.eBike',
            price: 20,
          },
        },
      },
      rentalDuration: {
        id: 'rentalDuration',
        nameKey: 'services.bikeRental.options.rentalDuration.title',
        subOptions: {
          halfDay: {
            id: 'halfDay',
            nameKey:
              'services.bikeRental.options.rentalDuration.options.halfDay',
            price: -10,
          },
          fullDay: {
            id: 'fullDay',
            nameKey:
              'services.bikeRental.options.rentalDuration.options.fullDay',
            price: 0,
          },
          twoDays: {
            id: 'twoDays',
            nameKey:
              'services.bikeRental.options.rentalDuration.options.twoDays',
            price: 20,
          },
          weekly: {
            id: 'weekly',
            nameKey:
              'services.bikeRental.options.rentalDuration.options.weekly',
            price: 100,
          },
        },
      },
    },
    additionalInfoKeys: [
      'services.bikeRental.additionalInfo.1',
      'services.bikeRental.additionalInfo.2',
      'services.bikeRental.additionalInfo.3',
    ],
    specialRender: 'bikeRental',
    relatedServices: [],
    tags: ['adventure', 'exploration', 'outdoor', 'cycling'],
    availability: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      hoursOfDay: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    },
    metaData: {
      deliveryIncluded: true,
      pickupIncluded: true,
      helmetIncluded: true,
      lockIncluded: true,
      support24h: true,
      deliveryZone: 'Punta Cana area',
      childrenBikesAvailable: true,
      maintenanceStandard: 'highest',
      languages: 'english,spanish',
      disclaimer: 'services.bikeRental.disclaimer',
    },
  },

  // Premium services section
  // LUXE YACHT
  [SERVICE_IDS.LUXE_YACHT]: {
    id: SERVICE_IDS.LUXE_YACHT,
    titleKey: 'services.premium.luxeYacht.name',
    descriptionKey: 'services.premium.luxeYacht.description',
    fullDescriptionKey: 'services.premium.luxeYacht.full',
    basePrice: 1500,
    priceUnit: 'services.priceUnits.perDay',
    category: 'water-activities',
    packageType: ['premium'],
    imageUrl: '/img/yacht.jpg',
    duration: 8,
    isPopular: true,
    bookingDuration: {
      min: 1,
      max: 2,
      unit: 'days',
    },
    options: {
      menuOption: {
        id: 'menuOption',
        nameKey: 'services.luxeYacht.options.menuOption.title',
        subOptions: {
          classic1: {
            id: 'classic1',
            nameKey: 'services.luxeYacht.options.menuOption.options.classic1',
            price: 0,
          },
          classic2: {
            id: 'classic2',
            nameKey: 'services.luxeYacht.options.menuOption.options.classic2',
            price: 100,
          },
          premium: {
            id: 'premium',
            nameKey: 'services.luxeYacht.options.menuOption.options.premium',
            price: 300,
          },
        },
      },
      duration: {
        id: 'duration',
        nameKey: 'services.luxeYacht.options.duration.title',
        subOptions: {
          halfDay: {
            id: 'halfDay',
            nameKey: 'services.luxeYacht.options.duration.options.halfDay',
            price: -500,
          },
          fullDay: {
            id: 'fullDay',
            nameKey: 'services.luxeYacht.options.duration.options.fullDay',
            price: 0,
          },
        },
      },
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

  // Add additional premium services as needed
  [SERVICE_IDS.LUXE_YOGA]: {
    id: SERVICE_IDS.LUXE_YOGA,
    titleKey: 'services.premium.luxeYoga.name',
    descriptionKey: 'services.premium.luxeYoga.description',
    fullDescriptionKey: 'services.premium.luxeYoga.full',
    basePrice: 120,
    priceUnit: 'services.priceUnits.perSession',
    category: 'wellness',
    packageType: ['premium'],
    imageUrl:
      'https://www.guardian.in/cdn/shop/articles/yoga-asans-for-weight-loss.jpg?v=1705486602&width=1000',
    duration: 1.5,
    bookingDuration: {
      min: 1,
      max: 7,
      unit: 'hours',
    },
    options: {
      yogaStyle: {
        id: 'yogaStyle',
        nameKey: 'services.luxeYoga.options.yogaStyle.title',
        subOptions: {
          hatha: {
            id: 'hatha',
            nameKey: 'services.luxeYoga.options.yogaStyle.options.hatha',
            price: 0,
          },
          vinyasa: {
            id: 'vinyasa',
            nameKey: 'services.luxeYoga.options.yogaStyle.options.vinyasa',
            price: 0,
          },
          aerial: {
            id: 'aerial',
            nameKey: 'services.luxeYoga.options.yogaStyle.options.aerial',
            price: 50,
          },
          couples: {
            id: 'couples',
            nameKey: 'services.luxeYoga.options.yogaStyle.options.couples',
            price: 80,
          },
        },
      },
      location: {
        id: 'location',
        nameKey: 'services.luxeYoga.options.location.title',
        subOptions: {
          beach: {
            id: 'beach',
            nameKey: 'services.luxeYoga.options.location.options.beach',
            price: 30,
          },
          pool: {
            id: 'pool',
            nameKey: 'services.luxeYoga.options.location.options.pool',
            price: 0,
          },
          indoors: {
            id: 'indoors',
            nameKey: 'services.luxeYoga.options.location.options.indoors',
            price: 0,
          },
        },
      },
    },
    specialRender: 'yoga',
    includes: [
      'services.luxeYoga.includes.1',
      'services.luxeYoga.includes.2',
      'services.luxeYoga.includes.3',
    ],
    relatedServices: [SERVICE_IDS.LUXE_FITNESS, SERVICE_IDS.LUXE_MASSEUSE],
    tags: ['wellness', 'fitness', 'premium', 'relaxation'],
    metaData: {
      equipmentProvided: true,
      languages: 'english,spanish,french',
      experienceLevel: 'beginner,intermediate,advanced',
      yogaStyles: ['hatha', 'vinyasa', 'power', 'aerial', 'meditation'],
      refreshmentsIncluded: true,
    },
  },

  [SERVICE_IDS.PRIVATE_CATAMARAN]: {
    id: SERVICE_IDS.PRIVATE_CATAMARAN,
    titleKey: 'services.standard.privateCatamaran.name',
    descriptionKey: 'services.standard.privateCatamaran.short',
    fullDescriptionKey: 'services.standard.privateCatamaran.full',
    basePrice: 450,
    priceUnit: 'services.priceUnits.perTrip',
    category: 'water-activities',
    packageType: ['standard'],
    imageUrl:
      'https://moonshadow-tqc.com.au/wp-content/uploads/sites/5204/2022/01/MSTQC-Boats-slide-into-clear-waters.png?resize=360%2C240&zoom=2',
    duration: 3,
    bookingDuration: {
      min: 3,
      max: 6,
      unit: 'hours',
    },
    options: {
      catering: {
        id: 'catering',
        nameKey: 'services.privateCatamaran.options.catering.title',
        subOptions: {
          standard: {
            id: 'standard',
            nameKey:
              'services.privateCatamaran.options.catering.options.standard',
            price: 0,
          },
          premium: {
            id: 'premium',
            nameKey:
              'services.privateCatamaran.options.catering.options.premium',
            price: 150,
          },
        },
      },
      openBar: {
        id: 'openBar',
        nameKey: 'services.privateCatamaran.options.openBar.title',
        subOptions: {
          soft: {
            id: 'soft',
            nameKey: 'services.privateCatamaran.options.openBar.options.soft',
            price: 0,
          },
          standard: {
            id: 'standard',
            nameKey:
              'services.privateCatamaran.options.openBar.options.standard',
            price: 100,
          },
          premium: {
            id: 'premium',
            nameKey:
              'services.privateCatamaran.options.openBar.options.premium',
            price: 200,
          },
        },
      },
    },
    specialRender: 'special',
    includes: [
      'services.privateCatamaran.includes.1',
      'services.privateCatamaran.includes.2',
      'services.privateCatamaran.includes.3',
    ],
    relatedServices: [SERVICE_IDS.CATAMARAN, SERVICE_IDS.PRIVATE_YACHT],
    tags: ['water', 'activity', 'group'],
    metaData: {
      capacity: '20 people',
      waterSlide: true,
      snorkelIncluded: true,
      privateGroup: true,
    },
  },

  // Add more services as needed
};

/**
 * Gets the service data by ID
 * @param id The ID of the service
 * @returns The service data for the specified ID, or undefined if not found
 */
export function getServiceDataById(id: string): ServiceData | undefined {
  return SERVICES_DATA[id as ServiceId];
}

/**
 * Gets all service data as an array
 * @returns An array of all service data
 */
export function getAllServiceData(): ServiceData[] {
  return Object.values(SERVICES_DATA);
}

/**
 * Gets all service data for a specific category
 * @param category The category to filter by
 * @returns An array of service data for the specified category
 */
export function getServiceDataByCategory(
  category: ServiceCategory
): ServiceData[] {
  return Object.values(SERVICES_DATA).filter(
    (service) => service.category === category
  );
}

/**
 * Gets all service data for a specific package type
 * @param packageType The package type to filter by
 * @returns An array of service data for the specified package type
 */
export function getServiceDataByPackageType(
  packageType: PackageType
): ServiceData[] {
  return Object.values(SERVICES_DATA).filter((service) =>
    service.packageType.includes(packageType)
  );
}

/**
 * Gets all popular service data
 * @returns An array of popular service data
 */
export function getPopularServiceData(): ServiceData[] {
  return Object.values(SERVICES_DATA).filter((service) => service.isPopular);
}

/**
 * Gets related service data for a specific service
 * @param serviceId The ID of the service
 * @param limit The maximum number of related services to return
 * @returns An array of related service data
 */
export function getRelatedServiceData(
  serviceId: string,
  limit?: number
): ServiceData[] {
  const service = getServiceDataById(serviceId);
  if (
    !service ||
    !service.relatedServices ||
    service.relatedServices.length === 0
  ) {
    return [];
  }

  let related = service.relatedServices
    .map((id) => getServiceDataById(id))
    .filter((service): service is ServiceData => !!service);

  if (limit && limit > 0 && related.length > limit) {
    related = related.slice(0, limit);
  }

  return related;
}

/**
 * Calculates the price of a service with the selected options
 * @param serviceId The ID of the service
 * @param selectedOptions The selected options for the service
 * @param duration The duration of the service
 * @returns The calculated price
 */
export function calculateServicePrice(
  serviceId: string,
  selectedOptions: Record<string, string>,
  duration: number = 1
): number {
  const service = getServiceDataById(serviceId);
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
