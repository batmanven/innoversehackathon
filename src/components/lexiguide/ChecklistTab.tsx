import { useState } from "react";
import { Check, CalendarClock, CircleSlash, CircleCheck } from "lucide-react";
import type { ChecklistItem } from "@/types/lexiguide";
import { cn } from "@/lib/utils";

interface Props {
  items: ChecklistItem[];
}

const groups: { key: ChecklistItem["group"]; label: string; icon: React.ComponentType<{ className?: string }>; tone: string }[] = [
  { key: "must", label: "Things you MUST do", icon: CircleCheck, tone: "text-safe" },
  { key: "must_not", label: "Things you MUST NOT do", icon: CircleSlash, tone: "text-risk" },
  { key: "deadlines", label: "Important dates & deadlines", icon: CalendarClock, tone: "text-accent" },
];

export function ChecklistTab({ items }: Props) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));

  return (
    <div className="space-y-4 animate-fade-up">
      {groups.map(({ key, label, icon: Icon, tone }) => {
        const groupItems = items.filter((i) => i.group === key);
        if (groupItems.length === 0) return null;
        return (
          <section key={key} className="rounded-xl border border-border surface-2 p-5">
            <header className="mb-3 flex items-center gap-2">
              <Icon className={cn("h-4 w-4", tone)} />
              <h3 className="text-sm font-semibold text-foreground">{label}</h3>
              <span className="ml-auto text-[11px] font-mono text-muted-foreground">{groupItems.length}</span>
            </header>
            <ul className="space-y-1">
              {groupItems.map((item) => {
                const isDone = !!done[item.id];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      className={cn(
                        "group flex w-full items-start gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-surface-3",
                        isDone && "opacity-60"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                          isDone
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border-strong bg-background group-hover:border-primary/60"
                        )}
                      >
                        {isDone && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block text-sm font-medium text-foreground", isDone && "line-through")}>
                          {item.action}
                        </span>
                        <span className="mt-0.5 block text-[12.5px] leading-relaxed text-muted-foreground">
                          {item.detail}
                        </span>
                      </span>
                      {item.due && (
                        <span className="shrink-0 rounded-sm border border-border-strong px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-accent">
                          {item.due}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
