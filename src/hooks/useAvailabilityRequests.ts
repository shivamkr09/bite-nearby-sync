
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AvailabilityRequestWithItems, RestaurantType } from "@/types/models";

export function useAvailabilityRequests(userId: string | undefined) {
  const [availabilityRequests, setAvailabilityRequests] = useState<AvailabilityRequestWithItems[]>([]);
  const { toast } = useToast();

  const fetchVendorAvailabilityRequests = useCallback(async () => {
    if (!userId) return;
    
    try {
      // Get vendor restaurants
      const { data: restaurants, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', userId);

      if (restaurantError) throw restaurantError;
      
      if (restaurants.length === 0) {
        setAvailabilityRequests([]);
        return;
      }

      const restaurantIds = restaurants.map(r => r.id);
      
      // Get availability requests
      const { data, error } = await supabase
        .from('availability_requests')
        .select(`
          *,
          items:availability_request_items(
            *,
            menu_item:menu_items(*)
          ),
          restaurant:restaurants(*)
        `)
        .in('restaurant_id', restaurantIds)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process and map data to ensure type compatibility
      const typedRequests: AvailabilityRequestWithItems[] = (data || []).map((request: any) => {
        // Create a properly typed restaurant object
        const restaurant: RestaurantType | undefined = request.restaurant ? {
          id: request.restaurant.id,
          created_at: request.restaurant.created_at,
          name: request.restaurant.name,
          description: request.restaurant.description || null,
          address: request.restaurant.address || null,
          city: request.restaurant.city || null,
          state: request.restaurant.state || null,
          zip_code: request.restaurant.zip_code || null,
          phone_number: request.restaurant.phone_number || null,
          website: request.restaurant.website || null,
          owner_id: request.restaurant.owner_id,
          image_url: request.restaurant.image_url || null,
          cuisine_type: request.restaurant.cuisine_type || null,
          rating: request.restaurant.rating || null,
          number_of_ratings: request.restaurant.number_of_ratings || null,
          is_open: request.restaurant.is_open !== null ? request.restaurant.is_open : false,
          opening_time: request.restaurant.opening_time || null,
          closing_time: request.restaurant.closing_time || null,
          latitude: request.restaurant.latitude,
          longitude: request.restaurant.longitude,
          updated_at: request.restaurant.updated_at
        } : undefined;

        return {
          ...request,
          restaurant
        };
      });
      
      setAvailabilityRequests(typedRequests);
    } catch (error) {
      console.error("Error fetching availability requests:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch availability requests"
      });
    }
  }, [userId, toast]);

  const respondToAvailabilityRequest = useCallback(async (requestId: string, estimatedTime: string, isAvailable: boolean) => {
    try {
      // Use 'responded' instead of 'approved' to match the availability_request_status type
      const status: 'responded' | 'rejected' = isAvailable ? 'responded' : 'rejected';
      
      const { error } = await supabase
        .from('availability_requests')
        .update({
          estimated_time: isAvailable ? estimatedTime : null,
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);
        
      if (error) throw error;
      
      // Update local state
      setAvailabilityRequests(prev => 
        prev.map(request => 
          request.id === requestId ? 
          {
            ...request,
            estimated_time: isAvailable ? estimatedTime : null,
            status,
            updated_at: new Date().toISOString()
          } : 
          request
        )
      );
      
      toast({
        title: isAvailable ? "Availability confirmed" : "Items unavailable",
        description: isAvailable ? 
          `You confirmed availability with estimated time: ${estimatedTime}` :
          "You've marked these items as unavailable"
      });
    } catch (error) {
      console.error("Error responding to availability request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to respond to availability request"
      });
    }
  }, [toast]);

  return {
    availabilityRequests,
    fetchVendorAvailabilityRequests,
    respondToAvailabilityRequest
  };
}
