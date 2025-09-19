import { type Variants } from "framer-motion";

// Easing curves
export const easings = {
  easeOutQuart: [0.25, 1, 0.5, 1] as [number, number, number, number],
  easeOutCubic: [0.22, 1, 0.36, 1] as [number, number, number, number],
  easeInOutCubic: [0.4, 0, 0.2, 1] as [number, number, number, number],
  easeOutBack: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  spring: { type: "spring" as const, stiffness: 300, damping: 25 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 10 },
};

// Page transitions
export const pageVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20, 
    scale: 0.98,
    filter: "blur(4px)" 
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 0.4, 
      ease: easings.easeOutCubic,
      staggerChildren: 0.05,
      delayChildren: 0.1
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    filter: "blur(2px)",
    transition: { 
      duration: 0.25, 
      ease: easings.easeInOutCubic 
    },
  },
};

// Enhanced fade in up with delay
export const fadeInUp = (delay = 0): Variants => ({
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: easings.easeOutCubic },
  },
});

// Enhanced stagger container
export const staggerContainer = (stagger = 0.08): Variants => ({
  animate: {
    transition: { staggerChildren: stagger },
  },
});

// Card animations
export const cardVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easings.easeOutCubic
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: easings.easeInOutCubic
    }
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeInOut"
    }
  }
};

// Modal animations
export const modalVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.8, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: easings.easeOutCubic
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 20,
    transition: {
      duration: 0.2,
      ease: easings.easeInOutCubic
    }
  }
};

// Utility functions
export const createStaggerDelay = (index: number, baseDelay = 0.1) => ({
  delay: index * baseDelay
});

export const createSpringTransition = (
  stiffness = 300,
  damping = 25,
  mass = 1
) => ({
  type: "spring" as const,
  stiffness,
  damping,
  mass
});
