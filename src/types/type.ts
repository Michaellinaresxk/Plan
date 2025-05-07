export type PackageType = 'standard' | 'premium';

export interface Service {
  id: string;
  name: string;
  img: string;
  description: string;
  packageType: PackageType[];
  price: number;
  duration: number; // in hours
  available: boolean;
}

// Extended service interface for detailed information
export interface EnhancedService extends Service {
  fullDescription?: string;
  includes?: string[];
  whatToBring?: string[];
  schedule?: string;
  pickupTime?: string;
  priceUnit?: string; // e.g., "per person", "per group"
  capacity?: string;
  size?: string; // For yacht, etc.
  location?: string;
  menuOptions?: {
    name: string;
    items: string[];
  }[];
  halfDayOption?: {
    available: boolean;
    times?: string[];
    price?: number;
  };
}

export interface BookingDate {
  startDate: Date;
  endDate: Date;
}

export interface BookingDetails {
  packageType: PackageType;
  selectedServices: Service[];
  dates: BookingDate;
  guests: number;
  specialRequests?: string;
  totalPrice: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNumber?: string;
  nationality?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  customer: Customer;
  bookingDetails: BookingDetails;
  paymentStatus: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyDetails {
  name: string;
  resort: string;
  province: string;
  municipality: string;
  sector: string;
  zipCode: string;
  country: string;
}
