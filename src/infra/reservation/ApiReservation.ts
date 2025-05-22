import type { Timestamp } from 'firebase/firestore';

export type ApiReservation = {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  bookingDate: Timestamp; // Firebase Timestamp
  status: string;
  totalPrice: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  formData: Record<string, any>; // Objeto dinámico con propiedades específicas
  notes?: string;
};
