
import { OrderType } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface OrderStatusCardProps {
  order: OrderType;
}

const OrderStatusCard = ({ order }: OrderStatusCardProps) => {
  const { id, restaurant_name, status, created_at } = order;
  const total = order.total_amount || order.total || 0;
  const estimatedTime = order.estimated_time || "15-30 min";
  
  const getStatusLabel = () => {
    switch (status) {
      case 'pending': return 'Order received';
      case 'confirmed': return 'Order confirmed';
      case 'preparing': return 'Preparing your food';
      case 'ready': return 'Ready for pickup/delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown status';
    }
  };

  const getStatusPercentage = () => {
    switch (status) {
      case 'pending': return 10;
      case 'confirmed': return 25;
      case 'preparing': return 50;
      case 'ready': return 75;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  // Safely calculate item count
  const itemCount = order.items ? order.items.reduce((acc, item) => acc + item.quantity, 0) : 1;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{restaurant_name || "Restaurant"}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{getStatusLabel()}</span>
              <span className="text-muted-foreground">Est. time: {estimatedTime}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${getStatusPercentage()}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium">Order #{id.substring(id.length - 6)}</div>
            <div className="text-sm text-muted-foreground">
              {itemCount} items · ${total.toFixed(2)}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className={`status-indicator status-${status}`}></span>
            <span className="text-sm capitalize">{status}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStatusCard;
