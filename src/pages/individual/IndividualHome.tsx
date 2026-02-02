import { IndividualShell } from "@/components/shells/IndividualShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CreditCard, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function IndividualHome() {
  return (
    <IndividualShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Your Coverage
          </h1>
          <p className="text-muted-foreground">
            Complete your enrollment and manage your benefits.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Complete Enrollment</CardTitle>
              <CardDescription>
                Finish selecting your health and voluntary benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/enroll">
                  Continue enrollment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                <CreditCard className="h-5 w-5 text-accent" />
              </div>
              <CardTitle className="text-lg">Benefits Wallet</CardTitle>
              <CardDescription>
                View your ICHRA allowance and spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link to="/individual/wallet">
                  View wallet
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-violet-light flex items-center justify-center mb-2">
                <Heart className="h-5 w-5 text-violet-500" />
              </div>
              <CardTitle className="text-lg">My Benefits</CardTitle>
              <CardDescription>
                Access your ID cards and plan details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link to="/individual/benefits">
                  View benefits
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status card */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Status</CardTitle>
            <CardDescription>Your current enrollment progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-amber-light flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">Not started</p>
                <p className="text-sm text-muted-foreground">
                  Begin your enrollment to select coverage
                </p>
              </div>
              <Button className="ml-auto" asChild>
                <Link to="/enroll">Start now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndividualShell>
  );
}
