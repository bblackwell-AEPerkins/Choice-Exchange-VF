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
    <section className="py-12 md:py-24 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <p className="text-primary font-medium mb-2 md:mb-3 tracking-wide uppercase text-xs md:text-sm">Coverage Options</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-3 md:mb-4">
            Choose Your Path
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto px-4 md:px-0">
            Two ways to build comprehensive coverage for you and your family
          </p>
        </div>

        {/* Panels Grid - Stacked on mobile */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          
          {/* ICHRA Panel - Primary Health Plan */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-card border-2 border-primary/30 rounded-2xl p-5 md:p-8 h-full flex flex-col transition-all duration-300 hover:shadow-xl">
              {/* Required Badge */}
              <div className="absolute -top-2 left-4 md:left-6">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
                  REQUIRED
                </span>
              </div>
              
              {/* Icon */}
              <div className="w-12 md:w-14 h-12 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-6 mt-2">
                <Shield className="w-6 md:w-7 h-6 md:h-7 text-primary" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl md:text-2xl font-display font-bold mb-2 text-primary">Individual Health Plan</h3>
              <p className="text-xs text-accent font-medium mb-2">Empowered by ICHRA</p>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                Your core medical coverage — doctor visits, hospitals, prescriptions, and more.
              </p>

              {/* Features */}
              <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 flex-1">
                {ichraFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 md:gap-3">
                    <div className="w-4 md:w-5 h-4 md:h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 md:w-3 h-2.5 md:h-3 text-accent" />
                    </div>
                    <span className="text-sm md:text-base text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button size="lg" className="w-full gradient-primary border-0 group/btn py-5 md:py-6" asChild>
                <Link to="/auth">
                  Select Health Plan
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Supplemental Panel - Mobile Optimized */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-card border border-border rounded-2xl p-5 md:p-8 h-full flex flex-col transition-all duration-300 hover:border-accent/30 hover:shadow-xl">
              {/* Optional Badge */}
              <div className="absolute -top-2 left-4 md:left-6">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/30">
                  OPTIONAL ADD-ONS
                </span>
              </div>
              
              {/* Icon & Title */}
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 mt-2">
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Plus className="w-5 md:w-6 h-5 md:h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-display font-bold">Supplemental Benefits</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">Enhance your coverage</p>
                </div>
              </div>

              {/* Simple List for Mobile */}
              <div className="flex-1 mb-6 md:mb-8">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">POPULAR ADD-ONS</p>
                <div className="grid grid-cols-2 gap-2">
                  {supplementalBenefits.slice(0, 4).map((benefit) => (
                    <div 
                      key={benefit.type}
                      className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 rounded-lg border border-border/30 hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer"
                    >
                      <span className="text-sm font-medium text-foreground">{benefit.type}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  + Life Insurance, Hospital Indemnity, and more
                </p>
              </div>

              {/* CTA */}
              <Button size="lg" variant="outline" className="w-full group/btn py-5 md:py-6" asChild>
                <Link to="/auth">
                  Browse Add-ons
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Compare Link */}
        <div className="text-center mt-6 md:mt-10">
          <button
            onClick={() => setCompareExpanded(!compareExpanded)}
            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <span className="underline underline-offset-4">Compare coverage paths</span>
          </button>
          
          {/* Comparison Info */}
          <div className={`overflow-hidden transition-all duration-500 ${
            compareExpanded ? "max-h-60 opacity-100 mt-6 md:mt-8" : "max-h-0 opacity-0"
          }`}>
            <div className="max-w-2xl mx-auto grid gap-3 md:grid-cols-2 md:gap-4 text-sm px-4 md:px-0">
              <div className="bg-card border-2 border-primary/20 rounded-lg p-4 text-left">
                <p className="font-semibold text-primary mb-1">🏥 Individual Health Plan</p>
                <p className="text-xs text-accent mb-1">Empowered by ICHRA</p>
                <p className="text-muted-foreground text-sm">Required. Covers major medical: doctor visits, hospitals, prescriptions, preventive care.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-left">
                <p className="font-semibold text-foreground mb-1">➕ Supplemental Benefits</p>
                <p className="text-muted-foreground text-sm">Optional add-ons like dental, vision, and life insurance to enhance your coverage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
