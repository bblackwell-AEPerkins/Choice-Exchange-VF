import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Check, Smile, Eye, AlertTriangle, Building2, Heart } from "lucide-react";

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
    <section className="relative min-h-[85vh] flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--grid-line) / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--grid-line) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }} 
        />
      </div>

      {/* Headline */}
      <div className="container mx-auto px-4 pt-16 pb-8 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
          Choose Your <span className="text-gradient-primary">Coverage Path</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-6">
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
      <div className="flex-1 container mx-auto px-4 pb-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          
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
