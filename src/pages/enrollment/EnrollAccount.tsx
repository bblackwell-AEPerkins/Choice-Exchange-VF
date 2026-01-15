import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnrollmentDB } from "@/hooks/useEnrollmentDB";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Phone, User, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { accountSchema, formatPhoneNumber, formatZodErrors } from "@/lib/validations/enrollment";

export default function EnrollAccount() {
  const navigate = useNavigate();
  const { account, updateAccount, setStep, userId, isLoading: dbLoading, canAccessStep } = useEnrollmentDB();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isSubmittingRef = useRef(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!dbLoading && userId && account.isVerified) {
      setStep("about");
      navigate("/enroll/about");
    }
  }, [dbLoading, userId, account.isVerified, setStep, navigate]);

  // Check step access
  useEffect(() => {
    if (!dbLoading && !canAccessStep("account")) {
      navigate("/enroll");
    }
  }, [dbLoading, canAccessStep, navigate]);

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    updateAccount({ phone: formatted });
  };

  const validateForm = (): boolean => {
    const result = accountSchema.safeParse({
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      phone: account.phone,
      password,
      confirmPassword,
    });

    if (!result.success) {
      setErrors(formatZodErrors(result.error));
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = async () => {
    if (isSubmittingRef.current) return;
    
    if (!validateForm()) return;

    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: account.email.trim().toLowerCase(),
        password,
        options: {
          data: {
            first_name: account.firstName.trim(),
            last_name: account.lastName.trim(),
            phone: account.phone,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          // Try to sign in instead
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: account.email.trim().toLowerCase(),
            password,
          });
          
          if (signInError) {
            setErrors({ email: "This email is already registered. Please check your password or use a different email." });
            return;
          }
        } else {
          throw error;
        }
      }

      if (data?.user || !error) {
        updateAccount({ isVerified: true });
        toast.success("Account created successfully!");
        setStep("about");
        navigate("/enroll/about");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create account";
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
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
      title="Create Your Account"
      description="Set up your account to save your progress and securely manage your enrollment."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Details
          </CardTitle>
          <CardDescription>
            Your account lets you save progress, manage your enrollment, and access your coverage later.
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
                  aria-invalid={!!errors.firstName}
                />
              </div>
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Smith"
                value={account.lastName}
                onChange={(e) => updateAccount({ lastName: e.target.value })}
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
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
                placeholder="john.smith@example.com"
                className="pl-10"
                value={account.email}
                onChange={(e) => updateAccount({ email: e.target.value })}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
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
                onChange={(e) => handlePhoneChange(e.target.value)}
                aria-invalid={!!errors.phone}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
            <p className="text-xs text-muted-foreground">
              We'll use this to send important updates about your enrollment.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Create Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
            <p className="text-xs text-muted-foreground">
              At least 8 characters with uppercase, lowercase, and a number.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EnrollmentNavigation
        onBack={handleBack}
        onNext={handleNext}
        isLoading={isLoading}
      />
    </EnrollmentLayout>
  );
}
