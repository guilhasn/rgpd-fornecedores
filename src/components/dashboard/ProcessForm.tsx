import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Process, ProcessPriority, ProcessStatus, UnidadeOrganica } from "@/types/process";
import { ProcessGdprForm } from "./ProcessGdprForm";
import { useState, useEffect } from "react";
import { CalendarIcon, History, Printer, Save, Send, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProcessPrintView } from "./ProcessPrintView";

interface ProcessFormProps {
  processo: Partial<Process>;
  setProcesso: (processo: Partial<Process>) => void;
  onSave: () => void;
  formatDate: (date: string) => string;
}

export function ProcessForm({ processo, setProcesso, onSave, formatDate }: ProcessFormProps) {
  const [activeTab, setActiveTab] = useState("contrato");
  const [newNote, setNewNote] = useState("");
  const [uos, setUos] = useState<UnidadeOrganica[]>([]);

  useEffect(() => {
    // Load UOs from local storage
    const saved = localStorage.getItem("uos-db");
    if (saved) {
      setUos(JSON.parse(saved));
    } else {
      // Fallback defaults if not yet initialized in Backoffice
       setUos([
        { id: "1", sigla: "DAF", nome: "Departamento Administrativo e Financeiro" },
        { id: "2", sigla: "DOM", nome: "Departamento de Obras Municipais" },
        { id: "3", sigla: "RH", nome: "Recursos Humanos" },
        { id: "4", sigla: "IT", nome: "Tecnologias de Informação" },
      ]);
    }
  }, []);

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const today = new Date().toISOString().split('T')[0];
    const currentHistory = processo.historico || [];
    
    const updatedHistory = [
      { data: today, acao: `Nota: ${newNote}`, user: "Utilizador" },
      ...currentHistory
    ];

    setProcesso({ ...processo, historico: updatedHistory });
    setNewNote("");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Screen View Container */}
      <div className="flex flex-col h-full print:hidden">
        <div className="flex justify-end mb-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Ficha
            </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-1 flex-none">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contrato">Dados Contrato</TabsTrigger>
              <TabsTrigger value="rgpd">Análise RGPD</TabsTrigger>
              <TabsTrigger value="historico">Histórico & Notas</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 mt-4 overflow-y-auto px-1 min-h-0">
            {/* TAB 1: DADOS GERAIS DO CONTRATO */}
            <TabsContent value="contrato" className="space-y-4 focus-visible:ring-0 mt-0">
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
                    value={processo.unidadeOrganica}
                    onValueChange={(val) => setProcesso({ ...processo, unidadeOrganica: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a UO..." />
                    </SelectTrigger>
                    <SelectContent>
                      {uos.map(uo => (
                        <SelectItem key={uo.id} value={uo.sigla}>
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

              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto / Descrição</Label>
                <Textarea
                  id="assunto"
                  value={processo.assunto || ""}
                  onChange={(e) => setProcesso({ ...processo, assunto: e.target.value })}
                  placeholder="Descrição resumida do contrato ou serviço..."
                  className="h-32"
                />
              </div>
            </TabsContent>

            {/* TAB 2: ANÁLISE RGPD */}
            <TabsContent value="rgpd" className="focus-visible:ring-0 mt-0">
               <div className="p-1">
                  <ProcessGdprForm processo={processo} setProcesso={setProcesso} />
               </div>
            </TabsContent>

            {/* TAB 3: HISTÓRICO E NOTAS */}
            <TabsContent value="historico" className="focus-visible:ring-0 h-full flex flex-col gap-4 mt-0">
              <div className="flex gap-2 flex-none">
                <Input 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Adicionar nota de acompanhamento..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && addNote()}
                />
                <Button size="icon" onClick={addNote} variant="secondary">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1 border rounded-md p-4 bg-slate-50">
                {!processo.historico || processo.historico.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                    <History className="h-8 w-8 opacity-20" />
                    <p className="text-sm">Sem registo de histórico.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {processo.historico.map((item, idx) => (
                      <div key={idx} className="flex gap-3 relative group">
                        {/* Timeline Line */}
                        {idx !== processo.historico!.length - 1 && (
                          <div className="absolute left-[15px] top-8 bottom-[-24px] w-px bg-slate-200" />
                        )}
                        
                        <div className="flex-none mt-1">
                          <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                             {item.acao.startsWith("Nota:") ? (
                               <User className="h-4 w-4 text-blue-500" />
                             ) : (
                               <CalendarIcon className="h-4 w-4 text-slate-400" />
                             )}
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-1">
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-500">{formatDate(item.data)}</span>
                           </div>
                           <div className={`text-sm p-3 rounded-lg border ${item.acao.startsWith("Nota:") ? "bg-blue-50 border-blue-100 text-blue-900" : "bg-white border-slate-200 text-slate-700"}`}>
                              {item.acao.startsWith("Nota:") ? item.acao.replace("Nota:", "") : item.acao}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </div>

          <div className="pt-4 mt-auto flex-none border-t border-slate-100 bg-white">
            <Button onClick={onSave} className="w-full bg-slate-900 hover:bg-slate-800">
              <Save className="mr-2 h-4 w-4" /> Guardar Processo
            </Button>
          </div>
        </Tabs>
      </div>

      {/* Print View Container (Only visible when printing) */}
      <ProcessPrintView processo={processo} />
    </>
  );
}