import type { Reservation } from './Reservation';

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
}
