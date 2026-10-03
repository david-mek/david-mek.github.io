// import { Box, useMantineColorScheme } from '@mantine/core';
// import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

// type TapeCell = {
//   id: number;
//   value: '0' | '1';
// };

// type TuringTapeBackgroundProps = {
//   machineRef: React.RefObject<HTMLElement | null>;
// };

// const CELL_W = 56;
// const CELL_H = 64;
// const STEP_MS = 700;
// const START_BUFFER_CELLS = 8;

// const lighterColor = '#2196f3';

// function makeRandomBit(): '0' | '1' {
//   return Math.random() > 0.5 ? '1' : '0';
// }

// function buildCells(count: number, startId = 0): TapeCell[] {
//   return Array.from({ length: count }, (_, i) => ({
//     id: startId + i,
//     value: makeRandomBit(),
//   }));
// }

// export function TuringTapeBackground({
//   machineRef,
// }: TuringTapeBackgroundProps) {
//   const { colorScheme } = useMantineColorScheme();

//   const sceneRef = useRef<HTMLDivElement | null>(null);
//   const nextIdRef = useRef(100000);

//   const [sceneWidth, setSceneWidth] = useState(1600);
//   const [machineLeft, setMachineLeft] = useState(500);
//   const [machineWidth, setMachineWidth] = useState(900);
//   const [tapeTop, setTapeTop] = useState(0);
//   const [layoutReady, setLayoutReady] = useState(false);

//   const totalCells = useMemo(
//     () => Math.ceil(sceneWidth / CELL_W) + START_BUFFER_CELLS * 2,
//     [sceneWidth]
//   );

//   const [cells, setCells] = useState<TapeCell[]>(() => buildCells(48));
//   const [offset, setOffset] = useState(-CELL_W);
//   const [animate, setAnimate] = useState(false);
//   const [machineGlow, setMachineGlow] = useState(false);

//   useEffect(() => {
//     setCells((prev) => {
//       if (prev.length === totalCells) return prev;

//       if (prev.length > totalCells) {
//         return prev.slice(0, totalCells);
//       }

//       const extra = buildCells(totalCells - prev.length, nextIdRef.current);
//       nextIdRef.current += extra.length;
//       return [...prev, ...extra];
//     });
//   }, [totalCells]);

//   useLayoutEffect(() => {
//     let raf = 0;
//     let ro: ResizeObserver | null = null;

//     const setup = () => {
//       const scene = sceneRef.current;
//       const machine = machineRef.current;

//       if (!scene || !machine) {
//         raf = requestAnimationFrame(setup);
//         return;
//       }

//       const update = () => {
//         const sceneRect = scene.getBoundingClientRect();
//         const machineRect = machine.getBoundingClientRect();

//         setSceneWidth(sceneRect.width);
//         setMachineLeft(machineRect.left - sceneRect.left);
//         setMachineWidth(machineRect.width);
//         setTapeTop(machineRect.top - sceneRect.top + machineRect.height / 2 - CELL_H / 2);
//         setLayoutReady(true);
//       };

//       update();

//       ro = new ResizeObserver(update);
//       ro.observe(scene);
//       ro.observe(machine);

//       window.addEventListener('resize', update);

//       return () => {
//         ro?.disconnect();
//         window.removeEventListener('resize', update);
//       };
//     };

//     const cleanup = setup();

//     return () => {
//       cancelAnimationFrame(raf);
//       if (typeof cleanup === 'function') cleanup();
//       ro?.disconnect();
//     };
//   }, [machineRef]);

//   useEffect(() => {
//     const machine = machineRef.current;
//     if (!machine) return;

//     const originalBorderColor = machine.style.borderColor;
//     const originalBoxShadow = machine.style.boxShadow;
//     const originalTransition = machine.style.transition;

//     machine.style.transition = 'border-color 180ms ease, box-shadow 180ms ease';

