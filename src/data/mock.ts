import { Process, UnidadeOrganica } from "@/types/process";

export const MOCK_UOS: UnidadeOrganica[] = [
  { id: "1", sigla: "DAF", nome: "Departamento Administrativo e Financeiro" },
  { id: "2", sigla: "DOM", nome: "Departamento de Obras Municipais" },
  { id: "3", sigla: "RH", nome: "Recursos Humanos" },
  { id: "4", sigla: "IT", nome: "Tecnologias de Informação" },
];

export const MOCK_PROCESSES: Process[] = [
  {
    id: 1,
    referencia: "PROC-2024/001",
    cliente: "Limpezas & Brilho Lda",
    assunto: "Serviços de limpeza das instalações municipais",
    estado: "Em Curso",
    prioridade: "Alta",
    dataEntrada: "2024-01-01",
    unidadeOrganica: "DAF",
    rgpd: {
      nif: "501234567",
      dataInicioContrato: "2024-01-01",
      dataFimContrato: "2024-12-31",
      temAcessoDados: "Sim",
      tipoDadosPessoais: "Nomes, Horários dos funcionários",
      nivelRisco: "Baixo",
      medidasSeguranca: "Contrato de confidencialidade assinado",
      finalidadeTratamento: "Gestão de acessos e limpeza",
      subcontratacao: "Não",
      transferenciaInternacional: "Não"
    },
    historico: [
      { data: "2024-01-01", acao: "Processo criado", user: "Admin" },
      { data: "2024-01-15", acao: "Validado pelo DPO", user: "DPO" }
    ]
  },
  {
    id: 2,
    referencia: "PROC-2024/002",
    cliente: "Segurança Total SA",
    assunto: "Vigilância e Portaria",
    estado: "Pendente",
    prioridade: "Média",
    dataEntrada: "2024-02-01",
    unidadeOrganica: "RH",
    rgpd: {
      nif: "502999888",
      dataInicioContrato: "2024-02-01",
      temAcessoDados: "Sim",
      tipoDadosPessoais: "Imagens CCTV, Registos de entrada",
      nivelRisco: "Alto",
      medidasSeguranca: "",
      finalidadeTratamento: "Segurança de instalações",
      subcontratacao: "Sim"
    },
    historico: [
      { data: "2024-02-01", acao: "Processo iniciado", user: "RH" }
    ]
  },
  {
    id: 3,
    referencia: "PROC-2024/003",
    cliente: "TechSolutions Lda",
    assunto: "Manutenção de Servidores",
    estado: "Aberto",
    prioridade: "Baixa",
    dataEntrada: "2024-03-10",
    unidadeOrganica: "IT",
    rgpd: {
      nif: "505555111",
      nivelRisco: "Médio",
      temAcessoDados: "Sim",
      tipoDadosPessoais: "Logs de sistema, IPs",
    },
    historico: []
  }
];