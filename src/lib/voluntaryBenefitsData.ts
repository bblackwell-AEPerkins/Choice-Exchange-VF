// Voluntary Benefits Mock Data

import { Heart, Eye, Shield, Umbrella, Activity, Stethoscope } from "lucide-react";

export type VoluntaryBenefitCategory = "dental" | "vision" | "life" | "disability" | "accident" | "critical_illness";

export type PayerType = "contribution" | "employee" | "split";

export interface VoluntaryBenefit {
  id: string;
  category: VoluntaryBenefitCategory;
  name: string;
  carrier: string;
  description: string;
  price: number;
  billingFrequency: "monthly" | "biweekly";
  icon: typeof Heart;
  recommended: boolean;
  requiresUnderwriting: boolean;
  eligibilityConstraints?: string;
  payerOptionsAllowed: PayerType[];
}

export interface SelectedBenefit {
  benefitId: string;
  payerType: PayerType;
  status: "selected" | "pending_confirmation" | "active";
  effectiveDate: string;
}

// Comprehensive voluntary benefits catalog
export const VOLUNTARY_BENEFITS: VoluntaryBenefit[] = [
  // Dental
  {
    id: "dental-basic",
    category: "dental",
    name: "Dental Basic",
    carrier: "Delta Dental",
    description: "Preventive care with 2 cleanings/year included",
    price: 25,
    billingFrequency: "monthly",
    icon: Heart,
    recommended: true,
    requiresUnderwriting: false,
    payerOptionsAllowed: ["contribution", "employee", "split"],
  },
  {
    id: "dental-plus",
    category: "dental",
    name: "Dental Plus",
    carrier: "Delta Dental",
    description: "Preventive, basic & major services covered",
    price: 45,
    billingFrequency: "monthly",
    icon: Heart,
    recommended: false,
    requiresUnderwriting: false,
    payerOptionsAllowed: ["contribution", "employee", "split"],
  },
  // Vision
  {
    id: "vision-basic",
    category: "vision",
    name: "Vision Essential",
    carrier: "VSP",
    description: "Annual eye exam plus $150 frames allowance",
    price: 12,
    billingFrequency: "monthly",
    icon: Eye,
    recommended: true,
    requiresUnderwriting: false,
    payerOptionsAllowed: ["contribution", "employee", "split"],
  },
  {
    id: "vision-premium",
    category: "vision",
    name: "Vision Premium",
    carrier: "VSP",
    description: "Annual exam, $250 frames, contacts included",
    price: 22,
    billingFrequency: "monthly",
    icon: Eye,
    recommended: false,
    requiresUnderwriting: false,
    payerOptionsAllowed: ["contribution", "employee", "split"],
  },
  // Life Insurance
  {
    id: "life-25k",
    category: "life",
    name: "Term Life $25,000",
    carrier: "MetLife",
    description: "$25K coverage with accidental death benefit",
    price: 12,
    billingFrequency: "monthly",
    icon: Shield,
    recommended: false,
    requiresUnderwriting: false,
    payerOptionsAllowed: ["contribution", "employee"],
  },
  {
    id: "life-50k",
    category: "life",
    name: "Term Life $50,000",
    carrier: "MetLife",
    description: "$50K coverage with AD&D",
    price: 22,
    billingFrequency: "monthly",
    icon: Shield,
    recommended: true,
    requiresUnderwriting: false,
    payerOptionsAllowed: ["contribution", "employee"],
  },
  {
    id: "life-100k",
    category: "life",
    name: "Term Life $100,000",
    carrier: "MetLife",
    description: "$100K coverage, requires health attestation",
    price: 42,
    billingFrequency: "monthly",
    icon: Shield,
    recommended: false,
    requiresUnderwriting: true,
    eligibilityConstraints: "Health attestation required",
    payerOptionsAllowed: ["employee"],
  },
  // Disability
  {
    id: "std-basic",
    category: "disability",
    name: "Short-Term Disability",
    carrier: "Unum",
    description: "60% income replacement for 90 days",
    price: 28,
    billingFrequency: "monthly",
    icon: Umbrella,
    recommended: true,
    requiresUnderwriting: false,
    payerOptionsAllowed: ["contribution", "employee"],
  },
  {
    id: "ltd-basic",
    category: "disability",
    name: "Long-Term Disability",
    carrier: "Unum",
    description: "60% income replacement after 90 days",
    price: 35,
    billingFrequency: "monthly",
    icon: Umbrella,
    recommended: false,
    requiresUnderwriting: true,
    eligibilityConstraints: "Income verification required",
    payerOptionsAllowed: ["employee"],
  },
  // Accident
  {
    id: "accident-basic",
    category: "accident",
    name: "Accident Insurance",
    carrier: "Aflac",
    description: "Cash benefits for accidents and injuries",
    price: 15,
    billingFrequency: "monthly",
    icon: Activity,
    recommended: true,
    requiresUnderwriting: false,
    payerOptionsAllowed: ["contribution", "employee", "split"],
  },
  // Critical Illness
  {
    id: "critical-basic",
    category: "critical_illness",
    name: "Critical Illness",
    carrier: "Aflac",
    description: "$10K lump sum for heart attack, stroke, cancer",
    price: 22,
    billingFrequency: "monthly",
    icon: Stethoscope,
    recommended: false,
    requiresUnderwriting: false,
    payerOptionsAllowed: ["contribution", "employee"],
  },
  {
    id: "critical-plus",
    category: "critical_illness",
    name: "Critical Illness Plus",
    carrier: "Aflac",
    description: "$25K lump sum with wellness benefit",
    price: 45,
    billingFrequency: "monthly",
    icon: Stethoscope,
    recommended: false,
    requiresUnderwriting: true,
    eligibilityConstraints: "Health attestation required",
    payerOptionsAllowed: ["employee"],
  },
];

// Category display info
export const BENEFIT_CATEGORIES: Record<VoluntaryBenefitCategory, { label: string; description: string }> = {
  dental: { label: "Dental", description: "Preventive, basic, and major dental care" },
  vision: { label: "Vision", description: "Eye exams, glasses, and contacts" },
  life: { label: "Life Insurance", description: "Financial protection for your family" },
  disability: { label: "Disability", description: "Income protection if you can't work" },
  accident: { label: "Accident", description: "Cash benefits for accidents" },
  critical_illness: { label: "Critical Illness", description: "Lump sum for serious conditions" },
};

// Helper functions
export function getRecommendedBenefits(): VoluntaryBenefit[] {
  return VOLUNTARY_BENEFITS.filter((b) => b.recommended && !b.requiresUnderwriting);
}

export function getBenefitsByCategory(category: VoluntaryBenefitCategory): VoluntaryBenefit[] {
  return VOLUNTARY_BENEFITS.filter((b) => b.category === category);
}

export function getBenefitById(id: string): VoluntaryBenefit | undefined {
  return VOLUNTARY_BENEFITS.find((b) => b.id === id);
}

export function calculatePayerType(
  remainingDollars: number,
  benefitPrice: number,
  runningTotal: number
): PayerType {
  const availableAfterCurrent = remainingDollars - runningTotal;
  if (availableAfterCurrent >= benefitPrice) {
    return "contribution";
  } else if (availableAfterCurrent > 0) {
    return "split";
  }
  return "employee";
}
