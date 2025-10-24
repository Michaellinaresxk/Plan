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

export interface PaymentProperties {
  paymentId: string;
  reservationId: string;
  amount: number; // en centavos
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'canceled';
  paymentMethod: 'card' | 'google_pay' | 'apple_pay';
  squarePaymentId: string; // ID del pago en Square
  receiptUrl?: string; // URL del recibo de Square
  receiptNumber?: string; // Número de recibo de Square
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}
