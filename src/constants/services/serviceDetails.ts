import { ServiceExtendedDetails } from '@/types/services';
import { ServiceId, SERVICE_IDS } from './serviceId';

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

  // CUSTOM DECORATIONS SERVICE
  [SERVICE_IDS.CUSTOM_DECORATIONS]: {
    title: 'CREATE A MEMORABLE SETTING',
    description:
      'Transform any space into a celebration with our personalized decoration service. Whether it is a birthday, anniversary, proposal, or a themed family night, we bring your vision to life with elegance, color, and creativity—right at your villa or event space.',
    tagline: 'Your Moment. Your Style.',
    slogan: 'CREATE A MEMORABLE SETTING',
    priceUnit: 'per setup',
    includes: [
      'Custom Design Consultation',
      'Full Setup & Breakdown',
      'Decor Materials & Styling',
      'Lighting (if needed)',
      'Optional Add-ons: Cake, Flowers, Welcome Signs',
    ],
    notIncluded: ['Gratuity (optional, appreciated)'],
    itinerary: [
      'Theme & color palette consultation',
      'On-site setup before your event',
      'Beautiful decor tailored to your occasion',
      'Timely breakdown & clean-up',
    ],
    timeSlots: [
      'Romantic Setups',
      'Birthday Themes',
      'Balloon Garlands',
      'Beach Picnics',
      "Kids' Parties",
      'Luxury Dining Decor',
    ],
    disclaimer: 'Please provide accurate setup location details and timing.',
    details: {
      bookingTime: 'Minimum 48 hours notice required',
      customizationOptions: 'We adapt to space, weather, and personal style',
      extrasAvailable:
        'Photographers, live music, catering & more upon request',
      setupLocation: 'Indoor or outdoor options available',
    },
    fullDescription:
      "Transform any space into a celebration with our personalized decoration service. Whether it is a birthday, anniversary, proposal, or a themed family night, we bring your vision to life with elegance, color, and creativity—right at your villa or event space. From romantic setups to birthday themes, balloon garlands to beach picnics, kids' parties to luxury dining decor, we create magical environments that make your special moments unforgettable.",
    finalMessage:
      'Every celebration deserves a personal touch. We handle every detail so you can focus on enjoying the moment. From cozy to extravagant, we make your setting unforgettable.',
  },

  // LIVE MUSIC SERVICE
  [SERVICE_IDS.LIVE_MUSIC]: {
    title: 'BRING YOUR EVENT TO LIFE',
    description:
      'Create unforgettable memories with live music at your villa, beach gathering, or private event. Whether you want smooth acoustic tunes, tropical beats, or a lively band for dancing, we tailor the vibe perfectly to your occasion.',
    tagline: 'Your Rhythm. Your Celebration.',
    slogan: 'BRING YOUR EVENT TO LIFE',
    priceUnit: 'per performance',
    includes: [
      'Professional Musicians',
      'Personalized Music Selection',
      'Sound Equipment (if needed)',
      'Setup & Breakdown on Site',
      'Coordination with Event Timeline',
    ],
    notIncluded: ['Gratuity (optional, appreciated)'],
    itinerary: [
      'Consultation to select your style and vibe',
      'Musicians arrive early for setup & soundcheck',
      'Live performance during your event',
      'Professional breakdown and departure after performance',
    ],
    timeSlots: ['Soloist', 'Duo', 'Trio', 'Quartet', 'Quintet'],
    disclaimer:
      'Please coordinate music timing with your event planner or villa host to respect local noise policies.',
    details: {
      recommendedBookingTime: 'Minimum 72 hours in advance',
      duration: 'Standard sets of 60–90 minutes (customizable)',
      setupRequirements: 'Electricity access for amplified sets (110V)',
      customization:
        'Special requests for song lists or first dances available',
    },
    fullDescription:
      'Create unforgettable memories with live music at your villa, beach gathering, or private event. Our professional musicians will enhance your celebration with personalized performances ranging from solo acoustic sets to full quintets. Whether you want smooth relaxing tunes for a dinner party, tropical rhythms for a beach day, or a lively ensemble for dancing, we tailor the musical experience to perfectly match your occasion and preferences.',
    finalMessage:
      'Music transforms moments. Our curated performances are designed to enhance your celebration—whether it is a romantic dinner, a family gathering, or a lively party night. Feel the rhythm, dance, and make memories that last forever.',
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

  // SAONA ISLAND TOUR
  [SERVICE_IDS.SAONA_TOUR]: {
    title: 'UNFORGETTABLE SAONA ISLAND EXPERIENCE',
    description:
      'A visit to Saona Island is a must during your stay in the Dominican Republic. Famous for its white sand beaches, crystal-clear turquoise waters, and endless palm trees, this Caribbean paradise offers the perfect escape.',
    fullDescription:
      'A visit to Saona Island is a must during your stay in the Dominican Republic. Famous for its white sand beaches, crystal-clear turquoise waters, and endless palm trees, this Caribbean paradise offers the perfect escape. Your tour begins with pick-up at your villa and transfer to Bayahibe, where you will board a speedboat or catamaran to the island. Along the way, you will stop at the iconic Natural Pool — perfect for swimming and snapping photos in shallow, crystal-clear waters. On Saona Island, enjoy a delicious Dominican buffet lunch, refreshing drinks, and plenty of time to relax on the beach. The return trip is by catamaran, complete with Caribbean music, open bar, and fun entertainment from the crew.',
    tagline: 'Discover Paradise on Earth',
    priceUnit: 'per person',
    schedule: 'Full day tour, approximately 8 hours',
    pickupTime: '7:30 AM',
    includes: [
      'Tour guide',
      'Round-trip transportation from your villa',
      'Catamaran ride',
      'Buffet lunch on the beach',
      'Open bar on the catamaran (beer, water, soda, and rum)',
      'Onboard entertainment and animation',
    ],
    whatToBring: [
      'Towel',
      'Sunscreen',
      'Swimwear',
      'Camera',
      'Cash (for souvenirs or local purchases)',
    ],
    itinerary: [
      'Pick-up from your accommodation',
      'Transfer to Bayahibe',
      'Speedboat ride with stop at the Natural Pool',
      'Arrival and free time at Saona Island',
      'Buffet lunch and relaxation time on the beach',
      'Return trip by catamaran with open bar and entertainment',
      'Drop-off at your accommodation',
    ],
    places: ['Bayahibe', 'Natural Pool', 'Saona Island'],
    details: {
      tourDuration: 'Full day (approximately 8 hours)',
      groupSize: 'Shared excursion with other travelers',
      mealInfo: 'Dominican buffet lunch included',
      boatInfo: 'Combination of speedboat and catamaran',
    },
    disclaimer:
      'Tour schedule may vary slightly depending on weather conditions and total number of participants.',
    finalMessage:
      'Book your Saona Island tour today and experience a Caribbean dream come true! This is one of the most popular excursions in the Dominican Republic for good reason - the stunning natural beauty will leave you with memories to last a lifetime.',
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
