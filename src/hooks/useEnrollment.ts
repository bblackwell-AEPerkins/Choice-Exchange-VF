import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EnrollmentStep = 
  | "intent"
  | "account"
  | "about"
  | "household"
  | "coverage"
  | "plans"
  | "review"
  | "submit"
  | "complete";

export interface EnrollmentIntent {
  coverageType: "health" | null;
  coverageFor: "individual" | "family" | null;
  enrollmentReason: "open_enrollment" | "qualifying_event" | null;
}

export interface EnrollmentAccount {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isVerified: boolean;
}

export interface EnrollmentAbout {
  dateOfBirth: string;
  legalSex: "M" | "F" | null;
  ssn: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  citizenship: string;
}

export interface EnrollmentDependent {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: "spouse" | "child" | "domestic_partner";
  ssn: string;
}

export interface EnrollmentHousehold {
  maritalStatus: "single" | "married" | "divorced" | "widowed" | null;
  dependents: EnrollmentDependent[];
  employmentStatus: "employed" | "self_employed" | "unemployed" | "retired" | null;
  employerName: string;
  estimatedIncome: number;
  incomeSources: string[];
}

export interface EnrollmentCoverage {
  stateOfResidence: string;
  desiredStartDate: string;
  qualifyingEventType: string;
  qualifyingEventDate: string;
  hasDocumentation: boolean;
  hasPriorCoverage: boolean;
  priorCoverageEndDate: string;
  tobaccoUse: boolean;
}

export interface EnrollmentPlan {
  medicalPlanId: string | null;
  dentalPlanId: string | null;
  visionPlanId: string | null;
  monthlyPremium: number;
  employerContribution: number;
}

export interface EnrollmentReview {
  informationAccurate: boolean;
  electronicConsent: boolean;
  hipaaAuthorization: boolean;
  attestedAt: string | null;
  ipAddress: string | null;
}

export interface EnrollmentState {
  currentStep: EnrollmentStep;
  userId: string | null;
  intent: EnrollmentIntent;
  account: EnrollmentAccount;
  about: EnrollmentAbout;
  household: EnrollmentHousehold;
  coverage: EnrollmentCoverage;
  plan: EnrollmentPlan;
  review: EnrollmentReview;
  sessionId: string | null;
  lastSaved: string | null;
  
  // Actions
  setStep: (step: EnrollmentStep) => void;
  setUserId: (userId: string | null) => void;
  updateIntent: (data: Partial<EnrollmentIntent>) => void;
  updateAccount: (data: Partial<EnrollmentAccount>) => void;
  updateAbout: (data: Partial<EnrollmentAbout>) => void;
  updateHousehold: (data: Partial<EnrollmentHousehold>) => void;
  addDependent: (dependent: EnrollmentDependent) => void;
  removeDependent: (id: string) => void;
  updateCoverage: (data: Partial<EnrollmentCoverage>) => void;
  updatePlan: (data: Partial<EnrollmentPlan>) => void;
  updateReview: (data: Partial<EnrollmentReview>) => void;
  resetEnrollment: () => void;
  saveProgress: () => void;
}

const initialState = {
  currentStep: "intent" as EnrollmentStep,
  userId: null as string | null,
  intent: {
    coverageType: null,
    coverageFor: null,
    enrollmentReason: null,
  },
  account: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isVerified: false,
  },
  about: {
    dateOfBirth: "",
    legalSex: null,
    ssn: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    citizenship: "",
  },
  household: {
    maritalStatus: null,
    dependents: [],
    employmentStatus: null,
    employerName: "",
    estimatedIncome: 0,
    incomeSources: [],
  },
  coverage: {
    stateOfResidence: "",
    desiredStartDate: "",
    qualifyingEventType: "",
    qualifyingEventDate: "",
    hasDocumentation: false,
    hasPriorCoverage: false,
    priorCoverageEndDate: "",
    tobaccoUse: false,
  },
  plan: {
    medicalPlanId: null,
    dentalPlanId: null,
    visionPlanId: null,
    monthlyPremium: 0,
    employerContribution: 0,
  },
  review: {
    informationAccurate: false,
    electronicConsent: false,
    hipaaAuthorization: false,
    attestedAt: null,
    ipAddress: null,
  },
  sessionId: null,
  lastSaved: null,
};

export const useEnrollment = create<EnrollmentState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      setUserId: (userId) => {
        const currentUserId = get().userId;
        // If user changed, reset all enrollment data
        if (currentUserId && currentUserId !== userId) {
          set({ ...initialState, userId });
        } else {
          set({ userId });
        }
      },

      updateIntent: (data) =>
        set((state) => ({
          intent: { ...state.intent, ...data },
          lastSaved: new Date().toISOString(),
        })),

      updateAccount: (data) =>
        set((state) => ({
          account: { ...state.account, ...data },
          lastSaved: new Date().toISOString(),
        })),

      updateAbout: (data) =>
        set((state) => ({
          about: { ...state.about, ...data },
          lastSaved: new Date().toISOString(),
        })),

      updateHousehold: (data) =>
        set((state) => ({
          household: { ...state.household, ...data },
          lastSaved: new Date().toISOString(),
        })),

      addDependent: (dependent) =>
        set((state) => ({
          household: {
            ...state.household,
            dependents: [...state.household.dependents, dependent],
          },
          lastSaved: new Date().toISOString(),
        })),

      removeDependent: (id) =>
        set((state) => ({
          household: {
            ...state.household,
            dependents: state.household.dependents.filter((d) => d.id !== id),
          },
          lastSaved: new Date().toISOString(),
        })),

      updateCoverage: (data) =>
        set((state) => ({
          coverage: { ...state.coverage, ...data },
          lastSaved: new Date().toISOString(),
        })),

      updatePlan: (data) =>
        set((state) => ({
          plan: { ...state.plan, ...data },
          lastSaved: new Date().toISOString(),
        })),

      updateReview: (data) =>
        set((state) => ({
          review: { ...state.review, ...data },
          lastSaved: new Date().toISOString(),
        })),

      resetEnrollment: () => set(initialState),

      saveProgress: () =>
        set({ lastSaved: new Date().toISOString() }),
    }),
    {
      name: "enrollment-storage",
    }
  )
);

// Helper to get step number from step name
export const getStepNumber = (step: EnrollmentStep): number => {
  const steps: EnrollmentStep[] = [
    "intent",
    "account",
    "about",
    "household",
    "coverage",
    "plans",
    "review",
    "submit",
  ];
  return steps.indexOf(step) + 1;
};

// Helper to get step name from number
export const getStepFromNumber = (num: number): EnrollmentStep => {
  const steps: EnrollmentStep[] = [
    "intent",
    "account",
    "about",
    "household",
    "coverage",
    "plans",
    "review",
    "submit",
  ];
  return steps[num - 1] || "intent";
};
