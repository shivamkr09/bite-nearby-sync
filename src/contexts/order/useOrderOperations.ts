
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  OrderWithItems,
  AvailabilityRequestWithItems
} from "@/types/models";
import { CartItemType } from "./types";

export const useOrderOperations = (
  cart: CartItemType[],
  currentRestaurantId: string | null,
  setCurrentRestaurantId: React.Dispatch<React.SetStateAction<string | null>>,
  setCart: React.Dispatch<React.SetStateAction<CartItemType[]>>,
  userId: string | undefined
) => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [availabilityRequest, setAvailabilityRequest] = useState<AvailabilityRequestWithItems | null>(null);
  const [availabilityResponse, setAvailabilityResponse] = useState<{ estimatedTime: string; isAvailable: boolean } | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!userId) return;
    
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      const ordersWithItems: OrderWithItems[] = [];
      
      for (const order of ordersData) {
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('*, menu_item:menu_items(*)')
          .eq('order_id', order.id);
        
        if (itemsError) throw itemsError;
        
        // Map each item to ensure it has all required OrderItemType properties
        const mappedItems = orderItems.map((item: any) => ({
          id: item.id,
          created_at: item.created_at,
          order_id: item.order_id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          name: item.name,
          description: item.description,
          price: item.price,
          item_price: item.price || 0,
          total_price: (item.price || 0) * item.quantity,
          menu_item: item.menu_item
        }));
        
        ordersWithItems.push({
          ...order,
          items: mappedItems
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

  const sendAvailabilityRequest = async (estimatedTimeQuery: string): Promise<void> => {
    if (!userId || !currentRestaurantId) {
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
          customer_id: userId,
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
      
      // Set the availability request in state with properly typed items
      const requestWithItems: AvailabilityRequestWithItems = {
        ...requestData,
        items: cart.map(item => ({
          id: '',
          menu_item_id: item.id,
          quantity: item.quantity,
          created_at: new Date().toISOString(),
          request_id: requestData.id,
          menu_item: item.menuItem
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
            const updatedRequest = payload.new as any;
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
      
      return;
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
    if (!userId || !currentRestaurantId || !availabilityResponse?.isAvailable) {
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
      
      // Calculate correct total from cart items
      const calculatedTotal = cart.reduce((sum, item) => {
        const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0;
        return sum + (itemPrice * item.quantity);
      }, 0);
      
      // Insert the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: userId,
          restaurant_id: currentRestaurantId,
          customer_name: `${userId}`,
          restaurant_name: restaurant.name,
          total: calculatedTotal,
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
        name: item.menuItem.name,
        description: item.menuItem.description,
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
      setCart([]);
      setCurrentRestaurantId(null);
      setAvailabilityRequest(null);
      setAvailabilityResponse(null);
      
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

  const clearAvailabilityInfo = () => {
    setAvailabilityRequest(null);
    setAvailabilityResponse(null);
  };

  return {
    orders,
    availabilityRequest,
    availabilityResponse,
    setAvailabilityRequest,
    setAvailabilityResponse,
    fetchOrders,
    sendAvailabilityRequest,
    placeOrder,
    getOrderStatus,
    clearAvailabilityInfo
  };
};
