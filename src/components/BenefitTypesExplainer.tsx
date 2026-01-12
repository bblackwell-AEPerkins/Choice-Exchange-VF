import { Shield, Plus, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const BenefitTypesExplainer = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-primary font-semibold text-sm mb-2 tracking-wide uppercase">
            UNDERSTAND YOUR OPTIONS
          </p>
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-3">
            Two Types of Benefits
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
            Know the difference to build the right coverage for you and your family
          </p>
        </div>

        {/* Cards - Stacked on Mobile */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          
          {/* Primary Health Coverage Card */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-card p-6 md:p-8">
            {/* Required Badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <AlertCircle className="h-3 w-3" />
                Required
              </span>
            </div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-7 w-7 text-primary" />
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-display font-bold mb-2 text-primary">
              Primary Health Plan
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your core medical coverage that handles doctor visits, hospital stays, prescriptions, and major medical expenses.
            </p>

            {/* What's Included */}
            <div className="space-y-2 mb-6">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">What's Covered:</p>
              <ul className="space-y-2">
                {[
                  "Doctor visits & specialists",
                  "Hospital & emergency care",
                  "Prescription medications",
                  "Preventive care",
                  "Lab work & imaging",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Options */}
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium text-foreground mb-2">Choose one:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-md text-xs bg-primary/10 text-primary font-medium">ICHRA</span>
                <span className="px-2 py-1 rounded-md text-xs bg-primary/10 text-primary font-medium">Individual Plan</span>
                <span className="px-2 py-1 rounded-md text-xs bg-primary/10 text-primary font-medium">Group Plan</span>
              </div>
            </div>

            <Button className="w-full gradient-primary border-0" asChild>
              <Link to="/auth">
                Select Health Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Supplemental Benefits Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">
            {/* Optional Badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                <Plus className="h-3 w-3" />
                Optional Add-ons
              </span>
            </div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Plus className="h-7 w-7 text-accent" />
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-display font-bold mb-2">
              Supplemental Benefits
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Voluntary add-ons that enhance your coverage. These are optional extras that fill gaps in your primary health plan.
            </p>

            {/* What's Available */}
            <div className="space-y-2 mb-6">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Add to Your Plan:</p>
              <ul className="space-y-2">
                {[
                  "🦷 Dental (cleanings, fillings, etc.)",
                  "👁️ Vision (exams, glasses, contacts)",
                  "🛡️ Life Insurance",
                  "💼 Disability Coverage",
                  "🏥 Hospital Indemnity",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-muted-foreground">
                💡 <strong className="text-foreground">Tip:</strong> Most people add Dental & Vision. Other benefits depend on your personal situation.
              </p>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link to="/auth">
                Browse Add-ons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Not sure what you need? Our enrollment wizard will guide you through selecting the right combination of benefits.
          </p>
        </div>
      </div>
    </section>
  );
};
