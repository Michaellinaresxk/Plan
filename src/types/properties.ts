import { PaymentMethod, PaymentStatus } from '@/domain/payment/Payment';

export type ReservationProperties = {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  bookingDate: Date;
  status: string;
  totalPrice: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  formData: Record<string, any>; // Objeto dinámico con propiedades específicas por servicio
  notes?: string;
};

export type PaymentProperties = {
  paymentId: string;
  reservationId: string;
  amount: number; // in cents
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  stripePaymentIntentId: string;
  clientSecret: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
};
