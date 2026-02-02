import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Building2, User, ArrowRight, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRoleStore, UserRole } from "@/stores/roleStore";

const roles = [
  {
    id: "broker" as UserRole,
    title: "Broker",
    description: "Start enrollments, set contributions, attach voluntary benefits, track earnings.",
    icon: Briefcase,
    href: "/broker/intake",
    primary: true,
  },
  {
    id: "employer" as UserRole,
    title: "Employer",
    description: "Control offerings, set contributions, launch enrollment, view spend reporting.",
    icon: Building2,
    href: "/employer/intake",
    primary: false,
  },
  {
    id: "individual" as UserRole,
    title: "Individual",
    description: "Enter your invite code, pick coverage, activate your wallet and card.",
    icon: User,
    href: "/individual/intake",
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
    
    // Simulate validation
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    navigate("/individual/intake", { state: { inviteCode } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Power unlock logo */}
            <div className="relative group">
              {/* Outer glow ring */}
              <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-primary opacity-75 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500" />
              {/* Inner container */}
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                {/* Shield with spark effect */}
                <Shield className="h-5 w-5 text-primary-foreground drop-shadow-sm" />
                {/* Corner spark */}
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Choice Exchange</span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/70 -mt-0.5">Powered Benefits</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-2xl">
          {/* Hero text */}
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 tracking-tight">
              ICHRA enrollment plus voluntary benefits
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Enroll faster, manage defined contributions, activate a benefits card, attach voluntary benefits.
            </p>
          </div>

          {/* Role tiles */}
          <div className="space-y-3 mb-6">
            {roles.map((role) => (
              <div key={role.id}>
                <button
                  onClick={() => handleRoleSelect(role.id, role.href)}
                  className={`group w-full rounded-xl border bg-card hover:bg-card/80 hover:border-primary/50 hover:shadow-md transition-all duration-200 text-left flex items-center gap-4 ${
                    role.primary 
                      ? "p-5 md:p-6 border-primary/30" 
                      : "p-4 md:p-5 border-border"
                  }`}
                >
                  <div className={`rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors ${
                    role.primary ? "w-12 h-12 md:w-14 md:h-14" : "w-11 h-11 md:w-12 md:h-12"
                  }`}>
                    <role.icon className={`text-primary ${role.primary ? "h-6 w-6 md:h-7 md:w-7" : "h-5 w-5 md:h-6 md:w-6"}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className={`font-semibold text-foreground ${role.primary ? "text-lg md:text-xl" : "text-base md:text-lg"}`}>
                        {role.title}
                      </h2>
                      {role.primary && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          Primary workflow
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {role.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                    <span className="text-sm font-medium hidden sm:inline">Continue</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* Invite code fast lane for Individual */}
                {role.id === "individual" && (
                  <div className="mt-2 ml-16 md:ml-[72px]">
                    {!showInviteInput ? (
                      <button
                        onClick={() => setShowInviteInput(true)}
                        className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
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
                          className="h-9 text-sm uppercase tracking-wider"
                          autoFocus
                        />
                        <Button 
                          type="submit" 
                          size="sm" 
                          disabled={!inviteCode.trim() || isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
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

          {/* Trust line */}
          <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border/50">
            ACA compliant workflows · Secure payments · Audit-friendly reporting
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-5 bg-card/30">
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
