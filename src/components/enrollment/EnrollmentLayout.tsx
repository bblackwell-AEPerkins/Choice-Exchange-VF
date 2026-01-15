import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle, Save, X } from "lucide-react";
import { EnrollmentProgress } from "./EnrollmentProgress";

interface EnrollmentLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  onSave?: () => void;
  showProgress?: boolean;
}

const STEP_LABELS = [
  "Intent",
  "Account",
  "About You",
  "Household",
  "Coverage",
  "Plans",
  "Review",
  "Submit",
];

export function EnrollmentLayout({
  children,
  currentStep,
  totalSteps,
  title,
  description,
  onSave,
  showProgress = true,
}: EnrollmentLayoutProps) {
  const navigate = useNavigate();

  const handleSaveAndExit = () => {
    if (onSave) {
      onSave();
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            Choice Exchange
          </Link>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to="/support">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveAndExit}
            >
              <Save className="h-4 w-4 mr-2" />
              Save & Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Tracker */}
      {showProgress && (
        <div className="border-b border-border bg-card/30">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <EnrollmentProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              labels={STEP_LABELS.slice(0, totalSteps)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {description}
            </p>
          </div>

          {/* Page Content */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Your information is encrypted and secure.{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
