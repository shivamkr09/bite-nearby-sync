
import { 
  MenuItemType, 
  OrderType, 
  OrderWithItems,
  OrderItemType,
  AvailabilityRequestType,
  AvailabilityRequestWithItems,
  OrderStatus
} from "@/types/models";

// Cart item type definition
export interface CartItemType {
  id: string;
  menuItem: MenuItemType;
  quantity: number;
  name?: string;
  price?: number;
  description?: string;
}

// Order context type definition
export interface OrderContextType {
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
}
