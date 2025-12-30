export type ProcessStatus = "Aberto" | "Em Curso" | "Pendente" | "Concluído" | "Cancelado";
export type ProcessPriority = "Baixa" | "Média" | "Alta" | "Urgente";

export interface ProcessHistory {
  data: string;
  acao: string;
  user?: string;
}

export interface UnidadeOrganica {
  id: string;
  sigla: string;
  nome: string;
}

export interface SupplierData {
  nif?: string;
  dataInicioContrato?: string;
  dataFimContrato?: string;
  tipoServico?: string;
  temAcessoDados?: "Sim" | "Não" | "N/A";
  tipoDadosPessoais?: string; // ex: Nome, Morada, NIF
  finalidadeTratamento?: string;
  transferenciaInternacional?: "Sim" | "Não";
  paisTransferencia?: string;
  subcontratacao?: "Sim" | "Não";
  medidasSeguranca?: string; // Certificações
  nivelRisco?: string; // Avaliação de Risco
  monitorizacao?: string; // Periodicidade
  responsavelContrato?: string;
  emailResponsavel?: string;
}

export interface Process {
  id: number;
  referencia: string;
  cliente: string; // Nome do Fornecedor
  assunto: string; // Tipo de serviço/produto
  estado: ProcessStatus;
  prioridade: ProcessPriority;
  dataEntrada: string;
  unidadeOrganica?: string;
  historico?: ProcessHistory[];
  rgpd?: SupplierData; // New container for GDPR fields
}