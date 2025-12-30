import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Process } from "@/types/process";
import { Activity, AlertTriangle, Clock, ShieldAlert } from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

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

  // Data for Risk Pie Chart
  const riskData = [
    { name: 'Crítico', value: processos.filter(p => p.rgpd?.nivelRisco === "Crítico").length, color: '#ef4444' }, // red-500
    { name: 'Alto', value: processos.filter(p => p.rgpd?.nivelRisco === "Alto").length, color: '#f97316' }, // orange-500
    { name: 'Médio', value: processos.filter(p => p.rgpd?.nivelRisco === "Médio").length, color: '#eab308' }, // yellow-500
    { name: 'Baixo', value: processos.filter(p => p.rgpd?.nivelRisco === "Baixo").length, color: '#10b981' }, // emerald-500
    { name: 'N/A', value: processos.filter(p => !p.rgpd?.nivelRisco || p.rgpd?.nivelRisco === "Faltam Dados").length, color: '#94a3b8' } // slate-400
  ].filter(item => item.value > 0);

  // Data for Status Bar Chart
  const statusData = [
    { name: 'Aberto', value: processos.filter(p => p.estado === "Aberto").length },
    { name: 'Em Curso', value: processos.filter(p => p.estado === "Em Curso").length },
    { name: 'Pendente', value: processos.filter(p => p.estado === "Pendente").length },
    { name: 'Concluído', value: processos.filter(p => p.estado === "Concluído").length },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <Card className="shadow-sm">
          <CardHeader>
             <CardTitle className="text-base font-semibold text-slate-800">Distribuição de Risco RGPD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {riskData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Sem dados de risco suficientes.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Bar Chart */}
        <Card className="shadow-sm">
          <CardHeader>
             <CardTitle className="text-base font-semibold text-slate-800">Processos por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}