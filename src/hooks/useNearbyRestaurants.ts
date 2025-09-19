
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RestaurantType } from "@/types/models";

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

export function useNearbyRestaurants() {
  const [nearbyRestaurants, setNearbyRestaurants] = useState<RestaurantType[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchNearbyRestaurants = useCallback(async (latitude?: number, longitude?: number, distance = 10) => {
    try {
      setIsLoading(true);
      // Fetch all restaurants regardless of location
      const { data, error } = await supabase
        .from('restaurants')
        .select('*');
      
      if (error) throw error;
      
      // Calculate distances if coordinates are provided
      const restaurantsWithDistance = data.map((restaurant: any) => {
        let calculatedDistance = undefined; // No distance if coordinates not available
        
        if (latitude && longitude && restaurant.latitude && restaurant.longitude) {
          // Use proper Haversine formula for accurate distance calculation
          calculatedDistance = calculateDistance(
            latitude, 
            longitude, 
            restaurant.latitude, 
            restaurant.longitude
          );
        }
        
        // Create a fully typed restaurant object with all required fields
        const completeRestaurant: RestaurantType = {
          id: restaurant.id,
          created_at: restaurant.created_at,
          name: restaurant.name,
          description: restaurant.description || null,
          address: restaurant.address || null,
          owner_id: restaurant.owner_id,
          image_url: restaurant.image_url || null,
          rating: restaurant.rating || null,
          is_open: restaurant.is_open !== null ? restaurant.is_open : false,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          updated_at: restaurant.updated_at,
          distance: calculatedDistance,
          
          // Additional fields required by our type definitions that might not be in database
          city: null,
          state: null,
          zip_code: null,
          phone_number: null,
          website: null,
          cuisine_type: null,
          number_of_ratings: null,
          opening_time: null,
          closing_time: null,
          
          // Add categories and menu_items as empty arrays for consistency
          categories: [],
          menu_items: [],
          menu: []
        };
        
        return completeRestaurant;
      });
      
      // If location is provided, filter by distance and sort
      if (latitude && longitude) {
        const nearby = restaurantsWithDistance
          .filter((r) => r.distance !== undefined && r.distance <= distance)
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));
        
        setNearbyRestaurants(nearby);
        setRestaurants(nearby);
      } else {
        // If no location, just set all restaurants (without distance)
        setNearbyRestaurants(restaurantsWithDistance);
        setRestaurants(restaurantsWithDistance);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch restaurants"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const searchRestaurants = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      // Search by name or address
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .or(`name.ilike.%${query}%,address.ilike.%${query}%`);
      
      if (error) throw error;
      
      // Format the restaurants with the same structure
      const formattedResults = data.map((restaurant: any) => {
        return {
          id: restaurant.id,
          created_at: restaurant.created_at,
          name: restaurant.name,
          description: restaurant.description || null,
          address: restaurant.address || null,
          owner_id: restaurant.owner_id,
          image_url: restaurant.image_url || null,
          rating: restaurant.rating || null,
          is_open: restaurant.is_open !== null ? restaurant.is_open : false,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          updated_at: restaurant.updated_at,
          distance: undefined, // No distance when searching without location
          
          city: null,
          state: null,
          zip_code: null,
          phone_number: null,
          website: null,
          cuisine_type: null,
          number_of_ratings: null,
          opening_time: null,
          closing_time: null,
          
          categories: [],
          menu_items: [],
          menu: []
        };
      });
      
      // Update both state variables with search results
      setRestaurants(formattedResults);
      setNearbyRestaurants(formattedResults);
    } catch (error) {
      console.error("Error searching restaurants:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search restaurants"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    nearbyRestaurants,
    restaurants,
    isLoading,
    fetchNearbyRestaurants,
    searchRestaurants
  };
}
