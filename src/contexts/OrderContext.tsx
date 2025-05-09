
import React, { createContext, useContext, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export type MenuItemType = {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  category: string;
  restaurantId: string;
  imageUrl?: string;
};

export type CartItemType = MenuItemType & {
  quantity: number;
};

export type AvailabilityRequestType = {
  id: string;
  items: CartItemType[];
  estimatedTimeQuery: string;
  customerName: string;
  customerId: string;
  restaurantId: string;
  createdAt: Date;
  status: 'pending' | 'responded' | 'rejected';
  estimatedTime?: string;
};

export type OrderType = {
  id: string;
  items: CartItemType[];
  total: number;
  customerName: string;
  customerId: string;
  restaurantId: string;
  restaurantName: string;
  status: 'new' | 'confirmed' | 'cooking' | 'ready' | 'dispatched' | 'delivered';
  estimatedTime: string;
  createdAt: Date;
  updatedAt: Date;
  address?: string;
  phone?: string;
};

type OrderContextType = {
  cart: CartItemType[];
  currentRestaurantId: string | null;
  availabilityRequest: AvailabilityRequestType | null;
  availabilityResponse: { estimatedTime: string; isAvailable: boolean } | null;
  orders: OrderType[];
  addToCart: (item: MenuItemType, restaurantId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  sendAvailabilityRequest: (estimatedTimeQuery: string) => Promise<void>;
  placeOrder: (address: string, phone: string) => Promise<void>;
  getOrderStatus: (orderId: string) => string;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);
  const [availabilityRequest, setAvailabilityRequest] = useState<AvailabilityRequestType | null>(null);
  const [availabilityResponse, setAvailabilityResponse] = useState<{ estimatedTime: string; isAvailable: boolean } | null>(null);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const { toast } = useToast();

  const addToCart = (item: MenuItemType, restaurantId: string) => {
    // Check if adding from a different restaurant
    if (currentRestaurantId && currentRestaurantId !== restaurantId) {
      toast({
        title: "Different restaurant",
        description: "You can only order from one restaurant at a time. Your cart will be cleared.",
        variant: "destructive"
      });
      setCart([{ ...item, quantity: 1 }]);
      setCurrentRestaurantId(restaurantId);
      return;
    }

    // First time adding to cart
    if (!currentRestaurantId) {
      setCurrentRestaurantId(restaurantId);
    }

    // Check if item already in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`
    });
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    
    if (updatedCart.length === 0) {
      setCurrentRestaurantId(null);
    }
    
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart"
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    setCurrentRestaurantId(null);
    setAvailabilityRequest(null);
    setAvailabilityResponse(null);
  };

  const sendAvailabilityRequest = async (estimatedTimeQuery: string) => {
    try {
      // This would connect to Supabase
      const mockRequest: AvailabilityRequestType = {
        id: `req_${Date.now()}`,
        items: cart,
        estimatedTimeQuery,
        customerName: "Mock Customer",
        customerId: "mock-customer-id",
        restaurantId: currentRestaurantId!,
        createdAt: new Date(),
        status: 'pending'
      };
      
      setAvailabilityRequest(mockRequest);
      
      toast({
        title: "Availability request sent",
        description: "The restaurant will respond shortly"
      });
      
      // Mock response from server after 3 seconds
      setTimeout(() => {
        const mockResponse = { 
          estimatedTime: "30-45 minutes", 
          isAvailable: true 
        };
        setAvailabilityResponse(mockResponse);
        
        toast({
          title: "Restaurant responded",
          description: `Your order is available! Estimated time: ${mockResponse.estimatedTime}`
        });
      }, 3000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending request",
        description: "Could not send availability request"
      });
    }
  };

  const placeOrder = async (address: string, phone: string) => {
    try {
      // This would connect to Supabase
      const newOrder: OrderType = {
        id: `order_${Date.now()}`,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        customerName: "Mock Customer",
        customerId: "mock-customer-id",
        restaurantId: currentRestaurantId!,
        restaurantName: "Mock Restaurant",
        status: 'new',
        estimatedTime: availabilityResponse?.estimatedTime || "30-45 minutes",
        createdAt: new Date(),
        updatedAt: new Date(),
        address,
        phone
      };
      
      setOrders([newOrder, ...orders]);
      
      toast({
        title: "Order placed",
        description: "Your order has been placed successfully"
      });
      
      // Clear cart after successful order
      clearCart();
      
      return Promise.resolve();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error placing order",
        description: "Could not place your order"
      });
      return Promise.reject(error);
    }
  };

  const getOrderStatus = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    return order?.status || 'new';
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        currentRestaurantId,
        availabilityRequest,
        availabilityResponse,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        sendAvailabilityRequest,
        placeOrder,
        getOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
