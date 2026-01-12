import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Eye, ArrowRight, Wallet, Users } from "lucide-react";

const stats = [
  { value: "50+", label: "States Covered" },
  { value: "2M+", label: "Plans Compared" },
  { value: "98%", label: "User Satisfaction" },
  { value: "$3,200", label: "Avg. Savings" },
];

const pillars = [
  { icon: Eye, label: "Transparent" },
  { icon: Users, label: "Personalized" },
  { icon: Shield, label: "Quality" },
  { icon: Wallet, label: "Affordable" },
];

export const HeroSplitPaths = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center pt-16 md:pt-0">
      {/* Background Grid - lighter on mobile */}
      <div className="absolute inset-0 opacity-20 md:opacity-30">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--grid-line) / 0.15) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--grid-line) / 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      {/* Gradient Orbs - smaller on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-accent/10 rounded-full blur-[60px] md:blur-[100px] animate-float" style={{ animationDelay: "3s" }} />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10 py-8 md:py-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Pillars - Horizontal scroll on mobile */}
          <div className="flex justify-center gap-2 md:gap-3 mb-6 md:mb-8 animate-fade-in overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-thin">
            {pillars.map((pillar, i) => (
              <div 
                key={pillar.label}
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border/50 shadow-sm flex-shrink-0"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <pillar.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                <span className="text-xs md:text-sm font-medium text-foreground whitespace-nowrap">{pillar.label}</span>
              </div>
            ))}
          </div>

          {/* Headline - Smaller on mobile */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-4 md:mb-6 animate-fade-in-up px-2">
            Taking Back Control
            <br />
            <span className="text-gradient-primary">Of Your Healthcare</span>
          </h1>

          {/* Subheadline - Concise on mobile */}
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto mb-6 md:mb-8 animate-fade-in-up px-4" style={{ animationDelay: "100ms" }}>
            Build your plan, compare providers, and make empowered choices for you and your family.
          </p>

          {/* CTAs - Full width on mobile */}
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center mb-8 md:mb-12 animate-fade-in-up px-4 md:px-0" style={{ animationDelay: "200ms" }}>
            <Button size="lg" className="gradient-primary border-0 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 glow-primary w-full md:w-auto" asChild>
              <Link to="/auth">
                Start Enrollment
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 w-full md:w-auto" asChild>
              <Link to="/compare-ichra">
                Compare Plans
              </Link>
            </Button>
          </div>

          {/* Stats - 2x2 grid on mobile */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8 animate-fade-in-up px-4 md:px-0" style={{ animationDelay: "300ms" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-3 md:p-0 rounded-xl md:rounded-none bg-card/50 md:bg-transparent border border-border/30 md:border-0">
                <p className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gradient-primary mb-0.5 md:mb-1">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 md:h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};
