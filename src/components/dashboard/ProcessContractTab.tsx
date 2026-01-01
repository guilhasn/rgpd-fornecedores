import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Process, ProcessPriority, ProcessStatus, UnidadeOrganica } from "@/types/process";

interface ProcessContractTabProps {
  processo: Partial<Process>;
  setProcesso: (processo: Partial<Process>) => void;
  uos: UnidadeOrganica[];
}

export function ProcessContractTab({ processo, setProcesso, uos }: ProcessContractTabProps) {
  
  // Helper to handle UO selection
  const handleUoChange = (uoId: string) => {
    const uo = uos.find(u => u.id === uoId);
    if (!uo) return;
    
    setProcesso({
        ...processo,
        unidadeOrganicaId: uo.id,
        unidadeOrganica: uo.sigla // Keep sigla for display/local mode consistency
    });
  };

  // Determine current value
  const currentUoValue = processo.unidadeOrganicaId || 
    uos.find(u => u.sigla === processo.unidadeOrganica)?.id;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="referencia">Referência Interna</Label>
          <Input
            id="referencia"
            value={processo.referencia || ""}
            onChange={(e) => setProcesso({ ...processo, referencia: e.target.value })}
            placeholder="Ex: PROC-2024/001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prioridade">Prioridade</Label>
          <Select
            value={processo.prioridade}
            onValueChange={(val) => setProcesso({ ...processo, prioridade: val as ProcessPriority })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baixa">Baixa</SelectItem>
              <SelectItem value="Média">Média</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cliente">Fornecedor / Entidade</Label>
        <Input
          id="cliente"
          value={processo.cliente || ""}
          onChange={(e) => setProcesso({ ...processo, cliente: e.target.value })}
          placeholder="Nome da empresa ou entidade"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unidade">Unidade Orgânica</Label>
          <Select
            value={currentUoValue}
            onValueChange={handleUoChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a UO..." />
            </SelectTrigger>
            <SelectContent>
              {uos.map(uo => (
                <SelectItem key={uo.id} value={uo.id}>
                  {uo.sigla} - {uo.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado Atual</Label>
          <Select
            value={processo.estado}
            onValueChange={(val) => setProcesso({ ...processo, estado: val as ProcessStatus })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aberto">Aberto</SelectItem>
              <SelectItem value="Em Curso">Em Curso</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-2">
            <Label htmlFor="dataEntrada">Data de Entrada</Label>
            <Input 
                id="dataEntrada"
                type="date"
                value={processo.dataEntrada ? new Date(processo.dataEntrada).toISOString().split('T')[0] : ""}
                onChange={(e) => setProcesso({...processo, dataEntrada: e.target.value})}
            />
         </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assunto">Assunto / Descrição</Label>
        <Textarea
          id="assunto"
          value={processo.assunto || ""}
          onChange={(e) => setProcesso({ ...processo, assunto: e.target.value })}
          placeholder="Descrição resumida do contrato ou serviço..."
          className="h-24"
        />
      </div>
    </div>
  );
}