import type { PaymentProperties } from '@/types/properties';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled';
export type PaymentMethod = 'card' | 'paypal' | 'apple_pay' | 'google_pay';

export class Payment {
  private constructor(
    public readonly paymentId: string,
    public readonly reservationId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly status: PaymentStatus,
    public readonly paymentMethod: PaymentMethod,
    public readonly stripePaymentIntentId: string,
    public readonly clientSecret: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly metadata?: Record<string, any>
  ) {}

  static create(
    properties: Omit<PaymentProperties, 'paymentId' | 'createdAt' | 'updatedAt'>
  ): Payment {
    const paymentId = `payment_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const now = new Date();

    return new Payment(
      paymentId,
      properties.reservationId,
      properties.amount,
      properties.currency || 'usd',
      properties.status || 'pending',
      properties.paymentMethod,
      properties.stripePaymentIntentId,
      properties.clientSecret,
      now,
      now,
      properties.metadata
    );
  }

  static fromProperties(properties: PaymentProperties): Payment {
    if (!properties.paymentId) {
      throw new Error(
        'PaymentId is required when creating from existing properties'
      );
    }

    return new Payment(
      properties.paymentId,
      properties.reservationId,
      properties.amount,
      properties.currency,
      properties.status,
      properties.paymentMethod,
      properties.stripePaymentIntentId,
      properties.clientSecret,
      properties.createdAt,
      properties.updatedAt,
      properties.metadata
    );
  }
}
