
import { useEffect, useState, useRef } from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import OrderManagementCard from "@/components/vendor/OrderManagementCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderWithItems } from "@/types/models";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Clock, 
  ChefHat, 
  CheckCircle, 
  Truck, 
  Package,
  TrendingUp,
  Filter,
  Search
} from "lucide-react";
import { mobileTextClasses } from "@/lib/mobile-optimizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VendorOrders = () => {
  const { vendorOrders, fetchVendorOrders } = useRestaurant();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const tabsRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  useEffect(() => {
    if (user) {
      fetchVendorOrders();
    }
  }, [user, fetchVendorOrders]);

  useEffect(() => {
    // Scroll the active tab into view
    if (tabsRefs.current[activeTab]) {
      tabsRefs.current[activeTab]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }, [activeTab]);
  
  const getFilteredOrders = (status?: string | "all") => {
    let filtered = vendorOrders;
    
    if (status && status !== "all") {
      filtered = filtered.filter(order => order.status === status);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.id.toString().includes(searchQuery) ||
        order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getTabInfo = (tab: string) => {
    const icons = {
      all: ShoppingBag,
      new: Clock,
      cooking: ChefHat,
      ready: CheckCircle,
      dispatched: Truck,
      delivered: Package
    };
    
    const colors = {
      all: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
      new: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
      cooking: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
      ready: "text-green-600 bg-green-50 dark:bg-green-900/20",
      dispatched: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
      delivered: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
    };
    
    return {
      icon: icons[tab as keyof typeof icons] || ShoppingBag,
      color: colors[tab as keyof typeof colors] || colors.all,
      count: getFilteredOrders(tab === "all" ? undefined : tab).length
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 relative">
      {/* Modern Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 mb-8 text-white"
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
                Order Management
              </motion.h1>
              <motion.p 
                className="text-blue-100 text-sm sm:text-base max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Track and manage all your restaurant orders in real-time. Monitor order status, process requests, and ensure excellent customer service.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 mr-2" />
                Analytics
              </Button>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 shadow-lg">
                <Filter className="h-5 w-5 mr-2" />
                Export Orders
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by order ID or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 border-white/20 backdrop-blur-sm"
                />
              </div>
              <Badge variant="outline" className="shrink-0">
                {vendorOrders.length} Total Orders
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modern Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <motion.div
            className="overflow-x-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <TabsList className="inline-flex bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg p-2 rounded-2xl min-w-max">
              {["all", "new", "cooking", "ready", "dispatched", "delivered"].map((tab) => {
                const tabInfo = getTabInfo(tab);
                const Icon = tabInfo.icon;
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    ref={(el) => (tabsRefs.current[tab] = el)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/50 whitespace-nowrap"
                  >
                    <div className={`w-8 h-8 rounded-lg ${tabInfo.color} flex items-center justify-center`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium capitalize">{tab}</div>
                      <div className="text-xs text-muted-foreground data-[state=active]:text-white/80">
                        {tabInfo.count} orders
                      </div>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </motion.div>
          
          <div className="mt-8">
            {["all", "new", "cooking", "ready", "dispatched", "delivered"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <AnimatePresence mode="wait">
                  {getFilteredOrders(tab as string | "all").length > 0 ? (
                    <motion.div
                      key={`${tab}-content`}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {getFilteredOrders(tab as string | "all").map((order: OrderWithItems, idx) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                          whileHover={{ y: -2 }}
                        >
                          <OrderManagementCard order={order} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`${tab}-empty`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-0 shadow-lg">
                        <CardContent className="p-12 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">
                            No {tab === "all" ? "" : tab} orders found
                          </h3>
                          <p className="text-muted-foreground">
                            {searchQuery 
                              ? "Try adjusting your search criteria"
                              : `No ${tab === "all" ? "" : tab} orders at the moment`
                            }
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default VendorOrders;
