
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  MenuItemType, 
  OrderType, 
  OrderWithItems,
  OrderItemType,
  AvailabilityRequestType,
  AvailabilityRequestWithItems
} from "@/types/supabase";

export type CartItemType = MenuItemType & {
  quantity: number;
};

type OrderContextType = {
  cart: CartItemType[];
  currentRestaurantId: string | null;
  availabilityRequest: AvailabilityRequestWithItems | null;
  availabilityResponse: { estimatedTime: string; isAvailable: boolean } | null;
  orders: OrderWithItems[];
  addToCart: (item: MenuItemType, restaurantId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  sendAvailabilityRequest: (estimatedTimeQuery: string) => Promise<void>;
  placeOrder: (address: string, phone: string) => Promise<void>;
  getOrderStatus: (orderId: string) => string;
  fetchOrders: () => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);
  const [availabilityRequest, setAvailabilityRequest] = useState<AvailabilityRequestWithItems | null>(null);
  const [availabilityResponse, setAvailabilityResponse] = useState<{ estimatedTime: string; isAvailable: boolean } | null>(null);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      const ordersWithItems: OrderWithItems[] = [];
      
      for (const order of ordersData) {
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('*, menu_item:menu_items(*)')
          .eq('order_id', order.id);
        
        if (itemsError) throw itemsError;
        
        ordersWithItems.push({
          ...order,
          items: orderItems
        });
      }
      
      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error fetching orders",
        description: "There was a problem loading your orders"
      });
    }
  };

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
    if (!user || !currentRestaurantId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to be signed in to send an availability request"
      });
      return;
    }
    
    try {
      // Insert the availability request
      const { data: requestData, error: requestError } = await supabase
        .from('availability_requests')
        .insert({
          customer_id: user.id,
          restaurant_id: currentRestaurantId,
          estimated_time_query: estimatedTimeQuery,
          status: 'pending'
        })
        .select()
        .single();
      
      if (requestError) throw requestError;
      
      // Insert the availability request items
      const requestItemsToInsert = cart.map(item => ({
        request_id: requestData.id,
        menu_item_id: item.id,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('availability_request_items')
        .insert(requestItemsToInsert);
      
      if (itemsError) throw itemsError;
      
      // Set the availability request in state
      const requestWithItems: AvailabilityRequestWithItems = {
        ...requestData,
        items: cart.map(item => ({
          id: '',
          request_id: requestData.id,
          menu_item_id: item.id,
          quantity: item.quantity,
          created_at: new Date().toISOString(),
          menu_item: item
        }))
      };
      
      setAvailabilityRequest(requestWithItems);
      
      toast({
        title: "Availability request sent",
        description: "The restaurant will respond shortly"
      });
      
      // Subscribe to realtime updates for this request
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'availability_requests',
            filter: `id=eq.${requestData.id}`
          },
          (payload) => {
            const updatedRequest = payload.new as AvailabilityRequestType;
            if (updatedRequest.status === 'responded' && updatedRequest.estimated_time) {
              setAvailabilityResponse({
                estimatedTime: updatedRequest.estimated_time,
                isAvailable: true
              });
              
              toast({
                title: "Restaurant responded",
                description: `Your order is available! Estimated time: ${updatedRequest.estimated_time}`
              });
            } else if (updatedRequest.status === 'rejected') {
              setAvailabilityResponse({
                estimatedTime: '',
                isAvailable: false
              });
              
              toast({
                variant: "destructive",
                title: "Order unavailable",
                description: "The restaurant cannot fulfill your order at this time"
              });
            }
          }
        )
        .subscribe();
      
      // Clean up subscription when component unmounts
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error sending availability request:', error);
      toast({
        variant: "destructive",
        title: "Error sending request",
        description: "Could not send availability request"
      });
    }
  };

  const placeOrder = async (address: string, phone: string) => {
    if (!user || !currentRestaurantId || !availabilityResponse?.isAvailable) {
      toast({
        variant: "destructive",
        title: "Cannot place order",
        description: "Please check availability before placing an order"
      });
      return Promise.reject("Cannot place order");
    }
    
    try {
      // Get restaurant name for the order
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('name')
        .eq('id', currentRestaurantId)
        .single();
      
      if (restaurantError) throw restaurantError;
      
      // Insert the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          restaurant_id: currentRestaurantId,
          customer_name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim(),
          restaurant_name: restaurant.name,
          total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          status: 'new',
          estimated_time: availabilityResponse.estimatedTime,
          address,
          phone
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Insert the order items
      const orderItemsToInsert = cart.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);
      
      if (itemsError) throw itemsError;
      
      toast({
        title: "Order placed",
        description: "Your order has been placed successfully"
      });
      
      // Refresh orders
      await fetchOrders();
      
      // Clear cart after successful order
      clearCart();
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error placing order:', error);
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
        fetchOrders,
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
