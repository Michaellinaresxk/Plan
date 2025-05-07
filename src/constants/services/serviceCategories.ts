import { SERVICE_IDS } from '@/constants/services/serviceId';
import { ServiceCategory } from '@/types/services';

// Service category mapping
export const SERVICE_CATEGORIES: Record<string, ServiceCategory> = {
  // Water activities
  [SERVICE_IDS.CATAMARAN]: 'water-activities',
  [SERVICE_IDS.PRIVATE_CATAMARAN]: 'water-activities',
  [SERVICE_IDS.PRIVATE_YACHT]: 'water-activities',
  [SERVICE_IDS.LUXE_YACHT]: 'water-activities',
  [SERVICE_IDS.FISHING]: 'water-activities',
  [SERVICE_IDS.PRIVATE_FISHING]: 'water-activities',

  // Tours
  [SERVICE_IDS.SAONA]: 'tours',
  [SERVICE_IDS.ADVENTURE]: 'tours',
  [SERVICE_IDS.HORSEBACK]: 'tours',

  // Transportation
  [SERVICE_IDS.AIRPORT_TRANSFER]: 'transportation',
  [SERVICE_IDS.GOLF_CART]: 'transportation',
  [SERVICE_IDS.BIKE_RENTALS]: 'transportation',
  [SERVICE_IDS.LUXE_GOLF_CART]: 'transportation',
  [SERVICE_IDS.LUXE_EBIKES]: 'transportation',
  [SERVICE_IDS.LUXE_ARRIVAL]: 'transportation',

  // Wellness
  [SERVICE_IDS.YOGA]: 'wellness',
  [SERVICE_IDS.PERSONAL_TRAINER]: 'wellness',
  [SERVICE_IDS.LUXE_YOGA]: 'wellness',
  [SERVICE_IDS.LUXE_FITNESS]: 'wellness',
  [SERVICE_IDS.LUXE_MASSEUSE]: 'wellness',

  // Food and drinks
  [SERVICE_IDS.CHEF]: 'food-drinks',
  [SERVICE_IDS.LUXE_CULINARY]: 'food-drinks',

  // Leisure
  [SERVICE_IDS.BABYSITTER]: 'leisure',
  [SERVICE_IDS.KARAOKE]: 'leisure',
  [SERVICE_IDS.LIVE_MUSIC]: 'leisure',
  [SERVICE_IDS.CUSTOM_DECOR]: 'leisure',
  [SERVICE_IDS.GROCERY]: 'leisure',
};
