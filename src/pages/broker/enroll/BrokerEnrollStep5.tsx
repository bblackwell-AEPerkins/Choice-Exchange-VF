import { useBrokerEnrollment } from "@/hooks/useBrokerEnrollment";
import { BrokerEnrollmentLayout } from "@/components/broker/BrokerEnrollmentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Sparkles, Shield, Eye, Heart, Umbrella } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock voluntary benefits
const voluntaryBenefits = [
  {
    id: "dental",
    name: "Dental Coverage",
    description: "Preventive, basic, and major dental care",
    price: 35,
    icon: Heart,
    recommended: true,
  },
  {
    id: "vision",
    name: "Vision Coverage",
    description: "Eye exams, glasses, and contacts",
    price: 12,
    icon: Eye,
    recommended: true,
  },
  {
    id: "life",
    name: "Term Life Insurance",
    description: "$50,000 coverage with AD&D",
    price: 18,
    icon: Shield,
    recommended: false,
  },
  {
    id: "disability",
    name: "Short-Term Disability",
    description: "60% income replacement, 90-day benefit",
    price: 28,
    icon: Umbrella,
    recommended: false,
  },
  {
    id: "accident",
    name: "Accident Insurance",
    description: "Cash benefits for accidents and injuries",
    price: 15,
    icon: Heart,
    recommended: true,
  },
  {
    id: "critical",
    name: "Critical Illness",
    description: "Lump sum for covered conditions",
    price: 22,
    icon: Shield,
    recommended: false,
  },
];

export default function BrokerEnrollStep5() {
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
    toggleVoluntaryBenefit,
  } = useBrokerEnrollment();

  const selectedBenefits = data.voluntaryBenefits;
  const totalVoluntaryCost = voluntaryBenefits
    .filter((b) => selectedBenefits.includes(b.id))
    .reduce((sum, b) => sum + b.price, 0);

  const remainingAfterVoluntary = remainingDollars - totalVoluntaryCost;
  const isEmployeePaid = remainingAfterVoluntary < 0;

  const recommendedBenefits = voluntaryBenefits.filter((b) => b.recommended);
  const otherBenefits = voluntaryBenefits.filter((b) => !b.recommended);

  return (
    <BrokerEnrollmentLayout
      currentStep={5}
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
        {/* Remaining dollars banner */}
        <Card className="bg-gradient-to-r from-green-500/10 to-accent/10 border-green-500/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Remaining Dollars Available
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Use toward voluntary benefits
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${Math.max(0, remainingDollars).toFixed(0)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommended add-ons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommended Add-ons
            </CardTitle>
            <CardDescription>
              Popular benefits that pair well with the selected medical plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedBenefits.map((benefit) => {
                const isSelected = selectedBenefits.includes(benefit.id);
                const Icon = benefit.icon;

                return (
                  <Label
                    key={benefit.id}
                    htmlFor={benefit.id}
                    className={cn(
                      "flex flex-col p-4 rounded-lg border cursor-pointer transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <Checkbox
                        id={benefit.id}
                        checked={isSelected}
                        onCheckedChange={() => toggleVoluntaryBenefit(benefit.id)}
                      />
                    </div>
                    <p className="font-medium text-foreground mb-1">{benefit.name}</p>
                    <p className="text-xs text-muted-foreground mb-3 flex-1">
                      {benefit.description}
                    </p>
                    <p className="font-semibold text-primary">${benefit.price}/mo</p>
                  </Label>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Other benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Other Voluntary Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherBenefits.map((benefit) => {
                const isSelected = selectedBenefits.includes(benefit.id);
                const Icon = benefit.icon;

                return (
                  <Label
                    key={benefit.id}
                    htmlFor={benefit.id}
                    className={cn(
                      "flex flex-col p-4 rounded-lg border cursor-pointer transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Checkbox
                        id={benefit.id}
                        checked={isSelected}
                        onCheckedChange={() => toggleVoluntaryBenefit(benefit.id)}
                      />
                    </div>
                    <p className="font-medium text-foreground mb-1">{benefit.name}</p>
                    <p className="text-xs text-muted-foreground mb-3 flex-1">
                      {benefit.description}
                    </p>
                    <p className="font-semibold text-foreground">${benefit.price}/mo</p>
                  </Label>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary footer */}
        {selectedBenefits.length > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {selectedBenefits.length} benefit{selectedBenefits.length > 1 ? "s" : ""} selected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total: ${totalVoluntaryCost}/mo
                    {isEmployeePaid && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        ${Math.abs(remainingAfterVoluntary).toFixed(0)} employee paid
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={nextStep}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </BrokerEnrollmentLayout>
  );
}
