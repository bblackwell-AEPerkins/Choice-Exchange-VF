import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSplitPaths } from "@/components/HeroSplitPaths";
import { ValueProposition } from "@/components/ValueProposition";
import { PlanExplorer } from "@/components/PlanExplorer";
import { TrustIndicators } from "@/components/TrustIndicators";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSplitPaths />
        <ValueProposition />
        <PlanExplorer />
        <TrustIndicators />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
