import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnrollmentDB } from "@/hooks/useEnrollmentDB";
import { DEMO_MODE, MOCK_ICHRA_PLANS, filterPlansByZip, simulateDelay } from "@/lib/mockData";
import { 
  Check, 
  Shield, 
  Stethoscope, 
  Loader2, 
  MapPin, 
  Search,
  Heart,
  Eye,
  Umbrella,
  CreditCard,
  ArrowRight,
  Building2,
  Scale
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Plan {
  id: string;
  plan_name: string;
  carrier_name: string;
  metal_tier: string;
  monthly_premium: number;
  deductible: number;
  out_of_pocket_max: number;
  copay_primary: number | null;
  copay_specialist: number | null;
  is_hsa_eligible: boolean;
  features: string[] | null;
  plan_type: string;
}

type PlanCategory = "insurance" | "subscription" | "voluntary";

const METAL_TIER_COLORS: Record<string, string> = {
  bronze: "bg-amber-100 text-amber-800 border-amber-300",
  silver: "bg-slate-100 text-slate-700 border-slate-300",
  gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
  platinum: "bg-purple-100 text-purple-800 border-purple-300",
};

// Mock subscription and voluntary plans - replace with real data
const SUBSCRIPTION_PLANS = [
  {
    id: "sub-telehealth",
    name: "Telehealth Plus",
    description: "Unlimited virtual doctor visits 24/7",
    monthlyPrice: 29.99,
    features: ["Unlimited video visits", "Mental health support", "Prescription delivery"],
    icon: Stethoscope,
  },
  {
    id: "sub-wellness",
    name: "Wellness Program",
    description: "Gym memberships and fitness tracking",
    monthlyPrice: 19.99,
    features: ["National gym access", "Fitness app premium", "Health coaching"],
    icon: Heart,
  },
  {
    id: "sub-pharmacy",
    name: "Pharmacy Discount",
    description: "Save on prescriptions at 60,000+ pharmacies",
    monthlyPrice: 9.99,
    features: ["Up to 80% savings", "Mail order options", "Price comparison"],
    icon: CreditCard,
  },
];

const VOLUNTARY_PLANS = [
  {
    id: "vol-dental",
    name: "Dental Coverage",
    description: "Comprehensive dental care",
    monthlyPrice: 35.00,
    features: ["Preventive care 100%", "Basic services 80%", "Major services 50%"],
    icon: Stethoscope,
  },
  {
    id: "vol-vision",
    name: "Vision Coverage",
    description: "Eye exams, glasses, and contacts",
    monthlyPrice: 12.00,
    features: ["Annual eye exam", "$150 frame allowance", "Contact lens coverage"],
    icon: Eye,
  },
  {
    id: "vol-life",
    name: "Life Insurance",
    description: "Term life coverage for peace of mind",
    monthlyPrice: 25.00,
    features: ["$50,000 coverage", "Accidental death benefit", "Portable coverage"],
    icon: Umbrella,
  },
  {
    id: "vol-disability",
    name: "Short-Term Disability",
    description: "Income protection if you can't work",
    monthlyPrice: 22.00,
    features: ["60% income replacement", "90-day benefit period", "14-day waiting period"],
    icon: Shield,
  },
];

export default function EnrollPlans() {
  const navigate = useNavigate();
  const { 
    plan, 
    coverage,
    about,
    updatePlan, 
    setStep,
    isLoading: dbLoading,
    isSaving,
    canAccessStep,
    saveToDatabase
  } = useEnrollmentDB();
  
  const [activeTab, setActiveTab] = useState<PlanCategory>("insurance");
  const [zipCode, setZipCode] = useState(coverage.stateOfResidence ? "" : about.zipCode || "");
  const [searchedZip, setSearchedZip] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<Plan | null>(null);
  const [metalFilter, setMetalFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("premium-low");
  
  // Selected plans for each category
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [selectedVoluntary, setSelectedVoluntary] = useState<string[]>([]);

  // Step access protection
  useEffect(() => {
    if (!dbLoading && !canAccessStep("plans")) {
      navigate("/enroll");
    }
  }, [dbLoading, canAccessStep, navigate]);

  // Auto-search if zip code is available
  useEffect(() => {
    if (about.zipCode && !hasSearched) {
      setZipCode(about.zipCode);
      fetchPlans(about.zipCode);
    }
  }, [about.zipCode]);

  const fetchPlans = async (zip: string) => {
    if (!zip || zip.length < 5) return;
    
    setIsLoading(true);
    setHasSearched(true);
    setSearchedZip(zip);

    try {
      if (DEMO_MODE) {
        await simulateDelay(400);
        const filteredPlans = filterPlansByZip(zip);
        setPlans(filteredPlans as Plan[]);
        
        // If a plan was previously selected, find its details
        if (plan.medicalPlanId) {
          const selected = filteredPlans.find((p) => p.id === plan.medicalPlanId);
          if (selected) {
            setSelectedPlanDetails(selected as Plan);
          }
        }
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPlans(zipCode);
  };

  // Filter and sort plans
  const filteredPlans = plans
    .filter((p) => metalFilter === "all" || p.metal_tier.toLowerCase() === metalFilter.toLowerCase())
    .sort((a, b) => {
      switch (sortBy) {
        case "premium-low": return a.monthly_premium - b.monthly_premium;
        case "premium-high": return b.monthly_premium - a.monthly_premium;
        case "deductible-low": return a.deductible - b.deductible;
        default: return 0;
      }
    });

  const uniqueMetalTiers = [...new Set(plans.map((p) => p.metal_tier))];

  const handleSelectInsurancePlan = (selectedPlan: Plan) => {
    updatePlan({
      medicalPlanId: selectedPlan.id,
      monthlyPremium: selectedPlan.monthly_premium,
    });
    setSelectedPlanDetails(selectedPlan);
  };

  const toggleSubscription = (id: string) => {
    setSelectedSubscriptions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleVoluntary = (id: string) => {
    setSelectedVoluntary(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (activeTab === "insurance" && plan.medicalPlanId) {
      setActiveTab("subscription");
    } else if (activeTab === "subscription") {
      setActiveTab("voluntary");
    } else if (activeTab === "voluntary") {
      setStep("review");
      navigate("/enroll/review");
    }
  };

  const handleBack = () => {
    if (activeTab === "voluntary") {
      setActiveTab("subscription");
    } else if (activeTab === "subscription") {
      setActiveTab("insurance");
    } else {
      setStep("coverage");
      navigate("/enroll/coverage");
    }
  };

  const getNextLabel = () => {
    if (activeTab === "insurance") return "Continue to Subscriptions";
    if (activeTab === "subscription") return "Continue to Voluntary";
    return "Review & Submit";
  };

  const canProceed = () => {
    if (activeTab === "insurance") return !!plan.medicalPlanId;
    return true; // Subscription and voluntary are optional
  };

  // Calculate total monthly cost
  const subscriptionTotal = selectedSubscriptions.reduce((sum, id) => {
    const sub = SUBSCRIPTION_PLANS.find(s => s.id === id);
    return sum + (sub?.monthlyPrice || 0);
  }, 0);

  const voluntaryTotal = selectedVoluntary.reduce((sum, id) => {
    const vol = VOLUNTARY_PLANS.find(v => v.id === id);
    return sum + (vol?.monthlyPrice || 0);
  }, 0);

  const totalMonthly = (plan.monthlyPremium || 0) + subscriptionTotal + voluntaryTotal;

  if (dbLoading) {
    return (
      <EnrollmentLayout
        currentStep={6}
        totalSteps={8}
        title="Select Your Plans"
        description="Loading available plans..."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </EnrollmentLayout>
    );
  }

  return (
    <EnrollmentLayout
      currentStep={6}
      totalSteps={8}
      title="Select Your Plans"
      description="Choose your health insurance, subscriptions, and voluntary benefits."
      onSave={saveToDatabase}
    >
      {/* Monthly Cost Summary */}
      {(plan.medicalPlanId || selectedSubscriptions.length > 0 || selectedVoluntary.length > 0) && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Monthly Total</p>
                <p className="text-2xl font-bold text-primary">${totalMonthly.toFixed(2)}/mo</p>
              </div>
              <div className="text-right text-sm">
                {plan.medicalPlanId && <p>Insurance: ${plan.monthlyPremium?.toFixed(2)}</p>}
                {subscriptionTotal > 0 && <p>Subscriptions: ${subscriptionTotal.toFixed(2)}</p>}
                {voluntaryTotal > 0 && <p>Voluntary: ${voluntaryTotal.toFixed(2)}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Category Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PlanCategory)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insurance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Insurance</span>
            {plan.medicalPlanId && <Check className="h-3 w-3 text-accent" />}
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Subscriptions</span>
            {selectedSubscriptions.length > 0 && (
              <Badge variant="secondary" className="h-5 w-5 p-0 justify-center">
                {selectedSubscriptions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="voluntary" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Voluntary</span>
            {selectedVoluntary.length > 0 && (
              <Badge variant="secondary" className="h-5 w-5 p-0 justify-center">
                {selectedVoluntary.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Insurance Plans Tab */}
        <TabsContent value="insurance" className="space-y-4 mt-4">
          {/* ZIP Code Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter ZIP code to find plans"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                    maxLength={5}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={zipCode.length < 5 || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Selected Plan Summary */}
          {selectedPlanDetails && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="font-medium">Selected Plan</span>
                  </div>
                  <Badge className={cn("capitalize", METAL_TIER_COLORS[selectedPlanDetails.metal_tier.toLowerCase()])}>
                    {selectedPlanDetails.metal_tier}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedPlanDetails.plan_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedPlanDetails.carrier_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${selectedPlanDetails.monthly_premium.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          {hasSearched && plans.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <Select value={metalFilter} onValueChange={setMetalFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Metal Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  {uniqueMetalTiers.map((tier) => (
                    <SelectItem key={tier} value={tier.toLowerCase()}>
                      {tier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <Scale className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium-low">Premium: Low to High</SelectItem>
                  <SelectItem value="premium-high">Premium: High to Low</SelectItem>
                  <SelectItem value="deductible-low">Deductible: Low to High</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-sm text-muted-foreground ml-auto">
                {filteredPlans.length} plans in {searchedZip || "your area"}
              </p>
            </div>
          )}

          {/* Plan List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !hasSearched ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Enter your ZIP code</p>
                <p className="text-muted-foreground">
                  Search for health plans available in your area
                </p>
              </CardContent>
            </Card>
          ) : filteredPlans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No plans available</p>
                <p className="text-muted-foreground">
                  We couldn't find plans for your area. Try a different ZIP code.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPlans.map((p) => {
                const isSelected = plan.medicalPlanId === p.id;
                
                return (
                  <Card
                    key={p.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      isSelected && "border-primary ring-2 ring-primary/20"
                    )}
                    onClick={() => handleSelectInsurancePlan(p)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={cn("capitalize", METAL_TIER_COLORS[p.metal_tier.toLowerCase()])}>
                              {p.metal_tier}
                            </Badge>
                            <Badge variant="outline">{p.plan_type}</Badge>
                            {p.is_hsa_eligible && (
                              <Badge variant="outline" className="text-accent border-accent">
                                HSA Eligible
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg">{p.plan_name}</h3>
                          <p className="text-sm text-muted-foreground">{p.carrier_name}</p>
                          
                          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Deductible</p>
                              <p className="font-medium">${p.deductible.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Out-of-Pocket Max</p>
                              <p className="font-medium">${p.out_of_pocket_max.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Primary Care</p>
                              <p className="font-medium">
                                {p.copay_primary ? `$${p.copay_primary}` : "See plan"}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                          <div className="text-right">
                            <p className="text-2xl font-bold">${p.monthly_premium.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">per month</p>
                          </div>
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="min-w-[100px]"
                          >
                            {isSelected ? (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Selected
                              </>
                            ) : (
                              "Select Plan"
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Subscription Plans Tab */}
        <TabsContent value="subscription" className="space-y-4 mt-4">
          <Card className="bg-muted/30">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">
                <strong>Optional:</strong> Add subscription-based health services to enhance your coverage.
                These are billed monthly and can be canceled anytime.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SUBSCRIPTION_PLANS.map((sub) => {
              const isSelected = selectedSubscriptions.includes(sub.id);
              const Icon = sub.icon;
              
              return (
                <Card
                  key={sub.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    isSelected && "border-primary ring-2 ring-primary/20"
                  )}
                  onClick={() => toggleSubscription(sub.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-primary" />}
                    </div>
                    <CardTitle className="text-lg">{sub.name}</CardTitle>
                    <CardDescription>{sub.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary mb-3">
                      ${sub.monthlyPrice.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </p>
                    <ul className="space-y-1">
                      {sub.features.map((feature, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <Check className="h-3 w-3 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Voluntary Benefits Tab */}
        <TabsContent value="voluntary" className="space-y-4 mt-4">
          <Card className="bg-muted/30">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">
                <strong>Optional:</strong> Add voluntary benefits for additional protection.
                Dental and vision coverage, life insurance, and disability protection.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {VOLUNTARY_PLANS.map((vol) => {
              const isSelected = selectedVoluntary.includes(vol.id);
              const Icon = vol.icon;
              
              return (
                <Card
                  key={vol.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    isSelected && "border-primary ring-2 ring-primary/20"
                  )}
                  onClick={() => toggleVoluntary(vol.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-primary" />}
                    </div>
                    <CardTitle className="text-lg">{vol.name}</CardTitle>
                    <CardDescription>{vol.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary mb-3">
                      ${vol.monthlyPrice.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </p>
                    <ul className="space-y-1">
                      {vol.features.map((feature, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <Check className="h-3 w-3 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <EnrollmentNavigation
        onBack={handleBack}
        onNext={handleNext}
        disabled={!canProceed()}
        nextLabel={getNextLabel()}
        backLabel={activeTab === "insurance" ? "Back" : "Previous"}
        isLoading={isSaving}
      />
    </EnrollmentLayout>
  );
}
