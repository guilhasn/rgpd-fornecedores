import { useRef } from "react";
import { Process, SupplierData } from "@/types/process";
import { toast } from "sonner";

export function useProcessImportExport(
  processos: Process[], 
  importProcesses: (novos: Process[]) => void
) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getToday = () => new Date().toISOString().split('T')[0];

  const handleExportCSV = () => {
    const headers = ["ID,Referencia,Fornecedor,Assunto,Estado,Prioridade,Data Entrada,Risco RGPD,Fim Contrato,Tipos de Dados,Finalidade"];
    const rows = processos.map(p => {
      const escape = (text?: string) => text ? `"${text.replace(/"/g, '""')}"` : '""';
      return [
        p.id,
        escape(p.referencia),
        escape(p.cliente),
        escape(p.assunto),
        p.estado,
        p.prioridade,
        p.dataEntrada,
        escape(p.rgpd?.nivelRisco || 'N/A'),
        p.rgpd?.dataFimContrato || '',
        escape(p.rgpd?.tipoDadosPessoais),
        escape(p.rgpd?.finalidadeTratamento)
      ].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `processos_rgpd_export_${getToday()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Relatório exportado com sucesso!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const parseCSV = (csvText: string) => {
    try {
      const lines = csvText.split("\n");
      const dataLines = lines.slice(3).filter(line => line.trim() !== "");
      
      const novosProcessos: Process[] = [];
      let currentId = Math.max(...processos.map(p => p.id), 0) + 1;

      dataLines.forEach(line => {
        const cols = line.split(";").map(c => c.replace(/^"|"$/g, "").trim());
        if (cols.length < 5) return; 

        const convertDate = (d: string) => {
          if (!d) return "";
          const parts = d.split("/");
          if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
          return d;
        };

        const rgpdData: SupplierData = {
          nif: cols[4],
          dataInicioContrato: convertDate(cols[6]),
          dataFimContrato: convertDate(cols[7]),
          temAcessoDados: cols[9] === "Sim" ? "Sim" : cols[9] === "Não" ? "Não" : "N/A",
          tipoDadosPessoais: cols[11],
          finalidadeTratamento: cols[12],
          transferenciaInternacional: cols[13] === "Sim" ? "Sim" : "Não",
          paisTransferencia: cols[14],
          subcontratacao: cols[15] === "Sim" ? "Sim" : "Não",
          responsavelContrato: cols[21],
          emailResponsavel: cols[23],
          medidasSeguranca: cols[25],
          nivelRisco: cols[26],
          monitorizacao: cols[29]
        };

        const novoProcesso: Process = {
          id: currentId++,
          referencia: cols[0] || `IMP-${currentId}`,
          cliente: cols[3] || "Desconhecido",
          unidadeOrganica: cols[1],
          assunto: cols[5] || "Importado via CSV",
          estado: "Aberto",
          prioridade: "Média",
          dataEntrada: getToday(),
          rgpd: rgpdData,
          historico: [{ data: getToday(), acao: "Importado via ficheiro CSV" }]
        };

        novosProcessos.push(novoProcesso);
      });

      if (novosProcessos.length > 0) {
        importProcesses(novosProcessos);
      } else {
        toast.error("Não foi possível ler dados válidos do ficheiro.");
      }
    } catch (error) {
      console.error("Erro ao importar CSV:", error);
      toast.error("Erro ao processar o ficheiro.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return { 
    handleExportCSV, 
    handleFileUpload, 
    triggerFileInput, 
    fileInputRef 
  };
}