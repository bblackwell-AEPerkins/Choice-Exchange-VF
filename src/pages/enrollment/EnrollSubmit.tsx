import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEnrollmentStore } from "@/hooks/useEnrollmentStore";
import { cardPaymentSchema, bankPaymentSchema, formatZodErrors, formatCardNumber, formatExpirationDate } from "@/lib/validations/enrollment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, Building2, CheckCircle2, Loader2, PartyPopper, Download, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanDetails {
  plan_name: string;
  carrier_name: string;
  monthly_premium: number;
}

// Voluntary benefit summary data (mirrors EnrollPlans definitions)
const VOLUNTARY_PLAN_LOOKUP: Record<string, { name: string; carrier: string; category: string; monthlyPremium: number }> = {
  "dental-basic": { name: "Dental Basic", carrier: "Choice Exchange", category: "Dental", monthlyPremium: 25 },
  "dental-standard": { name: "Dental Plus", carrier: "Choice Exchange", category: "Dental", monthlyPremium: 45 },
  "dental-premium": { name: "Dental Premium", carrier: "Choice Exchange", category: "Dental", monthlyPremium: 75 },
  "delta-dental-basic": { name: "Delta Care Basic", carrier: "Delta Dental", category: "Dental", monthlyPremium: 28 },
  "delta-dental-standard": { name: "Delta PPO Plus", carrier: "Delta Dental", category: "Dental", monthlyPremium: 52 },
  "delta-dental-premium": { name: "Delta Premier", carrier: "Delta Dental", category: "Dental", monthlyPremium: 82 },
  "metlife-dental-basic": { name: "MetLife Dental Essential", carrier: "MetLife", category: "Dental", monthlyPremium: 22 },
  "metlife-dental-standard": { name: "MetLife Dental Preferred", carrier: "MetLife", category: "Dental", monthlyPremium: 48 },
  "metlife-dental-premium": { name: "MetLife Dental Elite", carrier: "MetLife", category: "Dental", monthlyPremium: 78 },
  "vision-basic": { name: "Vision Basic", carrier: "Choice Exchange", category: "Vision", monthlyPremium: 10 },
  "vision-standard": { name: "Vision Plus", carrier: "Choice Exchange", category: "Vision", monthlyPremium: 15 },
  "vision-premium": { name: "Vision Premium", carrier: "Choice Exchange", category: "Vision", monthlyPremium: 25 },
  "vsp-vision-basic": { name: "VSP Basic", carrier: "VSP", category: "Vision", monthlyPremium: 12 },
  "vsp-vision-standard": { name: "VSP Choice", carrier: "VSP", category: "Vision", monthlyPremium: 18 },
  "vsp-vision-premium": { name: "VSP Premier", carrier: "VSP", category: "Vision", monthlyPremium: 28 },
  "eyemed-vision-basic": { name: "EyeMed Access", carrier: "EyeMed", category: "Vision", monthlyPremium: 9 },
  "eyemed-vision-standard": { name: "EyeMed Select", carrier: "EyeMed", category: "Vision", monthlyPremium: 16 },
  "eyemed-vision-premium": { name: "EyeMed Complete", carrier: "EyeMed", category: "Vision", monthlyPremium: 26 },
  "life-basic": { name: "Term Life Basic", carrier: "Choice Exchange", category: "Life Insurance", monthlyPremium: 15 },
  "life-standard": { name: "Term Life Plus", carrier: "Choice Exchange", category: "Life Insurance", monthlyPremium: 25 },
  "life-premium": { name: "Term Life Premium", carrier: "Choice Exchange", category: "Life Insurance", monthlyPremium: 45 },
  "metlife-life-basic": { name: "MetLife Term Essential", carrier: "MetLife", category: "Life Insurance", monthlyPremium: 14 },
  "metlife-life-standard": { name: "MetLife Term Plus", carrier: "MetLife", category: "Life Insurance", monthlyPremium: 28 },
  "metlife-life-premium": { name: "MetLife Term Premier", carrier: "MetLife", category: "Life Insurance", monthlyPremium: 52 },
  "prudential-life-basic": { name: "Prudential Simple Term", carrier: "Prudential", category: "Life Insurance", monthlyPremium: 16 },
  "prudential-life-standard": { name: "Prudential Term Flex", carrier: "Prudential", category: "Life Insurance", monthlyPremium: 30 },
  "prudential-life-premium": { name: "Prudential Term Max", carrier: "Prudential", category: "Life Insurance", monthlyPremium: 55 },
  "disability-basic": { name: "STD Basic", carrier: "Choice Exchange", category: "Disability", monthlyPremium: 20 },
  "disability-standard": { name: "STD Plus", carrier: "Choice Exchange", category: "Disability", monthlyPremium: 35 },
  "disability-premium": { name: "STD Premium", carrier: "Choice Exchange", category: "Disability", monthlyPremium: 55 },
  "unum-disability-basic": { name: "Unum STD Core", carrier: "Unum", category: "Disability", monthlyPremium: 22 },
  "unum-disability-standard": { name: "Unum STD Plus", carrier: "Unum", category: "Disability", monthlyPremium: 38 },
  "unum-disability-premium": { name: "Unum STD Premier", carrier: "Unum", category: "Disability", monthlyPremium: 60 },
  "lincoln-disability-basic": { name: "Lincoln STD Essential", carrier: "Lincoln Financial", category: "Disability", monthlyPremium: 18 },
  "lincoln-disability-standard": { name: "Lincoln STD Select", carrier: "Lincoln Financial", category: "Disability", monthlyPremium: 32 },
  "lincoln-disability-premium": { name: "Lincoln STD Complete", carrier: "Lincoln Financial", category: "Disability", monthlyPremium: 50 },
};

