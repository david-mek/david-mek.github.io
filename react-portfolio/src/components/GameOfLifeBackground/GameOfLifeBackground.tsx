import { Box, useComputedColorScheme } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { useIsVisible } from '@/hooks/useIsVisible';
import { readRootScale } from '@/hooks/useRootScale';

/*
  Conway's Game of Life with a puffer train that crosses the panel left to right, leaving
  debris that settles into still lifes and oscillators, then leaves the screen.

  The simulation runs on a fixed grid in cells (independent of screen size) so every screen
  sees the exact same run. The visible window is VISIBLE_COLS wide and vertically centered;
  the margins around it are simulated but never drawn, and keep the boundary (where cells
  just die) far enough away that nothing from it ever drifts back into view.
*/

// The puffer, as RLE, oriented to travel toward +x.
const PUFFER_RLE = '3bo$4bo$o3bo$b4o4$o$b2o$2bo$2bo$bo3$3bo$4bo$o3bo$b4o!';

const VISIBLE_COLS = 128;
// Most rows ever shown. On tall, narrow screens (phones) cells grow so no more than this many rows
// are visible — keeping the grid's top/bottom edges (where cells die) out of view — and fewer
// columns show instead. The visible area always stays inside the verified window.
const MAX_VISIBLE_ROWS = 80;
const LEFT_MARGIN = 24;
const RIGHT_MARGIN = 120;
const SIM_COLS = LEFT_MARGIN + VISIBLE_COLS + RIGHT_MARGIN;
const SIM_ROWS = 120;
// Row of the puffer's vertical center, relative to the middle of the grid.
const LANE_OFFSET = 0;

const STEP_MS = 120;
// Generations over which a cell fades from "just born" to its settled brightness.
const AGE_FADE_GENS = 40;

const CELL_COLOR = '#2196f3';

function parseRle(rle: string): Array<[number, number]> {
  const cells: Array<[number, number]> = [];
  let x = 0;
  let y = 0;
  for (const [, count, tag] of rle.matchAll(/(\d*)([bo$!])/g)) {
    const n = count ? parseInt(count, 10) : 1;
    if (tag === 'b') {
      x += n;
    } else if (tag === 'o') {
      for (let i = 0; i < n; i++) {
        cells.push([x + i, y]);
      }
      x += n;
    } else if (tag === '$') {
      y += n;
      x = 0;
    }
  }
  return cells;
}

function seedGrid(): Uint8Array {
  const grid = new Uint8Array(SIM_COLS * SIM_ROWS);
  const cells = parseRle(PUFFER_RLE);
  const width = Math.max(...cells.map(([x]) => x)) + 1;
  const height = Math.max(...cells.map(([, y]) => y)) + 1;
  // Start just left of the visible window so the train enters right away.
  const x0 = LEFT_MARGIN - width - 1;
  const y0 = Math.floor(SIM_ROWS / 2 + LANE_OFFSET - height / 2);
  for (const [x, y] of cells) {
    grid[(y0 + y) * SIM_COLS + (x0 + x)] = 1;
  }
  return grid;
}

// One generation with dead boundaries. Writes into `next`, updates `age` in place.
function stepGrid(cur: Uint8Array, next: Uint8Array, age: Uint16Array) {
  for (let y = 0; y < SIM_ROWS; y++) {
    const up = y > 0 ? (y - 1) * SIM_COLS : -1;
    const row = y * SIM_COLS;
    const down = y < SIM_ROWS - 1 ? (y + 1) * SIM_COLS : -1;
    for (let x = 0; x < SIM_COLS; x++) {
      let n = 0;
      for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx;
        if (xx < 0 || xx >= SIM_COLS) {
          continue;
        }
        if (up >= 0) {
          n += cur[up + xx];
        }
        if (dx !== 0) {
          n += cur[row + xx];
        }
        if (down >= 0) {
          n += cur[down + xx];
        }
      }
      const i = row + x;
      const alive = n === 3 || (n === 2 && cur[i] === 1) ? 1 : 0;
      next[i] = alive;
      age[i] = alive ? Math.min(age[i] + 1, 65535) : 0;
    }
  }
}

