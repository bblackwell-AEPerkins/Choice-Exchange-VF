import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useBrokerEnrollment } from "@/hooks/useBrokerEnrollment";
import { BrokerEnrollmentLayout } from "@/components/broker/BrokerEnrollmentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowRight } from "lucide-react";

export default function BrokerEnrollStep1() {
  const {
    data,
    updateData,
    currentStep,
    nextStep,
    saveAndExit,
    selectedGroup,
    remainingDollars,
    estimatedEarnings,
    selectedPlan,
  } = useBrokerEnrollment();

  const [searchParams] = useSearchParams();
  
  // Sync step with URL
  useEffect(() => {
    const urlStep = parseInt(searchParams.get("step") || "1");
    if (urlStep !== 1) {
      // URL says different step, navigate there
    }
  }, [searchParams]);

  const isValid = 
    data.firstName.trim() !== "" &&
    data.lastName.trim() !== "" &&
    data.email.trim() !== "" &&
    data.zipCode.trim() !== "";

  return (
    <BrokerEnrollmentLayout
      currentStep={1}
      onSaveAndExit={saveAndExit}
      effectiveDate={data.effectiveDate}
      contributionAmount={data.contributionAmount}
      selectedPlanPremium={selectedPlan?.monthly_premium}
      remainingDollars={remainingDollars}
      estimatedEarnings={estimatedEarnings}
      individualName={data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined}
      groupName={selectedGroup?.name}
      showSummaryRail={false}
    >
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Individual Profile</CardTitle>
          <CardDescription>
            Create the enrollment record and capture identity information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => updateData({ firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => updateData({ lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>

          {/* DOB */}
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => updateData({ dateOfBirth: e.target.value })}
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => updateData({ phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => updateData({ address: e.target.value })}
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={data.city}
                onChange={(e) => updateData({ city: e.target.value })}
                placeholder="Miami"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={data.state}
                onChange={(e) => updateData({ state: e.target.value })}
                placeholder="FL"
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input
                id="zip"
                value={data.zipCode}
                onChange={(e) => updateData({ zipCode: e.target.value })}
                placeholder="33101"
                maxLength={5}
              />
            </div>
          </div>

          {/* Tobacco */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="tobacco" className="font-medium">Tobacco Use</Label>
              <p className="text-sm text-muted-foreground">
                Has the individual used tobacco in the last 12 months?
              </p>
            </div>
            <Switch
              id="tobacco"
              checked={data.tobacco}
              onCheckedChange={(checked) => updateData({ tobacco: checked })}
            />
          </div>

          {/* Info note */}
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            An invitation will be sent to the individual after enrollment is confirmed.
          </p>

          {/* Actions */}
          <div className="flex justify-end pt-4">
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
