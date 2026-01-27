import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  Sparkles,
  DollarSign,
  Shield,
  Calendar,
  AlertCircle,
  CreditCard,
  Star,
  Phone,
  CheckCircle
} from "lucide-react";
import { subscriptionProviders, filterProviders, getSpecialtyStats, type SubscriptionProvider } from "@/lib/subscriptionProviders";

// Get actual counts from provider data
const getSpecialtyData = () => {
  return [
    { id: "primary", name: "Primary Care", icon: Stethoscope, ...getSpecialtyStats("primary") },
    { id: "mental", name: "Mental Health", icon: Brain, ...getSpecialtyStats("mental") },
    { id: "telehealth", name: "Telehealth", icon: Eye, ...getSpecialtyStats("telehealth") },
    { id: "pediatrics", name: "Pediatrics", icon: Baby, ...getSpecialtyStats("pediatrics") },
    { id: "womens", name: "Women's Health", icon: Heart, ...getSpecialtyStats("womens") },
    { id: "orthopedics", name: "Physical Therapy", icon: Bone, ...getSpecialtyStats("orthopedics") },
  ];
};

const ProviderMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SubscriptionProvider[]>([]);

  // Get specialty data with real counts
  const specialties = useMemo(() => getSpecialtyData(), []);

  const handleSearch = () => {
    if (!searchQuery.trim() && !locationQuery.trim()) return;
    
    const location = locationQuery.trim();
    const isZipCode = /^\d{5}$/.test(location);
    
    // Filter providers based on search
    const filtered = filterProviders({
      searchQuery: searchQuery.trim() || undefined,
      city: !isZipCode ? location : undefined,
      zipCode: isZipCode ? location : undefined,
    });
    
    setSearchResults(filtered.slice(0, 50)); // Show first 50 results
    setHasSearched(true);
    setSelectedSpecialty(null);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSpecialtyClick = (specialtyId: string) => {
    const location = locationQuery.trim();
    const isZipCode = /^\d{5}$/.test(location);
    
    const providers = filterProviders({
      specialtyId,
      city: !isZipCode ? location : undefined,
      zipCode: isZipCode ? location : undefined,
    });
    setSearchResults(providers.slice(0, 50));
    setSelectedSpecialty(specialtyId);
    setHasSearched(true);
    
    setTimeout(() => {
      document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const selectedSpecialtyData = specialties.find(s => s.id === selectedSpecialty);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Insurance Boundary Notice - Top Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/30">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <p className="text-center">
                <span className="font-medium text-amber-700">This is subscription-based care, not insurance.</span>
                <span className="text-muted-foreground ml-1 hidden sm:inline">
                  If your employer offers ICHRA, 
                </span>
                <Link to="/ichra/enroll" className="text-primary font-medium hover:underline ml-1">
                  enroll here instead →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Hero Section - Repositioned for Subscription Care */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
          
          {/* Gradient orbs */}
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-violet/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Badge - Clear Subscription Messaging */}
              <div className="flex items-center gap-2 mb-8 justify-center">
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 px-4 py-1.5">
                  <CreditCard className="h-3.5 w-3.5 mr-2" />
                  Subscription-Based Care
                </Badge>
              </div>

              {/* Main heading - Non-insurance language */}
              <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 tracking-tight">
                <span className="text-foreground">Access </span>
                <span className="text-gradient-primary">Direct Care</span>
              </h1>
              
              <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-6 leading-relaxed">
                Connect directly with providers. Flat-rate pricing. No insurance claims. 
                Subscription care that works alongside your health coverage.
              </p>

              {/* Clear non-insurance statement */}
              <div className="text-center mb-10">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Not insurance.</span> Complementary care services with transparent, upfront pricing.
                </p>
              </div>

              {/* Futuristic Search Bar */}
              <div className="relative max-w-3xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 rounded-2xl blur-lg opacity-50" />
                <div className="relative glass-card rounded-2xl p-2">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="Primary care, mental health, physical therapy..."
                        className="pl-12 h-14 border-0 bg-background/50 text-base rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                    <div className="flex-1 relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="City, State, or ZIP"
                        className="pl-12 h-14 border-0 bg-background/50 text-base rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                    <Button 
                      size="lg" 
                      className="h-14 px-8 rounded-xl bg-accent hover:bg-accent/90 transition-opacity"
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() && !locationQuery.trim()}
                    >
                      <Search className="h-5 w-5 md:mr-2" />
                      <span className="hidden md:inline">Find Care</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick differentiators */}
              <div className="flex items-center justify-center gap-6 md:gap-8 mt-10 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <span>Flat Monthly Pricing</span>
                </div>
                <div className="h-4 w-px bg-border hidden md:block" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span>Cancel Anytime</span>
                </div>
                <div className="h-4 w-px bg-border hidden md:block" />
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent" />
                  <span>No Insurance Required</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Results Section */}
        {hasSearched && (
          <section id="search-results" className="py-16 bg-accent/5 border-y border-accent/20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedSpecialtyData 
                        ? `${selectedSpecialtyData.name} Providers` 
                        : searchQuery 
                          ? `Results for "${searchQuery}"` 
                          : `Providers near "${locationQuery}"`}
                    </h2>
                    <p className="text-muted-foreground">
                      {searchResults.length} providers found
                      {locationQuery && ` near ${locationQuery}`}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setHasSearched(false);
                      setSearchQuery("");
                      setLocationQuery("");
                      setSelectedSpecialty(null);
                      setSearchResults([]);
                    }}
                  >
                    Clear Search
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((provider) => (
                    <Card 
                      key={provider.id}
                      className="group hover:border-accent/50 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                              {provider.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{provider.rating}</span>
                            <span className="text-muted-foreground">({provider.reviewCount})</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{provider.city}, {provider.state} {provider.zipCode}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{provider.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3.5 w-3.5 text-accent" />
                            <span className="text-accent font-medium">${provider.monthlyPrice}/mo</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          {provider.acceptingNew ? (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle className="h-3.5 w-3.5" />
                              Accepting New Patients
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Waitlist Only</span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Next: {provider.nextAvailable}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {searchResults.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No providers found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try a different search term or browse all available subscription plans below.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {searchResults.length >= 50 && (
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    Showing first 50 results. Refine your search for more specific results.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* How This Fits - Insurance vs Subscription Explainer */}
        <section className="py-16 bg-muted/30 border-y">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">How Subscription Care Fits Your Coverage</h2>
                <p className="text-muted-foreground">Many people use both. Here's how they work together.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Insurance/ICHRA Column */}
                <Card className="border-2 border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Health Insurance / ICHRA</h3>
                        <Badge variant="outline" className="text-xs">Major Medical</Badge>
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span>Hospital stays & surgeries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span>Emergency care</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span>Specialist referrals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span>Prescription coverage</span>
                      </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/ichra">
                          Learn About ICHRA
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscription Care Column */}
                <Card className="border-2 border-accent/30 bg-accent/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Subscription Care</h3>
                        <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">You Are Here</Badge>
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                        <span>Routine primary care visits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                        <span>Mental health & therapy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                        <span>Telehealth convenience</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                        <span>Transparent flat-rate pricing</span>
                      </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                      <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        Browse Subscriptions
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                💡 <span className="font-medium">Tip:</span> Subscription care is great for predictable, routine needs. 
                Keep your health insurance for unexpected medical events.
              </p>
            </div>
          </div>
        </section>

        {/* Specialties - Clear Subscription Pricing */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground">
                Browse Subscription Plans
              </h2>
            </div>
            <p className="text-muted-foreground mb-10 max-w-xl">
              Flat monthly rates. No surprise bills. Direct access to the care you need.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {specialties.map((specialty, index) => (
                <button
                  key={specialty.id}
                  onClick={() => handleSpecialtyClick(specialty.id)}
                  className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-accent/30 transition-all duration-300 text-left overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <specialty.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                      {specialty.name}
                    </div>
                    <div className="text-xs text-accent font-medium mb-1">
                      From ${specialty.minPrice}/mo
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {specialty.totalCount.toLocaleString()} providers
                    </div>
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      {specialty.dallasCount} in Dallas
                    </div>
                  </div>
                  
                  {/* Arrow indicator */}
                  <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-accent opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Subscription Focus */}
        <section className="py-24 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  How <span className="text-gradient-accent">Subscription Care</span> Works
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Simple, transparent access to healthcare. No claims, no surprise bills, no complexity.
                </p>
              </div>

              {/* Three Steps */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="group relative p-8 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                        <Search className="h-7 w-7 text-accent" />
                      </div>
                      <div className="text-6xl font-bold text-accent/15">01</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">Browse Plans</h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      Find subscription care plans for primary care, mental health, telehealth, and more. 
                      Each shows flat monthly pricing upfront—no surprises.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group relative p-8 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                        <CreditCard className="h-7 w-7 text-accent" />
                      </div>
                      <div className="text-6xl font-bold text-accent/15">02</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">Subscribe</h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      Pay a simple monthly fee. Cancel anytime. No insurance claims to file, 
                      no deductibles to meet, no prior authorizations needed.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group relative p-8 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                        <Heart className="h-7 w-7 text-accent" />
                      </div>
                      <div className="text-6xl font-bold text-accent/15">03</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">Get Care</h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      Access your provider directly. Book appointments, message your care team, 
                      and get the care you need—when you need it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Clear Separation */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Subscription CTA */}
                <Card className="border-2 border-accent/30 bg-accent/5">
                  <CardContent className="p-8 text-center">
                    <CreditCard className="h-10 w-10 text-accent mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Ready to Subscribe?</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Explore subscription care plans with flat monthly pricing.
                    </p>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      Browse Subscription Plans
                    </Button>
                  </CardContent>
                </Card>

                {/* ICHRA CTA */}
                <Card className="border border-border">
                  <CardContent className="p-8 text-center">
                    <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Have ICHRA?</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Enroll in your employer-sponsored health benefit separately.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/ichra/enroll">
                        Go to ICHRA Enrollment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderMap;
