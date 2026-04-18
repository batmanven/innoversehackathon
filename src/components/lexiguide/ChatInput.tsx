import { useState, type KeyboardEvent } from "react";
import { SendHorizonal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  onSend: (q: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="border-t border-border bg-background/40 p-3">
      <div className="flex items-end gap-2 rounded-lg border border-border-strong bg-surface-2 p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask about a clause, deadline, or what happens if…"
          rows={1}
          className="min-h-[40px] max-h-32 resize-none border-0 bg-transparent px-2 py-2 text-sm shadow-none focus-visible:ring-0"
        />
        <Button
          size="sm"
          onClick={send}
          disabled={disabled || !value.trim()}
          className="h-9 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <SendHorizonal className="h-4 w-4" />
          <span className="hidden sm:inline">Ask</span>
        </Button>
      </div>
      <p className="mt-1.5 px-1 text-[10.5px] text-muted-foreground/80">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}
