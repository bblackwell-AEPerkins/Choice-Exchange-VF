import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Heart,
  Stethoscope,
  Brain,
  Eye,
  Baby,
  Bone,
  Shield,
  DollarSign,
  CheckCircle2,
  Users,
  Building2,
  Globe
} from "lucide-react";

const specialties = [
  { id: "primary", name: "Primary Care", icon: Stethoscope, count: 12450 },
  { id: "cardiology", name: "Cardiology", icon: Heart, count: 8320 },
  { id: "neurology", name: "Neurology", icon: Brain, count: 6780 },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, count: 5890 },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, count: 9450 },
  { id: "orthopedics", name: "Orthopedics", icon: Bone, count: 7110 },
];

const features = [
  {
    icon: Shield,
    title: "Verified Providers",
    description: "Every provider in our network is credentialed and verified to ensure you receive quality care."
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "See estimated costs upfront so you can make informed decisions about your healthcare."
  },
  {
    icon: CheckCircle2,
    title: "Insurance Compatibility",
    description: "Filter providers by your specific insurance type—ICHRA, Group, or Individual plans."
  },
  {
    icon: Users,
    title: "Real Patient Reviews",
    description: "Read authentic reviews from real patients to find the right provider for your needs."
  }
];

const stats = [
  { value: "50,000+", label: "Healthcare Providers", icon: Users },
  { value: "250+", label: "Partner Hospitals", icon: Building2 },
  { value: "48", label: "States Covered", icon: Globe },
  { value: "98%", label: "Patient Satisfaction", icon: CheckCircle2 },
];

const ProviderMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = () => {
    // This would navigate to search results in a full implementation
    console.log("Searching for:", searchQuery, "in", locationQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Nationwide Network
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Find Your Perfect Provider
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Search our extensive network of 50,000+ healthcare providers across 48 states. 
                Find specialists, compare options, and book appointments—all in one place.
              </p>
              <p className="text-muted-foreground">
                Whether you need a routine checkup or specialized care, our network has you covered 
                with transparent pricing and verified provider credentials.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 p-6 bg-card rounded-2xl shadow-lg border border-border">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, specialty, or condition..."
                    className="pl-10 h-14 border-0 bg-muted/50 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="City, State, or ZIP code"
                    className="pl-10 h-14 border-0 bg-muted/50 text-lg"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="h-14 px-10 text-lg" onClick={handleSearch}>
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties Grid */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-4">Browse by Specialty</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Click on a specialty to explore providers in that field. Each category shows 
                the total number of verified providers available in our network.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {specialties.map((specialty) => (
                <button
                  key={specialty.id}
                  className="p-6 rounded-xl border bg-card border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200 text-center group"
                >
                  <specialty.icon className="h-10 w-10 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <div className="font-semibold text-foreground mb-1">{specialty.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {specialty.count.toLocaleString()} providers
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">How Our Provider Search Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Finding the right healthcare provider has never been easier. Our comprehensive 
                search tool puts you in control of your healthcare decisions.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Find Your Provider?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start your search above, or explore providers by specialty. Our network includes 
                primary care physicians, specialists, and everything in between—all accepting 
                your ICHRA, Group, or Individual health plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <Search className="h-4 w-4 mr-2" />
                  Start Searching
                </Button>
                <Button size="lg" variant="outline">
                  View All Specialties
                </Button>
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
