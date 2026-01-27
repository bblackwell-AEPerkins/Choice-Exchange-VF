import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Star, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Plan data for each benefit type with 9 options (3 carriers x 3 tiers)
const benefitPlansData: Record<string, {
  title: string;
  icon: string;
  description: string;
  plans: {
    id: string;
    name: string;
    carrier: string;
    carrierLogo?: string;
    tier: "Basic" | "Standard" | "Premium";
    monthlyPremium: number;
    features: string[];
    popular?: boolean;
  }[];
}> = {
  dental: {
    title: "Dental Coverage",
    icon: "🦷",
    description: "Choose a dental plan that fits your needs",
    plans: [
      // Default Carrier Row
      {
        id: "dental-basic",
        name: "Dental Basic",
        carrier: "Choice Exchange",
        tier: "Basic",
        monthlyPremium: 25,
        features: [
          "2 preventive visits per year",
          "Basic cleanings & X-rays",
          "50% coverage on fillings",
          "No coverage for major work",
        ],
      },
      {
        id: "dental-standard",
        name: "Dental Plus",
        carrier: "Choice Exchange",
        tier: "Standard",
        monthlyPremium: 45,
        features: [
          "2 preventive visits per year",
          "Full cleanings & X-rays",
          "80% coverage on fillings",
          "50% coverage on crowns & root canals",
          "Orthodontic consultation included",
        ],
        popular: true,
      },
      {
        id: "dental-premium",
        name: "Dental Premium",
        carrier: "Choice Exchange",
        tier: "Premium",
        monthlyPremium: 75,
        features: [
          "Unlimited preventive visits",
          "100% cleanings & X-rays",
          "100% coverage on fillings",
          "80% coverage on crowns & root canals",
          "$1,500 orthodontic benefit",
          "Cosmetic dentistry discounts",
        ],
      },
      // Delta Dental Row
      {
        id: "delta-dental-basic",
        name: "Delta Care Basic",
        carrier: "Delta Dental",
        tier: "Basic",
        monthlyPremium: 28,
        features: [
          "2 preventive visits per year",
          "100% cleanings covered",
          "60% coverage on fillings",
          "Large network of dentists",
        ],
      },
      {
        id: "delta-dental-standard",
        name: "Delta PPO Plus",
        carrier: "Delta Dental",
        tier: "Standard",
        monthlyPremium: 52,
        features: [
          "2 preventive visits per year",
          "100% cleanings & X-rays",
          "80% coverage on fillings",
          "60% coverage on major work",
          "Out-of-network coverage",
        ],
      },
      {
        id: "delta-dental-premium",
        name: "Delta Premier",
        carrier: "Delta Dental",
        tier: "Premium",
        monthlyPremium: 82,
        features: [
          "Unlimited preventive visits",
          "100% cleanings & X-rays",
          "100% coverage on fillings",
          "80% coverage on major work",
          "$2,000 annual maximum",
          "Implant coverage included",
        ],
      },
      // MetLife Row
      {
        id: "metlife-dental-basic",
        name: "MetLife Dental Essential",
        carrier: "MetLife",
        tier: "Basic",
        monthlyPremium: 22,
        features: [
          "2 preventive visits per year",
          "100% preventive coverage",
          "50% basic procedures",
          "Nationwide network",
        ],
      },
      {
        id: "metlife-dental-standard",
        name: "MetLife Dental Preferred",
        carrier: "MetLife",
        tier: "Standard",
        monthlyPremium: 48,
        features: [
          "2 preventive visits per year",
          "100% preventive coverage",
          "80% basic procedures",
          "50% major procedures",
          "No waiting periods",
        ],
      },
      {
        id: "metlife-dental-premium",
        name: "MetLife Dental Elite",
        carrier: "MetLife",
        tier: "Premium",
        monthlyPremium: 78,
        features: [
          "Unlimited preventive visits",
          "100% preventive coverage",
          "100% basic procedures",
          "80% major procedures",
          "$2,500 annual maximum",
          "Orthodontia coverage",
        ],
      },
    ],
  },
  vision: {
    title: "Vision Coverage",
    icon: "👁️",
    description: "Find the right vision plan for your eye care needs",
    plans: [
      // Default Carrier Row
      {
        id: "vision-basic",
        name: "Vision Basic",
        carrier: "Choice Exchange",
        tier: "Basic",
        monthlyPremium: 10,
        features: [
          "Annual eye exam covered",
          "$100 frames allowance",
          "Standard lenses included",
          "20% off contact lenses",
        ],
      },
      {
        id: "vision-standard",
        name: "Vision Plus",
        carrier: "Choice Exchange",
        tier: "Standard",
        monthlyPremium: 15,
        features: [
          "Annual eye exam covered",
          "$150 frames allowance",
          "Progressive lenses included",
          "$150 contact lens allowance",
          "Blue light coating included",
        ],
        popular: true,
      },
      {
        id: "vision-premium",
        name: "Vision Premium",
        carrier: "Choice Exchange",
        tier: "Premium",
        monthlyPremium: 25,
        features: [
          "2 eye exams per year",
          "$250 frames allowance",
          "All lens types included",
          "$250 contact lens allowance",
          "LASIK discount (15% off)",
          "Designer frames included",
        ],
      },
      // VSP Row
      {
        id: "vsp-vision-basic",
        name: "VSP Basic",
        carrier: "VSP",
        tier: "Basic",
        monthlyPremium: 12,
        features: [
          "Annual WellVision exam",
          "$120 frames allowance",
          "Single vision lenses",
          "15% off lens options",
        ],
      },
      {
        id: "vsp-vision-standard",
        name: "VSP Choice",
        carrier: "VSP",
        tier: "Standard",
        monthlyPremium: 18,
        features: [
          "Annual WellVision exam",
          "$180 frames allowance",
          "Progressive lenses included",
          "$180 contact lens allowance",
          "Scratch-resistant coating",
        ],
      },
      {
        id: "vsp-vision-premium",
        name: "VSP Premier",
        carrier: "VSP",
        tier: "Premium",
        monthlyPremium: 28,
        features: [
          "Annual WellVision exam",
          "$300 frames allowance",
          "Premium progressives",
          "$300 contact lens allowance",
          "LASIK discounts",
          "Transitions lenses included",
        ],
      },
      // EyeMed Row
      {
        id: "eyemed-vision-basic",
        name: "EyeMed Access",
        carrier: "EyeMed",
        tier: "Basic",
        monthlyPremium: 9,
        features: [
          "Annual eye exam covered",
          "$100 frames allowance",
          "Standard plastic lenses",
          "40% off lens upgrades",
        ],
      },
      {
        id: "eyemed-vision-standard",
        name: "EyeMed Select",
        carrier: "EyeMed",
        tier: "Standard",
        monthlyPremium: 16,
        features: [
          "Annual eye exam covered",
          "$150 frames allowance",
          "Progressive lenses",
          "$150 contact lens allowance",
          "Anti-reflective coating",
        ],
      },
      {
        id: "eyemed-vision-premium",
        name: "EyeMed Complete",
        carrier: "EyeMed",
        tier: "Premium",
        monthlyPremium: 26,
        features: [
          "2 eye exams per year",
          "$275 frames allowance",
          "All lens options",
          "$275 contact lens allowance",
          "LASIK 15% discount",
          "Sunglasses benefit",
        ],
      },
    ],
  },
  life: {
    title: "Life Insurance",
    icon: "🛡️",
    description: "Protect your loved ones with the right coverage",
    plans: [
      // Default Carrier Row
      {
        id: "life-basic",
        name: "Term Life Basic",
        carrier: "Choice Exchange",
        tier: "Basic",
        monthlyPremium: 15,
        features: [
          "$50,000 death benefit",
          "Accidental death coverage",
          "No medical exam required",
          "Guaranteed acceptance",
        ],
      },
      {
        id: "life-standard",
        name: "Term Life Plus",
        carrier: "Choice Exchange",
        tier: "Standard",
        monthlyPremium: 25,
        features: [
          "$100,000 death benefit",
          "Accidental death & dismemberment",
          "Living benefits included",
          "Spouse coverage available",
          "Portable coverage",
        ],
        popular: true,
      },
      {
        id: "life-premium",
        name: "Term Life Premium",
        carrier: "Choice Exchange",
        tier: "Premium",
        monthlyPremium: 45,
        features: [
          "$250,000 death benefit",
          "Full AD&D coverage",
          "Critical illness rider",
          "Family coverage included",
          "Cash value accumulation",
          "Flexible beneficiary options",
        ],
      },
      // MetLife Row
      {
        id: "metlife-life-basic",
        name: "MetLife Term Essential",
        carrier: "MetLife",
        tier: "Basic",
        monthlyPremium: 14,
        features: [
          "$50,000 death benefit",
          "Accidental death benefit",
          "Guaranteed issue",
          "24/7 claims support",
        ],
      },
      {
        id: "metlife-life-standard",
        name: "MetLife Term Plus",
        carrier: "MetLife",
        tier: "Standard",
        monthlyPremium: 28,
        features: [
          "$150,000 death benefit",
          "AD&D included",
          "Accelerated death benefit",
          "Spouse coverage",
          "Conversion privilege",
        ],
      },
      {
        id: "metlife-life-premium",
        name: "MetLife Term Premier",
        carrier: "MetLife",
        tier: "Premium",
        monthlyPremium: 52,
        features: [
          "$300,000 death benefit",
          "Comprehensive AD&D",
          "Critical illness rider",
          "Child coverage included",
          "Waiver of premium",
          "Living needs benefit",
        ],
      },
      // Prudential Row
      {
        id: "prudential-life-basic",
        name: "Prudential Simple Term",
        carrier: "Prudential",
        tier: "Basic",
        monthlyPremium: 16,
        features: [
          "$75,000 death benefit",
          "Accidental death benefit",
          "Simplified underwriting",
          "Online account access",
        ],
      },
      {
        id: "prudential-life-standard",
        name: "Prudential Term Flex",
        carrier: "Prudential",
        tier: "Standard",
        monthlyPremium: 30,
        features: [
          "$200,000 death benefit",
          "Full AD&D coverage",
          "Terminal illness benefit",
          "Portable coverage",
          "Premium waiver option",
        ],
      },
      {
        id: "prudential-life-premium",
        name: "Prudential Term Max",
        carrier: "Prudential",
        tier: "Premium",
        monthlyPremium: 55,
        features: [
          "$500,000 death benefit",
          "Enhanced AD&D",
          "Living benefits package",
          "Spouse & child coverage",
          "Guaranteed renewability",
          "Estate planning support",
        ],
      },
    ],
  },
  disability: {
    title: "Short-Term Disability",
    icon: "💼",
    description: "Income protection when you need it most",
    plans: [
      // Default Carrier Row
      {
        id: "disability-basic",
        name: "STD Basic",
        carrier: "Choice Exchange",
        tier: "Basic",
        monthlyPremium: 20,
        features: [
          "50% income replacement",
          "Up to 12 weeks coverage",
          "14-day waiting period",
          "Injury & illness covered",
        ],
      },
      {
        id: "disability-standard",
        name: "STD Plus",
        carrier: "Choice Exchange",
        tier: "Standard",
        monthlyPremium: 35,
        features: [
          "60% income replacement",
          "Up to 26 weeks coverage",
          "7-day waiting period",
          "Mental health coverage",
          "Rehabilitation support",
        ],
        popular: true,
      },
      {
        id: "disability-premium",
        name: "STD Premium",
        carrier: "Choice Exchange",
        tier: "Premium",
        monthlyPremium: 55,
        features: [
          "70% income replacement",
          "Up to 52 weeks coverage",
          "0-day accident waiting period",
          "Pregnancy coverage",
          "Return-to-work incentives",
          "Long-term disability bridge",
        ],
      },
      // Unum Row
      {
        id: "unum-disability-basic",
        name: "Unum STD Core",
        carrier: "Unum",
        tier: "Basic",
        monthlyPremium: 22,
        features: [
          "50% income replacement",
          "Up to 13 weeks coverage",
          "14-day waiting period",
          "Leave management support",
        ],
      },
      {
        id: "unum-disability-standard",
        name: "Unum STD Enhanced",
        carrier: "Unum",
        tier: "Standard",
        monthlyPremium: 38,
        features: [
          "60% income replacement",
          "Up to 26 weeks coverage",
          "7-day waiting period",
          "Behavioral health support",
          "Vocational services",
        ],
      },
      {
        id: "unum-disability-premium",
        name: "Unum STD Complete",
        carrier: "Unum",
        tier: "Premium",
        monthlyPremium: 58,
        features: [
          "70% income replacement",
          "Up to 52 weeks coverage",
          "0-day accident waiting",
          "Maternity coverage",
          "Return-to-work program",
          "LTD integration",
        ],
      },
      // Lincoln Financial Row
      {
        id: "lincoln-disability-basic",
        name: "Lincoln STD Essential",
        carrier: "Lincoln Financial",
        tier: "Basic",
        monthlyPremium: 18,
        features: [
          "50% income replacement",
          "Up to 11 weeks coverage",
          "14-day elimination period",
          "Pre-existing condition coverage",
        ],
      },
      {
        id: "lincoln-disability-standard",
        name: "Lincoln STD Select",
        carrier: "Lincoln Financial",
        tier: "Standard",
        monthlyPremium: 32,
        features: [
          "60% income replacement",
          "Up to 26 weeks coverage",
          "7-day elimination period",
          "Mental health benefits",
          "Survivor benefit",
        ],
      },
      {
        id: "lincoln-disability-premium",
        name: "Lincoln STD Premier",
        carrier: "Lincoln Financial",
        tier: "Premium",
        monthlyPremium: 52,
        features: [
          "70% income replacement",
          "Up to 52 weeks coverage",
          "0/7-day waiting period",
          "Pregnancy & complications",
          "Worksite modification",
          "LTD bridge benefit",
        ],
      },
    ],
  },
  accident: {
    title: "Accident Insurance",
    icon: "🏥",
    description: "Financial protection for unexpected injuries",
    plans: [
      // Default Carrier Row
      {
        id: "accident-basic",
        name: "Accident Basic",
        carrier: "Choice Exchange",
        tier: "Basic",
        monthlyPremium: 12,
        features: [
          "$5,000 accident benefit",
          "ER visit: $250",
          "Hospital admission: $500",
          "Fractures covered",
        ],
      },
      {
        id: "accident-standard",
        name: "Accident Plus",
        carrier: "Choice Exchange",
        tier: "Standard",
        monthlyPremium: 20,
        features: [
          "$10,000 accident benefit",
          "ER visit: $500",
          "Hospital admission: $1,000",
          "Follow-up visits covered",
          "Physical therapy benefit",
        ],
        popular: true,
      },
      {
        id: "accident-premium",
        name: "Accident Premium",
        carrier: "Choice Exchange",
        tier: "Premium",
        monthlyPremium: 35,
        features: [
          "$25,000 accident benefit",
          "ER visit: $750",
          "Hospital admission: $2,000",
          "Ambulance covered",
          "Wellness benefit",
          "Family coverage included",
        ],
      },
      // Aflac Row
      {
        id: "aflac-accident-basic",
        name: "Aflac Accident Advantage",
        carrier: "Aflac",
        tier: "Basic",
        monthlyPremium: 14,
        features: [
          "$7,500 accident benefit",
          "ER visit: $300",
          "Hospital admission: $750",
          "Initial treatment benefit",
        ],
      },
      {
        id: "aflac-accident-standard",
        name: "Aflac Accident Plus",
        carrier: "Aflac",
        tier: "Standard",
        monthlyPremium: 24,
        features: [
          "$15,000 accident benefit",
          "ER visit: $600",
          "Hospital admission: $1,500",
          "Follow-up treatment",
          "Therapy benefits",
        ],
      },
      {
        id: "aflac-accident-premium",
        name: "Aflac Accident Premier",
        carrier: "Aflac",
        tier: "Premium",
        monthlyPremium: 42,
        features: [
          "$30,000 accident benefit",
          "ER visit: $1,000",
          "Hospital admission: $2,500",
          "Ground & air ambulance",
          "Wellness benefit",
          "Organized sports coverage",
        ],
      },
      // Colonial Life Row
      {
        id: "colonial-accident-basic",
        name: "Colonial Accident Core",
        carrier: "Colonial Life",
        tier: "Basic",
        monthlyPremium: 10,
        features: [
          "$5,000 accident benefit",
          "ER visit: $200",
          "Hospital admission: $500",
          "Fracture benefits",
        ],
      },
      {
        id: "colonial-accident-standard",
        name: "Colonial Accident Select",
        carrier: "Colonial Life",
        tier: "Standard",
        monthlyPremium: 18,
        features: [
          "$10,000 accident benefit",
          "ER visit: $400",
          "Hospital admission: $1,000",
          "Follow-up visits",
          "Appliance benefit",
        ],
      },
      {
        id: "colonial-accident-premium",
        name: "Colonial Accident Complete",
        carrier: "Colonial Life",
        tier: "Premium",
        monthlyPremium: 32,
        features: [
          "$20,000 accident benefit",
          "ER visit: $700",
          "Hospital admission: $1,750",
          "Ambulance services",
          "Wellness screening",
          "Family plan available",
        ],
      },
    ],
  },
  critical: {
    title: "Critical Illness",
    icon: "❤️",
    description: "Lump-sum coverage for major health diagnoses",
    plans: [
      // Default Carrier Row
      {
        id: "critical-basic",
        name: "Critical Basic",
        carrier: "Choice Exchange",
        tier: "Basic",
        monthlyPremium: 18,
        features: [
          "$10,000 lump-sum benefit",
          "Cancer coverage",
          "Heart attack & stroke",
          "No waiting period",
        ],
      },
      {
        id: "critical-standard",
        name: "Critical Plus",
        carrier: "Choice Exchange",
        tier: "Standard",
        monthlyPremium: 30,
        features: [
          "$25,000 lump-sum benefit",
          "25+ conditions covered",
          "Partial benefit for early-stage",
          "Recurrence benefit",
          "Wellness screening benefit",
        ],
        popular: true,
      },
      {
        id: "critical-premium",
        name: "Critical Premium",
        carrier: "Choice Exchange",
        tier: "Premium",
        monthlyPremium: 50,
        features: [
          "$50,000 lump-sum benefit",
          "40+ conditions covered",
          "Child coverage included",
          "Multiple claims allowed",
          "Health screening benefit",
          "Survivorship benefit",
        ],
      },
      // Aflac Row
      {
        id: "aflac-critical-basic",
        name: "Aflac Critical Care",
        carrier: "Aflac",
        tier: "Basic",
        monthlyPremium: 20,
        features: [
          "$15,000 lump-sum benefit",
          "Cancer/heart/stroke",
          "Skin cancer benefit",
          "Initial diagnosis benefit",
        ],
      },
      {
        id: "aflac-critical-standard",
        name: "Aflac Critical Plus",
        carrier: "Aflac",
        tier: "Standard",
        monthlyPremium: 35,
        features: [
          "$30,000 lump-sum benefit",
          "30+ conditions covered",
          "Partial critical illness",
          "Recurrence coverage",
          "Health screening",
        ],
      },
      {
        id: "aflac-critical-premium",
        name: "Aflac Critical Premier",
        carrier: "Aflac",
        tier: "Premium",
        monthlyPremium: 58,
        features: [
          "$75,000 lump-sum benefit",
          "Comprehensive conditions",
          "Child coverage",
          "Continuation benefit",
          "Wellness benefit",
          "Survivor benefit",
        ],
      },
      // Allstate Row
      {
        id: "allstate-critical-basic",
        name: "Allstate Critical Essential",
        carrier: "Allstate",
        tier: "Basic",
        monthlyPremium: 16,
        features: [
          "$10,000 lump-sum benefit",
          "Cancer/heart attack/stroke",
          "Coronary artery bypass",
          "30-day waiting period",
        ],
      },
      {
        id: "allstate-critical-standard",
        name: "Allstate Critical Select",
        carrier: "Allstate",
        tier: "Standard",
        monthlyPremium: 28,
        features: [
          "$25,000 lump-sum benefit",
          "20+ conditions",
          "Carcinoma in situ",
          "Additional occurrence",
          "Wellness benefit",
        ],
      },
      {
        id: "allstate-critical-premium",
        name: "Allstate Critical Complete",
        carrier: "Allstate",
        tier: "Premium",
        monthlyPremium: 48,
        features: [
          "$50,000 lump-sum benefit",
          "35+ conditions",
          "Spouse & child coverage",
          "Multiple occurrence",
          "Repatriation benefit",
          "Lodging benefit",
        ],
      },
    ],
  },
  hospital: {
    title: "Hospital Indemnity",
    icon: "🏨",
    description: "Daily cash benefits during hospital stays",
    plans: [
      // Default Carrier Row
      {
        id: "hospital-basic",
        name: "Hospital Basic",
        carrier: "Choice Exchange",
        tier: "Basic",
        monthlyPremium: 25,
        features: [
          "$100/day hospital benefit",
          "Up to 30 days per year",
          "ICU: $200/day",
          "Outpatient surgery: $250",
        ],
      },
      {
        id: "hospital-standard",
        name: "Hospital Plus",
        carrier: "Choice Exchange",
        tier: "Standard",
        monthlyPremium: 40,
        features: [
          "$200/day hospital benefit",
          "Up to 60 days per year",
          "ICU: $400/day",
          "Outpatient surgery: $500",
          "Admission benefit: $750",
        ],
        popular: true,
      },
      {
        id: "hospital-premium",
        name: "Hospital Premium",
        carrier: "Choice Exchange",
        tier: "Premium",
        monthlyPremium: 65,
        features: [
          "$500/day hospital benefit",
          "Unlimited days per year",
          "ICU: $1,000/day",
          "Outpatient surgery: $1,000",
          "Admission benefit: $1,500",
          "Rehab facility covered",
        ],
      },
      // Aflac Row
      {
        id: "aflac-hospital-basic",
        name: "Aflac Hospital Choice",
        carrier: "Aflac",
        tier: "Basic",
        monthlyPremium: 28,
        features: [
          "$150/day hospital benefit",
          "Up to 30 days per year",
          "ICU: $300/day",
          "Outpatient surgery: $300",
        ],
      },
      {
        id: "aflac-hospital-standard",
        name: "Aflac Hospital Plus",
        carrier: "Aflac",
        tier: "Standard",
        monthlyPremium: 45,
        features: [
          "$250/day hospital benefit",
          "Up to 60 days per year",
          "ICU: $500/day",
          "Outpatient surgery: $600",
          "Admission: $1,000",
        ],
      },
      {
        id: "aflac-hospital-premium",
        name: "Aflac Hospital Premier",
        carrier: "Aflac",
        tier: "Premium",
        monthlyPremium: 72,
        features: [
          "$600/day hospital benefit",
          "Unlimited days",
          "ICU: $1,200/day",
          "Outpatient surgery: $1,200",
          "Admission: $2,000",
          "Skilled nursing facility",
        ],
      },
      // Cigna Row
      {
        id: "cigna-hospital-basic",
        name: "Cigna Hospital Core",
        carrier: "Cigna",
        tier: "Basic",
        monthlyPremium: 22,
        features: [
          "$100/day hospital benefit",
          "Up to 31 days per year",
          "ICU: $200/day",
          "ER visit: $150",
        ],
      },
      {
        id: "cigna-hospital-standard",
        name: "Cigna Hospital Enhanced",
        carrier: "Cigna",
        tier: "Standard",
        monthlyPremium: 38,
        features: [
          "$200/day hospital benefit",
          "Up to 60 days per year",
          "ICU: $400/day",
          "ER visit: $300",
          "Admission: $500",
        ],
      },
      {
        id: "cigna-hospital-premium",
        name: "Cigna Hospital Complete",
        carrier: "Cigna",
        tier: "Premium",
        monthlyPremium: 62,
        features: [
          "$400/day hospital benefit",
          "Up to 90 days per year",
          "ICU: $800/day",
          "ER visit: $500",
          "Admission: $1,000",
          "Newborn nursery benefit",
        ],
      },
    ],
  },
  pet: {
    title: "Pet Insurance",
    icon: "🐾",
    description: "Coverage for your furry family members",
    plans: [
      // Default Carrier Row
      {
        id: "pet-basic",
        name: "Pet Basic",
        carrier: "Choice Exchange",
        tier: "Basic",
        monthlyPremium: 20,
        features: [
          "Accidents only coverage",
          "$5,000 annual limit",
          "80% reimbursement",
          "$250 deductible",
        ],
      },
      {
        id: "pet-standard",
        name: "Pet Plus",
        carrier: "Choice Exchange",
        tier: "Standard",
        monthlyPremium: 35,
        features: [
          "Accidents & illness",
          "$10,000 annual limit",
          "90% reimbursement",
          "$150 deductible",
          "Prescription coverage",
        ],
        popular: true,
      },
      {
        id: "pet-premium",
        name: "Pet Premium",
        carrier: "Choice Exchange",
        tier: "Premium",
        monthlyPremium: 55,
        features: [
          "Comprehensive coverage",
          "Unlimited annual limit",
          "90% reimbursement",
          "$100 deductible",
          "Wellness visits included",
          "Dental cleaning covered",
        ],
      },
      // Nationwide Row
      {
        id: "nationwide-pet-basic",
        name: "Nationwide Pet Essentials",
        carrier: "Nationwide",
        tier: "Basic",
        monthlyPremium: 22,
        features: [
          "Accidents only",
          "$7,500 annual limit",
          "70% reimbursement",
          "$250 deductible",
        ],
      },
      {
        id: "nationwide-pet-standard",
        name: "Nationwide Pet Plus",
        carrier: "Nationwide",
        tier: "Standard",
        monthlyPremium: 38,
        features: [
          "Accidents & illness",
          "$10,000 annual limit",
          "80% reimbursement",
          "$200 deductible",
          "Rx food coverage",
        ],
      },
      {
        id: "nationwide-pet-premium",
        name: "Nationwide Whole Pet",
        carrier: "Nationwide",
        tier: "Premium",
        monthlyPremium: 62,
        features: [
          "Comprehensive coverage",
          "Unlimited annual limit",
          "90% reimbursement",
          "$100 deductible",
          "Wellness included",
          "Behavioral coverage",
        ],
      },
      // Pets Best Row
      {
        id: "petsbest-pet-basic",
        name: "Pets Best Essential",
        carrier: "Pets Best",
        tier: "Basic",
        monthlyPremium: 18,
        features: [
          "Accidents only",
          "$5,000 annual limit",
          "80% reimbursement",
          "$200 deductible",
        ],
      },
      {
        id: "petsbest-pet-standard",
        name: "Pets Best Select",
        carrier: "Pets Best",
        tier: "Standard",
        monthlyPremium: 32,
        features: [
          "Accidents & illness",
          "$10,000 annual limit",
          "90% reimbursement",
          "$150 deductible",
          "Exam fee coverage",
        ],
      },
      {
        id: "petsbest-pet-premium",
        name: "Pets Best Elite",
        carrier: "Pets Best",
        tier: "Premium",
        monthlyPremium: 52,
        features: [
          "Comprehensive coverage",
          "Unlimited annual limit",
          "90% reimbursement",
          "$50 deductible",
          "Wellness add-on",
          "Routine care included",
        ],
      },
    ],
  },
};

