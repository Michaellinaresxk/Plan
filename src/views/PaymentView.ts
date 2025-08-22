import type { Payment, PaymentStatus, PaymentMethod } from './';

export class PaymentView {
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

  static fromDomain(payment: Payment): PaymentView {
    return new PaymentView(
      payment.paymentId,
      payment.reservationId,
      payment.amount,
      payment.currency,
      payment.status,
      payment.paymentMethod,
      payment.stripePaymentIntentId,
      payment.clientSecret,
      payment.createdAt,
      payment.updatedAt,
      payment.metadata
    );
  }
}
