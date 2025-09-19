import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton = ({ className, animate = true }: SkeletonProps) => {
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md";
  
  if (!animate) {
    return <div className={cn(baseClasses, className)} />;
  }

  return (
    <motion.div
      className={cn(baseClasses, "relative overflow-hidden", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      />
    </motion.div>
  );
};

// Restaurant Card Skeleton
export const RestaurantCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
  >
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    <div className="px-6 py-4 border-t">
      <Skeleton className="h-4 w-1/3" />
    </div>
  </motion.div>
);

// Menu Item Card Skeleton
export const MenuItemCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden"
  >
    <div className="p-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  </motion.div>
);

// Dashboard Metric Card Skeleton
export const MetricCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6"
  >
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-16" />
    </div>
  </motion.div>
);

// Loading Page Skeleton
export const LoadingPageSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-6 p-6"
  >
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <RestaurantCardSkeleton key={i} />
      ))}
    </div>
  </motion.div>
);

// Pulsing loader for buttons
export const ButtonLoader = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <motion.div
      className={cn("rounded-full bg-current opacity-20", sizeClasses[size])}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.8, 0.2],
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    />
  );
};

// Spinning loader
export const SpinLoader = ({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <motion.div
      className={cn("border-2 border-gray-300 border-t-primary rounded-full", sizeClasses[size], className)}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Infinity,
      }}
    />
  );
};