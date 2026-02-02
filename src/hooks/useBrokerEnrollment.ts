import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MOCK_BROKER_GROUPS, MOCK_BROKER_EARNINGS } from "@/lib/brokerMockData";
import { MOCK_ICHRA_PLANS } from "@/lib/mockData";

export interface BrokerEnrollmentData {
  // Step 1: Individual Profile
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  tobacco: boolean;
  ssn?: string;

  // Step 2: Household
  coverageType: "individual" | "family";
  dependents: Dependent[];
  county?: string;

  // Step 3: Contribution
  groupId: string;
  effectiveDate: string;
  contributionAmount: number;
  contributionMethod: "flat" | "by_family" | "by_class";
  section125: boolean;

  // Step 4: Plan Selection
  selectedPlanId?: string;

  // Step 5: Voluntary Benefits
  voluntaryBenefits: string[];

  // Meta
  currentStep: number;
  status: "in_progress" | "completed";
}

export interface Dependent {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: "spouse" | "child" | "domestic_partner";
}

const INITIAL_DATA: BrokerEnrollmentData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  tobacco: false,
  coverageType: "individual",
  dependents: [],
  groupId: "",
  effectiveDate: "",
  contributionAmount: 0,
  contributionMethod: "flat",
  section125: false,
  voluntaryBenefits: [],
  currentStep: 1,
  status: "in_progress",
};

const STORAGE_KEY = "broker_enrollment_draft";

export function useBrokerEnrollment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [data, setData] = useState<BrokerEnrollmentData>(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Get current step from URL or data
  const currentStep = parseInt(searchParams.get("step") || String(data.currentStep)) || 1;

  // Computed values
  const selectedPlan = MOCK_ICHRA_PLANS.find(p => p.id === data.selectedPlanId);
  const selectedGroup = MOCK_BROKER_GROUPS.find(g => g.id === data.groupId);
  
  const remainingDollars = data.contributionAmount - (selectedPlan?.monthly_premium || 0);
  const netPremium = selectedPlan ? Math.max(0, selectedPlan.monthly_premium - data.contributionAmount) : 0;
  
  // Estimated broker earnings (simple calculation)
  const baseEarnings = 15; // $15 per life base
  const voluntaryBonus = data.voluntaryBenefits.length * 5; // $5 per voluntary benefit
  const estimatedEarnings = baseEarnings + voluntaryBonus;

  const updateData = useCallback((updates: Partial<BrokerEnrollmentData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((step: number) => {
    updateData({ currentStep: step });
    navigate(`/broker/enroll/new?step=${step}`);
  }, [navigate, updateData]);

  const nextStep = useCallback(() => {
    const next = Math.min(currentStep + 1, 6);
    goToStep(next);
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    const prev = Math.max(currentStep - 1, 1);
    goToStep(prev);
  }, [currentStep, goToStep]);

  const saveAndExit = useCallback(() => {
    // Already saved to localStorage
    navigate("/broker/home");
  }, [navigate]);

  const resetEnrollment = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(INITIAL_DATA);
  }, []);

  const submitEnrollment = useCallback(async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Clear draft and mark complete
    updateData({ status: "completed" });
    localStorage.removeItem(STORAGE_KEY);
    
    setIsSubmitting(false);
    return true;
  }, [updateData]);

  // Add dependent helper
  const addDependent = useCallback((dependent: Omit<Dependent, "id">) => {
    const newDependent: Dependent = {
      ...dependent,
      id: `dep-${Date.now()}`,
    };
    updateData({
      dependents: [...data.dependents, newDependent],
    });
  }, [data.dependents, updateData]);

  // Remove dependent helper
  const removeDependent = useCallback((id: string) => {
    updateData({
      dependents: data.dependents.filter(d => d.id !== id),
    });
  }, [data.dependents, updateData]);

  // Toggle voluntary benefit
  const toggleVoluntaryBenefit = useCallback((benefitId: string) => {
    const current = data.voluntaryBenefits;
    const updated = current.includes(benefitId)
      ? current.filter(id => id !== benefitId)
      : [...current, benefitId];
    updateData({ voluntaryBenefits: updated });
  }, [data.voluntaryBenefits, updateData]);

  return {
    data,
    updateData,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    saveAndExit,
    resetEnrollment,
    submitEnrollment,
    isSubmitting,
    
    // Computed
    selectedPlan,
    selectedGroup,
    remainingDollars,
    netPremium,
    estimatedEarnings,
    
    // Helpers
    addDependent,
    removeDependent,
    toggleVoluntaryBenefit,
    
    // Reference data
    groups: MOCK_BROKER_GROUPS,
    plans: MOCK_ICHRA_PLANS,
  };
}
