export type ProcessStatus = "Aberto" | "Em Curso" | "Pendente" | "Concluído";
export type ProcessPriority = "Baixa" | "Média" | "Alta";

export interface ProcessHistory {
  data: string;
  acao: string;
}

export interface Process {
  id: number;
  referencia: string;
  cliente: string;
  assunto: string;
  estado: ProcessStatus;
  prioridade: ProcessPriority;
  dataEntrada: string;
  historico?: ProcessHistory[];
}