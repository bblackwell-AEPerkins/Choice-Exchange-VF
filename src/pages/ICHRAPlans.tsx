import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DEMO_MODE, filterPlansByZip, simulateDelay, type MockICHRAPlan } from "@/lib/mockData";
import {
  Shield,
  Search,
  MapPin,
  Heart,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Building2,
  Sparkles,
  Filter,
  SlidersHorizontal,
  Loader2,
  AlertCircle,
  Star,
  Leaf,
  Scale,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ICHRAPlan {
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
  is_hsa_eligible: boolean;
  features: string[] | null;
  coverage_areas: string[];
}

const metalTierColors: Record<string, string> = {
  Bronze: "bg-amber-100 text-amber-800 border-amber-300",
  Silver: "bg-slate-100 text-slate-700 border-slate-300",
  Gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Platinum: "bg-purple-100 text-purple-800 border-purple-300",
  Catastrophic: "bg-gray-100 text-gray-700 border-gray-300",
};

const metalTierIcons: Record<string, React.ReactNode> = {
  Bronze: <Shield className="h-4 w-4" />,
  Silver: <Shield className="h-4 w-4" />,
  Gold: <Star className="h-4 w-4" />,
  Platinum: <Sparkles className="h-4 w-4" />,
  Catastrophic: <Heart className="h-4 w-4" />,
};

const ICHRAPlans = () => {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState("");
  const [searchedZip, setSearchedZip] = useState("");
  const [plans, setPlans] = useState<ICHRAPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [metalFilter, setMetalFilter] = useState<string>("all");
  const [planTypeFilter, setPlanTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("premium-low");
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

  const togglePlanSelection = (planId: string) => {
    setSelectedPlans(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      }
      if (prev.length >= 3) {
        return prev; // Max 3 plans
      }
      return [...prev, planId];
    });
  };

  const handleCompare = () => {
    if (selectedPlans.length >= 2) {
      // Store selected plans in sessionStorage for the compare page
      sessionStorage.setItem("comparePlans", JSON.stringify(selectedPlans));
      sessionStorage.setItem("comparePlansData", JSON.stringify(
        plans.filter(p => selectedPlans.includes(p.id))
      ));
      navigate("/compare-plans");
    }
  };

  const fetchPlans = async (zip: string) => {
    if (!zip || zip.length < 5) return;
    
    setLoading(true);
    setHasSearched(true);
    setSearchedZip(zip);

    try {
      if (DEMO_MODE) {
        await simulateDelay(400);
        const filteredPlans = filterPlansByZip(zip);
        setPlans(filteredPlans as ICHRAPlan[]);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
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
    .filter((plan) => {
      if (metalFilter !== "all" && plan.metal_tier !== metalFilter) return false;
      if (planTypeFilter !== "all" && plan.plan_type !== planTypeFilter) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "premium-low":
          return a.monthly_premium - b.monthly_premium;
        case "premium-high":
          return b.monthly_premium - a.monthly_premium;
        case "deductible-low":
          return a.deductible - b.deductible;
        case "oop-low":
          return a.out_of_pocket_max - b.out_of_pocket_max;
        default:
          return 0;
      }
    });

  const uniqueMetalTiers = [...new Set(plans.map((p) => p.metal_tier))];
  const uniquePlanTypes = [...new Set(plans.map((p) => p.plan_type))];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Shield className="h-3 w-3 mr-1" />
              ICHRA-Compatible Plans
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Find Health Plans in Your Area
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse individual health insurance plans that work with your employer's ICHRA benefit. 
              Enter your zip code to see available options.
            </p>
          </div>

          {/* Search Box */}
          <Card className="max-w-2xl mx-auto shadow-xl border-2">
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
                  className="h-12 px-8 gradient-primary border-0"
                  disabled={zipCode.length < 5 || loading}
                >
                  {loading ? (
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
                  No account required
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Compare multiple plans
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  ICHRA-eligible options
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">
                  {loading ? "Searching..." : `${filteredPlans.length} Plans Available`}
                </h2>
                {searchedZip && !loading && (
                  <p className="text-muted-foreground">
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
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Searching for plans in your area...</p>
              </div>
            )}

            {/* No Results */}
            {!loading && plans.length === 0 && (
              <Card className="max-w-lg mx-auto">
                <CardContent className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Plans Found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any plans for ZIP code {searchedZip}. 
                    Try a different ZIP code or contact support.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/support">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Plan Cards */}
            {!loading && filteredPlans.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => {
                  const isSelected = selectedPlans.includes(plan.id);
                  return (
                  <Card 
                    key={plan.id} 
                    className={`group hover:shadow-lg transition-all duration-300 ${
                      isSelected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"
                    }`}
                  >
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => togglePlanSelection(plan.id)}
                            disabled={!isSelected && selectedPlans.length >= 3}
                            className="mt-1"
                          />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{plan.carrier_name}</p>
                            <CardTitle className="text-lg mt-1">{plan.plan_name}</CardTitle>
                          </div>
                        </div>
                        <Badge className={`${metalTierColors[plan.metal_tier] || "bg-muted"} flex items-center gap-1 flex-shrink-0`}>
                          {metalTierIcons[plan.metal_tier]}
                          {plan.metal_tier}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {plan.plan_type}
                        </Badge>
                        {plan.is_hsa_eligible && (
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
                          ${plan.monthly_premium.toLocaleString()}
                        </span>
                      </div>

                      {/* Key Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-2 rounded bg-muted/50">
                          <p className="text-xs text-muted-foreground">Deductible</p>
                          <p className="font-semibold">${plan.deductible.toLocaleString()}</p>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <p className="text-xs text-muted-foreground">Out-of-Pocket Max</p>
                          <p className="font-semibold">${plan.out_of_pocket_max.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Copays */}
                      <div className="space-y-2 text-sm">
                        {plan.copay_primary !== null && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2">
                              <Stethoscope className="h-4 w-4" />
                              Primary Care
                            </span>
                            <span className="font-medium">${plan.copay_primary} copay</span>
                          </div>
                        )}
                        {plan.copay_specialist !== null && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              Specialist
                            </span>
                            <span className="font-medium">${plan.copay_specialist} copay</span>
                          </div>
                        )}
                        {plan.copay_emergency !== null && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2">
                              <Heart className="h-4 w-4" />
                              Emergency
                            </span>
                            <span className="font-medium">${plan.copay_emergency} copay</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="pt-3 border-t">
                          <div className="flex flex-wrap gap-1.5">
                            {plan.features.slice(0, 3).map((feature, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
                              >
                                {feature}
                              </span>
                            ))}
                            {plan.features.length > 3 && (
                              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                +{plan.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* CTA Buttons */}
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant={isSelected ? "default" : "outline"}
                          className={`flex-1 ${isSelected ? "gradient-primary border-0" : ""}`}
                          onClick={() => togglePlanSelection(plan.id)}
                          disabled={!isSelected && selectedPlans.length >= 3}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Selected
                            </>
                          ) : (
                            <>
                              <Scale className="h-4 w-4 mr-1" />
                              Compare
                            </>
                          )}
                        </Button>
                        <Button variant="outline" asChild className="flex-1">
                          <Link to="/auth?redirect=/ichra/enroll">
                            Enroll
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            )}

            {/* Floating Compare Bar */}
            {selectedPlans.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <Card className="shadow-2xl border-2 border-primary/30 bg-card/95 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-primary" />
                        <span className="font-medium text-sm">
                          {selectedPlans.length} plan{selectedPlans.length !== 1 ? "s" : ""} selected
                        </span>
                        <span className="text-xs text-muted-foreground">(max 3)</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPlans([])}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Clear
                        </Button>
                        <Button
                          size="sm"
                          className="gradient-primary border-0"
                          onClick={handleCompare}
                          disabled={selectedPlans.length < 2}
                        >
                          Compare Plans
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Info Section - Before Search */}
      {!hasSearched && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-display font-bold text-center text-foreground mb-8">
                How ICHRA Works With Individual Plans
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">1. Browse Plans</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your ZIP code to see all health insurance plans available in your area.
                  </p>
                </Card>

                <Card className="text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">2. Apply ICHRA Allowance</h3>
                  <p className="text-sm text-muted-foreground">
                    Your employer's monthly ICHRA allowance offsets your premium costs.
                  </p>
                </Card>

                <Card className="text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">3. Enroll & Get Covered</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete enrollment and start using your health coverage right away.
                  </p>
                </Card>
              </div>

              <div className="mt-12 p-6 rounded-xl bg-muted/50 border">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Already have an ICHRA offer from your employer?
                    </h3>
                    <p className="text-muted-foreground">
                      Sign in to see your personalized allowance and complete your enrollment with employer-sponsored benefits.
                    </p>
                  </div>
                  <Button asChild className="gradient-primary border-0 whitespace-nowrap">
                    <Link to="/ichra/enroll">
                      Start ICHRA Enrollment
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ICHRAPlans;
