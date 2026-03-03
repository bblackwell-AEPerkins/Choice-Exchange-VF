import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEnrollmentStore } from "@/hooks/useEnrollmentStore";
import { reviewSchema, formatZodErrors } from "@/lib/validations/enrollment";
import { supabase } from "@/integrations/supabase/client";
import { User, Users, FileText, CreditCard, Pencil, Shield, AlertCircle, Loader2, Heart, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PlanDetails {
  plan_name: string;
  carrier_name: string;
  monthly_premium: number;
  metal_tier: string;
}

// Mirror the voluntary data from EnrollPlans so we can resolve names
const VOLUNTARY_BENEFITS_DATA: Record<string, {
  name: string;
  plans: { id: string; name: string; carrier: string; monthlyPremium: number }[];
}> = {
  dental: {
    name: "Dental Coverage",
    plans: [
      { id: "delta-dental-basic", name: "Delta Dental Basic", carrier: "Delta Dental", monthlyPremium: 22 },
      { id: "delta-dental-standard", name: "Delta Dental Plus", carrier: "Delta Dental", monthlyPremium: 38 },
      { id: "delta-dental-premium", name: "Delta Dental Premier", carrier: "Delta Dental", monthlyPremium: 55 },
      { id: "cigna-dental-basic", name: "Cigna Dental Essential", carrier: "Cigna", monthlyPremium: 20 },
      { id: "cigna-dental-standard", name: "Cigna Dental Preferred", carrier: "Cigna", monthlyPremium: 35 },
      { id: "cigna-dental-premium", name: "Cigna Dental Elite", carrier: "Cigna", monthlyPremium: 52 },
      { id: "guardian-dental-basic", name: "Guardian DentalGuard Basic", carrier: "Guardian", monthlyPremium: 24 },
      { id: "guardian-dental-standard", name: "Guardian DentalGuard Plus", carrier: "Guardian", monthlyPremium: 40 },
      { id: "guardian-dental-premium", name: "Guardian DentalGuard Premium", carrier: "Guardian", monthlyPremium: 58 },
    ],
  },
  vision: {
    name: "Vision Coverage",
    plans: [
      { id: "vsp-basic", name: "VSP Basic", carrier: "VSP", monthlyPremium: 12 },
      { id: "vsp-standard", name: "VSP Preferred", carrier: "VSP", monthlyPremium: 22 },
      { id: "vsp-premium", name: "VSP Premier", carrier: "VSP", monthlyPremium: 35 },
      { id: "eyemed-basic", name: "EyeMed Access", carrier: "EyeMed", monthlyPremium: 10 },
      { id: "eyemed-standard", name: "EyeMed Select", carrier: "EyeMed", monthlyPremium: 20 },
      { id: "eyemed-premium", name: "EyeMed Premium", carrier: "EyeMed", monthlyPremium: 32 },
    ],
  },
  life: {
    name: "Term Life Insurance",
    plans: [
      { id: "metlife-life-basic", name: "MetLife Term Essential", carrier: "MetLife", monthlyPremium: 14 },
      { id: "metlife-life-standard", name: "MetLife Term Plus", carrier: "MetLife", monthlyPremium: 28 },
      { id: "metlife-life-premium", name: "MetLife Term Premier", carrier: "MetLife", monthlyPremium: 52 },
      { id: "prudential-life-basic", name: "Prudential Simple Term", carrier: "Prudential", monthlyPremium: 16 },
      { id: "prudential-life-standard", name: "Prudential Term Flex", carrier: "Prudential", monthlyPremium: 30 },
      { id: "prudential-life-premium", name: "Prudential Term Max", carrier: "Prudential", monthlyPremium: 55 },
    ],
  },
  disability: {
    name: "Short-Term Disability",
    plans: [
      { id: "disability-basic", name: "STD Basic", carrier: "Choice Exchange", monthlyPremium: 20 },
      { id: "disability-standard", name: "STD Plus", carrier: "Choice Exchange", monthlyPremium: 35 },
      { id: "disability-premium", name: "STD Premium", carrier: "Choice Exchange", monthlyPremium: 55 },
      { id: "unum-disability-basic", name: "Unum STD Core", carrier: "Unum", monthlyPremium: 22 },
      { id: "unum-disability-standard", name: "Unum STD Plus", carrier: "Unum", monthlyPremium: 38 },
      { id: "unum-disability-premium", name: "Unum STD Premier", carrier: "Unum", monthlyPremium: 60 },
      { id: "lincoln-disability-basic", name: "Lincoln STD Essential", carrier: "Lincoln Financial", monthlyPremium: 18 },
      { id: "lincoln-disability-standard", name: "Lincoln STD Select", carrier: "Lincoln Financial", monthlyPremium: 32 },
      { id: "lincoln-disability-premium", name: "Lincoln STD Complete", carrier: "Lincoln Financial", monthlyPremium: 50 },
    ],
  },
};

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

  // Resolve voluntary selections
  const resolvedVoluntary = Object.entries(plan.voluntarySelections || {})
    .map(([categoryId, planId]) => {
      if (!planId) return null;
      const cat = VOLUNTARY_BENEFITS_DATA[categoryId];
      if (!cat) return null;
      const p = cat.plans.find(pl => pl.id === planId);
      if (!p) return null;
      return { categoryName: cat.name, ...p };
    })
    .filter(Boolean) as { categoryName: string; id: string; name: string; carrier: string; monthlyPremium: number }[];

  const voluntaryTotal = resolvedVoluntary.reduce((s, v) => s + v.monthlyPremium, 0);
  const medicalTotal = planDetails?.monthly_premium || 0;
  const grandTotal = medicalTotal + voluntaryTotal;

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
    if (!validateForm()) return;
    
    updateReview({
      attestedAt: new Date().toISOString(),
      ipAddress: "captured-server-side",
    });
    
    setStep("submit");
    navigate("/enroll/submit");
  };

  const handleBack = () => {
    setStep("coverage");
    navigate("/enroll/crosssell");
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

  const hasAnySelection = planDetails || resolvedVoluntary.length > 0;

  return (
    <EnrollmentLayout
      currentStep={7}
      totalSteps={8}
      title="Review Your Information"
      description="Please review all information carefully before submitting your enrollment."
      onSave={saveToDatabase}
    >
      {/* ── Monthly Cost Summary ── */}
      {hasAnySelection && (
        <Card className="border-primary/30 bg-card shadow-sm">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Estimated Monthly Total</p>
              <p className="text-2xl font-bold text-primary">${grandTotal.toFixed(2)}/mo</p>
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              {planDetails && (
                <div className="flex justify-between">
                  <span className="text-foreground">{planDetails.plan_name}</span>
                  <span className="font-semibold">${planDetails.monthly_premium.toFixed(2)}</span>
                </div>
              )}
              {resolvedVoluntary.map(v => (
                <div key={v.id} className="flex justify-between">
                  <span className="text-foreground">{v.name}</span>
                  <span className="font-semibold">${v.monthlyPremium.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Personal Information ── */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader icon={User} title="Personal Information" onEdit={() => navigate("/enroll/about")} />
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

      {/* ── Household ── */}
      {household.dependents.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <SectionHeader icon={Users} title="Household Members" onEdit={() => navigate("/enroll/household")} />
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

      {/* ── Coverage Details ── */}
      <Card>
        <CardContent className="pt-6">
          <SectionHeader icon={FileText} title="Coverage Details" onEdit={() => navigate("/enroll/coverage")} />
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

      {/* ── Selected Plans (highlighted) ── */}
      <Card className="border-accent/30">
        <CardContent className="pt-6">
          <SectionHeader icon={CreditCard} title="Selected Plans" onEdit={() => navigate("/enroll/plans")} />
          
          <div className="space-y-4">
            {/* ICHRA Medical Plan */}
            {planDetails && (
              <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{planDetails.plan_name}</p>
                      <p className="text-sm text-muted-foreground">{planDetails.carrier_name} • {planDetails.metal_tier} tier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${planDetails.monthly_premium.toFixed(2)}<span className="text-sm font-medium text-muted-foreground">/mo</span>
                    </p>
                  </div>
                </div>
                <Badge className="mt-3 bg-primary/10 text-primary border-primary/25">ICHRA Medical</Badge>
              </div>
            )}

            {/* Voluntary Benefit Selections */}
            {resolvedVoluntary.map(v => (
              <div key={v.id} className="p-4 rounded-lg border border-border bg-card shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Heart className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{v.name}</p>
                      <p className="text-sm text-muted-foreground">{v.carrier} • {v.categoryName}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-foreground">${v.monthlyPremium.toFixed(2)}<span className="text-sm font-medium text-muted-foreground">/mo</span></p>
                </div>
              </div>
            ))}

            {!hasAnySelection && (
              <p className="text-muted-foreground py-4 text-center">No plans selected</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-2" />

      {/* ── Attestations ── */}
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
              onCheckedChange={(checked) => updateReview({ informationAccurate: checked === true })}
            />
            <div className="space-y-1">
              <Label htmlFor="accuracy" className="cursor-pointer font-medium">Information Accuracy</Label>
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
              onCheckedChange={(checked) => updateReview({ electronicConsent: checked === true })}
            />
            <div className="space-y-1">
              <Label htmlFor="electronic" className="cursor-pointer font-medium">Electronic Communications</Label>
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
              onCheckedChange={(checked) => updateReview({ hipaaAuthorization: checked === true })}
            />
            <div className="space-y-1">
              <Label htmlFor="hipaa" className="cursor-pointer font-medium">HIPAA Authorization</Label>
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
        nextLabel="Submit Enrollment"
        isLoading={isSaving}
      />
    </EnrollmentLayout>
  );
}