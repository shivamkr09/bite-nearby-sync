
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RestaurantManagementCard from "@/components/vendor/RestaurantManagementCard";
import { useRestaurant } from "@/contexts/RestaurantContext";
import CreateRestaurantModal from "@/components/vendor/CreateRestaurantModal";
import { Button } from "@/components/ui/button";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendorRestaurants.map((restaurant) => (
            <RestaurantManagementCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
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
