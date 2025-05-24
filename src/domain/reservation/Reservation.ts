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
    public readonly formData: Record<string, any>,
    public readonly notes?: string
  ) {}

  static create(
    properties: Omit<ReservationProperties, 'bookingId'>
  ): Reservation {
    // Auto-generate a temporary ID if not provided (Firebase will replace it)
    const bookingId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return new Reservation(
      bookingId,
      properties.serviceId,
      properties.serviceName,
      properties.bookingDate,
      properties.status || 'pending',
      properties.totalPrice,
      properties.clientName,
      properties.clientEmail,
      properties.clientPhone,
      properties.formData || {},
      properties.notes
    );
  }

  static fromProperties(properties: ReservationProperties): Reservation {
    if (!properties.bookingId) {
      throw new Error(
        'BookingId is required when creating from existing properties'
      );
    }

    return new Reservation(
      properties.bookingId,
      properties.serviceId,
      properties.serviceName,
      properties.bookingDate,
      properties.status,
      properties.totalPrice,
      properties.clientName,
      properties.clientEmail,
      properties.clientPhone,
      properties.formData || {},
      properties.notes
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

  // Business logic methods
  canBeModified(): boolean {
    return this.status === 'pending';
  }

  isConfirmed(): boolean {
    return this.status === 'approved';
  }

  isPending(): boolean {
    return this.status === 'pending';
  }
}
