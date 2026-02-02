import { useState } from "react";
import { useBrokerEnrollment } from "@/hooks/useBrokerEnrollment";
import { BrokerEnrollmentLayout } from "@/components/broker/BrokerEnrollmentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Check, Heart, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const tierColors: Record<string, string> = {
  Bronze: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Silver: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  Gold: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Platinum: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function BrokerEnrollStep4() {
  const {
    data,
    updateData,
    prevStep,
    nextStep,
    saveAndExit,
    selectedGroup,
    remainingDollars,
    estimatedEarnings,
    selectedPlan,
    plans,
  } = useBrokerEnrollment();

  const [showAllTiers, setShowAllTiers] = useState(false);

  // Filter to Bronze and Silver by default
  const displayPlans = showAllTiers
    ? plans
    : plans.filter((p) => p.metal_tier === "Bronze" || p.metal_tier === "Silver");

  const handlePlanSelect = (planId: string) => {
    updateData({ selectedPlanId: planId });
  };

  return (
    <BrokerEnrollmentLayout
      currentStep={4}
      onBack={prevStep}
      onSaveAndExit={saveAndExit}
      effectiveDate={data.effectiveDate}
      contributionAmount={data.contributionAmount}
      selectedPlanPremium={selectedPlan?.monthly_premium}
      remainingDollars={remainingDollars}
      estimatedEarnings={estimatedEarnings}
      individualName={data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined}
      groupName={selectedGroup?.name}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Medical Plan Selection</CardTitle>
                <CardDescription>
                  Choose coverage for this enrollment.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllTiers(!showAllTiers)}
              >
                {showAllTiers ? "Show Bronze & Silver Only" : "Show All Tiers"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Plans list */}
            <RadioGroup
              value={data.selectedPlanId || ""}
              onValueChange={handlePlanSelect}
              className="space-y-3"
            >
              {displayPlans.map((plan) => {
                const isSelected = data.selectedPlanId === plan.id;
                const netPremium = plan.monthly_premium - data.contributionAmount;
                const isFullyCovered = netPremium <= 0;

                return (
                  <Label
                    key={plan.id}
                    htmlFor={plan.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {plan.plan_name}
                        </span>
                        <Badge className={cn("text-xs", tierColors[plan.metal_tier])}>
                          {plan.metal_tier}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {plan.plan_type}
                        </Badge>
                        {plan.is_hsa_eligible && (
                          <Badge variant="secondary" className="text-xs">
                            HSA
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {plan.carrier_name}
                      </p>
                      
                      {/* Key metrics */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Deductible</span>
                          <p className="font-medium">${plan.deductible.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">OOP Max</span>
                          <p className="font-medium">${plan.out_of_pocket_max.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Primary Care</span>
                          <p className="font-medium">${plan.copay_primary} copay</p>
                        </div>
                      </div>
                    </div>

                    {/* Premium section */}
                    <div className="text-right shrink-0 min-w-[120px]">
                      <p className="text-sm text-muted-foreground line-through">
                        ${plan.monthly_premium}/mo
                      </p>
                      <p className={cn(
                        "text-lg font-bold",
                        isFullyCovered ? "text-green-600 dark:text-green-400" : "text-foreground"
                      )}>
                        {isFullyCovered ? (
                          <span className="flex items-center gap-1 justify-end">
                            <Check className="h-4 w-4" />
                            $0/mo
                          </span>
                        ) : (
                          `$${netPremium}/mo`
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        after contribution
                      </p>
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>

            {displayPlans.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No plans available for this ZIP code.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={nextStep} disabled={!data.selectedPlanId}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </BrokerEnrollmentLayout>
  );
}
