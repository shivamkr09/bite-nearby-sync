
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VendorApprovalType } from "@/types/models";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
    }
  ]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
    
    // In a real app, we would fetch from Supabase here
    /* 
    const fetchVendorApprovals = async () => {
      try {
        const { data, error } = await supabase
          .from('vendor_approvals')
          .select(`*, vendor:profiles(id, email, first_name, last_name)`)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setVendors(data as VendorApprovalType[]);
      } catch (error) {
        console.error('Error fetching vendor approvals:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load vendor approvals"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendorApprovals();
    */
  }, [toast]);

  const handleNoteChange = (vendorId: string, note: string) => {
    setNotes({ ...notes, [vendorId]: note });
  };

  const approveVendor = async (vendorId: string) => {
    if (!user) return;
    
    try {
      // In a real application, this would update the database
      // For now, we'll just update the state
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
      // In a real application, this would update the database
      // For now, we'll just update the state
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

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Approvals</h1>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : vendors.length > 0 ? (
        <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {vendors.map((vendor, idx) => (
            <motion.div key={vendor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.04 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {vendor.vendor?.first_name} {vendor.vendor?.last_name}
                  </CardTitle>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      vendor.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : vendor.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{vendor.vendor?.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Applied on</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(vendor.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {vendor.status === 'pending' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor={`notes-${vendor.id}`}>Admin notes</Label>
                        <Textarea
                          id={`notes-${vendor.id}`}
                          placeholder="Add notes about this vendor"
                          value={notes[vendor.vendor_id] || ''}
                          onChange={(e) => handleNoteChange(vendor.vendor_id, e.target.value)}
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => approveVendor(vendor.vendor_id)}
                          className="flex-1"
                        >
                          Approve
                        </Button>
                        <Button 
                          onClick={() => rejectVendor(vendor.vendor_id)}
                          variant="destructive"
                          className="flex-1"
                        >
                          Reject
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {vendor.notes && (
                        <div>
                          <p className="text-sm font-medium">Admin notes</p>
                          <p className="text-sm text-muted-foreground">{vendor.notes}</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm font-medium">Updated on</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(vendor.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
      </Card>
      </motion.div>
          ))}
    </motion.div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground">No vendor applications found</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorApprovals;
