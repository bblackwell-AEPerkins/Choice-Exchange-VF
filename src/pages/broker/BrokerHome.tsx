import { BrokerShell } from "@/components/shells/BrokerShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrokerHome() {
  return (
    <BrokerShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Enroll clients, manage groups, and track your earnings.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">New Enrollment</CardTitle>
              <CardDescription>
                Start a new ICHRA or voluntary benefits enrollment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/enroll">
                  Start enrollment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <CardTitle className="text-lg">Manage Groups</CardTitle>
              <CardDescription>
                View and manage your employer groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link to="/broker/groups">
                  View groups
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-violet-light flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-violet-500" />
              </div>
              <CardTitle className="text-lg">Earnings</CardTitle>
              <CardDescription>
                Track commissions and payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link to="/broker/reporting">
                  View reporting
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest enrollments and group updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>No recent activity yet.</p>
              <p className="text-sm mt-1">Start an enrollment to see activity here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </BrokerShell>
  );
}
