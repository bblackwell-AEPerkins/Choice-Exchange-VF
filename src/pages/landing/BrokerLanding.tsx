import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  X,
  CreditCard,
  Calculator,
  Users,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Heart,
  Eye,
  Briefcase,
  HeartPulse,
  ShieldAlert,
  DollarSign,
  Sparkles,
  User,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// ── Hardcoded Data ──────────────────────────────────────

const STATS = [
  { value: "$31", label: "avg PEPM with voluntary stack", sub: "vs $19 ICHRA-only" },
  { value: "73%", label: "of members keep same carrier at renewal", sub: "year-two is nearly zero work" },
  { value: "100%", label: "agent of record retained", sub: "your client stays yours" },
  { value: "84%", label: "ICHRA adoption growth since 2023", sub: "among 50+ employee firms" },
];

const EARNINGS_TABLE = [
  { source: "ICHRA service fee", pepm: "$9–$14", notes: "Per enrolled member per month", monthly: "$450–$700/mo" },
  { source: "Individual market carrier", pepm: "$0–$15", notes: "State-dependent, paid by carrier", monthly: "$0–$750/mo" },
  { source: "Dental + Vision", pepm: "$4–$8", notes: "Ancillary — you keep this", monthly: "$200–$400/mo" },
  { source: "Voluntary benefits", pepm: "$6–$12", notes: "Life, disability, supplemental", monthly: "$300–$600/mo" },
  { source: "Total", pepm: "$19–$49", notes: "Per enrolled member per month", monthly: "$950–$2,450/mo", highlight: true },
];

const PAIN_POINTS = [
  { old: "Chase carrier invoices every month", new: "Carrier payments run automatically", icon: CreditCard },
  { old: "Re-run affordability analysis every renewal", new: "ACA compliance recalculated annually", icon: Calculator },
  { old: "Guide every employee through 50+ plan options", new: "Guided enrollment flow does the education", icon: Users },
  { old: "Build renewal proposals from scratch each year", new: "Renewal launches with one confirmation", icon: RefreshCw },
  { old: "Manage 1094/1095 compliance manually", new: "Reporting generated and filed automatically", icon: FileCheck },
  { old: "Lose AOR when switching admin platforms", new: "You remain agent of record. Always.", icon: ShieldCheck },
];

const VOLUNTARY_PRODUCTS = [
  { name: "Dental", commission: "4–6% of premium", icon: Heart, color: "accent" },
  { name: "Vision", commission: "4–6% of premium", icon: Eye, color: "accent" },
  { name: "Term Life", commission: "Up to 50% first year", icon: Shield, color: "primary" },
  { name: "Short-Term Disability", commission: "Up to 40% first year", icon: Briefcase, color: "primary" },
  { name: "Critical Illness", commission: "Up to 50% first year", icon: HeartPulse, color: "coral" },
  { name: "Accident", commission: "Up to 45% first year", icon: ShieldAlert, color: "coral" },
];

const RENEWAL_TIMELINE = [
  { month: "September", action: "Platform sends renewal notice to employer", auto: true },
  { month: "October", action: "Employees review plan options — guided by the platform", auto: true },
  { month: "November", action: "ACA affordability recalculated for new plan year", auto: true },
  { month: "December", action: "Selections locked, carrier files submitted", auto: true },
  { month: "January", action: "Coverage active. Broker reviews earnings summary.", auto: false },
];

const MOCK_DASHBOARD = {
  totalMembers: 124,
  activeGroups: 8,
  pendingRenewals: 3,
  monthlyEarnings: 3844,
  earningsGrowth: "+18% vs last year",
  groups: [
    { name: "Ameriflex", members: 48, status: "enrolled" as const, renewal: "Jan 2027", monthly: 1488 },
    { name: "Hartwell Construction", members: 31, status: "enrolled" as const, renewal: "Mar 2027", monthly: 961 },
    { name: "Clearpath Staffing", members: 22, status: "renewing" as const, renewal: "Jan 2027", monthly: 682 },
    { name: "Mesa Dental Group", members: 15, status: "pending" as const, renewal: "Apr 2027", monthly: 465 },
    { name: "Sycamore Logistics", members: 8, status: "enrolled" as const, renewal: "Jun 2027", monthly: 248 },
  ],
  workQueue: [
    { task: "Clearpath renewal window opens in 14 days", type: "renewal", urgent: true },
    { task: "3 Ameriflex employees haven't enrolled", type: "enrollment", urgent: false },
    { task: "Mesa Dental contribution confirmed for Q2", type: "admin", urgent: false },
  ],
};

