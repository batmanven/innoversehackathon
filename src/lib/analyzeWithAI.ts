import { getModel } from "./ai";
import { DocumentAnalysisResultSchema, type DocumentAnalysisResult } from "./schemas";
import { buildSystemPrompt, buildAnalysisPrompt } from "./prompts";
import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Main entry point for document analysis.
 * Extracts structured data from raw text using Gemini.
 */
export async function analyzeDocumentWithAI(
  text: string,
  persona: string,
  language: string,
  riskFocused: boolean
): Promise<DocumentAnalysisResult> {
  const model = getModel();
  
  // Bind the model to our Zod schema for structured output
  const structuredModel = model.withStructuredOutput(DocumentAnalysisResultSchema, {
    name: "document_analysis",
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", buildSystemPrompt(persona, riskFocused)],
    ["human", buildAnalysisPrompt(text, language)],
  ]);

  const chain = prompt.pipe(structuredModel);

  try {
    const result = await chain.invoke({
      input: text,
    });

    return result as DocumentAnalysisResult;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw new Error("Failed to analyze document. Please check your API key and network connection.");
  }
}
