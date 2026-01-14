import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  DollarSign, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  Building2,
  Users,
  Briefcase,
  HelpCircle
} from "lucide-react";

const ICHRA = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: DollarSign,
      title: "Tax-Free Allowance",
      description: "Your employer provides a monthly allowance to help pay for individual health insurance premiums."
    },
    {
      icon: Heart,
      title: "Choose Your Plan",
      description: "Select the health plan that best fits your needs from the individual market."
    },
    {
      icon: Shield,
      title: "Portable Coverage",
      description: "Your individual plan stays with you, even if you change jobs."
    },
    {
      icon: Users,
      title: "Family Coverage",
      description: "Your allowance can cover yourself, your spouse, and your dependents."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Verify Eligibility",
      description: "Sign in with your work email to confirm your ICHRA offer from your employer."
    },
    {
      number: "2",
      title: "Enter Your Location",
      description: "Provide your ZIP code to see health plans available in your area."
    },
    {
      number: "3",
      title: "Choose Your Plan",
      description: "Select a qualifying health plan that fits your needs and budget."
    },
    {
      number: "4",
      title: "Complete Enrollment",
      description: "Attest to your coverage and start receiving your tax-free reimbursement."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
                Employer-Sponsored Coverage
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Individual Coverage HRA
                <span className="block text-primary mt-2">Made Simple</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your employer offers you a monthly allowance to purchase your own individual 
                health insurance. Get the coverage you need with the flexibility you want.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg h-14 px-8" onClick={() => navigate("/ichra/enroll")}>
                  Start Enrollment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-14 px-8" onClick={() => navigate("/auth")}>
                  Sign In to Continue
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why ICHRA?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Individual Coverage HRAs give you the best of both worlds: employer-funded 
                benefits with individual plan choice.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <benefit.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Enrollment Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete your ICHRA enrollment in just a few simple steps.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* For Employers CTA */}
        <section className="py-16 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-6 w-6" />
                  <span className="font-semibold">For Employers</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                  Ready to Offer ICHRA to Your Team?
                </h2>
                <p className="text-secondary-foreground/80 mb-6">
                  ICHRA gives you control over your healthcare budget while empowering employees 
                  with choice. Learn how Choice Exchange can help you implement ICHRA.
                </p>
                <Button 
                  variant="outline" 
                  className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10"
                  onClick={() => navigate("/employer")}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Employer Solutions
                </Button>
              </div>
              <div className="flex-1">
                <Card className="bg-secondary-foreground/10 border-secondary-foreground/20">
                  <CardContent className="py-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                      <span>Predictable monthly costs</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                      <span>No minimum contribution requirements</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                      <span>Works for any size business</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                      <span>Tax advantages for both parties</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Our support team is here to help you understand ICHRA and navigate your enrollment.
            </p>
            <Button variant="outline" onClick={() => navigate("/support")}>
              Contact Support
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ICHRA;
