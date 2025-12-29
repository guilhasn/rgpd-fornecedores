import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level?: string;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  if (!level || level === "Faltam Dados") {
    return (
      <Badge variant="outline" className={cn("text-slate-500 border-slate-300 bg-slate-50", className)}>
        Faltam Dados
      </Badge>
    );
  }

  const styles = {
    "Baixo": "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
    "Médio": "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200",
    "Alto": "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200",
    "Crítico": "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
  };

  const style = styles[level as keyof typeof styles] || "bg-slate-100 text-slate-700";

  return (
    <Badge className={cn("font-medium border shadow-none", style, className)}>
      {level}
    </Badge>
  );
}