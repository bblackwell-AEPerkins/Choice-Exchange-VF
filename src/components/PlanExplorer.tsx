import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ArrowRight, Star, Building2, User, Users } from "lucide-react";
import { Link } from "react-router-dom";

type PlanType = "individual" | "ichra" | "group";

interface Plan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  priceLabel: string;
  popular?: boolean;
  features: string[];
  highlight: string;
}

const plans: Plan[] = [
  {
    id: "bronze",
    name: "Bronze Individual",
    type: "individual",
    price: 299,
    priceLabel: "/month",
    features: [
      "Basic preventive care",
      "Emergency coverage",
      "Prescription discounts",
      "Telehealth included",
      "HSA compatible",
    ],
    highlight: "Best for healthy individuals",
  },
  {
    id: "silver",
    name: "Silver Individual",
    type: "individual",
    price: 449,
    priceLabel: "/month",
    popular: true,
    features: [
      "Comprehensive coverage",
      "Lower deductibles",
      "Specialist access",
      "Mental health services",
      "Vision & dental basics",
    ],
    highlight: "Most popular choice",
  },
  {
    id: "gold",
    name: "Gold Individual",
    type: "individual",
    price: 649,
    priceLabel: "/month",
    features: [
      "Premium coverage",
      "Minimal out-of-pocket",
      "Nationwide network",
      "Full vision & dental",
      "Wellness programs",
    ],
    highlight: "Maximum protection",
  },
  {
    id: "ichra-flex",
    name: "ICHRA Flex",
    type: "ichra",
    price: 350,
    priceLabel: "/employee/month",
    features: [
      "Employee choice",
      "Tax-advantaged",
      "Flexible budgets",
      "No group size minimum",
      "Simple administration",
    ],
    highlight: "Employer-funded flexibility",
  },
  {
    id: "ichra-plus",
    name: "ICHRA Plus",
    type: "ichra",
    price: 500,
    priceLabel: "/employee/month",
    popular: true,
    features: [
      "Enhanced allowances",
      "Family coverage options",
      "Concierge support",
      "Claims assistance",
      "Compliance handled",
    ],
    highlight: "Best value for employers",
  },
  {
    id: "ichra-premium",
    name: "ICHRA Premium",
    type: "ichra",
    price: 750,
    priceLabel: "/employee/month",
    features: [
      "Maximum allowances",
      "Executive benefits",
      "Dedicated account manager",
      "Custom reporting",
      "Priority support",
    ],
    highlight: "Enterprise-grade benefits",
  },
  {
    id: "group-basic",
    name: "Group Basic",
    type: "group",
    price: 425,
    priceLabel: "/employee/month",
    features: [
      "Standard group coverage",
      "Single carrier",
      "Basic administration",
      "Compliance support",
      "Annual renewal",
    ],
    highlight: "Traditional group plan",
  },
  {
    id: "group-choice",
    name: "Group Choice",
    type: "group",
    price: 575,
    priceLabel: "/employee/month",
    popular: true,
    features: [
      "Multiple plan options",
      "Employee choice within group",
      "Enhanced admin tools",
      "Wellness integration",
      "Quarterly reviews",
    ],
    highlight: "Choice within structure",
  },
  {
    id: "group-enterprise",
    name: "Group Enterprise",
    type: "group",
    price: 800,
    priceLabel: "/employee/month",
    features: [
      "Custom plan design",
      "Self-funded options",
      "Advanced analytics",
      "Dedicated team",
      "Strategic planning",
    ],
    highlight: "Full customization",
  },
];

const tabs = [
  { value: "individual" as PlanType, label: "Individual", icon: User },
  { value: "ichra" as PlanType, label: "ICHRA", icon: Building2 },
  { value: "group" as PlanType, label: "Group", icon: Users },
];

export const PlanExplorer = () => {
  const [selectedType, setSelectedType] = useState<PlanType>("individual");

  const filteredPlans = plans.filter((plan) => plan.type === selectedType);

  return (
    <section id="plans" className="py-12 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <p className="text-primary font-semibold mb-2 md:mb-3 text-sm">Compare Plans</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold mb-4 md:mb-6 px-2">
            Find your perfect <span className="text-gradient-accent">healthcare match</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground px-4 md:px-0">
            Individual plans, employer ICHRA, or group benefits—we have options for everyone.
          </p>
        </div>

        {/* Plan Type Tabs - Scrollable on mobile */}
        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as PlanType)} className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8 md:mb-12 h-12 md:h-10">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="flex items-center justify-center gap-1.5 md:gap-2 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {/* Horizontal scroll on mobile, grid on desktop */}
              <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-thin">
                {filteredPlans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl flex-shrink-0 w-[280px] md:w-auto snap-center ${
                      plan.popular ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-border/50'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-3 md:top-4 right-3 md:right-4">
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-3 md:pb-4">
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">{plan.highlight}</p>
                      <CardTitle className="text-lg md:text-2xl">{plan.name}</CardTitle>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl md:text-4xl font-display font-bold">${plan.price}</span>
                        <span className="text-muted-foreground text-sm">{plan.priceLabel}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="w-4 md:w-5 h-4 md:h-5 text-accent shrink-0 mt-0.5" />
                            <span className="text-xs md:text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full ${plan.popular ? 'gradient-primary border-0' : ''}`}
                        variant={plan.popular ? "default" : "outline"}
                        asChild
                      >
                        <Link to="/auth">
                          Get Started
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Mobile scroll hint */}
              <p className="text-center text-xs text-muted-foreground mt-3 md:hidden">
                ← Swipe to see more plans →
              </p>
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom CTA */}
        <div className="text-center mt-8 md:mt-12">
          <p className="text-sm text-muted-foreground mb-3 md:mb-4">
            Not sure which plan is right for you?
          </p>
          <Button variant="link" className="text-primary" asChild>
            <Link to="/compare-ichra">
              Compare ICHRA Plans
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
