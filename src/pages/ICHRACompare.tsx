import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Star, Building2, Shield, Users, DollarSign, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface ICHRAPlan {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  popular?: boolean;
  features: string[];
  highlight: string;
  idealFor: string;
}

const ichraPlans: ICHRAPlan[] = [
  {
    id: "ichra-starter",
    name: "ICHRA Starter",
    price: 250,
    priceLabel: "/employee/month",
    features: [
      "Basic employee choice",
      "Tax-advantaged reimbursement",
      "ACA-compliant",
      "Online enrollment",
      "Basic admin dashboard",
      "Email support",
    ],
    highlight: "Great for small teams",
    idealFor: "Companies with 1-25 employees",
  },
  {
    id: "ichra-flex",
    name: "ICHRA Flex",
    price: 350,
    priceLabel: "/employee/month",
    features: [
      "Full employee choice",
      "Tax-advantaged reimbursement",
      "Flexible budget classes",
      "No group size minimum",
      "Simple administration",
      "Phone & email support",
    ],
    highlight: "Employer-funded flexibility",
    idealFor: "Growing companies 25-100 employees",
  },
  {
    id: "ichra-plus",
    name: "ICHRA Plus",
    price: 500,
    priceLabel: "/employee/month",
    popular: true,
    features: [
      "Enhanced allowances",
      "Family coverage options",
      "Concierge support",
      "Claims assistance",
      "Compliance handled",
      "Dedicated account manager",
      "Custom reporting",
    ],
    highlight: "Best value for employers",
    idealFor: "Mid-size companies 50-500 employees",
  },
  {
    id: "ichra-premium",
    name: "ICHRA Premium",
    price: 750,
    priceLabel: "/employee/month",
    features: [
      "Maximum allowances",
      "Executive benefits tier",
      "Dedicated account manager",
      "Advanced analytics & reporting",
      "Priority support 24/7",
      "Custom integration APIs",
      "Strategic planning sessions",
      "Multi-location support",
    ],
    highlight: "Enterprise-grade benefits",
    idealFor: "Enterprise 500+ employees",
  },
];

const comparisonFeatures = [
  { feature: "Employee Plan Choice", starter: "Basic", flex: "Full", plus: "Full", premium: "Full" },
  { feature: "Tax Advantages", starter: "✓", flex: "✓", plus: "✓", premium: "✓" },
  { feature: "ACA Compliance", starter: "✓", flex: "✓", plus: "✓", premium: "✓" },
  { feature: "Budget Classes", starter: "1", flex: "3", plus: "5", premium: "Unlimited" },
  { feature: "Family Coverage", starter: "—", flex: "—", plus: "✓", premium: "✓" },
  { feature: "Claims Assistance", starter: "—", flex: "—", plus: "✓", premium: "✓" },
  { feature: "Dedicated Manager", starter: "—", flex: "—", plus: "✓", premium: "✓" },
  { feature: "Custom Reporting", starter: "—", flex: "Basic", plus: "Advanced", premium: "Enterprise" },
  { feature: "API Access", starter: "—", flex: "—", plus: "—", premium: "✓" },
  { feature: "Support Level", starter: "Email", flex: "Phone & Email", plus: "Priority", premium: "24/7 Dedicated" },
];

const benefits = [
  {
    icon: DollarSign,
    title: "Cost Control",
    description: "Set predictable monthly budgets per employee class with tax-advantaged reimbursements.",
  },
  {
    icon: Users,
    title: "Employee Choice",
    description: "Employees pick plans that fit their needs from the individual market.",
  },
  {
    icon: Shield,
    title: "Full Compliance",
    description: "We handle ACA compliance, reporting, and regulatory requirements.",
  },
  {
    icon: FileCheck,
    title: "Simple Administration",
    description: "Easy enrollment, automated reimbursements, and comprehensive dashboards.",
  },
];

const ICHRACompare = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Building2 className="w-3 h-3 mr-1" />
                ICHRA Plans
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Compare <span className="text-gradient-primary">ICHRA Plans</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Individual Coverage Health Reimbursement Arrangements give employers cost control 
                while providing employees the freedom to choose their own health insurance.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Overview */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plan Cards */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Choose Your ICHRA Plan
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                All plans include full ACA compliance, tax advantages, and our enrollment platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ichraPlans.map((plan) => (
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
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-display font-bold">${plan.price}</span>
                      <span className="text-muted-foreground text-sm">{plan.priceLabel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{plan.idealFor}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
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
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Detailed Comparison
              </h2>
              <p className="text-muted-foreground">
                See exactly what's included in each plan
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-card rounded-xl border border-border overflow-hidden">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                    <th className="text-center p-4 font-semibold text-foreground">Starter</th>
                    <th className="text-center p-4 font-semibold text-foreground">Flex</th>
                    <th className="text-center p-4 font-semibold text-foreground bg-primary/5">
                      <div className="flex items-center justify-center gap-1">
                        Plus
                        <Star className="w-3 h-3 text-primary fill-primary" />
                      </div>
                    </th>
                    <th className="text-center p-4 font-semibold text-foreground">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, index) => (
                    <tr key={row.feature} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                      <td className="p-4 text-foreground font-medium">{row.feature}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.starter}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.flex}</td>
                      <td className="p-4 text-center text-foreground bg-primary/5 font-medium">{row.plus}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to offer ICHRA to your team?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of employers who've simplified their benefits administration 
                while giving employees more choice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-primary border-0" asChild>
                  <Link to="/plans">
                    Browse ICHRA Plans
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/auth">
                    Start Free Trial
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/employer">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ICHRACompare;