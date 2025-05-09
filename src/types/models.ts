
// Import database types from Supabase
import { Database } from "@/integrations/supabase/types";

// Export database-related types
export type ProfileType = Database['public']['Tables']['profiles']['Row'];
export type RestaurantType = Database['public']['Tables']['restaurants']['Row'] & {
  distance?: number;
};
export type MenuItemType = Database['public']['Tables']['menu_items']['Row'];
export type OrderType = Database['public']['Tables']['orders']['Row'];
export type OrderItemType = Database['public']['Tables']['order_items']['Row'];
export type AvailabilityRequestType = Database['public']['Tables']['availability_requests']['Row'];
export type AvailabilityRequestItemType = Database['public']['Tables']['availability_request_items']['Row'];

// Export custom type extensions
export type OrderWithItems = OrderType & {
  items: (OrderItemType & { menu_item?: MenuItemType })[];
};

export type AvailabilityRequestWithItems = AvailabilityRequestType & {
  items: (AvailabilityRequestItemType & { menu_item?: MenuItemType })[];
};

// Export order status enum type
export type OrderStatus = 'new' | 'confirmed' | 'cooking' | 'ready' | 'dispatched' | 'delivered';

// Export cart item type
export type CartItemType = MenuItemType & {
  quantity: number;
};

// Export restaurant details type with additional fields
export type RestaurantDetailsType = RestaurantType & {
  menu: MenuItemType[];
  categories: string[];
  imageUrl?: string;
};
