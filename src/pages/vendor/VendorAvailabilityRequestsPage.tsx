import { useEffect } from "react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import AvailabilityRequestCard from "@/components/vendor/AvailabilityRequestCard";
import { 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Filter,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { mobileTextClasses } from "@/lib/mobile-optimizations";

const VendorAvailabilityRequestsPage = () => {
  const { availabilityRequests, fetchVendorAvailabilityRequests } = useRestaurant();

  useEffect(() => {
    fetchVendorAvailabilityRequests();
  }, [fetchVendorAvailabilityRequests]);

  // Sort requests by creation date, newest first
  const sortedRequests = [...availabilityRequests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const pendingRequests = sortedRequests.filter(request => request.status === 'pending');
  const approvedRequests = sortedRequests.filter(request => request.status === 'approved');
  const rejectedRequests = sortedRequests.filter(request => request.status === 'rejected');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-900/10 relative">
      {/* Modern Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 p-8 mb-8 text-white"
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
                Availability Requests
              </motion.h1>
              <motion.p 
                className="text-purple-100 text-sm sm:text-base max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Manage customer availability requests efficiently. Review, approve, or decline requests to optimize your restaurant's service schedule.
              </motion.p>
              
              {/* Quick Stats */}
              <motion.div 
                className="flex flex-wrap gap-4 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Clock className="h-3 w-3 mr-1" />
                  {pendingRequests.length} Pending
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {approvedRequests.length} Approved
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <XCircle className="h-3 w-3 mr-1" />
                  {rejectedRequests.length} Rejected
                </Badge>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 mr-2" />
                Request Analytics
              </Button>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 shadow-lg">
                <Filter className="h-5 w-5 mr-2" />
                Filter Requests
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      {/* Requests Grid or Empty State */}
      <AnimatePresence mode="wait">
        {sortedRequests.length > 0 ? (
          <motion.div 
            key="requests-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {sortedRequests.map((request, idx) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <AvailabilityRequestCard request={request} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-xl max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <Calendar className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  No Availability Requests
                </motion.h3>
                
                <motion.p 
                  className="text-muted-foreground mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  You currently have no availability requests from customers. When customers request specific 
                  time slots or delivery windows, they'll appear here for your review and approval.
                </motion.p>
                
                {/* Feature highlights */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-purple-500" />
                    Customer Requests
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-purple-500" />
                    Time Management
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-purple-500" />
                    Quick Responses
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorAvailabilityRequestsPage;