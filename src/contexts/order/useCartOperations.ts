
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { MenuItemType } from "@/types/models";
import { CartItemType } from "./types";

export const useCartOperations = () => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);
  const { toast } = useToast();

  const addToCart = (item: MenuItemType, restaurantId: string) => {
    // Check if adding from a different restaurant
    if (currentRestaurantId && currentRestaurantId !== restaurantId) {
      toast({
        title: "Different restaurant",
        description: "You can only order from one restaurant at a time. Your cart will be cleared.",
        variant: "destructive"
      });
      
      // Ensure price is a number
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price as any) || 0;
      
      setCart([{ 
        id: item.id, 
        menuItem: item, 
        quantity: 1,
        name: item.name,
        price: price
      }]);
      setCurrentRestaurantId(restaurantId);
      return;
    }

    // First time adding to cart
    if (!currentRestaurantId) {
      setCurrentRestaurantId(restaurantId);
    }

    // Check if item already in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    // Ensure price is a number
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price as any) || 0;
    
    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item as CartItemType
      setCart([...cart, { 
        id: item.id, 
        menuItem: item, 
        quantity: 1,
        name: item.name,
        price: price 
      }]);
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
  };

  return {
    cart,
    setCart,
    currentRestaurantId,
    setCurrentRestaurantId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};
