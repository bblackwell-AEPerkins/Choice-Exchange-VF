import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useICHRAEnrollment } from "@/hooks/useICHRAEnrollment";
import { ICHRAOfferConfirmation } from "@/components/ichra/ICHRAOfferConfirmation";
import { ICHRAZipCodeEntry } from "@/components/ichra/ICHRAZipCodeEntry";
import { ICHRAPlanSelection } from "@/components/ichra/ICHRAPlanSelection";
import { ICHRAExternalPlanForm } from "@/components/ichra/ICHRAExternalPlanForm";
import { ICHRAAttestation } from "@/components/ichra/ICHRAAttestation";
import { ICHRAWaiver } from "@/components/ichra/ICHRAWaiver";
import { ICHRAComplete } from "@/components/ichra/ICHRAComplete";
import { Shield, Clock, ArrowLeft } from "lucide-react";

type EnrollmentStep = 
  | "offer" 
  | "zip" 
  | "plans" 
  | "external" 
  | "attest" 
  | "waiver" 
  | "complete";

const ICHRAEnroll = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<EnrollmentStep>("offer");
  const [zipCode, setZipCode] = useState("");
  const [useExternalPlan, setUseExternalPlan] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const {
    loading,
    user,
    employer,
    offer,
    enrollment,
    plans,
    fetchPlansByZipCode,
    createEnrollment,
    selectPlan,
    submitExternalPlan,
    attestEnrollment,
    waiveEnrollment,
  } = useICHRAEnrollment();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/ichra/enroll");
    }
  }, [loading, user, navigate]);

  // Resume from existing enrollment status
  useEffect(() => {
    if (enrollment) {
      switch (enrollment.status) {
        case "enrolled":
        case "waived":
          setCurrentStep("complete");
          break;
        case "pending_verification":
          setCurrentStep("attest");
          break;
        case "in_progress":
          if (enrollment.coverage_zip_code) {
            setZipCode(enrollment.coverage_zip_code);
            setCurrentStep("plans");
          } else {
            setCurrentStep("zip");
          }
          break;
        default:
          setCurrentStep("offer");
      }
    }
  }, [enrollment]);

  const getStepNumber = (): number => {
    const steps: EnrollmentStep[] = ["offer", "zip", "plans", "attest", "complete"];
    const idx = steps.indexOf(currentStep);
    return idx >= 0 ? idx + 1 : 1;
  };

  const getProgress = (): number => {
    const totalSteps = 5;
    return (getStepNumber() / totalSteps) * 100;
  };

  const handleStartEnrollment = async () => {
    if (!offer) return;
    
    const result = await createEnrollment(offer.id);
    if (result) {
      setCurrentStep("zip");
    }
  };

  const handleZipCodeSubmit = async (zip: string) => {
    setZipCode(zip);
    await fetchPlansByZipCode(zip);
    setCurrentStep("plans");
  };

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlanId(planId);
    const success = await selectPlan(planId, zipCode);
    if (success) {
      setCurrentStep("attest");
    }
  };

  const handleExternalPlanSubmit = async (planDetails: any) => {
    const success = await submitExternalPlan({ ...planDetails, zip_code: zipCode });
    if (success) {
      setCurrentStep("attest");
    }
  };

  const handleAttestation = async () => {
    const success = await attestEnrollment();
    if (success) {
      setCurrentStep("complete");
    }
  };

  const handleWaiver = async (reason: string) => {
    const success = await waiveEnrollment(reason);
    if (success) {
      setCurrentStep("complete");
    }
  };

  const handleChooseWaiver = () => {
    setCurrentStep("waiver");
  };

  const handleUseExternalPlan = () => {
    setUseExternalPlan(true);
    setCurrentStep("external");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading enrollment...</div>
      </div>
    );
  }

  if (!employer || !offer) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle>No ICHRA Offer Found</CardTitle>
              <CardDescription>
                We couldn't find an ICHRA offer associated with your email address. 
                Please contact your employer's HR department to verify your eligibility.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Progress Header */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  ICHRA Enrollment
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Step {getStepNumber()} of 5
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>~5 min</span>
              </div>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        </div>

        {/* Employer Banner */}
        <div className="bg-secondary text-secondary-foreground py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                Enrolling through <span className="font-semibold">{employer.name}</span>
              </p>
              <Badge className="bg-accent text-accent-foreground">
                ${offer.monthly_allowance}/month allowance
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {currentStep === "offer" && (
            <ICHRAOfferConfirmation
              employer={employer}
              offer={offer}
              onStart={handleStartEnrollment}
              onWaive={handleChooseWaiver}
            />
          )}

          {currentStep === "zip" && (
            <ICHRAZipCodeEntry
              onSubmit={handleZipCodeSubmit}
              onBack={() => setCurrentStep("offer")}
            />
          )}

          {currentStep === "plans" && (
            <ICHRAPlanSelection
              plans={plans}
              monthlyAllowance={offer.monthly_allowance}
              zipCode={zipCode}
              onSelect={handlePlanSelect}
              onUseExternal={handleUseExternalPlan}
              onBack={() => setCurrentStep("zip")}
            />
          )}

          {currentStep === "external" && (
            <ICHRAExternalPlanForm
              onSubmit={handleExternalPlanSubmit}
              onBack={() => setCurrentStep("plans")}
            />
          )}

          {currentStep === "attest" && (
            <ICHRAAttestation
              enrollment={enrollment}
              plans={plans}
              onAttest={handleAttestation}
              onBack={() => useExternalPlan ? setCurrentStep("external") : setCurrentStep("plans")}
            />
          )}

          {currentStep === "waiver" && (
            <ICHRAWaiver
              onSubmit={handleWaiver}
              onBack={() => setCurrentStep("offer")}
            />
          )}

          {currentStep === "complete" && (
            <ICHRAComplete
              enrollment={enrollment}
              employer={employer}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ICHRAEnroll;
