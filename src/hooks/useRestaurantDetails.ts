
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

      // Ensure all required properties from RestaurantDetailsType are present
      const fullRestaurantDetails: RestaurantDetailsType = {
        ...restaurant,
        city: restaurant.city || null,
        state: restaurant.state || null,
        zip_code: restaurant.zip_code || null,
        phone_number: restaurant.phone_number || null,
        website: restaurant.website || null,
        cuisine_type: restaurant.cuisine_type || null,
        rating: restaurant.rating || null,
        number_of_ratings: restaurant.number_of_ratings || null,
        opening_time: restaurant.opening_time || null,
        closing_time: restaurant.closing_time || null,
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
