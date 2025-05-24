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

// Interface for reservation data
export interface ReservationData {
  service: Service;
  formData: Record<string, any>;
  totalPrice: number;
  bookingDate: Date;
  clientInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

// Reservation result interface
export interface ReservationResult {
  reservation: any;
  success: boolean;
  error?: string;
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
  serviceBookings: ServiceBookingDetails[];
  reservationData: ReservationData | null;
  reservationResult: ReservationResult | null;

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

  addServiceTimeSlot: (serviceTimeSlot: ServiceTimeSlot) => void;
  removeServiceTimeSlot: (serviceId: string) => void;
  getServiceTimeSlot: (serviceId: string) => ServiceTimeSlot | undefined;
  toggleCartVisibility: () => void;
  setCartVisible: (visible: boolean) => void;

  bookService: (
    service: Service,
    dates: BookingDate,
    guests: number,
    additionalData?: Record<string, any>
  ) => void;
  getServiceBooking: (serviceId: string) => ServiceBookingDetails | undefined;
  updateServiceBooking: (
    serviceId: string,
    dates: BookingDate,
    guests: number
  ) => void;
  removeServiceBooking: (serviceId: string) => void;
  reorderServices: (updatedServices: Service[]) => void;

  // Reservation methods
  setReservationData: (data: ReservationData) => void;
  updateClientInfo: (clientInfo: ReservationData['clientInfo']) => void;
  clearReservation: () => void;
  setReservationResult: (result: ReservationResult) => void;
  createReservationFromBooking: (
    service: Service,
    formData: Record<string, any>
  ) => void;
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
  reservationData: null,
  reservationResult: null,

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

  bookService: () => {},
  getServiceBooking: () => undefined,
  updateServiceBooking: () => {},
  removeServiceBooking: () => {},
  reorderServices: () => {},

  setReservationData: () => {},
  updateClientInfo: () => {},
  clearReservation: () => {},
  setReservationResult: () => {},
  createReservationFromBooking: () => {},
};

const BookingContext = createContext<BookingContextType>(defaultBookingContext);

export const useBooking = () => useContext(BookingContext);
export const useReservation = () => {
  const context = useContext(BookingContext);
  return {
    reservationData: context.reservationData,
    setReservationData: context.setReservationData,
    updateClientInfo: context.updateClientInfo,
    clearReservation: context.clearReservation,
    reservationResult: context.reservationResult,
    setReservationResult: context.setReservationResult,
  };
};

// ===== UTILITY FUNCTIONS FOR DATE SERIALIZATION =====

const serializeReservationData = (data: ReservationData) => {
  return {
    ...data,
    bookingDate: data.bookingDate.toISOString(),
  };
};

const deserializeReservationData = (data: any): ReservationData => {
  return {
    ...data,
    bookingDate: new Date(data.bookingDate),
  };
};

const serializeBookingData = (data: any) => {
  const serialized = { ...data };

  // Convert dates in main dates object
  if (serialized.dates) {
    serialized.dates = {
      startDate: serialized.dates.startDate.toISOString(),
      endDate: serialized.dates.endDate.toISOString(),
    };
  }

  // Convert dates in serviceTimeSlots
  if (serialized.serviceTimeSlots) {
    serialized.serviceTimeSlots = serialized.serviceTimeSlots.map(
      (slot: any) => ({
        ...slot,
        date: slot.date.toISOString(),
      })
    );
  }

  // Convert dates in serviceBookings
  if (serialized.serviceBookings) {
    serialized.serviceBookings = serialized.serviceBookings.map(
      (booking: any) => ({
        ...booking,
        dates: {
          startDate: booking.dates.startDate.toISOString(),
          endDate: booking.dates.endDate.toISOString(),
        },
      })
    );
  }

  return serialized;
};

const deserializeBookingData = (data: any) => {
  const deserialized = { ...data };

  // Convert string dates back to Date objects
  if (deserialized.dates) {
    deserialized.dates = {
      startDate: new Date(deserialized.dates.startDate),
      endDate: new Date(deserialized.dates.endDate),
    };
  }

  // Convert dates in serviceTimeSlots
  if (deserialized.serviceTimeSlots) {
    deserialized.serviceTimeSlots = deserialized.serviceTimeSlots.map(
      (slot: any) => ({
        ...slot,
        date: new Date(slot.date),
      })
    );
  }

  // Convert dates in serviceBookings
  if (deserialized.serviceBookings) {
    deserialized.serviceBookings = deserialized.serviceBookings.map(
      (booking: any) => ({
        ...booking,
        dates: {
          startDate: new Date(booking.dates.startDate),
          endDate: new Date(booking.dates.endDate),
        },
      })
    );
  }

  return deserialized;
};

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
  const [serviceBookings, setServiceBookings] = useState<
    ServiceBookingDetails[]
  >([]);

