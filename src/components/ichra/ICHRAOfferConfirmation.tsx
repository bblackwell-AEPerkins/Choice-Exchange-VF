import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  XCircle 
} from "lucide-react";
import { format } from "date-fns";

interface ICHRAOfferConfirmationProps {
  employer: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  offer: {
    monthly_allowance: number;
    effective_date: string;
    enrollment_start_date: string;
    enrollment_end_date: string;
    plan_year_start: string;
    plan_year_end: string;
  };
  onStart: () => void;
  onWaive: () => void;
}

export function ICHRAOfferConfirmation({ 
  employer, 
  offer, 
  onStart, 
  onWaive 
}: ICHRAOfferConfirmationProps) {
  const isEnrollmentOpen = () => {
    const now = new Date();
    const start = new Date(offer.enrollment_start_date);
    const end = new Date(offer.enrollment_end_date);
    return now >= start && now <= end;
  };

  const daysRemaining = () => {
    const now = new Date();
    const end = new Date(offer.enrollment_end_date);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Your ICHRA Offer</CardTitle>
          <CardDescription className="text-base">
            {employer.name} is offering you employer-sponsored health coverage through an Individual Coverage HRA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Allowance Highlight */}
          <div className="bg-background rounded-xl p-6 text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">Monthly Allowance</p>
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="h-8 w-8 text-accent" />
              <span className="text-5xl font-bold text-foreground">{offer.monthly_allowance}</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Tax-free reimbursement for your health insurance premiums
            </p>
          </div>

          {/* Key Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Coverage Effective
              </div>
              <p className="font-semibold">
                {format(new Date(offer.effective_date), "MMMM d, yyyy")}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Plan Year
              </div>
              <p className="font-semibold">
                {format(new Date(offer.plan_year_start), "MMM d, yyyy")} - {format(new Date(offer.plan_year_end), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          {/* Enrollment Window Status */}
          {isEnrollmentOpen() ? (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-accent">Enrollment Window Open</p>
                <p className="text-sm text-muted-foreground">
                  You have {daysRemaining()} days remaining to complete your enrollment 
                  (ends {format(new Date(offer.enrollment_end_date), "MMMM d, yyyy")})
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-600">Enrollment Period</p>
                <p className="text-sm text-muted-foreground">
                  Enrollment opens {format(new Date(offer.enrollment_start_date), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* What is ICHRA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What is ICHRA?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            An Individual Coverage Health Reimbursement Arrangement (ICHRA) is an employer-funded 
            benefit that reimburses you for individual health insurance premiums and qualified 
            medical expenses.
          </p>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">You Choose Your Plan</p>
                <p className="text-sm text-muted-foreground">
                  Select the individual health plan that best fits your needs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">Tax-Free Benefit</p>
                <p className="text-sm text-muted-foreground">
                  Your allowance is not subject to income or payroll taxes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">Portable Coverage</p>
                <p className="text-sm text-muted-foreground">
                  Your health plan stays with you, even if you change jobs
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          size="lg" 
          className="flex-1 h-14 text-lg"
          onClick={onStart}
          disabled={!isEnrollmentOpen()}
        >
          Start Enrollment
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="h-14"
          onClick={onWaive}
        >
          <XCircle className="mr-2 h-5 w-5" />
          Waive Coverage
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        By proceeding, you acknowledge that this is a formal benefits enrollment decision 
        that will be recorded by your employer.
      </p>
    </div>
  );
}
