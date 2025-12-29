import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Process } from "@/types/process";
import { Activity, AlertTriangle, Clock, ShieldAlert } from "lucide-react";

interface ProcessStatsProps {
  processos: Process[];
}

export function ProcessStats({ processos }: ProcessStatsProps) {
  const total = processos.length;
  const highRisk = processos.filter(p => p.rgpd?.nivelRisco === "Alto" || p.rgpd?.nivelRisco === "Crítico").length;
  const missingData = processos.filter(p => !p.rgpd?.nif || !p.rgpd?.tipoDadosPessoais).length;
  
  // Calculate Expiring in 30 days
  const expiringSoon = processos.filter(p => {
    if (!p.rgpd?.dataFimContrato) return false;
    const today = new Date();
    const end = new Date(p.rgpd.dataFimContrato);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }).length;

  // Risk Distribution for the Meter
  const riskCounts = {
    critical: processos.filter(p => p.rgpd?.nivelRisco === "Crítico").length,
    high: processos.filter(p => p.rgpd?.nivelRisco === "Alto").length,
    medium: processos.filter(p => p.rgpd?.nivelRisco === "Médio").length,
    low: processos.filter(p => p.rgpd?.nivelRisco === "Baixo").length,
    unknown: processos.filter(p => !p.rgpd?.nivelRisco || p.rgpd?.nivelRisco === "Faltam Dados").length
  };

  const getPercent = (count: number) => total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Fornecedores</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{total}</div>
            <p className="text-xs text-slate-500">
              {processos.filter(p => p.estado === "Em Curso").length} contratos ativos
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Risco Elevado</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{highRisk}</div>
            <p className="text-xs text-slate-500">Requerem auditoria urgente</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Dados em Falta</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{missingData}</div>
            <p className="text-xs text-slate-500">Cadastros incompletos</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">A Expirar (30d)</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{expiringSoon}</div>
            <p className="text-xs text-slate-500">Renovações próximas</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Risk Meter */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex justify-between items-end mb-2">
             <span className="text-sm font-medium text-slate-700">Distribuição de Risco RGPD</span>
             <span className="text-xs text-slate-400">Total: {total}</span>
        </div>
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
          {riskCounts.critical > 0 && (
             <div style={{ width: `${getPercent(riskCounts.critical)}%` }} className="bg-red-500 h-full" title={`Crítico: ${riskCounts.critical}`} />
          )}
          {riskCounts.high > 0 && (
             <div style={{ width: `${getPercent(riskCounts.high)}%` }} className="bg-orange-400 h-full" title={`Alto: ${riskCounts.high}`} />
          )}
          {riskCounts.medium > 0 && (
             <div style={{ width: `${getPercent(riskCounts.medium)}%` }} className="bg-yellow-400 h-full" title={`Médio: ${riskCounts.medium}`} />
          )}
          {riskCounts.low > 0 && (
             <div style={{ width: `${getPercent(riskCounts.low)}%` }} className="bg-emerald-400 h-full" title={`Baixo: ${riskCounts.low}`} />
          )}
           {riskCounts.unknown > 0 && (
             <div style={{ width: `${getPercent(riskCounts.unknown)}%` }} className="bg-slate-200 h-full" title={`Desconhecido: ${riskCounts.unknown}`} />
          )}
        </div>
        <div className="flex gap-4 mt-2 justify-end">
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-slate-600">Crítico</span>
            </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-xs text-slate-600">Alto</span>
            </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-xs text-slate-600">Médio</span>
            </div>
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-600">Baixo</span>
            </div>
        </div>
      </div>
    </div>
  );
}