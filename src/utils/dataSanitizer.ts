// utils/dataSanitizer.ts
export class DataSanitizer {
  /**
   * Sanitize data for Firestore to prevent "pattern" errors
   */
  static sanitizeForFirestore(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }

    if (typeof data === 'number' || typeof data === 'boolean') {
      return data;
    }

    if (data instanceof Date) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeForFirestore(item));
    }

    if (typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const sanitizedKey = this.sanitizeFieldName(key);
        sanitized[sanitizedKey] = this.sanitizeForFirestore(value);
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Sanitize string values
   */
  static sanitizeString(str: string): string {
    if (!str || typeof str !== 'string') {
      return '';
    }

    return str
      .trim()
      .replace(/\u0000/g, '') // Remove null bytes
      .substring(0, 1048487); // Firestore max string length
  }

  /**
   * Sanitize field names for Firestore
   */
  static sanitizeFieldName(fieldName: string): string {
    if (!fieldName || typeof fieldName !== 'string') {
      return 'sanitized_field';
    }

    return fieldName
      .trim()
      .replace(/^__+|__+$/g, '') // Remove leading/trailing double underscores
      .replace(/[^a-zA-Z0-9_]/g, '_') // Replace invalid chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .substring(0, 1500); // Reasonable length limit
  }

  /**
   * Sanitize email address
   */
  static sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      return '';
    }

    return email.toLowerCase().trim().replace(/\s+/g, ''); // Remove any spaces
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhone(phone: string): string {
    if (!phone || typeof phone !== 'string') {
      return '';
    }

    // Keep only digits and + sign
    return phone.replace(/[^\d+]/g, '');
  }

  /**
   * Generate safe document ID for Firestore
   */
  static generateSafeDocumentId(prefix: string = 'doc'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);

    // Ensure safe characters only
    const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '_');

    return `${safePrefix}_${timestamp}_${random}`;
  }

  /**
   * Validate document ID format
   */
  static isValidDocumentId(id: string): boolean {
    if (!id || typeof id !== 'string') {
      return false;
    }

    // Firestore document ID rules:
    // - Must be valid UTF-8 characters
    // - Must be no longer than 1,500 bytes
    // - Cannot contain a forward slash (/)
    // - Cannot solely consist of a single period (.) or double periods (..)
    // - Cannot match the regular expression __.*__

    if (id.length === 0 || id.length > 1500) {
      return false;
    }

    if (id === '.' || id === '..') {
      return false;
    }

    if (id.includes('/')) {
      return false;
    }

    if (/^__.*__$/.test(id)) {
      return false;
    }

    return true;
  }

  /**
   * Sanitize reservation data specifically
   */
  static sanitizeReservationData(data: {
    serviceId: string;
    serviceName: string;
    totalPrice: number;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    formData: Record<string, any>;
    notes?: string;
  }) {
    const sanitized = {
      serviceId: this.sanitizeString(data.serviceId).replace(
        /[^a-zA-Z0-9_-]/g,
        '_'
      ),
      serviceName: this.sanitizeString(data.serviceName),
      totalPrice: Number(data.totalPrice) || 0,
      clientName: this.sanitizeString(data.clientName),
      clientEmail: this.sanitizeEmail(data.clientEmail),
      clientPhone: this.sanitizePhone(data.clientPhone),
      formData: this.sanitizeForFirestore(data.formData || {}),
      notes: this.sanitizeString(data.notes || ''),
    };

    console.log('🧹 DataSanitizer - Original data:', data);
    console.log('🧹 DataSanitizer - Sanitized data:', sanitized);

    return sanitized;
  }

  /**
   * Validate reservation data
   */
  static validateReservationData(data: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.serviceId || data.serviceId.trim().length === 0) {
      errors.push('Service ID is required');
    }

    if (!data.serviceName || data.serviceName.trim().length === 0) {
      errors.push('Service name is required');
    }

    if (!data.clientName || data.clientName.trim().length === 0) {
      errors.push('Client name is required');
    }

    if (!data.clientEmail || data.clientEmail.trim().length === 0) {
      errors.push('Client email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.clientEmail)) {
        errors.push('Invalid email format');
      }
    }

    if (!data.clientPhone || data.clientPhone.trim().length === 0) {
      errors.push('Client phone is required');
    }

    if (!data.totalPrice || data.totalPrice <= 0) {
      errors.push('Total price must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// utils/firestoreErrorHandler.ts
export class FirestoreErrorHandler {
  static parseError(error: any): {
    userMessage: string;
    technicalMessage: string;
    code: string;
  } {
    const defaultResponse = {
      userMessage: 'An unexpected error occurred',
      technicalMessage: error.message || 'Unknown error',
      code: error.code || 'unknown',
    };

    if (!error) {
      return defaultResponse;
    }

    // Pattern-related errors
    if (
      error.message &&
      error.message.includes('string did not match the expected pattern')
    ) {
      return {
        userMessage:
          'Invalid data format. Please check your information and try again.',
        technicalMessage:
          'Firestore document ID or field name contains invalid characters',
        code: 'invalid-pattern',
      };
    }

    // Permission errors
    if (
      error.code === 'permission-denied' ||
      error.message.includes('permission-denied')
    ) {
      return {
        userMessage: 'Permission denied. Please contact support.',
        technicalMessage: 'Firestore security rules denied the operation',
        code: 'permission-denied',
      };
    }

    // Invalid argument errors
    if (error.code === 'invalid-argument') {
      return {
        userMessage: 'Invalid data provided. Please check your information.',
        technicalMessage: 'Firestore rejected the data format or structure',
        code: 'invalid-argument',
      };
    }

    // Service unavailable
    if (error.code === 'unavailable' || error.message.includes('unavailable')) {
      return {
        userMessage:
          'Service temporarily unavailable. Please try again in a moment.',
        technicalMessage: 'Firestore service is temporarily unavailable',
        code: 'unavailable',
      };
    }

    // Not found errors
    if (error.code === 'not-found') {
      return {
        userMessage: 'Requested resource not found.',
        technicalMessage: 'Firestore document or collection not found',
        code: 'not-found',
      };
    }

    // Network errors
    if (
      error.message.includes('network') ||
      error.message.includes('connection')
    ) {
      return {
        userMessage:
          'Network error. Please check your connection and try again.',
        technicalMessage: 'Network connectivity issue with Firestore',
        code: 'network-error',
      };
    }

    return defaultResponse;
  }

  static logError(error: any, context: string = 'unknown') {
    const parsed = this.parseError(error);

    console.error(`🔥 Firestore Error in ${context}:`, {
      userMessage: parsed.userMessage,
      technicalMessage: parsed.technicalMessage,
      code: parsed.code,
      originalError: error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return parsed;
  }
}
