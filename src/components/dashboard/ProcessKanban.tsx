import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, ShieldAlert } from "lucide-react";
import { Process, ProcessStatus } from "@/types/process";
import { Badge } from "@/components/ui/badge";

interface ProcessKanbanProps {
  processos: Process[];
  onEdit: (processo: Process) => void;
  formatDate: (date: string) => string;
}

export function ProcessKanban({ processos, onEdit, formatDate }: ProcessKanbanProps) {
  const kanbanColumns: ProcessStatus[] = ["Aberto", "Em Curso", "Pendente", "Concluído"];

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta": return "text-red-600 border-red-200 bg-red-50";
      case "Média": return "text-yellow-600 border-yellow-200 bg-yellow-50";
      default: return "text-slate-600 border-slate-200 bg-slate-50";
    }
  };

  const getRiskIndicator = (risco?: string) => {
    if (risco === "Alto" || risco === "Crítico") {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 h-5 px-1.5 text-[10px] gap-1">
          <ShieldAlert className="w-3 h-3" /> Risco {risco}
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto pb-4">
      {kanbanColumns.map((coluna) => {
        const processosDaColuna = processos.filter((p) => p.estado === coluna);
        return (
          <div key={coluna} className="space-y-4 min-w-[280px]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-700">{coluna}</h3>
              <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-600 font-medium">
                {processosDaColuna.length}
              </span>
            </div>

            <div className="space-y-3">
              {processosDaColuna.map((processo) => (
                <Card
                  key={processo.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-slate-200 group relative"
                  onClick={() => onEdit(processo)}
                >
                  <CardHeader className="p-4 pb-2 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono text-slate-500">
                        {processo.referencia}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border ${getPriorityColor(
                          processo.prioridade
                        )}`}
                      >
                        {processo.prioridade}
                      </span>
                    </div>
                    <CardTitle className="text-sm font-semibold text-slate-900 leading-tight">
                      {processo.cliente}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-2">
                      {processo.assunto}
                    </p>
                    {processo.rgpd?.nivelRisco && getRiskIndicator(processo.rgpd.nivelRisco)}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 text-xs text-slate-400 flex items-center gap-1 border-t pt-2 mt-2">
                    <Clock className="w-3 h-3" />{" "}
                    {formatDate(processo.dataEntrada)}
                  </CardFooter>
                </Card>
              ))}
              {processosDaColuna.length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                  Vazio
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}