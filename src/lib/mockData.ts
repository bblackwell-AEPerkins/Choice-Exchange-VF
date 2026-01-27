// Demo Mode Mock Data
// This file contains all mock data used when running in demo mode

export const DEMO_MODE = true;

// ============================================
// MEMBER PROFILE
// ============================================
export interface MockMemberProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "M" | "F" | "U";
  external_member_id: string;
  email: string;
  phone: string;
  address: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip_code: string;
  };
}

export const MOCK_MEMBER: MockMemberProfile = {
  id: "demo-individual-001",
  user_id: "demo-user-001",
  first_name: "Banks",
  last_name: "Blackwell",
  date_of_birth: "1985-03-15",
  gender: "M",
  external_member_id: "CHX-2024-78392",
  email: "banksblackwell@gmail.com",
  phone: "(305) 555-1234",
  address: {
    address1: "1234 Sunset Boulevard",
    address2: "Apt 5B",
    city: "Miami",
    state: "FL",
    zip_code: "33101",
  },
};

// ============================================
// EMPLOYERS & ICHRA OFFERS
// ============================================
export interface MockEmployer {
  id: string;
  name: string;
  email_domain: string;
  logo_url: string | null;
  is_active: boolean;
}

export interface MockICHRAOffer {
  id: string;
  employer_id: string;
  monthly_allowance: number;
  effective_date: string;
  enrollment_start_date: string;
  enrollment_end_date: string;
  plan_year_start: string;
  plan_year_end: string;
  is_active: boolean;
  employer?: MockEmployer;
}

export const MOCK_EMPLOYERS: MockEmployer[] = [
  {
    id: "emp-techcorp-001",
    name: "TechCorp Inc.",
    email_domain: "gmail.com",
    logo_url: null,
    is_active: true,
  },
  {
    id: "emp-innovate-002",
    name: "Innovate Solutions",
    email_domain: "innovate.com",
    logo_url: null,
    is_active: true,
  },
];

export const MOCK_ICHRA_OFFERS: MockICHRAOffer[] = [
  {
    id: "offer-techcorp-2025",
    employer_id: "emp-techcorp-001",
    monthly_allowance: 800,
    effective_date: "2025-01-01",
    enrollment_start_date: "2024-11-01",
    enrollment_end_date: "2025-02-28",
    plan_year_start: "2025-01-01",
    plan_year_end: "2025-12-31",
    is_active: true,
    employer: MOCK_EMPLOYERS[0],
  },
];

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
// COVERAGE ENROLLMENTS
// ============================================
export interface MockCoverageEnrollment {
  id: string;
  individual_id: string;
  plan_id: string;
  plan_name: string;
  effective_date: string;
  termination_date: string | null;
  status: "Active" | "Terminated" | "Pending" | "COBRA";
  maintenance_action: "New" | "Change" | "Termination" | "Reinstatement";
}

export const MOCK_COVERAGE_ENROLLMENT: MockCoverageEnrollment = {
  id: "cov-001",
  individual_id: MOCK_MEMBER.id,
  plan_id: "plan-bcbs-silver-001",
  plan_name: "ICHRA Plus PPO",
  effective_date: "2024-01-01",
  termination_date: null,
  status: "Active",
  maintenance_action: "New",
};

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
  attachments: any[];
  created_at: string;
  updated_at: string;
}

