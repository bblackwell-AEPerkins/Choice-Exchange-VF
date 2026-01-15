import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnrollment } from "@/hooks/useEnrollment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnrollAccount() {
  const navigate = useNavigate();
  const { account, updateAccount, setStep } = useEnrollment();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!account.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!account.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!account.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!account.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: account.email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/enroll/about`,
          data: {
            first_name: account.firstName,
            last_name: account.lastName,
            phone: account.phone,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          // Try to sign in instead
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: account.email,
            password: password,
          });
          
          if (signInError) {
            toast.error("Account already exists. Please check your password.");
            return;
          }
        } else {
          toast.error(error.message);
          return;
        }
      }

      updateAccount({ isVerified: true });
      toast.success("Account created successfully!");
      setStep("about");
      navigate("/enroll/about");
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("intent");
    navigate("/enroll");
  };

  return (
    <EnrollmentLayout
      currentStep={2}
      totalSteps={8}
      title="Create Your Account"
      description="Set up your account to save your progress and securely manage your enrollment."
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
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
                onChange={(e) => updateAccount({ phone: e.target.value })}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

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
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
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
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>
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
