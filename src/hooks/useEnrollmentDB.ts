import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEnrollment, EnrollmentStep, EnrollmentDependent } from "./useEnrollment";
import { toast } from "sonner";
import { DEMO_MODE, simulateDelay, generateConfirmationNumber } from "@/lib/mockData";

const ENROLLMENT_STORAGE_KEY = "demo_enrollment_data";

export function useEnrollmentDB() {
  const enrollmentStore = useEnrollment();
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingRef = useRef(false);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load existing application or create new one
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadOrCreateApplication = async () => {
      setIsLoading(true);
      
      if (DEMO_MODE) {
        await simulateDelay(300);
        
        // Load from localStorage
        const stored = localStorage.getItem(ENROLLMENT_STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          loadStoredDataIntoStore(data);
          setApplicationId(data.applicationId || `demo-app-${Date.now()}`);
        } else {
          // Create new demo application
          const newAppId = `demo-app-${Date.now()}`;
          setApplicationId(newAppId);
          localStorage.setItem(ENROLLMENT_STORAGE_KEY, JSON.stringify({
            applicationId: newAppId,
            currentStep: "intent",
          }));
        }
        
        setIsLoading(false);
        return;
      }
      
      // Original Supabase logic would go here for non-demo mode
      setIsLoading(false);
    };

    loadOrCreateApplication();
  }, [userId]);

  const loadStoredDataIntoStore = (data: any) => {
    if (data.intent) {
      enrollmentStore.updateIntent(data.intent);
    }
    if (data.about) {
      enrollmentStore.updateAbout(data.about);
    }
    if (data.household) {
      enrollmentStore.updateHousehold(data.household);
    }
    if (data.coverage) {
      enrollmentStore.updateCoverage(data.coverage);
    }
    if (data.plan) {
      enrollmentStore.updatePlan(data.plan);
    }
    if (data.review) {
      enrollmentStore.updateReview(data.review);
    }
    if (data.currentStep) {
      enrollmentStore.setStep(data.currentStep as EnrollmentStep);
    }
  };

  // Save to localStorage (demo mode)
  const saveToLocalStorage = useCallback(() => {
    if (!applicationId || !DEMO_MODE) return;
    
    const { intent, account, about, household, coverage, plan, review, currentStep } = enrollmentStore;
    
    const data = {
      applicationId,
      currentStep,
      intent,
      about,
      household,
      coverage,
      plan,
      review,
    };
    
    localStorage.setItem(ENROLLMENT_STORAGE_KEY, JSON.stringify(data));
  }, [applicationId, enrollmentStore]);

  // Auto-save on store changes (debounced)
  useEffect(() => {
    if (!applicationId || isLoading || !DEMO_MODE) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToLocalStorage();
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    applicationId,
    isLoading,
    saveToLocalStorage,
    enrollmentStore.intent,
    enrollmentStore.about,
    enrollmentStore.household,
    enrollmentStore.coverage,
    enrollmentStore.plan,
    enrollmentStore.review,
    enrollmentStore.currentStep,
  ]);

  // Submit enrollment
  const submitEnrollment = async (): Promise<{ success: boolean; confirmationNumber?: string; error?: string }> => {
    if (!applicationId || !userId || isSubmittingRef.current) {
      return { success: false, error: "No active application" };
    }

    isSubmittingRef.current = true;
    
    try {
      if (DEMO_MODE) {
        await simulateDelay(800);
        
        const confirmationNumber = generateConfirmationNumber();
        
        // Save final state
        const stored = localStorage.getItem(ENROLLMENT_STORAGE_KEY);
        const data = stored ? JSON.parse(stored) : {};
        
        localStorage.setItem(ENROLLMENT_STORAGE_KEY, JSON.stringify({
          ...data,
          status: "submitted",
          confirmationNumber,
          submittedAt: new Date().toISOString(),
        }));
        
        // Clear store
        enrollmentStore.resetEnrollment();
        
        return { success: true, confirmationNumber };
      }
      
      return { success: false, error: "Not in demo mode" };
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      return { success: false, error: "Failed to submit enrollment. Please try again." };
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Check if step is accessible based on completed data
  const canAccessStep = (step: EnrollmentStep): boolean => {
    const { intent, account, about, household } = enrollmentStore;
    
    if (step === "intent") return true;
    
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
    
    if (step === "plans") {
      return true;
    }
    
    if (step === "review" || step === "submit" || step === "complete") {
      return true;
    }
    
    return true;
  };

  // Force save
  const forceSave = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    if (DEMO_MODE) {
      saveToLocalStorage();
      toast.success("Progress saved");
    }
  };

  return {
    ...enrollmentStore,
    applicationId,
    isLoading,
    isSaving,
    userId,
    saveToDatabase: forceSave,
    submitEnrollment,
    canAccessStep,
  };
}
