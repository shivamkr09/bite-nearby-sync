
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TermsAndConditionsType } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";

interface TermsAcceptanceDialogProps {
  userType: 'customer' | 'vendor';
  onAccepted: () => void;
}

const TermsAcceptanceDialog = ({ userType, onAccepted }: TermsAcceptanceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState<TermsAndConditionsType | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already accepted the terms
    const checkTermsAcceptance = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get the latest terms for this user type
        const { data: termsData, error: termsError } = await supabase
          .from('terms_and_conditions')
          .select('*')
          .eq('type', userType)
          .eq('is_active', true)
          .order('published_at', { ascending: false })
          .limit(1)
          .single();
        
        if (termsError || !termsData) {
          console.log('No terms found, user can proceed');
          onAccepted(); // If no terms exist yet, allow user to proceed
          return;
        }
        
        setTerms(termsData as TermsAndConditionsType);
        
        // Check if user already accepted these terms
        const { data: acceptanceData, error: acceptanceError } = await supabase
          .from('user_terms_acceptance')
          .select('*')
          .eq('user_id', user.id)
          .eq('terms_id', termsData.id)
          .single();
        
        if (acceptanceError || !acceptanceData) {
          // User hasn't accepted these terms yet, show dialog
          setOpen(true);
        } else {
          // User already accepted
          onAccepted();
        }
      } catch (error) {
        console.error('Error checking terms acceptance:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkTermsAcceptance();
  }, [user, userType, onAccepted]);

  const handleAccept = async () => {
    if (!user || !terms) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_terms_acceptance')
        .insert({
          user_id: user.id,
          terms_id: terms.id
        });
      
      if (error) throw error;
      
      toast({
        title: "Terms accepted",
        description: "You have successfully accepted the terms and conditions."
      });
      
      setOpen(false);
      onAccepted();
    } catch (error) {
      console.error('Error accepting terms:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept terms. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept our terms and conditions to continue.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            {terms?.content ? (
              <div dangerouslySetInnerHTML={{ __html: terms.content }} />
            ) : (
              <p>Loading terms...</p>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex items-start space-x-2 mt-4">
          <Checkbox id="terms" checked={accepted} onCheckedChange={(checked) => setAccepted(!!checked)} />
          <Label htmlFor="terms" className="text-sm">
            I have read and agree to the terms and conditions
          </Label>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAccept}
            disabled={!accepted || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Accept and Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAcceptanceDialog;
