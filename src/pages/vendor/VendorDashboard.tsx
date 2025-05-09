
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AvailabilityRequestCard from "@/components/vendor/AvailabilityRequestCard";
import OrderManagementCard from "@/components/vendor/OrderManagementCard";
import { useRestaurant } from "@/contexts/RestaurantContext";
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

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
        <Card>
          <CardHeader className="bg-muted/30 pb-2">
            <CardTitle className="text-lg">New Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{newOrders.length}</div>
            <p className="text-muted-foreground text-sm">
              Waiting for confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="bg-muted/30 pb-2">
            <CardTitle className="text-lg">Availability Requests</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{pendingRequests.length}</div>
            <p className="text-muted-foreground text-sm">
              Waiting for your response
            </p>
          </CardContent>
        </Card>
      </div>
      
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Availability Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((request) => (
              <AvailabilityRequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}
      
      {newOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">New Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newOrders.map((order) => (
              <OrderManagementCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
