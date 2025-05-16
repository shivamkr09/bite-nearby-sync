
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsDataType, VendorApprovalType, SupportTicketType } from "@/types/models";
import { ArrowUp, Users, Store, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

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
      // Check if admin_analytics table exists
      try {
        // Fetch analytics for today
        const today = new Date().toISOString().split('T')[0];
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('admin_analytics')
          .select('*')
          .eq('date', today);
        
        if (!analyticsError && analyticsData && analyticsData.length > 0) {
          setAnalyticsData(analyticsData[0] as AnalyticsDataType);
        } else {
          // If no analytics data or table doesn't exist, create a default
          setAnalyticsData({
            id: '0',
            date: today,
            total_orders: 0,
            total_revenue: 0,
            new_users: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        // Fallback analytics object
        setAnalyticsData({
          id: '0',
          date: new Date().toISOString().split('T')[0],
          total_orders: 0,
          total_revenue: 0,
          new_users: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      // Try to fetch vendor approvals
      try {
        const { data: vendorApprovalsData, error: approvalsError } = await supabase
          .from('vendor_approvals')
          .select('*, vendor:profiles(*)')
          .eq('status', 'pending');
        
        if (!approvalsError && vendorApprovalsData) {
          // Map to VendorApprovalType
          const mappedVendorApprovals: VendorApprovalType[] = vendorApprovalsData.map((approval: any) => ({
            id: approval.id || '',
            vendor_id: approval.vendor_id || '',
            status: approval.status || 'pending',
            admin_id: approval.admin_id || null,
            notes: approval.notes || null,
            created_at: approval.created_at || new Date().toISOString(),
            updated_at: approval.updated_at || new Date().toISOString(),
            vendor: approval.vendor ? {
              id: approval.vendor.id || '',
              email: approval.vendor.email || '',
              first_name: approval.vendor.first_name || '',
              last_name: approval.vendor.last_name || ''
            } : undefined
          }));
          
          setVendorApprovals(mappedVendorApprovals);
        } else {
          setVendorApprovals([]);
        }
      } catch (error) {
        console.error("Error fetching vendor approvals:", error);
        setVendorApprovals([]);
      }

      // Try to fetch support tickets
      try {
        const { data: supportTicketsData, error: ticketsError } = await supabase
          .from('support_tickets')
          .select('*, user:profiles(*)')
          .in('status', ['open', 'in_progress']);
        
        if (!ticketsError && supportTicketsData) {
          // Map to SupportTicketType
          const mappedSupportTickets: SupportTicketType[] = supportTicketsData.map((ticket: any) => ({
            id: ticket.id || '',
            user_id: ticket.user_id || '',
            subject: ticket.subject || '',
            description: ticket.description || '',
            status: ticket.status || 'open',
            created_at: ticket.created_at || new Date().toISOString(),
            updated_at: ticket.updated_at || new Date().toISOString(),
            user: ticket.user ? {
              id: ticket.user.id || '',
              email: ticket.user.email || '',
              first_name: ticket.user.first_name || '',
              last_name: ticket.user.last_name || ''
            } : undefined
          }));
          
          setSupportTickets(mappedSupportTickets);
        } else {
          setSupportTickets([]);
        }
      } catch (error) {
        console.error("Error fetching support tickets:", error);
        setSupportTickets([]);
      }

      // Get user counts
      try {
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
      } catch (error) {
        console.error("Error fetching user counts:", error);
      }

      // Get order counts
      try {
        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
        
        setOrderCount(orderCount || 0);
      } catch (error) {
        console.error("Error fetching order count:", error);
      }
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
      const { data: userData } = await supabase.auth.getUser();
      const adminId = userData?.user?.id || null;
      
      const { error } = await supabase
        .from('vendor_approvals')
        .update({ 
          status: 'approved',
          admin_id: adminId,
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
      const { data: userData } = await supabase.auth.getUser();
      const adminId = userData?.user?.id || null;
      
      const { error } = await supabase
        .from('vendor_approvals')
        .update({ 
          status: 'rejected',
          admin_id: adminId,
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
                        onClick={() => approval.vendor_id && approveVendor(approval.vendor_id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => approval.vendor_id && rejectVendor(approval.vendor_id)}
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
                        <span className="h-2 w-2 bg-amber-500 rounded-full mr-2"></span>
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
