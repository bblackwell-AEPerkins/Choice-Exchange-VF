// Demo Mode Mock Data
// This file contains all mock data used when running in demo mode

export const DEMO_MODE = true;

// ============================================
// ICHRA PLANS
// ============================================
export interface MockICHRAPlan {
  id: string;
  carrier_name: string;
  plan_name: string;
  plan_type: string;
  metal_tier: string;
  monthly_premium: number;
  deductible: number;
  out_of_pocket_max: number;
  copay_primary: number | null;
  copay_specialist: number | null;
  copay_emergency: number | null;
  coverage_areas: string[];
  features: string[] | null;
  is_hsa_eligible: boolean;
  is_active: boolean;
}

export const MOCK_ICHRA_PLANS: MockICHRAPlan[] = [
  {
    id: "plan-bcbs-bronze-001",
    carrier_name: "Blue Cross Blue Shield",
    plan_name: "Bronze Essential",
    plan_type: "HMO",
    metal_tier: "Bronze",
    monthly_premium: 289,
    deductible: 7500,
    out_of_pocket_max: 9100,
    copay_primary: 40,
    copay_specialist: 80,
    copay_emergency: 500,
    coverage_areas: ["331", "332", "333", "334", "335"],
    features: ["Preventive care covered 100%", "Telehealth included", "Prescription drug coverage"],
    is_hsa_eligible: true,
    is_active: true,
  },
  {
    id: "plan-bcbs-silver-001",
    carrier_name: "Blue Cross Blue Shield",
    plan_name: "Silver Standard",
    plan_type: "PPO",
    metal_tier: "Silver",
    monthly_premium: 425,
    deductible: 4500,
    out_of_pocket_max: 8700,
    copay_primary: 30,
    copay_specialist: 60,
    copay_emergency: 350,
    coverage_areas: ["331", "332", "333", "334", "335"],
    features: ["Nationwide network", "No referrals needed", "Mental health coverage"],
    is_hsa_eligible: false,
    is_active: true,
  },
  {
    id: "plan-aetna-gold-001",
    carrier_name: "Aetna",
    plan_name: "Gold Complete",
    plan_type: "PPO",
    metal_tier: "Gold",
    monthly_premium: 589,
    deductible: 1500,
    out_of_pocket_max: 6000,
    copay_primary: 20,
    copay_specialist: 40,
    copay_emergency: 250,
    coverage_areas: ["331", "332", "333", "334", "335"],
    features: ["Low copays", "Wide specialist network", "Chiropractic coverage"],
    is_hsa_eligible: false,
    is_active: true,
  },
  {
    id: "plan-united-silver-001",
    carrier_name: "UnitedHealthcare",
    plan_name: "Silver Choice",
    plan_type: "HMO",
    metal_tier: "Silver",
    monthly_premium: 399,
    deductible: 5000,
    out_of_pocket_max: 8500,
    copay_primary: 35,
    copay_specialist: 70,
    copay_emergency: 400,
    coverage_areas: ["331", "332", "333", "334", "335", "336"],
    features: ["Virtual care included", "Wellness programs", "24/7 nurse line"],
    is_hsa_eligible: true,
    is_active: true,
  },
  {
    id: "plan-cigna-bronze-001",
    carrier_name: "Cigna",
    plan_name: "Bronze Saver",
    plan_type: "EPO",
    metal_tier: "Bronze",
    monthly_premium: 265,
    deductible: 8000,
    out_of_pocket_max: 9450,
    copay_primary: 50,
    copay_specialist: 100,
    copay_emergency: 550,
    coverage_areas: ["331", "332", "333"],
    features: ["Lowest premium option", "Preventive care covered", "HSA compatible"],
    is_hsa_eligible: true,
    is_active: true,
  },
  {
    id: "plan-humana-gold-001",
    carrier_name: "Humana",
    plan_name: "Gold Plus",
    plan_type: "PPO",
    metal_tier: "Gold",
    monthly_premium: 615,
    deductible: 1200,
    out_of_pocket_max: 5500,
    copay_primary: 15,
    copay_specialist: 35,
    copay_emergency: 200,
    coverage_areas: ["331", "332", "333", "334", "335", "336", "337"],
    features: ["Comprehensive coverage", "Gym membership discounts", "Hearing aid coverage"],
    is_hsa_eligible: false,
    is_active: true,
  },
  {
    id: "plan-kaiser-platinum-001",
    carrier_name: "Kaiser Permanente",
    plan_name: "Platinum Premier",
    plan_type: "HMO",
    metal_tier: "Platinum",
    monthly_premium: 785,
    deductible: 0,
    out_of_pocket_max: 4000,
    copay_primary: 10,
    copay_specialist: 20,
    copay_emergency: 150,
    coverage_areas: ["331", "332"],
    features: ["No deductible", "Integrated care", "Minimal out-of-pocket"],
    is_hsa_eligible: false,
    is_active: true,
  },
  {
    id: "plan-molina-silver-001",
    carrier_name: "Molina Healthcare",
    plan_name: "Silver Value",
    plan_type: "HMO",
    metal_tier: "Silver",
    monthly_premium: 375,
    deductible: 4800,
    out_of_pocket_max: 8200,
    copay_primary: 25,
    copay_specialist: 55,
    copay_emergency: 375,
    coverage_areas: ["331", "332", "333", "334", "335"],
    features: ["Affordable option", "Dental discount", "Transportation assistance"],
    is_hsa_eligible: false,
    is_active: true,
  },
];

