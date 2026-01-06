import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  Filter,
  Heart,
  Stethoscope,
  Brain,
  Eye,
  Baby,
  Bone
} from "lucide-react";

const specialties = [
  { id: "primary", name: "Primary Care", icon: Stethoscope, count: 2847 },
  { id: "cardiology", name: "Cardiology", icon: Heart, count: 892 },
  { id: "neurology", name: "Neurology", icon: Brain, count: 456 },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, count: 623 },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, count: 1234 },
  { id: "orthopedics", name: "Orthopedics", icon: Bone, count: 789 },
];

const allProviders = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "Primary Care",
    specialtyId: "primary",
    clinic: "Choice Health Partners",
    address: "123 Medical Center Dr, Austin, TX 78701",
    city: "Austin",
    state: "TX",
    zip: "78701",
    rating: 4.9,
    reviews: 342,
    distance: "0.8 mi",
    acceptingNew: true,
    nextAvailable: "Tomorrow",
    price: "$$",
    insurances: ["ICHRA", "Group", "Individual"],
    keywords: ["family medicine", "wellness", "checkup", "annual physical", "preventive care"],
  },
  {
    id: 2,
    name: "Dr. Michael Roberts",
    specialty: "Cardiology",
    specialtyId: "cardiology",
    clinic: "Heart & Vascular Institute",
    address: "456 Cardiac Way, Austin, TX 78702",
    city: "Austin",
    state: "TX",
    zip: "78702",
    rating: 4.8,
    reviews: 218,
    distance: "1.2 mi",
    acceptingNew: true,
    nextAvailable: "This Week",
    price: "$$$",
    insurances: ["ICHRA", "Group"],
    keywords: ["heart", "cardiovascular", "blood pressure", "cholesterol", "cardiac"],
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    specialty: "Pediatrics",
    specialtyId: "pediatrics",
    clinic: "Children's Wellness Center",
    address: "789 Kids Blvd, Austin, TX 78703",
    city: "Austin",
    state: "TX",
    zip: "78703",
    rating: 5.0,
    reviews: 567,
    distance: "2.1 mi",
    acceptingNew: false,
    nextAvailable: "2 Weeks",
    price: "$$",
    insurances: ["Individual", "Group"],
    keywords: ["children", "kids", "baby", "infant", "toddler", "child", "pediatric", "vaccines", "immunizations"],
  },
  {
    id: 4,
    name: "Dr. James Park",
    specialty: "Orthopedics",
    specialtyId: "orthopedics",
    clinic: "Sports Medicine & Ortho",
    address: "321 Athletic Dr, Austin, TX 78704",
    city: "Austin",
    state: "TX",
    zip: "78704",
    rating: 4.7,
    reviews: 189,
    distance: "3.4 mi",
    acceptingNew: true,
    nextAvailable: "Tomorrow",
    price: "$$",
    insurances: ["ICHRA", "Individual", "Group"],
    keywords: ["bones", "joints", "sports injury", "knee", "hip", "shoulder", "back pain", "spine"],
  },
  {
    id: 5,
    name: "Dr. Lisa Martinez",
    specialty: "Pediatrics",
    specialtyId: "pediatrics",
    clinic: "Austin Kids Health",
    address: "555 Family Way, Austin, TX 78745",
    city: "Austin",
    state: "TX",
    zip: "78745",
    rating: 4.9,
    reviews: 423,
    distance: "4.2 mi",
    acceptingNew: true,
    nextAvailable: "Today",
    price: "$$",
    insurances: ["ICHRA", "Individual", "Group"],
    keywords: ["children", "kids", "baby", "newborn", "adolescent", "teen", "pediatric", "well-child visits"],
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialty: "Primary Care",
    specialtyId: "primary",
    clinic: "Downtown Family Medicine",
    address: "100 Congress Ave, Austin, TX 78701",
    city: "Austin",
    state: "TX",
    zip: "78701",
    rating: 4.6,
    reviews: 298,
    distance: "0.5 mi",
    acceptingNew: true,
    nextAvailable: "Tomorrow",
    price: "$",
    insurances: ["ICHRA", "Individual", "Group"],
    keywords: ["family", "general practice", "wellness", "preventive", "checkup"],
  },
  {
    id: 7,
    name: "Dr. Amanda Foster",
    specialty: "Ophthalmology",
    specialtyId: "ophthalmology",
    clinic: "Clear Vision Eye Care",
    address: "200 Vision Pkwy, Austin, TX 78746",
    city: "Austin",
    state: "TX",
    zip: "78746",
    rating: 4.8,
    reviews: 156,
    distance: "5.1 mi",
    acceptingNew: true,
    nextAvailable: "This Week",
    price: "$$",
    insurances: ["Group", "Individual"],
    keywords: ["eyes", "vision", "glasses", "contacts", "lasik", "cataracts", "glaucoma"],
  },
  {
    id: 8,
    name: "Dr. David Nguyen",
    specialty: "Neurology",
    specialtyId: "neurology",
    clinic: "Austin Brain & Spine Center",
    address: "750 Neuro Dr, Austin, TX 78756",
    city: "Austin",
    state: "TX",
    zip: "78756",
    rating: 4.9,
    reviews: 312,
    distance: "3.8 mi",
    acceptingNew: true,
    nextAvailable: "Next Week",
    price: "$$$",
    insurances: ["ICHRA", "Group"],
    keywords: ["brain", "headache", "migraine", "stroke", "seizure", "memory", "nerve"],
  },
];

