import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { DocumentAnalysis, Language, Persona } from "@/types/lexiguide";
import { SAMPLE_ANALYSIS } from "@/data/mock";

export interface AnalyzeInput {
  file: File | null;
  fileName?: string;
  fileSize?: string;
  persona: Persona;
  language: Language;
  riskFocused: boolean;
  useSample?: boolean;
}

export function useAnalyzeDocument() {
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);

  const mutation = useMutation({
    mutationFn: async (input: AnalyzeInput): Promise<DocumentAnalysis> => {
      // Simulate network + analysis latency.
      await new Promise((r) => setTimeout(r, 900));
      const base = SAMPLE_ANALYSIS;
      const fileName = input.useSample
        ? base.fileName
        : input.fileName || input.file?.name || "Untitled document";
      const fileSize = input.useSample
        ? base.fileSize
        : input.fileSize ||
          (input.file ? `${Math.max(1, Math.round(input.file.size / 1024))} KB` : "—");
      return {
        ...base,
        id: `${Date.now()}`,
        fileName,
        fileSize,
        persona: input.persona,
        language: input.language,
        riskFocused: input.riskFocused,
        uploadedAt: "Just now",
      };
    },
    onSuccess: (data) => setAnalysis(data),
  });

  const reset = useCallback(() => {
    setAnalysis(null);
    mutation.reset();
  }, [mutation]);

  return {
    analysis,
    setAnalysis,
    analyze: mutation.mutate,
    isAnalyzing: mutation.isPending,
    error: mutation.error,
    reset,
  };
}
