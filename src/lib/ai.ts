import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Singleton factory for the Gemini model instance.
 * Ensures we only create the model once and provides global configuration.
 */

let modelInstance: ChatGoogleGenerativeAI | null = null;

/**
 * Returns true if the Google API Key is present in the environment.
 */
export function isAIConfigured(): boolean {
  return !!import.meta.env.VITE_GOOGLE_API_KEY;
}

/**
 * Initializes and returns the Gemini 2.0 Flash chat model.
 * 
 * @param temperature - Controls creativity (lower is better for factual legal analysis)
 * @returns Configured ChatGoogleGenerativeAI instance
 */
export function getModel(temperature: number = 0.3): ChatGoogleGenerativeAI {
  if (!import.meta.env.VITE_GOOGLE_API_KEY) {
    throw new Error("Gemini API key not found. Please set VITE_GOOGLE_API_KEY in your .env file.");
  }

  // We re-initialize if temperature differs (though usually we stick to a default)
  if (!modelInstance) {
    modelInstance = new ChatGoogleGenerativeAI({
      model: "gemini-flash-latest",
      maxOutputTokens: 8192,
      temperature: temperature,
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    });
  }

  return modelInstance;
}
