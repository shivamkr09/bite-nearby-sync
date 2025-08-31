
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import AvailabilityRequestCard from "@/components/vendor/AvailabilityRequestCard";
import OrderManagementCard from "@/components/vendor/OrderManagementCard";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
    if (user) {
      fetchVendorRestaurants();
      fetchVendorOrders();
      fetchVendorAvailabilityRequests();
    }
  }, [user, fetchVendorRestaurants, fetchVendorOrders, fetchVendorAvailabilityRequests]);

  // Filter for new orders and availability requests
  const newOrders = vendorOrders.filter(order => order.status === 'new');
  const pendingRequests = availabilityRequests.filter(req => req.status === 'pending');

  // Analytics calculations
  const analytics = useMemo(() => {
    const now = new Date();
    const ordersByDate = new Map<string, { orders: number; revenue: number }>();

    // Initialize dates based on timeframe
    const initializeDates = () => {
      const dates: string[] = [];
      if (timeframe === 'daily') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          dates.push(date.toISOString().split('T')[0]);
        }
      } else if (timeframe === 'weekly') {
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - (i * 7));
          dates.push(`Week ${4-i}`);
        }
      } else if (timeframe === 'monthly') {
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          dates.push(date.toLocaleString('default', { month: 'short' }));
        }
      } else {
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          dates.push(date.toLocaleString('default', { month: 'short' }));
        }
      }
      return dates;
    };

    const dates = initializeDates();
    dates.forEach(date => {
      ordersByDate.set(date, { orders: 0, revenue: 0 });
    });

    // Process orders
    vendorOrders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      let dateKey = '';

      if (timeframe === 'daily') {
        dateKey = orderDate.toISOString().split('T')[0];
      } else if (timeframe === 'weekly') {
        const weekNumber = Math.ceil((orderDate.getDate() + 6 - orderDate.getDay()) / 7);
        dateKey = `Week ${weekNumber}`;
      } else {
        dateKey = orderDate.toLocaleString('default', { month: 'short' });
      }

      if (ordersByDate.has(dateKey)) {
        const current = ordersByDate.get(dateKey)!;
        ordersByDate.set(dateKey, {
          orders: current.orders + 1,
          revenue: current.revenue + (order.total_amount || 0)
        });
      }
    });

    return Array.from(ordersByDate.entries()).map(([date, data]) => ({
      date,
      orders: data.orders,
      revenue: data.revenue
    }));
  }, [vendorOrders, timeframe]);

  const totalOrders = vendorOrders.length;
  const totalRevenue = vendorOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="py-6 space-y-6">
      <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
      
      {vendorRestaurants.length === 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Welcome to Bite Nearby!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You don't have any restaurants set up yet. Create your first restaurant to start receiving orders.</p>
            <Link to="/vendor/restaurants">
              <Button>Create Restaurant</Button>
            </Link>
          </CardContent>
        </Card>
      )}
      
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card>
          <CardHeader className="bg-muted/30 pb-2">
            <CardTitle className="text-lg">Restaurants</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{vendorRestaurants.length}</div>
            <p className="text-muted-foreground text-sm">
              {vendorRestaurants.filter(r => r.is_open).length} currently open
            </p>
          </CardContent>
        </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
        <Card>
          <CardHeader className="bg-muted/30 pb-2">
            <CardTitle className="text-lg">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{totalOrders}</div>
            <p className="text-muted-foreground text-sm">
              {newOrders.length} new orders
            </p>
          </CardContent>
        </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
        <Card>
          <CardHeader className="bg-muted/30 pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</div>
            <p className="text-muted-foreground text-sm">
              Avg. ₹{averageOrderValue.toFixed(2)} per order
            </p>
          </CardContent>
        </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
        <Card>
          <CardHeader className="bg-muted/30 pb-2">
            <CardTitle className="text-lg">Availability Requests</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{pendingRequests.length}</div>
              <Link to="/vendor/availability-requests">
                <Button variant="outline" size="sm">
                  View Requests
                </Button>
              </Link>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Waiting for response
            </p>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>

      {/* Analytics Section */}
      <div className="space-y-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-4 py-2 rounded ${timeframe === 'daily' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 rounded ${timeframe === 'weekly' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded ${timeframe === 'monthly' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('yearly')}
            className={`px-4 py-2 rounded ${timeframe === 'yearly' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
          >
            Yearly
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
          <Card>
            <CardHeader>
              <CardTitle>Order Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.05 }}>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>
      
      {pendingRequests.length > 0 && (
        <motion.div className="space-y-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
          <h2 className="text-xl font-semibold">Pending Availability Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((request) => (
              <AvailabilityRequestCard key={request.id} request={request} />
            ))}
          </div>
        </motion.div>
      )}
      
      {newOrders.length > 0 && (
        <motion.div className="space-y-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
          <h2 className="text-xl font-semibold">New Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newOrders.map((order) => (
              <OrderManagementCard key={order.id} order={order} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VendorDashboard;
