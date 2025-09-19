
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RestaurantManagementCard from "@/components/vendor/RestaurantManagementCard";
import { useRestaurant } from "@/contexts/RestaurantContext";
import CreateRestaurantModal from "@/components/vendor/CreateRestaurantModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store, 
  Plus, 
  MapPin, 
  Star, 
  Clock, 
  Settings,
  TrendingUp,
  Users
} from "lucide-react";
import { mobileTextClasses } from "@/lib/mobile-optimizations";

const VendorRestaurants = () => {
  const { vendorRestaurants, fetchVendorRestaurants } = useRestaurant();
  
  useEffect(() => {
    fetchVendorRestaurants();
  }, [fetchVendorRestaurants]);

  const openRestaurants = vendorRestaurants.filter(r => r.is_open).length;
  const totalRestaurants = vendorRestaurants.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-gray-900 dark:to-orange-900/10 relative">
      {/* Modern Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-8 mb-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <motion.h1 
                className={`${mobileTextClasses.title} font-bold mb-2`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Restaurant Portfolio
              </motion.h1>
              <motion.p 
                className="text-orange-100 text-sm sm:text-base max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Manage your restaurant empire. Track performance, update settings, and expand your business reach with professional tools.
              </motion.p>
              
              {/* Quick Stats */}
              <motion.div 
                className="flex flex-wrap gap-4 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Store className="h-3 w-3 mr-1" />
                  {totalRestaurants} Restaurant{totalRestaurants !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Clock className="h-3 w-3 mr-1" />
                  {openRestaurants} Currently Open
                </Badge>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 mr-2" />
                Analytics
              </Button>
              <CreateRestaurantModal 
                trigger={
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-50 shadow-lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Restaurant
                  </Button>
                } 
              />
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-400/20 to-transparent rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      {/* Restaurant Grid or Empty State */}
      <AnimatePresence mode="wait">
        {vendorRestaurants.length > 0 ? (
          <motion.div 
            key="restaurants-grid"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {vendorRestaurants.map((restaurant, idx) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <RestaurantManagementCard restaurant={restaurant} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-xl max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <Store className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Start Your Restaurant Journey
                </motion.h3>
                
                <motion.p 
                  className="text-muted-foreground mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  You don't have any restaurants yet. Create your first restaurant to start receiving orders, 
                  managing menus, and growing your business with our powerful tools.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <CreateRestaurantModal 
                    trigger={
                      <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg">
                        <Plus className="h-5 w-5 mr-2" />
                        Create Your First Restaurant
                      </Button>
                    } 
                  />
                </motion.div>
                
                {/* Feature highlights */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    Location Management
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-orange-500" />
                    Customer Analytics
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Settings className="h-4 w-4 text-orange-500" />
                    Easy Configuration
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorRestaurants;
