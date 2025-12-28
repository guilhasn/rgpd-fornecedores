import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  Edit,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Clock,
  AlertCircle
} from "lucide-react";
import { Process } from "@/types/process";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProcessTableProps {
  processos: Process[];
  onEdit: (processo: Process) => void;
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
}

export function ProcessTable({ processos, onEdit, onDelete, formatDate }: ProcessTableProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído": return "bg-green-500 hover:bg-green-600";
      case "Em Curso": return "bg-blue-500 hover:bg-blue-600";
      case "Pendente": return "bg-yellow-500 hover:bg-yellow-600";
      default: return "bg-slate-500 hover:bg-slate-600";
    }
  };

  const getRiskBadge = (risco?: string) => {
    switch (risco) {
      case "Crítico": 
        return <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 gap-1"><ShieldAlert className="w-3 h-3"/> Crítico</Badge>;
      case "Alto": 
        return <Badge variant="outline" className="text-orange-700 bg-orange-50 border-orange-200 gap-1"><ShieldAlert className="w-3 h-3"/> Alto</Badge>;
      case "Médio": 
        return <Badge variant="outline" className="text-yellow-700 bg-yellow-50 border-yellow-200 gap-1"><Shield className="w-3 h-3"/> Médio</Badge>;
      case "Baixo": 
        return <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 gap-1"><ShieldCheck className="w-3 h-3"/> Baixo</Badge>;
      default: 
        return <span className="text-slate-400 text-xs">-</span>;
    }
  };

  const checkExpiry = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Contrato Expirado</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    if (diffDays <= 30) {
       return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Clock className="w-4 h-4 text-orange-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Expira em {diffDays} dias</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="w-[100px]">Ref</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead className="w-[120px]">NIF</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Risco RGPD</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fim Contrato</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                Nenhum processo encontrado.
              </TableCell>
            </TableRow>
          ) : (
            processos.map((processo) => (
              <TableRow
                key={processo.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <TableCell className="font-mono text-xs font-medium text-slate-600">
                  {processo.referencia}
                </TableCell>
                <TableCell className="font-medium text-slate-900">
                  {processo.cliente}
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500">
                  {processo.rgpd?.nif || "-"}
                </TableCell>
                <TableCell
                  className="text-slate-600 max-w-[200px] truncate"
                  title={processo.assunto}
                >
                  {processo.assunto}
                </TableCell>
                <TableCell>
                  {getRiskBadge(processo.rgpd?.nivelRisco)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(
                      processo.estado
                    )} border-none text-white shadow-none text-[10px] h-5 px-1.5`}
                  >
                    {processo.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                   <div className="flex items-center gap-2">
                    {processo.rgpd?.dataFimContrato ? formatDate(processo.rgpd.dataFimContrato) : "-"}
                    {checkExpiry(processo.rgpd?.dataFimContrato)}
                   </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-slate-900"
                      onClick={() => onEdit(processo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O registo de  
                            <span className="font-bold"> {processo.cliente} </span>
                            será removido.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => onDelete(processo.id)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}