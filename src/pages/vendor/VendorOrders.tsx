
import { useEffect, useState } from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import OrderManagementCard from "@/components/vendor/OrderManagementCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderWithItems } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";

const VendorOrders = () => {
  const { vendorOrders, fetchVendorOrders } = useRestaurant();
  const [activeTab, setActiveTab] = useState<string>("all");
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchVendorOrders();
    }
  }, [user, fetchVendorOrders]);
  
  const getFilteredOrders = (status?: string | "all") => {
    if (!status || status === "all") {
      return vendorOrders;
    }
    return vendorOrders.filter(order => order.status === status);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="cooking">Cooking</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="dispatched">Dispatched</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        
        {["all", "new", "cooking", "ready", "dispatched", "delivered"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            {getFilteredOrders(tab as string | "all").length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getFilteredOrders(tab as string | "all").map((order) => (
                  <OrderManagementCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">No {tab === "all" ? "" : tab} orders found</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default VendorOrders;
