import type { AnalysisSummary } from "@/types/lexiguide";

interface Props {
  summary: AnalysisSummary;
}

function withHighlight(text: string, highlight?: string) {
  if (!highlight) return <>{text}</>;
  const i = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-primary/15 px-1 py-0.5 font-medium text-primary">
        {text.slice(i, i + highlight.length)}
      </mark>
      {text.slice(i + highlight.length)}
    </>
  );
}

export function SummaryTab({ summary }: Props) {
  return (
    <div className="rounded-xl border border-border surface-2 p-6 animate-fade-up">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-lg font-500 text-foreground">Executive Summary</h2>
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          {summary.bullets.length} key points
        </span>
      </div>

      <p className="mb-5 rounded-md border-l-2 border-primary/60 bg-primary/[0.04] px-4 py-3 text-[15px] leading-relaxed text-foreground/90">
        {summary.headline}
      </p>

      <ul className="space-y-3.5">
        {summary.bullets.map((b, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
            <span>{withHighlight(b.text, b.highlight)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
