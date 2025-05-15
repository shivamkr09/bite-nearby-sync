export interface UserType {
  id: string;
  createdAt: string;
  email: string | null;
  email_verified: boolean;
  full_name: string | null;
  phone_number: string | null;
  updated_at: string | null;
  user_name: string | null;
  role: 'customer' | 'vendor' | null;
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
  order_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_state: string | null;
  delivery_zip_code: string | null;
  delivery_phone_number: string | null;
  notes: string | null;
}

export interface OrderItemType {
  id: string;
  created_at: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  item_price: number;
  total_price: number;
}

export interface TermsAndConditionsType {
  id: string;
  type: 'customer' | 'vendor';
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
