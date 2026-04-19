import { Download, ShieldAlert, ShieldCheck } from "lucide-react";
import type { DocumentAnalysis } from "@/types/lexiguide";
import { generateMarkdownReport, downloadAsFile } from "@/lib/exportReport";
import { toast } from "sonner";

interface Props {
  analysis: DocumentAnalysis;
}

export function ResultsBottomBar({ analysis }: Props) {
  const high = analysis.risks.filter((r) => r.severity === "high").length;
  const rights = analysis.rights.length;

  const handleDownload = () => {
    const markdown = generateMarkdownReport(analysis);
    const filename = `${analysis.fileName.split(".")[0]}_analysis.md`;
    downloadAsFile(markdown, filename);
    toast.success("Analysis report downloaded");
  };

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

      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-1.5 text-xs font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <Download className="h-3.5 w-3.5" />
        Download Report as Markdown
      </button>
    </div>
  );
}
