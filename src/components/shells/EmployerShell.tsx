import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRoleStore } from "@/stores/roleStore";
import { LogOut, Settings, DollarSign, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployerShellProps {
  children: ReactNode;
}

const navItems = [
  { label: "Configuration", href: "/employer/home", icon: Settings },
  { label: "Contributions", href: "/employer/contributions", icon: DollarSign },
  { label: "Reporting", href: "/employer/reporting", icon: BarChart3 },
];

export function EmployerShell({ children }: EmployerShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearSession } = useRoleStore();

  const handleSignOut = () => {
    clearSession();
    navigate("/select-role");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/employer/home" className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">Choice Exchange</span>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Employer Admin
              </span>
            </Link>

            {/* Primary nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden border-t border-border px-4 py-2 flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
