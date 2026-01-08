import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Heart,
  Stethoscope,
  Brain,
  Eye,
  Baby,
  Bone,
  ArrowRight,
  Sparkles
} from "lucide-react";

const specialties = [
  { id: "primary", name: "Primary Care", icon: Stethoscope, count: "12.4k" },
  { id: "cardiology", name: "Cardiology", icon: Heart, count: "8.3k" },
  { id: "neurology", name: "Neurology", icon: Brain, count: "6.7k" },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, count: "5.8k" },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, count: "9.4k" },
  { id: "orthopedics", name: "Orthopedics", icon: Bone, count: "7.1k" },
];

const ProviderMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "in", locationQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section - Futuristic & Clean */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
          
          {/* Gradient orbs */}
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Minimal badge */}
              <div className="flex items-center gap-2 mb-8 justify-center">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary/70">
                  50,000+ Verified Providers
                </span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
              </div>

              {/* Main heading */}
              <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 tracking-tight">
                <span className="text-foreground">Find </span>
                <span className="text-gradient-primary">Your Care</span>
              </h1>
              
              <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed">
                Search our nationwide network of healthcare providers. 
                Transparent pricing. Verified credentials. Your health, simplified.
              </p>

              {/* Futuristic Search Bar */}
              <div className="relative max-w-3xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-lg opacity-50" />
                <div className="relative glass-card rounded-2xl p-2">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="Specialty, condition, or provider name..."
                        className="pl-12 h-14 border-0 bg-background/50 text-base rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="City, State, or ZIP"
                        className="pl-12 h-14 border-0 bg-background/50 text-base rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                      />
                    </div>
                    <Button 
                      size="lg" 
                      className="h-14 px-8 rounded-xl gradient-primary hover:opacity-90 transition-opacity"
                      onClick={handleSearch}
                    >
                      <Search className="h-5 w-5 md:mr-2" />
                      <span className="hidden md:inline">Search</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex items-center justify-center gap-8 mt-10 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span>48 States</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>250+ Hospitals</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet animate-pulse" />
                  <span>98% Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties - Clean Grid */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-12">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground">
                Browse Specialties
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {specialties.map((specialty, index) => (
                <button
                  key={specialty.id}
                  className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 text-left overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <specialty.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {specialty.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {specialty.count} providers
                    </div>
                  </div>
                  
                  {/* Arrow indicator */}
                  <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-primary opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* How to Use - Minimal */}
        <section className="py-24 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="relative">
                  <div className="text-7xl font-bold text-primary/10 absolute -top-4 -left-2">1</div>
                  <div className="relative pt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Search</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Enter a specialty, condition, or provider name along with your location to find matching providers.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="text-7xl font-bold text-primary/10 absolute -top-4 -left-2">2</div>
                  <div className="relative pt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Compare</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Review verified credentials, patient ratings, and transparent pricing to make informed decisions.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="text-7xl font-bold text-primary/10 absolute -top-4 -left-2">3</div>
                  <div className="relative pt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Connect</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Book appointments directly or save providers to your care team for easy access later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Clean */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Your health journey starts here
              </h2>
              <p className="text-muted-foreground mb-8">
                All plan types accepted—ICHRA, Group, or Individual coverage.
              </p>
              <Button 
                size="lg" 
                className="rounded-xl px-8"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Start Your Search
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderMap;
