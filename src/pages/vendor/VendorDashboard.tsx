import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AvailabilityRequestCard from "@/components/vendor/AvailabilityRequestCard";
import OrderManagementCard from "@/components/vendor/OrderManagementCard";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Clock, 
  AlertCircle,
  BarChart3,
  Activity
} from "lucide-react";
import { mobileTextClasses } from "@/lib/mobile-optimizations";

const VendorDashboard = () => {
  const { 
    vendorRestaurants, 
    vendorOrders, 
    availabilityRequests,
    fetchVendorRestaurants,
    fetchVendorOrders,
    fetchVendorAvailabilityRequests
  } = useRestaurant();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  useEffect(() => {
    fetchVendorRestaurants();
    fetchVendorOrders();
    fetchVendorAvailabilityRequests();
  }, []);

  const newOrders = useMemo(() => {
    return vendorOrders.filter(order => order.status === 'pending');
  }, [vendorOrders]);

  const pendingRequests = useMemo(() => {
    return availabilityRequests.filter(request => request.status === 'pending');
  }, [availabilityRequests]);

  const analytics = useMemo(() => {
    const now = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayOrders = vendorOrders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === date.toDateString();
      });
      
      const revenue = dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      
      data.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue
      });
    }
    
    return data;
  }, [vendorOrders, timeframe]);

  const totalOrders = vendorOrders.length;
  const totalRevenue = vendorOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 relative">
      {/* Modern Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-8 mb-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <motion.h1 
                className={`${mobileTextClasses.title} font-bold mb-2`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Restaurant Dashboard
              </motion.h1>
              <motion.p 
                className="text-emerald-100 text-sm sm:text-base max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {user?.email ? `Welcome back, ${user.email}` : 'Welcome back!'} 
                {vendorRestaurants.length > 0 
                  ? ` Manage your ${vendorRestaurants.length} restaurant${vendorRestaurants.length > 1 ? 's' : ''} and track your business performance.`
                  : ' Start your journey by creating your first restaurant.'
                }
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {vendorRestaurants.length === 0 ? (
                <Link to="/vendor/restaurants">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-50 shadow-lg">
                    <Users className="h-5 w-5 mr-2" />
                    Create Restaurant
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/vendor/orders">
                    <Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Manage Orders
                    </Button>
                  </Link>
                  <Link to="/vendor/restaurants">
                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-50 shadow-lg">
                      <Activity className="h-5 w-5 mr-2" />
                      View Restaurants
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      {/* Welcome Message for New Users */}
      {vendorRestaurants.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Welcome to Bite Nearby!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                You don't have any restaurants set up yet. Create your first restaurant to start receiving orders and managing your business.
              </p>
              <Link to="/vendor/restaurants">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  <Users className="h-4 w-4 mr-2" />
                  Create Your First Restaurant
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {[
          {
            title: "Restaurants",
            value: vendorRestaurants.length,
            subtitle: `${vendorRestaurants.filter(r => r.is_open).length} currently open`,
            icon: Users,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            iconColor: "text-blue-600"
          },
          {
            title: "Total Orders",
            value: totalOrders,
            subtitle: `${newOrders.length} new orders`,
            icon: ShoppingBag,
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
            iconColor: "text-emerald-600"
          },
          {
            title: "Revenue",
            value: `₹${totalRevenue.toLocaleString('en-IN')}`,
            subtitle: `Avg: ₹${averageOrderValue.toFixed(0)}`,
            icon: DollarSign,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            iconColor: "text-purple-600"
          },
          {
            title: "Pending Requests",
            value: pendingRequests.length,
            subtitle: pendingRequests.length > 0 ? "Needs attention" : "All caught up",
            icon: AlertCircle,
            color: pendingRequests.length > 0 ? "from-orange-500 to-orange-600" : "from-green-500 to-green-600",
            bgColor: pendingRequests.length > 0 ? "bg-orange-50 dark:bg-orange-900/20" : "bg-green-50 dark:bg-green-900/20",
            iconColor: pendingRequests.length > 0 ? "text-orange-600" : "text-green-600"
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="relative overflow-hidden border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.subtitle}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mb-8"
      >
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2 mb-4 sm:mb-0">
                <BarChart3 className="h-5 w-5" />
                Business Analytics
              </CardTitle>
              <div className="flex gap-2">
                {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
                  <Button
                    key={period}
                    variant={timeframe === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeframe(period as any)}
                    className="capitalize"
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="url(#revenueGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders and Requests Sections */}
      <div className="space-y-8">
        <AnimatePresence>
          {newOrders.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  New Orders ({newOrders.length})
                </h2>
                <Badge variant="destructive" className="animate-pulse">
                  Action Required
                </Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {newOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <OrderManagementCard order={order} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {pendingRequests.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Availability Requests ({pendingRequests.length})
                </h2>
                <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
                  Review Required
                </Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AvailabilityRequestCard request={request} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VendorDashboard;