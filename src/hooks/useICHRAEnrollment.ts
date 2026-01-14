import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type ICHRAEnrollmentStatus = 
  | "not_started" 
  | "in_progress" 
  | "enrolled" 
  | "waived" 
  | "pending_verification";

interface Employer {
  id: string;
  name: string;
  email_domain: string;
  logo_url: string | null;
}

interface ICHRAOffer {
  id: string;
  employer_id: string;
  monthly_allowance: number;
  effective_date: string;
  enrollment_start_date: string;
  enrollment_end_date: string;
  plan_year_start: string;
  plan_year_end: string;
  employer?: Employer;
}

interface ICHRAPlan {
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
}

interface ICHRAEnrollment {
  id: string;
  individual_id: string;
  ichra_offer_id: string;
  status: ICHRAEnrollmentStatus;
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

export function useICHRAEnrollment() {
  const [loading, setLoading] = useState(true);
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [offer, setOffer] = useState<ICHRAOffer | null>(null);
  const [enrollment, setEnrollment] = useState<ICHRAEnrollment | null>(null);
  const [plans, setPlans] = useState<ICHRAPlan[]>([]);
  const [individualId, setIndividualId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check auth and load user data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        return;
      }

      setUser(session.user);

      // Get individual record for this user
      const { data: individual } = await supabase
        .from("individuals")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (individual) {
        setIndividualId(individual.id);
        await loadEnrollmentData(individual.id, session.user.email);
      } else {
        // Try to match employer by email domain
        await matchEmployerByEmail(session.user.email);
      }

      setLoading(false);
    };

    checkAuthAndLoadData();
  }, []);

  const matchEmployerByEmail = async (email: string | undefined) => {
    if (!email) return;

    const domain = email.split("@")[1];
    if (!domain) return;

    const { data: employerData } = await supabase
      .from("employers")
      .select("*")
      .eq("email_domain", domain)
      .eq("is_active", true)
      .single();

    if (employerData) {
      setEmployer(employerData);

      // Get active offer for this employer
      const { data: offerData } = await supabase
        .from("ichra_offers")
        .select("*")
        .eq("employer_id", employerData.id)
        .eq("is_active", true)
        .single();

      if (offerData) {
        setOffer({ ...offerData, employer: employerData });
      }
    }
  };

  const loadEnrollmentData = async (indId: string, email: string | undefined) => {
    // First match employer
    await matchEmployerByEmail(email);

    // Check for existing enrollment
    const { data: enrollmentData } = await supabase
      .from("ichra_enrollments")
      .select("*")
      .eq("individual_id", indId)
      .single();

    if (enrollmentData) {
      // Type assertion for the status field
      setEnrollment(enrollmentData as unknown as ICHRAEnrollment);
    }
  };

  const fetchPlansByZipCode = async (zipCode: string) => {
    const zipPrefix = zipCode.substring(0, 3);

    const { data, error } = await supabase
      .from("ichra_plans")
      .select("*")
      .eq("is_active", true)
      .contains("coverage_areas", [zipPrefix]);

    if (error) {
      toast({
        title: "Error loading plans",
        description: "Could not load plans for your area. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setPlans((data || []) as unknown as ICHRAPlan[]);
  };

  const createEnrollment = async (offerId: string) => {
    if (!individualId) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile before enrolling.",
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase
      .from("ichra_enrollments")
      .insert({
        individual_id: individualId,
        ichra_offer_id: offerId,
        status: "in_progress",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation - enrollment already exists
        toast({
          title: "Enrollment Exists",
          description: "You already have an enrollment for this offer.",
        });
      } else {
        toast({
          title: "Error",
          description: "Could not start enrollment. Please try again.",
          variant: "destructive",
        });
      }
      return null;
    }

    setEnrollment(data as unknown as ICHRAEnrollment);
    return data;
  };

  const selectPlan = async (planId: string, zipCode: string) => {
    if (!enrollment) return;

    const { error } = await supabase
      .from("ichra_enrollments")
      .update({
        selected_plan_id: planId,
        coverage_zip_code: zipCode,
        status: "pending_verification",
      })
      .eq("id", enrollment.id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not save plan selection. Please try again.",
        variant: "destructive",
      });
      return false;
    }

    setEnrollment((prev) => prev ? {
      ...prev,
      selected_plan_id: planId,
      coverage_zip_code: zipCode,
      status: "pending_verification",
    } : null);

    return true;
  };

  const submitExternalPlan = async (planDetails: {
    carrier_name: string;
    plan_name: string;
    plan_type: string;
    monthly_premium: number;
    policy_number: string;
    effective_date: string;
    zip_code: string;
  }) => {
    if (!enrollment) return false;

    const { error } = await supabase
      .from("ichra_enrollments")
      .update({
        external_carrier_name: planDetails.carrier_name,
        external_plan_name: planDetails.plan_name,
        external_plan_type: planDetails.plan_type,
        external_monthly_premium: planDetails.monthly_premium,
        external_policy_number: planDetails.policy_number,
        external_effective_date: planDetails.effective_date,
        coverage_zip_code: planDetails.zip_code,
        status: "pending_verification",
      })
      .eq("id", enrollment.id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not save plan details. Please try again.",
        variant: "destructive",
      });
      return false;
    }

    setEnrollment((prev) => prev ? {
      ...prev,
      ...planDetails,
      status: "pending_verification",
    } : null);

    return true;
  };

  const attestEnrollment = async () => {
    if (!enrollment) return false;

    const { error } = await supabase
      .from("ichra_enrollments")
      .update({
        attested_at: new Date().toISOString(),
        attested_accurate: true,
        status: "enrolled",
        enrollment_completed_at: new Date().toISOString(),
      })
      .eq("id", enrollment.id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not complete attestation. Please try again.",
        variant: "destructive",
      });
      return false;
    }

    setEnrollment((prev) => prev ? {
      ...prev,
      attested_at: new Date().toISOString(),
      attested_accurate: true,
      status: "enrolled",
      enrollment_completed_at: new Date().toISOString(),
    } : null);

    toast({
      title: "Enrollment Complete!",
      description: "Your ICHRA enrollment has been successfully submitted.",
    });

    return true;
  };

  const waiveEnrollment = async (reason: string) => {
    if (!enrollment) return false;

    const { error } = await supabase
      .from("ichra_enrollments")
      .update({
        waiver_reason: reason,
        waiver_date: new Date().toISOString(),
        status: "waived",
        enrollment_completed_at: new Date().toISOString(),
      })
      .eq("id", enrollment.id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not process waiver. Please try again.",
        variant: "destructive",
      });
      return false;
    }

    setEnrollment((prev) => prev ? {
      ...prev,
      waiver_reason: reason,
      waiver_date: new Date().toISOString(),
      status: "waived",
      enrollment_completed_at: new Date().toISOString(),
    } : null);

    toast({
      title: "Waiver Submitted",
      description: "Your ICHRA waiver has been recorded.",
    });

    return true;
  };

  return {
    loading,
    user,
    employer,
    offer,
    enrollment,
    plans,
    individualId,
    fetchPlansByZipCode,
    createEnrollment,
    selectPlan,
    submitExternalPlan,
    attestEnrollment,
    waiveEnrollment,
  };
}
