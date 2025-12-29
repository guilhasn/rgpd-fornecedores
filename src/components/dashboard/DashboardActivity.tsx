import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock } from "lucide-react";
import { Process } from "@/types/process";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface DashboardActivityProps {
  processos: Process[];
}

export function DashboardActivity({ processos }: DashboardActivityProps) {
  
  // Flatten history from all processes
  const getAllActivities = () => {
    const activities: any[] = [];
    
    processos.forEach(p => {
      if (p.historico) {
        p.historico.forEach(h => {
          activities.push({
            ...h,
            processRef: p.referencia,
            processClient: p.cliente,
            processId: p.id
          });
        });
      }
    });

    // Sort by date descending
    return activities.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 10);
  };

  const activities = getAllActivities();

  return (
    <Card className="h-full border-slate-200 shadow-sm flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-50">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
          <Activity className="w-5 h-5 text-slate-500" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-[300px]">
          <div className="flex flex-col">
            {activities.length === 0 ? (
               <div className="p-8 text-center text-slate-400 text-sm">
                 Sem atividade registada.
               </div>
            ) : (
              activities.map((activity, index) => (
                <div 
                  key={`${activity.processId}-${index}`}
                  className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-xs text-slate-900 line-clamp-1">
                      {activity.processClient}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center whitespace-nowrap ml-2">
                       <Clock className="w-3 h-3 mr-1" />
                       {activity.data}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mb-1.5">
                    {activity.acao.replace("Nota:", "")}
                  </div>
                  <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-500 font-normal px-1.5 h-5">
                    {activity.processRef}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}