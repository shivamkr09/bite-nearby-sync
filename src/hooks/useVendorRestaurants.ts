
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RestaurantType } from "@/types/models";

export function useVendorRestaurants(userId: string | undefined) {
  const [vendorRestaurants, setVendorRestaurants] = useState<RestaurantType[]>([]);
  const { toast } = useToast();

  const fetchVendorRestaurants = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', userId);
      
      if (error) throw error;
      
      // Ensure all fields from RestaurantType are present with proper null values
      const completeRestaurants: RestaurantType[] = data.map((restaurant: any) => ({
        id: restaurant.id,
        created_at: restaurant.created_at,
        name: restaurant.name,
        description: restaurant.description || null,
        address: restaurant.address || null,
        city: restaurant.city || null,
        state: restaurant.state || null,
        zip_code: restaurant.zip_code || null,
        phone_number: restaurant.phone_number || null,
        website: restaurant.website || null,
        owner_id: restaurant.owner_id,
        image_url: restaurant.image_url || null,
        cuisine_type: restaurant.cuisine_type || null,
        rating: restaurant.rating || null,
        number_of_ratings: restaurant.number_of_ratings || null,
        is_open: restaurant.is_open !== null ? restaurant.is_open : false,
        opening_time: restaurant.opening_time || null,
        closing_time: restaurant.closing_time || null,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        updated_at: restaurant.updated_at
      }));
      
      setVendorRestaurants(completeRestaurants);
    } catch (error) {
      console.error("Error fetching vendor restaurants:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch your restaurants"
      });
    }
  }, [userId, toast]);

  const createRestaurant = useCallback(async (data: Partial<RestaurantType>) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('restaurants')
        .insert({
          name: data.name || '',
          description: data.description || null,
          address: data.address || null,
          city: data.city || null,
          state: data.state || null,
          zip_code: data.zip_code || null,
          phone_number: data.phone_number || null,
          website: data.website || null,
          owner_id: userId,
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          image_url: data.image_url || null,
          cuisine_type: data.cuisine_type || null,
          is_open: true,
          number_of_ratings: 0,
          rating: 0,
          opening_time: data.opening_time || null,
          closing_time: data.closing_time || null
        });
        
      if (error) throw error;
      
      // Refetch restaurants
      fetchVendorRestaurants();
    } catch (error) {
      console.error("Error creating restaurant:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create restaurant"
      });
    }
  }, [userId, fetchVendorRestaurants, toast]);

  const updateRestaurant = useCallback(async (id: string, data: Partial<RestaurantType>) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setVendorRestaurants(prev => 
        prev.map(restaurant => 
          restaurant.id === id ? { ...restaurant, ...data, updated_at: new Date().toISOString() } : restaurant
        )
      );
      
      toast({
        title: "Restaurant updated",
        description: "Restaurant details have been updated"
      });
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update restaurant"
      });
    }
  }, [toast]);

  const deleteRestaurant = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setVendorRestaurants(prev => prev.filter(restaurant => restaurant.id !== id));
      
      toast({
        title: "Restaurant deleted",
        description: "Restaurant has been deleted"
      });
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete restaurant"
      });
    }
  }, [toast]);

  const updateRestaurantStatus = useCallback(async (restaurantId: string, isOpen: boolean) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({ 
          is_open: isOpen,
          updated_at: new Date().toISOString()
        })
        .eq('id', restaurantId);
      
      if (error) throw error;
      
      // Update local state
      setVendorRestaurants(prev => 
        prev.map(restaurant => 
          restaurant.id === restaurantId ? 
          { ...restaurant, is_open: isOpen, updated_at: new Date().toISOString() } : 
          restaurant
        )
      );
      
      toast({
        title: `Restaurant ${isOpen ? 'opened' : 'closed'}`,
        description: `Restaurant is now ${isOpen ? 'open' : 'closed'} for orders`
      });
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update restaurant status"
      });
    }
  }, [toast]);

  return {
    vendorRestaurants,
    fetchVendorRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    updateRestaurantStatus
  };
}
