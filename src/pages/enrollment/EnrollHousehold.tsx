import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEnrollment, EnrollmentDependent } from "@/hooks/useEnrollment";
import { Plus, Trash2, Users, DollarSign } from "lucide-react";

export default function EnrollHousehold() {
  const navigate = useNavigate();
  const { intent, household, updateHousehold, addDependent, removeDependent, setStep } = useEnrollment();
  const [showDependentForm, setShowDependentForm] = useState(false);
  const [newDependent, setNewDependent] = useState<Partial<EnrollmentDependent>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!household.maritalStatus) {
      newErrors.maritalStatus = "Marital status is required";
    }
    if (!household.employmentStatus) {
      newErrors.employmentStatus = "Employment status is required";
    }
    if (household.employmentStatus === "employed" && !household.employerName.trim()) {
      newErrors.employerName = "Employer name is required";
    }
    if (household.estimatedIncome <= 0) {
      newErrors.income = "Estimated income is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDependent = () => {
    if (!newDependent.firstName || !newDependent.lastName || !newDependent.dateOfBirth || !newDependent.relationship) {
      return;
    }

    addDependent({
      id: crypto.randomUUID(),
      firstName: newDependent.firstName,
      lastName: newDependent.lastName,
      dateOfBirth: newDependent.dateOfBirth,
      relationship: newDependent.relationship,
      ssn: newDependent.ssn || "",
    });

    setNewDependent({});
    setShowDependentForm(false);
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep("coverage");
      navigate("/enroll/coverage");
    }
  };

  const handleBack = () => {
    setStep("about");
    navigate("/enroll/about");
  };

  return (
    <EnrollmentLayout
      currentStep={4}
      totalSteps={8}
      title="Household & Income"
      description="Tell us about your household to determine eligibility and coverage options."
    >
      {/* Marital Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Marital Status</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={household.maritalStatus || ""}
            onValueChange={(value) => updateHousehold({ maritalStatus: value as typeof household.maritalStatus })}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { value: "single", label: "Single" },
              { value: "married", label: "Married" },
              { value: "divorced", label: "Divorced" },
              { value: "widowed", label: "Widowed" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
              >
                <RadioGroupItem value={option.value} />
                <span>{option.label}</span>
              </label>
            ))}
          </RadioGroup>
          {errors.maritalStatus && (
            <p className="text-sm text-destructive mt-2">{errors.maritalStatus}</p>
          )}
        </CardContent>
      </Card>

      {/* Dependents */}
      {intent.coverageFor === "family" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Dependents
                </CardTitle>
                <CardDescription>Add your spouse, children, or other dependents</CardDescription>
              </div>
              {!showDependentForm && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDependentForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dependent
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Dependents */}
            {household.dependents.map((dep) => (
              <div
                key={dep.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
              >
                <div>
                  <p className="font-medium">{dep.firstName} {dep.lastName}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {dep.relationship} • DOB: {dep.dateOfBirth}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDependent(dep.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Add Dependent Form */}
            {showDependentForm && (
              <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-4">
                <p className="font-medium">Add a Dependent</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      placeholder="First name"
                      value={newDependent.firstName || ""}
                      onChange={(e) => setNewDependent({ ...newDependent, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Last name"
                      value={newDependent.lastName || ""}
                      onChange={(e) => setNewDependent({ ...newDependent, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={newDependent.dateOfBirth || ""}
                      onChange={(e) => setNewDependent({ ...newDependent, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Select
                      value={newDependent.relationship || ""}
                      onValueChange={(value) => setNewDependent({ ...newDependent, relationship: value as EnrollmentDependent["relationship"] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="domestic_partner">Domestic Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>SSN (optional)</Label>
                  <Input
                    placeholder="XXX-XX-XXXX"
                    value={newDependent.ssn || ""}
                    onChange={(e) => setNewDependent({ ...newDependent, ssn: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="button" onClick={handleAddDependent}>
                    Add Dependent
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowDependentForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {household.dependents.length === 0 && !showDependentForm && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No dependents added yet. Click "Add Dependent" to include family members.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Employment & Income */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Employment & Income
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Employment Status</Label>
            <RadioGroup
              value={household.employmentStatus || ""}
              onValueChange={(value) => updateHousehold({ employmentStatus: value as typeof household.employmentStatus })}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { value: "employed", label: "Employed" },
                { value: "self_employed", label: "Self-Employed" },
                { value: "unemployed", label: "Unemployed" },
                { value: "retired", label: "Retired" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
                >
                  <RadioGroupItem value={option.value} />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </RadioGroup>
            {errors.employmentStatus && (
              <p className="text-sm text-destructive">{errors.employmentStatus}</p>
            )}
          </div>

          {household.employmentStatus === "employed" && (
            <div className="space-y-2">
              <Label htmlFor="employer">Employer Name</Label>
              <Input
                id="employer"
                placeholder="Your employer's name"
                value={household.employerName}
                onChange={(e) => updateHousehold({ employerName: e.target.value })}
              />
              {errors.employerName && (
                <p className="text-sm text-destructive">{errors.employerName}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="income">Estimated Annual Household Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="income"
                type="number"
                placeholder="50000"
                className="pl-7"
                value={household.estimatedIncome || ""}
                onChange={(e) => updateHousehold({ estimatedIncome: Number(e.target.value) })}
              />
            </div>
            {errors.income && (
              <p className="text-sm text-destructive">{errors.income}</p>
            )}
            <p className="text-xs text-muted-foreground">
              This helps determine if you qualify for premium subsidies or cost-sharing reductions.
            </p>
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
