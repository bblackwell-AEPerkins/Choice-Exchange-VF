import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEnrollment } from "@/hooks/useEnrollment";
import { Heart, Users, Calendar, AlertCircle } from "lucide-react";

export default function EnrollIntent() {
  const navigate = useNavigate();
  const { intent, updateIntent, setStep } = useEnrollment();

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

  return (
    <EnrollmentLayout
      currentStep={1}
      totalSteps={8}
      title="Let's Get Started"
      description="Tell us a bit about what you're looking for so we can guide you through the right enrollment path."
    >
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
