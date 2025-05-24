import { ReservationCaller } from '@/infra/reservation/ReservationCaller';
import { ReservationResource } from '@/infra/reservation/ReservationResource';
import { CreateReservationUseCase } from './CreateReservationUseCase';
import { CreateReservationData } from '@/domain/reservation/ReservationRepository';
import { db } from '@/infra/api/FirebaseConfig';

// Dependency injection setup
const reservationCaller = new ReservationCaller(db);
const reservationResource = new ReservationResource(reservationCaller);

export class ReservationService {
  // Use Cases
  private createReservationUseCase: CreateReservationUseCase;

  constructor() {
    this.createReservationUseCase = new CreateReservationUseCase(
      reservationResource
    );
  }

  // Public methods that components will use
  async createReservation(data: CreateReservationData) {
    return await this.createReservationUseCase.execute(data);
  }
}

// Create and export singleton instance
export const reservationService = new ReservationService();
export default reservationService;
