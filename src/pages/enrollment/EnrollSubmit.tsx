import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEnrollment } from "@/hooks/useEnrollment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, Building2, CheckCircle2, Loader2, PartyPopper, Download, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanDetails {
  plan_name: string;
  carrier_name: string;
  monthly_premium: number;
}

export default function EnrollSubmit() {
  const navigate = useNavigate();
  const { plan, account, setStep, resetEnrollment } = useEnrollment();
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!plan.medicalPlanId) return;
      
      const { data } = await supabase
        .from("ichra_plans")
        .select("plan_name, carrier_name, monthly_premium")
        .eq("id", plan.medicalPlanId)
        .single();
      
      if (data) {
        setPlanDetails(data);
      }
    };
    
    fetchPlanDetails();
  }, [plan.medicalPlanId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate payment processing and enrollment submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate confirmation number
      const confirmation = `CE${Date.now().toString(36).toUpperCase()}`;
      setConfirmationNumber(confirmation);
      
      // Mark enrollment complete
      setStep("complete");
      setIsComplete(true);
      
      toast.success("Enrollment submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit enrollment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    resetEnrollment();
    navigate("/dashboard");
  };

  // Show completion screen
  if (isComplete) {
    return (
      <EnrollmentLayout
        currentStep={8}
        totalSteps={8}
        title="Enrollment Complete!"
        description="Your enrollment has been submitted successfully."
        showProgress={false}
      >
        <Card className="border-accent bg-accent/5">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="h-10 w-10 text-accent" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Congratulations, {account.firstName}!</h2>
            <p className="text-muted-foreground mb-6">
              Your health insurance enrollment has been successfully submitted.
            </p>
            
            <div className="p-4 rounded-lg bg-card border border-border mb-6">
              <p className="text-sm text-muted-foreground mb-1">Confirmation Number</p>
              <p className="text-2xl font-mono font-bold text-primary">{confirmationNumber}</p>
            </div>

            {planDetails && (
              <div className="p-4 rounded-lg bg-muted/50 mb-6 text-left">
                <p className="text-sm text-muted-foreground mb-2">Enrolled Plan</p>
                <p className="font-semibold">{planDetails.plan_name}</p>
                <p className="text-sm text-muted-foreground">{planDetails.carrier_name}</p>
                <p className="text-lg font-bold text-primary mt-2">
                  ${planDetails.monthly_premium.toFixed(2)}/month
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">Confirmation Email</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email at {account.email} within 24 hours.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">ID Cards</p>
                <p className="text-sm text-muted-foreground">
                  Your insurance ID cards will be mailed within 7-10 business days.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Coverage Begins</p>
                <p className="text-sm text-muted-foreground">
                  Your coverage will be effective on your selected start date.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Confirmation
          </Button>
          <Button onClick={handleGoToDashboard} className="flex-1">
            Go to Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </EnrollmentLayout>
    );
  }

  return (
    <EnrollmentLayout
      currentStep={8}
      totalSteps={8}
      title="Payment & Submit"
      description="Complete your enrollment by setting up your payment method."
    >
      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {planDetails ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{planDetails.plan_name}</p>
                  <p className="text-sm text-muted-foreground">{planDetails.carrier_name}</p>
                </div>
                <p className="font-semibold">${planDetails.monthly_premium.toFixed(2)}</p>
              </div>
              
              {plan.employerContribution > 0 && (
                <div className="flex justify-between items-center text-accent">
                  <span>Employer ICHRA Contribution</span>
                  <span>-${plan.employerContribution.toFixed(2)}</span>
                </div>
              )}
              
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Your Monthly Premium</span>
                  <span className="text-2xl font-bold text-primary">
                    ${(planDetails.monthly_premium - plan.employerContribution).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Loading plan details...</p>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
          <CardDescription>
            Your first payment will be processed when your coverage begins.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as "card" | "bank")}
            className="space-y-3"
          >
            <label
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                paymentMethod === "card"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="card" />
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <span className="font-medium">Credit or Debit Card</span>
                <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
              </div>
            </label>
            
            <label
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                paymentMethod === "bank"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="bank" />
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <span className="font-medium">Bank Account (ACH)</span>
                <p className="text-sm text-muted-foreground">Direct debit from checking or savings</p>
              </div>
            </label>
          </RadioGroup>

          {/* Card Details Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiration Date</Label>
                  <Input placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input placeholder="123" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name on Card</Label>
                <Input placeholder="John Smith" defaultValue={`${account.firstName} ${account.lastName}`} />
              </div>
            </div>
          )}

          {/* Bank Details Form */}
          {paymentMethod === "bank" && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label>Account Holder Name</Label>
                <Input placeholder="John Smith" defaultValue={`${account.firstName} ${account.lastName}`} />
              </div>
              <div className="space-y-2">
                <Label>Routing Number</Label>
                <Input placeholder="123456789" />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input placeholder="1234567890" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="space-y-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-12 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Submitting Enrollment...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Submit Enrollment
            </>
          )}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          By clicking "Submit Enrollment", you authorize the first premium payment and agree to
          the terms and conditions of your selected health plan.
        </p>
      </div>
    </EnrollmentLayout>
  );
}
