import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useEnrollmentStore } from "@/hooks/useEnrollmentStore";
import { supabase } from "@/integrations/supabase/client";
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
  Leaf,
} from "lucide-react";

/* ── Voluntary benefits lookup ── */
const VOLUNTARY_BENEFITS_DATA: Record<string, {
  name: string;
  plans: { id: string; name: string; carrier: string; monthlyPremium: number }[];
}> = {
  dental: {
    name: "Dental",
    plans: [
      { id: "delta-dental-basic", name: "Delta Dental Basic", carrier: "Delta Dental", monthlyPremium: 22 },
      { id: "delta-dental-standard", name: "Delta Dental Plus", carrier: "Delta Dental", monthlyPremium: 38 },
      { id: "delta-dental-premium", name: "Delta Dental Premier", carrier: "Delta Dental", monthlyPremium: 55 },
      { id: "cigna-dental-basic", name: "Cigna Dental Essential", carrier: "Cigna", monthlyPremium: 20 },
      { id: "cigna-dental-standard", name: "Cigna Dental Preferred", carrier: "Cigna", monthlyPremium: 35 },
      { id: "cigna-dental-premium", name: "Cigna Dental Elite", carrier: "Cigna", monthlyPremium: 52 },
      { id: "guardian-dental-basic", name: "Guardian DentalGuard Basic", carrier: "Guardian", monthlyPremium: 24 },
      { id: "guardian-dental-standard", name: "Guardian DentalGuard Plus", carrier: "Guardian", monthlyPremium: 40 },
      { id: "guardian-dental-premium", name: "Guardian DentalGuard Premium", carrier: "Guardian", monthlyPremium: 58 },
    ],
  },
  vision: {
    name: "Vision",
    plans: [
      { id: "vsp-basic", name: "VSP Basic", carrier: "VSP", monthlyPremium: 12 },
      { id: "vsp-standard", name: "VSP Preferred", carrier: "VSP", monthlyPremium: 22 },
      { id: "vsp-premium", name: "VSP Premier", carrier: "VSP", monthlyPremium: 35 },
      { id: "eyemed-basic", name: "EyeMed Access", carrier: "EyeMed", monthlyPremium: 10 },
      { id: "eyemed-standard", name: "EyeMed Select", carrier: "EyeMed", monthlyPremium: 20 },
      { id: "eyemed-premium", name: "EyeMed Premium", carrier: "EyeMed", monthlyPremium: 32 },
    ],
  },
  life: {
    name: "Term Life",
    plans: [
      { id: "metlife-life-basic", name: "MetLife Term Essential", carrier: "MetLife", monthlyPremium: 14 },
      { id: "metlife-life-standard", name: "MetLife Term Plus", carrier: "MetLife", monthlyPremium: 28 },
      { id: "metlife-life-premium", name: "MetLife Term Premier", carrier: "MetLife", monthlyPremium: 52 },
      { id: "prudential-life-basic", name: "Prudential Simple Term", carrier: "Prudential", monthlyPremium: 16 },
      { id: "prudential-life-standard", name: "Prudential Term Flex", carrier: "Prudential", monthlyPremium: 30 },
      { id: "prudential-life-premium", name: "Prudential Term Max", carrier: "Prudential", monthlyPremium: 55 },
    ],
  },
  disability: {
    name: "Short-Term Disability",
    plans: [
      { id: "disability-basic", name: "STD Basic", carrier: "Choice Exchange", monthlyPremium: 20 },
      { id: "disability-standard", name: "STD Plus", carrier: "Choice Exchange", monthlyPremium: 35 },
      { id: "disability-premium", name: "STD Premium", carrier: "Choice Exchange", monthlyPremium: 55 },
      { id: "unum-disability-basic", name: "Unum STD Core", carrier: "Unum", monthlyPremium: 22 },
      { id: "unum-disability-standard", name: "Unum STD Plus", carrier: "Unum", monthlyPremium: 38 },
      { id: "unum-disability-premium", name: "Unum STD Premier", carrier: "Unum", monthlyPremium: 60 },
      { id: "lincoln-disability-basic", name: "Lincoln STD Essential", carrier: "Lincoln Financial", monthlyPremium: 18 },
      { id: "lincoln-disability-standard", name: "Lincoln STD Select", carrier: "Lincoln Financial", monthlyPremium: 32 },
      { id: "lincoln-disability-premium", name: "Lincoln STD Complete", carrier: "Lincoln Financial", monthlyPremium: 50 },
    ],
  },
};

