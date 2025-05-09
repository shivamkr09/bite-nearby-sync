
import { Database } from "@/integrations/supabase/types";

export type ProfileType = Database['public']['Tables']['profiles']['Row'];
export type RestaurantType = Database['public']['Tables']['restaurants']['Row'];
export type MenuItemType = Database['public']['Tables']['menu_items']['Row'];
export type OrderType = Database['public']['Tables']['orders']['Row'];
export type OrderItemType = Database['public']['Tables']['order_items']['Row'];
export type AvailabilityRequestType = Database['public']['Tables']['availability_requests']['Row'];
export type AvailabilityRequestItemType = Database['public']['Tables']['availability_request_items']['Row'];

export type OrderWithItems = OrderType & {
  items: (OrderItemType & { menu_item?: MenuItemType })[];
};

export type AvailabilityRequestWithItems = AvailabilityRequestType & {
  items: (AvailabilityRequestItemType & { menu_item?: MenuItemType })[];
};
