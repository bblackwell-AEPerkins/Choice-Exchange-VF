import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info, ArrowRight } from "lucide-react";
import {
  MOCK_BROKER_ALERTS,
  getAlertSeverityColor,
  type BrokerAlert,
  type AlertSeverity,
} from "@/lib/brokerMockData";

export function AlertsWidget() {
  const criticalCount = MOCK_BROKER_ALERTS.filter(a => a.severity === "critical").length;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Alerts & Exceptions
          </CardTitle>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {criticalCount} critical
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {MOCK_BROKER_ALERTS.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No alerts at this time
          </p>
        ) : (
          MOCK_BROKER_ALERTS.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function AlertRow({ alert }: { alert: BrokerAlert }) {
  const Icon = getAlertIcon(alert.severity);
  
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)} cursor-pointer hover:opacity-90 transition-opacity`}
    >
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {alert.message}
        </p>
        {alert.groupName && (
          <p className="text-xs opacity-75 mt-0.5">
            {alert.groupName}
            {alert.individualName && ` • ${alert.individualName}`}
          </p>
        )}
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 opacity-50" />
    </div>
  );
}

function getAlertIcon(severity: AlertSeverity) {
  switch (severity) {
    case "critical":
      return AlertCircle;
    case "warning":
      return AlertTriangle;
    case "info":
      return Info;
    default:
      return Info;
  }
}
