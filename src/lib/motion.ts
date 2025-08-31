import type { Variants } from "framer-motion";

export const fadeInUp = (delay = 0): Variants => ({
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay },
  },
});

export const staggerContainer = (stagger = 0.08): Variants => ({
  animate: {
    transition: { staggerChildren: stagger },
  },
});
