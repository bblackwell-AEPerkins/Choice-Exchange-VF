import { BrokerShell } from "@/components/shells/BrokerShell";
import { PrimaryActionCards } from "@/components/broker/PrimaryActionCards";
import { WorkQueueWidget } from "@/components/broker/WorkQueueWidget";
import { GroupsSnapshotWidget } from "@/components/broker/GroupsSnapshotWidget";
import { AlertsWidget } from "@/components/broker/AlertsWidget";
import { EarningsWidget } from "@/components/broker/EarningsWidget";

export default function BrokerHome() {
  return (
    <BrokerShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Start enrollments, manage groups, and track your earnings.
          </p>
        </div>

        {/* Primary Actions - Top Area */}
        <section className="mb-10">
          <PrimaryActionCards />
        </section>

        {/* Secondary Area - Informational Widgets */}
        <section className="space-y-6">
          {/* Row 1: Work Queue and Earnings side by side */}
          <div className="grid lg:grid-cols-2 gap-6">
            <WorkQueueWidget />
            <EarningsWidget />
          </div>

          {/* Row 2: Groups Snapshot and Alerts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <GroupsSnapshotWidget />
            <AlertsWidget />
          </div>
        </section>
      </div>
    </BrokerShell>
  );
}
