import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, History, Send, User } from "lucide-react";
import { Process } from "@/types/process";

interface ProcessHistoryTabProps {
  processo: Partial<Process>;
  setProcesso: (processo: Partial<Process>) => void;
  formatDate: (date: string) => string;
}

export function ProcessHistoryTab({ processo, setProcesso, formatDate }: ProcessHistoryTabProps) {
  const [newNote, setNewNote] = useState("");

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

  return (
    <div className="h-full flex flex-col gap-4">
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
    </div>
  );
}