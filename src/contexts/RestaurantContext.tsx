
import React, { createContext, useState, useContext, useCallback } from 'react';
import { RestaurantType, OrderStatus, OrderWithItems, AvailabilityRequestWithItems } from "@/types/models";
import { useAuth } from "./AuthContext";
import { useVendorRestaurants } from "@/hooks/useVendorRestaurants";
import { useVendorOrders } from "@/hooks/useVendorOrders";
import { useRestaurantDetails } from "@/hooks/useRestaurantDetails";
import { useNearbyRestaurants } from "@/hooks/useNearbyRestaurants";
import { useAvailabilityRequests } from "@/hooks/useAvailabilityRequests";

interface RestaurantContextType {
  vendorRestaurants: RestaurantType[];
  vendorOrders: OrderWithItems[];
  selectedRestaurant: RestaurantType | null;
  nearbyRestaurants: RestaurantType[];
  restaurants: RestaurantType[]; 
  restaurantDetails: RestaurantType | null;
  availabilityRequests: AvailabilityRequestWithItems[];
  isLoading: boolean;
  fetchVendorRestaurants: () => Promise<void>;
  fetchVendorOrders: () => Promise<void | (() => void)>; // Updated return type to handle cleanup function
  fetchRestaurantDetails: (id: string) => Promise<any | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  setSelectedRestaurant: React.Dispatch<React.SetStateAction<RestaurantType | null>>;
  fetchNearbyRestaurants: (latitude?: number, longitude?: number, distance?: number) => Promise<void>;
  searchRestaurants: (query: string) => Promise<void>;
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
  const { user } = useAuth();
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType | null>(null);
  
  const vendorRestaurantsHook = useVendorRestaurants(user?.id);
  const vendorOrdersHook = useVendorOrders(user?.id);
  const restaurantDetailsHook = useRestaurantDetails();
  const nearbyRestaurantsHook = useNearbyRestaurants();
  const availabilityRequestsHook = useAvailabilityRequests(user?.id);

  // Check if a restaurant is open
  const isRestaurantOpen = useCallback((restaurantId: string): boolean => {
    const restaurant = [...vendorRestaurantsHook.vendorRestaurants, ...nearbyRestaurantsHook.nearbyRestaurants]
      .find(r => r.id === restaurantId);
    return restaurant?.is_open === true;
  }, [vendorRestaurantsHook.vendorRestaurants, nearbyRestaurantsHook.nearbyRestaurants]);

  const value = {
    vendorRestaurants: vendorRestaurantsHook.vendorRestaurants,
    vendorOrders: vendorOrdersHook.vendorOrders,
    selectedRestaurant,
    setSelectedRestaurant,
    nearbyRestaurants: nearbyRestaurantsHook.nearbyRestaurants,
    restaurants: nearbyRestaurantsHook.restaurants,
    restaurantDetails: restaurantDetailsHook.restaurantDetails,
    availabilityRequests: availabilityRequestsHook.availabilityRequests,
    isLoading: nearbyRestaurantsHook.isLoading,
    fetchVendorRestaurants: vendorRestaurantsHook.fetchVendorRestaurants,
    fetchVendorOrders: vendorOrdersHook.fetchVendorOrders,
    fetchRestaurantDetails: restaurantDetailsHook.fetchRestaurantDetails,
    updateOrderStatus: vendorOrdersHook.updateOrderStatus,
    fetchNearbyRestaurants: nearbyRestaurantsHook.fetchNearbyRestaurants,
    searchRestaurants: nearbyRestaurantsHook.searchRestaurants,
    createRestaurant: vendorRestaurantsHook.createRestaurant,
    updateRestaurant: vendorRestaurantsHook.updateRestaurant,
    deleteRestaurant: vendorRestaurantsHook.deleteRestaurant,
    fetchVendorAvailabilityRequests: availabilityRequestsHook.fetchVendorAvailabilityRequests,
    respondToAvailabilityRequest: availabilityRequestsHook.respondToAvailabilityRequest,
    updateRestaurantStatus: vendorRestaurantsHook.updateRestaurantStatus,
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
