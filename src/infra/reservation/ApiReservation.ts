import type { Timestamp } from 'firebase/firestore';

export interface ApiReservation {
  bookingId?: string; // Optional because Firestore auto-generates
  serviceId: string;
  serviceName: string;
  bookingDate: Timestamp;
  status: string;
  totalPrice: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  formData: Record<string, any>;
  notes?: string;
}

export interface CreateReservationData {
  serviceId: string;
  serviceName: string;
  totalPrice: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  formData: Record<string, any>;
  notes?: string;
}

export interface UpdateReservationData {
  status?: string;
  notes?: string;
  totalPrice?: number;
}
