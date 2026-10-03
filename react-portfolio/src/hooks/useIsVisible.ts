import { useEffect, useState, type RefObject } from 'react';

// True while the element intersects the viewport and the tab is in the foreground.
// Used to pause background animations nobody can see.
export function useIsVisible(ref: RefObject<Element | null>) {
  // Starts false so nothing spins up before the first intersection check.
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setOnScreen(true);
      return;
    }

    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(node);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    const update = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return onScreen && tabVisible;
}
