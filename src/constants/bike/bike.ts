import { BikeType } from '@/types/bike';
import { Service } from '../formFields';

export const LOCATIONS = [
  'Hotel pickup',
  'Bavaro Beach',
  'Cap Cana',
  'Uvero Alto',
  'Macao Beach',
  'Downtown Punta Cana',
  'Playa Blanca',
  'Arena Gorda',
  'El Cortecito',
  'Other (specify in special requests)',
];

export const BIKE_TYPES: BikeType[] = [
  {
    id: 'kids-bike',
    name: 'Kids Bikes',
    icon: '🚲',
    color: 'from-pink-500 to-purple-500',
    price: 15,
    description: 'Safe and fun bikes designed specifically for children',
    ageRange: '4-12 years',
    minAge: 4,
    maxAge: 12,
    features: ['Training wheels available', 'Safety features', 'Bright colors'],
  },
  {
    id: 'beachCruiser',
    name: 'Beach Cruisers',
    icon: '🏖️',
    color: 'from-blue-500 to-cyan-500',
    price: 25,
    description: 'Perfect for coastal rides and beach exploration',
    ageRange: '13+ years',
    minAge: 13,
    maxAge: 99,
    features: ['Comfortable seating', 'Easy pedaling', 'Beach-friendly'],
  },
  {
    id: 'cityBike',
    name: 'City Bikes',
    icon: '🏙️',
    color: 'from-green-500 to-emerald-500',
    price: 30,
    description: 'Ideal for urban exploration and local attractions',
    ageRange: '13+ years',
    minAge: 13,
    maxAge: 99,
    features: ['Versatile design', 'Comfortable ride', 'City-friendly'],
  },
  {
    id: 'mountainBike',
    name: 'Mountain Bikes',
    icon: '⛰️',
    color: 'from-orange-500 to-red-500',
    price: 35,
    description: 'Built for adventure and off-road trails',
    ageRange: '16+ years',
    minAge: 16,
    maxAge: 99,
    features: ['Off-road capability', 'Durable frame', 'Adventure-ready'],
  },
  {
    id: 'eBike',
    name: 'E-Bikes',
    icon: '⚡',
    color: 'from-purple-500 to-pink-500',
    price: 45,
    description: 'Premium electric assistance for effortless rides',
    ageRange: '18+ years',
    minAge: 18,
    maxAge: 99,
    features: ['Electric assistance', 'Premium experience', 'Effortless rides'],
    isPremium: true,
  },
];

// Types for better type safety
interface BikeType {
  id: string;
  name: string;
  icon: string;
  color: string;
  price: number;
  description: string;
  ageRange: string;
  minAge: number;
  maxAge: number;
  features: string[];
  isPremium?: boolean;
}

export interface ChildInfo {
  id: string;
  age: number;
  recommendedBike: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface BikeFormProps {
  service: Service;
  onSubmit: (
    formData: FormData & { totalPrice: number; rentalDays: number }
  ) => void;
  onCancel: () => void;
}
