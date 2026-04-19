import { z } from "zod";

/**
 * Zod schemas that mirror the TypeScript interfaces in @/types/lexiguide.
 * These are used by Gemini Structured Output to ensure high-fidelity results.
 */

export const SummaryBulletSchema = z.object({
  text: z.string().describe("The text content of the summary point"),
  highlight: z.string().optional().describe("A short 2-5 word key term to highlight, e.g., '12-month lock-in'"),
});

export const AnalysisSummarySchema = z.object({
  headline: z.string().describe("A one-sentence impact headline for the document"),
  bullets: z.array(SummaryBulletSchema).describe("5-8 key points about the document"),
});

export const RiskItemSchema = z.object({
  id: z.string().describe("A unique identifier like 'r1', 'r2'"),
  title: z.string().describe("Short title of the risk"),
  description: z.string().describe("Explanation in simple, non-legal language"),
  severity: z.enum(["high", "medium", "low"]).describe("How critical this risk is"),
  tags: z.array(z.string()).describe("1-3 categories like ['Penalty', 'Lock-in']"),
  clauseRef: z.string().describe("The exact clause or section number, e.g., 'Clause 4.2'"),
});

export const RightItemSchema = z.object({
  id: z.string().describe("A unique identifier like 'rt1', 'rt2'"),
  title: z.string().describe("Short title of the right or protection"),
  description: z.string().describe("How the user can benefit from this clause"),
  tags: z.array(z.string()).describe("1-3 categories like ['Refund', 'Notice']"),
  clauseRef: z.string().describe("The exact clause or section number"),
});

export const ChecklistItemSchema = z.object({
  id: z.string().describe("A unique identifier like 'c1', 'c2'"),
  group: z.enum(["must", "must_not", "deadlines"]).describe("Category of the action"),
  action: z.string().describe("Short, actionable instruction"),
  detail: z.string().describe("Why this action matters or specific guidance"),
  due: z.string().optional().describe("For deadlines, a human-readable due date or timeframe"),
});

export const PreviewClauseSchema = z.object({
  id: z.string().describe("Unique section ID"),
  heading: z.string().optional().describe("The section heading from the document"),
  body: z.string().describe("The actual text content of the clause"),
  highlight: z.enum(["none", "risk", "warn", "safe"]).describe("Visual highlighting based on risk level"),
});

/**
 * The full structured output schema for the Gemini model.
 * Matches exactly what the DocumentAnalysis type expects (excluding metadata added client-side).
 */
export const DocumentAnalysisResultSchema = z.object({
  summary: AnalysisSummarySchema,
  risks: z.array(RiskItemSchema),
  rights: z.array(RightItemSchema),
  checklist: z.array(ChecklistItemSchema),
  preview: z.array(PreviewClauseSchema),
  suggestedQuestions: z.array(z.string()).describe("4-6 questions the user might want to ask next"),
});

export type DocumentAnalysisResult = z.infer<typeof DocumentAnalysisResultSchema>;
