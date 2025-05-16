
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRestaurant } from "@/contexts/RestaurantContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { OrderWithItems, OrderStatus } from "@/types/models";

interface OrderManagementCardProps {
  order: OrderWithItems;
}

const OrderManagementCard = ({ order }: OrderManagementCardProps) => {
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const { updateOrderStatus } = useRestaurant();

  const handleStatusChange = (newStatus: string) => {
    // Ensure newStatus is of type OrderStatus
    const typedStatus = newStatus as OrderStatus;
    setStatus(typedStatus);
    updateOrderStatus(order.id, typedStatus);
  };

  const statusOptions = [
    { value: 'new', label: 'New Order' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'ready', label: 'Ready' },
    { value: 'dispatched', label: 'Dispatched' },
    { value: 'delivered', label: 'Delivered' }
  ];

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Order #{order.id.substring(order.id.length - 6)}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium">Customer</h4>
          <p className="text-sm">{order.customer_name}</p>
          <p className="text-sm">{order.phone}</p>
          <p className="text-sm">{order.address}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Items</h4>
          <ul className="space-y-1 mt-1 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name || (item.menu_item && item.menu_item.name)}
                </span>
                <span className="text-muted-foreground">
                  ${((item.price || (item.menu_item && item.menu_item.price) || 0) * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-2 pt-2 border-t">
            <span className="font-medium">Total</span>
            <span className="font-medium">${(order.total || 0).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Order Status</label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  disabled={option.value === status}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center space-x-1">
            <span className={`status-indicator status-${status}`}></span>
            <span className="text-sm capitalize">{status}</span>
          </div>
          
          <span className="text-sm text-muted-foreground">
            Est. Time: {order.estimated_time}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderManagementCard;
