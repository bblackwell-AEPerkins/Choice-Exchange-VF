import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Shield, 
  Users, 
  DollarSign, 
  BarChart3, 
  Zap,
  CheckCircle2,
  Building2,
  CreditCard,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Users,
    title: "Unified Enrollment",
    description: "Enroll clients into ICHRA plans with integrated voluntary benefits in one streamlined flow."
  },
  {
    icon: DollarSign,
    title: "Defined Contributions",
    description: "Set and manage employer contribution amounts with full transparency and compliance tracking."
  },
  {
    icon: CreditCard,
    title: "Benefits Card",
    description: "Activate prepaid cards for employees to access their allowances and voluntary benefits."
  },
  {
    icon: BarChart3,
    title: "Earnings Dashboard",
    description: "Track your PMPM earnings, voluntary attach rates, and group performance in real-time."
  }
];

const benefits = [
  "Launch enrollment in minutes, not weeks",
  "Attach voluntary benefits to increase per-member earnings",
  "ACA compliant workflows built-in",
  "White-label client experience",
  "Audit-ready reporting and documentation"
];

export default function BrokerLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-primary opacity-75 blur-md group-hover:opacity-100 transition-all duration-500" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <Shield className="h-5 w-5 text-primary-foreground" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">Choice Exchange</span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/70 -mt-0.5">Powered Benefits</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button size="sm" onClick={() => navigate("/broker/intake")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 lg:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4">
                For Benefits Brokers
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                ICHRA enrollment with voluntary benefits attached
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Launch defined contribution health benefits for your clients in minutes. 
                Attach voluntary benefits to increase per-member earnings. 
                Track everything from one dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-6" onClick={() => navigate("/broker/intake")}>
                  Start Your First Group
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6" onClick={() => navigate("/support")}>
                  Talk to Our Team
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-muted/30 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Everything you need to grow</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From enrollment to earnings tracking, Choice Exchange handles the complexity so you can focus on your clients.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card/50 border-border/50">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">How it works</Badge>
                <h2 className="text-3xl font-bold mb-6">Launch a group in four steps</h2>
                <div className="space-y-6">
                  {[
                    { step: "1", title: "Create your broker account", desc: "Quick setup with your agency details" },
                    { step: "2", title: "Add your employer group", desc: "Enter company info and set contribution levels" },
                    { step: "3", title: "Invite employees", desc: "Send enrollment links via email or share a code" },
                    { step: "4", title: "Track and earn", desc: "Monitor enrollment progress and earnings in real-time" }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-border/50">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Why brokers choose us
                </h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to modernize your benefits practice?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join brokers who are growing their book with ICHRA and voluntary benefits. 
              No minimums, no complex contracts.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="h-12 px-8"
              onClick={() => navigate("/broker/intake")}
            >
              Create Your Broker Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© 2024 Choice Exchange</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
