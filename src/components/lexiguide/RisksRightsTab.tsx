import { AlertTriangle, ShieldCheck } from "lucide-react";
import type { RightItem, RiskItem, Severity } from "@/types/lexiguide";
import { cn } from "@/lib/utils";

interface Props {
  risks: RiskItem[];
  rights: RightItem[];
}

const severityStyles: Record<Severity, { dot: string; label: string; ring: string }> = {
  high: { dot: "bg-risk", label: "High", ring: "ring-risk/30" },
  medium: { dot: "bg-warn", label: "Medium", ring: "ring-warn/30" },
  low: { dot: "bg-muted-foreground", label: "Low", ring: "ring-border-strong" },
};

function Tag({ children, tone = "risk" }: { children: React.ReactNode; tone?: "risk" | "safe" }) {
  return (
    <span
      className={cn(
        "rounded-sm px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider",
        tone === "risk" ? "bg-risk-muted/40 text-risk" : "bg-safe-muted/40 text-safe"
      )}
    >
      {children}
    </span>
  );
}

export function RisksRightsTab({ risks, rights }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Risks column */}
      <div className="flex flex-col min-h-0">
        <header className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-risk-muted/40 text-risk">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risks & obligations</h3>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/60">{risks.length}</span>
        </header>

        <ul className="space-y-3">
          {risks.map((r) => {
            const sev = severityStyles[r.severity];
            return (
              <li
                key={r.id}
                className={cn(
                  "rounded-lg border border-border bg-surface-2 p-3 transition-colors hover:border-border-strong",
                  sev.ring
                )}
              >
                <div className="mb-1 flex items-start justify-between gap-3">
                  <h4 className="text-[13px] font-medium leading-snug text-foreground">{r.title}</h4>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                    <span className={cn("h-1 w-1 rounded-full", sev.dot)} />
                    {sev.label}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed text-muted-foreground">{r.description}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-1">
                  {r.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                  <span className="ml-auto text-[9px] font-mono text-muted-foreground/50">
                    {r.clauseRef}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Rights column */}
      <div className="flex flex-col min-h-0">
        <header className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-safe-muted/40 text-safe">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your rights</h3>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/60">{rights.length}</span>
        </header>

        <ul className="space-y-3">
          {rights.map((g) => (
            <li
              key={g.id}
              className="rounded-lg border border-border bg-surface-2 p-3 transition-colors hover:border-border-strong ring-1 ring-inset ring-safe/10"
            >
              <h4 className="mb-1 text-[13px] font-medium leading-snug text-foreground">{g.title}</h4>
              <p className="text-[12px] leading-relaxed text-muted-foreground">{g.description}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1">
                {g.tags.map((t) => (
                  <Tag key={t} tone="safe">
                    {t}
                  </Tag>
                ))}
                <span className="ml-auto text-[9px] font-mono text-muted-foreground/50">
                  {g.clauseRef}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
