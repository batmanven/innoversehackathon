import { getModel } from "./ai";
import { z } from "zod";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

const ChatResponseSchema = z.object({
  answer: z.string().describe("The answer to the user's question, based only on the document."),
  references: z.array(z.object({
    clause: z.string().describe("The clause or section identifier, e.g., 'Clause 4.2'"),
    label: z.string().describe("A short label for the reference, e.g., 'Early Exit Penalty'")
  })).describe("Specific sections of the document that support the answer.")
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;

/**
 * Answers a question based on the document text using Gemini.
 */
export async function chatAboutDocument(
  question: string,
  documentText: string,
  history: { role: "user" | "assistant"; content: string }[],
  persona: string = "user"
): Promise<ChatResponse> {
  const model = getModel();
  const structuredModel = model.withStructuredOutput(ChatResponseSchema);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a helpful and intelligent legal document assistant. 
    
Your goal is to explain the provided document to the user, who is viewing it as a ${persona.toUpperCase()}.
    
1. Tone: Professional, friendly, and protective of the user's interests.
2. Grounding: Answer based ONLY on the provided document text. 
3. Reasoning: If a user asks a question that isn't EXPLICITLY in the text (e.g., "Can I do X?"), look at the existing clauses and explain the implications for a ${persona}.
4. Greetings: If the user says "Hello" or "How are you", respond politely and invite them to ask about the document.
5. Missing Info: If truly NO information exists, say: "The document doesn't mention this explicitly, but as a ${persona}, you should check [Relevant Section] for related rules."

Always cite specific clauses in the references field.

DOCUMENT TEXT:
\"\"\"
${documentText}
\"\"\"`],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ]);

  const chain = prompt.pipe(structuredModel);

  // Convert history to LangChain format
  const chatHistory = history.map(m =>
    m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
  );

  try {
    const result = await chain.invoke({
      input: question,
      history: chatHistory,
    });

    return result as ChatResponse;
  } catch (error) {
    console.error("AI Chat failed:", error);
    throw new Error("Failed to get an answer. Please check your connection.");
  }
}
