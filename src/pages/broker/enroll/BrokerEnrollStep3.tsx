import { useBrokerEnrollment } from "@/hooks/useBrokerEnrollment";
import { BrokerEnrollmentLayout } from "@/components/broker/BrokerEnrollmentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Wallet } from "lucide-react";

export default function BrokerEnrollStep3() {
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
    groups,
  } = useBrokerEnrollment();

  const isValid = 
    data.groupId !== "" &&
    data.effectiveDate !== "" &&
    data.contributionAmount > 0;

  return (
    <BrokerEnrollmentLayout
      currentStep={3}
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
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Employer Defined Contribution</CardTitle>
          <CardDescription>
            Set the wallet and define how dollars flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Select Group */}
          <div className="space-y-2">
            <Label htmlFor="group">Employer Group *</Label>
            <Select
              value={data.groupId}
              onValueChange={(value) => {
                updateData({ groupId: value });
                // Auto-populate contribution from group defaults
                const group = groups.find(g => g.id === value);
                if (group) {
                  // Extract number from contribution strategy (e.g., "Flat $500/mo" -> 500)
                  const match = group.contributionStrategy.match(/\$(\d+)/);
                  if (match) {
                    updateData({ contributionAmount: parseInt(match[1]) });
                  }
                }
              }}
            >
              <SelectTrigger id="group">
                <SelectValue placeholder="Select employer group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} ({group.sizeBand} employees)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Effective Date */}
          <div className="space-y-2">
            <Label htmlFor="effectiveDate">Effective Date *</Label>
            <Input
              id="effectiveDate"
              type="date"
              value={data.effectiveDate}
              onChange={(e) => updateData({ effectiveDate: e.target.value })}
            />
          </div>

          {/* Contribution Amount */}
          <div className="space-y-2">
            <Label htmlFor="contribution">Monthly Contribution Amount *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="contribution"
                type="number"
                value={data.contributionAmount || ""}
                onChange={(e) => updateData({ contributionAmount: parseFloat(e.target.value) || 0 })}
                className="pl-8"
                placeholder="0"
                min={0}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The employer's monthly allowance for this individual
            </p>
          </div>

          {/* Contribution Method */}
          <div className="space-y-3">
            <Label>Contribution Method</Label>
            <RadioGroup
              value={data.contributionMethod}
              onValueChange={(value) => updateData({ contributionMethod: value as any })}
              className="grid grid-cols-3 gap-3"
            >
              <Label
                htmlFor="flat"
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer text-center transition-colors ${
                  data.contributionMethod === "flat"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="flat" id="flat" className="sr-only" />
                <span className="font-medium text-sm">Flat Amount</span>
                <span className="text-xs text-muted-foreground">Same for all</span>
              </Label>
              
              <Label
                htmlFor="by_family"
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer text-center transition-colors ${
                  data.contributionMethod === "by_family"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="by_family" id="by_family" className="sr-only" />
                <span className="font-medium text-sm">By Family</span>
                <span className="text-xs text-muted-foreground">EE, EE+1, Family</span>
              </Label>
              
              <Label
                htmlFor="by_class"
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer text-center transition-colors ${
                  data.contributionMethod === "by_class"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="by_class" id="by_class" className="sr-only" />
                <span className="font-medium text-sm">By Class</span>
                <span className="text-xs text-muted-foreground">Job-based tiers</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Section 125 */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="section125" className="font-medium">Section 125 / POP in Place</Label>
              <p className="text-sm text-muted-foreground">
                Premium Only Plan is established for pre-tax contributions
              </p>
            </div>
            <Switch
              id="section125"
              checked={data.section125}
              onCheckedChange={(checked) => updateData({ section125: checked })}
            />
          </div>

          {/* Wallet visual */}
          {data.contributionAmount > 0 && (
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ICHRA Allowance</p>
                  <p className="text-2xl font-bold text-foreground">${data.contributionAmount}/mo</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This amount will be applied toward the individual's health insurance premium.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={nextStep} disabled={!isValid}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </BrokerEnrollmentLayout>
  );
}
