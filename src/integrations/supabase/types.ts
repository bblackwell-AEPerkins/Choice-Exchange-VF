export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address1: string
          address2: string | null
          city: string
          created_at: string
          id: string
          individual_id: string
          is_primary_address: boolean
          state: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          address1: string
          address2?: string | null
          city: string
          created_at?: string
          id?: string
          individual_id: string
          is_primary_address?: boolean
          state: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          address1?: string
          address2?: string | null
          city?: string
          created_at?: string
          id?: string
          individual_id?: string
          is_primary_address?: boolean
          state?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "individuals"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_methods: {
        Row: {
          created_at: string
          id: string
          individual_id: string
          is_primary: boolean
          type: Database["public"]["Enums"]["contact_method_type"]
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          individual_id: string
          is_primary?: boolean
          type: Database["public"]["Enums"]["contact_method_type"]
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          individual_id?: string
          is_primary?: boolean
          type?: Database["public"]["Enums"]["contact_method_type"]
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_methods_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "individuals"
            referencedColumns: ["id"]
          },
        ]
      }
      coverage_enrollments: {
        Row: {
          created_at: string
          effective_date: string
          id: string
          individual_id: string
          maintenance_action: Database["public"]["Enums"]["maintenance_action"]
          plan_id: string
          plan_name: string | null
          status: Database["public"]["Enums"]["enrollment_status"]
          termination_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_date: string
          id?: string
          individual_id: string
          maintenance_action?: Database["public"]["Enums"]["maintenance_action"]
          plan_id: string
          plan_name?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          termination_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_date?: string
          id?: string
          individual_id?: string
          maintenance_action?: Database["public"]["Enums"]["maintenance_action"]
          plan_id?: string
          plan_name?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          termination_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coverage_enrollments_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "individuals"
            referencedColumns: ["id"]
          },
        ]
      }
      employers: {
        Row: {
          created_at: string
          email_domain: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_domain: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_domain?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      household_members: {
        Row: {
          created_at: string
          household_id: string
          id: string
          individual_id: string
          is_primary: boolean
          relationship_to_primary: Database["public"]["Enums"]["relationship_type"]
        }
        Insert: {
          created_at?: string
          household_id: string
          id?: string
          individual_id: string
          is_primary?: boolean
          relationship_to_primary: Database["public"]["Enums"]["relationship_type"]
        }
        Update: {
          created_at?: string
          household_id?: string
          id?: string
          individual_id?: string
          is_primary?: boolean
          relationship_to_primary?: Database["public"]["Enums"]["relationship_type"]
        }
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_members_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "individuals"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string
          id: string
          primary_individual_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          primary_individual_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          primary_individual_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "households_primary_individual_id_fkey"
            columns: ["primary_individual_id"]
            isOneToOne: false
            referencedRelation: "individuals"
            referencedColumns: ["id"]
          },
        ]
      }
      ichra_enrollments: {
        Row: {
          attested_accurate: boolean | null
          attested_at: string | null
          coverage_zip_code: string | null
          created_at: string
          enrollment_completed_at: string | null
          external_carrier_name: string | null
          external_effective_date: string | null
          external_monthly_premium: number | null
          external_plan_name: string | null
          external_plan_type: string | null
          external_policy_number: string | null
          ichra_offer_id: string
          id: string
          individual_id: string
          selected_plan_id: string | null
          status: Database["public"]["Enums"]["ichra_enrollment_status"]
          updated_at: string
          waiver_date: string | null
          waiver_reason: string | null
        }
        Insert: {
          attested_accurate?: boolean | null
          attested_at?: string | null
          coverage_zip_code?: string | null
          created_at?: string
          enrollment_completed_at?: string | null
          external_carrier_name?: string | null
          external_effective_date?: string | null
          external_monthly_premium?: number | null
          external_plan_name?: string | null
          external_plan_type?: string | null
          external_policy_number?: string | null
          ichra_offer_id: string
          id?: string
          individual_id: string
          selected_plan_id?: string | null
          status?: Database["public"]["Enums"]["ichra_enrollment_status"]
          updated_at?: string
          waiver_date?: string | null
          waiver_reason?: string | null
        }
        Update: {
          attested_accurate?: boolean | null
          attested_at?: string | null
          coverage_zip_code?: string | null
          created_at?: string
          enrollment_completed_at?: string | null
          external_carrier_name?: string | null
          external_effective_date?: string | null
          external_monthly_premium?: number | null
          external_plan_name?: string | null
          external_plan_type?: string | null
          external_policy_number?: string | null
          ichra_offer_id?: string
          id?: string
          individual_id?: string
          selected_plan_id?: string | null
          status?: Database["public"]["Enums"]["ichra_enrollment_status"]
          updated_at?: string
          waiver_date?: string | null
          waiver_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ichra_enrollments_ichra_offer_id_fkey"
            columns: ["ichra_offer_id"]
            isOneToOne: false
            referencedRelation: "ichra_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ichra_enrollments_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "individuals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ichra_enrollments_selected_plan_id_fkey"
            columns: ["selected_plan_id"]
            isOneToOne: false
            referencedRelation: "ichra_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      ichra_offers: {
        Row: {
          created_at: string
          effective_date: string
          employer_id: string
          enrollment_end_date: string
          enrollment_start_date: string
          id: string
          is_active: boolean
          monthly_allowance: number
          plan_year_end: string
          plan_year_start: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_date: string
          employer_id: string
          enrollment_end_date: string
          enrollment_start_date: string
          id?: string
          is_active?: boolean
          monthly_allowance: number
          plan_year_end: string
          plan_year_start: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_date?: string
          employer_id?: string
          enrollment_end_date?: string
          enrollment_start_date?: string
          id?: string
          is_active?: boolean
          monthly_allowance?: number
          plan_year_end?: string
          plan_year_start?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ichra_offers_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
          },
        ]
      }
      ichra_plans: {
        Row: {
          carrier_name: string
          copay_emergency: number | null
          copay_primary: number | null
          copay_specialist: number | null
          coverage_areas: string[]
          created_at: string
          deductible: number
          features: string[] | null
          id: string
          is_active: boolean
          is_hsa_eligible: boolean
          metal_tier: string
          monthly_premium: number
          out_of_pocket_max: number
          plan_name: string
          plan_type: string
        }
        Insert: {
          carrier_name: string
          copay_emergency?: number | null
          copay_primary?: number | null
          copay_specialist?: number | null
          coverage_areas: string[]
          created_at?: string
          deductible: number
          features?: string[] | null
          id?: string
          is_active?: boolean
          is_hsa_eligible?: boolean
          metal_tier: string
          monthly_premium: number
          out_of_pocket_max: number
          plan_name: string
          plan_type: string
        }
        Update: {
          carrier_name?: string
          copay_emergency?: number | null
          copay_primary?: number | null
          copay_specialist?: number | null
          coverage_areas?: string[]
          created_at?: string
          deductible?: number
          features?: string[] | null
          id?: string
          is_active?: boolean
          is_hsa_eligible?: boolean
          metal_tier?: string
          monthly_premium?: number
          out_of_pocket_max?: number
          plan_name?: string
          plan_type?: string
        }
        Relationships: []
      }
      individuals: {
        Row: {
          created_at: string
          date_of_birth: string
          external_member_id: string
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          last_name: string
          member_ssn: string | null
          middle_initial: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          external_member_id: string
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          last_name: string
          member_ssn?: string | null
          middle_initial?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          external_member_id?: string
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          last_name?: string
          member_ssn?: string | null
          middle_initial?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      member_events: {
        Row: {
          allowed_amount: number | null
          appointment_type: string | null
          attachments: Json | null
          billed_amount: number | null
          confirmation_number: string | null
          created_at: string
          description: string | null
          dosage: string | null
          end_date: string | null
          event_category: string
          event_date: string
          event_type: string
          facility_address: string | null
          facility_name: string | null
          id: string
          individual_id: string
          is_recurring: boolean | null
          medication_name: string | null
          member_responsibility: number | null
          notes: string | null
          parent_event_id: string | null
          pharmacy_name: string | null
          plan_paid: number | null
          provider_name: string | null
          provider_specialty: string | null
          quantity: number | null
          recurrence_pattern: string | null
          refills_remaining: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          allowed_amount?: number | null
          appointment_type?: string | null
          attachments?: Json | null
          billed_amount?: number | null
          confirmation_number?: string | null
          created_at?: string
          description?: string | null
          dosage?: string | null
          end_date?: string | null
          event_category: string
          event_date: string
          event_type: string
          facility_address?: string | null
          facility_name?: string | null
          id?: string
          individual_id: string
          is_recurring?: boolean | null
          medication_name?: string | null
          member_responsibility?: number | null
          notes?: string | null
          parent_event_id?: string | null
          pharmacy_name?: string | null
          plan_paid?: number | null
          provider_name?: string | null
          provider_specialty?: string | null
          quantity?: number | null
          recurrence_pattern?: string | null
          refills_remaining?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          allowed_amount?: number | null
          appointment_type?: string | null
          attachments?: Json | null
          billed_amount?: number | null
          confirmation_number?: string | null
          created_at?: string
          description?: string | null
          dosage?: string | null
          end_date?: string | null
          event_category?: string
          event_date?: string
          event_type?: string
          facility_address?: string | null
          facility_name?: string | null
          id?: string
          individual_id?: string
          is_recurring?: boolean | null
          medication_name?: string | null
          member_responsibility?: number | null
          notes?: string | null
          parent_event_id?: string | null
          pharmacy_name?: string | null
          plan_paid?: number | null
          provider_name?: string | null
          provider_specialty?: string | null
          quantity?: number | null
          recurrence_pattern?: string | null
          refills_remaining?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_events_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "member_events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      contact_method_type: "Phone" | "Email"
      enrollment_status: "Active" | "Terminated" | "Pending" | "COBRA"
      gender_type: "M" | "F" | "U"
      ichra_enrollment_status:
        | "not_started"
        | "in_progress"
        | "enrolled"
        | "waived"
        | "pending_verification"
      maintenance_action: "New" | "Change" | "Termination" | "Reinstatement"
      relationship_type: "Self" | "SP" | "DEP"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contact_method_type: ["Phone", "Email"],
      enrollment_status: ["Active", "Terminated", "Pending", "COBRA"],
      gender_type: ["M", "F", "U"],
      ichra_enrollment_status: [
        "not_started",
        "in_progress",
        "enrolled",
        "waived",
        "pending_verification",
      ],
      maintenance_action: ["New", "Change", "Termination", "Reinstatement"],
      relationship_type: ["Self", "SP", "DEP"],
    },
  },
} as const
