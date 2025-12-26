import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Check, Smile, Eye, AlertTriangle, Building2, Heart, ArrowRight, Wallet, Users } from "lucide-react";

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

const supplementalTiles = [
  { icon: Smile, label: "Dental", color: "from-emerald-500/20 to-emerald-600/10" },
  { icon: Eye, label: "Vision", color: "from-blue-500/20 to-blue-600/10" },
  { icon: AlertTriangle, label: "Accident", color: "from-amber-500/20 to-amber-600/10" },
  { icon: Building2, label: "Hospital Indemnity", color: "from-purple-500/20 to-purple-600/10" },
  { icon: Heart, label: "Life", color: "from-rose-500/20 to-rose-600/10" },
];

const ichraFeatures = [
  "Medical coverage",
  "Tax-advantaged",
  "Employer-funded",
];

export const HeroSplitPaths = () => {
  const [hoveredPanel, setHoveredPanel] = useState<"left" | "right" | null>(null);
  const [compareExpanded, setCompareExpanded] = useState(false);
  const [visibleTiles, setVisibleTiles] = useState<number[]>([]);
  const [ichraVisible, setIchraVisible] = useState(false);

  // ICHRA panel fade-in
  useEffect(() => {
    const timer = setTimeout(() => {
      setIchraVisible(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Supplemental tiles stagger animation
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    supplementalTiles.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleTiles(prev => [...prev, index]);
      }, 150 + (index * 120));
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative">
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

      {/* Original Hero Content */}
      <div className="container mx-auto px-4 relative z-10 pt-16 pb-12">
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
            Taking Back Control
            <br />
            <span className="text-gradient-primary">Of Your Healthcare</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            You deserve healthcare that works for you—not the other way around. 
            Build your own plan, compare providers transparently, and make empowered choices for you and your family.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <Button size="lg" className="gradient-primary border-0 text-lg px-8 py-6 glow-primary" asChild>
              <Link to="/dashboard">
                Build Your Plan
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
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

      {/* Split Panels Section */}
      <div className="container mx-auto px-4 pb-16 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Choose Your <span className="text-gradient-primary">Coverage Path</span>
          </h2>
          <p className="text-muted-foreground mb-4">
            Start with ICHRA or build supplemental benefits
          </p>
          <button
            onClick={() => setCompareExpanded(!compareExpanded)}
            className="text-primary hover:text-primary/80 text-sm font-medium underline underline-offset-4 transition-colors"
          >
            Compare Coverage Paths
          </button>
        </div>

        {/* Split Panels */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Panel - ICHRA */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              compareExpanded ? 'lg:min-h-[420px]' : 'lg:min-h-[360px]'
            } ${
              hoveredPanel === "right" ? "opacity-85" : "opacity-100"
            }`}
            onMouseEnter={() => setHoveredPanel("left")}
            onMouseLeave={() => setHoveredPanel(null)}
          >
            <div 
              className={`flex-1 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                ichraVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                Enroll in ICHRA
              </h2>
              
              {/* Supporting copy - only shown when compare is expanded */}
              <div className={`overflow-hidden transition-all duration-300 ${
                compareExpanded ? "max-h-20 opacity-100 mb-4" : "max-h-0 opacity-0"
              }`}>
                <p className="text-muted-foreground text-sm">
                  Employer-funded medical coverage via reimbursement
                </p>
              </div>

              {/* Plan Card */}
              <div className="flex-1 flex items-center justify-center py-6">
                <div className="w-full max-w-sm bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">ICHRA Plan</p>
                      <p className="text-sm text-muted-foreground">Core Medical Coverage</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {ichraFeatures.map((feature, index) => (
                      <div 
                        key={feature}
                        className={`flex items-center gap-3 transition-all duration-300 ${
                          ichraVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                        }`}
                        style={{ transitionDelay: `${150 + index * 50}ms` }}
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button size="lg" className="gradient-primary border-0 w-full mt-auto" asChild>
                <Link to="/dashboard">
                  Enroll in ICHRA
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Panel - Supplemental */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              compareExpanded ? 'lg:min-h-[420px]' : 'lg:min-h-[360px]'
            } ${
              hoveredPanel === "left" ? "opacity-85" : "opacity-100"
            }`}
            onMouseEnter={() => setHoveredPanel("right")}
            onMouseLeave={() => setHoveredPanel(null)}
          >
            <div className="flex-1 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                Build Supplemental Benefits
              </h2>
              
              {/* Supporting copy - only shown when compare is expanded */}
              <div className={`overflow-hidden transition-all duration-300 ${
                compareExpanded ? "max-h-20 opacity-100 mb-4" : "max-h-0 opacity-0"
              }`}>
                <p className="text-muted-foreground text-sm">
                  Layer additional coverage around your core plan
                </p>
              </div>

              {/* Stacking Tiles */}
              <div className="flex-1 flex items-end justify-center py-6">
                <div className="w-full max-w-sm flex flex-col-reverse gap-2">
                  {supplementalTiles.map((tile, index) => (
                    <div
                      key={tile.label}
                      className={`bg-gradient-to-r ${tile.color} border border-border/30 rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-300 ease-out ${
                        visibleTiles.includes(index) 
                          ? "opacity-100 translate-x-0" 
                          : "opacity-0 translate-x-full"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center flex-shrink-0">
                        <tile.icon className="w-4 h-4 text-foreground" />
                      </div>
                      <span className="font-medium text-foreground">{tile.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Button size="lg" variant="outline" className="w-full mt-auto" asChild>
                <Link to="/dashboard">
                  Add Supplemental Benefits
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
