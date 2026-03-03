import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnrollmentStore } from "@/hooks/useEnrollmentStore";
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
  ArrowRight,
  Building2,
  Star,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

type PlanCategory = "ichra" | "voluntary";

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

// Voluntary benefits with detailed plans
const VOLUNTARY_BENEFITS_DATA: Record<string, {
  id: string;
  name: string;
  icon: string;
  description: string;
  plans: {
    id: string;
    name: string;
    carrier: string;
    tier: "Basic" | "Standard" | "Premium";
    monthlyPremium: number;
    features: string[];
    popular?: boolean;
  }[];
}> = {
  dental: {
    id: "dental",
    name: "Dental Coverage",
    icon: "🦷",
    description: "Choose a dental plan that fits your needs",
    plans: [
      { id: "dental-basic", name: "Dental Basic", carrier: "Choice Exchange", tier: "Basic", monthlyPremium: 25, features: ["2 preventive visits per year", "Basic cleanings & X-rays", "50% coverage on fillings", "No coverage for major work"] },
      { id: "dental-standard", name: "Dental Plus", carrier: "Choice Exchange", tier: "Standard", monthlyPremium: 45, features: ["2 preventive visits per year", "Full cleanings & X-rays", "80% coverage on fillings", "50% coverage on crowns & root canals"], popular: true },
      { id: "dental-premium", name: "Dental Premium", carrier: "Choice Exchange", tier: "Premium", monthlyPremium: 75, features: ["Unlimited preventive visits", "100% cleanings & X-rays", "100% coverage on fillings", "80% coverage on crowns"] },
      { id: "delta-dental-basic", name: "Delta Care Basic", carrier: "Delta Dental", tier: "Basic", monthlyPremium: 28, features: ["2 preventive visits per year", "100% cleanings covered", "60% coverage on fillings", "Large network of dentists"] },
      { id: "delta-dental-standard", name: "Delta PPO Plus", carrier: "Delta Dental", tier: "Standard", monthlyPremium: 52, features: ["2 preventive visits per year", "100% cleanings & X-rays", "80% coverage on fillings", "60% coverage on major work"] },
      { id: "delta-dental-premium", name: "Delta Premier", carrier: "Delta Dental", tier: "Premium", monthlyPremium: 82, features: ["Unlimited preventive visits", "100% cleanings & X-rays", "100% coverage on fillings", "80% coverage on major work"] },
      { id: "metlife-dental-basic", name: "MetLife Dental Essential", carrier: "MetLife", tier: "Basic", monthlyPremium: 22, features: ["2 preventive visits per year", "100% preventive coverage", "50% basic procedures", "Nationwide network"] },
      { id: "metlife-dental-standard", name: "MetLife Dental Preferred", carrier: "MetLife", tier: "Standard", monthlyPremium: 48, features: ["2 preventive visits per year", "100% preventive coverage", "80% basic procedures", "50% major procedures"] },
      { id: "metlife-dental-premium", name: "MetLife Dental Elite", carrier: "MetLife", tier: "Premium", monthlyPremium: 78, features: ["Unlimited preventive visits", "100% preventive coverage", "100% basic procedures", "80% major procedures"] },
    ],
  },
  vision: {
    id: "vision",
    name: "Vision Coverage",
    icon: "👁️",
    description: "Find the right vision plan for your eye care needs",
    plans: [
      { id: "vision-basic", name: "Vision Basic", carrier: "Choice Exchange", tier: "Basic", monthlyPremium: 10, features: ["Annual eye exam covered", "$100 frames allowance", "Standard lenses included", "20% off contact lenses"] },
      { id: "vision-standard", name: "Vision Plus", carrier: "Choice Exchange", tier: "Standard", monthlyPremium: 15, features: ["Annual eye exam covered", "$150 frames allowance", "Progressive lenses included", "$150 contact lens allowance"], popular: true },
      { id: "vision-premium", name: "Vision Premium", carrier: "Choice Exchange", tier: "Premium", monthlyPremium: 25, features: ["2 eye exams per year", "$250 frames allowance", "All lens types included", "$250 contact lens allowance"] },
      { id: "vsp-vision-basic", name: "VSP Basic", carrier: "VSP", tier: "Basic", monthlyPremium: 12, features: ["Annual WellVision exam", "$120 frames allowance", "Single vision lenses", "15% off lens options"] },
      { id: "vsp-vision-standard", name: "VSP Choice", carrier: "VSP", tier: "Standard", monthlyPremium: 18, features: ["Annual WellVision exam", "$180 frames allowance", "Progressive lenses included", "$180 contact lens allowance"] },
      { id: "vsp-vision-premium", name: "VSP Premier", carrier: "VSP", tier: "Premium", monthlyPremium: 28, features: ["Annual WellVision exam", "$300 frames allowance", "Premium progressives", "$300 contact lens allowance"] },
      { id: "eyemed-vision-basic", name: "EyeMed Access", carrier: "EyeMed", tier: "Basic", monthlyPremium: 9, features: ["Annual eye exam covered", "$100 frames allowance", "Standard plastic lenses", "40% off lens upgrades"] },
      { id: "eyemed-vision-standard", name: "EyeMed Select", carrier: "EyeMed", tier: "Standard", monthlyPremium: 16, features: ["Annual eye exam covered", "$150 frames allowance", "Progressive lenses", "$150 contact lens allowance"] },
      { id: "eyemed-vision-premium", name: "EyeMed Complete", carrier: "EyeMed", tier: "Premium", monthlyPremium: 26, features: ["2 eye exams per year", "$275 frames allowance", "All lens options", "$275 contact lens allowance"] },
    ],
  },
  life: {
    id: "life",
    name: "Life Insurance",
    icon: "🛡️",
    description: "Protect your loved ones with the right coverage",
    plans: [
      { id: "life-basic", name: "Term Life Basic", carrier: "Choice Exchange", tier: "Basic", monthlyPremium: 15, features: ["$50,000 death benefit", "Accidental death coverage", "No medical exam required", "Guaranteed acceptance"] },
      { id: "life-standard", name: "Term Life Plus", carrier: "Choice Exchange", tier: "Standard", monthlyPremium: 25, features: ["$100,000 death benefit", "Accidental death & dismemberment", "Living benefits included", "Spouse coverage available"], popular: true },
      { id: "life-premium", name: "Term Life Premium", carrier: "Choice Exchange", tier: "Premium", monthlyPremium: 45, features: ["$250,000 death benefit", "Full AD&D coverage", "Critical illness rider", "Family coverage included"] },
      { id: "metlife-life-basic", name: "MetLife Term Essential", carrier: "MetLife", tier: "Basic", monthlyPremium: 14, features: ["$50,000 death benefit", "Accidental death benefit", "Guaranteed issue", "24/7 claims support"] },
      { id: "metlife-life-standard", name: "MetLife Term Plus", carrier: "MetLife", tier: "Standard", monthlyPremium: 28, features: ["$150,000 death benefit", "AD&D included", "Accelerated death benefit", "Spouse coverage"] },
      { id: "metlife-life-premium", name: "MetLife Term Premier", carrier: "MetLife", tier: "Premium", monthlyPremium: 52, features: ["$300,000 death benefit", "Comprehensive AD&D", "Critical illness rider", "Child coverage included"] },
      { id: "prudential-life-basic", name: "Prudential Simple Term", carrier: "Prudential", tier: "Basic", monthlyPremium: 16, features: ["$75,000 death benefit", "Accidental death benefit", "Simplified underwriting", "Online account access"] },
      { id: "prudential-life-standard", name: "Prudential Term Flex", carrier: "Prudential", tier: "Standard", monthlyPremium: 30, features: ["$200,000 death benefit", "Full AD&D coverage", "Terminal illness benefit", "Portable coverage"] },
      { id: "prudential-life-premium", name: "Prudential Term Max", carrier: "Prudential", tier: "Premium", monthlyPremium: 55, features: ["$500,000 death benefit", "Enhanced AD&D", "Living benefits package", "Spouse & child coverage"] },
    ],
  },
  disability: {
    id: "disability",
    name: "Short-Term Disability",
    icon: "💼",
    description: "Income protection when you need it most",
    plans: [
      { id: "disability-basic", name: "STD Basic", carrier: "Choice Exchange", tier: "Basic", monthlyPremium: 20, features: ["50% income replacement", "Up to 12 weeks coverage", "14-day waiting period", "Injury & illness covered"] },
      { id: "disability-standard", name: "STD Plus", carrier: "Choice Exchange", tier: "Standard", monthlyPremium: 35, features: ["60% income replacement", "Up to 26 weeks coverage", "7-day waiting period", "Mental health coverage"], popular: true },
      { id: "disability-premium", name: "STD Premium", carrier: "Choice Exchange", tier: "Premium", monthlyPremium: 55, features: ["70% income replacement", "Up to 52 weeks coverage", "0-day accident waiting period", "Pregnancy coverage"] },
      { id: "unum-disability-basic", name: "Unum STD Core", carrier: "Unum", tier: "Basic", monthlyPremium: 22, features: ["50% income replacement", "Up to 13 weeks coverage", "14-day waiting period", "Leave management support"] },
      { id: "unum-disability-standard", name: "Unum STD Plus", carrier: "Unum", tier: "Standard", monthlyPremium: 38, features: ["60% income replacement", "Up to 26 weeks coverage", "7-day waiting period", "Return-to-work support"] },
      { id: "unum-disability-premium", name: "Unum STD Premier", carrier: "Unum", tier: "Premium", monthlyPremium: 60, features: ["70% income replacement", "Up to 52 weeks coverage", "0-day accident wait", "Comprehensive coverage"] },
      { id: "lincoln-disability-basic", name: "Lincoln STD Essential", carrier: "Lincoln Financial", tier: "Basic", monthlyPremium: 18, features: ["50% income replacement", "Up to 11 weeks coverage", "14-day waiting period", "Online claims"] },
      { id: "lincoln-disability-standard", name: "Lincoln STD Select", carrier: "Lincoln Financial", tier: "Standard", monthlyPremium: 32, features: ["60% income replacement", "Up to 26 weeks coverage", "7-day waiting period", "Rehabilitation support"] },
      { id: "lincoln-disability-premium", name: "Lincoln STD Complete", carrier: "Lincoln Financial", tier: "Premium", monthlyPremium: 50, features: ["70% income replacement", "Up to 52 weeks coverage", "0-day accident wait", "Family leave coverage"] },
    ],
  },
};

