import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
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
  MapPin,
  Phone,
  Star,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { MemberIDCard } from "@/components/MemberIDCard";
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

  // My Providers data
  const myProviders = [
    { id: 1, name: "Dr. Sarah Chen", specialty: "Primary Care", address: "1234 Medical Center Dr, Miami, FL", phone: "(305) 555-0123", rating: 4.9, nextVisit: "Jan 5, 2025" },
    { id: 2, name: "Dr. Michael Roberts", specialty: "Cardiology", address: "5678 Heart Health Blvd, Miami, FL", phone: "(305) 555-0456", rating: 4.8, nextVisit: "Dec 28, 2024" },
    { id: 3, name: "Dr. Emily Watson", specialty: "Internal Medicine", address: "910 Wellness Way, Miami, FL", phone: "(305) 555-0789", rating: 4.7, nextVisit: null },
  ];

  // Available supplemental benefits for enrollment
  const availableBenefits = [
    { id: "dental", name: "Dental Coverage", description: "Preventive, basic & major services", monthlyPremium: 45, icon: "🦷" },
    { id: "vision", name: "Vision Coverage", description: "Eye exams, glasses & contacts", monthlyPremium: 15, icon: "👁️" },
    { id: "life", name: "Life Insurance", description: "Term life up to $100,000", monthlyPremium: 25, icon: "🛡️" },
    { id: "disability", name: "Short-Term Disability", description: "60% income replacement", monthlyPremium: 35, icon: "💼" },
    { id: "accident", name: "Accident Insurance", description: "Lump sum for injuries", monthlyPremium: 20, icon: "🏥" },
    { id: "critical", name: "Critical Illness", description: "Coverage for major diagnoses", monthlyPremium: 30, icon: "❤️" },
    { id: "hospital", name: "Hospital Indemnity", description: "Daily cash for hospital stays", monthlyPremium: 40, icon: "🏨" },
    { id: "pet", name: "Pet Insurance", description: "Coverage for your furry friends", monthlyPremium: 35, icon: "🐾" },
  ];

  const [enrolledBenefits, setEnrolledBenefits] = useState<string[]>(["dental", "vision"]);
  const monthlyBudget = 200; // Employer contribution for supplemental benefits

  const getEnrolledTotal = () => {
    return availableBenefits
      .filter(b => enrolledBenefits.includes(b.id))
      .reduce((sum, b) => sum + b.monthlyPremium, 0);
  };

  const getRemainingBudget = () => {
    return monthlyBudget - getEnrolledTotal();
  };

  const toggleBenefit = (benefitId: string) => {
    setEnrolledBenefits(prev => 
      prev.includes(benefitId) 
        ? prev.filter(id => id !== benefitId)
        : [...prev, benefitId]
    );
  };

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
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {memberData.name.split(" ")[0]}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Member ID: {memberData.memberId} • {memberData.plan}
                </p>
              </div>
              <MemberIDCard memberData={memberData} />
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

          {/* Main Dashboard Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/providers">Book New</Link>
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

            {/* My Providers Tab */}
            <TabsContent value="providers" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      My Healthcare Providers
                    </CardTitle>
                    <CardDescription>Your saved and preferred healthcare providers</CardDescription>
                  </div>
                  <Button asChild>
                    <Link to="/providers">
                      <Plus className="h-4 w-4 mr-2" />
                      Find Providers
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myProviders.map((provider) => (
                      <div 
                        key={provider.id}
                        className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Stethoscope className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{provider.name}</h3>
                              <Badge variant="secondary" className="mt-1 mb-2">{provider.specialty}</Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {provider.address}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3.5 w-3.5" />
                                <a href={`tel:${provider.phone}`} className="hover:text-primary">{provider.phone}</a>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 md:min-w-[140px]">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="font-medium">{provider.rating}</span>
                            </div>
                            {provider.nextVisit ? (
                              <div className="text-xs text-muted-foreground bg-accent/10 text-accent px-2 py-1 rounded">
                                Next: {provider.nextVisit}
                              </div>
                            ) : (
                              <Button variant="outline" size="sm" asChild>
                                <Link to="/providers">Book Visit</Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enrollment Tab - Benefit Stacking */}
            <TabsContent value="enrollment" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Available Benefits - Left Side */}
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Available Supplemental Benefits
                      </CardTitle>
                      <CardDescription>
                        Click to add benefits to your plan. Your employer provides ${monthlyBudget}/month for supplemental coverage.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {availableBenefits.map((benefit) => {
                          const isEnrolled = enrolledBenefits.includes(benefit.id);
                          const wouldExceedBudget = !isEnrolled && (getEnrolledTotal() + benefit.monthlyPremium > monthlyBudget);
                          
                          return (
                            <button
                              key={benefit.id}
                              onClick={() => toggleBenefit(benefit.id)}
                              disabled={wouldExceedBudget}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                isEnrolled 
                                  ? "border-primary bg-primary/5 shadow-md" 
                                  : wouldExceedBudget
                                    ? "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{benefit.icon}</span>
                                  <div>
                                    <h4 className="font-semibold text-foreground">{benefit.name}</h4>
                                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <span className="text-sm font-bold text-primary">${benefit.monthlyPremium}/mo</span>
                                  {isEnrolled ? (
                                    <Badge className="bg-primary text-primary-foreground text-xs">
                                      <Minus className="h-3 w-3 mr-1" /> Remove
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-xs">
                                      <Plus className="h-3 w-3 mr-1" /> Add
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* My Plan Stack - Right Side */}
                <div className="space-y-4">
                  {/* Budget Card */}
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-accent" />
                        Monthly Budget
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <div className="text-4xl font-bold text-foreground">
                          ${getRemainingBudget()}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">remaining of ${monthlyBudget}</p>
                        <Progress 
                          value={(getEnrolledTotal() / monthlyBudget) * 100} 
                          className="h-3 mt-4"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          ${getEnrolledTotal()} used • {enrolledBenefits.length} benefits enrolled
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stacked Benefits */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        My Plan Stack
                      </CardTitle>
                      <CardDescription>Your enrolled supplemental benefits</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {enrolledBenefits.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No benefits enrolled yet</p>
                          <p className="text-xs">Click on benefits to add them</p>
                        </div>
                      ) : (
                        <div className="space-y-0">
                          {availableBenefits
                            .filter(b => enrolledBenefits.includes(b.id))
                            .map((benefit, index) => (
                              <div 
                                key={benefit.id}
                                className={`relative p-3 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 
                                  ${index === 0 ? "rounded-t-lg" : ""} 
                                  ${index === enrolledBenefits.length - 1 ? "rounded-b-lg" : "border-b-0"}
                                  transform hover:scale-[1.02] transition-transform cursor-pointer`}
                                onClick={() => toggleBenefit(benefit.id)}
                                style={{ 
                                  zIndex: enrolledBenefits.length - index,
                                  marginTop: index > 0 ? "-4px" : "0"
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{benefit.icon}</span>
                                    <span className="font-medium text-sm">{benefit.name}</span>
                                  </div>
                                  <span className="text-sm font-bold text-primary">${benefit.monthlyPremium}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                      
                      {enrolledBenefits.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold">Monthly Total</span>
                            <span className="text-xl font-bold text-primary">${getEnrolledTotal()}</span>
                          </div>
                          <Button className="w-full" size="lg">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Confirm Enrollment
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Incentive Message */}
                  {getRemainingBudget() > 0 && enrolledBenefits.length > 0 && (
                    <Card className="border-accent/30 bg-accent/5">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              You have ${getRemainingBudget()} left to spend!
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Add more benefits to maximize your employer contribution.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
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
