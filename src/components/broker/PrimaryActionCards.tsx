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
    gradient: "from-primary/10 to-primary/5",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    id: "groups",
    title: "Manage Groups and Individuals",
    description: "View groups, eligibility, enrollment status, and issues.",
    icon: Users,
    href: "/broker/groups",
    gradient: "from-accent/10 to-accent/5",
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    id: "reporting",
    title: "Reporting and Earnings",
    description: "Track lives, penetration, and earnings by group.",
    icon: BarChart3,
    href: "/broker/reporting",
    gradient: "from-violet-500/10 to-violet-500/5",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
];

export function PrimaryActionCards() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link key={action.id} to={action.href}>
          <Card className={`h-full bg-gradient-to-br ${action.gradient} border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-200 group cursor-pointer`}>
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col h-full">
                <div className={`w-14 h-14 rounded-xl ${action.iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <action.icon className={`h-7 w-7 ${action.iconColor}`} />
                </div>
                
                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {action.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
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
