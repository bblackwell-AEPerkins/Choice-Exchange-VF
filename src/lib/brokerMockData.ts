// Broker-specific mock data for demo mode

export type EnrollmentStatus = 
  | "needs_info" 
  | "ready_for_plan" 
  | "pending_confirmation" 
  | "completed";

export type AlertSeverity = "critical" | "warning" | "info";

export interface BrokerEnrollment {
  id: string;
  individualName: string;
  groupName: string;
  effectiveDate: string;
  stepStatus: string;
  currentStep: number;
  totalSteps: number;
  status: EnrollmentStatus;
  lastUpdated: string;
  assignedBroker: string;
}

export interface BrokerGroup {
  id: string;
  name: string;
  sizeBand: string;
  livesEligible: number;
  livesEnrolled: number;
  contributionStrategy: string;
  enrollmentWindowStatus: "open" | "closed" | "upcoming";
  enrollmentWindowDates: string;
  employerStatus: "active" | "pending" | "inactive";
  primaryContact: string;
  lastActivity: string;
}

export interface BrokerAlert {
  id: string;
  type: string;
  message: string;
  severity: AlertSeverity;
  groupName?: string;
  individualName?: string;
  createdAt: string;
}

export interface BrokerEarnings {
  totalThisMonth: number;
  livesEnrolled: number;
  averagePerLife: number;
  voluntaryAttachRate: number;
  baseEarnings: number;
  voluntaryEarnings: number;
}

// Mock Work Queue Data
export const MOCK_BROKER_ENROLLMENTS: BrokerEnrollment[] = [
  {
    id: "enr-001",
    individualName: "Sarah Martinez",
    groupName: "Acme Corp",
    effectiveDate: "2025-03-01",
    stepStatus: "Household Info",
    currentStep: 2,
    totalSteps: 6,
    status: "needs_info",
    lastUpdated: "2 hours ago",
    assignedBroker: "Demo Broker",
  },
  {
    id: "enr-002",
    individualName: "John Davidson",
    groupName: "TechStart Inc",
    effectiveDate: "2025-03-01",
    stepStatus: "Plan Selection",
    currentStep: 4,
    totalSteps: 6,
    status: "ready_for_plan",
    lastUpdated: "4 hours ago",
    assignedBroker: "Demo Broker",
  },
  {
    id: "enr-003",
    individualName: "Lisa Kim",
    groupName: "Metro Services",
    effectiveDate: "2025-02-15",
    stepStatus: "Confirmation",
    currentStep: 6,
    totalSteps: 6,
    status: "pending_confirmation",
    lastUpdated: "1 day ago",
    assignedBroker: "Demo Broker",
  },
  {
    id: "enr-004",
    individualName: "Michael Chen",
    groupName: "Acme Corp",
    effectiveDate: "2025-02-01",
    stepStatus: "Completed",
    currentStep: 6,
    totalSteps: 6,
    status: "completed",
    lastUpdated: "3 days ago",
    assignedBroker: "Demo Broker",
  },
  {
    id: "enr-005",
    individualName: "Emily Roberts",
    groupName: "Coastal Health",
    effectiveDate: "2025-03-01",
    stepStatus: "Contribution Setup",
    currentStep: 3,
    totalSteps: 6,
    status: "needs_info",
    lastUpdated: "5 hours ago",
    assignedBroker: "Demo Broker",
  },
];

// Mock Groups Data
export const MOCK_BROKER_GROUPS: BrokerGroup[] = [
  {
    id: "grp-001",
    name: "Acme Corp",
    sizeBand: "50-99",
    livesEligible: 72,
    livesEnrolled: 58,
    contributionStrategy: "Flat $500/mo",
    enrollmentWindowStatus: "open",
    enrollmentWindowDates: "Jan 15 - Feb 28, 2025",
    employerStatus: "active",
    primaryContact: "Jane Smith",
    lastActivity: "Today",
  },
  {
    id: "grp-002",
    name: "TechStart Inc",
    sizeBand: "10-49",
    livesEligible: 34,
    livesEnrolled: 28,
    contributionStrategy: "By Family Status",
    enrollmentWindowStatus: "open",
    enrollmentWindowDates: "Feb 1 - Mar 15, 2025",
    employerStatus: "active",
    primaryContact: "Tom Wilson",
    lastActivity: "Yesterday",
  },
  {
    id: "grp-003",
    name: "Metro Services",
    sizeBand: "100-249",
    livesEligible: 156,
    livesEnrolled: 142,
    contributionStrategy: "By Class",
    enrollmentWindowStatus: "closed",
    enrollmentWindowDates: "Dec 1 - Dec 31, 2024",
    employerStatus: "active",
    primaryContact: "Sarah Johnson",
    lastActivity: "3 days ago",
  },
  {
    id: "grp-004",
    name: "Coastal Health",
    sizeBand: "10-49",
    livesEligible: 22,
    livesEnrolled: 8,
    contributionStrategy: "Flat $400/mo",
    enrollmentWindowStatus: "open",
    enrollmentWindowDates: "Feb 1 - Feb 28, 2025",
    employerStatus: "active",
    primaryContact: "Mike Brown",
    lastActivity: "5 hours ago",
  },
  {
    id: "grp-005",
    name: "Summit Partners",
    sizeBand: "1-9",
    livesEligible: 8,
    livesEnrolled: 0,
    contributionStrategy: "Flat $600/mo",
    enrollmentWindowStatus: "upcoming",
    enrollmentWindowDates: "Mar 1 - Mar 31, 2025",
    employerStatus: "pending",
    primaryContact: "David Lee",
    lastActivity: "1 week ago",
  },
];

// Mock Alerts Data
export const MOCK_BROKER_ALERTS: BrokerAlert[] = [
  {
    id: "alert-001",
    type: "missing_invite",
    message: "Missing invite codes for 3 eligible individuals",
    severity: "warning",
    groupName: "Coastal Health",
    createdAt: "2 hours ago",
  },
  {
    id: "alert-002",
    type: "eligibility_mismatch",
    message: "Eligibility file mismatch - 2 individuals need review",
    severity: "critical",
    groupName: "Acme Corp",
    createdAt: "4 hours ago",
  },
  {
    id: "alert-003",
    type: "contribution_not_set",
    message: "Contribution amounts not configured",
    severity: "critical",
    groupName: "Summit Partners",
    createdAt: "1 day ago",
  },
  {
    id: "alert-004",
    type: "enrollment_deadline",
    message: "Enrollment window closes in 5 days",
    severity: "warning",
    groupName: "TechStart Inc",
    createdAt: "Today",
  },
];

// Mock Earnings Data
export const MOCK_BROKER_EARNINGS: BrokerEarnings = {
  totalThisMonth: 4850,
  livesEnrolled: 236,
  averagePerLife: 20.55,
  voluntaryAttachRate: 42,
  baseEarnings: 3540,
  voluntaryEarnings: 1310,
};

// Voluntary Benefits Feature Flag
export const VOLUNTARY_BENEFITS_ENABLED = true;

// Helper function to get status label
export function getStatusLabel(status: EnrollmentStatus): string {
  switch (status) {
    case "needs_info":
      return "Needs Info";
    case "ready_for_plan":
      return "Ready for Plan";
    case "pending_confirmation":
      return "Pending Confirmation";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

// Helper function to get status color class
export function getStatusColor(status: EnrollmentStatus): string {
  switch (status) {
    case "needs_info":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "ready_for_plan":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "pending_confirmation":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// Helper function to get alert severity color
export function getAlertSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "warning":
      return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    case "info":
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
