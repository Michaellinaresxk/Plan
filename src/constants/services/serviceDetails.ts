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
    gallery: {
      title: 'Experience the Beauty of Catamaran Sailing',
      images: [
        {
          src: '/images/services/catamaran-1.jpg',
          alt: 'Catamaran sailing in crystal clear waters',
          caption: 'Sail through turquoise waters of Punta Cana',
        },
        {
          src: '/images/services/catamaran-2.jpg',
          alt: 'Snorkeling from the catamaran',
          caption: 'Snorkel in pristine coral reefs',
        },
        {
          src: '/images/services/catamaran-3.jpg',
          alt: 'Sunset view from catamaran',
          caption: 'Enjoy spectacular sunsets from the deck',
        },
      ],
    },
    finalMessage:
      'Listen to your body. This is your time. Your space. Your pace.',
  },

  [SERVICE_IDS.GOLF_CART]: {
    title: 'MOVE FREELY. EXPLORE COMFORTABLY.',
    description:
      'Cruise your resort, villa community, or local beach town with our fully charged, comfortable golf carts. Perfect for getting around quickly and easily, our rentals are delivered right to your door—ready to ride.',
    tagline: 'Your Freedom. Your Pace.',
    slogan: 'MOVE FREELY. EXPLORE COMFORTABLY.',
    priceUnit: 'per day',
    includes: [
      'Fully charged battery',
      'Full fuel tank (if applicable)',
      'Free delivery & pickup service',
      'Complete safety equipment',
      '24/7 emergency support hotline',
      'Quick orientation & safety briefing',
    ],
    notIncluded: ['Gratuity (optional, appreciated)'],
    itinerary: [
      'We deliver your golf cart to your location',
      'Quick orientation & safety overview',
      'You drive & enjoy your surroundings',
      'We pick it up at your scheduled time',
    ],
    timeSlots: ['4-Seater Cart', '6-Seater Cart'],
    disclaimer:
      'Drive at your own discretion. Please follow all community or resort rules and respect local driving laws.',
    details: {
      recommendedBookingTime: 'Minimum 24 hours in advance',
      duration: 'Flexible rental periods (1-7 days)',
      setupRequirements: "Valid driver's license (18+ years old)",
      customization:
        'Special delivery locations and additional equipment available',
    },
    fullDescription:
      "Experience the ultimate freedom to explore Punta Cana with our premium golf cart rental service. Choose from comfortable 4-seater carts perfect for couples or small families, or spacious 6-seater models ideal for larger groups. Every cart is delivered fully charged and ready to drive, complete with safety equipment and comprehensive insurance. Our door-to-door service means you can start exploring immediately, whether you're cruising resort grounds, visiting local beaches, or touring villa communities. With 24/7 support and flexible rental periods, we make mobility effortless so you can focus on creating unforgettable memories.",
    gallery: {
      title: 'Experience Premium Golf Cart Mobility',
      images: [
        {
          src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
          alt: 'Luxury golf cart at resort',
          caption: 'Explore resort areas in comfort and style',
        },
        {
          src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          alt: 'Family enjoying golf cart tour',
          caption: 'Perfect for families and groups',
        },
        {
          src: 'https://images.unsplash.com/photo-1612838006830-bf35ed6ba7f6?w=800&h=600&fit=crop',
          alt: 'Golf cart on beach path',
          caption: 'Access beautiful beach and coastal areas',
        },
      ],
    },
    finalMessage:
      'Enjoy the freedom to explore at your own pace. Drive safely and make unforgettable memories discovering the beauty of Punta Cana with complete peace of mind.',
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
    gallery: {
      title: 'Experience the Beauty of Catamaran Sailing',
      images: [
        {
          src: '/images/services/catamaran-1.jpg',
          alt: 'Catamaran sailing in crystal clear waters',
          caption: 'Sail through turquoise waters of Punta Cana',
        },
        {
          src: '/images/services/catamaran-2.jpg',
          alt: 'Snorkeling from the catamaran',
          caption: 'Snorkel in pristine coral reefs',
        },
        {
          src: '/images/services/catamaran-3.jpg',
          alt: 'Sunset view from catamaran',
          caption: 'Enjoy spectacular sunsets from the deck',
        },
      ],
    },
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
    gallery: {
      title: 'Experience the Beauty of Catamaran Sailing',
      images: [
        {
          src: '/images/services/catamaran-1.jpg',
          alt: 'Catamaran sailing in crystal clear waters',
          caption: 'Sail through turquoise waters of Punta Cana',
        },
        {
          src: '/images/services/catamaran-2.jpg',
          alt: 'Snorkeling from the catamaran',
          caption: 'Snorkel in pristine coral reefs',
        },
        {
          src: '/images/services/catamaran-3.jpg',
          alt: 'Sunset view from catamaran',
          caption: 'Enjoy spectacular sunsets from the deck',
        },
      ],
    },
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
    gallery: {
      title: 'Experience the Beauty of Catamaran Sailing',
      images: [
        {
          src: '/images/services/catamaran-1.jpg',
          alt: 'Catamaran sailing in crystal clear waters',
          caption: 'Sail through turquoise waters of Punta Cana',
        },
        {
          src: '/images/services/catamaran-2.jpg',
          alt: 'Snorkeling from the catamaran',
          caption: 'Snorkel in pristine coral reefs',
        },
        {
          src: '/images/services/catamaran-3.jpg',
          alt: 'Sunset view from catamaran',
          caption: 'Enjoy spectacular sunsets from the deck',
        },
      ],
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
    gallery: {
      title: 'Experience the Beauty of Catamaran Sailing',
      images: [
        {
          src: '/images/services/catamaran-1.jpg',
          alt: 'Catamaran sailing in crystal clear waters',
          caption: 'Sail through turquoise waters of Punta Cana',
        },
        {
          src: '/images/services/catamaran-2.jpg',
          alt: 'Snorkeling from the catamaran',
          caption: 'Snorkel in pristine coral reefs',
        },
        {
          src: '/images/services/catamaran-3.jpg',
          alt: 'Sunset view from catamaran',
          caption: 'Enjoy spectacular sunsets from the deck',
        },
      ],
    },
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
    gallery: {
      title: 'Experience the Beauty of Catamaran Sailing',
      images: [
        {
          src: '/images/services/catamaran-1.jpg',
          alt: 'Catamaran sailing in crystal clear waters',
          caption: 'Sail through turquoise waters of Punta Cana',
        },
        {
          src: '/images/services/catamaran-2.jpg',
          alt: 'Snorkeling from the catamaran',
          caption: 'Snorkel in pristine coral reefs',
        },
        {
          src: '/images/services/catamaran-3.jpg',
          alt: 'Sunset view from catamaran',
          caption: 'Enjoy spectacular sunsets from the deck',
        },
      ],
    },
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
    gallery: {
      title: 'Experience the Beauty of Catamaran Sailing',
      images: [
        {
          src: '/images/services/catamaran-1.jpg',
          alt: 'Catamaran sailing in crystal clear waters',
          caption: 'Sail through turquoise waters of Punta Cana',
        },
        {
          src: '/images/services/catamaran-2.jpg',
          alt: 'Snorkeling from the catamaran',
          caption: 'Snorkel in pristine coral reefs',
        },
        {
          src: '/images/services/catamaran-3.jpg',
          alt: 'Sunset view from catamaran',
          caption: 'Enjoy spectacular sunsets from the deck',
        },
      ],
    },
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
    gallery: {
      title: 'Experience the Beauty of Catamaran Sailing',
      images: [
        {
          src: '/images/services/catamaran-1.jpg',
          alt: 'Catamaran sailing in crystal clear waters',
          caption: 'Sail through turquoise waters of Punta Cana',
        },
        {
          src: '/images/services/catamaran-2.jpg',
          alt: 'Snorkeling from the catamaran',
          caption: 'Snorkel in pristine coral reefs',
        },
        {
          src: '/images/services/catamaran-3.jpg',
          alt: 'Sunset view from catamaran',
          caption: 'Enjoy spectacular sunsets from the deck',
        },
      ],
    },
  },

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

  [SERVICE_IDS.PRIVATE_CATAMARAN]: {
    priceUnit: 'per group',
    gallery: {
      title: 'Experience the Beauty of Catamaran Sailing',
      images: [
        {
          src: '/images/services/catamaran-1.jpg',
          alt: 'Catamaran sailing in crystal clear waters',
          caption: 'Sail through turquoise waters of Punta Cana',
        },
        {
          src: '/images/services/catamaran-2.jpg',
          alt: 'Snorkeling from the catamaran',
          caption: 'Snorkel in pristine coral reefs',
        },
        {
          src: '/images/services/catamaran-3.jpg',
          alt: 'Sunset view from catamaran',
          caption: 'Enjoy spectacular sunsets from the deck',
        },
      ],
    },
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

  [SERVICE_IDS.HORSEBACK_RIDING]: {
    priceUnit: 'per person',
    gallery: {
      title: 'Experience the Magic of Horseback Riding in Paradise',
      images: [
        {
          src: '/images/services/horseback-beach-1.jpg',
          alt: 'Horseback riding on pristine Macao Beach',
          caption: 'Gallop along the pristine shores of Macao Beach',
        },
        {
          src: '/images/services/horseback-sunset-2.jpg',
          alt: 'Sunset horseback riding experience',
          caption: 'Magical sunset rides with ocean views',
        },
        {
          src: '/images/services/horseback-river-3.jpg',
          alt: 'Riding through tropical river trails',
          caption: 'Explore crystal-clear rivers on horseback',
        },
        {
          src: '/images/services/horseback-swim-4.jpg',
          alt: 'Swimming with horses in the Caribbean',
          caption: 'Unique experience swimming with your horse',
        },
        {
          src: '/images/services/horseback-group-5.jpg',
          alt: 'Group horseback riding adventure',
          caption: 'Perfect for families and groups of friends',
        },
        {
          src: '/images/services/horseback-trail-6.jpg',
          alt: 'Tropical trail horseback riding',
          caption: 'Journey through lush tropical landscapes',
        },
      ],
    },
    includes: [
      'Round-trip transportation from your hotel or villa',
      'Professional bilingual guide (English/Spanish)',
      'Safety equipment (helmet, instructions)',
      'Horse matched to your riding skill level',
      'Safety briefing and basic riding instruction',
      'Bottled water and refreshments',
      'Beach riding experience',
      'Photo opportunities at scenic spots',
      'Insurance coverage during the activity',
    ],
    ridingExperiences: {
      beginner: [
        'Basic horse handling instruction',
        'Walking pace along the beach',
        'Guided support throughout the ride',
        'Shorter trail options available',
        'Photo stops at calm locations',
      ],
      intermediate: [
        'Trotting on beach sections',
        'Extended trail options',
        'River crossing experience',
        'More independence during ride',
        'Opportunity for controlled cantering',
      ],
      advanced: [
        'Galloping on open beach stretches',
        'Swimming with horses (seasonal)',
        'Challenging trail sections',
        'Minimal guidance needed',
        'Extended ride duration options',
      ],
    },
    places: [
      'Macao Beach - Pristine untouched coastline',
      'Uvero Alto Beach - Remote paradise beach',
      'River Trail - Crystal-clear freshwater crossing',
      'Dominican Countryside - Rural landscapes and farms',
      'Coconut Palm Groves - Shaded tropical trails',
      'Natural Pools - Shallow water areas (tide dependent)',
    ],
    timeSlots: [
      '7:00 AM – 9:00 AM (Sunrise Ride)',
      '9:00 AM – 11:00 AM (Morning Adventure)',
      '11:00 AM – 1:00 PM (Midday Excursion)',
      '2:00 PM – 4:00 PM (Afternoon Journey)',
      '4:30 PM – 6:30 PM (Sunset Romance)',
    ],
    specialExperiences: [
      {
        name: 'Sunrise Beach Ride',
        description:
          'Start your day with a peaceful sunrise ride along the beach',
        price: 85,
        duration: '2 hours',
        highlights: [
          'Golden hour photography',
          'Peaceful atmosphere',
          'Wildlife sightings',
        ],
      },
      {
        name: 'Swim with Horses',
        description: 'Unique experience riding your horse into the ocean',
        price: 110,
        duration: '2.5 hours',
        highlights: [
          'Horse swimming',
          'Waterproof photos included',
          'Advanced riders only',
        ],
      },
      {
        name: 'Romantic Sunset Ride',
        description: 'Perfect for couples - ride into the sunset together',
        price: 95,
        duration: '2 hours',
        highlights: [
          'Champagne toast',
          'Professional photos',
          'Private guide option',
        ],
      },
      {
        name: 'Family Adventure',
        description: 'Family-friendly ride suitable for all ages (5+)',
        price: 65,
        duration: '1.5 hours',
        highlights: ['Shorter distance', 'Extra guides', 'Kid-friendly horses'],
      },
    ],
    requirements: {
      age: {
        minimum: 5,
        note: 'Children under 10 must ride with an adult',
      },
      weight: {
        maximum: 250,
        unit: 'lbs',
        note: 'For the safety and comfort of our horses',
      },
      clothing: [
        'Long pants recommended (jeans ideal)',
        'Closed-toe shoes required (boots preferred)',
        'Comfortable t-shirt',
        'Sunscreen and sunglasses',
        'Swimsuit (for swim experiences)',
      ],
      health: [
        'No back problems or recent surgeries',
        'Not recommended for pregnant women',
        'Moderate physical fitness required',
        'Notify guide of any medical conditions',
      ],
    },
    horseFacts: {
      breed: 'Dominican Criollo & Paso Fino',
      training: 'All horses professionally trained for beach riding',
      care: 'Veterinary certified and well-cared for',
      temperament: 'Gentle and accustomed to beginners',
      names: ['Estrella', 'Thunder', 'Mariposa', 'Champion', 'Luna', 'Sol'],
    },
    duration: {
      standard: '2 hours',
      actual: '1.5 hours riding time',
      total: '3-4 hours including transportation',
    },
    groupSizes: {
      minimum: 1,
      maximum: 20,
      private: {
        available: true,
        minGroup: 6,
        price: 'Contact for pricing',
      },
    },
    bookingPolicies: {
      advance: 'Book at least 24 hours in advance',
      cancellation: 'Free cancellation up to 24 hours before',
      weather: 'Full refund if cancelled due to weather',
      confirmation: 'Instant confirmation upon booking',
      payment: 'Pay 3 days before activity or upon arrival',
    },
    seasonalInfo: {
      bestTime: 'December to April (cooler temperatures)',
      rainySeasonNote: 'May to November - rides continue in light rain',
      swimAvailable: 'Year-round (weather permitting)',
      sunsetTimes: {
        winter: '5:30 PM - 6:00 PM',
        summer: '6:30 PM - 7:30 PM',
      },
    },
    addOns: [
      {
        name: 'Professional Photography Package',
        price: 45,
        includes: ['50+ edited photos', 'Action shots', 'Digital delivery'],
      },
      {
        name: 'Video Documentation',
        price: 65,
        includes: [
          'Drone footage',
          '5-minute edited video',
          'Raw footage included',
        ],
      },
      {
        name: 'Private Guide',
        price: 30,
        includes: [
          'Dedicated guide',
          'Customized route',
          'Extended photo stops',
        ],
      },
      {
        name: 'Romantic Package',
        price: 55,
        includes: ['Decorated horses', 'Champagne', 'Rose petals on beach'],
      },
      {
        name: 'Traditional Lunch',
        price: 25,
        includes: [
          'Dominican cuisine',
          'Fresh tropical fruits',
          'Local beverages',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do I need riding experience?',
        answer:
          'No experience required! Our guides provide basic instruction and match you with a suitable horse.',
      },
      {
        question: 'What if it rains?',
        answer:
          'Light rain enhances the tropical experience! We only cancel for severe weather with full refund.',
      },
      {
        question: 'Can children participate?',
        answer:
          'Yes! Children 5+ can ride. Under 10 must share a horse with an adult.',
      },
      {
        question: 'Are the horses well-treated?',
        answer:
          'Absolutely! Our horses are veterinary certified, well-fed, and work limited hours with rest days.',
      },
      {
        question: 'Can I bring my camera?',
        answer:
          'Yes, but we recommend waterproof cases. Our guides can also take photos for you.',
      },
    ],
    reviews: {
      rating: 4.9,
      totalReviews: 847,
      highlights: [
        'Well-trained horses',
        'Knowledgeable guides',
        'Beautiful beaches',
        'Great for beginners',
        'Unforgettable experience',
      ],
      recentReviews: [
        {
          name: 'Sarah Mitchell',
          date: '2025-07-28',
          rating: 5,
          comment:
            'Absolutely magical! The sunset ride was the highlight of our honeymoon.',
        },
        {
          name: 'Carlos Rodriguez',
          date: '2025-07-25',
          rating: 5,
          comment:
            'Perfect family activity. Kids loved it and felt safe the entire time.',
        },
        {
          name: 'Emma Thompson',
          date: '2025-07-22',
          rating: 5,
          comment:
            'Swimming with the horses was a dream come true! Highly recommend.',
        },
      ],
    },
  },

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

  [SERVICE_IDS.ATV_RIDE_EXCURSION]: {
    priceUnit: 'per group',
    gallery: {
      title: 'Experience the Beauty of Catamaran Sailing',
      images: [
        {
          src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595140/2_fhmcnt.jpg',
          alt: 'Catamaran sailing in crystal clear waters',
          caption: 'Sail through turquoise waters of Punta Cana',
        },
        {
          src: '/images/services/catamaran-2.jpg',
          alt: 'Snorkeling from the catamaran',
          caption: 'Snorkel in pristine coral reefs',
        },
        {
          src: '/images/services/catamaran-3.jpg',
          alt: 'Sunset view from catamaran',
          caption: 'Enjoy spectacular sunsets from the deck',
        },
      ],
    },
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

  // [SERVICE_IDS.GROCERY]: {},
  [SERVICE_IDS.DEEP_SEA_FISHING]: {},
  [SERVICE_IDS.PRIVATE_FISHING]: {},
  [SERVICE_IDS.ADVENTURE_EXCURSIONS]: {},
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
