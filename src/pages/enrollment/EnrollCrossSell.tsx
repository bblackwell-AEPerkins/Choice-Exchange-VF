import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEnrollmentStore } from "@/hooks/useEnrollmentStore";
import { toast } from "sonner";
import {
  Banknote,
  PiggyBank,
  Wallet,
  ShieldCheck,
  Heart,
  Eye,
  Shield,
  Briefcase,
  Minus,
  Plus,
  CheckCircle2,
  TrendingDown,
  Sparkles,
} from "lucide-react";

export default function EnrollCrossSell() {
  const navigate = useNavigate();
  const { setStep, isLoading, canAccessStep, saveToDatabase } = useEnrollmentStore();

  const [displayRemaining, setDisplayRemaining] = useState(130);
  const [hsaEnabled, setHsaEnabled] = useState(false);
  const [hsaAmount, setHsaAmount] = useState(50);
  const [hraEnabled, setHraEnabled] = useState(false);
  const [dentalEnabled, setDentalEnabled] = useState(false);
  const [visionEnabled, setVisionEnabled] = useState(false);
  const [lifeEnabled, setLifeEnabled] = useState(false);
  const [disabilityEnabled, setDisabilityEnabled] = useState(false);

  const totalAllocated =
    (hsaEnabled ? hsaAmount : 0) +
    (hraEnabled ? 30 : 0) +
    (dentalEnabled ? 45 : 0) +
    (visionEnabled ? 15 : 0) +
    (lifeEnabled ? 25 : 0) +
    (disabilityEnabled ? 35 : 0);

  const remaining = 130 - totalAllocated;

  useEffect(() => {
    if (!isLoading && !canAccessStep("coverage")) {
      navigate("/enroll");
    }
  }, [isLoading, canAccessStep, navigate]);

  // Animated counter
  useEffect(() => {
    const target = 130 - totalAllocated;
    const diff = target - displayRemaining;
    if (diff === 0) return;
    const step = diff > 0 ? 1 : -1;
    const interval = setInterval(() => {
      setDisplayRemaining((prev) => {
        if (prev === target) {
          clearInterval(interval);
          return prev;
        }
        return prev + step;
      });
    }, 12);
    return () => clearInterval(interval);
  }, [totalAllocated]);

  const tryEnable = (cost: number, setter: (v: boolean) => void) => {
    if (remaining >= cost) {
      setter(true);
    } else {
      toast("Not enough remaining balance — remove another selection first");
    }
  };

  const amountColor =
    displayRemaining >= 20
      ? "text-accent"
      : displayRemaining > 0
        ? "text-amber-500"
        : "text-destructive";

  return (
    <EnrollmentLayout
      currentStep={7}
      totalSteps={8}
      title="Allocate Your Surplus"
      description="Your employer contributes more than your medical premium — put the rest to work."
      onSave={saveToDatabase}
    >
      {/* ── SECTION 1 — Live Balance Tracker ── */}
      <Card className="glow-accent border-accent/30">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-8">
            {/* Left: animated balance */}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                ICHRA Surplus Remaining
              </p>
              <p className={`text-5xl md:text-6xl font-bold tabular-nums font-display ${amountColor}`}>
                ${displayRemaining}
              </p>
              <p className="text-sm text-muted-foreground mt-1">/month available</p>

              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full mt-4">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${(totalAllocated / 130) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$0</span>
                <span>$130 total</span>
              </div>
            </div>

            {/* Right: allocation breakdown */}
            {totalAllocated > 0 && (
              <div className="flex-shrink-0 min-w-[180px]">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Allocated
                </p>
                <div className="space-y-1.5">
                  {hsaEnabled && <AllocRow label="HSA Contribution" amount={hsaAmount} />}
                  {hraEnabled && <AllocRow label="HRA Carryover" amount={30} />}
                  {dentalEnabled && <AllocRow label="Dental Plus" amount={45} />}
                  {visionEnabled && <AllocRow label="Vision Care" amount={15} />}
                  {lifeEnabled && <AllocRow label="Term Life" amount={25} />}
                  {disabilityEnabled && <AllocRow label="Short-Term Disability" amount={35} />}
                </div>
                <div className="border-t border-border mt-2 pt-2">
                  <div className="flex justify-between text-sm font-semibold text-foreground">
                    <span>Total</span>
                    <span>${totalAllocated}/mo</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── SECTION 2 — Tax-Advantaged Accounts ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Banknote className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
            Tax-Advantaged Accounts
          </span>
        </div>

        <div className="space-y-3">
          {/* HSA Card */}
          <Card
            className={`transition-all duration-200 cursor-pointer ${
              hsaEnabled
                ? "border-primary ring-2 ring-primary/15 bg-primary/[0.04] shadow-card"
                : "border-border hover:border-primary/40 hover:shadow-card"
            }`}
          >
            <CardContent className="py-5">
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    hsaEnabled ? "gradient-primary" : "surface-steel"
                  }`}
                >
                  <PiggyBank className={`h-5 w-5 ${hsaEnabled ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-semibold text-sm">HSA Contribution</span>
                    <Badge className="bg-accent/10 text-accent border-accent/25 text-xs ml-2">
                      Triple tax advantage
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Health Savings Account — tax-free savings for medical expenses
                  </p>
                  {hsaEnabled && (
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          setHsaAmount((prev) => Math.max(10, prev - 10));
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-semibold w-14 text-center">${hsaAmount}/mo</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          setHsaAmount((prev) => {
                            const newVal = prev + 10;
                            const wouldAllocate = totalAllocated - hsaAmount + newVal;
                            return wouldAllocate <= 130 ? newVal : prev;
                          });
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 flex items-center gap-3">
                  {!hsaEnabled && (
                    <span className="text-sm font-medium text-muted-foreground">$50/mo</span>
                  )}
                  <Switch
                    checked={hsaEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) tryEnable(hsaAmount, setHsaEnabled);
                      else setHsaEnabled(false);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HRA Card */}
          <Card
            className={`transition-all duration-200 cursor-pointer ${
              hraEnabled
                ? "border-primary ring-2 ring-primary/15 bg-primary/[0.04] shadow-card"
                : "border-border hover:border-primary/40 hover:shadow-card"
            }`}
          >
            <CardContent className="py-5">
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    hraEnabled ? "gradient-primary" : "surface-steel"
                  }`}
                >
                  <Wallet className={`h-5 w-5 ${hraEnabled ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-semibold text-sm">HRA Carryover Boost</span>
                    <Badge className="bg-steel text-steel-foreground border-border text-xs ml-2">
                      Rolls over annually
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Roll unused dollars forward into your next year ICHRA balance
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">$30/mo</span>
                  <Switch
                    checked={hraEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) tryEnable(30, setHraEnabled);
                      else setHraEnabled(false);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── SECTION 3 — Voluntary Benefits ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-accent uppercase tracking-wide">
            Voluntary Benefits
          </span>
        </div>

        <div className="space-y-3">
          {/* Dental */}
          <BenefitCard
            icon={Heart}
            name="Dental Plus"
            cost={45}
            enabled={dentalEnabled}
            enabledIconClass="bg-accent/15 text-accent"
            badge={{ label: "Recommended", className: "bg-accent/10 text-accent border-accent/25" }}
            features={["Preventive, basic and major services", "2 covered exams per year"]}
            onToggle={(checked) => {
              if (checked) tryEnable(45, setDentalEnabled);
              else setDentalEnabled(false);
            }}
          />

          {/* Vision */}
          <BenefitCard
            icon={Eye}
            name="Vision Care"
            cost={15}
            enabled={visionEnabled}
            enabledIconClass="bg-accent/15 text-accent"
            badge={{ label: "Recommended", className: "bg-accent/10 text-accent border-accent/25" }}
            features={["$150 frames or contacts allowance", "Annual eye exam covered"]}
            onToggle={(checked) => {
              if (checked) tryEnable(15, setVisionEnabled);
              else setVisionEnabled(false);
            }}
          />

          {/* Life */}
          <BenefitCard
            icon={Shield}
            name="Term Life Insurance"
            cost={25}
            enabled={lifeEnabled}
            enabledIconClass="bg-primary/15 text-primary"
            features={["$100,000 death benefit", "Guaranteed acceptance, no medical exam"]}
            onToggle={(checked) => {
              if (checked) tryEnable(25, setLifeEnabled);
              else setLifeEnabled(false);
            }}
          />

          {/* Disability */}
          <BenefitCard
            icon={Briefcase}
            name="Short-Term Disability"
            cost={35}
            enabled={disabilityEnabled}
            enabledIconClass="bg-primary/15 text-primary"
            features={["60% income replacement", "Coverage up to 26 weeks"]}
            onToggle={(checked) => {
              if (checked) tryEnable(35, setDisabilityEnabled);
              else setDisabilityEnabled(false);
            }}
          />
        </div>
      </div>

      {/* ── SECTION 4 — Paycheck Impact Summary ── */}
      {totalAllocated > 0 && (
        <Card className="surface-steel border-border">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Monthly paycheck impact</span>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between items-center py-1.5">
                <span className="text-muted-foreground">ICHRA contribution received</span>
                <span className="text-accent font-medium">+ $450/mo</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-muted-foreground">Medical premium (BCBS Silver)</span>
                <span className="text-foreground">− $320/mo</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-muted-foreground">Benefits allocated</span>
                <span className="text-foreground">− ${totalAllocated}/mo</span>
              </div>
            </div>

            <div className="border-t border-border my-2" />

            {remaining > 0 ? (
              <div>
                <p className="text-sm font-semibold text-amber-500">
                  = ${remaining}/mo unallocated
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You can always allocate more later
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-accent flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  = Fully allocated
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Every dollar is working for you
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <EnrollmentNavigation
        nextLabel="Review My Selections"
        onNext={() => {
          setStep("review");
          navigate("/enroll/review");
        }}
        onBack={() => navigate("/enroll/offering")}
      />
    </EnrollmentLayout>
  );
}

/* ── Helper Components ── */

function AllocRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-foreground">{label}</span>
      <span className="text-muted-foreground">${amount}/mo</span>
    </div>
  );
}

interface BenefitCardProps {
  icon: React.ElementType;
  name: string;
  cost: number;
  enabled: boolean;
  enabledIconClass: string;
  badge?: { label: string; className: string };
  features: string[];
  onToggle: (checked: boolean) => void;
}

function BenefitCard({
  icon: Icon,
  name,
  cost,
  enabled,
  enabledIconClass,
  badge,
  features,
  onToggle,
}: BenefitCardProps) {
  return (
    <Card
      className={`transition-all duration-200 ${
        enabled
          ? "border-primary ring-2 ring-primary/15 bg-primary/[0.04] shadow-card"
          : "border-border hover:border-primary/40 hover:shadow-card"
      }`}
    >
      <CardContent className="py-5">
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              enabled ? enabledIconClass : "surface-steel"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <span className="font-semibold text-sm">{name}</span>
              {badge && (
                <Badge className={`${badge.className} text-xs ml-2`}>{badge.label}</Badge>
              )}
            </div>
            <div className="space-y-1 mt-1.5">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-accent flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">${cost}/mo</span>
            <Switch checked={enabled} onCheckedChange={onToggle} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
