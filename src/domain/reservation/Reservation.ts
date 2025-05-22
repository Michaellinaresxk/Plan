import { ReservationStatus } from '@/types/reservation';
import type { ReservationProperties } from '@/types/properties';

export class Reservation {
  private constructor(
    public readonly bookingId: string,
    public readonly serviceId: string,
    public readonly serviceName: string,
    public readonly bookingDate: Date,
    public readonly status: ReservationStatus,
    public readonly totalPrice: number,
    public readonly clientName: string,
    public readonly clientEmail: string,
    public readonly clientPhone: string,
    public readonly formData: Record<string, any>, // Propiedades dinámicas por servicio
    public readonly notes?: string
  ) {}

  static fromProperties(properties: ReservationProperties): Reservation {
    const {
      bookingId,
      serviceId,
      serviceName,
      bookingDate,
      status,
      totalPrice,
      clientName,
      clientEmail,
      clientPhone,
      formData,
      notes,
    } = properties;

    // Calcular timeAgo basado en bookingDate
    const timeAgo = calculateTimeAgo(bookingDate);

    return new Reservation(
      bookingId,
      serviceId,
      serviceName,
      bookingDate,
      status,
      totalPrice,
      clientName,
      clientEmail,
      clientPhone,
      formData || {},
      notes,
      timeAgo
    );
  }

  get properties(): ReservationProperties {
    return Object.freeze({
      bookingId: this.bookingId,
      serviceId: this.serviceId,
      serviceName: this.serviceName,
      bookingDate: this.bookingDate,
      status: this.status,
      totalPrice: this.totalPrice,
      clientName: this.clientName,
      clientEmail: this.clientEmail,
      clientPhone: this.clientPhone,
      formData: this.formData,
      notes: this.notes,
    });
  }
}

export default Reservation;
