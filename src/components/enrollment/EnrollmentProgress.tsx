import { StepProgress } from "@/components/shared/StepProgress";

interface EnrollmentProgressProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function EnrollmentProgress({ currentStep, labels }: EnrollmentProgressProps) {
  return (
    <StepProgress
      steps={labels.map((label) => ({ label }))}
      currentStep={currentStep}
    />
  );
}
