import { FileText, Plus } from "lucide-react";
import type { Persona, RecentDocument } from "@/types/lexiguide";
import { RECENT_DOCUMENTS, SAMPLE_ANALYSIS } from "@/data/mock";
import { cn } from "@/lib/utils";
import { PERSONAS } from "@/types/lexiguide";

interface Props {
  activeId?: string | null;
  onNewDocument: () => void;
  onSelect: (doc: RecentDocument) => void;
}

const personaLabel = (p: Persona) => PERSONAS.find((x) => x.value === p)?.label ?? p;

export function HistorySidebar({ activeId, onNewDocument, onSelect }: Props) {
  return (
    <aside className="flex h-full flex-col border-l border-border surface">
      <div className="flex items-center justify-between px-5 pb-3 pt-5">
        <div>
          <h2 className="text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
            Recent documents
          </h2>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Local to this session
          </p>
        </div>
        <span className="rounded-sm border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
          {RECENT_DOCUMENTS.length}
        </span>
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {RECENT_DOCUMENTS.map((doc) => {
            const isActive = activeId === doc.id || (activeId === SAMPLE_ANALYSIS.id && doc.id === "r-2");
            return (
              <li key={doc.id}>
                <button
                  type="button"
                  onClick={() => onSelect(doc)}
                  className={cn(
                    "group flex w-full items-start gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors",
                    "hover:bg-surface-3",
                    isActive && "bg-surface-3 ring-1 ring-border-strong"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground/90">{doc.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded-sm bg-surface-3 px-1.5 py-0.5 font-mono uppercase tracking-wider">
                        {personaLabel(doc.persona)}
                      </span>
                      <span>·</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={onNewDocument}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          New document
        </button>
      </div>
    </aside>
  );
}
