import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnrollmentStore } from "@/hooks/useEnrollmentStore";
import { Mail, Phone, User, Loader2 } from "lucide-react";

export default function EnrollAccount() {
  const navigate = useNavigate();
  const { account, updateAccount, setStep, isLoading: dbLoading, canAccessStep } = useEnrollmentStore();

  // Check step access
  useEffect(() => {
    if (!dbLoading && !canAccessStep("account")) {
      navigate("/enroll");
    }
  }, [dbLoading, canAccessStep, navigate]);

  const handleNext = () => {
    // Demo mode: skip auth, just mark verified and proceed
    updateAccount({ isVerified: true });
    setStep("about");
    navigate("/enroll/about");
  };

  const handleBack = () => {
    setStep("intent");
    navigate("/enroll");
  };

  if (dbLoading) {
    return (
      <EnrollmentLayout
        currentStep={2}
        totalSteps={8}
        title="Loading..."
        description="Please wait while we load your enrollment."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </EnrollmentLayout>
    );
  }

  return (
    <EnrollmentLayout
      currentStep={2}
      totalSteps={8}
      title="Your Account"
      description="Confirm your account details to continue enrollment."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Details
          </CardTitle>
          <CardDescription>
            Pre-filled for demo. Click Continue to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  placeholder="John"
                  className="pl-10"
                  value={account.firstName}
                  onChange={(e) => updateAccount({ firstName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={account.lastName}
                onChange={(e) => updateAccount({ lastName: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                className="pl-10"
                value={account.email}
                onChange={(e) => updateAccount({ email: e.target.value })}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                className="pl-10"
                value={account.phone}
                onChange={(e) => updateAccount({ phone: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <EnrollmentNavigation
        onBack={handleBack}
        onNext={handleNext}
      />
    </EnrollmentLayout>
  );
}
