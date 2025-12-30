import { useState, useEffect } from "react";
import { Process } from "@/types/process";
import { toast } from "sonner";

export function useProcessData() {
  const [processos, setProcessos] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProcesses = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/processes?limit=100');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      // The API returns { data: [...], meta: {...} }
      setProcessos(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados do servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const addProcess = async (novoProcesso: Partial<Process>) => {
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
    // For import, we loop and create (simple approach for now)
    // Ideally this should be a bulk insert API endpoint
    try {
        let count = 0;
        for (const p of novosProcessos) {
            // Remove ID to create new
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