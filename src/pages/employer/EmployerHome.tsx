import { useLocation } from "react-router-dom";
import { EmployerShell } from "@/components/shells/EmployerShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Mail,
  UserPlus,
  BarChart3,
  Pencil
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for employer dashboard
const stats = {
  totalEmployees: 48,
  enrolled: 32,
  pending: 10,
  notStarted: 6,
  monthlyContribution: 450,
  totalMonthlySpend: 14400,
  enrollmentDeadline: "Feb 15, 2026",
  daysRemaining: 13,
};

const enrollmentProgress = Math.round((stats.enrolled / stats.totalEmployees) * 100);

const employeeStatus = [
  { id: 1, name: "Michael Chen", department: "Engineering", status: "enrolled", plan: "Gold PPO" },
  { id: 2, name: "Sarah Johnson", department: "Marketing", status: "pending", plan: null },
  { id: 3, name: "David Kim", department: "Sales", status: "enrolled", plan: "Silver HMO" },
  { id: 4, name: "Emily Davis", department: "HR", status: "not_started", plan: null },
  { id: 5, name: "James Wilson", department: "Engineering", status: "pending", plan: null },
];

const contributionTiers = [
  { tier: "Employee Only", amount: 350, count: 18 },
  { tier: "Employee + Spouse", amount: 550, count: 8 },
  { tier: "Employee + Family", amount: 750, count: 6 },
];

function ConfigurationContent() {
  return (
    <>
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Benefits Administration
          </h1>
          <p className="text-muted-foreground">
            Manage employee benefits, contributions, and enrollment.
          </p>
        </div>
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 md:min-w-[280px]">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Open Enrollment Ends</p>
                <p className="text-lg font-bold text-primary">{stats.enrollmentDeadline}</p>
              </div>
              <Badge variant="outline" className="ml-auto">
                {stats.daysRemaining} days left
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Progress */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Enrollment Progress</CardTitle>
            <span className="text-2xl font-bold text-primary">{enrollmentProgress}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={enrollmentProgress} className="h-3 mb-4" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-accent/10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span className="text-2xl font-bold text-foreground">{stats.enrolled}</span>
              </div>
              <p className="text-xs text-muted-foreground">Enrolled</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-light">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-2xl font-bold text-foreground">{stats.pending}</span>
              </div>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold text-foreground">{stats.notStarted}</span>
              </div>
              <p className="text-xs text-muted-foreground">Not Started</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Send Reminders</h3>
                <p className="text-sm text-muted-foreground">{stats.notStarted + stats.pending} employees pending</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardContent className="pt-6">
            <Link to="/employer/contributions" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Adjust Contributions</h3>
                <p className="text-sm text-muted-foreground">${stats.monthlyContribution}/mo per employee</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-light flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                <UserPlus className="h-6 w-6 text-violet-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Invite Employees</h3>
                <p className="text-sm text-muted-foreground">Add new team members</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contribution Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Monthly Cost Overview
            </CardTitle>
            <CardDescription>Contribution breakdown by tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contributionTiers.map((tier) => (
                <div key={tier.tier} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{tier.tier}</p>
                    <p className="text-sm text-muted-foreground">{tier.count} employees</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${tier.amount}/mo</p>
                    <p className="text-xs text-muted-foreground">${tier.amount * tier.count}/mo total</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="font-semibold text-foreground">Total Monthly Spend</span>
                <span className="text-xl font-bold text-primary">${stats.totalMonthlySpend.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Employee Status</CardTitle>
                <CardDescription>Recent enrollment activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/employer/reporting">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employeeStatus.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.department}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      employee.status === 'enrolled' ? 'default' :
                      employee.status === 'pending' ? 'secondary' : 'outline'
                    }
                    className={
                      employee.status === 'enrolled' ? 'bg-accent text-accent-foreground' : ''
                    }
                  >
                    {employee.status === 'enrolled' ? employee.plan :
                     employee.status === 'pending' ? 'In Progress' : 'Not Started'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ContributionsContent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Contribution Settings
        </h1>
        <p className="text-muted-foreground">
          Configure monthly employer contributions by coverage tier.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {contributionTiers.map((tier) => (
          <Card key={tier.tier}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{tier.tier}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">${tier.amount}</div>
              <p className="text-sm text-muted-foreground mb-3">per month</p>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Employees</span>
                  <span className="font-medium text-foreground">{tier.count}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Monthly total</span>
                  <span className="font-medium text-foreground">${(tier.amount * tier.count).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Total Monthly Spend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">${stats.totalMonthlySpend.toLocaleString()}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Across {stats.totalEmployees} employees in {contributionTiers.length} tiers
          </p>
        </CardContent>
      </Card>
    </>
  );
}

function ReportingContent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Reporting
        </h1>
        <p className="text-muted-foreground">
          View enrollment analytics and compliance reports.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Enrollment Reports
          </CardTitle>
          <CardDescription>Detailed enrollment reporting coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">
              Enrollment analytics, cost trends, and compliance reports will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function EmployerHome() {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case "/employer/contributions":
        return <ContributionsContent />;
      case "/employer/reporting":
        return <ReportingContent />;
      default:
        return <ConfigurationContent />;
    }
  };

  return (
    <EmployerShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </EmployerShell>
  );
}
