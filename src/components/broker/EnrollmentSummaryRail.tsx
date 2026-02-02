import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, FileText, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface EnrollmentSummaryRailProps {
  effectiveDate?: string;
  contributionAmount: number;
  selectedPlanPremium?: number;
  remainingDollars: number;
  estimatedEarnings: number;
  individualName?: string;
  groupName?: string;
}

export function EnrollmentSummaryRail({
  effectiveDate,
  contributionAmount,
  selectedPlanPremium,
  remainingDollars,
  estimatedEarnings,
  individualName,
  groupName,
}: EnrollmentSummaryRailProps) {
  const formattedDate = effectiveDate 
    ? format(new Date(effectiveDate), "MMM d, yyyy")
    : "Not set";

  return (
    <Card className="sticky top-24 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Enrollment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Individual & Group */}
        {(individualName || groupName) && (
          <>
            <div className="space-y-1">
              {individualName && (
                <p className="text-sm font-medium text-foreground">{individualName}</p>
              )}
              {groupName && (
                <p className="text-xs text-muted-foreground">{groupName}</p>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Effective Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Effective Date
          </div>
          <span className="text-sm font-medium text-foreground">
            {formattedDate}
          </span>
        </div>

        {/* Contribution */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            Contribution
          </div>
          <span className="text-sm font-medium text-foreground">
            {contributionAmount > 0 ? `$${contributionAmount}/mo` : "Not set"}
          </span>
        </div>

        {/* Plan Premium - only show if selected */}
        {selectedPlanPremium !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Plan Premium</span>
            <span className="text-sm font-medium text-foreground">
              ${selectedPlanPremium}/mo
            </span>
          </div>
        )}

        <Separator />

        {/* Remaining Dollars */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Remaining Dollars
          </span>
          <span className={`text-lg font-bold ${remainingDollars >= 0 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
            ${remainingDollars.toFixed(0)}
          </span>
        </div>

        <Separator />

        {/* Broker Earnings */}
        <div className="bg-primary/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Estimated Earnings
            </span>
          </div>
          <span className="text-lg font-bold text-foreground">
            ${estimatedEarnings.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
