import { useLocation } from "react-router-dom";
import { IndividualShell } from "@/components/shells/IndividualShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  ArrowRight,
  DollarSign,
  Shield,
  FileText,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  Wallet
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for individual dashboard
const memberData = {
  firstName: "Alex",
  employerName: "Acme Corporation",
  enrollmentStatus: "in_progress",
  enrollmentStep: 3,
  totalSteps: 8,
  enrollmentDeadline: "Feb 15, 2026",
  daysRemaining: 13,
  monthlyAllowance: 450,
  usedAllowance: 0,
  selectedPlan: null,
};

const benefits = [
  { 
    id: "ichra", 
    name: "Health Insurance (ICHRA)", 
    status: "pending",
    description: "Choose from marketplace plans",
    icon: Shield,
    color: "primary"
  },
  { 
    id: "dental", 
    name: "Dental", 
    status: "not_selected",
    description: "Optional coverage",
    icon: Heart,
    color: "accent"
  },
  { 
    id: "vision", 
    name: "Vision", 
    status: "not_selected",
    description: "Optional coverage",
    icon: Heart,
    color: "accent"
  },
];

const enrollmentSteps = [
  { step: 1, name: "Intent", completed: true },
  { step: 2, name: "Account", completed: true },
  { step: 3, name: "About You", completed: false, current: true },
  { step: 4, name: "Household", completed: false },
  { step: 5, name: "Coverage", completed: false },
  { step: 6, name: "Plans", completed: false },
  { step: 7, name: "Review", completed: false },
  { step: 8, name: "Submit", completed: false },
];

function EnrollmentContent() {
  const progressPercent = Math.round((memberData.enrollmentStep / memberData.totalSteps) * 100);

  return (
    <>
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Welcome, {memberData.firstName}
        </h1>
        <p className="text-muted-foreground">
          Complete your enrollment to access your {memberData.employerName} benefits.
        </p>
      </div>

      {/* Enrollment CTA Card */}
      <Card className="mb-8 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-amber-light text-amber-700 border-amber-300">
                  <Clock className="h-3 w-3 mr-1" />
                  {memberData.daysRemaining} days left
                </Badge>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Continue Your Enrollment
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                You're {progressPercent}% complete. Finish by {memberData.enrollmentDeadline} to secure your coverage.
              </p>
              <Progress value={progressPercent} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                Step {memberData.enrollmentStep} of {memberData.totalSteps}: {enrollmentSteps.find(s => s.current)?.name}
              </p>
            </div>
            <Button size="lg" asChild className="md:min-w-[200px]">
              <Link to="/enroll">
                Continue Enrollment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Allowance Card */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Your ICHRA Allowance
            </CardTitle>
            <Badge variant="outline">From {memberData.employerName}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-foreground">${memberData.monthlyAllowance}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your employer contributes this amount toward your health insurance premium each month. 
            Choose a plan that fits your needs—if the premium is lower, keep the savings. If it's higher, pay the difference.
          </p>
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 text-accent">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Tax-free benefit</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your allowance is not taxable income
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
            <CardDescription>Resources to guide your enrollment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-3" />
              Talk to a Benefits Advisor
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-3" />
              Understanding Your ICHRA
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="h-4 w-4 mr-3" />
              Find Doctors Near You
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enrollment Checklist</CardTitle>
            <CardDescription>Steps to complete your enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {enrollmentSteps.slice(0, 5).map((step) => (
                <div
                  key={step.step}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    step.current ? 'bg-primary/10' : ''
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-accent" />
                  ) : step.current ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span className={`text-sm ${
                    step.completed ? 'text-muted-foreground line-through' :
                    step.current ? 'text-foreground font-medium' :
                    'text-muted-foreground'
                  }`}>
                    {step.name}
                  </span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                +{enrollmentSteps.length - 5} more steps
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function WalletContent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Your Wallet
        </h1>
        <p className="text-muted-foreground">
          Track your ICHRA allowance and reimbursement history.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              ICHRA Allowance
            </CardTitle>
            <Badge variant="outline">From {memberData.employerName}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-foreground">${memberData.monthlyAllowance}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 text-accent">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Tax-free benefit</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your allowance is not taxable income
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Reimbursement History
          </CardTitle>
          <CardDescription>Your ICHRA allowance and reimbursement history will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">
              Once you're enrolled, your monthly reimbursements will be tracked here.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function BenefitsContent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Your Benefits
        </h1>
        <p className="text-muted-foreground">
          View and manage your available benefits coverage.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {benefits.map((benefit) => (
          <Card key={benefit.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-${benefit.color}/10 flex items-center justify-center`}>
                  <benefit.icon className={`h-5 w-5 text-${benefit.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{benefit.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{benefit.description}</p>
                  <Badge 
                    variant="outline"
                    className={
                      benefit.status === 'enrolled' ? 'bg-accent/10 text-accent border-accent/30' :
                      benefit.status === 'pending' ? 'bg-amber-light text-amber-700 border-amber-300' :
                      ''
                    }
                  >
                    {benefit.status === 'enrolled' ? 'Enrolled' :
                     benefit.status === 'pending' ? 'Selection Needed' : 'Optional'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export default function IndividualHome() {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case "/individual/wallet":
        return <WalletContent />;
      case "/individual/benefits":
        return <BenefitsContent />;
      default:
        return <EnrollmentContent />;
    }
  };

  return (
    <IndividualShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </IndividualShell>
  );
}
