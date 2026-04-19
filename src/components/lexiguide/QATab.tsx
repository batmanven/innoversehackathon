import { useConversation } from "@/hooks/useConversation";
import { ChatThread } from "./ChatThread";
import { ChatInput } from "./ChatInput";

interface Props {
  suggestedQuestions: string[];
  documentText: string;
}

export function QATab({ suggestedQuestions, documentText }: Props) {
  const { messages, ask, isResponding } = useConversation(documentText);

  return (
    <div className="flex h-[560px] flex-col overflow-hidden rounded-xl border border-border surface-2 animate-fade-up">
      {/* Suggested chips */}
      <div className="border-b border-border px-4 py-3">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Suggested questions
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              disabled={isResponding}
              className="rounded-full border border-border-strong bg-background/50 px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className="min-h-0 flex-1">
        <ChatThread messages={messages} />
      </div>

      <ChatInput onSend={ask} disabled={isResponding} />
    </div>
  );
}
