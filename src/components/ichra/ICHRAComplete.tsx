import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  XCircle, 
  Download, 
  Home, 
  Calendar,
  Building2,
  FileText
} from "lucide-react";
import { format } from "date-fns";

interface ICHRACompleteProps {
  enrollment: any;
  employer: {
    name: string;
  };
}

export function ICHRAComplete({ enrollment, employer }: ICHRACompleteProps) {
  const navigate = useNavigate();
  
  const isEnrolled = enrollment?.status === "enrolled";
  const isWaived = enrollment?.status === "waived";

  return (
    <div className="space-y-6">
      <Card className={`border-2 ${isEnrolled ? 'border-accent/50 bg-accent/5' : 'border-muted'}`}>
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isEnrolled ? 'bg-accent/20' : 'bg-muted'
          }`}>
            {isEnrolled ? (
              <CheckCircle2 className="h-8 w-8 text-accent" />
            ) : (
              <XCircle className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isEnrolled ? "Enrollment Complete!" : "Waiver Submitted"}
          </CardTitle>
          <CardDescription className="text-base">
            {isEnrolled 
              ? "Your ICHRA enrollment has been successfully submitted and recorded."
              : "Your decision to waive ICHRA coverage has been recorded."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className={`text-lg px-4 py-2 ${
                isEnrolled 
                  ? 'bg-accent/10 text-accent border-accent/30' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              Status: {isEnrolled ? "Enrolled" : "Waived"}
            </Badge>
          </div>

          {/* Summary */}
          <div className="bg-background rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Employer</p>
                <p className="font-medium">{employer.name}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Completed On</p>
                <p className="font-medium">
                  {enrollment?.enrollment_completed_at 
                    ? format(new Date(enrollment.enrollment_completed_at), "MMMM d, yyyy 'at' h:mm a")
                    : format(new Date(), "MMMM d, yyyy 'at' h:mm a")
                  }
                </p>
              </div>
            </div>

            {isEnrolled && enrollment?.selected_plan_id && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Plan</p>
                    <p className="font-medium">
                      {enrollment.external_carrier_name 
                        ? `${enrollment.external_carrier_name} - ${enrollment.external_plan_name}`
                        : "Plan details on file"
                      }
                    </p>
                  </div>
                </div>
              </>
            )}

            {isWaived && enrollment?.waiver_reason && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Waiver Reason</p>
                    <p className="font-medium">{enrollment.waiver_reason}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Next Steps */}
          {isEnrolled && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">What's Next?</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Your enrollment information has been sent to your employer</li>
                <li>• Reimbursements will begin once your coverage is verified</li>
                <li>• Keep your policy documents for your records</li>
                <li>• Contact HR if you have any questions about your benefit</li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {/* TODO: Generate PDF confirmation */}}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Confirmation
            </Button>
            <Button 
              className="flex-1"
              onClick={() => navigate("/individual/home")}
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground mb-2">
            Need help or have questions about your ICHRA?
          </p>
          <Button variant="link" onClick={() => navigate("/support")}>
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
