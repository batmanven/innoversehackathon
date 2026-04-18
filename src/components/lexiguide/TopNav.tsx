import { Settings, ScaleIcon } from "lucide-react";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="mx-auto flex h-full max-w-[1480px] items-center justify-between px-6">
        {/* Left — wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
            <ScaleIcon className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[19px] font-600 leading-none tracking-tight text-foreground">
              LexiGuide
            </span>
            <span className="rounded-sm border border-border-strong px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              beta
            </span>
          </div>
        </div>

        {/* Center — status */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-xs text-muted-foreground">
            MVP prototype — <span className="text-foreground/80">AI not connected yet</span>
          </span>
        </div>

        {/* Right — settings + avatar */}
        <div className="flex items-center gap-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 text-xs font-medium text-foreground/80 ring-1 ring-border">
            AS
          </div>
        </div>
      </div>
    </header>
  );
}
