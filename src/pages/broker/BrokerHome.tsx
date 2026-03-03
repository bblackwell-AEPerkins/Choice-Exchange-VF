import { useLocation } from "react-router-dom";
import { BrokerShell } from "@/components/shells/BrokerShell";
import { PrimaryActionCards } from "@/components/broker/PrimaryActionCards";
import { WorkQueueWidget } from "@/components/broker/WorkQueueWidget";
import { GroupsSnapshotWidget } from "@/components/broker/GroupsSnapshotWidget";
import { AlertsWidget } from "@/components/broker/AlertsWidget";
import { EarningsWidget } from "@/components/broker/EarningsWidget";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

function DashboardContent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Start enrollments, manage groups, and track your earnings.
        </p>
      </div>

      <section className="mb-10">
        <PrimaryActionCards />
      </section>

      <section className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <WorkQueueWidget />
          <EarningsWidget />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <GroupsSnapshotWidget />
          <AlertsWidget />
        </div>
      </section>
    </>
  );
}

function GroupsContent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Groups
        </h1>
        <p className="text-muted-foreground">
          View and manage your employer groups.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Group Management
          </CardTitle>
          <CardDescription>Group management coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">
              You'll be able to create, edit, and manage employer groups here.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function BrokerHome() {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case "/broker/groups":
        return <GroupsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <BrokerShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </BrokerShell>
  );
}
