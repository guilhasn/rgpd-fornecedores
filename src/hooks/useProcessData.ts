import { useState, useEffect } from "react";
import { Process } from "@/types/process";
import { toast } from "sonner";
import { processRepository } from "@/services/processRepository";

export function useProcessData() {
  const [processos, setProcessos] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProcesses = async () => {
    try {
      setIsLoading(true);
      const data = await processRepository.getAllProcesses();
      setProcessos(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const addProcess = async (novoProcesso: Partial<Process>) => {
    try {
      const saved = await processRepository.createProcess(novoProcesso);
      // Optimistic update or refetch
      setProcessos(prev => [saved, ...prev]);
      toast.success("Processo criado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao guardar processo.");
    }
  };

  const updateProcess = async (processoAtualizado: Partial<Process>) => {
    if (!processoAtualizado.id) return;

    try {
      const updated = await processRepository.updateProcess(processoAtualizado.id, processoAtualizado);
      setProcessos(prev => prev.map(p => p.id === updated.id ? updated : p));
      toast.success("Processo atualizado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar processo.");
    }
  };

  const deleteProcess = async (id: number) => {
    try {
      await processRepository.deleteProcess(id);
      setProcessos(prev => prev.filter(p => p.id !== id));
      toast.success("Processo removido.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover processo.");
    }
  };

  const importProcesses = async (novosProcessos: Process[]) => {
    try {
        let count = 0;
        for (const p of novosProcessos) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...rest } = p; 
            await processRepository.createProcess(rest);
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