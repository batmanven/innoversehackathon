import { Settings, ScaleIcon, Menu } from "lucide-react";

interface Props {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-6">
        {/* Left — wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
              <ScaleIcon className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[19px] font-600 leading-none tracking-tight text-foreground">
                LexiGuide
              </span>
              <span className="hidden rounded-sm border border-border-strong px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground sm:inline-block">
                beta
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
