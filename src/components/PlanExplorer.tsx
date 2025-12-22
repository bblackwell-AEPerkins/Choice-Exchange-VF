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
    <section id="plans" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-primary font-semibold mb-3">Compare Plans</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Find your perfect <span className="text-gradient-accent">healthcare match</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're an individual, an employer offering ICHRA, or managing group benefits—
            we have transparent options for everyone.
          </p>
        </div>

        {/* Plan Type Tabs */}
        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as PlanType)} className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-12">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <div className="grid md:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      plan.popular ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-border/50'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <p className="text-sm text-muted-foreground mb-1">{plan.highlight}</p>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-4xl font-display font-bold">${plan.price}</span>
                        <span className="text-muted-foreground">{plan.priceLabel}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full ${plan.popular ? 'gradient-primary border-0' : ''}`}
                        variant={plan.popular ? "default" : "outline"}
                        asChild
                      >
                        <Link to="/member">
                          Get Started
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Not sure which plan is right for you?
          </p>
          <Button variant="link" className="text-primary" asChild>
            <Link to="/member">
              Take our quick assessment
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
