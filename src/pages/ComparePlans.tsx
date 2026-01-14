import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Shield,
  DollarSign,
  Stethoscope,
  Building2,
  Heart,
  Leaf,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Star,
  Sparkles,
  Scale,
} from "lucide-react";

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

interface ComparisonRow {
  label: string;
  icon?: React.ReactNode;
  getValue: (plan: ICHRAPlan) => string | React.ReactNode;
  highlight?: "lowest" | "highest" | "boolean";
}

const ComparePlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<ICHRAPlan[]>([]);

  useEffect(() => {
    const storedPlans = sessionStorage.getItem("comparePlansData");
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    } else {
      navigate("/plans");
    }
  }, [navigate]);

  const comparisonRows: ComparisonRow[] = [
    {
      label: "Monthly Premium",
      icon: <DollarSign className="h-4 w-4" />,
      getValue: (plan) => `$${plan.monthly_premium.toLocaleString()}`,
      highlight: "lowest",
    },
    {
      label: "Deductible",
      icon: <DollarSign className="h-4 w-4" />,
      getValue: (plan) => `$${plan.deductible.toLocaleString()}`,
      highlight: "lowest",
    },
    {
      label: "Out-of-Pocket Max",
      icon: <DollarSign className="h-4 w-4" />,
      getValue: (plan) => `$${plan.out_of_pocket_max.toLocaleString()}`,
      highlight: "lowest",
    },
    {
      label: "Plan Type",
      getValue: (plan) => plan.plan_type,
    },
    {
      label: "Metal Tier",
      getValue: (plan) => (
        <Badge className={`${metalTierColors[plan.metal_tier] || "bg-muted"} flex items-center gap-1`}>
          {metalTierIcons[plan.metal_tier]}
          {plan.metal_tier}
        </Badge>
      ),
    },
    {
      label: "Primary Care Copay",
      icon: <Stethoscope className="h-4 w-4" />,
      getValue: (plan) => plan.copay_primary !== null ? `$${plan.copay_primary}` : "—",
      highlight: "lowest",
    },
    {
      label: "Specialist Copay",
      icon: <Building2 className="h-4 w-4" />,
      getValue: (plan) => plan.copay_specialist !== null ? `$${plan.copay_specialist}` : "—",
      highlight: "lowest",
    },
    {
      label: "Emergency Copay",
      icon: <Heart className="h-4 w-4" />,
      getValue: (plan) => plan.copay_emergency !== null ? `$${plan.copay_emergency}` : "—",
      highlight: "lowest",
    },
    {
      label: "HSA Eligible",
      icon: <Leaf className="h-4 w-4" />,
      getValue: (plan) => plan.is_hsa_eligible ? (
        <span className="flex items-center gap-1 text-accent">
          <CheckCircle2 className="h-4 w-4" /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1 text-muted-foreground">
          <XCircle className="h-4 w-4" /> No
        </span>
      ),
      highlight: "boolean",
    },
  ];

  const getLowestValue = (row: ComparisonRow): number | null => {
    if (row.highlight !== "lowest") return null;
    const values = plans.map(plan => {
      const val = row.getValue(plan);
      if (typeof val === "string") {
        const num = parseFloat(val.replace(/[$,]/g, ""));
        return isNaN(num) ? Infinity : num;
      }
      return Infinity;
    });
    return Math.min(...values);
  };

  const isLowestValue = (row: ComparisonRow, plan: ICHRAPlan): boolean => {
    if (row.highlight !== "lowest") return false;
    const lowest = getLowestValue(row);
    const val = row.getValue(plan);
    if (typeof val === "string") {
      const num = parseFloat(val.replace(/[$,]/g, ""));
      return num === lowest;
    }
    return false;
  };

  if (plans.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="container mx-auto px-4 relative z-10">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/plans")} 
              className="mb-6 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  Compare Plans
                </h1>
                <p className="text-muted-foreground">
                  Comparing {plans.length} health insurance plans side by side
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-8 pb-16">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Header Row - Plan Names */}
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="p-4 text-left font-semibold text-muted-foreground bg-muted/50 w-48 min-w-[12rem]">
                        Plan Details
                      </th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="p-4 text-center min-w-[14rem]">
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground font-normal">
                              {plan.carrier_name}
                            </p>
                            <p className="text-lg font-bold text-foreground">
                              {plan.plan_name}
                            </p>
                            <Badge className={`${metalTierColors[plan.metal_tier] || "bg-muted"} inline-flex items-center gap-1`}>
                              {metalTierIcons[plan.metal_tier]}
                              {plan.metal_tier}
                            </Badge>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Comparison Rows */}
                  <tbody>
                    {comparisonRows.map((row, idx) => (
                      <tr 
                        key={row.label} 
                        className={idx % 2 === 0 ? "bg-muted/20" : "bg-background"}
                      >
                        <td className="p-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            {row.icon && (
                              <span className="text-muted-foreground">{row.icon}</span>
                            )}
                            {row.label}
                          </div>
                        </td>
                        {plans.map((plan) => {
                          const isLowest = isLowestValue(row, plan);
                          return (
                            <td 
                              key={plan.id} 
                              className={`p-4 text-center font-semibold ${
                                isLowest ? "text-accent bg-accent/5" : "text-foreground"
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                {row.getValue(plan)}
                                {isLowest && (
                                  <Badge variant="outline" className="ml-2 text-xs border-accent text-accent">
                                    Lowest
                                  </Badge>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Features Row */}
                    <tr className="bg-muted/20">
                      <td className="p-4 font-medium text-foreground align-top">
                        Key Features
                      </td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="p-4 text-center align-top">
                          {plan.features && plan.features.length > 0 ? (
                            <div className="flex flex-wrap justify-center gap-1.5">
                              {plan.features.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Enroll Row */}
                    <tr className="border-t-2 border-border">
                      <td className="p-4"></td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="p-4 text-center">
                          <Button 
                            className="gradient-primary border-0"
                            asChild
                          >
                            <Link to="/auth?redirect=/ichra/enroll">
                              Enroll in This Plan
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {/* Lowest Premium */}
              {(() => {
                const lowestPremiumPlan = [...plans].sort((a, b) => a.monthly_premium - b.monthly_premium)[0];
                return lowestPremiumPlan ? (
                  <Card className="border-accent/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-accent" />
                        Lowest Premium
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-accent">${lowestPremiumPlan.monthly_premium}/mo</p>
                      <p className="text-sm text-muted-foreground mt-1">{lowestPremiumPlan.plan_name}</p>
                    </CardContent>
                  </Card>
                ) : null;
              })()}

              {/* Lowest Deductible */}
              {(() => {
                const lowestDeductiblePlan = [...plans].sort((a, b) => a.deductible - b.deductible)[0];
                return lowestDeductiblePlan ? (
                  <Card className="border-primary/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Lowest Deductible
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">${lowestDeductiblePlan.deductible.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">{lowestDeductiblePlan.plan_name}</p>
                    </CardContent>
                  </Card>
                ) : null;
              })()}

              {/* Lowest Out-of-Pocket */}
              {(() => {
                const lowestOOPPlan = [...plans].sort((a, b) => a.out_of_pocket_max - b.out_of_pocket_max)[0];
                return lowestOOPPlan ? (
                  <Card className="border-blue-500/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Heart className="h-5 w-5 text-blue-500" />
                        Lowest Out-of-Pocket Max
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-500">${lowestOOPPlan.out_of_pocket_max.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">{lowestOOPPlan.plan_name}</p>
                    </CardContent>
                  </Card>
                ) : null;
              })()}
            </div>

            {/* Help Section */}
            <Card className="mt-8 bg-muted/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Need help choosing?
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Our benefits advisors can help you find the right plan based on your healthcare needs and budget.
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/support">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ComparePlans;
