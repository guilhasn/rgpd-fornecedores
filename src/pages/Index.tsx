import { useState } from "react";
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
  AlertCircle
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
import { toast } from "sonner";

// --- TIPO DE DADOS (Modelo do teu Excel) ---
type Processo = {
  id: number;
  referencia: string;
  cliente: string;
  assunto: string;
  estado: "Aberto" | "Em Curso" | "Pendente" | "Concluído";
  prioridade: "Baixa" | "Média" | "Alta";
  dataEntrada: string;
};

// --- DADOS INICIAIS (Simulação do Excel) ---
const DADOS_EXEMPLO: Processo[] = [
  { id: 1, referencia: "PROC-2025/001", cliente: "Tech Solutions Lda", assunto: "Contrato de Serviços", estado: "Em Curso", prioridade: "Alta", dataEntrada: "2025-01-02" },
  { id: 2, referencia: "PROC-2025/002", cliente: "Maria Silva", assunto: "Avaria Equipamento", estado: "Aberto", prioridade: "Média", dataEntrada: "2025-01-05" },
  { id: 3, referencia: "PROC-2025/003", cliente: "Restaurante O Tacho", assunto: "Renovação Licença", estado: "Concluído", prioridade: "Baixa", dataEntrada: "2024-12-28" },
  { id: 4, referencia: "PROC-2025/004", cliente: "João Santos Arq.", assunto: "Consultoria Fiscal", estado: "Pendente", prioridade: "Alta", dataEntrada: "2025-01-10" },
];

export default function Index() {
  const [processos, setProcessos] = useState<Processo[]>(DADOS_EXEMPLO);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [processoAtual, setProcessoAtual] = useState<Partial<Processo>>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // --- LÓGICA DE CRUD ---
  
  const handleSave = () => {
    // Validação simples
    if (!processoAtual.cliente || !processoAtual.referencia) {
      toast.error("Preenche os campos obrigatórios!");
      return;
    }

    if (processoAtual.id) {
      // Editar existente
      setProcessos(processos.map(p => p.id === processoAtual.id ? { ...p, ...processoAtual } as Processo : p));
      toast.success("Processo atualizado com sucesso!");
    } else {
      // Criar novo
      const novoId = Math.max(...processos.map(p => p.id), 0) + 1;
      const novoProcesso = { 
        ...processoAtual, 
        id: novoId, 
        dataEntrada: new Date().toISOString().split('T')[0],
        estado: processoAtual.estado || "Aberto",
        prioridade: processoAtual.prioridade || "Média"
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
    setProcessoAtual({}); // Limpa o form
    setIsSheetOpen(true);
  };

  // --- FILTROS ---
  const processosFiltrados = processos.filter(p => 
    p.cliente.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    p.referencia.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    p.assunto.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  // --- UI HELPERS ---
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Concluído": return "bg-green-500 hover:bg-green-600";
      case "Em Curso": return "bg-blue-500 hover:bg-blue-600";
      case "Pendente": return "bg-yellow-500 hover:bg-yellow-600";
      default: return "bg-slate-500 hover:bg-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Processos 2025</h1>
            <p className="text-slate-500 mt-1">Gere os teus dados de forma centralizada e segura.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden md:flex">
              <FileText className="mr-2 h-4 w-4" /> Exportar Relatório
            </Button>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button onClick={handleNew} className="bg-slate-900 hover:bg-slate-800">
                  <Plus className="mr-2 h-4 w-4" /> Novo Processo
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>{processoAtual.id ? "Editar Processo" : "Novo Processo"}</SheetTitle>
                  <SheetDescription>
                    Preenche os detalhes do processo abaixo. Clica em salvar quando terminares.
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 py-6">
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
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </SheetClose>
                  <Button onClick={handleSave}>Salvar Alterações</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Pesquisar por referência, cliente ou assunto..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4 text-slate-600" />
          </Button>
        </div>

        {/* Tabela de Dados */}
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
                  <TableRow key={processo.id} className="hover:bg-slate-50/50 transition-colors">
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
                      <Badge className={`${getStatusColor(processo.estado)} border-none text-white`}>
                        {processo.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {processo.prioridade === "Alta" && <AlertCircle className="w-3 h-3 text-red-500" />}
                        <span className={`text-xs ${processo.prioridade === "Alta" ? "text-red-600 font-medium" : "text-slate-600"}`}>
                          {processo.prioridade}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {processo.dataEntrada}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(processo)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(processo.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Apagar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="text-xs text-slate-400 text-center">
          Mostrando {processosFiltrados.length} registos • Dados sincronizados (Modo Simulação)
        </div>

      </div>
    </div>
  );
}