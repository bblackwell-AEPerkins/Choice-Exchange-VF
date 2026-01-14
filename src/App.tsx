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
import EmployerLanding from "./pages/EmployerLanding";
import Auth from "./pages/Auth";
import ICHRACompare from "./pages/ICHRACompare";
import ICHRA from "./pages/ICHRA";
import ICHRAEnroll from "./pages/ICHRAEnroll";
import BenefitPlans from "./pages/BenefitPlans";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import { ChatWidget } from "./components/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/providers" element={<ProviderMap />} />
          <Route path="/dashboard" element={<MemberDashboard />} />
          <Route path="/employer" element={<EmployerLanding />} />
          <Route path="/employer/admin" element={<EmployerAdmin />} />
          <Route path="/employer/signup" element={<EmployerSignup />} />
          <Route path="/compare-ichra" element={<ICHRACompare />} />
          <Route path="/ichra" element={<ICHRA />} />
          <Route path="/ichra/enroll" element={<ICHRAEnroll />} />
          <Route path="/benefits/:benefitType" element={<BenefitPlans />} />
          <Route path="/support" element={<Support />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
