import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Save } from "lucide-react";
import { EnrollmentProgress } from "./EnrollmentProgress";
import { EnrollmentSummaryRail } from "./EnrollmentSummaryRail";
import { VOLUNTARY_BENEFITS_ENABLED } from "@/lib/brokerMockData";

interface BrokerEnrollmentLayoutProps {
  children: ReactNode;
  currentStep: number;
  onBack?: () => void;
  onSaveAndExit: () => void;
  // Summary rail data
  effectiveDate?: string;
  contributionAmount: number;
  selectedPlanPremium?: number;
  remainingDollars: number;
  estimatedEarnings: number;
  individualName?: string;
  groupName?: string;
  // Show rail only on steps 3-6
  showSummaryRail?: boolean;
}

export function BrokerEnrollmentLayout({
  children,
  currentStep,
  onBack,
  onSaveAndExit,
  effectiveDate,
  contributionAmount,
  selectedPlanPremium,
  remainingDollars,
  estimatedEarnings,
  individualName,
  groupName,
  showSummaryRail = currentStep >= 3,
}: BrokerEnrollmentLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack || (() => navigate("/broker/home"))}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <span className="text-lg font-bold text-primary">ICHRA Enrollment</span>
              <span className="text-xs text-muted-foreground ml-2">
                New Individual
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onSaveAndExit}>
              <Save className="h-4 w-4 mr-2" />
              Save & Exit
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/broker/home")}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Progress tracker */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <EnrollmentProgress currentStep={currentStep} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`grid gap-8 ${showSummaryRail ? "lg:grid-cols-[1fr,320px]" : ""}`}>
            {/* Form content */}
            <div className="min-w-0">
              {children}
            </div>

            {/* Summary rail - visible on steps 3-6 */}
            {showSummaryRail && (
              <aside className="hidden lg:block">
                <EnrollmentSummaryRail
                  effectiveDate={effectiveDate}
                  contributionAmount={contributionAmount}
                  selectedPlanPremium={selectedPlanPremium}
                  remainingDollars={remainingDollars}
                  estimatedEarnings={estimatedEarnings}
                  individualName={individualName}
                  groupName={groupName}
                />
              </aside>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
