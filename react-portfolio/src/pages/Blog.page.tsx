import { Box, Text } from '@mantine/core';

const blueGradient = { from: '#2196f3', to: '#0d47a1', deg: 90 };

export function BlogPage() {
  return (
    <Box
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        data-cursor-text
        ff="monospace"
        size="1.5rem"
        fw={700}
        variant="gradient"
        gradient={blueGradient}
      >
        Coming soon.
      </Text>
    </Box>
  );
}
