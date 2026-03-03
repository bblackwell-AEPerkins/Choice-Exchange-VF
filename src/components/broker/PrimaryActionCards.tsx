import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, UserPlus, Users, BarChart3 } from "lucide-react";

const actions = [
  {
    id: "enroll",
    title: "Start New ICHRA Enrollment",
    description: "Enroll an individual, set contribution, add voluntary benefits.",
    icon: UserPlus,
    href: "/broker/enroll/new",
    cardClass: "gradient-primary text-white shadow-glow-sm hover:shadow-glow-md",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    textColor: "text-white",
    descColor: "text-white/80",
    arrowColor: "text-white/60 group-hover:text-white",
  },
  {
    id: "groups",
    title: "Manage Groups and Individuals",
    description: "View groups, eligibility, enrollment status, and issues.",
    icon: Users,
    href: "/broker/groups",
    cardClass: "surface-steel hover:border-primary/30",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    textColor: "text-foreground",
    descColor: "text-muted-foreground",
    arrowColor: "text-muted-foreground group-hover:text-primary",
  },
  {
    id: "reporting",
    title: "Reporting and Earnings",
    description: "Track lives, penetration, and earnings by group.",
    icon: BarChart3,
    href: "/broker/reporting",
    cardClass: "surface-steel hover:border-primary/30",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    textColor: "text-foreground",
    descColor: "text-muted-foreground",
    arrowColor: "text-muted-foreground group-hover:text-primary",
  },
];

export function PrimaryActionCards() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link key={action.id} to={action.href}>
          <Card className={`h-full border-border/50 transition-all duration-200 group cursor-pointer hover:-translate-y-0.5 hover:shadow-card-md ${action.cardClass}`}>
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col h-full">
                <div className={`w-14 h-14 rounded-xl ${action.iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <action.icon className={`h-7 w-7 ${action.iconColor}`} />
                </div>
                
                <h3 className={`font-semibold text-lg mb-2 group-hover:opacity-90 transition-colors ${action.textColor}`}>
                  {action.title}
                </h3>
                
                <p className={`text-sm mb-4 flex-1 ${action.descColor}`}>
                  {action.description}
                </p>
                
                <div className={`flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity ${action.arrowColor}`}>
                  <span>Get started</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
