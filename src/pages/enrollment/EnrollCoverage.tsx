import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEnrollment } from "@/hooks/useEnrollment";
import { Calendar, FileCheck, AlertCircle } from "lucide-react";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const QUALIFYING_EVENTS = [
  { value: "lost_coverage", label: "Lost job-based coverage" },
  { value: "marriage", label: "Got married" },
  { value: "birth", label: "Had a baby or adopted a child" },
  { value: "divorce", label: "Got divorced" },
  { value: "moved", label: "Moved to a new state" },
  { value: "aged_out", label: "Aged off parent's plan" },
  { value: "income_change", label: "Lost Medicaid/CHIP eligibility" },
  { value: "other", label: "Other qualifying event" },
];

export default function EnrollCoverage() {
  const navigate = useNavigate();
  const { intent, coverage, about, updateCoverage, setStep } = useEnrollment();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isQualifyingEvent = intent.enrollmentReason === "qualifying_event";

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!coverage.stateOfResidence) {
      newErrors.stateOfResidence = "State of residence is required";
    }
    if (!coverage.desiredStartDate) {
      newErrors.desiredStartDate = "Coverage start date is required";
    }
    if (isQualifyingEvent) {
      if (!coverage.qualifyingEventType) {
        newErrors.qualifyingEventType = "Qualifying event type is required";
      }
      if (!coverage.qualifyingEventDate) {
        newErrors.qualifyingEventDate = "Event date is required";
      }
      if (!coverage.hasDocumentation) {
        newErrors.hasDocumentation = "You must acknowledge documentation requirements";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep("plans");
      navigate("/enroll/plans");
    }
  };

  const handleBack = () => {
    setStep("household");
    navigate("/enroll/household");
  };

  return (
    <EnrollmentLayout
      currentStep={5}
      totalSteps={8}
      title="Coverage Details"
      description="Let's confirm your coverage timing and any special enrollment circumstances."
    >
      {/* State and Start Date */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Coverage Timing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>State of Residence</Label>
              <Select
                value={coverage.stateOfResidence || about.state}
                onValueChange={(value) => updateCoverage({ stateOfResidence: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.stateOfResidence && (
                <p className="text-sm text-destructive">{errors.stateOfResidence}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Desired Coverage Start Date</Label>
              <Input
                type="date"
                value={coverage.desiredStartDate}
                onChange={(e) => updateCoverage({ desiredStartDate: e.target.value })}
              />
              {errors.desiredStartDate && (
                <p className="text-sm text-destructive">{errors.desiredStartDate}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Qualifying Life Event Details */}
      {isQualifyingEvent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Qualifying Life Event
            </CardTitle>
            <CardDescription>
              You indicated you're enrolling due to a qualifying life event. Please provide details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>What type of event occurred?</Label>
              <Select
                value={coverage.qualifyingEventType}
                onValueChange={(value) => updateCoverage({ qualifyingEventType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {QUALIFYING_EVENTS.map((event) => (
                    <SelectItem key={event.value} value={event.value}>
                      {event.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.qualifyingEventType && (
                <p className="text-sm text-destructive">{errors.qualifyingEventType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>When did this event occur?</Label>
              <Input
                type="date"
                value={coverage.qualifyingEventDate}
                onChange={(e) => updateCoverage({ qualifyingEventDate: e.target.value })}
              />
              {errors.qualifyingEventDate && (
                <p className="text-sm text-destructive">{errors.qualifyingEventDate}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Most events allow enrollment within 60 days of the event date.
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
              <Checkbox
                id="documentation"
                checked={coverage.hasDocumentation}
                onCheckedChange={(checked) =>
                  updateCoverage({ hasDocumentation: checked === true })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="documentation" className="cursor-pointer">
                  I understand I may need to provide documentation
                </Label>
                <p className="text-xs text-muted-foreground">
                  You may be asked to upload supporting documents (e.g., marriage certificate, termination letter, birth certificate) to verify your qualifying event.
                </p>
              </div>
            </div>
            {errors.hasDocumentation && (
              <p className="text-sm text-destructive">{errors.hasDocumentation}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Prior Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Prior Coverage & Health Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Do you currently have health insurance coverage?</Label>
            <RadioGroup
              value={coverage.hasPriorCoverage ? "yes" : "no"}
              onValueChange={(value) =>
                updateCoverage({ hasPriorCoverage: value === "yes" })
              }
              className="flex gap-4"
            >
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="yes" />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="no" />
                <span>No</span>
              </label>
            </RadioGroup>
          </div>

          {coverage.hasPriorCoverage && (
            <div className="space-y-2">
              <Label>When will/did your current coverage end?</Label>
              <Input
                type="date"
                value={coverage.priorCoverageEndDate}
                onChange={(e) => updateCoverage({ priorCoverageEndDate: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-4">
            <Label>Have you used tobacco products in the past 12 months?</Label>
            <RadioGroup
              value={coverage.tobaccoUse ? "yes" : "no"}
              onValueChange={(value) =>
                updateCoverage({ tobaccoUse: value === "yes" })
              }
              className="flex gap-4"
            >
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="yes" />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="no" />
                <span>No</span>
              </label>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Tobacco use may affect your premium in some states.
            </p>
          </div>
        </CardContent>
      </Card>

      <EnrollmentNavigation
        onBack={handleBack}
        onNext={handleNext}
      />
    </EnrollmentLayout>
  );
}
