import type Reservation from './Reservation';

export default interface ReservationRepository {
  createReservation(
    serviceId: string,
    serviceName: string,
    totalPrice: number,
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    formData: Record<string, any>,
    notes?: string
  ): Promise<Reservation>;
}
