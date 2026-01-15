import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEnrollmentDB } from "@/hooks/useEnrollmentDB";
import { supabase } from "@/integrations/supabase/client";
import { Check, Shield, Stethoscope, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  plan_name: string;
  carrier_name: string;
  metal_tier: string;
  monthly_premium: number;
  deductible: number;
  out_of_pocket_max: number;
  copay_primary: number | null;
  is_hsa_eligible: boolean;
  features: string[] | null;
}

const METAL_TIER_COLORS: Record<string, string> = {
  bronze: "bg-amber-100 text-amber-800 border-amber-300",
  silver: "bg-slate-100 text-slate-700 border-slate-300",
  gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
  platinum: "bg-purple-100 text-purple-800 border-purple-300",
};

export default function EnrollPlans() {
  const navigate = useNavigate();
  const { 
    plan, 
    coverage, 
    updatePlan, 
    setStep,
    isLoading: dbLoading,
    isSaving,
    canAccessStep,
    saveToDatabase
  } = useEnrollmentDB();
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<Plan | null>(null);

  // Step access protection
  useEffect(() => {
    if (!dbLoading && !canAccessStep("plans")) {
      navigate("/enroll");
    }
  }, [dbLoading, canAccessStep, navigate]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from("ichra_plans")
          .select("*")
          .eq("is_active", true)
          .contains("coverage_areas", [coverage.stateOfResidence || "CA"]);

        if (error) throw error;
        setPlans(data || []);
        
        // If a plan was previously selected, find its details
        if (plan.medicalPlanId) {
          const selected = data?.find((p: Plan) => p.id === plan.medicalPlanId);
          if (selected) {
            setSelectedPlanDetails(selected);
          }
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [coverage.stateOfResidence, plan.medicalPlanId]);

  const handleSelectPlan = (selectedPlan: Plan) => {
    updatePlan({
      medicalPlanId: selectedPlan.id,
      monthlyPremium: selectedPlan.monthly_premium,
    });
    setSelectedPlanDetails(selectedPlan);
  };

  const handleNext = () => {
    if (plan.medicalPlanId) {
      setStep("review");
      navigate("/enroll/review");
    }
  };

  const handleBack = () => {
    setStep("coverage");
    navigate("/enroll/coverage");
  };

  if (dbLoading) {
    return (
      <EnrollmentLayout
        currentStep={6}
        totalSteps={8}
        title="Select Your Plan"
        description="Loading available plans..."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </EnrollmentLayout>
    );
  }

  return (
    <EnrollmentLayout
      currentStep={6}
      totalSteps={8}
      title="Select Your Plan"
      description="Choose the health plan that best fits your needs and budget."
      onSave={saveToDatabase}
    >
      {/* Selected Plan Summary */}
      {selectedPlanDetails && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span className="font-medium">Selected Plan</span>
              </div>
              <Badge className={cn("capitalize", METAL_TIER_COLORS[selectedPlanDetails.metal_tier.toLowerCase()])}>
                {selectedPlanDetails.metal_tier}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{selectedPlanDetails.plan_name}</p>
                <p className="text-sm text-muted-foreground">{selectedPlanDetails.carrier_name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  ${selectedPlanDetails.monthly_premium.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No plans available</p>
            <p className="text-muted-foreground">
              We couldn't find plans for your area. Please contact support for assistance.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {plans.length} plans available in {coverage.stateOfResidence || "your area"}
          </p>
          
          {plans.map((p) => {
            const isSelected = plan.medicalPlanId === p.id;
            
            return (
              <Card
                key={p.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  isSelected && "border-primary ring-2 ring-primary/20"
                )}
                onClick={() => handleSelectPlan(p)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={cn("capitalize", METAL_TIER_COLORS[p.metal_tier.toLowerCase()])}>
                          {p.metal_tier}
                        </Badge>
                        {p.is_hsa_eligible && (
                          <Badge variant="outline" className="text-accent border-accent">
                            HSA Eligible
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg">{p.plan_name}</h3>
                      <p className="text-sm text-muted-foreground">{p.carrier_name}</p>
                      
                      {/* Key Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Deductible</p>
                          <p className="font-medium">${p.deductible.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Out-of-Pocket Max</p>
                          <p className="font-medium">${p.out_of_pocket_max.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Primary Care</p>
                          <p className="font-medium">
                            {p.copay_primary ? `$${p.copay_primary}` : "See plan"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price & Select */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                      <div className="text-right">
                        <p className="text-2xl font-bold">${p.monthly_premium.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className="min-w-[100px]"
                      >
                        {isSelected ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Selected
                          </>
                        ) : (
                          "Select Plan"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <EnrollmentNavigation
        onBack={handleBack}
        onNext={handleNext}
        disabled={!plan.medicalPlanId}
        nextLabel="Review & Submit"
        isLoading={isSaving}
      />
    </EnrollmentLayout>
  );
}
