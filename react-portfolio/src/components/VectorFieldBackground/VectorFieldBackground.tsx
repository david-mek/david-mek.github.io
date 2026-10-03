import { Box, useMantineColorScheme } from '@mantine/core';
import { useEffect, useMemo, useRef } from 'react';
import { useIsVisible } from '@/hooks/useIsVisible';
import { readRootScale } from '@/hooks/useRootScale';

const X_MIN = -8;
const X_MAX = 8;
const Y_MIN = -5;
const Y_MAX = 5;

const ARROW_COUNT_X = 18;
const ARROW_COUNT_Y = 18;
const SEGMENTS_PER_ARROW = 5;
const POINTS_PER_ARROW = SEGMENTS_PER_ARROW + 1;

type ArrowDatum = {
  baseX: number;
  baseY: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function viridis(t: number): string {
  const stops = [
    [68, 1, 84],
    [59, 82, 139],
    [33, 145, 140],
    [94, 201, 98],
    [253, 231, 37],
  ];

  const scaled = clamp(t, 0, 1) * (stops.length - 1);
  const idx = Math.floor(scaled);
  const frac = scaled - idx;

  if (idx >= stops.length - 1) {
    const [r, g, b] = stops[stops.length - 1];
    return `rgb(${r},${g},${b})`;
  }

  const [r1, g1, b1] = stops[idx];
  const [r2, g2, b2] = stops[idx + 1];
  return `rgb(${Math.round(lerp(r1, r2, frac))},${Math.round(lerp(g1, g2, frac))},${Math.round(lerp(b1, b2, frac))})`;
}

function vectorField(x: number, y: number, t: number) {
  const u = Math.sin(x / 2 + t * 0.7) - Math.cos(y / 2 - t * 0.5);
  const v = Math.cos(y / 2 + t * 0.6) + Math.sin(x / 2 - t * 0.4);
  return { u, v };
}

function buildArrowData(): ArrowDatum[] {
  const arrows: ArrowDatum[] = [];
  for (let iy = 0; iy < ARROW_COUNT_Y; iy++) {
    for (let ix = 0; ix < ARROW_COUNT_X; ix++) {
      const x = lerp(X_MIN + 0.45, X_MAX - 0.45, ix / (ARROW_COUNT_X - 1));
      const y = lerp(Y_MIN + 0.45, Y_MAX - 0.45, iy / (ARROW_COUNT_Y - 1));
      arrows.push({ baseX: x, baseY: y });
    }
  }
  return arrows;
}

export function VectorFieldBackground() {
  const { colorScheme } = useMantineColorScheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorSchemeRef = useRef(colorScheme);
  const arrows = useMemo(() => buildArrowData(), []);
  // Survives pauses so the field resumes where it left off.
  const timeRef = useRef(0);
  const visible = useIsVisible(canvasRef);

  useEffect(() => {
    colorSchemeRef.current = colorScheme;
  }, [colorScheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return;

    let raf = 0;
    let time = timeRef.current;
    let w = 0;
    let h = 0;
    let dpr = window.devicePixelRatio || 1;
    // Site scale (see index.css); arrow thickness and heads are specified at scale 1.
    let unit = readRootScale();

    // Closures over let w/h — always read current dimensions.
    const toScreenX = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * w;
    const toScreenY = (y: number) => h - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * h;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      unit = readRootScale();
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Reused across arrows and frames to avoid per-arrow allocations.
    const pts = new Float64Array(POINTS_PER_ARROW * 2);

    const animate = () => {
      time += 0.004;
      timeRef.current = time;

      const ctx = canvas.getContext('2d');
      if (!ctx || w === 0 || h === 0) {
        raf = requestAnimationFrame(animate);
        return;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const scheme = colorSchemeRef.current;
      const bg = scheme === 'dark' ? '#111111' : '#ffffff';
      const gridColor =
        scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(20,20,20,0.08)';
      const axisTint =
        scheme === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.12)';

      // Background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Grid lines — batched into two strokes
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        const sx = toScreenX(x);
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, h);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        const sy = toScreenY(y);
        ctx.moveTo(0, sy);
        ctx.lineTo(w, sy);
      }
      ctx.stroke();

      // Axes
      ctx.strokeStyle = axisTint;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(toScreenX(0), 0);
      ctx.lineTo(toScreenX(0), h);
      ctx.moveTo(0, toScreenY(0));
      ctx.lineTo(w, toScreenY(0));
      ctx.stroke();

      // Arrows
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < arrows.length; i++) {
        const arrow = arrows[i];

        const driftX =
          0.18 * Math.sin(time * 0.7 + arrow.baseY * 0.8) +
          0.1 * Math.cos(time * 0.5 + arrow.baseX * 0.6);
        const driftY =
          0.18 * Math.cos(time * 0.8 + arrow.baseX * 0.7) +
          0.1 * Math.sin(time * 0.4 + arrow.baseY * 0.9);

        let px = arrow.baseX + driftX;
        let py = arrow.baseY + driftY;

        pts[0] = toScreenX(px);
        pts[1] = toScreenY(py);
        let finalSpeed = 0;

        for (let s = 1; s <= SEGMENTS_PER_ARROW; s++) {
          const { u, v } = vectorField(px, py, time);
          finalSpeed = Math.sqrt(u * u + v * v);
          px += u * 0.07;
          py += v * 0.07;
          pts[s * 2] = toScreenX(px);
          pts[s * 2 + 1] = toScreenY(py);
        }

        const last = SEGMENTS_PER_ARROW * 2;
        const x2 = pts[last];
        const y2 = pts[last + 1];
        const dx = x2 - pts[last - 2];
        const dy = y2 - pts[last - 1];
        const mag = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / mag;
        const uy = dy / mag;
        const nx = -uy;
        const ny = ux;

        const speedNorm = clamp(finalSpeed / 2.2, 0, 1);
        const color = viridis(speedNorm);
        const strokeWidth = lerp(1.0, 3.2, speedNorm) * unit;
        const headLen = lerp(7, 14, speedNorm) * unit;
        const headWidth = lerp(4, 8, speedNorm) * unit;

        const tipX = x2 + ux * 3 * unit;
        const tipY = y2 + uy * 3 * unit;

        // Shorten the shaft so it ends inside the arrowhead.
        pts[last] = x2 - ux * (headLen * 0.65);
        pts[last + 1] = y2 - uy * (headLen * 0.65);

        // Shaft
        ctx.globalAlpha = lerp(0.35, 0.95, speedNorm);
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.moveTo(pts[0], pts[1]);
        for (let k = 2; k < pts.length; k += 2) {
          ctx.lineTo(pts[k], pts[k + 1]);
        }
        ctx.stroke();

        // Arrowhead
        ctx.globalAlpha = lerp(0.45, 0.98, speedNorm);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - ux * headLen + nx * headWidth, tipY - uy * headLen + ny * headWidth);
        ctx.lineTo(tipX - ux * headLen - nx * headWidth, tipY - uy * headLen - ny * headWidth);
        ctx.closePath();
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [arrows, visible]);

  return (
    <Box
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </Box>
  );
}
