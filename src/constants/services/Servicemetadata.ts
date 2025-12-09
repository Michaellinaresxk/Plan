import { ServiceId } from './serviceId';

/**
 * Metadatos de servicios para Open Graph
 * Usado para compartir en redes sociales con imagen y descripción
 */

export interface ServiceMetadata {
  id: ServiceId;
  title: string;
  description: string;
  image: string; // URL pública de la imagen
  imageAlt: string;
  keywords: string[];
  duration?: string;
  price?: string;
}

export const SERVICE_METADATA: Record<ServiceId, ServiceMetadata> = {
  // Standard Services
  'yoga-standard': {
    id: 'yoga-standard',
    title: 'Yoga Sessions in Punta Cana | Luxe Punta Cana',
    description:
      'Relax and rejuvenate with our professional yoga sessions. Available for all levels, from beginners to advanced practitioners. Perfect for your wellness vacation.',
    image: '/images/services/yoga-standard-og.jpg',
    imageAlt: 'Yoga session in Punta Cana with ocean view',
    keywords: ['yoga', 'wellness', 'relaxation', 'punta cana'],
    duration: '1.5 - 2 hours',
    price: '$75',
  },

  'atv-excursions': {
    id: 'atv-excursions',
    title: 'ATV Excursions | Adventure Tours Punta Cana',
    description:
      'Experience thrilling ATV rides through the Dominican Republic. Explore natural caves, pristine beaches, and local villages. An unforgettable adventure awaits.',
    image: '/images/services/atv-og.jpg',
    imageAlt: 'ATV adventure through Dominican countryside',
    keywords: ['atv', 'adventure', 'excursion', 'thrill'],
    duration: '4 hours',
    price: '$120',
  },

  'horseback-riding': {
    id: 'horseback-riding',
    title: 'Horseback Riding Tours | Punta Cana Adventures',
    description:
      'Discover the beauty of Punta Cana on horseback. Ride through beaches and countryside with experienced guides. Suitable for all skill levels.',
    image: '/images/services/horseback-riding-og.jpg',
    imageAlt: 'Horseback riding on Punta Cana beach',
    keywords: ['horseback', 'riding', 'beach', 'nature'],
    duration: '2 - 3 hours',
    price: '$85',
  },

  'horseback-sunset': {
    id: 'horseback-sunset',
    title: 'Horseback Sunset Ride | Romantic Punta Cana',
    description:
      'Experience a magical sunset on horseback. The perfect romantic activity with stunning ocean views and professional guides.',
    image: '/images/services/horseback-sunset-og.jpg',
    imageAlt: 'Sunset horseback riding experience',
    keywords: ['sunset', 'horseback', 'romantic', 'evening'],
    duration: '2 hours',
    price: '$95',
  },

  babysitter: {
    id: 'babysitter',
    title: 'Babysitting Services | Punta Cana Family Care',
    description:
      'Professional and trustworthy babysitters for your family vacation. Enjoy peace of mind while our caregivers watch over your children.',
    image: '/images/services/babysitter-og.jpg',
    imageAlt: 'Professional babysitting service',
    keywords: ['babysitter', 'childcare', 'family', 'professional'],
    price: 'From $20/hour',
  },

  'private-catamaran': {
    id: 'private-catamaran',
    title: 'Luxury Catamaran Tours | Punta Cana',
    description:
      'Sail the Caribbean on our luxury catamaran. Snorkeling, drinks, and scenic views included. The ultimate aquatic experience.',
    image: '/images/services/catamaran-og.jpg',
    imageAlt: 'Luxury catamaran sailing in Caribbean waters',
    keywords: ['catamaran', 'sailing', 'snorkeling', 'luxury'],
    duration: '4 - 5 hours',
    price: '$150',
  },

  // Add more services following the same pattern...
  // Premium services

  'luxe-yoga': {
    id: 'luxe-yoga',
    title: 'Premium Yoga Experience | Luxury Wellness Punta Cana',
    description:
      'Exclusive yoga sessions with private instructors. Tailored wellness programs in luxury settings with premium amenities.',
    image: '/images/services/luxe-yoga-og.jpg',
    imageAlt: 'Luxury yoga session in upscale setting',
    keywords: ['luxury', 'yoga', 'wellness', 'premium'],
    duration: '2 hours',
    price: '$200',
  },

  'luxe-yacht': {
    id: 'luxe-yacht',
    title: 'Private Yacht Experience | Ultra-Luxury Punta Cana',
    description:
      'Charter a private yacht for the ultimate luxury Caribbean experience. All-inclusive amenities and personalized service.',
    image: '/images/services/luxe-yacht-og.jpg',
    imageAlt: 'Ultra-luxury private yacht',
    keywords: ['yacht', 'luxury', 'private', 'exclusive'],
    duration: '4 - 8 hours',
    price: 'Custom pricing',
  },

  // Placeholder entries for other services (add images as needed)
  'private-chef': {
    id: 'private-chef',
    title: 'Private Chef Services | Culinary Experience',
    description:
      'Gourmet dining at your location. Professional private chefs prepare custom menus for your group.',
    image: '/images/services/private-chef-og.jpg',
    imageAlt: 'Private chef culinary experience',
    keywords: ['chef', 'dining', 'culinary', 'gourmet'],
    price: 'Custom pricing',
  },

  'golf-cart-rentals': {
    id: 'golf-cart-rentals',
    title: 'Golf Cart Rentals | Punta Cana Transportation',
    description:
      'Convenient and fun golf cart rentals for exploring the resort area at your own pace.',
    image: '/images/services/golf-cart-og.jpg',
    imageAlt: 'Golf cart rental in Punta Cana',
    keywords: ['golf cart', 'rental', 'transportation'],
    price: 'From $50/day',
  },

  'airport-transfers': {
    id: 'airport-transfers',
    title: 'Airport Transfers | Professional Service',
    description:
      'Reliable and comfortable airport transfers with professional drivers. Direct to your hotel or accommodation.',
    image: '/images/services/airport-transfer-og.jpg',
    imageAlt: 'Professional airport transfer service',
    keywords: ['airport', 'transfer', 'transport'],
    price: 'From $45',
  },

  'point-to-point-transfers': {
    id: 'point-to-point-transfers',
    title: 'Point to Point Transfers | Punta Cana',
    description:
      'Professional transportation between any locations in Punta Cana area.',
    image: '/images/services/transfer-og.jpg',
    imageAlt: 'Transportation service',
    keywords: ['transfer', 'transport', 'service'],
    price: 'Custom pricing',
  },

  'personal-training': {
    id: 'personal-training',
    title: 'Personal Training | Fitness Services',
    description:
      'Professional personal trainers for customized fitness programs during your vacation.',
    image: '/images/services/fitness-og.jpg',
    imageAlt: 'Personal training session',
    keywords: ['fitness', 'training', 'health'],
    price: 'From $60/hour',
  },

  karaoke: {
    id: 'karaoke',
    title: 'Karaoke Party Service | Entertainment',
    description:
      'Professional karaoke setup for events and parties. Full sound system and entertainment package.',
    image: '/images/services/karaoke-og.jpg',
    imageAlt: 'Karaoke entertainment setup',
    keywords: ['karaoke', 'entertainment', 'party'],
    price: 'Custom pricing',
  },

  'bike-rentals': {
    id: 'bike-rentals',
    title: 'Bike Rentals | Punta Cana',
    description:
      'Explore Punta Cana on a bike. Quality rentals for all ages and skill levels.',
    image: '/images/services/bike-rental-og.jpg',
    imageAlt: 'Bike rental service',
    keywords: ['bike', 'rental', 'cycling'],
    price: 'From $25/day',
  },

  'saona-island-tour': {
    id: 'saona-island-tour',
    title: 'Saona Island Tour | Day Trip Adventure',
    description:
      'Full-day excursion to beautiful Saona Island. Beaches, snorkeling, and fresh seafood included.',
    image: '/images/services/saona-og.jpg',
    imageAlt: 'Saona Island beach paradise',
    keywords: ['island', 'tour', 'beach', 'adventure'],
    duration: '8 hours',
    price: '$120',
  },

  'deep-sea-fishing': {
    id: 'deep-sea-fishing',
    title: 'Deep Sea Fishing | Charter Experience',
    description:
      'Professional deep-sea fishing charters. Experienced crew and top-quality equipment included.',
    image: '/images/services/fishing-og.jpg',
    imageAlt: 'Deep sea fishing charter',
    keywords: ['fishing', 'charter', 'adventure'],
    duration: '6 - 8 hours',
    price: '$400',
  },

  'private-fishing-trip': {
    id: 'private-fishing-trip',
    title: 'Private Fishing Trip | Exclusive Experience',
    description:
      'Personalized fishing experience with private guides and equipment.',
    image: '/images/services/private-fishing-og.jpg',
    imageAlt: 'Private fishing trip',
    keywords: ['fishing', 'private', 'exclusive'],
    price: 'Custom pricing',
  },

  'custom-decorations': {
    id: 'custom-decorations',
    title: 'Custom Event Decorations | Professional Service',
    description:
      'Professional decoration services for events, weddings, and special occasions.',
    image: '/images/services/decorations-og.jpg',
    imageAlt: 'Custom event decorations',
    keywords: ['decorations', 'events', 'wedding'],
    price: 'Custom pricing',
  },

  'adventure-excursions': {
    id: 'adventure-excursions',
    title: 'Adventure Excursions | Thrill Activities',
    description:
      'Exciting adventure packages with activities for adrenaline seekers.',
    image: '/images/services/adventure-og.jpg',
    imageAlt: 'Adventure excursion activities',
    keywords: ['adventure', 'excursion', 'thrill'],
    price: 'From $100',
  },

  'live-music': {
    id: 'live-music',
    title: 'Live Music Service | Entertainment',
    description:
      'Professional live music performers for events, weddings, and celebrations.',
    image: '/images/services/live-music-og.jpg',
    imageAlt: 'Live music performance',
    keywords: ['music', 'live', 'entertainment'],
    price: 'Custom pricing',
  },

  'standard-massage': {
    id: 'standard-massage',
    title: 'Professional Massage | Wellness & Relaxation',
    description:
      'Therapeutic massage services in the comfort of your accommodation. Relax and rejuvenate.',
    image: '/images/services/massage-og.jpg',
    imageAlt: 'Professional massage therapy',
    keywords: ['massage', 'wellness', 'relaxation'],
    duration: '1 - 2 hours',
    price: 'From $80',
  },

  // Premium services
  'luxe-golf-cart': {
    id: 'luxe-golf-cart',
    title: 'Luxury Golf Cart Rental | Premium Service',
    description:
      'Upscale golf cart rentals with premium features and personalized service.',
    image: '/images/services/luxe-golf-cart-og.jpg',
    imageAlt: 'Luxury golf cart',
    keywords: ['luxury', 'golf cart', 'premium'],
    price: 'From $150/day',
  },

  'luxe-fitness': {
    id: 'luxe-fitness',
    title: 'Premium Fitness Experience | Luxury Wellness',
    description:
      'Exclusive fitness programs with top trainers in luxury settings.',
    image: '/images/services/luxe-fitness-og.jpg',
    imageAlt: 'Premium fitness facility',
    keywords: ['fitness', 'luxury', 'wellness'],
    price: 'Custom pricing',
  },

  'luxe-e-bikes': {
    id: 'luxe-e-bikes',
    title: 'Luxury E-Bike Rentals | Premium Experience',
    description:
      'High-end electric bikes for an eco-friendly luxury exploration experience.',
    image: '/images/services/luxe-ebike-og.jpg',
    imageAlt: 'Luxury electric bike',
    keywords: ['e-bike', 'luxury', 'electric'],
    price: 'From $100/day',
  },

  'private-yacht-experience': {
    id: 'private-yacht-experience',
    title: 'Private Yacht Experience | Ultimate Luxury',
    description:
      'Bespoke private yacht experiences with full crew and amenities.',
    image: '/images/services/private-yacht-og.jpg',
    imageAlt: 'Private yacht charter',
    keywords: ['yacht', 'private', 'luxury', 'exclusive'],
    price: 'Custom pricing',
  },

  'luxe-culinary': {
    id: 'luxe-culinary',
    title: 'Luxury Culinary Experience | Gourmet Dining',
    description:
      'Premium culinary experiences with world-class chefs and Michelin-inspired menus.',
    image: '/images/services/luxe-culinary-og.jpg',
    imageAlt: 'Luxury gourmet dining experience',
    keywords: ['culinary', 'gourmet', 'luxury', 'dining'],
    price: 'Custom pricing',
  },

  'luxe-masseuse': {
    id: 'luxe-masseuse',
    title: 'Luxury Spa Massage | Premium Wellness',
    description:
      'High-end massage therapy and spa services with premium treatments.',
    image: '/images/services/luxe-massage-og.jpg',
    imageAlt: 'Luxury spa massage',
    keywords: ['massage', 'spa', 'luxury', 'wellness'],
    price: 'From $150/hour',
  },

  'luxe-arrival': {
    id: 'luxe-arrival',
    title: 'Luxury Arrival Experience | VIP Service',
    description:
      'Premium arrival services with red-carpet treatment and personalized concierge.',
    image: '/images/services/luxe-arrival-og.jpg',
    imageAlt: 'VIP luxury arrival service',
    keywords: ['luxury', 'vip', 'arrival', 'premium'],
    price: 'Custom pricing',
  },
};

/**
 * Obtener metadatos de un servicio por su ID
 */
export function getServiceMetadata(
  serviceId: ServiceId
): ServiceMetadata | null {
  return SERVICE_METADATA[serviceId] || null;
}

/**
 * Generar Open Graph meta tags para un servicio
 * Uso: En layout o páginas específicas
 */
export function generateOpenGraphMetaTags(
  metadata: ServiceMetadata,
  baseUrl: string = 'https://luxpuntacana.com'
) {
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
      url: `${baseUrl}/standard-package/${metadata.id}`,
      images: [
        {
          url: `${baseUrl}${metadata.image}`,
          width: 1200,
          height: 630,
          alt: metadata.imageAlt,
          type: 'image/jpeg',
        },
      ],
      siteName: 'Luxe Punta Cana',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [`${baseUrl}${metadata.image}`],
    },
  };
}
