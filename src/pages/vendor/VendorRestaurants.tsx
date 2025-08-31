
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RestaurantManagementCard from "@/components/vendor/RestaurantManagementCard";
import { useRestaurant } from "@/contexts/RestaurantContext";
import CreateRestaurantModal from "@/components/vendor/CreateRestaurantModal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const VendorRestaurants = () => {
  const { vendorRestaurants, fetchVendorRestaurants } = useRestaurant();
  
  useEffect(() => {
    fetchVendorRestaurants();
  }, [fetchVendorRestaurants]);

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Restaurants</h1>
        <CreateRestaurantModal />
      </div>
      
      {vendorRestaurants.length > 0 ? (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendorRestaurants.map((restaurant, idx) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              <RestaurantManagementCard restaurant={restaurant} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-1">
            <p className="mb-4">
              You don't have any restaurants yet. Create your first restaurant to start receiving orders.
            </p>
            <CreateRestaurantModal trigger={<Button>Create Restaurant</Button>} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorRestaurants;
