import { motion } from "framer-motion";
import { ReactNode } from "react";

// Mobile-optimized animation variants
export const mobileAnimationVariants = {
  // Reduced motion for better performance on mobile
  pageEnter: {
    opacity: 0,
    y: 20,
  },
  pageCenter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  pageExit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  
  // Optimized card animations for mobile
  cardContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  },
  
  cardItem: {
    hidden: { 
      opacity: 0, 
      y: 15,
      scale: 0.98 
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  },

  // Mobile-friendly hover effects (reduced)
  mobileHover: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }
};

// Mobile-optimized text scaling
export const mobileTextClasses = {
  hero: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
  title: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
  subtitle: "text-lg sm:text-xl md:text-2xl",
  body: "text-sm sm:text-base",
  caption: "text-xs sm:text-sm"
};

// Mobile-optimized spacing
export const mobileSpacingClasses = {
  section: "space-y-4 sm:space-y-6",
  container: "p-4 sm:p-6 lg:p-8",
  cardGrid: "gap-4 sm:gap-6",
  gap: "space-y-2",
  tight: "space-y-1 sm:space-y-2"
};

// Mobile gesture handlers
export const mobileGestures = {
  swipeThreshold: 10000,
  dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
  dragElastic: 0.1,
  dragTransition: { bounceStiffness: 600, bounceDamping: 20 }
};

// Performance optimizations for mobile
export const mobilePerformanceSettings = {
  // Reduced animation complexity for mobile
  reducedMotion: typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  // Lazy loading threshold for mobile
  rootMargin: '50px',
  threshold: 0.1,
};

// Mobile-specific button styles
// Mobile-optimized button classes
export const mobileButtonClasses = {
  primary: "h-12 px-6 text-base touch-manipulation",
  secondary: "h-11 px-5 text-sm touch-manipulation", 
  icon: "h-10 w-10 touch-manipulation",
  large: "h-14 px-8 text-lg touch-manipulation",
  medium: "h-12 px-6 text-base touch-manipulation",
  small: "h-10 px-4 text-sm touch-manipulation"
};

// Mobile-optimized form input styles
export const mobileInputClasses = {
  base: "h-12 sm:h-10 md:h-12 px-4 sm:px-3 md:px-4 text-base sm:text-sm md:text-base",
  withIcon: "h-12 sm:h-10 md:h-12 pl-12 sm:pl-10 md:pl-12 pr-4 sm:pr-3 md:pr-4"
};

// Responsive grid utilities
export const responsiveGrids = {
  auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  stats: "grid-cols-2 sm:grid-cols-2 md:grid-cols-4",
  features: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  testimonials: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  cards: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
};

// Mobile navigation improvements
export const mobileNavClasses = {
  header: "h-16 sm:h-14 md:h-16",
  logo: "text-lg sm:text-base md:text-xl",
  navItem: "px-4 py-3 sm:px-3 sm:py-2 md:px-4 md:py-3 text-base sm:text-sm md:text-base",
  button: "h-10 px-4 sm:h-8 sm:px-3 md:h-10 md:px-4"
};

// Utility functions
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

// Touch-friendly interaction props
export const getTouchFriendlyProps = () => ({
  className: "touch-manipulation select-none"
});

export default {
  mobileAnimationVariants,
  mobileTextClasses,
  mobileSpacingClasses,
  mobileGestures,
  mobilePerformanceSettings,
  mobileButtonClasses,
  mobileInputClasses,
  responsiveGrids,
  mobileNavClasses,
  isMobileDevice,
  getTouchFriendlyProps
};