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
import { useConversation } from "@/hooks/useConversation";
import { saveAnalysisToStorage, getRecentDocumentsFromStorage, getStoredAnalysisById, deleteAnalysisFromStorage } from "@/lib/storage";
import { toast } from "sonner";

import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Index = () => {
  const { analysis, documentText, setAnalysis, setDocumentText, analyze, isAnalyzing, reset, progress, error } = useAnalyzeDocument();
  const { messages, ask, isResponding, clear } = useConversation(documentText, analysis?.persona);
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Phase 19: Error reporting
  useEffect(() => {
    if (error) {
      toast.error(error.message || "An unexpected error occurred during analysis.");
    }
  }, [error]);

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
      if (isMobile) setIsMobileMenuOpen(false);
    }
  };

  const handleDeleteRecent = (id: string) => {
    deleteAnalysisFromStorage(id);
    setRecentDocs(getRecentDocumentsFromStorage());
    if (analysis?.id === id) {
      reset();
    }
  };

  const sidebarContent = (
    <HistorySidebar
      activeId={analysis?.id ?? null}
      documents={recentDocs}
      onNewDocument={() => {
        reset();
        if (isMobile) setIsMobileMenuOpen(false);
      }}
      onSelect={handleSelectRecent}
      onDelete={handleDeleteRecent}
    />
  );

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      <TopNav onMenuClick={() => setIsMobileMenuOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar (Sheet) */}
        {isMobile && (
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetContent side="left" className="p-0 w-[300px] border-r-0">
              {sidebarContent}
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside
            className={cn(
              "relative shrink-0 border-r border-border h-full bg-[hsl(var(--sidebar-bg))] transition-all duration-300 ease-in-out",
              isCollapsed ? "w-0" : "w-[280px]"
            )}
          >
            <div className={cn(
              "h-full w-[280px] transition-opacity duration-200",
              isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
              {sidebarContent}
            </div>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-transform hover:scale-110 hover:text-foreground"
            >
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          </aside>
        )}

        <main className="flex-1 h-full overflow-hidden">
          <div className="h-full flex flex-col mx-auto max-w-7xl px-4 py-4 sm:px-8 sm:py-6 overflow-hidden">
            {!analysis ? (
              <div className="flex flex-1 items-center justify-center overflow-y-auto">
                <UploadCard
                  isAnalyzing={isAnalyzing}
                  progress={progress}
                  onAnalyze={handleAnalyze}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 space-y-4 sm:space-y-6">
                <ResultsHeader analysis={analysis} onBack={reset} />

                <div className="flex-1 grid gap-6 xl:grid-cols-[1fr_420px] min-h-0 overflow-hidden">
                  <div className="flex flex-col min-h-0 overflow-hidden">
                    <ExplanationTabs analysis={analysis} documentText={documentText} />
                  </div>
                  <div className="hidden xl:flex flex-col min-h-0 overflow-hidden">
                    <DocumentPreview clauses={analysis.preview} />
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <ResultsBottomBar analysis={analysis} />
                  <div className="hidden md:block">
                    <FeedbackBar analysisId={analysis.id} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
