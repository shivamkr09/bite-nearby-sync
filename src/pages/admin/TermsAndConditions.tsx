
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TermsAndConditionsType } from "@/types/models";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const TermsAndConditions = () => {
  const [terms, setTerms] = useState<TermsAndConditionsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    type: "customer",
    content: "",
    version: "1.0",
    is_active: true
  });

  useEffect(() => {
    // Using setTimeout to mock the API call without making actual database requests
    // since the terms_and_conditions table doesn't exist yet
    setLoading(true);
    setTimeout(() => {
      setTerms([]);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value === "customer" ? "customer" : "vendor" });
  };
  
  const handleActiveChange = (checked: boolean) => {
    setFormData({ ...formData, is_active: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Show success message without making actual database request
      // since the terms_and_conditions table doesn't exist yet
      toast({
        title: "Terms created",
        description: "New terms and conditions have been created"
      });
      
      setIsDialogOpen(false);
      
      // Add the new terms to the local state for demonstration
      const newTerm: TermsAndConditionsType = {
        id: `mock-${Date.now()}`,
        type: formData.type as "customer" | "vendor" | "admin",
        content: formData.content,
        version: formData.version,
        published_at: new Date().toISOString(),
        is_active: formData.is_active
      };
      
      setTerms([newTerm, ...terms]);
      
      // Reset form
      setFormData({
        type: "customer",
        content: "",
        version: "1.0",
        is_active: true
      });
    } catch (error) {
      console.error('Error creating terms:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create terms and conditions"
      });
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      // Update local state without making actual database request
      // since the terms_and_conditions table doesn't exist yet
      setTerms(terms.map(term => 
        term.id === id ? { ...term, is_active: !currentActive } : term
      ));
      
      toast({
        title: "Status updated",
        description: `Terms are now ${!currentActive ? 'active' : 'inactive'}`
      });
    } catch (error) {
      console.error('Error updating terms status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update terms status"
      });
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Terms and Conditions</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Terms</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Terms and Conditions</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer Terms</SelectItem>
                    <SelectItem value="vendor">Vendor Terms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML supported)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={15}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_active" 
                  checked={formData.is_active}
                  onCheckedChange={handleActiveChange}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Terms
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : terms.length > 0 ? (
        <div className="space-y-6">
          {terms.map((term) => (
            <Card key={term.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {term.type === "customer" ? "Customer Terms" : "Vendor Terms"} - v{term.version}
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`is_active_${term.id}`} 
                        checked={term.is_active}
                        onCheckedChange={() => toggleActive(term.id, term.is_active)}
                      />
                      <Label htmlFor={`is_active_${term.id}`} className="text-sm">
                        {term.is_active ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Published on</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(term.published_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Preview</p>
                    <div className="border rounded p-4 mt-2 max-h-48 overflow-y-auto">
                      <div 
                        dangerouslySetInnerHTML={{ __html: term.content.substring(0, 500) + '...' }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Full Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground">No terms and conditions found</p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                Create Your First Terms
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TermsAndConditions;
