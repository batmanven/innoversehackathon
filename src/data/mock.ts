import type { DocumentAnalysis, RecentDocument } from "@/types/lexiguide";

export const SAMPLE_ANALYSIS: DocumentAnalysis = {
  id: "sample-rental-2025",
  fileName: "Home Rental Agreement — Pune (2025).pdf",
  fileSize: "412 KB",
  persona: "tenant",
  language: "english",
  riskFocused: true,
  uploadedAt: "Just now",
  summary: {
    headline:
      "An 11-month residential lease with a 12-month lock-in, two months security deposit, and unilateral rent escalation clause.",
    bullets: [
      { text: "The lease runs for 11 months but enforces a 12-month lock-in period.", highlight: "12-month lock-in" },
      { text: "Security deposit is two months of rent, refundable within 30 days of move-out.", highlight: "two months" },
      { text: "Rent may be revised by the landlord with 30 days written notice.", highlight: "30 days written notice" },
      { text: "Late payment of rent attracts a 2% per month penalty on the outstanding amount.", highlight: "2% per month" },
      { text: "Tenant is responsible for minor repairs under ₹2,000; major repairs are the landlord's duty.", highlight: "₹2,000" },
      { text: "Subletting and short-term rentals are explicitly prohibited.", highlight: "prohibited" },
      { text: "Either party may terminate with 60 days notice after the lock-in period.", highlight: "60 days notice" },
    ],
  },
  risks: [
    {
      id: "r1",
      title: "12-month lock-in despite 11-month lease",
      description:
        "If you vacate before completing 12 months, you forfeit the entire security deposit and owe one extra month of rent.",
      severity: "high",
      tags: ["Lock-in", "Deposit at risk"],
      clauseRef: "Clause 4.2",
    },
    {
      id: "r2",
      title: "Unilateral rent revision",
      description:
        "Landlord can increase rent at any time with 30 days written notice. There is no cap or formula in the agreement.",
      severity: "high",
      tags: ["Rent hike", "No cap"],
      clauseRef: "Clause 6.1",
    },
    {
      id: "r3",
      title: "Late payment penalty compounds monthly",
      description:
        "A 2% per month penalty applies on overdue rent and continues to accrue until paid in full.",
      severity: "medium",
      tags: ["Penalty", "Fee"],
      clauseRef: "Clause 7.4",
    },
    {
      id: "r4",
      title: "Repair burden under ₹2,000 falls on tenant",
      description:
        "Plumbing, electrical, and appliance repairs costing under ₹2,000 each are entirely your responsibility.",
      severity: "medium",
      tags: ["Maintenance", "Out-of-pocket"],
      clauseRef: "Clause 9.3",
    },
  ],
  rights: [
    {
      id: "g1",
      title: "Deposit refund within 30 days",
      description:
        "Landlord must return the security deposit within 30 days of handover, less any documented damages.",
      tags: ["Deposit", "Refund"],
      clauseRef: "Clause 5.5",
    },
    {
      id: "g2",
      title: "60-day exit after lock-in",
      description:
        "After completing the lock-in, you can terminate the agreement with 60 days written notice without penalty.",
      tags: ["Notice period", "Exit"],
      clauseRef: "Clause 11.1",
    },
    {
      id: "g3",
      title: "Quiet enjoyment of the premises",
      description:
        "Landlord cannot enter without 24 hours advance notice except for genuine emergencies.",
      tags: ["Privacy", "Notice"],
      clauseRef: "Clause 8.2",
    },
    {
      id: "g4",
      title: "Major repair recovery",
      description:
        "Structural and major appliance repairs are the landlord's duty. You may deduct from rent if reasonable requests are ignored for 30+ days.",
      tags: ["Maintenance", "Set-off"],
      clauseRef: "Clause 9.4",
    },
  ],
  checklist: [
    {
      id: "c1",
      group: "must",
      action: "Pay rent by the 5th of every month",
      detail: "Use bank transfer with the agreement number in the reference to avoid disputes.",
    },
    {
      id: "c2",
      group: "must",
      action: "Keep a signed copy of the move-in inventory",
      detail: "Photograph every room and existing damage on the day you receive keys.",
    },
    {
      id: "c3",
      group: "must",
      action: "Notify landlord in writing for any major repair",
      detail: "Email or WhatsApp counts as written notice under Clause 9.5.",
    },
    {
      id: "c4",
      group: "must_not",
      action: "Do not sublet or list the unit on short-stay platforms",
      detail: "Violation triggers immediate termination and forfeiture of deposit.",
    },
    {
      id: "c5",
      group: "must_not",
      action: "Do not make structural changes without written consent",
      detail: "Includes painting, drilling beyond standard hooks, and removing fixtures.",
    },
    {
      id: "c6",
      group: "deadlines",
      action: "Lock-in ends",
      detail: "12 months from the lease commencement date.",
      due: "12 months from start",
    },
    {
      id: "c7",
      group: "deadlines",
      action: "Notice for exit",
      detail: "Serve at least 60 days written notice before the intended move-out date.",
      due: "60 days before exit",
    },
    {
      id: "c8",
      group: "deadlines",
      action: "Deposit return window",
      detail: "Follow up if deposit is not refunded within 30 days of handover.",
      due: "30 days after handover",
    },
  ],
  preview: [
    {
      id: "p1",
      heading: "1. Term & Commencement",
      body: "This Leave & Licence Agreement is executed for a term of eleven (11) months commencing from the date of possession. The Licensee acknowledges a minimum occupancy commitment of twelve (12) months, irrespective of the stated term.",
      highlight: "warn",
    },
    {
      id: "p2",
      heading: "4.2 Early Exit",
      body: "Should the Licensee vacate prior to completion of the twelve (12) month lock-in, the entire Security Deposit shall stand forfeited and an additional one month's licence fee shall become payable as liquidated damages.",
      highlight: "risk",
    },
    {
      id: "p3",
      heading: "6.1 Revision of Licence Fee",
      body: "The Licensor reserves the right to revise the monthly licence fee at its sole discretion by serving thirty (30) days prior written notice to the Licensee. No cap or escalation formula is prescribed under this clause.",
      highlight: "risk",
    },
    {
      id: "p4",
      heading: "5.5 Refund of Security Deposit",
      body: "The interest-free Security Deposit shall be refunded by the Licensor to the Licensee within thirty (30) days from the date of handover, after deduction of documented damages, if any, beyond normal wear and tear.",
      highlight: "safe",
    },
    {
      id: "p5",
      heading: "7.4 Late Payment",
      body: "Any delay in payment of the licence fee beyond the 5th day of the calendar month shall attract a penalty of two percent (2%) per month, calculated on the outstanding amount until cleared.",
      highlight: "warn",
    },
    {
      id: "p6",
      heading: "8.2 Right of Entry",
      body: "The Licensor or its representatives shall not enter the premises without serving twenty-four (24) hours prior intimation to the Licensee, save in cases of genuine emergency such as fire, flood, or structural hazard.",
      highlight: "safe",
    },
    {
      id: "p7",
      heading: "9.3 Maintenance",
      body: "Routine maintenance and minor repairs of value not exceeding ₹2,000 (Rupees Two Thousand) per incident shall be borne by the Licensee. Major and structural repairs shall be the responsibility of the Licensor.",
      highlight: "warn",
    },
    {
      id: "p8",
      heading: "11.1 Termination After Lock-in",
      body: "Following completion of the lock-in period, either party may terminate this Agreement by issuing sixty (60) days prior written notice, without assigning any reason and without penalty.",
      highlight: "safe",
    },
  ],
  suggestedQuestions: [
    "What happens if I leave before 1 year?",
    "Can the rent be increased at any time?",
    "What penalties apply if I miss a payment?",
    "Who pays for plumbing or appliance repairs?",
  ],
};

