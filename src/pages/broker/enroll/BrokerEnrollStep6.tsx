import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrokerEnrollment } from "@/hooks/useBrokerEnrollment";
import { BrokerEnrollmentLayout } from "@/components/broker/BrokerEnrollmentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Check, 
  Send, 
  User, 
  Users, 
  Calendar, 
  DollarSign, 
  Shield, 
  CreditCard,
  Loader2,
  CheckCircle,
  FileText,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock voluntary benefits for display
const voluntaryBenefitNames: Record<string, string> = {
  dental: "Dental Coverage",
  vision: "Vision Coverage",
  life: "Term Life Insurance",
  disability: "Short-Term Disability",
  accident: "Accident Insurance",
  critical: "Critical Illness",
};

export default function BrokerEnrollStep6() {
  const navigate = useNavigate();
  const {
    data,
    prevStep,
    saveAndExit,
    submitEnrollment,
    isSubmitting,
    selectedGroup,
    remainingDollars,
    estimatedEarnings,
    selectedPlan,
  } = useBrokerEnrollment();

  const [confirmed, setConfirmed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async () => {
    const success = await submitEnrollment();
    if (success) {
      setIsComplete(true);
    }
  };

  // Success state
  if (isComplete) {
    return (
      <BrokerEnrollmentLayout
        currentStep={6}
        onSaveAndExit={saveAndExit}
        effectiveDate={data.effectiveDate}
        contributionAmount={data.contributionAmount}
        selectedPlanPremium={selectedPlan?.monthly_premium}
        remainingDollars={remainingDollars}
        estimatedEarnings={estimatedEarnings}
        individualName={`${data.firstName} ${data.lastName}`}
        groupName={selectedGroup?.name}
      >
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Enrollment Complete!
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              An invitation has been sent to {data.email}. They will receive instructions to confirm their enrollment.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-8 inline-block">
              <p className="text-sm text-muted-foreground">Confirmation Number</p>
              <p className="text-xl font-mono font-bold text-foreground">
                ENR-{Date.now().toString().slice(-8)}
              </p>
            </div>

            <div className="space-y-3 text-left max-w-sm mx-auto mb-8">
              <h3 className="font-medium text-foreground">Next Steps</h3>
              <div className="flex items-start gap-3 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">Individual reviews and confirms enrollment</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">Benefits card will be activated after confirmation</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">Coverage begins on effective date</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/broker/home")}>
                Return to Dashboard
              </Button>
              <Button onClick={() => navigate("/broker/enroll/new")}>
                Start Another Enrollment
              </Button>
            </div>
          </CardContent>
        </Card>
      </BrokerEnrollmentLayout>
    );
  }

  return (
    <BrokerEnrollmentLayout
      currentStep={6}
      onBack={prevStep}
      onSaveAndExit={saveAndExit}
      effectiveDate={data.effectiveDate}
      contributionAmount={data.contributionAmount}
      selectedPlanPremium={selectedPlan?.monthly_premium}
      remainingDollars={remainingDollars}
      estimatedEarnings={estimatedEarnings}
      individualName={`${data.firstName} ${data.lastName}`}
      groupName={selectedGroup?.name}
    >
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Funding Summary & Confirmation</CardTitle>
            <CardDescription>
              Review all details before sending the enrollment invitation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Individual & Household */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Individual & Household
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{data.firstName} {data.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{data.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Coverage Type</span>
                  <span className="text-sm font-medium capitalize">{data.coverageType}</span>
                </div>
                {data.dependents.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Dependents</span>
                    <span className="text-sm font-medium">{data.dependents.length}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Plan & Contribution */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-4 w-4" />
                Medical Plan & Contribution
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Group</span>
                  <span className="text-sm font-medium">{selectedGroup?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Effective Date</span>
                  <span className="text-sm font-medium">
                    {data.effectiveDate ? format(new Date(data.effectiveDate), "MMM d, yyyy") : "-"}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Selected Plan</span>
                  <span className="text-sm font-medium">{selectedPlan?.plan_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plan Premium</span>
                  <span className="text-sm font-medium">${selectedPlan?.monthly_premium}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Employer Contribution</span>
                  <span className="text-sm font-medium text-green-600">-${data.contributionAmount}/mo</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Remaining Dollars</span>
                  <span className={cn(
                    "text-sm font-bold",
                    remainingDollars >= 0 ? "text-green-600" : "text-destructive"
                  )}>
                    ${remainingDollars.toFixed(0)}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Voluntary Benefits */}
            {data.voluntaryBenefits.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    Voluntary Benefits
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    {data.voluntaryBenefits.map((id) => (
                      <div key={id} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {voluntaryBenefitNames[id] || id}
                        </span>
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Broker Earnings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Estimated Earnings
              </div>
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Earnings on this enrollment
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ${estimatedEarnings.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Confirmation checkbox */}
            <div className="flex items-start gap-3 p-4 rounded-lg border">
              <Checkbox
                id="confirm"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked as boolean)}
              />
              <Label htmlFor="confirm" className="text-sm leading-relaxed cursor-pointer">
                I confirm that all information is accurate and I'm authorized to enroll 
                this individual in the selected plan. An invitation email will be sent 
                to {data.email}.
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!confirmed || isSubmitting}
            className="min-w-[180px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </div>
      </div>
    </BrokerEnrollmentLayout>
  );
}
