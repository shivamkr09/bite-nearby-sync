
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Menu, ShoppingCart, User, Bell, Heart, MapPin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useOrder } from "@/contexts/OrderContext";
import { useState } from "react";
import ThemeToggle from "../common/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileBottomNav from "./MobileBottomNav";
import AnimatedOutlet from "@/components/common/AnimatedOutlet";
import { motion, AnimatePresence } from "framer-motion";
import { mobileButtonClasses } from "@/lib/mobile-optimizations";

const CustomerLayout = () => {
  const { user, signOut } = useAuth();
  const { cart } = useOrder();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: "Restaurants", path: "/customer/restaurants", icon: MapPin },
    { label: "My Orders", path: "/customer/orders", icon: ShoppingCart },
    { label: "Favorites", path: "/customer/favorites", icon: Heart },
    { label: "Profile", path: "/customer/profile", icon: User },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container mx-auto px-4 h-16 sm:h-18 flex items-center justify-between">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Link 
              to="/" 
              className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hover:from-primary/80 hover:to-purple-600/80 transition-all duration-300"
            >
              Bite<span className="text-foreground">Nearby</span>
            </Link>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-2 sm:space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Notifications Icon */}
            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative hover:bg-primary/10 transition-colors duration-200"
                >
                  <Bell className="h-5 w-5" />
                  <motion.span 
                    className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </Button>
              </motion.div>
            )}
            
            <ThemeToggle />
            
            {/* Enhanced Cart Icon */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/customer/cart" className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-primary/10 transition-all duration-200"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span 
                        className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>
            </motion.div>
            
            {/* Modern Menu Sheet */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`${mobileButtonClasses.icon} hover:bg-primary/10 transition-all duration-200 ml-1`}
                  >
                    <motion.div
                      animate={isMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
                    </motion.div>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-l border-white/20 dark:border-gray-700/20">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col space-y-6">
                  {user ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center space-x-4 py-4 px-4 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">Customer Account</p>
                        </div>
                      </motion.div>
                      
                      <nav className="flex flex-col space-y-2">
                        {navItems.map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <motion.div
                              key={item.path}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                            >
                              <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                  `flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                                    isActive 
                                      ? "bg-gradient-to-r from-primary/20 to-purple-600/20 text-primary border border-primary/30" 
                                      : "hover:bg-white/50 dark:hover:bg-gray-800/50 border border-transparent"
                                  }`
                                }
                                onClick={closeMenu}
                              >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                              </NavLink>
                            </motion.div>
                          );
                        })}
                      </nav>
                      
                      <motion.div 
                        className="pt-6 mt-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                          onClick={() => {
                            signOut();
                            closeMenu();
                          }}
                        >
                          Sign Out
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg"
                        onClick={() => {
                          navigate("/signin");
                          closeMenu();
                        }}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20"
                        onClick={() => {
                          navigate("/signup");
                          closeMenu();
                        }}
                      >
                        Sign Up
                      </Button>
                    </motion.div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        </div>
      </motion.header>

      {/* Main content with enhanced styling */}
      <main className="flex-1 container mx-auto px-4 pb-20 md:pb-8 relative z-10">
        <AnimatedOutlet />
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default CustomerLayout;
