import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Building2, User, ArrowRight, Shield, Heart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoleStore, UserRole } from "@/stores/roleStore";

const roles = [
  {
    id: "broker" as UserRole,
    title: "Broker",
    description: "Enroll clients, manage groups, track commissions",
    icon: Briefcase,
    href: "/broker/intake",
  },
  {
    id: "employer" as UserRole,
    title: "Employer",
    description: "Configure benefits, set contributions, manage enrollment",
    icon: Building2,
    href: "/employer/intake",
  },
  {
    id: "individual" as UserRole,
    title: "Employee",
    description: "Enroll in coverage, access your benefits",
    icon: User,
    href: "/individual/intake",
  },
];

export default function RoleSelect() {
  const navigate = useNavigate();
  const setRole = useRoleStore((state) => state.setRole);

  const handleRoleSelect = (role: UserRole, href: string) => {
    setRole(role);
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">Choice Exchange</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-3xl">
          {/* Hero text */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="h-3.5 w-3.5" />
              ICHRA + Voluntary Benefits
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Benefits enrollment,{" "}
              <span className="text-gradient-primary">simplified</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              The modern platform for ICHRA administration and voluntary benefits. 
              Select your role to get started.
            </p>
          </div>

          {/* Role tiles */}
          <div className="grid gap-3 md:gap-4 mb-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id, role.href)}
                className="group w-full p-5 md:p-6 rounded-xl border border-border bg-card hover:bg-card/80 hover:border-primary/50 hover:shadow-lg transition-all duration-200 text-left flex items-center gap-5"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                  <role.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold text-foreground mb-0.5">
                    {role.title}
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {role.description}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          {/* Value props */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50">
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <p className="text-sm font-medium text-foreground">Tax-Free</p>
              <p className="text-xs text-muted-foreground">ICHRA contributions</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Choice</p>
              <p className="text-xs text-muted-foreground">Pick your own plan</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-violet-light flex items-center justify-center mx-auto mb-2">
                <Shield className="h-5 w-5 text-violet-600" />
              </div>
              <p className="text-sm font-medium text-foreground">Compliant</p>
              <p className="text-xs text-muted-foreground">ACA & ERISA ready</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 Choice Exchange. All rights reserved.</p>
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