export const MOCK_MEMBER_EVENTS: MockMemberEvent[] = [
  // Claims
  {
    id: "evt-claim-001",
    individual_id: MOCK_MEMBER.id,
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
    individual_id: MOCK_MEMBER.id,
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
    id: "evt-claim-003",
    individual_id: MOCK_MEMBER.id,
    event_type: "claim",
    event_category: "medical",
    title: "Lab Work - Comprehensive Panel",
    description: "Complete blood count, metabolic panel, lipid panel, and A1C",
    event_date: "2024-12-15T08:00:00Z",
    status: "completed",
    provider_name: "LabCorp",
    provider_specialty: "Laboratory",
    facility_name: "LabCorp Patient Service Center",
    facility_address: "910 Lab Way, Miami, FL 33103",
    billed_amount: 520,
    allowed_amount: 185,
    plan_paid: 148,
    member_responsibility: 37,
    medication_name: null,
    dosage: null,
    quantity: null,
    refills_remaining: null,
    pharmacy_name: null,
    appointment_type: null,
    confirmation_number: "CLM-20241215-003",
    notes: null,
    is_recurring: false,
    parent_event_id: null,
    attachments: [],
    created_at: "2024-12-15T08:00:00Z",
    updated_at: "2024-12-18T09:00:00Z",
  },
  {
    id: "evt-claim-004",
    individual_id: MOCK_MEMBER.id,
    event_type: "claim",
    event_category: "medical",
    title: "Physical Therapy Session",
    description: "PT session for lower back pain management",
    event_date: "2024-12-01T10:00:00Z",
    status: "completed",
    provider_name: "Dr. Amanda Torres",
    provider_specialty: "Physical Therapy",
    facility_name: "Miami PT & Wellness",
    facility_address: "456 Wellness Ave, Miami, FL 33104",
    billed_amount: 175,
    allowed_amount: 140,
    plan_paid: 112,
    member_responsibility: 28,
    medication_name: null,
    dosage: null,
    quantity: null,
    refills_remaining: null,
    pharmacy_name: null,
    appointment_type: null,
    confirmation_number: "CLM-20241201-004",
    notes: null,
    is_recurring: true,
    parent_event_id: null,
    attachments: [],
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2024-12-03T14:00:00Z",
  },
  {
    id: "evt-claim-005",
    individual_id: MOCK_MEMBER.id,
    event_type: "claim",
    event_category: "medical",
    title: "Urgent Care Visit",
    description: "Treatment for acute sinus infection",
    event_date: "2024-11-20T18:30:00Z",
    status: "completed",
    provider_name: "Dr. Kevin Park",
    provider_specialty: "Urgent Care",
    facility_name: "QuickCare Urgent Care",
    facility_address: "789 Quick Care Ln, Miami, FL 33105",
    billed_amount: 295,
    allowed_amount: 220,
    plan_paid: 150,
    member_responsibility: 70,
    medication_name: null,
    dosage: null,
    quantity: null,
    refills_remaining: null,
    pharmacy_name: null,
    appointment_type: null,
    confirmation_number: "CLM-20241120-005",
    notes: "After-hours visit",
    is_recurring: false,
    parent_event_id: null,
    attachments: [],
    created_at: "2024-11-20T18:30:00Z",
    updated_at: "2024-11-25T11:00:00Z",
  },
  // Prescriptions
  {
    id: "evt-rx-001",
    individual_id: MOCK_MEMBER.id,
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
    id: "evt-rx-002",
    individual_id: MOCK_MEMBER.id,
    event_type: "prescription",
    event_category: "pharmacy",
    title: "Atorvastatin 20mg",
    description: "Cholesterol medication - 90 day supply",
    event_date: "2025-01-08T00:00:00Z",
    status: "completed",
    provider_name: "Dr. Sarah Chen",
    provider_specialty: "Primary Care",
    facility_name: null,
    facility_address: null,
    billed_amount: 65,
    allowed_amount: 65,
    plan_paid: 50,
    member_responsibility: 15,
    medication_name: "Atorvastatin",
    dosage: "20mg",
    quantity: 90,
    refills_remaining: 2,
    pharmacy_name: "CVS Pharmacy",
    appointment_type: null,
    confirmation_number: "RX-20250108-002",
    notes: "Take at bedtime",
    is_recurring: true,
    parent_event_id: null,
    attachments: [],
    created_at: "2025-01-08T00:00:00Z",
    updated_at: "2025-01-08T00:00:00Z",
  },
  {
    id: "evt-rx-003",
    individual_id: MOCK_MEMBER.id,
    event_type: "prescription",
    event_category: "pharmacy",
    title: "Metformin 500mg",
    description: "Diabetes medication - 30 day supply",
    event_date: "2024-12-20T00:00:00Z",
    status: "completed",
    provider_name: "Dr. Sarah Chen",
    provider_specialty: "Primary Care",
    facility_name: null,
    facility_address: null,
    billed_amount: 25,
    allowed_amount: 25,
    plan_paid: 20,
    member_responsibility: 5,
    medication_name: "Metformin",
    dosage: "500mg",
    quantity: 60,
    refills_remaining: 5,
    pharmacy_name: "Walgreens",
    appointment_type: null,
    confirmation_number: "RX-20241220-003",
    notes: "Take twice daily with meals",
    is_recurring: true,
    parent_event_id: null,
    attachments: [],
    created_at: "2024-12-20T00:00:00Z",
    updated_at: "2024-12-20T00:00:00Z",
  },
  {
    id: "evt-rx-004",
    individual_id: MOCK_MEMBER.id,
    event_type: "prescription",
    event_category: "pharmacy",
    title: "Amoxicillin 500mg",
    description: "Antibiotic for sinus infection - 10 day course",
    event_date: "2024-11-20T00:00:00Z",
    status: "completed",
    provider_name: "Dr. Kevin Park",
    provider_specialty: "Urgent Care",
    facility_name: null,
    facility_address: null,
    billed_amount: 18,
    allowed_amount: 18,
    plan_paid: 8,
    member_responsibility: 10,
    medication_name: "Amoxicillin",
    dosage: "500mg",
    quantity: 30,
    refills_remaining: 0,
    pharmacy_name: "CVS Pharmacy",
    appointment_type: null,
    confirmation_number: "RX-20241120-004",
    notes: "Take three times daily until finished",
    is_recurring: false,
    parent_event_id: null,
    attachments: [],
    created_at: "2024-11-20T00:00:00Z",
    updated_at: "2024-11-20T00:00:00Z",
  },
  // Upcoming Appointments
  {
    id: "evt-apt-001",
    individual_id: MOCK_MEMBER.id,
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
  {
    id: "evt-apt-002",
    individual_id: MOCK_MEMBER.id,
    event_type: "appointment",
    event_category: "medical",
    title: "Dental Cleaning",
    description: "Routine dental cleaning and exam",
    event_date: "2025-02-12T09:30:00Z",
    status: "scheduled",
    provider_name: "Dr. Lisa Wong",
    provider_specialty: "Dentistry",
    facility_name: "Bright Smile Dental",
    facility_address: "321 Dental Plaza, Miami, FL 33106",
    billed_amount: null,
    allowed_amount: null,
    plan_paid: null,
    member_responsibility: null,
    medication_name: null,
    dosage: null,
    quantity: null,
    refills_remaining: null,
    pharmacy_name: null,
    appointment_type: "Preventive",
    confirmation_number: "APT-20250212-002",
    notes: null,
    is_recurring: true,
    parent_event_id: null,
    attachments: [],
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
  },
  {
    id: "evt-apt-003",
    individual_id: MOCK_MEMBER.id,
    event_type: "appointment",
    event_category: "medical",
    title: "Eye Exam",
    description: "Annual comprehensive eye exam",
    event_date: "2025-03-01T11:00:00Z",
    status: "scheduled",
    provider_name: "Dr. Robert Kim",
    provider_specialty: "Optometry",
    facility_name: "VisionFirst Eye Care",
    facility_address: "555 Vision Lane, Miami, FL 33107",
    billed_amount: null,
    allowed_amount: null,
    plan_paid: null,
    member_responsibility: null,
    medication_name: null,
    dosage: null,
    quantity: null,
    refills_remaining: null,
    pharmacy_name: null,
    appointment_type: "Annual Exam",
    confirmation_number: "APT-20250301-003",
    notes: "Bring current glasses/contacts",
    is_recurring: true,
    parent_event_id: null,
    attachments: [],
    created_at: "2025-01-20T00:00:00Z",
    updated_at: "2025-01-20T00:00:00Z",
  },
  // Visits / Lab Results
  {
    id: "evt-visit-001",
    individual_id: MOCK_MEMBER.id,
    event_type: "visit",
    event_category: "medical",
    title: "Primary Care Visit",
    description: "Routine check-up with primary care physician",
    event_date: "2024-10-15T10:00:00Z",
    status: "completed",
    provider_name: "Dr. Sarah Chen",
    provider_specialty: "Primary Care",
    facility_name: "Miami Medical Center",
    facility_address: "1234 Medical Center Dr, Miami, FL 33101",
    billed_amount: 250,
    allowed_amount: 200,
    plan_paid: 160,
    member_responsibility: 40,
    medication_name: null,
    dosage: null,
    quantity: null,
    refills_remaining: null,
    pharmacy_name: null,
    appointment_type: "Office Visit",
    confirmation_number: null,
    notes: "All vitals normal",
    is_recurring: false,
    parent_event_id: null,
    attachments: [],
    created_at: "2024-10-15T10:00:00Z",
    updated_at: "2024-10-15T10:00:00Z",
  },
  {
    id: "evt-lab-001",
    individual_id: MOCK_MEMBER.id,
    event_type: "lab_result",
    event_category: "medical",
    title: "Blood Test Results",
    description: "Results from comprehensive metabolic panel",
    event_date: "2024-12-18T00:00:00Z",
    status: "completed",
    provider_name: "LabCorp",
    provider_specialty: "Laboratory",
    facility_name: "LabCorp Patient Service Center",
    facility_address: "910 Lab Way, Miami, FL 33103",
    billed_amount: null,
    allowed_amount: null,
    plan_paid: null,
    member_responsibility: null,
    medication_name: null,
    dosage: null,
    quantity: null,
    refills_remaining: null,
    pharmacy_name: null,
    appointment_type: null,
    confirmation_number: null,
    notes: "All values within normal range. A1C: 6.2%",
    is_recurring: false,
    parent_event_id: "evt-claim-003",
    attachments: [],
    created_at: "2024-12-18T00:00:00Z",
    updated_at: "2024-12-18T00:00:00Z",
  },
  // Subscription events
  {
    id: "evt-sub-001",
    individual_id: MOCK_MEMBER.id,
    event_type: "subscription",
    event_category: "subscription",
    title: "Primary Care Subscription",
    description: "Monthly primary care subscription with Dr. Sarah Chen",
    event_date: "2025-01-01T00:00:00Z",
    status: "active",
    provider_name: "Dr. Sarah Chen",
    provider_specialty: "Primary Care",
    facility_name: "Miami Medical Center",
    facility_address: "1234 Medical Center Dr, Miami, FL 33101",
    billed_amount: 99,
    allowed_amount: 99,
    plan_paid: 99,
    member_responsibility: 0,
    medication_name: null,
    dosage: null,
    quantity: null,
    refills_remaining: null,
    pharmacy_name: null,
    appointment_type: null,
    confirmation_number: "SUB-PC-001",
    notes: "Unlimited primary care visits included",
    is_recurring: true,
    parent_event_id: null,
    attachments: [],
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
];

// ============================================
// ICHRA ENROLLMENT
// ============================================
export interface MockICHRAEnrollment {
  id: string;
  individual_id: string;
  ichra_offer_id: string;
  status: "not_started" | "in_progress" | "enrolled" | "waived" | "pending_verification";
  selected_plan_id: string | null;
  external_carrier_name: string | null;
  external_plan_name: string | null;
  external_plan_type: string | null;
  external_monthly_premium: number | null;
  external_policy_number: string | null;
  external_effective_date: string | null;
  coverage_zip_code: string | null;
  waiver_reason: string | null;
  waiver_date: string | null;
  attested_at: string | null;
  attested_accurate: boolean;
  enrollment_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const MOCK_ICHRA_ENROLLMENT: MockICHRAEnrollment = {
  id: "ichra-enroll-001",
  individual_id: MOCK_MEMBER.id,
  ichra_offer_id: MOCK_ICHRA_OFFERS[0].id,
  status: "enrolled",
  selected_plan_id: "plan-bcbs-silver-001",
  external_carrier_name: null,
  external_plan_name: null,
  external_plan_type: null,
  external_monthly_premium: null,
  external_policy_number: null,
  external_effective_date: null,
  coverage_zip_code: "33101",
  waiver_reason: null,
  waiver_date: null,
  attested_at: "2024-12-15T10:30:00Z",
  attested_accurate: true,
  enrollment_completed_at: "2024-12-15T10:30:00Z",
  created_at: "2024-12-01T09:00:00Z",
  updated_at: "2024-12-15T10:30:00Z",
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Simulate async delay for realistic UX
 */
export const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Filter plans by ZIP code prefix
 */
export const filterPlansByZip = (zip: string): MockICHRAPlan[] => {
  if (!zip || zip.length < 3) return MOCK_ICHRA_PLANS;
  const prefix = zip.substring(0, 3);
  const filtered = MOCK_ICHRA_PLANS.filter(p => p.coverage_areas.includes(prefix));
  // If no plans match, return all plans (fallback for demo)
  return filtered.length > 0 ? filtered : MOCK_ICHRA_PLANS;
};

/**
 * Filter events by type
 */
export const filterEventsByType = (eventType?: string): MockMemberEvent[] => {
  if (!eventType) return MOCK_MEMBER_EVENTS;
  return MOCK_MEMBER_EVENTS.filter(e => e.event_type === eventType);
};

/**
 * Get employer by email domain
 */
export const getEmployerByDomain = (email: string): MockEmployer | null => {
  const domain = email.split("@")[1];
  return MOCK_EMPLOYERS.find(e => e.email_domain === domain) || MOCK_EMPLOYERS[0]; // Default to TechCorp for demo
};

/**
 * Get active offer for employer
 */
export const getOfferForEmployer = (employerId: string): MockICHRAOffer | null => {
  return MOCK_ICHRA_OFFERS.find(o => o.employer_id === employerId && o.is_active) || null;
};

/**
 * Generate a confirmation number
 */
export const generateConfirmationNumber = (): string => {
  return `CHX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};
