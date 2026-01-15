import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEnrollmentDB } from "@/hooks/useEnrollmentDB";
import { Heart, Users, Calendar, AlertCircle, Loader2 } from "lucide-react";

export default function EnrollIntent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    intent, 
    updateIntent, 
    setStep, 
    isLoading,
    currentStep,
    isSaving,
  } = useEnrollmentDB();

  // Resume from saved step if coming back with resume flag
  useEffect(() => {
    if (!isLoading && currentStep !== "intent" && location.state?.resume) {
      const stepRoutes: Record<string, string> = {
        account: "/enroll/account",
        about: "/enroll/about",
        household: "/enroll/household",
        coverage: "/enroll/coverage",
        plans: "/enroll/plans",
        review: "/enroll/review",
        submit: "/enroll/submit",
      };
      const route = stepRoutes[currentStep];
      if (route) {
        navigate(route);
      }
    }
  }, [isLoading, currentStep, location.state, navigate]);

  const canProceed =
    intent.coverageType &&
    intent.coverageFor &&
    intent.enrollmentReason;

  const handleNext = () => {
    if (canProceed) {
      setStep("account");
      navigate("/enroll/account");
    }
  };

  if (isLoading) {
    return (
      <EnrollmentLayout
        currentStep={1}
        totalSteps={8}
        title="Loading..."
        description="Please wait while we load your enrollment."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </EnrollmentLayout>
    );
  }

  return (
    <EnrollmentLayout
      currentStep={1}
      totalSteps={8}
      title="Let's Get Started"
      description="Tell us a bit about what you're looking for so we can guide you through the right enrollment path."
    >
      {/* Saving indicator */}
      {isSaving && (
        <div className="fixed top-4 right-4 flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-2 shadow-sm z-50">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving...
        </div>
      )}

      {/* Coverage Type */}
      <Card>
        <CardContent className="pt-6">
          <Label className="text-base font-medium text-foreground mb-4 block">
            What type of coverage are you enrolling in?
          </Label>
          <RadioGroup
            value={intent.coverageType || ""}
            onValueChange={(value) =>
              updateIntent({ coverageType: value as "health" })
            }
          >
            <label className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <RadioGroupItem value="health" id="health" />
              <Heart className="h-5 w-5 text-primary" />
              <div>
                <span className="font-medium">Health Insurance</span>
                <p className="text-sm text-muted-foreground">
                  Medical, prescription, and preventive care coverage
                </p>
              </div>
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Coverage For */}
      <Card>
        <CardContent className="pt-6">
          <Label className="text-base font-medium text-foreground mb-4 block">
            Who is this coverage for?
          </Label>
          <RadioGroup
            value={intent.coverageFor || ""}
            onValueChange={(value) =>
              updateIntent({ coverageFor: value as "individual" | "family" })
            }
            className="space-y-3"
          >
            <label className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <RadioGroupItem value="individual" id="individual" />
              <div className="flex-1">
                <span className="font-medium">Just me</span>
                <p className="text-sm text-muted-foreground">
                  Individual coverage for yourself only
                </p>
              </div>
            </label>
            <label className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <RadioGroupItem value="family" id="family" />
              <Users className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <span className="font-medium">Me and my dependents</span>
                <p className="text-sm text-muted-foreground">
                  Coverage for yourself, spouse, and/or children
                </p>
              </div>
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Enrollment Reason */}
      <Card>
        <CardContent className="pt-6">
          <Label className="text-base font-medium text-foreground mb-4 block">
            Why are you enrolling now?
          </Label>
          <RadioGroup
            value={intent.enrollmentReason || ""}
            onValueChange={(value) =>
              updateIntent({
                enrollmentReason: value as "open_enrollment" | "qualifying_event",
              })
            }
            className="space-y-3"
          >
            <label className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <RadioGroupItem value="open_enrollment" id="open_enrollment" />
              <Calendar className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <span className="font-medium">Open Enrollment</span>
                <p className="text-sm text-muted-foreground">
                  It's my company's open enrollment period
                </p>
              </div>
            </label>
            <label className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <RadioGroupItem value="qualifying_event" id="qualifying_event" />
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div className="flex-1">
                <span className="font-medium">Qualifying Life Event</span>
                <p className="text-sm text-muted-foreground">
                  Marriage, new baby, job change, loss of coverage, etc.
                </p>
              </div>
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      <EnrollmentNavigation
        onNext={handleNext}
        nextLabel="Continue"
        disabled={!canProceed}
        showBack={false}
      />
    </EnrollmentLayout>
  );
}
