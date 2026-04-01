import { ServiceId } from './serviceId';

export interface ServiceMetadata {
  id: ServiceId;
  title: string;
  description: string;
  image: string; // Full absolute URL for Open Graph
  imageAlt: string;
  keywords: string[];
  duration?: string;
  price?: string;
}

const BASE = 'https://luxpuntacana.com';

export const SERVICE_METADATA: Record<ServiceId, ServiceMetadata> = {
  // ─── TRANSPORTATION ──────────────────────────────────────────────────────────

  'airport-transfers': {
    id: 'airport-transfers',
    title: 'Airport Transfers Punta Cana | Private & Reliable | Luxe Punta Cana',
    description:
      'Skip the hassle — our professional drivers meet you at Punta Cana Airport and take you directly to your hotel or villa. Air-conditioned vehicles, flight tracking included.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Private airport transfer van in Punta Cana',
    keywords: ['airport transfer punta cana', 'punta cana transportation', 'airport pickup dominican republic', 'PUJ airport transfer'],
    duration: '30 – 60 min',
    price: 'From $45',
  },

  'point-to-point-transfers': {
    id: 'point-to-point-transfers',
    title: 'Point-to-Point Transfers Punta Cana | Private Car Service | Luxe Punta Cana',
    description:
      'Comfortable and punctual private transfers between any two locations in the Punta Cana area. SUVs, vans and luxury vehicles available for groups of all sizes.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Private car transfer service in Dominican Republic',
    keywords: ['private transfer punta cana', 'car service dominican republic', 'hotel to hotel transfer', 'punta cana ride'],
    price: 'From $35',
  },

  'golf-cart-rentals': {
    id: 'golf-cart-rentals',
    title: 'Golf Cart Rentals Punta Cana | Explore at Your Own Pace | Luxe Punta Cana',
    description:
      'Rent a golf cart and cruise around your resort or villa area in style. Standard 4-seaters to luxury 6-seaters with GPS, cooler and sound system add-ons available.',
    image: `${BASE}/img/gallery-golf-cart.jpg`,
    imageAlt: 'Golf cart rental in Punta Cana resort area',
    keywords: ['golf cart rental punta cana', 'rent golf cart dominican republic', 'resort transportation', 'punta cana golf cart'],
    price: 'From $50 / day',
  },

  'bike-rentals': {
    id: 'bike-rentals',
    title: 'Bike Rentals Punta Cana | Explore the Coast | Luxe Punta Cana',
    description:
      'Explore the beaches, resorts and local neighborhoods of Punta Cana on two wheels. Quality bikes for all ages, delivered to your accommodation.',
    image: `${BASE}/img/bike.jpg`,
    imageAlt: 'Bike rental along the Punta Cana coastline',
    keywords: ['bike rental punta cana', 'bicycle rent dominican republic', 'cycling punta cana', 'explore punta cana bike'],
    price: 'From $25 / day',
  },

  'luxe-golf-cart': {
    id: 'luxe-golf-cart',
    title: 'Luxury Golf Cart Rental Punta Cana | VIP Experience | Luxe Punta Cana',
    description:
      'Premium golf cart rentals with top-of-the-line models, premium sound, GPS and concierge delivery. The most comfortable way to explore your resort.',
    image: `${BASE}/img/gallery-golf-cart.jpg`,
    imageAlt: 'Luxury golf cart rental in Punta Cana',
    keywords: ['luxury golf cart punta cana', 'premium golf cart rental', 'VIP transportation punta cana'],
    price: 'From $150 / day',
  },

  'luxe-e-bikes': {
    id: 'luxe-e-bikes',
    title: 'Luxury E-Bike Rentals Punta Cana | Electric Bikes | Luxe Punta Cana',
    description:
      'Explore Punta Cana effortlessly on our high-end electric bikes. Eco-friendly, comfortable and delivered directly to your door.',
    image: `${BASE}/img/bike.jpg`,
    imageAlt: 'Luxury electric bike rental in Punta Cana',
    keywords: ['e-bike rental punta cana', 'electric bike dominican republic', 'luxury bicycle punta cana'],
    price: 'From $100 / day',
  },

  'luxe-arrival': {
    id: 'luxe-arrival',
    title: 'VIP Luxury Arrival Punta Cana | Red Carpet Airport Transfer | Luxe Punta Cana',
    description:
      'Arrive like royalty. Private luxury vehicle, concierge meet-and-greet at the gate, cold towels, champagne and seamless transfer to your villa or resort.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'VIP luxury arrival service in Punta Cana',
    keywords: ['VIP arrival punta cana', 'luxury airport transfer', 'private concierge punta cana', 'red carpet airport'],
    price: 'Custom pricing',
  },

  // ─── WELLNESS ────────────────────────────────────────────────────────────────

  'yoga-standard': {
    id: 'yoga-standard',
    title: 'Yoga Sessions Punta Cana | Beach & Villa Yoga | Luxe Punta Cana',
    description:
      'Start your morning with yoga on the beach or at your villa. Our certified instructors offer Hatha, Vinyasa, and Restorative sessions for all levels.',
    image: 'https://images.pexels.com/photos/9207203/pexels-photo-9207203.jpeg',
    imageAlt: 'Yoga session on the beach in Punta Cana',
    keywords: ['yoga punta cana', 'beach yoga dominican republic', 'yoga vacation punta cana', 'wellness punta cana'],
    duration: '1.5 – 2 hours',
    price: 'From $75',
  },

  'luxe-yoga': {
    id: 'luxe-yoga',
    title: 'Private Luxury Yoga Punta Cana | Exclusive Wellness | Luxe Punta Cana',
    description:
      'An exclusive yoga experience tailored to you. Private certified instructor, premium mats and props, stunning ocean or garden setting, personalized wellness program.',
    image: 'https://images.pexels.com/photos/9207203/pexels-photo-9207203.jpeg',
    imageAlt: 'Luxury private yoga session in Punta Cana',
    keywords: ['luxury yoga punta cana', 'private yoga session', 'premium wellness dominican republic', 'VIP yoga'],
    duration: '2 hours',
    price: 'From $200',
  },

  'personal-training': {
    id: 'personal-training',
    title: 'Personal Trainer Punta Cana | Fitness on Vacation | Luxe Punta Cana',
    description:
      'Keep your fitness routine on track with a certified personal trainer. Strength, HIIT, functional training and more — at your villa, resort gym or beachside.',
    image: `${BASE}/img/trainer.jpg`,
    imageAlt: 'Personal training session in Punta Cana',
    keywords: ['personal trainer punta cana', 'fitness vacation dominican republic', 'workout punta cana', 'private trainer'],
    price: 'From $60 / hour',
  },

  'luxe-fitness': {
    id: 'luxe-fitness',
    title: 'Luxury Personal Training Punta Cana | VIP Fitness | Luxe Punta Cana',
    description:
      'Train with the best. Elite certified coaches, customized programs and premium equipment brought to you. The most exclusive fitness experience in Punta Cana.',
    image: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/13/2b/dd/73.jpg',
    imageAlt: 'Luxury fitness training session in Punta Cana',
    keywords: ['luxury fitness punta cana', 'VIP personal trainer', 'premium workout dominican republic'],
    price: 'Custom pricing',
  },

  'standard-massage': {
    id: 'standard-massage',
    title: 'Massage Therapy Punta Cana | In-Villa Spa | Luxe Punta Cana',
    description:
      'Professional massage therapists come to your villa or hotel room. Swedish, Deep Tissue, Hot Stone, and more — book your in-room spa experience today.',
    image: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595140/2_fhmcnt.jpg',
    imageAlt: 'Professional massage therapy in Punta Cana villa',
    keywords: ['massage punta cana', 'in-villa massage dominican republic', 'spa punta cana', 'relaxation massage'],
    duration: '60 – 120 min',
    price: 'From $80',
  },

  'luxe-masseuse': {
    id: 'luxe-masseuse',
    title: 'Luxury Spa Massage Punta Cana | Premium Wellness | Luxe Punta Cana',
    description:
      'The finest spa experience in Punta Cana, delivered to your door. Premium therapists, hot stone rituals, aromatherapy and five-star service at your villa.',
    image: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754595140/2_fhmcnt.jpg',
    imageAlt: 'Luxury spa massage experience in Punta Cana',
    keywords: ['luxury massage punta cana', 'premium spa dominican republic', 'VIP massage service', 'five-star spa'],
    price: 'From $150 / hour',
  },

  // ─── WATER ACTIVITIES ────────────────────────────────────────────────────────

  'catamaran-trips': {
    id: 'catamaran-trips',
    title: 'Catamaran Tours Punta Cana | Snorkeling & Sailing | Luxe Punta Cana',
    description:
      'Sail the crystal-clear Caribbean on a shared catamaran. Snorkeling stops, open bar, fresh seafood lunch and breathtaking views — a must-do in Punta Cana.',
    image: 'https://moonshadow-tqc.com.au/wp-content/uploads/sites/5204/2022/01/MSTQC-Boats-slide-into-clear-waters.png',
    imageAlt: 'Catamaran sailing in Caribbean waters near Punta Cana',
    keywords: ['catamaran punta cana', 'sailing tour dominican republic', 'snorkeling punta cana', 'boat trip caribbean'],
    duration: '4 – 5 hours',
    price: 'From $89',
  },

  'private-catamaran': {
    id: 'private-catamaran',
    title: 'Private Catamaran Charter Punta Cana | Luxury Sailing | Luxe Punta Cana',
    description:
      'Charter an entire catamaran exclusively for your group. Private crew, personalized itinerary, gourmet food and premium open bar. The Caribbean at its finest.',
    image: 'https://res.cloudinary.com/michaelxk-com/image/upload/v1625794349/nuestra%20flota/lagoon%2042/1_uspfu7.jpg',
    imageAlt: 'Private luxury catamaran charter in Punta Cana',
    keywords: ['private catamaran punta cana', 'catamaran charter caribbean', 'luxury sailing dominican republic'],
    duration: '4 – 8 hours',
    price: 'From $800',
  },

  'luxe-yacht': {
    id: 'luxe-yacht',
    title: 'Private Yacht Charter Punta Cana | Ultra-Luxury | Luxe Punta Cana',
    description:
      'The pinnacle of Caribbean luxury. Charter a private superyacht with professional crew, gourmet dining, watersports equipment and bespoke itinerary.',
    image: `${BASE}/img/yacht.jpg`,
    imageAlt: 'Ultra-luxury private yacht charter in Punta Cana',
    keywords: ['yacht charter punta cana', 'private yacht caribbean', 'luxury boat dominican republic', 'superyacht punta cana'],
    duration: '4 – 10 hours',
    price: 'From $1,500',
  },

  'private-yacht-experience': {
    id: 'private-yacht-experience',
    title: 'Private Yacht Experience Punta Cana | Bespoke Luxury | Luxe Punta Cana',
    description:
      'A fully bespoke private yacht experience. Tailored itinerary, gourmet onboard dining, watersports and full professional crew for your most unforgettable day on the water.',
    image: `${BASE}/img/yacht.jpg`,
    imageAlt: 'Private yacht experience in Punta Cana',
    keywords: ['private yacht experience', 'luxury yacht punta cana', 'bespoke sailing', 'VIP yacht charter'],
    price: 'Custom pricing',
  },

  'deep-sea-fishing': {
    id: 'deep-sea-fishing',
    title: 'Deep-Sea Fishing Punta Cana | Charter Experience | Luxe Punta Cana',
    description:
      'Head offshore for Marlin, Mahi-Mahi and Wahoo. Fully equipped sport-fishing boats, professional crew, bait and tackle included. Catch-and-release or keep your catch.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Deep-sea sport fishing charter in Punta Cana',
    keywords: ['deep sea fishing punta cana', 'sport fishing dominican republic', 'marlin fishing caribbean', 'offshore fishing'],
    duration: '6 – 8 hours',
    price: 'From $400',
  },

  'private-fishing-trip': {
    id: 'private-fishing-trip',
    title: 'Private Fishing Trip Punta Cana | Exclusive Charter | Luxe Punta Cana',
    description:
      'A private, personalized fishing experience with your own guide and boat. Inshore or offshore options, fully equipped — just you and the ocean.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Private fishing trip boat in Punta Cana',
    keywords: ['private fishing trip punta cana', 'exclusive fishing charter', 'inshore fishing dominican republic'],
    price: 'Custom pricing',
  },

  // ─── TOURS & ADVENTURES ──────────────────────────────────────────────────────

  'saona-island-tour': {
    id: 'saona-island-tour',
    title: 'Saona Island Tour Punta Cana | Full-Day Paradise | Luxe Punta Cana',
    description:
      'Visit Saona Island — one of the most beautiful islands in the Caribbean. White sand beaches, crystal water, open bar, fresh seafood lunch and natural starfish pools included.',
    image: `${BASE}/img/saona.jpeg`,
    imageAlt: 'Saona Island turquoise waters and white sand beach',
    keywords: ['saona island tour', 'saona island punta cana', 'day trip dominican republic', 'best tour punta cana'],
    duration: '8 hours',
    price: 'From $89',
  },

  'horseback-riding': {
    id: 'horseback-riding',
    title: 'Horseback Riding Punta Cana | Beach & Trail Rides | Luxe Punta Cana',
    description:
      'Ride through lush trails and gallop along the beach with experienced guides. Suitable for beginners and experienced riders. An unforgettable adventure for the whole family.',
    image: `${BASE}/img/horseback.jpeg`,
    imageAlt: 'Horseback riding on the beach in Punta Cana',
    keywords: ['horseback riding punta cana', 'horse riding dominican republic', 'beach horseback ride', 'equestrian punta cana'],
    duration: '2 – 3 hours',
    price: 'From $85',
  },

  'horseback-sunset': {
    id: 'horseback-sunset',
    title: 'Sunset Horseback Ride Punta Cana | Romantic Experience | Luxe Punta Cana',
    description:
      'The perfect romantic outing. Ride along the beach at golden hour as the sun sets over the Caribbean Sea. Private guides, photos included.',
    image: `${BASE}/img/horse-bg.png`,
    imageAlt: 'Sunset horseback riding on the beach in Punta Cana',
    keywords: ['sunset horseback riding punta cana', 'romantic horse ride', 'beach sunset tour', 'couples activity punta cana'],
    duration: '2 hours',
    price: 'From $95',
  },

  'atv-excursions': {
    id: 'atv-excursions',
    title: 'ATV Excursions Punta Cana | Off-Road Adventure | Luxe Punta Cana',
    description:
      'Rev up and explore the Dominican countryside on an ATV. Ride through natural caves, local villages, cenotes and pristine beaches. Helmets, guide and hotel pickup included.',
    image: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1759444117/44_cwmyje.jpg',
    imageAlt: 'ATV off-road excursion through the Dominican countryside',
    keywords: ['ATV punta cana', 'quad bike dominican republic', 'off-road adventure punta cana', 'ATV tour'],
    duration: '4 hours',
    price: 'From $85',
  },

  'adventure-excursions': {
    id: 'adventure-excursions',
    title: 'Adventure Excursions Punta Cana | Thrills & Nature | Luxe Punta Cana',
    description:
      'Ziplines, cave exploration, cenote dives, ATV rides and more — our adventure excursion packages combine the best adrenaline activities in the Dominican Republic.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Adventure excursion activities in Punta Cana',
    keywords: ['adventure punta cana', 'thrill activities dominican republic', 'zipline punta cana', 'extreme sports caribbean'],
    price: 'From $100',
  },

  // ─── FOOD & DRINKS ───────────────────────────────────────────────────────────

  'private-chef': {
    id: 'private-chef',
    title: 'Private Chef Punta Cana | Gourmet Dining at Your Villa | Luxe Punta Cana',
    description:
      'Enjoy a world-class culinary experience without leaving your villa. Our private chefs design custom menus — from Caribbean seafood feasts to international gourmet dinners.',
    image: `${BASE}/img/cheff.jpg`,
    imageAlt: 'Private chef preparing gourmet dinner at a Punta Cana villa',
    keywords: ['private chef punta cana', 'in-villa dining dominican republic', 'gourmet chef vacation', 'personal chef caribbean'],
    price: 'From $120 / event',
  },

  'luxe-culinary': {
    id: 'luxe-culinary',
    title: 'Luxury Culinary Experience Punta Cana | Michelin-Level Dining | Luxe Punta Cana',
    description:
      'A Michelin-inspired dining experience in the comfort of your villa. World-class chefs, sommelier-curated wine pairings, and a custom tasting menu designed exclusively for you.',
    image: `${BASE}/img/cheff.jpg`,
    imageAlt: 'Luxury gourmet dining experience in a Punta Cana villa',
    keywords: ['luxury dining punta cana', 'private chef experience', 'gourmet vacation dominican republic', 'fine dining villa'],
    price: 'Custom pricing',
  },

  // ─── LEISURE & ENTERTAINMENT ─────────────────────────────────────────────────

  'babysitter': {
    id: 'babysitter',
    title: 'Babysitting Services Punta Cana | Trusted Childcare | Luxe Punta Cana',
    description:
      'Enjoy your vacation worry-free. Our professional, background-checked babysitters keep your children safe and entertained while you relax or explore.',
    image: 'https://images.unsplash.com/photo-1587650116842-3e8ac2b0f6b3?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Professional babysitter with children in Punta Cana',
    keywords: ['babysitter punta cana', 'childcare vacation dominican republic', 'nanny service punta cana', 'kids care resort'],
    price: 'From $20 / hour',
  },

  'karaoke': {
    id: 'karaoke',
    title: 'Karaoke Party Service Punta Cana | Full Setup | Luxe Punta Cana',
    description:
      'Turn your villa or event space into a karaoke club. Professional sound system, thousands of songs, wireless mics and optional host — guaranteed fun for your whole group.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Karaoke party setup at a Punta Cana villa',
    keywords: ['karaoke punta cana', 'karaoke party dominican republic', 'entertainment villa punta cana', 'group activities'],
    price: 'Custom pricing',
  },

  'live-music': {
    id: 'live-music',
    title: 'Live Music Punta Cana | Private Performances | Luxe Punta Cana',
    description:
      'Elevate any occasion with live music. Solo artists, duos, trios or full bands — Latin, jazz, bachata, pop and more. Perfect for weddings, dinners and private events.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Live music performance at a Punta Cana event',
    keywords: ['live music punta cana', 'private band dominican republic', 'wedding music caribbean', 'entertainment event'],
    price: 'Custom pricing',
  },

  'custom-decorations': {
    id: 'custom-decorations',
    title: 'Custom Event Decorations Punta Cana | Weddings & Celebrations | Luxe Punta Cana',
    description:
      'Transform any space into something magical. Our decoration team handles weddings, birthdays, anniversaries and special occasions with bespoke floral and balloon arrangements.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Custom event decorations at a Punta Cana celebration',
    keywords: ['event decorations punta cana', 'wedding decor dominican republic', 'party decorations caribbean', 'balloon arrangements'],
    price: 'Custom pricing',
  },
};

/**
 * Get metadata for a service by ID.
 * Returns null if the service is not in the metadata record.
 */
export function getServiceMetadata(serviceId: string): ServiceMetadata | null {
  return SERVICE_METADATA[serviceId as ServiceId] ?? null;
}

/**
 * Generate Open Graph meta tags for a service.
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
          url: metadata.image,
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
      images: [metadata.image],
    },
  };
}
