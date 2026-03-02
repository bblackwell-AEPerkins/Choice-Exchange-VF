import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnrollmentLayout } from "@/components/enrollment/EnrollmentLayout";
import { EnrollmentNavigation } from "@/components/enrollment/EnrollmentNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEnrollmentDB } from "@/hooks/useEnrollmentDB";
import { CheckCircle2, Plus, X, Heart, Eye, Shield, Briefcase } from "lucide-react";

interface SupplementalProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  monthlyPrice: number;
  icon: React.ElementType;
  features: string[];
  recommended: boolean;
}

const SUPPLEMENTAL_PRODUCTS: SupplementalProduct[] = [
  {
    id: "dental-plus",
    name: "Dental Plus",
    category: "Dental",
    description: "Comprehensive dental coverage including preventive, basic, and major services.",
    monthlyPrice: 45,
    icon: Heart,
    features: ["2 preventive visits/year", "80% coverage on fillings", "50% on crowns & root canals"],
    recommended: true,
  },
  {
    id: "vision-standard",
    name: "Vision Care",
    category: "Vision",
    description: "Annual eye exams and allowances for frames, lenses, and contacts.",
    monthlyPrice: 15,
    icon: Eye,
    features: ["Annual eye exam covered", "$150 frames allowance", "Contact lens allowance"],
    recommended: true,
  },
  {
    id: "life-term",
    name: "Term Life",
    category: "Life Insurance",
    description: "Financial protection for your loved ones with guaranteed acceptance.",
    monthlyPrice: 25,
    icon: Shield,
    features: ["$100,000 death benefit", "Accidental death coverage", "No medical exam required"],
    recommended: false,
  },
  {
    id: "std-plus",
    name: "Short-Term Disability",
    category: "Disability",
    description: "Income replacement if you're unable to work due to illness or injury.",
    monthlyPrice: 35,
    icon: Briefcase,
    features: ["60% income replacement", "Up to 26 weeks coverage", "7-day waiting period"],
    recommended: false,
  },
];

export default function EnrollCrossSell() {
  const navigate = useNavigate();
  const { setStep, isLoading, canAccessStep, saveToDatabase, account } = useEnrollmentDB();
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoading && !canAccessStep("coverage")) {
      navigate("/enroll");
    }
  }, [isLoading, canAccessStep, navigate]);

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const totalMonthly = SUPPLEMENTAL_PRODUCTS
    .filter((p) => selectedProducts.has(p.id))
    .reduce((sum, p) => sum + p.monthlyPrice, 0);

  const handleNext = () => {
    setStep("submit");
    navigate("/enroll/submit");
  };

  const handleBack = () => {
    navigate("/enroll/offering");
  };

  const handleSkip = () => {
    setStep("submit");
    navigate("/enroll/submit");
  };

  return (
    <EnrollmentLayout
      currentStep={7}
      totalSteps={8}
      title="Enhance Your Coverage"
      description="Based on your profile, these supplemental products complement your New Edge offering."
      onSave={saveToDatabase}
    >
      {/* Recommendation banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <p className="text-sm text-foreground">
            <span className="font-semibold">{account.firstName || "Hi"}</span>, these products are frequently bundled with your core coverage.
            Adding them now means a single monthly payment for all your benefits.
          </p>
        </CardContent>
      </Card>

      {/* Products grid */}
      <div className="space-y-4">
        {SUPPLEMENTAL_PRODUCTS.map((product) => {
          const isSelected = selectedProducts.has(product.id);
          const Icon = product.icon;

          return (
            <Card
              key={product.id}
              className={`transition-all cursor-pointer ${
                isSelected
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40"
              }`}
              onClick={() => toggleProduct(product.id)}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      {product.recommended && (
                        <Badge variant="secondary" className="text-xs">Recommended</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{product.description}</p>

                    {/* Features */}
                    <div className="space-y-1">
                      {product.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & toggle */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-foreground">${product.monthlyPrice}</p>
                    <p className="text-xs text-muted-foreground">/month</p>
                    <div className="mt-2">
                      {isSelected ? (
                        <Badge className="bg-primary text-primary-foreground">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Added
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Running total */}
      {selectedProducts.size > 0 && (
        <Card className="border-accent/30 bg-accent/5 sticky bottom-4">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">
                  {selectedProducts.size} supplemental {selectedProducts.size === 1 ? "product" : "products"} selected
                </p>
                <p className="text-xs text-muted-foreground">Added to your monthly payment</p>
              </div>
              <p className="text-xl font-bold text-foreground">+${totalMonthly}/mo</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skip option */}
      {selectedProducts.size === 0 && (
        <div className="text-center">
          <Button variant="ghost" className="text-muted-foreground" onClick={handleSkip}>
            Skip supplemental coverage for now
          </Button>
        </div>
      )}

      <EnrollmentNavigation
        onBack={handleBack}
        onNext={handleNext}
        nextLabel="Proceed to Payment"
      />
    </EnrollmentLayout>
  );
}
