
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VendorApprovalType } from "@/types/models";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  UserCheck, 
  AlertCircle,
  Mail,
  Calendar,
  FileText,
  Filter
} from "lucide-react";

const VendorApprovals = () => {
  const [vendors, setVendors] = useState<VendorApprovalType[]>([
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
      status: 'approved',
      admin_id: 'admin1',
      notes: 'All documents verified',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      vendor: {
        id: 'v2',
        email: 'vendor2@example.com',
        first_name: 'Jane',
        last_name: 'Smith'
      }
    },
    {
      id: '3',
      vendor_id: 'v3',
      status: 'rejected',
      admin_id: 'admin1',
      notes: 'Incomplete documentation',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      vendor: {
        id: 'v3',
        email: 'vendor3@example.com',
        first_name: 'Mike',
        last_name: 'Johnson'
      }
    }
  ]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [toast]);

  const handleNoteChange = (vendorId: string, note: string) => {
    setNotes({ ...notes, [vendorId]: note });
  };

  const approveVendor = async (vendorId: string) => {
    if (!user) return;
    
    try {
      const updatedVendors: VendorApprovalType[] = vendors.map(vendor => 
        vendor.vendor_id === vendorId ? {
          ...vendor,
          status: 'approved',
          admin_id: user.id,
          notes: notes[vendorId] || null,
          updated_at: new Date().toISOString()
        } : vendor
      );
      
      setVendors(updatedVendors);
      
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
    if (!user) return;
    
    try {
      const updatedVendors: VendorApprovalType[] = vendors.map(vendor => 
        vendor.vendor_id === vendorId ? {
          ...vendor,
          status: 'rejected',
          admin_id: user.id,
          notes: notes[vendorId] || null,
          updated_at: new Date().toISOString()
        } : vendor
      );
      
      setVendors(updatedVendors);
      
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

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = searchQuery === "" || 
      vendor.vendor?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.vendor?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.vendor?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" || vendor.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getStatusCounts = () => {
    return {
      all: vendors.length,
      pending: vendors.filter(v => v.status === 'pending').length,
      approved: vendors.filter(v => v.status === 'approved').length,
      rejected: vendors.filter(v => v.status === 'rejected').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-900/10 relative">
      {/* Modern Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 mb-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <motion.h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Vendor Approvals
              </motion.h1>
              <motion.p 
                className="text-purple-100 text-sm sm:text-base max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Review and manage vendor applications. Approve qualified vendors to expand your platform's restaurant network.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                <Filter className="h-5 w-5 mr-2" />
                Export Data
              </Button>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 shadow-lg">
                <UserCheck className="h-5 w-5 mr-2" />
                Bulk Actions
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search vendors by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg text-sm sm:text-base"
          />
        </div>
      </motion.div>

      {/* Status Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg mb-8">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">All</span>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {statusCounts.all}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Pending</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  {statusCounts.pending}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Approved</span>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {statusCounts.approved}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Rejected</span>
                <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {statusCounts.rejected}
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <Clock className="h-8 w-8 text-purple-600" />
                </motion.div>
                <p className="mt-4 text-muted-foreground">Loading vendor applications...</p>
              </div>
            ) : filteredVendors.length > 0 ? (
              <motion.div 
                className="space-y-6" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5 }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredVendors.map((vendor, idx) => (
                    <motion.div 
                      key={vendor.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: idx * 0.05,
                        layout: { duration: 0.3 }
                      }}
                      whileHover={{ scale: 1.01 }}
                      className="group"
                    >
                      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <CardHeader className="pb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                {vendor.vendor?.first_name?.[0]}{vendor.vendor?.last_name?.[0]}
                              </div>
                              <div>
                                <CardTitle className="text-lg font-semibold">
                                  {vendor.vendor?.first_name} {vendor.vendor?.last_name}
                                </CardTitle>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Mail className="h-4 w-4 mr-1" />
                                  {vendor.vendor?.email}
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant={vendor.status === 'pending' ? "secondary" : vendor.status === 'approved' ? "default" : "destructive"}
                              className={`${
                                vendor.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                  : vendor.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              } font-medium px-3 py-1`}
                            >
                              {vendor.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {vendor.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {vendor.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                              {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-muted-foreground">Applied on:</span>
                                <span className="ml-2 font-medium">
                                  {new Date(vendor.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {vendor.status !== 'pending' && (
                                <div className="flex items-center text-sm">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-muted-foreground">Updated on:</span>
                                  <span className="ml-2 font-medium">
                                    {new Date(vendor.updated_at).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-4">
                              {vendor.status === 'pending' ? (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`notes-${vendor.id}`} className="flex items-center text-sm font-medium">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Admin Notes
                                    </Label>
                                    <Textarea
                                      id={`notes-${vendor.id}`}
                                      placeholder="Add notes about this vendor application..."
                                      value={notes[vendor.vendor_id] || ''}
                                      onChange={(e) => handleNoteChange(vendor.vendor_id, e.target.value)}
                                      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm resize-none"
                                      rows={3}
                                    />
                                  </div>
                                  
                                  <div className="flex gap-3">
                                    <Button 
                                      onClick={() => approveVendor(vendor.vendor_id)}
                                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                                      size="lg"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button 
                                      onClick={() => rejectVendor(vendor.vendor_id)}
                                      variant="outline"
                                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                                      size="lg"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                vendor.notes && (
                                  <div className="space-y-2">
                                    <Label className="flex items-center text-sm font-medium">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Admin Notes
                                    </Label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                                      <p className="text-sm text-muted-foreground">{vendor.notes}</p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="py-12">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">No vendor applications found</h3>
                        <p className="text-muted-foreground">
                          {searchQuery 
                            ? `No vendors match your search for "${searchQuery}"`
                            : activeTab === "all" 
                              ? "No vendor applications have been submitted yet"
                              : `No ${activeTab} vendor applications found`
                          }
                        </p>
                      </div>
                      {searchQuery && (
                        <Button variant="outline" onClick={() => setSearchQuery("")}>
                          Clear Search
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default VendorApprovals;
