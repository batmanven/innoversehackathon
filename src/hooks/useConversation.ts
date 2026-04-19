import { useCallback, useState } from "react";
import type { QAEntry } from "@/types/lexiguide";
import { pickMockAnswer } from "@/data/mock";

export function useConversation(documentText?: string) {
  const [messages, setMessages] = useState<QAEntry[]>([]);
  const [isResponding, setIsResponding] = useState(false);

  const ask = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || !documentText) return;

    const userMsg: QAEntry = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    
    const pendingId = `a-${Date.now() + 1}`;
    const pendingMsg: QAEntry = {
      id: pendingId,
      role: "assistant",
      content: "",
      pending: true,
    };
    
    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setIsResponding(true);

    try {
      const { chatAboutDocument } = await import("@/lib/chatWithAI");
      
      // Prepare history (excluding the current user/pending messages)
      const history = messages.map(m => ({ 
        role: m.role, 
        content: m.content 
      }));

      const response = await chatAboutDocument(trimmed, documentText, history);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { 
                ...m, 
                content: response.answer, 
                references: response.references, 
                pending: false 
              }
            : m
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { 
                ...m, 
                content: "I'm sorry, I encountered an error while analyzing the document.", 
                pending: false 
              }
            : m
        )
      );
    } finally {
      setIsResponding(false);
    }
  }, [documentText, messages]);

  const clear = useCallback(() => setMessages([]), []);

  return { messages, ask, isResponding, clear };
}
