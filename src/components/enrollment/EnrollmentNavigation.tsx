import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface EnrollmentNavigationProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  showBack?: boolean;
}

export function EnrollmentNavigation({
  onBack,
  onNext,
  nextLabel = "Continue",
  backLabel = "Back",
  isLoading = false,
  disabled = false,
  showBack = true,
}: EnrollmentNavigationProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border mt-8">
      {showBack && onBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backLabel}
        </Button>
      )}
      
      <Button
        type="button"
        onClick={onNext}
        disabled={disabled || isLoading}
        className="flex-1 sm:ml-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
