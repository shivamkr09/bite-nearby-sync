
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OrderWithItems, OrderStatus } from "@/types/models";

export function useVendorOrders(userId: string | undefined) {
  const [vendorOrders, setVendorOrders] = useState<OrderWithItems[]>([]);
  const { toast } = useToast();

  const fetchVendorOrders = useCallback(async () => {
    if (!userId) return;
    
    try {
      // Get vendor restaurants
      const { data: restaurants, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', userId);

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
          items:order_items(
            *,
            menu_item:menu_items(*)
          )
        `)
        .in('restaurant_id', restaurantIds)
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;

      // Set up real-time subscription for new orders
      const channel = supabase
        .channel('vendor-orders-changes')
        .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `restaurant_id=in.(${restaurantIds.map(id => `'${id}'`).join(',')})`
          }, 
          (payload) => {
            // Refresh orders when there's a change
            fetchVendorOrders();
          }
        )
        .subscribe();

      // Ensure orders have the required items property
      const ordersWithItems: OrderWithItems[] = (orders || []).map((order: any) => ({
        ...order,
        items: order.items || []
      }));

      setVendorOrders(ordersWithItems);
      
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch orders"
      });
    }
  }, [userId, toast]);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      // Ensure status is valid for the database schema
      // Map any non-standard statuses to the appropriate database status
      let dbStatus: "new" | "confirmed" | "cooking" | "ready" | "dispatched" | "delivered";
      
      // Convert non-standard statuses to database-compatible ones
      switch (status) {
        case 'pending':
        case 'preparing':
          dbStatus = 'new';
          break;
        case 'cancelled':
          // For cancelled, we'll use 'new' in the database but preserve 'cancelled' in the UI
          dbStatus = 'new';
          break;
        default:
          // For standard statuses, use as is
          dbStatus = status as "new" | "confirmed" | "cooking" | "ready" | "dispatched" | "delivered";
      }

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

  return {
    vendorOrders,
    fetchVendorOrders,
    updateOrderStatus
  };
}
