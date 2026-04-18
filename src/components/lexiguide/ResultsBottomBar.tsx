import { Download, ShieldAlert, ShieldCheck } from "lucide-react";
import type { DocumentAnalysis } from "@/types/lexiguide";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  analysis: DocumentAnalysis;
}

export function ResultsBottomBar({ analysis }: Props) {
  const high = analysis.risks.filter((r) => r.severity === "high").length;
  const rights = analysis.rights.length;

  return (
    <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-lg border border-border surface-2 px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-risk" />
          <span className="font-mono text-foreground/80">{high}</span> high-impact risks detected
        </span>
        <span className="hidden text-border-strong sm:inline">·</span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-safe" />
          <span className="font-mono text-foreground/80">{rights}</span> key rights found
        </span>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-md border border-border-strong bg-background px-3 py-1.5 text-xs text-muted-foreground opacity-70"
          >
            <Download className="h-3.5 w-3.5" />
            Download explanation
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">Coming soon</TooltipContent>
      </Tooltip>
    </div>
  );
}
