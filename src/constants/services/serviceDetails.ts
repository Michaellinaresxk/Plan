import { ServiceId, SERVICE_IDS } from './serviceId';

/**
 * Interface for extended service details
 * Contains additional information that may be specific to certain service types
 */
export interface ServiceExtendedDetails {
  // Common fields
  title?: string;
  tagline?: string;
  slogan?: string;
  fullDescription?: string;
  description?: string;
  priceUnit?: string;
  includes?: string[];
  notIncluded?: string[];
  whatToBring?: string[];
  itinerary?: string[];
  disclaimer?: string;
  finalMessage?: string;

  // Transportation related
  pickupTime?: string;
  travelTime?: string;

  // Vehicle/vessel related
  size?: string;
  capacity?: string;

  // Schedule related
  schedule?: string;
  timeSlots?: string[];
  availability?: string;

  // Location related
  location?: string;
  places?: string[];

  // Activity options
  menuOptions?: {
    name: string;
    items: string[];
  }[];
  halfDayOption?: {
    available: boolean;
    times?: string[];
    price?: number;
  };
  yogaStyles?: string[];
  openBarOptions?: string[];

  // Child-related services
  ageRange?: string;
  minimumBooking?: string;
  safetyStandards?: string[] | string;

  // Misc
  details?: Record<string, unknown>;
}

/**
 * Centralized repository of additional details for specific services
 */
