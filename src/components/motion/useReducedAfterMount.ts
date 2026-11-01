import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Só considera `prefers-reduced-motion` depois da hidratação: no servidor e no
 * primeiro render do cliente o valor é sempre `false`, então a marcação bate e
 * o React não acusa mismatch (#418/#423).
 */
export function useReducedAfterMount() {
  const prefers = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!prefers;
}
