import { useState, useMemo, useEffect } from "react";
import { 
  Plus, 
  Search, 
  FileText, 
  MoreHorizontal, 
  Filter, 
  Calendar as CalendarIcon,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  Briefcase,
  AlertTriangle,
  LayoutGrid,
  List as ListIcon,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// --- TIPO DE DADOS ---
type Processo = {
  id: number;
  referencia: string;
  cliente: string;
  assunto: string;
  estado: "Aberto" | "Em Curso" | "Pendente" | "Concluído";
  prioridade: "Baixa" | "Média" | "Alta";
  dataEntrada: string;
  historico?: { data: string; acao: string }[];
};

// --- DADOS INICIAIS ---
const DADOS_EXEMPLO: Processo[] = [
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
  // Inicializar estado com LocalStorage se existir
  const [processos, setProcessos] = useState<Processo[]>(() => {
    const saved = localStorage.getItem("processos-db");
    return saved ? JSON.parse(saved) : DADOS_EXEMPLO;
  });
  
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [processoAtual, setProcessoAtual] = useState<Partial<Processo>>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  // Salvar no LocalStorage sempre que 'processos' mudar
  useEffect(() => {
    localStorage.setItem("processos-db", JSON.stringify(processos));
  }, [processos]);

  // --- ANALYTICS ---
  const stats = useMemo(() => {
    return {
      total: processos.length,
      pendentes: processos.filter(p => p.estado !== "Concluído").length,
      urgentes: processos.filter(p => p.prioridade === "Alta" && p.estado !== "Concluído").length,
    };
  }, [processos]);

  // --- HELPER DE DATAS ---
  const getToday = () => new Date().toISOString().split('T')[0];
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [ano, mes, dia] = dateStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // --- EXPORTAR CSV ---
  const handleExportCSV = () => {
    // Cabeçalho do CSV
    const headers = ["ID,Referencia,Cliente,Assunto,Estado,Prioridade,Data Entrada"];
    
    // Linhas de dados
    const rows = processos.map(p => 
      `${p.id},"${p.referencia}","${p.cliente}","${p.assunto}",${p.estado},${p.prioridade},${p.dataEntrada}`
    );

    // Juntar tudo
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].join("\n");
    
    // Criar link de download e clicar automaticamente
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `processos_export_${getToday()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Relatório exportado com sucesso!");
  };

  // --- LÓGICA DE CRUD ---
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
          return { ...p, ...processoAtual, historico: novoHistorico } as Processo;
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
      } as Processo;
      setProcessos([...processos, novoProcesso]);
      toast.success("Novo processo criado!");
    }
    setIsSheetOpen(false);
    setProcessoAtual({});
  };

  const handleDelete = (id: number) => {
    setProcessos(processos.filter(p => p.id !== id));
    toast.success("Processo removido.");
  };

  const handleEdit = (processo: Processo) => {
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

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Concluído": return "bg-green-500 hover:bg-green-600";
      case "Em Curso": return "bg-blue-500 hover:bg-blue-600";
      case "Pendente": return "bg-yellow-500 hover:bg-yellow-600";
      default: return "bg-slate-500 hover:bg-slate-600";
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch(prioridade) {
      case "Alta": return "text-red-600 border-red-200 bg-red-50";
      case "Média": return "text-yellow-600 border-yellow-200 bg-yellow-50";
      default: return "text-slate-600 border-slate-200 bg-slate-50";
    }
  };

  // --- KANBAN COLUMNS ---
  const kanbanColumns = ["Aberto", "Em Curso", "Pendente", "Concluído"];

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

                <Tabs defaultValue="detalhes" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                    <TabsTrigger value="historico" disabled={!processoAtual.id}>Histórico</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="detalhes" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="ref">Referência</Label>
                      <Input 
                        id="ref" 
                        placeholder="Ex: PROC-2025/099" 
                        value={processoAtual.referencia || ""}
                        onChange={e => setProcessoAtual({...processoAtual, referencia: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cliente">Cliente / Entidade</Label>
                      <Input 
                        id="cliente" 
                        placeholder="Nome do cliente" 
                        value={processoAtual.cliente || ""}
                        onChange={e => setProcessoAtual({...processoAtual, cliente: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assunto">Assunto</Label>
                      <Input 
                        id="assunto" 
                        placeholder="Resumo do pedido" 
                        value={processoAtual.assunto || ""}
                        onChange={e => setProcessoAtual({...processoAtual, assunto: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Estado</Label>
                        <Select 
                          value={processoAtual.estado} 
                          onValueChange={(val: any) => setProcessoAtual({...processoAtual, estado: val})}
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
                          value={processoAtual.prioridade} 
                          onValueChange={(val: any) => setProcessoAtual({...processoAtual, prioridade: val})}
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
                      <Button onClick={handleSave}>Salvar Alterações</Button>
                    </SheetFooter>
                  </TabsContent>

                  <TabsContent value="historico">
                    <div className="space-y-4 pt-4">
                      <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Timeline de Atividade</h4>
                      <div className="relative border-l border-slate-200 ml-2 pl-6 space-y-6">
                        {processoAtual.historico?.map((item, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-slate-300 border-2 border-white" />
                            <p className="text-sm text-slate-900 font-medium">{item.acao}</p>
                            <p className="text-xs text-slate-500">{formatDate(item.data)}</p>
                          </div>
                        ))}
                        {(!processoAtual.historico || processoAtual.historico.length === 0) && (
                          <p className="text-sm text-slate-400 italic">Sem histórico registado.</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
              <Briefcase className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-slate-500">Registados em sistema</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes / Em Curso</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendentes}</div>
              <p className="text-xs text-slate-500">Requerem atenção</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.urgentes}</div>
              <p className="text-xs text-slate-500">Necessitam ação imediata</p>
            </CardContent>
          </Card>
        </div>

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

        {/* VIEW MODE: LISTA */}
        {viewMode === "list" && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[120px]">Referência</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Data Entrada</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                      Nenhum processo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  processosFiltrados.map((processo) => (
                    <TableRow key={processo.id} className="hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="font-mono text-xs font-medium text-slate-600">
                        {processo.referencia}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {processo.cliente}
                      </TableCell>
                      <TableCell className="text-slate-600 max-w-[250px] truncate" title={processo.assunto}>
                        {processo.assunto}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(processo.estado)} border-none text-white shadow-none`}>
                          {processo.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(processo.prioridade)}`}>
                           {processo.prioridade}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {formatDate(processo.dataEntrada)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(processo)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* VIEW MODE: KANBAN BOARD */}
        {viewMode === "board" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto pb-4">
            {kanbanColumns.map((coluna) => {
               const processosDaColuna = processosFiltrados.filter(p => p.estado === coluna);
               return (
                 <div key={coluna} className="space-y-4 min-w-[280px]">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-700">{coluna}</h3>
                      <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-600 font-medium">
                        {processosDaColuna.length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {processosDaColuna.map(processo => (
                        <Card key={processo.id} className="cursor-pointer hover:shadow-md transition-shadow border-slate-200" onClick={() => handleEdit(processo)}>
                          <CardHeader className="p-4 pb-2 space-y-2">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-mono text-slate-500">{processo.referencia}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getPriorityColor(processo.prioridade)}`}>
                                {processo.prioridade}
                              </span>
                            </div>
                            <CardTitle className="text-sm font-semibold text-slate-900 leading-tight">
                              {processo.cliente}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                             <p className="text-xs text-slate-500 line-clamp-2 mt-1">{processo.assunto}</p>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatDate(processo.dataEntrada)}
                          </CardFooter>
                        </Card>
                      ))}
                      {processosDaColuna.length === 0 && (
                        <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                          Vazio
                        </div>
                      )}
                    </div>
                 </div>
               );
            })}
          </div>
        )}

      </div>
    </div>
  );
}