import { LocationOption, TransportPricing } from '@/types/location';

export const DEFAULT_LOCATION_OPTIONS: LocationOption[] = [
  {
    id: 'punta-cana-resorts',
    name: 'Punta Cana Resorts',
    surcharge: 0,
    description: 'Base price $60.00',
  },
  {
    id: 'bavaro',
    name: 'Bavaro',
    surcharge: 0,
    description: 'Base price $60.00',
  },
  {
    id: 'cap-cana',
    name: 'Cap Cana',
    surcharge: 15,
    description: 'Base price',
  },
  {
    id: 'uvero-alto',
    name: 'Uvero Alto',
    surcharge: 15,
    description: 'Base price',
  },
  {
    id: 'puntacana-village',
    name: 'Puntacana Village',
    surcharge: 10,
    description: 'Base price',
  },
];

export const LOCATION_OPTIONS = [
  { id: 'punta-cana-resorts', name: 'Puntacana Resorts' },
  { id: 'bavaro', name: 'Bavaro' },
  { id: 'cap-cana', name: 'Cap Cana' },
  { id: 'uvero-alto', name: 'Uvero Alto' },
  { id: 'puntacana-village', name: 'Punta Cana Village' },
] as const;

export const DEFAULT_TRANSPORT_PRICING: TransportPricing = {
  small: 120, // 1-8 people
  large: 160, // 9-15 people
  maxCapacity: 15,
};
