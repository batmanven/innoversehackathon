import { useEffect, useRef } from "react";
import { BookOpenText } from "lucide-react";
import type { QAEntry } from "@/types/lexiguide";
import { cn } from "@/lib/utils";

interface Props {
  messages: QAEntry[];
}

export function ChatThread({ messages }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 px-6 text-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-3 text-muted-foreground">
          <BookOpenText className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium text-foreground">Ask anything about this document</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Try one of the suggested questions above, or type your own. Answers will reference the
          relevant clauses.
        </p>
      </div>
    );
  }

  return (
    <div className="scroll-thin h-full overflow-y-auto px-4 py-4">
      <ul className="space-y-4">
        {messages.map((m) => (
          <li
            key={m.id}
            className={cn(
              "flex animate-fade-up",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
                  : "bg-surface-3 text-foreground/90 ring-1 ring-border"
              )}
            >
              {m.pending ? (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" />
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground"
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground"
                    style={{ animationDelay: "240ms" }}
                  />
                </span>
              ) : (
                <>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.references && m.references.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
                      <span className="font-mono uppercase tracking-wider">References:</span>
                      {m.references.map((r) => (
                        <span
                          key={r.clause}
                          className="rounded-sm border border-border-strong bg-background px-1.5 py-0.5 font-mono text-foreground/80"
                        >
                          {r.clause} — {r.label}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
        <div ref={endRef} />
      </ul>
    </div>
  );
}
