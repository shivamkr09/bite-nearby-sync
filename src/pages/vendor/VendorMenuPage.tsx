
import { useEffect } from "react";
import MenuManagement from "@/components/vendor/MenuManagement";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Menu Management</h1>
      
      {vendorRestaurants.length > 0 ? (
        <>
          <motion.div className="mb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <label className="block text-sm font-medium mb-1">
              Select Restaurant
            </label>
            <Select
              value={selectedRestaurantId}
              onValueChange={setSelectedRestaurantId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a restaurant" />
              </SelectTrigger>
              <SelectContent>
                {vendorRestaurants.map((restaurant) => (
                  <SelectItem key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
          
          {selectedRestaurantId && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <MenuManagement restaurantId={selectedRestaurantId} />
            </motion.div>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">No Restaurants Found</CardTitle>
          </CardHeader>
          <CardContent className="motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-1">
            <p>
              You need to create a restaurant before managing menus. Go to the Restaurants section to add your first restaurant.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorMenuPage;
