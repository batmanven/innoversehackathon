import { FileText, Plus } from "lucide-react";
import type { Persona, RecentDocument } from "@/types/lexiguide";
import { cn } from "@/lib/utils";
import { PERSONAS } from "@/types/lexiguide";
import { getStorageStats } from "@/lib/storage";

interface Props {
  activeId?: string | null;
  documents: RecentDocument[];
  onNewDocument: () => void;
  onSelect: (doc: RecentDocument) => void;
  onDelete: (id: string) => void;
}

const personaLabel = (p: Persona) => PERSONAS.find((x) => x.value === p)?.label ?? p;

export function HistorySidebar({ activeId, documents, onNewDocument, onSelect, onDelete }: Props) {
  return (
    <aside className="flex h-full flex-col border-r border-border surface-2/40">
      {/* Top action section */}
      <div className="border-b border-border p-5">
        <button
          type="button"
          onClick={onNewDocument}
          className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          New analysis
        </button>
      </div>

      {/* Header section */}
      <div className="flex items-center justify-between px-5 pb-2.5 pt-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
          History
        </h2>
        <span className="flex h-5 items-center rounded-full border border-border-strong bg-background px-2 text-[10px] font-bold tabular-nums text-muted-foreground">
          {documents.length}
        </span>
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto px-2">
        <ul className="space-y-1 py-2">
          {documents.map((doc) => {
            const isActive = activeId === doc.id;
            return (
              <li key={doc.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelect(doc)}
                  className={cn(
                    "flex w-full items-start gap-3.5 rounded-lg px-3 py-3 text-left transition-all",
                    "hover:bg-surface-3",
                    isActive ? "bg-surface-3 shadow-sm ring-1 ring-border-strong" : "opacity-80 hover:opacity-100"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-1 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary" />
                  )}
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-background/50 text-muted-foreground group-hover:border-primary/20 group-hover:text-foreground"
                    )}
                  >
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-foreground/90 leading-tight">
                      {doc.name}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-muted-foreground/80">
                      <span className="rounded-sm bg-background/50 px-1.5 py-0.5 font-mono uppercase tracking-widest text-[9px] border border-border-strong/40">
                        {personaLabel(doc.persona)}
                      </span>
                      <span className="text-border-strong">•</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(doc.id);
                  }}
                  className="absolute right-2 top-2 hidden group-hover:block hover:text-destructive text-muted-foreground"
                  aria-label="Delete analysis"
                >
                  <Plus className="h-3 w-3 rotate-45" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

    </aside>
  );
}
