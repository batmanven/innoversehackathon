import { LANGUAGES, type Language } from "@/types/lexiguide";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: Language;
  onChange: (v: Language) => void;
}

export function LanguageSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-foreground/80">Explain this in</label>
      <Select value={value} onValueChange={(v) => onChange(v as Language)}>
        <SelectTrigger className="h-11 border-border bg-surface-2 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((l) => (
            <SelectItem key={l.value} value={l.value}>
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
