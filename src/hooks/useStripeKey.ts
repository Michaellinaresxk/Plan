'use client';
// hooks/useStripeKey.ts
//
// Returns:
//   undefined  → fetch still in progress (loading)
//   null       → fetch completed but STRIPE_PUBLISHABLE_KEY is missing
//   string     → key loaded successfully
import { useState, useEffect } from 'react';

export function useStripeKey(): string | null | undefined {
  const [key, setKey] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => setKey(data.stripeKey ?? null))
      .catch(() => setKey(null));
  }, []);

  return key;
}
