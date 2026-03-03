import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEnrollmentStore } from "@/hooks/useEnrollmentStore";
import { reviewSchema, formatZodErrors } from "@/lib/validations/enrollment";
import { supabase } from "@/integrations/supabase/client";
import { User, Users, FileText, CreditCard, Pencil, Shield, AlertCircle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PlanDetails {
  plan_name: string;
  carrier_name: string;
  monthly_premium: number;
  metal_tier: string;
}

export default function EnrollReview() {
  const navigate = useNavigate();
  const { 
    account, 
    about, 
    household, 
    coverage, 
    plan, 
    intent, 
    review, 
    updateReview, 
    setStep,
    isLoading,
    isSaving,
    canAccessStep,
    saveToDatabase
  } = useEnrollmentStore();
  
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step access protection
  useEffect(() => {
    if (!isLoading && !canAccessStep("review")) {
      navigate("/enroll");
    }
  }, [isLoading, canAccessStep, navigate]);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!plan.medicalPlanId) return;
      
      const { data } = await supabase
        .from("ichra_plans")
        .select("plan_name, carrier_name, monthly_premium, metal_tier")
        .eq("id", plan.medicalPlanId)
        .single();
      
      if (data) {
        setPlanDetails(data);
      }
    };
    
    fetchPlanDetails();
  }, [plan.medicalPlanId]);

  const validateForm = (): boolean => {
    const result = reviewSchema.safeParse({
      informationAccurate: review.informationAccurate,
      electronicConsent: review.electronicConsent,
      hipaaAuthorization: review.hipaaAuthorization,
    });

    if (!result.success) {
      setErrors(formatZodErrors(result.error));
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }
    
    // Capture attestation timestamp
    updateReview({
      attestedAt: new Date().toISOString(),
      ipAddress: "captured-server-side", // Will be captured on submit
    });
    
    setStep("submit");
    navigate("/enroll/submit");
  };

  const handleBack = () => {
    setStep("plans");
    navigate("/enroll/plans");
  };

  const SectionHeader = ({ icon: Icon, title, onEdit }: { icon: React.ElementType; title: string; onEdit: () => void }) => (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit} className="text-primary">
        <Pencil className="h-4 w-4 mr-1" />
        Edit
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <EnrollmentLayout
        currentStep={7}
        totalSteps={8}
        title="Review Your Information"
        description="Loading your information..."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </EnrollmentLayout>
    );
  }

  return (
    <EnrollmentLayout
      currentStep={7}
      totalSteps={8}
      title="Review Your Information"
      description="Please review all information carefully before submitting your enrollment."
      onSave={saveToDatabase}
    >
      {/* Personal Information */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            icon={User}
            title="Personal Information"
            onEdit={() => navigate("/enroll/about")}
          />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{account.firstName} {account.lastName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{about.dateOfBirth || "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{account.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{account.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium">
                {about.address1}
                {about.address2 && `, ${about.address2}`}
                <br />
                {about.city}, {about.state} {about.zipCode}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Household */}
      {intent.coverageFor === "family" && household.dependents.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <SectionHeader
              icon={Users}
              title="Household Members"
              onEdit={() => navigate("/enroll/household")}
            />
            <div className="space-y-3">
              {household.dependents.map((dep) => (
                <div key={dep.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{dep.firstName} {dep.lastName}</p>
                    <p className="text-sm text-muted-foreground capitalize">{dep.relationship}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">DOB: {dep.dateOfBirth}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coverage Details */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            icon={FileText}
            title="Coverage Details"
            onEdit={() => navigate("/enroll/coverage")}
          />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Coverage Start Date</p>
              <p className="font-medium">{coverage.desiredStartDate || "Not selected"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">State</p>
              <p className="font-medium">{coverage.stateOfResidence}</p>
            </div>
            {intent.enrollmentReason === "qualifying_event" && (
              <div className="col-span-2">
                <p className="text-muted-foreground">Qualifying Event</p>
                <p className="font-medium capitalize">{coverage.qualifyingEventType?.replace(/_/g, " ")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Plan */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader
            icon={CreditCard}
            title="Selected Plan"
            onEdit={() => navigate("/enroll/plans")}
          />
          {planDetails ? (
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{planDetails.plan_name}</p>
                  <p className="text-muted-foreground">{planDetails.carrier_name}</p>
                  <p className="text-sm text-muted-foreground capitalize mt-1">
                    {planDetails.metal_tier} tier
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${planDetails.monthly_premium.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No plan selected</p>
          )}
        </CardContent>
      </Card>

      <Separator className="my-2" />

      {/* Attestations */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Required Attestations
          </CardTitle>
          <CardDescription>
            Please read and accept the following statements to complete your enrollment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(errors.informationAccurate || errors.electronicConsent || errors.hipaaAuthorization) && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">Please accept all required attestations to continue.</p>
            </div>
          )}
          
          <div className={cn(
            "flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50",
            errors.informationAccurate ? "border-destructive" : "border-border"
          )}>
            <Checkbox
              id="accuracy"
              checked={review.informationAccurate}
              onCheckedChange={(checked) =>
                updateReview({ informationAccurate: checked === true })
              }
            />
            <div className="space-y-1">
              <Label htmlFor="accuracy" className="cursor-pointer font-medium">
                Information Accuracy
              </Label>
              <p className="text-sm text-muted-foreground">
                I certify that all information provided is accurate and complete to the best of my knowledge. I understand that providing false information may result in denial of coverage or cancellation of my enrollment.
              </p>
            </div>
          </div>

          <div className={cn(
            "flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50",
            errors.electronicConsent ? "border-destructive" : "border-border"
          )}>
            <Checkbox
              id="electronic"
              checked={review.electronicConsent}
              onCheckedChange={(checked) =>
                updateReview({ electronicConsent: checked === true })
              }
            />
            <div className="space-y-1">
              <Label htmlFor="electronic" className="cursor-pointer font-medium">
                Electronic Communications
              </Label>
              <p className="text-sm text-muted-foreground">
                I consent to receive enrollment documents, notices, and other communications electronically. I understand I may withdraw this consent at any time.
              </p>
            </div>
          </div>

          <div className={cn(
            "flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50",
            errors.hipaaAuthorization ? "border-destructive" : "border-border"
          )}>
            <Checkbox
              id="hipaa"
              checked={review.hipaaAuthorization}
              onCheckedChange={(checked) =>
                updateReview({ hipaaAuthorization: checked === true })
              }
            />
            <div className="space-y-1">
              <Label htmlFor="hipaa" className="cursor-pointer font-medium">
                HIPAA Authorization
              </Label>
              <p className="text-sm text-muted-foreground">
                I authorize the release of my health information as necessary for enrollment, claims processing, and coordination of benefits in accordance with HIPAA regulations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <EnrollmentNavigation
        onBack={handleBack}
        onNext={handleNext}
        nextLabel="Continue to Payment"
        isLoading={isSaving}
      />
    </EnrollmentLayout>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
