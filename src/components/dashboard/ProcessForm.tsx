import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Process, ProcessStatus, ProcessPriority, ProcessHistory } from "@/types/process";

interface ProcessFormProps {
  processo: Partial<Process>;
  setProcesso: (p: Partial<Process>) => void;
  onSave: () => void;
  formatDate: (date: string) => string;
}

export function ProcessForm({ processo, setProcesso, onSave, formatDate }: ProcessFormProps) {
  return (
    <Tabs defaultValue="detalhes" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
        <TabsTrigger value="historico" disabled={!processo.id}>
          Histórico
        </TabsTrigger>
      </TabsList>

      <TabsContent value="detalhes" className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ref">Referência</Label>
          <Input
            id="ref"
            placeholder="Ex: PROC-2025/099"
            value={processo.referencia || ""}
            onChange={(e) =>
              setProcesso({ ...processo, referencia: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente / Entidade</Label>
          <Input
            id="cliente"
            placeholder="Nome do cliente"
            value={processo.cliente || ""}
            onChange={(e) =>
              setProcesso({ ...processo, cliente: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assunto">Assunto</Label>
          <Input
            id="assunto"
            placeholder="Resumo do pedido"
            value={processo.assunto || ""}
            onChange={(e) =>
              setProcesso({ ...processo, assunto: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={processo.estado}
              onValueChange={(val: ProcessStatus) =>
                setProcesso({ ...processo, estado: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aberto">Aberto</SelectItem>
                <SelectItem value="Em Curso">Em Curso</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Prioridade</Label>
            <Select
              value={processo.prioridade}
              onValueChange={(val: ProcessPriority) =>
                setProcesso({ ...processo, prioridade: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter className="mt-8">
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          <Button onClick={onSave}>Salvar Alterações</Button>
        </SheetFooter>
      </TabsContent>

      <TabsContent value="historico">
        <div className="space-y-4 pt-4">
          <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Timeline de Atividade
          </h4>
          <div className="relative border-l border-slate-200 ml-2 pl-6 space-y-6">
            {processo.historico?.map((item: ProcessHistory, idx: number) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-slate-300 border-2 border-white" />
                <p className="text-sm text-slate-900 font-medium">{item.acao}</p>
                <p className="text-xs text-slate-500">{formatDate(item.data)}</p>
              </div>
            ))}
            {(!processo.historico || processo.historico.length === 0) && (
              <p className="text-sm text-slate-400 italic">
                Sem histórico registado.
              </p>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}