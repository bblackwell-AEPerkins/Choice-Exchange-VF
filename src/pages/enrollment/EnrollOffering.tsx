import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEnrollmentStore } from "@/hooks/useEnrollmentStore";
import { useEnrollmentConfig } from "@/stores/enrollmentConfigStore";
import {
  Briefcase,
  Shield,
  Sparkles,
  PiggyBank,
  Heart,
  Eye,
  ShieldPlus,
} from "lucide-react";

export default function EnrollOffering() {
  const navigate = useNavigate();
  const {
    setStep,
    isLoading,
    canAccessStep,
    saveToDatabase,
  } = useEnrollmentStore();
  const { isStepEnabled } = useEnrollmentConfig();

  useEffect(() => {
    if (!isLoading && !canAccessStep("coverage")) {
      navigate("/enroll");
    }
  }, [isLoading, canAccessStep, navigate]);

  const handleNext = () => {
    if (isStepEnabled("crosssell")) {
      navigate("/enroll/crosssell");
    } else {
      setStep("submit");
      navigate("/enroll/submit");
    }
  };

  const handleBack = () => {
    setStep("coverage");
    navigate("/enroll/coverage");
  };

  return (
    <EnrollmentLayout
      currentStep={6}
      totalSteps={8}
      title="Your ICHRA Contribution"
      description=""
      onSave={saveToDatabase}
    >
      {/* SECTION 1 — Contribution Visualizer */}
      <Card>
        <CardContent className="pt-6 pb-6 space-y-0">
          {/* Row 1 — Employer contribution */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-primary shrink-0" />
              <span className="font-medium text-foreground">Ameriflex contributes</span>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                ICHRA Balance
              </Badge>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold text-primary">$450</span>
              <span className="text-sm text-muted-foreground ml-1">/month</span>
            </div>
          </div>

          {/* Separator − */}
          <div className="relative border-t border-border my-5">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
              <div className="w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">−</span>
              </div>
            </div>
          </div>

          {/* Row 2 — Plan premium */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-foreground shrink-0" />
              <span className="text-sm font-medium text-foreground">Blue Cross Blue Shield Silver Standard PPO</span>
              <Badge variant="outline">Your premium</Badge>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-foreground">$320</span>
              <span className="text-sm text-muted-foreground ml-1">/month</span>
            </div>
          </div>

          {/* Separator = */}
          <div className="relative border-t border-border my-5">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
              <div className="w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">=</span>
              </div>
            </div>
          </div>

          {/* Row 3 — Surplus (hero) */}
          <div className="rounded-xl bg-accent/10 border border-accent/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-accent shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-foreground">Your remaining balance</span>
                  <p className="text-sm text-muted-foreground">Yours to allocate</p>
                </div>
              </div>
              <div className="text-right animate-fade-in">
                <span className="text-5xl font-bold text-accent">$130</span>
                <p className="text-sm text-muted-foreground">/month</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2 — Annual Numbers */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-2xl font-bold text-foreground">$5,400</p>
            <p className="text-sm text-foreground mt-1">Annual ICHRA value</p>
            <p className="text-xs text-muted-foreground">Total from Ameriflex</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-2xl font-bold text-foreground">$3,840</p>
            <p className="text-sm text-foreground mt-1">Annual premium</p>
            <p className="text-xs text-muted-foreground">Blue Cross Silver Standard</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="pt-5 pb-5">
            <p className="text-2xl font-bold text-accent">$1,560</p>
            <p className="text-sm text-foreground mt-1">Annual surplus</p>
            <p className="text-xs text-muted-foreground">Yours to allocate</p>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3 — Surplus Preview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">
            Your $130/month does not disappear
          </h3>
          <p className="text-sm text-muted-foreground">
            On the next screen, you will choose how to use it:
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: PiggyBank, title: "Add to HSA", desc: "Tax-free medical savings" },
              { icon: Heart, title: "Dental Coverage", desc: "Starting at $45/mo" },
              { icon: Eye, title: "Vision Coverage", desc: "Starting at $15/mo" },
              { icon: ShieldPlus, title: "Supplemental Benefits", desc: "Life, disability and more" },
            ].map((pill) => (
              <div
                key={pill.title}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors px-4 py-3 cursor-default"
              >
                <pill.icon className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-sm text-foreground">{pill.title}</p>
                  <p className="text-sm text-muted-foreground">{pill.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4 — Selected Plan Summary */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Selected Plan</span>
            <Button variant="ghost" size="sm">Change plan</Button>
          </div>
          <p className="font-semibold text-foreground mt-1">
            Blue Cross Blue Shield Silver Standard PPO
          </p>
          <div className="flex gap-6 mt-3 text-sm">
            {[
              { label: "Deductible", value: "$4,500" },
              { label: "OOP Max", value: "$8,700" },
              { label: "PCP Copay", value: "$30" },
              { label: "Network", value: "PPO" },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-medium text-foreground">{stat.value}</p>
                </div>
                {i < arr.length - 1 && <Separator orientation="vertical" className="h-8" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EnrollmentNavigation
        onBack={handleBack}
        onNext={handleNext}
        nextLabel="Allocate My Surplus →"
      />
    </EnrollmentLayout>
  );
}
