
// import { useState, useCallback } from 'react';
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/components/ui/use-toast";
// import { AvailabilityRequestWithItems, RestaurantType } from "@/types/models";

// export function useAvailabilityRequests(userId: string | undefined) {
//   const [availabilityRequests, setAvailabilityRequests] = useState<AvailabilityRequestWithItems[]>([]);
//   const { toast } = useToast();

//   const fetchVendorAvailabilityRequests = useCallback(async () => {
//     if (!userId) return;
    
//     try {
//       // Get vendor restaurants
//       const { data: restaurants, error: restaurantError } = await supabase
//         .from('restaurants')
//         .select('id')
//         .eq('owner_id', userId);

//       if (restaurantError) throw restaurantError;
      
//       if (restaurants.length === 0) {
//         setAvailabilityRequests([]);
//         return;
//       }

//       const restaurantIds = restaurants.map(r => r.id);
      
//       // Get availability requests
//       const { data, error } = await supabase
//         .from('availability_requests')
//         .select(`
//           *,
//           items:availability_request_items(
//             *,
//             menu_item:menu_items(*)
//           ),
//           restaurant:restaurants(*)
//         `)
//         .in('restaurant_id', restaurantIds)
//         .order('created_at', { ascending: false });
      
//       if (error) throw error;
      
//       // Process and map data to ensure type compatibility
//       const typedRequests: AvailabilityRequestWithItems[] = (data || []).map((request: any) => {
//         // Create a properly typed restaurant object
//         const restaurant: RestaurantType | undefined = request.restaurant ? {
//           id: request.restaurant.id,
//           created_at: request.restaurant.created_at,
//           name: request.restaurant.name,
//           description: request.restaurant.description || null,
//           address: request.restaurant.address || null,
//           city: request.restaurant.city || null,
//           state: request.restaurant.state || null,
//           zip_code: request.restaurant.zip_code || null,
//           phone_number: request.restaurant.phone_number || null,
//           website: request.restaurant.website || null,
//           owner_id: request.restaurant.owner_id,
//           image_url: request.restaurant.image_url || null,
//           cuisine_type: request.restaurant.cuisine_type || null,
//           rating: request.restaurant.rating || null,
//           number_of_ratings: request.restaurant.number_of_ratings || null,
//           is_open: request.restaurant.is_open !== null ? request.restaurant.is_open : false,
//           opening_time: request.restaurant.opening_time || null,
//           closing_time: request.restaurant.closing_time || null,
//           latitude: request.restaurant.latitude,
//           longitude: request.restaurant.longitude,
//           updated_at: request.restaurant.updated_at
//         } : undefined;

//         return {
//           ...request,
//           restaurant
//         };
//       });
      
//       setAvailabilityRequests(typedRequests);
//     } catch (error) {
//       console.error("Error fetching availability requests:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to fetch availability requests"
//       });
//     }
//   }, [userId, toast]);

//   const respondToAvailabilityRequest = useCallback(async (requestId: string, estimatedTime: string, isAvailable: boolean) => {
//     try {
//       // Use 'responded' instead of 'approved' to match the availability_request_status type
//       const status: 'responded' | 'rejected' = isAvailable ? 'responded' : 'rejected';
      
//       const { error } = await supabase
//         .from('availability_requests')
//         .update({
//           estimated_time: isAvailable ? estimatedTime : null,
//           status,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', requestId);
        
//       if (error) throw error;
      
//       // Update local state
//       setAvailabilityRequests(prev => 
//         prev.map(request => 
//           request.id === requestId ? 
//           {
//             ...request,
//             estimated_time: isAvailable ? estimatedTime : null,
//             status,
//             updated_at: new Date().toISOString()
//           } : 
//           request
//         )
//       );
      
//       toast({
//         title: isAvailable ? "Availability confirmed" : "Items unavailable",
//         description: isAvailable ? 
//           `You confirmed availability with estimated time: ${estimatedTime}` :
//           "You've marked these items as unavailable"
//       });
//     } catch (error) {
//       console.error("Error responding to availability request:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to respond to availability request"
//       });
//     }
//   }, [toast]);

//   return {
//     availabilityRequests,
//     fetchVendorAvailabilityRequests,
//     respondToAvailabilityRequest
//   };
// }
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AvailabilityRequestWithItems, RestaurantType } from "@/types/models";
import { RealtimeChannel } from '@supabase/supabase-js';