const BenefitPlans = () => {
  const { benefitType } = useParams<{ benefitType: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const benefitData = benefitType ? benefitPlansData[benefitType] : null;

  if (!benefitData) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Benefit type not found</h1>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSelectPlan = (planId: string, planName: string, premium: number) => {
    setSelectedPlan(planId);
    toast({
      title: "Plan Selected",
      description: `${planName} ($${premium}/mo) has been added to your enrollment.`,
    });
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader activeTab="enrollment" onTabChange={() => {}} />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Navigation */}
          <Button 
            variant="ghost" 
            className="mb-6 gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Enrollment
          </Button>

          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-5xl mb-4 block">{benefitData.icon}</span>
            <h1 className="text-3xl font-bold text-foreground mb-2">{benefitData.title}</h1>
            <p className="text-muted-foreground">{benefitData.description}</p>
          </div>

          {/* Plans Grid - 3 rows of 3 by carrier */}
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Group plans by carrier */}
            {(() => {
              const carriers = [...new Set(benefitData.plans.map(p => p.carrier))];
              return carriers.map((carrier, carrierIndex) => {
                const carrierPlans = benefitData.plans.filter(p => p.carrier === carrier);
                return (
                  <div key={carrier} className="space-y-4">
                    {/* Carrier Header */}
                    <div className="flex items-center gap-3 pb-2 border-b border-border">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        carrierIndex === 0 ? "bg-primary/10 text-primary" :
                        carrierIndex === 1 ? "bg-accent/10 text-accent" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {carrier.charAt(0)}
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">{carrier}</h2>
                      {carrierIndex === 0 && (
                        <Badge variant="outline" className="text-xs">Our Plans</Badge>
                      )}
                    </div>
                    
                    {/* Plans Row */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {carrierPlans.map((plan) => (
                        <Card 
                          key={plan.id}
                          className={`relative transition-all hover:shadow-lg ${
                            plan.popular ? "border-2 border-primary shadow-md" : "border"
                          } ${selectedPlan === plan.id ? "ring-2 ring-accent" : ""}`}
                        >
                          {plan.popular && (
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                              <Star className="h-3 w-3 mr-1" /> Most Popular
                            </Badge>
                          )}
                          <CardHeader className="text-center pb-2">
                            <Badge 
                              variant="outline" 
                              className={`w-fit mx-auto mb-2 ${
                                plan.tier === "Basic" ? "border-muted-foreground text-muted-foreground" :
                                plan.tier === "Standard" ? "border-primary text-primary" :
                                "border-accent text-accent"
                              }`}
                            >
                              {plan.tier}
                            </Badge>
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <div className="mt-2">
                              <span className="text-3xl font-bold text-foreground">${plan.monthlyPremium}</span>
                              <span className="text-muted-foreground text-sm">/month</span>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-3">
                            <ul className="space-y-2 mb-4">
                              {plan.features.slice(0, 4).map((feature, index) => (
                                <li key={index} className="flex items-start gap-2 text-xs">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">{feature}</span>
                                </li>
                              ))}
                              {plan.features.length > 4 && (
                                <li className="text-xs text-muted-foreground pl-5">
                                  +{plan.features.length - 4} more benefits
                                </li>
                              )}
                            </ul>
                            <Button 
                              className="w-full gap-2"
                              size="sm"
                              variant={plan.popular ? "default" : "outline"}
                              onClick={() => handleSelectPlan(plan.id, plan.name, plan.monthlyPremium)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Select Plan
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Comparison Note */}
          <div className="text-center mt-10 text-sm text-muted-foreground">
            <p>All plans are subject to your ICHRA monthly allowance. Premiums shown are employee contributions.</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BenefitPlans;