interface PaymentForm {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  nameOnCard: string;
  accountHolderName: string;
  routingNumber: string;
  accountNumber: string;
}

export default function EnrollSubmit() {
  const navigate = useNavigate();
  const { 
    plan, 
    account, 
    setStep, 
    resetEnrollment, 
    submitEnrollment,
    isLoading,
    canAccessStep,
    saveToDatabase
  } = useEnrollmentStore();
  
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    nameOnCard: `${account.firstName} ${account.lastName}`,
    accountHolderName: `${account.firstName} ${account.lastName}`,
    routingNumber: "",
    accountNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const submitAttemptRef = useRef(false);

  // Step access protection
  useEffect(() => {
    if (!isLoading && !canAccessStep("submit")) {
      navigate("/enroll");
    }
  }, [isLoading, canAccessStep, navigate]);

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

  const validatePayment = (): boolean => {
    if (paymentMethod === "card") {
      const result = cardPaymentSchema.safeParse({
        cardNumber: paymentForm.cardNumber,
        expirationDate: paymentForm.expirationDate,
        cvv: paymentForm.cvv,
        nameOnCard: paymentForm.nameOnCard,
      });

      if (!result.success) {
        setErrors(formatZodErrors(result.error));
        return false;
      }
    } else {
      const result = bankPaymentSchema.safeParse({
        accountHolderName: paymentForm.accountHolderName,
        routingNumber: paymentForm.routingNumber,
        accountNumber: paymentForm.accountNumber,
      });

      if (!result.success) {
        setErrors(formatZodErrors(result.error));
        return false;
      }
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    // Prevent double submission
    if (submitAttemptRef.current || isSubmitting) {
      return;
    }

    if (!validatePayment()) {
      return;
    }

    submitAttemptRef.current = true;
    setIsSubmitting(true);
    
    try {
      const result = await submitEnrollment();
      
      if (result.success && result.confirmationNumber) {
        setConfirmationNumber(result.confirmationNumber);
        setStep("complete");
        setIsComplete(true);
        toast.success("Enrollment submitted successfully!");
      } else {
        toast.error(result.error || "Failed to submit enrollment. Please try again.");
        submitAttemptRef.current = false;
      }
    } catch (error) {
      toast.error("Failed to submit enrollment. Please try again.");
      submitAttemptRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    resetEnrollment();
    navigate("/dashboard");
  };

  const updatePaymentField = (field: keyof PaymentForm, value: string) => {
    let formattedValue = value;
    
    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (field === "expirationDate") {
      formattedValue = formatExpirationDate(value);
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    } else if (field === "routingNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 9);
    } else if (field === "accountNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 17);
    }
    
    setPaymentForm(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (isLoading) {
    return (
      <EnrollmentLayout
        currentStep={8}
        totalSteps={8}
        title="Payment & Submit"
        description="Loading..."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </EnrollmentLayout>
    );
  }

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
      onSave={saveToDatabase}
    >
      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {planDetails ? (
            <div className="space-y-3">
              {/* Medical plan */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{planDetails.plan_name}</p>
                  <p className="text-sm text-muted-foreground">{planDetails.carrier_name} • ICHRA Medical</p>
                </div>
                <p className="font-semibold">${planDetails.monthly_premium.toFixed(2)}</p>
              </div>

              {/* Voluntary selections */}
              {plan.voluntarySelections && Object.entries(plan.voluntarySelections).map(([categoryId, planId]) => {
                if (!planId) return null;
                const volPlan = VOLUNTARY_PLAN_LOOKUP[planId];
                if (!volPlan) return null;
                return (
                  <div key={categoryId} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{volPlan.name}</p>
                      <p className="text-sm text-muted-foreground">{volPlan.carrier} • {volPlan.category}</p>
                    </div>
                    <p className="font-semibold">${volPlan.monthlyPremium.toFixed(2)}</p>
                  </div>
                );
              })}
              
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
                    ${(() => {
                      const volTotal = plan.voluntarySelections
                        ? Object.values(plan.voluntarySelections).reduce((sum, pid) => {
                            if (!pid) return sum;
                            const v = VOLUNTARY_PLAN_LOOKUP[pid];
                            return v ? sum + v.monthlyPremium : sum;
                          }, 0)
                        : 0;
                      return (planDetails.monthly_premium + volTotal - plan.employerContribution).toFixed(2);
                    })()}
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
            onValueChange={(value) => {
              setPaymentMethod(value as "card" | "bank");
              setErrors({});
            }}
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

          {Object.keys(errors).length > 0 && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">Please correct the errors below.</p>
            </div>
          )}

          {/* Card Details Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input 
                  placeholder="1234 5678 9012 3456" 
                  value={paymentForm.cardNumber}
                  onChange={(e) => updatePaymentField("cardNumber", e.target.value)}
                  className={errors.cardNumber ? "border-destructive" : ""}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-destructive">{errors.cardNumber}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiration Date</Label>
                  <Input 
                    placeholder="MM/YY" 
                    value={paymentForm.expirationDate}
                    onChange={(e) => updatePaymentField("expirationDate", e.target.value)}
                    className={errors.expirationDate ? "border-destructive" : ""}
                  />
                  {errors.expirationDate && (
                    <p className="text-sm text-destructive">{errors.expirationDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input 
                    placeholder="123" 
                    type="password"
                    value={paymentForm.cvv}
                    onChange={(e) => updatePaymentField("cvv", e.target.value)}
                    className={errors.cvv ? "border-destructive" : ""}
                  />
                  {errors.cvv && (
                    <p className="text-sm text-destructive">{errors.cvv}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name on Card</Label>
                <Input 
                  placeholder="John Smith" 
                  value={paymentForm.nameOnCard}
                  onChange={(e) => updatePaymentField("nameOnCard", e.target.value)}
                  className={errors.nameOnCard ? "border-destructive" : ""}
                />
                {errors.nameOnCard && (
                  <p className="text-sm text-destructive">{errors.nameOnCard}</p>
                )}
              </div>
            </div>
          )}

          {/* Bank Details Form */}
          {paymentMethod === "bank" && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label>Account Holder Name</Label>
                <Input 
                  placeholder="John Smith" 
                  value={paymentForm.accountHolderName}
                  onChange={(e) => updatePaymentField("accountHolderName", e.target.value)}
                  className={errors.accountHolderName ? "border-destructive" : ""}
                />
                {errors.accountHolderName && (
                  <p className="text-sm text-destructive">{errors.accountHolderName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Routing Number</Label>
                <Input 
                  placeholder="123456789" 
                  value={paymentForm.routingNumber}
                  onChange={(e) => updatePaymentField("routingNumber", e.target.value)}
                  className={errors.routingNumber ? "border-destructive" : ""}
                />
                {errors.routingNumber && (
                  <p className="text-sm text-destructive">{errors.routingNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input 
                  placeholder="1234567890" 
                  type="password"
                  value={paymentForm.accountNumber}
                  onChange={(e) => updatePaymentField("accountNumber", e.target.value)}
                  className={errors.accountNumber ? "border-destructive" : ""}
                />
                {errors.accountNumber && (
                  <p className="text-sm text-destructive">{errors.accountNumber}</p>
                )}
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
