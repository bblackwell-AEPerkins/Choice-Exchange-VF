import { ReactNode } from "react";
import { UserPlus, Users, BarChart3 } from "lucide-react";
import { AppShell } from "./AppShell";

const navItems = [
  { label: "Enroll", href: "/broker/home", icon: UserPlus },
  { label: "Groups", href: "/broker/groups", icon: Users },
  { label: "Reporting", href: "/broker/reporting", icon: BarChart3 },
];

export function BrokerShell({ children }: { children: ReactNode }) {
  return (
    <AppShell label="Broker Console" homeHref="/broker/home" navItems={navItems}>
      {children}
    </AppShell>
  );
}
