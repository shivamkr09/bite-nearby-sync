
import { useEffect, useState, useRef } from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import OrderManagementCard from "@/components/vendor/OrderManagementCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderWithItems } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";

const VendorOrders = () => {
  const { vendorOrders, fetchVendorOrders } = useRestaurant();
  const [activeTab, setActiveTab] = useState<string>("all");
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
    if (!status || status === "all") {
      return vendorOrders;
    }
    return vendorOrders.filter(order => order.status === status);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="flex justify-start mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {["all", "new", "cooking", "ready", "dispatched", "delivered"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              ref={(el) => (tabsRefs.current[tab] = el)}
              className="flex-shrink-0 px-3 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:bg-gray-100 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Orders
            </TabsTrigger>
          ))}
        </TabsList>
        
        {["all", "new", "cooking", "ready", "dispatched", "delivered"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            {getFilteredOrders(tab as string | "all").length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getFilteredOrders(tab as string | "all").map((order: OrderWithItems) => (
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
