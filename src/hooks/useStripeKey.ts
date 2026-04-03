// hooks/useStripeKey.ts
import { useState, useEffect } from 'react';

export function useStripeKey() {
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => setKey(data.stripeKey));
  }, []);

  return key;
}
