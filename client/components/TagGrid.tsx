import { Check } from "lucide-react";
import { ReactNode } from "react";

interface TagGridOption {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TagGridProps {
  options: TagGridOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  columns?: number;
  className?: string;
}

export default function TagGrid({
  options,
  selected,
  onSelect,
  columns = 2,
  className = "",
}: TagGridProps) {
  return (
    <div
      className={`grid gap-3 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`relative p-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 min-h-16 ${
            selected === option.id
              ? "bg-primary text-primary-foreground shadow-md scale-105"
              : "bg-secondary text-secondary-foreground hover:bg-muted border-2 border-transparent hover:border-border"
          }`}
        >
          {option.icon && <span className="text-lg">{option.icon}</span>}
          <span>{option.label}</span>
          {selected === option.id && (
            <Check className="absolute top-1 right-1 w-4 h-4" />
          )}
        </button>
      ))}
    </div>
  );
}
