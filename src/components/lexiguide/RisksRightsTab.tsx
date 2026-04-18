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
    <div className="grid gap-4 md:grid-cols-2 animate-fade-up">
      {/* Risks column */}
      <section className="rounded-xl border border-border surface-2 p-5">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-risk-muted/40 text-risk">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Risks & obligations</h3>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">{risks.length}</span>
        </header>

        <ul className="space-y-3">
          {risks.map((r) => {
            const sev = severityStyles[r.severity];
            return (
              <li
                key={r.id}
                className={cn(
                  "rounded-md border border-border bg-background/40 p-3.5 ring-1 ring-inset",
                  sev.ring
                )}
              >
                <div className="mb-1.5 flex items-start justify-between gap-3">
                  <h4 className="text-sm font-medium text-foreground">{r.title}</h4>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <span className={cn("h-1.5 w-1.5 rounded-full", sev.dot)} />
                    {sev.label}
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-foreground/75">{r.description}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {r.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                  <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                    {r.clauseRef}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Rights column */}
      <section className="rounded-xl border border-border surface-2 p-5">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-safe-muted/40 text-safe">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Your rights</h3>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">{rights.length}</span>
        </header>

        <ul className="space-y-3">
          {rights.map((g) => (
            <li
              key={g.id}
              className="rounded-md border border-border bg-background/40 p-3.5 ring-1 ring-inset ring-safe/20"
            >
              <h4 className="mb-1.5 text-sm font-medium text-foreground">{g.title}</h4>
              <p className="text-[13px] leading-relaxed text-foreground/75">{g.description}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {g.tags.map((t) => (
                  <Tag key={t} tone="safe">
                    {t}
                  </Tag>
                ))}
                <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                  {g.clauseRef}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
