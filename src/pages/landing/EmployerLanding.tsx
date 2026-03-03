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
  Calculator,
  FileText,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Calculator,
    title: "Defined Contributions",
    description: "Set predictable monthly allowances by employee class, age, or family status. Control costs with precision."
  },
  {
    icon: Users,
    title: "Employee Self-Service",
    description: "Employees choose their own plans within your budget. Less admin work for your HR team."
  },
  {
    icon: BarChart3,
    title: "Spend Visibility",
    description: "Real-time dashboards show enrollment status, budget utilization, and cost trends."
  },
  {
    icon: FileText,
    title: "Compliance Reports",
    description: "Automated ACA and ERISA reporting. Audit-ready documentation always available."
  }
];

const benefits = [
  "Predictable monthly healthcare costs",
  "No minimum contribution requirements",
  "Works for any size business",
  "Tax advantages for employer and employees",
  "Employees get more choice and flexibility"
];

export default function EmployerLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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
            <Button size="sm" onClick={() => navigate("/employer/intake")}>
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
                For Employers
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Defined contribution health benefits without the complexity
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Give employees a monthly allowance to choose their own health coverage. 
                You control the budget. They get the flexibility. 
                Everyone wins.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-6" onClick={() => navigate("/employer/intake")}>
                  Start Your Company
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
              <h2 className="text-3xl font-bold mb-4">Control costs, empower employees</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ICHRA lets you offer quality health benefits without unpredictable premium increases.
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
                <h2 className="text-3xl font-bold mb-6">Launch benefits in four steps</h2>
                <div className="space-y-6">
                  {[
                    { step: "1", title: "Set your contribution", desc: "Define monthly allowances by employee class" },
                    { step: "2", title: "Invite employees", desc: "Send enrollment links or share an invite code" },
                    { step: "3", title: "Employees choose plans", desc: "They pick coverage that fits their needs" },
                    { step: "4", title: "Track and manage", desc: "Monitor enrollment and spending in real-time" }
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
                  Why employers choose ICHRA
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

        {/* Comparison */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">ICHRA vs. traditional group plans</h2>
              <p className="text-muted-foreground">See why more employers are switching to defined contribution.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">Traditional Group Plan</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      <span>Unpredictable annual premium increases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      <span>One-size-fits-all plan options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      <span>Complex administration and renewals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      <span>Minimum participation requirements</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">ICHRA with Choice Exchange</h3>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Fixed monthly contribution you control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Employees choose from all available plans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Automated enrollment and compliance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Works with 1 employee or 1,000+</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to simplify your benefits?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join employers who are saving time and money with defined contribution health benefits.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="h-12 px-8"
              onClick={() => navigate("/employer/intake")}
            >
              Create Your Employer Account
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
