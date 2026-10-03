import { Box } from '@mantine/core';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

const MotionDiv = motion.div;

type SnapTileProps = {
  children: React.ReactNode;
};

export function SnapTile({ children }: SnapTileProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  // On phones tiles grow to fit their content (at least one screen tall), so a tile can be taller
  // than the viewport; a lower threshold still lets those fade in.
  const isMobile = useIsMobile();
  const inView = useInView(ref, {
    amount: isMobile ? 0.25 : 0.6,
  });

  return (
    <Box
      ref={ref}
      style={{
        height: isMobile ? 'auto' : '100vh',
        minHeight: isMobile ? '100svh' : '100vh',
        width: '100%',
        scrollSnapAlign: 'start',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <MotionDiv
        animate={
          inView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0.2, y: 24, scale: 0.98 }
        }
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
        style={{
          width: '100%',
          height: isMobile ? 'auto' : '100%',
          minHeight: isMobile ? '100svh' : undefined,
        }}
      >
        {children}
      </MotionDiv>
    </Box>
  );
}