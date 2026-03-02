import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EnrollmentStepConfig {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  required: boolean; // Cannot be disabled
  order: number;
}

export interface EnrollmentConfigState {
  steps: EnrollmentStepConfig[];
  entryChannel: "barcode" | "hyperlink" | "call_center" | null;
  
  // Actions
  setEntryChannel: (channel: EnrollmentConfigState["entryChannel"]) => void;
  toggleStep: (stepId: string) => void;
  setStepEnabled: (stepId: string, enabled: boolean) => void;
  getEnabledSteps: () => EnrollmentStepConfig[];
  getStepByIndex: (index: number) => EnrollmentStepConfig | undefined;
  isStepEnabled: (stepId: string) => boolean;
}

const DEFAULT_STEPS: EnrollmentStepConfig[] = [
  {
    id: "entry",
    label: "Welcome",
    description: "Client entry point and channel acknowledgment",
    enabled: true,
    required: true,
    order: 0,
  },
  {
    id: "enroll",
    label: "Enroll",
    description: "Capture demographic information, eligibility, and contact information",
    enabled: true,
    required: true,
    order: 1,
  },
  {
    id: "offering",
    label: "New Edge Offering",
    description: "Present the core offering as the primary value proposition",
    enabled: true,
    required: true,
    order: 2,
  },
  {
    id: "crosssell",
    label: "Cross-Sell",
    description: "Present supplemental products aligned with demographic profile",
    enabled: true,
    required: false,
    order: 3,
  },
  {
    id: "payment",
    label: "Payment",
    description: "Capture payment information to activate selected products",
    enabled: true,
    required: true,
    order: 4,
  },
  {
    id: "search",
    label: "CE Search",
    description: "Display profile and pre-determined product recommendations",
    enabled: true,
    required: false,
    order: 5,
  },
];

export const useEnrollmentConfig = create<EnrollmentConfigState>()(
  persist(
    (set, get) => ({
      steps: DEFAULT_STEPS,
      entryChannel: null,

      setEntryChannel: (channel) => set({ entryChannel: channel }),

      toggleStep: (stepId) =>
        set((state) => ({
          steps: state.steps.map((step) =>
            step.id === stepId && !step.required
              ? { ...step, enabled: !step.enabled }
              : step
          ),
        })),

      setStepEnabled: (stepId, enabled) =>
        set((state) => ({
          steps: state.steps.map((step) =>
            step.id === stepId && !step.required
              ? { ...step, enabled }
              : step
          ),
        })),

      getEnabledSteps: () => get().steps.filter((s) => s.enabled).sort((a, b) => a.order - b.order),

      getStepByIndex: (index) => {
        const enabled = get().steps.filter((s) => s.enabled).sort((a, b) => a.order - b.order);
        return enabled[index];
      },

      isStepEnabled: (stepId) => {
        const step = get().steps.find((s) => s.id === stepId);
        return step?.enabled ?? false;
      },
    }),
    {
      name: "enrollment-config-storage",
    }
  )
);
