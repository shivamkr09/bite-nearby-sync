import { useEffect } from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AvailabilityRequestCard from "@/components/vendor/AvailabilityRequestCard";

const VendorAvailabilityRequestsPage = () => {
  const { availabilityRequests, fetchVendorAvailabilityRequests } = useRestaurant();

  useEffect(() => {
    fetchVendorAvailabilityRequests();
  }, [fetchVendorAvailabilityRequests]);

  // Sort requests by creation date, newest first
  const sortedRequests = [...availabilityRequests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Availability Requests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRequests.length > 0 ? (
          sortedRequests.map((request) => (
            <AvailabilityRequestCard key={request.id} request={request} />
          ))
        ) : (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="text-lg">No Availability Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You currently have no availability requests from customers.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorAvailabilityRequestsPage;