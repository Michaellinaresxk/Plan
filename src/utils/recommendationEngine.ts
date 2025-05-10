// utils/recommendationEngine.ts
import { Service } from '@/types/type';
import { TravelPurpose } from '@/types/dayPlanner';

export const getRecommendedServices = (
  purpose: TravelPurpose,
  availableServices: Service[]
): Service[] => {
  const recommendations: Record<TravelPurpose, string[]> = {
    couple: ['private-chef', 'catamaran-trips', 'spa', 'yoga-standard'],
    family: ['babysitter', 'golf-cart-rentals', 'saona-island-tour', 'karaoke'],
    friends: [
      'catamaran-trips',
      'deep-sea-fishing',
      'golf-cart-rentals',
      'live-music',
    ],
    relax: ['yoga-standard', 'personal-training', 'spa', 'private-chef'],
  };

  const recommendedIds = recommendations[purpose] || [];
  return availableServices.filter((service) =>
    recommendedIds.includes(service.id)
  );
};