// Brightness of a live cell by age: newborn cells are full strength, long-lived ones settle dimmer.
function ageAlpha(age: number) {
  const t = Math.min(1, (age - 1) / AGE_FADE_GENS);
  return 0.95 - 0.5 * t;
}

export function GameOfLifeBackground() {
  // The theme actually shown (resolves 'auto' to light/dark from the system setting).
  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: false });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorSchemeRef = useRef(colorScheme);
  const visible = useIsVisible(canvasRef);

  // Simulation state lives in refs so it survives pauses and theme changes.
  const simRef = useRef<{
    cur: Uint8Array;
    prev: Uint8Array;
    age: Uint16Array;
    prevAge: Uint16Array;
    lastStep: number;
  } | null>(null);

  useEffect(() => {
    colorSchemeRef.current = colorScheme;
  }, [colorScheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) {
      return;
    }

    if (!simRef.current) {
      const cur = seedGrid();
      const age = new Uint16Array(cur.length);
      for (let i = 0; i < cur.length; i++) {
        age[i] = cur[i];
      }
      simRef.current = {
        cur,
        prev: cur.slice(),
        age,
        prevAge: age.slice(),
        lastStep: performance.now(),
      };
    }
    const sim = simRef.current;
    // Don't fast-forward through the time spent paused.
    sim.lastStep = performance.now();

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = window.devicePixelRatio || 1;
    let unit = readRootScale();

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

    const scratch = new Uint8Array(sim.cur.length);

    const animate = (now: number) => {
      // Advance whole generations; keep the previous one around for cross-fading.
      while (now - sim.lastStep >= STEP_MS) {
        sim.prev.set(sim.cur);
        sim.prevAge.set(sim.age);
        stepGrid(sim.prev, scratch, sim.age);
        sim.cur.set(scratch);
        sim.lastStep += STEP_MS;
      }
      const t = Math.min(1, (now - sim.lastStep) / STEP_MS);

      const ctx = canvas.getContext('2d');
      if (!ctx || w === 0 || h === 0) {
        raf = requestAnimationFrame(animate);
        return;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const scheme = colorSchemeRef.current;
      ctx.fillStyle = scheme === 'dark' ? '#111111' : '#ffffff';
      ctx.fillRect(0, 0, w, h);

      const cell = Math.max(w / VISIBLE_COLS, h / MAX_VISIBLE_ROWS);
      const visCols = Math.min(VISIBLE_COLS, Math.ceil(w / cell));
      const visRows = Math.ceil(h / cell);
      const rowStart = Math.floor((SIM_ROWS - visRows) / 2);
      // Center the window vertically: offset by the fractional part of the extra height.
      const yOffset = (h - visRows * cell) / 2;

      // Grid lines, batched into one stroke.
      ctx.strokeStyle = scheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(20,20,20,0.05)';
      ctx.lineWidth = unit;
      ctx.beginPath();
      for (let c = 0; c <= visCols; c++) {
        const x = c * cell;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let r = 0; r <= visRows; r++) {
        const y = yOffset + r * cell;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Cells, cross-faded between the previous and current generation.
      const gap = Math.max(unit, cell * 0.12);
      const size = cell - gap;
      const radius = size * 0.22;
      ctx.fillStyle = CELL_COLOR;
      for (let r = 0; r < visRows; r++) {
        const sy = rowStart + r;
        if (sy < 0 || sy >= SIM_ROWS) {
          continue;
        }
        const rowBase = sy * SIM_COLS + LEFT_MARGIN;
        for (let c = 0; c < visCols; c++) {
          const i = rowBase + c;
          const a0 = sim.prev[i] ? ageAlpha(sim.prevAge[i]) : 0;
          const a1 = sim.cur[i] ? ageAlpha(sim.age[i]) : 0;
          const alpha = a0 + (a1 - a0) * t;
          if (alpha < 0.01) {
            continue;
          }
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.roundRect(c * cell + gap / 2, yOffset + r * cell + gap / 2, size, size, radius);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [visible]);

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
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </Box>
  );
}