export const RECENT_DOCUMENTS: RecentDocument[] = [
  { id: "r-1", name: "HR Policy — Acme Logistics", persona: "employee", uploadedAt: "2h ago" },
  { id: "r-2", name: "Home Rental Agreement — Pune", persona: "tenant", uploadedAt: "Yesterday" },
  { id: "r-3", name: "Personal Loan Agreement — HDFC", persona: "borrower", uploadedAt: "3 days ago" },
  { id: "r-4", name: "Exam Rules — Mumbai University", persona: "student", uploadedAt: "Last week" },
  { id: "r-5", name: "Municipal Notice — Property Tax", persona: "citizen", uploadedAt: "Last week" },
];

// Fake but plausible canned answers for the chat (no real AI yet).
export const MOCK_ANSWERS: Record<string, { content: string; references: { clause: string; label: string }[] }> = {
  default: {
    content:
      "Based on this agreement, the most important thing to know is that the lock-in period (12 months) is longer than the lease term (11 months). That mismatch is intentional and shifts risk to you. Ask me about a specific clause and I'll point to it.",
    references: [
      { clause: "Clause 4.2", label: "Early exit penalty" },
      { clause: "Clause 1", label: "Term & Commencement" },
    ],
  },
  early: {
    content:
      "If you vacate before 12 months, you lose the entire security deposit (two months of rent) and owe one additional month as liquidated damages. There is no exception for job relocation or medical reasons in this agreement.",
    references: [{ clause: "Clause 4.2", label: "Early exit penalties" }],
  },
  rent: {
    content:
      "Yes — the landlord can revise the rent at any time with 30 days written notice. There is no cap or formula, which means a sudden 20% hike would be technically allowed. You can negotiate to add a cap before signing.",
    references: [{ clause: "Clause 6.1", label: "Revision of licence fee" }],
  },
  penalty: {
    content:
      "Late payment beyond the 5th of the month attracts 2% per month on the outstanding rent, accruing until paid. On a ₹30,000 rent, a one-month delay costs ₹600 extra. Repeated delays can also be cited as grounds for termination.",
    references: [
      { clause: "Clause 7.4", label: "Late payment" },
      { clause: "Clause 11.2", label: "Termination for default" },
    ],
  },
  repair: {
    content:
      "You pay for any single repair under ₹2,000. The landlord pays for major and structural repairs. If they ignore a written request for a major repair for more than 30 days, you may carry it out and deduct a reasonable amount from rent.",
    references: [
      { clause: "Clause 9.3", label: "Minor repairs" },
      { clause: "Clause 9.4", label: "Major repairs & set-off" },
    ],
  },
};

export function pickMockAnswer(question: string) {
  const q = question.toLowerCase();
  if (q.includes("leave") || q.includes("exit") || q.includes("before") || q.includes("year")) return MOCK_ANSWERS.early;
  if (q.includes("rent") && (q.includes("increase") || q.includes("raise") || q.includes("revise") || q.includes("hike")))
    return MOCK_ANSWERS.rent;
  if (q.includes("penalty") || q.includes("late") || q.includes("miss")) return MOCK_ANSWERS.penalty;
  if (q.includes("repair") || q.includes("plumb") || q.includes("appliance") || q.includes("maintenance"))
    return MOCK_ANSWERS.repair;
  return MOCK_ANSWERS.default;
}
