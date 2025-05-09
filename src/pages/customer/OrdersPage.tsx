
import { useEffect } from "react";
import OrderStatusCard from "@/components/customer/OrderStatusCard";
import { useOrder } from "@/contexts/OrderContext";

const OrdersPage = () => {
  const { orders } = useOrder();

  useEffect(() => {
    // This would fetch orders from Supabase
    // In this initial version, we're using mock data from context
  }, []);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderStatusCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <h2 className="text-xl font-medium mb-2">No orders yet</h2>
          <p className="text-muted-foreground">
            Your order history will appear here once you place an order.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
