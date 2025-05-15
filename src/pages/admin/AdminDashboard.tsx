
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsDataType, VendorApprovalType, SupportTicketType } from "@/types/models";
import { ArrowUp, ArrowDown, Users, Store, ShoppingCart, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataType | null>(null);
  const [vendorApprovals, setVendorApprovals] = useState<VendorApprovalType[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicketType[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [vendorCount, setVendorCount] = useState<number>(0);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch analytics for today
      const today = new Date().toISOString().split('T')[0];
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('admin_analytics')
        .select('*')
        .eq('date', today)
        .single();
      
      if (!analyticsError) {
        setAnalyticsData(analyticsData);
      }

      // Fetch pending vendor approvals
      const { data: vendorApprovals, error: approvalsError } = await supabase
        .from('vendor_approvals')
        .select('*, vendor:profiles(*)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (!approvalsError && vendorApprovals) {
        setVendorApprovals(vendorApprovals);
      }

      // Fetch open support tickets
      const { data: supportTickets, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*, user:profiles(*)')
        .in('status', ['open', 'in_progress'])
        .order('created_at', { ascending: false });
      
      if (!ticketsError && supportTickets) {
        setSupportTickets(supportTickets);
      }

      // Get user counts
      const { count: customerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'customer');
      
      const { count: vendorCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'vendor');
      
      setUserCount(customerCount || 0);
      setVendorCount(vendorCount || 0);

      // Get order counts
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      setOrderCount(orderCount || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch dashboard data"
      });
    } finally {
      setLoading(false);
    }
  };

  const approveVendor = async (vendorId: string) => {
    try {
      const { error } = await supabase
        .from('vendor_approvals')
        .update({ 
          status: 'approved',
          admin_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
          updated_at: new Date().toISOString()
        })
        .eq('vendor_id', vendorId);
      
      if (error) throw error;
      
      // Remove from list
      setVendorApprovals(prev => prev.filter(v => v.vendor_id !== vendorId));
      
      toast({
        title: "Vendor approved",
        description: "The vendor has been approved successfully"
      });
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve vendor"
      });
    }
  };

  const rejectVendor = async (vendorId: string) => {
    try {
      const { error } = await supabase
        .from('vendor_approvals')
        .update({ 
          status: 'rejected',
          admin_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
          updated_at: new Date().toISOString()
        })
        .eq('vendor_id', vendorId);
      
      if (error) throw error;
      
      // Remove from list
      setVendorApprovals(prev => prev.filter(v => v.vendor_id !== vendorId));
      
      toast({
        title: "Vendor rejected",
        description: "The vendor has been rejected"
      });
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject vendor"
      });
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{userCount}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Store className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{vendorCount}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingCart className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{orderCount}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                ${analyticsData?.total_revenue?.toFixed(2) || '0.00'}
              </div>
              {analyticsData && analyticsData.total_revenue > 0 && (
                <span className="ml-2 text-green-600 flex items-center text-xs">
                  <ArrowUp className="h-3 w-3" /> {analyticsData.total_revenue}%
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Vendor Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {vendorApprovals.length > 0 ? (
              <div className="space-y-4">
                {vendorApprovals.map((approval) => (
                  <div key={approval.id} className="border rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">
                        {approval.vendor?.first_name} {approval.vendor?.last_name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(approval.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {approval.vendor?.email}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => approveVendor(approval.vendor_id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => rejectVendor(approval.vendor_id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No pending vendor approvals
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Support Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {supportTickets.length > 0 ? (
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                        {ticket.subject}
                      </h3>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      From: {ticket.user?.first_name} {ticket.user?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {new Date(ticket.created_at).toLocaleString()}
                    </p>
                    <Button size="sm" variant="secondary" asChild>
                      <Link to={`/admin/support/${ticket.id}`}>View Details</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No active support tickets
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
