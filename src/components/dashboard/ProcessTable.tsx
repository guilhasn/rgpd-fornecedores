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
  Calendar as CalendarIcon, 
  Trash2, 
  Edit 
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

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta": return "text-red-600 border-red-200 bg-red-50";
      case "Média": return "text-yellow-600 border-yellow-200 bg-yellow-50";
      default: return "text-slate-600 border-slate-200 bg-slate-50";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="w-[120px]">Referência</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Data Entrada</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-slate-500">
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
                <TableCell
                  className="text-slate-600 max-w-[250px] truncate"
                  title={processo.assunto}
                >
                  {processo.assunto}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(
                      processo.estado
                    )} border-none text-white shadow-none`}
                  >
                    {processo.estado}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      processo.prioridade
                    )}`}
                  >
                    {processo.prioridade}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    {formatDate(processo.dataEntrada)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                            Esta ação não pode ser desfeita. O processo 
                            <span className="font-bold"> {processo.referencia} </span>
                            será permanentemente removido.
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