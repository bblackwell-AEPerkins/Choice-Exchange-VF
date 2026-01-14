import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  DollarSign, 
  Shield, 
  Heart,
  Stethoscope,
  ExternalLink,
  Filter
} from "lucide-react";

interface Plan {
  id: string;
  carrier_name: string;
  plan_name: string;
  plan_type: string;
  metal_tier: string;
  monthly_premium: number;
  deductible: number;
  out_of_pocket_max: number;
  copay_primary: number | null;
  copay_specialist: number | null;
  copay_emergency: number | null;
  features: string[] | null;
  is_hsa_eligible: boolean;
}

interface ICHRAPlanSelectionProps {
  plans: Plan[];
  monthlyAllowance: number;
  zipCode: string;
  onSelect: (planId: string) => void;
  onUseExternal: () => void;
  onBack: () => void;
}

const metalTierColors: Record<string, string> = {
  Bronze: "bg-amber-600 text-white",
  Silver: "bg-slate-400 text-white",
  Gold: "bg-yellow-500 text-white",
  Platinum: "bg-slate-700 text-white",
};

export function ICHRAPlanSelection({ 
  plans, 
  monthlyAllowance, 
  zipCode,
  onSelect, 
  onUseExternal,
  onBack 
}: ICHRAPlanSelectionProps) {
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const filteredPlans = selectedTier === "all" 
    ? plans 
    : plans.filter(p => p.metal_tier === selectedTier);

  const getOutOfPocket = (premium: number) => {
    const covered = Math.min(premium, monthlyAllowance);
    return Math.max(0, premium - covered);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleConfirmSelection = () => {
    if (selectedPlanId) {
      onSelect(selectedPlanId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Choose Your Health Plan</h1>
        <p className="text-muted-foreground">
          Plans available in ZIP code <span className="font-mono font-medium">{zipCode}</span>
        </p>
      </div>

      {/* Allowance Reminder */}
      <Card className="bg-accent/10 border-accent/30">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Your Monthly Allowance</p>
                <p className="text-sm text-muted-foreground">Applied automatically to your premium</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-accent">${monthlyAllowance}</span>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Tabs value={selectedTier} onValueChange={setSelectedTier}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by tier:</span>
        </div>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Bronze">Bronze</TabsTrigger>
          <TabsTrigger value="Silver">Silver</TabsTrigger>
          <TabsTrigger value="Gold">Gold</TabsTrigger>
          <TabsTrigger value="Platinum">Platinum</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No plans found for this tier</h3>
            <p className="text-muted-foreground">
              Try selecting a different tier or check if plans are available in your area.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPlans.map((plan) => {
            const outOfPocket = getOutOfPocket(plan.monthly_premium);
            const isSelected = selectedPlanId === plan.id;
            
            return (
              <Card 
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? "ring-2 ring-primary border-primary" 
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Plan Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{plan.plan_name}</h3>
                            <Badge className={metalTierColors[plan.metal_tier] || "bg-muted"}>
                              {plan.metal_tier}
                            </Badge>
                            {plan.is_hsa_eligible && (
                              <Badge variant="outline" className="text-xs">HSA</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {plan.carrier_name} • {plan.plan_type}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Key Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Deductible</p>
                          <p className="font-semibold">${plan.deductible.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Out-of-Pocket Max</p>
                          <p className="font-semibold">${plan.out_of_pocket_max.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Primary Care</p>
                          <p className="font-semibold">
                            {plan.copay_primary ? `$${plan.copay_primary}` : "Deductible"}
                          </p>
                        </div>
                      </div>

                      {/* Features */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {plan.features.slice(0, 3).map((feature, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-muted px-2 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="lg:text-right lg:min-w-[180px] border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6">
                      <div className="text-sm text-muted-foreground mb-1">Monthly Premium</div>
                      <div className="text-2xl font-bold">${plan.monthly_premium}</div>
                      
                      <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                        <div className="text-xs text-muted-foreground">Your Cost After Allowance</div>
                        <div className={`text-xl font-bold ${outOfPocket === 0 ? 'text-accent' : ''}`}>
                          {outOfPocket === 0 ? 'Fully Covered!' : `$${outOfPocket}/mo`}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* External Plan Option */}
      <Card className="border-dashed">
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground mb-3">
            Already have a plan or want to shop elsewhere?
          </p>
          <Button variant="outline" onClick={onUseExternal}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Enter External Plan Details
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          className="flex-1"
          onClick={handleConfirmSelection}
          disabled={!selectedPlanId}
        >
          Continue with Selected Plan
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
