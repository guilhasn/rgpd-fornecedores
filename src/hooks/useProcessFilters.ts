import { useState, useMemo } from "react";
import { Process } from "@/types/process";

export function useProcessFilters(processos: Process[]) {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroRisco, setFiltroRisco] = useState<string[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string[]>([]);

  const toggleRiskFilter = (risk: string) => {
    setFiltroRisco(prev => 
      prev.includes(risk) 
        ? prev.filter(r => r !== risk)
        : [...prev, risk]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setFiltroEstado(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setFiltroRisco([]);
    setFiltroEstado([]);
    setTermoPesquisa("");
  };

  const processosFiltrados = useMemo(() => {
    return processos.filter(p => {
      const matchesSearch = 
        p.cliente.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        p.referencia.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        p.assunto.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        (p.rgpd?.nif || "").includes(termoPesquisa);

      const matchesRisk = 
        filtroRisco.length === 0 || 
        (p.rgpd?.nivelRisco && filtroRisco.includes(p.rgpd.nivelRisco));

      const matchesStatus = 
        filtroEstado.length === 0 ||
        filtroEstado.includes(p.estado);

      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [processos, termoPesquisa, filtroRisco, filtroEstado]);

  const activeFiltersCount = filtroRisco.length + filtroEstado.length;

  return {
    termoPesquisa,
    setTermoPesquisa,
    filtroRisco,
    toggleRiskFilter,
    filtroEstado,
    toggleStatusFilter,
    clearFilters,
    processosFiltrados,
    activeFiltersCount
  };
}