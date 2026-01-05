import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  CreditCard,
  FileText,
  Calendar,
  Heart,
  Shield,
  TrendingUp,
  Bell,
  Settings,
  ChevronRight,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Pill,
  Activity,
  DollarSign,
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        navigate("/auth", { replace: true });
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        navigate("/auth", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth", { replace: true });
  };

  // Use "Brandon Goldstein" as the display name
  const memberData = {
    name: "Brandon Goldstein",
    memberId: "CHX-2024-78392",
    plan: "ICHRA Plus",
    employer: "TechCorp Inc.",
    monthlyAllowance: 800,
    usedAllowance: 523.45,
    deductible: 2500,
    usedDeductible: 1847,
    outOfPocket: 6000,
    usedOutOfPocket: 2341,
  };

  const recentClaims = [
    { id: 1, date: "Dec 15, 2024", provider: "Dr. Sarah Chen", type: "Primary Care Visit", amount: 150, status: "approved" },
    { id: 2, date: "Dec 10, 2024", provider: "CVS Pharmacy", type: "Prescription", amount: 45.99, status: "approved" },
    { id: 3, date: "Dec 5, 2024", provider: "LabCorp", type: "Blood Work", amount: 287, status: "pending" },
    { id: 4, date: "Nov 28, 2024", provider: "Urgent Care Plus", type: "Urgent Care", amount: 200, status: "approved" },
  ];

  const upcomingAppointments = [
    { id: 1, date: "Dec 28, 2024", time: "10:00 AM", provider: "Dr. Michael Roberts", type: "Cardiology Follow-up" },
    { id: 2, date: "Jan 5, 2025", time: "2:30 PM", provider: "Dr. Emily Watson", type: "Annual Physical" },
  ];

  const healthMetrics = [
    { label: "Last Checkup", value: "2 weeks ago", icon: Stethoscope, status: "good" },
    { label: "Prescriptions", value: "2 active", icon: Pill, status: "good" },
    { label: "Health Score", value: "87/100", icon: Activity, status: "good" },
    { label: "Savings YTD", value: "$1,247", icon: DollarSign, status: "great" },
  ];

  const notifications = [
    { id: 1, title: "Claim Approved", message: "Your claim for $150 has been approved", time: "2 hours ago", read: false },
    { id: 2, title: "Appointment Reminder", message: "Cardiology follow-up in 6 days", time: "1 day ago", read: false },
    { id: 3, title: "Document Ready", message: "Your EOB is ready to download", time: "3 days ago", read: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {memberData.name.split(" ")[0]}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Member ID: {memberData.memberId} • {memberData.plan}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  View ID Card
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {healthMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${
                      metric.status === "great" 
                        ? "bg-accent/10 text-accent" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      <metric.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Overview
              </TabsTrigger>
              <TabsTrigger value="benefits" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Benefits
              </TabsTrigger>
              <TabsTrigger value="claims" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Claims
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Benefits Usage */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Benefits Usage
                    </CardTitle>
                    <CardDescription>Track your healthcare spending and allowances</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* ICHRA Allowance */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Monthly ICHRA Allowance</span>
                        <span className="text-sm text-muted-foreground">
                          ${memberData.usedAllowance} / ${memberData.monthlyAllowance}
                        </span>
                      </div>
                      <Progress 
                        value={(memberData.usedAllowance / memberData.monthlyAllowance) * 100} 
                        className="h-3"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        ${(memberData.monthlyAllowance - memberData.usedAllowance).toFixed(2)} remaining this month
                      </p>
                    </div>

                    {/* Deductible */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Annual Deductible</span>
                        <span className="text-sm text-muted-foreground">
                          ${memberData.usedDeductible} / ${memberData.deductible}
                        </span>
                      </div>
                      <Progress 
                        value={(memberData.usedDeductible / memberData.deductible) * 100} 
                        className="h-3"
                      />
                      <p className="text-xs text-accent mt-1 font-medium">
                        ${memberData.deductible - memberData.usedDeductible} until deductible is met
                      </p>
                    </div>

                    {/* Out of Pocket */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Out-of-Pocket Maximum</span>
                        <span className="text-sm text-muted-foreground">
                          ${memberData.usedOutOfPocket} / ${memberData.outOfPocket}
                        </span>
                      </div>
                      <Progress 
                        value={(memberData.usedOutOfPocket / memberData.outOfPocket) * 100} 
                        className="h-3"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-3 rounded-lg border ${
                            notification.read 
                              ? "bg-background border-border" 
                              : "bg-primary/5 border-primary/20"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs text-muted-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Appointments & Recent Claims */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Appointments */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Upcoming Appointments
                      </CardTitle>
                    </div>
                    <Button variant="outline" size="sm">
                      Book New
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAppointments.map((apt) => (
                        <div 
                          key={apt.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{apt.type}</p>
                              <p className="text-sm text-muted-foreground">{apt.provider}</p>
                              <p className="text-sm text-muted-foreground">
                                {apt.date} at {apt.time}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Claims */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Recent Claims
                      </CardTitle>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentClaims.map((claim) => (
                        <div 
                          key={claim.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-3">
                            {claim.status === "approved" ? (
                              <CheckCircle2 className="h-5 w-5 text-accent" />
                            ) : (
                              <Clock className="h-5 w-5 text-amber-500" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{claim.type}</p>
                              <p className="text-xs text-muted-foreground">{claim.provider}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${claim.amount}</p>
                            <Badge 
                              variant="secondary" 
                              className={claim.status === "approved" 
                                ? "bg-accent/10 text-accent" 
                                : "bg-amber-500/10 text-amber-600"
                              }
                            >
                              {claim.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Plan Benefits</CardTitle>
                  <CardDescription>
                    {memberData.plan} through {memberData.employer}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Coverage Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Monthly Allowance</span>
                          <span className="font-medium">${memberData.monthlyAllowance}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Annual Deductible</span>
                          <span className="font-medium">${memberData.deductible}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Out-of-Pocket Max</span>
                          <span className="font-medium">${memberData.outOfPocket}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">Primary Care Copay</span>
                          <span className="font-medium">$25</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Specialist Copay</span>
                          <span className="font-medium">$50</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">What's Covered</h3>
                      <div className="space-y-2">
                        {[
                          "Preventive Care (100%)",
                          "Primary Care Visits",
                          "Specialist Visits",
                          "Prescription Drugs",
                          "Lab & Diagnostics",
                          "Mental Health Services",
                          "Telehealth Visits",
                          "Emergency Care",
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="claims">
              <Card>
                <CardHeader>
                  <CardTitle>Claims History</CardTitle>
                  <CardDescription>View and track all your healthcare claims</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentClaims.map((claim) => (
                      <div 
                        key={claim.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {claim.status === "approved" ? (
                            <CheckCircle2 className="h-6 w-6 text-accent" />
                          ) : (
                            <Clock className="h-6 w-6 text-amber-500" />
                          )}
                          <div>
                            <p className="font-medium">{claim.type}</p>
                            <p className="text-sm text-muted-foreground">{claim.provider}</p>
                            <p className="text-xs text-muted-foreground">{claim.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">${claim.amount}</p>
                          <Badge 
                            variant="secondary" 
                            className={claim.status === "approved" 
                              ? "bg-accent/10 text-accent" 
                              : "bg-amber-500/10 text-amber-600"
                            }
                          >
                            {claim.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & Forms</CardTitle>
                  <CardDescription>Access your healthcare documents and forms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: "Member ID Card", type: "PDF", date: "Dec 1, 2024" },
                      { name: "Summary of Benefits", type: "PDF", date: "Jan 1, 2024" },
                      { name: "EOB - December 2024", type: "PDF", date: "Dec 20, 2024" },
                      { name: "EOB - November 2024", type: "PDF", date: "Nov 20, 2024" },
                      { name: "1095-A Tax Form", type: "PDF", date: "Jan 15, 2024" },
                      { name: "Plan Handbook", type: "PDF", date: "Jan 1, 2024" },
                    ].map((doc, i) => (
                      <div 
                        key={i}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type} • {doc.date}</p>
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

export default MemberDashboard;
