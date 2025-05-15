
// Import database types from Supabase
import { Database } from "@/integrations/supabase/types";

// Define app role type
export type AppRole = 'customer' | 'vendor' | 'admin';

// Export database-related types
export type ProfileType = Database['public']['Tables']['profiles']['Row'];
export type RestaurantType = Database['public']['Tables']['restaurants']['Row'] & {
  distance?: number;
  imageUrl?: string;
};
export type MenuItemType = Database['public']['Tables']['menu_items']['Row'];
export type OrderType = Database['public']['Tables']['orders']['Row'] & {
  items?: (OrderItemType & { menu_item?: MenuItemType })[];
};
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
  distance?: number;
};

// Admin types
export type VendorApprovalType = {
  id: string;
  vendor_id: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  vendor?: ProfileType;
};

export type SupportTicketType = {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_admin_id?: string;
  created_at: string;
  updated_at: string;
  user?: ProfileType;
};

export type TicketResponseType = {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: ProfileType;
};

export type AnalyticsDataType = {
  id: string;
  date: string;
  total_orders: number;
  total_revenue: number;
  new_users: number;
  created_at: string;
  updated_at: string;
};

export type TermsAndConditionsType = {
  id: string;
  type: 'customer' | 'vendor';
  content: string;
  version: string;
  published_at: string;
  is_active: boolean;
};

export type UserTermsAcceptanceType = {
  id: string;
  user_id: string;
  terms_id: string;
  accepted_at: string;
};
