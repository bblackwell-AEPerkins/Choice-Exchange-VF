import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  CircleCheck,
  FileText,
  Copy,
  Shield,
  Calendar,
  ExternalLink,
  Wallet,
  Sparkles,
  Heart,
  CheckCircle2,
  Plus,
  HeartPulse,
  ShieldAlert,
  Building2,
  Phone,
  Download,
  Printer,
} from "lucide-react";

/* ── Hardcoded Demo Data ── */

const MEMBER = {
  name: "John Doe",
  firstName: "John",
  initials: "JD",
  employer: "Ameriflex",
  confirmation: "AMF-2026-8847",
  effectiveDate: "April 1, 2026",
};

const PLAN = {
  carrier: "Blue Cross Blue Shield",
  name: "Silver Standard PPO",
  premium: 320,
  deductible: 4500,
  oopMax: 8700,
  pcpCopay: 30,
  type: "PPO",
};

const ICHRA = {
  monthly: 450,
  annual: 5400,
  medical: 320,
  hsa: 70,
  voluntary: 60,
};

const ENROLLED_BENEFITS = [
  { name: "Dental Plus", cost: 45, detail: "Coverage active Apr 1", status: "active" },
  { name: "Vision Care", cost: 15, detail: "Coverage active Apr 1", status: "active" },
  { name: "HSA Account", cost: 70, detail: "$70/mo contribution", status: "establishing" },
];

const UPSELL_BENEFITS = [
  { name: "Term Life Insurance" },
  { name: "Short-Term Disability" },
];

const OPPORTUNITIES = [
  {
    icon: HeartPulse,
    name: "Critical Illness Insurance",
    description: "Lump-sum cash benefit if diagnosed with a serious illness",
    price: "Starting at $18/mo",
    colorClass: "bg-[hsl(var(--coral))]/10 border-[hsl(var(--coral))]/20",
    iconStyle: { color: "hsl(var(--coral))" },
  },
  {
    icon: ShieldAlert,
    name: "Accident Insurance",
    description: "Cash benefits for ER visits, fractures, and unexpected injuries",
    price: "Starting at $12/mo",
    colorClass: "bg-amber-500/10 border-amber-500/20",
    iconStyle: { color: "hsl(45, 93%, 47%)" },
  },
  {
    icon: Building2,
    name: "Hospital Indemnity",
    description: "Daily cash benefit for each day you are hospitalized",
    price: "Starting at $22/mo",
    colorClass: "bg-[hsl(var(--violet))]/10 border-[hsl(var(--violet))]/20",
    iconStyle: { color: "hsl(var(--violet))" },
  },
];

/* ── Page Component ── */

