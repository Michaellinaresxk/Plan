/**
 * Centralized constants for all service IDs
 * This makes it easier to reference services without typos and enables autocomplete
 */
export const SERVICE_IDS = {
  // Standard services
  CHEF: 'private-chef',
  GOLF_CART: 'golf-cart-rentals',
  AIRPORT_TRANSFER: 'airport-transfers',
  POINT_TO_POINT_TRANSFER: 'point-to-point-transfers',
  YOGA: 'yoga-standard',
  PERSONAL_TRAINER: 'personal-training',
  KARAOKE: 'karaoke',
  BIKE_RENTALS: 'bike-rentals',
  BABYSITTER: 'babysitter',
  CATAMARAN: 'catamaran-trips',

  SAONA_TOUR: 'saona-island-tour',
  HORSEBACK_RIDING: 'horseback-riding',
  HORSEBACK_RIDING_SUNSET: 'horseback-sunset',
  DEEP_SEA_FISHING: 'deep-sea-fishing',
  PRIVATE_FISHING: 'private-fishing-trip',
  CUSTOM_DECORATIONS: 'custom-decorations',
  ADVENTURE_EXCURSIONS: 'adventure-excursions',
  LIVE_MUSIC: 'live-music',
  MASSAGE: 'standard-massage',
  ATV_RIDE_EXCURSION: 'atv-excursions',

  // Premium services
  LUXE_GOLF_CART: 'luxe-golf-cart',
  LUXE_YOGA: 'luxe-yoga',
  LUX_CATAMARAN: 'private-catamaran',
  LUXE_FITNESS: 'luxe-fitness',
  LUXE_EBIKES: 'luxe-e-bikes',
  LUXE_YACHT: 'luxe-yacht',
  PRIVATE_YACHT: 'private-yacht-experience',
  LUXE_CULINARY: 'luxe-culinary',
  LUXE_MASSEUSE: 'luxe-masseuse',
  LUXE_ARRIVAL: 'luxe-arrival',
} as const;

// Type for service ID values
export type ServiceId = (typeof SERVICE_IDS)[keyof typeof SERVICE_IDS];

// Type guard to check if a string is a valid service ID
export function isValidServiceId(id: string): id is ServiceId {
  return Object.values(SERVICE_IDS).includes(id as ServiceId);
}
