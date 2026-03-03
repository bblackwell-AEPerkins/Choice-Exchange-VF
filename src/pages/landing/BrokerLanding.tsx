import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Shield,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { PreviewDashboard } from "@/components/broker/PreviewDashboard";

const featureModules = [
  {
    title: "Broker-led enrollment across individuals and groups",
    description: "Run ICHRA enrollments in a single guided flow while remaining agent of record. No marketplace handoff. No loss of client ownership."
  },
  {
    title: "Employer contributions, enforced automatically",
    description: "Set employer contribution rules once. The system applies them consistently across employees, plans, and renewals with full compliance tracking."
  },
  {
    title: "Automated carrier payments and reconciliation",
    description: "Choice Exchange manages premium payments, carrier files, and reconciliation in the background. Brokers no longer chase invoices or exceptions."
  },
  {
    title: "Real-time reporting, commissions, and renewals",
    description: "Track enrollment status, per-member earnings, carrier payments, and upcoming renewals from a single dashboard."
  }
];

const steps = [
  { 
    step: "1", 
    title: "Set up your broker account", 
    desc: "Add agency details and carrier relationships. Broker remains agent of record." 
  },
  { 
    step: "2", 
    title: "Configure employer groups", 
    desc: "Define contribution levels, eligibility rules, and enrollment parameters once." 
  },
  { 
    step: "3", 
    title: "Enroll individuals and households", 
    desc: "Employees complete enrollment through a guided flow with persistent contribution visibility." 
  },
  { 
    step: "4", 
    title: "Automate payments and renewals", 
    desc: "Carrier payments, reporting, and renewals run automatically without broker intervention." 
  }
];

const benefits = [
  "Broker retains agent of record and client ownership",
  "Enrollment launches in minutes, not weeks",
  "Carrier payments and reconciliation automated",
  "Built-in ACA and ICHRA compliance",
  "White-label, broker-first experience",
  "Audit-ready reporting and renewal automation"
];

export default function BrokerLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold font-display text-gradient-primary">Choice Exchange</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button size="sm" onClick={() => navigate("/broker/intake")}>
              Start a Broker Account
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Callout Banner */}
        <div className="bg-muted/50 border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <p className="text-sm text-center text-muted-foreground">
              <span className="font-medium text-foreground">Choice Exchange does not replace the broker.</span>{" "}
              It replaces manual work.
            </p>
          </div>
        </div>

        {/* Hero */}
        <section className="py-20 lg:py-28 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-6 font-medium">
                For Benefits Brokers
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
                ICHRA enrollment and renewals, fully automated
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
                Launch and manage ICHRA for individuals and groups while keeping agent of record. 
                Choice Exchange automates enrollment, carrier payments, reporting, and renewals 
                from one broker dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-6 btn-glow" onClick={() => navigate("/broker/intake")}>
                  Start a Broker Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6" onClick={() => navigate("/support")}>
                  Talk to Our Team
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-20 bg-muted/30 border-t border-border/50 px-4">
          <div className="max-w-5xl mx-auto">
            <PreviewDashboard />
          </div>
        </section>

        {/* Core Value Proposition */}
        <section className="py-20 border-t border-border/50 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                Built for broker control, not marketplaces
              </h2>
              <p className="text-lg text-muted-foreground">
                Choice Exchange handles the operational work behind ICHRA so brokers can focus 
                on advising, client relationships, and growth.
              </p>
            </div>

            {/* Feature Modules - Clean grid layout */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {featureModules.map((module, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-lg font-semibold leading-snug">{module.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{module.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30 border-t border-border/50 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                From setup to renewal in one workflow
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((item) => (
                <div key={item.step} className="space-y-3">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-sm">
                    {item.step}
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Brokers Choose */}
        <section className="py-20 border-t border-border/50 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl font-bold mb-4 tracking-tight">
                  Why brokers choose Choice Exchange
                </h2>
              </div>
              <div>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-foreground text-background px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">
              Modernize how you run ICHRA
            </h2>
            <p className="text-background/70 mb-8 text-lg">
              Use Choice Exchange to automate enrollment, payments, and renewals without giving up control.
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
      <footer className="border-t border-border/50 py-6 bg-background">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
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
