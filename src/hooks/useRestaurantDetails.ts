
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RestaurantDetailsType } from "@/types/models";

export function useRestaurantDetails() {
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetailsType | null>(null);
  const { toast } = useToast();

  const fetchRestaurantDetails = useCallback(async (id: string): Promise<RestaurantDetailsType | null> => {
    try {
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();
        
      if (restaurantError) throw restaurantError;

      const { data: menuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', id)
        .order('category', { ascending: true });
        
      if (menuError) throw menuError;
        
      // Get unique categories
      const categories = menuItems ? 
        [...new Set(menuItems.map(item => item.category))] : 
        [];

      // Create a fully typed restaurant details object with all required fields
      const fullRestaurantDetails: RestaurantDetailsType = {
        // Base restaurant fields from database
        id: restaurant.id,
        created_at: restaurant.created_at,
        name: restaurant.name,
        description: restaurant.description || null,
        address: restaurant.address || null,
        owner_id: restaurant.owner_id,
        image_url: restaurant.image_url || null,
        rating: restaurant.rating || null,
        is_open: restaurant.is_open !== null ? restaurant.is_open : null,
        latitude: restaurant.latitude || null,
        longitude: restaurant.longitude || null,
        updated_at: restaurant.updated_at || null,
        
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
        
        // Menu related fields
        menu_items: menuItems || [],
        menu: menuItems || [],
        categories
      };
      
      setRestaurantDetails(fullRestaurantDetails);
      return fullRestaurantDetails;
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch restaurant details"
      });
      return null;
    }
  }, [toast]);

  return {
    restaurantDetails,
    fetchRestaurantDetails
  };
}
