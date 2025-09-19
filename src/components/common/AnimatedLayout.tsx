import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";

const pageVariants: Variants = {
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
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
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
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number] 
    },
  },
};

const childVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 12,
    transition: { duration: 0.2 }
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { duration: 0.15 }
  }
};

export default function AnimatedLayout() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div 
        key={location.pathname} 
        variants={pageVariants} 
        initial="initial" 
        animate="animate" 
        exit="exit"
        className="relative"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

// Export the child variants for use in child components
export { childVariants };
