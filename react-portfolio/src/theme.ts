import { createTheme, DEFAULT_THEME } from '@mantine/core';

// Dark-mode page background (macOS's dark window color). Single source for everything that
// paints the dark background itself (canvases, the tape, Vanta, the navbar glass).
export const DARK_BG = '#1c1c1e';
export const DARK_BG_RGB = '28, 28, 30';

export const theme = createTheme({
  fontFamily: 'IBM Plex Sans, sans-serif',
  // Single source for the monospace font; components use var(--mantine-font-family-monospace).
  fontFamilyMonospace: `JetBrains Mono, ${DEFAULT_THEME.fontFamilyMonospace}`,

  colors: {
    dark: [
      '#f5f5f5',
      '#e0e0e0',
      '#c2c2c2',
      '#a3a3a3',
      '#858585',
      '#666666',
      '#404040',
      DARK_BG, // dark[7] 
      DARK_BG, // dark[8]
      DARK_BG, // dark[9]
    ],
  },
});