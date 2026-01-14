import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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
  Search,
  X,
  Scale,
  Eye,
} from "lucide-react";
import { MemberIDCard } from "@/components/MemberIDCard";
import { useToast } from "@/hooks/use-toast";
import { ExpandableMetricCard } from "@/components/ExpandableMetricCard";
import { EventDetailModal, MemberEvent } from "@/components/EventDetailModal";

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<MemberEvent | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [memberEvents, setMemberEvents] = useState<MemberEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
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

  // Fetch member events from database
  useEffect(() => {
    const fetchMemberEvents = async () => {
      try {
        setEventsLoading(true);
        const { data, error } = await supabase
          .from("member_events")
          .select("*")
          .order("event_date", { ascending: false });

        if (error) {
          console.error("Error fetching member events:", error);
          return;
        }

        setMemberEvents(data as MemberEvent[]);
      } catch (err) {
        console.error("Error in fetchMemberEvents:", err);
      } finally {
        setEventsLoading(false);
      }
    };

    if (user) {
      fetchMemberEvents();
    }
  }, [user]);

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

  // Filter events by type from real database data - subscriptions and claims
  const subscriptionEvents = memberEvents.filter(e => e.event_type === "subscription");
  const claimEvents = memberEvents.filter(e => e.event_type === "claim");

  // Helper to get parent subscription event
  const getParentSubscription = (parentEventId?: string) => {
    if (!parentEventId) return null;
    return subscriptionEvents.find(e => e.id === parentEventId) || null;
  };

  // Handler to open claim event modal
  const handleClaimClick = (claim: MemberEvent) => {
    setSelectedEvent(claim);
    setEventModalOpen(true);
  };

  // Handler to view parent subscription from a claim
  const handleViewSubscription = (parentEventId: string) => {
    const subscription = getParentSubscription(parentEventId);
    if (subscription) {
      setSelectedEvent(subscription);
      // Modal stays open, just switches content
    }
  };

  // Legacy format for display
  const recentClaims = claimEvents.slice(0, 4).map(claim => ({
    id: claim.id,
    date: new Date(claim.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    provider: claim.provider_name || claim.facility_name || 'Unknown',
    type: claim.title,
    amount: claim.member_responsibility || 0,
    status: claim.status === 'completed' ? 'approved' : claim.status,
    eventData: claim,
  }));

  // Filter events by type from real database data
  const visitEvents = memberEvents.filter(e => e.event_type === "visit" || e.event_type === "lab_result");
  const prescriptionEvents = memberEvents.filter(e => e.event_type === "prescription");
  const appointmentEvents = memberEvents.filter(e => e.event_type === "appointment");
  
  // Upcoming appointments from real data
  const upcomingAppointments = appointmentEvents
    .filter(apt => new Date(apt.event_date) > new Date())
    .slice(0, 5)
    .map(apt => ({
      id: apt.id,
      date: new Date(apt.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date(apt.event_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      provider: apt.provider_name || "Provider",
      type: apt.appointment_type || apt.title,
      eventData: apt,
    }));

  // Convert events to history format for ExpandableMetricCards
  const convertToHistoryFormat = (events: MemberEvent[]) => {
    return events.map(event => ({
      id: event.id,
      date: new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: event.title,
      provider: event.provider_name || event.pharmacy_name || undefined,
      location: event.facility_address || event.facility_name || undefined,
      amount: event.member_responsibility || event.billed_amount || undefined,
      status: (event.status === "completed" ? "paid" : event.status) as "paid" | "pending" | "covered",
      description: event.description || undefined,
    }));
  };

  const visitHistory = convertToHistoryFormat(visitEvents);
  const prescriptionHistory = convertToHistoryFormat(prescriptionEvents);
  
  // Claims/savings history from claim events
  const savingsHistory = claimEvents.slice(0, 5).map(claim => ({
    id: claim.id,
    date: new Date(claim.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    title: claim.title,
    provider: claim.provider_name || "Provider",
    location: claim.facility_name || undefined,
    amount: claim.plan_paid || claim.member_responsibility || 0,
    status: "paid" as const,
    description: claim.description || `Processed on ${new Date(claim.event_date).toLocaleDateString()}`,
  }));

  // Health score is synthetic for now
  const healthScoreHistory = [
    { id: "h1", date: "Dec 2024", title: "Health Assessment", provider: "HealthCheck AI", location: "Online Portal", status: "paid" as const, description: "Score: 87/100 - Excellent overall health. Keep up the regular checkups and healthy habits!" },
  ];

  // Compute dynamic values for metrics
  const lastVisit = visitEvents[0];
  const lastCheckupText = lastVisit 
    ? `${Math.ceil((Date.now() - new Date(lastVisit.event_date).getTime()) / (1000 * 60 * 60 * 24))} days ago`
    : "No recent visits";
  
  const activePrescriptions = prescriptionEvents.filter(p => 
    p.refills_remaining === null || p.refills_remaining > 0
  ).length;

  const totalSavings = claimEvents.reduce((sum, c) => sum + (c.plan_paid || 0), 0);

  const healthMetrics = [
    { label: "Last Checkup", value: lastCheckupText, icon: Stethoscope, status: "good" as const, history: visitHistory, eventType: "visit" },
    { label: "Prescriptions", value: `${activePrescriptions} active`, icon: Pill, status: activePrescriptions > 0 ? "good" as const : "warning" as const, history: prescriptionHistory, eventType: "prescription" },
    { label: "Health Score", value: "87/100", icon: Activity, status: "good" as const, history: healthScoreHistory, eventType: "note" },
    { label: "Savings YTD", value: `$${totalSavings.toLocaleString()}`, icon: DollarSign, status: "great" as const, history: savingsHistory, eventType: "claim" },
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
    { id: 3, name: "Dr. James Morrison", specialty: "Orthopedics", address: "910 Bone & Joint Center, Miami, FL", phone: "(305) 555-0789", rating: 4.7, nextVisit: null },
  ];

  // Available supplemental benefits for enrollment with basic tier pricing
  const availableBenefits = [
    { id: "dental", name: "Dental Coverage", description: "Preventive, basic & major services", basicPremium: 25, monthlyPremium: 45, icon: "🦷" },
    { id: "vision", name: "Vision Coverage", description: "Eye exams, glasses & contacts", basicPremium: 10, monthlyPremium: 15, icon: "👁️" },
    { id: "life", name: "Life Insurance", description: "Term life up to $100,000", basicPremium: 15, monthlyPremium: 25, icon: "🛡️" },
    { id: "disability", name: "Short-Term Disability", description: "60% income replacement", basicPremium: 20, monthlyPremium: 35, icon: "💼" },
    { id: "accident", name: "Accident Insurance", description: "Lump sum for injuries", basicPremium: 12, monthlyPremium: 20, icon: "🏥" },
    { id: "critical", name: "Critical Illness", description: "Coverage for major diagnoses", basicPremium: 18, monthlyPremium: 30, icon: "❤️" },
    { id: "hospital", name: "Hospital Indemnity", description: "Daily cash for hospital stays", basicPremium: 25, monthlyPremium: 40, icon: "🏨" },
    { id: "pet", name: "Pet Insurance", description: "Coverage for your furry friends", basicPremium: 20, monthlyPremium: 35, icon: "🐾" },
  ];

  // Track which tier is enrolled for each benefit
  const [enrolledTiers, setEnrolledTiers] = useState<Record<string, "basic" | "standard" | "premium">>({
    dental: "standard",
    vision: "standard",
  });

  const [enrolledBenefits, setEnrolledBenefits] = useState<string[]>(["dental", "vision"]);
  const [comparePlans, setComparePlans] = useState<string[]>([]);
  // Subscription care plan costs (aligned with My Providers)
  const subscriptionPlans = [
    { id: "primary", name: "Primary Care", provider: "Dr. Sarah Chen", monthlyPremium: 99 },
    { id: "cardiology", name: "Cardiology", provider: "Dr. Michael Roberts", monthlyPremium: 149 },
    { id: "orthopedics", name: "Orthopedics", provider: "Dr. James Morrison", monthlyPremium: 129 },
  ];
  
  const monthlyBudget = memberData.monthlyAllowance; // ICHRA allowance ($800/month)

  const getSubscriptionTotal = () => {
    return subscriptionPlans.reduce((sum, p) => sum + p.monthlyPremium, 0);
  };

  const getSupplementalTotal = () => {
    return availableBenefits
      .filter(b => enrolledBenefits.includes(b.id))
      .reduce((sum, b) => {
        const tier = enrolledTiers[b.id];
        if (tier === "basic") return sum + b.basicPremium;
        return sum + b.monthlyPremium; // standard or premium uses monthlyPremium
      }, 0);
  };

  const getTotalEnrolledCost = () => {
    return getSubscriptionTotal() + getSupplementalTotal();
  };

  const getRemainingBudget = () => {
    return monthlyBudget - getTotalEnrolledCost();
  };

  const addBasicBenefit = (benefitId: string) => {
    if (!enrolledBenefits.includes(benefitId)) {
      setEnrolledBenefits(prev => [...prev, benefitId]);
      setEnrolledTiers(prev => ({ ...prev, [benefitId]: "basic" }));
      toast({
        title: "Basic Plan Added",
        description: `${availableBenefits.find(b => b.id === benefitId)?.name} Basic has been added to your enrollment.`,
      });
    }
  };

  const removeBenefit = (benefitId: string) => {
    setEnrolledBenefits(prev => prev.filter(id => id !== benefitId));
    setEnrolledTiers(prev => {
      const newTiers = { ...prev };
      delete newTiers[benefitId];
      return newTiers;
    });
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

          {/* Quick Stats - Expandable Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {healthMetrics.map((metric, index) => (
              <ExpandableMetricCard
                key={index}
                label={metric.label}
                value={metric.value}
                icon={metric.icon}
                status={metric.status}
                history={metric.history}
                eventType={metric.eventType}
              />
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
                          onClick={() => handleClaimClick(claim.eventData)}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            {claim.status === "approved" ? (
                              <CheckCircle2 className="h-5 w-5 text-accent" />
                            ) : (
                              <Clock className="h-5 w-5 text-amber-500" />
                            )}
                            <div>
                              <p className="text-sm font-medium group-hover:text-primary transition-colors">{claim.type}</p>
                              <p className="text-xs text-muted-foreground">{claim.provider}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
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
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
              {/* Compare Plans Bar */}
              {comparePlans.length > 0 && (
                <Card className="border-2 border-accent bg-accent/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Scale className="h-5 w-5 text-accent" />
                        <span className="font-medium">Comparing {comparePlans.length} plan{comparePlans.length > 1 ? 's' : ''}</span>
                        <div className="flex gap-2">
                          {comparePlans.map(planId => {
                            const plan = subscriptionPlans.find(p => p.id === planId);
                            return plan ? (
                              <Badge key={planId} variant="secondary" className="flex items-center gap-1">
                                {plan.name}
                                <button onClick={() => setComparePlans(prev => prev.filter(id => id !== planId))}>
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setComparePlans([])}
                        >
                          Clear
                        </Button>
                        <Button size="sm" disabled={comparePlans.length < 2}>
                          <Scale className="h-4 w-4 mr-1" />
                          Compare Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ICHRA Individual Health Plan */}
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Individual Health Plan
                      <Badge variant="outline" className="ml-2 border-primary/50 text-primary bg-primary/10 text-xs">
                        Empowered by ICHRA
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Your major medical coverage through your employer's ICHRA benefit. This is your underlying healthcare insurance.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/ichra" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="p-5 rounded-xl border bg-card">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Plan Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                          <Shield className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg text-foreground">Blue Cross Blue Shield</h4>
                            <Badge className="bg-accent text-accent-foreground text-xs">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Silver PPO Plan</p>
                          <p className="text-xs text-muted-foreground mt-1">Policy #: BCBS-2024-789321</p>
                        </div>
                      </div>

                      {/* Plan Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Monthly Premium</p>
                          <p className="text-lg font-bold text-foreground">$485</p>
                          <p className="text-xs text-accent font-medium">ICHRA Covers $400</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Deductible</p>
                          <p className="text-lg font-bold text-foreground">$2,500</p>
                          <p className="text-xs text-muted-foreground">$1,847 used</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Out-of-Pocket Max</p>
                          <p className="text-lg font-bold text-foreground">$6,000</p>
                          <p className="text-xs text-muted-foreground">$2,341 used</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Coverage Type</p>
                          <p className="text-lg font-bold text-foreground">PPO</p>
                          <p className="text-xs text-muted-foreground">In & Out Network</p>
                        </div>
                      </div>
                    </div>

                    {/* Coverage Summary */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Primary Care: $25 copay</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Specialist: $50 copay</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>ER: $250 copay</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Rx Coverage Included</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription-Based Care Plans */}
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Subscription-Based Care Plans
                    </CardTitle>
                    <CardDescription>
                      Direct access to your provider groups with predictable monthly pricing. These complement your ICHRA health plan.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/providers" className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Find New Plans
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {/* Primary Care Plan */}
                    <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 relative group">
                      <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs">Your Provider</Badge>
                      {!comparePlans.includes("primary") && comparePlans.length < 3 && (
                        <button 
                          onClick={() => setComparePlans(prev => [...prev, "primary"])}
                          className="absolute top-2 left-2 w-6 h-6 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-primary hover:bg-primary/10"
                          title="Add to compare"
                        >
                          <Plus className="h-3 w-3 text-muted-foreground" />
                        </button>
                      )}
                      {comparePlans.includes("primary") && (
                        <button 
                          onClick={() => setComparePlans(prev => prev.filter(id => id !== "primary"))}
                          className="absolute top-2 left-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                          title="Remove from compare"
                        >
                          <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
                        </button>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Primary Care</h4>
                          <p className="text-xs text-muted-foreground">Dr. Sarah Chen</p>
                        </div>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Unlimited visits</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Same-day appointments</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> 24/7 virtual care</li>
                      </ul>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">$99/mo</span>
                        <Badge variant="outline" className="bg-primary/10 border-primary text-primary">Enrolled</Badge>
                      </div>
                    </div>

                    {/* Cardiology Plan */}
                    <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 relative group">
                      <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs">Your Provider</Badge>
                      {!comparePlans.includes("cardiology") && comparePlans.length < 3 && (
                        <button 
                          onClick={() => setComparePlans(prev => [...prev, "cardiology"])}
                          className="absolute top-2 left-2 w-6 h-6 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-primary hover:bg-primary/10"
                          title="Add to compare"
                        >
                          <Plus className="h-3 w-3 text-muted-foreground" />
                        </button>
                      )}
                      {comparePlans.includes("cardiology") && (
                        <button 
                          onClick={() => setComparePlans(prev => prev.filter(id => id !== "cardiology"))}
                          className="absolute top-2 left-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                          title="Remove from compare"
                        >
                          <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
                        </button>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                          <Heart className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Cardiology</h4>
                          <p className="text-xs text-muted-foreground">Dr. Michael Roberts</p>
                        </div>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Quarterly check-ups</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Heart monitoring</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Priority scheduling</li>
                      </ul>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">$149/mo</span>
                        <Badge variant="outline" className="bg-primary/10 border-primary text-primary">Enrolled</Badge>
                      </div>
                    </div>

                    {/* Orthopedics Plan */}
                    <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 relative group">
                      <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs">Your Provider</Badge>
                      {!comparePlans.includes("orthopedics") && comparePlans.length < 3 && (
                        <button 
                          onClick={() => setComparePlans(prev => [...prev, "orthopedics"])}
                          className="absolute top-2 left-2 w-6 h-6 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-primary hover:bg-primary/10"
                          title="Add to compare"
                        >
                          <Plus className="h-3 w-3 text-muted-foreground" />
                        </button>
                      )}
                      {comparePlans.includes("orthopedics") && (
                        <button 
                          onClick={() => setComparePlans(prev => prev.filter(id => id !== "orthopedics"))}
                          className="absolute top-2 left-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                          title="Remove from compare"
                        >
                          <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
                        </button>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Activity className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Orthopedics</h4>
                          <p className="text-xs text-muted-foreground">Dr. James Morrison</p>
                        </div>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Joint & bone care</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Physical therapy access</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Imaging included</li>
                      </ul>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">$129/mo</span>
                        <Badge variant="outline" className="bg-primary/10 border-primary text-primary">Enrolled</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      Click to add benefits to your plan. Add to your monthly coverage stack.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {availableBenefits.map((benefit) => {
                          const isEnrolled = enrolledBenefits.includes(benefit.id);
                          const enrolledTier = enrolledTiers[benefit.id];
                          const currentPremium = enrolledTier === "basic" ? benefit.basicPremium : benefit.monthlyPremium;
                          const wouldExceedBudget = !isEnrolled && (getTotalEnrolledCost() + benefit.basicPremium > monthlyBudget);
                          
                          return (
                            <div
                              key={benefit.id}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                isEnrolled 
                                  ? "border-primary bg-primary/5 shadow-md" 
                                  : "border-border hover:border-primary/50 hover:bg-muted/30"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{benefit.icon}</span>
                                  <div>
                                    <h4 className="font-semibold text-foreground">{benefit.name}</h4>
                                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                                  </div>
                                </div>
                                {isEnrolled && (
                                  <Badge className="bg-primary text-primary-foreground text-xs capitalize">
                                    {enrolledTier}
                                  </Badge>
                                )}
                              </div>
                              
                              {isEnrolled ? (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-primary">${currentPremium}/mo</span>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-xs h-7"
                                      asChild
                                    >
                                      <Link to={`/benefits/${benefit.id}`}>
                                        <Eye className="h-3 w-3 mr-1" />
                                        Change Plan
                                      </Link>
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-xs h-7 text-destructive hover:text-destructive"
                                      onClick={() => removeBenefit(benefit.id)}
                                    >
                                      <Minus className="h-3 w-3 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">From ${benefit.basicPremium}/mo</span>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="default" 
                                      size="sm"
                                      className="text-xs h-7"
                                      disabled={wouldExceedBudget}
                                      onClick={() => addBasicBenefit(benefit.id)}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Basic
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-xs h-7"
                                      asChild
                                    >
                                      <Link to={`/benefits/${benefit.id}`}>
                                        <Eye className="h-3 w-3 mr-1" />
                                        View Plans
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
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
                        <p className="text-sm text-muted-foreground mt-1">remaining of ${monthlyBudget} ICHRA</p>
                        <Progress 
                          value={(getTotalEnrolledCost() / monthlyBudget) * 100} 
                          className="h-3 mt-4"
                        />
                        <div className="text-xs text-muted-foreground mt-3 space-y-1">
                          <div className="flex justify-between">
                            <span>Subscription Plans:</span>
                            <span className="font-medium">${getSubscriptionTotal()}/mo</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Supplemental Benefits:</span>
                            <span className="font-medium">${getSupplementalTotal()}/mo</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-border mt-2">
                            <span className="font-medium">Total:</span>
                            <span className="font-bold text-primary">${getTotalEnrolledCost()}/mo</span>
                          </div>
                        </div>
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
                      <CardDescription>Subscription plans + supplemental benefits</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Subscription Plans Section */}
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Subscription Plans</p>
                        <div className="space-y-0">
                          {subscriptionPlans.map((plan, index) => (
                            <div 
                              key={plan.id}
                              className={`relative p-3 bg-gradient-to-r from-primary/15 to-primary/5 border-2 border-primary/40 
                                ${index === 0 ? "rounded-t-lg" : ""} 
                                ${index === subscriptionPlans.length - 1 ? "rounded-b-lg" : "border-b-0"}`}
                              style={{ 
                                zIndex: subscriptionPlans.length - index,
                                marginTop: index > 0 ? "-4px" : "0"
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Stethoscope className="h-4 w-4 text-primary" />
                                  <div>
                                    <span className="font-medium text-sm">{plan.name}</span>
                                    <p className="text-xs text-muted-foreground">{plan.provider}</p>
                                  </div>
                                </div>
                                <span className="text-sm font-bold text-primary">${plan.monthlyPremium}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Supplemental Benefits Section */}
                      {enrolledBenefits.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Supplemental Benefits</p>
                          <div className="space-y-0">
                            {availableBenefits
                              .filter(b => enrolledBenefits.includes(b.id))
                              .map((benefit, index, filteredArr) => {
                                const enrolledTier = enrolledTiers[benefit.id];
                                const currentPremium = enrolledTier === "basic" ? benefit.basicPremium : benefit.monthlyPremium;
                                return (
                                  <div 
                                    key={benefit.id}
                                    className={`relative p-3 bg-gradient-to-r from-accent/10 to-accent/5 border-2 border-accent/30 
                                      ${index === 0 ? "rounded-t-lg" : ""} 
                                      ${index === filteredArr.length - 1 ? "rounded-b-lg" : "border-b-0"}
                                      transform hover:scale-[1.02] transition-transform cursor-pointer group`}
                                    onClick={() => removeBenefit(benefit.id)}
                                    style={{ 
                                      zIndex: filteredArr.length - index,
                                      marginTop: index > 0 ? "-4px" : "0"
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">{benefit.icon}</span>
                                        <div className="flex flex-col">
                                          <span className="font-medium text-sm">{benefit.name}</span>
                                          <span className="text-xs text-muted-foreground capitalize">{enrolledTier}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-accent">${currentPremium}</span>
                                        <X className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold">Monthly Total</span>
                          <span className="text-xl font-bold text-primary">${getTotalEnrolledCost()}</span>
                        </div>
                        <Button className="w-full" size="lg">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Confirm Enrollment
                        </Button>
                      </div>
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
                  <CardDescription>View and track all your healthcare claims. Click any claim to see the full event details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {claimEvents.map((claim) => {
                      const parentSub = getParentSubscription(claim.parent_event_id);
                      return (
                        <div 
                          key={claim.id}
                          onClick={() => handleClaimClick(claim)}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            {claim.status === "completed" ? (
                              <CheckCircle2 className="h-6 w-6 text-accent" />
                            ) : (
                              <Clock className="h-6 w-6 text-amber-500" />
                            )}
                            <div>
                              <p className="font-medium group-hover:text-primary transition-colors">{claim.title}</p>
                              <p className="text-sm text-muted-foreground">{claim.provider_name || claim.facility_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(claim.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                              {parentSub && (
                                <Badge variant="outline" className="mt-1 text-xs bg-primary/5 border-primary/20 text-primary">
                                  Part of: {parentSub.title}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-lg font-semibold">${claim.member_responsibility || 0}</p>
                              <Badge 
                                variant="secondary" 
                                className={claim.status === "completed" 
                                  ? "bg-accent/10 text-accent" 
                                  : "bg-amber-500/10 text-amber-600"
                                }
                              >
                                {claim.status === "completed" ? "approved" : claim.status}
                              </Badge>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Active Subscriptions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Active Subscriptions
                  </CardTitle>
                  <CardDescription>Your subscription-based care plans. Click to view all payments and details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {subscriptionEvents.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => handleClaimClick(sub)}
                        className="p-4 rounded-lg border-2 border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold group-hover:text-primary transition-colors">{sub.title.replace(' Subscription', '')}</p>
                            <p className="text-xs text-muted-foreground">{sub.provider_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Since {new Date(sub.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-primary">${sub.billed_amount}/mo</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
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

      {/* Event Detail Modal */}
      <EventDetailModal 
        event={selectedEvent} 
        open={eventModalOpen} 
        onOpenChange={setEventModalOpen} 
      />
    </div>
  );
};

export default MemberDashboard;
