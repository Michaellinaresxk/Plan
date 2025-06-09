// Complete BF Paradise Spa Services Data
// Based on the actual spa menu information

export const SPA_SERVICES = {
  // ===== MASSAGE SERVICES =====
  massages: [
    {
      id: 'relaxing',
      name: 'Relaxing Massage',
      description:
        'Application of smooth and synchronized movements, ideal for relieve all muscle tensions.',
      category: 'relaxation',
      durations: [
        { duration: 60, price: 120 },
        { duration: 90, price: 140 },
      ],
      emoji: '🌿',
      tags: ['relaxation', 'stress-relief', 'muscle-tension'],
      maxPersons: 2,
      intensity: 'gentle',
      imageUrl:
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
      benefits: [
        'Relieves muscle tensions',
        'Stress reduction',
        'Deep relaxation',
      ],
    },
    {
      id: 'deep',
      name: 'Deep Massage',
      description:
        'Relieves stress, releases muscle tension, improves circulation and joint mobility.',
      category: 'therapeutic',
      durations: [
        { duration: 60, price: 130 },
        { duration: 90, price: 150 },
      ],
      emoji: '💆‍♀️',
      tags: ['therapeutic', 'deep-tissue', 'circulation'],
      maxPersons: 1,
      intensity: 'strong',
      imageUrl:
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop',
      benefits: [
        'Releases muscle tension',
        'Improves circulation',
        'Joint mobility',
      ],
    },
    {
      id: 'sport',
      name: 'Sport Massage',
      description:
        'A technique with pressure treating with stretching to increase the range of motion and release muscle tension.',
      category: 'therapeutic',
      durations: [{ duration: 90, price: 150 }],
      emoji: '🏃‍♂️',
      tags: ['sport', 'athletic', 'stretching', 'range-of-motion'],
      maxPersons: 1,
      intensity: 'strong',
      imageUrl:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      benefits: [
        'Increases range of motion',
        'Athletic recovery',
        'Muscle flexibility',
      ],
    },
    {
      id: 'head',
      name: 'Head Massage',
      description:
        'Cranial sacral technique where the massage is performed on the head, neck and shoulders. Relieves stress and headaches.',
      category: 'therapeutic',
      durations: [
        { duration: 30, price: 50 },
        { duration: 60, price: 100 },
      ],
      emoji: '🧠',
      tags: ['head', 'cranial', 'headache-relief', 'neck'],
      maxPersons: 1,
      intensity: 'gentle',
      imageUrl:
        'https://images.unsplash.com/photo-1559844307-58f3e5c8c12d?w=600&h=400&fit=crop',
      benefits: [
        'Relieves headaches',
        'Stress reduction',
        'Neck tension relief',
      ],
    },
    {
      id: 'foot',
      name: 'Foot Massage',
      description:
        'A manual therapy that stimulates nerve endings through acupressure points with gentle pressure on the feet.',
      category: 'therapeutic',
      durations: [
        { duration: 30, price: 50 },
        { duration: 60, price: 100 },
      ],
      emoji: '🦶',
      tags: ['foot', 'reflexology', 'acupressure', 'nerve-stimulation'],
      maxPersons: 1,
      intensity: 'gentle',
      imageUrl:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
      benefits: ['Nerve stimulation', 'Acupressure therapy', 'Foot relief'],
    },
    {
      id: 'bf-therapy',
      name: 'BF Therapy',
      description:
        'House specialty, ideal for improving and relieving pain in muscles, tendons, bones and joints. Get a special touch from BF.',
      category: 'signature',
      durations: [
        { duration: 60, price: 120 },
        { duration: 90, price: 150 },
      ],
      emoji: '⭐',
      tags: ['signature', 'bf-specialty', 'pain-relief', 'joints'],
      maxPersons: 1,
      intensity: 'medium',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      benefits: ['Pain relief', 'Joint improvement', 'BF special technique'],
    },
    {
      id: 'pregnancy',
      name: 'Pregnancy Massage',
      description:
        'This massage relieves the most common pain during pregnancy. It has a relaxing therapeutic effect that relieves back pain, reduces fluid retention and swelling of the legs and feet.',
      category: 'therapeutic',
      durations: [
        { duration: 60, price: 100 },
        { duration: 90, price: 120 },
      ],
      emoji: '🤱',
      tags: ['pregnancy', 'prenatal', 'back-pain', 'swelling'],
      maxPersons: 1,
      intensity: 'gentle',
      specialRequirements: ['pregnancy-safe'],
      imageUrl:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      benefits: [
        'Relieves pregnancy pain',
        'Reduces swelling',
        'Back pain relief',
      ],
    },
    {
      id: 'thai',
      name: 'Thai Massage',
      description:
        "It is a dry massage technique consisting mainly of assisted stretching and pressure using the therapist's fingers, elbows, forearms, knees and feet.",
      category: 'therapeutic',
      durations: [
        { duration: 60, price: 100 },
        { duration: 90, price: 130 },
      ],
      emoji: '🧘‍♀️',
      tags: ['thai', 'stretching', 'dry-massage', 'traditional'],
      maxPersons: 1,
      intensity: 'medium',
      imageUrl:
        'https://images.unsplash.com/photo-1559844307-58f3e5c8c12d?w=600&h=400&fit=crop',
      benefits: [
        'Assisted stretching',
        'Traditional technique',
        'Flexibility improvement',
      ],
    },
    {
      id: 'instrumental-stone',
      name: 'Instrumental Massage - Stone',
      description:
        'Completely therapeutic treatment, through a combination of rhythmic fluid movements with medium and strong pressures using heated stones.',
      category: 'therapeutic',
      durations: [{ duration: 90, price: 160 }],
      emoji: '🪨',
      tags: ['instrumental', 'stone', 'therapeutic', 'heated-stones'],
      maxPersons: 1,
      intensity: 'strong',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      benefits: [
        'Deep therapeutic treatment',
        'Hot stone therapy',
        'Rhythmic movements',
      ],
    },
    {
      id: 'instrumental-bamboo',
      name: 'Instrumental Massage - Bamboo',
      description:
        'Completely therapeutic treatment, through a combination of rhythmic fluid movements with medium and strong pressures using bamboo tools.',
      category: 'therapeutic',
      durations: [{ duration: 90, price: 160 }],
      emoji: '🎋',
      tags: ['instrumental', 'bamboo', 'therapeutic', 'bamboo-tools'],
      maxPersons: 1,
      intensity: 'strong',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop',
      benefits: ['Bamboo therapy', 'Deep pressure', 'Unique technique'],
    },
    {
      id: 'instrumental-cupping',
      name: 'Instrumental Massage - Cupping',
      description:
        'Completely therapeutic treatment, through a combination of rhythmic fluid movements with medium and strong pressures using cupping therapy.',
      category: 'therapeutic',
      durations: [{ duration: 90, price: 160 }],
      emoji: '🫙',
      tags: ['instrumental', 'cupping', 'therapeutic', 'suction-therapy'],
      maxPersons: 1,
      intensity: 'strong',
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
      benefits: ['Cupping therapy', 'Circulation improvement', 'Toxin release'],
    },
    {
      id: 'lymphatic',
      name: 'Manual Lymphatic Drainage',
      description:
        'Ideal technique for circulatory problems and fluid retention, it helps to drain and eliminate accumulated waste.',
      category: 'therapeutic',
      durations: [{ duration: 90, price: 150 }],
      emoji: '💧',
      tags: ['lymphatic', 'drainage', 'circulation', 'detox'],
      maxPersons: 1,
      intensity: 'gentle',
      imageUrl:
        'https://images.unsplash.com/photo-1559844307-58f3e5c8c12d?w=600&h=400&fit=crop',
      benefits: [
        'Improves circulation',
        'Reduces fluid retention',
        'Detoxification',
      ],
    },
  ],

  // ===== BODY TREATMENTS =====
  bodyTreatments: [
    {
      id: 'facial',
      name: 'Facials',
      description:
        'A special and healthy treatment to maintain the firmness of the skin and the structure of the facial muscles.',
      category: 'beauty',
      durations: [
        { duration: 60, price: 100 },
        { duration: 90, price: 130 },
      ],
      emoji: '✨',
      tags: ['facial', 'skincare', 'anti-aging', 'firmness'],
      maxPersons: 1,
      intensity: 'gentle',
      imageUrl:
        'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=400&fit=crop',
      benefits: ['Skin firmness', 'Facial muscle structure', 'Healthy skin'],
    },
    {
      id: 'body-scrub',
      name: 'Body Scrub',
      description:
        'Natural cleaning that serves to eliminate dead cells accumulated on the skin.',
      category: 'beauty',
      durations: [
        { duration: 30, price: 60 },
        { duration: 60, price: 120 },
      ],
      emoji: '🧴',
      tags: ['exfoliation', 'scrub', 'dead-cells', 'natural'],
      maxPersons: 1,
      intensity: 'gentle',
      imageUrl:
        'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=600&h=400&fit=crop',
      benefits: ['Removes dead cells', 'Natural exfoliation', 'Skin renewal'],
    },
    {
      id: 'body-wrap',
      name: 'Body Wrap',
      description:
        'Ideal treatment to acquire rejuvenating, toning and healthy effects on the skin.',
      category: 'beauty',
      durations: [{ duration: 90, price: 150 }],
      emoji: '🎁',
      tags: ['wrap', 'rejuvenating', 'toning', 'skin-health'],
      maxPersons: 1,
      intensity: 'gentle',
      imageUrl:
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
      benefits: ['Rejuvenating effects', 'Skin toning', 'Healthy skin'],
    },
    {
      id: 'after-sun',
      name: 'After the Sun',
      description:
        'An organic treatment with special care that relieves burns caused to the body by the sun.',
      category: 'therapeutic',
      durations: [{ duration: 60, price: 100 }],
      emoji: '☀️',
      tags: ['after-sun', 'burn-relief', 'organic', 'sun-care'],
      maxPersons: 1,
      intensity: 'gentle',
      imageUrl:
        'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop',
      benefits: ['Sunburn relief', 'Organic treatment', 'Skin recovery'],
    },
  ],

  // ===== BF SALON SERVICES =====
  salonServices: {
    hair: [
      { id: 'blow-dry', name: 'Blow Dry', price: [60, 100], emoji: '💨' },
      { id: 'braids', name: 'Braids', price: [60, 120], emoji: '🎀' },
      { id: 'haircut', name: "Women's Haircut", price: 50, emoji: '✂️' },
      { id: 'ironing', name: 'Hair Ironing', price: 30, emoji: '🔥' },
      { id: 'curls', name: 'Curls', price: [30, 60], emoji: '🌀' },
    ],
    nails: [
      { id: 'manicure', name: 'Manicure', price: 50, emoji: '💅' },
      { id: 'pedicure', name: 'Pedicure', price: 70, emoji: '🦶' },
      { id: 'nail-painting', name: 'Nail Painting', price: 15, emoji: '🎨' },
      { id: 'gel-painting', name: 'Painting with Gel', price: 25, emoji: '✨' },
    ],
    waxing: [
      { id: 'eyebrows', name: 'Eyebrows', price: 15, emoji: '👁️' },
      { id: 'whiskers', name: 'Whiskers', price: 15, emoji: '👄' },
      { id: 'underarms', name: 'Underarms', price: 25, emoji: '💪' },
      { id: 'legs', name: 'Legs', price: 50, emoji: '🦵' },
      { id: 'brazilian', name: 'Brazilian', price: 50, emoji: '🌺' },
      { id: 'back', name: 'Back', price: 50, emoji: '🔙' },
      { id: 'bikini', name: 'Bikini', price: 30, emoji: '👙' },
    ],
  },

  // ===== BF RITUALS (PACKAGES) =====
  rituals: [
    {
      id: 'always-together',
      name: 'Always Together',
      description:
        'Connect and enjoy an experience created for you through an exfoliation, a massage and a charming champagne that will take you to a tropical paradise.',
      duration: 100,
      price: 300,
      category: 'couples',
      emoji: '💕',
      includes: ['Exfoliation', 'Massage', 'Champagne'],
      maxPersons: 2,
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    },
    {
      id: 'for-the-king',
      name: 'For the King',
      description:
        'Grant your body a spa time for your senses to renew. Enjoy an exfoliation, sport massage, facial, pedicure and a delightful wine.',
      duration: 240,
      price: 400,
      category: 'signature',
      emoji: '👑',
      includes: ['Exfoliation', 'Sport Massage', 'Facial', 'Pedicure', 'Wine'],
      maxPersons: 1,
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1559844307-58f3e5c8c12d?w=600&h=400&fit=crop',
    },
    {
      id: 'for-the-queen',
      name: 'For the Queen',
      description:
        'Pamper your body to look and feel beautiful with this combination: exfoliation, relaxing massage, facial, manicure, pedicure, hair drying, and a delicious wine.',
      duration: 240,
      price: 500,
      category: 'signature',
      emoji: '👸',
      includes: [
        'Exfoliation',
        'Relaxing Massage',
        'Facial',
        'Manicure',
        'Pedicure',
        'Hair Drying',
        'Wine',
      ],
      maxPersons: 1,
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=400&fit=crop',
    },
    {
      id: 'in-paradise',
      name: 'In the Paradise',
      description:
        'Escape to paradise with our exclusive four-hand massage that will take you to a deep state of relaxation, combining a splendid massage and a rejuvenating facial.',
      duration: 90,
      price: 200,
      category: 'signature',
      emoji: '🌴',
      includes: ['Four-hand Massage', 'Rejuvenating Facial'],
      maxPersons: 1,
      isPremium: true,
      imageUrl:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
    },
    {
      id: 'under-stars',
      name: 'BF Under the Stars',
      description:
        'Live a magical experience as a couple under the stars, starting at 6 PM with a personalized massage designed to relax and connect, accompanied by a soft wine.',
      duration: 90,
      price: 300,
      category: 'couples',
      emoji: '🌟',
      includes: ['Personalized Massage', 'Wine', 'Starlight Setting'],
      maxPersons: 2,
      isPremium: true,
      timeRestriction: 'Starting at 6 PM',
      imageUrl:
        'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop',
    },
  ],

  // ===== BF KIDS SERVICES =====
  kidsServices: [
    {
      id: 'kids-relaxing',
      name: 'Relaxing Massage',
      duration: 30,
      price: 50,
      category: 'kids',
      emoji: '🧸',
      imageUrl:
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
    },
    {
      id: 'kids-aromatic',
      name: 'Aromatic Massage',
      duration: 60,
      price: 60,
      category: 'kids',
      emoji: '🌸',
      imageUrl:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
    },
    {
      id: 'kids-head',
      name: 'Head Massage',
      duration: 30,
      price: 30,
      category: 'kids',
      emoji: '🧠',
      imageUrl:
        'https://images.unsplash.com/photo-1559844307-58f3e5c8c12d?w=600&h=400&fit=crop',
    },
    {
      id: 'kids-scrub',
      name: 'Body Scrub',
      duration: 30,
      price: 50,
      category: 'kids',
      emoji: '🧴',
      imageUrl:
        'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=600&h=400&fit=crop',
    },
    {
      id: 'kids-chocolate-wrap',
      name: 'Chocolate Body Wrap',
      duration: 30,
      price: 60,
      category: 'kids',
      emoji: '🍫',
      imageUrl:
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
    },
    {
      id: 'kids-facial',
      name: 'Kids Facial',
      duration: 30,
      price: 50,
      category: 'kids',
      emoji: '✨',
      imageUrl:
        'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=400&fit=crop',
    },
    {
      id: 'kids-mani-pedi',
      name: 'Manicure and Pedicure',
      duration: 45,
      price: 50,
      category: 'kids',
      emoji: '💅',
      imageUrl:
        'https://images.unsplash.com/photo-1615720401593-bb0a2c37bb79?w=600&h=400&fit=crop',
    },
  ],
};

// Helper functions for the service factory
export const getServicesByCategory = (category) => {
  switch (category) {
    case 'massage':
      return SPA_SERVICES.massages;
    case 'body-treatments':
      return SPA_SERVICES.bodyTreatments;
    case 'salon':
      return SPA_SERVICES.salonServices;
    case 'rituals':
      return SPA_SERVICES.rituals;
    case 'kids':
      return SPA_SERVICES.kidsServices;
    default:
      return SPA_SERVICES.massages;
  }
};

export const getServiceById = (serviceId, category = 'massage') => {
  const services = getServicesByCategory(category);
  return services.find((service) => service.id === serviceId);
};

export const getAllServices = () => {
  return [
    ...SPA_SERVICES.massages,
    ...SPA_SERVICES.bodyTreatments,
    ...SPA_SERVICES.rituals,
    ...SPA_SERVICES.kidsServices,
  ];
};
