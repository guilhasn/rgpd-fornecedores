import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Process } from "@/types/process";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Lista categorizada de tipos de dados comuns em RGPD
const DATA_CATEGORIES = [
  {
    category: "Dados de Identificação",
    items: [
      "Nome Completo",
      "Números de Identificação (CC, NIF, Passaporte)",
      "Número de Segurança Social (NISS)",
      "Número de Utente / Cliente",
      "Imagem / Fotografia",
      "Assinatura",
    ]
  },
  {
    category: "Dados de Contacto",
    items: [
      "Morada / Residência",
      "Email (Pessoal/Profissional)",
      "Número de Telefone / Telemóvel",
    ]
  },
  {
    category: "Vida Profissional e Financeira",
    items: [
      "Dados Bancários (IBAN, Cartões)",
      "Dados de Pagamento / Faturação",
      "Situação Profissional / Cargo",
      "Remuneração / Vencimento",
      "Avaliação de Desempenho",
      "Registo de Assiduidade / Ponto",
    ]
  },
  {
    category: "Dados Eletrónicos e Localização",
    items: [
      "Endereço IP / MAC Address",
      "Logs de Acesso / Tráfego",
      "Cookies / Identificadores Web",
      "Dados de Geolocalização (GPS)",
    ]
  },
  {
    category: "Categorias Especiais (Dados Sensíveis)",
    items: [
      "Dados de Saúde / Clínicos",
      "Dados Biométricos (Impressão Digital, Face)",
      "Filiação Sindical",
      "Origem Racial ou Étnica",
      "Convicções Religiosas ou Filosóficas",
      "Registo Criminal / Dados Judiciais",
    ]
  }
];

interface ProcessGdprFormProps {
  processo: Partial<Process>;
  setProcesso: (p: Partial<Process>) => void;
}

export function ProcessGdprForm({ processo, setProcesso }: ProcessGdprFormProps) {
  const rgpd = processo.rgpd || {};
  const [openCombobox, setOpenCombobox] = useState(false);

  // Helper to manage multi-select logic mapping to a single string
  const selectedDataTypes = rgpd.tipoDadosPessoais 
    ? rgpd.tipoDadosPessoais.split(", ").filter(Boolean) 
    : [];

  const updateRgpd = (field: string, value: any) => {
    setProcesso({
      ...processo,
      rgpd: {
        ...rgpd,
        [field]: value,
      },
    });
  };

  const toggleDataType = (type: string) => {
    let newTypes;
    if (selectedDataTypes.includes(type)) {
      newTypes = selectedDataTypes.filter((t) => t !== type);
    } else {
      newTypes = [...selectedDataTypes, type];
    }
    updateRgpd("tipoDadosPessoais", newTypes.join(", "));
  };

  const removeDataType = (type: string) => {
    const newTypes = selectedDataTypes.filter((t) => t !== type);
    updateRgpd("tipoDadosPessoais", newTypes.join(", "));
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

        {/* New Multi-Select Data Types Component */}
        <div className="space-y-2">
          <Label>Tipos de Dados Pessoais</Label>
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className="w-full justify-between text-left font-normal h-auto min-h-[40px]"
              >
                {selectedDataTypes.length > 0 
                  ? `${selectedDataTypes.length} tipo(s) selecionado(s)` 
                  : "Selecionar tipos de dados..."}
                <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Procurar tipo de dados..." />
                <CommandList className="max-h-[300px] overflow-auto">
                  <CommandEmpty>Nenhum tipo de dados encontrado.</CommandEmpty>
                  {DATA_CATEGORIES.map((group) => (
                    <CommandGroup key={group.category} heading={group.category}>
                      {group.items.map((item) => (
                        <CommandItem
                          key={item}
                          value={item}
                          onSelect={() => toggleDataType(item)}
                        >
                          <div className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedDataTypes.includes(item)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}>
                            <Check className={cn("h-4 w-4")} />
                          </div>
                          {item}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Selected Items Display */}
          <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 bg-slate-50 rounded-md border border-slate-100">
             {selectedDataTypes.length === 0 && (
                <span className="text-sm text-slate-400 italic">Nenhum tipo de dados selecionado.</span>
             )}
             {selectedDataTypes.map((type) => (
              <Badge key={type} variant="secondary" className="bg-white border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50">
                {type}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDataType(type);
                  }}
                >
                  <X className="h-3 w-3 text-slate-400 hover:text-red-500" />
                  <span className="sr-only">Remove</span>
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Finalidade do Tratamento</Label>
          <Textarea
            value={rgpd.finalidadeTratamento || ""}
            onChange={(e) => updateRgpd("finalidadeTratamento", e.target.value)}
            placeholder="Motivo do acesso aos dados (ex: Gestão de Contrato, Pagamento de Salários, etc.)"
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
            placeholder="Ex: ISO 27001, Encriptação, Backups..."
          />
        </div>
      </div>
    </div>
  );
}