
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Eye, 
  Calendar, 
  Filter, 
  Download,
  Users,
  Store,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const TermsAndConditions = () => {
  const [terms, setTerms] = useState<TermsAndConditionsType[]>([
    {
      id: 'demo-1',
      type: 'customer',
      content: '<h2>Customer Terms and Conditions</h2><p>Welcome to our food delivery platform. By using our services, you agree to the following terms...</p><ol><li>Service Agreement: You agree to use our platform for legitimate food ordering purposes only.</li><li>Payment Terms: All payments must be made through our secure payment gateway.</li><li>Delivery Policy: We strive to deliver your food within the estimated time frame.</li><li>Cancellation Policy: Orders can be cancelled within 5 minutes of placement.</li></ol>',
      version: '2.1',
      published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true
    },
    {
      id: 'demo-2',
      type: 'vendor',
      content: '<h2>Vendor Terms and Conditions</h2><p>As a restaurant partner, you agree to maintain the highest standards...</p><ol><li>Food Safety: All food items must meet local health department standards.</li><li>Order Management: Orders must be prepared within the committed time.</li><li>Commission Structure: Platform commission will be deducted from each order.</li><li>Quality Standards: Maintain consistent quality and presentation.</li></ol>',
      version: '1.8',
      published_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true
    },
    {
      id: 'demo-3',
      type: 'customer',
      content: '<h2>Previous Customer Terms</h2><p>This is an older version of our customer terms...</p>',
      version: '2.0',
      published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: false
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    type: "customer",
    content: "",
    version: "1.0",
    is_active: true
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
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
      toast({
        title: "Terms created",
        description: "New terms and conditions have been created successfully"
      });
      
      setIsDialogOpen(false);
      
      const newTerm: TermsAndConditionsType = {
        id: `term-${Date.now()}`,
        type: formData.type as "customer" | "vendor" | "admin",
        content: formData.content,
        version: formData.version,
        published_at: new Date().toISOString(),
        is_active: formData.is_active
      };
      
      setTerms([newTerm, ...terms]);
      
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

  const filteredTerms = terms.filter(term => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return term.is_active;
    if (activeTab === "inactive") return !term.is_active;
    return term.type === activeTab;
  });

  const getTermsCounts = () => {
    return {
      all: terms.length,
      customer: terms.filter(t => t.type === 'customer').length,
      vendor: terms.filter(t => t.type === 'vendor').length,
      active: terms.filter(t => t.is_active).length,
      inactive: terms.filter(t => !t.is_active).length
    };
  };

  const termsCounts = getTermsCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 relative">
      {/* Modern Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 mb-8 text-white"
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
                Terms & Conditions
              </motion.h1>
              <motion.p 
                className="text-emerald-100 text-sm sm:text-base max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Manage legal documents and terms of service for customers and vendors. Create, edit, and maintain compliance across your platform.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                <Download className="h-5 w-5 mr-2" />
                Export All
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-50 shadow-lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Terms
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-xl">
                      <FileText className="h-6 w-6 mr-2" />
                      Create Terms and Conditions
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="type" className="flex items-center text-sm font-medium">
                          <Users className="h-4 w-4 mr-2" />
                          Target Audience
                        </Label>
                        <Select 
                          value={formData.type}
                          onValueChange={handleTypeChange}
                        >
                          <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                Customer Terms
                              </div>
                            </SelectItem>
                            <SelectItem value="vendor">
                              <div className="flex items-center">
                                <Store className="h-4 w-4 mr-2" />
                                Vendor Terms
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="version" className="flex items-center text-sm font-medium">
                          <Calendar className="h-4 w-4 mr-2" />
                          Version
                        </Label>
                        <Input
                          id="version"
                          name="version"
                          value={formData.version}
                          onChange={handleInputChange}
                          placeholder="e.g., 1.0, 2.1"
                          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content" className="flex items-center text-sm font-medium">
                        <FileText className="h-4 w-4 mr-2" />
                        Content (HTML supported)
                      </Label>
                      <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Enter the terms and conditions content. You can use HTML tags for formatting."
                        rows={15}
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm resize-none font-mono text-sm"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {formData.is_active ? (
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        )}
                        <div>
                          <Label htmlFor="is_active" className="font-medium">
                            Publish Immediately
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {formData.is_active 
                              ? "Terms will be active and visible to users" 
                              : "Terms will be saved as draft"
                            }
                          </p>
                        </div>
                      </div>
                      <Switch 
                        id="is_active" 
                        checked={formData.is_active}
                        onCheckedChange={handleActiveChange}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Terms
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg mb-8">
            <TabsTrigger value="all" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">All</span>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {termsCounts.all}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="customer" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Customer</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {termsCounts.customer}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="vendor" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Vendor</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  {termsCounts.vendor}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Active</span>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {termsCounts.active}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Inactive</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  {termsCounts.inactive}
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
                  <FileText className="h-8 w-8 text-emerald-600" />
                </motion.div>
                <p className="mt-4 text-muted-foreground">Loading terms and conditions...</p>
              </div>
            ) : filteredTerms.length > 0 ? (
              <motion.div 
                className="space-y-6" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5 }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredTerms.map((term, idx) => (
                    <motion.div 
                      key={term.id}
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
                              <div className={`p-3 rounded-lg ${
                                term.type === 'customer' 
                                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                              }`}>
                                {term.type === 'customer' ? (
                                  <Users className="h-6 w-6" />
                                ) : (
                                  <Store className="h-6 w-6" />
                                )}
                              </div>
                              <div>
                                <CardTitle className="text-lg font-semibold">
                                  {term.type === "customer" ? "Customer Terms" : "Vendor Terms"} - v{term.version}
                                </CardTitle>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Published {new Date(term.published_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge
                                variant={term.is_active ? "default" : "secondary"}
                                className={`${
                                  term.is_active
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                } font-medium px-3 py-1`}
                              >
                                {term.is_active ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                )}
                                {term.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleActive(term.id, term.is_active)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                {term.is_active ? (
                                  <ToggleRight className="h-4 w-4" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div>
                              <Label className="flex items-center text-sm font-medium mb-2">
                                <Eye className="h-4 w-4 mr-2" />
                                Content Preview
                              </Label>
                              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 max-h-32 overflow-y-auto">
                                <div 
                                  dangerouslySetInnerHTML={{ 
                                    __html: term.content.length > 300 
                                      ? term.content.substring(0, 300) + '...' 
                                      : term.content 
                                  }}
                                  className="text-sm prose prose-sm dark:prose-invert max-w-none"
                                />
                              </div>
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Eye className="h-4 w-4 mr-2" />
                                View Full
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">No terms found</h3>
                        <p className="text-muted-foreground">
                          {activeTab === "all" 
                            ? "No terms and conditions have been created yet"
                            : `No ${activeTab} terms found`
                          }
                        </p>
                      </div>
                      <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Terms
                      </Button>
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

export default TermsAndConditions;
