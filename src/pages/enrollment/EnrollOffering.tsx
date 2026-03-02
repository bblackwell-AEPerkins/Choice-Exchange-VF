import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEnrollmentDB } from "@/hooks/useEnrollmentDB";
import { useEnrollmentConfig } from "@/stores/enrollmentConfigStore";
import { 
  Shield, 
  CheckCircle2, 
  Star, 
  Zap, 
  HeartPulse, 
  Phone, 
  Clock, 
  ArrowRight,
  Sparkles,
} from "lucide-react";

const OFFERING_FEATURES = [
  {
    icon: HeartPulse,
    title: "Comprehensive Health Coverage",
    description: "Access to a nationwide network of providers with flexible plan options tailored to your needs.",
  },
  {
    icon: Shield,
    title: "Financial Protection",
    description: "Predictable costs with defined allowances, deductibles, and out-of-pocket maximums.",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Dedicated support team available around the clock for claims, questions, and care coordination.",
  },
  {
    icon: Zap,
    title: "Digital-First Experience",
    description: "Manage your benefits, find providers, and track claims all from your device.",
  },
];

const INCLUDED_BENEFITS = [
  "Preventive care at no additional cost",
  "Prescription drug coverage",
  "Mental health & substance abuse services",
  "Emergency & urgent care",
  "Lab work & diagnostic imaging",
  "Telehealth visits included",
];

export default function EnrollOffering() {
  const navigate = useNavigate();
  const { 
    account,
    about,
    setStep, 
    isLoading, 
    canAccessStep, 
    saveToDatabase 
  } = useEnrollmentDB();
  const { isStepEnabled } = useEnrollmentConfig();

  useEffect(() => {
    if (!isLoading && !canAccessStep("coverage")) {
      navigate("/enroll");
    }
  }, [isLoading, canAccessStep, navigate]);

  const handleNext = () => {
    if (isStepEnabled("crosssell")) {
      navigate("/enroll/crosssell");
    } else {
      setStep("submit");
      navigate("/enroll/submit");
    }
  };

  const handleBack = () => {
    setStep("coverage");
    navigate("/enroll/coverage");
  };

  return (
    <EnrollmentLayout
      currentStep={6}
      totalSteps={8}
      title="Your New Edge Offering"
      description="Here's the coverage designed for you based on your profile."
      onSave={saveToDatabase}
    >
      {/* Personalized greeting */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {account.firstName ? `${account.firstName}, your` : "Your"} personalized coverage is ready
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your information, we've prepared the New Edge health coverage offering 
                {about.state ? ` available in ${about.state}` : ""}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Offering Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">
                Core Offering
              </Badge>
              <CardTitle className="text-xl">New Edge Health Coverage</CardTitle>
              <CardDescription>
                Comprehensive individual health coverage with modern benefits management
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Top Rated</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OFFERING_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30"
              >
                <feature.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Included benefits */}
          <div>
            <p className="font-medium text-sm mb-3">What's included:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INCLUDED_BENEFITS.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Value callout */}
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-accent flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Activate today, coverage starts immediately</p>
              <p className="text-xs text-muted-foreground">
                No waiting periods for preventive care. Full coverage effective on your selected start date.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <EnrollmentNavigation
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={isStepEnabled("crosssell") ? "Continue" : "Proceed to Payment"}
      />
    </EnrollmentLayout>
  );
}
