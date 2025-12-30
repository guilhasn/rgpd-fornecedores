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
import { Edit2, Trash2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
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

interface ProcessTableProps {
  processos: Process[];
  onEdit: (processo: Process) => void;
  onDelete: (id: number) => void;
}

export function ProcessTable({ processos, onEdit, onDelete }: ProcessTableProps) {
  
  const getRiskBadge = (risk?: string) => {
    switch(risk) {
        case "Crítico": return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" /> Crítico</Badge>;
        case "Alto": return <Badge className="bg-orange-500 hover:bg-orange-600 gap-1"><AlertTriangle className="w-3 h-3" /> Alto</Badge>;
        case "Médio": return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">Médio</Badge>;
        case "Baixo": return <Badge className="bg-emerald-500 hover:bg-emerald-600">Baixo</Badge>;
        default: return <Badge variant="outline" className="text-slate-400 border-slate-300">N/A</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
     switch(status) {
        case "Concluído": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1"><CheckCircle2 className="w-3 h-3"/> Concluído</Badge>;
        case "Cancelado": return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
        case "Em Curso": return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1"><Clock className="w-3 h-3"/> Em Curso</Badge>;
        default: return <Badge variant="outline" className="text-slate-600">{status}</Badge>;
     }
  };

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="w-[100px]">Referência</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>UO</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Risco RGPD</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                Não foram encontrados processos.
              </TableCell>
            </TableRow>
          ) : (
            processos.map((processo) => (
              <TableRow key={processo.id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium font-mono text-xs text-slate-500">
                    {processo.referencia}
                </TableCell>
                <TableCell className="font-semibold text-slate-800">
                    {processo.cliente}
                    <div className="text-xs font-normal text-slate-400">{processo.rgpd?.nif || "N/A"}</div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-slate-600">
                    {processo.assunto}
                </TableCell>
                <TableCell>
                    <Badge variant="secondary" className="font-normal text-xs">{processo.unidadeOrganica}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(processo.estado)}</TableCell>
                <TableCell>{getRiskBadge(processo.rgpd?.nivelRisco)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(processo)} className="h-8 w-8 hover:text-blue-600">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O processo <b>{processo.referencia}</b> será permanentemente removido.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(processo.id)} className="bg-red-600 hover:bg-red-700">
                            Remover
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