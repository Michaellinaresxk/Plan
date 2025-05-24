import type ReservationRepository from '@/domain/reservation/ReservationRepository';
import type { CreateReservationData } from '@/infra/reservation/ApiReservation';
import { Reservation } from '@/domain/reservation/Reservation';

export class CreateReservationUseCase {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async execute(data: CreateReservationData): Promise<Reservation> {
    try {
      console.log('🎯 CreateReservationUseCase - Executing with data:', data);

      // Validate input data
      this.validateReservationData(data);

      // Create the reservation
      const reservation = await this.reservationRepository.createReservation(
        data
      );

      console.log(
        '✅ CreateReservationUseCase - Reservation created successfully:',
        reservation.bookingId
      );

      // Here you could add additional business logic like:
      // - Send confirmation email
      // - Log the event
      // - Trigger notifications

      return reservation;
    } catch (error) {
      console.error(
        '❌ CreateReservationUseCase - Error creating reservation:',
        error
      );
      throw error;
    }
  }

  private validateReservationData(data: CreateReservationData): void {
    if (!data.serviceId?.trim()) {
      throw new Error('Service ID is required');
    }

    if (!data.serviceName?.trim()) {
      throw new Error('Service name is required');
    }

    if (!data.clientName?.trim()) {
      throw new Error('Client name is required');
    }

    if (!data.clientEmail?.trim()) {
      throw new Error('Client email is required');
    }

    if (!data.clientPhone?.trim()) {
      throw new Error('Client phone is required');
    }

    if (!data.totalPrice || data.totalPrice <= 0) {
      throw new Error('Total price must be greater than 0');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.clientEmail)) {
      throw new Error('Invalid email format');
    }

    console.log('✅ CreateReservationUseCase - Data validation passed');
  }
}
