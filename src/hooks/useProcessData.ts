import { useState, useEffect } from "react";
import { Process } from "@/types/process";
import { toast } from "sonner";

const DADOS_EXEMPLO: Process[] = [
  { 
    id: 1, 
    referencia: "PROC-2025/001", 
    cliente: "Tech Solutions Lda", 
    assunto: "Contrato de Serviços de TI", 
    estado: "Em Curso", 
    prioridade: "Alta", 
    dataEntrada: "2025-01-02",
    historico: [
      { data: "2025-01-02", acao: "Processo criado" },
      { data: "2025-01-05", acao: "Nota: Reunião de kickoff agendada para dia 10." },
    ],
    rgpd: {
      nivelRisco: "Médio",
      temAcessoDados: "Sim",
      dataFimContrato: "2025-12-31",
      tipoDadosPessoais: "Nome Completo, Email (Pessoal/Profissional)",
      finalidadeTratamento: "Gestão de acessos",
      nif: "501234567"
    },
    unidadeOrganica: "IT"
  },
  {
    id: 2,
    referencia: "PROC-2025/002",
    cliente: "Limpezas & Cia",
    assunto: "Serviços de Limpeza",
    estado: "Aberto",
    prioridade: "Média",
    dataEntrada: "2025-02-15",
    historico: [
       { data: "2025-02-15", acao: "Processo criado" }
    ],
    rgpd: {
        nivelRisco: "Baixo",
        temAcessoDados: "Não",
        nif: "509876543"
    },
    unidadeOrganica: "DAF"
  }
];

export function useProcessData() {
  const [processos, setProcessos] = useState<Process[]>(() => {
    const saved = localStorage.getItem("processos-db");
    return saved ? JSON.parse(saved) : DADOS_EXEMPLO;
  });

  useEffect(() => {
    localStorage.setItem("processos-db", JSON.stringify(processos));
  }, [processos]);

  const getToday = () => new Date().toISOString().split('T')[0];

  const addProcess = (processo: Partial<Process>) => {
    const novoId = Math.max(...processos.map(p => p.id), 0) + 1;
    const novoProcesso = { 
      ...processo, 
      id: novoId, 
      dataEntrada: getToday(),
      estado: processo.estado || "Aberto",
      prioridade: processo.prioridade || "Média",
      historico: [{ data: getToday(), acao: "Processo Criado" }]
    } as Process;
    setProcessos([...processos, novoProcesso]);
    toast.success("Novo processo criado!");
  };

  const updateProcess = (processoAtual: Partial<Process>) => {
    if (!processoAtual.id) return;
    
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
  };

  const deleteProcess = (id: number) => {
    setProcessos(processos.filter(p => p.id !== id));
    toast.success("Processo removido com sucesso.");
  };

  const importProcesses = (novosProcessos: Process[]) => {
    setProcessos(prev => [...prev, ...novosProcessos]);
    toast.success(`${novosProcessos.length} processos importados com sucesso!`);
  };

  return {
    processos,
    addProcess,
    updateProcess,
    deleteProcess,
    importProcesses
  };
}