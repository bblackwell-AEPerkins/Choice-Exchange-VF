import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { VOLUNTARY_BENEFITS_ENABLED } from "@/lib/brokerMockData";

const ALL_STEPS = [
  { number: 1, label: "Individual" },
  { number: 2, label: "Household" },
  { number: 3, label: "Contribution" },
  { number: 4, label: "Plan" },
  { number: 5, label: "Voluntary", optional: true },
  { number: 6, label: "Confirm" },
];

interface EnrollmentProgressProps {
  currentStep: number;
  className?: string;
}

export function EnrollmentProgress({ currentStep, className }: EnrollmentProgressProps) {
  // Filter steps based on feature flags
  const steps = VOLUNTARY_BENEFITS_ENABLED 
    ? ALL_STEPS 
    : ALL_STEPS.filter(s => s.number !== 5).map((s, i) => ({ ...s, number: i + 1 }));
  
  const totalSteps = steps.length;

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop horizontal stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-border" />
        
        {/* Progress line filled */}
        <div 
          className="absolute left-0 top-4 h-0.5 bg-primary transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        
        {/* Steps */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium transition-colors",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile compact stepper */}
      <div className="md:hidden flex items-center gap-3">
        <span className="text-sm font-medium text-primary">
          Step {currentStep} of {totalSteps}
        </span>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {steps.find(s => s.number === currentStep)?.label}
        </span>
      </div>
    </div>
  );
}
