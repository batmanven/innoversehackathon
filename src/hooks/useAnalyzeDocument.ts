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
  const [documentText, setDocumentText] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async (input: AnalyzeInput): Promise<DocumentAnalysis> => {
      // 1. Handle Sample Data
      if (input.useSample) {
        await new Promise((r) => setTimeout(r, 600));
        setDocumentText(""); // Reset for sample
        return {
          ...SAMPLE_ANALYSIS,
          id: `sample-${Date.now()}`,
          uploadedAt: "Just now",
        };
      }

      if (!input.file) {
        throw new Error("No file provided for analysis.");
      }

      // 2. Extract Text from File (PDF/DOCX/TXT)
      const { extractText } = await import("@/lib/documentParser");
      const { text, pageCount } = await extractText(input.file);
      setDocumentText(text);

      // 3. Analyze with Gemini AI
      const { analyzeDocumentWithAI } = await import("@/lib/analyzeWithAI");
      const result = await analyzeDocumentWithAI(
        text,
        input.persona,
        input.language,
        input.riskFocused
      );

      // 4. Transform to full DocumentAnalysis type
      return {
        ...result,
        id: `${Date.now()}`,
        fileName: input.file.name,
        fileSize: `${Math.max(1, Math.round(input.file.size / 1024))} KB`,
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
    setDocumentText("");
    mutation.reset();
  }, [mutation]);

  return {
    analysis,
    documentText,
    setAnalysis,
    analyze: mutation.mutate,
    isAnalyzing: mutation.isPending,
    error: mutation.error,
    reset,
  };
}
