import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Shield, 
  Heart, 
  CreditCard, 
  Wallet,
  CheckCircle2,
  Loader2,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Heart,
    title: "Choose Your Coverage",
    description: "Pick from quality health plans that fit your needs and budget, all pre-approved by your employer."
  },
  {
    icon: Wallet,
    title: "Monthly Allowance",
    description: "Your employer contributes a set amount each month to help cover your premiums."
  },
  {
    icon: CreditCard,
    title: "Benefits Card",
    description: "Access your allowance and any voluntary benefits with a simple prepaid card."
  },
  {
    icon: Sparkles,
    title: "Add-On Benefits",
    description: "Enhance your coverage with dental, vision, life insurance, and more."
  }
];

const steps = [
  { title: "Enter your invite code", desc: "Your employer or broker will provide this" },
  { title: "Review your allowance", desc: "See how much your employer contributes monthly" },
  { title: "Pick your health plan", desc: "Compare options and choose what fits you" },
  { title: "Add voluntary benefits", desc: "Optional dental, vision, and more" },
  { title: "Activate your card", desc: "Start using your benefits immediately" }
];

export default function IndividualLanding() {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    navigate("/individual/intake", { state: { inviteCode } });
  };

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
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 lg:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  For Employees & Individuals
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  Your employer-funded health benefits, your choice
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Your employer provides a monthly allowance for health coverage. 
                  You pick the plan that works for you. 
                  It's that simple.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Tax-free allowance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Portable coverage</span>
                  </div>
                </div>
              </div>

              {/* Invite Code Card */}
              <Card className="bg-card border-border shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold mb-2">Get started with your invite code</h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Your employer or broker provided you with a code to begin enrollment.
                  </p>
                  <form onSubmit={handleInviteSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Enter your invite code"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        className="h-12 text-lg uppercase tracking-wider text-center"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 btn-glow"
                      disabled={!inviteCode.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Start Enrollment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Don't have a code? <Link to="/request-access" className="text-primary hover:underline">Request access</Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-muted/30 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What you get with Choice Exchange</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                More than just health insurance—a complete benefits experience.
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">How it works</Badge>
              <h2 className="text-3xl font-bold mb-4">Enroll in five simple steps</h2>
              <p className="text-muted-foreground">
                No complicated forms or confusing options. We guide you through every step.
              </p>
            </div>
            <div className="grid md:grid-cols-5 gap-4">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold mx-auto mb-3">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Common questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { q: "What is ICHRA?", a: "Individual Coverage HRA lets your employer give you tax-free money to buy your own health insurance." },
                { q: "Do I keep my coverage if I leave?", a: "Yes! Individual plans are portable—they stay with you even if you change jobs." },
                { q: "What if my premium costs more than my allowance?", a: "You can pay the difference with your own funds, often tax-free through payroll deduction." },
                { q: "Can I add my family?", a: "Absolutely. Your allowance can cover yourself, spouse, and dependents." }
              ].map((faq, index) => (
                <div key={index} className="bg-card rounded-lg p-5 border border-border/50">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
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
