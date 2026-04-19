import { useState } from "react";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  analysisId: string;
}

export function FeedbackBar({ analysisId }: Props) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    // Store feedback in localStorage linked to the analysis ID
    const feedbackData = JSON.parse(localStorage.getItem("lexiguide_feedback") || "{}");
    feedbackData[analysisId] = type;
    localStorage.setItem("lexiguide_feedback", JSON.stringify(feedbackData));
    
    toast.success("Thanks! Your feedback helps improve LexiGuide.");
  };

  if (feedback) {
    return (
      <div className="mt-8 flex justify-center py-4 animate-fade-in">
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
          <Check className="h-4 w-4" />
          <span>Thanks for your feedback!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-4 py-6 border-t border-border/40">
      <p className="text-sm font-medium text-muted-foreground">Was this analysis helpful?</p>
      <div className="flex gap-3">
        <button
          onClick={() => handleFeedback("up")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary active:scale-95"
          aria-label="Helpful"
        >
          <ThumbsUp className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => handleFeedback("down")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition-all hover:border-risk/50 hover:bg-risk/5 hover:text-risk active:scale-95"
          aria-label="Not helpful"
        >
          <ThumbsDown className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
