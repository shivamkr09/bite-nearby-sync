
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AnalyticsDataType, VendorApprovalType, SupportTicketType } from "@/types/models";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataType>({
    id: "mock-analytics",
    date: new Date().toISOString(),
    total_orders: 0,
    total_revenue: 0,
    new_users: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const [pendingVendors, setPendingVendors] = useState<VendorApprovalType[]>([]);
  const [openTickets, setOpenTickets] = useState<SupportTicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Mock data for the dashboard
  const chartData = [
    { name: "Jan", orders: 400, revenue: 2400 },
    { name: "Feb", orders: 300, revenue: 1398 },
    { name: "Mar", orders: 200, revenue: 9800 },
    { name: "Apr", orders: 278, revenue: 3908 },
    { name: "May", orders: 189, revenue: 4800 },
    { name: "Jun", orders: 239, revenue: 3800 },
    { name: "Jul", orders: 349, revenue: 4300 },
  ];

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      // Mock fetch calls

      // Set mock analytics data
      setAnalyticsData({
        id: "mock-analytics",
        date: new Date().toISOString(),
        total_orders: 235,
        total_revenue: 4850.75,
        new_users: 48,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      // Set mock pending vendors
      setPendingVendors([
        {
          id: "mock-vendor-1",
          vendor_id: "vendor-id-1",
          status: "pending",
          admin_id: null,
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          vendor: {
            id: "vendor-id-1",
            email: "vendor1@example.com",
            first_name: "John",
            last_name: "Doe"
          }
        },
        {
          id: "mock-vendor-2",
          vendor_id: "vendor-id-2",
          status: "pending",
          admin_id: null,
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          vendor: {
            id: "vendor-id-2",
            email: "vendor2@example.com",
            first_name: "Jane",
            last_name: "Smith"
          }
        }
      ]);
      
      // Set mock support tickets
      setOpenTickets([
        {
          id: "mock-ticket-1",
          user_id: "user-id-1",
          subject: "App crashes on startup",
          description: "When I open the app on my iPhone 12, it crashes immediately.",
          status: "open",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: "user-id-1",
            email: "user1@example.com",
            first_name: "Alex",
            last_name: "Johnson"
          }
        },
        {
          id: "mock-ticket-2",
          user_id: "user-id-2",
          subject: "Cannot update profile picture",
          description: "I tried updating my profile picture but keep getting an error.",
          status: "in_progress",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: "user-id-2",
            email: "user2@example.com",
            first_name: "Michael",
            last_name: "Brown"
          }
        }
      ]);
      
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.total_orders}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analyticsData.total_revenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">New Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.new_users}</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Vendor Approvals */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Vendor Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingVendors.length > 0 ? (
                  <div className="space-y-4">
                    {pendingVendors.map(vendor => (
                      <div key={vendor.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{vendor.vendor.first_name} {vendor.vendor.last_name}</p>
                            <p className="text-sm text-muted-foreground">{vendor.vendor.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Applied {new Date(vendor.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm">Review</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No pending approvals</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Support Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Open Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {openTickets.length > 0 ? (
                  <div className="space-y-4">
                    {openTickets.map(ticket => (
                      <div key={ticket.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{ticket.subject}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                              {ticket.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-muted rounded-full">
                                {ticket.status === "open" ? "Open" : "In Progress"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                From: {ticket.user.email}
                              </span>
                            </div>
                          </div>
                          <Button size="sm">Handle</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No open tickets</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
