import { FileText, Languages, ShieldAlert, ArrowLeft } from "lucide-react";
import type { DocumentAnalysis } from "@/types/lexiguide";
import { LANGUAGES, PERSONAS } from "@/types/lexiguide";

interface Props {
  analysis: DocumentAnalysis;
  onBack: () => void;
}

export function ResultsHeader({ analysis, onBack }: Props) {
  const persona = PERSONAS.find((p) => p.value === analysis.persona)?.label ?? analysis.persona;
  const language = LANGUAGES.find((l) => l.value === analysis.language)?.label ?? analysis.language;

  return (
    <div className="mb-6 animate-fade-up">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to upload
      </button>

      <div className="flex flex-col gap-4 rounded-xl border border-border surface-2 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/30">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-500 leading-tight tracking-tight text-foreground">
              {analysis.fileName}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="font-mono uppercase tracking-wider text-foreground/70">
                  Viewing as
                </span>
                <span className="rounded-sm border border-border-strong bg-background px-1.5 py-0.5 font-medium text-foreground/90">
                  {persona}
                </span>
              </span>
              <span className="text-border-strong">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Languages className="h-3.5 w-3.5" />
                Explained in {language}
              </span>
              <span className="text-border-strong">·</span>
              <span>{analysis.fileSize}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {analysis.riskFocused && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-warn/30 bg-warn-muted/40 px-2 py-1 text-[11px] font-medium text-warn">
              <ShieldAlert className="h-3 w-3" />
              Risk-focused view
            </span>
          )}
        </div>
      </div>

      <p className="mt-2 px-1 text-[11px] text-muted-foreground/80">
        This is an assistive explanation, not legal advice.
      </p>
    </div>
  );
}
