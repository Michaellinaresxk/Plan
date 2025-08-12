import { LocationOption, TransportPricing } from '@/types/location';

export const DEFAULT_LOCATION_OPTIONS: LocationOption[] = [
  {
    id: 'punta-cana-resorts',
    name: 'Punta Cana Resorts',
    surcharge: 0,
    description: 'Standard pricing',
  },
  {
    id: 'bavaro',
    name: 'Bavaro',
    surcharge: 0,
    description: 'Same as Punta Cana',
  },
  {
    id: 'cap-cana',
    name: 'Cap Cana',
    surcharge: 15,
    description: '+$15 USD additional',
  },
  {
    id: 'uvero-alto',
    name: 'Uvero Alto',
    surcharge: 15,
    description: '+$15 USD additional',
  },
  {
    id: 'punta-village',
    name: 'Puntacana Village',
    surcharge: 10,
    description: '+$10 USD additional',
  },
];

export const DEFAULT_TRANSPORT_PRICING: TransportPricing = {
  small: 120, // 1-8 people
  large: 160, // 9-15 people
  maxCapacity: 15,
};
