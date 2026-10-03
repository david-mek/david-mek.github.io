import { useEffect, useState } from 'react';

// Current root font size relative to 16px, i.e. how much the site is scaled versus the
// reference display (see index.css). For pixel values computed in JS, like canvas drawing.
export function readRootScale() {
  if (typeof window === 'undefined') {
    return 1;
  }
  return (parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16) / 16;
}

export function useRootScale() {
  const [scale, setScale] = useState(readRootScale);

  useEffect(() => {
    const update = () => setScale(readRootScale());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return scale;
}
