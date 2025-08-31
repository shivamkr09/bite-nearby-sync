import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";

const variants: Variants = {
  initial: { opacity: 0, y: 10, filter: "blur(2px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: { opacity: 0, y: -6, filter: "blur(2px)", transition: { duration: 0.2 } },
};

export default function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={variants} initial="initial" animate="animate" exit="exit">
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
