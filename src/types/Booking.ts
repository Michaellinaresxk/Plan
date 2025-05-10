import { Service, PackageType, BookingDate } from './type';

export interface ServiceFormData {
  // Common fields
  date?: string;
  time?: string;
  guestCount?: number;
  specialRequests?: string;

  // Airport transfer specific
  airline?: string;
  flightNumber?: string;
  arrivalTime?: string;
  passengerCount?: number;
  transportProvider?: string;
  vehicleType?: string;
  isRoundTrip?: boolean;
  returnFlightNumber?: string;
  returnDepartureTime?: string;

  // Chef service specific
  chefType?: string;
  mealType?: string;
  dietaryRestrictions?: string;

  // Dynamic fields for other services
  selectedOptions?: Record<string, string>;

  // Calculated price
  calculatedPrice?: number;
}

export interface CartItem {
  id: string;
  service: Service;
  formData: ServiceFormData;
  calculatedPrice: number;
  quantity?: number;
}

export interface BookingContextType {
  // Existing fields
  packageType: PackageType | null;
  setPackageType: (type: PackageType) => void;
  selectedServices: Service[];
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearServices: () => void;

  // New fields for enhanced cart functionality
  cartItems: CartItem[];
  addCartItem: (item: CartItem) => void;
  updateCartItem: (itemId: string, formData: ServiceFormData) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;

  // Cart UI state
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // Total price calculation
  getTotalPrice: () => number;

  // Other booking details
  bookingDate: BookingDate | null;
  setBookingDate: (date: BookingDate) => void;
  guestCount: number;
  setGuestCount: (count: number) => void;

  // Service form management
  activeServiceForm: Service | null;
  setActiveServiceForm: (service: Service | null) => void;

  // Navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Form data storage
  getAllFormData: () => Record<string, ServiceFormData>;
  setServiceFormData: (serviceId: string, formData: ServiceFormData) => void;
}

export interface CheckoutData {
  packageType: PackageType;
  cartItems: CartItem[];
  bookingDate: BookingDate;
  guestCount: number;
  totalPrice: number;
  customerInfo?: any; // To be defined based on customer form
  paymentInfo?: any; // To be defined based on payment form
}
