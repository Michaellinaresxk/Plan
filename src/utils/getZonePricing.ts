import {
  TRANSPORT_ZONES,
  Zone,
  ZONE_PRICING_MATRIX,
  ZonePricing,
} from '@/constants/zone';

// Utility functions for zone pricing
export const getZonePricing = (
  fromZone: string,
  toZone: string
): ZonePricing | null => {
  // Same zone transport
  if (fromZone === toZone) {
    const zone = TRANSPORT_ZONES.find((z) => z.id === fromZone);
    return {
      fromZone,
      toZone,
      basePrice: 20, // Flat rate for same-zone transport
      estimatedTime: '10-15 min',
      distance: '5-10 km',
      difficulty: 'easy',
    };
  }

  // Check direct route
  let pricing = ZONE_PRICING_MATRIX.find(
    (p) => p.fromZone === fromZone && p.toZone === toZone
  );

  // Check reverse route (bidirectional)
  if (!pricing) {
    pricing = ZONE_PRICING_MATRIX.find(
      (p) => p.fromZone === toZone && p.toZone === fromZone
    );
  }

  return pricing || null;
};

export const isZoneCombinationSupported = (
  fromZone: string,
  toZone: string
): boolean => {
  return getZonePricing(fromZone, toZone) !== null;
};

export const getZonesByPopularity = (): { popular: Zone[]; other: Zone[] } => {
  return {
    popular: TRANSPORT_ZONES.filter((zone) => zone.isPopular),
    other: TRANSPORT_ZONES.filter((zone) => !zone.isPopular),
  };
};
