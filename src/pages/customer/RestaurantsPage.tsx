
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import RestaurantCard from "@/components/customer/RestaurantCard";
import { useLocation } from "@/contexts/LocationContext";
import { useRestaurant } from "@/contexts/RestaurantContext";

const RestaurantsPage = () => {
  const { userLocation, locationError, requestLocationPermission, isLoading: locationLoading } = useLocation();
  const { restaurants, fetchNearbyRestaurants, searchRestaurants, isLoading: restaurantsLoading } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  
  useEffect(() => {
    // Fetch restaurants on component mount - with or without location
    if (userLocation) {
      // Pass userLocation coordinates to fetchNearbyRestaurants
      fetchNearbyRestaurants(userLocation.latitude, userLocation.longitude);
    } else {
      // Fetch all restaurants if location not available - pass undefined parameters
      fetchNearbyRestaurants();
    }
  }, [userLocation, fetchNearbyRestaurants]);
  
  // Handle text search
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      searchRestaurants(searchQuery);
    } else {
      // Reset to standard fetch if search is cleared
      if (userLocation) {
        fetchNearbyRestaurants(userLocation.latitude, userLocation.longitude);
      } else {
        fetchNearbyRestaurants();
      }
    }
  };

  // Handle location search submission
  const handleLocationSearch = () => {
    if (locationSearchQuery.trim() !== "") {
      searchRestaurants(locationSearchQuery);
    }
  };

  // Filter restaurants by name/description for the name search input
  const filteredRestaurants = searchQuery
    ? restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (restaurant.description && restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : restaurants;

  const isAnyRestaurant = filteredRestaurants.length > 0;
  const isLoading = locationLoading || restaurantsLoading;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Restaurants</h1>
        
        {userLocation ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              Using your current location
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Search for restaurants by name or location
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Button 
                onClick={() => requestLocationPermission()} 
                variant="outline"
                disabled={locationLoading}
              >
                {locationLoading ? 'Detecting Location...' : 'Use My Location'}
              </Button>
              {locationError && (
                <p className="text-sm text-destructive">{locationError}</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Location search */}
      <div className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by location or address..."
            value={locationSearchQuery}
            onChange={(e) => setLocationSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleLocationSearch} disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            Find
          </Button>
        </div>
      </div>
      
      {/* Name/description search */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by restaurant name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <p className="text-xl font-medium">Loading restaurants...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait</p>
          </div>
        </div>
      ) : isAnyRestaurant ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl font-medium">No restaurants found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try a different search term or location
          </p>
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
