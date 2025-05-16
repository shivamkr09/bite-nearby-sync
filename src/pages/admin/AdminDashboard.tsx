
// For the AdminDashboard.tsx file, we need to modify the data fetching approach:
// Import the necessary components and hooks
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AnalyticsDataType, 
  VendorApprovalType,
  SupportTicketType
} from '@/types/models';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsDataType>({
    id: '', 
    date: new Date().toISOString(),
    total_orders: 0,
    total_revenue: 0,
    new_users: 0,
    created_at: '',
    updated_at: ''
  });
  const [vendorApprovals, setVendorApprovals] = useState<VendorApprovalType[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // For now, directly calculate the analytics data from orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*');
        
        if (ordersError) throw ordersError;
        
        // Calculate total revenue and orders count
        const totalRevenue = orders ? orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0) : 0;
        const totalOrders = orders ? orders.length : 0;
        
        // Get user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (userError) throw userError;
        
        // Create analytics object
        const analyticsData: AnalyticsDataType = {
          id: 'current',
          date: new Date().toISOString().split('T')[0],
          total_orders: totalOrders,
          total_revenue: totalRevenue,
          new_users: userCount || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setAnalytics(analyticsData);
        
        // For vendor approvals, we'll mock this data since the table doesn't exist yet
        // In a real implementation, you would create the vendor_approvals table
        const mockVendorApprovals: VendorApprovalType[] = [];
        
        setVendorApprovals(mockVendorApprovals);
        
        // For support tickets, we'll also mock this data
        // In a real implementation, you would create the support_tickets table
        const mockSupportTickets: SupportTicketType[] = [];
        
        setSupportTickets(mockSupportTickets);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          variant: "destructive",
          title: "Dashboard Error",
          description: "Failed to load dashboard data"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Approve a vendor
  const approveVendor = async (vendorId: string) => {
    // Implementation for when vendor_approvals table exists
    toast({
      title: "Feature not implemented",
      description: "Vendor approval functionality will be added soon"
    });
  };

  // Reject a vendor
  const rejectVendor = async (vendorId: string) => {
    // Implementation for when vendor_approvals table exists
    toast({
      title: "Feature not implemented", 
      description: "Vendor rejection functionality will be added soon"
    });
  };

  // Mark support ticket as resolved
  const resolveSupportTicket = async (ticketId: string) => {
    // Implementation for when support_tickets table exists
    toast({
      title: "Feature not implemented",
      description: "Support ticket resolution functionality will be added soon"
    });
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Analytics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : analytics.total_orders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${isLoading ? "Loading..." : analytics.total_revenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : analytics.new_users}</div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading vendor approvals...</p>
          ) : vendorApprovals.length > 0 ? (
            <div className="space-y-4">
              {vendorApprovals.map((approval) => (
                <div key={approval.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{approval.vendor?.first_name} {approval.vendor?.last_name}</p>
                    <p className="text-sm text-muted-foreground">{approval.vendor?.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveVendor(approval.vendor_id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Approve
                    </button>
                    <button onClick={() => rejectVendor(approval.vendor_id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No pending vendor approvals</p>
          )}
        </CardContent>
      </Card>

      {/* Support Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading support tickets...</p>
          ) : supportTickets.length > 0 ? (
            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">{ticket.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">From: {ticket.user?.email}</p>
                    <button onClick={() => resolveSupportTicket(ticket.id)} className="text-sm text-blue-500 hover:underline">
                      Mark as Resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No active support tickets</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
