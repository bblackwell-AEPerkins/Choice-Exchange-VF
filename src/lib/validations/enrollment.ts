import { z } from "zod";

// Intent validation
export const intentSchema = z.object({
  coverageType: z.literal("health"),
  coverageFor: z.enum(["individual", "family"]),
  enrollmentReason: z.enum(["open_enrollment", "qualifying_event"]),
});

// Account validation
export const accountSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$|^\d{3}-\d{3}-\d{4}$/, "Please enter a valid phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be less than 72 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// About You validation
export const aboutSchema = z.object({
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const dob = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      return age >= 0 && age <= 120;
    }, "Please enter a valid date of birth"),
  legalSex: z.enum(["M", "F"], { required_error: "Legal sex is required" }),
  ssn: z
    .string()
    .min(1, "SSN is required")
    .regex(/^\d{3}-\d{2}-\d{4}$|^\d{9}$/, "Please enter a valid SSN"),
  citizenship: z
    .string()
    .min(1, "Citizenship status is required"),
  address1: z
    .string()
    .trim()
    .min(1, "Street address is required")
    .max(100, "Address must be less than 100 characters"),
  address2: z
    .string()
    .max(100, "Address must be less than 100 characters")
    .optional(),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(50, "City must be less than 50 characters"),
  state: z
    .string()
    .length(2, "Please select a state"),
  zipCode: z
    .string()
    .regex(/^\d{5}$/, "Please enter a valid 5-digit ZIP code"),
});

// Dependent validation
export const dependentSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required"),
  relationship: z.enum(["spouse", "child", "domestic_partner"], {
    required_error: "Relationship is required",
  }),
  ssn: z
    .string()
    .regex(/^$|^\d{3}-\d{2}-\d{4}$|^\d{9}$/, "Please enter a valid SSN")
    .optional(),
});

// Household validation
export const householdSchema = z.object({
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"], {
    required_error: "Marital status is required",
  }),
  employmentStatus: z.enum(["employed", "self_employed", "unemployed", "retired"], {
    required_error: "Employment status is required",
  }),
  employerName: z.string().optional(),
  estimatedIncome: z
    .number({ invalid_type_error: "Please enter a valid income" })
    .positive("Income must be greater than 0")
    .max(10000000, "Please enter a valid income"),
}).refine(
  (data) => data.employmentStatus !== "employed" || (data.employerName && data.employerName.trim().length > 0),
  {
    message: "Employer name is required when employed",
    path: ["employerName"],
  }
);

// Coverage validation
export const coverageSchema = z.object({
  stateOfResidence: z.string().length(2, "Please select a state"),
  desiredStartDate: z
    .string()
    .min(1, "Coverage start date is required")
    .refine((date) => {
      const startDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return startDate >= today;
    }, "Start date cannot be in the past"),
  qualifyingEventType: z.string().optional(),
  qualifyingEventDate: z.string().optional(),
  hasDocumentation: z.boolean().optional(),
  hasPriorCoverage: z.boolean(),
  priorCoverageEndDate: z.string().optional(),
  tobaccoUse: z.boolean(),
});

// Qualifying event validation (applied when enrollmentReason is "qualifying_event")
export const qualifyingEventSchema = z.object({
  qualifyingEventType: z.string().min(1, "Event type is required"),
  qualifyingEventDate: z
    .string()
    .min(1, "Event date is required")
    .refine((date) => {
      const eventDate = new Date(date);
      const today = new Date();
      const sixtyDaysAgo = new Date(today.setDate(today.getDate() - 60));
      return eventDate >= sixtyDaysAgo;
    }, "Event must be within the last 60 days"),
  hasDocumentation: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge documentation requirements" }),
  }),
});

// Review/Attestation validation
export const reviewSchema = z.object({
  informationAccurate: z.literal(true, {
    errorMap: () => ({ message: "You must certify information accuracy" }),
  }),
  electronicConsent: z.literal(true, {
    errorMap: () => ({ message: "You must consent to electronic communications" }),
  }),
  hipaaAuthorization: z.literal(true, {
    errorMap: () => ({ message: "You must authorize HIPAA disclosure" }),
  }),
});

// Payment validation
export const cardPaymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(/^\d{13,19}$/, "Please enter a valid card number"),
  expirationDate: z
    .string()
    .min(1, "Expiration date is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Please enter a valid expiration date (MM/YY)"),
  cvv: z
    .string()
    .min(1, "CVV is required")
    .regex(/^\d{3,4}$/, "Please enter a valid CVV"),
  nameOnCard: z
    .string()
    .trim()
    .min(1, "Name on card is required")
    .max(100, "Name must be less than 100 characters"),
});

export const bankPaymentSchema = z.object({
  accountHolderName: z
    .string()
    .trim()
    .min(1, "Account holder name is required")
    .max(100, "Name must be less than 100 characters"),
  routingNumber: z
    .string()
    .min(1, "Routing number is required")
    .regex(/^\d{9}$/, "Please enter a valid 9-digit routing number"),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .regex(/^\d{4,17}$/, "Please enter a valid account number"),
});

// Helper function to format validation errors
export function formatZodErrors(errors: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  for (const error of errors.errors) {
    const path = error.path.join(".");
    if (!formatted[path]) {
      formatted[path] = error.message;
    }
  }
  return formatted;
}

// Helper to format phone number
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Helper to format SSN
export function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

// Helper to format card number
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

// Helper to format expiration date
export function formatExpirationDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
