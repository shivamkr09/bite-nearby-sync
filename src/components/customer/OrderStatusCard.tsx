
import { OrderType } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface OrderStatusCardProps {
  order: OrderType;
}

const OrderStatusCard = ({ order }: OrderStatusCardProps) => {
  const { id, restaurant_name, total, status, estimated_time, created_at } = order;
  
  const getStatusLabel = () => {
    switch (status) {
      case 'new': return 'Order received';
      case 'confirmed': return 'Order confirmed';
      case 'cooking': return 'Preparing your food';
      case 'ready': return 'Ready for pickup/delivery';
      case 'dispatched': return 'On the way';
      case 'delivered': return 'Delivered';
      default: return 'Unknown status';
    }
  };

  const getStatusPercentage = () => {
    switch (status) {
      case 'new': return 10;
      case 'confirmed': return 25;
      case 'cooking': return 50;
      case 'ready': return 75;
      case 'dispatched': return 90;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  // Safely calculate item count
  const itemCount = order.items ? order.items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{restaurant_name}</CardTitle>
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
              <span className="text-muted-foreground">Est. time: {estimated_time}</span>
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
