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
  "Dental",
  "Vision", 
  "Accident",
  "Hospital Indemnity",
  "Life",
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
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Plus className="w-7 h-7 text-accent" />
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-display font-bold mb-2">Supplemental Benefits</h3>
              <p className="text-muted-foreground mb-6">
                Layer additional coverage to create your complete protection package
              </p>

              {/* Benefits Tags */}
              <div className="flex flex-wrap gap-2 mb-8 flex-1">
                {supplementalBenefits.map((benefit) => (
                  <span 
                    key={benefit}
                    className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium text-foreground border border-border/50"
                  >
                    {benefit}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Button size="lg" variant="outline" className="w-full group/btn" asChild>
                <Link to="/dashboard">
                  Add Benefits
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
