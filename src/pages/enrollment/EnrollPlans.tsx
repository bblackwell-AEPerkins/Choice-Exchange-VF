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
  Scale,
  Star,
  Pill,
  Phone,
  Activity,
  Brain,
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

type PlanCategory = "ichra" | "subscription" | "voluntary";

const METAL_TIER_COLORS: Record<string, string> = {
  bronze: "bg-amber-100 text-amber-800 border-amber-300",
  silver: "bg-slate-100 text-slate-700 border-slate-300",
  gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
  platinum: "bg-purple-100 text-purple-800 border-purple-300",
};

// Subscription care providers matching Member Dashboard style
const SUBSCRIPTION_PROVIDERS = [
  {
    id: "sub-primary",
    name: "Primary Care Membership",
    provider: "Dr. Sarah Chen",
    specialty: "Primary Care",
    description: "Unlimited same-day visits, messaging, and preventive care",
    monthlyPrice: 99,
    rating: 4.9,
    features: ["Unlimited visits", "Same-day appointments", "24/7 messaging", "Annual wellness exam", "Basic labs included"],
    icon: Stethoscope,
    popular: true,
  },
  {
    id: "sub-mental",
    name: "Mental Health Care",
    provider: "Dr. Emily Santos",
    specialty: "Psychiatry",
    description: "Therapy sessions and mental wellness support",
    monthlyPrice: 149,
    rating: 4.8,
    features: ["Weekly therapy sessions", "Psychiatric consultations", "Crisis support line", "Meditation app access"],
    icon: Brain,
  },
  {
    id: "sub-telehealth",
    name: "Telehealth Plus",
    provider: "VirtualCare Network",
    specialty: "Virtual Care",
    description: "Unlimited virtual doctor visits 24/7",
    monthlyPrice: 29.99,
    rating: 4.7,
    features: ["Unlimited video visits", "Prescription delivery", "Specialist referrals", "Health records access"],
    icon: Phone,
  },
  {
    id: "sub-wellness",
    name: "Wellness Program",
    provider: "FitLife Partners",
    specialty: "Wellness",
    description: "Gym memberships and fitness coaching",
    monthlyPrice: 49.99,
    rating: 4.6,
    features: ["National gym access", "Personal trainer sessions", "Nutrition coaching", "Wearable sync"],
    icon: Activity,
  },
  {
    id: "sub-pharmacy",
    name: "Pharmacy Discount",
    provider: "RxSaver Network",
    specialty: "Pharmacy",
    description: "Save on prescriptions at 60,000+ pharmacies",
    monthlyPrice: 9.99,
    rating: 4.5,
    features: ["Up to 80% savings", "Mail order options", "Price comparison", "Automatic refills"],
    icon: Pill,
  },
];