  // Reservation state
  const [reservationData, setReservationDataState] =
    useState<ReservationData | null>(null);
  const [reservationResult, setReservationResultState] =
    useState<ReservationResult | null>(null);

  // Recover data from localStorage on init
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Recover regular booking data
      const storedBooking = localStorage.getItem('booking');
      if (storedBooking) {
        try {
          const parsedBooking = JSON.parse(storedBooking);
          const deserializedBooking = deserializeBookingData(parsedBooking);

          // Set states from localStorage
          if (deserializedBooking.packageType)
            setPackageType(deserializedBooking.packageType);
          if (deserializedBooking.selectedServices)
            setSelectedServices(deserializedBooking.selectedServices);
          if (deserializedBooking.dates) setDates(deserializedBooking.dates);
          if (deserializedBooking.guests) setGuests(deserializedBooking.guests);
          if (deserializedBooking.specialRequests)
            setSpecialRequests(deserializedBooking.specialRequests);
          if (deserializedBooking.serviceTimeSlots)
            setServiceTimeSlots(deserializedBooking.serviceTimeSlots);
          if (deserializedBooking.serviceBookings)
            setServiceBookings(deserializedBooking.serviceBookings);

          console.log('✅ Booking data recovered from localStorage');
        } catch (error) {
          console.error('❌ Error parsing stored booking:', error);
          localStorage.removeItem('booking'); // Clear corrupted data
        }
      }

