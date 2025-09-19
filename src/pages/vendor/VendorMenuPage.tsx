
import { useEffect, useState } from "react";
import MenuManagement from "@/components/vendor/MenuManagement";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChefHat, 
  Menu, 
  Plus, 
  Store, 
  Utensils,
  TrendingUp,
  Settings,
  MapPin
} from "lucide-react";
import { mobileTextClasses } from "@/lib/mobile-optimizations";
import { Link } from "react-router-dom";

const VendorMenuPage = () => {
  const { vendorRestaurants, fetchVendorRestaurants } = useRestaurant();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  
  useEffect(() => {
    fetchVendorRestaurants();
  }, [fetchVendorRestaurants]);
  
  useEffect(() => {
    if (vendorRestaurants.length > 0 && !selectedRestaurantId) {
      setSelectedRestaurantId(vendorRestaurants[0].id);
    }
  }, [vendorRestaurants, selectedRestaurantId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30 dark:from-gray-900 dark:to-green-900/10 relative">
      {/* Modern Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 mb-8 text-white"
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
                Menu Management
              </motion.h1>
              <motion.p 
                className="text-green-100 text-sm sm:text-base max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Craft delicious experiences. Manage your restaurant menus, set prices, and showcase your culinary expertise to attract more customers.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 mr-2" />
                Menu Analytics
              </Button>
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-50 shadow-lg">
                <Settings className="h-5 w-5 mr-2" />
                Bulk Import
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-400/20 to-transparent rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      <AnimatePresence mode="wait">
        {vendorRestaurants.length > 0 ? (
          <motion.div
            key="menu-management"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Restaurant Selector */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-xl flex items-center justify-center">
                        <Store className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">
                          Select Restaurant
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Choose which restaurant menu to manage
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 max-w-md">
                      <Select
                        value={selectedRestaurantId}
                        onValueChange={setSelectedRestaurantId}
                      >
                        <SelectTrigger className="bg-white/50 border-white/20 backdrop-blur-sm">
                          <SelectValue placeholder="Select a restaurant" />
                        </SelectTrigger>
                        <SelectContent>
                          {vendorRestaurants.map((restaurant) => (
                            <SelectItem key={restaurant.id} value={restaurant.id}>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {restaurant.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Menu Management Component */}
            {selectedRestaurantId && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <MenuManagement restaurantId={selectedRestaurantId} />
              </motion.div>
            )}
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
                  className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <ChefHat className="h-12 w-12 text-green-600 dark:text-green-400" />
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Create Your First Restaurant
                </motion.h3>
                
                <motion.p 
                  className="text-muted-foreground mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  You need to create a restaurant before managing menus. Set up your restaurant profile, 
                  location, and business details to start showcasing your delicious offerings.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link to="/vendor/restaurants">
                    <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Your First Restaurant
                    </Button>
                  </Link>
                </motion.div>
                
                {/* Feature highlights */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Menu className="h-4 w-4 text-green-500" />
                    Digital Menus
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Utensils className="h-4 w-4 text-green-500" />
                    Category Management
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Sales Analytics
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

export default VendorMenuPage;
