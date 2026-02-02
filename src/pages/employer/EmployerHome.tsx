import { EmployerShell } from "@/components/shells/EmployerShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, DollarSign, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmployerHome() {
  return (
    <EmployerShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Employer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Configure benefits, set contributions, and view cost reporting.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Plan Configuration</CardTitle>
              <CardDescription>
                Control what benefits employees can see and select
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/employer/home">
                  Configure plans
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <CardTitle className="text-lg">Contributions</CardTitle>
              <CardDescription>
                Set and manage employer contribution amounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link to="/employer/contributions">
                  Manage contributions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-violet-light flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-violet-500" />
              </div>
              <CardTitle className="text-lg">Employee Status</CardTitle>
              <CardDescription>
                View enrollment status across your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link to="/employer/reporting">
                  View status
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Overview</CardTitle>
            <CardDescription>Current enrollment period status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center py-6">
              <div>
                <p className="text-3xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Enrolled</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Not Started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployerShell>
  );
}
