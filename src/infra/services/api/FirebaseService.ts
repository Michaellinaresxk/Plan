import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Replace with your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'paid'
  | 'cancelled';

export interface Reservation {
  id: string;
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    // Other service fields
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    // Additional customer info
  };
  bookingDate: {
    startDate: Timestamp | Date;
    endDate?: Timestamp | Date;
  };
  guests: number;
  status: ReservationStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmationData?: {
    confirmedBy: string;
    confirmationDate: Timestamp;
    notes?: string;
  };
  paymentToken?: string;
  paymentLink?: string;
  paymentStatus?: string;
  additionalData?: any; // For service-specific data
}

// Convert Firestore document to Reservation
function convertDoc(doc: QueryDocumentSnapshot<DocumentData>): Reservation {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    // Ensure dates are handled properly
    createdAt: data.createdAt || Timestamp.now(),
    updatedAt: data.updatedAt || Timestamp.now(),
    bookingDate: {
      startDate: data.bookingDate?.startDate || Timestamp.now(),
      endDate: data.bookingDate?.endDate,
    },
  } as Reservation;
}

class FirebaseService {
  /**
   * Get all pending reservations
   */
  async getPendingReservations(): Promise<Reservation[]> {
    try {
      const q = query(
        collection(db, 'reservations'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reservations: Reservation[] = [];

      querySnapshot.forEach((doc) => {
        reservations.push(convertDoc(doc));
      });

      return reservations;
    } catch (error) {
      console.error('Error getting pending reservations:', error);
      throw error;
    }
  }

  /**
   * Get all reservations with pagination
   */
  async getAllReservations(
    statusFilter?: ReservationStatus,
    pageSize: number = 10,
    lastDoc?: DocumentData
  ): Promise<{ reservations: Reservation[]; lastDoc: DocumentData | null }> {
    try {
      let q: any;

      if (statusFilter) {
        q = query(
          collection(db, 'reservations'),
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      } else {
        q = query(
          collection(db, 'reservations'),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      }

      // Start after the last document for pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const reservations: Reservation[] = [];

      let lastVisible = null;

      querySnapshot.forEach((doc) => {
        reservations.push(convertDoc(doc));
        lastVisible = doc;
      });

      return {
        reservations,
        lastDoc: lastVisible,
      };
    } catch (error) {
      console.error('Error getting reservations:', error);
      throw error;
    }
  }

  /**
   * Get a single reservation by ID
   */
  async getReservation(id: string): Promise<Reservation | null> {
    try {
      const docRef = doc(db, 'reservations', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt || Timestamp.now(),
          bookingDate: {
            startDate: data.bookingDate?.startDate || Timestamp.now(),
            endDate: data.bookingDate?.endDate,
          },
        } as Reservation;
      }

      return null;
    } catch (error) {
      console.error('Error getting reservation:', error);
      throw error;
    }
  }

  /**
   * Confirm a reservation and generate payment link
   */
  async confirmReservation(
    reservationId: string,
    adminName: string,
    notes?: string
  ): Promise<{ success: boolean; paymentLink?: string; error?: string }> {
    try {
      const reservation = await this.getReservation(reservationId);

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      if (reservation.status !== 'pending') {
        throw new Error(`Reservation is already ${reservation.status}`);
      }

      // Generate a unique payment token
      const paymentToken = uuidv4();

      // Create a payment link (in a real implementation, this might integrate with a payment gateway)
      const paymentLink = `${window.location.origin}/payment/${paymentToken}`;

      // Update the reservation in Firestore
      const reservationRef = doc(db, 'reservations', reservationId);
      await updateDoc(reservationRef, {
        status: 'confirmed',
        updatedAt: serverTimestamp(),
        confirmationData: {
          confirmedBy: adminName,
          confirmationDate: serverTimestamp(),
          notes: notes || '',
        },
        paymentToken,
        paymentLink,
      });

      return {
        success: true,
        paymentLink,
      };
    } catch (error) {
      console.error('Error confirming reservation:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  /**
   * Reject a reservation
   */
  async rejectReservation(
    reservationId: string,
    adminName: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const reservation = await this.getReservation(reservationId);

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      if (reservation.status !== 'pending') {
        throw new Error(`Reservation is already ${reservation.status}`);
      }

      // Update the reservation in Firestore
      const reservationRef = doc(db, 'reservations', reservationId);
      await updateDoc(reservationRef, {
        status: 'rejected',
        updatedAt: serverTimestamp(),
        confirmationData: {
          confirmedBy: adminName,
          confirmationDate: serverTimestamp(),
          notes: reason || 'Reservation rejected by admin',
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error rejecting reservation:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  /**
   * Mark a reservation as paid (typically called by a webhook or after payment confirmation)
   */
  async markReservationAsPaid(
    reservationId: string,
    paymentDetails?: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const reservation = await this.getReservation(reservationId);

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      if (reservation.status !== 'confirmed') {
        throw new Error(`Reservation must be confirmed before marking as paid`);
      }

      // Update the reservation in Firestore
      const reservationRef = doc(db, 'reservations', reservationId);
      await updateDoc(reservationRef, {
        status: 'paid',
        updatedAt: serverTimestamp(),
        paymentStatus: 'completed',
        paymentDetails: paymentDetails || {},
      });

      return { success: true };
    } catch (error) {
      console.error('Error marking reservation as paid:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  /**
   * Search reservations by customer email or name
   */
  async searchReservations(searchTerm: string): Promise<Reservation[]> {
    try {
      // Search by email (exact match)
      const emailQuery = query(
        collection(db, 'reservations'),
        where('customer.email', '==', searchTerm.toLowerCase()),
        orderBy('createdAt', 'desc')
      );

      const emailSnapshot = await getDocs(emailQuery);
      const reservations: Reservation[] = [];

      emailSnapshot.forEach((doc) => {
        reservations.push(convertDoc(doc));
      });

      // If no results, try to search by name (contains)
      // Note: Firestore doesn't support native contains queries
      // For a proper implementation, consider using Algolia or Firestore's array-contains
      if (reservations.length === 0) {
        const allQuery = query(
          collection(db, 'reservations'),
          orderBy('createdAt', 'desc'),
          limit(100) // Limiting to avoid excessive reads
        );

        const allSnapshot = await getDocs(allQuery);

        allSnapshot.forEach((doc) => {
          const data = doc.data();
          // Simple client-side filtering by name
          if (
            data.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            reservations.push(convertDoc(doc));
          }
        });
      }

      return reservations;
    } catch (error) {
      console.error('Error searching reservations:', error);
      throw error;
    }
  }
}

export default new FirebaseService();
