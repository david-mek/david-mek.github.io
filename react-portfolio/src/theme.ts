import { createTheme, DEFAULT_THEME } from '@mantine/core';

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
      '#111111', // dark[7] 
      '#111111', // dark[8]
      '#111111', // dark[9]
    ],
  },
});