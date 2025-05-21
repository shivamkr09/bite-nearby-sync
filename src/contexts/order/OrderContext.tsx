
import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCartOperations } from './useCartOperations';
import { useOrderOperations } from './useOrderOperations';
import { OrderContextType } from './types';

export * from './types';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const {
    cart,
    setCart,
    currentRestaurantId,
    setCurrentRestaurantId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: clearCartBase
  } = useCartOperations();
  
  const {
    orders,
    availabilityRequest,
    availabilityResponse,
    fetchOrders,
    sendAvailabilityRequest,
    placeOrder,
    getOrderStatus,
    clearAvailabilityInfo
  } = useOrderOperations(cart, currentRestaurantId, setCurrentRestaurantId, setCart, user?.id);
  
  // Clear cart with availability info
  const clearCart = () => {
    clearCartBase();
    clearAvailabilityInfo();
  };
  
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Set up realtime subscription for order updates
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('customer-orders-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${user.id}`
        }, 
        (payload) => {
          // Refresh orders when there's a change
          fetchOrders();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

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
