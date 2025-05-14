import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from '@/contexts/LocationContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import {
  RestaurantType,
  MenuItemType,
  OrderWithItems,
  AvailabilityRequestWithItems,
  OrderStatus,
  RestaurantDetailsType
} from "@/types/models";

type RestaurantInputType = {
  name: string;
  address: string;
  description: string;
  image_url?: string | null;
  latitude: number;
  longitude: number;
};

type RestaurantContextType = {
  restaurants: RestaurantType[];
  restaurantDetails: RestaurantDetailsType | null;
  fetchNearbyRestaurants: () => Promise<void>;
  fetchRestaurantDetails: (id: string) => Promise<void>;
  isRestaurantOpen: (id: string) => boolean;
  vendorRestaurants: RestaurantType[];
  vendorOrders: OrderWithItems[];
  availabilityRequests: AvailabilityRequestWithItems[];
  fetchVendorRestaurants: () => Promise<void>;
  fetchVendorOrders: () => Promise<void>;
  fetchVendorAvailabilityRequests: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  respondToAvailabilityRequest: (requestId: string, estimatedTime: string, isAvailable: boolean) => Promise<void>;
  updateRestaurantStatus: (restaurantId: string, isOpen: boolean) => Promise<void>;
  createRestaurant: (data: RestaurantInputType) => Promise<void>;
};

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetailsType | null>(null);
  const [vendorRestaurants, setVendorRestaurants] = useState<RestaurantType[]>([]);
  const [vendorOrders, setVendorOrders] = useState<OrderWithItems[]>([]);
  const [availabilityRequests, setAvailabilityRequests] = useState<AvailabilityRequestWithItems[]>([]);
  const { userLocation } = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate distance between two coordinates in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchNearbyRestaurants = async () => {
    if (!userLocation) {
      toast({
        variant: "destructive",
        title: "Location required",
        description: "Please enable location to see nearby restaurants"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*');
      
      if (error) throw error;
      
      // Calculate distance for each restaurant
      const restaurantsWithDistance = data.map(restaurant => {
        const distance = calculateDistance(
          userLocation.latitude, 
          userLocation.longitude,
          Number(restaurant.latitude),
          Number(restaurant.longitude)
        );
        
        return {
          ...restaurant,
          distance
        };
      });

      // Filter restaurants within 5km and sort by distance
      const nearbyRestaurants = restaurantsWithDistance
        .filter(r => r.distance <= 5)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setRestaurants(nearbyRestaurants);
      
      // Only show toast if no restaurants found
      if (nearbyRestaurants.length === 0) {
        toast({
          variant: "destructive",
          title: "No restaurants found",
          description: "No restaurants found within 5km of your location"
        });
      }
      // Remove the success toast since LocationContext already shows one
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch nearby restaurants"
      });
    }
  };

  const fetchRestaurantDetails = async (id: string) => {
    try {
      // Fetch the restaurant
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();
      
      if (restaurantError) throw restaurantError;
      
      // Fetch menu items
      const { data: menu, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', id);
      
      if (menuError) throw menuError;
      
      // Get unique categories
      const categories = Array.from(new Set(menu.map(item => item.category)));
      
      // Create details object with imageUrl and distance properties
      const details: RestaurantDetailsType = {
        ...restaurant,
        menu,
        categories,
        imageUrl: restaurant.image_url,
        distance: restaurants.find(r => r.id === id)?.distance
      };
      
      setRestaurantDetails(details);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch restaurant details"
      });
    }
  };

  const isRestaurantOpen = (id: string) => {
    const restaurant = restaurants.find(r => r.id === id);
    return restaurant?.is_open || false;
  };

  const fetchVendorRestaurants = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id);
      
      if (error) throw error;
      
      setVendorRestaurants(data);
    } catch (error) {
      console.error("Error fetching vendor restaurants:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch your restaurants"
      });
    }
  };

  const fetchVendorOrders = async () => {
    if (!user) return;
    
    try {
      // Get vendor restaurant ids
      const { data: restaurants, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id);
      
      if (restaurantError) throw restaurantError;
      
      if (!restaurants.length) {
        setVendorOrders([]);
        return;
      }
      
      const restaurantIds = restaurants.map(r => r.id);
      
      // Fetch orders for these restaurants
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .in('restaurant_id', restaurantIds)
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      const ordersWithItems: OrderWithItems[] = [];
      
      for (const order of ordersData) {
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('*, menu_item:menu_items(*)')
          .eq('order_id', order.id);
        
        if (itemsError) throw itemsError;
        
        // Ensure proper typing of all fields
        ordersWithItems.push({
          ...order,
          status: order.status as OrderStatus, // Cast to OrderStatus type
          items: orderItems
        });
      }
      
      setVendorOrders(ordersWithItems);
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch orders"
      });
    }
  };

  const fetchVendorAvailabilityRequests = async () => {
    if (!user) return;
    
    try {
      // Get vendor restaurant ids
      const { data: restaurants, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id);
      
      if (restaurantError) throw restaurantError;
      
      if (!restaurants.length) {
        setAvailabilityRequests([]);
        return;
      }
      
      const restaurantIds = restaurants.map(r => r.id);
      
      // Fetch requests for these restaurants
      const { data: requestsData, error: requestsError } = await supabase
        .from('availability_requests')
        .select('*')
        .in('restaurant_id', restaurantIds)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (requestsError) throw requestsError;
      
      const requestsWithItems: AvailabilityRequestWithItems[] = [];
      
      for (const request of requestsData) {
        const { data: requestItems, error: itemsError } = await supabase
          .from('availability_request_items')
          .select('*, menu_item:menu_items(*)')
          .eq('request_id', request.id);
        
        if (itemsError) throw itemsError;
        
        requestsWithItems.push({
          ...request,
          items: requestItems
        });
      }
      
      setAvailabilityRequests(requestsWithItems);
    } catch (error) {
      console.error("Error fetching availability requests:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch availability requests"
      });
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update local state with proper typing
      const updatedOrders = vendorOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
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
  };

  const respondToAvailabilityRequest = async (requestId: string, estimatedTime: string, isAvailable: boolean) => {
    try {
      const status = isAvailable ? 'responded' : 'rejected';
      
      const { error } = await supabase
        .from('availability_requests')
        .update({ 
          status, 
          estimated_time: estimatedTime,
          updated_at: new Date().toISOString() 
        })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Update local state
      const updatedRequests = availabilityRequests.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: status as "pending" | "responded" | "rejected",
            estimated_time: estimatedTime,
            updated_at: new Date().toISOString()
          };
        }
        return req;
      });
      
      setAvailabilityRequests(updatedRequests.filter(r => r.status === 'pending'));
      
      toast({
        title: "Response sent",
        description: isAvailable 
          ? `Availability confirmed with estimated time: ${estimatedTime}` 
          : "Items marked as unavailable"
      });
    } catch (error) {
      console.error("Error responding to availability request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to respond to availability request"
      });
    }
  };

  const updateRestaurantStatus = async (restaurantId: string, isOpen: boolean) => {
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
      const updatedRestaurants = vendorRestaurants.map(restaurant => {
        if (restaurant.id === restaurantId) {
          return {
            ...restaurant,
            is_open: isOpen,
            updated_at: new Date().toISOString()
          };
        }
        return restaurant;
      });
      
      setVendorRestaurants(updatedRestaurants);
      
      toast({
        title: "Restaurant status updated",
        description: isOpen ? "Restaurant is now open" : "Restaurant is now closed"
      });
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update restaurant status"
      });
    }
  };

  const createRestaurant = async (data: RestaurantInputType) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to create a restaurant"
      });
      return;
    }
    
    try {
      const newRestaurant = {
        ...data,
        owner_id: user.id
      };
      
      const { data: restaurant, error } = await supabase
        .from('restaurants')
        .insert(newRestaurant)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the local state
      setVendorRestaurants(prev => [...prev, restaurant]);
      
      toast({
        title: "Restaurant created",
        description: "Your restaurant has been created successfully"
      });
    } catch (error) {
      console.error("Error creating restaurant:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create restaurant"
      });
      throw error;
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (user) {
      // Set up real-time subscriptions for orders and availability requests
      const ordersChannel = supabase
        .channel('orders-channel')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders'
          },
          () => {
            // Refetch orders on update
            fetchVendorOrders();
          }
        )
        .subscribe();
        
      const requestsChannel = supabase
        .channel('requests-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'availability_requests'
          },
          () => {
            // Refetch availability requests on insert
            fetchVendorAvailabilityRequests();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(ordersChannel);
        supabase.removeChannel(requestsChannel);
      };
    }
  }, [user]);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        restaurantDetails,
        fetchNearbyRestaurants,
        fetchRestaurantDetails,
        isRestaurantOpen,
        vendorRestaurants,
        vendorOrders,
        availabilityRequests,
        fetchVendorRestaurants,
        fetchVendorOrders,
        fetchVendorAvailabilityRequests,
        updateOrderStatus,
        respondToAvailabilityRequest,
        updateRestaurantStatus,
        createRestaurant
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
