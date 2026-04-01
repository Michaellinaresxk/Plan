// ============================================================
// PAYMENT PROVIDER CONFIGURATION
// ============================================================
// CHANGE THIS ONE LINE to switch between payment providers:
//
//   'stripe'  → uses Stripe  (default)
//   'square'  → uses Square
//
// That's it. Everything else updates automatically.
// ============================================================

export const PAYMENT_PROVIDER = 'stripe' as const; // ← change here

export type PaymentProvider = 'stripe' | 'square';
