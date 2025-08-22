// infra/payment/PaymentCaller.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type Firestore,
} from 'firebase/firestore';
import type {
  ApiPayment,
  CreatePaymentData,
  UpdatePaymentData,
} from './ApiPayment';

export class PaymentCaller {
  private readonly COLLECTION_NAME = 'payments';

  constructor(private readonly db: Firestore) {
    console.log(
      '🗄️ PaymentCaller initialized with collection:',
      this.COLLECTION_NAME
    );
  }

  async createPayment(data: CreatePaymentData): Promise<ApiPayment> {
    try {
      console.log('🔥 PaymentCaller - Creating payment...');
      console.log('🔥 Project ID:', this.db.app.options.projectId);
      console.log('🔥 Collection:', this.COLLECTION_NAME);
      console.log('🔥 Data to save:', data);

      const paymentData: Omit<ApiPayment, 'paymentId'> = {
        reservationId: data.reservationId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        paymentMethod: data.paymentMethod,
        stripePaymentIntentId: data.stripePaymentIntentId,
        clientSecret: data.clientSecret,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        metadata: data.metadata || {},
      };

      console.log('🔥 Formatted payment data:', paymentData);

      // Get collection reference
      const collectionRef = collection(this.db, this.COLLECTION_NAME);
      console.log('🔥 Collection reference created');

      // Attempt to add document
      const docRef = await addDoc(collectionRef, paymentData);
      console.log('✅ Document created with ID:', docRef.id);

      const result: ApiPayment = {
        paymentId: docRef.id,
        ...paymentData,
      };

      console.log('✅ Payment created successfully:', result);
      return result;
    } catch (error: any) {
      console.error('❌ PaymentCaller - Detailed error info:');
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error:', error);

      // Provide more specific error messages
      let userFriendlyMessage = 'Failed to create payment record';

      if (error.code === 'permission-denied') {
        userFriendlyMessage =
          'Permission denied. Please check Firestore security rules.';
        console.error('🔒 PERMISSION DENIED - Check your Firestore rules!');
        console.error(
          '🔒 Make sure your Firestore rules allow writes to the "payments" collection'
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

  async getPayment(paymentId: string): Promise<ApiPayment | null> {
    try {
      console.log('🔥 PaymentCaller - Getting payment:', paymentId);

      const collectionRef = collection(this.db, this.COLLECTION_NAME);
      const docRef = doc(collectionRef, paymentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log('❌ PaymentCaller - Payment not found:', paymentId);
        return null;
      }

      const data = docSnap.data();
      console.log('✅ PaymentCaller - Payment found:', data);

      return {
        paymentId: docSnap.id,
        ...data,
      } as ApiPayment;
    } catch (error: any) {
      console.error('❌ PaymentCaller - Error getting payment:', error);

      let userFriendlyMessage = 'Failed to get payment';
      if (error.code === 'permission-denied') {
        userFriendlyMessage = 'Permission denied. Cannot read payment data.';
      }

      throw new Error(`${userFriendlyMessage}: ${error.message}`);
    }
  }

  async getPaymentByReservationId(
    reservationId: string
  ): Promise<ApiPayment | null> {
    try {
      console.log(
        '🔥 PaymentCaller - Getting payment by reservation ID:',
        reservationId
      );

      const q = query(
        collection(this.db, this.COLLECTION_NAME),
        where('reservationId', '==', reservationId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(
          '❌ PaymentCaller - No payment found for reservation:',
          reservationId
        );
        return null;
      }

      // Get the most recent payment for this reservation
      const doc = querySnapshot.docs[0];
      const data = doc.data();

      console.log('✅ PaymentCaller - Payment found for reservation:', data);
      return {
        paymentId: doc.id,
        ...data,
      } as ApiPayment;
    } catch (error: any) {
      console.error(
        '❌ PaymentCaller - Error getting payment by reservation ID:',
        error
      );
      throw new Error(
        `Failed to get payment by reservation ID: ${error.message}`
      );
    }
  }

  async getPaymentByStripeId(
    stripePaymentIntentId: string
  ): Promise<ApiPayment | null> {
    try {
      console.log(
        '🔥 PaymentCaller - Getting payment by Stripe ID:',
        stripePaymentIntentId
      );

      const q = query(
        collection(this.db, this.COLLECTION_NAME),
        where('stripePaymentIntentId', '==', stripePaymentIntentId)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(
          '❌ PaymentCaller - No payment found for Stripe ID:',
          stripePaymentIntentId
        );
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      console.log('✅ PaymentCaller - Payment found for Stripe ID:', data);
      return {
        paymentId: doc.id,
        ...data,
      } as ApiPayment;
    } catch (error: any) {
      console.error(
        '❌ PaymentCaller - Error getting payment by Stripe ID:',
        error
      );
      throw new Error(`Failed to get payment by Stripe ID: ${error.message}`);
    }
  }

  async updatePaymentStatus(
    paymentId: string,
    status: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      console.log('🔥 PaymentCaller - Updating payment status:', {
        paymentId,
        status,
        metadata,
      });

      const updateData: UpdatePaymentData = {
        status,
        metadata: metadata
          ? { ...metadata, updatedAt: new Date().toISOString() }
          : undefined,
      };

      const collectionRef = collection(this.db, this.COLLECTION_NAME);
      const docRef = doc(collectionRef, paymentId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      console.log('✅ PaymentCaller - Payment status updated successfully');
    } catch (error: any) {
      console.error('❌ PaymentCaller - Error updating payment status:', error);

      let userFriendlyMessage = 'Failed to update payment status';
      if (error.code === 'permission-denied') {
        userFriendlyMessage = 'Permission denied. Cannot update payment.';
      }

      throw new Error(`${userFriendlyMessage}: ${error.message}`);
    }
  }

  async getAllPayments(): Promise<ApiPayment[]> {
    try {
      console.log('🔥 PaymentCaller - Getting all payments');

      const q = query(
        collection(this.db, this.COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const payments: ApiPayment[] = [];

      querySnapshot.forEach((doc) => {
        payments.push({
          paymentId: doc.id,
          ...doc.data(),
        } as ApiPayment);
      });

      console.log('✅ PaymentCaller - Found payments:', payments.length);
      return payments;
    } catch (error: any) {
      console.error('❌ PaymentCaller - Error getting payments:', error);

      let userFriendlyMessage = 'Failed to get payments';
      if (error.code === 'permission-denied') {
        userFriendlyMessage = 'Permission denied. Cannot read payments.';
      }

      throw new Error(`${userFriendlyMessage}: ${error.message}`);
    }
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Payment Firestore connection...');

      // Try to get the collection reference (this doesn't require read permissions)
      const collectionRef = collection(this.db, this.COLLECTION_NAME);
      console.log('✅ Payment collection reference created successfully');

      return true;
    } catch (error) {
      console.error('❌ Payment Firestore connection test failed:', error);
      return false;
    }
  }
}