export default function EnrollPlans() {
  const navigate = useNavigate();
  const { 
    plan, 
    coverage,
    about,
    intent,
    updatePlan, 
    setStep,
    isLoading: dbLoading,
    isSaving,
    canAccessStep,
    saveToDatabase
  } = useEnrollmentStore();

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
  
  // Selected plans for voluntary — initialize from store
  const [selectedVoluntary, setSelectedVoluntary] = useState<Record<string, string>>(plan.voluntarySelections || {});

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
    } catch {
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

  const selectVoluntaryPlan = (categoryId: string, planId: string) => {
    const newSelections = {
      ...selectedVoluntary,
      [categoryId]: selectedVoluntary[categoryId] === planId ? "" : planId,
    };
    setSelectedVoluntary(newSelections);
    updatePlan({ voluntarySelections: newSelections });
  };

  const handleNext = () => {
    if (activeTab === "ichra") {
      setActiveTab("voluntary");
    } else if (activeTab === "voluntary") {
      setStep("review");
      navigate("/enroll/review");
    }
  };

  const handleBack = () => {
    if (activeTab === "voluntary") {
      setActiveTab("ichra");
    } else {
      setStep("coverage");
      navigate("/enroll/coverage");
    }
  };

  const getNextLabel = () => {
    if (activeTab === "ichra") return "Continue to Voluntary Benefits";
    return "Review & Submit";
  };

  const canProceed = () => {
    if (activeTab === "ichra") return !!plan.medicalPlanId;
    return true; // Voluntary is optional
  };

  const voluntaryTotal = Object.entries(selectedVoluntary).reduce((sum, [categoryId, planId]) => {
    if (!planId) return sum;
    const benefitData = VOLUNTARY_BENEFITS_DATA[categoryId];
    if (!benefitData) return sum;
    const benefitPlan = benefitData.plans.find(p => p.id === planId);
    if (benefitPlan) return sum + benefitPlan.monthlyPremium;
    return sum;
  }, 0);

  const totalMonthly = (plan.monthlyPremium || 0) + voluntaryTotal;

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
      description="Choose your health insurance and voluntary benefits."
      onSave={saveToDatabase}
      wide={true}
    >
      {/* Monthly Cost Summary */}
      {(plan.medicalPlanId || Object.values(selectedVoluntary).some(v => v)) && (
        <Card className="border-primary/30 bg-card mb-6 shadow-sm">
          <CardContent className="py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Estimated Monthly Total
                </p>
                <p className="text-2xl font-bold text-primary">${totalMonthly.toFixed(2)}/mo</p>
              </div>
            </div>
            <div className="border-t border-primary/20 pt-3 space-y-2 text-sm">
              {selectedPlanDetails && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{selectedPlanDetails.plan_name}</p>
                    <p className="text-xs text-muted-foreground">{selectedPlanDetails.carrier_name} • ICHRA Medical</p>
                  </div>
                  <span className="font-semibold text-foreground">${selectedPlanDetails.monthly_premium.toFixed(2)}</span>
                </div>
              )}
              {Object.entries(selectedVoluntary).map(([categoryId, planId]) => {
                if (!planId) return null;
                const benefitData = VOLUNTARY_BENEFITS_DATA[categoryId];
                if (!benefitData) return null;
                const benefitPlan = benefitData.plans.find(p => p.id === planId);
                if (!benefitPlan) return null;
                return (
                  <div key={categoryId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{benefitPlan.name}</p>
                      <p className="text-xs text-muted-foreground">{benefitPlan.carrier} • {benefitData.name}</p>
                    </div>
                    <span className="font-semibold text-foreground">${benefitPlan.monthlyPremium.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard ICHRA Path: Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PlanCategory)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger value="ichra" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">ICHRA Plans</span>
              <span className="sm:hidden">ICHRA</span>
              {plan.medicalPlanId && <Check className="h-3 w-3" />}
            </TabsTrigger>
            <TabsTrigger value="voluntary" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Umbrella className="h-4 w-4" />
              <span className="hidden sm:inline">Voluntary Benefits</span>
              <span className="sm:hidden">Voluntary</span>
              {Object.values(selectedVoluntary).filter(v => v).length > 0 && (
                <Badge variant="secondary" className="h-5 min-w-5 px-1.5 justify-center text-xs">
                  {Object.values(selectedVoluntary).filter(v => v).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ICHRA Plans Tab */}
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

                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Searching for plans in your area...</p>
                  </div>
                )}

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
                            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                              <span className="text-sm text-muted-foreground">Monthly Premium</span>
                              <span className="text-2xl font-bold text-primary">
                                ${p.monthly_premium.toLocaleString()}
                              </span>
                            </div>

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

          {/* Voluntary Tab */}
          <TabsContent value="voluntary" className="mt-0">
            <div className="rounded-lg border bg-card p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Umbrella className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Voluntary Benefits</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add dental, vision, life insurance, and more. Click on a category to view plans.
                  </p>
                </div>
              </div>
            </div>

            <Accordion type="multiple" className="space-y-4">
              {Object.values(VOLUNTARY_BENEFITS_DATA).map((benefitData) => {
                const carriers = [...new Set(benefitData.plans.map(p => p.carrier))];
                const selectedPlanId = selectedVoluntary[benefitData.id];
                const selectedPlan = benefitData.plans.find(p => p.id === selectedPlanId);
                
                return (
                  <AccordionItem 
                    key={benefitData.id} 
                    value={benefitData.id}
                    className="border rounded-lg overflow-hidden bg-card"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                      <div className="flex items-center gap-4 w-full">
                        <span className="text-3xl">{benefitData.icon}</span>
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-semibold text-foreground">{benefitData.name}</h3>
                          <p className="text-sm text-muted-foreground">{benefitData.description}</p>
                        </div>
                        {selectedPlan && (
                          <div className="flex items-center gap-2 mr-4">
                            <Badge className="bg-accent text-accent-foreground">
                              <Check className="h-3 w-3 mr-1" />
                              {selectedPlan.name}
                            </Badge>
                            <span className="text-sm font-semibold text-primary">${selectedPlan.monthlyPremium}/mo</span>
                          </div>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-6 pt-4">
                        {carriers.map((carrier, carrierIndex) => {
                          const carrierPlans = benefitData.plans.filter(p => p.carrier === carrier);
                          
                          return (
                            <div key={carrier} className="space-y-3">
                              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                                <div className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold",
                                  carrierIndex === 0 ? "bg-primary/10 text-primary" :
                                  carrierIndex === 1 ? "bg-accent/10 text-accent" :
                                  "bg-muted text-muted-foreground"
                                )}>
                                  {carrier.charAt(0)}
                                </div>
                                <h4 className="text-base font-semibold text-foreground">{carrier}</h4>
                                {carrierIndex === 0 && (
                                  <Badge variant="outline" className="text-xs">Our Plans</Badge>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {carrierPlans.map((volPlan) => {
                                  const isSelected = selectedVoluntary[benefitData.id] === volPlan.id;
                                  
                                  return (
                                    <Card 
                                      key={volPlan.id}
                                      className={cn(
                                        "relative cursor-pointer transition-all hover:shadow-lg",
                                        volPlan.popular ? "border-2 border-primary shadow-md" : "border",
                                        isSelected && "ring-2 ring-accent bg-accent/5"
                                      )}
                                      onClick={() => selectVoluntaryPlan(benefitData.id, volPlan.id)}
                                    >
                                      {volPlan.popular && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                                          <Star className="h-3 w-3 mr-1" /> Most Popular
                                        </Badge>
                                      )}
                                      <CardHeader className="text-center pb-2 pt-4">
                                        <Badge 
                                          variant="outline" 
                                          className={cn(
                                            "w-fit mx-auto mb-2",
                                            volPlan.tier === "Basic" ? "border-muted-foreground text-muted-foreground" :
                                            volPlan.tier === "Standard" ? "border-primary text-primary" :
                                            "border-accent text-accent"
                                          )}
                                        >
                                          {volPlan.tier}
                                        </Badge>
                                        <CardTitle className="text-base">{volPlan.name}</CardTitle>
                                        <div className="mt-2">
                                          <span className="text-2xl font-bold text-foreground">${volPlan.monthlyPremium}</span>
                                          <span className="text-muted-foreground text-sm">/mo</span>
                                        </div>
                                      </CardHeader>
                                      <CardContent className="pt-2 pb-4">
                                        <ul className="space-y-1.5 mb-4">
                                          {volPlan.features.slice(0, 4).map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-xs">
                                              <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
                                              <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                          ))}
                                        </ul>
                                        <Button 
                                          className={cn("w-full gap-2", isSelected && "bg-accent hover:bg-accent/90")}
                                          size="sm"
                                          variant={isSelected ? "default" : volPlan.popular ? "default" : "outline"}
                                        >
                                          {isSelected ? (
                                            <>
                                              <Check className="h-3.5 w-3.5" />
                                              Selected
                                            </>
                                          ) : (
                                            "Select Plan"
                                          )}
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {Object.values(selectedVoluntary).filter(v => v).length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-6">
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
        disabled={!canProceed()}
        isLoading={isSaving}
        showBack={true}
      />
    </EnrollmentLayout>
  );
}