const regions = [
  { name: "Austin Metro", providers: 2847, hospitals: 12 },
  { name: "Dallas-Fort Worth", providers: 4521, hospitals: 28 },
  { name: "Houston", providers: 5234, hospitals: 35 },
  { name: "San Antonio", providers: 1876, hospitals: 9 },
];

const ProviderMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("Austin, TX");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  // Filter providers based on search query, location, and specialty
  const filteredProviders = useMemo(() => {
    let results = allProviders;

    // Filter by specialty if selected
    if (selectedSpecialty) {
      results = results.filter(p => p.specialtyId === selectedSpecialty);
    }

    // Filter by location
    if (locationQuery.trim()) {
      const locationLower = locationQuery.toLowerCase();
      results = results.filter(p => 
        p.city.toLowerCase().includes(locationLower) ||
        p.state.toLowerCase().includes(locationLower) ||
        p.zip.includes(locationQuery) ||
        p.address.toLowerCase().includes(locationLower)
      );
    }

    // Filter by search query (matches name, specialty, clinic, keywords, or address)
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      results = results.filter(provider => {
        const searchableText = [
          provider.name,
          provider.specialty,
          provider.clinic,
          provider.address,
          ...provider.keywords
        ].join(" ").toLowerCase();

        // Check if ALL search terms match somewhere in the searchable text
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    return results;
  }, [searchQuery, locationQuery, selectedSpecialty]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Nationwide Network
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Find Your Perfect Provider
              </h1>
              <p className="text-xl text-muted-foreground">
                Explore our network of 50,000+ healthcare providers with transparent pricing 
                and real patient reviews.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-2xl shadow-lg border border-border">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, specialty, or condition..."
                    className="pl-10 h-12 border-0 bg-muted/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="City, State, or ZIP code"
                    className="pl-10 h-12 border-0 bg-muted/50"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="h-12 px-8">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties Grid */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Browse by Specialty</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {specialties.map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() => setSelectedSpecialty(
                    selectedSpecialty === specialty.id ? null : specialty.id
                  )}
                  className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                    selectedSpecialty === specialty.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <specialty.icon className="h-8 w-8 mb-3" />
                  <div className="font-medium">{specialty.name}</div>
                  <div className={`text-sm ${
                    selectedSpecialty === specialty.id 
                      ? "text-primary-foreground/70" 
                      : "text-muted-foreground"
                  }`}>
                    {specialty.count.toLocaleString()} providers
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Distance
                      </label>
                      <select className="w-full p-2 rounded-lg border border-border bg-background">
                        <option>Within 5 miles</option>
                        <option>Within 10 miles</option>
                        <option>Within 25 miles</option>
                        <option>Within 50 miles</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Insurance Type
                      </label>
                      <div className="space-y-2">
                        {["ICHRA", "Group", "Individual"].map((type) => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-border" defaultChecked />
                            <span className="text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Availability
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-sm">Accepting new patients</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-sm">Same-day appointments</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Rating
                      </label>
                      <select className="w-full p-2 rounded-lg border border-border bg-background">
                        <option>Any rating</option>
                        <option>4+ stars</option>
                        <option>4.5+ stars</option>
                      </select>
                    </div>

                    {/* Region Stats */}
                    <div className="pt-4 border-t border-border">
                      <h3 className="text-sm font-medium text-foreground mb-3">Regional Coverage</h3>
                      <div className="space-y-3">
                        {regions.map((region) => (
                          <div key={region.name} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{region.name}</span>
                            <span className="font-medium">{region.providers.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Provider List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredProviders.length}</span> providers
                    {locationQuery && ` near ${locationQuery}`}
                  </p>
                  <select className="p-2 rounded-lg border border-border bg-background text-sm">
                    <option>Sort by: Relevance</option>
                    <option>Sort by: Distance</option>
                    <option>Sort by: Rating</option>
                    <option>Sort by: Price</option>
                  </select>
                </div>

                {filteredProviders.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No providers found matching your search. Try adjusting your filters.</p>
                  </Card>
                ) : filteredProviders.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-semibold text-primary">
                            {provider.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">
                                {provider.name}
                              </h3>
                              <p className="text-primary font-medium">{provider.specialty}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                              <span className="font-semibold">{provider.rating}</span>
                              <span className="text-muted-foreground">
                                ({provider.reviews} reviews)
                              </span>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-3">{provider.clinic}</p>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {provider.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Next: {provider.nextAvailable}
                            </span>
                            <span className="font-medium text-foreground">{provider.price}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {provider.insurances.map((insurance) => (
                              <Badge 
                                key={insurance} 
                                variant="secondary"
                                className="bg-accent/10 text-accent border-accent/20"
                              >
                                {insurance}
                              </Badge>
                            ))}
                            {provider.acceptingNew && (
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                Accepting New Patients
                              </Badge>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <Button className="flex-1 md:flex-none">
                              Book Appointment
                            </Button>
                            <Button variant="outline" size="icon">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Load More */}
                <div className="text-center pt-8">
                  <Button variant="outline" size="lg">
                    Load More Providers
                  </Button>
                </div>
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