export function useAvailabilityRequests(userId: string | undefined) {
  const [availabilityRequests, setAvailabilityRequests] = useState<AvailabilityRequestWithItems[]>([]);
  const [restaurantIds, setRestaurantIds] = useState<string[]>([]);
  const { toast } = useToast();
  const channelRef = useRef<RealtimeChannel | null>(null);

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
        setRestaurantIds([]);
        return;
      }

      const ids = restaurants.map(r => r.id);
      setRestaurantIds(ids);
      
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
        .in('restaurant_id', ids)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process and map data to ensure type compatibility
      const typedRequests: AvailabilityRequestWithItems[] = (data || []).map((request: any) => {
        // Create a properly typed restaurant object using only existing fields
        const restaurant: RestaurantType | undefined = request.restaurant ? {
          id: request.restaurant.id,
          created_at: request.restaurant.created_at,
          name: request.restaurant.name,
          description: request.restaurant.description || null,
          address: request.restaurant.address || null,
          city: null, // Field doesn't exist in current schema
          state: null, // Field doesn't exist in current schema
          zip_code: null, // Field doesn't exist in current schema
          phone_number: null, // Field doesn't exist in current schema
          website: null, // Field doesn't exist in current schema
          owner_id: request.restaurant.owner_id,
          image_url: request.restaurant.image_url || null,
          cuisine_type: null, // Field doesn't exist in current schema
          rating: request.restaurant.rating || null,
          number_of_ratings: null, // Field doesn't exist in current schema
          is_open: request.restaurant.is_open !== null ? request.restaurant.is_open : false,
          opening_time: null, // Field doesn't exist in current schema
          closing_time: null, // Field doesn't exist in current schema
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

  // Set up real-time subscription for new availability requests
  useEffect(() => {
    if (!userId || restaurantIds.length === 0) {
      // Clean up existing subscription if no restaurants
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    // Clean up existing subscription before creating new one
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new subscription for availability requests
    const channel = supabase
      .channel('vendor-availability-requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'availability_requests',
          filter: `restaurant_id=in.(${restaurantIds.join(',')})`
        },
        async (payload) => {
          console.log('New availability request received:', payload);
          
          try {
            // Fetch the complete request with related data
            const { data: newRequest, error } = await supabase
              .from('availability_requests')
              .select(`
                *,
                items:availability_request_items(
                  *,
                  menu_item:menu_items(*)
                ),
                restaurant:restaurants(*)
              `)
              .eq('id', payload.new.id)
              .single();

            if (error) throw error;

            if (newRequest) {
              // Create a properly typed restaurant object using only existing fields
              const restaurant: RestaurantType | undefined = newRequest.restaurant ? {
                id: newRequest.restaurant.id,
                created_at: newRequest.restaurant.created_at,
                name: newRequest.restaurant.name,
                description: newRequest.restaurant.description || null,
                address: newRequest.restaurant.address || null,
                city: null, // Field doesn't exist in current schema
                state: null, // Field doesn't exist in current schema
                zip_code: null, // Field doesn't exist in current schema
                phone_number: null, // Field doesn't exist in current schema
                website: null, // Field doesn't exist in current schema
                owner_id: newRequest.restaurant.owner_id,
                image_url: newRequest.restaurant.image_url || null,
                cuisine_type: null, // Field doesn't exist in current schema
                rating: newRequest.restaurant.rating || null,
                number_of_ratings: null, // Field doesn't exist in current schema
                is_open: newRequest.restaurant.is_open !== null ? newRequest.restaurant.is_open : false,
                opening_time: null, // Field doesn't exist in current schema
                closing_time: null, // Field doesn't exist in current schema
                latitude: newRequest.restaurant.latitude,
                longitude: newRequest.restaurant.longitude,
                updated_at: newRequest.restaurant.updated_at
              } : undefined;

              const typedRequest: AvailabilityRequestWithItems = {
                ...newRequest,
                restaurant
              };

              // Add the new request to the beginning of the list
              setAvailabilityRequests(prev => [typedRequest, ...prev]);

              // Show notification to vendor
              toast({
                title: "New Availability Request",
                description: `New request received for ${restaurant?.name || 'your restaurant'}`
              });
            }
          } catch (error) {
            console.error('Error fetching new availability request:', error);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'availability_requests',
          filter: `restaurant_id=in.(${restaurantIds.join(',')})`
        },
        (payload) => {
          console.log('Availability request updated:', payload);
          
          // Update the request in local state
          setAvailabilityRequests(prev => 
            prev.map(request => 
              request.id === payload.new.id ? 
              {
                ...request,
                ...payload.new,
                updated_at: payload.new.updated_at
              } : 
              request
            )
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup function
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, restaurantIds, toast]);

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
