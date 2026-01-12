import { Shield, Eye, Users, TrendingDown, Building2, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Eye,
    title: "Complete Transparency",
    description: "See real costs upfront. No hidden fees, no surprise bills. Every price is clear before you commit.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "True Choice",
    description: "Access ICHRA, group plans, and individual options in one place. Choose based on your needs, not limitations.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: TrendingDown,
    title: "Cost Control",
    description: "Employers set budgets while employees get flexibility. Everyone wins with predictable healthcare spending.",
    color: "bg-violet/10 text-violet",
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description: "Recommendations based on your preferences, providers, and location. Healthcare that actually fits your life.",
    color: "bg-coral/10 text-coral",
  },
  {
    icon: Building2,
    title: "Employer Benefits",
    description: "Simplify ICHRA administration, reduce costs, and give employees the healthcare flexibility they deserve.",
    color: "bg-amber/10 text-amber",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Every provider in our network is vetted. Every plan meets our quality standards. Peace of mind included.",
    color: "bg-emerald/10 text-emerald",
  },
];

export const ValueProposition = () => {
  return (
    <section className="py-12 md:py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <p className="text-primary font-semibold mb-2 md:mb-3 text-sm">Why Choice Exchange</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold mb-4 md:mb-6 px-2">
            Healthcare reimagined around <span className="text-gradient-primary">you</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground px-4 md:px-0">
            We believe everyone deserves access to affordable, transparent healthcare.
          </p>
        </div>

        {/* Values Grid - 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {values.map((value, index) => (
            <Card 
              key={value.title} 
              className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4 md:p-6">
                <div className={`w-10 md:w-12 h-10 md:h-12 rounded-xl ${value.color} flex items-center justify-center mb-3 md:mb-4`}>
                  <value.icon className="w-5 md:w-6 h-5 md:h-6" />
                </div>
                <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-3">{value.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-none">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
