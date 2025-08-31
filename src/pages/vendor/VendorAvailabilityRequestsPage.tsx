import { useEffect } from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
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

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRequests.length > 0 ? (
          sortedRequests.map((request, idx) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
            >
              <AvailabilityRequestCard request={request} />
            </motion.div>
          ))
        ) : (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="text-lg">No Availability Requests</CardTitle>
            </CardHeader>
            <CardContent className="motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-1">
              <p>You currently have no availability requests from customers.</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default VendorAvailabilityRequestsPage;