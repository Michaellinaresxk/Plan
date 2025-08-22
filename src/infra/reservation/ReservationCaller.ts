// infra/reservation/ReservationCaller.ts (ACTUALIZADO)
import {
  collection,
  doc,
  addDoc,
  Timestamp,
  type Firestore,
} from 'firebase/firestore';
import type { ApiReservation, CreateReservationData } from './ApiReservation';
import { DataSanitizer, FirestoreErrorHandler } from '@/utils/dataSanitizer';

export class ReservationCaller {
  private readonly COLLECTION_NAME = 'bookings';

  constructor(private readonly db: Firestore) {
    console.log(
      '🗃️ ReservationCaller initialized with collection:',
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
      console.log('🔥 Raw input data:', data);

      // Step 1: Validate input data
      const validation = DataSanitizer.validateReservationData(data);
      if (!validation.isValid) {
        const errorMessage = `Validation failed: ${validation.errors.join(
          ', '
        )}`;
        console.error('❌ Validation errors:', validation.errors);
        throw new Error(errorMessage);
      }

      // Step 2: Sanitize data for Firestore
      const sanitizedData = DataSanitizer.sanitizeReservationData(data);
      console.log('🧹 Sanitized data:', sanitizedData);

      // Step 3: Create reservation document structure
      const reservationData: Omit<ApiReservation, 'bookingId'> = {
        serviceId: sanitizedData.serviceId,
        serviceName: sanitizedData.serviceName,
        bookingDate: Timestamp.fromDate(new Date()),
        status: 'pending',
        totalPrice: sanitizedData.totalPrice,
        clientName: sanitizedData.clientName,
        clientEmail: sanitizedData.clientEmail,
        clientPhone: sanitizedData.clientPhone,
        formData: sanitizedData.formData,
        notes: sanitizedData.notes,
      };

      console.log('🔥 Final reservation data for Firestore:', reservationData);

      // Step 4: Validate collection and document structure
      const collectionRef = collection(this.db, this.COLLECTION_NAME);
      console.log('🔥 Collection reference created successfully');

      // Step 5: Generate safe document ID (optional - let Firestore auto-generate)
      // const docId = DataSanitizer.generateSafeDocumentId('reservation');
      // console.log('🆔 Generated safe document ID:', docId);

      // Step 6: Add document to Firestore
      console.log('🔥 Attempting to add document to Firestore...');
      const docRef = await addDoc(collectionRef, reservationData);
      console.log('✅ Document created with ID:', docRef.id);

      // Step 7: Validate generated document ID
      if (!DataSanitizer.isValidDocumentId(docRef.id)) {
        console.warn('⚠️ Generated document ID may have issues:', docRef.id);
      }

      const result: ApiReservation = {
        bookingId: docRef.id,
        ...reservationData,
      };

      console.log('✅ Reservation created successfully:', result);
      return result;
    } catch (error: any) {
      console.error('❌ ReservationCaller - Detailed error info:');

      // Use error handler to parse and log the error properly
      const parsedError = FirestoreErrorHandler.logError(
        error,
        'createReservation'
      );

      // Re-throw with user-friendly message
      throw new Error(parsedError.userMessage);
    }
  }

  // Test connection method with better error handling
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Firestore connection...');

      // Test 1: Collection reference
      const collectionRef = collection(this.db, this.COLLECTION_NAME);
      console.log('✅ Collection reference created successfully');

      // Test 2: Try to create a test document (then delete it)
      const testData = {
        serviceId: 'test_service',
        serviceName: 'Test Service',
        bookingDate: Timestamp.fromDate(new Date()),
        status: 'test',
        totalPrice: 1,
        clientName: 'Test User',
        clientEmail: 'test@example.com',
        clientPhone: '+1234567890',
        formData: { test: true },
        notes: 'Connection test - safe to delete',
      };

      console.log('🧪 Creating test document...');
      const testDocRef = await addDoc(collectionRef, testData);
      console.log('✅ Test document created:', testDocRef.id);

      // Note: In a real scenario, you might want to delete the test document
      // But for debugging, we'll leave it
      console.log('ℹ️ Test document left in database for debugging');

      return true;
    } catch (error) {
      console.error('❌ Firestore connection test failed:');
      FirestoreErrorHandler.logError(error, 'testConnection');
      return false;
    }
  }

  // Utility method to check database health
  async checkDatabaseHealth(): Promise<{
    connected: boolean;
    projectId: string;
    collectionExists: boolean;
    canWrite: boolean;
    error?: string;
  }> {
    const result = {
      connected: false,
      projectId: this.db.app.options.projectId || 'unknown',
      collectionExists: false,
      canWrite: false,
      error: undefined as string | undefined,
    };

    try {
      // Test collection reference
      const collectionRef = collection(this.db, this.COLLECTION_NAME);
      result.collectionExists = true;
      result.connected = true;

      // Test write capability with minimal data
      const testData = {
        healthCheck: true,
        timestamp: Timestamp.fromDate(new Date()),
        testId: DataSanitizer.generateSafeDocumentId('health'),
      };

      await addDoc(collectionRef, testData);
      result.canWrite = true;

      console.log('✅ Database health check passed:', result);
      return result;
    } catch (error: any) {
      const parsedError = FirestoreErrorHandler.logError(error, 'healthCheck');
      result.error = parsedError.userMessage;
      console.log('❌ Database health check failed:', result);
      return result;
    }
  }
}
