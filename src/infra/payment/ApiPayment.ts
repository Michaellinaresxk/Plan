// infra/payment/ApiPayment.ts
import type { Timestamp } from 'firebase/firestore';

export interface ApiPayment {
  paymentId?: string; // Optional because Firestore auto-generates
  reservationId: string;
  amount: number; // in cents
  currency: string;
  status: string; // 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  paymentMethod: string; // 'card' | 'paypal' | 'apple_pay' | 'google_pay'
  stripePaymentIntentId: string;
  clientSecret: string;
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
  stripePaymentIntentId: string;
  clientSecret: string;
  metadata?: Record<string, any>;
}

export interface UpdatePaymentData {
  status?: string;
  metadata?: Record<string, any>;
}
