import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Briefcase, CheckCircle2 } from "lucide-react";
import { Process } from "@/types/process";
import { useMemo } from "react";

interface ProcessStatsProps {
  processos: Process[];
}

export function ProcessStats({ processos }: ProcessStatsProps) {
  const stats = useMemo(() => {
    return {
      total: processos.length,
      pendentes: processos.filter((p) => p.estado !== "Concluído").length,
      urgentes: processos.filter(
        (p) => p.prioridade === "Alta" && p.estado !== "Concluído"
      ).length,
      concluidos: processos.filter((p) => p.estado === "Concluído").length,
    };
  }, [processos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
          <Briefcase className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-slate-500">Registados em sistema</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Curso / Pendentes</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendentes}</div>
          <p className="text-xs text-slate-500">Processos ativos</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.urgentes}</div>
          <p className="text-xs text-slate-500">Necessitam ação imediata</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.concluidos}</div>
          <p className="text-xs text-slate-500">Finalizados com sucesso</p>
        </CardContent>
      </Card>
    </div>
  );
}