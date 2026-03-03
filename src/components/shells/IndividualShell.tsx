import { ReactNode } from "react";
import { ClipboardList, Wallet, Heart } from "lucide-react";
import { AppShell } from "./AppShell";

const navItems = [
  { label: "Enrollment", href: "/individual/home", icon: ClipboardList },
  { label: "Wallet", href: "/individual/wallet", icon: Wallet },
  { label: "Benefits", href: "/individual/benefits", icon: Heart },
];

export function IndividualShell({ children }: { children: ReactNode }) {
  return (
    <AppShell label="Your Coverage" homeHref="/individual/home" navItems={navItems}>
      {children}
    </AppShell>
  );
}
