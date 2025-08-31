
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, PackageCheck, PackageOpen, ShoppingBag, Truck } from "lucide-react";
import { OrderWithItems } from "@/types/models";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface OrderStatusCardProps {
  order: OrderWithItems;
}

const OrderStatusCard = ({ order }: OrderStatusCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = () => {
    switch (order.status) {
      case 'new':
      case 'confirmed':
        return <Clock className="h-5 w-5 text-warning-500" />;
      case 'cooking':
        return <ShoppingBag className="h-5 w-5 text-warning-500" />;
      case 'ready':
        return <PackageOpen className="h-5 w-5 text-success-500" />;
      case 'dispatched':
        return <Truck className="h-5 w-5 text-primary" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-success-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case 'new':
        return 'Order received';
      case 'confirmed':
        return 'Order confirmed';
      case 'cooking':
        return 'Preparing your food';
      case 'ready':
        return 'Your order is ready';
      case 'dispatched':
        return 'On the way to you';
      case 'delivered':
        return 'Order delivered';
      default:
        return 'Processing';
    }
  };

  const getStatusBadgeVariant = () => {
    switch (order.status) {
      case 'delivered':
        return 'success';
      case 'ready':
        return 'success';
      case 'dispatched':
        return 'secondary';
      case 'cooking':
        return 'warning';
      case 'confirmed':
      case 'new':
        return 'default';
      default:
        return 'outline';
    }
  };

  const orderDate = new Date(order.created_at);

  return (
    <>
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
  <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Order from {order.restaurant_name}
            </CardTitle>
            <Badge variant={getStatusBadgeVariant() as any}>
              {getStatusText()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(orderDate, 'MMMM d, yyyy - h:mm a')}
          </p>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center mb-4">
            {getStatusIcon()}
            <div className="ml-3">
              <p className="text-sm font-medium">{getStatusText()}</p>
              {order.estimated_time && (
                <p className="text-sm text-muted-foreground">
                  Estimated time: {order.estimated_time}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Items:</span>{' '}
              {order.items.reduce((acc, item) => acc + item.quantity, 0)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setShowDetails(true)}>
            View Details
          </Button>
        </CardFooter>
      </Card>
  </motion.div>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Restaurant</h3>
              <p className="text-sm">{order.restaurant_name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Delivery Address</h3>
              <p className="text-sm">{order.address || "No address provided"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Contact</h3>
              <p className="text-sm">{order.phone || "No phone provided"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Items</h3>
              <ul className="space-y-1">
                {order.items.map((item) => (
                  <li key={item.id} className="text-sm flex justify-between">
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
                <span className="text-sm font-medium">Total</span>
                <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-muted/40 p-3 rounded-md">
              <p className="text-xs text-center text-muted-foreground">
                Order #{order.id.substring(0, 8)}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderStatusCard;
