import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSplitPaths } from "@/components/HeroSplitPaths";
import { ValueProposition } from "@/components/ValueProposition";
import { CoveragePathPanels } from "@/components/CoveragePathPanels";
import { BenefitTypesExplainer } from "@/components/BenefitTypesExplainer";
import { PlanExplorer } from "@/components/PlanExplorer";
import { TrustIndicators } from "@/components/TrustIndicators";
import { MobileEnrollmentSteps } from "@/components/MobileEnrollmentSteps";
import { RollingBanner } from "@/components/RollingBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <RollingBanner />
        <HeroSplitPaths />
        <MobileEnrollmentSteps />
        <BenefitTypesExplainer />
        <CoveragePathPanels />
        <ValueProposition />
        <PlanExplorer />
        <TrustIndicators />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
