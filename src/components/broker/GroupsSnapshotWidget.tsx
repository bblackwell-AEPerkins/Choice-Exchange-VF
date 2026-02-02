import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { MOCK_BROKER_GROUPS, type BrokerGroup } from "@/lib/brokerMockData";

export function GroupsSnapshotWidget() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            Groups Snapshot
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/broker/groups">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium text-muted-foreground">Group</th>
                <th className="text-center py-2 font-medium text-muted-foreground">Eligible</th>
                <th className="text-center py-2 font-medium text-muted-foreground">Enrolled</th>
                <th className="text-center py-2 font-medium text-muted-foreground">Window</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Activity</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_BROKER_GROUPS.slice(0, 4).map((group) => (
                <GroupRow key={group.id} group={group} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function GroupRow({ group }: { group: BrokerGroup }) {
  const enrollmentPercent = Math.round((group.livesEnrolled / group.livesEligible) * 100);
  
  const windowStatusColor = {
    open: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    closed: "bg-muted text-muted-foreground",
    upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <tr className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
      <td className="py-3">
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{group.name}</span>
          <span className="text-xs text-muted-foreground">{group.sizeBand} employees</span>
        </div>
      </td>
      <td className="text-center py-3">
        <span className="text-foreground">{group.livesEligible}</span>
      </td>
      <td className="py-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-foreground">{group.livesEnrolled}</span>
          <Progress value={enrollmentPercent} className="w-16 h-1.5" />
        </div>
      </td>
      <td className="text-center py-3">
        <Badge className={`text-xs ${windowStatusColor[group.enrollmentWindowStatus]}`}>
          {group.enrollmentWindowStatus === "open" ? "Open" : 
           group.enrollmentWindowStatus === "upcoming" ? "Upcoming" : "Closed"}
        </Badge>
      </td>
      <td className="text-right py-3">
        <span className="text-xs text-muted-foreground">{group.lastActivity}</span>
      </td>
    </tr>
  );
}