export default function EnrollSubmit() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MEMBER.confirmation);
    toast("Copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white/95 dark:bg-card/[0.98] backdrop-blur-md border-b border-border shadow-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-gradient-primary" style={{ fontFamily: "Outfit, sans-serif" }}>
              Choice Exchange
            </span>
            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
              Member Portal
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-sm font-bold text-white">{MEMBER.initials}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-foreground">{MEMBER.name}</span>
              <span className="text-xs text-muted-foreground">{MEMBER.employer}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-r from-primary/[0.06] via-transparent to-accent/[0.06] border-b border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div className="flex-1">
            <CircleCheck className="h-8 w-8 text-accent animate-scale-in" />
            <h1
              className="text-4xl font-bold mt-3 animate-fade-in"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              You're covered, {MEMBER.firstName}.
            </h1>
            <p className="text-muted-foreground mt-2 text-lg animate-fade-in">
              Your benefits are active starting {MEMBER.effectiveDate}. Here is everything in one place.
            </p>
            <div className="flex items-center gap-2 mt-4 animate-fade-in">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Confirmation #{MEMBER.confirmation}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center animate-fade-in">
            <div className="w-24 h-24 rounded-2xl gradient-primary opacity-15" />
            <div className="w-24 h-24 rounded-2xl bg-accent opacity-15 -ml-8" />
            <div
              className="w-24 h-24 rounded-2xl opacity-15 -ml-8"
              style={{ background: "hsl(var(--violet))" }}
            />
          </div>
        </div>
      </div>

      {/* ── 3-Column Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Column 1 — Health Coverage */}
        <Card className="card-elevated animate-card-reveal animate-card-reveal-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Health Coverage</CardTitle>
            </div>
            <Badge className="bg-accent/10 text-accent border-accent/25 text-xs">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg px-3 py-1.5 surface-primary inline-flex items-center gap-2">
              <Shield className="h-3 w-3 text-primary" />
              <span className="text-sm font-bold text-primary">BCBS</span>
            </div>
            <h3 className="text-xl font-semibold mt-3 text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
              {PLAN.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">{PLAN.carrier}</p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <StatCell label="Monthly Premium" value={`$${PLAN.premium}`} />
              <StatCell label="Deductible" value={`$${PLAN.deductible.toLocaleString()}`} />
              <StatCell label="OOP Maximum" value={`$${PLAN.oopMax.toLocaleString()}`} />
              <StatCell label="PCP Copay" value={`$${PLAN.pcpCopay}`} />
            </div>

            <Separator className="mt-5 mb-4" />

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              <span className="text-sm text-accent font-medium">Effective {MEMBER.effectiveDate}</span>
            </div>
            <Button variant="ghost" size="sm" className="mt-3 -ml-3 text-muted-foreground hover:text-foreground">
              View full plan details
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Column 2 — ICHRA Balance */}
        <Card className="card-elevated glow-accent animate-card-reveal animate-card-reveal-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-accent" />
              <CardTitle className="text-base">ICHRA Balance</CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">Powered by {MEMBER.employer}</span>
          </CardHeader>
          <CardContent>
            <div>
              <span className="text-5xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
                ${ICHRA.monthly}
              </span>
              <span className="text-base text-muted-foreground ml-1">/month</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs text-accent font-medium">Employer funded · Tax-free</span>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-6 mb-3">
              Monthly allocation
            </p>

            {/* Segmented bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex">
              <div className="h-full bg-primary rounded-l-full" style={{ width: "71%" }} />
              <div className="h-full bg-accent" style={{ width: "16%" }} />
              <div className="h-full rounded-r-full" style={{ width: "13%", background: "hsl(var(--violet))" }} />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <LegendRow color="bg-primary" label="Medical Premium" amount={`$${ICHRA.medical}/mo`} />
              <LegendRow color="bg-accent" label="HSA Contribution" amount={`$${ICHRA.hsa}/mo`} />
              <LegendRow colorStyle={{ background: "hsl(var(--violet))" }} label="Dental + Vision" amount={`$${ICHRA.voluntary}/mo`} />
            </div>

            <Separator className="mt-5 mb-4" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Annual ICHRA value</span>
              <span className="text-sm font-semibold text-foreground">${ICHRA.annual.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Column 3 — Your Benefits */}
        <Card className="card-elevated animate-card-reveal animate-card-reveal-3">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-4">
            <Heart className="h-5 w-5 text-accent" />
            <CardTitle className="text-base">Your Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ENROLLED_BENEFITS.map((b) => (
                <div key={b.name} className="flex items-center gap-3 py-2">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.detail}</p>
                  </div>
                  {b.status === "establishing" ? (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
                      Establishing
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">${b.cost}/mo</span>
                  )}
                </div>
              ))}
            </div>

            {/* Divider with label */}
            <div className="relative my-4">
              <hr className="border-border" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground whitespace-nowrap">
                Not enrolled
              </span>
            </div>

            <div className="space-y-2">
              {UPSELL_BENEFITS.map((b) => (
                <div
                  key={b.name}
                  className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-primary/30 hover:bg-primary/[0.03] transition-colors group cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/25 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground flex-1">{b.name}</span>
                  <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Add coverage
                  </span>
                  <Plus className="h-3.5 w-3.5 text-primary" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Opportunities Section ── */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
                More Ways to Protect Your Health
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Available through {MEMBER.employer} — add coverage any time.
              </p>
            </div>
            <Button variant="ghost" size="sm">View all</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {OPPORTUNITIES.map((opp) => {
              const Icon = opp.icon;
              return (
                <Card
                  key={opp.name}
                  className="card-raised hover:card-elevated hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                >
                  <CardContent className="pt-6">
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${opp.colorClass}`}
                    >
                      <Icon className="h-6 w-6" style={opp.iconStyle} />
                    </div>
                    <h3 className="text-base font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {opp.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">{opp.description}</p>
                    <p className="text-xs text-muted-foreground font-medium">{opp.price}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full group-hover:border-primary/40 group-hover:text-primary transition-colors"
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer Bar ── */}
      <footer className="border-t border-border bg-card/80 backdrop-blur-sm py-5 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Questions about your benefits?</span>
            <span className="text-sm text-primary font-medium hover:underline cursor-pointer">
              Contact your advisor
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download Summary
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Helper Components ── */

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg surface-steel p-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function LegendRow({
  color,
  colorStyle,
  label,
  amount,
}: {
  color?: string;
  colorStyle?: React.CSSProperties;
  label: string;
  amount: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${color || ""}`} style={colorStyle} />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-medium text-foreground">{amount}</span>
    </div>
  );
}
