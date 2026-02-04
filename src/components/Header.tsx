import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, Users, Building2, User, Shield, Stethoscope, Network, BarChart3, FileCode, Briefcase, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { UserTypeModal } from "./UserTypeModal";

const memberSolutions = [
  { 
    title: "Browse ICHRA Plans", 
    href: "/plans",
    icon: Search,
    description: "View health plans available in your area"
  },
  { 
    title: "ICHRA Enrollment", 
    href: "/ichra",
    icon: Shield,
    description: "Enroll in employer-sponsored ICHRA benefits"
  },
  { 
    title: "Member Profile", 
    href: "/dashboard",
    icon: User,
    description: "View your benefits and health information"
  },
];

const employerSolutions = [
  { 
    title: "ICHRA Administration", 
    href: "/employer",
    icon: Shield,
    description: "Set up and manage ICHRA for employees"
  },
  { 
    title: "Group Plans", 
    href: "/employer",
    icon: Briefcase,
    description: "Traditional group health plan options"
  },
  { 
    title: "Build a Network", 
    href: "/employer",
    icon: Network,
    description: "Create custom provider networks"
  },
];

const providerSolutions = [
  { 
    title: "Partner with Us", 
    href: "/support",
    icon: Stethoscope,
    description: "Learn about partnership opportunities"
  },
  { 
    title: "Utilization Analytics", 
    href: "/support",
    icon: BarChart3,
    description: "Visualize patient utilization data"
  },
  { 
    title: "API Integrations", 
    href: "/support",
    icon: FileCode,
    description: "Connect your systems via API"
  },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userTypeModalOpen, setUserTypeModalOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">CX</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground hidden sm:block">
              Choice<span className="text-primary">Exchange</span>
            </span>
          </Link>

{/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {/* Solutions Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-foreground font-medium">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[600px] p-4">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Members Column */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                          For Members
                        </h4>
                        <ul className="space-y-1">
                          {memberSolutions.map((item) => (
                            <li key={item.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={item.href}
                                  className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-muted"
                                >
                                  <div className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">{item.title}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1 pl-6">
                                    {item.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Employers Column */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                          For Employers
                        </h4>
                        <ul className="space-y-1">
                          {employerSolutions.map((item) => (
                            <li key={item.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={item.href}
                                  className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-muted"
                                >
                                  <div className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">{item.title}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1 pl-6">
                                    {item.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Providers Column */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                          For Providers
                        </h4>
                        <ul className="space-y-1">
                          {providerSolutions.map((item) => (
                            <li key={item.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={item.href}
                                  className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-muted"
                                >
                                  <div className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">{item.title}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1 pl-6">
                                    {item.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              {/* Support */}
              <NavigationMenuItem>
                <Link 
                  to="/support" 
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:outline-none"
                >
                  Support
                </Link>
              </NavigationMenuItem>

              {/* Compare Plans */}
              <NavigationMenuItem>
                <Link 
                  to="/plans" 
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:outline-none"
                >
                  Compare Plans
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Button variant="ghost" asChild className="flex items-center gap-2">
                <Link to="/dashboard">
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button 
                  className="gradient-primary border-0"
                  onClick={() => setUserTypeModalOpen(true)}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
{mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t animate-fade-in">
            <nav className="flex flex-col gap-2">
              {/* Quick Links */}
              <div className="flex gap-2 px-3 mb-2">
                <Link
                  to="/plans"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-muted text-sm font-medium"
                >
                  Compare Plans
                </Link>
                <Link
                  to="/support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-muted text-sm font-medium"
                >
                  Support
                </Link>
              </div>

              <div className="h-px bg-border my-2" />

              {/* Members Section */}
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">For Members</p>
                {memberSolutions.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>

              {/* Employers Section */}
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">For Employers</p>
                {employerSolutions.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>

              {/* Providers Section */}
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">For Providers</p>
                {providerSolutions.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                {user ? (
                  <Button variant="outline" asChild className="w-full flex items-center gap-2">
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button 
                      className="w-full gradient-primary border-0"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setUserTypeModalOpen(true);
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      <UserTypeModal open={userTypeModalOpen} onOpenChange={setUserTypeModalOpen} />
    </header>
  );
};
