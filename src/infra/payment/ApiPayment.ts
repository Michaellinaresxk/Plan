// infra/payment/ApiPayment.ts
import type { Timestamp } from 'firebase/firestore';

export interface ApiPayment {
  paymentId?: string; // Optional porque Firestore auto-genera
  reservationId: string;
  amount: number; // en centavos
  currency: string;
  status: string; // 'pending' | 'processing' | 'completed' | 'failed' | 'canceled'
  paymentMethod: string; // 'card' | 'google_pay' | 'apple_pay'
  squarePaymentId: string; // ID del pago en Square
  receiptUrl?: string; // URL del recibo de Square
  receiptNumber?: string; // Número de recibo de Square
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: Record<string, any>;
}

export interface CreatePaymentData {
  reservationId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  squarePaymentId: string;
  receiptUrl?: string;
  receiptNumber?: string;
  metadata?: Record<string, any>;
}

export interface UpdatePaymentData {
  status?: string;
  metadata?: Record<string, any>;
}
