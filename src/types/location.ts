export interface LocationOption {
  id: string;
  name: string;
  surcharge: number;
  description: string;
}

export interface TransportPricing {
  small: number; // 1-8 people
  large: number; // 9-15 people
  maxCapacity: number;
}

export interface UseLocationPricingProps {
  selectedLocationId: string;
  totalParticipants: number;
  servicePricing?: TransportPricing;
}

export interface UseLocationPricingReturn {
  locationOptions: LocationOption[];
  selectedLocation: LocationOption | undefined;
  locationSurcharge: number;
  transportCost: number;
  totalLocationCost: number;
}

export interface LocationSelectorProps {
  selectedLocationId: string;
  onLocationSelect: (locationId: string) => void;
  locationOptions?: LocationOption[];
  error?: string;
  isPremium?: boolean;
}
