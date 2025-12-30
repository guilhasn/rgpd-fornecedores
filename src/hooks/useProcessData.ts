import { useState, useEffect } from "react";
import { Process } from "@/types/process";
import { toast } from "sonner";
import { MOCK_PROCESSES } from "@/data/mock";

export function useProcessData() {
  const [processos, setProcessos] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const fetchProcesses = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/processes?limit=100');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProcessos(data.data);
      setIsOffline(false);
    } catch (error) {
      console.log("Backend indisponível, a usar dados de teste.");
      if (processos.length === 0) {
          setProcessos(MOCK_PROCESSES);
      }
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const addProcess = async (novoProcesso: Partial<Process>) => {
    if (isOffline) {
        // Mock implementation
        const novo: Process = {
            ...novoProcesso,
            id: Math.max(0, ...processos.map(p => p.id)) + 1,
            dataEntrada: new Date().toISOString().split('T')[0],
            estado: novoProcesso.estado || "Aberto",
            prioridade: novoProcesso.prioridade || "Média",
            referencia: novoProcesso.referencia || "N/A",
            cliente: novoProcesso.cliente || "Novo Cliente",
            assunto: novoProcesso.assunto || "",
            historico: novoProcesso.historico || [{ data: new Date().toISOString().split('T')[0], acao: "Criado (Modo Offline)" }]
        } as Process;
        
        setProcessos(prev => [novo, ...prev]);
        toast.success("Processo criado (Modo Preview)!");
        return;
    }

    try {
      const res = await fetch('/api/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProcesso)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(JSON.stringify(err));
      }

      const savedProcess = await res.json();
      setProcessos(prev => [savedProcess, ...prev]);
      toast.success("Processo criado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao guardar processo.");
    }
  };

  const updateProcess = async (processoAtualizado: Partial<Process>) => {
    if (!processoAtualizado.id) return;
    
    if (isOffline) {
         setProcessos(prev => prev.map(p => p.id === processoAtualizado.id ? { ...p, ...processoAtualizado } as Process : p));
         toast.success("Processo atualizado (Modo Preview)!");
         return;
    }

    try {
      const res = await fetch(`/api/processes/${processoAtualizado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processoAtualizado)
      });

      if (!res.ok) throw new Error('Update failed');
      
      const updated = await res.json();
      setProcessos(prev => prev.map(p => p.id === updated.id ? updated : p));
      toast.success("Processo atualizado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar processo.");
    }
  };

  const deleteProcess = async (id: number) => {
    if (isOffline) {
        setProcessos(prev => prev.filter(p => p.id !== id));
        toast.success("Processo removido (Modo Preview).");
        return;
    }

    try {
      const res = await fetch(`/api/processes/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Delete failed');

      setProcessos(prev => prev.filter(p => p.id !== id));
      toast.success("Processo removido.");
    } catch (error) {
      toast.error("Erro ao remover processo.");
    }
  };

  const importProcesses = async (novosProcessos: Process[]) => {
    if (isOffline) {
        setProcessos(prev => [...novosProcessos, ...prev]);
        toast.success(`${novosProcessos.length} importados (Modo Preview)`);
        return;
    }

    try {
        let count = 0;
        for (const p of novosProcessos) {
            const { id, ...rest } = p; 
            await fetch('/api/processes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(rest)
            });
            count++;
        }
        await fetchProcesses();
        toast.success(`${count} processos importados!`);
    } catch (e) {
        toast.error("Erro na importação.");
    }
  };

  return {
    processos,
    addProcess,
    updateProcess,
    deleteProcess,
    importProcesses,
    isLoading
  };
}