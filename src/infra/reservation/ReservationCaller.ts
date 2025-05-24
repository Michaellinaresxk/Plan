import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type Firestore,
  type DocumentReference,
  type DocumentData,
} from 'firebase/firestore';
import type {
  ApiReservation,
  CreateReservationData,
  UpdateReservationData,
} from './ApiReservation';

export class ReservationCaller {
  private readonly COLLECTION_NAME = 'bookings';

  constructor(private readonly db: Firestore) {
    console.log(
      '🏗️ ReservationCaller initialized with collection:',
      this.COLLECTION_NAME
    );
  }

  async createReservation(
    data: CreateReservationData
  ): Promise<ApiReservation> {
    try {
      console.log('🔥 ReservationCaller - Creating reservation...');
      console.log('🔥 Project ID:', this.db.app.options.projectId);
      console.log('🔥 Collection:', this.COLLECTION_NAME);
      console.log('🔥 Data to save:', data);

      const reservationData: Omit<ApiReservation, 'bookingId'> = {
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        bookingDate: Timestamp.fromDate(new Date()),
        status: 'pending',
        totalPrice: data.totalPrice,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        formData: data.formData || {},
        notes: data.notes || '',
      };

      console.log('🔥 Formatted reservation data:', reservationData);

      // Get collection reference
      const collectionRef = collection(this.db, this.COLLECTION_NAME);
      console.log('🔥 Collection reference created');

      // Attempt to add document
      const docRef = await addDoc(collectionRef, reservationData);
      console.log('✅ Document created with ID:', docRef.id);

      const result: ApiReservation = {
        bookingId: docRef.id,
        ...reservationData,
      };

      console.log('✅ Reservation created successfully:', result);
      return result;
    } catch (error: any) {
      console.error('❌ ReservationCaller - Detailed error info:');
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error:', error);

      // Provide more specific error messages
      let userFriendlyMessage = 'Failed to create reservation';

      if (error.code === 'permission-denied') {
        userFriendlyMessage =
          'Permission denied. Please check Firestore security rules.';
        console.error('🔒 PERMISSION DENIED - Check your Firestore rules!');
        console.error(
          '🔒 Make sure your Firestore rules allow writes to the "bookings" collection'
        );
      } else if (error.code === 'unavailable') {
        userFriendlyMessage =
          'Firestore service is currently unavailable. Please try again.';
      } else if (error.code === 'not-found') {
        userFriendlyMessage =
          'Firestore database not found. Check your Firebase configuration.';
      }

      throw new Error(`${userFriendlyMessage}: ${error.message}`);
    }
  }

  // async getReservation(bookingId: string): Promise<ApiReservation | null> {
  //   try {
  //     console.log('🔥 ReservationCaller - Getting reservation:', bookingId);

  //     const docRef = doc(this.db, this.COLLECTION_NAME, bookingId);
  //     const docSnap = await getDoc(docRef);

  //     if (!docSnap.exists()) {
  //       console.log('❌ ReservationCaller - Reservation not found:', bookingId);
  //       return null;
  //     }

  //     const data = docSnap.data();
  //     console.log('✅ ReservationCaller - Reservation found:', data);

  //     return {
  //       bookingId: docSnap.id,
  //       ...data,
  //     } as ApiReservation;
  //   } catch (error: any) {
  //     console.error('❌ ReservationCaller - Error getting reservation:', error);

  //     let userFriendlyMessage = 'Failed to get reservation';
  //     if (error.code === 'permission-denied') {
  //       userFriendlyMessage =
  //         'Permission denied. Cannot read reservation data.';
  //     }

  //     throw new Error(`${userFriendlyMessage}: ${error.message}`);
  //   }
  // }

  // async updateReservation(
  //   bookingId: string,
  //   data: UpdateReservationData
  // ): Promise<void> {
  //   try {
  //     console.log(
  //       '🔥 ReservationCaller - Updating reservation:',
  //       bookingId,
  //       data
  //     );

  //     const docRef = doc(this.db, this.COLLECTION_NAME, bookingId);
  //     await updateDoc(docRef, data);

  //     console.log('✅ ReservationCaller - Reservation updated successfully');
  //   } catch (error: any) {
  //     console.error(
  //       '❌ ReservationCaller - Error updating reservation:',
  //       error
  //     );

  //     let userFriendlyMessage = 'Failed to update reservation';
  //     if (error.code === 'permission-denied') {
  //       userFriendlyMessage = 'Permission denied. Cannot update reservation.';
  //     }

  //     throw new Error(`${userFriendlyMessage}: ${error.message}`);
  //   }
  // }

  // async getAllReservations(): Promise<ApiReservation[]> {
  //   try {
  //     console.log('🔥 ReservationCaller - Getting all reservations');

  //     const q = query(
  //       collection(this.db, this.COLLECTION_NAME),
  //       orderBy('bookingDate', 'desc')
  //     );

  //     const querySnapshot = await getDocs(q);
  //     const reservations: ApiReservation[] = [];

  //     querySnapshot.forEach((doc) => {
  //       reservations.push({
  //         bookingId: doc.id,
  //         ...doc.data(),
  //       } as ApiReservation);
  //     });

  //     console.log(
  //       '✅ ReservationCaller - Found reservations:',
  //       reservations.length
  //     );
  //     return reservations;
  //   } catch (error: any) {
  //     console.error(
  //       '❌ ReservationCaller - Error getting reservations:',
  //       error
  //     );

  //     let userFriendlyMessage = 'Failed to get reservations';
  //     if (error.code === 'permission-denied') {
  //       userFriendlyMessage = 'Permission denied. Cannot read reservations.';
  //     }

  //     throw new Error(`${userFriendlyMessage}: ${error.message}`);
  //   }
  // }

  // // Test connection method
  // async testConnection(): Promise<boolean> {
  //   try {
  //     console.log('🧪 Testing Firestore connection...');

  //     // Try to get the collection reference (this doesn't require read permissions)
  //     const collectionRef = collection(this.db, this.COLLECTION_NAME);
  //     console.log('✅ Collection reference created successfully');

  //     return true;
  //   } catch (error) {
  //     console.error('❌ Firestore connection test failed:', error);
  //     return false;
  //   }
  // }
}