const statusStyles = {
  enrolled: "bg-accent/10 text-accent border border-accent/25",
  renewing: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  pending: "bg-muted text-muted-foreground border border-border",
};

const queueTypeStyles = {
  renewal: "bg-amber-500/10 text-amber-600",
  enrollment: "bg-primary/10 text-primary",
  admin: "bg-muted text-muted-foreground",
};

const voluntaryColorMap: Record<string, string> = {
  accent: "bg-accent/10 text-accent",
  primary: "bg-primary/10 text-primary",
  coral: "bg-coral/10",
};

// ── Component ──────────────────────────────────────────

export default function BrokerLanding() {
  const navigate = useNavigate();

  const scrollToEarnings = () => {
    document.getElementById("earnings")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-border shadow-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-gradient-primary">Choice Exchange</span>
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
        <div className="bg-primary/[0.06] border-b border-primary/15">
          <div className="max-w-5xl mx-auto px-4 py-3 text-center text-sm">
            <span className="font-semibold text-foreground">Choice Exchange does not replace the broker.</span>{" "}
            <span className="text-muted-foreground">It replaces the manual work.</span>
          </div>
        </div>

        {/* ── SECTION 1: HERO ── */}
        <section className="py-20 lg:py-28 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-6 font-medium">For Benefits Brokers</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold font-display tracking-tight mb-6 leading-[1.1]">
                <span className="text-gradient-primary">More commission.</span> Less manual work. Your client stays yours.
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                Choice Exchange connects ICHRA enrollment to voluntary benefit stacking,
                carrier payment automation, and renewal orchestration — all from one broker
                dashboard. Your book grows. Your workload doesn't.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button size="lg" className="h-12 px-6 btn-glow" onClick={() => navigate("/broker/intake")}>
                  Start a Broker Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6" onClick={scrollToEarnings}>
                  See how earnings work
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: STAT BAR ── */}
        <section className="bg-muted/40 border-y border-border py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat, i) => (
                <div key={i} className={`animate-card-reveal animate-card-reveal-${i + 1}`}>
                  <p className={cn("text-3xl font-bold font-display", i === 0 ? "text-primary" : "text-foreground")}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: LIVE DASHBOARD PREVIEW ── */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-5xl mx-auto">
            <Badge variant="outline" className="mb-4">Your Dashboard</Badge>
            <h2 className="text-3xl font-bold font-display mb-3">
              Everything in one place. Nothing falls through the cracks.
            </h2>
            <p className="text-muted-foreground mb-10">
              Here is what your broker dashboard looks like in Choice Exchange.
              Real groups, real earnings, real visibility.
            </p>

            {/* Dashboard Preview */}
            <div className="card-elevated rounded-xl border border-border p-6 transform scale-[0.98] origin-top">
              {/* Top Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="border">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-2xl font-bold text-primary">${MOCK_DASHBOARD.monthlyEarnings.toLocaleString()}/mo</p>
                    <p className="text-xs text-muted-foreground mt-1">Monthly earnings</p>
                    <p className="text-xs text-accent mt-0.5 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />{MOCK_DASHBOARD.earningsGrowth}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-2xl font-bold text-foreground">{MOCK_DASHBOARD.totalMembers}</p>
                    <p className="text-xs text-muted-foreground mt-1">Active members</p>
                  </CardContent>
                </Card>
                <Card className="border">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-2xl font-bold text-foreground">{MOCK_DASHBOARD.activeGroups}</p>
                    <p className="text-xs text-muted-foreground mt-1">Employer groups</p>
                  </CardContent>
                </Card>
                <Card className="border">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-2xl font-bold text-amber-500">{MOCK_DASHBOARD.pendingRenewals}</p>
                    <p className="text-xs text-muted-foreground mt-1">Renewals this quarter</p>
                  </CardContent>
                </Card>
              </div>

              {/* Groups + Work Queue */}
              <div className="grid md:grid-cols-5 gap-4">
                {/* Groups Table */}
                <Card className="md:col-span-3 border">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Your Groups</CardTitle>
                    <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">View all</span>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {MOCK_DASHBOARD.groups.map((group, i) => (
                      <div key={i} className={cn("flex items-center justify-between py-3", i < MOCK_DASHBOARD.groups.length - 1 && "border-b border-border")}>
                        <div>
                          <p className="text-sm font-medium text-foreground">{group.name}</p>
                          <p className="text-xs text-muted-foreground">{group.members} members · Renewal {group.renewal}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-foreground">${group.monthly.toLocaleString()}/mo</span>
                          <Badge variant="outline" className={cn("text-xs", statusStyles[group.status])}>
                            {group.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Work Queue */}
                <Card className="md:col-span-2 border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Work Queue</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {MOCK_DASHBOARD.workQueue.map((item, i) => (
                      <div key={i} className={cn("flex items-start gap-3 py-3", i < MOCK_DASHBOARD.workQueue.length - 1 && "border-b border-border")}>
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", item.urgent ? "bg-destructive" : "bg-muted-foreground/40")} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{item.task}</p>
                          <Badge variant="secondary" className={cn("text-xs mt-1", queueTypeStyles[item.type as keyof typeof queueTypeStyles])}>
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-4 text-sm text-accent">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>0 carrier payment exceptions this month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: COMMISSION CALCULATOR ── */}
        <section id="earnings" className="py-20 bg-muted/30 border-t border-border px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-3">
              ICHRA alone is not the whole story.
            </h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              The real earning opportunity is the voluntary benefit stack that attaches
              at the enrollment moment. Here is what a 50-member group generates.
            </p>

            <div className="grid md:grid-cols-2 gap-10 items-start">
              {/* Earnings Table */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-base">Monthly earnings — 50 enrolled members</CardTitle>
                </CardHeader>
                <CardContent>
                  {EARNINGS_TABLE.map((row, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between py-3 text-sm",
                        row.highlight
                          ? "bg-primary/5 rounded-lg px-3 -mx-3 mt-2"
                          : i < EARNINGS_TABLE.length - 1 && "border-b border-border"
                      )}
                    >
                      <div className="flex-1">
                        <p className={cn("font-medium", row.highlight ? "text-primary font-bold" : "text-foreground")}>
                          {row.source}
                        </p>
                        <p className="text-xs text-muted-foreground">{row.notes}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-muted-foreground", row.highlight && "text-primary font-semibold")}>{row.pepm}</p>
                        <p className={cn("font-semibold", row.highlight ? "text-2xl font-bold text-primary" : "text-foreground")}>
                          {row.monthly}
                        </p>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                    State-dependent. CA, TX, FL pay higher carrier comp.
                    NY, MA pay $0 carrier comp. Voluntary commissions
                    are first-year; renewals pay 5–15%.
                  </p>
                </CardContent>
              </Card>

              {/* Voluntary Products */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Products that attach at enrollment</h3>
                <div className="grid grid-cols-2 gap-3">
                  {VOLUNTARY_PRODUCTS.map((product, i) => {
                    const Icon = product.icon;
                    return (
                      <Card key={i} className="hover:card-elevated transition-all cursor-default">
                        <CardContent className="pt-4 pb-4">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", voluntaryColorMap[product.color])}>
                            <Icon className="h-4 w-4" style={product.color === "coral" ? { color: "hsl(var(--coral))" } : undefined} />
                          </div>
                          <p className="text-sm font-semibold mt-2">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.commission}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <Card className="mt-4 bg-accent/[0.08] border-accent/20">
                  <CardContent className="pt-4 pb-4 flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground leading-relaxed">
                      Voluntary products are presented to employees during the ICHRA enrollment
                      moment — not as a separate conversation. Attachment rates are significantly higher.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: BEFORE/AFTER AUTOMATION ── */}
        <section className="py-20 border-t border-border px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-3">
              We eliminated the manual work. Not the broker.
            </h2>
            <p className="text-muted-foreground mb-10">
              Here is what running ICHRA looks like today versus with Choice Exchange.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Before */}
              <Card className="card-raised border-destructive/20 bg-destructive/[0.03]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <X className="h-5 w-5 text-destructive" />
                    Without Choice Exchange
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {PAIN_POINTS.map((point, i) => (
                    <div key={i} className={cn("flex items-start gap-3 py-2.5", i < PAIN_POINTS.length - 1 && "border-b border-border")}>
                      <X className="h-4 w-4 text-destructive/60 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{point.old}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* After */}
              <Card className="card-raised border-accent/25 bg-accent/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    With Choice Exchange
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {PAIN_POINTS.map((point, i) => (
                    <div key={i} className={cn("flex items-start gap-3 py-2.5", i < PAIN_POINTS.length - 1 && "border-b border-border")}>
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground font-medium">{point.new}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: RENEWAL AUTOMATION TIMELINE ── */}
        <section className="py-20 bg-muted/30 border-t border-border px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-2">
              Year two is nearly zero work.
            </h2>
            <p className="text-muted-foreground mb-10">
              73% of ICHRA members keep the same carrier at renewal.
              Here is how the renewal cycle runs automatically.
            </p>

            <div className="flex flex-col gap-0 max-w-xl">
              {RENEWAL_TIMELINE.map((step, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  {/* Left: circle + connector */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      step.auto ? "gradient-primary text-white" : "surface-steel"
                    )}>
                      {step.auto ? <RefreshCw className="h-4 w-4" /> : <User className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    {i < RENEWAL_TIMELINE.length - 1 && (
                      <div className="w-0.5 bg-border flex-1 min-h-[2rem]" />
                    )}
                  </div>

                  {/* Right: content */}
                  <div className="pb-8">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">{step.month}</p>
                    <p className="text-base font-medium text-foreground">{step.action}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs mt-2",
                        step.auto ? "bg-accent/10 text-accent border-accent/25" : "surface-steel"
                      )}
                    >
                      {step.auto ? "Automated" : "You review"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Card className="gradient-steel text-white p-6 rounded-xl mt-6 max-w-xl border-0">
              <p className="text-lg font-semibold">100% client retention, zero contribution increases</p>
              <p className="text-sm text-white/80 mt-1">
                In their first full renewal cycle, Choice Exchange brokers
                retained every ICHRA client with no employer contribution
                increases required.
              </p>
            </Card>
          </div>
        </section>

        {/* ── SECTION 7: AOR PROTECTION ── */}
        <section className="py-16 border-t border-border px-4">
          <div className="max-w-5xl mx-auto text-center">
            <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold font-display mb-4">
              Your client stays yours. Full stop.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Some ICHRA platforms require you to transfer agent of record to them.
              Choice Exchange does the opposite. You remain licensed BOR. You retain
              commission eligibility. You own the renewal conversation.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {[
                { icon: ShieldCheck, text: "BOR never transfers" },
                { icon: DollarSign, text: "Commission eligibility preserved" },
                { icon: RefreshCw, text: "Renewal conversation is yours" },
              ].map((pill, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm text-foreground shadow-card">
                  <pill.icon className="h-4 w-4 text-primary" />
                  {pill.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 8: FINAL CTA ── */}
        <section className="bg-foreground text-background py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              Ready to grow your ICHRA book?
            </h2>
            <p className="text-background/70 text-lg mb-8">
              Set up your broker account in under 5 minutes.
              Start your first enrollment the same day.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 btn-glow"
              onClick={() => navigate("/broker/intake")}
            >
              Create Your Broker Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-background/50 mt-4">
              No contracts. No setup fees. Agent of record retained.
            </p>
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
