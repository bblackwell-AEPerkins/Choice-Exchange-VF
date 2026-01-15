import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEnrollment, EnrollmentStep, EnrollmentDependent } from "./useEnrollment";
import { toast } from "sonner";

interface EnrollmentApplication {
  id: string;
  user_id: string;
  status: string;
  current_step: string;
  confirmation_number: string | null;
  coverage_type: string | null;
  coverage_for: string | null;
  enrollment_reason: string | null;
  date_of_birth: string | null;
  legal_sex: string | null;
  ssn_encrypted: string | null;
  citizenship: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  marital_status: string | null;
  employment_status: string | null;
  employer_name: string | null;
  estimated_income: number | null;
  state_of_residence: string | null;
  desired_start_date: string | null;
  qualifying_event_type: string | null;
  qualifying_event_date: string | null;
  has_documentation: boolean;
  has_prior_coverage: boolean;
  prior_coverage_end_date: string | null;
  tobacco_use: boolean;
  selected_plan_id: string | null;
  monthly_premium: number | null;
  employer_contribution: number | null;
  attested_information_accurate: boolean;
  attested_electronic_consent: boolean;
  attested_hipaa_authorization: boolean;
  attested_at: string | null;
  attestation_ip_address: string | null;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
}

interface EnrollmentDependentDB {
  id: string;
  application_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  relationship: string;
  ssn_encrypted: string | null;
}

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

  // Load existing draft application or create new one
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadOrCreateApplication = async () => {
      setIsLoading(true);
      try {
        // Check for existing draft application
        const { data: existingApp, error: fetchError } = await supabase
          .from("enrollment_applications")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "draft")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingApp) {
          // Load existing application into store
          setApplicationId(existingApp.id);
          await loadApplicationIntoStore(existingApp);
        } else {
          // Create new application
          const { data: newApp, error: insertError } = await supabase
            .from("enrollment_applications")
            .insert({ user_id: userId })
            .select()
            .single();

          if (insertError) throw insertError;
          setApplicationId(newApp.id);
        }
      } catch (error) {
        console.error("Error loading enrollment application:", error);
        toast.error("Failed to load enrollment. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrCreateApplication();
  }, [userId]);

  const loadApplicationIntoStore = async (app: EnrollmentApplication) => {
    // Load dependents
    const { data: dependents } = await supabase
      .from("enrollment_dependents")
      .select("*")
      .eq("application_id", app.id);

    // Map to store format - load all data first
    if (app.coverage_type || app.coverage_for || app.enrollment_reason) {
      enrollmentStore.updateIntent({
        coverageType: app.coverage_type as "health" | null,
        coverageFor: app.coverage_for as "individual" | "family" | null,
        enrollmentReason: app.enrollment_reason as "open_enrollment" | "qualifying_event" | null,
      });
    }

    if (app.date_of_birth || app.address1) {
      enrollmentStore.updateAbout({
        dateOfBirth: app.date_of_birth || "",
        legalSex: app.legal_sex as "M" | "F" | null,
        ssn: app.ssn_encrypted || "", // Note: In production, decrypt this
        citizenship: app.citizenship || "",
        address1: app.address1 || "",
        address2: app.address2 || "",
        city: app.city || "",
        state: app.state || "",
        zipCode: app.zip_code || "",
      });
    }

    enrollmentStore.updateHousehold({
      maritalStatus: app.marital_status as "single" | "married" | "divorced" | "widowed" | null,
      employmentStatus: app.employment_status as "employed" | "self_employed" | "unemployed" | "retired" | null,
      employerName: app.employer_name || "",
      estimatedIncome: app.estimated_income || 0,
      dependents: (dependents || []).map((d: EnrollmentDependentDB) => ({
        id: d.id,
        firstName: d.first_name,
        lastName: d.last_name,
        dateOfBirth: d.date_of_birth,
        relationship: d.relationship as EnrollmentDependent["relationship"],
        ssn: d.ssn_encrypted || "",
      })),
    });

    if (app.state_of_residence || app.desired_start_date) {
      enrollmentStore.updateCoverage({
        stateOfResidence: app.state_of_residence || "",
        desiredStartDate: app.desired_start_date || "",
        qualifyingEventType: app.qualifying_event_type || "",
        qualifyingEventDate: app.qualifying_event_date || "",
        hasDocumentation: app.has_documentation,
        hasPriorCoverage: app.has_prior_coverage,
        priorCoverageEndDate: app.prior_coverage_end_date || "",
        tobaccoUse: app.tobacco_use,
      });
    }

    if (app.selected_plan_id) {
      enrollmentStore.updatePlan({
        medicalPlanId: app.selected_plan_id,
        monthlyPremium: app.monthly_premium || 0,
        employerContribution: app.employer_contribution || 0,
      });
    }

    enrollmentStore.updateReview({
      informationAccurate: app.attested_information_accurate,
      electronicConsent: app.attested_electronic_consent,
      hipaaAuthorization: app.attested_hipaa_authorization,
      attestedAt: app.attested_at,
      ipAddress: app.attestation_ip_address,
    });

    // Calculate the correct step based on completed data
    let calculatedStep: EnrollmentStep = "intent";
    
    if (app.coverage_type && app.coverage_for && app.enrollment_reason) {
      calculatedStep = "account";
    }
    // User is logged in, so account is verified
    if (userId) {
      calculatedStep = "about";
    }
    if (app.date_of_birth && app.legal_sex && app.address1 && app.city && app.state && app.zip_code) {
      calculatedStep = "household";
    }
    if (app.marital_status && app.employment_status) {
      calculatedStep = "coverage";
    }
    if (app.state_of_residence && app.desired_start_date) {
      calculatedStep = "plans";
    }
    if (app.selected_plan_id) {
      calculatedStep = "review";
    }

    // Set the calculated step (use the further of saved step or calculated step)
    const stepOrder: EnrollmentStep[] = ["intent", "account", "about", "household", "coverage", "plans", "review", "submit", "complete"];
    const savedStepIndex = stepOrder.indexOf(app.current_step as EnrollmentStep);
    const calculatedStepIndex = stepOrder.indexOf(calculatedStep);
    
    const finalStep = calculatedStepIndex > savedStepIndex ? calculatedStep : (app.current_step as EnrollmentStep);
    enrollmentStore.setStep(finalStep);
  };

  // Debounced save to database
  const saveToDatabase = useCallback(async () => {
    if (!applicationId || !userId || isSubmittingRef.current) return;

    setIsSaving(true);
    try {
      const { intent, account, about, household, coverage, plan, review, currentStep } = enrollmentStore;

      // Update main application
      const { error: updateError } = await supabase
        .from("enrollment_applications")
        .update({
          current_step: currentStep,
          coverage_type: intent.coverageType,
          coverage_for: intent.coverageFor,
          enrollment_reason: intent.enrollmentReason,
          date_of_birth: about.dateOfBirth || null,
          legal_sex: about.legalSex,
          ssn_encrypted: about.ssn || null, // Note: In production, encrypt this
          citizenship: about.citizenship || null,
          address1: about.address1 || null,
          address2: about.address2 || null,
          city: about.city || null,
          state: about.state || null,
          zip_code: about.zipCode || null,
          marital_status: household.maritalStatus,
          employment_status: household.employmentStatus,
          employer_name: household.employerName || null,
          estimated_income: household.estimatedIncome || null,
          state_of_residence: coverage.stateOfResidence || null,
          desired_start_date: coverage.desiredStartDate || null,
          qualifying_event_type: coverage.qualifyingEventType || null,
          qualifying_event_date: coverage.qualifyingEventDate || null,
          has_documentation: coverage.hasDocumentation,
          has_prior_coverage: coverage.hasPriorCoverage,
          prior_coverage_end_date: coverage.priorCoverageEndDate || null,
          tobacco_use: coverage.tobaccoUse,
          selected_plan_id: plan.medicalPlanId || null,
          monthly_premium: plan.monthlyPremium || null,
          employer_contribution: plan.employerContribution || null,
          attested_information_accurate: review.informationAccurate,
          attested_electronic_consent: review.electronicConsent,
          attested_hipaa_authorization: review.hipaaAuthorization,
          attested_at: review.attestedAt || null,
          attestation_ip_address: review.ipAddress || null,
        })
        .eq("id", applicationId)
        .eq("status", "draft");

      if (updateError) throw updateError;

      // Sync dependents - delete all and re-insert for simplicity
      await supabase
        .from("enrollment_dependents")
        .delete()
        .eq("application_id", applicationId);

      if (household.dependents.length > 0) {
        const dependentsToInsert = household.dependents.map((d) => ({
          application_id: applicationId,
          first_name: d.firstName,
          last_name: d.lastName,
          date_of_birth: d.dateOfBirth,
          relationship: d.relationship,
          ssn_encrypted: d.ssn || null,
        }));

        const { error: depError } = await supabase
          .from("enrollment_dependents")
          .insert(dependentsToInsert);

        if (depError) throw depError;
      }
    } catch (error) {
      console.error("Error saving enrollment:", error);
    } finally {
      setIsSaving(false);
    }
  }, [applicationId, userId, enrollmentStore]);

  // Auto-save on store changes (debounced)
  useEffect(() => {
    if (!applicationId || isLoading) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToDatabase();
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    applicationId,
    isLoading,
    saveToDatabase,
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
      // Generate confirmation number
      const confirmationNumber = `CHX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Get client IP (would be done server-side in production)
      let ipAddress = "unknown";
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        ipAddress = data.ip;
      } catch {
        // Ignore IP fetch errors
      }

      // Update application status
      const { error: updateError } = await supabase
        .from("enrollment_applications")
        .update({
          status: "submitted",
          confirmation_number: confirmationNumber,
          submitted_at: new Date().toISOString(),
          attested_at: new Date().toISOString(),
          attestation_ip_address: ipAddress,
        })
        .eq("id", applicationId)
        .eq("status", "draft"); // Only update if still draft (prevents double submit)

      if (updateError) throw updateError;

      // Clear local store
      enrollmentStore.resetEnrollment();
      setApplicationId(null);

      return { success: true, confirmationNumber };
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      return { success: false, error: "Failed to submit enrollment. Please try again." };
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Check if step is accessible based on completed data (prevents URL skipping)
  const canAccessStep = (step: EnrollmentStep): boolean => {
    const { intent, account, about, household } = enrollmentStore;
    
    // Intent is always accessible
    if (step === "intent") return true;
    
    // Account requires intent to be filled
    if (step === "account") {
      return !!(intent.coverageType && intent.coverageFor && intent.enrollmentReason);
    }
    
    // About requires account to be verified (user logged in)
    if (step === "about") {
      return !!(userId || account.isVerified);
    }
    
    // Household requires about to have basic info
    if (step === "household") {
      return !!(about.dateOfBirth && about.legalSex && about.address1 && about.city && about.state && about.zipCode);
    }
    
    // Coverage requires household info
    if (step === "coverage") {
      return !!(household.maritalStatus && household.employmentStatus);
    }
    
    // Plans requires coverage info
    if (step === "plans") {
      return true; // Allow if user got past coverage
    }
    
    // Review and beyond require plan selection
    if (step === "review" || step === "submit" || step === "complete") {
      return true; // Allow navigation - validation happens on the page
    }
    
    return true;
  };

  // Force save (for Save & Exit)
  const forceSave = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    await saveToDatabase();
    toast.success("Progress saved");
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
