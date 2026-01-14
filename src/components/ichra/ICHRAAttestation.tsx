import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, Shield, AlertTriangle } from "lucide-react";

interface ICHRAAttestationProps {
  enrollment: any;
  plans: any[];
  onAttest: () => void;
  onBack: () => void;
}

export function ICHRAAttestation({ 
  enrollment, 
  plans, 
  onAttest, 
  onBack 
}: ICHRAAttestationProps) {
  const [attestations, setAttestations] = useState({
    accurate: false,
    understand: false,
    authorize: false,
  });

  const selectedPlan = plans.find(p => p.id === enrollment?.selected_plan_id);
  const isExternalPlan = !selectedPlan && enrollment?.external_carrier_name;

  const allAttested = Object.values(attestations).every(Boolean);

  const toggleAttestation = (key: keyof typeof attestations) => {
    setAttestations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Review & Confirm</CardTitle>
          <CardDescription className="text-base">
            Please review your enrollment details and confirm your attestation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Your Selected Plan</h3>
            
            {selectedPlan ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrier</span>
                  <span className="font-medium">{selectedPlan.carrier_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Name</span>
                  <span className="font-medium">{selectedPlan.plan_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Type</span>
                  <span className="font-medium">{selectedPlan.plan_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Premium</span>
                  <span className="font-medium">${selectedPlan.monthly_premium}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coverage ZIP Code</span>
                  <span className="font-mono">{enrollment?.coverage_zip_code}</span>
                </div>
              </div>
            ) : isExternalPlan ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrier</span>
                  <span className="font-medium">{enrollment.external_carrier_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Name</span>
                  <span className="font-medium">{enrollment.external_plan_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Type</span>
                  <span className="font-medium">{enrollment.external_plan_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Premium</span>
                  <span className="font-medium">${enrollment.external_monthly_premium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Policy Number</span>
                  <span className="font-mono">{enrollment.external_policy_number}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No plan details available</p>
            )}
          </div>

          <Separator />

          {/* Attestation Checkboxes */}
          <div className="space-y-4">
            <h3 className="font-semibold">Attestation</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="accurate"
                  checked={attestations.accurate}
                  onCheckedChange={() => toggleAttestation("accurate")}
                />
                <Label htmlFor="accurate" className="text-sm leading-relaxed cursor-pointer">
                  I attest that the information I have provided is accurate and complete to the 
                  best of my knowledge. I understand that providing false information may result 
                  in loss of ICHRA benefits.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="understand"
                  checked={attestations.understand}
                  onCheckedChange={() => toggleAttestation("understand")}
                />
                <Label htmlFor="understand" className="text-sm leading-relaxed cursor-pointer">
                  I understand that I must maintain individual health insurance coverage that 
                  meets minimum essential coverage (MEC) requirements to receive ICHRA 
                  reimbursements from my employer.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="authorize"
                  checked={attestations.authorize}
                  onCheckedChange={() => toggleAttestation("authorize")}
                />
                <Label htmlFor="authorize" className="text-sm leading-relaxed cursor-pointer">
                  I authorize my employer and their ICHRA administrator to process my enrollment 
                  and reimbursement claims based on the information I have provided.
                </Label>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-600">Important</p>
              <p className="text-muted-foreground">
                By clicking "Complete Enrollment", you are making a binding benefits election 
                that will be reported to your employer. This decision cannot be easily changed 
                outside of qualifying life events.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button 
              className="flex-1"
              onClick={onAttest}
              disabled={!allAttested}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete Enrollment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
