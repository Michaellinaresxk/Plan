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
    // ✅ Usar maxCapacity como punto de corte, no 8 hardcodeado
    if (totalParticipants <= servicePricing.maxCapacity) {
      return servicePricing.small;
    } else {
      return servicePricing.large;
    }
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
