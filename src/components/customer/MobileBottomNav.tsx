
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, ShoppingCart } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useOrder } from '@/contexts/order/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';

const MobileBottomNav = () => {
  const location = useLocation();
  const { cart } = useOrder();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Check if the current route is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/customer/restaurants', icon: Home, label: 'Home' },
    { path: '/customer/cart', icon: ShoppingCart, label: 'Cart', count: totalItems },
    { path: '/customer/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/customer/profile', icon: User, label: 'Profile' },
  ];

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 py-2 px-6 md:hidden z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex justify-between items-center">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className="flex flex-col items-center text-xs p-1 relative"
            >
              <motion.div
                className="relative flex flex-col items-center"
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                {/* Active indicator background */}
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -inset-2 bg-primary/10 rounded-xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>
                
                {/* Icon with animation */}
                <motion.div
                  className={cn(
                    "relative z-10 mb-1",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                  animate={active ? { y: -2 } : { y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Icon className="h-5 w-5" />
                  
                  {/* Cart count badge */}
                  {item.count && item.count > 0 && (
                    <AnimatePresence>
                      <motion.span
                        className="absolute -top-2 -right-2 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 30 
                        }}
                        key={item.count}
                      >
                        <motion.span
                          key={item.count}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 600, 
                            damping: 25 
                          }}
                        >
                          {item.count > 99 ? '99+' : item.count}
                        </motion.span>
                      </motion.span>
                    </AnimatePresence>
                  )}
                </motion.div>
                
                {/* Label with color animation */}
                <motion.span
                  className={cn(
                    "text-xs font-medium z-10",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                  animate={active ? { fontWeight: 600 } : { fontWeight: 500 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </div>
      
      {/* Bottom safe area for devices with home indicators */}
      <div className="h-safe-area-inset-bottom" />
    </motion.div>
  );
};

export default MobileBottomNav;
