import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Briefcase, ShieldAlert } from "lucide-react";
import { Process } from "@/types/process";
import { useMemo } from "react";

interface ProcessStatsProps {
  processos: Process[];
}

export function ProcessStats({ processos }: ProcessStatsProps) {
  const stats = useMemo(() => {
    const total = processos.length;
    const pendentes = processos.filter((p) => p.estado !== "Concluído").length;
    const acessoDados = processos.filter((p) => p.rgpd?.temAcessoDados === "Sim").length;
    
    // Risk counts
    const critico = processos.filter(p => p.rgpd?.nivelRisco === "Crítico").length;
    const alto = processos.filter(p => p.rgpd?.nivelRisco === "Alto").length;
    const medio = processos.filter(p => p.rgpd?.nivelRisco === "Médio").length;
    const baixo = processos.filter(p => p.rgpd?.nivelRisco === "Baixo").length;
    const desconhecido = total - (critico + alto + medio + baixo);

    const riscoAltoTotal = critico + alto;

    return {
      total,
      pendentes,
      riscoAltoTotal,
      acessoDados,
      riskDistribution: {
        critico: total ? (critico / total) * 100 : 0,
        alto: total ? (alto / total) * 100 : 0,
        medio: total ? (medio / total) * 100 : 0,
        baixo: total ? (baixo / total) * 100 : 0,
        desconhecido: total ? (desconhecido / total) * 100 : 0,
      }
    };
  }, [processos]);

  return (
    <div className="space-y-4">
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
            <div className="text-2xl font-bold text-red-600">{stats.riscoAltoTotal}</div>
            <p className="text-xs text-slate-500">Críticos ou Altos</p>
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

      {/* Visual Risk Distribution Bar */}
      <Card className="overflow-hidden border-none shadow-none bg-transparent">
        <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100">
          <div style={{ width: `${stats.riskDistribution.critico}%` }} className="bg-red-600 h-full" title="Crítico" />
          <div style={{ width: `${stats.riskDistribution.alto}%` }} className="bg-orange-500 h-full" title="Alto" />
          <div style={{ width: `${stats.riskDistribution.medio}%` }} className="bg-yellow-400 h-full" title="Médio" />
          <div style={{ width: `${stats.riskDistribution.baixo}%` }} className="bg-green-500 h-full" title="Baixo" />
          <div style={{ width: `${stats.riskDistribution.desconhecido}%` }} className="bg-slate-200 h-full" title="Sem Classificação" />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2 px-1">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-600"></div> Crítico</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Alto</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Médio</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Baixo</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-200"></div> N/A</div>
        </div>
      </Card>
    </div>
  );
}