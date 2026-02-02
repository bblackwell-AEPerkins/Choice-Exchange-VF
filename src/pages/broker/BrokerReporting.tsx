import { useState } from "react";
import { BrokerShell } from "@/components/shells/BrokerShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  AlertTriangle,
  Clock,
  ExternalLink,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_REPORTING_SUMMARY,
  MOCK_GROUP_PERFORMANCE,
  MOCK_GROUP_INDIVIDUALS,
  MOCK_GROUP_COSTS,
  MOCK_GROUP_EARNINGS,
  MOCK_EXCEPTIONS,
  getExceptionSeverityColor,
  getExceptionTypeLabel,
  getStatusColor,
  type GroupPerformance,
} from "@/lib/brokerReportingData";

// Summary Tile Component
function SummaryTile({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  detail,
}: {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: typeof Users;
  detail?: string;
}) {
  const isPositive = change && change > 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    isPositive ? "text-green-600" : "text-destructive"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {change}
                </span>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
            {detail && (
              <p className="text-xs text-muted-foreground mt-1">{detail}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Earnings Breakdown Drawer
function EarningsBreakdown({
  base,
  voluntary,
  total,
}: {
  base: number;
  voluntary: number;
  total: number;
}) {
  return (
    <div className="space-y-3 mt-4 pt-4 border-t">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Base Platform Earnings</span>
        <span className="font-medium">${base.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Voluntary Earnings</span>
        <span className="font-medium">${voluntary.toLocaleString()}</span>
      </div>
      <Separator />
      <div className="flex justify-between">
        <span className="font-medium">Total Earnings</span>
        <span className="font-bold text-primary">${total.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function BrokerReporting() {
  const [timePeriod, setTimePeriod] = useState("this_month");
  const [selectedGroup, setSelectedGroup] = useState<GroupPerformance | null>(null);
  const [showEarningsBreakdown, setShowEarningsBreakdown] = useState(false);

  const summary = MOCK_REPORTING_SUMMARY;
  const groups = MOCK_GROUP_PERFORMANCE;
  const exceptions = MOCK_EXCEPTIONS;

  const selectedGroupIndividuals = selectedGroup
    ? MOCK_GROUP_INDIVIDUALS[selectedGroup.id] || []
    : [];
  const selectedGroupCosts = selectedGroup
    ? MOCK_GROUP_COSTS[selectedGroup.id]
    : null;
  const selectedGroupEarnings = selectedGroup
    ? MOCK_GROUP_EARNINGS[selectedGroup.id]
    : null;

  return (
    <BrokerShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Reporting & Earnings
            </h1>
            <p className="text-muted-foreground">
              Track lives, penetration, and earnings by group
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="this_quarter">This Quarter</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Tiles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryTile
            title="Enrolled Lives"
            value={summary.enrolledLives}
            change={summary.enrolledLivesChange}
            changeLabel="vs last period"
            icon={Users}
          />
          <SummaryTile
            title="Active Groups"
            value={summary.activeGroups}
            icon={Building2}
            detail={`${summary.openEnrollmentWindows} open enrollment windows`}
          />
          <SummaryTile
            title="Voluntary Attach Rate"
            value={`${summary.voluntaryAttachRate}%`}
            change={summary.voluntaryAttachRateChange}
            changeLabel="vs last period"
            icon={TrendingUp}
          />
          <div onClick={() => setShowEarningsBreakdown(!showEarningsBreakdown)}>
            <Card className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Earnings</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      ${summary.totalEarnings.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        +${summary.earningsChange}
                      </span>
                      <span className="text-xs text-muted-foreground">vs last period</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
                {showEarningsBreakdown && (
                  <EarningsBreakdown
                    base={summary.baseEarnings}
                    voluntary={summary.voluntaryEarnings}
                    total={summary.totalEarnings}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Group</CardTitle>
            <CardDescription>
              Click a row to drill into group details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead className="text-right">Eligible</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                  <TableHead className="text-right">Completion</TableHead>
                  <TableHead className="text-right">Avg Net Premium</TableHead>
                  <TableHead className="text-right">Attach Rate</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow
                    key={group.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedGroup(group)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{group.groupName}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            group.enrollmentWindowStatus === "open"
                              ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400"
                              : group.enrollmentWindowStatus === "upcoming"
                              ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {group.enrollmentWindowStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{group.eligibleLives}</TableCell>
                    <TableCell className="text-right">{group.enrolledLives}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          group.completionRate >= 80
                            ? "text-green-600"
                            : group.completionRate >= 50
                            ? "text-amber-600"
                            : "text-destructive"
                        )}
                      >
                        {group.completionRate.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">${group.avgNetPremium}</TableCell>
                    <TableCell className="text-right">{group.voluntaryAttachRate}%</TableCell>
                    <TableCell className="text-right font-medium">
                      ${group.earnings.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Exceptions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Exceptions & Audit
                </CardTitle>
                <CardDescription>
                  Issues that need attention to prevent churn
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {exceptions.filter((e) => e.severity === "critical").length} critical
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exceptions.map((exception) => (
                <div
                  key={exception.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    getExceptionSeverityColor(exception.severity)
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {getExceptionTypeLabel(exception.type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {exception.groupName}
                          {exception.individualName && ` • ${exception.individualName}`}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{exception.message}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {exception.daysOpen > 0 ? `${exception.daysOpen}d open` : "New"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Group Detail Modal */}
        <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {selectedGroup?.groupName}
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-2",
                    selectedGroup?.enrollmentWindowStatus === "open"
                      ? "bg-green-100 text-green-700"
                      : ""
                  )}
                >
                  {selectedGroup?.enrollmentWindowStatus}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="individuals" className="mt-4">
              <TabsList>
                <TabsTrigger value="individuals">Individuals</TabsTrigger>
                <TabsTrigger value="costs">Costs</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
              </TabsList>

              <TabsContent value="individuals" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Effective Date</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead className="text-right">Net Premium</TableHead>
                        <TableHead>Voluntary</TableHead>
                        <TableHead>Issues</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedGroupIndividuals.map((ind) => (
                        <TableRow key={ind.id}>
                          <TableCell className="font-medium">{ind.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn("text-xs", getStatusColor(ind.status))}
                            >
                              {ind.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{ind.effectiveDate || "-"}</TableCell>
                          <TableCell className="text-sm">
                            {ind.planName || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {ind.netPremium > 0 ? `$${ind.netPremium}` : "-"}
                          </TableCell>
                          <TableCell>
                            {ind.voluntaryBenefits.length > 0 ? (
                              <span className="text-xs text-muted-foreground">
                                {ind.voluntaryBenefits.join(", ")}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {ind.issues.length > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {ind.issues.length} issue{ind.issues.length > 1 ? "s" : ""}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="costs" className="mt-4">
                {selectedGroupCosts ? (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground">Total Contribution</p>
                          <p className="text-2xl font-bold">
                            ${selectedGroupCosts.totalContribution.toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground">Total Premium</p>
                          <p className="text-2xl font-bold">
                            ${selectedGroupCosts.totalPremium.toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground">
                            Avg Employee Out-of-Pocket
                          </p>
                          <p className="text-2xl font-bold">
                            ${selectedGroupCosts.avgEmployeeOutOfPocket}/mo
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Remaining Dollars Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedGroupCosts.remainingDollarsDistribution.map((item) => (
                            <div key={item.label} className="flex items-center gap-4">
                              <div className="w-24 text-sm">{item.label}</div>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                              <div className="w-16 text-right text-sm text-muted-foreground">
                                {item.count} ({item.percentage}%)
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No cost data available for this group
                  </p>
                )}
              </TabsContent>

              <TabsContent value="earnings" className="mt-4">
                {selectedGroupEarnings ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Base Earnings</span>
                            <span className="font-medium">
                              ${selectedGroupEarnings.baseEarnings.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Voluntary Earnings</span>
                            <span className="font-medium">
                              ${selectedGroupEarnings.voluntaryEarnings.toLocaleString()}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium">Total Earnings</span>
                            <span className="font-bold text-primary text-lg">
                              ${selectedGroupEarnings.totalEarnings.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lives Enrolled</span>
                            <span className="font-medium">
                              {selectedGroupEarnings.livesEnrolled}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Per Life Average</span>
                            <span className="font-medium">
                              ${selectedGroupEarnings.perLifeAverage}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No earnings data available for this group
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </BrokerShell>
  );
}
