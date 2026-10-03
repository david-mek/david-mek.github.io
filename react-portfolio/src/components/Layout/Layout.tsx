import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation, useOutlet } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';

// Shared layout for every route: the navbar stays mounted across navigations, and pages
// cross-fade (out, then in) instead of popping in. Only opacity animates — a transform on this
// wrapper would turn it into the containing block for pages' position: fixed backgrounds.
export function Layout() {
  const location = useLocation();
  // The outlet element is captured per render, so the exiting page keeps rendering its own
  // route while it fades out.
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          // Keyed by path only, so query changes (e.g. the Projects topic filter) don't fade.
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.18, ease: 'easeIn' } }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
