import { useState } from "react";
import { useBrokerEnrollment } from "@/hooks/useBrokerEnrollment";
import { BrokerEnrollmentLayout } from "@/components/broker/BrokerEnrollmentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  ArrowRight, 
  Wallet, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronRight,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  VOLUNTARY_BENEFITS, 
  BENEFIT_CATEGORIES, 
  getRecommendedBenefits,
  getBenefitById,
  type VoluntaryBenefit,
  type VoluntaryBenefitCategory,
} from "@/lib/voluntaryBenefitsData";

export default function BrokerEnrollStep5() {
  const {
    data,
    prevStep,
    nextStep,
    saveAndExit,
    selectedGroup,
    remainingDollars,
    estimatedEarnings,
    selectedPlan,
    toggleVoluntaryBenefit,
  } = useBrokerEnrollment();

  const [showFullCatalog, setShowFullCatalog] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<VoluntaryBenefitCategory[]>([]);

  // Selected benefits calculations
  const selectedBenefitIds = data.voluntaryBenefits;
  const selectedBenefitsData = selectedBenefitIds
    .map((id) => getBenefitById(id))
    .filter(Boolean) as VoluntaryBenefit[];
  
  const totalVoluntaryCost = selectedBenefitsData.reduce((sum, b) => sum + b.price, 0);
  const remainingAfterVoluntary = remainingDollars - totalVoluntaryCost;
  
  // Recommended benefits (non-underwriting, flagged as recommended)
  const recommendedBenefits = getRecommendedBenefits();
  
  // Calculate payer type for each benefit
  const getPayerType = (benefit: VoluntaryBenefit, index: number) => {
    const previousTotal = selectedBenefitsData.slice(0, index).reduce((sum, b) => sum + b.price, 0);
    const availableAfter = remainingDollars - previousTotal;
    
    if (availableAfter >= benefit.price) return "contribution";
    if (availableAfter > 0) return "split";
    return "employee";
  };

  const toggleCategory = (category: VoluntaryBenefitCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const medicalPremium = selectedPlan?.monthly_premium || 0;
  const contributionAmount = data.contributionAmount;

  return (
    <BrokerEnrollmentLayout
      currentStep={5}
      onBack={prevStep}
      onSaveAndExit={saveAndExit}
      effectiveDate={data.effectiveDate}
      contributionAmount={contributionAmount}
      selectedPlanPremium={medicalPremium}
      remainingDollars={remainingDollars}
      estimatedEarnings={estimatedEarnings}
      individualName={data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined}
      groupName={selectedGroup?.name}
    >
      <div className="space-y-6">
        {/* Wallet Strip - Always visible */}
        <Card className="bg-card border-2">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">Benefit Wallet</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground text-xs">Contribution</p>
                  <p className="font-semibold text-foreground">${contributionAmount}/mo</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <p className="text-muted-foreground text-xs">Medical</p>
                  <p className="font-semibold text-foreground">${medicalPremium}/mo</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <p className="text-muted-foreground text-xs">Remaining</p>
                  <p className={cn(
                    "font-bold text-lg",
                    remainingAfterVoluntary >= 0 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-amber-600 dark:text-amber-400"
                  )}>
                    ${Math.max(0, remainingAfterVoluntary).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-[1fr,320px] gap-6">
          {/* Left: Benefits Selection */}
          <div className="space-y-6">
            {/* Recommended Add-ons */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Recommended Add-ons</CardTitle>
                <CardDescription>
                  Popular benefits that pair well with the selected medical plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {recommendedBenefits.slice(0, 6).map((benefit) => {
                    const isSelected = selectedBenefitIds.includes(benefit.id);
                    const Icon = benefit.icon;

                    return (
                      <div
                        key={benefit.id}
                        className={cn(
                          "p-4 rounded-lg border transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {benefit.carrier}
                          </Badge>
                        </div>
                        <p className="font-medium text-foreground text-sm mb-1">
                          {benefit.name}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {benefit.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-primary">
                            ${benefit.price}/mo
                          </p>
                          <Button
                            size="sm"
                            variant={isSelected ? "secondary" : "default"}
                            onClick={() => toggleVoluntaryBenefit(benefit.id)}
                          >
                            {isSelected ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Full Catalog - Expandable */}
            <Collapsible open={showFullCatalog} onOpenChange={setShowFullCatalog}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>See all voluntary benefits</span>
                  {showFullCatalog ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {(Object.keys(BENEFIT_CATEGORIES) as VoluntaryBenefitCategory[]).map(
                        (category) => {
                          const categoryInfo = BENEFIT_CATEGORIES[category];
                          const categoryBenefits = VOLUNTARY_BENEFITS.filter(
                            (b) => b.category === category
                          );
                          const isExpanded = expandedCategories.includes(category);
                          const selectedInCategory = categoryBenefits.filter((b) =>
                            selectedBenefitIds.includes(b.id)
                          ).length;

                          return (
                            <Collapsible
                              key={category}
                              open={isExpanded}
                              onOpenChange={() => toggleCategory(category)}
                            >
                              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">
                                    {categoryInfo.label}
                                  </span>
                                  {selectedInCategory > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      {selectedInCategory} selected
                                    </Badge>
                                  )}
                                </div>
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pt-3 pl-4">
                                <div className="space-y-2">
                                  {categoryBenefits.map((benefit) => {
                                    const isSelected = selectedBenefitIds.includes(
                                      benefit.id
                                    );

                                    return (
                                      <div
                                        key={benefit.id}
                                        className={cn(
                                          "flex items-center justify-between p-3 rounded-lg border",
                                          isSelected
                                            ? "border-primary bg-primary/5"
                                            : "border-border"
                                        )}
                                      >
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm">
                                              {benefit.name}
                                            </p>
                                            {benefit.requiresUnderwriting && (
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                Underwriting
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            {benefit.carrier} • ${benefit.price}/mo
                                          </p>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant={isSelected ? "secondary" : "outline"}
                                          onClick={() =>
                                            toggleVoluntaryBenefit(benefit.id)
                                          }
                                        >
                                          {isSelected ? "Remove" : "Add"}
                                        </Button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Right: Selected Benefits Tray */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Selected Benefits
                  {selectedBenefitsData.length > 0 && (
                    <Badge variant="secondary">{selectedBenefitsData.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedBenefitsData.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">No benefits selected yet</p>
                    <p className="text-xs mt-1">Add from recommendations above</p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-[300px]">
                    <div className="space-y-3">
                      {selectedBenefitsData.map((benefit, index) => {
                        const payerType = getPayerType(benefit, index);
                        
                        return (
                          <div
                            key={benefit.id}
                            className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {benefit.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ${benefit.price}/mo
                              </p>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs mt-1",
                                  payerType === "contribution"
                                    ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400"
                                    : payerType === "employee"
                                    ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                                )}
                              >
                                {payerType === "contribution"
                                  ? "Covered by contribution"
                                  : payerType === "employee"
                                  ? "Employee paid"
                                  : "Split payment"}
                              </Badge>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0"
                              onClick={() => toggleVoluntaryBenefit(benefit.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}

                {selectedBenefitsData.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Voluntary</span>
                        <span className="font-medium">${totalVoluntaryCost}/mo</span>
                      </div>
                      {remainingAfterVoluntary < 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-amber-600 dark:text-amber-400">
                            Employee Paid Portion
                          </span>
                          <span className="font-medium text-amber-600 dark:text-amber-400">
                            ${Math.abs(remainingAfterVoluntary).toFixed(0)}/mo
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground">Effective Date</span>
                        <span className="font-medium">
                          {data.effectiveDate || "Same as medical"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={nextStep}>
            {selectedBenefitsData.length === 0 ? "Skip Voluntary Benefits" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </BrokerEnrollmentLayout>
  );
}
