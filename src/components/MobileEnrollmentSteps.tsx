import { CheckCircle2, Circle, ChevronRight, Shield, Heart, FileCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EnrollmentStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  status: "completed" | "current" | "upcoming";
  href: string;
}

const steps: EnrollmentStep[] = [
  {
    id: 1,
    title: "Choose Health Plan",
    description: "Select your primary medical coverage (ICHRA or Individual)",
    icon: Shield,
    status: "current",
    href: "/auth",
  },
  {
    id: 2,
    title: "Add Supplemental Benefits",
    description: "Optional: Dental, Vision, Life Insurance & more",
    icon: Heart,
    status: "upcoming",
    href: "/auth",
  },
  {
    id: 3,
    title: "Review & Confirm",
    description: "Review your selections and coverage details",
    icon: FileCheck,
    status: "upcoming",
    href: "/auth",
  },
  {
    id: 4,
    title: "Complete Enrollment",
    description: "Finalize payment and get your member ID",
    icon: CreditCard,
    status: "upcoming",
    href: "/auth",
  },
];

export const MobileEnrollmentSteps = () => {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-primary font-semibold text-sm mb-2">ENROLLMENT MADE SIMPLE</p>
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            4 Steps to Coverage
          </h2>
        </div>

        {/* Steps - Mobile Optimized */}
        <div className="space-y-3 max-w-lg mx-auto">
          {steps.map((step, index) => (
            <Link
              key={step.id}
              to={step.href}
              className={`block p-4 rounded-xl border transition-all ${
                step.status === "current" 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : step.status === "completed"
                  ? "border-accent/50 bg-accent/5"
                  : "border-border/50 bg-card/50"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Step Number/Status */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.status === "completed" 
                    ? "bg-accent text-accent-foreground" 
                    : step.status === "current"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="font-bold">{step.id}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <step.icon className={`h-4 w-4 ${
                      step.status === "current" ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <h3 className={`font-semibold text-sm ${
                      step.status === "current" ? "text-primary" : "text-foreground"
                    }`}>
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className={`h-5 w-5 flex-shrink-0 ${
                  step.status === "current" ? "text-primary" : "text-muted-foreground/50"
                }`} />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-6">
          <Button size="lg" className="gradient-primary border-0 w-full max-w-xs" asChild>
            <Link to="/auth">
              Start Enrollment
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
