import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoleStore, UserRole } from "@/stores/roleStore";

const roles = [
  {
    id: "broker" as UserRole,
    title: "Broker",
    description: "Enroll individuals into ICHRA, add voluntary benefits, track earnings.",
    icon: Briefcase,
    href: "/broker/intake",
  },
  {
    id: "employer" as UserRole,
    title: "Employer",
    description: "Control what employees see, set contributions, view cost reporting.",
    icon: Building2,
    href: "/employer/intake",
  },
  {
    id: "individual" as UserRole,
    title: "Individual",
    description: "Join your employer's plan, pick coverage, use your benefits card.",
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
      {/* Minimal header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">Choice Exchange</span>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </header>

      {/* Main content - centered role tiles */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome
            </h1>
            <p className="text-muted-foreground">
              Select how you'll be using the platform
            </p>
          </div>

          <div className="grid gap-4 md:gap-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id, role.href)}
                className="group w-full p-6 md:p-8 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-200 text-left flex items-center gap-6"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <role.icon className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-1">
                    {role.title}
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {role.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Choice Exchange. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