//     if (machineGlow) {
//       machine.style.borderColor = lighterColor;
//       machine.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.6)';
//     } else {
//       machine.style.borderColor = originalBorderColor || '';
//       machine.style.boxShadow = originalBoxShadow || '';
//     }

//     return () => {
//       machine.style.borderColor = originalBorderColor;
//       machine.style.boxShadow = originalBoxShadow;
//       machine.style.transition = originalTransition;
//     };
//   }, [machineGlow, machineRef]);

//   useEffect(() => {
//     if (cells.length === 0 || !layoutReady) return;

//     let cancelled = false;
//     let timeoutId: number | null = null;

//     const runStep = () => {
//       if (cancelled) return;

//       const startX = -START_BUFFER_CELLS * CELL_W + offset;
//       const machineCenterX = machineLeft + machineWidth / 2;

//       const headIndex = Math.max(
//         0,
//         Math.min(
//           cells.length - 1,
//           Math.round((machineCenterX - startX - CELL_W / 2) / CELL_W)
//         )
//       );

//       const willWrite = Math.random() < 0.42;
//       const newValue: '0' | '1' = makeRandomBit();

//       if (willWrite) {
//         setMachineGlow(true);

//         window.setTimeout(() => {
//           if (cancelled) return;
//           setCells((prev) =>
//             prev.map((cell, idx) =>
//               idx === headIndex ? { ...cell, value: newValue } : cell
//             )
//           );
//         }, STEP_MS * 0.42);

//         window.setTimeout(() => {
//           if (cancelled) return;
//           setMachineGlow(false);
//         }, STEP_MS * 0.78);
//       }

//       setAnimate(true);
//       setOffset(0);

//       timeoutId = window.setTimeout(() => {
//         if (cancelled) return;

//         setAnimate(false);
//         setCells((prev) => {
//           const next = [...prev];
//           const last = next.pop();
//           if (!last) return prev;
//           return [last, ...next];
//         });

//         setOffset(-CELL_W);
//         timeoutId = window.setTimeout(runStep, 40);
//       }, STEP_MS);
//     };

//     timeoutId = window.setTimeout(runStep, 400);

//     return () => {
//       cancelled = true;
//       if (timeoutId) window.clearTimeout(timeoutId);
//     };
//   }, [cells.length, layoutReady, machineLeft, machineWidth, offset]);

//   const tapeBorderColor =
//     colorScheme === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(127,127,127,0.22)';

//   const digitColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

//   return (
//     <Box
//       ref={sceneRef}
//       style={{
//         position: 'absolute',
//         inset: 0,
//         overflow: 'hidden',
//         pointerEvents: 'none',
//         zIndex: 0,
//         opacity: layoutReady ? 1 : 0,
//       }}
//     >
//       <Box
//         style={{
//           position: 'absolute',
//           left: 0,
//           right: 0,
//           top: tapeTop,
//           height: CELL_H,
//         }}
//       >
//         <Box
//           style={{
//             position: 'absolute',
//             left: -START_BUFFER_CELLS * CELL_W,
//             top: 0,
//             height: CELL_H,
//             width: cells.length * CELL_W,
//             transform: `translateX(${offset}px)`,
//             transition: animate
//               ? `transform ${STEP_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
//               : 'none',
//           }}
//         >
//           {cells.map((cell, idx) => {
//             const left = idx * CELL_W;

//             return (
//               <Box
//                 key={cell.id}
//                 style={{
//                   position: 'absolute',
//                   left,
//                   top: 0,
//                   width: CELL_W,
//                   height: CELL_H,
//                   border: `1px solid ${tapeBorderColor}`,
//                   background: 'transparent',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontFamily: '"JetBrains Mono", monospace',
//                   fontSize: 24,
//                   fontWeight: 700,
//                   lineHeight: 1,
//                   color: digitColor,
//                 }}
//               >
//                 {cell.value}
//               </Box>
//             );
//           })}
//         </Box>
//       </Box>
//     </Box>
//   );
// }

