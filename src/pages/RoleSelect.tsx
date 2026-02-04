import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Building2, User, ArrowRight, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoleStore, UserRole } from "@/stores/roleStore";
import { SystemProgressionSpine } from "@/components/SystemProgressionSpine";
import { RotatingMicrocopy } from "@/components/RotatingMicrocopy";

const roles = [
  {
    id: "broker" as UserRole,
    title: "Broker",
    description: "Start enrollments, set contributions, attach voluntary benefits, track earnings.",
    icon: Briefcase,
    href: "/broker",
    primary: true,
  },
  {
    id: "employer" as UserRole,
    title: "Employer",
    description: "Control offerings, set contributions, launch enrollment, view spend reporting.",
    icon: Building2,
    href: "/employer",
    primary: false,
  },
  {
    id: "individual" as UserRole,
    title: "Individual",
    description: "Enter your invite code, pick coverage, activate your wallet and card.",
    icon: User,
    href: "/individual",
    primary: false,
  },
];

export default function RoleSelect() {
  const navigate = useNavigate();
  const setRole = useRoleStore((state) => state.setRole);
  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (role: UserRole, href: string) => {
    setRole(role);
    navigate(href);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    
    setIsSubmitting(true);
    setRole("individual");
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    navigate("/individual/intake", { state: { inviteCode } });
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold text-foreground">Choice Exchange</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <div className="text-center px-4 pt-12 pb-4 md:pt-16 md:pb-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2">
          ICHRA enrollment + voluntary benefits
        </h1>
        <p className="text-sm text-muted-foreground/70 mb-1">
          Secure platform entry
        </p>
      </div>

      {/* Progression spine */}
      <div className="px-4 pb-8 md:pb-10">
        <SystemProgressionSpine />
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center px-4 pb-10 md:pb-14">
        <div className="w-full max-w-md">
          {/* Role tiles with staggered reveal */}
          <div className="space-y-2.5 mb-6">
            {roles.map((role, index) => (
              <div 
                key={role.id}
                className={`animate-card-reveal animate-card-reveal-${index + 1}`}
              >
                <button
                  onClick={() => handleRoleSelect(role.id, role.href)}
                  className={`group w-full rounded-lg border bg-card text-left flex items-center gap-3.5 p-4 transition-all duration-200 ${
                    role.primary
                      ? "border-border shadow-md hover:shadow-lg hover:border-primary/30"
                      : "border-border/50 shadow-sm hover:shadow-md hover:border-border"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    role.primary
                      ? "bg-primary/10 group-hover:bg-primary/15"
                      : "bg-muted group-hover:bg-muted/80"
                  }`}>
                    <role.icon className={`h-5 w-5 ${
                      role.primary ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="font-medium text-foreground text-base">
                      {role.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-snug">
                      {role.description}
                    </p>
                  </div>
                  
                  <ArrowRight className={`h-4 w-4 transition-all shrink-0 ${
                    role.primary
                      ? "text-primary/60 group-hover:text-primary group-hover:translate-x-0.5"
                      : "text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5"
                  }`} />
                </button>

                {/* Invite code fast lane for Individual */}
                {role.id === "individual" && (
                  <div className="mt-1.5 ml-14">
                    {!showInviteInput ? (
                      <button
                        onClick={() => setShowInviteInput(true)}
                        className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                      >
                        Have an invite code?
                      </button>
                    ) : (
                      <form onSubmit={handleInviteSubmit} className="flex items-center gap-2 max-w-xs">
                        <Input
                          type="text"
                          placeholder="Enter code"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                          className="h-8 text-xs uppercase tracking-wider"
                          autoFocus
                        />
                        <Button 
                          type="submit" 
                          size="sm" 
                          className="h-8 px-3 text-xs"
                          disabled={!inviteCode.trim() || isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Go"
                          )}
                        </Button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Rotating microcopy */}
          <RotatingMicrocopy />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-4 bg-card/60">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground/70">
          <p>© 2024 Choice Exchange</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
