import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProviderMap from "./pages/ProviderMap";
import MemberDashboard from "./pages/MemberDashboard";
import EmployerAdmin from "./pages/EmployerAdmin";
import EmployerSignup from "./pages/EmployerSignup";
import Auth from "./pages/Auth";
import ICHRACompare from "./pages/ICHRACompare";
import ICHRA from "./pages/ICHRA";
import ICHRAEnroll from "./pages/ICHRAEnroll";
import ICHRAPlans from "./pages/ICHRAPlans";
import ComparePlans from "./pages/ComparePlans";
import EventDetail from "./pages/EventDetail";
import BenefitPlans from "./pages/BenefitPlans";
import Support from "./pages/Support";
import ScheduleRedirect from "./pages/ScheduleRedirect";
import NotFound from "./pages/NotFound";
import { ChatWidget } from "./components/ChatWidget";

// Role-Based Entry Module
import RoleSelect from "./pages/RoleSelect";
import BrokerIntake from "./pages/intake/BrokerIntake";
import EmployerIntake from "./pages/intake/EmployerIntake";
import IndividualIntake from "./pages/intake/IndividualIntake";
import RequestAccess from "./pages/RequestAccess";

// Role-Specific Landing Pages
import BrokerLanding from "./pages/landing/BrokerLanding";
import EmployerLanding from "./pages/landing/EmployerLanding";
import IndividualLanding from "./pages/landing/IndividualLanding";

// Role-Specific Home Pages (Dashboards)
import BrokerHome from "./pages/broker/BrokerHome";
import BrokerEnrollNew from "./pages/broker/enroll/BrokerEnrollNew";
import EmployerHome from "./pages/employer/EmployerHome";
import IndividualHome from "./pages/individual/IndividualHome";

// New Enrollment Flow Pages
import EnrollIntent from "./pages/enrollment/EnrollIntent";
import EnrollAccount from "./pages/enrollment/EnrollAccount";
import EnrollAbout from "./pages/enrollment/EnrollAbout";
import EnrollHousehold from "./pages/enrollment/EnrollHousehold";
import EnrollCoverage from "./pages/enrollment/EnrollCoverage";
import EnrollPlans from "./pages/enrollment/EnrollPlans";
import EnrollReview from "./pages/enrollment/EnrollReview";
import EnrollSubmit from "./pages/enrollment/EnrollSubmit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Role-Based Entry Module */}
          <Route path="/" element={<RoleSelect />} />
          <Route path="/select-role" element={<RoleSelect />} />
          
          {/* Role-Specific Landing Pages */}
          <Route path="/broker" element={<BrokerLanding />} />
          <Route path="/employer" element={<EmployerLanding />} />
          <Route path="/individual" element={<IndividualLanding />} />
          
          {/* Intake Forms */}
          <Route path="/broker/intake" element={<BrokerIntake />} />
          <Route path="/employer/intake" element={<EmployerIntake />} />
          <Route path="/individual/intake" element={<IndividualIntake />} />
          <Route path="/request-access" element={<RequestAccess />} />
          
          {/* Role-Specific Shells (Dashboards) */}
          <Route path="/broker/home" element={<BrokerHome />} />
          <Route path="/broker/groups" element={<BrokerHome />} />
          <Route path="/broker/reporting" element={<BrokerHome />} />
          <Route path="/broker/enroll/new" element={<BrokerEnrollNew />} />
          <Route path="/broker/enroll/:enrollmentId" element={<BrokerEnrollNew />} />
          
          <Route path="/employer/home" element={<EmployerHome />} />
          <Route path="/employer/contributions" element={<EmployerHome />} />
          <Route path="/employer/reporting" element={<EmployerHome />} />
          
          <Route path="/individual/home" element={<IndividualHome />} />
          <Route path="/individual/wallet" element={<IndividualHome />} />
          <Route path="/individual/benefits" element={<IndividualHome />} />
          
          {/* Legacy Routes (marketplace) */}
          <Route path="/marketplace" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/providers" element={<ProviderMap />} />
          <Route path="/dashboard" element={<MemberDashboard />} />
          <Route path="/employer/admin" element={<EmployerAdmin />} />
          <Route path="/employer/signup" element={<EmployerSignup />} />
          <Route path="/compare-ichra" element={<ICHRACompare />} />
          <Route path="/ichra" element={<ICHRA />} />
          <Route path="/ichra/enroll" element={<ICHRAEnroll />} />
          <Route path="/plans" element={<ICHRAPlans />} />
          <Route path="/compare-plans" element={<ComparePlans />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
          <Route path="/benefits/:benefitType" element={<BenefitPlans />} />
          <Route path="/support" element={<Support />} />
          <Route path="/schedule-redirect" element={<ScheduleRedirect />} />
          
          {/* Unified Enrollment Flow */}
          <Route path="/enroll" element={<EnrollIntent />} />
          <Route path="/enroll/account" element={<EnrollAccount />} />
          <Route path="/enroll/about" element={<EnrollAbout />} />
          <Route path="/enroll/household" element={<EnrollHousehold />} />
          <Route path="/enroll/coverage" element={<EnrollCoverage />} />
          <Route path="/enroll/plans" element={<EnrollPlans />} />
          <Route path="/enroll/review" element={<EnrollReview />} />
          <Route path="/enroll/submit" element={<EnrollSubmit />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
