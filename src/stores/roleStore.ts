import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'broker' | 'employer' | 'individual' | null;

interface RoleState {
  role: UserRole;
  workspaceId: string | null;
  isAuthenticated: boolean;
  featureFlags: {
    voluntaryBenefitsEnabled: boolean;
    reportingEnabled: boolean;
    whiteLabelEnabled: boolean;
  };
  // Actions
  setRole: (role: UserRole) => void;
  setWorkspaceId: (id: string) => void;
  setAuthenticated: (auth: boolean) => void;
  setFeatureFlags: (flags: Partial<RoleState['featureFlags']>) => void;
  clearSession: () => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: null,
      workspaceId: null,
      isAuthenticated: false,
      featureFlags: {
        voluntaryBenefitsEnabled: true,
        reportingEnabled: true,
        whiteLabelEnabled: false,
      },
      setRole: (role) => set({ role }),
      setWorkspaceId: (workspaceId) => set({ workspaceId }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setFeatureFlags: (flags) =>
        set((state) => ({
          featureFlags: { ...state.featureFlags, ...flags },
        })),
      clearSession: () =>
        set({
          role: null,
          workspaceId: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'role-storage',
    }
  )
);