      // Don't recover reservation data here - let the confirmation page handle it
    }
  }, []);

  // Save regular booking data to localStorage when it changes
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

      try {
        const serializedData = serializeBookingData(bookingData);
        localStorage.setItem('booking', JSON.stringify(serializedData));
      } catch (error) {
        console.error('❌ Error saving booking data to localStorage:', error);
      }
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
    if (!selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
      calculateTotalPrice();
      setCartVisible(true);
      setTimeout(() => setCartVisible(false), 3000);
    }
  };

  // Handle removing a service
  const removeService = (serviceId: string) => {
    setSelectedServices(
      selectedServices.filter((service) => service.id !== serviceId)
    );
    removeServiceTimeSlot(serviceId);
    removeServiceBooking(serviceId);
    calculateTotalPrice();
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = 0;

    selectedServices.forEach((service) => {
      const serviceBooking = serviceBookings.find(
        (booking) => booking.serviceId === service.id
      );

      if (serviceBooking) {
        total += service.price * serviceBooking.guests;
      } else {
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
    const updatedSlots = serviceTimeSlots.filter(
      (slot) => slot.serviceId !== serviceTimeSlot.serviceId
    );
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

  // Service booking methods
  const bookService = (
    service: Service,
    dates: BookingDate,
    guests: number,
    additionalData?: Record<string, any>
  ) => {
    if (!selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices((prev) => [...prev, service]);
    }

    const existingBookingIndex = serviceBookings.findIndex(
      (booking) => booking.serviceId === service.id
    );

    if (existingBookingIndex >= 0) {
      const updatedBookings = [...serviceBookings];
      updatedBookings[existingBookingIndex] = {
        serviceId: service.id,
        dates,
        guests,
      };
      setServiceBookings(updatedBookings);
    } else {
      setServiceBookings([
        ...serviceBookings,
        {
          serviceId: service.id,
          dates,
          guests,
        },
      ]);
    }

    setCartVisible(true);
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

  const reorderServices = (updatedServices: Service[]) => {
    if (!updatedServices || updatedServices.length === 0) return;
    setSelectedServices(updatedServices);
  };

  // ===== FIXED RESERVATION METHODS =====

  const setReservationData = (data: ReservationData) => {
    console.log('📋 BookingContext - setReservationData called with:', data);

    // Ensure bookingDate is a Date object
    const processedData = {
      ...data,
      bookingDate:
        data.bookingDate instanceof Date
          ? data.bookingDate
          : new Date(data.bookingDate),
    };

    setReservationDataState(processedData);

    // Store in localStorage as backup with proper serialization
    if (typeof window !== 'undefined') {
      try {
        const serializedData = serializeReservationData(processedData);
        localStorage.setItem(
          'tempReservationData',
          JSON.stringify(serializedData)
        );
        console.log('✅ Reservation data saved to localStorage');
      } catch (error) {
        console.error(
          '❌ Error saving reservation data to localStorage:',
          error
        );
      }
    }
  };

  const updateClientInfo = (clientInfo: ReservationData['clientInfo']) => {
    console.log(
      '👤 BookingContext - updateClientInfo called with:',
      clientInfo
    );

    if (reservationData) {
      const updatedData = {
        ...reservationData,
        clientInfo,
        // Ensure bookingDate remains a Date object
        bookingDate:
          reservationData.bookingDate instanceof Date
            ? reservationData.bookingDate
            : new Date(reservationData.bookingDate),
      };

      console.log('👤 BookingContext - Updated reservation data:', updatedData);
      setReservationDataState(updatedData);

      // Update localStorage with proper serialization
      if (typeof window !== 'undefined') {
        try {
          const serializedData = serializeReservationData(updatedData);
          localStorage.setItem(
            'tempReservationData',
            JSON.stringify(serializedData)
          );
          console.log('✅ Updated reservation data saved to localStorage');
        } catch (error) {
          console.error(
            '❌ Error updating reservation data in localStorage:',
            error
          );
        }
      }
    } else {
      console.warn('⚠️ BookingContext - No reservationData to update!');
    }
  };

  const clearReservation = () => {
    console.log('🗑️ BookingContext - clearReservation called');
    setReservationDataState(null);
    setReservationResultState(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('tempReservationData');
      console.log('✅ Reservation data cleared from localStorage');
    }
  };

  const setReservationResult = (result: ReservationResult) => {
    console.log(
      '🎯 BookingContext - setReservationResult called with:',
      result
    );
    setReservationResultState(result);
  };

  const createReservationFromBooking = (
    service: Service,
    formData: Record<string, any>
  ) => {
    console.log('🏗️ BookingContext - createReservationFromBooking called');

    const reservationData: ReservationData = {
      service,
      formData,
      totalPrice: calculateTotalPrice(),
      bookingDate: new Date(), // Always create a new Date object
    };

    setReservationData(reservationData);
    console.log(
      '✅ BookingContext - Reservation data created from booking state'
    );
  };

  // Method to recover reservation data from localStorage (for confirmation page)
  const recoverReservationFromStorage = (): ReservationData | null => {
    if (typeof window === 'undefined') return null;

    try {
      const tempData = localStorage.getItem('tempReservationData');
      if (tempData) {
        const parsedData = JSON.parse(tempData);
        const deserializedData = deserializeReservationData(parsedData);
        console.log(
          '✅ Reservation data recovered from localStorage:',
          deserializedData
        );
        return deserializedData;
      }
    } catch (error) {
      console.error(
        '❌ Error recovering reservation data from localStorage:',
        error
      );
      localStorage.removeItem('tempReservationData'); // Clear corrupted data
    }

    return null;
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
    reservationData,
    reservationResult,

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

    setReservationData,
    updateClientInfo,
    clearReservation,
    setReservationResult,
    createReservationFromBooking,
    recoverReservationFromStorage, // Add this for the confirmation page
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};
