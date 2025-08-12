export interface YachtFormData {
  date: string;
  startTime: string;
  guests: number;
  minorsCount: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  hasSpecialNeeds: boolean;
  specialNeedsDetails: string;
  confirmSpecialNeeds: boolean;
  experienceLevel: string;
  activityPreferences: string[];
}

export interface Yacht {
  id: string;
  name: string;
  category: 'sport' | 'luxury' | 'mega';
  price: number;
  priceUnit: 'day';
  shortDescription: string;
  mainImage: string;
  gallery: string[];
  specifications: {
    length: string;
    maxGuests: number;
    cabins: number;
    bathrooms: number;
    crew: number;
    maxSpeed: string;
    manufacturer: string;
    year: number;
  };
  amenities: Array<{
    icon: React.ReactNode;
    name: string;
    description: string;
  }>;
  highlights: string[];
  isPremium: boolean;
  rating: number;
  reviews: number;
  location: string;
  itinerary: string[];
}

export interface LuxeYachtFormProps {
  yacht: Yacht;
  onSubmit?: (formData: any) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  packageType?: string;
}

export const LOCATION_OPTIONS = [
  { id: 'punta-cana-resorts', name: 'Punta Cana Resorts' },
  { id: 'cap-cana', name: 'Cap Cana' },
  { id: 'bavaro', name: 'Bavaro' },
  { id: 'punta-village', name: 'Punta Village' },
] as const;
