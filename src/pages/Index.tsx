import { useState } from "react";
import { TopNav } from "@/components/lexiguide/TopNav";
import { HistorySidebar } from "@/components/lexiguide/HistorySidebar";
import { UploadCard } from "@/components/lexiguide/UploadCard";
import { ResultsHeader } from "@/components/lexiguide/ResultsHeader";
import { ExplanationTabs } from "@/components/lexiguide/ExplanationTabs";
import { DocumentPreview } from "@/components/lexiguide/DocumentPreview";
import { ResultsBottomBar } from "@/components/lexiguide/ResultsBottomBar";

import type { Language, Persona, RecentDocument } from "@/types/lexiguide";
import { SAMPLE_ANALYSIS } from "@/data/mock";
import { useAnalyzeDocument } from "@/hooks/useAnalyzeDocument";

const Index = () => {
  const { analysis, documentText, setAnalysis, analyze, isAnalyzing, reset } = useAnalyzeDocument();
  const [showSidebar] = useState(true);

  const handleAnalyze = (input: {
    file: File;
    persona: Persona;
    language: Language;
    riskFocused: boolean;
  }) => {
    analyze({
      file: input.file,
      persona: input.persona,
      language: input.language,
      riskFocused: input.riskFocused,
    });
  };

  const handleSample = (input: { persona: Persona; language: Language; riskFocused: boolean }) => {
    analyze({
      file: null,
      persona: input.persona,
      language: input.language,
      riskFocused: input.riskFocused,
      useSample: true,
      fileName: SAMPLE_ANALYSIS.fileName,
      fileSize: SAMPLE_ANALYSIS.fileSize,
    });
  };

  const handleSelectRecent = (doc: RecentDocument) => {
    // Mocked: any selection loads the sample analysis with the doc's persona/name.
    setAnalysis({
      ...SAMPLE_ANALYSIS,
      id: doc.id,
      fileName: doc.name,
      persona: doc.persona,
      uploadedAt: doc.uploadedAt,
    });
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      <TopNav />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        {showSidebar && (
          <aside className="w-[300px] shrink-0 border-r border-border h-full overflow-hidden bg-[hsl(var(--sidebar-bg))]">
            <HistorySidebar
              activeId={analysis?.id ?? null}
              onNewDocument={reset}
              onSelect={handleSelectRecent}
            />
          </aside>
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:py-12">
            {!analysis ? (
              <div className="flex min-h-[70vh] items-center justify-center">
                <UploadCard
                  isAnalyzing={isAnalyzing}
                  onAnalyze={handleAnalyze}
                  onUseSample={handleSample}
                />
              </div>
            ) : (
              <div className="space-y-8">
                <ResultsHeader analysis={analysis} onBack={reset} />

                <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
                  <div className="min-w-0">
                    <ExplanationTabs analysis={analysis} documentText={documentText} />
                  </div>
                  <div className="min-w-0 xl:sticky xl:top-0">
                    <DocumentPreview clauses={analysis.preview} />
                  </div>
                </div>

                <ResultsBottomBar analysis={analysis} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
