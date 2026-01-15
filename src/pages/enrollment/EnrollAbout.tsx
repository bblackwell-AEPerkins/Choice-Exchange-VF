import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEnrollmentDB } from "@/hooks/useEnrollmentDB";
import { Shield, Loader2 } from "lucide-react";
import { formatSSN } from "@/lib/validations/enrollment";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export default function EnrollAbout() {
  const navigate = useNavigate();
  const { about, updateAbout, setStep, isLoading, canAccessStep, isSaving } = useEnrollmentDB();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check step access
  useEffect(() => {
    if (!isLoading && !canAccessStep("about")) {
      navigate("/enroll");
    }
  }, [isLoading, canAccessStep, navigate]);

  const handleSSNChange = (value: string) => {
    updateAbout({ ssn: formatSSN(value) });
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!about.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    if (!about.legalSex) {
      newErrors.legalSex = "Legal sex is required";
    }
    if (!about.ssn || about.ssn.replace(/\D/g, "").length !== 9) {
      newErrors.ssn = "Valid SSN is required";
    }
    if (!about.address1.trim()) {
      newErrors.address1 = "Address is required";
    }
    if (!about.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!about.state) {
      newErrors.state = "State is required";
    }
    if (!about.zipCode || !/^\d{5}$/.test(about.zipCode)) {
      newErrors.zipCode = "Valid 5-digit ZIP code is required";
    }
    if (!about.citizenship) {
      newErrors.citizenship = "Citizenship status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep("household");
      navigate("/enroll/household");
    }
  };

  const handleBack = () => {
    setStep("account");
    navigate("/enroll/account");
  };

  return (
    <EnrollmentLayout
      currentStep={3}
      totalSteps={8}
      title="About You"
      description="We need some personal information to verify your identity and determine your eligibility."
    >
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={about.dateOfBirth}
                onChange={(e) => updateAbout({ dateOfBirth: e.target.value })}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">{errors.dateOfBirth}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Legal Sex</Label>
              <RadioGroup
                value={about.legalSex || ""}
                onValueChange={(value) => updateAbout({ legalSex: value as "M" | "F" })}
                className="flex gap-4"
              >
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="M" id="male" />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="F" id="female" />
                  <span>Female</span>
                </label>
              </RadioGroup>
              {errors.legalSex && (
                <p className="text-sm text-destructive">{errors.legalSex}</p>
              )}
            </div>
          </div>

          {/* SSN with explanation */}
          <div className="space-y-2">
            <Label htmlFor="ssn">Social Security Number</Label>
            <Input
              id="ssn"
              placeholder="XXX-XX-XXXX"
              value={about.ssn}
              onChange={(e) => updateAbout({ ssn: formatSSN(e.target.value) })}
            />
            {errors.ssn && (
              <p className="text-sm text-destructive">{errors.ssn}</p>
            )}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Your SSN is required by law for health insurance enrollment. It is used to verify your identity, check for existing coverage, and report enrollment to the IRS. Your information is encrypted and protected.
              </p>
            </div>
          </div>

          {/* Citizenship */}
          <div className="space-y-2">
            <Label htmlFor="citizenship">Citizenship Status</Label>
            <Select
              value={about.citizenship}
              onValueChange={(value) => updateAbout({ citizenship: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us_citizen">U.S. Citizen</SelectItem>
                <SelectItem value="permanent_resident">Lawful Permanent Resident</SelectItem>
                <SelectItem value="work_visa">Work Visa Holder</SelectItem>
                <SelectItem value="refugee_asylee">Refugee/Asylee</SelectItem>
                <SelectItem value="other_lawful">Other Lawfully Present</SelectItem>
              </SelectContent>
            </Select>
            {errors.citizenship && (
              <p className="text-sm text-destructive">{errors.citizenship}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Residential Address</CardTitle>
          <CardDescription>Where you currently live</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address1">Street Address</Label>
            <Input
              id="address1"
              placeholder="123 Main Street"
              value={about.address1}
              onChange={(e) => updateAbout({ address1: e.target.value })}
            />
            {errors.address1 && (
              <p className="text-sm text-destructive">{errors.address1}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address2">Apartment, Suite, etc. (optional)</Label>
            <Input
              id="address2"
              placeholder="Apt 4B"
              value={about.address2}
              onChange={(e) => updateAbout({ address2: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                value={about.city}
                onChange={(e) => updateAbout({ city: e.target.value })}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={about.state}
                onValueChange={(value) => updateAbout({ state: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                placeholder="12345"
                maxLength={5}
                value={about.zipCode}
                onChange={(e) => updateAbout({ zipCode: e.target.value.replace(/\D/g, "").slice(0, 5) })}
              />
              {errors.zipCode && (
                <p className="text-sm text-destructive">{errors.zipCode}</p>
              )}
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
