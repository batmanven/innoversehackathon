import { useEffect, useState } from "react";
import { TopNav } from "@/components/lexiguide/TopNav";
import { HistorySidebar } from "@/components/lexiguide/HistorySidebar";
import { UploadCard } from "@/components/lexiguide/UploadCard";
import { ResultsHeader } from "@/components/lexiguide/ResultsHeader";
import { ExplanationTabs } from "@/components/lexiguide/ExplanationTabs";
import { DocumentPreview } from "@/components/lexiguide/DocumentPreview";
import { ResultsBottomBar } from "@/components/lexiguide/ResultsBottomBar";
import { FeedbackBar } from "@/components/lexiguide/FeedbackBar";

import type { Language, Persona, RecentDocument } from "@/types/lexiguide";
import { useAnalyzeDocument } from "@/hooks/useAnalyzeDocument";
import { saveAnalysisToStorage, getRecentDocumentsFromStorage, getStoredAnalysisById, deleteAnalysisFromStorage } from "@/lib/storage";

const Index = () => {
  const { analysis, documentText, setAnalysis, setDocumentText, analyze, isAnalyzing, reset, progress } = useAnalyzeDocument();
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
  const [showSidebar] = useState(true);

  useEffect(() => {
    setRecentDocs(getRecentDocumentsFromStorage());
  }, []);
  useEffect(() => {
    if (analysis && !analysis.id.startsWith("sample-")) {
      saveAnalysisToStorage(analysis, documentText);
      setRecentDocs(getRecentDocumentsFromStorage());
    }
  }, [analysis, documentText]);

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

  const handleSelectRecent = (doc: RecentDocument) => {
    const stored = getStoredAnalysisById(doc.id);
    if (stored) {
      setAnalysis(stored.analysis);
      setDocumentText(stored.documentText);
    }
  };

  const handleDeleteRecent = (id: string) => {
    deleteAnalysisFromStorage(id);
    setRecentDocs(getRecentDocumentsFromStorage());
    if (analysis?.id === id) {
      reset();
    }
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
              documents={recentDocs}
              onNewDocument={reset}
              onSelect={handleSelectRecent}
              onDelete={handleDeleteRecent}
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
                  progress={progress}
                  onAnalyze={handleAnalyze}
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
                <FeedbackBar analysisId={analysis.id} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
