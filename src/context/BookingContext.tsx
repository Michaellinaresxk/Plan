'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {
  BookingDate,
  BookingDetails,
  Customer,
  PackageType,
  Service,
} from '@/types/type';

// Interface for service booking details
interface ServiceBookingDetails {
  serviceId: string;
  dates: BookingDate;
  guests: number;
}

// Interface for service time slots
interface ServiceTimeSlot {
  serviceId: string;
  date: Date;
  timeSlot: string;
}

// Extended interface for booking context
interface BookingContextType {
  packageType: PackageType | null;
  selectedServices: Service[];
  dates: BookingDate | null;
  guests: number;
  customer: Customer | null;
  specialRequests: string;
  totalPrice: number;
  serviceTimeSlots: ServiceTimeSlot[];
  cartVisible: boolean;
  // New property for service-specific booking details
  serviceBookings: ServiceBookingDetails[];

  // Existing methods
  setPackageType: (packageType: PackageType) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  setDates: (dates: BookingDate) => void;
  setGuests: (guests: number) => void;
  setCustomer: (customer: Customer) => void;
  setSpecialRequests: (requests: string) => void;
  calculateTotalPrice: () => number;
  resetBooking: () => void;
  getBookingDetails: () => BookingDetails;

  // Existing methods for time slots
  addServiceTimeSlot: (serviceTimeSlot: ServiceTimeSlot) => void;
  removeServiceTimeSlot: (serviceId: string) => void;
  getServiceTimeSlot: (serviceId: string) => ServiceTimeSlot | undefined;
  toggleCartVisibility: () => void;
  setCartVisible: (visible: boolean) => void;

  // New methods for service-specific booking details
  bookService: (service: Service, dates: BookingDate, guests: number) => void;
  getServiceBooking: (serviceId: string) => ServiceBookingDetails | undefined;
  updateServiceBooking: (
    serviceId: string,
    dates: BookingDate,
    guests: number
  ) => void;
  removeServiceBooking: (serviceId: string) => void;

  // New method for reordering services
  reorderServices: (updatedServices: Service[]) => void;
}

const defaultBookingContext: BookingContextType = {
  packageType: null,
  selectedServices: [],
  dates: null,
  guests: 1,
  customer: null,
  specialRequests: '',
  totalPrice: 0,
  serviceTimeSlots: [],
  cartVisible: false,
  serviceBookings: [],

  setPackageType: () => {},
  addService: () => {},
  removeService: () => {},
  setDates: () => {},
  setGuests: () => {},
  setCustomer: () => {},
  setSpecialRequests: () => {},
  calculateTotalPrice: () => 0,
  resetBooking: () => {},
  getBookingDetails: () => ({
    packageType: 'standard',
    selectedServices: [],
    dates: { startDate: new Date(), endDate: new Date() },
    guests: 1,
    specialRequests: '',
    totalPrice: 0,
  }),

  addServiceTimeSlot: () => {},
  removeServiceTimeSlot: () => {},
  getServiceTimeSlot: () => undefined,
  toggleCartVisibility: () => {},
  setCartVisible: () => {},

  // New method implementations
  bookService: () => {},
  getServiceBooking: () => undefined,
  updateServiceBooking: () => {},
  removeServiceBooking: () => {},
  reorderServices: () => {},
};

