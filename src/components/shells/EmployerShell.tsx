import { ReactNode } from "react";
import { Settings, DollarSign, BarChart3 } from "lucide-react";
import { AppShell } from "./AppShell";

const navItems = [
  { label: "Configuration", href: "/employer/home", icon: Settings },
  { label: "Contributions", href: "/employer/contributions", icon: DollarSign },
  { label: "Reporting", href: "/employer/reporting", icon: BarChart3 },
];

export function EmployerShell({ children }: { children: ReactNode }) {
  return (
    <AppShell label="Employer Admin" homeHref="/employer/home" navItems={navItems}>
      {children}
    </AppShell>
  );
}
