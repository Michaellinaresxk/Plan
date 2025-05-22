import type Reservation from '@/domain/reservation/Reservation';

export class ReservationView {
  private constructor(
    public readonly bookingId: string,
    public readonly serviceId: string,
    public readonly serviceName: string,
    public readonly bookingDate: Date,
    public readonly status: string,
    public readonly totalPrice: number,
    public readonly formData: Record<string, any>,
    public readonly notes?: string,
    public readonly clientName?: string,
    public readonly clientEmail?: string,
    public readonly clientPhone?: string,
    public readonly timeAgo?: string
  ) {}

  static fromDomain(reservation: Reservation): ReservationView {
    return new ReservationView(
      reservation.bookingId,
      reservation.serviceId,
      reservation.serviceName,
      reservation.bookingDate,
      reservation.status,
      reservation.totalPrice,
      reservation.clientName,
      reservation.clientEmail,
      reservation.clientPhone,
      reservation.formData,
      reservation.notes,
      reservation.timeAgo,
      reservation.isPriority,
      reservation.isNewClient,
      reservation.serviceDate,
      reservation.serviceTime
    );
  }

  // Getters para compatibilidad con el CardFactory existente
  get id(): string {
    return this.bookingId;
  }

  get email(): string {
    return this.clientEmail;
  }

  get phone(): string {
    return this.clientPhone;
  }

  get date(): string {
    return this.serviceDate || this.formatDate(this.bookingDate);
  }

  get time(): string {
    return this.serviceTime || '';
  }

  get service(): string {
    return this.serviceName;
  }

  // Propiedades específicas para diferentes tipos de servicio
  // Estas se extraen del formData según el tipo de servicio

  // Airport Transfer
  get flightNumber(): string | undefined {
    return this.formData.flightNumber;
  }

  get vehicleType(): string | undefined {
    return this.formData.vehicleType;
  }

  get passengerCount(): number | undefined {
    return this.formData.passengerCount;
  }

  get kidsCount(): number | undefined {
    return this.formData.kidsCount;
  }

  get needsCarSeat(): boolean | undefined {
    return this.formData.needsCarSeat;
  }

  get carSeatCount(): number | undefined {
    return this.formData.carSeatCount;
  }

  get isRoundTrip(): boolean | undefined {
    return this.formData.isRoundTrip;
  }

  get returnDate(): string | undefined {
    return this.formData.returnDate;
  }

  get returnFlightNumber(): string | undefined {
    return this.formData.returnFlightNumber;
  }

  // Babysitter
  get childrenCount(): number | undefined {
    return this.formData.childrenCount;
  }

  get childrenAges(): string[] | undefined {
    return this.formData.childrenAges;
  }

  get startTime(): string | undefined {
    return this.formData.startTime;
  }

  get endTime(): string | undefined {
    return this.formData.endTime;
  }

  get hasSpecialNeeds(): boolean | undefined {
    return this.formData.hasSpecialNeeds;
  }

  get specialNeedsDetails(): string | undefined {
    return this.formData.specialNeedsDetails;
  }

  get specialRequests(): string | undefined {
    return this.formData.specialRequests;
  }

  // Custom Decoration
  get occasion(): string | undefined {
    return this.formData.occasion;
  }

  get location(): string | undefined {
    return this.formData.location;
  }

  get exactAddress(): string | undefined {
    return this.formData.exactAddress;
  }

  get colors(): string[] | undefined {
    return this.formData.colors;
  }

  get referenceImage(): string | undefined {
    return this.formData.referenceImage;
  }

  // Grocery Shopping
  get deliveryAddress(): string | undefined {
    return this.formData.deliveryAddress;
  }

  get hour(): string | undefined {
    return this.formData.hour;
  }

  get items():
    | Array<{ name: string; quantity: number; note?: string }>
    | undefined {
    return this.formData.items;
  }

  get hasAllergies(): 'yes' | 'no' | undefined {
    return this.formData.hasAllergies;
  }

  get allergyDetails(): string | undefined {
    return this.formData.allergyDetails;
  }

  get foodRestrictions(): string | undefined {
    return this.formData.foodRestrictions;
  }

  // Métodos de utilidad para formateo
  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatPrice(): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(this.totalPrice);
  }

  formatBookingDate(): string {
    return this.bookingDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Métodos de estado
  isPendingStatus(): boolean {
    return this.status === 'pending';
  }

  isApprovedStatus(): boolean {
    return this.status === 'approved';
  }

  isRejectedStatus(): boolean {
    return this.status === 'rejected';
  }

  isCompletedStatus(): boolean {
    return this.status === 'completed';
  }

  isCancelledStatus(): boolean {
    return this.status === 'cancelled';
  }

  // Método para obtener el objeto plano compatible con los componentes existentes
  toPlainObject(): any {
    return {
      id: this.bookingId,
      bookingId: this.bookingId,
      clientName: this.clientName,
      clientEmail: this.clientEmail,
      clientPhone: this.clientPhone,
      email: this.clientEmail,
      phone: this.clientPhone,
      service: this.serviceName,
      serviceName: this.serviceName,
      serviceId: this.serviceId,
      date: this.date,
      time: this.time,
      status: this.status,
      totalPrice: this.totalPrice,
      notes: this.notes,
      timeAgo: this.timeAgo,
      isPriority: this.isPriority,
      isNewClient: this.isNewClient,
      bookingDate: this.bookingDate,

      // Propiedades específicas del formData
      ...this.formData,
    };
  }
}
