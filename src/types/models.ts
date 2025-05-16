
export interface UserType {
  id: string;
  createdAt: string;
  email: string | null;
  email_verified: boolean;
  full_name: string | null;
  phone_number: string | null;
  updated_at: string | null;
  user_name: string | null;
  role: 'customer' | 'vendor' | 'admin' | null;
  user_type?: 'customer' | 'vendor' | 'admin' | null;
}

export interface RestaurantType {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone_number: string | null;
  website: string | null;
  owner_id: string;
  image_url: string | null;
  cuisine_type: string | null;
  rating: number | null;
  number_of_ratings: number | null;
  is_open: boolean | null;
  opening_time: string | null;
  closing_time: string | null;
  distance?: number;
  latitude?: number;
  longitude?: number;
  updated_at?: string;
}

export interface RestaurantDetailsType extends RestaurantType {
  menu_items?: MenuItemType[];
  categories?: string[];
  imageUrl?: string | null;
  menu?: MenuItemType[];
}

export interface MenuItemType {
  id: string;
  created_at: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  is_available: boolean;
  image_url: string | null;
  updated_at: string | null;
}

export interface OrderType {
  id: string;
  created_at: string;
  customer_id: string;
  restaurant_id: string;
  order_date?: string;
  total_amount?: number;
  status: OrderStatus;
  delivery_address?: string | null;
  delivery_city?: string | null;
  delivery_state?: string | null;
  delivery_zip_code?: string | null;
  delivery_phone_number?: string | null;
  notes?: string | null;
  restaurant_name?: string;
  customer_name?: string;
  total?: number;
  estimated_time?: string;
  items?: OrderItemType[];
  phone?: string | null;
  address?: string | null;
  updated_at?: string;
}

export interface OrderWithItems extends OrderType {
  items: OrderItemType[];
}

// Update OrderStatus to include all possible statuses used in the app
export type OrderStatus = 'new' | 'confirmed' | 'cooking' | 'ready' | 'dispatched' | 'delivered' | 'cancelled' | 'pending' | 'preparing';

export interface OrderItemType {
  id: string;
  created_at: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  item_price?: number;
  total_price?: number;
  name?: string;
  price?: number;
  description?: string;
  menu_item?: MenuItemType;
}

export interface TermsAndConditionsType {
  id: string;
  type: 'customer' | 'vendor' | 'admin';
  content: string;
  version: string;
  published_at: string;
  is_active: boolean;
}

export interface UserTermsAcceptanceType {
  id: string;
  user_id: string;
  terms_id: string;
  accepted_at: string;
}

export interface VendorApprovalType {
  id: string;
  vendor_id: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vendor?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface SupportTicketType {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface AnalyticsDataType {
  id: string;
  date: string;
  total_orders: number;
  total_revenue: number;
  new_users: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemType {
  id: string;
  menuItem: MenuItemType;
  quantity: number;
  name?: string;
  price?: number;
  description?: string;
}

export interface AvailabilityRequestType {
  id: string;
  created_at: string;
  customer_id: string;
  restaurant_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'responded';
  estimated_time_query: string;
  estimated_time?: string;
  updated_at?: string;
}

export interface AvailabilityRequestWithItems extends AvailabilityRequestType {
  items: {
    id: string;
    menu_item_id: string;
    quantity: number;
    menu_item?: MenuItemType;
    request_id?: string;
    created_at?: string;
  }[];
  restaurant?: RestaurantType;
}
