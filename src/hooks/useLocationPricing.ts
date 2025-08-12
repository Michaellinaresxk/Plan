import {
  DEFAULT_LOCATION_OPTIONS,
  DEFAULT_TRANSPORT_PRICING,
} from '@/constants/location/location';
import {
  UseLocationPricingProps,
  UseLocationPricingReturn,
} from '@/types/location';
import { useMemo } from 'react';

export const useLocationPricing = ({
  selectedLocationId,
  totalParticipants,
  servicePricing = DEFAULT_TRANSPORT_PRICING,
}: UseLocationPricingProps): UseLocationPricingReturn => {
  // Get selected location
  const selectedLocation = useMemo(() => {
    return DEFAULT_LOCATION_OPTIONS.find(
      (location) => location.id === selectedLocationId
    );
  }, [selectedLocationId]);

  // Calculate location surcharge
  const locationSurcharge = useMemo(() => {
    return selectedLocation?.surcharge || 0;
  }, [selectedLocation]);

  // Calculate transport cost based on group size
  const transportCost = useMemo(() => {
    if (totalParticipants <= 8) {
      return servicePricing.small;
    } else if (totalParticipants <= servicePricing.maxCapacity) {
      return servicePricing.large;
    }
    return servicePricing.large; // Max capacity
  }, [totalParticipants, servicePricing]);

  // Total location-based costs
  const totalLocationCost = useMemo(() => {
    return transportCost + locationSurcharge;
  }, [transportCost, locationSurcharge]);

  return {
    locationOptions: DEFAULT_LOCATION_OPTIONS,
    selectedLocation,
    locationSurcharge,
    transportCost,
    totalLocationCost,
  };
};
