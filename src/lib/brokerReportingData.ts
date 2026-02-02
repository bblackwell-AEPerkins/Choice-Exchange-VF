// Broker Reporting Mock Data

export interface GroupPerformance {
  id: string;
  groupName: string;
  eligibleLives: number;
  enrolledLives: number;
  completionRate: number;
  avgNetPremium: number;
  voluntaryAttachRate: number;
  earnings: number;
  enrollmentWindowStatus: "open" | "closed" | "upcoming";
  lastActivity: string;
}

export interface IndividualEnrollment {
  id: string;
  name: string;
  status: "active" | "pending" | "incomplete" | "terminated";
  effectiveDate: string;
  planName: string;
  monthlyPremium: number;
  netPremium: number;
  voluntaryBenefits: string[];
  issues: string[];
  lastUpdated: string;
}

export interface GroupCostSummary {
  totalContribution: number;
  totalPremium: number;
  avgEmployeeOutOfPocket: number;
  remainingDollarsDistribution: {
    label: string;
    count: number;
    percentage: number;
  }[];
}

export interface GroupEarningsSummary {
  baseEarnings: number;
  voluntaryEarnings: number;
  totalEarnings: number;
  perLifeAverage: number;
  livesEnrolled: number;
}

export interface ReportingException {
  id: string;
  type: "enrollment_incomplete" | "payment_failed" | "policy_not_confirmed" | "policy_terminated" | "contribution_not_set" | "eligibility_mismatch";
  severity: "critical" | "warning" | "info";
  groupName: string;
  individualName?: string;
  message: string;
  createdAt: string;
  daysOpen: number;
}

export interface ReportingSummary {
  enrolledLives: number;
  enrolledLivesChange: number;
  activeGroups: number;
  openEnrollmentWindows: number;
  voluntaryAttachRate: number;
  voluntaryAttachRateChange: number;
  totalEarnings: number;
  earningsChange: number;
  baseEarnings: number;
  voluntaryEarnings: number;
}

// Mock Data
export const MOCK_REPORTING_SUMMARY: ReportingSummary = {
  enrolledLives: 236,
  enrolledLivesChange: 12,
  activeGroups: 5,
  openEnrollmentWindows: 3,
  voluntaryAttachRate: 42,
  voluntaryAttachRateChange: 5,
  totalEarnings: 4850,
  earningsChange: 850,
  baseEarnings: 3540,
  voluntaryEarnings: 1310,
};

export const MOCK_GROUP_PERFORMANCE: GroupPerformance[] = [
  {
    id: "grp-001",
    groupName: "Acme Corp",
    eligibleLives: 72,
    enrolledLives: 58,
    completionRate: 80.6,
    avgNetPremium: 125,
    voluntaryAttachRate: 48,
    earnings: 1450,
    enrollmentWindowStatus: "open",
    lastActivity: "Today",
  },
  {
    id: "grp-002",
    groupName: "TechStart Inc",
    eligibleLives: 34,
    enrolledLives: 28,
    completionRate: 82.4,
    avgNetPremium: 98,
    voluntaryAttachRate: 52,
    earnings: 840,
    enrollmentWindowStatus: "open",
    lastActivity: "Yesterday",
  },
  {
    id: "grp-003",
    groupName: "Metro Services",
    eligibleLives: 156,
    enrolledLives: 142,
    completionRate: 91.0,
    avgNetPremium: 145,
    voluntaryAttachRate: 38,
    earnings: 2130,
    enrollmentWindowStatus: "closed",
    lastActivity: "3 days ago",
  },
  {
    id: "grp-004",
    groupName: "Coastal Health",
    eligibleLives: 22,
    enrolledLives: 8,
    completionRate: 36.4,
    avgNetPremium: 110,
    voluntaryAttachRate: 25,
    earnings: 160,
    enrollmentWindowStatus: "open",
    lastActivity: "5 hours ago",
  },
  {
    id: "grp-005",
    groupName: "Summit Partners",
    eligibleLives: 8,
    enrolledLives: 0,
    completionRate: 0,
    avgNetPremium: 0,
    voluntaryAttachRate: 0,
    earnings: 0,
    enrollmentWindowStatus: "upcoming",
    lastActivity: "1 week ago",
  },
];

