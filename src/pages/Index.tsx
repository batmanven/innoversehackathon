import { useState } from "react";
import { TopNav } from "@/components/lexiguide/TopNav";
import { HistorySidebar } from "@/components/lexiguide/HistorySidebar";
import { UploadCard } from "@/components/lexiguide/UploadCard";
import { ResultsHeader } from "@/components/lexiguide/ResultsHeader";
import { ExplanationTabs } from "@/components/lexiguide/ExplanationTabs";
import { DocumentPreview } from "@/components/lexiguide/DocumentPreview";
import { ResultsBottomBar } from "@/components/lexiguide/ResultsBottomBar";
import { useAnalyzeDocument } from "@/hooks/useAnalyzeDocument";
import type { Language, Persona, RecentDocument } from "@/types/lexiguide";
import { SAMPLE_ANALYSIS } from "@/data/mock";

const Index = () => {
  const { analysis, setAnalysis, analyze, isAnalyzing, reset } = useAnalyzeDocument();
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
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

      <div className="mx-auto flex max-w-[1480px] flex-col lg:flex-row">
        {/* Main panel */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">
          {!analysis ? (
            <div className="flex min-h-[70vh] items-center justify-center">
              <UploadCard
                isAnalyzing={isAnalyzing}
                onAnalyze={handleAnalyze}
                onUseSample={handleSample}
              />
            </div>
          ) : (
            <div>
              <ResultsHeader analysis={analysis} onBack={reset} />

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <div className="min-w-0">
                  <ExplanationTabs analysis={analysis} />
                </div>
                <div className="min-w-0 xl:sticky xl:top-20 xl:h-[calc(100vh-7rem)]">
                  <DocumentPreview clauses={analysis.preview} />
                </div>
              </div>

              <ResultsBottomBar analysis={analysis} />
            </div>
          )}
        </main>

        {/* Right sidebar */}
        {showSidebar && (
          <div className="w-full shrink-0 border-t border-border lg:w-[300px] lg:border-l lg:border-t-0">
            <div className="lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)]">
              <HistorySidebar
                activeId={analysis?.id ?? null}
                onNewDocument={reset}
                onSelect={handleSelectRecent}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
