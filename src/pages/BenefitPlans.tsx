import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Star, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Plan data for each benefit type
const benefitPlansData: Record<string, {
  title: string;
  icon: string;
  description: string;
  plans: {
    id: string;
    name: string;
    tier: "Basic" | "Standard" | "Premium";
    monthlyPremium: number;
    features: string[];
    popular?: boolean;
  }[];
}> = {
  dental: {
    title: "Dental Coverage",
    icon: "🦷",
    description: "Choose a dental plan that fits your needs",
    plans: [
      {
        id: "dental-basic",
        name: "Dental Basic",
        tier: "Basic",
        monthlyPremium: 25,
        features: [
          "2 preventive visits per year",
          "Basic cleanings & X-rays",
          "50% coverage on fillings",
          "No coverage for major work",
        ],
      },
      {
        id: "dental-standard",
        name: "Dental Plus",
        tier: "Standard",
        monthlyPremium: 45,
        features: [
          "2 preventive visits per year",
          "Full cleanings & X-rays",
          "80% coverage on fillings",
          "50% coverage on crowns & root canals",
          "Orthodontic consultation included",
        ],
        popular: true,
      },
      {
        id: "dental-premium",
        name: "Dental Premium",
        tier: "Premium",
        monthlyPremium: 75,
        features: [
          "Unlimited preventive visits",
          "100% cleanings & X-rays",
          "100% coverage on fillings",
          "80% coverage on crowns & root canals",
          "$1,500 orthodontic benefit",
          "Cosmetic dentistry discounts",
        ],
      },
    ],
  },
  vision: {
    title: "Vision Coverage",
    icon: "👁️",
    description: "Find the right vision plan for your eye care needs",
    plans: [
      {
        id: "vision-basic",
        name: "Vision Basic",
        tier: "Basic",
        monthlyPremium: 10,
        features: [
          "Annual eye exam covered",
          "$100 frames allowance",
          "Standard lenses included",
          "20% off contact lenses",
        ],
      },
      {
        id: "vision-standard",
        name: "Vision Plus",
        tier: "Standard",
        monthlyPremium: 15,
        features: [
          "Annual eye exam covered",
          "$150 frames allowance",
          "Progressive lenses included",
          "$150 contact lens allowance",
          "Blue light coating included",
        ],
        popular: true,
      },
      {
        id: "vision-premium",
        name: "Vision Premium",
        tier: "Premium",
        monthlyPremium: 25,
        features: [
          "2 eye exams per year",
          "$250 frames allowance",
          "All lens types included",
          "$250 contact lens allowance",
          "LASIK discount (15% off)",
          "Designer frames included",
        ],
      },
    ],
  },
  life: {
    title: "Life Insurance",
    icon: "🛡️",
    description: "Protect your loved ones with the right coverage",
    plans: [
      {
        id: "life-basic",
        name: "Term Life Basic",
        tier: "Basic",
        monthlyPremium: 15,
        features: [
          "$50,000 death benefit",
          "Accidental death coverage",
          "No medical exam required",
          "Guaranteed acceptance",
        ],
      },
      {
        id: "life-standard",
        name: "Term Life Plus",
        tier: "Standard",
        monthlyPremium: 25,
        features: [
          "$100,000 death benefit",
          "Accidental death & dismemberment",
          "Living benefits included",
          "Spouse coverage available",
          "Portable coverage",
        ],
        popular: true,
      },
      {
        id: "life-premium",
        name: "Term Life Premium",
        tier: "Premium",
        monthlyPremium: 45,
        features: [
          "$250,000 death benefit",
          "Full AD&D coverage",
          "Critical illness rider",
          "Family coverage included",
          "Cash value accumulation",
          "Flexible beneficiary options",
        ],
      },
    ],
  },
  disability: {
    title: "Short-Term Disability",
    icon: "💼",
    description: "Income protection when you need it most",
    plans: [
      {
        id: "disability-basic",
        name: "STD Basic",
        tier: "Basic",
        monthlyPremium: 20,
        features: [
          "50% income replacement",
          "Up to 12 weeks coverage",
          "14-day waiting period",
          "Injury & illness covered",
        ],
      },
      {
        id: "disability-standard",
        name: "STD Plus",
        tier: "Standard",
        monthlyPremium: 35,
        features: [
          "60% income replacement",
          "Up to 26 weeks coverage",
          "7-day waiting period",
          "Mental health coverage",
          "Rehabilitation support",
        ],
        popular: true,
      },
      {
        id: "disability-premium",
        name: "STD Premium",
        tier: "Premium",
        monthlyPremium: 55,
        features: [
          "70% income replacement",
          "Up to 52 weeks coverage",
          "0-day accident waiting period",
          "Pregnancy coverage",
          "Return-to-work incentives",
          "Long-term disability bridge",
        ],
      },
    ],
  },
  accident: {
    title: "Accident Insurance",
    icon: "🏥",
    description: "Financial protection for unexpected injuries",
    plans: [
      {
        id: "accident-basic",
        name: "Accident Basic",
        tier: "Basic",
        monthlyPremium: 12,
        features: [
          "$5,000 accident benefit",
          "ER visit: $250",
          "Hospital admission: $500",
          "Fractures covered",
        ],
      },
      {
        id: "accident-standard",
        name: "Accident Plus",
        tier: "Standard",
        monthlyPremium: 20,
        features: [
          "$10,000 accident benefit",
          "ER visit: $500",
          "Hospital admission: $1,000",
          "Follow-up visits covered",
          "Physical therapy benefit",
        ],
        popular: true,
      },
      {
        id: "accident-premium",
        name: "Accident Premium",
        tier: "Premium",
        monthlyPremium: 35,
        features: [
          "$25,000 accident benefit",
          "ER visit: $750",
          "Hospital admission: $2,000",
          "Ambulance covered",
          "Wellness benefit",
          "Family coverage included",
        ],
      },
    ],
  },
  critical: {
    title: "Critical Illness",
    icon: "❤️",
    description: "Lump-sum coverage for major health diagnoses",
    plans: [
      {
        id: "critical-basic",
        name: "Critical Basic",
        tier: "Basic",
        monthlyPremium: 18,
        features: [
          "$10,000 lump-sum benefit",
          "Cancer coverage",
          "Heart attack & stroke",
          "No waiting period",
        ],
      },
      {
        id: "critical-standard",
        name: "Critical Plus",
        tier: "Standard",
        monthlyPremium: 30,
        features: [
          "$25,000 lump-sum benefit",
          "25+ conditions covered",
          "Partial benefit for early-stage",
          "Recurrence benefit",
          "Wellness screening benefit",
        ],
        popular: true,
      },
      {
        id: "critical-premium",
        name: "Critical Premium",
        tier: "Premium",
        monthlyPremium: 50,
        features: [
          "$50,000 lump-sum benefit",
          "40+ conditions covered",
          "Child coverage included",
          "Multiple claims allowed",
          "Health screening benefit",
          "Survivorship benefit",
        ],
      },
    ],
  },
  hospital: {
    title: "Hospital Indemnity",
    icon: "🏨",
    description: "Daily cash benefits during hospital stays",
    plans: [
      {
        id: "hospital-basic",
        name: "Hospital Basic",
        tier: "Basic",
        monthlyPremium: 25,
        features: [
          "$100/day hospital benefit",
          "Up to 30 days per year",
          "ICU: $200/day",
          "Outpatient surgery: $250",
        ],
      },
      {
        id: "hospital-standard",
        name: "Hospital Plus",
        tier: "Standard",
        monthlyPremium: 40,
        features: [
          "$200/day hospital benefit",
          "Up to 60 days per year",
          "ICU: $400/day",
          "Outpatient surgery: $500",
          "Admission benefit: $750",
        ],
        popular: true,
      },
      {
        id: "hospital-premium",
        name: "Hospital Premium",
        tier: "Premium",
        monthlyPremium: 65,
        features: [
          "$500/day hospital benefit",
          "Unlimited days per year",
          "ICU: $1,000/day",
          "Outpatient surgery: $1,000",
          "Admission benefit: $1,500",
          "Rehab facility covered",
        ],
      },
    ],
  },
  pet: {
    title: "Pet Insurance",
    icon: "🐾",
    description: "Coverage for your furry family members",
    plans: [
      {
        id: "pet-basic",
        name: "Pet Basic",
        tier: "Basic",
        monthlyPremium: 20,
        features: [
          "Accidents only coverage",
          "$5,000 annual limit",
          "80% reimbursement",
          "$250 deductible",
        ],
      },
      {
        id: "pet-standard",
        name: "Pet Plus",
        tier: "Standard",
        monthlyPremium: 35,
        features: [
          "Accidents & illness",
          "$10,000 annual limit",
          "90% reimbursement",
          "$150 deductible",
          "Prescription coverage",
        ],
        popular: true,
      },
      {
        id: "pet-premium",
        name: "Pet Premium",
        tier: "Premium",
        monthlyPremium: 55,
        features: [
          "Comprehensive coverage",
          "Unlimited annual limit",
          "90% reimbursement",
          "$100 deductible",
          "Wellness visits included",
          "Dental cleaning covered",
        ],
      },
    ],
  },
};

