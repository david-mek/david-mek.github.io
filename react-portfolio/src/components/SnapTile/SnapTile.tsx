import { Box } from '@mantine/core';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const MotionDiv = motion.div;

type SnapTileProps = {
  children: React.ReactNode;
};

export function SnapTile({ children }: SnapTileProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    amount: 0.6,
  });

  return (
    <Box
      ref={ref}
      style={{
        height: '100vh',
        minHeight: '100vh',
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
          height: '100%',
        }}
      >
        {children}
      </MotionDiv>
    </Box>
  );
}