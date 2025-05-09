
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import RestaurantCard from "@/components/customer/RestaurantCard";
import { useLocation } from "@/contexts/LocationContext";
import { useRestaurant } from "@/contexts/RestaurantContext";

const RestaurantsPage = () => {
  const { userLocation, locationError, requestLocationPermission, isLoading: locationLoading } = useLocation();
  const { restaurants, fetchNearbyRestaurants } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    if (userLocation) {
      fetchNearbyRestaurants();
    }
  }, [userLocation, fetchNearbyRestaurants]);
  
  const filteredRestaurants = searchQuery
    ? restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : restaurants;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Nearby Restaurants</h1>
        {userLocation ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              Using your current location
            </span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Button 
              onClick={() => requestLocationPermission()} 
              disabled={locationLoading}
            >
              {locationLoading ? 'Detecting Location...' : 'Enable Location'}
            </Button>
            {locationError && (
              <p className="text-sm text-destructive">{locationError}</p>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {locationLoading ? (
        <div className="text-center py-8">
          <div className="animate-pulse-light">
            <p className="text-xl font-medium">Detecting your location...</p>
            <p className="text-sm text-muted-foreground mt-2">We'll show you nearby restaurants soon!</p>
          </div>
        </div>
      ) : userLocation ? (
        filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl font-medium">No restaurants found nearby</p>
            <p className="text-sm text-muted-foreground mt-2">
              There are no restaurants within 1km of your location 
              {searchQuery && " matching your search"}
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <p className="text-xl font-medium">Enable location to see nearby restaurants</p>
          <p className="text-sm text-muted-foreground mt-2">
            We need your location to find restaurants within 1km of you
          </p>
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
