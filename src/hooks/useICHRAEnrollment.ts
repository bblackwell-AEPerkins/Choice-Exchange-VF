import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DEMO_MODE,
  MOCK_MEMBER,
  MOCK_EMPLOYERS,
  MOCK_ICHRA_OFFERS,
  MOCK_ICHRA_PLANS,
  MOCK_ICHRA_ENROLLMENT,
  simulateDelay,
  filterPlansByZip,
  getEmployerByDomain,
  type MockICHRAPlan,
  type MockEmployer,
  type MockICHRAOffer,
} from "@/lib/mockData";

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

const ICHRA_STORAGE_KEY = "demo_ichra_enrollment";

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

  // Check auth and load data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        return;
      }

      setUser(session.user);

      if (DEMO_MODE) {
        await loadDemoData(session.user.email);
      } else {
        setIndividualId(MOCK_MEMBER.id);
        await loadDemoData(session.user.email);
      }

      setLoading(false);
    };

    checkAuthAndLoadData();
  }, []);

  const loadDemoData = async (email: string | undefined) => {
    await simulateDelay(300);
    
    // Set individual ID
    setIndividualId(MOCK_MEMBER.id);
    
    // Get employer by email domain (defaults to TechCorp for demo)
    const matchedEmployer = email ? getEmployerByDomain(email) : MOCK_EMPLOYERS[0];
    if (matchedEmployer) {
      setEmployer(matchedEmployer as Employer);
      
      // Get active offer for employer
      const matchedOffer = MOCK_ICHRA_OFFERS.find(
        o => o.employer_id === matchedEmployer.id && o.is_active
      );
      if (matchedOffer) {
        setOffer({ ...matchedOffer, employer: matchedEmployer } as ICHRAOffer);
      }
    }
    
    // Load enrollment from localStorage or use mock
    const storedEnrollment = localStorage.getItem(ICHRA_STORAGE_KEY);
    if (storedEnrollment) {
      setEnrollment(JSON.parse(storedEnrollment));
    } else {
      // For demo, start with in_progress status for new users
      const demoEnrollment: ICHRAEnrollment = {
        ...MOCK_ICHRA_ENROLLMENT,
        status: "in_progress",
        selected_plan_id: null,
        attested_at: null,
        attested_accurate: false,
        enrollment_completed_at: null,
      };
      setEnrollment(demoEnrollment);
    }
  };

  const fetchPlansByZipCode = async (zipCode: string) => {
    if (DEMO_MODE) {
      await simulateDelay(400);
      const filteredPlans = filterPlansByZip(zipCode);
      setPlans(filteredPlans as ICHRAPlan[]);
    }
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

    if (DEMO_MODE) {
      await simulateDelay(300);
      
      const newEnrollment: ICHRAEnrollment = {
        id: `ichra-enroll-${Date.now()}`,
        individual_id: individualId,
        ichra_offer_id: offerId,
        status: "in_progress",
        selected_plan_id: null,
        external_carrier_name: null,
        external_plan_name: null,
        external_plan_type: null,
        external_monthly_premium: null,
        external_policy_number: null,
        external_effective_date: null,
        coverage_zip_code: null,
        waiver_reason: null,
        waiver_date: null,
        attested_at: null,
        attested_accurate: false,
        enrollment_completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem(ICHRA_STORAGE_KEY, JSON.stringify(newEnrollment));
      setEnrollment(newEnrollment);
      return newEnrollment;
    }
    
    return null;
  };

  const selectPlan = async (planId: string, zipCode: string) => {
    if (!enrollment) return false;

    if (DEMO_MODE) {
      await simulateDelay(300);
      
      const updated: ICHRAEnrollment = {
        ...enrollment,
        selected_plan_id: planId,
        coverage_zip_code: zipCode,
        status: "pending_verification",
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem(ICHRA_STORAGE_KEY, JSON.stringify(updated));
      setEnrollment(updated);
      return true;
    }

    return false;
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

    if (DEMO_MODE) {
      await simulateDelay(300);
      
      const updated: ICHRAEnrollment = {
        ...enrollment,
        external_carrier_name: planDetails.carrier_name,
        external_plan_name: planDetails.plan_name,
        external_plan_type: planDetails.plan_type,
        external_monthly_premium: planDetails.monthly_premium,
        external_policy_number: planDetails.policy_number,
        external_effective_date: planDetails.effective_date,
        coverage_zip_code: planDetails.zip_code,
        status: "pending_verification",
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem(ICHRA_STORAGE_KEY, JSON.stringify(updated));
      setEnrollment(updated);
      return true;
    }

    return false;
  };

  const attestEnrollment = async () => {
    if (!enrollment) return false;

    if (DEMO_MODE) {
      await simulateDelay(400);
      
      const updated: ICHRAEnrollment = {
        ...enrollment,
        attested_at: new Date().toISOString(),
        attested_accurate: true,
        status: "enrolled",
        enrollment_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem(ICHRA_STORAGE_KEY, JSON.stringify(updated));
      setEnrollment(updated);
      
      toast({
        title: "Enrollment Complete!",
        description: "Your ICHRA enrollment has been successfully submitted.",
      });
      
      return true;
    }

    return false;
  };

  const waiveEnrollment = async (reason: string) => {
    if (!enrollment) return false;

    if (DEMO_MODE) {
      await simulateDelay(400);
      
      const updated: ICHRAEnrollment = {
        ...enrollment,
        waiver_reason: reason,
        waiver_date: new Date().toISOString(),
        status: "waived",
        enrollment_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem(ICHRA_STORAGE_KEY, JSON.stringify(updated));
      setEnrollment(updated);
      
      toast({
        title: "Waiver Submitted",
        description: "Your ICHRA waiver has been recorded.",
      });
      
      return true;
    }

    return false;
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