// Voluntary benefits with carrier options (3x3 grid style)
const VOLUNTARY_CATEGORIES = [
  {
    id: "dental",
    name: "Dental Coverage",
    icon: "🦷",
    description: "Comprehensive dental care",
    carriers: [
      { name: "Choice Exchange", plans: [
        { id: "dental-basic", tier: "Basic", price: 25 },
        { id: "dental-standard", tier: "Standard", price: 45, popular: true },
        { id: "dental-premium", tier: "Premium", price: 75 },
      ]},
      { name: "Delta Dental", plans: [
        { id: "delta-basic", tier: "Basic", price: 28 },
        { id: "delta-standard", tier: "Standard", price: 52 },
        { id: "delta-premium", tier: "Premium", price: 82 },
      ]},
      { name: "MetLife", plans: [
        { id: "metlife-dental-basic", tier: "Basic", price: 22 },
        { id: "metlife-dental-standard", tier: "Standard", price: 48 },
        { id: "metlife-dental-premium", tier: "Premium", price: 78 },
      ]},
    ],
  },
  {
    id: "vision",
    name: "Vision Coverage",
    icon: "👁️",
    description: "Eye exams, glasses, and contacts",
    carriers: [
      { name: "Choice Exchange", plans: [
        { id: "vision-basic", tier: "Basic", price: 10 },
        { id: "vision-standard", tier: "Standard", price: 15, popular: true },
        { id: "vision-premium", tier: "Premium", price: 25 },
      ]},
      { name: "VSP", plans: [
        { id: "vsp-basic", tier: "Basic", price: 12 },
        { id: "vsp-standard", tier: "Standard", price: 18 },
        { id: "vsp-premium", tier: "Premium", price: 28 },
      ]},
      { name: "EyeMed", plans: [
        { id: "eyemed-basic", tier: "Basic", price: 9 },
        { id: "eyemed-standard", tier: "Standard", price: 16 },
        { id: "eyemed-premium", tier: "Premium", price: 26 },
      ]},
    ],
  },
  {
    id: "life",
    name: "Life Insurance",
    icon: "🛡️",
    description: "Term life coverage for peace of mind",
    carriers: [
      { name: "Choice Exchange", plans: [
        { id: "life-basic", tier: "Basic", price: 15 },
        { id: "life-standard", tier: "Standard", price: 25, popular: true },
        { id: "life-premium", tier: "Premium", price: 45 },
      ]},
      { name: "MetLife", plans: [
        { id: "metlife-life-basic", tier: "Basic", price: 14 },
        { id: "metlife-life-standard", tier: "Standard", price: 28 },
        { id: "metlife-life-premium", tier: "Premium", price: 52 },
      ]},
      { name: "Prudential", plans: [
        { id: "prudential-basic", tier: "Basic", price: 16 },
        { id: "prudential-standard", tier: "Standard", price: 30 },
        { id: "prudential-premium", tier: "Premium", price: 55 },
      ]},
    ],
  },
  {
    id: "disability",
    name: "Short-Term Disability",
    icon: "💼",
    description: "Income protection if you can't work",
    carriers: [
      { name: "Choice Exchange", plans: [
        { id: "std-basic", tier: "Basic", price: 20 },
        { id: "std-standard", tier: "Standard", price: 35, popular: true },
        { id: "std-premium", tier: "Premium", price: 55 },
      ]},
      { name: "Unum", plans: [
        { id: "unum-basic", tier: "Basic", price: 22 },
        { id: "unum-standard", tier: "Standard", price: 38 },
        { id: "unum-premium", tier: "Premium", price: 60 },
      ]},
      { name: "Lincoln Financial", plans: [
        { id: "lincoln-basic", tier: "Basic", price: 18 },
        { id: "lincoln-standard", tier: "Standard", price: 32 },
        { id: "lincoln-premium", tier: "Premium", price: 50 },
      ]},
    ],
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
  
  const [activeTab, setActiveTab] = useState<PlanCategory>("ichra");
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
  const [selectedVoluntary, setSelectedVoluntary] = useState<Record<string, string>>({});

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

  const selectVoluntaryPlan = (categoryId: string, planId: string) => {
    setSelectedVoluntary(prev => ({
      ...prev,
      [categoryId]: prev[categoryId] === planId ? "" : planId,
    }));
  };

  const handleNext = () => {
    if (activeTab === "ichra") {
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
      setActiveTab("ichra");
    } else {
      setStep("coverage");
      navigate("/enroll/coverage");
    }
  };

  const getNextLabel = () => {
    if (activeTab === "ichra") return "Continue to Subscriptions";
    if (activeTab === "subscription") return "Continue to Voluntary";
    return "Review & Submit";
  };

  const canProceed = () => {
    if (activeTab === "ichra") return !!plan.medicalPlanId;
    return true; // Subscription and voluntary are optional
  };

  // Calculate total monthly cost
  const subscriptionTotal = selectedSubscriptions.reduce((sum, id) => {
    const sub = SUBSCRIPTION_PROVIDERS.find(s => s.id === id);
    return sum + (sub?.monthlyPrice || 0);
  }, 0);

  const voluntaryTotal = Object.entries(selectedVoluntary).reduce((sum, [categoryId, planId]) => {
    if (!planId) return sum;
    const category = VOLUNTARY_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return sum;
    for (const carrier of category.carriers) {
      const plan = carrier.plans.find(p => p.id === planId);
      if (plan) return sum + plan.price;
    }
    return sum;
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
      {(plan.medicalPlanId || selectedSubscriptions.length > 0 || Object.values(selectedVoluntary).some(v => v)) && (
        <Card className="border-primary/30 bg-primary/5 mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Monthly Total</p>
                <p className="text-2xl font-bold text-primary">${totalMonthly.toFixed(2)}/mo</p>
              </div>
              <div className="text-right text-sm space-y-0.5">
                {plan.medicalPlanId && <p className="text-muted-foreground">ICHRA Plan: <span className="text-foreground font-medium">${plan.monthlyPremium?.toFixed(2)}</span></p>}
                {subscriptionTotal > 0 && <p className="text-muted-foreground">Subscriptions: <span className="text-foreground font-medium">${subscriptionTotal.toFixed(2)}</span></p>}
                {voluntaryTotal > 0 && <p className="text-muted-foreground">Voluntary: <span className="text-foreground font-medium">${voluntaryTotal.toFixed(2)}</span></p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Category Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PlanCategory)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="ichra" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">ICHRA Plans</span>
            <span className="sm:hidden">ICHRA</span>
            {plan.medicalPlanId && <Check className="h-3 w-3" />}
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Subscription</span>
            <span className="sm:hidden">Sub</span>
            {selectedSubscriptions.length > 0 && (
              <Badge variant="secondary" className="h-5 min-w-5 px-1.5 justify-center text-xs">
                {selectedSubscriptions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="voluntary" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Umbrella className="h-4 w-4" />
            <span className="hidden sm:inline">Voluntary</span>
            <span className="sm:hidden">Vol</span>
            {Object.values(selectedVoluntary).filter(v => v).length > 0 && (
              <Badge variant="secondary" className="h-5 min-w-5 px-1.5 justify-center text-xs">
                {Object.values(selectedVoluntary).filter(v => v).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ICHRA Plans Tab */}
        <TabsContent value="ichra" className="space-y-4 mt-0">
          <div className="rounded-lg border bg-card p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Individual Health Plan (Empowered by ICHRA)</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your employer provides a monthly allowance to help cover the cost of individual health insurance. 
                  Select a plan that fits your needs.
                </p>
              </div>
            </div>
          </div>

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
            <div className="space-y-3">
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
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={cn("capitalize text-xs", METAL_TIER_COLORS[p.metal_tier.toLowerCase()])}>
                              {p.metal_tier}
                            </Badge>
                            {p.is_hsa_eligible && (
                              <Badge variant="outline" className="text-xs">HSA</Badge>
                            )}
                          </div>
                          <p className="font-semibold text-foreground">{p.plan_name}</p>
                          <p className="text-sm text-muted-foreground">{p.carrier_name} • {p.plan_type}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                            <span>Deductible: ${p.deductible.toLocaleString()}</span>
                            <span>OOP Max: ${p.out_of_pocket_max.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-bold text-primary">${p.monthly_premium.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">/month</p>
                          {isSelected && (
                            <div className="mt-2 flex items-center justify-end gap-1 text-primary">
                              <Check className="h-4 w-4" />
                              <span className="text-xs font-medium">Selected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-4 mt-0">
          <div className="rounded-lg border bg-card p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Subscription-Based Care</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add monthly subscriptions for direct access to care. These complement your ICHRA plan 
                  and provide convenient, transparent pricing.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {SUBSCRIPTION_PROVIDERS.map((provider) => {
              const isSelected = selectedSubscriptions.includes(provider.id);
              const IconComponent = provider.icon;
              
              return (
                <Card
                  key={provider.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    isSelected && "border-primary ring-2 ring-primary/20 bg-primary/5"
                  )}
                  onClick={() => toggleSubscription(provider.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-3 rounded-xl shrink-0",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{provider.name}</h4>
                              {provider.popular && (
                                <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">Popular</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{provider.provider}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-primary">${provider.monthlyPrice}</p>
                            <p className="text-xs text-muted-foreground">/month</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{provider.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">{provider.rating}</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{provider.specialty}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {provider.features.slice(0, 3).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs font-normal">
                              {feature}
                            </Badge>
                          ))}
                          {provider.features.length > 3 && (
                            <Badge variant="outline" className="text-xs font-normal">
                              +{provider.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="shrink-0">
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedSubscriptions.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Subscriptions are optional. Click "Continue" to skip or select any that interest you.
            </p>
          )}
        </TabsContent>

        {/* Voluntary Tab */}
        <TabsContent value="voluntary" className="space-y-6 mt-0">
          <div className="rounded-lg border bg-card p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Umbrella className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Voluntary Benefits</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add dental, vision, life insurance, and more. Choose from multiple carriers and 
                  coverage levels.
                </p>
              </div>
            </div>
          </div>

          {VOLUNTARY_CATEGORIES.map((category) => (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h4 className="font-semibold text-foreground">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {category.carriers.map((carrier) => (
                  <div key={carrier.name} className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground px-1">{carrier.name}</p>
                    <div className="space-y-2">
                      {carrier.plans.map((tierPlan) => {
                        const isSelected = selectedVoluntary[category.id] === tierPlan.id;
                        
                        return (
                          <Card
                            key={tierPlan.id}
                            className={cn(
                              "cursor-pointer transition-all hover:border-primary/50",
                              isSelected && "border-primary ring-2 ring-primary/20 bg-primary/5"
                            )}
                            onClick={() => selectVoluntaryPlan(category.id, tierPlan.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{tierPlan.tier}</span>
                                  {tierPlan.popular && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Popular</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-primary">${tierPlan.price}</span>
                                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.values(selectedVoluntary).filter(v => v).length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Voluntary benefits are optional. Click "Review & Submit" to proceed or select any that interest you.
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <EnrollmentNavigation
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={getNextLabel()}
        disabled={activeTab === "ichra" && !canProceed()}
        isLoading={isSaving}
        showBack={true}
      />
    </EnrollmentLayout>
  );
}
