import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  PieChart,
  BarChart3,
  Shield,
  Clock,
  FileText,
  HeartPulse,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Calculator,
  Zap,
  Lock,
} from "lucide-react";

const EmployerLanding = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Example data for preview
  const exampleData = {
    employeeCount: 247,
    activeEnrollments: 231,
    pendingEnrollments: 12,
    monthlyBudget: 197600,
    usedBudget: 168520,
    avgAllowance: 800,
    planTypes: { ichra: 156, group: 75, individual: 16 },
  };

  const monthlyStats = [
    { month: "Jul", spending: 142000 },
    { month: "Aug", spending: 148000 },
    { month: "Sep", spending: 155000 },
    { month: "Oct", spending: 162000 },
    { month: "Nov", spending: 165000 },
    { month: "Dec", spending: 168520 },
  ];

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Easily manage all employee enrollments, benefits, and allowances from one central dashboard.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track spending trends, enrollment rates, and budget utilization with interactive charts.",
    },
    {
      icon: Calculator,
      title: "Flexible Allowances",
      description: "Set custom ICHRA allowances by employee class, age, or family status.",
    },
    {
      icon: Shield,
      title: "Compliance Built-in",
      description: "Stay compliant with ACA and ERISA requirements with automated reporting.",
    },
    {
      icon: FileText,
      title: "Automated Reports",
      description: "Generate enrollment, spending, and compliance reports with one click.",
    },
    {
      icon: Zap,
      title: "Quick Onboarding",
      description: "Add employees in bulk or individually with streamlined enrollment flows.",
    },
  ];

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/employer/admin");
    } else {
      navigate("/employer/signup");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                For Employers
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Simplify Healthcare Benefits for Your Team
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Manage ICHRA, group plans, and individual coverage all in one powerful dashboard. 
                Save time, reduce costs, and give employees the flexibility they deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
                  {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Manage Benefits
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our employer portal gives you complete control over your healthcare benefits program.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-accent/10 text-accent border-0">
                <BarChart3 className="h-3 w-3 mr-1" />
                Dashboard Preview
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Powerful Analytics at Your Fingertips
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See exactly how your benefits program is performing with real-time metrics and insights.
              </p>
            </div>

            {/* Example Stats Cards */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 opacity-90">
                <Card className="hover:shadow-md transition-shadow border-dashed">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Employees</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{exampleData.employeeCount}</p>
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

                <Card className="hover:shadow-md transition-shadow border-dashed">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Enrollments</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{exampleData.activeEnrollments}</p>
                        <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
                          <span>{exampleData.pendingEnrollments} pending</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-full bg-accent/10 text-accent">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-dashed">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Budget</p>
                        <p className="text-3xl font-bold text-foreground mt-1">
                          ${(exampleData.monthlyBudget / 1000).toFixed(0)}k
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                          <span className="text-muted-foreground">
                            ${((exampleData.monthlyBudget - exampleData.usedBudget) / 1000).toFixed(0)}k remaining
                          </span>
                        </div>
                      </div>
                      <div className="p-3 rounded-full bg-violet-500/10 text-violet-600">
                        <DollarSign className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-dashed">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Allowance</p>
                        <p className="text-3xl font-bold text-foreground mt-1">${exampleData.avgAllowance}</p>
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

              {/* Charts Preview */}
              <div className="grid lg:grid-cols-3 gap-6 opacity-90">
                <Card className="lg:col-span-2 border-dashed">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Monthly Healthcare Spending
                    </CardTitle>
                    <CardDescription>Last 6 months spending trend</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-end gap-4 pt-4">
                      {monthlyStats.map((stat) => {
                        const maxSpending = Math.max(...monthlyStats.map(s => s.spending));
                        const heightPercent = (stat.spending / maxSpending) * 100;
                        return (
                          <div key={stat.month} className="flex-1 flex flex-col items-center gap-2 h-full">
                            <div className="flex-1 w-full flex items-end">
                              <div 
                                className="w-full bg-primary/60 rounded-t-lg transition-all duration-500"
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

                <Card className="border-dashed">
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
                            {exampleData.planTypes.ichra} employees
                          </span>
                        </div>
                        <Progress 
                          value={(exampleData.planTypes.ichra / exampleData.employeeCount) * 100} 
                          className="h-3"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Group Plans</span>
                          <span className="text-sm text-muted-foreground">
                            {exampleData.planTypes.group} employees
                          </span>
                        </div>
                        <Progress 
                          value={(exampleData.planTypes.group / exampleData.employeeCount) * 100} 
                          className="h-3 [&>div]:bg-accent"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Individual</span>
                          <span className="text-sm text-muted-foreground">
                            {exampleData.planTypes.individual} employees
                          </span>
                        </div>
                        <Progress 
                          value={(exampleData.planTypes.individual / exampleData.employeeCount) * 100} 
                          className="h-3 [&>div]:bg-violet-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Login Overlay */}
              {!isLoggedIn && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Card className="bg-background/95 backdrop-blur-sm shadow-xl border-2">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Ready to See Your Data?</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm">
                        Create an account to access your personalized employer dashboard with real data.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button size="lg" onClick={() => navigate("/employer/signup")}>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                          Sign In
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Benefits Program?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of employers who trust us to manage their healthcare benefits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={handleGetStarted}
                className="text-lg px-8"
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EmployerLanding;
