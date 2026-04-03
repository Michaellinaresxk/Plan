// This component automatically uses the active payment provider
// configured in src/config/paymentConfig.ts.
//
// To switch providers change ONE line in paymentConfig.ts:
//   export const PAYMENT_PROVIDER = 'stripe'   ← Stripe (default)
//   export const PAYMENT_PROVIDER = 'square'   ← Square

import { PAYMENT_PROVIDER } from '@/config/paymentConfig';
import SquarePaymentForm from './SquarePaymentForm';
import StripePaymentForm from './StripePaymentForm';

const PaymentForm =
  PAYMENT_PROVIDER === 'stripe' ? StripePaymentForm : SquarePaymentForm;

export default PaymentForm;
