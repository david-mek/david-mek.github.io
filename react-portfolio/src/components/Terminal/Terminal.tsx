import { forwardRef, useEffect, useState, type ReactNode } from 'react';
import { Box, Card, rem, Text, type CardProps } from '@mantine/core';
import classes from './Terminal.module.css';

// Shared pieces of the site's "terminal window" look, used by the About and Projects pages.

export const lightColor = '#2196f3';
export const blueGradient = { from: '#2196f3', to: '#0d47a1', deg: 90 };

export const pillStyle = {
  background: 'rgba(33, 150, 243, 0.12)', // lightColor tint
  border: `${rem(1)} solid rgba(33, 150, 243, 0.35)`,
  color: lightColor,
  fontFamily: 'var(--mantine-font-family-monospace)',
};

// Glyphs shown on hover, as in macOS: close (×), minimize (−), zoom (diagonal arrows).
const trafficLights = [
  { className: classes.close, glyph: <path d="M2 2l4 4M6 2l-4 4" /> },
  { className: classes.minimize, glyph: <path d="M1.5 4h5" /> },
  {
    className: classes.zoom,
    glyph: <path d="M2 6V3.2L4.8 6zM6 2v2.8L3.2 2z" fill="currentColor" stroke="none" />,
  },
];

// Liquid Glass traffic lights. Purely decorative.
export function TrafficLights() {
  return (
    <div className={classes.lights}>
      {trafficLights.map(({ className, glyph }, i) => (
        <span key={i} className={`${classes.light} ${className}`}>
          <svg
            className={classes.glyph}
            viewBox="0 0 8 8"
            fill="none"
            stroke="rgba(0, 0, 0, 0.55)"
            strokeWidth={1.2}
            strokeLinecap="round"
            color="rgba(0, 0, 0, 0.55)"
            aria-hidden
          >
            {glyph}
          </svg>
        </span>
      ))}
    </div>
  );
}

type TerminalCardProps = Omit<CardProps, 'children'> & {
  children: ReactNode;
  // Show the macOS window dots in the top-left corner.
  withTrafficLights?: boolean;
};

// Terminal-style card styled like a macOS app window.
export const TerminalCard = forwardRef<HTMLDivElement, TerminalCardProps>(
  ({ children, className, style, withTrafficLights = true, ...rest }, ref) => (
    <Card
      ref={ref}
      className={className ? `${classes.window} ${className}` : classes.window}
      radius={12}
      p="xl"
      {...rest}
      style={{
        position: 'relative',
        background: 'var(--mantine-color-body)',
        ...(style as object),
      }}
    >
      {withTrafficLights && <TrafficLights />}
      {children}
    </Card>
  )
);

export const Mono = ({ children }: { children: ReactNode }) => (
  <span style={{ fontFamily: 'var(--mantine-font-family-monospace)', fontSize: '0.92em' }}>
    {children}
  </span>
);

// Types out `text` one character at a time once `active` is true, with a trailing cursor.
export function TypedPrompt({
  text,
  speed = 125,
  active,
}: {
  text: string;
  speed?: number;
  active: boolean;
}) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!active) {
      return;
    }

    let index = 0;
    setDisplayed('');

    const interval = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, speed);

    return () => window.clearInterval(interval);
  }, [text, speed, active]);

  return (
    <Text ff="monospace" fw={600} size="sm" c="dimmed" ta="left" w="100%">
      {displayed}
      <Box
        component="span"
        style={{
          display: 'inline-block',
          width: '0.6ch',
          marginLeft: rem(2),
        }}
      >
        _
      </Box>
    </Text>
  );
}
