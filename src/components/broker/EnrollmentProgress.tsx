import { VOLUNTARY_BENEFITS_ENABLED } from "@/lib/brokerMockData";
import { StepProgress } from "@/components/shared/StepProgress";

const ALL_STEPS = [
  { label: "Individual" },
  { label: "Household" },
  { label: "Contribution" },
  { label: "Plan" },
  { label: "Voluntary", optional: true },
  { label: "Confirm" },
];

interface EnrollmentProgressProps {
  currentStep: number;
  className?: string;
}

export function EnrollmentProgress({ currentStep, className }: EnrollmentProgressProps) {
  const steps = VOLUNTARY_BENEFITS_ENABLED
    ? ALL_STEPS
    : ALL_STEPS.filter((s) => s.label !== "Voluntary");
  return <StepProgress steps={steps} currentStep={currentStep} className={className} />;
}
