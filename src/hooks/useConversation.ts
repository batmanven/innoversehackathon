import { useCallback, useState } from "react";
import type { QAEntry } from "@/types/lexiguide";
import { pickMockAnswer } from "@/data/mock";

export function useConversation() {
  const [messages, setMessages] = useState<QAEntry[]>([]);
  const [isResponding, setIsResponding] = useState(false);

  const ask = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

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

    // Simulate a short reply time. No fake streaming/sparkles.
    await new Promise((r) => setTimeout(r, 650));
    const answer = pickMockAnswer(trimmed);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === pendingId
          ? { ...m, content: answer.content, references: answer.references, pending: false }
          : m
      )
    );
    setIsResponding(false);
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  return { messages, ask, isResponding, clear };
}
