import { Service } from '@/constants/formFields';
import { CheckCircle, Clock, Gift, Route, Shield, Truck } from 'lucide-react';
import { ServiceData } from './services';

export interface BikeType {
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

export interface FormData {
  // Rental details
  startDate: string;
  endDate: string;
  endTime: string;
  startTime: string;
  location: string;

  // Participants
  adultCount: number;
  childCount: number;
  children: ChildInfo[];

  // Bike selection
  selectedBikes: Record<string, number>; // bikeType -> quantity

  // Additional options
  needsHelmet: boolean;
  needsLock: boolean;
  deliveryToHotel: boolean;
  specialRequests: string;
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

export interface BikeRentalServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

export interface BookingFormData {
  startDate: string;
  endDate: string;
  endTime: string;
  startTime: string;
  location: string;
  adultCount: number;
  childCount: number;
  children: ChildInfo[];
  selectedBikes: Record<string, number>;
  needsHelmet: boolean;
  needsLock: boolean;
  deliveryToHotel: boolean;
  specialRequests: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Enhanced bike types with all necessary properties
export const BIKE_TYPES: BikeType[] = [
  {
    id: 'kids-bike',
    name: 'Kids Bikes',
    price: 15,
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600',
    description: 'Safe and fun bikes designed specifically for children',
    ageRange: '4-12 years',
    minAge: 4,
    maxAge: 12,
    features: ['Training wheels available', 'Safety features', 'Bright colors'],
  },
  {
    id: 'beachCruiser',
    name: 'Beach Cruiser',
    price: 25,
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600',
    description: 'Perfect for coastal rides and beach exploration',
    ageRange: '13+ years',
    minAge: 13,
    maxAge: 99,
    features: ['Comfortable seat', 'Beach-ready tires', 'Basket included'],
  },
  {
    id: 'cityBike',
    name: 'City Bike',
    price: 30,
    image:
      'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&q=80&w=600',
    description: 'Ideal for urban exploration and local attractions',
    ageRange: '13+ years',
    minAge: 13,
    maxAge: 99,
    features: ['Multi-gear system', 'City-optimized', 'Lights included'],
  },
  {
    id: 'mountainBike',
    name: 'Mountain Bike',
    price: 35,
    image:
      'https://images.unsplash.com/photo-1544191696-15693169e831?auto=format&fit=crop&q=80&w=600',
    description: 'Built for adventure and off-road trails',
    ageRange: '16+ years',
    minAge: 16,
    maxAge: 99,
    features: ['All-terrain tires', 'Suspension', 'Trail-ready'],
  },
  {
    id: 'eBike',
    name: 'E-Bike',
    price: 45,
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=600',
    description: 'Electric assistance for effortless rides',
    ageRange: '18+ years',
    minAge: 18,
    maxAge: 99,
    features: ['Electric motor', 'Long battery life', 'Premium comfort'],
    isPremium: true,
  },
];

export const INCLUDED_ITEMS = [
  { icon: Shield, text: 'Helmet' },
  { icon: CheckCircle, text: 'Lock' },
  { icon: Truck, text: 'Free delivery & pickup' },
  { icon: Clock, text: '24/7 Support' },
];

export const NOT_INCLUDED_ITEMS = [
  { icon: Gift, text: 'Gratuity (optional, appreciated)' },
];

export const PROCESS_STEPS = [
  { step: '1', text: 'We deliver your bike at your location', icon: Truck },
  { step: '2', text: 'Quick setup and safety overview', icon: Shield },
  { step: '3', text: 'Enjoy the freedom to explore', icon: Route },
  { step: '4', text: 'We pick up the bike at the scheduled time', icon: Clock },
];
