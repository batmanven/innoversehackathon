import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { DocumentAnalysis, Language, Persona } from "@/types/lexiguide";
import { extractText } from "@/lib/documentParser";
import { analyzeDocumentWithAI } from "@/lib/analyzeWithAI";

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
      console.log("🚀 Starting analysis pipeline for:", input.file.name);
      console.time("analysis-pipeline");
      
      try {
        // 1. Text Extraction
        setProgress("extracting");
        const { text } = await extractText(input.file);
        setDocumentText(text);
        console.log("📄 Extraction complete. Text length:", text.length);

        // 2. AI Analysis
        setProgress("analyzing");
        const result = await analyzeDocumentWithAI(
          text,
          input.persona,
          input.language,
          input.riskFocused
        );
        console.log("🤖 AI Analysis complete:", result);

        // 3. Transformation
        setProgress("generating");
        const final: DocumentAnalysis = {
          ...result,
          id: `${Date.now()}`,
          fileName: input.file.name,
          fileSize: `${Math.max(1, Math.round(input.file.size / 1024))} KB`,
          persona: input.persona,
          language: input.language,
          riskFocused: input.riskFocused,
          uploadedAt: "Just now",
        } as DocumentAnalysis;
        
        console.timeEnd("analysis-pipeline");
        return final;
      } catch (err) {
        console.error("❌ Pipeline failure:", err);
        throw err;
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