// ============================================
// MEMBER EVENTS
// ============================================
export interface MockMemberEvent {
  id: string;
  individual_id: string;
  event_type: string;
  event_category: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date?: string | null;
  status: string;
  provider_name: string | null;
  provider_specialty: string | null;
  facility_name: string | null;
  facility_address: string | null;
  billed_amount: number | null;
  allowed_amount: number | null;
  plan_paid: number | null;
  member_responsibility: number | null;
  medication_name: string | null;
  dosage: string | null;
  quantity: number | null;
  refills_remaining: number | null;
  pharmacy_name: string | null;
  appointment_type: string | null;
  confirmation_number: string | null;
  notes: string | null;
  is_recurring: boolean;
  parent_event_id: string | null;
  attachments: unknown[];
  created_at: string;
  updated_at: string;
}

const MEMBER_ID = "demo-individual-001";

export const MOCK_MEMBER_EVENTS: MockMemberEvent[] = [
  {
    id: "evt-claim-001",
    individual_id: MEMBER_ID,
    event_type: "claim",
    event_category: "medical",
    title: "Annual Wellness Exam",
    description: "Routine annual physical examination with comprehensive health screening",
    event_date: "2025-01-10T09:00:00Z",
    status: "completed",
    provider_name: "Dr. Sarah Chen",
    provider_specialty: "Primary Care",
    facility_name: "Miami Medical Center",
    facility_address: "1234 Medical Center Dr, Miami, FL 33101",
    billed_amount: 350,
    allowed_amount: 280,
    plan_paid: 280,
    member_responsibility: 0,
    medication_name: null,
    dosage: null,
    quantity: null,
    refills_remaining: null,
    pharmacy_name: null,
    appointment_type: null,
    confirmation_number: "CLM-20250110-001",
    notes: "Preventive care - covered 100%",
    is_recurring: false,
    parent_event_id: null,
    attachments: [],
    created_at: "2025-01-10T09:00:00Z",
    updated_at: "2025-01-12T14:00:00Z",
  },
  {
    id: "evt-claim-002",
    individual_id: MEMBER_ID,
    event_type: "claim",
    event_category: "medical",
    title: "Cardiology Consultation",
    description: "Follow-up consultation with cardiologist including EKG",
    event_date: "2025-01-05T14:30:00Z",
    status: "completed",
    provider_name: "Dr. Michael Roberts",
    provider_specialty: "Cardiology",
    facility_name: "Heart Health Clinic",
    facility_address: "5678 Heart Health Blvd, Miami, FL 33102",
    billed_amount: 425,
    allowed_amount: 340,
    plan_paid: 272,
    member_responsibility: 68,
    medication_name: null,
    dosage: null,
    quantity: null,
    refills_remaining: null,
    pharmacy_name: null,
    appointment_type: null,
    confirmation_number: "CLM-20250105-002",
    notes: null,
    is_recurring: false,
    parent_event_id: null,
    attachments: [],
    created_at: "2025-01-05T14:30:00Z",
    updated_at: "2025-01-08T10:00:00Z",
  },
  {
    id: "evt-rx-001",
    individual_id: MEMBER_ID,
    event_type: "prescription",
    event_category: "pharmacy",
    title: "Lisinopril 10mg",
    description: "Blood pressure medication - 90 day supply",
    event_date: "2025-01-08T00:00:00Z",
    status: "completed",
    provider_name: "Dr. Sarah Chen",
    provider_specialty: "Primary Care",
    facility_name: null,
    facility_address: null,
    billed_amount: 45,
    allowed_amount: 45,
    plan_paid: 35,
    member_responsibility: 10,
    medication_name: "Lisinopril",
    dosage: "10mg",
    quantity: 90,
    refills_remaining: 3,
    pharmacy_name: "CVS Pharmacy",
    appointment_type: null,
    confirmation_number: "RX-20250108-001",
    notes: "Take once daily in the morning",
    is_recurring: true,
    parent_event_id: null,
    attachments: [],
    created_at: "2025-01-08T00:00:00Z",
    updated_at: "2025-01-08T00:00:00Z",
  },
  {
    id: "evt-apt-001",
    individual_id: MEMBER_ID,
    event_type: "appointment",
    event_category: "medical",
    title: "Cardiology Follow-up",
    description: "6-month cardiology follow-up appointment",
    event_date: "2025-02-05T14:00:00Z",
    status: "scheduled",
    provider_name: "Dr. Michael Roberts",
    provider_specialty: "Cardiology",
    facility_name: "Heart Health Clinic",
    facility_address: "5678 Heart Health Blvd, Miami, FL 33102",
    billed_amount: null,
    allowed_amount: null,
    plan_paid: null,
    member_responsibility: null,
    medication_name: null,
    dosage: null,
    quantity: null,
    refills_remaining: null,
    pharmacy_name: null,
    appointment_type: "Follow-up Visit",
    confirmation_number: "APT-20250205-001",
    notes: "Bring list of current medications",
    is_recurring: false,
    parent_event_id: null,
    attachments: [],
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const filterPlansByZip = (zip: string): MockICHRAPlan[] => {
  if (!zip || zip.length < 3) return MOCK_ICHRA_PLANS;
  const prefix = zip.substring(0, 3);
  const filtered = MOCK_ICHRA_PLANS.filter(p => p.coverage_areas.includes(prefix));
  return filtered.length > 0 ? filtered : MOCK_ICHRA_PLANS;
};

export const generateConfirmationNumber = (): string => {
  return `CHX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};
