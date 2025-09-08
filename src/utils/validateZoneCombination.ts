import { TRANSPORT_ZONES } from '@/constants/zone';
import { getZonePricing } from './getZonePricing';

// Validation utilities
export const validateZoneCombination = (
  fromZone: string,
  toZone: string
): string | null => {
  if (!fromZone) return 'Please select pickup zone';
  if (!toZone) return 'Please select destination zone';
  if (fromZone === toZone) return null; // Same zone is allowed

  const pricing = getZonePricing(fromZone, toZone);
  if (!pricing) {
    return 'This route is not currently available. Please contact us for custom arrangements.';
  }

  return null; // Valid combination
};

// Get zone display name
export const getZoneDisplayName = (zoneId: string): string => {
  const zone = TRANSPORT_ZONES.find((z) => z.id === zoneId);
  return zone?.displayName || zoneId;
};
