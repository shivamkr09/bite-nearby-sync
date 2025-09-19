import React from "react";
import { motion, type Variants } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SpinLoader } from "./loading";

const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.15, ease: "easeOut" }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1, ease: "easeInOut" }
  },
  loading: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

const rippleVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 4, 
    opacity: [0.5, 0],
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  ripple?: boolean;
  glowOnHover?: boolean;
  iconBounce?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    className, 
    loading = false, 
    disabled, 
    ripple = true,
    glowOnHover = false,
    iconBounce = false,
    onClick,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);
    const [rippleId, setRippleId] = React.useState(0);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      
      if (ripple) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const newRipple = { id: rippleId, x, y };
        setRipples(prev => [...prev, newRipple]);
        setRippleId(prev => prev + 1);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
      }
      
      onClick?.(event);
    };

    return (
      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover={!disabled && !loading ? "hover" : undefined}
        whileTap={!disabled && !loading ? "tap" : undefined}
        animate={loading ? "loading" : "initial"}
        className="relative inline-block"
      >
        {/* Glow effect */}
        {glowOnHover && !disabled && (
          <motion.div
            className="absolute inset-0 rounded-md opacity-0 blur-sm"
            whileHover={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "linear-gradient(45deg, var(--primary), transparent, var(--primary))"
            }}
          />
        )}
        
        <Button
          ref={ref}
          className={cn(
            "relative overflow-hidden transition-all duration-200",
            loading && "cursor-wait",
            iconBounce && "group",
            className
          )}
          disabled={disabled || loading}
          onClick={handleClick}
          {...props}
        >
          {/* Ripple effects */}
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute bg-white/30 rounded-full pointer-events-none"
              style={{
                left: ripple.x - 10,
                top: ripple.y - 10,
                width: 20,
                height: 20,
              }}
              variants={rippleVariants}
              initial="initial"
              animate="animate"
            />
          ))}
          
          {/* Loading state */}
          {loading ? (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <SpinLoader size="sm" />
              <span>Loading...</span>
            </motion.div>
          ) : (
            <motion.div
              className={cn(
                "flex items-center gap-2",
                iconBounce && "group-hover:animate-pulse"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

// Floating Action Button with special animations
interface FloatingButtonProps extends AnimatedButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  ({ position = 'bottom-right', className, children, ...props }, ref) => {
    const positionClasses = {
      'bottom-right': 'fixed bottom-6 right-6',
      'bottom-left': 'fixed bottom-6 left-6',
      'top-right': 'fixed top-6 right-6',
      'top-left': 'fixed top-6 left-6',
    };

    return (
      <motion.div
        className={cn(positionClasses[position], "z-50")}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatedButton
          ref={ref}
          className={cn(
            "rounded-full h-14 w-14 shadow-lg hover:shadow-xl",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            className
          )}
          ripple
          glowOnHover
          {...props}
        >
          {children}
        </AnimatedButton>
      </motion.div>
    );
  }
);

FloatingButton.displayName = "FloatingButton";

// Success button with celebration animation
export const SuccessButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, onClick, ...props }, ref) => {
    const [showSuccess, setShowSuccess] = React.useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
      onClick?.(event);
    };

    return (
      <motion.div className="relative">
        <AnimatedButton
          ref={ref}
          onClick={handleClick}
          className={cn(
            showSuccess && "bg-emerald-500 hover:bg-emerald-600"
          )}
          {...props}
        >
          <motion.div
            animate={showSuccess ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {showSuccess ? "Success!" : children}
          </motion.div>
        </AnimatedButton>
        
        {/* Celebration particles */}
        {showSuccess && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos(i * 60 * Math.PI / 180) * 30,
                  y: Math.sin(i * 60 * Math.PI / 180) * 30,
                }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  }
);

SuccessButton.displayName = "SuccessButton";