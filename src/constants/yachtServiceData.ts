import { Service, ServiceData } from '@/types/type';

export const YACHT_SERVICE_DATA: Record<string, ServiceData> = {
  'yacht-charter': {
    id: 'yacht-charter',
    category: 'transportation',
    subcategory: 'luxury-transport',
    metaData: {
      requiresAdvanceBooking: true,
      minAdvanceHours: 24,
      maxGuests: 24,
      duration: 'flexible',
      customFormType: 'yacht',
      hasSubServices: true,
      subServices: [
        {
          id: 'sport-yacht-42',
          name: 'Azimut S7 Sport Yacht',
          basePrice: 2500,
          specifications: {
            length: '68 ft',
            maxGuests: 12,
            category: 'sport',
          },
        },
        {
          id: 'luxury-yacht-85',
          name: 'Princess Y85 Luxury Yacht',
          basePrice: 5500,
          specifications: {
            length: '85 ft',
            maxGuests: 18,
            category: 'luxury',
          },
        },
        {
          id: 'mega-yacht-120',
          name: 'Sunseeker 120 Mega Yacht',
          basePrice: 12000,
          specifications: {
            length: '120 ft',
            maxGuests: 24,
            category: 'mega',
          },
        },
      ],
    },
    faqs: [
      {
        question: 'What is included in the yacht charter?',
        answer:
          'All charters include professional captain and crew, fuel, insurance, safety equipment, basic refreshments, towels, and sound system.',
      },
      {
        question: 'Can we bring our own food and drinks?',
        answer:
          'Yes, you can bring your own food and beverages, or choose from our catering packages for a premium dining experience.',
      },
      {
        question: 'What happens if weather conditions are poor?',
        answer:
          'Safety is our top priority. If weather conditions are unsafe, we will reschedule your charter at no additional cost or provide a full refund.',
      },
      {
        question: 'Do you provide water sports equipment?',
        answer:
          'Basic snorkeling equipment is included. Additional water sports like jet skis, fishing gear, and diving equipment are available for an extra fee.',
      },
      {
        question: 'Is hotel pickup included?',
        answer:
          'Hotel pickup and drop-off service is available for an additional $150 fee. Otherwise, you can meet us at the designated marina.',
      },
    ],
  },
  'luxe-yacht': {
    id: 'luxe-yacht',
    category: 'transportation',
    subcategory: 'luxury-transport',
    metaData: {
      requiresAdvanceBooking: true,
      minAdvanceHours: 48,
      maxGuests: 24,
      duration: 'flexible',
      customFormType: 'yacht',
      hasSubServices: true,
      isPremium: true,
      includedServices: [
        'Professional crew',
        'Michelin-starred chef',
        'Premium open bar',
        'Concierge service',
        'Water sports equipment',
        'Helicopter transfer (mega yachts)',
      ],
    },
  },
};

export const YACHT_SERVICES: Service[] = [
  {
    id: 'yacht-charter',
    name: 'Luxury Yacht Charter',
    price: 2500,
    currency: 'USD',
    description:
      'Experience the Caribbean in ultimate luxury aboard our exclusive fleet of premium yachts. From intimate sport yachts to magnificent mega yachts.',
    packageType: 'standard',
    duration: 'Full Day',
    maxGuests: 24,
    includedItems: [
      'Professional captain and crew',
      'Fuel and insurance',
      'Safety equipment and life jackets',
      'Basic refreshments and water',
      'Towels and basic amenities',
      'Sound system and entertainment',
      'Snorkeling equipment',
    ],
    highlights: [
      'Choose from sport, luxury, or mega yachts',
      'Flexible duration options',
      'Professional crew included',
      'Water sports equipment available',
      'Catering packages available',
      'Hotel pickup service available',
    ],
    categories: ['transportation', 'luxury', 'water-sports'],
    isAvailable: true,
    requiresAdvanceBooking: true,
    customFormType: 'yacht',
  },
  {
    id: 'luxe-yacht',
    name: 'Ultra-Luxury Yacht Experience',
    price: 8500,
    currency: 'USD',
    description:
      'The pinnacle of luxury yachting with world-class amenities, Michelin-starred cuisine, and white-glove service aboard our most exclusive vessels.',
    packageType: 'premium luxury',
    duration: 'Full Day',
    maxGuests: 24,
    includedItems: [
      'Dedicated yacht concierge',
      'Michelin-starred chef and cuisine',
      'Premium open bar with sommelier',
      'Professional crew and captain',
      'All water sports equipment',
      'Helicopter transfers (select yachts)',
      'Spa services on board',
      'Premium linens and amenities',
    ],
    highlights: [
      'Ultra-luxury mega yachts only',
      'Michelin-starred dining experience',
      'Dedicated concierge service',
      'Helicopter transfers available',
      'On-board spa treatments',
      'Premium water sports equipment',
      'Sommelier-curated wine selection',
    ],
    categories: [
      'transportation',
      'luxury',
      'premium',
      'water-sports',
      'dining',
    ],
    isAvailable: true,
    requiresAdvanceBooking: true,
    customFormType: 'yacht',
  },
];
