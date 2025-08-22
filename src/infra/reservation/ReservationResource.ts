import type ReservationRepository from '@/domain/reservation/ReservationRepository';
import type { ReservationStatus } from '@/types/reservation';
import { Reservation } from '@/domain/reservation/Reservation';
import { ReservationCaller } from './ReservationCaller';
import type { ApiReservation, CreateReservationData } from './ApiReservation';

export class ReservationResource implements ReservationRepository {
  constructor(private readonly reservationCaller: ReservationCaller) {
    console.log('🏗️ ReservationResource initialized');
  }

  async createReservation(data: CreateReservationData): Promise<Reservation> {
    try {
      console.log('🏗️ ReservationResource - Creating reservation:', data);

      const apiReservation = await this.reservationCaller.createReservation(
        data
      );
      console.log(
        '🏗️ ReservationResource - API reservation created:',
        apiReservation
      );

      const domainReservation = this.toDomainReservation(apiReservation);
      console.log(
        '✅ ReservationResource - Domain reservation created:',
        domainReservation.bookingId
      );

      return domainReservation;
    } catch (error) {
      console.error(
        '❌ ReservationResource - Error creating reservation:',
        error
      );
      throw error;
    }
  }

  private toDomainReservation(apiReservation: ApiReservation): Reservation {
    console.log(
      '🔄 Converting API reservation to domain reservation:',
      apiReservation
    );

    if (!apiReservation.bookingId) {
      throw new Error('API Reservation must have a bookingId');
    }

    try {
      // Convert Firestore Timestamp to Date
      const bookingDate =
        apiReservation.bookingDate instanceof Date
          ? apiReservation.bookingDate
          : apiReservation.bookingDate.toDate(); // For Firestore Timestamp

      const domainReservation = Reservation.fromProperties({
        bookingId: apiReservation.bookingId,
        serviceId: apiReservation.serviceId,
        serviceName: apiReservation.serviceName,
        bookingDate: bookingDate,
        status: apiReservation.status as ReservationStatus,
        totalPrice: apiReservation.totalPrice,
        clientName: apiReservation.clientName,
        clientEmail: apiReservation.clientEmail,
        clientPhone: apiReservation.clientPhone,
        formData: apiReservation.formData || {},
        notes: apiReservation.notes,
      });

      console.log(
        '✅ Domain reservation created successfully:',
        domainReservation.bookingId
      );
      return domainReservation;
    } catch (conversionError) {
      console.error(
        '❌ Error converting to domain reservation:',
        conversionError
      );
      throw new Error(
        `Failed to convert reservation: ${
          conversionError instanceof Error
            ? conversionError.message
            : 'Unknown error'
        }`
      );
    }
  }
}
