
import { useEffect } from "react";
import OrderStatusCard from "@/components/customer/OrderStatusCard";
import { motion } from "framer-motion";
import { useOrder } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Clock, Package, Utensils, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const OrdersPage = () => {
  const { orders, fetchOrders } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.restaurant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-gray-900 dark:to-orange-900/10">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center">
            <ShoppingBag className="mr-3 h-8 w-8 text-orange-500" />
            Your Orders
          </h1>
          <p className="text-muted-foreground">Track your order history and status</p>
        </motion.div>

        {orders.length > 0 ? (
          <>
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
            >
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 text-center border-0 shadow-lg">
                <Package className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.all}</div>
                <div className="text-xs text-muted-foreground">Total Orders</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 text-center border-0 shadow-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 text-center border-0 shadow-lg">
                <Utensils className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold text-blue-600">{stats.preparing}</div>
                <div className="text-xs text-muted-foreground">Preparing</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 text-center border-0 shadow-lg">
                <Package className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                <div className="text-xs text-muted-foreground">Confirmed</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 text-center border-0 shadow-lg">
                <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                <div className="text-2xl font-bold text-emerald-600">{stats.delivered}</div>
                <div className="text-xs text-muted-foreground">Delivered</div>
              </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 mb-8 border-0 shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders by restaurant name or order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-200/50"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "All", value: "all", count: stats.all },
                    { label: "Pending", value: "pending", count: stats.pending },
                    { label: "Confirmed", value: "confirmed", count: stats.confirmed },
                    { label: "Preparing", value: "preparing", count: stats.preparing },
                    { label: "Delivered", value: "delivered", count: stats.delivered },
                  ].map((filter) => (
                    <Button
                      key={filter.value}
                      variant={statusFilter === filter.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(filter.value)}
                      className={`${
                        statusFilter === filter.value
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200"
                      }`}
                    >
                      <Filter className="h-3 w-3 mr-1" />
                      {filter.label}
                      {filter.count > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filter.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <motion.div
                className="space-y-6"
                initial="initial"
                animate="animate"
              >
                {filteredOrders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <OrderStatusCard order={order} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
                  <Search className="h-12 w-12 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-orange-500" />
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              Your order history will appear here once you place your first order. Start exploring delicious restaurants!
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                onClick={() => navigate('/customer/restaurants')}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Utensils className="mr-2 h-5 w-5" />
                Explore Restaurants
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
