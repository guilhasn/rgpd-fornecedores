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
import { ProcessGdprForm } from "./ProcessGdprForm";

interface ProcessFormProps {
  processo: Partial<Process>;
  setProcesso: (p: Partial<Process>) => void;
  onSave: () => void;
  formatDate: (date: string) => string;
}

export function ProcessForm({ processo, setProcesso, onSave, formatDate }: ProcessFormProps) {
  return (
    <Tabs defaultValue="detalhes" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
        <TabsTrigger value="rgpd">Avaliação RGPD</TabsTrigger>
        <TabsTrigger value="historico" disabled={!processo.id}>
          Histórico
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] px-1">
        <TabsContent value="detalhes" className="space-y-6 mt-0">
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
            <Label htmlFor="cliente">Fornecedor / Entidade</Label>
            <Input
              id="cliente"
              placeholder="Nome do fornecedor"
              value={processo.cliente || ""}
              onChange={(e) =>
                setProcesso({ ...processo, cliente: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unidade">Unidade Orgânica</Label>
            <Input
              id="unidade"
              placeholder="Departamento requisitante"
              value={processo.unidadeOrganica || ""}
              onChange={(e) =>
                setProcesso({ ...processo, unidadeOrganica: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assunto">Serviço / Produto</Label>
            <Input
              id="assunto"
              placeholder="Descrição do serviço"
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
        </TabsContent>

        <TabsContent value="rgpd" className="mt-0">
            <ProcessGdprForm processo={processo} setProcesso={setProcesso} />
        </TabsContent>

        <TabsContent value="historico" className="mt-0">
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
      </div>

      <SheetFooter className="mt-4 pt-4 border-t">
        <SheetClose asChild>
          <Button variant="outline">Cancelar</Button>
        </SheetClose>
        <Button onClick={onSave}>Salvar Alterações</Button>
      </SheetFooter>
    </Tabs>
  );
}