/* ── Cross-sell opportunities (unenrolled) ── */
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

interface MedicalPlan {
  plan_name: string;
  carrier_name: string;
  monthly_premium: number;
  deductible: number;
  out_of_pocket_max: number;
  copay_primary: number | null;
  plan_type: string;
  metal_tier: string;
}

export default function EnrollSubmit() {
  const { account, plan, household } = useEnrollmentStore();
  const [copied, setCopied] = useState(false);
  const [medicalPlan, setMedicalPlan] = useState<MedicalPlan | null>(null);

  const firstName = account.firstName || "there";
  const employer = household.employerName || "your employer";
  const confirmation = "CE-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  // Fetch medical plan details from DB
  useEffect(() => {
    const fetchPlan = async () => {
      if (!plan.medicalPlanId) return;
      const { data } = await supabase
        .from("ichra_plans")
        .select("plan_name, carrier_name, monthly_premium, deductible, out_of_pocket_max, copay_primary, plan_type, metal_tier")
        .eq("id", plan.medicalPlanId)
        .single();
      if (data) setMedicalPlan(data);
    };
    fetchPlan();
  }, [plan.medicalPlanId]);

  // Resolve voluntary selections
  const resolvedVoluntary = Object.entries(plan.voluntarySelections || {})
    .map(([catId, planId]) => {
      if (!planId) return null;
      const cat = VOLUNTARY_BENEFITS_DATA[catId];
      if (!cat) return null;
      const p = cat.plans.find(pl => pl.id === planId);
      if (!p) return null;
      return { categoryName: cat.name, ...p };
    })
    .filter(Boolean) as { categoryName: string; name: string; carrier: string; monthlyPremium: number }[];

  const voluntaryTotal = resolvedVoluntary.reduce((s, v) => s + v.monthlyPremium, 0);
  const medicalTotal = medicalPlan?.monthly_premium || 0;
  const totalMonthly = medicalTotal + voluntaryTotal;

  // Build enrolled benefits list
  const enrolledBenefits: { name: string; cost: number; detail: string; status: string }[] = [];
  
  resolvedVoluntary.forEach(v => {
    enrolledBenefits.push({ name: v.name, cost: v.monthlyPremium, detail: `${v.categoryName} • ${v.carrier}`, status: "active" });
  });

  // Determine unenrolled voluntary categories for upsell
  const enrolledCategories = new Set(Object.keys(plan.voluntarySelections || {}).filter(k => plan.voluntarySelections[k]));
  const unenrolledCategories = Object.keys(VOLUNTARY_BENEFITS_DATA).filter(k => !enrolledCategories.has(k));
  const upsellBenefits = unenrolledCategories.slice(0, 2).map(k => ({ name: VOLUNTARY_BENEFITS_DATA[k].name }));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(confirmation);
      toast("Copied to clipboard");
    } catch {
      toast("Unable to copy");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white/95 dark:bg-card/[0.98] backdrop-blur-md border-b border-border shadow-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-gradient-primary">
              Choice Exchange
            </span>
            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
              Member Portal
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {(account.firstName?.[0] || "")}{(account.lastName?.[0] || "")}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-foreground">{account.firstName} {account.lastName}</span>
              <span className="text-xs text-muted-foreground">{employer}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-r from-primary/[0.06] via-transparent to-accent/[0.06] border-b border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div className="flex-1">
            <CircleCheck className="h-8 w-8 text-accent animate-scale-in" />
            <h1 className="text-4xl font-bold mt-3 animate-fade-in-up" style={{ fontFamily: "Outfit, sans-serif" }}>
              You're covered, {firstName}.
            </h1>
            <p className="text-muted-foreground mt-2 text-lg animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Your benefits are confirmed. Here is everything in one place.
            </p>
            <div className="flex items-center gap-2 mt-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Confirmation #{confirmation}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center animate-fade-in relative w-48 h-48">
            {/* Central shield */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            {/* Orbiting benefit icons */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <div className="absolute top-1/4 right-2 w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div className="absolute bottom-1/4 right-4 w-10 h-10 rounded-xl border flex items-center justify-center" style={{ background: "hsl(var(--violet) / 0.12)", borderColor: "hsl(var(--violet) / 0.25)" }}>
              <HeartPulse className="h-5 w-5" style={{ color: "hsl(var(--violet))" }} />
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl border flex items-center justify-center" style={{ background: "hsl(var(--coral) / 0.12)", borderColor: "hsl(var(--coral) / 0.25)" }}>
              <ShieldAlert className="h-5 w-5" style={{ color: "hsl(var(--coral))" }} />
            </div>
            <div className="absolute bottom-1/4 left-4 w-10 h-10 rounded-xl bg-amber-500/12 border border-amber-500/25 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-amber-500" />
            </div>
            <div className="absolute top-1/4 left-2 w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Column 1 — Primary Coverage */}
        <Card className="card-elevated animate-card-reveal animate-card-reveal-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Health Coverage</CardTitle>
            </div>
            <Badge className="bg-accent/10 text-accent border-accent/25 text-xs">Active</Badge>
          </CardHeader>
          <CardContent>
            {/* Show Medical Plan if selected */}
            {medicalPlan && (
              <>
                <div className="rounded-lg px-3 py-1.5 surface-primary inline-flex items-center gap-2">
                  <Shield className="h-3 w-3 text-primary" />
                  <span className="text-sm font-bold text-primary">{medicalPlan.carrier_name.split(" ").map(w => w[0]).join("")}</span>
                </div>
                <h3 className="text-xl font-semibold mt-3 text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {medicalPlan.plan_name}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">{medicalPlan.carrier_name}</p>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <StatCell label="Monthly Premium" value={`$${medicalPlan.monthly_premium}`} />
                  <StatCell label="Deductible" value={`$${medicalPlan.deductible.toLocaleString()}`} />
                  <StatCell label="OOP Maximum" value={`$${medicalPlan.out_of_pocket_max.toLocaleString()}`} />
                  {medicalPlan.copay_primary != null && <StatCell label="PCP Copay" value={`$${medicalPlan.copay_primary}`} />}
                </div>
              </>
            )}

            {!medicalPlan && (
              <p className="text-muted-foreground text-sm py-4">No primary coverage selected</p>
            )}

            <Separator className="mt-5 mb-4" />
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              <span className="text-sm text-accent font-medium">Enrollment confirmed</span>
            </div>
          </CardContent>
        </Card>

        {/* Column 2 — Monthly Summary */}
        <Card className="card-elevated glow-accent animate-card-reveal animate-card-reveal-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-accent" />
              <CardTitle className="text-base">Monthly Summary</CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">Powered by {employer}</span>
          </CardHeader>
          <CardContent>
            <div>
              <span className="text-5xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
                ${totalMonthly}
              </span>
              <span className="text-base text-muted-foreground ml-1">/month</span>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-6 mb-3">
              Breakdown
            </p>

            {/* Segmented bar */}
            {totalMonthly > 0 && (
              <div className="w-full h-3 rounded-full overflow-hidden flex mb-4">
                {medicalPlan && (
                  <div className="h-full bg-primary" style={{ width: `${(medicalTotal / totalMonthly) * 100}%` }} />
                )}
                {voluntaryTotal > 0 && (
                  <div className="h-full" style={{ width: `${(voluntaryTotal / totalMonthly) * 100}%`, background: "hsl(var(--violet))" }} />
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {medicalPlan && (
                <LegendRow color="bg-primary" label="Medical Premium" amount={`$${medicalTotal}/mo`} />
              )}
              {voluntaryTotal > 0 && (
                <LegendRow colorStyle={{ background: "hsl(var(--violet))" }} label="Voluntary Benefits" amount={`$${voluntaryTotal}/mo`} />
              )}
            </div>

            <Separator className="mt-5 mb-4" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total monthly</span>
              <span className="text-sm font-semibold text-foreground">${totalMonthly.toLocaleString()}/mo</span>
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
            {enrolledBenefits.length > 0 ? (
              <div className="space-y-3">
                {enrolledBenefits.map((b) => (
                  <div key={b.name} className="flex items-center gap-3 py-2">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.detail}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">${b.cost}/mo</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">No voluntary benefits selected</p>
            )}

            {upsellBenefits.length > 0 && (
              <>
                <div className="relative my-4">
                  <hr className="border-border" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground whitespace-nowrap">
                    Not enrolled
                  </span>
                </div>
                <div className="space-y-2">
                  {upsellBenefits.map((b) => (
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
              </>
            )}
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
                Available through {employer} — add coverage any time.
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
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${opp.colorClass}`}>
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