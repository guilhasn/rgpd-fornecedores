import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Process } from "@/types/process";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "./RiskBadge";

interface ProcessTableProps {
  processos: Process[];
  onEdit: (processo: Process) => void;
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
}

export function ProcessTable({ processos, onEdit, onDelete, formatDate }: ProcessTableProps) {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "text-orange-600 bg-orange-50 border-orange-100";
      case "Urgente": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden animate-in fade-in duration-500">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[100px]">Referência</TableHead>
            <TableHead>Fornecedor / Entidade</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Risco RGPD</TableHead>
            <TableHead>Fim Contrato</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                Nenhum processo encontrado.
              </TableCell>
            </TableRow>
          ) : (
            processos.map((p) => (
              <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-700">{p.referencia}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{p.cliente}</span>
                    <span className="text-xs text-slate-500">{p.assunto}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {p.estado}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`font-normal border ${getPriorityColor(p.prioridade)}`}>
                    {p.prioridade}
                  </Badge>
                </TableCell>
                <TableCell>
                  <RiskBadge level={p.rgpd?.nivelRisco} />
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                    {p.rgpd?.dataFimContrato ? formatDate(p.rgpd.dataFimContrato) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(p)}>
                      <Edit2 className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(p.id)}>
                      <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                    </Button>
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