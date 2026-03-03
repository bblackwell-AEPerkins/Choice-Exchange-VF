import { create } from "zustand";
import { persist } from "zustand/middleware";
import { simulateDelay, generateConfirmationNumber } from "@/lib/mockData";

// ── Types ──────────────────────────────────────────────

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
  coverageType: "health" | "voluntary_only" | null;
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
  voluntarySelections: Record<string, string>; // categoryId -> planId
  newEdgeEnrolled: boolean;
}

export interface EnrollmentReview {
  informationAccurate: boolean;
  electronicConsent: boolean;
  hipaaAuthorization: boolean;
  attestedAt: string | null;
  ipAddress: string | null;
}

interface EnrollmentStoreState {
  // Core state
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

  // DB-layer state (absorbed from useEnrollmentDB)
  applicationId: string | null;
  isLoading: boolean;
  isSaving: boolean;

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

  // Merged from useEnrollmentDB
  submitEnrollment: () => Promise<{ success: boolean; confirmationNumber?: string; error?: string }>;
  canAccessStep: (step: EnrollmentStep) => boolean;
  saveToDatabase: () => void;
}

const initialState = {
  currentStep: "intent" as EnrollmentStep,
  userId: "demo-user-john-doe" as string | null,
  intent: {
    coverageType: "health",
    coverageFor: "individual",
    enrollmentReason: "open_enrollment",
  } as EnrollmentIntent,
  account: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@ameriflex.com",
    phone: "(555) 867-5309",
    isVerified: true,
  },
  about: {
    dateOfBirth: "1988-03-15",
    legalSex: "M",
    ssn: "555-12-3456",
    address1: "742 Evergreen Terrace",
    address2: "",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    citizenship: "us_citizen",
  } as EnrollmentAbout,
  household: {
    maritalStatus: "single",
    dependents: [],
    employmentStatus: "employed",
    employerName: "Ameriflex",
    estimatedIncome: 72000,
    incomeSources: [],
  } as EnrollmentHousehold,
  coverage: {
    stateOfResidence: "TX",
    desiredStartDate: "2026-04-01",
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
    voluntarySelections: {},
    newEdgeEnrolled: false,
  },
  review: {
    informationAccurate: false,
    electronicConsent: false,
    hipaaAuthorization: false,
    attestedAt: null,
    ipAddress: null,
  },
  sessionId: "demo-session" as string | null,
  lastSaved: new Date().toISOString() as string | null,
  applicationId: null as string | null,
  isLoading: false,
  isSaving: false,
};

const useEnrollmentStoreInternal = create<EnrollmentStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      setUserId: (userId) => {
        const currentUserId = get().userId;
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

      saveProgress: () => set({ lastSaved: new Date().toISOString() }),

      saveToDatabase: () => {
        set({ lastSaved: new Date().toISOString() });
      },

      submitEnrollment: async () => {
        const state = get();
        if (!state.userId) {
          return { success: false, error: "No active application" };
        }

        set({ isSaving: true });
        try {
          await simulateDelay(800);
          const confirmationNumber = generateConfirmationNumber();
          get().resetEnrollment();
          return { success: true, confirmationNumber };
         } catch {
          return { success: false, error: "Failed to submit enrollment. Please try again." };
        } finally {
          set({ isSaving: false });
        }
      },

      canAccessStep: (step: EnrollmentStep): boolean => {
        const { intent, account, about, household, userId } = get();
        const isVoluntaryOnly = intent.coverageType === "voluntary_only";

        if (step === "intent") return true;

        // Voluntary-only path: intent → household → plans (skip account/about/coverage)
        if (isVoluntaryOnly) {
          if (step === "household") return !!(intent.coverageType && intent.coverageFor && intent.enrollmentReason);
          if (step === "plans") return !!(household.maritalStatus && household.employmentStatus);
          if (step === "review") return true;
          if (step === "submit") return true;
          if (step === "account" || step === "about" || step === "coverage") return false;
          return true;
        }

        if (step === "account") {
          return !!(intent.coverageType && intent.coverageFor && intent.enrollmentReason);
        }

        if (step === "about") {
          return !!(userId || account.isVerified);
        }

        if (step === "household") {
          return !!(about.dateOfBirth && about.legalSex && about.address1 && about.city && about.state && about.zipCode);
        }

        if (step === "coverage") {
          return !!(household.maritalStatus && household.employmentStatus);
        }

        return true;
      },
    }),
    {
      name: "enrollment-storage",
      version: 2,
    }
  )
);

// Public hook
export function useEnrollmentStore() {
  return useEnrollmentStoreInternal();
}

// Helper to get step number from step name
export const getStepNumber = (step: EnrollmentStep): number => {
  const steps: EnrollmentStep[] = [
    "intent", "account", "about", "household", "coverage", "plans", "review", "submit",
  ];
  return steps.indexOf(step) + 1;
};

// Helper to get step name from number
export const getStepFromNumber = (num: number): EnrollmentStep => {
  const steps: EnrollmentStep[] = [
    "intent", "account", "about", "household", "coverage", "plans", "review", "submit",
  ];
  return steps[num - 1] || "intent";
};
