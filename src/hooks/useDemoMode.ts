import { useState, useCallback } from "react";
import {
  DEMO_MODE,
  MOCK_MEMBER,
  MOCK_MEMBER_EVENTS,
  MOCK_ICHRA_PLANS,
  MOCK_EMPLOYERS,
  MOCK_ICHRA_OFFERS,
  MOCK_COVERAGE_ENROLLMENT,
  MOCK_ICHRA_ENROLLMENT,
  simulateDelay,
  filterPlansByZip,
  filterEventsByType,
  getEmployerByDomain,
  getOfferForEmployer,
  generateConfirmationNumber,
  type MockMemberProfile,
  type MockMemberEvent,
  type MockICHRAPlan,
  type MockEmployer,
  type MockICHRAOffer,
  type MockCoverageEnrollment,
  type MockICHRAEnrollment,
} from "@/lib/mockData";

// LocalStorage keys for enrollment persistence
const ENROLLMENT_STORAGE_KEY = "demo_enrollment_data";
const ICHRA_ENROLLMENT_STORAGE_KEY = "demo_ichra_enrollment";

interface EnrollmentLocalData {
  currentStep: string;
  intent: any;
  about: any;
  household: any;
  coverage: any;
  plan: any;
  review: any;
  confirmationNumber?: string;
  submittedAt?: string;
}

/**
 * Central hook for demo mode data access
 * Provides all mock data with simulated delays for realistic UX
 */
export function useDemoMode() {
  const [loading, setLoading] = useState(false);

  // Get member profile
  const getMemberProfile = useCallback(async (): Promise<MockMemberProfile> => {
    setLoading(true);
    await simulateDelay(200);
    setLoading(false);
    return MOCK_MEMBER;
  }, []);

  // Get member events with optional filtering
  const getMemberEvents = useCallback(async (options?: {
    eventType?: string;
    eventCategory?: string;
    status?: string;
    limit?: number;
  }): Promise<MockMemberEvent[]> => {
    setLoading(true);
    await simulateDelay(300);
    
    let events = [...MOCK_MEMBER_EVENTS];
    
    if (options?.eventType) {
      events = events.filter(e => e.event_type === options.eventType);
    }
    if (options?.eventCategory) {
      events = events.filter(e => e.event_category === options.eventCategory);
    }
    if (options?.status) {
      events = events.filter(e => e.status === options.status);
    }
    
    // Sort by date descending
    events.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
    
    if (options?.limit) {
      events = events.slice(0, options.limit);
    }
    
    setLoading(false);
    return events;
  }, []);

  // Get plans by ZIP code
  const getPlans = useCallback(async (zipCode: string): Promise<MockICHRAPlan[]> => {
    setLoading(true);
    await simulateDelay(400);
    const plans = filterPlansByZip(zipCode);
    setLoading(false);
    return plans;
  }, []);

  // Get employer by email domain
  const getEmployer = useCallback(async (email: string): Promise<MockEmployer | null> => {
    await simulateDelay(200);
    return getEmployerByDomain(email);
  }, []);

  // Get ICHRA offer for employer
  const getICHRAOffer = useCallback(async (employerId: string): Promise<MockICHRAOffer | null> => {
    await simulateDelay(200);
    const offer = getOfferForEmployer(employerId);
    if (offer) {
      // Attach employer data
      const employer = MOCK_EMPLOYERS.find(e => e.id === employerId);
      return { ...offer, employer };
    }
    return null;
  }, []);

  // Get coverage enrollment
  const getCoverageEnrollment = useCallback(async (): Promise<MockCoverageEnrollment | null> => {
    await simulateDelay(200);
    return MOCK_COVERAGE_ENROLLMENT;
  }, []);

  // ICHRA Enrollment helpers
  const getICHRAEnrollment = useCallback(async (): Promise<MockICHRAEnrollment | null> => {
    await simulateDelay(200);
    // Check localStorage first for in-progress enrollment
    const stored = localStorage.getItem(ICHRA_ENROLLMENT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return MOCK_ICHRA_ENROLLMENT;
  }, []);

  const saveICHRAEnrollment = useCallback((data: Partial<MockICHRAEnrollment>) => {
    const current = localStorage.getItem(ICHRA_ENROLLMENT_STORAGE_KEY);
    const existing = current ? JSON.parse(current) : MOCK_ICHRA_ENROLLMENT;
    const updated = { ...existing, ...data, updated_at: new Date().toISOString() };
    localStorage.setItem(ICHRA_ENROLLMENT_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }, []);

  // Enrollment application helpers
  const getEnrollmentData = useCallback((): EnrollmentLocalData | null => {
    const stored = localStorage.getItem(ENROLLMENT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }, []);

  const saveEnrollmentStep = useCallback((data: Partial<EnrollmentLocalData>) => {
    const current = localStorage.getItem(ENROLLMENT_STORAGE_KEY);
    const existing = current ? JSON.parse(current) : {};
    const updated = { ...existing, ...data };
    localStorage.setItem(ENROLLMENT_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }, []);

  const submitEnrollment = useCallback(async (): Promise<{ success: boolean; confirmationNumber?: string; error?: string }> => {
    setLoading(true);
    await simulateDelay(800);
    
    try {
      const confirmationNumber = generateConfirmationNumber();
      saveEnrollmentStep({
        confirmationNumber,
        submittedAt: new Date().toISOString(),
      });
      
      setLoading(false);
      return { success: true, confirmationNumber };
    } catch (error) {
      setLoading(false);
      return { success: false, error: "Failed to submit enrollment" };
    }
  }, [saveEnrollmentStep]);

  const resetEnrollment = useCallback(() => {
    localStorage.removeItem(ENROLLMENT_STORAGE_KEY);
  }, []);

  const resetICHRAEnrollment = useCallback(() => {
    localStorage.removeItem(ICHRA_ENROLLMENT_STORAGE_KEY);
  }, []);

  return {
    // State
    loading,
    isDemoMode: DEMO_MODE,
    
    // Member data
    getMemberProfile,
    getMemberEvents,
    getCoverageEnrollment,
    
    // Plans
    getPlans,
    
    // Employer/ICHRA
    getEmployer,
    getICHRAOffer,
    getICHRAEnrollment,
    saveICHRAEnrollment,
    resetICHRAEnrollment,
    
    // Enrollment
    getEnrollmentData,
    saveEnrollmentStep,
    submitEnrollment,
    resetEnrollment,
    
    // Direct data access (for components that need immediate access)
    mockMember: MOCK_MEMBER,
    mockEvents: MOCK_MEMBER_EVENTS,
    mockPlans: MOCK_ICHRA_PLANS,
    mockEmployers: MOCK_EMPLOYERS,
    mockOffers: MOCK_ICHRA_OFFERS,
  };
}

export { DEMO_MODE };
