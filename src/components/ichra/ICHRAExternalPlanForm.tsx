import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, FileText, Info } from "lucide-react";
import { z } from "zod";

const externalPlanSchema = z.object({
  carrier_name: z.string().trim().min(1, "Carrier name is required"),
  plan_name: z.string().trim().min(1, "Plan name is required"),
  plan_type: z.string().min(1, "Please select a plan type"),
  monthly_premium: z.number().min(0, "Please enter a valid premium amount"),
  policy_number: z.string().trim().min(1, "Policy number is required"),
  effective_date: z.string().min(1, "Effective date is required"),
});

interface ICHRAExternalPlanFormProps {
  onSubmit: (planDetails: {
    carrier_name: string;
    plan_name: string;
    plan_type: string;
    monthly_premium: number;
    policy_number: string;
    effective_date: string;
  }) => void;
  onBack: () => void;
}

export function ICHRAExternalPlanForm({ onSubmit, onBack }: ICHRAExternalPlanFormProps) {
  const [formData, setFormData] = useState({
    carrier_name: "",
    plan_name: "",
    plan_type: "",
    monthly_premium: "",
    policy_number: "",
    effective_date: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToValidate = {
      ...formData,
      monthly_premium: parseFloat(formData.monthly_premium) || 0,
    };

    const result = externalPlanSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit({
      carrier_name: result.data.carrier_name,
      plan_name: result.data.plan_name,
      plan_type: result.data.plan_type,
      monthly_premium: result.data.monthly_premium,
      policy_number: result.data.policy_number,
      effective_date: result.data.effective_date,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Enter Your Plan Details</CardTitle>
          <CardDescription className="text-base">
            Provide information about the individual health plan you've enrolled in or plan to enroll in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Carrier Name */}
            <div className="space-y-2">
              <Label htmlFor="carrier_name">Insurance Carrier *</Label>
              <Input
                id="carrier_name"
                placeholder="e.g., Blue Cross Blue Shield, Aetna, UnitedHealthcare"
                value={formData.carrier_name}
                onChange={(e) => handleChange("carrier_name", e.target.value)}
                className={errors.carrier_name ? "border-destructive" : ""}
              />
              {errors.carrier_name && (
                <p className="text-sm text-destructive">{errors.carrier_name}</p>
              )}
            </div>

            {/* Plan Name */}
            <div className="space-y-2">
              <Label htmlFor="plan_name">Plan Name *</Label>
              <Input
                id="plan_name"
                placeholder="e.g., Silver PPO 3000"
                value={formData.plan_name}
                onChange={(e) => handleChange("plan_name", e.target.value)}
                className={errors.plan_name ? "border-destructive" : ""}
              />
              {errors.plan_name && (
                <p className="text-sm text-destructive">{errors.plan_name}</p>
              )}
            </div>

            {/* Plan Type */}
            <div className="space-y-2">
              <Label htmlFor="plan_type">Plan Type *</Label>
              <Select
                value={formData.plan_type}
                onValueChange={(value) => handleChange("plan_type", value)}
              >
                <SelectTrigger className={errors.plan_type ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HMO">HMO (Health Maintenance Organization)</SelectItem>
                  <SelectItem value="PPO">PPO (Preferred Provider Organization)</SelectItem>
                  <SelectItem value="EPO">EPO (Exclusive Provider Organization)</SelectItem>
                  <SelectItem value="HDHP">HDHP (High Deductible Health Plan)</SelectItem>
                  <SelectItem value="POS">POS (Point of Service)</SelectItem>
                </SelectContent>
              </Select>
              {errors.plan_type && (
                <p className="text-sm text-destructive">{errors.plan_type}</p>
              )}
            </div>

            {/* Monthly Premium */}
            <div className="space-y-2">
              <Label htmlFor="monthly_premium">Monthly Premium ($) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="monthly_premium"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.monthly_premium}
                  onChange={(e) => handleChange("monthly_premium", e.target.value)}
                  className={`pl-7 ${errors.monthly_premium ? "border-destructive" : ""}`}
                />
              </div>
              {errors.monthly_premium && (
                <p className="text-sm text-destructive">{errors.monthly_premium}</p>
              )}
            </div>

            {/* Policy Number */}
            <div className="space-y-2">
              <Label htmlFor="policy_number">Policy/Member ID Number *</Label>
              <Input
                id="policy_number"
                placeholder="Enter your policy or member ID"
                value={formData.policy_number}
                onChange={(e) => handleChange("policy_number", e.target.value)}
                className={errors.policy_number ? "border-destructive" : ""}
              />
              {errors.policy_number && (
                <p className="text-sm text-destructive">{errors.policy_number}</p>
              )}
            </div>

            {/* Effective Date */}
            <div className="space-y-2">
              <Label htmlFor="effective_date">Coverage Effective Date *</Label>
              <Input
                id="effective_date"
                type="date"
                value={formData.effective_date}
                onChange={(e) => handleChange("effective_date", e.target.value)}
                className={errors.effective_date ? "border-destructive" : ""}
              />
              {errors.effective_date && (
                <p className="text-sm text-destructive">{errors.effective_date}</p>
              )}
            </div>

            {/* Info Notice */}
            <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">ICHRA Compliance</p>
                <p>
                  Your plan must meet minimum essential coverage (MEC) and minimum value 
                  requirements to qualify for ICHRA reimbursement. Most individual major 
                  medical plans from the marketplace or directly from carriers qualify.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
