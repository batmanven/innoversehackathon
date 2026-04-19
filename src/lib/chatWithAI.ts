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
  history: { role: "user" | "assistant"; content: string }[]
): Promise<ChatResponse> {
  const model = getModel();
  const structuredModel = model.withStructuredOutput(ChatResponseSchema);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a legal document assistant. Answer the user's question based ONLY on the document provided below.
    
If the answer is not in the document, say: "I couldn't find information about this in the document."
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
