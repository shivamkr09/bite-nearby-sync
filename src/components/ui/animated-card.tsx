import React from "react";
import { motion, type Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const cardVariants: Variants = {
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
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
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

const glowVariants: Variants = {
  initial: { opacity: 0 },
  hover: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  enableHover?: boolean;
  enableGlow?: boolean;
  glowColor?: string;
  hoverScale?: number;
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    children, 
    className, 
    delay = 0, 
    enableHover = true, 
    enableGlow = false,
    glowColor = "rgb(59, 130, 246)",
    hoverScale = 1.02,
    ...props 
  }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            delay
          }
        }}
        exit={{ 
          opacity: 0, 
          y: -10, 
          scale: 0.95,
          transition: {
            duration: 0.2,
            ease: "easeInOut"
          }
        }}
        whileHover={enableHover ? {
          y: -4,
          scale: hoverScale,
          transition: {
            duration: 0.2,
            ease: "easeOut"
          }
        } : undefined}
        whileTap={enableHover ? {
          scale: 0.98,
          transition: {
            duration: 0.1,
            ease: "easeInOut"
          }
        } : undefined}
        className="relative"
      >
        {enableGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ 
              opacity: 1,
              transition: { duration: 0.3 }
            }}
            className="absolute -inset-0.5 rounded-lg opacity-0 blur-sm"
            style={{
              background: `linear-gradient(45deg, ${glowColor}, transparent, ${glowColor})`
            }}
          />
        )}
        <Card
          ref={ref}
          className={cn(
            "relative transition-all duration-200",
            enableHover && "hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/5",
            enableGlow && "relative",
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

// Staggered container for multiple cards
export const CardContainer = ({ children, className, staggerDelay = 0.1 }: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) => {
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
};