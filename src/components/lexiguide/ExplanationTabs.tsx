import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DocumentAnalysis } from "@/types/lexiguide";
import { SummaryTab } from "./SummaryTab";
import { RisksRightsTab } from "./RisksRightsTab";
import { ChecklistTab } from "./ChecklistTab";
import { QATab } from "./QATab";

interface Props {
  analysis: DocumentAnalysis;
  documentText: string;
}

export function ExplanationTabs({ analysis, documentText }: Props) {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid h-10 w-full grid-cols-4 bg-surface-2 p-1">
        <TabsTrigger value="summary" className="text-xs sm:text-sm">
          Summary
        </TabsTrigger>
        <TabsTrigger value="risks" className="text-xs sm:text-sm">
          Risks &amp; Rights
        </TabsTrigger>
        <TabsTrigger value="checklist" className="text-xs sm:text-sm">
          Checklist
        </TabsTrigger>
        <TabsTrigger value="qa" className="text-xs sm:text-sm">
          Q&amp;A
        </TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="mt-4">
        <SummaryTab summary={analysis.summary} />
      </TabsContent>
      <TabsContent value="risks" className="mt-4">
        <RisksRightsTab risks={analysis.risks} rights={analysis.rights} />
      </TabsContent>
      <TabsContent value="checklist" className="mt-4">
        <ChecklistTab items={analysis.checklist} />
      </TabsContent>
      <TabsContent value="qa" className="mt-4">
        <QATab 
          suggestedQuestions={analysis.suggestedQuestions} 
          documentText={documentText}
        />
      </TabsContent>
    </Tabs>
  );
}
