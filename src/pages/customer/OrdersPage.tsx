
import { useEffect } from "react";
import OrderStatusCard from "@/components/customer/OrderStatusCard";
import { motion } from "framer-motion";
import { useOrder } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";

const OrdersPage = () => {
  const { orders, fetchOrders } = useOrder();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {orders.length > 0 ? (
        <motion.div
          className="space-y-4"
          initial="initial"
          animate="animate"
        >
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
            >
              <OrderStatusCard order={order} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-12 bg-muted/20 rounded-lg"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-xl font-medium mb-2">No orders yet</h2>
          <p className="text-muted-foreground">
            Your order history will appear here once you place an order.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default OrdersPage;
