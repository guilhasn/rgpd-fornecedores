import { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List as ListIcon,
  Download,
  Upload,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Process, SupplierData } from "@/types/process";
import { ProcessStats } from "@/components/dashboard/ProcessStats";
import { ProcessTable } from "@/components/dashboard/ProcessTable";
import { ProcessKanban } from "@/components/dashboard/ProcessKanban";
import { ProcessForm } from "@/components/dashboard/ProcessForm";

// --- DADOS INICIAIS ---
const DADOS_EXEMPLO: Process[] = [
  { 
    id: 1, 
    referencia: "PROC-2025/001", 
    cliente: "Tech Solutions Lda", 
    assunto: "Contrato de Serviços", 
    estado: "Em Curso", 
    prioridade: "Alta", 
    dataEntrada: "2025-01-02",
    historico: [
      { data: "2025-01-02", acao: "Processo criado" }
    ],
    rgpd: {
      nivelRisco: "Médio",
      temAcessoDados: "Sim",
      dataFimContrato: "2025-12-31",
      tipoDadosPessoais: "Nome Completo, Email (Pessoal/Profissional)",
      finalidadeTratamento: "Gestão de acessos"
    }
  }
];

export default function Index() {
  const [processos, setProcessos] = useState<Process[]>(() => {
    const saved = localStorage.getItem("processos-db");
    return saved ? JSON.parse(saved) : DADOS_EXEMPLO;
  });
  
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [processoAtual, setProcessoAtual] = useState<Partial<Process>>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  
  // Filters
  const [filtroRisco, setFiltroRisco] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("processos-db", JSON.stringify(processos));
  }, [processos]);

  const getToday = () => new Date().toISOString().split('T')[0];
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) {
      const [ano, mes, dia] = dateStr.split("-");
      if (dia && dia.length === 4) return `${ano}/${mes}/${dia}`;
      return `${dia}/${mes}/${ano}`;
    }
    return dateStr;
  };

  const handleExportCSV = () => {
    // Added "Tipos de Dados" and "Finalidade" to headers
    const headers = ["ID,Referencia,Fornecedor,Assunto,Estado,Prioridade,Data Entrada,Risco RGPD,Fim Contrato,Tipos de Dados,Finalidade"];
    
    const rows = processos.map(p => {
      // Escape quotes for CSV format to handle text with commas correctly
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
        setProcessos(prev => [...prev, ...novosProcessos]);
        toast.success(`${novosProcessos.length} processos importados com sucesso!`);
      } else {
        toast.error("Não foi possível ler dados válidos do ficheiro.");
      }
    } catch (error) {
      console.error("Erro ao importar CSV:", error);
      toast.error("Erro ao processar o ficheiro.");
    }
  };

  const handleSave = () => {
    if (!processoAtual.cliente || !processoAtual.referencia) {
      toast.error("Preenche os campos obrigatórios!");
      return;
    }

    if (processoAtual.id) {
      setProcessos(processos.map(p => {
        if (p.id === processoAtual.id) {
          const novoHistorico = [...(p.historico || [])];
          if (p.estado !== processoAtual.estado) {
            novoHistorico.unshift({ data: getToday(), acao: `Estado alterado de '${p.estado}' para '${processoAtual.estado}'` });
          }
          if (p.rgpd?.nivelRisco !== processoAtual.rgpd?.nivelRisco && processoAtual.rgpd?.nivelRisco) {
            novoHistorico.unshift({ data: getToday(), acao: `Nível de risco atualizado para '${processoAtual.rgpd?.nivelRisco}'` });
          }
          return { ...p, ...processoAtual, historico: novoHistorico } as Process;
        }
        return p;
      }));
      toast.success("Processo atualizado!");
    } else {
      const novoId = Math.max(...processos.map(p => p.id), 0) + 1;
      const novoProcesso = { 
        ...processoAtual, 
        id: novoId, 
        dataEntrada: getToday(),
        estado: processoAtual.estado || "Aberto",
        prioridade: processoAtual.prioridade || "Média",
        historico: [{ data: getToday(), acao: "Processo Criado" }]
      } as Process;
      setProcessos([...processos, novoProcesso]);
      toast.success("Novo processo criado!");
    }
    setIsSheetOpen(false);
    setProcessoAtual({});
  };

  const handleDelete = (id: number) => {
    setProcessos(processos.filter(p => p.id !== id));
    toast.success("Processo removido com sucesso.");
  };

  const handleEdit = (processo: Process) => {
    setProcessoAtual({ ...processo });
    setIsSheetOpen(true);
  };

  const handleNew = () => {
    setProcessoAtual({}); 
    setIsSheetOpen(true);
  };

  const toggleRiskFilter = (risk: string) => {
    setFiltroRisco(prev => 
      prev.includes(risk) 
        ? prev.filter(r => r !== risk)
        : [...prev, risk]
    );
  };

  const processosFiltrados = processos.filter(p => {
    const matchesSearch = 
      p.cliente.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      p.referencia.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      p.assunto.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      (p.rgpd?.nif || "").includes(termoPesquisa);

    const matchesRisk = 
      filtroRisco.length === 0 || 
      (p.rgpd?.nivelRisco && filtroRisco.includes(p.rgpd.nivelRisco));

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Fornecedores & RGPD</h1>
            <p className="text-slate-500 mt-1">Dashboard de Conformidade e Avaliação de Risco</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Importar CSV
            </Button>
            
            <Button variant="outline" className="hidden md:flex" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" /> Exportar Relatório
            </Button>
            
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button onClick={handleNew} className="bg-slate-900 hover:bg-slate-800">
                  <Plus className="mr-2 h-4 w-4" /> Novo Processo
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-2xl w-full">
                <SheetHeader className="mb-6">
                  <SheetTitle>{processoAtual.id ? `Editar ${processoAtual.referencia}` : "Novo Processo"}</SheetTitle>
                  <SheetDescription>
                    Gere os detalhes contratuais e a avaliação de impacto RGPD.
                  </SheetDescription>
                </SheetHeader>
                <ProcessForm 
                  processo={processoAtual} 
                  setProcesso={setProcessoAtual} 
                  onSave={handleSave}
                  formatDate={formatDate}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <ProcessStats processos={processos} />

        {/* Barra de Controlo e Filtros */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200 w-full md:w-auto flex-1 max-w-lg">
            <Search className="h-4 w-4 text-slate-500 ml-2" />
            <Input 
              placeholder="Pesquisar por Fornecedor, NIF, Ref..." 
              className="border-none shadow-none focus-visible:ring-0"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-dashed bg-white">
                  <Filter className="mr-2 h-4 w-4" />
                  Risco {filtroRisco.length > 0 && `(${filtroRisco.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filtrar por Risco</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["Crítico", "Alto", "Médio", "Baixo"].map((risk) => (
                  <DropdownMenuCheckboxItem
                    key={risk}
                    checked={filtroRisco.includes(risk)}
                    onCheckedChange={() => toggleRiskFilter(risk)}
                  >
                    {risk}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}
              >
                <ListIcon className="h-4 w-4 mr-2" /> Lista
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode("board")}
                className={viewMode === "board" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}
              >
                <LayoutGrid className="h-4 w-4 mr-2" /> Quadro
              </Button>
            </div>
          </div>
        </div>

        {viewMode === "list" && (
          <ProcessTable 
            processos={processosFiltrados} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            formatDate={formatDate}
          />
        )}

        {viewMode === "board" && (
          <ProcessKanban 
            processos={processosFiltrados} 
            onEdit={handleEdit} 
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
}