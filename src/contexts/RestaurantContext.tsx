
import React, { createContext, useContext, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from '@/contexts/LocationContext';
import { AvailabilityRequestType, OrderType, MenuItemType } from '@/contexts/OrderContext';

export type RestaurantType = {
  id: string;
  name: string;
  address: string;
  description: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  distance?: number; // distance in km
  ownerId: string;
  isOpen: boolean;
  rating?: number;
};

export type RestaurantDetailsType = RestaurantType & {
  menu: MenuItemType[];
  categories: string[];
};

type RestaurantContextType = {
  restaurants: RestaurantType[];
  restaurantDetails: RestaurantDetailsType | null;
  fetchNearbyRestaurants: () => Promise<void>;
  fetchRestaurantDetails: (id: string) => Promise<void>;
  isRestaurantOpen: (id: string) => boolean;
  vendorRestaurants: RestaurantType[];
  vendorOrders: OrderType[];
  availabilityRequests: AvailabilityRequestType[];
  fetchVendorRestaurants: () => Promise<void>;
  fetchVendorOrders: () => Promise<void>;
  fetchVendorAvailabilityRequests: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderType['status']) => Promise<void>;
  respondToAvailabilityRequest: (requestId: string, estimatedTime: string, isAvailable: boolean) => Promise<void>;
  updateRestaurantStatus: (restaurantId: string, isOpen: boolean) => Promise<void>;
};

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetailsType | null>(null);
  const [vendorRestaurants, setVendorRestaurants] = useState<RestaurantType[]>([]);
  const [vendorOrders, setVendorOrders] = useState<OrderType[]>([]);
  const [availabilityRequests, setAvailabilityRequests] = useState<AvailabilityRequestType[]>([]);
  const { userLocation } = useLocation();
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
      // This would connect to Supabase
      // Mock data for now
      const mockRestaurants: RestaurantType[] = [
        {
          id: "rest_1",
          name: "Tasty Bites",
          address: "123 Main St, Cityville",
          description: "Delicious fast food and snacks",
          latitude: userLocation.latitude + 0.003,
          longitude: userLocation.longitude - 0.002,
          ownerId: "owner_1",
          isOpen: true,
          rating: 4.5,
          imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=3270&auto=format&fit=crop"
        },
        {
          id: "rest_2",
          name: "Pizza Paradise",
          address: "456 Oak Ave, Townsburg",
          description: "Authentic Italian pizzas",
          latitude: userLocation.latitude - 0.002,
          longitude: userLocation.longitude + 0.004,
          ownerId: "owner_2",
          isOpen: true,
          rating: 4.2,
          imageUrl: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=3270&auto=format&fit=crop"
        },
        {
          id: "rest_3",
          name: "Sushi Station",
          address: "789 Elm St, Villagetown",
          description: "Fresh and authentic Japanese cuisine",
          latitude: userLocation.latitude + 0.005,
          longitude: userLocation.longitude + 0.001,
          ownerId: "owner_3",
          isOpen: false,
          rating: 4.8,
          imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=3270&auto=format&fit=crop"
        }
      ];

      // Calculate distance for each restaurant
      const restaurantsWithDistance = mockRestaurants.map(restaurant => {
        const distance = calculateDistance(
          userLocation.latitude, 
          userLocation.longitude,
          restaurant.latitude,
          restaurant.longitude
        );
        
        return {
          ...restaurant,
          distance
        };
      });

      // Filter restaurants within 1km and sort by distance
      const nearbyRestaurants = restaurantsWithDistance
        .filter(r => r.distance <= 1)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setRestaurants(nearbyRestaurants);
      
      if (nearbyRestaurants.length === 0) {
        toast({
          title: "No restaurants found",
          description: "No restaurants found within 1km of your location",
          variant: "destructive"
        });
      } else {
        toast({
          title: `${nearbyRestaurants.length} restaurants found`,
          description: "Showing restaurants near you"
        });
      }
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
      // This would connect to Supabase
      // Mock data for now
      const mockMenu: MenuItemType[] = [
        {
          id: "item_1",
          name: "Classic Burger",
          description: "Beef patty with lettuce, tomato, and special sauce",
          price: 8.99,
          isAvailable: true,
          category: "Burgers",
          restaurantId: id
        },
        {
          id: "item_2",
          name: "Cheese Fries",
          description: "Crispy fries topped with melted cheese",
          price: 4.99,
          isAvailable: true,
          category: "Sides",
          restaurantId: id
        },
        {
          id: "item_3",
          name: "Chocolate Milkshake",
          description: "Creamy chocolate milkshake",
          price: 3.99,
          isAvailable: true,
          category: "Drinks",
          restaurantId: id
        },
        {
          id: "item_4",
          name: "Chicken Burger",
          description: "Grilled chicken with lettuce and mayo",
          price: 7.99,
          isAvailable: true,
          category: "Burgers",
          restaurantId: id
        },
        {
          id: "item_5",
          name: "Onion Rings",
          description: "Crispy battered onion rings",
          price: 3.99,
          isAvailable: true,
          category: "Sides",
          restaurantId: id
        }
      ];
      
      const restaurant = restaurants.find(r => r.id === id);
      
      if (!restaurant) {
        throw new Error("Restaurant not found");
      }
      
      // Get unique categories
      const categories = Array.from(new Set(mockMenu.map(item => item.category)));
      
      const details: RestaurantDetailsType = {
        ...restaurant,
        menu: mockMenu,
        categories
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
    return restaurant?.isOpen || false;
  };

  const fetchVendorRestaurants = async () => {
    try {
      // This would connect to Supabase
      // Mock data for now
      const mockRestaurants: RestaurantType[] = [
        {
          id: "rest_1",
          name: "Tasty Bites",
          address: "123 Main St, Cityville",
          description: "Delicious fast food and snacks",
          latitude: 37.7749,
          longitude: -122.4194,
          ownerId: "mock-vendor-id",
          isOpen: true,
          rating: 4.5,
          imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=3270&auto=format&fit=crop"
        }
      ];
      
      setVendorRestaurants(mockRestaurants);
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
    try {
      // This would connect to Supabase
      // Mock data for now
      const mockOrders: OrderType[] = [
        {
          id: "order_1",
          items: [
            {
              id: "item_1",
              name: "Classic Burger",
              description: "Beef patty with lettuce, tomato, and special sauce",
              price: 8.99,
              quantity: 2,
              isAvailable: true,
              category: "Burgers",
              restaurantId: "rest_1"
            },
            {
              id: "item_2",
              name: "Cheese Fries",
              description: "Crispy fries topped with melted cheese",
              price: 4.99,
              quantity: 1,
              isAvailable: true,
              category: "Sides",
              restaurantId: "rest_1"
            }
          ],
          total: 22.97,
          customerName: "John Doe",
          customerId: "customer_1",
          restaurantId: "rest_1",
          restaurantName: "Tasty Bites",
          status: 'new',
          estimatedTime: "30-45 minutes",
          createdAt: new Date(Date.now() - 10 * 60000), // 10 minutes ago
          updatedAt: new Date(Date.now() - 10 * 60000),
          address: "123 Customer St, Cityville",
          phone: "555-123-4567"
        },
        {
          id: "order_2",
          items: [
            {
              id: "item_3",
              name: "Chocolate Milkshake",
              description: "Creamy chocolate milkshake",
              price: 3.99,
              quantity: 1,
              isAvailable: true,
              category: "Drinks",
              restaurantId: "rest_1"
            }
          ],
          total: 3.99,
          customerName: "Jane Smith",
          customerId: "customer_2",
          restaurantId: "rest_1",
          restaurantName: "Tasty Bites",
          status: 'cooking',
          estimatedTime: "10-15 minutes",
          createdAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
          updatedAt: new Date(Date.now() - 25 * 60000), // 25 minutes ago
          address: "456 Customer Ave, Townsburg",
          phone: "555-987-6543"
        }
      ];
      
      setVendorOrders(mockOrders);
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
    try {
      // This would connect to Supabase
      // Mock data for now
      const mockRequests: AvailabilityRequestType[] = [
        {
          id: "req_1",
          items: [
            {
              id: "item_1",
              name: "Classic Burger",
              description: "Beef patty with lettuce, tomato, and special sauce",
              price: 8.99,
              quantity: 1,
              isAvailable: true,
              category: "Burgers",
              restaurantId: "rest_1"
            }
          ],
          estimatedTimeQuery: "How long will my order take?",
          customerName: "Alice Johnson",
          customerId: "customer_3",
          restaurantId: "rest_1",
          createdAt: new Date(),
          status: 'pending'
        }
      ];
      
      setAvailabilityRequests(mockRequests);
    } catch (error) {
      console.error("Error fetching availability requests:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch availability requests"
      });
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderType['status']) => {
    try {
      // This would connect to Supabase
      const updatedOrders = vendorOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            updatedAt: new Date()
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
      // This would connect to Supabase
      const updatedRequests = availabilityRequests.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'responded' as const, // Fix: explicitly type as 'responded'
            estimatedTime
          };
        }
        return req;
      });
      
      setAvailabilityRequests(updatedRequests);
      
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
      // This would connect to Supabase
      const updatedRestaurants = vendorRestaurants.map(restaurant => {
        if (restaurant.id === restaurantId) {
          return {
            ...restaurant,
            isOpen
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
        updateRestaurantStatus
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
