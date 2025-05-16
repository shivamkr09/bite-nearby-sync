
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalyticsDataType, SupportTicketType, VendorApprovalType } from "@/types/models";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataType>({
    id: '1',
    date: new Date().toISOString(),
    total_orders: 125,
    total_revenue: 2450.75,
    new_users: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [pendingVendors, setPendingVendors] = useState<VendorApprovalType[]>([
    {
      id: '1',
      vendor_id: 'v1',
      status: 'pending',
      admin_id: null,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      vendor: {
        id: 'v1',
        email: 'vendor1@example.com',
        first_name: 'John',
        last_name: 'Doe'
      }
    },
    {
      id: '2',
      vendor_id: 'v2',
      status: 'pending',
      admin_id: null,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      vendor: {
        id: 'v2',
        email: 'vendor2@example.com',
        first_name: 'Jane',
        last_name: 'Smith'
      }
    }
  ]);

  const [supportTickets, setSupportTickets] = useState<SupportTicketType[]>([
    {
      id: '1',
      user_id: 'u1',
      subject: 'Payment Issue',
      description: 'I was charged twice for my order',
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'u1',
        email: 'customer@example.com',
        first_name: 'Alice',
        last_name: 'Johnson'
      }
    },
    {
      id: '2',
      user_id: 'u2',
      subject: 'Account Verification',
      description: 'Cannot verify my account with phone number',
      status: 'in_progress',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'u2',
        email: 'customer2@example.com',
        first_name: 'Bob',
        last_name: 'Williams'
      }
    }
  ]);
  
  const [chartData, setChartData] = useState([
    {
      name: 'Jan',
      orders: 65,
      revenue: 1200,
    },
    {
      name: 'Feb',
      orders: 59,
      revenue: 980,
    },
    {
      name: 'Mar',
      orders: 80,
      revenue: 1600,
    },
    {
      name: 'Apr',
      orders: 81,
      revenue: 1700,
    },
    {
      name: 'May',
      orders: 56,
      revenue: 1000,
    },
  ]);

  const { toast } = useToast();
  
  useEffect(() => {
    // In a real implementation, we would fetch this data from Supabase
    // For now, we're using mock data
    
    // When the actual tables are created, this code would be:
    // fetchAnalyticsData();
    // fetchPendingVendors();
    // fetchSupportTickets();
  }, []);

  const handleApproveVendor = (vendorId: string) => {
    // Mock implementation
    setPendingVendors(prev => 
      prev.map(v => 
        v.vendor_id === vendorId ? { ...v, status: 'approved', updated_at: new Date().toISOString() } : v
      )
    );
    
    toast({
      title: "Vendor approved",
      description: "The vendor has been approved"
    });
  };
  
  const handleRejectVendor = (vendorId: string) => {
    // Mock implementation
    setPendingVendors(prev => 
      prev.map(v => 
        v.vendor_id === vendorId ? { ...v, status: 'rejected', updated_at: new Date().toISOString() } : v
      )
    );
    
    toast({
      title: "Vendor rejected",
      description: "The vendor has been rejected"
    });
  };
  
  const handleAssignTicket = (ticketId: string) => {
    // Mock implementation
    setSupportTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: 'in_progress', updated_at: new Date().toISOString() } : ticket
      )
    );
    
    toast({
      title: "Ticket assigned",
      description: "The ticket has been assigned to you"
    });
  };

  return (
    <div className="space-y-6 py-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.total_orders}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.new_users}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Vendor Approvals</CardTitle>
            <Button variant="outline" size="sm" onClick={() => {}}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVendors.filter(vendor => vendor.status === 'pending').length > 0 ? (
                pendingVendors.filter(vendor => vendor.status === 'pending').map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{vendor.vendor?.first_name} {vendor.vendor?.last_name}</p>
                      <p className="text-sm text-muted-foreground">{vendor.vendor?.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleApproveVendor(vendor.vendor_id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRejectVendor(vendor.vendor_id)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No pending approvals</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Support Tickets</CardTitle>
          <Button variant="outline" size="sm" onClick={() => {}}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportTickets.length > 0 ? (
              supportTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <Badge variant={ticket.status === 'open' ? "destructive" : ticket.status === 'in_progress' ? "default" : "outline"}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate max-w-md">{ticket.description}</p>
                    <p className="text-xs text-muted-foreground">
                      From: {ticket.user?.first_name} {ticket.user?.last_name} • {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    {ticket.status === 'open' && (
                      <Button size="sm" onClick={() => handleAssignTicket(ticket.id)}>
                        Assign
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No support tickets</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
