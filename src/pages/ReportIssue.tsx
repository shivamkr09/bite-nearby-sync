import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

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
      toast({
        title: "Complaint submitted",
        description: "We’ve received your complaint and will respond within 48 hours.",
      });
      setName("");
      setEmail("");
      setOrderId("");
      setRestaurant("");
      setIssueType("food_safety");
      setDescription("");
    } catch (e) {
      toast({ variant: "destructive", title: "Submission failed", description: "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Report a Food Safety or Order Issue</h1>
      <Card>
        <CardHeader>
          <CardTitle>Grievance Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Order ID (optional)</Label>
                <Input id="order" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant">Restaurant Name</Label>
                <Input id="restaurant" value={restaurant} onChange={(e) => setRestaurant(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue">Issue Type</Label>
              <select
                id="issue"
                className="w-full border rounded-md h-9 px-3 bg-background"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option value="food_safety">Food safety/hygiene</option>
                <option value="quality">Food quality</option>
                <option value="allergen">Allergen disclosure</option>
                <option value="overcharge">Overcharging/billing</option>
                <option value="delivery">Delivery/service</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required />
              <p className="text-xs text-muted-foreground">If this is a food safety concern, please describe the issue and date/time. Attach photos when we follow up by email.</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Complaint"}</Button>
            </div>
          </form>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>
              For serious food safety concerns, you may also complain directly to your State Food Safety Commissioner or via FSSAI channels. We will cooperate with authorities as required.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportIssue;
