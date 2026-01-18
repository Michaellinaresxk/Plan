import type { Timestamp } from 'firebase/firestore';

export interface ApiEmail {
  emailId?: string;
  reservationId: string;
  bookingId: string;
  clientEmail: string;
  clientName: string;
  serviceName: string;
  emailType: 'payment_confirmation' | 'reminder' | 'review' | 'invoice';
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  totalPrice: number;
  currency: string;
  messageId?: string;
  receiptUrl?: string;
  createdAt: Timestamp;
  sentAt?: Timestamp;
  deliveredAt?: Timestamp;
  metadata?: Record<string, any>;
}

export interface CreateEmailData {
  reservationId: string;
  bookingId: string;
  clientEmail: string;
  clientName: string;
  serviceName: string;
  emailType: 'payment_confirmation' | 'reminder' | 'review' | 'invoice';
  totalPrice: number;
  currency: string;
  metadata?: Record<string, any>;
}

export interface UpdateEmailData {
  status?: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  messageId?: string;
  receiptUrl?: string;
  sentAt?: Timestamp;
  deliveredAt?: Timestamp;
  metadata?: Record<string, any>;
}
