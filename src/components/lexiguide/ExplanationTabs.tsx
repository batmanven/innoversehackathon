import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DocumentAnalysis } from "@/types/lexiguide";
import { SummaryTab } from "./SummaryTab";
import { RisksRightsTab } from "./RisksRightsTab";
import { ChecklistTab } from "./ChecklistTab";
import { QATab } from "./QATab";
import { DocumentPreview } from "./DocumentPreview";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  analysis: DocumentAnalysis;
  documentText: string;
}

export function ExplanationTabs({ analysis, documentText }: Props) {
  const isMobile = useIsMobile();

  return (
    <Tabs defaultValue="summary" className="flex flex-1 flex-col overflow-hidden">
      <TabsList className="grid h-10 shrink-0 w-full grid-cols-4 bg-surface-2 p-1 md:grid-cols-4 lg:grid-cols-4 data-[mobile=true]:grid-cols-5">
        <TabsTrigger value="summary" className="text-[10px] sm:text-xs md:text-sm">
          Summary
        </TabsTrigger>
        <TabsTrigger value="risks" className="text-[10px] sm:text-xs md:text-sm">
          Risks
        </TabsTrigger>
        <TabsTrigger value="checklist" className="text-[10px] sm:text-xs md:text-sm">
          Check
        </TabsTrigger>
        <TabsTrigger value="qa" className="text-[10px] sm:text-xs md:text-sm">
          Q&amp;A
        </TabsTrigger>
        {isMobile && (
          <TabsTrigger value="document" className="text-[10px] sm:text-xs md:text-sm">
            Doc
          </TabsTrigger>
        )}
      </TabsList>

      <div className="flex-1 overflow-y-auto mt-4 scroll-thin pr-1 sm:pr-2">
        <TabsContent value="summary" className="m-0 focus-visible:outline-none">
          <SummaryTab summary={analysis.summary} />
        </TabsContent>
        <TabsContent value="risks" className="m-0 focus-visible:outline-none">
          <RisksRightsTab risks={analysis.risks} rights={analysis.rights} />
        </TabsContent>
        <TabsContent value="checklist" className="m-0 focus-visible:outline-none">
          <ChecklistTab items={analysis.checklist} />
        </TabsContent>
        <TabsContent value="qa" className="m-0 focus-visible:outline-none">
          <QATab 
            suggestedQuestions={analysis.suggestedQuestions} 
            documentText={documentText}
          />
        </TabsContent>
        {isMobile && (
          <TabsContent value="document" className="m-0 h-full focus-visible:outline-none">
            <DocumentPreview clauses={analysis.preview} />
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}
