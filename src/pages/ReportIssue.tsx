import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Shield, 
  Mail, 
  User, 
  FileText, 
  Clock,
  Phone,
  Send,
  CheckCircle,
  Info
} from "lucide-react";

const ReportIssue = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [issueType, setIssueType] = useState("food_safety");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Persist to Supabase (complaints table) when available
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      toast({
        title: "Complaint submitted successfully",
        description: "We've received your complaint and will respond within 48 hours.",
      });
      setName("");
      setEmail("");
      setOrderId("");
      setRestaurant("");
      setIssueType("food_safety");
      setDescription("");
    } catch (e) {
      toast({ 
        variant: "destructive", 
        title: "Submission failed", 
        description: "Please try again later." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const issueTypes = [
    { value: "food_safety", label: "Food safety/hygiene", icon: Shield },
    { value: "quality", label: "Food quality", icon: AlertTriangle },
    { value: "allergen", label: "Allergen disclosure", icon: Info },
    { value: "overcharge", label: "Overcharging/billing", icon: FileText },
    { value: "delivery", label: "Delivery/service", icon: Clock },
    { value: "other", label: "Other", icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/30 dark:from-gray-900 dark:to-red-900/10 relative">
      {/* Modern Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-orange-600 to-pink-600 p-8 mb-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <motion.h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Report Food Safety or Order Issue
              </motion.h1>
              <motion.p 
                className="text-red-100 text-sm sm:text-base max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Your safety and satisfaction are our top priorities. Report any concerns and we'll investigate promptly and thoroughly.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <Clock className="h-5 w-5 mx-auto mb-1" />
                <p className="text-xs">Response within</p>
                <p className="text-sm font-semibold">48 hours</p>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-400/20 to-transparent rounded-full translate-y-24 -translate-x-24" />
      </motion.div>

      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Grievance Form</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center text-sm font-medium">
                        <User className="h-4 w-4 mr-2" />
                        Full Name
                      </Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter your full name"
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center text-sm font-medium">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Address
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="your.email@example.com"
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order" className="flex items-center text-sm font-medium">
                        <FileText className="h-4 w-4 mr-2" />
                        Order ID <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <Input 
                        id="order" 
                        value={orderId} 
                        onChange={(e) => setOrderId(e.target.value)} 
                        placeholder="e.g., ORD-123456"
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant" className="flex items-center text-sm font-medium">
                        <Shield className="h-4 w-4 mr-2" />
                        Restaurant Name
                      </Label>
                      <Input 
                        id="restaurant" 
                        value={restaurant} 
                        onChange={(e) => setRestaurant(e.target.value)} 
                        placeholder="Name of the restaurant"
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm"
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue" className="flex items-center text-sm font-medium">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Issue Type
                    </Label>
                    <Select value={issueType} onValueChange={setIssueType}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        {issueTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center">
                                <Icon className="h-4 w-4 mr-2" />
                                {type.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc" className="flex items-center text-sm font-medium">
                      <FileText className="h-4 w-4 mr-2" />
                      Detailed Description
                    </Label>
                    <Textarea 
                      id="desc" 
                      rows={6} 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="Please provide a detailed description of the issue, including date, time, and any relevant details..."
                      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm resize-none"
                      required 
                    />
                    <p className="text-xs text-muted-foreground flex items-start space-x-2">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>If this is a food safety concern, please describe the issue and date/time. You can attach photos when we follow up by email.</span>
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <motion.div className="flex items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Clock className="h-4 w-4" />
                          </motion.div>
                          Submitting...
                        </motion.div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Complaint
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Response Time */}
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Response Timeline</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Acknowledgment: <strong>Within 48 hours</strong></span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Investigation: <strong>Within 7 days</strong></span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Resolution: <strong>Within 30 days</strong></span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Emergency Contact</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">For urgent food safety issues:</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> safety@example.com</p>
                  <p><strong>Phone:</strong> +91-XXXX-XXXXXX</p>
                  <p><strong>Hours:</strong> 24/7 for emergencies</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <Info className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Additional Resources</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  For serious food safety concerns, you may also complain directly to your State Food Safety Commissioner or via FSSAI channels. We will cooperate with authorities as required.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
