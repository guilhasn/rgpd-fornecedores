import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Process } from "@/types/process";
import { RiskBadge } from "./RiskBadge";
import { CalendarClock } from "lucide-react";

interface ProcessKanbanProps {
  processos: Process[];
  onEdit: (processo: Process) => void;
  formatDate: (date: string) => string;
}

const COLUMNS = [
  { id: "Aberto", label: "Aberto", color: "bg-slate-100" },
  { id: "Em Curso", label: "Em Curso", color: "bg-blue-50" },
  { id: "Pendente", label: "Pendente", color: "bg-yellow-50" },
  { id: "Concluído", label: "Concluído", color: "bg-green-50" },
];

export function ProcessKanban({ processos, onEdit, formatDate }: ProcessKanbanProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full min-h-[500px] animate-in fade-in duration-500">
      {COLUMNS.map((col) => {
        const items = processos.filter((p) => p.estado === col.id);
        
        return (
          <div key={col.id} className="flex flex-col gap-4">
            <div className={`flex items-center justify-between p-3 rounded-lg ${col.color}`}>
              <span className="font-semibold text-slate-700">{col.label}</span>
              <Badge variant="secondary" className="bg-white/50">{items.length}</Badge>
            </div>
            
            <div className="flex flex-col gap-3">
              {items.map((p) => (
                <Card 
                  key={p.id} 
                  className="cursor-pointer hover:shadow-md transition-all border-slate-200 group"
                  onClick={() => onEdit(p)}
                >
                  <CardHeader className="p-4 pb-2 space-y-0">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2 text-xs font-normal">
                        {p.referencia}
                      </Badge>
                      {p.prioridade === "Alta" || p.prioridade === "Urgente" ? (
                         <Badge variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-50 text-[10px] px-1.5 py-0 h-5">
                           {p.prioridade}
                         </Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-sm font-semibold leading-tight text-slate-800">
                      {p.cliente}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {p.assunto}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                       <RiskBadge level={p.rgpd?.nivelRisco} className="text-[10px] h-5 px-1.5" />
                       
                       {p.rgpd?.dataFimContrato && (
                         <div className="flex items-center text-[10px] text-slate-400" title="Fim de Contrato">
                            <CalendarClock className="w-3 h-3 mr-1" />
                            {formatDate(p.rgpd.dataFimContrato).split("/").slice(0, 2).join("/")}
                         </div>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}