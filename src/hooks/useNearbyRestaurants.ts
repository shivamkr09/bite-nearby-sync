
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RestaurantType } from "@/types/models";

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
        let calculatedDistance = 999; // Default large distance
        
        if (latitude && longitude && restaurant.latitude && restaurant.longitude) {
          // Simple distance calculation (not accurate but works for demo)
          const dx = restaurant.longitude - longitude;
          const dy = restaurant.latitude - latitude;
          calculatedDistance = Math.sqrt(dx * dx + dy * dy) * 111; // rough conversion to km
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
        // If no location, just set all restaurants
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
          distance: 999, // Default distance when searching
          
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
