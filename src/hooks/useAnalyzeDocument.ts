import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { DocumentAnalysis, Language, Persona } from "@/types/lexiguide";

export interface AnalyzeInput {
  file: File;
  persona: Persona;
  language: Language;
  riskFocused: boolean;
}

export type AnalysisProgress = "extracting" | "analyzing" | "generating" | null;

export function useAnalyzeDocument() {
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [documentText, setDocumentText] = useState<string>("");
  const [progress, setProgress] = useState<AnalysisProgress>(null);

  const mutation = useMutation({
    mutationFn: async (input: AnalyzeInput): Promise<DocumentAnalysis> => {
      try {
        if (!input.file) {
          throw new Error("No file provided for analysis.");
        }

        setProgress("extracting");
        const { extractText } = await import("@/lib/documentParser");
        const { text } = await extractText(input.file);
        setDocumentText(text);

        setProgress("analyzing");
        const { analyzeDocumentWithAI } = await import("@/lib/analyzeWithAI");
        const result = await analyzeDocumentWithAI(
          text,
          input.persona,
          input.language,
          input.riskFocused
        );

        setProgress("generating");
        return {
          ...result,
          id: `${Date.now()}`,
          fileName: input.file.name,
          fileSize: `${Math.max(1, Math.round(input.file.size / 1024))} KB`,
          persona: input.persona,
          language: input.language,
          riskFocused: input.riskFocused,
          uploadedAt: "Just now",
        } as DocumentAnalysis;
      } finally {
        setProgress(null);
      }
    },
    onSuccess: (data) => setAnalysis(data),
  });

  const reset = useCallback(() => {
    setAnalysis(null);
    setDocumentText("");
    mutation.reset();
  }, [mutation]);

  return {
    analysis,
    documentText,
    progress,
    setAnalysis,
    setDocumentText,
    analyze: mutation.mutate,
    isAnalyzing: mutation.isPending,
    error: mutation.error,
    reset,
  };
}
