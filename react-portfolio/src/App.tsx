import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';

import { CursorProvider } from './components/CursorFX/CursorContext';
import { iOSPointer as IOSPointer } from './components/CursorFX/iOSPointer';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <CursorProvider>
        <IOSPointer />
        <Router />
      </CursorProvider>
    </MantineProvider>
  );
}