const BookingContext = createContext<BookingContextType>(defaultBookingContext);

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [packageType, setPackageType] = useState<PackageType | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [dates, setDates] = useState<BookingDate | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [serviceTimeSlots, setServiceTimeSlots] = useState<ServiceTimeSlot[]>(
    []
  );
  const [cartVisible, setCartVisible] = useState<boolean>(false);
  // New state for service-specific booking details
  const [serviceBookings, setServiceBookings] = useState<
    ServiceBookingDetails[]
  >([]);

  // Recover data from localStorage on init
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBooking = localStorage.getItem('booking');
      if (storedBooking) {
        try {
          const parsedBooking = JSON.parse(storedBooking);

          // Convert string dates to Date objects
          if (parsedBooking.dates) {
            parsedBooking.dates.startDate = new Date(
              parsedBooking.dates.startDate
            );
            parsedBooking.dates.endDate = new Date(parsedBooking.dates.endDate);
          }

          // Convert dates in serviceTimeSlots
          if (parsedBooking.serviceTimeSlots) {
            parsedBooking.serviceTimeSlots = parsedBooking.serviceTimeSlots.map(
              (slot: any) => ({
                ...slot,
                date: new Date(slot.date),
              })
            );
          }

          // Convert dates in serviceBookings
          if (parsedBooking.serviceBookings) {
            parsedBooking.serviceBookings = parsedBooking.serviceBookings.map(
              (booking: any) => ({
                ...booking,
                dates: {
                  startDate: new Date(booking.dates.startDate),
                  endDate: new Date(booking.dates.endDate),
                },
              })
            );
          }

          // Set states from localStorage
          if (parsedBooking.packageType)
            setPackageType(parsedBooking.packageType);
          if (parsedBooking.selectedServices)
            setSelectedServices(parsedBooking.selectedServices);
          if (parsedBooking.dates) setDates(parsedBooking.dates);
          if (parsedBooking.guests) setGuests(parsedBooking.guests);
          if (parsedBooking.specialRequests)
            setSpecialRequests(parsedBooking.specialRequests);
          if (parsedBooking.serviceTimeSlots)
            setServiceTimeSlots(parsedBooking.serviceTimeSlots);
          if (parsedBooking.serviceBookings)
            setServiceBookings(parsedBooking.serviceBookings);

          // Recalculate price
          calculateTotalPrice();
        } catch (error) {
          console.error('Error parsing stored booking:', error);
        }
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && packageType) {
      const bookingData = {
        packageType,
        selectedServices,
        dates,
        guests,
        specialRequests,
        serviceTimeSlots,
        serviceBookings,
      };

      localStorage.setItem('booking', JSON.stringify(bookingData));
    }
  }, [
    packageType,
    selectedServices,
    dates,
    guests,
    specialRequests,
    serviceTimeSlots,
    serviceBookings,
  ]);

  // Handle adding a service
  const addService = (service: Service) => {
    // Check if service is already selected
    if (!selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
      calculateTotalPrice();

      // Show cart when service is added
      setCartVisible(true);

      // Hide cart after 3 seconds
      setTimeout(() => {
        setCartVisible(false);
      }, 3000);
    }
  };

  // Handle removing a service
  const removeService = (serviceId: string) => {
    setSelectedServices(
      selectedServices.filter((service) => service.id !== serviceId)
    );

    // Also remove any time slot associated with this service
    removeServiceTimeSlot(serviceId);

    // Remove any service-specific booking details
    removeServiceBooking(serviceId);

    calculateTotalPrice();
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = 0;

    // Calculate price for each service based on its booking details
    selectedServices.forEach((service) => {
      const serviceBooking = serviceBookings.find(
        (booking) => booking.serviceId === service.id
      );

      if (serviceBooking) {
        // If service has specific booking details, multiply price by number of guests
        total += service.price * serviceBooking.guests;
      } else {
        // Otherwise, just add the base service price
        total += service.price;
      }
    });

    setTotalPrice(total);
    return total;
  };

  // Reset booking
  const resetBooking = () => {
    setPackageType(null);
    setSelectedServices([]);
    setDates(null);
    setGuests(1);
    setCustomer(null);
    setSpecialRequests('');
    setTotalPrice(0);
    setServiceTimeSlots([]);
    setServiceBookings([]);
    setCartVisible(false);

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('booking');
    }
  };

  // Get booking details
  const getBookingDetails = (): BookingDetails => {
    if (!packageType || !dates) {
      throw new Error('Booking details incomplete');
    }

    return {
      packageType,
      selectedServices,
      dates,
      guests,
      specialRequests,
      totalPrice,
    };
  };

  // Methods for managing service time slots
  const addServiceTimeSlot = (serviceTimeSlot: ServiceTimeSlot) => {
    // First remove any existing time slot for this service
    const updatedSlots = serviceTimeSlots.filter(
      (slot) => slot.serviceId !== serviceTimeSlot.serviceId
    );

    // Then add the new time slot
    setServiceTimeSlots([...updatedSlots, serviceTimeSlot]);
  };

  const removeServiceTimeSlot = (serviceId: string) => {
    setServiceTimeSlots(
      serviceTimeSlots.filter((slot) => slot.serviceId !== serviceId)
    );
  };

  const getServiceTimeSlot = (serviceId: string) => {
    return serviceTimeSlots.find((slot) => slot.serviceId === serviceId);
  };

  const toggleCartVisibility = () => {
    setCartVisible(!cartVisible);
  };

  // New methods for service-specific booking details
  const bookService = (
    service: Service,
    dates: BookingDate,
    guests: number
  ) => {
    // Add the service to selected services if not already present
    if (!selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices((prev) => [...prev, service]);
    }

    // Add or update service booking details
    const existingBookingIndex = serviceBookings.findIndex(
      (booking) => booking.serviceId === service.id
    );

    if (existingBookingIndex >= 0) {
      // Update existing booking
      const updatedBookings = [...serviceBookings];
      updatedBookings[existingBookingIndex] = {
        serviceId: service.id,
        dates,
        guests,
      };
      setServiceBookings(updatedBookings);
    } else {
      // Add new booking
      setServiceBookings([
        ...serviceBookings,
        {
          serviceId: service.id,
          dates,
          guests,
        },
      ]);
    }

    // Show cart when service is booked
    setCartVisible(true);

    // Recalculate total price
    calculateTotalPrice();
  };

  const getServiceBooking = (serviceId: string) => {
    return serviceBookings.find((booking) => booking.serviceId === serviceId);
  };

  const updateServiceBooking = (
    serviceId: string,
    dates: BookingDate,
    guests: number
  ) => {
    const updatedBookings = serviceBookings.map((booking) =>
      booking.serviceId === serviceId ? { ...booking, dates, guests } : booking
    );

    setServiceBookings(updatedBookings);
    calculateTotalPrice();
  };

  const removeServiceBooking = (serviceId: string) => {
    setServiceBookings(
      serviceBookings.filter((booking) => booking.serviceId !== serviceId)
    );
    calculateTotalPrice();
  };

  // New method to reorder services
  const reorderServices = (updatedServices: Service[]) => {
    if (!updatedServices || updatedServices.length === 0) return;

    setSelectedServices(updatedServices);

    // Update localStorage
    if (typeof window !== 'undefined' && packageType) {
      const bookingData = {
        packageType,
        selectedServices: updatedServices,
        dates,
        guests,
        specialRequests,
        serviceTimeSlots,
        serviceBookings,
      };

      localStorage.setItem('booking', JSON.stringify(bookingData));
    }
  };

  const value = {
    packageType,
    selectedServices,
    dates,
    guests,
    customer,
    specialRequests,
    totalPrice,
    serviceTimeSlots,
    cartVisible,
    serviceBookings,

    setPackageType,
    addService,
    removeService,
    setDates,
    setGuests,
    setCustomer,
    setSpecialRequests,
    calculateTotalPrice,
    resetBooking,
    getBookingDetails,

    addServiceTimeSlot,
    removeServiceTimeSlot,
    getServiceTimeSlot,
    toggleCartVisibility,
    setCartVisible,

    bookService,
    getServiceBooking,
    updateServiceBooking,
    removeServiceBooking,
    reorderServices,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};
