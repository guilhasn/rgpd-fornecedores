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
import { Process } from "@/types/process";

interface ProcessGdprFormProps {
  processo: Partial<Process>;
  setProcesso: (p: Partial<Process>) => void;
}

export function ProcessGdprForm({ processo, setProcesso }: ProcessGdprFormProps) {
  const rgpd = processo.rgpd || {};

  const updateRgpd = (field: string, value: any) => {
    setProcesso({
      ...processo,
      rgpd: {
        ...rgpd,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>NIF Fornecedor</Label>
          <Input
            value={rgpd.nif || ""}
            onChange={(e) => updateRgpd("nif", e.target.value)}
            placeholder="000 000 000"
          />
        </div>
        <div className="space-y-2">
          <Label>Responsável Contrato</Label>
          <Input
            value={rgpd.responsavelContrato || ""}
            onChange={(e) => updateRgpd("responsavelContrato", e.target.value)}
            placeholder="Nome do gestor"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Início Contrato</Label>
          <Input
            type="date"
            value={rgpd.dataInicioContrato || ""}
            onChange={(e) => updateRgpd("dataInicioContrato", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Fim Contrato</Label>
          <Input
            type="date"
            value={rgpd.dataFimContrato || ""}
            onChange={(e) => updateRgpd("dataFimContrato", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-slate-900">Tratamento de Dados</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Acesso a Dados Pessoais?</Label>
            <Select
              value={rgpd.temAcessoDados}
              onValueChange={(val) => updateRgpd("temAcessoDados", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
                <SelectItem value="N/A">N/A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Transferência Internacional?</Label>
            <Select
              value={rgpd.transferenciaInternacional}
              onValueChange={(val) => updateRgpd("transferenciaInternacional", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

           <div className="space-y-2">
            <Label>Subcontratação?</Label>
            <Select
              value={rgpd.subcontratacao}
              onValueChange={(val) => updateRgpd("subcontratacao", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tipos de Dados Pessoais</Label>
          <Textarea
            value={rgpd.tipoDadosPessoais || ""}
            onChange={(e) => updateRgpd("tipoDadosPessoais", e.target.value)}
            placeholder="Ex: Nome, Email, NIF, Dados Biométricos..."
            className="h-20"
          />
        </div>

        <div className="space-y-2">
          <Label>Finalidade do Tratamento</Label>
          <Textarea
            value={rgpd.finalidadeTratamento || ""}
            onChange={(e) => updateRgpd("finalidadeTratamento", e.target.value)}
            placeholder="Motivo do acesso aos dados..."
            className="h-20"
          />
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-slate-900">Avaliação e Risco</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Avaliação de Risco</Label>
            <Select
              value={rgpd.nivelRisco}
              onValueChange={(val) => updateRgpd("nivelRisco", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baixo">Baixo</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Alto">Alto</SelectItem>
                <SelectItem value="Crítico">Crítico</SelectItem>
                <SelectItem value="Faltam Dados">Faltam Dados</SelectItem>
              </SelectContent>
            </Select>
          </div>

           <div className="space-y-2">
            <Label>Monitorização</Label>
             <Input
                value={rgpd.monitorizacao || ""}
                onChange={(e) => updateRgpd("monitorizacao", e.target.value)}
                placeholder="Ex: Anual"
              />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Medidas de Segurança / Certificações</Label>
          <Input
            value={rgpd.medidasSeguranca || ""}
            onChange={(e) => updateRgpd("medidasSeguranca", e.target.value)}
            placeholder="Ex: ISO 27001, RGPD Compliance..."
          />
        </div>
      </div>
    </div>
  );
}