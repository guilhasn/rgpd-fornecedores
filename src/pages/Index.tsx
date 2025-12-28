import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List as ListIcon,
  Download
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
import { toast } from "sonner";
import { Process } from "@/types/process";
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
      { data: "2025-01-02", acao: "Processo criado" },
      { data: "2025-01-03", acao: "Atribuído ao departamento jurídico" },
      { data: "2025-01-05", acao: "Alterado para 'Em Curso'" }
    ]
  },
  { id: 2, referencia: "PROC-2025/002", cliente: "Maria Silva", assunto: "Avaria Equipamento", estado: "Aberto", prioridade: "Média", dataEntrada: "2025-01-05", historico: [{ data: "2025-01-05", acao: "Processo criado" }] },
  { id: 3, referencia: "PROC-2025/003", cliente: "Restaurante O Tacho", assunto: "Renovação Licença", estado: "Concluído", prioridade: "Baixa", dataEntrada: "2024-12-28", historico: [{ data: "2024-12-28", acao: "Concluído" }] },
  { id: 4, referencia: "PROC-2025/004", cliente: "João Santos Arq.", assunto: "Consultoria Fiscal", estado: "Pendente", prioridade: "Alta", dataEntrada: "2025-01-10", historico: [{ data: "2025-01-10", acao: "Aguarda documentação" }] },
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

  useEffect(() => {
    localStorage.setItem("processos-db", JSON.stringify(processos));
  }, [processos]);

  const getToday = () => new Date().toISOString().split('T')[0];
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [ano, mes, dia] = dateStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleExportCSV = () => {
    const headers = ["ID,Referencia,Cliente,Assunto,Estado,Prioridade,Data Entrada"];
    const rows = processos.map(p => 
      `${p.id},"${p.referencia}","${p.cliente}","${p.assunto}",${p.estado},${p.prioridade},${p.dataEntrada}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `processos_export_${getToday()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Relatório exportado com sucesso!");
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
          if (p.prioridade !== processoAtual.prioridade) {
            novoHistorico.unshift({ data: getToday(), acao: `Prioridade alterada para '${processoAtual.prioridade}'` });
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

  const processosFiltrados = processos.filter(p => 
    p.cliente.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    p.referencia.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    p.assunto.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Processos 2025</h1>
            <p className="text-slate-500 mt-1">Dashboard Administrativo</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden md:flex" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" /> Exportar CSV
            </Button>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button onClick={handleNew} className="bg-slate-900 hover:bg-slate-800">
                  <Plus className="mr-2 h-4 w-4" /> Novo Processo
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md w-full">
                <SheetHeader className="mb-6">
                  <SheetTitle>{processoAtual.id ? `Editar ${processoAtual.referencia}` : "Novo Processo"}</SheetTitle>
                  <SheetDescription>
                    Gere os detalhes e consulta o histórico deste processo.
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
              placeholder="Pesquisar..." 
              className="border-none shadow-none focus-visible:ring-0"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
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