const SERVICE_EXTENDED_DETAILS: Record<ServiceId, ServiceExtendedDetails> = {
  // YOGA SERVICE
  [SERVICE_IDS.YOGA]: {
    yogaStyles: [
      'Hatha',
      'Vinyasa',
      'Ashtanga',
      'Yin (Stretching)',
      'Restorative',
    ],
    includes: [
      'Yoga Mats',
      'Props & Supports (as needed)',
      'Personalized Guidance from Certified Instructors',
    ],
    notIncluded: ['Gratuity (optional, appreciated)'],
    itinerary: [
      'Instructor arrives & sets the space',
      'Quick welcome and goal discussion',
      'Move, breathe, and flow',
      'Finish with a grounding relaxation',
    ],
    disclaimer:
      'For your safety and peace of mind, we recommend consulting with your physician before beginning any new physical activity—especially if pregnant, recovering from an injury, or managing a health condition. Participation is at your own discretion.',
    tagline: 'Your Space. Your Flow.',
    slogan: 'EXPERIENCE A PERSONALIZED PRACTICE',
    details: {
      overview: {
        duration: '60 minutes',
        meetingPoint: 'Your Vacation Rental',
        cancellations:
          'Cancellations made more than 24 hours before the start time are allowed. However, during the holiday season (Dec 20th - Jan 4th), all bookings are final and non-refundable.',
        age: '9+',
      },
      timeInfo: 'Promptly at the scheduled hour',
      wearInfo: 'Stretch-friendly clothing',
      agePolicy: 'Minors are welcome with adult supervision',
      adaptability: 'Sessions can be adapted for pregnancy or mobility needs',
    },
    finalMessage:
      'Listen to your body. This is your time. Your space. Your pace.',
  },

  // KARAOKE SERVICE
  [SERVICE_IDS.KARAOKE]: {
    timeSlots: [
      'Classic Karaoke',
      'Family-Friendly Sessions',
      'Bachelorette Parties',
      'Throwback Nights',
      'Beach or Terrace Setups',
      'Themed Song Nights',
    ],
    includes: [
      'Professional Karaoke Machine & Speakers',
      'Wireless Microphones',
      'Curated Song Library (English & Spanish)',
      'On-Site Setup & Breakdown',
    ],
    notIncluded: ['Gratuity (optional, appreciated)'],
    itinerary: [
      'Setup team arrives & installs equipment',
      'Quick demo & sound check',
      'Sing your heart out with family or friends',
      'We pack everything up afterward',
    ],
    disclaimer:
      'Please be mindful of villa or resort quiet hours and local noise regulations.',
    tagline: 'Your Voice. Your Stage.',
    slogan: 'SING, LAUGH & MAKE MEMORIES',
    details: {
      recommendedTime: 'Evening sessions from 6 PM – 10 PM',
      spaceNeeded: 'Open living room, terrace, or covered outdoor space',
      powerAccess: 'Standard outlet required (110V)',
      customOptions: ['Add decorations', 'Live DJ'],
    },
  },

  // AIRPORT TRANSFERS
  [SERVICE_IDS.AIRPORT_TRANSFER]: {
    title: 'START YOUR VACATION STRESS-FREE',
    description:
      'Enjoy a seamless and private transfer from the airport to your accommodation in Punta Cana. Skip the lines and crowds—your personal driver will be waiting, ready to welcome you with comfort and efficiency.',
    priceUnit: 'per trip',
    timeSlots: ['Private Van', 'Group Shuttle'],
    travelTime: 'Approx. 20–40 min within Punta Cana zone',
    includes: [
      'Meet & Greet at airport exit',
      'Luggage assistance',
      'Air-conditioned vehicle',
      'Bottled water on board',
    ],
    notIncluded: ['Gratuity (optional, appreciated)'],
    itinerary: [
      'Driver meets you at the arrivals area',
      'Assistance with bags and boarding',
      'Comfortable, direct ride to your destination',
      'Smooth drop-off at your door',
    ],
    safetyStandards: [
      'Flight tracking for delays',
      'Child seats available upon request',
    ],
    availability: '24/7 service with advance reservation',
    disclaimer:
      'To ensure your pickup, please provide accurate flight details.',
    tagline: 'Seamless Transfers. Stress-Free Starts',
  },

  // BABYSITTER SERVICE
  [SERVICE_IDS.BABYSITTER]: {
    priceUnit: 'per hour',
    minimumBooking: 'Minimum 3-hour booking',
    ageRange: '6 months to 12 years',
    safetyStandards: [
      'CPR-trained',
      'First-aid certified',
      'Background-checked',
    ],
    availability: 'Day & evening; overnight upon request',
    includes: [
      'Certified, Background-Checked Caregiver',
      'Age-Appropriate Activities & Games',
      'Snacks & Light Meals (as needed)',
      'Quiet Time Stories & Nap Support',
    ],
    notIncluded: ['Gratuity (optional, appreciated)'],
    itinerary: [
      'Babysitter arrives & greets family',
      "Review children's routines & any special needs",
      'Engaging play, meals, and nap support',
      'Parent check-in and smooth handover',
    ],
    timeSlots: [
      'Evening Babysitting',
      'Daytime Supervision',
      'Group Care (siblings)',
      'Overnight Sitting',
    ],
    disclaimer:
      'To guarantee service, please provide accurate ages and any medical or dietary information in advance.',
    fullDescription:
      'Trust our experienced, background-checked babysitters to care for your little ones in the comfort of your villa or resort. Whether you need a few hours of evening respite or full-day childcare, our professionals engage children with safe, age-appropriate activities and attentive supervision.',
    tagline: 'Your Peace of Mind. Their Happiness.',
  },

  // Add details for more services as needed
  [SERVICE_IDS.CHEF]: {
    priceUnit: 'per day',
    includes: [
      'Professional chef',
      'Menu planning consultation',
      'Food preparation',
      'Table service',
      'Kitchen cleanup',
    ],
    notIncluded: [
      'Grocery costs (purchased separately or added to final bill)',
      'Gratuity (recommended: 15-20%)',
    ],
    tagline: 'Your Villa. Your Menu. Your Chef.',
    details: {
      cuisineTypes: [
        'Dominican Traditional',
        'International',
        'Mediterranean',
        'Asian Fusion',
        'Seafood Specialist',
        'Vegetarian/Vegan Options',
      ],
      serviceTypes: [
        'Full-day service',
        'Single meal service',
        'Special event catering',
        'Cooking classes',
      ],
      dietaryAccommodations:
        'We accommodate allergies, intolerances, and preferences with advance notice',
    },
  },

  [SERVICE_IDS.PRIVATE_CATAMARAN]: {
    priceUnit: 'per group',
    includes: [
      'Private catamaran with water slide',
      'Private round-trip transportation from your villa',
      'Snorkeling equipment',
      'Ice, water, and soft drinks',
      'Tropical fruits',
      'Nachos with salsa',
    ],
    openBarOptions: [
      'Mojito',
      'Cuba Libre',
      'Rum Punch',
      'Piña Colada',
      'Gin & Tonic',
      'Vodka with cranberry',
    ],
    places: [
      'Snorkeling area',
      'Natural sandbanks (Natural Pools)',
      'View of the dolphin habitat from the boat',
    ],
    timeSlots: [
      '8:30 AM – 11:30 AM',
      '11:30 AM – 2:30 PM',
      '2:30 PM – 5:30 PM',
    ],
  },

  // Add empty objects for remaining services to prevent errors
  [SERVICE_IDS.GOLF_CART]: {},
  [SERVICE_IDS.BIKE_RENTALS]: {},
  [SERVICE_IDS.PERSONAL_TRAINER]: {},
  [SERVICE_IDS.GROCERY]: {},
  [SERVICE_IDS.HORSEBACK_RIDING]: {},
  [SERVICE_IDS.DEEP_SEA_FISHING]: {},
  [SERVICE_IDS.PRIVATE_FISHING]: {},
  [SERVICE_IDS.LIVE_MUSIC]: {},
  [SERVICE_IDS.CUSTOM_DECORATIONS]: {},
  [SERVICE_IDS.ADVENTURE_EXCURSIONS]: {},
  [SERVICE_IDS.SAONA_TOUR]: {},
  [SERVICE_IDS.LUXE_GOLF_CART]: {},
  [SERVICE_IDS.LUXE_YOGA]: {},
  [SERVICE_IDS.LUXE_FITNESS]: {},
  [SERVICE_IDS.LUXE_EBIKES]: {},
  [SERVICE_IDS.LUXE_YACHT]: {},
  [SERVICE_IDS.PRIVATE_YACHT]: {},
  [SERVICE_IDS.LUXE_CULINARY]: {},
  [SERVICE_IDS.LUXE_MASSEUSE]: {},
  [SERVICE_IDS.LUXE_ARRIVAL]: {},
};

/**
 * Gets extended details for a specific service
 * @param serviceId - The ID of the service
 * @returns The extended details object for the service, or an empty object if not found
 */
export function getServiceExtendedDetails(
  serviceId: string
): ServiceExtendedDetails {
  if (serviceId in SERVICE_EXTENDED_DETAILS) {
    return SERVICE_EXTENDED_DETAILS[serviceId as ServiceId];
  }
  return {};
}

/**
 * Adds or updates extended details for a service
 * Useful for dynamic updates or testing
 * @param serviceId - The ID of the service
 * @param details - The details to add or update
 */
export function updateServiceExtendedDetails(
  serviceId: ServiceId,
  details: ServiceExtendedDetails
): void {
  SERVICE_EXTENDED_DETAILS[serviceId] = {
    ...(SERVICE_EXTENDED_DETAILS[serviceId] || {}),
    ...details,
  };
}
