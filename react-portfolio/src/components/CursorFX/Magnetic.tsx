import { useEffect, useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from 'motion/react';

type MagneticProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode;
  strength?: number;
};

export function Magnetic({
  children,
  strength = 0.22,
  style,
  ...rest
}: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const tx = useMotionValue(0);
  const ty = useMotionValue(0);

  const x = useSpring(tx, { stiffness: 320, damping: 22, mass: 0.45 });
  const y = useSpring(ty, { stiffness: 320, damping: 22, mass: 0.45 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const onMove = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      tx.set((e.clientX - cx) * strength);
      ty.set((e.clientY - cy) * strength);
    };

    const onLeave = () => {
      tx.set(0);
      ty.set(0);
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);

    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, [strength, tx, ty]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-flex', ...style }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}