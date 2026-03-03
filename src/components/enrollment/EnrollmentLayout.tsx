import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle, Save, Shield } from "lucide-react";
import { EnrollmentProgress } from "./EnrollmentProgress";

interface EnrollmentLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  onSave?: () => Promise<void> | void;
  showProgress?: boolean;
  wide?: boolean;
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
  wide = false,
}: EnrollmentLayoutProps) {
  const navigate = useNavigate();

  const handleSaveAndExit = async () => {
    if (onSave) {
      await onSave();
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex flex-col">
      {/* Header */}
      <header className="bg-white/95 dark:bg-card/98 backdrop-blur-md border-b border-border shadow-card sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold font-display text-gradient-primary">Choice Exchange</span>
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
        <div className="border-b border-border bg-white/60 dark:bg-card/30">
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
      <main className="flex-1 py-8 md:py-12 pb-24">
        <div className={wide ? "max-w-6xl mx-auto px-4" : "max-w-2xl mx-auto px-4"}>
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-display">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground text-lg">
                {description}
              </p>
            )}
          </div>

          {/* Page Content */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 bg-white/60 dark:bg-card/30">
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
