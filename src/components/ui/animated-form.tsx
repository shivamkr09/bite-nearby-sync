import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  showPasswordToggle?: boolean;
  floating?: boolean;
  icon?: React.ReactNode;
}

export const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ 
    label, 
    error, 
    success, 
    showPasswordToggle = false, 
    floating = false,
    icon,
    className, 
    type: originalType = "text",
    ...props 
  }, ref) => {
    const [type, setType] = React.useState(originalType);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    
    const togglePasswordVisibility = () => {
      setType(type === "password" ? "text" : "password");
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const showLabel = floating ? (isFocused || hasValue) : true;
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    return (
      <motion.div 
        className="relative space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Label */}
        {label && (
          <AnimatePresence>
            {(!floating || showLabel) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Label 
                  className={cn(
                    "transition-colors duration-200",
                    floating && "absolute left-3 z-10 bg-background px-1",
                    floating && (isFocused || hasValue) && "top-0 text-xs transform -translate-y-1/2",
                    floating && !isFocused && !hasValue && "top-1/2 transform -translate-y-1/2 text-muted-foreground",
                    hasError && "text-destructive",
                    hasSuccess && "text-emerald-600",
                    isFocused && !hasError && "text-primary"
                  )}
                >
                  {label}
                </Label>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Input container */}
        <motion.div 
          className="relative"
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.1 }}
        >
          {/* Left icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">
              {icon}
            </div>
          )}

          <Input
            ref={ref}
            type={type}
            className={cn(
              "transition-all duration-200",
              icon && "pl-10",
              showPasswordToggle && "pr-10",
              hasError && "border-destructive focus-visible:ring-destructive",
              hasSuccess && "border-emerald-500 focus-visible:ring-emerald-500",
              isFocused && "ring-2",
              floating && "placeholder-transparent",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />

          {/* Password toggle */}
          {showPasswordToggle && (
            <motion.button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {type === "password" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </motion.button>
          )}

          {/* Success/Error icons */}
          {(hasError || hasSuccess) && !showPasswordToggle && (
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {hasError && <X className="h-4 w-4 text-destructive" />}
              {hasSuccess && <Check className="h-4 w-4 text-emerald-600" />}
            </motion.div>
          )}

          {/* Focus ring animation */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="absolute inset-0 rounded-md border-2 border-primary/50"
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.05, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ pointerEvents: 'none' }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error/Success messages */}
        <AnimatePresence>
          {(error || success) && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "text-sm flex items-center gap-2",
                hasError && "text-destructive",
                hasSuccess && "text-emerald-600"
              )}
            >
              {hasError && <X className="h-3 w-3" />}
              {hasSuccess && <Check className="h-3 w-3" />}
              <span>{error || success}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

// Form container with staggered animations
interface AnimatedFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export const AnimatedForm = ({ children, className, onSubmit }: AnimatedFormProps) => {
  return (
    <motion.form
      className={className}
      onSubmit={onSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, staggerChildren: 0.1 }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1] 
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.form>
  );
};