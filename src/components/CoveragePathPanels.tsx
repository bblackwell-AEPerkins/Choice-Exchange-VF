import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Check, Plus, ArrowRight } from "lucide-react";

const ichraFeatures = [
  "Medical coverage",
  "Tax-advantaged",
  "Employer-funded",
];

const supplementalBenefits = [
  { type: "Dental", provider: "Delta Dental PPO", network: "142,000+ dentists" },
  { type: "Vision", provider: "VSP Vision Care", network: "40,000+ providers" },
  { type: "Accident", provider: "Aflac", network: "Direct pay" },
  { type: "Hospital Indemnity", provider: "MetLife", network: "All hospitals" },
  { type: "Life", provider: "Principal Financial", network: "Guaranteed issue" },
];

export const CoveragePathPanels = () => {
  const [compareExpanded, setCompareExpanded] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-3 tracking-wide uppercase text-sm">Coverage Options</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Choose Your Path
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Two ways to build comprehensive coverage for you and your family
          </p>
        </div>

        {/* Panels Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {/* ICHRA Panel */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-card border border-border rounded-2xl p-8 h-full flex flex-col transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-primary" />
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-display font-bold mb-2">ICHRA Enrollment</h3>
              <p className="text-muted-foreground mb-6">
                Employer-funded medical coverage through tax-advantaged reimbursement
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8 flex-1">
                {ichraFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button size="lg" className="w-full gradient-primary border-0 group/btn" asChild>
                <Link to="/dashboard">
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Supplemental Panel */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-card border border-border rounded-2xl p-8 h-full flex flex-col transition-all duration-300 hover:border-accent/30 hover:shadow-xl">
              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold">Supplemental Benefits</h3>
                  <p className="text-muted-foreground text-sm">Build your coverage stack</p>
                </div>
              </div>

              {/* Choices → Stack Visual */}
              <div className="flex items-center gap-4 mb-8 flex-1">
                {/* Available Choices */}
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Available</p>
                  {supplementalBenefits.map((benefit, index) => (
                    <div 
                      key={benefit.type}
                      className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg border border-border/30 hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer h-14"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-sm font-semibold text-foreground min-w-[70px]">{benefit.type}</span>
                      <div className="w-px h-8 bg-border/60" />
                      <div className="flex flex-col justify-center">
                        <p className="text-xs font-medium text-foreground leading-tight">{benefit.provider}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">{benefit.network}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* My Plan Stack */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">My Plan</p>
                  <div className="relative min-h-[180px] bg-muted/30 rounded-xl border-2 border-dashed border-border/50 p-3">
                    {/* Stacked preview items */}
                    <div className="space-y-1">
                      <div className="px-3 py-2 bg-accent/10 rounded-lg text-sm font-medium text-accent border border-accent/20 shadow-sm">
                        Dental
                      </div>
                      <div className="px-3 py-2 bg-accent/10 rounded-lg text-sm font-medium text-accent border border-accent/20 shadow-sm">
                        Vision
                      </div>
                    </div>
                    <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-muted-foreground">
                      Drop benefits here
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button size="lg" variant="outline" className="w-full group/btn" asChild>
                <Link to="/dashboard">
                  Build Your Stack
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Compare Link */}
        <div className="text-center mt-10">
          <button
            onClick={() => setCompareExpanded(!compareExpanded)}
            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <span className="underline underline-offset-4">Compare coverage paths</span>
          </button>
          
          {/* Comparison Info */}
          <div className={`overflow-hidden transition-all duration-500 ${
            compareExpanded ? "max-h-40 opacity-100 mt-8" : "max-h-0 opacity-0"
          }`}>
            <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-card border border-border rounded-lg p-4 text-left">
                <p className="font-semibold text-foreground mb-1">ICHRA</p>
                <p className="text-muted-foreground">Your employer contributes tax-free dollars for you to purchase individual health insurance.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-left">
                <p className="font-semibold text-foreground mb-1">Supplemental</p>
                <p className="text-muted-foreground">Add voluntary benefits like dental, vision, and life insurance to round out your coverage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
