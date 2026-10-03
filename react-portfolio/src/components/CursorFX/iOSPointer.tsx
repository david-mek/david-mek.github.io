import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useMantineColorScheme } from '@mantine/core';
import { useRootScale } from '@/hooks/useRootScale';
import { useCursorContext, type CursorTarget } from './CursorContext';

function useIsFinePointer() {
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setIsFinePointer(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isFinePointer;
}

function isElement(node: EventTarget | null): node is Element {
  return node instanceof Element;
}

// Sizes below are at the reference scale (1rem = 16px) and multiplied by the site scale.
function estimateChipWidth(label: string, scale: number) {
  const horizontalPadding = 22;
  const avgGlyphWidth = 8.4;
  return Math.max(44, Math.round(label.length * avgGlyphWidth + horizontalPadding)) * scale;
}

const DEFAULT_TARGET: CursorTarget = { variant: 'default', rect: null };

function sameRect(a: DOMRect | null, b: DOMRect | null) {
  if (!a || !b) {
    return a === b;
  }
  return a.left === b.left && a.top === b.top && a.width === b.width && a.height === b.height;
}

function sameTarget(a: CursorTarget, b: CursorTarget) {
  return (
    a.variant === b.variant &&
    a.label === b.label &&
    a.fontSize === b.fontSize &&
    sameRect(a.rect, b.rect)
  );
}

function detectTarget(el: Element | null): CursorTarget {
  if (!el) return { variant: 'default', rect: null };

  // Check chip first so explicitly tagged elements win.
  const chipTarget = el.closest('[data-cursor-chip]');
  if (chipTarget instanceof Element) {
    return {
      variant: 'chip',
      rect: chipTarget.getBoundingClientRect(),
      label: chipTarget.getAttribute('data-cursor-chip') ?? '',
    };
  }

  const textTarget = el.closest('[data-cursor-text]');
  if (textTarget instanceof Element) {
    const fontSize = parseFloat(window.getComputedStyle(textTarget).fontSize) || 16;
    return {
      variant: 'text',
      rect: textTarget.getBoundingClientRect(),
      fontSize,
    };
  }

  const clickable = el.closest(
    'a, button, [role="button"], [data-cursor-hover], summary, [tabindex]:not([tabindex="-1"])'
  );
  if (clickable instanceof Element) {
    return {
      variant: 'hover',
      rect: clickable.getBoundingClientRect(),
    };
  }

  return { variant: 'default', rect: null };
}

export function iOSPointer() {
  const { colorScheme } = useMantineColorScheme();
  const { target, setTarget, clearTarget } = useCursorContext();
  const isFinePointer = useIsFinePointer();
  const scale = useRootScale();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const x = useSpring(mouseX, { stiffness: 520, damping: 38, mass: 0.45 });
  const y = useSpring(mouseY, { stiffness: 520, damping: 38, mass: 0.45 });

  // Start at the scaled default size; a set() issued right after mount doesn't reliably take.
  const width = useSpring(16 * scale, { stiffness: 420, damping: 32, mass: 0.4 });
  const height = useSpring(16 * scale, { stiffness: 420, damping: 32, mass: 0.4 });
  const radius = useSpring(999, { stiffness: 420, damping: 32, mass: 0.4 });
  const pressScale = useSpring(1, { stiffness: 520, damping: 22, mass: 0.35 });

  const [visible, setVisible] = useState(false);

  // Latest target, readable from event handlers without re-subscribing them.
  const targetRef = useRef(target);
  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    if (!isFinePointer) return;

    let raf = 0;
    let lastX = 0;
    let lastY = 0;

    // Hit-testing (elementFromPoint, measuring, computed styles) runs at most once per
    // frame, and React state only updates when the target actually changes.
    const detect = () => {
      raf = 0;
      const el = document.elementFromPoint(lastX, lastY);
      const next = isElement(el) ? detectTarget(el) : DEFAULT_TARGET;

      // Hover targets pin the cursor to their center (see the effect below).
      if (next.variant !== 'hover') {
        mouseX.set(lastX);
        mouseY.set(lastY);
      }

      if (!sameTarget(next, targetRef.current)) {
        targetRef.current = next;
        setTarget(next);
      }
    };

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (targetRef.current.variant !== 'hover') {
        mouseX.set(lastX);
        mouseY.set(lastY);
      }
      setVisible(true);
      if (!raf) {
        raf = requestAnimationFrame(detect);
      }
    };

    const onLeave = () => {
      setVisible(false);
      targetRef.current = DEFAULT_TARGET;
      clearTarget();
    };

    const onEnter = () => setVisible(true);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerenter', onEnter);
    };
  }, [isFinePointer, mouseX, mouseY, setTarget, clearTarget]);

  useEffect(() => {
    if (!isFinePointer) return;

    const onPointerDown = () => {
      pressScale.set(0.84);
    };

    const onPointerUp = () => {
      pressScale.set(1);
    };

    const onPointerCancel = () => {
      pressScale.set(1);
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerCancel, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [isFinePointer, pressScale]);

  useEffect(() => {
    if (target.variant === 'hover' && target.rect) {
      mouseX.set(target.rect.left + target.rect.width / 2);
      mouseY.set(target.rect.top + target.rect.height / 2);
      width.set(Math.max(30 * scale, target.rect.width + 10 * scale));
      height.set(Math.max(30 * scale, target.rect.height + 10 * scale));
      radius.set(14 * scale);
      return;
    }

    if (target.variant === 'text' && target.rect) {
      width.set(4 * scale);
      // fontSize is measured from the page, so it's already scaled.
      height.set(Math.max(18 * scale, (target.fontSize ?? 16 * scale) * 1.15));
      radius.set(999);
      return;
    }

    if (target.variant === 'chip') {
      const label = target.label ?? '';
      width.set(estimateChipWidth(label, scale));
      height.set(28 * scale);
      radius.set(999);
      return;
    }

    width.set(16 * scale);
    height.set(16 * scale);
    radius.set(999);
  }, [target, scale, mouseX, mouseY, width, height, radius]);

  const ringColor =
    colorScheme === 'dark'
      ? 'rgba(255,255,255,0.88)'
      : 'rgba(20,20,20,0.88)';

  const defaultFill = 'rgba(255,255,255,0.08)';
  const hoverFill = 'rgba(255,255,255,0.003)';

  const textFill =
    colorScheme === 'dark'
      ? 'rgba(255,255,255,0.92)'
      : 'rgba(20,20,20,0.88)';

  const chipTextColor =
    colorScheme === 'dark'
      ? 'rgba(255,255,255,0.92)'
      : 'rgba(20,20,20,0.88)';

  if (!isFinePointer) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x,
        y,
        width,
        height,
        scale: pressScale,
        translateX: '-50%',
        translateY: '-50%',
        borderRadius: radius,
        border:
          target.variant === 'text'
            ? 'none'
            : `${1.25 * scale}px solid ${ringColor}`,
        background:
          target.variant === 'text'
            ? textFill
            : target.variant === 'hover'
              ? hoverFill
              : defaultFill,
        pointerEvents: 'none',
        zIndex: 9999,
        boxSizing: 'border-box',
        backdropFilter:
          target.variant === 'text' || target.variant === 'hover'
            ? 'none'
            : 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      animate={{
        opacity: visible ? 1 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 28,
        mass: 0.5,
      }}
    >
      {target.variant === 'chip' && target.label ? (
        <span
          style={{
            fontFamily: 'var(--mantine-font-family-monospace)',
            fontSize: 12 * scale,
            fontWeight: 500,
            lineHeight: 1,
            color: chipTextColor,
            whiteSpace: 'nowrap',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {target.label}
        </span>
      ) : null}
    </motion.div>
  );
}