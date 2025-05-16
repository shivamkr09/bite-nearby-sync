
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RestaurantType } from "@/types/models";

export function useNearbyRestaurants() {
  const [nearbyRestaurants, setNearbyRestaurants] = useState<RestaurantType[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const { toast } = useToast();

  const fetchNearbyRestaurants = useCallback(async (latitude?: number, longitude?: number, distance = 10) => {
    try {
      // In a real app, we would use a spatial query here
      // For now, we'll just fetch all restaurants as a simplified example
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
      
      // Filter and sort by distance
      const nearby = restaurantsWithDistance
        .filter((r) => r.distance !== undefined && r.distance <= distance)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setNearbyRestaurants(nearby);
      setRestaurants(nearby); // Also update restaurants for customer pages
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch nearby restaurants"
      });
    }
  }, [toast]);

  return {
    nearbyRestaurants,
    restaurants,
    fetchNearbyRestaurants
  };
}
