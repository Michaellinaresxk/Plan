import type { Email } from '@/domain/email/Email';

export class EmailView {
  private constructor(
    public readonly emailId: string,
    public readonly reservationId: string,
    public readonly bookingId: string,
    public readonly clientEmail: string,
    public readonly clientName: string,
    public readonly serviceName: string,
    public readonly emailType: string,
    public readonly status: string,
    public readonly totalPrice: number,
    public readonly currency: string,
    public readonly messageId?: string,
    public readonly receiptUrl?: string,
    public readonly createdAt?: Date,
    public readonly sentAt?: Date,
    public readonly deliveredAt?: Date,
    public readonly metadata?: Record<string, any>
  ) {}

  static fromDomain(email: Email): EmailView {
    return new EmailView(
      email.emailId,
      email.reservationId,
      email.bookingId,
      email.clientEmail,
      email.clientName,
      email.serviceName,
      email.emailType,
      email.status,
      email.totalPrice,
      email.currency,
      email.messageId,
      email.receiptUrl,
      email.createdAt,
      email.sentAt,
      email.deliveredAt,
      email.metadata
    );
  }
}
