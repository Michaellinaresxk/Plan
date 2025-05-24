import { ReservationCaller } from '@/infra/reservation/ReservationCaller';
import { db } from '@/infra/api/FirebaseConfig';
import { ReservationResource } from '@/infra/reservation/ReservationResource';
import { ReservationService } from '@/primary/Reservation/useCases';

// Crear la cadena de dependencias
const reservationCaller = new ReservationCaller(db);
const reservationResource = new ReservationResource(reservationCaller);
const reservationService = new ReservationService(reservationResource);

export { reservationService };