import { Box, useComputedColorScheme } from '@mantine/core';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useIsVisible } from '@/hooks/useIsVisible';
import { useRootScale } from '@/hooks/useRootScale';

type TapeSymbol = '0' | '1' | '⊢';

type TapeCell = {
  id: number;
  value: TapeSymbol;
};

type TuringTapeBackgroundProps = {
  machineRef: React.RefObject<HTMLElement | null>;
};

// Cell size and digit sizes at the reference scale (1rem = 16px); multiplied by the root scale.
const CELL_W = 56;
const CELL_H = 64;
const DIGIT_SIZE = 24;
const BG_DIGIT_SIZE = 22;
const STEP_MS = 1100;
const STEP_PAUSE_MS = 300;
const START_BUFFER_CELLS = 8;
const BG_ROWS = 14;

function makeRandomSymbol(): TapeSymbol {
  const r = Math.random();
  if (r < 0.42) return '0';
  if (r < 0.84) return '1';
  return '⊢';
}

function buildCells(count: number, startId = 0): TapeCell[] {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    value: makeRandomSymbol(),
  }));
}

export function TuringTapeBackground({
  machineRef,
}: TuringTapeBackgroundProps) {
  // The theme actually shown (resolves 'auto' to light/dark from the system setting).
  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: false });

  const sceneRef = useRef<HTMLDivElement | null>(null);
  const nextIdRef = useRef(100000);
  const visible = useIsVisible(sceneRef);
  const scale = useRootScale();
  const cellW = CELL_W * scale;
  const cellH = CELL_H * scale;

  const [sceneWidth, setSceneWidth] = useState(1600);
  const [sceneHeight, setSceneHeight] = useState(900);
  const [machineLeft, setMachineLeft] = useState(500);
  const [machineWidth, setMachineWidth] = useState(900);
  const [tapeTop, setTapeTop] = useState(0);
  const [layoutReady, setLayoutReady] = useState(false);

  const totalCells = useMemo(
    () => Math.ceil(sceneWidth / cellW) + START_BUFFER_CELLS * 2,
    [sceneWidth, cellW]
  );

  const diagonal = useMemo(
    () => Math.sqrt(sceneWidth * sceneWidth + sceneHeight * sceneHeight),
    [sceneWidth, sceneHeight]
  );

  const bgRailWidth = useMemo(() => diagonal * 2.2, [diagonal]);

  const bgTotalCells = useMemo(
    () => Math.ceil(bgRailWidth / cellW) + START_BUFFER_CELLS * 2,
    [bgRailWidth, cellW]
  );

  const [cells, setCells] = useState<TapeCell[]>(() => buildCells(48));
  const [bgRows, setBgRows] = useState<TapeCell[][]>(() =>
    Array.from({ length: BG_ROWS }, (_, rowIdx) => buildCells(64, rowIdx * 1000))
  );

  // Animation offsets kept in refs — applied directly to DOM, bypassing React reconciliation.
  const mainOffsetRef = useRef(-cellW);
  const bgOffsetsRef = useRef<number[]>(
    Array.from({ length: BG_ROWS }, (_, i) => (i % 2 === 0 ? -cellW : 0))
  );
  const mainStripRef = useRef<HTMLDivElement | null>(null);
  const bgStripRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setCells((prev) => {
      if (prev.length === totalCells) return prev;
      if (prev.length > totalCells) return prev.slice(0, totalCells);

      const extra = buildCells(totalCells - prev.length, nextIdRef.current);
      nextIdRef.current += extra.length;
      return [...prev, ...extra];
    });
  }, [totalCells]);

  useEffect(() => {
    setBgRows((prev) =>
      prev.map((row) => {
        if (row.length === bgTotalCells) return row;
        if (row.length > bgTotalCells) return row.slice(0, bgTotalCells);

        const extra = buildCells(bgTotalCells - row.length, nextIdRef.current);
        nextIdRef.current += extra.length;
        return [...row, ...extra];
      })
    );
  }, [bgTotalCells]);

  useLayoutEffect(() => {
    let raf = 0;
    let ro: ResizeObserver | null = null;

    const setup = () => {
      const scene = sceneRef.current;
      const machine = machineRef.current;

      if (!scene || !machine) {
        raf = requestAnimationFrame(setup);
        return;
      }

      const update = () => {
        const sceneRect = scene.getBoundingClientRect();
        const machineRect = machine.getBoundingClientRect();

        setSceneWidth(sceneRect.width);
        setSceneHeight(sceneRect.height);
        setMachineLeft(machineRect.left - sceneRect.left);
        setMachineWidth(machineRect.width);
        setTapeTop(
          machineRect.top - sceneRect.top + machineRect.height / 2 - cellH / 2
        );
        setLayoutReady(true);
      };

      update();

      ro = new ResizeObserver(update);
      ro.observe(scene);
      ro.observe(machine);
      window.addEventListener('resize', update);

      return () => {
        ro?.disconnect();
        window.removeEventListener('resize', update);
      };
    };

    const cleanup = setup();

    return () => {
      cancelAnimationFrame(raf);
      if (typeof cleanup === 'function') cleanup();
      ro?.disconnect();
    };
  }, [machineRef, cellH]);

  // Writes offsets directly to DOM — no React state, no reconciliation on every tick.
  const applyTransforms = useCallback((animated: boolean) => {
    const transition = animated
      ? `transform ${STEP_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
      : 'none';

    if (mainStripRef.current) {
      mainStripRef.current.style.transition = transition;
      mainStripRef.current.style.transform = `translateX(${mainOffsetRef.current}px)`;
    }

    bgStripRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.transition = transition;
      el.style.transform = `translateX(${bgOffsetsRef.current[i] ?? -cellW}px)`;
    });
  }, [cellW]);

  useEffect(() => {
    if (!visible || !layoutReady || cells.length === 0 || bgRows.some((row) => row.length === 0)) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | null = null;

    // Reset to a known resting state whenever the effect (re-)starts.
    mainOffsetRef.current = -cellW;
    bgOffsetsRef.current = Array.from({ length: BG_ROWS }, (_, i) => (i % 2 === 0 ? -cellW : 0));
    applyTransforms(false);

    const runStep = () => {
      if (cancelled) return;

      const startX = -START_BUFFER_CELLS * cellW + mainOffsetRef.current;
      const machineCenterX = machineLeft + machineWidth / 2;

      const headIndex = Math.max(
        0,
        Math.min(
          cells.length - 1,
          Math.round((machineCenterX - startX - cellW / 2) / cellW)
        )
      );

      const willWrite = Math.random() < 0.42;
      const newValue: TapeSymbol = makeRandomSymbol();

      if (willWrite) {
        window.setTimeout(() => {
          if (cancelled) return;
          setCells((prev) =>
            prev.map((cell, idx) =>
              idx === headIndex ? { ...cell, value: newValue } : cell
            )
          );
        }, STEP_MS * 0.42);
      }

      mainOffsetRef.current = 0;
      bgOffsetsRef.current = Array.from({ length: BG_ROWS }, (_, i) => (i % 2 === 0 ? 0 : -cellW));
      applyTransforms(true);

      timeoutId = window.setTimeout(() => {
        if (cancelled) return;

        // Rotate the cells and snap the strips back in the same frame. flushSync commits the
        // rotated cells to the DOM before the transforms reset; otherwise a paint can land in
        // between and show every cell shifted by one (all digits appear to change at once).
        flushSync(() => {
          setCells((prev) => {
            const next = [...prev];
            const last = next.pop();
            if (!last) return prev;
            return [last, ...next];
          });

          setBgRows((prev) =>
            prev.map((row, i) => {
              const next = [...row];
              if (i % 2 === 0) {
                const last = next.pop();
                if (!last) return row;
                return [last, ...next];
              } else {
                const first = next.shift();
                if (!first) return row;
                return [...next, first];
              }
            })
          );
        });

        mainOffsetRef.current = -cellW;
        bgOffsetsRef.current = Array.from({ length: BG_ROWS }, (_, i) => (i % 2 === 0 ? -cellW : 0));
        applyTransforms(false);

        timeoutId = window.setTimeout(runStep, STEP_PAUSE_MS);
      }, STEP_MS);
    };

    timeoutId = window.setTimeout(runStep, 400);

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [visible, layoutReady, cells.length, bgRows.length, machineLeft, machineWidth, cellW, applyTransforms]);

  const tapeBorderColor =
    colorScheme === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(127,127,127,0.22)';
  const digitColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const tapeCellBackground = colorScheme === 'dark' ? '#111111' : '#ffffff';

  const bgTapeBorderColor =
    colorScheme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(127,127,127,0.10)';
  const bgDigitColor =
    colorScheme === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.16)';
  const bgTapeCellBackground =
    colorScheme === 'dark' ? 'rgba(17,17,17,0.75)' : 'rgba(255,255,255,0.75)';

  const bgCoverage = diagonal + cellH * 2;
  const bgSpacing = BG_ROWS > 1 ? bgCoverage / (BG_ROWS - 1) : 0;

  return (
    <Box
      ref={sceneRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: layoutReady ? 1 : 0,
      }}
    >
      <Box
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: bgRailWidth,
          height: bgCoverage,
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          transformOrigin: 'center center',
        }}
      >
        {Array.from({ length: BG_ROWS }).map((_, rowIdx) => {
          const row = bgRows[rowIdx] ?? [];
          const rowCenter = rowIdx * bgSpacing;

          return (
            <Box
              key={`bg-row-${rowIdx}`}
              style={{
                position: 'absolute',
                left: 0,
                top: rowCenter - cellH / 2,
                width: bgRailWidth,
                height: cellH,
              }}
            >
              <Box
                ref={(el: HTMLDivElement | null) => { bgStripRefs.current[rowIdx] = el; }}
                style={{
                  position: 'absolute',
                  left: -START_BUFFER_CELLS * cellW,
                  top: 0,
                  height: cellH,
                  width: row.length * cellW,
                  willChange: 'transform',
                }}
              >
                {row.map((cell, idx) => {
                  const left = idx * cellW;

                  return (
                    <Box
                      key={cell.id}
                      style={{
                        position: 'absolute',
                        left,
                        top: 0,
                        width: cellW,
                        height: cellH,
                        border: `${scale}px solid ${bgTapeBorderColor}`,
                        background: bgTapeCellBackground,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--mantine-font-family-monospace)',
                        fontSize: BG_DIGIT_SIZE * scale,
                        fontWeight: 700,
                        lineHeight: 1,
                        color: bgDigitColor,
                      }}
                    >
                      {cell.value}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: tapeTop,
          height: cellH,
        }}
      >
        <Box
          ref={mainStripRef}
          style={{
            position: 'absolute',
            left: -START_BUFFER_CELLS * cellW,
            top: 0,
            height: cellH,
            width: cells.length * cellW,
            willChange: 'transform',
          }}
        >
          {cells.map((cell, idx) => {
            const left = idx * cellW;

            return (
              <Box
                key={cell.id}
                style={{
                  position: 'absolute',
                  left,
                  top: 0,
                  width: cellW,
                  height: cellH,
                  border: `${scale}px solid ${tapeBorderColor}`,
                  background: tapeCellBackground,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--mantine-font-family-monospace)',
                  fontSize: DIGIT_SIZE * scale,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: digitColor,
                }}
              >
                {cell.value}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}