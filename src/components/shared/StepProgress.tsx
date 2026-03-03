import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  optional?: boolean;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number; // 1-indexed
  className?: string;
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  const totalSteps = steps.length;

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop: full stepper with progress line */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          return (
            <div key={step.label} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && "bg-background border-primary text-primary",
                  !isCompleted && !isCurrent && "bg-background border-border text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 text-center whitespace-nowrap",
                  isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile: compact progress bar */}
      <div className="md:hidden space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="text-sm font-medium">
          {steps[currentStep - 1]?.label}
        </div>
      </div>
    </div>
  );
}
