
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalyticsDataType, SupportTicketType, VendorApprovalType } from "@/types/models";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Star, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  Filter,
  Calendar
} from "lucide-react";
import { AnimatedCard, CardContainer } from "@/components/ui/animated-card";
import { MetricCardSkeleton } from "@/components/ui/loading";

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataType>({
    id: '1',
    date: new Date().toISOString(),
    total_orders: 125,
    total_revenue: 2450.75,
    new_users: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [pendingVendors, setPendingVendors] = useState<VendorApprovalType[]>([
    {
      id: '1',
      vendor_id: 'v1',
      status: 'pending',
      admin_id: null,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      vendor: {
        id: 'v1',
        email: 'vendor1@example.com',
        first_name: 'John',
        last_name: 'Doe'
      }
    },
    {
      id: '2',
      vendor_id: 'v2',
      status: 'pending',
      admin_id: null,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      vendor: {
        id: 'v2',
        email: 'vendor2@example.com',
        first_name: 'Jane',
        last_name: 'Smith'
      }
    }
  ]);

  const [supportTickets, setSupportTickets] = useState<SupportTicketType[]>([
    {
      id: '1',
      user_id: 'u1',
      subject: 'Payment Issue',
      description: 'I was charged twice for my order',
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'u1',
        email: 'customer@example.com',
        first_name: 'Alice',
        last_name: 'Johnson'
      }
    },
    {
      id: '2',
      user_id: 'u2',
      subject: 'Account Verification',
      description: 'Cannot verify my account with phone number',
      status: 'in_progress',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'u2',
        email: 'customer2@example.com',
        first_name: 'Bob',
        last_name: 'Williams'
      }
    }
  ]);
  
  const [chartData, setChartData] = useState([
    {
      name: 'Jan',
      orders: 65,
      revenue: 1200,
      users: 45,
    },
    {
      name: 'Feb',
      orders: 59,
      revenue: 980,
      users: 52,
    },
    {
      name: 'Mar',
      orders: 80,
      revenue: 1600,
      users: 67,
    },
    {
      name: 'Apr',
      orders: 81,
      revenue: 1700,
      users: 73,
    },
    {
      name: 'May',
      orders: 56,
      revenue: 1000,
      users: 49,
    },
    {
      name: 'Jun',
      orders: 95,
      revenue: 2200,
      users: 89,
    },
  ]);

  const [revenueData, setRevenueData] = useState([
    { date: 'Jan 01', amount: 1200 },
    { date: 'Jan 07', amount: 1800 },
    { date: 'Jan 14', amount: 2100 },
    { date: 'Jan 21', amount: 2450 },
    { date: 'Jan 28', amount: 2800 },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleApproveVendor = (vendorId: string) => {
    setPendingVendors(prev => 
      prev.map(v => 
        v.vendor_id === vendorId ? { ...v, status: 'approved', updated_at: new Date().toISOString() } : v
      )
    );
    
    toast({
      title: "Vendor approved",
      description: "The vendor has been approved successfully"
    });
  };
  
  const handleRejectVendor = (vendorId: string) => {
    setPendingVendors(prev => 
      prev.map(v => 
        v.vendor_id === vendorId ? { ...v, status: 'rejected', updated_at: new Date().toISOString() } : v
      )
    );
    
    toast({
      title: "Vendor rejected",
      description: "The vendor has been rejected"
    });
  };
  
  const handleAssignTicket = (ticketId: string) => {
    setSupportTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: 'in_progress', updated_at: new Date().toISOString() } : ticket
      )
    );
    
    toast({
      title: "Ticket assigned",
      description: "The ticket has been assigned to you"
    });
  };

  const metrics = [
    {
      title: "Total Orders",
      value: analyticsData.total_orders.toLocaleString(),
      change: "+17%",
      trend: "up",
      icon: ShoppingCart,
      color: "blue",
      description: "vs last month"
    },
    {
      title: "Total Revenue",
      value: `$${analyticsData.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: "+11%",
      trend: "up",
      icon: DollarSign,
      color: "green",
      description: "vs last month"
    },
    {
      title: "New Users",
      value: analyticsData.new_users.toLocaleString(),
      change: "-15%",
      trend: "down",
      icon: Users,
      color: "orange",
      description: "vs last month"
    },
    {
      title: "Completion Rate",
      value: "82%",
      change: "+2%",
      trend: "up",
      icon: CheckCircle,
      color: "purple",
      description: "order completion"
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 py-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-gray-900 dark:to-indigo-900/10 relative">
      {/* Modern Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 p-8 mb-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <motion.h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Admin Dashboard
              </motion.h1>
              <motion.p 
                className="text-indigo-100 text-sm sm:text-base max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Monitor platform performance, manage users, and oversee all operations. Get comprehensive insights and administrative control.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Report
              </Button>
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50 shadow-lg">
                <Filter className="h-5 w-5 mr-2" />
                Export Data
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      <div className="space-y-8">
        {/* Metrics Cards */}
        <CardContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const colorClasses = {
              blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
              green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
              purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
            };

            return (
              <AnimatedCard key={metric.title} delay={index * 0.1} enableGlow className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${colorClasses[metric.color as keyof typeof colorClasses]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-2 text-xs">
                      {metric.trend === "up" ? (
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {metric.change}
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 dark:text-red-400">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {metric.change}
                        </div>
                      )}
                      <span className="text-muted-foreground">{metric.description}</span>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
            );
          })}
        </CardContainer>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatedCard delay={0.2} className="col-span-1 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Order Analytics</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
                  <XAxis dataKey="name" stroke="currentColor" className="opacity-60" />
                  <YAxis stroke="currentColor" className="opacity-60" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" name="Orders" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </AnimatedCard>
          
          <AnimatedCard delay={0.3} className="col-span-1 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Revenue Profile</CardTitle>
                <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +11% vs last month
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
                  <XAxis dataKey="date" stroke="currentColor" className="opacity-60" />
                  <YAxis stroke="currentColor" className="opacity-60" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </AnimatedCard>
        </div>
        
        {/* Management Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatedCard delay={0.4} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Vendor Approvals</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVendors.filter(vendor => vendor.status === 'pending').length > 0 ? (
                  pendingVendors.filter(vendor => vendor.status === 'pending').map((vendor, index) => (
                    <motion.div 
                      key={vendor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {vendor.vendor?.first_name?.[0]}{vendor.vendor?.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium">{vendor.vendor?.first_name} {vendor.vendor?.last_name}</p>
                          <p className="text-sm text-muted-foreground">{vendor.vendor?.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveVendor(vendor.vendor_id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRejectVendor(vendor.vendor_id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No pending approvals
                  </div>
                )}
              </div>
            </CardContent>
          </AnimatedCard>
          
          <AnimatedCard delay={0.5} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Support Tickets</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.length > 0 ? (
                  supportTickets.map((ticket, index) => (
                    <motion.div 
                      key={ticket.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{ticket.subject}</h4>
                          <Badge 
                            variant={ticket.status === 'open' ? "destructive" : ticket.status === 'in_progress' ? "default" : "outline"}
                            className="text-xs"
                          >
                            {ticket.status === 'open' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {ticket.status === 'in_progress' && <Clock className="h-3 w-3 mr-1" />}
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate max-w-md">{ticket.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground space-x-2">
                          <span>From: {ticket.user?.first_name} {ticket.user?.last_name}</span>
                          <span>•</span>
                          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>
                        {ticket.status === 'open' && (
                          <Button size="sm" onClick={() => handleAssignTicket(ticket.id)}>
                            Assign
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No support tickets
                  </div>
                )}
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
