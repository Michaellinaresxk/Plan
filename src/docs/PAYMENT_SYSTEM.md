# Payment System

Supports **Stripe** and **Square**. Switch between them with one line of code.

---

## Switch Provider

Open this file:

```
src/config/paymentConfig.ts
```

Change this line:

```ts
// Stripe (default)
export const PAYMENT_PROVIDER = 'stripe' as const;

// Square
export const PAYMENT_PROVIDER = 'square' as const;
```

That's it. Everything else updates automatically.

---

## Environment Variables

### Stripe

```env
# .env.local
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Test keys use `sk_test_` / `pk_test_`. Live keys use `sk_live_` / `pk_live_`.

### Square

```env
# .env.local
SQUARE_ENVIRONMENT=production
SQUARE_ACCESS_TOKEN=...
NEXT_PUBLIC_SQUARE_APPLICATION_ID=...
NEXT_PUBLIC_SQUARE_LOCATION_ID=...
SQUARE_WEBHOOK_SIGNATURE_KEY=...
```

---

## Files

### Config (the switch)

```
src/config/paymentConfig.ts        ← change PAYMENT_PROVIDER here
```

### Backend (server-side callers)

```
src/infra/payment/StripeCaller.ts  ← Stripe API calls
src/infra/payment/SquareCaller.ts  ← Square API calls (do not delete)
```

### Frontend (payment forms)

```
src/UI/components/payment/PaymentForm.tsx        ← auto-selects the right form
src/UI/components/payment/StripePaymentForm.tsx  ← Stripe Elements UI
src/UI/components/payment/SquarePaymentForm.tsx  ← Square Web Payments UI (do not delete)
src/UI/components/payment/CheckoutModal.tsx      ← modal that wraps PaymentForm
```

### API Route

```
src/app/api/payments/process/route.ts  ← handles both providers
```

### Webhooks

```
src/app/api/webhooks/square/route.ts   ← Square webhook handler
```

---

## How Each Provider Works

### Stripe flow

```
1. StripePaymentForm loads Stripe.js from CDN
2. User enters card → stripe.createPaymentMethod() returns paymentMethodId
3. POST /api/payments/process { paymentMethodId, reservationData, amount, currency }
4. Server: StripeCaller.createPayment() creates + confirms a PaymentIntent
5. Reservation created → confirmation email sent
```

### Square flow

```
1. SquarePaymentForm loads Square Web Payments SDK from CDN
2. User enters card → card.tokenize() returns sourceId
3. POST /api/payments/process { sourceId, reservationData, amount, currency }
4. Server: SquareCaller.createPayment() charges with sourceId + locationId
5. Reservation created → confirmation email sent
```

---

## Adding Stripe (when credentials arrive)

1. Install the Stripe backend package:
   ```bash
   npm install stripe
   ```

2. Fill in `.env.local`:
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. Confirm `paymentConfig.ts` has `'stripe'` (already set by default).

4. Set up a Stripe webhook in the Stripe Dashboard pointing to:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```

---

## Switching Back to Square

```ts
// src/config/paymentConfig.ts
export const PAYMENT_PROVIDER = 'square' as const;
```

No other changes needed. Square credentials and code are untouched.
