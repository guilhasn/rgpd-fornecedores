import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight, ShieldAlert, FileWarning } from "lucide-react";
import { Process } from "@/types/process";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardAlertsProps {
  processos: Process[];
  onViewProcess: (processo: Process) => void;
}

type AlertPriority = 'critical' | 'high' | 'medium';

interface AlertItem {
  id: number;
  type: 'expired' | 'expiring' | 'security' | 'data';
  priority: AlertPriority;
  title: string;
  message: string;
  process: Process;
}

export function DashboardAlerts({ processos, onViewProcess }: DashboardAlertsProps) {
  
  // Logic to find alerts
  const getAlerts = () => {
    const alerts: AlertItem[] = [];
    const today = new Date();

    processos.forEach(p => {
      // 1. Check Expiring Contracts (next 60 days)
      if (p.rgpd?.dataFimContrato) {
        const expiry = new Date(p.rgpd.dataFimContrato);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
           alerts.push({
            id: p.id,
            type: 'expired',
            priority: 'critical',
            title: 'Contrato Expirado',
            message: `O contrato de ${p.cliente} expirou há ${Math.abs(diffDays)} dias.`,
            process: p
          });
        } else if (diffDays <= 60) {
          alerts.push({
            id: p.id,
            type: 'expiring',
            priority: diffDays < 30 ? 'high' : 'medium',
            title: 'Renovação Necessária',
            message: `O contrato de ${p.cliente} expira em ${diffDays} dias.`,
            process: p
          });
        }
      }

      // 2. Check High Risk without Security Measures
      if ((p.rgpd?.nivelRisco === 'Alto' || p.rgpd?.nivelRisco === 'Crítico') && !p.rgpd?.medidasSeguranca) {
        alerts.push({
          id: p.id,
          type: 'security',
          priority: 'high',
          title: 'Risco de Segurança',
          message: `${p.cliente} tem risco ${p.rgpd.nivelRisco} mas sem medidas de segurança definidas.`,
          process: p
        });
      }

      // 3. Check Data Access without Data Types
      if (p.rgpd?.temAcessoDados === 'Sim' && (!p.rgpd?.tipoDadosPessoais || p.rgpd?.tipoDadosPessoais.length === 0)) {
        alerts.push({
          id: p.id,
          type: 'data',
          priority: 'medium',
          title: 'Dados em Falta',
          message: `${p.cliente} tem acesso a dados, mas os tipos não foram especificados.`,
          process: p
        });
      }
    });

    // Sort by priority (critical > high > medium)
    const priorityMap: Record<AlertPriority, number> = { critical: 3, high: 2, medium: 1 };
    return alerts.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]).slice(0, 5); // Show top 5
  };

  const alerts = getAlerts();

  if (alerts.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-orange-500 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Ações Necessárias
          <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-700 hover:bg-orange-100">
            {alerts.length} pendentes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {alerts.map((alert, index) => (
          <div 
            key={`${alert.type}-${alert.id}-${index}`}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:bg-white hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {alert.type === 'expired' && <FileWarning className="w-4 h-4 text-red-500" />}
                {alert.type === 'expiring' && <FileWarning className="w-4 h-4 text-orange-500" />}
                {alert.type === 'security' && <ShieldAlert className="w-4 h-4 text-red-600" />}
                {alert.type === 'data' && <AlertCircle className="w-4 h-4 text-blue-500" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                <p className="text-xs text-slate-500">{alert.message}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600"
              onClick={() => onViewProcess(alert.process)}
            >
              Ver <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}