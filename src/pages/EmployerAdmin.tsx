import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Settings,
  Download,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  PieChart,
  BarChart3,
  Calendar,
  Mail,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const EmployerAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/employer");
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/employer");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const companyData = {
    name: "TechCorp Inc.",
    employeeCount: 247,
    activeEnrollments: 231,
    pendingEnrollments: 12,
    monthlyBudget: 197600,
    usedBudget: 168520,
    avgAllowance: 800,
    planTypes: {
      ichra: 156,
      group: 75,
      individual: 16,
    },
  };

  const recentActivity = [
    { id: 1, action: "New enrollment", employee: "John Smith", time: "2 hours ago", type: "ichra" },
    { id: 2, action: "Plan change", employee: "Maria Garcia", time: "5 hours ago", type: "group" },
    { id: 3, action: "Allowance updated", employee: "David Chen", time: "1 day ago", type: "ichra" },
    { id: 4, action: "Dependent added", employee: "Sarah Johnson", time: "2 days ago", type: "ichra" },
  ];

  const employees = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@techcorp.com", plan: "ICHRA Plus", allowance: 800, status: "active", enrolled: "Jan 2024" },
    { id: 2, name: "John Smith", email: "john.s@techcorp.com", plan: "ICHRA Flex", allowance: 600, status: "active", enrolled: "Dec 2024" },
    { id: 3, name: "Maria Garcia", email: "maria.g@techcorp.com", plan: "Group Choice", allowance: null, status: "active", enrolled: "Mar 2024" },
    { id: 4, name: "David Chen", email: "david.c@techcorp.com", plan: "ICHRA Plus", allowance: 800, status: "pending", enrolled: "Pending" },
    { id: 5, name: "Emily Watson", email: "emily.w@techcorp.com", plan: "Group Basic", allowance: null, status: "active", enrolled: "Jun 2024" },
  ];

  const monthlyStats = [
    { month: "Jul", spending: 142000 },
    { month: "Aug", spending: 148000 },
    { month: "Sep", spending: 155000 },
    { month: "Oct", spending: 162000 },
    { month: "Nov", spending: 165000 },
    { month: "Dec", spending: 168520 },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Admin Header */}
          <div className="py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{companyData.name}</h1>
                  <p className="text-muted-foreground">
                    {companyData.employeeCount} employees • Employer Admin Portal
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Employees</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{companyData.employeeCount}</p>
                    <div className="flex items-center gap-1 mt-2 text-accent text-sm">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>+12 this month</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Enrollments</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{companyData.activeEnrollments}</p>
                    <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
                      <span>{companyData.pendingEnrollments} pending</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-accent/10 text-accent">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Budget</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      ${(companyData.monthlyBudget / 1000).toFixed(0)}k
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        ${((companyData.monthlyBudget - companyData.usedBudget) / 1000).toFixed(0)}k remaining
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-violet-500/10 text-violet-600">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Allowance</p>
                    <p className="text-3xl font-bold text-foreground mt-1">${companyData.avgAllowance}</p>
                    <div className="flex items-center gap-1 mt-2 text-accent text-sm">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>+$50 from last year</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-amber-500/10 text-amber-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Overview
              </TabsTrigger>
              <TabsTrigger value="employees" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Employees
              </TabsTrigger>
              <TabsTrigger value="plans" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Plans
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Billing
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Spending Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Monthly Healthcare Spending
                    </CardTitle>
                    <CardDescription>Last 6 months spending trend</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end gap-4 pt-4">
                      {monthlyStats.map((stat, i) => {
                        const maxSpending = Math.max(...monthlyStats.map(s => s.spending));
                        const heightPercent = (stat.spending / maxSpending) * 100;
                        return (
                          <div key={stat.month} className="flex-1 flex flex-col items-center gap-2 h-full">
                            <div className="flex-1 w-full flex items-end">
                              <div 
                                className="w-full bg-primary rounded-t-lg transition-all duration-500"
                                style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{stat.month}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Total YTD Spending</p>
                        <p className="text-2xl font-bold">$940,520</p>
                      </div>
                      <div className="flex items-center gap-2 text-accent">
                        <TrendingDown className="h-5 w-5" />
                        <span className="font-medium">12% under budget</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Plan Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Plan Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">ICHRA Plans</span>
                          <span className="text-sm text-muted-foreground">
                            {companyData.planTypes.ichra} employees
                          </span>
                        </div>
                        <Progress 
                          value={(companyData.planTypes.ichra / companyData.employeeCount) * 100} 
                          className="h-3"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Group Plans</span>
                          <span className="text-sm text-muted-foreground">
                            {companyData.planTypes.group} employees
                          </span>
                        </div>
                        <Progress 
                          value={(companyData.planTypes.group / companyData.employeeCount) * 100} 
                          className="h-3 [&>div]:bg-accent"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Individual</span>
                          <span className="text-sm text-muted-foreground">
                            {companyData.planTypes.individual} employees
                          </span>
                        </div>
                        <Progress 
                          value={(companyData.planTypes.individual / companyData.employeeCount) * 100} 
                          className="h-3 [&>div]:bg-violet-500"
                        />
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                      <h4 className="font-medium mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Plan
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Allowances
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest enrollment and plan changes</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div 
                        key={activity.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.employee}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {activity.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employees" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Employee Management</CardTitle>
                      <CardDescription>Manage employee enrollments and benefits</CardDescription>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search employees..." className="pl-9 w-64" />
                      </div>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Employee
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Employee</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Plan</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Allowance</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Enrolled</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee) => (
                          <tr key={employee.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary">
                                    {employee.name.split(" ").map(n => n[0]).join("")}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium">{employee.name}</p>
                                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {employee.plan}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              {employee.allowance ? `$${employee.allowance}/mo` : "—"}
                            </td>
                            <td className="py-4 px-4">
                              <Badge 
                                variant="secondary" 
                                className={employee.status === "active" 
                                  ? "bg-accent/10 text-accent" 
                                  : "bg-amber-500/10 text-amber-600"
                                }
                              >
                                {employee.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-muted-foreground">
                              {employee.enrolled}
                            </td>
                            <td className="py-4 px-4">
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plans" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge className="w-fit bg-primary/10 text-primary border-primary/20 mb-2">
                      ICHRA
                    </Badge>
                    <CardTitle>ICHRA Plans</CardTitle>
                    <CardDescription>Individual Coverage Health Reimbursement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold">{companyData.planTypes.ichra}</div>
                      <p className="text-muted-foreground">employees enrolled</p>
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-2">Allowance Range</p>
                        <p className="font-semibold">$400 - $1,200/month</p>
                      </div>
                      <Button variant="outline" className="w-full">
                        Manage ICHRA Plans
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge className="w-fit bg-accent/10 text-accent border-accent/20 mb-2">
                      Group
                    </Badge>
                    <CardTitle>Group Plans</CardTitle>
                    <CardDescription>Traditional group health coverage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold">{companyData.planTypes.group}</div>
                      <p className="text-muted-foreground">employees enrolled</p>
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-2">Plan Options</p>
                        <p className="font-semibold">3 tiers available</p>
                      </div>
                      <Button variant="outline" className="w-full">
                        Manage Group Plans
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge className="w-fit bg-violet-500/10 text-violet-600 border-violet-500/20 mb-2">
                      Individual
                    </Badge>
                    <CardTitle>Individual Plans</CardTitle>
                    <CardDescription>Self-selected individual coverage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold">{companyData.planTypes.individual}</div>
                      <p className="text-muted-foreground">employees enrolled</p>
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-2">Status</p>
                        <p className="font-semibold">Employee-managed</p>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Payments</CardTitle>
                  <CardDescription>Manage your organization's healthcare payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Billing Dashboard Coming Soon</h3>
                    <p className="text-muted-foreground">
                      View invoices, payment history, and manage billing preferences
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports & Analytics</CardTitle>
                  <CardDescription>Download detailed reports on healthcare utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: "Monthly Utilization Report", type: "PDF", date: "Dec 2024" },
                      { name: "Employee Enrollment Summary", type: "Excel", date: "Q4 2024" },
                      { name: "Cost Analysis Report", type: "PDF", date: "Dec 2024" },
                      { name: "Compliance Report", type: "PDF", date: "2024" },
                    ].map((report, i) => (
                      <div 
                        key={i}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{report.name}</p>
                            <p className="text-xs text-muted-foreground">{report.type} • {report.date}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmployerAdmin;
