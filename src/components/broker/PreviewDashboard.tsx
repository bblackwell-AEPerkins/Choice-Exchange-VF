import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Building2, 
  AlertTriangle, 
  Bell, 
  Calendar, 
  UserPlus,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";

// Channel 1: Payments & Commissions Summary
function PaymentsCommissionsSummary() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Payments & Commissions Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between py-2 border-b border-border/30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-sm">Paid</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">$••,•••</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-sm">Pending</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">$••,•••</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-sm">At Risk</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">$•,•••</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Channel 2: Carrier Payment Status
function CarrierPaymentStatus() {
  const carriers = [
    { name: "Carrier A", status: "Paid", statusColor: "text-emerald-500" },
    { name: "Carrier B", status: "Pending", statusColor: "text-amber-500" },
    { name: "Carrier C", status: "Requires Review", statusColor: "text-red-500" },
  ];

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Carrier Payment Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {carriers.map((carrier, index) => (
          <div 
            key={carrier.name}
            className={`flex items-center justify-between py-2 ${index < carriers.length - 1 ? 'border-b border-border/30' : ''}`}
          >
            <span className="text-sm">{carrier.name}</span>
            <span className={`text-xs font-medium ${carrier.statusColor}`}>{carrier.status}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Channel 3: Payment Blocking Items
function PaymentBlockingItems() {
  const items = [
    "Eligibility mismatch",
    "Contribution not configured",
    "Enrollment incomplete",
  ];

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Payment Blocking Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
          <div 
            key={item}
            className={`flex items-center justify-between py-2 ${index < items.length - 1 ? 'border-b border-border/30' : ''}`}
          >
            <span className="text-sm">{item}</span>
            <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-900/20">
              Action required
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Channel 4: Alerts & Exceptions
function AlertsExceptions() {
  const alerts = [
    { text: "Enrollment window closing", icon: Clock },
    { text: "Eligibility file mismatch", icon: AlertCircle },
    { text: "Missing invite codes", icon: AlertTriangle },
  ];

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Alerts & Exceptions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert, index) => (
          <div 
            key={alert.text}
            className={`flex items-center gap-2 py-2 ${index < alerts.length - 1 ? 'border-b border-border/30' : ''}`}
          >
            <alert.icon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{alert.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Channel 5: Upcoming Payments Forecast
function UpcomingPaymentsForecast() {
  const forecasts = [
    { label: "Scheduled", icon: CheckCircle2 },
    { label: "In progress", icon: Clock },
    { label: "Pending confirmation", icon: AlertCircle },
  ];

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Upcoming Payments Forecast
          </CardTitle>
          <span className="text-[10px] text-muted-foreground">Next 30 days</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {forecasts.map((item, index) => (
          <div 
            key={item.label}
            className={`flex items-center justify-between py-2 ${index < forecasts.length - 1 ? 'border-b border-border/30' : ''}`}
          >
            <div className="flex items-center gap-2">
              <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm">{item.label}</span>
            </div>
            <span className="text-sm text-muted-foreground">$••,•••</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Channel 6: Enrollment Actions (minimal)
function EnrollmentActions() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-muted-foreground" />
          Enrollment Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex-1 py-2 px-3 rounded bg-muted/50 text-center">
            <span className="text-xs text-muted-foreground">Start Enrollment</span>
          </div>
          <div className="flex-1 py-2 px-3 rounded bg-muted/50 text-center">
            <span className="text-xs text-muted-foreground">Manage Groups</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Channel 7: Performance Metrics (de-emphasized)
function PerformanceMetrics() {
  return (
    <Card className="bg-muted/30 border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-muted-foreground">•••</p>
            <p className="text-[10px] text-muted-foreground/70">Lives enrolled</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-muted-foreground">••%</p>
            <p className="text-[10px] text-muted-foreground/70">Attach rate</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-muted-foreground">$••</p>
            <p className="text-[10px] text-muted-foreground/70">Avg per life</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PreviewDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-2">
          Dashboard Preview
        </p>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Your broker dashboard organizes payments, exceptions, and enrollment status in one view.
        </p>
      </div>

      {/* Money-first: Channels 1-3 */}
      <div className="grid md:grid-cols-3 gap-4">
        <PaymentsCommissionsSummary />
        <CarrierPaymentStatus />
        <PaymentBlockingItems />
      </div>

      {/* Secondary: Channels 4-5 */}
      <div className="grid md:grid-cols-2 gap-4">
        <AlertsExceptions />
        <UpcomingPaymentsForecast />
      </div>

      {/* Tertiary: Channels 6-7 */}
      <div className="grid md:grid-cols-2 gap-4">
        <EnrollmentActions />
        <PerformanceMetrics />
      </div>
    </div>
  );
}
