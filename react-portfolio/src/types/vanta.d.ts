declare module 'vanta/dist/vanta.net.min' {
  type VantaNetEffect = {
    destroy: () => void;
    resize?: () => void;
    setOptions?: (options: Record<string, unknown>) => void;
  };

  type VantaNetOptions = {
    el: HTMLElement | null;
    THREE?: unknown;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    points?: number;
    maxDistance?: number;
    spacing?: number;
    showDots?: boolean;
    speed?: number;
    [key: string]: unknown;
  };

  const NET: (options: VantaNetOptions) => VantaNetEffect;
  export default NET;
}