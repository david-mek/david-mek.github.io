import { useEffect, useRef, useState } from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';
import { useIsVisible } from '@/hooks/useIsVisible';

declare global {
  interface Window {
    VANTA?: {
      NET: (options: Record<string, unknown>) => { destroy?: () => void };
    };
  }
}

type Props = {
  dotColorLight?: string;
  dotColorDark?: string;
  backgroundLight?: string;
  backgroundDark?: string;
  spacing?: number;
  animationSpeed?: number;
};

// three.js + Vanta (~600KB) are loaded on demand the first time a Vanta background mounts,
// so pages that don't use it never download them. Vanta reads three.js from window.THREE.
let vantaScripts: Promise<void> | null = null;

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function loadVanta() {
  if (window.VANTA?.NET) {
    return Promise.resolve();
  }
  vantaScripts ??= loadScript('/scripts/three.r134.min.js').then(() =>
    loadScript('/scripts/vanta.net.min.js')
  );
  return vantaScripts;
}

function hexToNumber(hex: string) {
  return parseInt(hex.replace('#', ''), 16);
}

export function VantaNETBackground({
  backgroundLight = '#ffffff',
  backgroundDark = '#111111',
}: Props) {
  const { colorScheme } = useMantineColorScheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const effectRef = useRef<{ destroy?: () => void } | null>(null);
  // Vanta has no pause API, so the effect is destroyed off-screen and recreated on return.
  const visible = useIsVisible(containerRef);
  const [scriptsReady, setScriptsReady] = useState(() => Boolean(window.VANTA?.NET));
  // The network fades in once created, instead of appearing whenever the scripts finish loading.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // On failure the plain background color stays.
    loadVanta()
      .then(() => !cancelled && setScriptsReady(true))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const lightColor = '#2196f3';
  const backgroundColor =
    colorScheme === 'dark' ? backgroundDark : backgroundLight;

  useEffect(() => {
    if (!scriptsReady || !visible || !containerRef.current || !window.VANTA?.NET) {
      return;
    }

    effectRef.current?.destroy?.();

    // WebGL can be unavailable (disabled, blocklisted GPU); fall back to the plain background.
    try {
      effectRef.current = window.VANTA.NET({
        el: containerRef.current,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        color: hexToNumber(lightColor),
        backgroundColor: hexToNumber(backgroundColor),
        points: 12,
        maxDistance: 24,
        spacing: 18,
        showDots: true,
      });
      setShown(true);
    } catch {
      effectRef.current = null;
    }

    return () => {
      effectRef.current?.destroy?.();
      effectRef.current = null;
    };
  }, [backgroundColor, visible, scriptsReady]);

  return (
    <Box
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: backgroundColor,
        zIndex: 0,
      }}
    >
      <Box
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: shown ? 1 : 0,
          transition: 'opacity 600ms ease-out',
        }}
      />
    </Box>
  );
}