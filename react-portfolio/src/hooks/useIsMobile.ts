import { useMediaQuery } from '@mantine/hooks';

// Phone-sized layout breakpoint (Mantine's `sm`, 768px). Keep in sync with index.css.
export const MOBILE_QUERY = '(max-width: 48em)';

export function useIsMobile() {
  // Read synchronously on first render so phones don't flash the desktop layout.
  const initial = typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;
  return useMediaQuery(MOBILE_QUERY, initial, { getInitialValueInEffect: false }) ?? initial;
}
