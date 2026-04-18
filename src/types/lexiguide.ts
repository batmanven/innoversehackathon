export type Persona = "employee" | "tenant" | "borrower" | "student" | "citizen" | "other";

export type Language =
  | "english"
  | "hindi"
  | "marathi"
  | "tamil"
  | "bengali"
  | "telugu"
  | "kannada";

export const PERSONAS: { value: Persona; label: string; hint: string }[] = [
  { value: "employee", label: "Employee", hint: "HR policies, employment contracts" },
  { value: "tenant", label: "Tenant", hint: "Rental and lease agreements" },
  { value: "borrower", label: "Borrower", hint: "Loans, EMIs, credit terms" },
  { value: "student", label: "Student", hint: "Admission, exam, hostel rules" },
  { value: "citizen", label: "Citizen", hint: "Government notices, public policy" },
  { value: "other", label: "Other", hint: "I'll describe my role manually" },
];

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "english", label: "English" },
  { value: "hindi", label: "हिन्दी (Hindi)" },
  { value: "marathi", label: "मराठी (Marathi)" },
  { value: "tamil", label: "தமிழ் (Tamil)" },
  { value: "bengali", label: "বাংলা (Bengali)" },
  { value: "telugu", label: "తెలుగు (Telugu)" },
  { value: "kannada", label: "ಕನ್ನಡ (Kannada)" },
];

export type Severity = "high" | "medium" | "low";

export interface SummaryBullet {
  text: string;
  highlight?: string; // substring to highlight (e.g. "12-month lock-in")
}

export interface AnalysisSummary {
  headline: string;
  bullets: SummaryBullet[];
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  tags: string[]; // e.g. ["Penalty", "Lock-in"]
  clauseRef: string; // "Clause 4.2"
}

export interface RightItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  clauseRef: string;
}

export type ChecklistGroup = "must" | "must_not" | "deadlines";

export interface ChecklistItem {
  id: string;
  group: ChecklistGroup;
  action: string;
  detail: string;
  due?: string; // human readable
}

export interface QAEntry {
  id: string;
  role: "user" | "assistant";
  content: string;
  references?: { clause: string; label: string }[];
  pending?: boolean;
}

export type ClauseHighlight = "none" | "risk" | "warn" | "safe";

export interface PreviewClause {
  id: string;
  heading?: string;
  body: string;
  highlight: ClauseHighlight;
}

export interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileSize: string;
  persona: Persona;
  language: Language;
  riskFocused: boolean;
  uploadedAt: string;
  summary: AnalysisSummary;
  risks: RiskItem[];
  rights: RightItem[];
  checklist: ChecklistItem[];
  preview: PreviewClause[];
  suggestedQuestions: string[];
}

export interface RecentDocument {
  id: string;
  name: string;
  persona: Persona;
  uploadedAt: string; // relative
}
