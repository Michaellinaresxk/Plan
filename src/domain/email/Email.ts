// domain/email/Email.ts

import type { CreateEmailData } from '@/infra/email/ApiEmail';

export type EmailStatus =
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'bounced';
export type EmailType =
  | 'payment_confirmation'
  | 'reminder'
  | 'review'
  | 'invoice';

/**
 * Email - Entidad de dominio
 *
 * Propiedades inmutables, constructor privado
 * Factory methods para crear instancias válidas
 *
 * Mejora: Sin undefined en campos opcionales
 * Los fields opcionales se definen solo cuando existen
 */
export class Email {
  private constructor(
    public readonly emailId: string,
    public readonly reservationId: string,
    public readonly bookingId: string,
    public readonly clientEmail: string,
    public readonly clientName: string,
    public readonly serviceName: string,
    public readonly emailType: EmailType,
    public readonly status: EmailStatus,
    public readonly totalPrice: number,
    public readonly currency: string,
    public readonly createdAt: Date,
    // Campos opcionales - solo existen si tienen valor
    public readonly messageId?: string,
    public readonly receiptUrl?: string,
    public readonly sentAt?: Date,
    public readonly deliveredAt?: Date,
    public readonly metadata?: Record<string, any>
  ) {}

  /**
   * Crear nuevo Email para enviar
   *
   * ¿Qué recibe?: Solo datos obligatorios
   * ¿Qué devuelve?: Email con:
   *   - emailId generado
   *   - status = 'pending'
   *   - createdAt = ahora
   *   - Sin messageId (no existe aún)
   *   - Sin sentAt (no enviado aún)
   */
  static create(data: CreateEmailData): Email {
    return new Email(
      this.generateId(),
      data.reservationId,
      data.bookingId,
      data.clientEmail,
      data.clientName,
      data.serviceName,
      data.emailType,
      'pending',
      data.totalPrice,
      data.currency,
      new Date()
      // No pasamos messageId, sentAt, deliveredAt
      // porque no existen aún
    );
  }

  /**
   * Crear desde datos existentes (ej: traer de Firebase)
   *
   * ¿Qué recibe?: Todos los datos (puede tener messageId, sentAt, etc)
   * ¿Qué devuelve?: Email completo con todos los datos
   */
  static fromProperties(properties: {
    emailId: string;
    reservationId: string;
    bookingId: string;
    clientEmail: string;
    clientName: string;
    serviceName: string;
    emailType: EmailType;
    status: EmailStatus;
    totalPrice: number;
    currency: string;
    createdAt: Date;
    messageId?: string;
    receiptUrl?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    metadata?: Record<string, any>;
  }): Email {
    if (!properties.emailId) {
      throw new Error(
        'EmailId is required when creating from existing properties'
      );
    }

    return new Email(
      properties.emailId,
      properties.reservationId,
      properties.bookingId,
      properties.clientEmail,
      properties.clientName,
      properties.serviceName,
      properties.emailType,
      properties.status,
      properties.totalPrice,
      properties.currency,
      properties.createdAt,
      properties.messageId,
      properties.receiptUrl,
      properties.sentAt,
      properties.deliveredAt,
      properties.metadata
    );
  }

  /**
   * Generar ID único para email
   * Formato: email_{timestamp}_{random}
   */
  private static generateId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
