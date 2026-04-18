import { useState } from "react";
import { Eye, Filter } from "lucide-react";
import type { PreviewClause } from "@/types/lexiguide";
import { cn } from "@/lib/utils";

interface Props {
  clauses: PreviewClause[];
}

export function DocumentPreview({ clauses }: Props) {
  const [filterRisky, setFilterRisky] = useState(false);

  const visible = filterRisky
    ? clauses.filter((c) => c.highlight === "risk" || c.highlight === "warn")
    : clauses;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border surface-2">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Original document preview</h3>
        </div>
        <div className="flex items-center rounded-md border border-border-strong bg-background p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => setFilterRisky(false)}
            className={cn(
              "rounded-[4px] px-2 py-1 font-medium transition-colors",
              !filterRisky ? "bg-surface-3 text-foreground" : "text-muted-foreground"
            )}
          >
            Full text
          </button>
          <button
            type="button"
            onClick={() => setFilterRisky(true)}
            className={cn(
              "inline-flex items-center gap-1 rounded-[4px] px-2 py-1 font-medium transition-colors",
              filterRisky ? "bg-risk-muted/50 text-risk" : "text-muted-foreground"
            )}
          >
            <Filter className="h-3 w-3" />
            Highlights only
          </button>
        </div>
      </header>

      <div className="scroll-thin grid-bg flex-1 overflow-y-auto px-5 py-5">
        <article className="mx-auto max-w-[58ch] space-y-5 text-[13px] leading-relaxed text-foreground/80">
          {visible.map((c) => (
            <section
              key={c.id}
              className={cn(
                c.highlight === "risk" && "clause-rule-risk",
                c.highlight === "warn" && "clause-rule-warn",
                c.highlight === "safe" && "clause-rule-safe",
                c.highlight === "none" && "clause-rule"
              )}
            >
              {c.heading && (
                <h4 className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-foreground/70">
                  {c.heading}
                </h4>
              )}
              <p>{c.body}</p>
            </section>
          ))}
        </article>
      </div>

      <footer className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
        <span className="font-mono uppercase tracking-wider">
          {visible.length} of {clauses.length} clauses shown
        </span>
        <span>Read-only preview</span>
      </footer>
    </div>
  );
}
