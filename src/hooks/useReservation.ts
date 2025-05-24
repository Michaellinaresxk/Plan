import { useState, useCallback } from 'react';
import type { CreateReservationData } from '@/domain/reservation/ReservationRepository';
import type { Reservation } from '@/domain/reservation/Reservation';
import { reservationService } from '@/services/Reservation';

interface UseReservationResult {
  createReservation: (data: CreateReservationData) => Promise<Reservation>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useReservation = (): UseReservationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReservation = useCallback(
    async (data: CreateReservationData): Promise<Reservation> => {
      console.log('🪝 useReservation - Creating reservation...');
      setIsLoading(true);
      setError(null);

      try {
        const reservation = await reservationService.createReservation(data);
        console.log(
          '✅ useReservation - Reservation created successfully:',
          reservation.bookingId
        );
        return reservation;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        console.error('❌ useReservation - Error:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createReservation,
    isLoading,
    error,
    clearError,
  };
};
