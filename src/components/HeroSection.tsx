import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Eye, Wallet, Users } from "lucide-react";

const stats = [
  { value: "50+", label: "States Covered" },
  { value: "2M+", label: "Plans Compared" },
  { value: "98%", label: "User Satisfaction" },
  { value: "$3,200", label: "Avg. Savings" },
];

const pillars = [
  { icon: Eye, label: "Transparent Pricing" },
  { icon: Users, label: "Personalized Choice" },
  { icon: Shield, label: "Quality Coverage" },
  { icon: Wallet, label: "Cost Control" },
];

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--grid-line) / 0.15) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--grid-line) / 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} 
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Pillars */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
            {pillars.map((pillar, i) => (
              <div 
                key={pillar.label}
                className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border/50 shadow-sm"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <pillar.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{pillar.label}</span>
              </div>
            ))}
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-6 animate-fade-in-up">
            Healthcare That Works
            <br />
            <span className="text-gradient-primary">For You</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Choice Exchange brings together ICHRA, group plans, and personalized healthcare into one transparent marketplace. 
            Compare providers, understand pricing, and choose what's right for you.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <Button size="lg" className="gradient-primary border-0 text-lg px-8 py-6 glow-primary" asChild>
              <Link to="/member">
                Find Your Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/employer">
                Employer Solutions
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-gradient-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};
