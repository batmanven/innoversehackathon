import { useCallback, useRef, useState } from "react";
import { FileUp, FileText, X, Loader2, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PersonaSelector } from "./PersonaSelector";
import { LanguageSelector } from "./LanguageSelector";
import type { Language, Persona } from "@/types/lexiguide";

interface Props {
  isAnalyzing: boolean;
  onAnalyze: (input: {
    file: File;
    persona: Persona;
    language: Language;
    riskFocused: boolean;
  }) => void;
  onUseSample: (input: { persona: Persona; language: Language; riskFocused: boolean }) => void;
}

const ACCEPT = ".pdf,.docx,.doc,.txt";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadCard({ isAnalyzing, onAnalyze, onUseSample }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [persona, setPersona] = useState<Persona | "">("");
  const [language, setLanguage] = useState<Language>("english");
  const [riskFocused, setRiskFocused] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPickFiles = useCallback((files: FileList | null) => {
    const f = files?.[0];
    if (f) setFile(f);
  }, []);

  const canAnalyze = !!file && !!persona && !isAnalyzing;

  const submit = () => {
    setTouched(true);
    if (!file || !persona) return;
    onAnalyze({ file, persona: persona as Persona, language, riskFocused });
  };

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-up">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Document Understanding Copilot
        </div>
        <h1 className="font-display text-3xl font-500 leading-tight tracking-tight text-foreground sm:text-[40px]">
          Understand your document,
          <br />
          <span className="text-foreground/60">before you sign it.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
          Upload a policy, contract, or rules document and get a clear explanation
          with key risks and your rights — in your language.
        </p>
      </div>

      <div className="rounded-xl border border-border surface-2 p-6 shadow-[0_1px_0_0_hsl(var(--border-strong))_inset,0_30px_60px_-30px_rgb(0_0_0/0.6)]">
        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            onPickFiles(e.dataTransfer.files);
          }}
          className={cn(
            "relative grid place-items-center rounded-lg border border-dashed px-6 py-10 transition-colors",
            dragOver
              ? "border-primary/50 bg-primary/5"
              : "border-border-strong bg-background/40 hover:border-primary/30 hover:bg-primary/[0.03]"
          )}
        >
          {!file ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-surface-3 text-primary ring-1 ring-border-strong">
                <FileUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drop PDF or DOCX here, or <span className="text-primary underline-offset-4 hover:underline">browse</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Up to 20 MB · PDF, DOCX, or plain text
                </p>
              </div>
            </button>
          ) : (
            <div className="flex w-full items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/30">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(file.size)} · ready to analyze
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-3 hover:text-foreground"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => onPickFiles(e.target.files)}
          />
        </div>

        {touched && !file && (
          <p className="mt-2 text-xs text-risk">Please add a document to analyze.</p>
        )}

        {/* Selectors */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <PersonaSelector value={persona} onChange={setPersona} />
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
        {touched && !persona && (
          <p className="mt-2 text-xs text-risk">Please tell us your role in this document.</p>
        )}

        {/* Toggle */}
        <div className="mt-5 flex items-center justify-between rounded-md border border-border bg-background/40 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Highlight risky clauses first</p>
            <p className="text-xs text-muted-foreground">
              Lead with penalties, lock-ins, and fees that affect you the most.
            </p>
          </div>
          <Switch checked={riskFocused} onCheckedChange={setRiskFocused} />
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => onUseSample({ persona: (persona || "tenant") as Persona, language, riskFocused })}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
          >
            <Sparkle className="h-3.5 w-3.5" />
            Try with a sample document
          </button>
          <Button
            onClick={submit}
            disabled={!canAnalyze && !isAnalyzing}
            className="h-11 min-w-[180px] bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              "Analyze document"
            )}
          </Button>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-muted-foreground/80">
        Files stay in your browser for this prototype. No uploads leave your device.
      </p>
    </div>
  );
}