const BenefitPlans = () => {
  const { benefitType } = useParams<{ benefitType: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const benefitData = benefitType ? benefitPlansData[benefitType] : null;

  if (!benefitData) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Benefit type not found</h1>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSelectPlan = (planId: string, planName: string, premium: number) => {
    setSelectedPlan(planId);
    toast({
      title: "Plan Selected",
      description: `${planName} ($${premium}/mo) has been added to your enrollment.`,
    });
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader activeTab="enrollment" onTabChange={() => {}} />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Navigation */}
          <Button 
            variant="ghost" 
            className="mb-6 gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Enrollment
          </Button>

          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-5xl mb-4 block">{benefitData.icon}</span>
            <h1 className="text-3xl font-bold text-foreground mb-2">{benefitData.title}</h1>
            <p className="text-muted-foreground">{benefitData.description}</p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefitData.plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative transition-all hover:shadow-lg ${
                  plan.popular ? "border-2 border-primary shadow-md" : "border"
                } ${selectedPlan === plan.id ? "ring-2 ring-accent" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" /> Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <Badge 
                    variant="outline" 
                    className={`w-fit mx-auto mb-2 ${
                      plan.tier === "Basic" ? "border-muted-foreground text-muted-foreground" :
                      plan.tier === "Standard" ? "border-primary text-primary" :
                      "border-accent text-accent"
                    }`}
                  >
                    {plan.tier}
                  </Badge>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-foreground">${plan.monthlyPremium}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full gap-2"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSelectPlan(plan.id, plan.name, plan.monthlyPremium)}
                  >
                    <Plus className="h-4 w-4" />
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Note */}
          <div className="text-center mt-10 text-sm text-muted-foreground">
            <p>All plans are subject to your ICHRA monthly allowance. Premiums shown are employee contributions.</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BenefitPlans;