export const MOCK_GROUP_INDIVIDUALS: Record<string, IndividualEnrollment[]> = {
  "grp-001": [
    {
      id: "ind-001",
      name: "Sarah Martinez",
      status: "active",
      effectiveDate: "2025-02-01",
      planName: "Silver PPO 1500",
      monthlyPremium: 425,
      netPremium: 125,
      voluntaryBenefits: ["Dental Basic", "Vision Essential"],
      issues: [],
      lastUpdated: "2 hours ago",
    },
    {
      id: "ind-002",
      name: "Michael Chen",
      status: "active",
      effectiveDate: "2025-02-01",
      planName: "Bronze HSA 3000",
      monthlyPremium: 310,
      netPremium: 0,
      voluntaryBenefits: ["Term Life $50K"],
      issues: [],
      lastUpdated: "3 days ago",
    },
    {
      id: "ind-003",
      name: "Jennifer Adams",
      status: "pending",
      effectiveDate: "2025-03-01",
      planName: "Silver PPO 1500",
      monthlyPremium: 425,
      netPremium: 125,
      voluntaryBenefits: [],
      issues: ["Awaiting carrier confirmation"],
      lastUpdated: "1 day ago",
    },
    {
      id: "ind-004",
      name: "Robert Wilson",
      status: "incomplete",
      effectiveDate: "",
      planName: "",
      monthlyPremium: 0,
      netPremium: 0,
      voluntaryBenefits: [],
      issues: ["Missing household info", "Plan not selected"],
      lastUpdated: "5 days ago",
    },
  ],
  "grp-002": [
    {
      id: "ind-005",
      name: "John Davidson",
      status: "active",
      effectiveDate: "2025-02-01",
      planName: "Bronze HSA 3000",
      monthlyPremium: 310,
      netPremium: 85,
      voluntaryBenefits: ["Dental Plus", "Vision Premium", "Accident"],
      issues: [],
      lastUpdated: "4 hours ago",
    },
    {
      id: "ind-006",
      name: "Emily Watson",
      status: "active",
      effectiveDate: "2025-02-01",
      planName: "Silver PPO 1500",
      monthlyPremium: 425,
      netPremium: 200,
      voluntaryBenefits: ["Dental Basic"],
      issues: [],
      lastUpdated: "1 week ago",
    },
  ],
};

export const MOCK_GROUP_COSTS: Record<string, GroupCostSummary> = {
  "grp-001": {
    totalContribution: 17400,
    totalPremium: 24650,
    avgEmployeeOutOfPocket: 125,
    remainingDollarsDistribution: [
      { label: "$0 (fully used)", count: 12, percentage: 21 },
      { label: "$1-$50", count: 18, percentage: 31 },
      { label: "$51-$100", count: 15, percentage: 26 },
      { label: "$100+", count: 13, percentage: 22 },
    ],
  },
  "grp-002": {
    totalContribution: 6300,
    totalPremium: 9520,
    avgEmployeeOutOfPocket: 115,
    remainingDollarsDistribution: [
      { label: "$0 (fully used)", count: 8, percentage: 29 },
      { label: "$1-$50", count: 10, percentage: 36 },
      { label: "$51-$100", count: 6, percentage: 21 },
      { label: "$100+", count: 4, percentage: 14 },
    ],
  },
};

export const MOCK_GROUP_EARNINGS: Record<string, GroupEarningsSummary> = {
  "grp-001": {
    baseEarnings: 870,
    voluntaryEarnings: 580,
    totalEarnings: 1450,
    perLifeAverage: 25,
    livesEnrolled: 58,
  },
  "grp-002": {
    baseEarnings: 420,
    voluntaryEarnings: 420,
    totalEarnings: 840,
    perLifeAverage: 30,
    livesEnrolled: 28,
  },
};

export const MOCK_EXCEPTIONS: ReportingException[] = [
  {
    id: "exc-001",
    type: "enrollment_incomplete",
    severity: "warning",
    groupName: "Acme Corp",
    individualName: "Robert Wilson",
    message: "Enrollment incomplete past 10 days",
    createdAt: "5 days ago",
    daysOpen: 10,
  },
  {
    id: "exc-002",
    type: "eligibility_mismatch",
    severity: "critical",
    groupName: "Acme Corp",
    message: "2 individuals not in eligibility file",
    createdAt: "4 hours ago",
    daysOpen: 0,
  },
  {
    id: "exc-003",
    type: "contribution_not_set",
    severity: "critical",
    groupName: "Summit Partners",
    message: "Contribution amounts not configured",
    createdAt: "1 day ago",
    daysOpen: 7,
  },
  {
    id: "exc-004",
    type: "policy_not_confirmed",
    severity: "warning",
    groupName: "TechStart Inc",
    individualName: "Jennifer Adams",
    message: "Carrier confirmation pending 5+ days",
    createdAt: "5 days ago",
    daysOpen: 5,
  },
  {
    id: "exc-005",
    type: "payment_failed",
    severity: "critical",
    groupName: "Coastal Health",
    message: "Premium payment failed - retry required",
    createdAt: "2 days ago",
    daysOpen: 2,
  },
];

// Helper functions
export function getExceptionSeverityColor(severity: ReportingException["severity"]): string {
  switch (severity) {
    case "critical":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "warning":
      return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    case "info":
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
  }
}

export function getExceptionTypeLabel(type: ReportingException["type"]): string {
  switch (type) {
    case "enrollment_incomplete":
      return "Incomplete Enrollment";
    case "payment_failed":
      return "Payment Failed";
    case "policy_not_confirmed":
      return "Policy Pending";
    case "policy_terminated":
      return "Policy Terminated";
    case "contribution_not_set":
      return "Missing Contribution";
    case "eligibility_mismatch":
      return "Eligibility Issue";
  }
}

export function getStatusColor(status: IndividualEnrollment["status"]): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "pending":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "incomplete":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "terminated":
      return "bg-destructive/10 text-destructive";
  }
}
