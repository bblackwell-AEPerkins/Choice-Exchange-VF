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
  CheckCircle2,
  Leaf,
  Sparkles,
  SlidersHorizontal,
  AlertCircle,
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
  copay_emergency?: number | null;
  is_hsa_eligible: boolean;
  features: string[] | null;
  plan_type: string;
}

type PlanCategory = "ichra" | "subscription" | "voluntary";

const metalTierColors: Record<string, string> = {
  Bronze: "bg-amber-100 text-amber-800 border-amber-300",
  Silver: "bg-slate-100 text-slate-700 border-slate-300",
  Gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Platinum: "bg-purple-100 text-purple-800 border-purple-300",
  Catastrophic: "bg-gray-100 text-gray-700 border-gray-300",
  bronze: "bg-amber-100 text-amber-800 border-amber-300",
  silver: "bg-slate-100 text-slate-700 border-slate-300",
  gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
  platinum: "bg-purple-100 text-purple-800 border-purple-300",
};

const metalTierIcons: Record<string, React.ReactNode> = {
  Bronze: <Shield className="h-4 w-4" />,
  Silver: <Shield className="h-4 w-4" />,
  Gold: <Star className="h-4 w-4" />,
  Platinum: <Sparkles className="h-4 w-4" />,
  Catastrophic: <Heart className="h-4 w-4" />,
  bronze: <Shield className="h-4 w-4" />,
  silver: <Shield className="h-4 w-4" />,
  gold: <Star className="h-4 w-4" />,
  platinum: <Sparkles className="h-4 w-4" />,
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
  const [planTypeFilter, setPlanTypeFilter] = useState<string>("all");
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filter and sort plans
  const filteredPlans = plans
    .filter((p) => {
      if (metalFilter !== "all" && p.metal_tier !== metalFilter) return false;
      if (planTypeFilter !== "all" && p.plan_type !== planTypeFilter) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "premium-low": return a.monthly_premium - b.monthly_premium;
        case "premium-high": return b.monthly_premium - a.monthly_premium;
        case "deductible-low": return a.deductible - b.deductible;
        case "oop-low": return a.out_of_pocket_max - b.out_of_pocket_max;
        default: return 0;
      }
    });

  const uniqueMetalTiers = [...new Set(plans.map((p) => p.metal_tier))];
  const uniquePlanTypes = [...new Set(plans.map((p) => p.plan_type))];

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

        {/* ICHRA Plans Tab - Matching ICHRAPlans.tsx styling */}
        <TabsContent value="ichra" className="space-y-6 mt-0">
          {/* Header with badge */}
          <div className="text-center">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
              <Shield className="h-3 w-3 mr-1" />
              ICHRA-Compatible Plans
            </Badge>
            <p className="text-sm text-muted-foreground">
              Browse individual health insurance plans that work with your employer's ICHRA benefit.
            </p>
          </div>

          {/* Search Box */}
          <Card className="shadow-lg border-2">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 text-lg"
                    maxLength={5}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={zipCode.length < 5 || isLoading}
                  className="h-12 px-8"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Search Plans
                    </>
                  )}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Compare options
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  ICHRA-eligible plans
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Employer allowance applied
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {hasSearched && (
            <div className="space-y-4">
              {/* Results Header with Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {isLoading ? "Searching..." : `${filteredPlans.length} Plans Available`}
                  </h3>
                  {searchedZip && !isLoading && (
                    <p className="text-sm text-muted-foreground">
                      Showing plans available in ZIP code {searchedZip}
                    </p>
                  )}
                </div>

                {/* Filters */}
                {plans.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <Select value={metalFilter} onValueChange={setMetalFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Metal Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        {uniqueMetalTiers.map((tier) => (
                          <SelectItem key={tier} value={tier}>
                            {tier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={planTypeFilter} onValueChange={setPlanTypeFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Plan Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {uniquePlanTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="premium-low">Premium: Low to High</SelectItem>
                        <SelectItem value="premium-high">Premium: High to Low</SelectItem>
                        <SelectItem value="deductible-low">Deductible: Low to High</SelectItem>
                        <SelectItem value="oop-low">Out-of-Pocket: Low to High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Searching for plans in your area...</p>
                </div>
              )}

              {/* No Results */}
              {!isLoading && plans.length === 0 && (
                <Card className="max-w-lg mx-auto">
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Plans Found</h3>
                    <p className="text-muted-foreground">
                      We couldn't find any plans for ZIP code {searchedZip}. 
                      Try a different ZIP code.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Plan Cards Grid - matching ICHRAPlans.tsx */}
              {!isLoading && filteredPlans.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredPlans.map((p) => {
                    const isSelected = plan.medicalPlanId === p.id;
                    const tierKey = p.metal_tier.charAt(0).toUpperCase() + p.metal_tier.slice(1).toLowerCase();
                    
                    return (
                      <Card 
                        key={p.id} 
                        className={cn(
                          "cursor-pointer transition-all duration-300 hover:shadow-lg",
                          isSelected 
                            ? "border-primary ring-2 ring-primary/20" 
                            : "hover:border-primary/50"
                        )}
                        onClick={() => handleSelectInsurancePlan(p)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">{p.carrier_name}</p>
                              <CardTitle className="text-lg mt-1">{p.plan_name}</CardTitle>
                            </div>
                            <Badge className={cn("flex items-center gap-1 flex-shrink-0", metalTierColors[tierKey] || metalTierColors[p.metal_tier] || "bg-muted")}>
                              {metalTierIcons[tierKey] || metalTierIcons[p.metal_tier]}
                              {p.metal_tier}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {p.plan_type}
                            </Badge>
                            {p.is_hsa_eligible && (
                              <Badge variant="outline" className="text-xs border-accent text-accent">
                                <Leaf className="h-3 w-3 mr-1" />
                                HSA Eligible
                              </Badge>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Premium */}
                          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                            <span className="text-sm text-muted-foreground">Monthly Premium</span>
                            <span className="text-2xl font-bold text-primary">
                              ${p.monthly_premium.toLocaleString()}
                            </span>
                          </div>

                          {/* Key Details */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-2 rounded bg-muted/50">
                              <p className="text-xs text-muted-foreground">Deductible</p>
                              <p className="font-semibold">${p.deductible.toLocaleString()}</p>
                            </div>
                            <div className="p-2 rounded bg-muted/50">
                              <p className="text-xs text-muted-foreground">Out-of-Pocket Max</p>
                              <p className="font-semibold">${p.out_of_pocket_max.toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Copays */}
                          <div className="space-y-2 text-sm">
                            {p.copay_primary !== null && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                  <Stethoscope className="h-4 w-4" />
                                  Primary Care
                                </span>
                                <span className="font-medium">${p.copay_primary} copay</span>
                              </div>
                            )}
                            {p.copay_specialist !== null && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  Specialist
                                </span>
                                <span className="font-medium">${p.copay_specialist} copay</span>
                              </div>
                            )}
                            {p.copay_emergency !== null && p.copay_emergency !== undefined && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                  <Heart className="h-4 w-4" />
                                  Emergency
                                </span>
                                <span className="font-medium">${p.copay_emergency} copay</span>
                              </div>
                            )}
                          </div>

                          {/* Features */}
                          {p.features && p.features.length > 0 && (
                            <div className="pt-3 border-t">
                              <div className="flex flex-wrap gap-1.5">
                                {p.features.slice(0, 3).map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
                                  >
                                    {feature}
                                  </span>
                                ))}
                                {p.features.length > 3 && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                    +{p.features.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Select Button */}
                          <Button 
                            variant={isSelected ? "default" : "outline"}
                            className={cn("w-full", isSelected && "bg-primary")}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Selected
                              </>
                            ) : (
                              <>
                                Select Plan
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Initial State - No search yet */}
          {!hasSearched && (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-12 text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Enter your ZIP code</p>
                <p className="text-muted-foreground">
                  Search for health plans available in your area
                </p>
              </CardContent>
            </Card>
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
