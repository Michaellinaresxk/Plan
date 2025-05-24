import type { Reservation } from './Reservation';
import type { ReservationStatus } from '@/types/reservation';

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

export default interface ReservationRepository {
  createReservation(data: CreateReservationData): Promise<Reservation>;
  // getReservation(bookingId: string): Promise<Reservation | null>;
  // updateReservationStatus(
  //   bookingId: string,
  //   status: ReservationStatus,
  //   notes?: string
  // ): Promise<void>;
}
