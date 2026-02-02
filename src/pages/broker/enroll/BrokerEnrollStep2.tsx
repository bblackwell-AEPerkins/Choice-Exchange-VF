import { useState } from "react";
import { useBrokerEnrollment, Dependent } from "@/hooks/useBrokerEnrollment";
import { BrokerEnrollmentLayout } from "@/components/broker/BrokerEnrollmentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Plus, Trash2, User, Users } from "lucide-react";

export default function BrokerEnrollStep2() {
  const {
    data,
    updateData,
    prevStep,
    nextStep,
    saveAndExit,
    selectedGroup,
    remainingDollars,
    estimatedEarnings,
    selectedPlan,
    addDependent,
    removeDependent,
  } = useBrokerEnrollment();

  const [showAddDependent, setShowAddDependent] = useState(false);
  const [newDependent, setNewDependent] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    relationship: "spouse" as "spouse" | "child" | "domestic_partner",
  });

  const handleAddDependent = () => {
    if (newDependent.firstName && newDependent.lastName && newDependent.dateOfBirth) {
      addDependent(newDependent);
      setNewDependent({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        relationship: "spouse",
      });
      setShowAddDependent(false);
    }
  };

  return (
    <BrokerEnrollmentLayout
      currentStep={2}
      onBack={prevStep}
      onSaveAndExit={saveAndExit}
      effectiveDate={data.effectiveDate}
      contributionAmount={data.contributionAmount}
      selectedPlanPremium={selectedPlan?.monthly_premium}
      remainingDollars={remainingDollars}
      estimatedEarnings={estimatedEarnings}
      individualName={data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined}
      groupName={selectedGroup?.name}
      showSummaryRail={false}
    >
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Household & Coverage Context</CardTitle>
          <CardDescription>
            Capture who needs coverage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Coverage Type */}
          <div className="space-y-3">
            <Label>Coverage Type</Label>
            <RadioGroup
              value={data.coverageType}
              onValueChange={(value) => updateData({ coverageType: value as "individual" | "family" })}
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="individual"
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  data.coverageType === "individual" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="individual" id="individual" />
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Individual Only</span>
                </div>
              </Label>
              
              <Label
                htmlFor="family"
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  data.coverageType === "family" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="family" id="family" />
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Family Coverage</span>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Dependents section - only show for family */}
          {data.coverageType === "family" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Dependents</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddDependent(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dependent
                </Button>
              </div>

              {/* Dependent list */}
              {data.dependents.length > 0 && (
                <div className="space-y-2">
                  {data.dependents.map((dep) => (
                    <div
                      key={dep.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {dep.firstName} {dep.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dep.relationship.charAt(0).toUpperCase() + dep.relationship.slice(1)} • DOB: {dep.dateOfBirth}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDependent(dep.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add dependent form */}
              {showAddDependent && (
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        value={newDependent.firstName}
                        onChange={(e) => setNewDependent(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={newDependent.lastName}
                        onChange={(e) => setNewDependent(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={newDependent.dateOfBirth}
                        onChange={(e) => setNewDependent(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Select
                        value={newDependent.relationship}
                        onValueChange={(value) => setNewDependent(prev => ({ ...prev, relationship: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="domestic_partner">Domestic Partner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowAddDependent(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleAddDependent}>
                      Add Dependent
                    </Button>
                  </div>
                </div>
              )}

              {data.dependents.length === 0 && !showAddDependent && (
                <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
                  No dependents added yet. Click "Add Dependent" to add family members.
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={nextStep}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </BrokerEnrollmentLayout>
  );
}
