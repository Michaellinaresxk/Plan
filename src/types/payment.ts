export type CheckoutData = {
  reservationId: string;
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  metadata?: Record<string, any>;
};

export type PaymentFormData = {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  nameOnCard: string;
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
};

export type PaymentResult = {
  success: boolean;
  payment?: any;
  error?: string;
  requiresAction?: boolean;
  clientSecret?: string;
};
