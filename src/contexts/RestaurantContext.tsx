
import React, { createContext, useState, useContext, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  RestaurantType, 
  RestaurantDetailsType, 
  OrderType, 
  MenuItemType, 
  OrderStatus,
  AvailabilityRequestWithItems,
  OrderWithItems
} from "@/types/models";
import { useAuth } from "./AuthContext";

interface RestaurantContextType {
  vendorRestaurants: RestaurantType[];
  vendorOrders: OrderWithItems[];
  selectedRestaurant: RestaurantType | null;
  nearbyRestaurants: RestaurantType[];
  restaurants: RestaurantType[]; 
  restaurantDetails: RestaurantDetailsType | null;
  availabilityRequests: AvailabilityRequestWithItems[];
  fetchVendorRestaurants: () => Promise<void>;
  fetchVendorOrders: () => Promise<void>;
  fetchRestaurantDetails: (id: string) => Promise<RestaurantDetailsType | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  setSelectedRestaurant: React.Dispatch<React.SetStateAction<RestaurantType | null>>;
  fetchNearbyRestaurants: (latitude?: number, longitude?: number, distance?: number) => Promise<void>;
  createRestaurant: (data: Partial<RestaurantType>) => Promise<void>;
  updateRestaurant: (id: string, data: Partial<RestaurantType>) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  fetchVendorAvailabilityRequests: () => Promise<void>;
  respondToAvailabilityRequest: (requestId: string, estimatedTime: string, isAvailable: boolean) => Promise<void>;
  updateRestaurantStatus: (restaurantId: string, isOpen: boolean) => Promise<void>;
  isRestaurantOpen: (restaurantId: string) => boolean;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendorRestaurants, setVendorRestaurants] = useState<RestaurantType[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType | null>(null);
  const [vendorOrders, setVendorOrders] = useState<OrderWithItems[]>([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<RestaurantType[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetailsType | null>(null);
  const [availabilityRequests, setAvailabilityRequests] = useState<AvailabilityRequestWithItems[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if a restaurant is open
  const isRestaurantOpen = useCallback((restaurantId: string): boolean => {
    const restaurant = [...vendorRestaurants, ...nearbyRestaurants].find(r => r.id === restaurantId);
    return restaurant?.is_open === true;
  }, [vendorRestaurants, nearbyRestaurants]);

  const fetchVendorRestaurants = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id);
      
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
  }, [user, toast]);

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

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      // Ensure status is valid for the database schema
      // Map any non-database statuses to the appropriate database status
      let dbStatus: string = status;
      
      // Convert pending or preparing to new if needed for database compatibility
      if (status === 'pending' || status === 'preparing') dbStatus = 'new';
      
      const { error } = await supabase
        .from('orders')
        .update({ status: dbStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update local state with proper typing
      const updatedOrders = vendorOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: status, // Keep the original status in the front-end
            updated_at: new Date().toISOString()
          };
        }
        return order;
      });
      
      setVendorOrders(updatedOrders);
      
      toast({
        title: "Order updated",
        description: `Order status changed to ${status}`
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status"
      });
    }
  }, [vendorOrders, toast]);

  const fetchVendorOrders = useCallback(async () => {
    if (!user) return;
    
    try {
      // Get vendor restaurants
      const { data: restaurants, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id);

      if (restaurantError) throw restaurantError;
      
      if (restaurants.length === 0) {
        setVendorOrders([]);
        return;
      }

      // Get restaurant IDs
      const restaurantIds = restaurants.map((r) => r.id);
      
      // Get orders for these restaurants
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .in('restaurant_id', restaurantIds)
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;

      // Ensure orders have the required items property
      const ordersWithItems: OrderWithItems[] = (orders || []).map((order: any) => ({
        ...order,
        items: order.items || []
      }));

      setVendorOrders(ordersWithItems);
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch orders"
      });
    }
  }, [user, toast]);

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

  const fetchNearbyRestaurants = useCallback(async (latitude?: number, longitude?: number, distance = 10) => {
    try {
      // In a real app, we would use a spatial query here
      // For now, we'll just fetch all restaurants as a simplified example
      const { data, error } = await supabase
        .from('restaurants')
        .select('*');
      
      if (error) throw error;
      
      // Calculate distances if coordinates are provided
      const restaurantsWithDistance = data.map((restaurant) => {
        let calculatedDistance = 999; // Default large distance
        
        if (latitude && longitude && restaurant.latitude && restaurant.longitude) {
          // Simple distance calculation (not accurate but works for demo)
          const dx = restaurant.longitude - longitude;
          const dy = restaurant.latitude - latitude;
          calculatedDistance = Math.sqrt(dx * dx + dy * dy) * 111; // rough conversion to km
        }
        
        return { 
          ...restaurant,
          distance: calculatedDistance,
          // Ensure all fields from RestaurantType are present
          city: restaurant.city || null,
          state: restaurant.state || null,
          zip_code: restaurant.zip_code || null,
          phone_number: restaurant.phone_number || null,
          website: restaurant.website || null,
          cuisine_type: restaurant.cuisine_type || null,
          rating: restaurant.rating || null,
          number_of_ratings: restaurant.number_of_ratings || null,
          opening_time: restaurant.opening_time || null,
          closing_time: restaurant.closing_time || null
        };
      });
      
      // Filter and sort by distance
      const nearby = restaurantsWithDistance
        .filter((r) => r.distance <= distance)
        .sort((a, b) => a.distance - b.distance);
      
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

  const createRestaurant = useCallback(async (data: Partial<RestaurantType>) => {
    if (!user) return;
    
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
          owner_id: user.id,
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
  }, [user, fetchVendorRestaurants, toast]);

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

  const fetchVendorAvailabilityRequests = useCallback(async () => {
    if (!user) return;
    
    try {
      // Get vendor restaurants
      const { data: restaurants, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id);

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
      
      // Ensure type compatibility by properly mapping restaurant properties
      const typedRequests: AvailabilityRequestWithItems[] = (data || []).map((request: any) => {
        // Ensure restaurant has all required fields from RestaurantType
        const restaurant: RestaurantType = request.restaurant ? {
          ...request.restaurant,
          city: request.restaurant.city || null,
          state: request.restaurant.state || null,
          zip_code: request.restaurant.zip_code || null,
          phone_number: request.restaurant.phone_number || null,
          website: request.restaurant.website || null,
          cuisine_type: request.restaurant.cuisine_type || null,
          rating: request.restaurant.rating || null,
          number_of_ratings: request.restaurant.number_of_ratings || null,
          opening_time: request.restaurant.opening_time || null,
          closing_time: request.restaurant.closing_time || null
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
  }, [user, toast]);

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

  const value = {
    vendorRestaurants,
    vendorOrders,
    selectedRestaurant,
    setSelectedRestaurant,
    nearbyRestaurants,
    restaurants,
    restaurantDetails,
    availabilityRequests,
    fetchVendorRestaurants,
    fetchVendorOrders,
    fetchRestaurantDetails,
    updateOrderStatus,
    fetchNearbyRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    fetchVendorAvailabilityRequests,
    respondToAvailabilityRequest,
    updateRestaurantStatus,
    isRestaurantOpen
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
};
