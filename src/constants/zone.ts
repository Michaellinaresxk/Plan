export interface Zone {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  landmarks?: string[];
  isPopular?: boolean;
}

export interface ZonePricing {
  fromZone: string;
  toZone: string;
  basePrice: number;
  estimatedTime: string;
  distance: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Updated zones for Punta Cana area
export const TRANSPORT_ZONES: Zone[] = [
  {
    id: 'punta-cana-center',
    name: 'Punta Cana Center',
    displayName: 'Punta Cana Center',
    description: 'Main tourist area with hotels and resorts',
    landmarks: [
      'Hard Rock Hotel',
      'Bavaro Beach',
      'Downtown Punta Cana',
      'PUJ Airport',
    ],
    isPopular: true,
  },
  {
    id: 'bavaro',
    name: 'Bavaro',
    displayName: 'Bavaro',
    description: 'Beach area with luxury resorts',
    landmarks: ['Bavaro Beach', 'Iberostar', 'Natura Park', 'Melia Caribe'],
    isPopular: true,
  },
  {
    id: 'cap-cana',
    name: 'Cap Cana',
    displayName: 'Cap Cana',
    description: 'Exclusive luxury resort area',
    landmarks: [
      'Marina Cap Cana',
      'Eden Roc',
      'Fishing Lodge',
      'Secrets Cap Cana',
    ],
    isPopular: true,
  },
  {
    id: 'uvero-alto',
    name: 'Uvero Alto',
    displayName: 'Uvero Alto',
    description: 'Northern coast resort area',
    landmarks: [
      'Secrets Royal Beach',
      'Excellence Punta Cana',
      'Grand Palladium',
    ],
    isPopular: false,
  },
  {
    id: 'la-romana',
    name: 'La Romana',
    displayName: 'La Romana',
    description: 'Historic town with cultural attractions',
    landmarks: ['Casa de Campo', 'Altos de Chavón', 'La Romana Airport'],
    isPopular: true,
  },
  {
    id: 'bayahibe',
    name: 'Bayahibe',
    displayName: 'Bayahíbe (Saona Island Port)',
    description: 'Charming fishing village and port for Saona Island',
    landmarks: ['Bayahíbe Beach', 'Saona Ferry Terminal', 'Dominicus Beach'],
    isPopular: true,
  },
  {
    id: 'santo-domingo',
    name: 'Santo Domingo',
    displayName: 'Santo Domingo',
    description: 'Capital city - long distance premium service',
    landmarks: [
      'Colonial Zone',
      'Malecón',
      'Las Americas Airport',
      'Plaza de Armas',
    ],
    isPopular: false,
  },
];

// Complete pricing matrix for all zones
export const ZONE_PRICING_MATRIX: ZonePricing[] = [
  // From Punta Cana Center
  {
    fromZone: 'punta-cana-center',
    toZone: 'bavaro',
    basePrice: 30,
    estimatedTime: '15-20 min',
    distance: '8 km',
    difficulty: 'easy',
  },
  {
    fromZone: 'punta-cana-center',
    toZone: 'cap-cana',
    basePrice: 40,
    estimatedTime: '25-30 min',
    distance: '15 km',
    difficulty: 'easy',
  },
  {
    fromZone: 'punta-cana-center',
    toZone: 'uvero-alto',
    basePrice: 60,
    estimatedTime: '35-45 min',
    distance: '25 km',
    difficulty: 'medium',
  },
  {
    fromZone: 'punta-cana-center',
    toZone: 'la-romana',
    basePrice: 90,
    estimatedTime: '1.5-2 hours',
    distance: '75 km',
    difficulty: 'hard',
  },
  {
    fromZone: 'punta-cana-center',
    toZone: 'bayahibe',
    basePrice: 100,
    estimatedTime: '1.5-2 hours',
    distance: '85 km',
    difficulty: 'hard',
  },
  {
    fromZone: 'punta-cana-center',
    toZone: 'santo-domingo',
    basePrice: 150,
    estimatedTime: '2.5-3 hours',
    distance: '200 km',
    difficulty: 'hard',
  },

  // From Bavaro
  {
    fromZone: 'bavaro',
    toZone: 'cap-cana',
    basePrice: 35,
    estimatedTime: '20-25 min',
    distance: '12 km',
    difficulty: 'easy',
  },
  {
    fromZone: 'bavaro',
    toZone: 'uvero-alto',
    basePrice: 55,
    estimatedTime: '30-40 min',
    distance: '20 km',
    difficulty: 'medium',
  },
  {
    fromZone: 'bavaro',
    toZone: 'la-romana',
    basePrice: 85,
    estimatedTime: '1.5-2 hours',
    distance: '70 km',
    difficulty: 'hard',
  },
  {
    fromZone: 'bavaro',
    toZone: 'bayahibe',
    basePrice: 95,
    estimatedTime: '1.5-2 hours',
    distance: '80 km',
    difficulty: 'hard',
  },
  {
    fromZone: 'bavaro',
    toZone: 'santo-domingo',
    basePrice: 145,
    estimatedTime: '2.5-3 hours',
    distance: '195 km',
    difficulty: 'hard',
  },

  // From Cap Cana
  {
    fromZone: 'cap-cana',
    toZone: 'uvero-alto',
    basePrice: 70,
    estimatedTime: '45-55 min',
    distance: '30 km',
    difficulty: 'medium',
  },
  {
    fromZone: 'cap-cana',
    toZone: 'la-romana',
    basePrice: 75,
    estimatedTime: '1-1.5 hours',
    distance: '45 km',
    difficulty: 'medium',
  },
  {
    fromZone: 'cap-cana',
    toZone: 'bayahibe',
    basePrice: 85,
    estimatedTime: '1-1.5 hours',
    distance: '55 km',
    difficulty: 'medium',
  },
  {
    fromZone: 'cap-cana',
    toZone: 'santo-domingo',
    basePrice: 140,
    estimatedTime: '2.5-3 hours',
    distance: '185 km',
    difficulty: 'hard',
  },

  // From Uvero Alto
  {
    fromZone: 'uvero-alto',
    toZone: 'la-romana',
    basePrice: 95,
    estimatedTime: '1.5-2 hours',
    distance: '60 km',
    difficulty: 'hard',
  },
  {
    fromZone: 'uvero-alto',
    toZone: 'bayahibe',
    basePrice: 105,
    estimatedTime: '1.5-2 hours',
    distance: '70 km',
    difficulty: 'hard',
  },
  {
    fromZone: 'uvero-alto',
    toZone: 'santo-domingo',
    basePrice: 160,
    estimatedTime: '3-3.5 hours',
    distance: '220 km',
    difficulty: 'hard',
  },

  // From La Romana
  {
    fromZone: 'la-romana',
    toZone: 'bayahibe',
    basePrice: 25,
    estimatedTime: '20-30 min',
    distance: '15 km',
    difficulty: 'easy',
  },
  {
    fromZone: 'la-romana',
    toZone: 'santo-domingo',
    basePrice: 110,
    estimatedTime: '2-2.5 hours',
    distance: '110 km',
    difficulty: 'hard',
  },

  // From Bayahíbe to Santo Domingo
  {
    fromZone: 'bayahibe',
    toZone: 'santo-domingo',
    basePrice: 120,
    estimatedTime: '2.5-3 hours',
    distance: '125 km',
    difficulty: 'hard',
  },
];
