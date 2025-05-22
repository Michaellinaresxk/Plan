export type Reservation = {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  bookingDate: Date;
  status: string;
  totalPrice: number;
  formData: Record<string, any>; // Objeto dinámico con propiedades específicas por servicio
  notes?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
};
