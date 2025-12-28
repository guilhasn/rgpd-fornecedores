import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Briefcase, ShieldAlert } from "lucide-react";
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
      riscoAlto: processos.filter(
        (p) => 
          (p.rgpd?.nivelRisco === "Alto" || p.rgpd?.nivelRisco === "Crítico") && 
          p.estado !== "Concluído"
      ).length,
      acessoDados: processos.filter((p) => p.rgpd?.temAcessoDados === "Sim").length,
    };
  }, [processos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Fornecedores</CardTitle>
          <Briefcase className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-slate-500">Registados em sistema</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendentes}</div>
          <p className="text-xs text-slate-500">Em avaliação / curso</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risco Elevado</CardTitle>
          <ShieldAlert className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.riscoAlto}</div>
          <p className="text-xs text-slate-500">Fornecedores críticos ativos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Acesso a Dados</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.acessoDados}</div>
          <p className="text-xs text-slate-500">Entidades com acesso a dados</p>
        </CardContent>
      </Card>
    </div>
  );
}