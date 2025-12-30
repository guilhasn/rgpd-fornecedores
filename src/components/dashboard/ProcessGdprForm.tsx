import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Process, SupplierData } from "@/types/process";
import { ShieldCheck, Globe, Users, FileText } from "lucide-react";

interface ProcessGdprFormProps {
  processo: Partial<Process>;
  setProcesso: (processo: Partial<Process>) => void;
}

export function ProcessGdprForm({ processo, setProcesso }: ProcessGdprFormProps) {
  const rgpd = processo.rgpd || {};

  const updateRgpd = (field: keyof SupplierData, value: any) => {
    setProcesso({
      ...processo,
      rgpd: { ...rgpd, [field]: value }
    });
  };

  return (
    <div className="space-y-8 py-2">
      
      {/* SECÇÃO 1: Identificação e Prazos */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800 border-b pb-2">
           <FileText className="w-5 h-5 text-blue-600" />
           <h3 className="font-semibold text-lg">Dados Contratuais e Prazos</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nif">NIF / NIPC</Label>
            <Input
              id="nif"
              value={rgpd.nif || ""}
              onChange={(e) => updateRgpd("nif", e.target.value)}
              placeholder="500 000 000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataInicio">Início Contrato</Label>
            <div className="relative">
                <Input
                id="dataInicio"
                type="date"
                value={rgpd.dataInicioContrato || ""}
                onChange={(e) => updateRgpd("dataInicioContrato", e.target.value)}
                />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataFim">Fim Contrato / Renovação</Label>
            <Input
              id="dataFim"
              type="date"
              value={rgpd.dataFimContrato || ""}
              onChange={(e) => updateRgpd("dataFimContrato", e.target.value)}
              className={rgpd.dataFimContrato && new Date(rgpd.dataFimContrato) < new Date() ? "border-red-300 bg-red-50 text-red-900" : ""}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-md border border-slate-100">
           <Switch 
             id="tem-acesso" 
             checked={rgpd.temAcessoDados === "Sim"}
             onCheckedChange={(checked) => updateRgpd("temAcessoDados", checked ? "Sim" : "Não")}
           />
           <Label htmlFor="tem-acesso" className="flex-1 cursor-pointer">
             O fornecedor tem acesso, trata ou aloja dados pessoais da organização?
           </Label>
        </div>
      </section>

      {/* SECÇÃO 2: Caracterização do Tratamento */}
      {rgpd.temAcessoDados === "Sim" && (
        <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 text-slate-800 border-b pb-2 mt-6">
             <Users className="w-5 h-5 text-indigo-600" />
             <h3 className="font-semibold text-lg">Caracterização do Tratamento</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Tipos de Dados Pessoais</Label>
              <Textarea
                value={rgpd.tipoDadosPessoais || ""}
                onChange={(e) => updateRgpd("tipoDadosPessoais", e.target.value)}
                placeholder="Ex: Nome, Email, NIF, IBAN, Imagens CCTV..."
                className="h-24 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Finalidade do Tratamento</Label>
              <Textarea
                value={rgpd.finalidadeTratamento || ""}
                onChange={(e) => updateRgpd("finalidadeTratamento", e.target.value)}
                placeholder="Ex: Processamento salarial, Gestão de acessos, Suporte técnico..."
                className="h-24 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
             <div className="space-y-3 border p-4 rounded-md">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Globe className="w-4 h-4" /> Transferências Internacionais
                </div>
                <div className="flex items-center space-x-2">
                    <Switch 
                        checked={rgpd.transferenciaInternacional === "Sim"}
                        onCheckedChange={(c) => updateRgpd("transferenciaInternacional", c ? "Sim" : "Não")}
                    />
                    <span className="text-sm">{rgpd.transferenciaInternacional === "Sim" ? "Sim, transfere dados" : "Não, dados na UE/EEE"}</span>
                </div>
                {rgpd.transferenciaInternacional === "Sim" && (
                     <Input 
                        placeholder="Indique o país/região..." 
                        value={rgpd.paisTransferencia || ""}
                        onChange={(e) => updateRgpd("paisTransferencia", e.target.value)}
                        className="mt-2"
                     />
                )}
             </div>

             <div className="space-y-3 border p-4 rounded-md">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Users className="w-4 h-4" /> Subcontratação
                </div>
                <div className="flex items-center space-x-2">
                    <Switch 
                        checked={rgpd.subcontratacao === "Sim"}
                        onCheckedChange={(c) => updateRgpd("subcontratacao", c ? "Sim" : "Não")}
                    />
                    <span className="text-sm">{rgpd.subcontratacao === "Sim" ? "Sim, recorre a terceiros" : "Não existe subcontratação"}</span>
                </div>
                {rgpd.subcontratacao === "Sim" && (
                    <p className="text-xs text-slate-500 mt-2">
                        Nota: Requerer evidência de conformidade dos subcontratantes.
                    </p>
                )}
             </div>
          </div>
        </section>
      )}

      {/* SECÇÃO 3: Risco e Segurança */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800 border-b pb-2 mt-6">
           <ShieldCheck className="w-5 h-5 text-emerald-600" />
           <h3 className="font-semibold text-lg">Segurança e Avaliação de Risco</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label>Nível de Risco RGPD</Label>
                <Select
                    value={rgpd.nivelRisco}
                    onValueChange={(val) => updateRgpd("nivelRisco", val)}
                >
                    <SelectTrigger className={
                        rgpd.nivelRisco === "Crítico" ? "border-red-500 text-red-600 font-medium" : 
                        rgpd.nivelRisco === "Alto" ? "border-orange-500 text-orange-600 font-medium" : ""
                    }>
                        <SelectValue placeholder="Selecione o risco..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Baixo">Baixo (Dados simples, baixo volume)</SelectItem>
                        <SelectItem value="Médio">Médio (Dados comuns, algum volume)</SelectItem>
                        <SelectItem value="Alto">Alto (Dados sensíveis ou grande escala)</SelectItem>
                        <SelectItem value="Crítico">Crítico (Dados especiais, alto impacto)</SelectItem>
                    </SelectContent>
                </Select>
             </div>

             <div className="space-y-2">
                <Label>Medidas de Segurança Implementadas</Label>
                <Input 
                    value={rgpd.medidasSeguranca || ""}
                    onChange={(e) => updateRgpd("medidasSeguranca", e.target.value)}
                    placeholder="Ex: Encriptação, ISO 27001, 2FA..." 
                />
             </div>
        </div>

        <div className="space-y-2">
            <Label>Responsável pelo Contrato (Interno)</Label>
            <div className="flex gap-3">
                <Input 
                    value={rgpd.responsavelContrato || ""}
                    onChange={(e) => updateRgpd("responsavelContrato", e.target.value)}
                    placeholder="Nome do Gestor" 
                    className="flex-1"
                />
                 <Input 
                    value={rgpd.emailResponsavel || ""}
                    onChange={(e) => updateRgpd("emailResponsavel", e.target.value)}
                    placeholder="Email de contacto" 
                    className="flex-1"
                />
            </div>
        </div>
      </section>

    </div>
  );
}