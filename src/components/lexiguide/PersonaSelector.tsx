import { PERSONAS, type Persona } from "@/types/lexiguide";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: Persona | "";
  onChange: (v: Persona) => void;
}

export function PersonaSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-foreground/80">Who are you in this document?</label>
      <Select value={value || undefined} onValueChange={(v) => onChange(v as Persona)}>
        <SelectTrigger className="h-11 border-border bg-surface-2 text-sm">
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          {PERSONAS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              <span className="flex flex-col">
                <span className="text-sm">{p.label}</span>
                <span className="text-[11px] text-muted-foreground">{p.hint}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
