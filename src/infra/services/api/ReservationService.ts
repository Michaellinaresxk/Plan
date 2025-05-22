// src/services/ReservationService.ts
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { Service, BookingDate } from '../types/type';

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'paid';

export interface Reservation {
  id?: string;
  service: Service;
  customer: {
    name: string;
    email: string;
    phone: string;
    // Additional customer info
  };
  bookingDate: BookingDate;
  guests: number;
  status: ReservationStatus;
  createdAt?: any;
  updatedAt?: any;
  confirmationData?: {
    confirmedBy: string;
    confirmationDate: any;
    notes?: string;
  };
  paymentToken?: string;
  paymentLink?: string;
  paymentStatus?: string;
  additionalData?: any; // For service-specific data
}

class ReservationService {
  /**
   * Create a new reservation in pending status
   */
  async createReservation(
    service: Service,
    bookingDate: BookingDate,
    guests: number,
    customerInfo: {
      name: string;
      email: string;
      phone: string;
    },
    additionalData?: any
  ): Promise<{ success: boolean; reservationId?: string; error?: string }> {
    try {
      // Create the reservation object
      const reservation: Reservation = {
        service,
        bookingDate,
        guests,
        customer: customerInfo,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        additionalData,
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'reservations'), reservation);

      console.log('Reservation created with ID:', docRef.id);

      return {
        success: true,
        reservationId: docRef.id,
      };
    } catch (error) {
      console.error('Error creating reservation:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get a reservation by ID
   */
  async getReservation(reservationId: string): Promise<Reservation | null> {
    try {
      const docRef = doc(db, 'reservations', reservationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<Reservation, 'id'>;
        return { ...data, id: docSnap.id };
      } else {
        console.log('No such reservation!');
        return null;
      }
    } catch (error) {
      console.error('Error getting reservation:', error);
      return null;
    }
  }

  /**
   * Get reservations by customer email
   */
  async getReservationsByEmail(email: string): Promise<Reservation[]> {
    try {
      const q = query(
        collection(db, 'reservations'),
        where('customer.email', '==', email)
      );

      const querySnapshot = await getDocs(q);
      const reservations: Reservation[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Reservation, 'id'>;
        reservations.push({ ...data, id: doc.id });
      });

      return reservations;
    } catch (error) {
      console.error('Error getting customer reservations:', error);
      return [];
    }
  }

  /**
   * Check payment status for a reservation
   */
  async checkPaymentStatus(reservationId: string): Promise<{
    status: ReservationStatus;
    paymentStatus?: string;
  }> {
    try {
      const reservation = await this.getReservation(reservationId);

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      return {
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }
}

export default new ReservationService();
